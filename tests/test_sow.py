import pytest
import pandas as pd
import numpy as np
from backend.analytics.sow_engine import compute_sow_metrics

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
    merged['Tx_Count'] = np.where(merged['Transaction_Type'] == 'Return', 0, merged.get('Number_of_Transactions', 1).fillna(0))
    merged['Fiscal_Year'] = np.where(merged['Transaction_Date'] < '2025-08-01', 'FY25', 'FY26')

    active_tx = merged[merged['is_card_active']].copy()
    return active_tx, cust_df

def test_sow_overall_calculation(active_tx_and_cust):
    active_tx, cust_df = active_tx_and_cust
    sow = compute_sow_metrics(active_tx, cust_df)

    assert "overall" in sow
    assert "fiscal_years" in sow
    assert "monthly_trend" in sow
    assert len(sow["monthly_trend"]) == 24

    overall = sow["overall"]
    assert overall["total_net_spend"] > 0
    assert overall["hsic_net_spend"] > 0
    assert 0 < overall["overall_sow_pct"] < 100
    # HSIC SoW should show contraction from FY25 to FY26
    assert overall["sow_collapse_pp"] < 0

def test_sow_zero_spend_edge_case():
    empty_tx = pd.DataFrame(columns=[
        'Customer_ID', 'Payment_Code', 'Net_Amount', 'Fiscal_Year',
        'Transaction_Type', 'Transaction_Amount', 'Tx_Count', 'Transaction_Date',
        'Category', 'Membership_Type'
    ])
    empty_cust = pd.DataFrame(columns=['Customer_ID', 'Credit_Card_Open_Date'])
    sow = compute_sow_metrics(empty_tx, empty_cust)
    assert sow["overall"]["total_net_spend"] == 0.0
    assert sow["overall"]["overall_sow_pct"] == 0.0
