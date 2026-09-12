"""
SharePulse-AI Backend Configuration
All API keys are server-side only — never exposed to frontend.
"""
import os
from pathlib import Path

# Load .env if present (development)
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        load_dotenv(env_path)
except ImportError:
    pass  # python-dotenv optional; keys must be in real env vars in production

# ─── AI Provider Keys ────────────────────────────────────────────────────────
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")

# ─── Clerk (server-side) ─────────────────────────────────────────────────────
CLERK_SECRET_KEY: str = os.getenv("CLERK_SECRET_KEY", "")

# ─── Model routing thresholds ────────────────────────────────────────────────
# "simple"  — single KPI lookup, short answer
# "medium"  — multi-metric comparison, moderate reasoning
# "complex" — strategic synthesis, long-form explanation
TASK_COMPLEXITY_MAP = {
    "simple": "gemini-1.5-flash",
    "medium": "gemini-1.5-pro",
    "complex": "gemini-1.5-pro",
}

# OpenRouter fallback models (tried in order when Gemini fails)
OPENROUTER_FALLBACK_MODELS = [
    "meta-llama/llama-3.3-70b-instruct",
    "mistralai/mistral-large",
]

# ─── Backend data paths ──────────────────────────────────────────────────────
DATA_DIR = Path(__file__).parent / "data"
CACHE_PATH = DATA_DIR / "cache.json"
DB_PATH = DATA_DIR / "sharepulse.db"
