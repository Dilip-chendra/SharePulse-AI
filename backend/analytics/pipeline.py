import os
import sys
import json
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime

from backend.analytics.audit import run_data_audit
from backend.analytics.sow_engine import compute_sow_metrics
from backend.analytics.migration_engine import compute_migration_metrics
from backend.analytics.feature_store import build_customer_features
from backend.analytics.ml_risk import train_risk_models
from backend.analytics.segmentation import compute_behavioral_segments
from backend.analytics.opportunity_nba import compute_opportunity_and_nba
from backend.analytics.ai_discovery import generate_ai_discovered_insights
from backend.analytics.return_analysis import run_return_analysis
from backend.analytics.big_ticket import run_big_ticket_analysis
from backend.analytics.reward_analysis import run_reward_analysis
from backend.analytics.survival_model import run_survival_analysis
from backend.analytics.margin_bleed import compute_margin_bleed

def run_full_pipeline(base_dir: str = ".") -> dict:
    """
    Runs the complete end-to-end analytical pipeline:
    1. Loads and audits CSV datasets
    2. Computes SOW and Payment Migration trajectories
    3. Executes Return Friction & Chi-Square Independence Analysis
    4. Analyzes Big-Ticket Basket Inversion
    5. Computes Prime Benefit Cashback Forfeiture
    6. Extracts 360-degree customer feature store
    7. Trains and benchmarks candidate ML Risk models (XGBoost, HGB, RF, LR) + SHAP
    8. Fits Cox Proportional Hazards & Kaplan-Meier Survival Curves
    9. Discovers and validates Behavioral Customer Archetypes (k=2..8)
    10. Evaluates Margin Bleed Index (MBI)
    11. Computes Opportunity and Next Best Action rankings
    12. Discovers autonomous AI empirical insights with hypothesis testing
    13. Persists JSON analytical cache and indexed SQLite database
    """
    print(">>> Starting SharePulse-AI Complete Analytics Pipeline...")
    t0 = datetime.now()
    
    # 1. Load Data
    cust_path = os.path.join(base_dir, "Customer Data.csv")
    tx_path = os.path.join(base_dir, "Transactions Data.csv")
    cat_path = os.path.join(base_dir, "Category Code.csv")
    pay_path = os.path.join(base_dir, "Payment Code.csv")
    
    if not os.path.exists(cust_path) or not os.path.exists(tx_path):
        raise FileNotFoundError(f"Required CSV files not found in base directory: {base_dir}")

    cust_df = pd.read_csv(cust_path)
    tx_df = pd.read_csv(tx_path)
    cat_df = pd.read_csv(cat_path) if os.path.exists(cat_path) else pd.DataFrame(columns=['Category_Code', 'Category'])
    pay_df = pd.read_csv(pay_path) if os.path.exists(pay_path) else pd.DataFrame(columns=['Payment_Code', 'Payment_Method'])
    print(f"Loaded {len(cust_df):,} customers and {len(tx_df):,} transactions.")
    
    # 2. Data Audit
    print("Running Data Quality Audit...")
    audit_results = run_data_audit(cust_df, tx_df, cat_df, pay_df)
    
    # 3. Clean and Merge Datasets
    tx_df['Transaction_Date'] = pd.to_datetime(tx_df['Transaction_Date'])
    cust_df['Credit_Card_Open_Date'] = pd.to_datetime(cust_df['Credit_Card_Open_Date'])
    cust_df['Credit_Card_Closed_Date'] = pd.to_datetime(cust_df['Credit_Card_Closed_Date'])
    
    merged = tx_df.merge(cust_df, on='Customer_ID', how='left')
    if not cat_df.empty:
        merged = merged.merge(cat_df, on='Category_Code', how='left')
    if not pay_df.empty:
        merged = merged.merge(pay_df, on='Payment_Code', how='left')
    
    # Active HSIC Card Check (Strict business rule: cardholder boundary)
    merged['is_card_active'] = (
        merged['Credit_Card_Open_Date'].notnull() &
        (merged['Transaction_Date'] >= merged['Credit_Card_Open_Date']) &
        (merged['Credit_Card_Closed_Date'].isnull() | (merged['Transaction_Date'] <= merged['Credit_Card_Closed_Date']))
    )
    
    # Net Sales Calculation (Sale - Return)
    merged['Net_Amount'] = np.where(merged['Transaction_Type'] == 'Return', -merged['Transaction_Amount'], merged['Transaction_Amount'])
    # Returns count as 0 positive transactions
    merged['Tx_Count'] = np.where(merged['Transaction_Type'] == 'Return', 0, merged.get('Number_of_Transactions', 1).fillna(0))
    # Fiscal Year definition (August 1 to July 31)
    merged['Fiscal_Year'] = np.where(merged['Transaction_Date'] < '2025-08-01', 'FY25', 'FY26')
    
    active_tx = merged[merged['is_card_active']].copy()
    print(f"Filtered {len(active_tx):,} transactions during active card periods.")
    
    # 4. SOW Engine
    print("Computing SOW metrics...")
    sow_results = compute_sow_metrics(active_tx, cust_df)
    
    # 5. Migration Engine
    print("Computing Payment Migration metrics...")
    migration_results = compute_migration_metrics(active_tx, cust_df)
    
    # 6. Return Analysis (Chi-Square Neutrality Test)
    print("Computing Return Friction Intelligence...")
    return_results = run_return_analysis(merged)
    
    # 7. Big-Ticket Recovery Analysis
    print("Computing Big-Ticket Basket Inversion...")
    big_ticket_results = run_big_ticket_analysis(merged)
    
    # 8. Feature Store Construction
    print("Building 360 Customer Feature Store...")
    features_df = build_customer_features(active_tx, cust_df)
    
    # 9. Prime Reward Analysis
    print("Computing Prime Cashback Forfeiture...")
    reward_results = run_reward_analysis(features_df, active_tx)
    
    # 10. ML Risk Model Tournament + SHAP
    print("Training ML Risk Models & SHAP Diagnostics...")
    ml_results = train_risk_models(features_df)
    scored_df = ml_results.pop('scored_df')
    
    # 11. Behavioral Segmentation
    print("Clustering Behavioral Archetypes...")
    seg_results = compute_behavioral_segments(scored_df)
    segmented_df = seg_results.pop('scored_df')
    
    # 12. Survival Analysis
    print("Fitting Cox PH & Kaplan-Meier Survival Models...")
    survival_results = run_survival_analysis(segmented_df)
    
    # 13. Margin Bleed Index
    print("Computing Margin Bleed Index (MBI)...")
    mbi_results = compute_margin_bleed(segmented_df)
    mbi_scored_df = mbi_results.pop('scored_df')
    
    # 14. Opportunity & Next Best Action
    print("Computing Opportunity & Next Best Actions...")
    opp_results = compute_opportunity_and_nba(mbi_scored_df)
    final_df = opp_results.pop('scored_df')
    
    # 15. AI Discovered Insights
    print("Discovering Autonomous AI Insights with Statistical Proof...")
    ai_insights = generate_ai_discovered_insights(active_tx, cust_df, final_df)
    
    # Compile Complete Master Cache
    cache_data = {
        "timestamp": datetime.now().isoformat(),
        "audit": audit_results,
        "sow": sow_results,
        "migration": migration_results,
        "return_analysis": return_results,
        "big_ticket": big_ticket_results,
        "reward_analysis": reward_results,
        "ml": ml_results,
        "survival": survival_results,
        "margin_bleed": mbi_results,
        "segmentation": seg_results,
        "opportunity": opp_results,
        "insights": ai_insights,
        "summary": {
            "total_customers": len(cust_df),
            "cardholder_customers": int(cust_df['Credit_Card_Open_Date'].notnull().sum()),
            "active_cardholders_with_spend": int((final_df['Total_Spend'] > 0).sum()),
            "overall_sow_pct": sow_results['overall']['overall_sow_pct'],
            "fy25_sow_pct": sow_results['overall']['fy25_sow_pct'],
            "fy26_sow_pct": sow_results['overall']['fy26_sow_pct'],
            "sow_collapse_pp": sow_results['overall']['sow_collapse_pp'],
            "total_metro_spend": sow_results['overall']['total_net_spend'],
            "total_hsic_spend": sow_results['overall']['hsic_net_spend'],
            "revenue_at_risk": opp_results['summary']['total_revenue_at_risk'],
            "recoverable_opportunity": opp_results['summary']['total_recoverable_opportunity'],
            "expected_net_contribution": opp_results['summary']['total_expected_net_contribution'],
            "portfolio_roi": opp_results['summary']['portfolio_roi'],
            "customers_at_risk": opp_results['summary']['customers_at_risk_count'],
            "data_quality_score": audit_results['data_quality_score']
        }
    }
    
    # Save cache.json
    cache_dir = os.path.join(base_dir, "backend", "data")
    os.makedirs(cache_dir, exist_ok=True)
    cache_file = os.path.join(cache_dir, "cache.json")
    with open(cache_file, "w", encoding="utf-8") as f:
        json.dump(cache_data, f, indent=2, default=str)
    print(f"Saved cache to {cache_file}")
    
    # Save indexed SQLite database for high-speed customer queries
    db_file = os.path.join(cache_dir, "sharepulse.db")
    conn = sqlite3.connect(db_file)
    final_df.to_sql("customers", conn, if_exists="replace", index=False)
    
    # Create indexes for instantaneous filtering
    cursor = conn.cursor()
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_cust_id ON customers(Customer_ID)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_cust_state ON customers(Customer_State)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_cust_segment ON customers(Segment_Name)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_cust_prime ON customers(Is_Prime)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_cust_risk ON customers(Predicted_Risk_Score)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_cust_opp ON customers(Master_Opportunity_Score)")
    conn.commit()
    conn.close()
    print(f"Saved SQLite customer database to {db_file}")
    
    elapsed = (datetime.now() - t0).total_seconds()
    print(f">>> Complete Pipeline finished successfully in {elapsed:.2f} seconds.")
    return cache_data

if __name__ == "__main__":
    run_full_pipeline(".")
