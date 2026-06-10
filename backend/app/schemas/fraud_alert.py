from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import UserOut


class FraudAlertOut(BaseModel):
    id: int
    alert_code: str
    fraud_type: str
    status: str
    risk_score: float
    amount: Optional[float]
    device_info: Optional[str]
    ip_address: Optional[str]
    location: Optional[str]
    created_at: datetime
    user: Optional[UserOut]

    class Config:
        from_attributes = True


class FraudAlertList(BaseModel):
    total: int
    items: list[FraudAlertOut]
