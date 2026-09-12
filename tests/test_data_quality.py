import pytest
import pandas as pd
import numpy as np
from backend.analytics.audit import run_data_audit

def test_data_quality_5_dimensions():
    cust_df = pd.read_csv("Customer Data.csv")
    tx_df = pd.read_csv("Transactions Data.csv")
    cat_df = pd.read_csv("Category Code.csv")
    pay_df = pd.read_csv("Payment Code.csv")

    audit = run_data_audit(cust_df, tx_df, cat_df, pay_df)

    assert "data_quality_score" in audit
    assert 0 <= audit["data_quality_score"] <= 100.0
    assert len(audit["quality_dimensions"]) == 5
    assert audit["total_customers"] == 45000
    assert audit["total_transactions"] == 444118
    assert audit["status"] == "PASSED - STATISTICALLY VALIDATED DATA QUALITY"

def test_data_quality_corrupted_data_handling():
    # Corrupted data with nulls and orphan keys
    cust_df = pd.DataFrame({
        "Customer_ID": [1, 2, 3],
        "Age": [30, np.nan, 45],
        "Gender": ["M", "F", None],
        "Membership_Type": ["Prime", "Non-Prime", "Prime"]
    })
    tx_df = pd.DataFrame({
        "Customer_ID": [1, 999], # 999 is orphan
        "Transaction_ID": [101, 101], # duplicate txn ID
        "Transaction_Date": ["2025-01-01", "2025-01-02"],
        "Category_Code": [1, 99], # 99 is invalid
        "Transaction_Type": ["Sale", "InvalidType"],
        "Transaction_Amount": [100.0, -50.0],
        "Payment_Code": [3, 99]
    })
    cat_df = pd.DataFrame({"Category_Code": [1], "Category": ["Grocery"]})
    pay_df = pd.DataFrame({"Payment_Code": [3], "Payment_Method": ["HSIC"]})

    audit = run_data_audit(cust_df, tx_df, cat_df, pay_df)
    assert audit["data_quality_score"] < 100.0
    assert audit["integrity_checks"]["orphan_transactions"] == 1
    assert audit["integrity_checks"]["transaction_duplicates"] == 1
