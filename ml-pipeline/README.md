# ML Pipeline — Driven Fraud Detection Platform

Modular machine learning layer for fraud scoring, real-time inference, and model monitoring.

## Structure

```
ml-pipeline/
├── scoring/        # Feature engineering & risk score computation
├── inference/      # Real-time scoring API integration
├── monitoring/     # Model drift, latency & performance KPIs
└── models/         # Serialized model artifacts (.gitignored)
```

## Current State (v1.0)

| Capability | Implementation |
|---|---|
| Risk scores in UI | Seed-based scores (0–100) in `seed_service.py` |
| Score display | `ScoreBadge.jsx` thresholds (85/70/50) |
| Dashboard critical | `dashboard_service.py` — alerts with score ≥ 80 |
| AI report | `ai_report_service.py` — template-based investigative summary |
| ML model | Not deployed — rule-based demo data only |

Rule-based scoring runs in `backend/app/services/` with a clear interface for ML replacement.

## Planned Pipeline (v2.0)

```
Raw Transaction
    → Feature Extraction (scoring/features.py)
    → Model Inference (inference/predictor.py)
    → Risk Score (0–100)
    → Alert Threshold Check
    → Dashboard KPI Update
```

## Feature Set (Planned)

| Feature | Type | Description |
|---|---|---|
| `tx_velocity_10m` | Numeric | Transactions in last 10 minutes |
| `amount_zscore` | Numeric | Deviation from user average |
| `device_known` | Binary | Known device fingerprint |
| `geo_distance_km` | Numeric | Distance from usual location |
| `hour_of_day` | Categorical | Temporal pattern |
| `channel_risk` | Categorical | Channel risk weight |

## Monitoring KPIs (Target)

| Metric | Target |
|---|---|
| Precision @ threshold | > 0.85 |
| Recall @ threshold | > 0.70 |
| Inference latency p95 | < 50ms |
| PSI (drift) | < 0.1 |

## Integration

```python
# Future integration point in backend
from ml_pipeline.inference.predictor import FraudScorer

score = FraudScorer().predict(transaction_features)
```

## Related documentation

- [architecture/ml-pipeline.md](../architecture/ml-pipeline.md)
- [docs/roadmap.md](../docs/roadmap.md) — v2.0 ML milestones

> This module does not alter the current operational pipeline. It provides the enterprise structure for ML evolution.
