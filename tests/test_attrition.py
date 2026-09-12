import pytest
import pandas as pd
import numpy as np

def test_attrition_state_classification():
    # Test customer lifecycle rule classification
    df = pd.DataFrame({
        "Customer_ID": [1, 2, 3, 4, 5],
        "Is_Closed": [1, 0, 0, 0, 0],
        "Total_Spend": [1000, 0, 5000, 3000, 10000],
        "HSIC_Recency_Days": [10, 400, 30, 60, 10],
        "Predicted_Risk_Score": [0.2, 0.5, 0.85, 0.45, 0.10],
        "Delta_SoW": [0.0, 0.0, -0.25, -0.08, 0.05]
    })

    conditions = [
        (df['Is_Closed'] == 1),
        (df['Total_Spend'] == 0) | (df['HSIC_Recency_Days'] >= 365),
        (df['Predicted_Risk_Score'] >= 0.65) | (df['Delta_SoW'] <= -0.15),
        (df['Predicted_Risk_Score'] >= 0.35) | (df['Delta_SoW'] < -0.05),
    ]
    choices = ['Hard Attrition', 'Dormant', 'Declining', 'Warning']
    df['Customer_State'] = np.select(conditions, choices, default='Healthy')

    assert df.loc[df['Customer_ID'] == 1, 'Customer_State'].values[0] == 'Hard Attrition'
    assert df.loc[df['Customer_ID'] == 2, 'Customer_State'].values[0] == 'Dormant'
    assert df.loc[df['Customer_ID'] == 3, 'Customer_State'].values[0] == 'Declining'
    assert df.loc[df['Customer_ID'] == 4, 'Customer_State'].values[0] == 'Warning'
    assert df.loc[df['Customer_ID'] == 5, 'Customer_State'].values[0] == 'Healthy'
