import pytest
import pandas as pd
import numpy as np
from backend.analytics.opportunity_nba import compute_opportunity_and_nba

def test_opportunity_and_nba_ranking():
    np.random.seed(42)
    n = 100
    df = pd.DataFrame({
        "Total_Spend": np.random.uniform(5000, 50000, n),
        "HSIC_Spend": np.random.uniform(0, 10000, n),
        "SoW": np.random.uniform(0, 0.4, n),
        "Predicted_Risk_Score": np.random.uniform(0.1, 0.9, n),
        "Customer_State": np.random.choice(["Healthy", "Warning", "Declining", "Dormant", "Hard Attrition"], n),
        "Segment_Name": np.random.choice(["High-Value Multi-Channel Shoppers", "MetroMart Wallet Dominant Shoppers"], n),
        "Grocery_Spend": np.random.uniform(500, 5000, n),
        "Electronics_Spend": np.random.uniform(0, 8000, n),
        "High_Ticket_Spend": np.random.uniform(0, 12000, n),
        "Wallet_Share": np.random.uniform(0.1, 0.6, n),
        "UPI_Share": np.random.uniform(0.1, 0.4, n),
        "Is_Prime": np.random.choice([0, 1], n),
        "Age": np.random.randint(20, 70, n)
    })

    result = compute_opportunity_and_nba(df)

    assert "summary" in result
    assert "actions" in result
    assert "scored_df" in result

    scored = result["scored_df"]
    assert "Revenue_at_Risk" in scored.columns
    assert "Recoverable_Opportunity" in scored.columns
    assert "Master_Opportunity_Score" in scored.columns
    assert "Recommended_NBA" in scored.columns
    assert "Intervention_Cost" in scored.columns
    assert "Expected_Net_Contribution" in scored.columns
