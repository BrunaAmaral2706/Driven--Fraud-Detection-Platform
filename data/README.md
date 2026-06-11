# Data Directory

Reference datasets and data assets for the Driven Fraud Detection Platform.

## Structure

| Path | Purpose |
|---|---|
| `raw/` | Raw input datasets (gitignored) |
| `processed/` | Cleaned/feature-ready data (gitignored) |
| `seeds/` | Static seed references |

## Demo data (runtime)

Demo data is **auto-generated on backend startup** via `backend/app/services/seed_service.py` when the database is empty.

| Entity | Count | Period |
|---|---|---|
| Fraud alerts | 25 | May 2024 |
| Transactions | ~88 | Linked to alerts |
| Investigations | 15 | With JSON timeline |
| Clients (users) | 12 | Risk levels LOW → CRITICAL |
| Fraud rules | 10 | With trigger counts |

### Fraud types (alerts)

- Fraude Transacional
- Lavagem de Dinheiro
- Cadastro Suspeito
- Comportamento Atípico
- Outros

### Transaction types

PIX, TED, Boleto, Cartão Crédito, Cartão Débito

### Channels

App Mobile, Internet Banking, ATM, Agência

### Default UI period

`frontend/src/config/demoPeriod.js` — **01/05/2024 — 31/05/2024**

Database file (dev): `backend/fraud.db` (gitignored, created at runtime).
