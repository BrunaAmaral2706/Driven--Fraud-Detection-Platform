# Monitoring Module

Model performance and drift monitoring for production ML operations.

## Current (v1.0)

Operational monitoring via dashboard KPIs:

| KPI | Source |
|---|---|
| Total alerts | `dashboard_service.py` |
| Critical alerts | score ≥ 80 |
| Suspicious transactions | score ≥ 60 |
| Avg risk score | SQL aggregation |

## Target (v2.0)

| KPI | Description |
|---|---|
| PSI | Population Stability Index — feature drift |
| AUC-ROC | Model discrimination power |
| Latency p95 | Inference response time |
| Alert rate | Operational alert volume |

Tools planned: MLflow, Evidently AI.
