import pytest
import pandas as pd
import numpy as np
from backend.analytics.ml_risk import train_risk_models

def test_ml_risk_models_tournament():
    # Build a small dummy feature matrix
    np.random.seed(42)
    n = 300
    df = pd.DataFrame({
        'FY25_SoW': np.random.uniform(0.1, 0.9, n),
        'FY25_HSIC': np.random.uniform(500, 20000, n),
        'FY25_Total': np.random.uniform(1000, 50000, n),
        'FY26_SoW': np.random.uniform(0.0, 0.8, n),
        'Wallet_Share': np.random.uniform(0, 0.6, n),
        'UPI_Share': np.random.uniform(0, 0.4, n),
        'OtherCC_Share': np.random.uniform(0, 0.3, n),
        'Debit_Share': np.random.uniform(0, 0.3, n),
        'Grocery_Spend': np.random.uniform(100, 10000, n),
        'Electronics_Spend': np.random.uniform(100, 10000, n),
        'Appliances_Spend': np.random.uniform(100, 5000, n),
        'High_Ticket_Spend': np.random.uniform(0, 15000, n),
        'Overall_Recency_Days': np.random.uniform(1, 300, n),
        'HSIC_Recency_Days': np.random.uniform(1, 300, n),
        'Tx_Count': np.random.randint(5, 50, n),
        'Avg_Ticket': np.random.uniform(500, 3000, n),
        'Return_Rate': np.random.uniform(0, 0.2, n),
        'Age': np.random.randint(20, 70, n),
        'Is_Prime': np.random.choice([0, 1], n),
        'Credit_Card_Limit': np.random.choice([50000, 100000, 200000], n),
        'Credit_Card_APR': np.random.uniform(15.0, 35.0, n),
        'Card_Tenure_Days': np.random.randint(100, 1500, n),
        'Is_Closed': np.zeros(n),
        'Total_Spend': np.random.uniform(1000, 50000, n),
        'Delta_SoW': np.random.uniform(-0.5, 0.2, n)
    })

    result = train_risk_models(df)

    assert "selected_model" in result
    assert "metrics" in result
    assert "model_benchmark" in result
    assert "feature_importances" in result
    assert "shap_summary" in result
    assert "scored_df" in result

    metrics = result["metrics"]
    assert 0.5 <= metrics["roc_auc"] <= 1.0
    assert 0.0 <= metrics["pr_auc"] <= 1.0
    assert len(result["model_benchmark"]) >= 3
