import pytest
import pandas as pd
from backend.analytics.return_analysis import run_return_analysis

def test_return_analysis_neutrality():
    tx_df = pd.read_csv("Transactions Data.csv")
    pay_df = pd.read_csv("Payment Code.csv")
    merged = tx_df.merge(pay_df, on="Payment_Code", how="left")

    result = run_return_analysis(merged)

    assert "chi_square_test" in result
    assert "test_statistics" in result
    assert "payment_method_summary" in result
    assert len(result["payment_method_summary"]) == 5

    chi_test = result["chi_square_test"]
    assert "chi2_statistic" in chi_test
    assert "p_value" in chi_test
    # Return rate should be independent across payment methods (p > 0.05)
    assert chi_test["p_value"] > 0.05
    assert not chi_test["significant"]

def test_return_analysis_no_returns():
    # Synthetic dataset with 0 returns
    df = pd.DataFrame({
        "Transaction_Type": ["Sale", "Sale", "Sale"],
        "Transaction_Amount": [100.0, 200.0, 300.0],
        "Payment_Code": [1, 2, 3]
    })
    result = run_return_analysis(df)
    assert result["overall"]["total_returns"] == 0
    assert result["overall"]["overall_return_rate_pct"] == 0.0
