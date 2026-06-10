from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base


class FraudAlert(Base):
    __tablename__ = "fraud_alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_code = Column(String(20), unique=True, nullable=False)  # ex: #1248
    fraud_type = Column(String(50), nullable=False)
    # Fraude Transacional, Lavagem de Dinheiro, Cadastro Suspeito, Comportamento Atípico
    status = Column(String(30), default="Novo")  # Novo, Em análise, Encerrado
    risk_score = Column(Float, nullable=False)
    amount = Column(Float)
    device_info = Column(String(200))
    ip_address = Column(String(50))
    location = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="alerts")
    investigation = relationship("Investigation", back_populates="alert", uselist=False)
    transactions = relationship("Transaction", back_populates="alert")
