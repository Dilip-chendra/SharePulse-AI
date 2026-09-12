import pandas as pd
import numpy as np

def compute_opportunity_and_nba(segmented_df: pd.DataFrame) -> dict:
    """
    Computes Recoverability Proxy (Behavioral Feasibility Index), Revenue at Risk,
    Recoverable Opportunity, Next Best Action (NBA) per customer, and Campaign Economics.
    
    IMPORTANT METHODOLOGY NOTE:
    In the absence of randomized controlled trial (RCT) treatment/control uplift logs,
    the 'Recoverability Proxy' measures behavioral elasticity and propensity based on
    overall shopping recency, Prime membership, category affinity, and past card loyalty.
    """
    df = segmented_df.copy()
    
    # 1. Recoverability Proxy (Behavioral Feasibility Index) (0.05 to 0.95)
    overall_rec = df.get('Overall_Recency_Days', pd.Series(60, index=df.index)).fillna(60)
    fy25_sow = df.get('FY25_SoW', df.get('SoW', pd.Series(0.2, index=df.index))).fillna(0.2)
    fy25_hsic = df.get('FY25_HSIC', df.get('HSIC_Spend', pd.Series(0.0, index=df.index))).fillna(0.0)
    fy26_hsic = df.get('FY26_HSIC', df.get('HSIC_Spend', pd.Series(0.0, index=df.index))).fillna(0.0)
    is_prime = df.get('Is_Prime', pd.Series(0, index=df.index)).fillna(0)
    total_spend = df.get('Total_Spend', pd.Series(0.0, index=df.index)).fillna(0.0)
    hsic_spend = df.get('HSIC_Spend', pd.Series(0.0, index=df.index)).fillna(0.0)
    risk_score = df.get('Predicted_Risk_Score', pd.Series(0.5, index=df.index)).fillna(0.5)

    recency_factor = np.clip(1.0 - (overall_rec / 365.0), 0.1, 1.0)
    prime_factor = np.where(is_prime == 1, 1.2, 0.9)
    past_hsic_factor = np.where(fy25_sow > 0.15, 1.25, 0.85)
    spend_factor = np.clip(total_spend / 30000.0, 0.5, 1.5)
    
    raw_recov = 0.5 * recency_factor * prime_factor * past_hsic_factor * spend_factor
    df['Recoverability_Score'] = np.round(np.clip(raw_recov / 2.0, 0.05, 0.95), 3)
    
    # 2. Revenue at Risk: Expected Lost HSIC Spend (Model-Derived)
    df['Revenue_at_Risk'] = np.round(risk_score * np.maximum(fy25_hsic - fy26_hsic, hsic_spend * 0.5), 2)
    df['Revenue_at_Risk'] = np.maximum(df['Revenue_at_Risk'], 0.0)
    
    # 3. Recoverable Opportunity: Potential Incremental HSIC Spend (Feasibility Scaled)
    non_hsic_spend = np.maximum(0.0, total_spend - hsic_spend)
    assumed_capture_rate = 0.35  # Hypothesis: 35% capture rate of addressable spend under targeted intervention
    df['Recoverable_Opportunity'] = np.round(non_hsic_spend * df['Recoverability_Score'] * assumed_capture_rate, 2)
    
    # 4. Master Customer Opportunity Score = Risk * (Spend / 1000) * Recoverability Proxy
    df['Master_Opportunity_Score'] = np.round(
        risk_score * (total_spend / 1000.0) * df['Recoverability_Score'], 2
    )
    
    # 5. Next Best Action (NBA) Decision Engine (Proposed Interventions)
    actions = []
    intervention_costs = []
    expected_contributions = []
    
    for idx, row in df.iterrows():
        action_name = ""
        cost = 0.0
        margin = 0.035  # 3.5% interchange & card margin on recovered spend
        
        is_closed_val = row.get('Is_Closed', 0)
        state_val = row.get('Customer_State', '')
        is_prime_val = row.get('Is_Prime', 0)
        groc_spend_val = row.get('Grocery_Spend', 0)
        elec_spend_val = row.get('Electronics_Spend', 0)
        sow_val = row.get('SoW', 0)
        ht_spend_val = row.get('High_Ticket_Spend', 0)
        wal_share_val = row.get('Wallet_Share', 0)
        seg_name_val = row.get('Segment_Name', '')

        if is_closed_val == 1:
            action_name = "Account Win-Back / Card Reopening Offer"
            cost = 300.0
        elif state_val == 'Dormant':
            action_name = "Reactivation Statement Credit (₹250 on ₹1,000 Spend)"
            cost = 250.0
        elif is_prime_val == 1 and (groc_spend_val > 5000 or elec_spend_val > 10000) and sow_val < 0.25:
            action_name = "Prime 5% Grocery & 3% Electronics Benefit Activation Campaign"
            cost = 200.0
        elif ht_spend_val > 15000 and wal_share_val > 0.35:
            action_name = "Big-Ticket 5% Instant Statement Credit & 0% EMI Proposition"
            cost = 450.0
        elif seg_name_val == "Competing Credit Card Migrators":
            action_name = "APR Match & Zero-Fee Balance Transfer Offer"
            cost = 350.0
        elif seg_name_val == "Cash & UPI Transactors":
            action_name = "Contactless Tap & Pay Welcome Booster (₹150 Cash Credit)"
            cost = 150.0
        elif seg_name_val == "HSIC Core Loyalists":
            action_name = "VIP Retention Tier & Milestone Gift Voucher"
            cost = 100.0
        else:
            action_name = "Personalized Share-of-Wallet Growth Incentive"
            cost = 200.0
            
        exp_contrib = (row['Recoverable_Opportunity'] * margin) - cost
        
        actions.append(action_name)
        intervention_costs.append(cost)
        expected_contributions.append(round(exp_contrib, 2))
        
    df['Recommended_NBA'] = actions
    df['Intervention_Cost'] = intervention_costs
    df['Expected_Net_Contribution'] = expected_contributions
    
    # Portfolio Aggregations
    total_rev_at_risk = float(df['Revenue_at_Risk'].sum())
    total_recoverable = float(df['Recoverable_Opportunity'].sum())
    total_intervention_cost = float(df['Intervention_Cost'].sum())
    total_net_contrib = float(df['Expected_Net_Contribution'].sum())
    
    action_summary = []
    for act, grp in df.groupby('Recommended_NBA'):
        action_summary.append({
            "action_name": act,
            "target_customers": len(grp),
            "pct_of_customers": round(len(grp) / len(df) * 100, 2),
            "total_recoverable_spend": round(float(grp['Recoverable_Opportunity'].sum()), 2),
            "total_intervention_cost": round(float(grp['Intervention_Cost'].sum()), 2),
            "expected_net_value": round(float(grp['Expected_Net_Contribution'].sum()), 2),
            "expected_roi": round((float(grp['Expected_Net_Contribution'].sum()) / float(grp['Intervention_Cost'].sum())), 2) if float(grp['Intervention_Cost'].sum()) > 0 else 0
        })
    action_summary = sorted(action_summary, key=lambda x: x['total_recoverable_spend'], reverse=True)
    
    return {
        "methodology_note": "Recoverability is calculated as an empirical Behavioral Feasibility Index reflecting customer activity recency, prime membership status, and spend elasticity.",
        "summary": {
            "total_revenue_at_risk": round(total_rev_at_risk, 2),
            "total_recoverable_opportunity": round(total_recoverable, 2),
            "total_intervention_cost": round(total_intervention_cost, 2),
            "total_expected_net_contribution": round(total_net_contrib, 2),
            "portfolio_roi": round(total_net_contrib / total_intervention_cost, 2) if total_intervention_cost > 0 else 0,
            "customers_at_risk_count": int((df['Predicted_Risk_Score'] >= 0.5).sum())
        },
        "actions": action_summary,
        "scored_df": df
    }
