"""
06_economics_nba_and_simulation.py - Next-Best-Action Economics & What-If Simulations
Synchrony Analytics Hackathon 2026
"""
import sys
import pandas as pd
if sys.platform.startswith('win'):
    sys.stdout.reconfigure(encoding='utf-8')

sim_runs = []
for rate in [0.02, 0.05, 0.08, 0.10, 0.12, 0.15, 0.20]:
    rec_spend = 384000000.0 * rate
    margin_val = rec_spend * 0.025
    cost = 150000.0 + (rec_spend * 0.003)
    net_contrib = margin_val - cost
    roi = round(margin_val / cost, 2)
    sow_lift = round(rate * 8.2, 2)
    sim_runs.append({
        "Recovery_Rate_%": int(rate * 100),
        "Recovered_Spend_INR": round(rec_spend, 2),
        "SoW_Lift_pp": sow_lift,
        "Net_Contribution_INR": round(net_contrib, 2),
        "Portfolio_ROI": roi
    })

print("=== PORTFOLIO INTERVENTION SIMULATION ===")
print(pd.DataFrame(sim_runs))
