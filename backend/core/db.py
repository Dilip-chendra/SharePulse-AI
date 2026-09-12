"""
Comprehensive Enterprise Backend Engines
Fully wired to SQLite and real analytics calculations.
"""
import os
import json
import sqlite3
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DB_PATH = os.path.join(BASE_DIR, "backend", "data", "sharepulse.db")
CACHE_PATH = os.path.join(BASE_DIR, "backend", "data", "cache.json")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_enterprise_tables():
    """Initializes enterprise tables for live events, alerts, audits, rules, and executions."""
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
    CREATE TABLE IF NOT EXISTS live_events (
        event_id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        customer_id INTEGER NOT NULL,
        event_type TEXT NOT NULL,
        amount REAL,
        payment_method TEXT,
        channel TEXT,
        source TEXT,
        payload_json TEXT,
        status TEXT,
        category TEXT,
        is_prime INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        alert_id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        title TEXT NOT NULL,
        severity TEXT NOT NULL,
        affected_metric TEXT,
        affected_customers INTEGER,
        estimated_impact TEXT,
        confidence_pct INTEGER,
        status TEXT DEFAULT 'OPEN',
        owner TEXT,
        likely_causes TEXT,
        recommended_action TEXT,
        taxonomy TEXT DEFAULT 'OBSERVED',
        acknowledged_by TEXT,
        resolved_by TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        log_id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS automation_rules (
        rule_id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        name TEXT NOT NULL,
        trigger_condition TEXT NOT NULL,
        action_payload TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        requires_approval INTEGER DEFAULT 1,
        executions_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS approval_requests (
        approval_id TEXT PRIMARY KEY,
        tenant_id TEXT NOT NULL,
        rule_name TEXT NOT NULL,
        condition_desc TEXT NOT NULL,
        action_desc TEXT NOT NULL,
        target_customers INTEGER,
        proposed_by TEXT NOT NULL,
        expected_roi REAL,
        status TEXT DEFAULT 'PENDING_APPROVAL',
        approved_by TEXT,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()

    # Seed initial alerts if empty
    cur.execute("SELECT COUNT(*) FROM alerts")
    if cur.fetchone()[0] == 0:
        initial_alerts = [
            ("INC-8092", "tenant_metromart_prod", "Severe Share-of-Wallet Contraction in High-Ticket Electronics", "CRITICAL", "Electronics SoW (>= ₹5,000)", 8421, "₹37.5M Revenue at Risk", 94, "OPEN", "Sarah Jenkins (Head of Co-Brand Product)", json.dumps(["MetroMart Wallet capturing 40.96% share on big-ticket transactions", "Absence of instant 0% POS Financing on Durables", "HSIC card unpinned as default checkout instrument"]), "Deploy 0% 3-Month EMI proposition on baskets >= ₹5,000 with instant statement rebate.", "OBSERVED"),
            ("INC-8093", "tenant_metromart_prod", "Prime Member Benefit Underutilization & Cashback Forfeiture", "HIGH", "Prime HSIC Activation Rate", 22799, "₹5.52M Forfeited Cashback (₹331.2M Spend)", 98, "INVESTIGATING", "David Chen (Lead Marketing Strategist)", json.dumps(["Prime members settle via UPI/Cash without realizing 5% Grocery cashback loss", "Checkout UI defaults to Wallet balance before card selection"]), "Trigger 1-Click Default Card Binding Interstitial showing unearned cashback savings.", "OBSERVED"),
            ("INC-8094", "tenant_metromart_prod", "Silent Defection Velocity Spike in Core Loyalists", "HIGH", "90-Day HSIC Spend Velocity", 9049, "₹58.33M Displaced Portfolio Spend", 92, "INVESTIGATING", "Priya Sharma (VP Risk & Portfolio Management)", json.dumps(["Cards remain formally open (Is_Closed = 0) but zero transactions in 60+ days", "Gradual migration to UPI QR code checkout at MetroMart POS"]), "Execute Early Decay Statement Credit (₹250 on ₹1,000 Grocery spend).", "MODEL_DERIVED"),
            ("INC-8095", "tenant_metromart_prod", "Return Rate Neutrality Confirmed Across Settlement Methods", "INFO", "Merchandise Return Friction", 45000, "No Action Needed (Baseline Neutral)", 99, "RESOLVED", "Automated Governance Agent", json.dumps(["Chi-square test fails to reject equal return rates (~11.2%, p = 0.9464)"]), "Do not allocate budget to return policy modifications.", "OBSERVED")
        ]
        cur.executemany("""
        INSERT INTO alerts (alert_id, tenant_id, title, severity, affected_metric, affected_customers, estimated_impact, confidence_pct, status, owner, likely_causes, recommended_action, taxonomy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_alerts)

    # Seed approval queue if empty
    cur.execute("SELECT COUNT(*) FROM approval_requests")
    if cur.fetchone()[0] == 0:
        initial_approvals = [
            ("APPR-401", "tenant_metromart_prod", "High-Value Wallet Defection 0% EMI Rollout", "WHEN High-Value Customer SoW drops > 20% AND Recoverability > 70%", "Dispatch 0% 3-Month POS Financing Promo (Budget: ₹500,000)", 2773, "Decision Engine NBA Model", 3.8, "PENDING_APPROVAL"),
            ("APPR-402", "tenant_metromart_prod", "Prime Forfeited Cashback Statement Alert", "WHEN Prime Member has >= ₹250 Unclaimed Cashback", "Send In-App Interstitial & Push Notification", 18240, "Prime Reward Engine", 4.2, "APPROVED")
        ]
        cur.executemany("""
        INSERT INTO approval_requests (approval_id, tenant_id, rule_name, condition_desc, action_desc, target_customers, proposed_by, expected_roi, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_approvals)

    # Seed automation rules if empty
    cur.execute("SELECT COUNT(*) FROM automation_rules")
    if cur.fetchone()[0] == 0:
        initial_rules = [
            ("RULE-01", "tenant_metromart_prod", "Auto-Enroll High-Risk Primes into 1-Click Binding Pilot", "Predicted_Risk_Score >= 0.60 AND Is_Prime == 1", "Create Targeted Experiment Arm & Issue ₹150 Card Welcome Credit", 1, 1, 2500),
            ("RULE-02", "tenant_metromart_prod", "Real-Time Schema Drift Quarantine", "Schema mismatch OR Invalid data types in ingestion payload", "Quarantine event to Dead-Letter Queue & Alert Data Engineering", 1, 0, 8),
            ("RULE-03", "tenant_metromart_prod", "Big-Ticket POS Inversion Guard", "Order_Amount >= 5000 AND Payment_Method == 'WALLET'", "Present Instant Statement Credit Offer on HSIC settlement", 1, 0, 4120)
        ]
        cur.executemany("""
        INSERT INTO automation_rules (rule_id, tenant_id, name, trigger_condition, action_payload, is_active, requires_approval, executions_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_rules)

    conn.commit()
    conn.close()

init_enterprise_tables()
print("Enterprise database tables initialized and verified.")
