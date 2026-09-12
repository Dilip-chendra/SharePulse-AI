import os
import json
import sqlite3
import pytest
import pandas as pd
import numpy as np
from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_overview_endpoint():
    response = client.get("/api/overview")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert "executive_narrative" in data
    assert data["kpis"]["overall_sow_pct"] > 0
    assert data["kpis"]["fy25_sow_pct"] > data["kpis"]["fy26_sow_pct"]

def test_sow_business_rules():
    response = client.get("/api/sow")
    assert response.status_code == 200
    data = response.json()
    assert "fiscal_years" in data
    assert len(data["fiscal_years"]) == 2
    # Verify FY25 vs FY26 collapse
    fy25 = next(f for f in data["fiscal_years"] if f["fiscal_year"] == "FY25")
    fy26 = next(f for f in data["fiscal_years"] if f["fiscal_year"] == "FY26")
    assert fy25["sow_pct"] > fy26["sow_pct"]
    assert fy25["returns_amount"] > 0

def test_multi_model_benchmarking():
    response = client.get("/api/explainability")
    assert response.status_code == 200
    data = response.json()
    assert "model_benchmark" in data
    benchmarks = data["model_benchmark"]
    assert len(benchmarks) >= 3
    model_names = [b["model_name"] for b in benchmarks]
    assert "Hist Gradient Boosting" in model_names or "Random Forest Classifier" in model_names
    assert "Logistic Regression (L2)" in model_names
    # Check that each model has valid empirical metrics
    for b in benchmarks:
        assert 0.5 <= b["test_roc_auc"] <= 1.0
        assert 0.0 <= b["brier_score_loss"] <= 1.0
        assert "cv_roc_auc_mean" in b

def test_cluster_optimization_validation():
    response = client.get("/api/segmentation")
    assert response.status_code == 200
    data = response.json()
    assert "k_validation_benchmark" in data
    k_benchmarks = data["k_validation_benchmark"]
    assert len(k_benchmarks) >= 7 # k=2 to 8
    k_values = [kb["k"] for kb in k_benchmarks]
    assert k_values == [2, 3, 4, 5, 6, 7, 8]
    assert "segments" in data
    assert len(data["segments"]) == 5

def test_ai_discovered_insights_taxonomy():
    response = client.get("/api/insights")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 6
    taxonomies = set(ins["taxonomy"] for ins in data)
    assert "OBSERVED" in taxonomies
    assert "MODEL_DERIVED" in taxonomies
    for ins in data:
        assert "statistical_evidence" in ins
        assert "business_impact" in ins

def test_customers_pagination_and_search():
    response = client.get("/api/customers?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert len(data["customers"]) == 10
    assert data["total_count"] > 30000
    
    first_cust_id = data["customers"][0]["Customer_ID"]
    detail_res = client.get(f"/api/customers/{first_cust_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["profile"]["Customer_ID"] == first_cust_id
    assert len(detail["risk_drivers"]) > 0

def test_simulation_endpoint():
    payload = {
        "budget": 500000.0,
        "target_segment": "All",
        "incentive_rate": 0.03,
        "conversion_rate_multiplier": 1.0
    }
    response = client.post("/api/simulation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["simulated"] is True
    assert data["targeted_customers_count"] > 0
    assert data["expected_recovered_spend"] > 0
    assert data["expected_roi"] > 0

def test_ai_analyst_chat():
    payload = {"message": "Why is SoW declining?"}
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Response must have reply field with non-empty content
    assert "reply" in data
    assert len(data["reply"]) > 20
    # Provider field indicates which LLM (or deterministic fallback) responded
    assert "provider" in data
    # Reply must mention SoW-related numerical data (from grounded analytics context)
    reply_lower = data["reply"].lower()
    assert any(term in reply_lower for term in ["sow", "share", "wallet", "19", "28", "9.4", "decline", "attrition"])
    # Timestamp must be present
    assert "timestamp" in data

def test_governance_and_audit():
    response = client.get("/api/governance")
    assert response.status_code == 200
    data = response.json()
    assert data["audit"]["data_quality_score"] == 100.0
    assert len(data["audit"]["quality_dimensions"]) == 5
    assert len(data["governance_rules"]) >= 4
    assert "taxonomy" in data
