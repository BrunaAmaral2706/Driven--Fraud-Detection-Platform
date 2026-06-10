# System Overview

## Components

| Component | Technology | Port |
|---|---|---|
| Frontend SPA | React + Vite | 5173 |
| REST API | FastAPI + Uvicorn | 8000 |
| Database | PostgreSQL / SQLite | 5432 / file |
| ML Pipeline | Python module | — |

## Communication

- Frontend → Backend: HTTP REST (`/api/v1/*`)
- Backend → Database: SQLAlchemy ORM
- Backend → ML Pipeline: Python service interface (future)

See [ARCHITECTURE.md](../ARCHITECTURE.md) for full documentation.
