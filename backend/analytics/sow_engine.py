import pandas as pd
import numpy as np

def compute_sow_metrics(active_tx: pd.DataFrame, cust_df: pd.DataFrame) -> dict:
    """
    Computes all Share of Wallet aggregations, distributions, monthly trends,
    fiscal year comparisons, and category/Prime breakdowns according to strict business rules.
    """
    # 1. Total Net Sales and HSIC Net Sales
    total_net = float(active_tx['Net_Amount'].sum())
    hsic_net = float(active_tx[active_tx['Payment_Code'] == 3]['Net_Amount'].sum())
    overall_sow = hsic_net / total_net if total_net > 0 else 0.0
    
    # 2. Fiscal Year Comparison
    fy_groups = active_tx.groupby('Fiscal_Year')
    fy_summary = []
    for fy, grp in fy_groups:
        tot = float(grp['Net_Amount'].sum())
        hs = float(grp[grp['Payment_Code'] == 3]['Net_Amount'].sum())
        sow = hs / tot if tot > 0 else 0.0
        sales_amt = float(grp[grp['Transaction_Type'] == 'Sale']['Transaction_Amount'].sum())
        ret_amt = float(grp[grp['Transaction_Type'] == 'Return']['Transaction_Amount'].sum())
        tx_cnt = int(grp['Tx_Count'].sum())
        active_cust_cnt = int(grp['Customer_ID'].nunique())
        hsic_cust_cnt = int(grp[grp['Payment_Code'] == 3]['Customer_ID'].nunique())
        
        fy_summary.append({
            "fiscal_year": fy,
            "total_net_spend": round(tot, 2),
            "hsic_net_spend": round(hs, 2),
            "sow_pct": round(sow * 100, 2),
            "sales_amount": round(sales_amt, 2),
            "returns_amount": round(ret_amt, 2),
            "return_rate_pct": round((ret_amt / sales_amt * 100) if sales_amt > 0 else 0, 2),
            "total_transactions": tx_cnt,
            "active_customers": active_cust_cnt,
            "hsic_active_customers": hsic_cust_cnt,
            "hsic_penetration_pct": round(hsic_cust_cnt / active_cust_cnt * 100, 2) if active_cust_cnt > 0 else 0
        })
    
    # 3. Monthly Trend
    active_tx_copy = active_tx.copy()
    if 'Transaction_Date' in active_tx_copy.columns and len(active_tx_copy) > 0:
        active_tx_copy['Transaction_Date'] = pd.to_datetime(active_tx_copy['Transaction_Date'])
        active_tx_copy['YearMonth_Str'] = active_tx_copy['Transaction_Date'].dt.strftime('%Y-%m')
    else:
        active_tx_copy['YearMonth_Str'] = pd.Series(dtype=str)
    
    monthly_data = []
    prev_sow = None
    for ym, grp in active_tx_copy.groupby('YearMonth_Str'):
        tot = float(grp['Net_Amount'].sum())
        hs = float(grp[grp['Payment_Code'] == 3]['Net_Amount'].sum())
        sow = hs / tot if tot > 0 else 0.0
        
        # Payment breakdown
        wal = float(grp[grp['Payment_Code'] == 5]['Net_Amount'].sum())
        upi = float(grp[grp['Payment_Code'] == 4]['Net_Amount'].sum())
        occ = float(grp[grp['Payment_Code'] == 2]['Net_Amount'].sum())
        deb = float(grp[grp['Payment_Code'] == 1]['Net_Amount'].sum())
        
        velocity = (sow - prev_sow) if prev_sow is not None else 0.0
        prev_sow = sow
        
        # Dynamic Fiscal Year definition based on calendar year & August start
        try:
            y, m = int(ym[:4]), int(ym[5:7])
            fy_label = f"FY{str(y + 1 if m >= 8 else y)[-2:]}"
        except Exception:
            fy_label = "FY25" if ym < "2025-08" else "FY26"

        monthly_data.append({
            "year_month": ym,
            "fiscal_year": fy_label,
            "total_net_spend": round(tot, 2),
            "hsic_net_spend": round(hs, 2),
            "sow_pct": round(sow * 100, 2),
            "sow_velocity_pp": round(velocity * 100, 2),
            "wallet_spend": round(wal, 2),
            "wallet_net_spend": round(wal, 2),
            "upi_spend": round(upi, 2),
            "upi_net_spend": round(upi, 2),
            "othercc_spend": round(occ, 2),
            "other_cc_net_spend": round(occ, 2),
            "debit_spend": round(deb, 2),
            "debit_net_spend": round(deb, 2),
            "wallet_share_pct": round((wal / tot * 100) if tot > 0 else 0, 2),
            "upi_share_pct": round((upi / tot * 100) if tot > 0 else 0, 2),
            "othercc_share_pct": round((occ / tot * 100) if tot > 0 else 0, 2),
            "other_cc_share_pct": round((occ / tot * 100) if tot > 0 else 0, 2),
            "debit_share_pct": round((deb / tot * 100) if tot > 0 else 0, 2),
            "active_customers": int(grp['Customer_ID'].nunique()),
            "hsic_active_customers": int(grp[grp['Payment_Code'] == 3]['Customer_ID'].nunique())
        })
    
    # 4. Quarterly Trend
    quarterly_data = []
    if len(active_tx_copy) > 0 and 'Transaction_Date' in active_tx_copy.columns:
        dt_series = pd.to_datetime(active_tx_copy['Transaction_Date'], errors='coerce')
        if not dt_series.isna().all():
            active_tx_copy['Quarter'] = dt_series.dt.to_period('Q').astype(str)
            for qtr, grp in active_tx_copy.groupby('Quarter'):
                if qtr != 'NaT':
                    tot = float(grp['Net_Amount'].sum())
                    hs = float(grp[grp['Payment_Code'] == 3]['Net_Amount'].sum())
                    quarterly_data.append({
                        "quarter": str(qtr),
                        "total_net_spend": round(tot, 2),
                        "hsic_net_spend": round(hs, 2),
                        "sow_pct": round((hs / tot * 100) if tot > 0 else 0, 2)
                    })
    
    # 5. Prime vs Non-Prime Breakdown
    prime_summary = []
    for p_type, grp in active_tx.groupby('Membership_Type'):
        tot = float(grp['Net_Amount'].sum())
        hs = float(grp[grp['Payment_Code'] == 3]['Net_Amount'].sum())
        
        # Breakdown by FY
        fy25_g = grp[grp['Fiscal_Year'] == 'FY25']
        fy26_g = grp[grp['Fiscal_Year'] == 'FY26']
        
        fy25_tot = float(fy25_g['Net_Amount'].sum())
        fy25_hs = float(fy25_g[fy25_g['Payment_Code'] == 3]['Net_Amount'].sum())
        
        fy26_tot = float(fy26_g['Net_Amount'].sum())
        fy26_hs = float(fy26_g[fy26_g['Payment_Code'] == 3]['Net_Amount'].sum())
        
        prime_summary.append({
            "membership_type": p_type,
            "total_net_spend": round(tot, 2),
            "hsic_net_spend": round(hs, 2),
            "sow_pct": round((hs / tot * 100) if tot > 0 else 0, 2),
            "fy25_sow_pct": round((fy25_hs / fy25_tot * 100) if fy25_tot > 0 else 0, 2),
            "fy26_sow_pct": round((fy26_hs / fy26_tot * 100) if fy26_tot > 0 else 0, 2),
            "sow_change_pp": round(((fy26_hs / fy26_tot) - (fy25_hs / fy25_tot)) * 100, 2) if (fy25_tot > 0 and fy26_tot > 0) else 0.0,
            "active_customers": int(grp['Customer_ID'].nunique())
        })
    
    # 6. Category Breakdown
    cat_summary = []
    for cat_name, grp in active_tx.groupby('Category'):
        tot = float(grp['Net_Amount'].sum())
        hs = float(grp[grp['Payment_Code'] == 3]['Net_Amount'].sum())
        wal = float(grp[grp['Payment_Code'] == 5]['Net_Amount'].sum())
        upi = float(grp[grp['Payment_Code'] == 4]['Net_Amount'].sum())
        occ = float(grp[grp['Payment_Code'] == 2]['Net_Amount'].sum())
        deb = float(grp[grp['Payment_Code'] == 1]['Net_Amount'].sum())
        
        fy25_g = grp[grp['Fiscal_Year'] == 'FY25']
        fy26_g = grp[grp['Fiscal_Year'] == 'FY26']
        fy25_sow = float(fy25_g[fy25_g['Payment_Code'] == 3]['Net_Amount'].sum()) / float(fy25_g['Net_Amount'].sum()) if len(fy25_g) > 0 else 0.0
        fy26_sow = float(fy26_g[fy26_g['Payment_Code'] == 3]['Net_Amount'].sum()) / float(fy26_g['Net_Amount'].sum()) if len(fy26_g) > 0 else 0.0
        
        cat_summary.append({
            "category": cat_name,
            "total_net_spend": round(tot, 2),
            "hsic_net_spend": round(hs, 2),
            "sow_pct": round((hs / tot * 100) if tot > 0 else 0, 2),
            "fy25_sow_pct": round(fy25_sow * 100, 2),
            "fy26_sow_pct": round(fy26_sow * 100, 2),
            "sow_change_pp": round((fy26_sow - fy25_sow) * 100, 2),
            "wallet_share_pct": round((wal / tot * 100) if tot > 0 else 0, 2),
            "upi_share_pct": round((upi / tot * 100) if tot > 0 else 0, 2),
            "other_cc_share_pct": round((occ / tot * 100) if tot > 0 else 0, 2),
            "debit_share_pct": round((deb / tot * 100) if tot > 0 else 0, 2),
            "avg_sales_ticket": round(float(grp[grp['Transaction_Type'] == 'Sale']['Transaction_Amount'].mean()), 2)
        })
    
    cat_summary = sorted(cat_summary, key=lambda x: x['total_net_spend'], reverse=True)
    
    # 7. Customer SoW Distribution Bins
    cust_tot = active_tx.groupby('Customer_ID')['Net_Amount'].sum()
    cust_hs = active_tx[active_tx['Payment_Code'] == 3].groupby('Customer_ID')['Net_Amount'].sum()
    c_sow_df = pd.DataFrame({'total': cust_tot, 'hsic': cust_hs}).fillna(0)
    c_sow_df['sow'] = np.where(c_sow_df['total'] > 0, (c_sow_df['hsic'] / c_sow_df['total']).clip(0, 1), 0)
    
    bins = [-0.01, 0.0, 0.1, 0.25, 0.5, 0.75, 1.0]
    labels = ["0% (Zero HSIC Usage)", "1% - 10%", "10% - 25%", "25% - 50%", "50% - 75%", "75% - 100% (Loyal Advocates)"]
    c_sow_df['bin'] = pd.cut(c_sow_df['sow'], bins=bins, labels=labels)
    
    dist_counts = c_sow_df['bin'].value_counts().reindex(labels).fillna(0).to_dict()
    sow_distribution = [
        {"bin": k, "customer_count": int(v), "pct_of_active": round((int(v) / len(c_sow_df) * 100) if len(c_sow_df) > 0 else 0.0, 2)}
        for k, v in dist_counts.items()
    ]
    
    fy25_sow = fy_summary[0]['sow_pct'] if len(fy_summary) > 0 else 0.0
    fy26_sow = fy_summary[1]['sow_pct'] if len(fy_summary) > 1 else 0.0
    sow_collapse = round(fy26_sow - fy25_sow, 2)
    rel_collapse = round(((fy26_sow - fy25_sow) / fy25_sow) * 100, 2) if fy25_sow > 0 else 0.0

    return {
        "overall": {
            "total_net_spend": round(total_net, 2),
            "hsic_net_spend": round(hsic_net, 2),
            "overall_sow_pct": round(overall_sow * 100, 2),
            "fy25_sow_pct": fy25_sow,
            "fy26_sow_pct": fy26_sow,
            "sow_collapse_pp": sow_collapse,
            "relative_collapse_pct": rel_collapse
        },
        "fiscal_years": fy_summary,
        "monthly_trend": monthly_data,
        "quarterly_trend": quarterly_data,
        "prime_breakdown": prime_summary,
        "category_breakdown": cat_summary,
        "distribution": sow_distribution
    }
