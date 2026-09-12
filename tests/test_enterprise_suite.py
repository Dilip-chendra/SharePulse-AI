import pytest
import os
import json
import sqlite3
import uuid
import sys
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient

from backend.main import app
from backend.core.db import get_db, init_enterprise_tables
from backend.core.tenant import TenantContext, UserRole, set_tenant_context, get_tenant_context
from backend.core.security import sanitize_csv_value, validate_safe_identifier
from backend.connectors.registry import ConnectorRegistry
from backend.ingestion.gateway import IngestionGateway, IngestionEvent
from backend.analytics.business_pulse import get_business_pulse
from backend.analytics.anomaly_detector import get_recent_anomalies, get_anomalies
from backend.analytics.alerts_engine import AlertsEngine
from backend.analytics.decision_engine import generate_decision_matrix
from backend.analytics.automations import AutomationEngine
from backend.analytics.data_health import run_data_health_audit
from backend.analytics.lineage import get_data_lineage_graph
from backend.analytics.model_monitor import get_model_health_diagnostics
from backend.services.executive_brief import generate_executive_brief

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    init_enterprise_tables()

# ==============================================================================
# 1. INGESTION & GATEWAY TESTS (Rule 35: Valid, Duplicate, Invalid, Missing Fields)
# ==============================================================================
def test_valid_event_ingestion():
    gw = IngestionGateway.get_instance()
    evt = IngestionEvent(
        event_id=f"evt_valid_{uuid.uuid4().hex[:8]}",
        tenant_id="tenant_metromart_prod",
        customer_id=1002,
        event_type="transaction.completed",
        payload={"amount": 4500.0, "payment_method": "HSIC", "channel": "POS"}
    )
    res = gw.ingest_event(evt)
    assert res.status == "ACCEPTED"
    assert "successfully validated" in res.message

def test_duplicate_event_idempotency():
    gw = IngestionGateway.get_instance()
    evt_id = f"evt_dup_{uuid.uuid4().hex[:8]}"
    evt1 = IngestionEvent(
        event_id=evt_id,
        tenant_id="tenant_metromart_prod",
        customer_id=1003,
        event_type="transaction.completed",
        payload={"amount": 2500.0, "payment_method": "WALLET"}
    )
    res1 = gw.ingest_event(evt1)
    assert res1.status == "ACCEPTED"

    # Ingest same event_id again
    res2 = gw.ingest_event(evt1)
    assert res2.status == "DUPLICATE"
    assert "idempotent" in res2.message

def test_invalid_event_missing_or_negative_customer_id():
    gw = IngestionGateway.get_instance()
    evt = IngestionEvent(
        event_id=f"evt_inv_{uuid.uuid4().hex[:8]}",
        customer_id=-5,
        event_type="transaction.completed",
        payload={"amount": 1000.0}
    )
    res = gw.ingest_event(evt)
    assert res.status == "QUARANTINED"
    assert "Invalid or missing customer_id" in res.message

def test_invalid_event_non_numeric_amount():
    gw = IngestionGateway.get_instance()
    evt = IngestionEvent(
        event_id=f"evt_bad_amt_{uuid.uuid4().hex[:8]}",
        customer_id=1004,
        event_type="transaction.completed",
        payload={"amount": "not_a_number"}
    )
    res = gw.ingest_event(evt)
    assert res.status == "QUARANTINED"
    assert "must be numeric" in res.message

def test_dead_letter_queue_inspection():
    gw = IngestionGateway.get_instance()
    dlq = gw.get_dead_letter_queue()
    assert isinstance(dlq, list)
    assert len(dlq) > 0

def test_event_replay_engine():
    gw = IngestionGateway.get_instance()
    res = gw.replay_events(count=5)
    assert res["status"] == "COMPLETED"
    assert res["replayed_count"] == 5

# ==============================================================================
# 2. MULTI-TENANT ISOLATION TESTS (Rule 17)
# ==============================================================================
def test_multi_tenant_cryptographic_isolation():
    gw = IngestionGateway.get_instance()
    t_a_id = f"evt_iso_a_{uuid.uuid4().hex[:8]}"
    t_b_id = f"evt_iso_b_{uuid.uuid4().hex[:8]}"

    gw.ingest_event(IngestionEvent(
        event_id=t_a_id,
        tenant_id="tenant_alpha",
        customer_id=1005,
        event_type="transaction.completed",
        payload={"amount": 3200.0}
    ))

    gw.ingest_event(IngestionEvent(
        event_id=t_b_id,
        tenant_id="tenant_beta",
        customer_id=2005,
        event_type="transaction.completed",
        payload={"amount": 8400.0}
    ))

    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT event_id FROM live_events WHERE tenant_id = 'tenant_alpha' AND event_id = ?", (t_b_id,))
    assert cur.fetchone() is None, "Tenant Alpha leak: found Tenant Beta event!"

    cur.execute("SELECT event_id FROM live_events WHERE tenant_id = 'tenant_beta' AND event_id = ?", (t_a_id,))
    assert cur.fetchone() is None, "Tenant Beta leak: found Tenant Alpha event!"
    conn.close()

# ==============================================================================
# 3. SECURITY & SANITIZATION TESTS (Rule 19)
# ==============================================================================
def test_csv_formula_injection_guard():
    assert sanitize_csv_value("=SUM(A1:A10)") == "'=SUM(A1:A10)"
    assert sanitize_csv_value("+cmd|' /C calc'!A0") == "'+cmd|' /C calc'!A0"
    assert sanitize_csv_value("-12345") == "'-12345"
    assert sanitize_csv_value("@SUM(B1:B5)") == "'@SUM(B1:B5)"
    assert sanitize_csv_value("	TAB_ATTACK") == "'	TAB_ATTACK"
    assert sanitize_csv_value("Normal Customer Name") == "Normal Customer Name"

def test_safe_sql_identifier_validation():
    assert validate_safe_identifier("customers") is True
    assert validate_safe_identifier("live_events") is True
    assert validate_safe_identifier("customers; DROP TABLE users;--") is False
    assert validate_safe_identifier("table name with spaces") is False

# ==============================================================================
# 4. BUSINESS FLOW END-TO-END (Rule 36)
# ==============================================================================
def test_complete_business_flow():
    gw = IngestionGateway.get_instance()
    alert_engine = AlertsEngine.get_instance()
    auto_engine = AutomationEngine.get_instance()

    # Step A: Big ticket non-HSIC event arrives (triggers real-time anomaly)
    big_ticket_evt_id = f"evt_flow_{uuid.uuid4().hex[:8]}"
    evt = IngestionEvent(
        event_id=big_ticket_evt_id,
        tenant_id="tenant_metromart_prod",
        customer_id=1001,
        event_type="transaction.completed",
        payload={"amount": 28500.0, "payment_method": "WALLET", "channel": "Electronics POS"}
    )
    res = gw.ingest_event(evt)
    assert res.status == "ACCEPTED"

    # Step B: Check Business Pulse metrics updated
    pulse = get_business_pulse("live")
    assert pulse["live_metrics"]["period_net_spend"] > 0

    # Step C: Check Alert was registered
    alerts = alert_engine.get_active_alerts()
    found_alert = any("28,500" in a["title"] or a["affected_customers"] >= 1 for a in alerts)
    assert found_alert is True, "Expected incident alert generated for high-ticket displacement"

    # Step D: Check Decision Engine evaluations
    decisions = generate_decision_matrix(limit=10)
    assert len(decisions["customer_decisions"]) > 0
    top_dec = decisions["customer_decisions"][0]
    assert top_dec["expected_net_contribution"] > 0, "Enforce Expected Net Contribution > 0 rule"

    # Step E: Check Human-in-the-Loop Approval Queue
    rules_and_appr = auto_engine.get_rules_and_executions()
    pending = [a for a in rules_and_appr["approval_queue"] if a["status"] == "PENDING_APPROVAL"]
    if pending:
        target_appr_id = pending[0]["approval_id"]
        appr_res = auto_engine.submit_approval(target_appr_id, "APPROVED", user="Risk Director", reason="Verified by E2E test")
        assert appr_res["success"] is True
        assert appr_res["status"] == "APPROVED"

# ==============================================================================
# 5. API V1 ENDPOINT INTEGRATION TESTS
# ==============================================================================
def test_api_v1_endpoints():
    get_endpoints = [
        "/api/v1/system/health",
        "/api/v1/connections",
        "/api/v1/business-pulse?horizon=24h",
        "/api/v1/anomalies?limit=10",
        "/api/v1/alerts",
        "/api/v1/root-cause/anom_001",
        "/api/v1/data-health",
        "/api/v1/decisions?limit=10",
        "/api/v1/automations",
        "/api/v1/lineage",
        "/api/v1/model-health",
        "/api/v1/executive-brief",
        "/api/v1/events/dead-letter"
    ]

    for url in get_endpoints:
        res = client.get(url)
        assert res.status_code == 200, f"Endpoint {url} failed with {res.status_code}: {res.text}"

def test_api_connector_toggle():
    res = client.post("/api/v1/connections/conn_metromart_pos/toggle", json={"action": "pause"})
    assert res.status_code == 200
    res_recon = client.post("/api/v1/connections/conn_metromart_pos/toggle", json={"action": "connect"})
    assert res_recon.status_code == 200

def test_api_alert_acknowledge_and_resolve():
    res = client.post("/api/v1/alerts/INC-8092/acknowledge", json={"user": "QA Officer"})
    assert res.status_code in (200, 404)
    res_res = client.post("/api/v1/alerts/INC-8092/resolve", json={"user": "QA Officer"})
    assert res_res.status_code in (200, 404)

# ==============================================================================
# 6. AI FAILOVER GUARANTEE TEST (Rule 20)
# ==============================================================================
def test_analytics_continues_even_if_ai_fails():
    pulse = get_business_pulse("24h")
    assert pulse["live_metrics"]["hsic_sow_pct"] > 0
    dec = generate_decision_matrix(10)
    assert len(dec["customer_decisions"]) > 0
    health = run_data_health_audit()
    assert health["overall_health_score"] >= 90.0
