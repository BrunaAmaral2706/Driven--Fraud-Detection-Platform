from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from datetime import datetime
from app.database.session import Base


class FraudRule(Base):
    __tablename__ = "fraud_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_code = Column(String(20), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    category = Column(String(50), nullable=False)
    severity = Column(String(20), default="MEDIUM")
    is_active = Column(Boolean, default=True)
    triggers_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
