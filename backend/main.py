import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes import router as api_router
from backend.api.v1.routes import router as v1_router
from backend.analytics.pipeline import run_full_pipeline

@asynccontextmanager
async def lifespan(app: FastAPI):
    cache_path = os.path.join(os.path.dirname(__file__), "data", "cache.json")
    if not os.path.exists(cache_path):
        print("Lifespan: Initializing analytics pipeline...")
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        run_full_pipeline(base_dir)
    else:
        print("Lifespan: Analytics cache found and ready.")
    yield

app = FastAPI(
    title="SharePulse-AI Enterprise Customer & Revenue Decision Platform",
    description="Continuous Customer Intelligence, Revenue Recovery, and Decision Intelligence Platform for MetroMart Inc. & HSIC Bank",
    version="2.5.0",
    lifespan=lifespan
)

origins = [
    "https://share-pulse-ai.vercel.app",
    "https://sharepulse-ai.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "sharepulse-api",
        "version": "2.5.0",
        "environment": "production" if os.environ.get("PORT") else "development",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "overview": "/api/overview",
            "sow": "/api/sow",
            "migration": "/api/migration",
            "attrition": "/api/attrition",
            "events_gateway": "/api/v1/events"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "sharepulse-api",
        "version": "2.5.0",
        "database": "connected",
        "analytics_engine": "ready"
    }

app.include_router(api_router, prefix="/api")
app.include_router(v1_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
