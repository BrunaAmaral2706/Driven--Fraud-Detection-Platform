from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base


class Investigation(Base):
    __tablename__ = "investigations"

    id = Column(Integer, primary_key=True, index=True)
    investigation_code = Column(String(20), unique=True, nullable=False)
    status = Column(String(30), default="Em andamento")
    # Em andamento, Concluída, Arquivada
    analyst = Column(String(100))
    findings = Column(Text)         # Achados da investigação
    ai_summary = Column(Text)       # Parecer gerado automaticamente
    risk_score = Column(Float)
    priority = Column(String(20), default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL
    timeline_events = Column(Text)  # JSON com eventos da timeline
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    alert_id = Column(Integer, ForeignKey("fraud_alerts.id"), unique=True)
    alert = relationship("FraudAlert", back_populates="investigation")
