import pytest
import pandas as pd
import numpy as np
from backend.analytics.migration_engine import compute_migration_metrics

@pytest.fixture
def active_tx_and_cust():
    cust_df = pd.read_csv("Customer Data.csv")
    tx_df = pd.read_csv("Transactions Data.csv")
    cat_df = pd.read_csv("Category Code.csv")
    pay_df = pd.read_csv("Payment Code.csv")

    tx_df['Transaction_Date'] = pd.to_datetime(tx_df['Transaction_Date'])
    cust_df['Credit_Card_Open_Date'] = pd.to_datetime(cust_df['Credit_Card_Open_Date'])
    cust_df['Credit_Card_Closed_Date'] = pd.to_datetime(cust_df['Credit_Card_Closed_Date'])

    merged = tx_df.merge(cust_df, on='Customer_ID', how='left')
    merged = merged.merge(cat_df, on='Category_Code', how='left')
    merged = merged.merge(pay_df, on='Payment_Code', how='left')

    merged['is_card_active'] = (
        merged['Credit_Card_Open_Date'].notnull() &
        (merged['Transaction_Date'] >= merged['Credit_Card_Open_Date']) &
        (merged['Credit_Card_Closed_Date'].isnull() | (merged['Transaction_Date'] <= merged['Credit_Card_Closed_Date']))
    )
    merged['Net_Amount'] = np.where(merged['Transaction_Type'] == 'Return', -merged['Transaction_Amount'], merged['Transaction_Amount'])
    merged['Fiscal_Year'] = np.where(merged['Transaction_Date'] < '2025-08-01', 'FY25', 'FY26')

    active_tx = merged[merged['is_card_active']].copy()
    return active_tx, cust_df

def test_migration_metrics_structure(active_tx_and_cust):
    active_tx, cust_df = active_tx_and_cust
    migration = compute_migration_metrics(active_tx, cust_df)

    assert "payment_mix" in migration
    assert "payment_methods" in migration
    assert "defectors_analysis" in migration
    assert "sankey_data" in migration

    pm = migration["payment_methods"]
    assert len(pm) == 5
    # Wallet should be primary share recipient
    wallet_item = next((p for p in pm if "Wallet" in p.get("payment_method", "")), None)
    assert wallet_item is not None
    assert wallet_item["net_share_pct"] > 0
