from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    document = Column(String(20), unique=True)  # CPF/CNPJ
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    risk_level = Column(String(20), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    created_at = Column(DateTime, default=datetime.utcnow)

    alerts = relationship("FraudAlert", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
