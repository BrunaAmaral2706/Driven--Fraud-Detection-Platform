from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.user import User
from app.models.fraud_alert import FraudAlert
from app.models.transaction import Transaction

router = APIRouter(prefix="/clients", tags=["Clientes"])


@router.get("/")
def list_clients(db: Session = Depends(get_db), skip: int = 0, limit: int = 50):
    """Lista clientes com contagem de alertas e transações."""
    total = db.query(User).count()
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    items = []
    for user in users:
        alerts_count = db.query(func.count(FraudAlert.id)).filter(FraudAlert.user_id == user.id).scalar()
        transactions_count = db.query(func.count(Transaction.id)).filter(Transaction.user_id == user.id).scalar()
        items.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "document": user.document,
            "phone": user.phone,
            "risk_level": user.risk_level,
            "is_active": user.is_active,
            "alerts_count": alerts_count,
            "transactions_count": transactions_count,
            "created_at": user.created_at.isoformat(),
        })

    return {"total": total, "items": items}
