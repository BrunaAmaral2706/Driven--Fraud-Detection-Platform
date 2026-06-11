# Scoring Module

Feature extraction and risk score computation for fraud detection.

## Current (v1.0)

- Risk scores assigned in `backend/app/services/seed_service.py` (random 40–99)
- Display thresholds in `frontend/src/components/ScoreBadge.jsx`
- Dashboard critical threshold: score ≥ 80 (`dashboard_service.py`)

## Target (v2.0)

- Feature pipeline: velocity, amount z-score, device, geo, temporal patterns
- Model: scikit-learn / XGBoost
- Output: probability → risk score 0–100

See [ml-pipeline/README.md](../README.md) and [architecture/ml-pipeline.md](../../architecture/ml-pipeline.md).
