"""
GROUND TRUTH AUDIT — compute real metrics from raw CSVs.
All results used as baseline for QA comparison.
"""
import pandas as pd
import numpy as np
import sys

BASE = r"c:\Users\admin\Downloads\Git Uploads\SharePulse-AI"

txn  = pd.read_csv(f"{BASE}/Transactions Data.csv")
cust = pd.read_csv(f"{BASE}/Customer Data.csv")
cat  = pd.read_csv(f"{BASE}/Category Code.csv")
pay  = pd.read_csv(f"{BASE}/Payment Code.csv")

txn["Transaction_Date"] = pd.to_datetime(txn["Transaction_Date"])
cust["Credit_Card_Open_Date"]   = pd.to_datetime(cust["Credit_Card_Open_Date"])
cust["Credit_Card_Closed_Date"] = pd.to_datetime(cust["Credit_Card_Closed_Date"])

print("=" * 60)
print("RAW DATA AUDIT")
print("=" * 60)
print(f"Customers:        {cust.Customer_ID.nunique():,}")
print(f"Transactions:     {len(txn):,} rows, {txn.Transaction_ID.nunique():,} unique")
print(f"Date range:       {txn.Transaction_Date.min().date()} -> {txn.Transaction_Date.max().date()}")
print(f"Transaction types:{txn.Transaction_Type.value_counts().to_dict()}")
print(f"Payment methods:  {txn.Payment_Code.value_counts().sort_index().to_dict()}")
print()

# Gross / Net Sales
sales   = txn[txn.Transaction_Type == "Sale"]["Transaction_Amount"].sum()
returns = txn[txn.Transaction_Type == "Return"]["Transaction_Amount"].sum()
net     = sales - returns
print(f"Gross Sales:      {sales:>15,.2f}")
print(f"Returns:          {returns:>15,.2f}")
print(f"Net Sales:        {net:>15,.2f}")
print()

# HSIC (Payment_Code == 3)
hsic_net = (
    txn[txn.Payment_Code == 3].assign(
        signed=lambda d: d.Transaction_Amount * d.Transaction_Type.map({"Sale":1, "Return":-1})
    )["signed"].sum()
)
total_net_all = txn.assign(
    signed=lambda d: d.Transaction_Amount * d.Transaction_Type.map({"Sale":1, "Return":-1})
)["signed"].sum()
print(f"HSIC Net Spend:   {hsic_net:>15,.2f}")
print(f"Total Net Spend:  {total_net_all:>15,.2f}")
print(f"Overall SoW:      {hsic_net/total_net_all*100:>14.2f}%")
print()

# Return rate
n_sales   = (txn.Transaction_Type == "Sale").sum()
n_returns = (txn.Transaction_Type == "Return").sum()
print(f"Sales txn count:  {n_sales:,}")
print(f"Return txn count: {n_returns:,}")
print(f"Return rate:      {n_returns/(n_sales+n_returns)*100:.2f}%")
print()

# Prime / Closed
prime   = (cust.Membership_Type == "Prime").sum()
nonprim = (cust.Membership_Type == "Non-Prime").sum()
closed  = cust["Credit_Card_Closed_Date"].notna().sum()
active  = len(cust) - closed
print(f"Prime:            {prime:,}")
print(f"Non-Prime:        {nonprim:,}")
print(f"Active cards:     {active:,}")
print(f"Closed cards:     {closed:,}")
print()

# Fiscal year analysis (Aug→Jul)
def fiscal_year(dt):
    return dt.year if dt.month >= 8 else dt.year - 1

txn["FY"] = txn["Transaction_Date"].apply(fiscal_year)
print("Net spend by Fiscal Year (FY = Aug→Jul):")
for fy, grp in txn.groupby("FY"):
    net_fy = grp.assign(s=grp.Transaction_Amount * grp.Transaction_Type.map({"Sale":1,"Return":-1}))["s"].sum()
    hsic_fy = grp[grp.Payment_Code == 3].assign(s=grp[grp.Payment_Code == 3].Transaction_Amount * grp[grp.Payment_Code == 3].Transaction_Type.map({"Sale":1,"Return":-1}))["s"].sum()
    sow_fy = hsic_fy / net_fy * 100 if net_fy > 0 else 0
    print(f"  FY{fy}: Total={net_fy:>12,.0f}  HSIC={hsic_fy:>10,.0f}  SoW={sow_fy:.2f}%")
print()

# Payment method breakdown
pay_map = {1:"Debit",2:"Other CC",3:"HSIC CC",4:"Cash/UPI",5:"Wallet"}
print("Payment method net spend:")
total_net_by_pay = []
for code, name in pay_map.items():
    grp = txn[txn.Payment_Code == code]
    net_p = grp.assign(s=grp.Transaction_Amount * grp.Transaction_Type.map({"Sale":1,"Return":-1}))["s"].sum()
    pct = net_p / total_net_all * 100
    total_net_by_pay.append(net_p)
    print(f"  {name:15}: {net_p:>12,.2f}  ({pct:.2f}%)")

print()
# Return rate per payment method (chi-square setup)
from scipy import stats
contingency = []
for code in sorted(pay_map.keys()):
    grp = txn[txn.Payment_Code == code]
    n_s = (grp.Transaction_Type == "Sale").sum()
    n_r = (grp.Transaction_Type == "Return").sum()
    contingency.append([n_s, n_r])
    print(f"  Return rate {pay_map[code]:10}: {n_r/(n_s+n_r)*100:.2f}%")

ct = np.array(contingency)
chi2, p, dof, _ = stats.chi2_contingency(ct)
print(f"\nChi-square test: chi2={chi2:.4f}, p={p:.4f}, dof={dof}")
print(f"Return neutrality: {'CONFIRMED (p>0.05)' if p > 0.05 else 'REJECTED (p<=0.05)'}")

print("\n" + "=" * 60)
print("GROUND TRUTH COMPLETE")
print("=" * 60)
