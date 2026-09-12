"""
Enterprise Alerts & Incident Management Center
Backed by SQLite alerts table with full acknowledge/resolve support.
"""
from __future__ import annotations
import json
import sqlite3
from typing import Dict, Any, List, Optional
from datetime import datetime
from backend.core.db import get_db

class AlertsEngine:
    _instance: Optional[AlertsEngine] = None

    @classmethod
    def get_instance(cls) -> AlertsEngine:
        if cls._instance is None:
            cls._instance = AlertsEngine()
        return cls._instance

    def get_active_alerts(self) -> List[Dict[str, Any]]:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
        SELECT alert_id, title, severity, affected_metric, affected_customers, estimated_impact, 
               confidence_pct, status, owner, likely_causes, recommended_action, taxonomy, created_at
        FROM alerts ORDER BY CASE severity WHEN 'CRITICAL' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'MEDIUM' THEN 3 ELSE 4 END, created_at DESC
        """)
        rows = cur.fetchall()
        alerts = []
        for r in rows:
            causes = []
            try:
                causes = json.loads(r["likely_causes"]) if r["likely_causes"] else []
            except Exception:
                causes = [r["likely_causes"]] if r["likely_causes"] else []
                
            alerts.append({
                "id": r["alert_id"],
                "title": r["title"],
                "severity": r["severity"],
                "affected_metric": r["affected_metric"],
                "affected_customers": r["affected_customers"],
                "estimated_impact": r["estimated_impact"],
                "confidence_pct": r["confidence_pct"],
                "status": r["status"],
                "owner": r["owner"],
                "likely_causes": causes,
                "recommended_action": r["recommended_action"],
                "taxonomy": r["taxonomy"],
                "detected_time": str(r["created_at"])
            })
        conn.close()
        return alerts

    def acknowledge_alert(self, alert_id: str, user: str = "Admin") -> Optional[Dict[str, Any]]:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
        UPDATE alerts 
        SET status = 'INVESTIGATING', acknowledged_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE alert_id = ?
        """, (user, alert_id))
        conn.commit()
        
        cur.execute("SELECT * FROM alerts WHERE alert_id = ?", (alert_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return None
        return {"success": True, "alert_id": alert_id, "status": "INVESTIGATING", "acknowledged_by": user}

    def resolve_alert(self, alert_id: str, user: str = "Admin") -> Optional[Dict[str, Any]]:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
        UPDATE alerts 
        SET status = 'RESOLVED', resolved_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE alert_id = ?
        """, (user, alert_id))
        conn.commit()
        
        cur.execute("SELECT * FROM alerts WHERE alert_id = ?", (alert_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return None
        return {"success": True, "alert_id": alert_id, "status": "RESOLVED", "resolved_by": user}

def get_alerts() -> Dict[str, Any]:
    alerts = AlertsEngine.get_instance().get_active_alerts()
    return {
        "total_open_incidents": len([a for a in alerts if a["status"] in ("OPEN", "INVESTIGATING")]),
        "critical_count": len([a for a in alerts if a["severity"] == "CRITICAL"]),
        "high_count": len([a for a in alerts if a["severity"] == "HIGH"]),
        "alerts": alerts,
        "last_updated": datetime.now().isoformat()
    }
