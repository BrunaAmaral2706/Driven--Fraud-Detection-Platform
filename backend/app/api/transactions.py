from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.transaction import Transaction

router = APIRouter(prefix="/transactions", tags=["Transações"])


@router.get("/")
def list_transactions(db: Session = Depends(get_db), skip: int = 0, limit: int = 30):
    """Lista transações ordenadas por data."""
    total = db.query(Transaction).count()
    items = db.query(Transaction).order_by(Transaction.created_at.desc()).offset(skip).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": t.id,
                "transaction_code": t.transaction_code,
                "tx_type": t.tx_type,
                "amount": t.amount,
                "status": t.status,
                "risk_score": t.risk_score,
                "merchant": t.merchant,
                "channel": t.channel,
                "ip_address": t.ip_address,
                "location": t.location,
                "created_at": t.created_at.isoformat(),
                "user_name": t.user.name if t.user else None,
            }
            for t in items
        ],
    }
