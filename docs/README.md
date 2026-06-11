# Documentação — Driven Fraud Detection Platform

Índice central da documentação do projeto.

## Documentação principal

| Documento | Conteúdo |
|---|---|
| [README.md](../README.md) | Visão geral, seções institucionais, screenshots, quick start |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Arquitetura técnica enterprise (camadas, APIs, scoring, deploy) |
| [roadmap.md](./roadmap.md) | Roadmap v1.0 / v1.1 / v2.0 e limitações conhecidas |

## Diagramas técnicos

| Documento | Conteúdo |
|---|---|
| [system-overview.md](../architecture/system-overview.md) | Componentes, portas e comunicação |
| [data-flow.md](../architecture/data-flow.md) | Fluxos transacional, investigativo e dashboard |
| [ml-pipeline.md](../architecture/ml-pipeline.md) | Arquitetura ML atual vs. planejada |

## Módulos especializados

| Documento | Conteúdo |
|---|---|
| [ml-pipeline/README.md](../ml-pipeline/README.md) | Pipeline de scoring, inferência e monitoramento |
| [screenshots/README.md](../screenshots/README.md) | Capturas de tela para o README |
| [data/README.md](../data/README.md) | Datasets e seed |
| [reports/README.md](../reports/README.md) | Relatórios e exportações |
| [tests/README.md](../tests/README.md) | Estrutura de testes |

## Módulos da aplicação (frontend)

| Rota | Página | Documentação viva |
|---|---|---|
| `/` | Dashboard executivo | KPIs, pizza por tipo, alertas recentes |
| `/alertas` | Fila de triagem | Resumo por fraude + tabela operacional |
| `/alertas/:id` | Detalhe de alerta | Parecer IA, dispositivo, cliente |
| `/investigacoes` | Central investigativa | Tabela por status e prioridade |
| `/investigacoes/:id` | Caso investigativo | Timeline, achados, alerta vinculado |
| `/transacoes` | Feed transacional | Gráficos + tabela densa |
| `/clientes` | Monitoramento de clientes | Mapa de risco + perfis |
| `/regras` | Motor de regras | KPIs, disparos, catálogo |

## Ambiente de demonstração

| Parâmetro | Valor |
|---|---|
| Período padrão | 01/05/2024 — 31/05/2024 |
| Alertas | 25 |
| Transações | 88 |
| Investigações | 15 |
| Clientes | 12 |
| Regras | 10 |

Dados gerados por `backend/app/services/seed_service.py` na inicialização do backend.

## Links

| Recurso | URL |
|---|---|
| Repositório | https://github.com/BrunaAmaral2706/Driven--Fraud-Detection-Platform |
| Deploy (Vercel) | https://node-js-react-e-java-script-moderno-eight.vercel.app |
| API local | http://localhost:8000/docs |
