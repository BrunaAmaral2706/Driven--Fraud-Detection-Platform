# Reports Directory

Generated investigation reports and export artifacts.

## Current (v1.0)

| Format | Source | Status |
|---|---|---|
| JSON | `POST /api/v1/alerts/{id}/generate-report` | Active — AI investigative summary in alert detail |
| UI | Investigation detail timeline + findings | Active — rendered in `/investigacoes/:id` |

The `ai_report_service.py` generates template-based investigative summaries from alert metadata (amount, device, location, fraud type). LLM integration is planned for v2.0.

## Planned (v1.1+)

| Format | Source |
|---|---|
| PDF | Investigation case exports |
| CSV | Alert / transaction bulk exports |
| Email | Scheduled fraud summary reports |

> Generated files are gitignored. Only this README is tracked.
