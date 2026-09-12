import pytest
import pandas as pd
import numpy as np
import os
import json
import tempfile
from backend.analytics.pipeline import run_full_pipeline

def test_custom_3_year_dataset_pipeline():
    """Validates that a 3-year custom dataset runs through the full pipeline without hardcoded 2-year assumptions."""
    with tempfile.TemporaryDirectory() as tmpdir:
        # Create a synthetic 3-year dataset (2023 to 2026)
        np.random.seed(42)
        n_cust = 500
        n_tx = 3000

        dates_3yr = pd.date_range("2023-08-01", "2026-07-31", periods=n_tx)

        cust_df = pd.DataFrame({
            "Customer_ID": range(1, n_cust + 1),
            "Age": np.random.randint(20, 70, n_cust),
            "Gender": np.random.choice(["M", "F"], n_cust),
            "Membership_Type": np.random.choice(["Prime", "Non-Prime"], n_cust),
            "Credit_Card_Open_Date": "2023-01-01",
            "Credit_Card_Closed_Date": [None] * (n_cust - 20) + ["2025-12-31"] * 20,
            "Credit_Card_Limit": np.random.choice([50000, 100000, 200000], n_cust),
            "Credit_Card_APR": np.random.uniform(18.0, 32.0, n_cust)
        })

        tx_df = pd.DataFrame({
            "Customer_ID": np.random.choice(range(1, n_cust + 1), n_tx),
            "Transaction_ID": range(1, n_tx + 1),
            "Transaction_Date": dates_3yr.strftime("%Y-%m-%d"),
            "Category_Code": np.random.randint(1, 11, n_tx),
            "Transaction_Type": np.random.choice(["Sale", "Return"], n_tx, p=[0.9, 0.1]),
            "Transaction_Amount": np.random.uniform(100, 8000, n_tx),
            "Payment_Code": np.random.randint(1, 6, n_tx),
            "Number_of_Transactions": [1] * n_tx
        })

        cat_df = pd.DataFrame({
            "Category_Code": range(1, 11),
            "Category": [f"Category {i}" for i in range(1, 11)]
        })

        pay_df = pd.DataFrame({
            "Payment_Code": [1, 2, 3, 4, 5],
            "Payment_Method": ["Debit", "Other CC", "HSIC", "Cash/UPI", "Wallet"]
        })

        cust_df.to_csv(os.path.join(tmpdir, "Customer Data.csv"), index=False)
        tx_df.to_csv(os.path.join(tmpdir, "Transactions Data.csv"), index=False)
        cat_df.to_csv(os.path.join(tmpdir, "Category Code.csv"), index=False)
        pay_df.to_csv(os.path.join(tmpdir, "Payment Code.csv"), index=False)

        # Run pipeline on custom 3-year data
        cache = run_full_pipeline(tmpdir)

        assert cache["summary"]["total_customers"] == n_cust
        assert cache["audit"]["total_transactions"] == n_tx
        assert "sow" in cache
        assert "ml" in cache
        assert "segmentation" in cache
        assert "return_analysis" in cache
        assert "big_ticket" in cache

def test_custom_4_year_dataset_pipeline():
    """Validates that a 4-year custom dataset runs through the full pipeline cleanly."""
    with tempfile.TemporaryDirectory() as tmpdir:
        np.random.seed(123)
        n_cust = 300
        n_tx = 2000

        dates_4yr = pd.date_range("2022-08-01", "2026-07-31", periods=n_tx)

        cust_df = pd.DataFrame({
            "Customer_ID": range(1, n_cust + 1),
            "Age": np.random.randint(22, 65, n_cust),
            "Gender": np.random.choice(["M", "F"], n_cust),
            "Membership_Type": np.random.choice(["Prime", "Non-Prime"], n_cust),
            "Credit_Card_Open_Date": "2022-01-01",
            "Credit_Card_Closed_Date": [None] * n_cust,
            "Credit_Card_Limit": np.random.choice([75000, 150000], n_cust),
            "Credit_Card_APR": np.random.uniform(19.0, 30.0, n_cust)
        })

        tx_df = pd.DataFrame({
            "Customer_ID": np.random.choice(range(1, n_cust + 1), n_tx),
            "Transaction_ID": range(1, n_tx + 1),
            "Transaction_Date": dates_4yr.strftime("%Y-%m-%d"),
            "Category_Code": np.random.randint(1, 11, n_tx),
            "Transaction_Type": ["Sale"] * n_tx,
            "Transaction_Amount": np.random.uniform(200, 6000, n_tx),
            "Payment_Code": np.random.randint(1, 6, n_tx),
            "Number_of_Transactions": [1] * n_tx
        })

        cat_df = pd.DataFrame({
            "Category_Code": range(1, 11),
            "Category": [f"Cat_{i}" for i in range(1, 11)]
        })

        pay_df = pd.DataFrame({
            "Payment_Code": [1, 2, 3, 4, 5],
            "Payment_Method": ["Debit", "Other CC", "HSIC", "Cash/UPI", "Wallet"]
        })

        cust_df.to_csv(os.path.join(tmpdir, "Customer Data.csv"), index=False)
        tx_df.to_csv(os.path.join(tmpdir, "Transactions Data.csv"), index=False)
        cat_df.to_csv(os.path.join(tmpdir, "Category Code.csv"), index=False)
        pay_df.to_csv(os.path.join(tmpdir, "Payment Code.csv"), index=False)

        cache = run_full_pipeline(tmpdir)
        assert cache["summary"]["total_customers"] == n_cust
        assert cache["audit"]["total_transactions"] == n_tx
