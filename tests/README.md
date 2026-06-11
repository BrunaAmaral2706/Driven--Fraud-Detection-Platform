# Tests

Test suites for backend and frontend modules.

## Structure

```
tests/
├── backend/     # pytest — API, services, models (planned)
└── frontend/    # vitest — components, pages, utils (planned)
```

## Coverage targets (planned)

| Area | Priority tests |
|---|---|
| `dashboard_service.py` | KPI aggregations, date filters |
| `seed_service.py` | Demo data counts and relationships |
| `alerts.py` / `investigations.py` | API list/detail responses |
| `ScoreBadge` / `StatusBadge` | Risk threshold rendering |
| `Alerts.jsx` | Fraud summary aggregation logic |

## Running (when implemented)

```bash
# Backend
cd backend && pytest ../tests/backend -v

# Frontend
cd frontend && npm test
```

## Current state (v1.0)

Test directories are scaffolded. Manual validation via:

- API Swagger: http://localhost:8000/docs
- Frontend modules: http://localhost:5173
- Dev script: `.\scripts\start-dev.ps1`
