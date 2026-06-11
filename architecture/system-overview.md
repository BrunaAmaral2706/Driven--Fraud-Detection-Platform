# System Overview

## Components

| Component | Technology | Port | Responsibility |
|---|---|---|---|
| Frontend SPA | React 18 + Vite 5 | 5173 | UI operacional antifraude (6 módulos + detalhes) |
| REST API | FastAPI + Uvicorn | 8000 | APIs `/api/v1`, seed, agregações |
| Database | SQLite (dev) / PostgreSQL (prod) | file / 5432 | Persistência relacional |
| ML Pipeline | Python module | — | Estrutura para scoring e inferência (v2.0) |

## Frontend modules

| Module | Route | UI pattern |
|---|---|---|
| Dashboard | `/` | KPI cards, pie chart (API), line chart (demo), recent alerts table |
| Alertas | `/alertas` | Fraud summary table + operational triage queue |
| Investigações | `/investigacoes` | Investigative console — dense status table |
| Transações | `/transacoes` | Analytics bar/pie + transaction feed table |
| Clientes | `/clientes` | Risk map + profile cards |
| Regras | `/regras` | Rule KPIs, trigger charts, rules catalog table |

## Backend API modules

| Prefix | Endpoints |
|---|---|
| `/api/v1/dashboard` | `GET /metrics?date_from=&date_to=` |
| `/api/v1/alerts` | `GET /`, `GET /{id}`, `POST /{id}/generate-report` |
| `/api/v1/investigations` | `GET /`, `GET /{id}` |
| `/api/v1/transactions` | `GET /` |
| `/api/v1/clients` | `GET /` |
| `/api/v1/rules` | `GET /` |

## Communication

```
Browser → React SPA (5173)
       → Vite proxy /api → FastAPI (8000)
       → SQLAlchemy ORM → SQLite/PostgreSQL
       → ai_report_service (parecer investigativo)
```

## Demo data (seed)

Populated on backend startup when database is empty:

- **25** fraud alerts (5 fraud types, 3 statuses)
- **88** transactions (PIX, TED, Boleto, cartão)
- **15** investigations with JSON timeline
- **12** clients with risk levels
- **10** fraud rules with trigger counts

Default demo period: **May 2024** (`frontend/src/config/demoPeriod.js`).

See [ARCHITECTURE.md](../ARCHITECTURE.md) for full documentation.
