# ML Pipeline Architecture

## Layers

```
┌─────────────────────────────────────────┐
│           Feature Engineering            │
│  velocity · amount · device · geo        │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│           Model Inference                │
│  XGBoost / Random Forest (planned)       │
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

## Current vs Target

| Aspect | v1.0 (Current) | v2.0 (Target) |
|---|---|---|
| Scoring | Rule-based | ML model |
| Features | Inline logic | Feature store |
| Inference | Synchronous API | Dedicated service |
| Monitoring | Dashboard KPIs | MLflow / Evidently |
