# Data Flow

## Transactional Monitoring Flow

```
1. Transaction ingested
2. Rules engine evaluates (FraudRule catalog)
3. Risk score computed (0–100)
4. Threshold exceeded → FraudAlert created
5. High severity → Investigation case opened
6. Dashboard KPIs updated
7. Analyst reviews via UI
```

## Investigation Flow

```
Alert → Investigation → Timeline Events → AI Report → Case Resolution
```

## Dashboard Aggregation

```
FraudAlert + Transaction tables
    → dashboard_service (SQL aggregations)
    → /api/v1/dashboard/metrics
    → Recharts visualization
```
