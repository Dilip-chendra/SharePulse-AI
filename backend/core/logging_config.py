"""
Enterprise Structured JSON Logging and Request Tracing
"""
from __future__ import annotations
import logging
import json
import time
from datetime import datetime
from typing import Any, Dict
from contextvars import ContextVar

request_id_ctx: ContextVar[str] = ContextVar("request_id", default="-")
tenant_id_ctx: ContextVar[str] = ContextVar("tenant_id", default="tenant_metromart_prod")


class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": datetime.fromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id_ctx.get(),
            "tenant_id": tenant_id_ctx.get(),
        }
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)


def setup_structured_logging():
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    root_logger = logging.getLogger("sharepulse")
    root_logger.setLevel(logging.INFO)
    if not any(isinstance(h, logging.StreamHandler) for h in root_logger.handlers):
        root_logger.addHandler(handler)
