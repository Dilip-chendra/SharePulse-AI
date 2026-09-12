"""
Automations & Human-in-the-Loop Governance Engine
Policy rules engine + Approval queue for high-impact interventions.
"""
from __future__ import annotations
import sqlite3
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.core.db import get_db

class AutomationEngine:
    _instance: Optional[AutomationEngine] = None

    @classmethod
    def get_instance(cls) -> AutomationEngine:
        if cls._instance is None:
            cls._instance = AutomationEngine()
        return cls._instance

    def get_rules_and_executions(self) -> Dict[str, Any]:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT rule_id, name, trigger_condition, action_payload, is_active, requires_approval, executions_count FROM automation_rules")
        rules_rows = cur.fetchall()
        rules = []
        for r in rules_rows:
            rules.append({
                "id": r["rule_id"],
                "name": r["name"],
                "trigger": r["trigger_condition"],
                "action": r["action_payload"],
                "active": bool(r["is_active"]),
                "requires_approval": bool(r["requires_approval"]),
                "executions_count": r["executions_count"],
                "governance_mode": "HUMAN_APPROVAL_REQUIRED" if r["requires_approval"] else "AUTOMATIC"
            })

        cur.execute("SELECT approval_id, rule_name, condition_desc, action_desc, target_customers, proposed_by, expected_roi, status, approved_by, created_at FROM approval_requests ORDER BY created_at DESC")
        appr_rows = cur.fetchall()
        approval_queue = []
        for a in appr_rows:
            approval_queue.append({
                "approval_id": a["approval_id"],
                "rule_name": a["rule_name"],
                "condition": a["condition_desc"],
                "action": a["action_desc"],
                "target_customers": a["target_customers"],
                "proposed_by": a["proposed_by"],
                "expected_roi": a["expected_roi"],
                "status": a["status"],
                "approved_by": a["approved_by"],
                "created_at": str(a["created_at"])
            })
        conn.close()

        return {
            "rules": rules,
            "approval_queue": approval_queue,
            "audit_policy": "Strict Immutable Append-Only Ledger with Operator Attestation"
        }

    def toggle_rule(self, rule_id: str, enabled: bool) -> Dict[str, Any]:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE automation_rules SET is_active = ? WHERE rule_id = ?", (1 if enabled else 0, rule_id))
        conn.commit()
        cur.execute("SELECT * FROM automation_rules WHERE rule_id = ?", (rule_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"success": False, "error": f"Rule {rule_id} not found"}
        return {"success": True, "rule_id": rule_id, "is_active": enabled}

    def submit_approval(self, request_id: str, decision: str, user: str = "Admin", reason: Optional[str] = None) -> Dict[str, Any]:
        status = "APPROVED" if decision.upper() == "APPROVED" else "REJECTED"
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
        UPDATE approval_requests 
        SET status = ?, approved_by = ?, reason = ?, updated_at = CURRENT_TIMESTAMP
        WHERE approval_id = ?
        """, (status, user, reason, request_id))
        conn.commit()
        
        cur.execute("""
        INSERT INTO audit_logs (log_id, tenant_id, user_id, action, resource_type, resource_id, details)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (f"log_{datetime.now().strftime('%Y%m%d%H%M%S')}", "tenant_metromart_prod", user, f"APPROVAL_{status}", "AUTOMATION_RULE", request_id, f"Decision: {status}, Reason: {reason}"))
        conn.commit()
        
        cur.execute("SELECT * FROM approval_requests WHERE approval_id = ?", (request_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return {"success": False, "error": f"Approval request {request_id} not found"}
        return {"success": True, "approval_id": request_id, "status": status, "reviewed_by": user}

def get_automations() -> Dict[str, Any]:
    return AutomationEngine.get_instance().get_rules_and_executions()
