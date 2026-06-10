# Architecture — Driven Fraud Detection Platform

> Enterprise technical architecture document for engineering leaders, architects, and senior ICs.

---

## 1. Executive Summary

Driven Fraud Detection Platform is a **modular monolith** designed for financial crime prevention workloads. It follows enterprise patterns: layered architecture, API-first contracts, domain-driven modules, and ML pipeline separation — without the operational overhead of distributed microservices at MVP stage.

| Principle | Decision |
|---|---|
| Architecture style | Modular monolith |
| API protocol | REST/JSON (OpenAPI 3) |
| Auth (current) | Open (JWT planned v1.1) |
| Database | PostgreSQL (prod) / SQLite (dev) |
| ML integration | Sidecar pipeline module |
| Deployment | Docker Compose → cloud-native ready |

---

## 2. System Context

```
                    ┌─────────────────────────┐
                    │   Analysts & Managers   │
                    │   (Web Browser)         │
                    └───────────┬─────────────┘
                                │ HTTPS
                    ┌───────────▼─────────────┐
                    │   Frontend (React SPA)  │
                    │   Port 5173             │
                    └───────────┬─────────────┘
                                │ /api/v1/*
                    ┌───────────▼─────────────┐
                    │   Backend (FastAPI)     │
                    │   Port 8000             │
                    └───────────┬─────────────┘
              ┌─────────────────┼─────────────────┐
              │                 │                 │
    ┌─────────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
    │  PostgreSQL    │  │ ML Pipeline │  │  External   │
    │  / SQLite      │  │  (Scoring)  │  │  LLM APIs   │
    └────────────────┘  └─────────────┘  └─────────────┘
```

---

## 3. Layered Architecture

### 3.1 Presentation Layer (`frontend/`)

| Component | Responsibility |
|---|---|
| `pages/` | Route-level views (Dashboard, Alerts, Investigations) |
| `components/` | Reusable UI primitives (badges, filters, spinners) |
| `layouts/` | Shell layout (sidebar, navbar, date-range context) |
| `services/api.js` | HTTP client with centralized error handling |
| `context/` | Cross-cutting UI state (date range filter) |

**Key design decisions:**
- Vite dev proxy routes `/api` → backend (no CORS issues in dev)
- TailwindCSS custom `driven` design system (fintech premium palette)
- Recharts for executive analytics visualization

### 3.2 Application Layer (`backend/app/`)

```
backend/app/
├── api/           # HTTP controllers (thin — delegate to services)
├── services/      # Business logic & orchestration
├── models/        # SQLAlchemy ORM entities
├── schemas/       # Pydantic request/response contracts
├── database/      # Session management & engine config
└── core/          # Settings, environment, CORS
```

| Layer | Pattern | Example |
|---|---|---|
| `api/` | Controller | `alerts.py` → list/filter alerts |
| `services/` | Domain service | `dashboard_service.py` → aggregate KPIs |
| `models/` | Active Record | `FraudAlert`, `Transaction`, `Investigation` |
| `schemas/` | DTO validation | `FraudAlertOut`, `UserOut` |

### 3.3 Data Layer

**Core entities:**

```
User ──────┬──── FraudAlert ──── Investigation
           │         │
           │         └──── Transaction
           │
           └──── (risk_level, document, activity counts)

FraudRule (independent — rules engine catalog)
```

| Entity | Purpose |
|---|---|
| `User` | Customer profile with risk classification |
| `FraudAlert` | Detected fraud signal with score & metadata |
| `Transaction` | Financial event linked to alert/user |
| `Investigation` | Case workflow with timeline JSON |
| `FraudRule` | Detection rule configuration |

### 3.4 ML Pipeline Layer (`ml-pipeline/`)

Decoupled from the API monolith for independent scaling and model lifecycle management.

```
ml-pipeline/
├── scoring/        # Feature extraction & risk score computation
├── inference/      # Real-time scoring endpoint (future)
├── monitoring/     # Model drift, latency, precision/recall KPIs
└── README.md       # Pipeline documentation
```

**Integration point:** `backend/app/services/ai_report_service.py` and future `scoring_service.py` consume ML pipeline outputs.

**Current state:** Rule-based scoring with structured migration path to scikit-learn / XGBoost models.

---

## 4. Request Flow

### 4.1 Alert Investigation Flow

```
1. Analyst opens /alertas/:id
2. Frontend → GET /api/v1/alerts/{id}
3. Backend loads alert + user + transactions (SQLAlchemy joins)
4. Analyst clicks "Generate Report"
5. Frontend → POST /api/v1/alerts/{id}/generate-report
6. ai_report_service builds investigative summary
7. Response rendered in AlertDetail page
```

### 4.2 Dashboard Metrics Flow

```
1. DateRangeContext provides start/end dates
2. Frontend → GET /api/v1/dashboard/metrics?date_from=&date_to=
3. dashboard_service aggregates:
   - total_alerts, critical_alerts, avg_risk_score
   - alerts_by_type, alerts_by_status
   - recent_alerts (top 5)
4. Recharts renders pie/line visualizations
```

### 4.3 Transactional Monitoring Flow

```
Transaction Event
    → Rules Engine evaluation (FraudRule triggers)
    → Risk score assignment (0–100)
    → Threshold check
    → Alert generation (if score ≥ threshold)
    → Investigation case (if severity ≥ HIGH)
    → Dashboard KPI update
```

---

## 5. API Design

**Base URL:** `/api/v1`

| Module | Prefix | Key Operations |
|---|---|---|
| Dashboard | `/dashboard` | `GET /metrics` |
| Alerts | `/alerts` | `GET /`, `GET /{id}`, `POST /{id}/generate-report` |
| Investigations | `/investigations` | `GET /`, `GET /{id}` |
| Transactions | `/transactions` | `GET /` |
| Clients | `/clients` | `GET /` |
| Rules | `/rules` | `GET /` |

**Cross-cutting concerns:**
- CORS middleware (configurable origins)
- Pydantic validation on all inputs
- ISO 8601 datetime serialization
- Pagination via `skip` / `limit` query params

---

## 6. Fraud Scoring Model

### Current (v1.0) — Rule-Based Engine

| Signal | Weight | Threshold |
|---|---|---|
| Transaction velocity | High | >5 tx / 10 min |
| Amount anomaly | High | > daily limit |
| Device fingerprint | Medium | Unknown device |
| Geo inconsistency | Medium | Location mismatch |
| Login failures | Medium | >3 attempts / 15 min |

### Planned (v2.0) — ML Scoring

```
Features → StandardScaler → Model (XGBoost/RF) → Probability → Risk Score (0-100)
```

Monitoring via `ml-pipeline/monitoring/`:
- Population Stability Index (PSI) for drift
- Precision/recall at operational thresholds
- Latency p50/p95/p99 for inference

---

## 7. Observability & Operations

| Concern | Implementation | Future |
|---|---|---|
| Health | `GET /health` | Kubernetes liveness probe |
| API docs | Swagger `/docs` | Redoc alternative |
| Logging | Python stdlib | Structured JSON (ELK) |
| Metrics | Dashboard KPIs | Prometheus + Grafana |
| Tracing | — | OpenTelemetry |
| ML monitoring | Pipeline module | Evidently AI / MLflow |

---

## 8. Security Architecture (Planned v1.1)

```
Client → JWT Bearer Token → FastAPI Dependency → Role Check → Endpoint
```

| Role | Permissions |
|---|---|
| Analyst | View alerts, create investigations |
| Manager | Dashboard, export reports |
| Admin | Rules configuration, user management |

---

## 9. Deployment Topology

### Development

```
docker-compose.yml
├── backend   (uvicorn, port 8000)
├── frontend  (vite dev, port 5173)
└── postgres  (port 5432, optional)
```

### Production (Target)

```
CDN → Static Frontend (S3/Vercel)
         ↓
    Load Balancer
         ↓
    FastAPI (ECS/K8s, auto-scaling)
         ↓
    PostgreSQL (RDS, Multi-AZ)
         ↓
    ML Inference (Lambda/ECS sidecar)
```

---

## 10. Integration Between Layers

```
┌────────────┐    REST/JSON     ┌────────────┐    SQL/ORM     ┌────────────┐
│  Frontend  │◄──────────────►│   Backend  │◄──────────────►│  Database  │
└────────────┘                 └──────┬─────┘                 └────────────┘
                                      │
                                      │ Python import / HTTP
                                      ▼
                               ┌────────────┐
                               │ ML Pipeline│
                               │ scoring    │
                               │ inference  │
                               │ monitoring │
                               └────────────┘
```

**Contract boundaries:**
- Frontend ↔ Backend: OpenAPI schema (versioned `/api/v1`)
- Backend ↔ Database: SQLAlchemy models (migrations via Alembic)
- Backend ↔ ML: Service interface (scoring result DTO)

---

## 11. Scalability Path

| Stage | Architecture | Trigger |
|---|---|---|
| MVP | Modular monolith | < 10K alerts/day |
| Growth | Read replicas + Redis cache | > 10K alerts/day |
| Scale | Event streaming (Kafka) + microservices | > 100K tx/day |
| Enterprise | Multi-tenant + regional deployment | Global operations |

---

## 12. Architecture Decision Records

Detailed ADRs available in [`architecture/`](./architecture/):

- [System Overview](./architecture/system-overview.md)
- [Data Flow](./architecture/data-flow.md)
- [ML Pipeline](./architecture/ml-pipeline.md)

---

<p align="center">
  <sub>Driven Fraud Detection Platform · Architecture v1.0</sub>
</p>
