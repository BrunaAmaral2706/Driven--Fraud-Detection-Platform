# Data Flow

## 1. Dashboard metrics flow

```
DateRangeFilter (navbar)
    → DateRangeContext (startDate, endDate)
    → GET /api/v1/dashboard/metrics?date_from=2024-05-01&date_to=2024-05-31
    → dashboard_service.py
        ├── total_alerts
        ├── critical_alerts (score ≥ 80)
        ├── avg_risk_score
        ├── suspicious_transactions (score ≥ 60)
        ├── alerts_by_type (group by fraud_type)
        └── recent_alerts (top 5)
    → Dashboard.jsx
        ├── MetricCards (API data)
        ├── PieChart alerts_by_type (API data)
        ├── LineChart (frontend demo series — planned API in v1.1)
        └── Recent alerts table (API data)
```

## 2. Alert triage flow

```
GET /api/v1/alerts/?limit=50
    → Alerts.jsx
        ├── KPI strip (total, critical, new, volume)
        ├── Fraud summary by type (client-side aggregation)
        │     └── click row → filter by fraud_type
        └── Operational table (score, type, client, amount, status)
    → GET /api/v1/alerts/{id}
    → AlertDetail.jsx
        └── POST /api/v1/alerts/{id}/generate-report
            → ai_report_service.py → investigative summary
```

## 3. Investigation flow

```
GET /api/v1/investigations/?limit=50
    → Investigations.jsx (status KPIs + dense table)
    → GET /api/v1/investigations/{id}
    → InvestigationDetail.jsx
        ├── timeline_events (JSON from seed)
        ├── findings, analyst, priority
        └── linked alert data
```

## 4. Transaction monitoring flow

```
GET /api/v1/transactions/?limit=50
    → Transactions.jsx
        ├── Volume / avg score / blocked KPIs
        ├── Bar chart by channel (client aggregation)
        ├── Pie chart by tx_type (client aggregation)
        └── Dense transaction feed table
```

## 5. Client risk flow

```
GET /api/v1/clients/?limit=50
    → clients.py aggregates alerts_count + transactions_count per user
    → Clients.jsx
        ├── Risk distribution map (LOW → CRITICAL)
        └── Profile cards with risk meter
```

## 6. Rules engine flow

```
GET /api/v1/rules/?limit=50
    → Rules.jsx
        ├── KPIs (total, active, triggers)
        ├── Top triggers bar chart
        ├── Category distribution bars
        └── Rules catalog table (severity, status, trigger bar)
```

## 7. End-to-end fraud lifecycle (conceptual)

```
Transaction Event
    → Rules Engine evaluation (FraudRule catalog)
    → Risk score assignment (0–100, seed-based)
    → FraudAlert created
    → Investigation case (if escalated)
    → Dashboard KPI update
    → Analyst triage via UI
```
