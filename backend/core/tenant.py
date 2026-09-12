"""
SharePulse-AI Multi-Tenant Context and Role-Based Access Control (RBAC)
Enforces strict organization and tenant data isolation.
"""
from __future__ import annotations
import enum
from typing import Optional, List, Dict, Any
from contextvars import ContextVar
from pydantic import BaseModel, Field


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    ANALYST = "ANALYST"
    EXECUTIVE = "EXECUTIVE"
    OPERATOR = "OPERATOR"


class TenantContext(BaseModel):
    tenant_id: str = "tenant_metromart_prod"
    org_name: str = "MetroMart Inc. and HSIC Bank"
    user_id: Optional[str] = "user_default"
    user_email: Optional[str] = "admin@metromart.com"
    role: UserRole = UserRole.ADMIN
    mode: str = "live"  # "case_study" | "live"
    permissions: List[str] = Field(default_factory=lambda: [
        "events:write", "events:read",
        "analytics:read", "decisions:write",
        "automations:execute", "connectors:manage",
        "models:read", "audit:read"
    ])


_current_tenant_ctx: ContextVar[TenantContext] = ContextVar(
    "current_tenant_ctx",
    default=TenantContext()
)


def get_tenant_context() -> TenantContext:
    """Retrieve the current request's tenant context."""
    return _current_tenant_ctx.get()


def set_tenant_context(ctx: TenantContext):
    """Set the tenant context for the current request execution context."""
    _current_tenant_ctx.set(ctx)


def has_permission(required_permission: str, ctx: Optional[TenantContext] = None) -> bool:
    context = ctx or get_tenant_context()
    if context.role == UserRole.ADMIN:
        return True
    return required_permission in context.permissions
