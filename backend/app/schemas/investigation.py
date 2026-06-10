from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InvestigationOut(BaseModel):
    id: int
    investigation_code: str
    status: str
    analyst: Optional[str]
    findings: Optional[str]
    ai_summary: Optional[str]
    risk_score: Optional[float]
    priority: str
    timeline_events: Optional[str]
    created_at: datetime
    alert_id: int

    class Config:
        from_attributes = True


class AIReportResponse(BaseModel):
    alert_id: int
    summary: str
    risk_level: str
    recommendation: str
    generated_at: datetime
