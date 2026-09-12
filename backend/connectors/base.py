"""
Base Connector Abstraction
Every data connector (REST, Webhook, Postgres, Kafka, CSV, SFTP) extends this interface.
"""
from __future__ import annotations
import abc
import enum
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class ConnectorStatus(str, enum.Enum):
    CONNECTED = "CONNECTED"
    CONNECT = "CONNECT"
    PAUSED = "PAUSED"
    ERROR = "ERROR"
    DEGRADED = "DEGRADED"


class ConnectorMetrics(BaseModel):
    events_per_minute: float = 0.0
    events_today: int = 0
    latency_ms: float = 0.0
    data_quality_score: float = 100.0
    error_rate_pct: float = 0.0
    last_event_time: Optional[datetime] = None


class BaseConnector(abc.ABC):
    def __init__(self, connector_id: str, name: str, source_type: str, config: Optional[Dict[str, Any]] = None):
        self.connector_id = connector_id
        self.name = name
        self.source_type = source_type
        self.config = config or {}
        self.status = ConnectorStatus.CONNECT
        self.metrics = ConnectorMetrics()
        self.created_at = datetime.now()

    @abc.abstractmethod
    def connect(self) -> bool:
        """Establish connection to upstream provider."""
        pass

    @abc.abstractmethod
    def disconnect(self) -> bool:
        """Gracefully terminate connection."""
        pass

    @abc.abstractmethod
    def test_connection(self) -> Dict[str, Any]:
        """Perform ping / handshake test."""
        pass

    @abc.abstractmethod
    def fetch_events(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Fetch batch of events from upstream."""
        pass

    def get_info(self) -> Dict[str, Any]:
        last_str = self.metrics.last_event_time.isoformat() if self.metrics.last_event_time else "Never"
        return {
            "connector_id": self.connector_id,
            "name": self.name,
            "source_type": self.source_type,
            "status": self.status.value,
            "events_per_minute": round(self.metrics.events_per_minute, 1),
            "events_today": self.metrics.events_today,
            "latency_ms": round(self.metrics.latency_ms, 1),
            "data_quality_score": round(self.metrics.data_quality_score, 1),
            "error_rate_pct": round(self.metrics.error_rate_pct, 2),
            "last_event_time": last_str,
            "schema_version": self.config.get("schema_version", "v2.1"),
        }
