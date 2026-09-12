import pytest
import asyncio
from backend.services.ai_gateway import generate_analysis, _deterministic_fallback

@pytest.mark.asyncio
async def test_deterministic_fallback():
    context = '{"kpis": {"overall_sow_pct": 23.78, "sow_collapse_pp": -9.43, "revenue_at_risk": 71000000}}'
    resp = _deterministic_fallback("Why did HSIC SoW decline?", context)
    assert isinstance(resp, str)
    assert len(resp) > 50
    assert "OBSERVED" in resp or "Share-of-Wallet" in resp

@pytest.mark.asyncio
async def test_ai_gateway_failover_resilience():
    # Test that even with empty/invalid keys, generate_analysis never raises an unhandled exception
    context = '{"kpis": {"overall_sow_pct": 23.78}}'
    result = await generate_analysis("Explain the decline in HSIC spend", context, complexity="simple")
    assert "response" in result
    assert "provider" in result
    assert "latency_ms" in result
    assert len(result["response"]) > 0
