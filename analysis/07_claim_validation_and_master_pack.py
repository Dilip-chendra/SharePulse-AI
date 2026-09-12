"""
07_claim_validation_and_master_pack.py - Master Evidence Table & Claim Verification
Synchrony Analytics Hackathon 2026
"""
import os
import sys
import pandas as pd
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
evidence_file = os.path.join(BASE_DIR, "evidence_pack", "26_evidence_master.csv")
if os.path.exists(evidence_file):
    df_ev = pd.read_csv(evidence_file)
    print("=== MASTER EVIDENCE SUMMARY ===")
    for _, row in df_ev.iterrows():
        print(f"[{row['Finding_ID']}] ({row['Evidence_Type']}) {row['Finding']} | Value: {row['Value']}")
else:
    print("Evidence master file not yet generated. Run scratch/run_all_audits.py first.")
