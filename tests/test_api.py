import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "healthy"

def test_system_status_endpoint():
    resp = client.get("/api/system/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "backend" in data
    assert "database" in data
    assert "analytics_cache" in data
    assert "ai_gateway" in data

def test_overview_endpoint():
    resp = client.get("/api/overview")
    assert resp.status_code == 200
    data = resp.json()
    assert "kpis" in data
    assert "executive_narrative" in data
    assert "monthly_trend" in data
    assert "payment_mix" in data

def test_sow_endpoint():
    resp = client.get("/api/sow")
    assert resp.status_code == 200
    data = resp.json()
    assert "overall" in data
    assert "monthly_trend" in data

def test_attrition_endpoint():
    resp = client.get("/api/attrition")
    assert resp.status_code == 200
    data = resp.json()
    assert "state_summary" in data
    assert "silent_defectors" in data

def test_segmentation_endpoint():
    resp = client.get("/api/segmentation")
    assert resp.status_code == 200
    data = resp.json()
    assert "selected_k" in data
    assert "segments" in data

def test_return_analysis_endpoint():
    resp = client.get("/api/return-analysis")
    assert resp.status_code == 200
    data = resp.json()
    assert "chi_square_test" in data

def test_big_ticket_endpoint():
    resp = client.get("/api/big-ticket")
    assert resp.status_code == 200
    data = resp.json()
    assert "tiers" in data

def test_reward_analysis_endpoint():
    resp = client.get("/api/reward-analysis")
    assert resp.status_code == 200
    data = resp.json()
    assert "cashback_forfeiture" in data

def test_customers_pagination():
    resp = client.get("/api/customers?page=1&page_size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert data["page"] == 1
    assert data["page_size"] == 10
    assert len(data["customers"]) == 10

def test_customer_search_and_detail():
    resp = client.get("/api/customers?page=1&page_size=1")
    assert resp.status_code == 200
    first_cust = resp.json()["customers"][0]
    cust_id = first_cust["Customer_ID"]

    detail_resp = client.get(f"/api/customers/{cust_id}")
    assert detail_resp.status_code == 200
    detail_data = detail_resp.json()
    assert "profile" in detail_data
    assert "risk_drivers" in detail_data

def test_simulation_negative_budget_rejection():
    # Negative budget should return 400 Bad Request
    resp = client.post("/api/simulation", json={
        "budget": -5000,
        "incentive_rate": 0.05,
        "conversion_rate_multiplier": 1.0
    })
    assert resp.status_code == 400

def test_simulation_valid_execution():
    resp = client.post("/api/simulation", json={
        "budget": 500000,
        "incentive_rate": 0.05,
        "conversion_rate_multiplier": 1.0
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["simulated"] is True
    assert data["targeted_customers_count"] > 0
    assert "expected_net_value" in data
    assert "expected_roi" in data

def test_csv_exports_sanitization():
    for export_type in ["customers", "risk-scores", "segments", "opportunities"]:
        resp = client.get(f"/api/export/{export_type}")
        assert resp.status_code == 200
        assert resp.headers["content-type"] == "text/csv; charset=utf-8"
        content = resp.text
        # Ensure no dangerous unquoted formula injections at start of lines
        lines = content.splitlines()
        for line in lines[1:50]:
            first_char = line.strip()[:1]
            assert first_char not in ("=", "+", "@")
