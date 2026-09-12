"""
02_baseline_and_sow.py - Baseline Rebuild & Longitudinal Share-of-Wallet Engine
Synchrony Analytics Hackathon 2026
"""
import os
import sys
import pandas as pd
import numpy as np
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
df_cust = pd.read_csv(os.path.join(BASE_DIR, "Customer Data.csv"))
df_tx = pd.read_csv(os.path.join(BASE_DIR, "Transactions Data.csv")).merge(pd.read_csv(os.path.join(BASE_DIR, "Payment Code.csv")), on='Payment_Code')

df_tx['Transaction_Date'] = pd.to_datetime(df_tx['Transaction_Date'], format='mixed')
df_cust['Credit_Card_Open_Date'] = pd.to_datetime(df_cust['Credit_Card_Open_Date'], format='mixed')
df_cust['Credit_Card_Closed_Date'] = pd.to_datetime(df_cust['Credit_Card_Closed_Date'], format='mixed')

df_tx = df_tx.merge(df_cust[['Customer_ID', 'Credit_Card_Open_Date', 'Credit_Card_Closed_Date']], on='Customer_ID')
df_tx['Signed_Amount'] = np.where(df_tx['Transaction_Type'] == 'Return', -df_tx['Transaction_Amount'], df_tx['Transaction_Amount'])
df_tx['Is_HSIC'] = df_tx['Payment_Method'] == 'HSIC Bank Credit Card'
df_tx['Is_Active'] = df_tx['Credit_Card_Open_Date'].notnull() & (df_tx['Transaction_Date'] >= df_tx['Credit_Card_Open_Date']) & (df_tx['Credit_Card_Closed_Date'].isnull() | (df_tx['Transaction_Date'] <= df_tx['Credit_Card_Closed_Date']))

df_act = df_tx[df_tx['Is_Active']].copy()
df_act['Fiscal_Year'] = np.where(df_act['Transaction_Date'] < '2025-08-01', 'FY25', 'FY26')
df_act['HSIC_Amount'] = np.where(df_act['Is_HSIC'], df_act['Signed_Amount'], 0.0)

fy = df_act.groupby('Fiscal_Year').agg(
    Total_Net_Spend=('Signed_Amount', 'sum'),
    HSIC_Net_Spend=('HSIC_Amount', 'sum'),
    Tx_Count=('Signed_Amount', 'count')
)
fy['HSIC_SoW'] = (fy['HSIC_Net_Spend'] / fy['Total_Net_Spend']) * 100
print("=== FISCAL YEAR SOW ===")
print(fy.round(2))
