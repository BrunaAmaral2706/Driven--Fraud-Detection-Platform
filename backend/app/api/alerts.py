from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.models.fraud_alert import FraudAlert
from app.services.ai_report_service import generate_investigation_report

router = APIRouter(prefix="/alerts", tags=["Alertas"])


@router.get("/")
def list_alerts(
    db: Session = Depends(get_db),
    status: Optional[str] = Query(None),
    fraud_type: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 20,
):
    """Lista alertas com filtros opcionais."""
    query = db.query(FraudAlert)
    if status:
        query = query.filter(FraudAlert.status == status)
    if fraud_type:
        query = query.filter(FraudAlert.fraud_type == fraud_type)

    total = query.count()
    alerts = query.order_by(FraudAlert.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": a.id,
                "alert_code": a.alert_code,
                "fraud_type": a.fraud_type,
                "status": a.status,
                "risk_score": a.risk_score,
                "amount": a.amount,
                "location": a.location,
                "created_at": a.created_at.isoformat(),
                "user": {"id": a.user.id, "name": a.user.name} if a.user else None,
            }
            for a in alerts
        ],
    }


@router.get("/{alert_id}")
def get_alert(alert_id: int, db: Session = Depends(get_db)):
    """Detalha um alerta específico."""
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")

    transactions = [
        {
            "id": t.id,
            "transaction_code": t.transaction_code,
            "tx_type": t.tx_type,
            "amount": t.amount,
            "status": t.status,
            "risk_score": t.risk_score,
            "created_at": t.created_at.isoformat(),
        }
        for t in alert.transactions
    ]

    return {
        "id": alert.id,
        "alert_code": alert.alert_code,
        "fraud_type": alert.fraud_type,
        "status": alert.status,
        "risk_score": alert.risk_score,
        "amount": alert.amount,
        "device_info": alert.device_info,
        "ip_address": alert.ip_address,
        "location": alert.location,
        "created_at": alert.created_at.isoformat(),
        "user": {
            "id": alert.user.id,
            "name": alert.user.name,
            "email": alert.user.email,
            "document": alert.user.document,
            "phone": alert.user.phone,
            "risk_level": alert.user.risk_level,
        } if alert.user else None,
        "transactions": transactions,
    }


@router.post("/{alert_id}/generate-report")
def generate_report(alert_id: int, db: Session = Depends(get_db)):
    """Gera parecer investigativo automático para o alerta."""
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alerta não encontrado")
    return generate_investigation_report(alert)
