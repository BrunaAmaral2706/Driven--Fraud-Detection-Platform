"""
Driven Fraud Detection & Investigation Platform
Backend FastAPI — Entrypoint principal
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, SessionLocal
from app.models import User, FraudAlert, Transaction, Investigation, FraudRule
from app.database.session import Base
from app.api import dashboard, alerts, investigations, transactions, clients, rules
from app.services.seed_service import seed_database

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Plataforma antifraude para monitoramento, análise e investigação de fraudes financeiras.",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rotas
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(investigations.router, prefix="/api/v1")
app.include_router(transactions.router, prefix="/api/v1")
app.include_router(clients.router, prefix="/api/v1")
app.include_router(rules.router, prefix="/api/v1")


@app.on_event("startup")
def startup_event():
    """Popula banco com dados de demo na inicialização."""
    db = SessionLocal()
    try:
        seed_database(db)
        print("Banco de dados inicializado com dados de demonstracao")
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "running",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
