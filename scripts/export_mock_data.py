"""
Exporta dados do seed para JSON usado como fallback no frontend (deploy Vercel).
Executar: python scripts/export_mock_data.py
"""
import json
import random
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BACKEND = ROOT / "backend"
OUT = ROOT / "frontend" / "src" / "mocks" / "data"
sys.path.insert(0, str(BACKEND))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database.session import Base
from app.services.seed_service import seed_database
from app.services.dashboard_service import get_dashboard_metrics
from app.services.ai_report_service import generate_investigation_report
from app.models.fraud_alert import FraudAlert
from app.models.investigation import Investigation
from app.models.transaction import Transaction
from app.models.user import User
from app.models.fraud_rule import FraudRule
from sqlalchemy import func


def serialize(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Not serializable: {type(obj)}")


def export_dashboard(db, date_from="2024-05-01", date_to="2024-05-31"):
    metrics = get_dashboard_metrics(db, date_from=date_from, date_to=date_to)
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


def export_alerts_list(db, limit=50):
    total = db.query(FraudAlert).count()
    alerts = (
        db.query(FraudAlert)
        .order_by(FraudAlert.created_at.desc())
        .limit(limit)
        .all()
    )
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


def export_alert_detail(db, alert_id):
    alert = db.query(FraudAlert).filter(FraudAlert.id == alert_id).first()
    if not alert:
        return None
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
        "transactions": [
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
        ],
    }


def export_investigations_list(db, limit=50):
    total = db.query(Investigation).count()
    items = (
        db.query(Investigation)
        .order_by(Investigation.created_at.desc())
        .limit(limit)
        .all()
    )
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


def export_investigation_detail(db, inv_id):
    inv = db.query(Investigation).filter(Investigation.id == inv_id).first()
    if not inv:
        return None
    timeline = json.loads(inv.timeline_events) if inv.timeline_events else []
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


def export_transactions(db, limit=50):
    total = db.query(Transaction).count()
    items = (
        db.query(Transaction)
        .order_by(Transaction.created_at.desc())
        .limit(limit)
        .all()
    )
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


def export_clients(db, limit=50):
    total = db.query(User).count()
    users = db.query(User).order_by(User.created_at.desc()).limit(limit).all()
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


def export_rules(db, limit=50):
    total = db.query(FraudRule).count()
    items = (
        db.query(FraudRule)
        .order_by(FraudRule.category, FraudRule.rule_code)
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


def main():
    random.seed(42)
    OUT.mkdir(parents=True, exist_ok=True)

    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    seed_database(db)

    bundle = {
        "dashboard": export_dashboard(db),
        "alerts": export_alerts_list(db),
        "investigations": export_investigations_list(db),
        "transactions": export_transactions(db, limit=500),
        "clients": export_clients(db),
        "rules": export_rules(db),
        "alertDetails": {},
        "investigationDetails": {},
        "reports": {},
    }

    for alert in db.query(FraudAlert).all():
        bundle["alertDetails"][str(alert.id)] = export_alert_detail(db, alert.id)
        report = generate_investigation_report(alert)
        report["generated_at"] = report["generated_at"].isoformat()
        bundle["reports"][str(alert.id)] = report

    for inv in db.query(Investigation).all():
        bundle["investigationDetails"][str(inv.id)] = export_investigation_detail(db, inv.id)

    out_file = OUT / "seed.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(bundle, f, ensure_ascii=False, indent=2)

    print(f"Exported mock data to {out_file}")
    print(f"  alerts: {bundle['alerts']['total']}")
    print(f"  transactions: {bundle['transactions']['total']}")
    print(f"  investigations: {bundle['investigations']['total']}")
    print(f"  clients: {bundle['clients']['total']}")
    print(f"  rules: {bundle['rules']['total']}")
    db.close()


if __name__ == "__main__":
    main()
