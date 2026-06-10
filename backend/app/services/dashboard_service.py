"""Serviço de métricas para o dashboard executivo."""
from datetime import datetime, time
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.fraud_alert import FraudAlert
from app.models.transaction import Transaction


def _apply_date_filter(query, model, date_from: Optional[str] = None, date_to: Optional[str] = None):
    if date_from:
        start = datetime.combine(datetime.fromisoformat(date_from).date(), time.min)
        query = query.filter(model.created_at >= start)
    if date_to:
        end = datetime.combine(datetime.fromisoformat(date_to).date(), time.max)
        query = query.filter(model.created_at <= end)
    return query


def get_dashboard_metrics(
    db: Session,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
) -> dict:
    alerts_q = _apply_date_filter(db.query(FraudAlert), FraudAlert, date_from, date_to)
    tx_q = _apply_date_filter(db.query(Transaction), Transaction, date_from, date_to)

    total_alerts = alerts_q.count()
    critical_alerts = alerts_q.filter(FraudAlert.risk_score >= 80).count()
    avg_score = alerts_q.with_entities(func.avg(FraudAlert.risk_score)).scalar() or 0
    suspicious_tx = tx_q.filter(Transaction.risk_score >= 60).count()

    by_type = (
        alerts_q.with_entities(FraudAlert.fraud_type, func.count(FraudAlert.id))
        .group_by(FraudAlert.fraud_type)
        .all()
    )

    by_status = (
        alerts_q.with_entities(FraudAlert.status, func.count(FraudAlert.id))
        .group_by(FraudAlert.status)
        .all()
    )

    recent = (
        alerts_q.order_by(FraudAlert.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_alerts": total_alerts,
        "critical_alerts": critical_alerts,
        "avg_risk_score": round(float(avg_score), 1),
        "suspicious_transactions": suspicious_tx,
        "alerts_by_type": [{"type": t, "count": c} for t, c in by_type],
        "alerts_by_status": [{"status": s, "count": c} for s, c in by_status],
        "recent_alerts": recent,
    }
