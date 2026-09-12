import pytest
import pandas as pd
import numpy as np
from backend.analytics.segmentation import compute_behavioral_segments

def test_behavioral_segmentation_k_validation():
    # Build a small dummy feature matrix with 100 rows
    np.random.seed(42)
    n = 200
    df = pd.DataFrame({
        "SoW": np.random.uniform(0, 1, n),
        "Wallet_Share": np.random.uniform(0, 1, n),
        "UPI_Share": np.random.uniform(0, 1, n),
        "OtherCC_Share": np.random.uniform(0, 0.5, n),
        "Total_Spend": np.random.uniform(1000, 50000, n),
        "HSIC_Spend": np.random.uniform(0, 20000, n),
        "Wallet_Spend": np.random.uniform(0, 20000, n),
        "UPI_Spend": np.random.uniform(0, 10000, n),
        "OtherCC_Spend": np.random.uniform(0, 5000, n),
        "Avg_Ticket": np.random.uniform(500, 5000, n),
        "HSIC_Recency_Days": np.random.uniform(1, 365, n),
        "Is_Prime": np.random.choice([0, 1], n),
        "Predicted_Risk_Score": np.random.uniform(0, 1, n)
    })

    result = compute_behavioral_segments(df)

    assert "selected_k" in result
    assert "k_validation_benchmark" in result
    assert "segments" in result
    assert "pca_variance_explained" in result
    assert len(result["k_validation_benchmark"]) == 7 # k=2..8
    assert len(result["segments"]) > 0
    assert "scored_df" in result
    assert "Cluster_Id" in result["scored_df"].columns
    assert "Segment_Name" in result["scored_df"].columns
