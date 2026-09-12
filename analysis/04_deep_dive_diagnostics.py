"""
04_deep_dive_diagnostics.py - Big Ticket Inversion, Rewards Forfeiture & Lifecycle Drop-offs
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
df_tx = pd.read_csv(os.path.join(BASE_DIR, "Transactions Data.csv")).merge(pd.read_csv(os.path.join(BASE_DIR, "Payment Code.csv")), on='Payment_Code').merge(pd.read_csv(os.path.join(BASE_DIR, "Category Code.csv")), on='Category_Code')
df_tx['Transaction_Date'] = pd.to_datetime(df_tx['Transaction_Date'], format='mixed')
df_cust['Credit_Card_Open_Date'] = pd.to_datetime(df_cust['Credit_Card_Open_Date'], format='mixed')
df_cust['Credit_Card_Closed_Date'] = pd.to_datetime(df_cust['Credit_Card_Closed_Date'], format='mixed')
df_tx = df_tx.merge(df_cust[['Customer_ID', 'Credit_Card_Open_Date', 'Credit_Card_Closed_Date', 'Membership_Type']], on='Customer_ID')
df_tx['Signed_Amount'] = np.where(df_tx['Transaction_Type'] == 'Return', -df_tx['Transaction_Amount'], df_tx['Transaction_Amount'])
df_tx['Is_HSIC'] = df_tx['Payment_Method'] == 'HSIC Bank Credit Card'
df_tx['Is_Active'] = df_tx['Credit_Card_Open_Date'].notnull() & (df_tx['Transaction_Date'] >= df_tx['Credit_Card_Open_Date']) & (df_tx['Credit_Card_Closed_Date'].isnull() | (df_tx['Transaction_Date'] <= df_tx['Credit_Card_Closed_Date']))
df_act = df_tx[df_tx['Is_Active']].copy()

# Reward forfeiture calculation
is_prime = df_act['Membership_Type'] == 'Prime'
is_groc = df_act['Category'] == 'Grocery'
is_elec = df_act['Category'] == 'Electronics'
pos_amt = np.maximum(0.0, df_act['Signed_Amount'])
rates = np.where(is_prime & is_groc, 0.05, np.where(is_prime & is_elec, 0.03, 0.01))
df_act['Forfeited_Reward'] = np.where(~df_act['Is_HSIC'], pos_amt * rates, 0.0)

prime_forfeit = df_act[is_prime]['Forfeited_Reward'].sum()
print("=== PRIME REWARD FORFEITURE ===")
print(f"Total Unclaimed Cashback by Prime Members: INR {prime_forfeit:,.2f}")
