from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.fraud_rule import FraudRule

router = APIRouter(prefix="/rules", tags=["Regras"])


@router.get("/")
def list_rules(db: Session = Depends(get_db), skip: int = 0, limit: int = 50):
    """Lista regras antifraude configuradas."""
    total = db.query(FraudRule).count()
    items = (
        db.query(FraudRule)
        .order_by(FraudRule.category, FraudRule.rule_code)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "items": [
            {
                "id": r.id,
                "rule_code": r.rule_code,
                "name": r.name,
                "description": r.description,
                "category": r.category,
                "severity": r.severity,
                "is_active": r.is_active,
                "triggers_count": r.triggers_count,
                "created_at": r.created_at.isoformat(),
            }
            for r in items
        ],
    }
