from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_code = Column(String(30), unique=True, nullable=False)
    tx_type = Column(String(50))  # PIX, TED, Boleto, Cartão
    amount = Column(Float, nullable=False)
    status = Column(String(30), default="Pendente")  # Aprovada, Bloqueada, Pendente
    risk_score = Column(Float, default=0.0)
    merchant = Column(String(100))
    channel = Column(String(50))  # App, Web, ATM
    device_fingerprint = Column(String(100))
    ip_address = Column(String(50))
    location = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="transactions")

    alert_id = Column(Integer, ForeignKey("fraud_alerts.id"), nullable=True)
    alert = relationship("FraudAlert", back_populates="transactions")
