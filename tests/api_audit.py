"""
API ENDPOINT AUDIT — verify all endpoints return correct data vs ground truth
"""
import sys, json
sys.stdout.reconfigure(encoding='utf-8')
import requests

BASE = "http://127.0.0.1:8000/api"
ISSUES = []

def check(url, label):
    try:
        r = requests.get(url, timeout=30)
        return r.status_code, r.json()
    except Exception as e:
        return 0, {"error": str(e)}

# Ground truth (from raw CSV calculation)
GROUND_TRUTH = {
    "total_net_spend": 1_093_940_922.43,
    "hsic_net_spend":  154_594_354.68,
    "overall_sow_pct": 14.13,
    "fy1_sow_pct":     15.58,   # FY2024 (Aug 2024 - Jul 2025)
    "fy2_sow_pct":     12.66,   # FY2025 (Aug 2025 - Jul 2026)
    "customers":       45000,
    "transactions":    444118,
    "chi2":            0.4204,
    "p_value":         0.9808,
}

print("=" * 70)
print("API ENDPOINT AUDIT vs GROUND TRUTH")
print("=" * 70)

# --- Health ---
status, d = check(f"{BASE}/health", "health")
print(f"\n[HEALTH] status={status}, service={d.get('service','?')}")

# --- Overview ---
status, d = check(f"{BASE}/overview", "overview")
print(f"\n[OVERVIEW] status={status}")
kpis = d.get("kpis", {})
print(f"  customers_at_risk: {kpis.get('customers_at_risk')}")
print(f"  revenue_at_risk:   {kpis.get('revenue_at_risk')}")
print(f"  data_quality_score:{kpis.get('data_quality_score')}")

# --- SoW ---
status, d = check(f"{BASE}/sow", "sow")
print(f"\n[SOW] status={status}")
o = d.get("overall", {})
api_total = o.get("total_net_spend", 0)
api_hsic  = o.get("hsic_net_spend", 0)
api_sow   = o.get("overall_sow_pct", 0)
api_fy1   = o.get("fy25_sow_pct", 0)
api_fy2   = o.get("fy26_sow_pct", 0)
api_coll  = o.get("sow_collapse_pp", 0)

print(f"  total_net_spend:  {api_total:>15,.2f}  [GT: {GROUND_TRUTH['total_net_spend']:>15,.2f}] {'OK' if abs(api_total - GROUND_TRUTH['total_net_spend']) < 1000 else 'MISMATCH'}")
print(f"  hsic_net_spend:   {api_hsic:>15,.2f}  [GT: {GROUND_TRUTH['hsic_net_spend']:>15,.2f}] {'OK' if abs(api_hsic - GROUND_TRUTH['hsic_net_spend']) < 1000 else 'MISMATCH'}")
print(f"  overall_sow_pct:  {api_sow}%  [GT: {GROUND_TRUTH['overall_sow_pct']}%] {'OK' if abs(api_sow - GROUND_TRUTH['overall_sow_pct']) < 0.1 else 'MISMATCH'}")
print(f"  FY1 sow_pct:      {api_fy1}%  [GT: {GROUND_TRUTH['fy1_sow_pct']}%] {'OK' if abs(api_fy1 - GROUND_TRUTH['fy1_sow_pct']) < 0.5 else 'MISMATCH'}")
print(f"  FY2 sow_pct:      {api_fy2}%  [GT: {GROUND_TRUTH['fy2_sow_pct']}%] {'OK' if abs(api_fy2 - GROUND_TRUTH['fy2_sow_pct']) < 0.5 else 'MISMATCH'}")
print(f"  collapse_pp:      {api_coll}")

fy_list = d.get("fiscal_years", [])
print(f"  fiscal_years returned: {[f.get('fiscal_year') for f in fy_list]}")

# --- Migration ---
status, d = check(f"{BASE}/migration", "migration")
print(f"\n[MIGRATION] status={status}")
pm = d.get("payment_methods", [])
for m in pm[:5]:
    print(f"  {m.get('payment_method','?'):15}: {m.get('net_spend',0):>12,.2f}  ({m.get('net_share_pct',0)}%)")

# --- Attrition ---
status, d = check(f"{BASE}/attrition", "attrition")
print(f"\n[ATTRITION] status={status}")
sd = d.get("silent_defectors", {})
print(f"  silent_defectors: {sd.get('count')} customers, revenue={sd.get('revenue_at_risk')}")
print(f"  tstat={sd.get('t_stat')}, pvalue={sd.get('p_value')}")
lifecycle = d.get("lifecycle_states", [])
print(f"  lifecycle states: {[s.get('state') for s in lifecycle]}")

# --- Return Analysis ---
status, d = check(f"{BASE}/return-analysis", "return-analysis")
print(f"\n[RETURN-ANALYSIS] status={status}")
stats = d.get("test_statistics", {})
print(f"  chi2={stats.get('chi2_stat')}, p={stats.get('p_value')}")
print(f"  GT: chi2={GROUND_TRUTH['chi2']}, p={GROUND_TRUTH['p_value']}")
chi_match = abs(float(stats.get('chi2_stat', 0)) - GROUND_TRUTH['chi2']) < 0.5
p_match   = abs(float(stats.get('p_value', 0))   - GROUND_TRUTH['p_value']) < 0.05
print(f"  chi2 match: {chi_match}, p match: {p_match}")

# --- Reward Analysis ---
status, d = check(f"{BASE}/reward-analysis", "reward-analysis")
print(f"\n[REWARD-ANALYSIS] status={status}")
cb = d.get("cashback_forfeiture", {})
forf = cb.get("total_cashback_forfeited", 0)
forf_cust = cb.get("customers_forfeiting_count", 0)
print(f"  cashback_forfeited_total: Rs. {forf:,.2f} across {forf_cust} Prime cardholders")

# --- Big Ticket ---
status, d = check(f"{BASE}/big-ticket", "big-ticket")
print(f"\n[BIG-TICKET] status={status}")
tiers = d.get("tiers", [])
print(f"  tiers returned: {len(tiers)}")

# --- SHAP ---
status, d = check(f"{BASE}/shap", "shap")
print(f"\n[SHAP] status={status}")
shap_feats = d.get("shap_summary", [])
print(f"  top features: {[f.get('feature') for f in shap_feats[:5]]}")

# --- Survival ---
status, d = check(f"{BASE}/survival", "survival")
print(f"\n[SURVIVAL] status={status}")
print(f"  available: {d.get('available', '?')}, method: {d.get('method', '?')}")

# --- Segmentation ---
status, d = check(f"{BASE}/segmentation", "segmentation")
print(f"\n[SEGMENTATION] status={status}")
segs = d.get("segments", [])
print(f"  num_clusters: {d.get('optimal_k')}, silhouette: {d.get('silhouette_score')}")
for s in segs:
    print(f"    Cluster {s.get('cluster_id')}: N={s.get('size')}, name={s.get('name')}")

# --- Datasets ---
status, d = check(f"{BASE}/datasets", "datasets")
print(f"\n[DATASETS] status={status}")
dsets = d.get("datasets", [])
for ds in dsets:
    print(f"  {ds.get('id')}: {ds.get('name')}, active={ds.get('is_active')}")

# --- Governance ---
status, d = check(f"{BASE}/governance", "governance")
print(f"\n[GOVERNANCE] status={status}")
audit = d.get("audit", {})
print(f"  data_quality_score: {audit.get('data_quality_score')}")
print(f"  quality_dimensions: {len(audit.get('quality_dimensions', []))}")
print(f"  total_customers: {audit.get('total_customers')}")
print(f"  total_transactions: {audit.get('total_transactions')}")
gt_cust = GROUND_TRUTH['customers']
gt_txn  = GROUND_TRUTH['transactions']
api_cust = audit.get('total_customers', 0)
api_txn  = audit.get('total_transactions', 0)
print(f"  customers: {api_cust} [GT:{gt_cust}] {'OK' if api_cust == gt_cust else 'MISMATCH'}")
print(f"  transactions: {api_txn} [GT:{gt_txn}] {'OK' if api_txn == gt_txn else 'MISMATCH'}")

print("\n" + "=" * 70)
print("AUDIT COMPLETE")
print("=" * 70)
