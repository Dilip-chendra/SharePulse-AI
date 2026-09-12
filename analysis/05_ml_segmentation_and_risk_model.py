"""
05_ml_segmentation_and_risk_model.py - Unsupervised Clustering & Defection Risk Model
Synchrony Analytics Hackathon 2026
"""
import os
import sys
import pandas as pd
import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import roc_auc_score
from sklearn.model_selection import train_test_split
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
df_cust = pd.read_csv(os.path.join(BASE_DIR, "Customer Data.csv"))
df_tx = pd.read_csv(os.path.join(BASE_DIR, "Transactions Data.csv")).merge(pd.read_csv(os.path.join(BASE_DIR, "Payment Code.csv")), on='Payment_Code')

df_tx['Transaction_Date'] = pd.to_datetime(df_tx['Transaction_Date'], format='mixed')
df_cust['Credit_Card_Open_Date'] = pd.to_datetime(df_cust['Credit_Card_Open_Date'], format='mixed')
df_cust['Credit_Card_Closed_Date'] = pd.to_datetime(df_cust['Credit_Card_Closed_Date'], format='mixed')
df_tx = df_tx.merge(df_cust[['Customer_ID', 'Credit_Card_Open_Date', 'Credit_Card_Closed_Date', 'Membership_Type', 'Credit_Card_Limit', 'Credit_Card_APR', 'Age']], on='Customer_ID')
df_tx['Signed_Amount'] = np.where(df_tx['Transaction_Type'] == 'Return', -df_tx['Transaction_Amount'], df_tx['Transaction_Amount'])
df_tx['Is_HSIC'] = df_tx['Payment_Method'] == 'HSIC Bank Credit Card'
df_tx['Is_Active'] = df_tx['Credit_Card_Open_Date'].notnull() & (df_tx['Transaction_Date'] >= df_tx['Credit_Card_Open_Date']) & (df_tx['Credit_Card_Closed_Date'].isnull() | (df_tx['Transaction_Date'] <= df_tx['Credit_Card_Closed_Date']))
df_act = df_tx[df_tx['Is_Active']].copy()
df_act['Fiscal_Year'] = np.where(df_act['Transaction_Date'] < '2025-08-01', 'FY25', 'FY26')
df_act['HSIC_Amount'] = np.where(df_act['Is_HSIC'], df_act['Signed_Amount'], 0.0)

cust_features = df_act.groupby('Customer_ID').agg(
    Total_Spend=('Signed_Amount', 'sum'),
    HSIC_Spend=('HSIC_Amount', 'sum'),
    Tx_Count=('Signed_Amount', 'count')
).reset_index()
cust_features['SoW'] = np.where(cust_features['Total_Spend'] > 0, (cust_features['HSIC_Spend'] / cust_features['Total_Spend']) * 100, 0)
cust_features = cust_features.merge(df_cust[['Customer_ID', 'Age', 'Membership_Type', 'Credit_Card_Limit', 'Credit_Card_APR']], on='Customer_ID')
cust_features['Is_Prime'] = (cust_features['Membership_Type'] == 'Prime').astype(int)

cust_tot_fy25 = df_act[df_act['Fiscal_Year'] == 'FY25'].groupby('Customer_ID')['Signed_Amount'].sum()
cust_tot_fy26 = df_act[df_act['Fiscal_Year'] == 'FY26'].groupby('Customer_ID')['Signed_Amount'].sum()
cust_hsic_fy25 = df_act[df_act['Fiscal_Year'] == 'FY25'].groupby('Customer_ID')['HSIC_Amount'].sum()
cust_hsic_fy26 = df_act[df_act['Fiscal_Year'] == 'FY26'].groupby('Customer_ID')['HSIC_Amount'].sum()

cust_df = pd.DataFrame(index=df_cust['Customer_ID'].unique())
cust_df['FY25_SoW'] = np.where(cust_tot_fy25.reindex(cust_df.index).fillna(0) > 0, (cust_hsic_fy25.reindex(cust_df.index).fillna(0) / cust_tot_fy25.reindex(cust_df.index).fillna(0)) * 100, 0)
cust_df['FY26_SoW'] = np.where(cust_tot_fy26.reindex(cust_df.index).fillna(0) > 0, (cust_hsic_fy26.reindex(cust_df.index).fillna(0) / cust_tot_fy26.reindex(cust_df.index).fillna(0)) * 100, 0)
cust_df['Delta_SoW'] = cust_df['FY26_SoW'] - cust_df['FY25_SoW']

cust_features['Target'] = (cust_df.loc[cust_features['Customer_ID'], 'Delta_SoW'].values <= -15).astype(int)
features = ['Total_Spend', 'SoW', 'Tx_Count', 'Age', 'Is_Prime', 'Credit_Card_Limit', 'Credit_Card_APR']
X = cust_features[features].fillna(0)
y = cust_features['Target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
clf = HistGradientBoostingClassifier(random_state=42)
clf.fit(X_train, y_train)
y_proba = clf.predict_proba(X_test)[:, 1]
print(f"Hist Gradient Boosting Defection Risk ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}")
