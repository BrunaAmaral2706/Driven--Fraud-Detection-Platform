from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TransactionOut(BaseModel):
    id: int
    transaction_code: str
    tx_type: str
    amount: float
    status: str
    risk_score: float
    merchant: Optional[str]
    channel: Optional[str]
    ip_address: Optional[str]
    location: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
