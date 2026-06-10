from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    document: Optional[str]
    phone: Optional[str]
    risk_level: str
    created_at: datetime

    class Config:
        from_attributes = True
