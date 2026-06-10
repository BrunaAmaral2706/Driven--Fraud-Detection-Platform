from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.investigation import Investigation
import json

router = APIRouter(prefix="/investigations", tags=["Investigações"])


@router.get("/")
def list_investigations(db: Session = Depends(get_db), skip: int = 0, limit: int = 20):
    """Lista todas as investigações."""
    total = db.query(Investigation).count()
    items = db.query(Investigation).order_by(Investigation.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": i.id,
                "investigation_code": i.investigation_code,
                "status": i.status,
                "analyst": i.analyst,
                "risk_score": i.risk_score,
                "priority": i.priority,
                "created_at": i.created_at.isoformat(),
                "alert_created_at": i.alert.created_at.isoformat() if i.alert else None,
                "alert_id": i.alert_id,
                "alert_code": i.alert.alert_code if i.alert else None,
                "fraud_type": i.alert.fraud_type if i.alert else None,
                "user_name": i.alert.user.name if i.alert and i.alert.user else None,
            }
            for i in items
        ],
    }


@router.get("/{investigation_id}")
def get_investigation(investigation_id: int, db: Session = Depends(get_db)):
    """Detalha uma investigação com timeline completa."""
    inv = db.query(Investigation).filter(Investigation.id == investigation_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail="Investigação não encontrada")

    timeline = []
    if inv.timeline_events:
        try:
            timeline = json.loads(inv.timeline_events)
        except Exception:
            timeline = []

    alert = inv.alert
    return {
        "id": inv.id,
        "investigation_code": inv.investigation_code,
        "status": inv.status,
        "analyst": inv.analyst,
        "findings": inv.findings,
        "ai_summary": inv.ai_summary,
        "risk_score": inv.risk_score,
        "priority": inv.priority,
        "timeline": timeline,
        "created_at": inv.created_at.isoformat(),
        "alert": {
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
                "name": alert.user.name,
                "email": alert.user.email,
                "document": alert.user.document,
                "phone": alert.user.phone,
            } if alert.user else None,
        } if alert else None,
    }
