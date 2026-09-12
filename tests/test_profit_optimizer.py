import pytest
from backend.analytics.margin_bleed import compute_margin_bleed
import pandas as pd
import numpy as np

def test_margin_bleed_economic_model():
    np.random.seed(42)
    n = 100
    df = pd.DataFrame({
        "FY26_Total": np.random.uniform(1000, 50000, n),
        "FY26_HSIC": np.random.uniform(100, 10000, n),
        "Wallet_Share": np.random.uniform(0.1, 0.6, n),
        "UPI_Share": np.random.uniform(0.1, 0.4, n),
        "Debit_Share": np.random.uniform(0, 0.2, n),
        "OtherCC_Share": np.random.uniform(0, 0.2, n),
        "segment_label": np.random.choice(["Segment A", "Segment B"], n)
    })

    result = compute_margin_bleed(df)

    assert "portfolio_total_mbi" in result
    assert "portfolio_avg_net_contribution" in result
    assert "segment_summary" in result
    assert "fee_model" in result
    assert result["taxonomy"] == "PROPOSED"
