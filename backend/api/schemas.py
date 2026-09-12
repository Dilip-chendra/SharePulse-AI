from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class SimulationRequest(BaseModel):
    budget: float = 1000000.0  # INR 10 Lakh default
    target_segment: Optional[str] = "All"
    target_state: Optional[str] = "All"
    target_category: Optional[str] = "All"
    incentive_rate: float = 0.03  # 3% extra cashback
    conversion_rate_multiplier: float = 1.0

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
