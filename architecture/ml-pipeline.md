# ML Pipeline Architecture

## Current state (v1.0)

| Component | Status | Location |
|---|---|---|
| Rule-based risk scores | Active | `seed_service.py` (demo data) |
| AI investigative report | Active | `ai_report_service.py` |
| ML model inference | Planned | `ml-pipeline/inference/` |
| Feature engineering | Planned | `ml-pipeline/scoring/` |
| Model monitoring | Planned | `ml-pipeline/monitoring/` |

Scores displayed in UI use thresholds from `ScoreBadge.jsx`:

| Score | Classification |
|---|---|
| ≥ 85 | Critical |
| ≥ 70 | High |
| ≥ 50 | Medium |
| < 50 | Low |

Dashboard critical alerts use threshold **≥ 80** (`dashboard_service.py`).

## Target architecture (v2.0)

```
┌─────────────────────────────────────────┐
│           Feature Engineering            │
│  velocity · amount · device · geo        │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│           Model Inference                │
│  XGBoost / Random Forest                 │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│           Risk Score (0–100)             │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│           Monitoring & Drift             │
│  PSI · AUC · Latency · Alert Rate        │
└─────────────────────────────────────────┘
```

## Integration points

| Integration | Current | Target |
|---|---|---|
| Alert scoring | Seed random scores | `ml-pipeline/inference/predictor.py` |
| AI report | Template-based summary | LLM API (Claude/OpenAI) |
| Dashboard KPIs | SQL aggregations | + ML model performance metrics |
| Rules engine | Static catalog | Dynamic rule evaluation service |

See [ml-pipeline/README.md](../ml-pipeline/README.md) for module structure.
