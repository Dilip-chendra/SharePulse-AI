import pytest
import pandas as pd
import numpy as np
from backend.analytics.feature_store import build_customer_features

def test_feature_store_dimensions():
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
    features = build_customer_features(active_tx, cust_df)

    assert len(features) > 30000
    expected_cols = [
        'Total_Spend', 'HSIC_Spend', 'Wallet_Spend', 'UPI_Spend',
        'SoW', 'Delta_SoW', 'Overall_Recency_Days', 'HSIC_Recency_Days',
        'Age', 'Is_Prime', 'Credit_Card_Limit', 'Credit_Card_APR'
    ]
    for col in expected_cols:
        assert col in features.columns
        assert not features[col].isnull().any()
