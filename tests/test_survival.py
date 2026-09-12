import pytest
import pandas as pd
import numpy as np
from backend.analytics.survival_model import run_survival_analysis

def test_survival_analysis_cox_and_km():
    np.random.seed(42)
    n = 250
    df = pd.DataFrame({
        "Card_Tenure_Days": np.random.randint(60, 1500, n),
        "Is_Closed": np.random.choice([0, 1], n, p=[0.8, 0.2]),
        "Predicted_Risk_Score": np.random.uniform(0, 1, n),
        "HSIC_Recency_Days": np.random.randint(1, 300, n),
        "SoW": np.random.uniform(0, 1, n),
        "Wallet_Share": np.random.uniform(0, 0.7, n),
        "UPI_Share": np.random.uniform(0, 0.5, n),
        "Total_Spend": np.random.uniform(1000, 50000, n),
        "Is_Prime": np.random.choice([0, 1], n),
        "Avg_Ticket": np.random.uniform(500, 3000, n),
        "Segment_Name": np.random.choice(["High-Value", "Wallet Dominant", "Loyalists"], n)
    })

    result = run_survival_analysis(df)

    assert "available" in result
    if result["available"]:
        assert "km_curves" in result
        assert "cox_hazard_ratios" in result
        assert "Overall" in result["km_curves"]
        assert len(result["km_curves"]) >= 2
