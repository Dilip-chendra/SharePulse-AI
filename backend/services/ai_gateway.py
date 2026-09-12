"""
AI Gateway — Resilient multi-provider LLM service
Provider chain: Gemini (primary) → OpenRouter A → OpenRouter B → Deterministic fallback
All keys from server environment — never from frontend.
"""
from __future__ import annotations
import time
import httpx
import json
import logging
from typing import Literal

logger = logging.getLogger(__name__)

TaskComplexity = Literal["simple", "medium", "complex"]


def _build_system_prompt(context_json: str) -> str:
    return f"""You are the SharePulse AI Analyst, an expert in retail financial analytics.
Your role is strictly EXPLANATORY — you explain numbers that come from the analytics engine.
You NEVER invent metrics, percentages, customer counts, or revenue figures.
All numbers you reference MUST come from the analytics context provided.
When you do not know something, say so clearly.
Label your claims: OBSERVED (from data), MODEL_DERIVED (from ML model), or HYPOTHESIS (unverified).

Current analytics context:
{context_json}"""


async def _call_gemini(prompt: str, context_json: str, complexity: TaskComplexity) -> str:
    """Call Gemini via REST API (no SDK dependency issue)."""
    from backend.config import GEMINI_API_KEY
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set")

    model = "gemini-1.5-flash" if complexity == "simple" else "gemini-1.5-pro"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": _build_system_prompt(context_json) + "\n\nUser question: " + prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1024 if complexity == "simple" else 2048,
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]


async def _call_openrouter(prompt: str, context_json: str, model: str) -> str:
    """Call OpenRouter fallback provider."""
    from backend.config import OPENROUTER_API_KEY
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY not set")

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sharepulse-ai.local",
        "X-Title": "SharePulse-AI",
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": _build_system_prompt(context_json)},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.3,
        "max_tokens": 1024,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]


def _deterministic_fallback(prompt: str, context_json: str) -> str:
    """
    Deterministic fallback when all LLM providers are unavailable.
    Returns a structured analysis based on keyword matching against real analytics data.
    Labeled clearly as deterministic (no LLM).
    """
    try:
        ctx = json.loads(context_json)
        kpis = ctx.get("kpis", {})
    except Exception:
        kpis = {}

    p = prompt.lower()
    if any(k in p for k in ["sow", "share of wallet", "wallet share"]):
        sow = kpis.get("current_sow", "N/A")
        delta = kpis.get("sow_delta_pp", "N/A")
        return (
            f"[DETERMINISTIC — No LLM available]\n\n"
            f"**Share-of-Wallet Summary**\n"
            f"Current SoW: {sow}% | Change: {delta} pp\n\n"
            f"The analytics engine has computed these figures from the transaction dataset. "
            f"For detailed trend analysis, please check the SoW Intelligence page."
        )
    elif any(k in p for k in ["attrition", "churn", "risk", "defector"]):
        defectors = kpis.get("silent_defectors", "N/A")
        displaced = kpis.get("displaced_spend", "N/A")
        return (
            f"[DETERMINISTIC — No LLM available]\n\n"
            f"**Attrition Risk Summary**\n"
            f"Silent defectors identified: {defectors}\n"
            f"Displaced spend: ₹{displaced}\n\n"
            f"Risk scores are model-derived (Champion: Hist Gradient Boosting). "
            f"Check the Attrition Radar and Model Explainability pages for details."
        )
    elif any(k in p for k in ["segment", "cluster", "archetype"]):
        return (
            f"[DETERMINISTIC — No LLM available]\n\n"
            f"**Segmentation Summary**\n"
            f"5 behavioral archetypes identified via k-means (k=5 selected by silhouette score).\n"
            f"Visit the Customer Segmentation page to explore archetype profiles and cluster validation metrics."
        )
    else:
        total_spend = kpis.get("total_active_spend", "N/A")
        return (
            f"[DETERMINISTIC — No LLM available]\n\n"
            f"**Platform Analytics Available**\n"
            f"Total Active Spend: ₹{total_spend}\n\n"
            f"The AI provider is temporarily unavailable. All analytics data is live — "
            f"please explore the dashboard pages directly. "
            f"The AI analyst will resume when the provider connection is restored."
        )


async def generate_analysis(
    prompt: str,
    context_json: str,
    complexity: TaskComplexity = "medium",
) -> dict:
    """
    Main entry point. Returns:
    {
        "response": str,
        "provider": str,   # "gemini" | "openrouter_llama" | "openrouter_mistral" | "deterministic"
        "is_llm": bool,
        "latency_ms": int
    }
    """
    from backend.config import OPENROUTER_FALLBACK_MODELS

    start = time.monotonic()
    providers_tried = []

    # 1. Try Gemini
    try:
        text = await _call_gemini(prompt, context_json, complexity)
        return {
            "response": text,
            "provider": "gemini",
            "is_llm": True,
            "latency_ms": int((time.monotonic() - start) * 1000),
        }
    except Exception as e:
        providers_tried.append(f"gemini: {type(e).__name__}")
        logger.warning(f"Gemini failed: {e}")

    # 2. Try OpenRouter fallbacks
    for model in OPENROUTER_FALLBACK_MODELS:
        try:
            text = await _call_openrouter(prompt, context_json, model)
            short_name = model.split("/")[-1].replace("-instruct", "")
            return {
                "response": text,
                "provider": f"openrouter_{short_name}",
                "is_llm": True,
                "latency_ms": int((time.monotonic() - start) * 1000),
            }
        except Exception as e:
            providers_tried.append(f"{model}: {type(e).__name__}")
            logger.warning(f"OpenRouter {model} failed: {e}")

    # 3. Deterministic fallback
    logger.error(f"All LLM providers failed: {providers_tried}. Using deterministic fallback.")
    text = _deterministic_fallback(prompt, context_json)
    return {
        "response": text,
        "provider": "deterministic",
        "is_llm": False,
        "latency_ms": int((time.monotonic() - start) * 1000),
    }
