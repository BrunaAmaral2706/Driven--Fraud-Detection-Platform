"""
Serviço de seed: popula o banco com dados realistas para demo.
"""
import json
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.fraud_alert import FraudAlert
from app.models.transaction import Transaction
from app.models.investigation import Investigation
from app.models.fraud_rule import FraudRule


FRAUD_TYPES = [
    "Fraude Transacional",
    "Lavagem de Dinheiro",
    "Cadastro Suspeito",
    "Comportamento Atípico",
    "Outros",
]

STATUSES = ["Novo", "Em análise", "Encerrado"]
PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
TX_TYPES = ["PIX", "TED", "Boleto", "Cartão Crédito", "Cartão Débito"]
CHANNELS = ["App Mobile", "Internet Banking", "ATM", "Agência"]
LOCATIONS = ["São Paulo, BR", "Rio de Janeiro, BR", "Curitiba, BR", "Miami, US", "Lisboa, PT", "Madri, ES"]

NAMES = [
    "João Silva", "Maria Santos", "Carlos Oliveira", "Ana Costa",
    "Pedro Ferreira", "Fernanda Lima", "Rafael Souza", "Juliana Mendes",
    "Lucas Alves", "Camila Rocha", "Bruno Martins", "Larissa Nunes",
]

DEVICES = [
    "iPhone 14 Pro — iOS 17.2",
    "Samsung Galaxy S23 — Android 14",
    "Motorola Edge 40 — Android 13",
    "MacBook Pro — Chrome 121",
    "Windows 11 — Edge 120",
]


FRAUD_RULES = [
    ("RG-001", "Transação acima do limite diário", "Bloqueia transações que excedem o limite diário configurado por perfil de cliente.", "Transacional", "HIGH", True, 142),
    ("RG-002", "Múltiplas transações em curto período", "Detecta 5 ou mais transações em menos de 10 minutos no mesmo canal.", "Comportamento", "CRITICAL", True, 89),
    ("RG-003", "Login de dispositivo não reconhecido", "Alerta quando o acesso ocorre de um dispositivo ou IP nunca utilizado pelo cliente.", "Cadastro", "MEDIUM", True, 56),
    ("RG-004", "Transferência para conta recém-criada", "Sinaliza PIX/TED para beneficiários com conta aberta há menos de 7 dias.", "Transacional", "HIGH", True, 34),
    ("RG-005", "Geolocalização inconsistente", "Compara localização do dispositivo com histórico habitual do cliente.", "Comportamento", "MEDIUM", True, 27),
    ("RG-006", "CPF em lista restritiva", "Verifica documento contra bases de restrição interna e parceiros.", "Cadastro", "CRITICAL", True, 12),
    ("RG-007", "Transação internacional atípica", "Identifica operações em moeda estrangeira fora do padrão do cliente.", "Transacional", "HIGH", True, 18),
    ("RG-008", "Tentativas de login falhas", "Bloqueia após 3 tentativas de senha incorreta em 15 minutos.", "Comportamento", "MEDIUM", True, 203),
    ("RG-009", "Fracionamento de valores", "Detecta sequência de transações abaixo do limite de reporte regulatório.", "Lavagem de Dinheiro", "CRITICAL", True, 41),
    ("RG-010", "Alteração cadastral recente", "Eleva risco após mudança de telefone, e-mail ou endereço nas últimas 48h.", "Cadastro", "LOW", False, 8),
]


def seed_fraud_rules(db: Session):
    """Popula regras antifraude se ainda não existirem."""
    if db.query(FraudRule).count() > 0:
        return
    for code, name, desc, category, severity, active, triggers in FRAUD_RULES:
        db.add(FraudRule(
            rule_code=code,
            name=name,
            description=desc,
            category=category,
            severity=severity,
            is_active=active,
            triggers_count=triggers,
            created_at=datetime.utcnow() - timedelta(days=random.randint(60, 365)),
        ))
    db.commit()


def seed_database(db: Session):
    """Popula o banco com dados de demonstração."""
    seed_fraud_rules(db)

    if db.query(User).count() > 0:
        return  # Já foi populado

    base_date = datetime(2024, 5, 1)

    # Criar usuários
    users = []
    for i, name in enumerate(NAMES):
        user = User(
            name=name,
            email=f"{name.lower().replace(' ', '.')}@email.com",
            document=f"{random.randint(100,999)}.{random.randint(100,999)}.{random.randint(100,999)}-{random.randint(10,99)}",
            phone=f"(11) 9{random.randint(1000,9999)}-{random.randint(1000,9999)}",
            risk_level=random.choice(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
            created_at=base_date - timedelta(days=random.randint(1, 60)),
        )
        db.add(user)
        users.append(user)
    db.commit()

    # Criar alertas
    alerts = []
    for i in range(1, 26):
        user = random.choice(users)
        created = base_date + timedelta(
            days=random.randint(0, 30),
            hours=random.randint(0, 23),
            minutes=random.randint(0, 59),
        )
        alert = FraudAlert(
            alert_code=f"#{1224 + i}",
            fraud_type=random.choice(FRAUD_TYPES),
            status=random.choice(STATUSES),
            risk_score=round(random.uniform(40, 99), 1),
            amount=round(random.uniform(500, 90000), 2),
            device_info=random.choice(DEVICES),
            ip_address=f"{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}.{random.randint(1,254)}",
            location=random.choice(LOCATIONS),
            created_at=created,
            user_id=user.id,
        )
        db.add(alert)
        alerts.append(alert)
    db.commit()

    # Criar transações
    for alert in alerts:
        for j in range(random.randint(2, 5)):
            tx_date = alert.created_at - timedelta(hours=random.randint(1, 72))
            tx = Transaction(
                transaction_code=f"TX{alert.id:04d}{j:02d}",
                tx_type=random.choice(TX_TYPES),
                amount=round(random.uniform(100, 50000), 2),
                status=random.choice(["Aprovada", "Bloqueada", "Pendente"]),
                risk_score=round(random.uniform(10, 95), 1),
                merchant=random.choice(["Mercado Livre", "Amazon", "iFood", "Uber", "Transferência"]),
                channel=random.choice(CHANNELS),
                device_fingerprint=f"FP{random.randint(10000,99999)}",
                ip_address=alert.ip_address,
                location=alert.location,
                created_at=tx_date,
                user_id=alert.user_id,
                alert_id=alert.id,
            )
            db.add(tx)
    db.commit()

    # Criar investigações para alguns alertas
    inv_count = 1
    for alert in alerts[:15]:
        timeline = json.dumps([
            {"time": (alert.created_at - timedelta(hours=3)).isoformat(), "event": "Transação de alto valor detectada", "type": "warning"},
            {"time": (alert.created_at - timedelta(hours=1)).isoformat(), "event": "Múltiplas tentativas de login identificadas", "type": "danger"},
            {"time": alert.created_at.isoformat(), "event": "Alerta gerado automaticamente pelo sistema", "type": "alert"},
            {"time": (alert.created_at + timedelta(minutes=30)).isoformat(), "event": "Encaminhado para equipe de investigação", "type": "info"},
        ])
        inv = Investigation(
            investigation_code=f"INV-{2024}-{inv_count:04d}",
            status=random.choice(["Em andamento", "Concluída", "Arquivada"]),
            analyst=random.choice(["Ana Lima", "Carlos Mendes", "Fernanda Costa", "Rafael Torres"]),
            findings="Padrão de comportamento suspeito identificado. Múltiplas transações em curto período.",
            risk_score=alert.risk_score,
            priority=random.choice(PRIORITIES),
            timeline_events=timeline,
            alert_id=alert.id,
        )
        db.add(inv)
        inv_count += 1
    db.commit()
