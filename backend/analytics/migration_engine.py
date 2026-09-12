import pandas as pd
import numpy as np

def compute_migration_metrics(active_tx: pd.DataFrame, cust_df: pd.DataFrame) -> dict:
    """
    Computes payment migration matrix, Sankey flow data, defector dynamics, and leakage destinations.
    """
    # 1. Total Payment Mix across 2 years
    total_net = float(active_tx['Net_Amount'].sum())
    pay_summary = []
    for pay_name, grp in active_tx.groupby('Payment_Method'):
        tot = float(grp['Net_Amount'].sum())
        tx_cnt = int(grp['Tx_Count'].sum()) if 'Tx_Count' in grp.columns else len(grp)
        pay_summary.append({
            "payment_method": pay_name,
            "net_spend": round(tot, 2),
            "share_pct": round((tot / total_net * 100) if total_net > 0 else 0, 2),
            "net_share_pct": round((tot / total_net * 100) if total_net > 0 else 0, 2),
            "transaction_count": tx_cnt,
            "avg_ticket": round(float(grp[grp['Transaction_Type'] == 'Sale']['Transaction_Amount'].mean()), 2) if len(grp[grp['Transaction_Type'] == 'Sale']) > 0 else 0.0
        })
    pay_summary = sorted(pay_summary, key=lambda x: x['net_spend'], reverse=True)
    
    # 2. FY25 vs FY26 Customer Migration Flows
    c25_tot = active_tx[active_tx['Fiscal_Year'] == 'FY25'].groupby('Customer_ID')['Net_Amount'].sum()
    c26_tot = active_tx[active_tx['Fiscal_Year'] == 'FY26'].groupby('Customer_ID')['Net_Amount'].sum()
    
    flow_df = pd.DataFrame({
        'FY25_Total': c25_tot,
        'FY26_Total': c26_tot,
        'FY25_HSIC': active_tx[(active_tx['Fiscal_Year']=='FY25') & (active_tx['Payment_Code']==3)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY26_HSIC': active_tx[(active_tx['Fiscal_Year']=='FY26') & (active_tx['Payment_Code']==3)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY25_Wallet': active_tx[(active_tx['Fiscal_Year']=='FY25') & (active_tx['Payment_Code']==5)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY26_Wallet': active_tx[(active_tx['Fiscal_Year']=='FY26') & (active_tx['Payment_Code']==5)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY25_UPI': active_tx[(active_tx['Fiscal_Year']=='FY25') & (active_tx['Payment_Code']==4)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY26_UPI': active_tx[(active_tx['Fiscal_Year']=='FY26') & (active_tx['Payment_Code']==4)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY25_OtherCC': active_tx[(active_tx['Fiscal_Year']=='FY25') & (active_tx['Payment_Code']==2)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY26_OtherCC': active_tx[(active_tx['Fiscal_Year']=='FY26') & (active_tx['Payment_Code']==2)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY25_Debit': active_tx[(active_tx['Fiscal_Year']=='FY25') & (active_tx['Payment_Code']==1)].groupby('Customer_ID')['Net_Amount'].sum(),
        'FY26_Debit': active_tx[(active_tx['Fiscal_Year']=='FY26') & (active_tx['Payment_Code']==1)].groupby('Customer_ID')['Net_Amount'].sum(),
    }).fillna(0)
    
    both = flow_df[(flow_df['FY25_Total'] > 0) & (flow_df['FY26_Total'] > 0)].copy()
    both['Delta_HSIC'] = both['FY26_HSIC'] - both['FY25_HSIC']
    both['Delta_Wallet'] = both['FY26_Wallet'] - both['FY25_Wallet']
    both['Delta_UPI'] = both['FY26_UPI'] - both['FY25_UPI']
    both['Delta_OtherCC'] = both['FY26_OtherCC'] - both['FY25_OtherCC']
    both['Delta_Debit'] = both['FY26_Debit'] - both['FY25_Debit']
    
    # Defectors: HSIC spend dropped by > Rs. 1000
    defectors = both[both['Delta_HSIC'] < -1000].copy()
    total_lost_hsic = float(-defectors['Delta_HSIC'].sum()) if len(defectors) > 0 else 0.0
    wallet_gain = float(defectors['Delta_Wallet'].sum()) if len(defectors) > 0 else 0.0
    upi_gain = float(defectors['Delta_UPI'].sum()) if len(defectors) > 0 else 0.0
    othercc_gain = float(defectors['Delta_OtherCC'].sum()) if len(defectors) > 0 else 0.0
    debit_gain = float(defectors['Delta_Debit'].sum()) if len(defectors) > 0 else 0.0
    
    tot_captured = wallet_gain + upi_gain + othercc_gain + debit_gain
    denom = tot_captured if tot_captured > 0 else 1.0
    migration_destinations = [
        {"destination": "Cash/UPI", "gained_spend": round(upi_gain, 2), "pct_of_captured": round((upi_gain / denom * 100) if tot_captured > 0 else 0.0, 2)},
        {"destination": "MetroMart Wallet", "gained_spend": round(wallet_gain, 2), "pct_of_captured": round((wallet_gain / denom * 100) if tot_captured > 0 else 0.0, 2)},
        {"destination": "Other Bank Credit Cards", "gained_spend": round(othercc_gain, 2), "pct_of_captured": round((othercc_gain / denom * 100) if tot_captured > 0 else 0.0, 2)},
        {"destination": "Debit Cards", "gained_spend": round(debit_gain, 2), "pct_of_captured": round((debit_gain / denom * 100) if tot_captured > 0 else 0.0, 2)}
    ]
    migration_destinations = sorted(migration_destinations, key=lambda x: x['gained_spend'], reverse=True)
    
    # Sankey Flow Structure
    sankey_nodes = [
        {"id": 0, "name": "HSIC Historical Base (FY25)"},
        {"id": 1, "name": "HSIC Retained (FY26)"},
        {"id": 2, "name": "Cash/UPI Migration"},
        {"id": 3, "name": "MetroMart Wallet Migration"},
        {"id": 4, "name": "Other Bank CC Migration"},
        {"id": 5, "name": "Debit Card Migration"},
        {"id": 6, "name": "Uncaptured / Contraction"}
    ]
    
    retained_hsic = float(defectors['FY26_HSIC'].sum())
    uncaptured = max(0.0, total_lost_hsic - (wallet_gain + upi_gain + othercc_gain + debit_gain))
    
    sankey_links = [
        {"source": 0, "target": 1, "value": round(retained_hsic, 2), "label": "Retained on HSIC"},
        {"source": 0, "target": 2, "value": round(max(0, upi_gain), 2), "label": "Migrated to UPI/Cash"},
        {"source": 0, "target": 3, "value": round(max(0, wallet_gain), 2), "label": "Migrated to MetroMart Wallet"},
        {"source": 0, "target": 4, "value": round(max(0, othercc_gain), 2), "label": "Migrated to Other Credit Cards"},
        {"source": 0, "target": 5, "value": round(max(0, debit_gain), 2), "label": "Migrated to Debit"},
        {"source": 0, "target": 6, "value": round(uncaptured, 2), "label": "Spend Contraction / Churn"}
    ]
    
    sankey_obj = {
        "nodes": sankey_nodes,
        "links": sankey_links
    }
    
    return {
        "payment_mix": pay_summary,
        "payment_methods": pay_summary,
        "defectors_analysis": {
            "total_defector_customers": len(defectors),
            "total_lost_hsic_spend": round(total_lost_hsic, 2),
            "destinations": migration_destinations,
            "avg_lost_spend_per_defector": round(total_lost_hsic / len(defectors), 2) if len(defectors) > 0 else 0
        },
        "sankey": sankey_obj,
        "sankey_data": sankey_obj
    }
