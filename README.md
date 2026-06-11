# Driven Fraud Detection Platform

Enterprise anti-fraud platform for real-time risk monitoring, investigative analytics, and financial crime operations.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)]()
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)]()
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-C9A84C)]()

---

## Overview

Full-stack platform combining transactional monitoring, behavioral risk analysis, investigative workflows, and an ML-ready scoring layer — built with production-oriented architecture for fraud prevention and risk analytics teams.

| Module | Description |
|---|---|
| Executive Dashboard | KPIs, risk scores, alert distribution, time-series analytics |
| Alert Center | Real-time triage with severity scoring and filters |
| Investigations | Case management with event timelines |
| Transactions | End-to-end transaction surveillance |
| Clients | Customer risk profiling and activity correlation |
| Rules Engine | Configurable anti-fraud rules with trigger analytics |
| AI Reports | Investigative summaries (LLM-ready architecture) |

---

## Sobre o Projeto

A **Driven Fraud Detection Platform** é uma aplicação full-stack de prevenção à fraude que simula o funcionamento de uma central operacional corporativa. O sistema integra monitoramento transacional, triagem de alertas, gestão investigativa e governança de regras antifraude em uma única interface web.

A plataforma foi construída com arquitetura modular (**React 18 + FastAPI**), consumindo APIs REST versionadas (`/api/v1`) e persistindo dados em banco relacional (SQLite em desenvolvimento, PostgreSQL em produção). O ambiente de demonstração é populado automaticamente via seed com cenários realistas de maio/2024.

| Capacidade | Implementação no sistema |
|---|---|
| Monitoramento antifraude | Feed transacional com score de risco, status operacional e canais (PIX, TED, App Mobile, ATM) |
| Central de alertas | Fila de triagem com resumo analítico por tipo de fraude e tabela operacional compacta |
| Gestão investigativa | Central investigativa com workflow por status, prioridade e vínculo com alertas |
| Análise de clientes | Perfis monitorados com nível de risco, contagem de alertas e transações |
| Motor de regras | Catálogo de 10 regras com severidade, disparos e categorias (Transacional, Comportamento, Cadastro, Lavagem de Dinheiro) |
| Dashboards executivos | KPIs estratégicos, distribuição de alertas por tipo, série temporal e alertas recentes |
| Score de risco | Classificação visual por faixas (≥85 crítico, ≥70 alto, ≥50 médio) em alertas, transações e investigações |
| Analytics e visualização | Gráficos Recharts (pizza, barras, linha) e indicadores com filtro por período |

O frontend adota o design system **Driven** (TailwindCSS), com navegação lateral entre os módulos Dashboard, Alertas, Investigações, Transações, Clientes e Regras. A camada de detalhe de alertas suporta geração de parecer investigativo via endpoint de IA (`POST /api/v1/alerts/{id}/generate-report`), preparada para integração com modelos generativos.

---

## O Problema

Operações financeiras de médio e grande porte enfrentam um volume crescente de transações e eventos que não podem ser analisados manualmente com eficiência. Sem uma central unificada, equipes de prevenção à fraude perdem visibilidade sobre padrões suspeitos, demoram na priorização de casos críticos e fragmentam a investigação entre planilhas, e-mails e ferramentas desconectadas.

A plataforma endereça esse cenário com base nos fluxos reais implementados nas telas do sistema:

| Dor operacional | Como a plataforma responde |
|---|---|
| Excesso de transações sem triagem | Feed transacional com 88+ operações monitoradas, score, canal e status (Aprovada, Bloqueada, Pendente) |
| Baixa visibilidade sobre concentração de fraudes | Resumo analítico por categoria (Lavagem de Dinheiro, Cadastro Suspeito, Fraude Transacional, Comportamento Atípico, Outros) com volume, score médio e percentual |
| Demora na investigação | 15 casos investigativos com código, analista responsável, prioridade (LOW → CRITICAL) e timeline de eventos |
| Dificuldade de priorizar alertas | Score de risco numérico, alertas críticos (score ≥ 80) e filtros por status (Novo, Em análise, Encerrado) |
| Falta de controle sobre clientes suspeitos | 12 perfis com classificação de risco (LOW, MEDIUM, HIGH, CRITICAL) e correlação alertas × transações |
| Regras antifraude sem governança | Motor de regras com severidade, status ativo/inativo e métricas de disparos por regra |
| Monitoramento sem recorte temporal | Filtro de período no navbar (padrão: maio/2024) aplicado ao dashboard executivo |

O impacto operacional esperado é a redução do tempo de triagem, a identificação antecipada de exposição financeira em alertas de alto valor e a consolidação do workflow investigativo em um único painel — reduzindo perdas potenciais e aumentando a rastreabilidade das decisões de risco.

---

## Dashboard Online

Acesse a versão publicada da plataforma:

**https://node-js-react-e-java-script-moderno-eight.vercel.app**

---

## Funcionalidades da Plataforma

Funcionalidades derivadas dos módulos e rotas implementados no frontend (`App.jsx`) e backend (`/api/v1`):

| Módulo | Rota | Funcionalidades |
|---|---|---|
| Dashboard executivo | `/` | Total de alertas, alertas críticos, score médio de risco, transações suspeitas, gráfico de alertas por tipo, série temporal, tabela de alertas recentes |
| Gestão de alertas | `/alertas` | KPIs de triagem, resumo por tipo de fraude (clicável), fila operacional com score, valor, localização e status |
| Detalhe de alerta | `/alertas/:id` | Dados do cliente, dispositivo, IP, localização, valor e geração de parecer investigativo |
| Central investigativa | `/investigacoes` | Tabela operacional por status (Em andamento, Concluída, Arquivada), prioridade, analista e score |
| Detalhe investigativo | `/investigacoes/:id` | Timeline de eventos, achados, resumo de IA e dados do alerta vinculado |
| Feed transacional | `/transacoes` | Volume monitorado, score médio, transações bloqueadas, gráficos por canal e tipo, feed em tabela densa |
| Monitoramento de clientes | `/clientes` | Mapa de risco por nível, perfis com medidor de risco, alertas e transações por cadastro |
| Motor de regras antifraude | `/regras` | KPIs de regras ativas e disparos, top regras por volume de disparo, catálogo técnico por severidade |

**Capacidades transversais:**

- Score de risco em alertas, transações e investigações
- Indicadores operacionais e KPIs estratégicos no dashboard
- Filtros por período (data início/fim) no navbar
- Classificação de severidade e prioridade em regras e casos
- Workflow investigativo com encadeamento alerta → investigação → timeline
- Monitoramento comportamental via regras de categoria Comportamento e tipos de fraude atípicos
- Gestão de severidade (LOW, MEDIUM, HIGH, CRITICAL) no motor de regras
- Triagem operacional com busca textual e filtros por status e tipo

---

## Impacto Operacional Simulado

Métricas do ambiente de demonstração (seed automático — período base: **maio/2024**):

| Indicador | Volume simulado | Contexto operacional |
|---|---|---|
| **Volume financeiro monitorado** | **R$ 1,2M+** | Soma agregada de valores em alertas e transações exibida nas telas de Triagem e Feed Transacional |
| **Alertas na fila** | **25** | Alertas com score, status e tipo de fraude para triagem prioritária |
| **Alertas críticos** | **Score ≥ 80** | Destacados no dashboard executivo e na fila com codificação visual de risco |
| **Transações monitoradas** | **88** | Operações PIX, TED, Boleto e cartão com status Aprovada, Bloqueada ou Pendente |
| **Investigações abertas** | **15** | Casos com analista, prioridade e vínculo ao alerta de origem |
| **Clientes monitorados** | **12** | Perfis com nível de risco e histórico de alertas/transações |
| **Regras antifraude** | **10** | Regras ativas e inativas com contagem de disparos por categoria |
| **Score médio de risco** | **Calculado em tempo real** | Agregado via API `GET /api/v1/dashboard/metrics` conforme período selecionado |

```
┌──────────────────────────────────────────────────────────────────┐
│  AMBIENTE DE DEMONSTRAÇÃO — PREVENÇÃO À FRAUDE                   │
├──────────────────────────────────────────────────────────────────┤
│  R$ 1,2M+  volume monitorado  │  25 alertas  │  88 transações   │
│  15 investigações             │  12 clientes │  10 regras        │
│  Score de risco · Triagem · Workflow investigativo · Analytics   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Competências Demonstradas

Stack e práticas evidenciadas no repositório:

| Área | Evidência no projeto |
|---|---|
| **Fraud Analytics** | Resumo por tipo de fraude, score de risco e indicadores de concentração |
| **Risk Monitoring** | Dashboard com alertas críticos, transações suspeitas e classificação por faixa |
| **React** | SPA com React 18, React Router 6 e componentes reutilizáveis |
| **JavaScript** | Frontend ES modules com Vite 5 e Axios |
| **Data Visualization** | Recharts — gráficos de pizza, barras e linha nas telas operacionais |
| **Dashboard Design** | KPIs, sparklines e tabelas executivas no módulo Dashboard |
| **Investigative Workflow** | Central investigativa, timeline de eventos e parecer por alerta |
| **Anti-Fraud Rules Engine** | CRUD de regras com severidade, categorias e métricas de disparos |
| **Transaction Monitoring** | Feed transacional com canal, tipo, score e status operacional |
| **UI/UX Analytics** | Layout compacto enterprise, densidade operacional e design system Driven |
| **Business Intelligence** | Agregações por tipo, status, canal e categoria com filtros temporais |
| **KPI Monitoring** | Métricas em tempo real via `dashboard_service.py` |
| **Risk Analysis** | Níveis LOW → CRITICAL em clientes, prioridades em investigações e severidade em regras |
| **Operational Analytics** | Tabelas densas estilo SOC em Alertas, Investigações, Transações e Regras |
| **Git & GitHub** | Versionamento, estrutura enterprise e documentação técnica |

**Backend complementar:** Python 3.11, FastAPI, SQLAlchemy 2, Pydantic v2, estrutura `ml-pipeline/` para scoring e inferência.

---

## Autor

### Bruna Amaral

**Fraud Analytics | Data Analytics | Prevenção à Fraude | Monitoramento de Risco | Python | SQL | Power BI**

Profissional com experiência em prevenção à fraude, análise operacional, monitoramento transacional e automação de processos.

| | |
|---|---|
| **GitHub** | https://github.com/BrunaAmaral2706 |
| **Projeto Online** | https://node-js-react-e-java-script-moderno-eight.vercel.app |

---

## Platform Preview

Capturas reais da plataforma em execução — arquivos em `./screenshots/`.

### Executive Overview

![Overview](./screenshots/overwir.png)

### Alerts Center

![Alerts](./screenshots/alertas.png)

### Transactions

![Transactions](./screenshots/transações.png)

---

## Capturas da Plataforma

Previews dos módulos reais da aplicação — arquivos em `./screenshots/`.

### Dashboard Executivo

Visão consolidada com KPIs, distribuição de alertas por tipo, série temporal e alertas recentes.

![Dashboard](./screenshots/overwir.png)

### Central de Alertas

Fila de triagem com resumo analítico por categoria de fraude e tabela operacional compacta.

![Alertas](./screenshots/alertas.png)

### Central Investigativa

Gestão de casos com score, prioridade, status do workflow e encadeamento com alertas.

![Investigações](./screenshots/investigações.png)

### Feed Transacional

Monitoramento de volume, gráficos por canal e tipo, e feed em tabela densa.

![Transações](./screenshots/transações.png)

### Monitoramento de Clientes

Mapa de risco e perfis com nível de exposição, alertas e transações por cadastro.

![Clientes](./screenshots/clientes.png)

### Motor de Regras Antifraude

KPIs de disparos, analytics por categoria e catálogo técnico de regras.

![Regras](./screenshots/regras.png)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend — React 18 · Vite · TailwindCSS · Recharts        │
│  Dashboard │ Alerts │ Investigations │ Transactions │ Rules │
└────────────────────────────┬────────────────────────────────┘
                             │ REST /api/v1
┌────────────────────────────▼────────────────────────────────┐
│  Backend — FastAPI · Pydantic · SQLAlchemy                  │
└────────────────────────────┬────────────────────────────────┘
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
   ML Pipeline          PostgreSQL          Observability
   scoring · inference  SQLite · seed       health · logs
```

Detailed documentation: **[ARCHITECTURE.md](./ARCHITECTURE.md)**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, TailwindCSS, Recharts |
| Backend | Python 3.11, FastAPI, Uvicorn |
| Database | PostgreSQL / SQLite, SQLAlchemy 2 |
| Validation | Pydantic v2 |
| ML | Modular pipeline (`ml-pipeline/`) |
| DevOps | Docker Compose |

---

## API Reference

| Endpoint | Description |
|---|---|
| `GET /api/v1/dashboard/metrics` | Executive KPIs |
| `GET /api/v1/alerts/` | Fraud alerts |
| `GET /api/v1/alerts/{id}` | Alert detail |
| `POST /api/v1/alerts/{id}/generate-report` | AI investigative report |
| `GET /api/v1/investigations/` | Investigation cases |
| `GET /api/v1/transactions/` | Monitored transactions |
| `GET /api/v1/clients/` | Customer profiles |
| `GET /api/v1/rules/` | Anti-fraud rules |
| `GET /health` | Health check |
| `GET /docs` | Swagger UI |

---

## Project Structure

```
Driven-Fraud-Detection-Platform/
├── frontend/          # React SPA
├── backend/           # FastAPI REST API
├── ml-pipeline/       # Scoring, inference, monitoring
├── screenshots/       # Platform captures (manual)
├── architecture/      # Technical diagrams
├── docs/              # Product documentation
├── scripts/           # Development scripts
├── config/            # Environment templates
├── tests/             # Test suites
├── docker-compose.yml
└── ARCHITECTURE.md
```

---

## Quick Start

**Backend**

```bash
cd backend
python -m venv venv && venv\Scripts\activate    # Windows
pip install -r requirements.txt
cp ../config/.env.example .env
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000 |
| Swagger | http://localhost:8000/docs |

**Docker Compose:** `docker-compose up -d`

**Windows script:** `.\scripts\start-dev.ps1`

---

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) — system design and data flow
- [docs/roadmap.md](./docs/roadmap.md) — product roadmap
- [ml-pipeline/README.md](./ml-pipeline/README.md) — ML layer structure
- [screenshots/README.md](./screenshots/README.md) — how to add platform captures

---

## License

MIT — see [LICENSE](./LICENSE).
