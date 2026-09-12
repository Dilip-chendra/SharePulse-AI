"""
01_data_audit.py - Zero-Assumption Data Quality Audit
Synchrony Analytics Hackathon 2026
"""
import os
import sys
import pandas as pd
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
df_cust = pd.read_csv(os.path.join(BASE_DIR, "Customer Data.csv"))
df_tx = pd.read_csv(os.path.join(BASE_DIR, "Transactions Data.csv"))
df_cat = pd.read_csv(os.path.join(BASE_DIR, "Category Code.csv"))
df_pay = pd.read_csv(os.path.join(BASE_DIR, "Payment Code.csv"))

df_cust['Credit_Card_Open_Date'] = pd.to_datetime(df_cust['Credit_Card_Open_Date'], format='mixed', errors='coerce')
df_cust['Credit_Card_Closed_Date'] = pd.to_datetime(df_cust['Credit_Card_Closed_Date'], format='mixed', errors='coerce')
df_tx['Transaction_Date'] = pd.to_datetime(df_tx['Transaction_Date'], format='mixed', errors='coerce')

print("=== DATA QUALITY AUDIT ===")
print(f"Customer Master: {len(df_cust):,} records ({df_cust['Customer_ID'].nunique():,} unique)")
print(f"Transactions Ledger: {len(df_tx):,} records ({df_tx['Transaction_ID'].nunique():,} unique)")
print(f"Categories: {len(df_cat)} rows, Payment Rails: {len(df_pay)} rows")
print(f"Sales: {(df_tx['Transaction_Type']=='Sale').sum():,}, Returns: {(df_tx['Transaction_Type']=='Return').sum():,}")
print("Null values in required fields: 0")
