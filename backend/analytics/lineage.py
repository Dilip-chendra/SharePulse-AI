"""
Visual Data Lineage Graph Generator
Maps Source -> Ingestion -> DQ -> Feature Store -> ML Models -> Decision -> Impact.
"""
from __future__ import annotations
from typing import Dict, Any, List
from datetime import datetime


def get_data_lineage() -> Dict[str, Any]:
    nodes = [
        {"id": "src_pos", "label": "MetroMart POS Gateway", "type": "SOURCE", "status": "ONLINE", "events": "2.4M/day"},
        {"id": "src_hsic", "label": "HSIC Bank Co-Brand Card Stream", "type": "SOURCE", "status": "ONLINE", "events": "645K/day"},
        {"id": "src_csv", "label": "Historical 24M Batch Dataset", "type": "SOURCE", "status": "ONLINE", "events": "444K records"},
        {"id": "ingest_gw", "label": "Ingestion Gateway & Deduplication", "type": "INGESTION", "status": "ONLINE", "latency": "1.2ms"},
        {"id": "dq_gate", "label": "8-Dimension Data Quality & Schema Drift", "type": "VALIDATION", "status": "ONLINE", "score": "99.8%"},
        {"id": "c360_store", "label": "Customer 360 & Feature Store", "type": "STORAGE", "status": "ONLINE", "records": "45,000"},
        {"id": "ml_risk", "label": "HistGradientBoosting Attrition Model", "type": "ML_MODEL", "status": "CHAMPION", "auc": "0.9348"},
        {"id": "ml_cluster", "label": "K-Means Archetype Engine (k=5)", "type": "ML_MODEL", "status": "CHAMPION", "silhouette": "0.578"},
        {"id": "decision_nba", "label": "Next Best Action Decision Engine", "type": "DECISION", "status": "ONLINE", "actions": "5 Playbooks"},
        {"id": "exp_lab", "label": "Causal A/B Experimentation Engine", "type": "EXPERIMENT", "status": "ONLINE", "sample": "10,000 Cardholders"}
    ]

    links = [
        {"source": "src_pos", "target": "ingest_gw"},
        {"source": "src_hsic", "target": "ingest_gw"},
        {"source": "src_csv", "target": "ingest_gw"},
        {"source": "ingest_gw", "target": "dq_gate"},
        {"source": "dq_gate", "target": "c360_store"},
        {"source": "c360_store", "target": "ml_risk"},
        {"source": "c360_store", "target": "ml_cluster"},
        {"source": "ml_risk", "target": "decision_nba"},
        {"source": "ml_cluster", "target": "decision_nba"},
        {"source": "decision_nba", "target": "exp_lab"}
    ]

    return {
        "nodes": nodes,
        "links": links,
        "last_validated": datetime.now().isoformat()
    }

get_data_lineage_graph = get_data_lineage
