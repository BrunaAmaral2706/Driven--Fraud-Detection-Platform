from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.dashboard_service import get_dashboard_metrics
from app.schemas.fraud_alert import FraudAlertOut
from typing import Any, Optional

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/metrics")
def dashboard_metrics(
    db: Session = Depends(get_db),
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
) -> Any:
    """Retorna todas as métricas do dashboard executivo."""
    metrics = get_dashboard_metrics(db, date_from=date_from, date_to=date_to)
    # Serializar alertas recentes
    metrics["recent_alerts"] = [
        {
            "id": a.id,
            "alert_code": a.alert_code,
            "fraud_type": a.fraud_type,
            "status": a.status,
            "risk_score": a.risk_score,
            "amount": a.amount,
            "created_at": a.created_at.isoformat(),
            "user": {"name": a.user.name} if a.user else None,
        }
        for a in metrics["recent_alerts"]
    ]
    return metrics
