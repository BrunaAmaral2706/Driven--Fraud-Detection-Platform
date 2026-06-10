# Tests

Test suites for backend and frontend modules.

## Structure

```
tests/
├── backend/     # pytest — API, services, models
└── frontend/    # vitest — components, pages, utils
```

## Running (when implemented)

```bash
# Backend
cd backend && pytest ../tests/backend -v

# Frontend
cd frontend && npm test
```
