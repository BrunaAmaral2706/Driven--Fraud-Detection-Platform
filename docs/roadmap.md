# Roadmap — Driven Fraud Detection Platform

## v1.0 (Atual — concluído)

### Core platform
- [x] Dashboard executivo com KPIs via API (`/api/v1/dashboard/metrics`)
- [x] Filtro de período no navbar (`DateRangeFilter` + `DateRangeContext`)
- [x] Seed automático de demonstração (maio/2024)
- [x] Backend FastAPI com SQLite (dev) / PostgreSQL (prod)
- [x] APIs REST: alertas, investigações, transações, clientes, regras
- [x] Docker Compose + script `scripts/start-dev.ps1`

### Módulos frontend
- [x] **Alertas** — resumo analítico por tipo de fraude + fila de triagem em tabela compacta
- [x] **Investigações** — central investigativa operacional (tabela densa + KPIs por status)
- [x] **Transações** — feed transacional com gráficos por canal/tipo e tabela operacional
- [x] **Clientes** — mapa de risco e perfis com medidor de exposição
- [x] **Regras** — motor de regras com KPIs, gráficos de disparos e catálogo técnico
- [x] Detalhe de alerta com parecer investigativo (`POST /alerts/{id}/generate-report`)
- [x] Detalhe de investigação com timeline de eventos

### Enterprise & documentação
- [x] Estrutura monorepo enterprise
- [x] README institucional (Sobre, Problema, Funcionalidades, Impacto, Autor)
- [x] Screenshots reais em `./screenshots/` (6 módulos)
- [x] ARCHITECTURE.md + diagramas em `architecture/`
- [x] ML pipeline module (estrutura preparatória)

### Limitações conhecidas (v1.0)
- Gráfico de linha do dashboard usa série simulada no frontend (KPIs e pizza vêm da API)
- Filtro de período aplica-se ao dashboard; listagens operacionais exibem dataset completo
- Autenticação aberta (sem JWT)
- ML scoring ainda rule-based no seed

---

## v1.1 (Planejado)

- [ ] Autenticação JWT e controle de papéis (Analyst, Manager, Admin)
- [ ] Filtro de período nas listagens operacionais (alertas, transações, investigações)
- [ ] Série temporal do dashboard 100% via API
- [ ] Export CSV/PDF de alertas e investigações
- [ ] Notificações em tempo real (WebSocket)
- [ ] Paginação completa no frontend
- [ ] Renomear `overwir.png` → `dashboard.png` nos screenshots

---

## v2.0 (Futuro)

- [ ] Integração com LLM real (Claude / OpenAI API)
- [ ] Score de risco com ML (scikit-learn / XGBoost)
- [ ] Regras configuráveis pelo usuário (CRUD)
- [ ] Endpoint `POST /api/v1/score` para inferência em tempo real
- [ ] Mapa geográfico interativo de transações
- [ ] Relatórios automáticos por e-mail
- [ ] Dashboard mobile otimizado
