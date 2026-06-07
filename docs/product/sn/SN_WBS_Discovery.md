# SN Project — WBS Implementation Discovery (v2)

> **Date**: 2026-04-12 (revised)
> **Scope**: Full discovery for implementing the SN WBS (8 modules, 2,462 person-days, 10 months) by migrating and white-labeling isA platform + IAM project assets into a standalone deliverable.
> **Constraint**: The delivered project must have zero visible connection to isA. All code, packages, naming, documentation, and git history must be clean.
> **IAM Source**: `~/Documents/Fun/Projects/IAM` (standalone Authentik-based platform, separate from isA)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Asset Inventory — What We Actually Have](#2-asset-inventory--what-we-actually-have)
3. [WBS → Source Mapping Matrix](#3-wbs--source-mapping-matrix)
4. [Module-by-Module Deep Dive](#4-module-by-module-deep-dive)
5. [Gap Analysis — What's Truly Net-New](#5-gap-analysis--whats-truly-net-new)
6. [Revised Effort Savings](#6-revised-effort-savings)
7. [White-Label Migration Strategy](#7-white-label-migration-strategy)
8. [Migration Execution Plan](#8-migration-execution-plan)
9. [Risk Analysis](#9-risk-analysis)
10. [Recommended Project Structure](#10-recommended-project-structure)
11. [Next Steps](#11-next-steps)

---

## 1. Executive Summary

### The WBS

| # | Module | Person-Days | Timeline |
|---|--------|------------|----------|
| 1 | Cloud Platform (Alibaba Apsara) | 73 | M1-M3 |
| 2 | Big Data Platform (MaxCompute) | 100 | M1-M4 |
| 3 | Data Middle Platform (DataPhin) | 438 | M1-M7 |
| 4 | Model Platform (MaaS/PAI) | 360 | M2-M7 |
| 5 | Agent Platform (Self-developed) | 387 | M2-M7 |
| 6 | Agentic Apps (23 applications) | 904 | M4-M10 |
| 7 | IAM & Security (Feilian) | 97 | M1-M5 |
| 8 | Project Management | 103 | M1-M10 |
| | **Total** | **2,462** | **M1-M10** |

### What We Actually Have (Revised)

After deep-diving into isA_Cloud, isA_Model, isA_Data, and the standalone IAM project, the coverage is **far higher** than initially estimated:

| Module | Initial Estimate | Revised Estimate | Why Higher |
|--------|-----------------|------------------|------------|
| 1. Cloud | 20% | **~50%** | isA_Cloud has full K8s production infra, APISIX, ArgoCD, monitoring, GPU Operator |
| 2. BigData | 15% | **~40%** | isA_Cloud deploys Flink Operator, StarRocks, Ray clusters, DuckDB |
| 3. Data | 14% | **~55%** | isA_Data has Dataphin 5-backend federation, data lake zones, ETL, CDC, quality, governance, 100% PRD |
| 4. Model | 33% | **~65%** | isA_Model has LoRA/GRPO fine-tuning, 4 inference engines, quantization, GPU mgmt, billing |
| 5. Agent | 77% | **~80%** | Confirmed — production SDK, MCP, OS agents |
| 6. Apps | 28% | **~35%** | Framework reuse scales with stronger platform layers |
| 7. IAM | 52% | **~85%** | Standalone IAM project: 6 protocols, 129 MCP tools, 7 integrations, compliance mapping |
| 8. PM | 0% | **0%** | Process, not software |

### Revised Bottom Line

| Metric | Initial | Revised |
|--------|---------|---------|
| Total effort saved | ~810 days (33%) | **~1,260 days (51%)** |
| Migration overhead | 120 days | **150 days** |
| Net savings | ~690 days | **~1,110 days (45%)** |
| Effective delivery | ~1,772 days | **~1,352 days** |
| Timeline impact | 7 months (vs 10) | **6-7 months (vs 10)** |
| Cost savings (blended 2,700/day) | ~186万 | **~300万** |

---

## 2. Asset Inventory — What We Actually Have

### isA_Cloud (v0.3.1) — The Infrastructure Backbone

**NOT just K8s configs.** This is a complete cloud-native platform:

**isa_common Library (13 Native Async Clients, 10,852 LOC):**

| Client | Backend | Methods | Status |
|--------|---------|---------|--------|
| AsyncRedisClient | Redis 7 | 53 | Production — pub/sub, locks, pipelining |
| AsyncPostgresClient | PostgreSQL 16 | 19 | Production — parameterized queries, pooling |
| AsyncNATSClient | NATS 2 | 33 | Production — JetStream, durable consumers, KV |
| AsyncNeo4jClient | Neo4j 5 | 37 | Production — Cypher, traversals |
| AsyncMinIOClient | MinIO S3 | 35 | Production — multipart upload, S3 API |
| AsyncQdrantClient | Qdrant | 25 | Production — vector search, collections |
| AsyncDuckDBClient | DuckDB | 27 | Production — SQL analytics, Parquet/Arrow |
| AsyncMQTTClient | Mosquitto | 29 | Production — pub/sub, QoS |
| AsyncLokiClient | Loki | — | Production — log push API |
| AsyncSQLiteClient | SQLite | — | Fallback — local mode |
| AsyncLocalStorageClient | Filesystem | — | Fallback — local mode |
| AsyncChromaClient | Chroma | — | Fallback — local mode |
| AsyncMemoryClient | In-memory | — | Fallback — dev mode |

**Production K8s Infrastructure (79 YAML files, 3 environments):**

| Component | Config | WBS Mapping |
|-----------|--------|-------------|
| Flink Operator | `production/values/flink-operator.yaml` | WBS 2.1 (Flink on K8s) |
| StarRocks (FE+BE) | `production/values/starrocks.yaml` | WBS 2.2 (OLAP) |
| Ray CPU Cluster | `production/values/ray-cluster.yaml` (1-10 workers) | WBS 4.x (Model compute) |
| Ray GPU Cluster | `production/values/ray-gpu-cluster.yaml` (0-4 GPUs) | WBS 4.x (GPU inference) |
| Ray Data Cluster | `production/values/ray-data-cluster.yaml` (Polars/DuckDB) | WBS 3.x (Data processing) |
| KubeRay Operator | `production/values/kuberay-operator.yaml` | WBS 4.x (Cluster mgmt) |
| NVIDIA GPU Operator | `production/values/nvidia-gpu-operator.yaml` | WBS 1.2.4 (GPU scheduling) |
| MLflow (2 replicas) | `production/values/mlflow.yaml` | WBS 4.1.2 (Experiment tracking) |
| JupyterHub | `production/values/jupyterhub.yaml` | WBS 4.1.3 (Notebooks) |
| Redis Cluster (6 nodes) | `production/values/redis-cluster.yaml` | WBS 1.x (Infrastructure) |
| MinIO Distributed (4 nodes) | `production/values/minio-distributed.yaml` | WBS 2.3.1 (Object storage) |
| NATS JetStream | `production/values/nats-jetstream.yaml` | WBS 2.x (Event streaming) |
| Prometheus + ServiceMonitors | 13 CRDs, alerting rules | WBS 1.3.1 (Monitoring) |
| Loki + Tempo | Log aggregation + distributed tracing | WBS 1.3.2 (Logging) |
| Grafana | Dashboards, auto-provisioned datasources | WBS 1.3.1 (Visualization) |
| APISIX 3.8 | Gateway, Consul sync, rate limiting, JWT auth | WBS 7.3.3 (API security) |
| Consul | 3-replica HA, 42 registered services | WBS 1.x (Service discovery) |
| External Secrets Operator | Vault integration | WBS 7.x (Secrets mgmt) |

**ArgoCD GitOps (App-of-Apps):**
- 3 environments: dev (auto-sync), staging (auto-sync 30s), production (manual)
- Child apps: agent, data, mcp, model, os, user, blockchain services
- Retry: 5 attempts with exponential backoff

**Terraform IaC:**
- Modules: networking, ECS cluster, storage (EFS/ECR), secrets (Vault), RDS, ElastiCache
- Environments: dev, staging, production

**CI/CD (7 GitHub Actions workflows):**
- Test, security scan (Trivy), manifest validation, image push, promotion gates, rollback

**Observability (isa_common):**
- `metrics.py` — Prometheus counters/histograms/gauges with naming conventions
- `tracing.py` — OpenTelemetry OTLP to Tempo, W3C TraceContext
- `observability.py` — One-liner setup for any service
- `loki_handler.py` — Python log push to Loki

**Event-Driven Billing:**
- `events/billing_events.py` — EventType, CostComponent, UnitType models
- NATS JetStream publishing with durable consumers

---

### isA_Model (v0.6.0) — Full MaaS Platform

**NOT just model routing.** This is a complete MLOps + serving + training platform:

**Multi-Provider Serving (9 providers):**
- OpenAI (GPT-4.1, o1, o3), Anthropic (Claude Sonnet 4, Opus), Cerebras, OpenRouter (200+ models), Ollama, Replicate, ISA self-hosted (Qwen3.5, GLM-5)
- Streaming for all providers, multi-modal (vision, audio, video, embedding)

**LLM Caching (Redis-backed):**
- Dual-layer: streaming (15ms/chunk replay) + non-streaming (100x speedup)
- Temperature-based TTL: 0.0→24h, ≤0.3→1h, ≤0.7→5min, >0.7→no cache
- Graceful degradation on Redis failure

**Fine-Tuning Pipeline (Lightning-based):**
- **5 algorithms**: APO, GRPO, LoRA-SFT, Closed-Loop, ETO
- Dependencies: `peft>=0.4.0` (LoRA), `bitsandbytes>=0.39.0` (4-bit/8-bit)
- Auto trace collection from PostgreSQL → Lightning Rollout format
- MLflow experiment tracking integration

**4 Inference Engines:**
- vLLM (paged attention, continuous batching, prefix caching)
- SGLang (MoE optimized, compressed attention)
- NVIDIA Triton (TensorRT, multi-GPU, ensemble pipelines)
- ONNX Runtime (cross-platform, quantization friendly)

**Quantization (5 methods):**
- GPTQ, AWQ, INT8, EXL2, GGUF
- Calibration datasets (WikiText, c4, alpaca)

**GPU Management (14 modules):**
- VRAM-aware allocation, NVIDIA GPU discovery (NVML)
- Ray cluster integration (CPU + GPU)
- Training orchestration, eviction policies

**Model Registry (PostgreSQL-backed):**
- Lifecycle: registered → training → evaluation → deployment → production → retired
- Metadata: capabilities, performance baselines, pricing, specialized tasks

**A/B Testing:**
- Canary deployments, quality-driven routing
- Feedback-based scoring with temporal weighting
- Automatic fallback on quality degradation

**Backend Router (5 execution backends):**
- CLOUD (API), RAY_SERVE (distributed), LOCAL_GPU (direct), LOCAL (Ollama), MODAL (serverless)
- Auto-selection based on input length, task type, quality, cost, availability
- Circuit breaker per provider

**Billing & Tenant Usage:**
- Durable events via NATS (DLQ for failures)
- Per-tenant quota enforcement (soft/hard limits)
- Usage aggregation: hourly/daily/monthly
- Token counting with reasoning token tracking

**Feature Store:**
- Feast integration (`features/store.py`)
- Live feature trackers

---

### isA_Data (Production, 100% PRD) — The Data Middle Platform

**NOT just data analytics.** This IS the data middle platform the WBS describes:

**5 Major Service Domains, 71 Service Classes, 50+ API Endpoints, 203 Test Files:**

**A. Digital Service (RAG/Knowledge Management):**
- 7 RAG patterns: SimpleRAG, CRAG, HyDE, GraphRAG, RAGFusion, SelfRAG, RAPTOR
- Hybrid search (BM25 + vector), MMR reranking
- RAG evaluation and diagnostics

**B. Data Fabric Service (Intelligent Query Layer):**
- NL→SQL with `IntelligentQueryService` (AI-first)
- AI-powered lineage, column-level lineage, impact analysis
- Data quality: AI profiler + anomaly detector + rules engine
- Semantic layer: metric resolver, dimension mapper, term resolver
- **Active metadata**: real-time schema monitoring, change detection

**C. Data Infrastructure Service (Storage & Processing):**
- **Data lake with zones**: raw/curated/gold (= ODS/DWD+DWS/ADS)
- Delta Lake manager with ACID transactions
- **Ingestion**: batch processor, CDC listener, streaming ingestion
- **Transformation**: feature engineering, business rules, aggregation
- **Quality gates**: CurationGate (Bronze→Silver), GoldPromotionGate (Silver→Gold)
- DuckDB executor for fast analytics
- Materialized views with incremental refresh

**D. Data Product Service (Governed Products):**
- User analytics: Profile, Order History, 360 View
- Behavior: Patterns, Engagement, Feature Usage, Journey Analysis
- Predictive: Churn, LTV, Trends, Intent
- Recommendations: Graph, Content, Product, Social
- **Governance**: PII detection, GDPR compliance, product versioning, SLA monitoring

**E. Dataphin Federation (5 Backends) — THIS IS THE KEY:**

| Backend | Purpose | File |
|---------|---------|------|
| **Warehouse** | Access Dataphin ODS/DWD/DWS layers, zone mapping, table discovery | `federation/dataphin/warehouse_backend.py` |
| **Indicator** | KPI system, metric computation, fallback to local views | `federation/dataphin/indicator_backend.py` |
| **Governance** | Quality rules sync, lineage enrichment, standards mapping | `federation/dataphin/governance_backend.py` |
| **Master Data** | Entity resolution, AI-powered matching, dimension standardization | `federation/dataphin/master_data_backend.py` |
| **BI** | FineBI + Metabase integration, dashboard discovery, reports | `federation/dataphin/bi_backend.py` |

- Uses **official Alibaba Cloud SDK**: `alibabacloud_dataphin_public20230630.Client`
- Graceful degradation if SDK not installed
- Recent refactoring (last 8 commits) cleaned up gRPC → SDK migration

**Data Governance Framework (5 Layers):**
1. PII & Privacy (PII detection, GDPR compliance, masking)
2. Data Contracts (consumer contracts, SLAs, schema guarantees)
3. Quality Gates (zone promotion rules)
4. Lineage & Impact (SQL parsing, cross-modal lineage)
5. Active Metadata (real-time schema monitoring, drift detection)

---

### IAM Project (~/Documents/Fun/Projects/IAM) — Enterprise-Grade Identity Platform

**NOT from isA_user.** This is a **standalone, mature Authentik-based IAM platform**:

**6 Authentication Protocols:**
- OIDC/OAuth2 (PKCE, consent flows, custom claims)
- SAML 2.0 (enterprise SSO)
- LDAP/LDAPS (directory bind, search)
- RADIUS (VPN/WiFi auth with MFA)
- SCIM 2.0 (user/group provisioning)
- Proxy Auth (forward auth patterns)

**Authorization:**
- RBAC via group bindings (6 verified access groups, tested matrix)
- ABAC via expression policies (Python with `ak_is_group_member()`)
- Time-based, IP-based, department-based conditional access
- Device trust via HTTP header checks

**129 MCP Tools across 30 Modules:**
- Identity lifecycle (create, update, disable, delete, offboard, HR sync)
- RBAC management (groups, bindings, policies)
- Application provisioning (OIDC, SAML, LDAP, RADIUS providers)
- Flow management (authentication, enrollment, recovery)
- Security (MFA enforcement, password policies, session management)
- PAM (privileged access, JIT elevation)
- Compliance (SOC2/GDPR/ISO27001 snapshot, audit events)
- Device trust (conditional access)
- HR sync (Feishu People API)
- Auto-offboarding (terminated employees)

**7 Downstream System Integrations (all tested):**
- Feishu HR (people sync, workspace)
- FineBI (LDAP + role assignment)
- JumpServer (OIDC SSO + session audit)
- Synology NAS (LDAP + DSM API)
- Ziniao Browser (account provisioning)
- ERP (SSO integration)
- SpringBoot apps (OIDC)

**Compliance Mapping:**
- SOC2 (CC6 access, CC7 operations, CC8 change)
- GDPR (Art. 5 lawfulness, Art. 15 access, Art. 17 erasure, Art. 32 security)
- ISO 27001:2022 (A.5 organizational, A.8 technology, A.9 access)
- 13/13 critical controls mapped

**Infrastructure:**
- Multi-env K8s (dev/staging/prod via Kind + on-prem)
- Helm charts with base + per-env overrides
- Network policies (default deny ingress/egress in prod)
- Traefik ingress with TLS, rate limiting
- SOPS/age encrypted secrets
- Prometheus + Grafana monitoring
- Backup CronJobs (pg_dump + S3 + WAL archive)
- Docker Compose alternative for quick setup

**Production Gaps (addressable in 5-10 weeks):**
- 4 RED: backup activation, secrets rotation, CI/CD pipeline, audit retention
- 4 YELLOW: centralized logging, egress hardening, cert-manager, runbooks

---

## 3. WBS → Source Mapping Matrix

### Legend
- **Direct** = Fork with config/branding changes only
- **Adapt** = 60-80% from source; domain customization needed
- **Partial** = Patterns/infrastructure reusable; significant new code
- **New** = No coverage; build from scratch

### Module 1: Cloud Platform (73 days → ~35 days saved)

| WBS | Task | Source | Level | Asset |
|-----|------|--------|-------|-------|
| 1.1.1 | Data center planning | — | **New** | Physical hardware |
| 1.1.2 | Hardware deployment | — | **New** | Vendor scope |
| 1.1.3 | Network integration | — | **New** | Network vendor |
| 1.1.4 | Base OS & drivers | isA_Cloud | **Partial** | GPU Operator (`nvidia-gpu-operator.yaml`) handles driver |
| 1.2.1 | Apsara base deployment | — | **New** | Alibaba Cloud proprietary |
| 1.2.2 | K8s/ACK cluster | isA_Cloud | **Direct** | Full K8s manifests for 3 environments + Helm charts |
| 1.2.3 | Storage solutions | isA_Cloud | **Direct** | MinIO distributed (4 nodes) + CSI patterns |
| 1.2.4 | GPU scheduling | isA_Cloud | **Direct** | NVIDIA GPU Operator + DCGM + GFD + MIG support |
| 1.2.5 | Helm standardization | isA_Cloud | **Direct** | Generic Helm chart (`charts/isa-service/`) |
| 1.3.1 | Monitoring | isA_Cloud | **Direct** | Prometheus + 13 ServiceMonitors + alerting rules + Grafana |
| 1.3.2 | Logging | isA_Cloud | **Direct** | Loki + Tempo + Python loki_handler + OTLP tracing |
| 1.3.3 | CI/CD pipeline | isA_Cloud | **Direct** | ArgoCD app-of-apps + 7 GitHub Actions workflows |
| 1.3.4 | Cloud MCP Server | isA_MCP | **Direct** | Enterprise server base + K8s tools |

### Module 2: Big Data Platform (100 days → ~40 days saved)

| WBS | Task | Source | Level | Asset |
|-----|------|--------|-------|-------|
| 2.1.1 | Flink on K8s | isA_Cloud | **Direct** | `flink-operator.yaml` — RocksDB state, S3 checkpoints |
| 2.1.2 | Flink SQL platform | — | **Partial** | Operator ready; SQL Gateway config is new |
| 2.1.3 | CDC data sync | isA_Data | **Direct** | `CDCListener`, `ChangeDataProcessor`, schema evolution |
| 2.1.4 | Real-time tuning | — | **Partial** | Flink Operator provides foundation |
| 2.2.1 | StarRocks cluster | isA_Cloud | **Direct** | `starrocks.yaml` — 1 FE + 2 BE nodes |
| 2.2.2 | Data model design | isA_Data | **Adapt** | Data lake zone model (raw/curated/gold) maps to StarRocks tables |
| 2.2.3 | Data import | isA_Data | **Adapt** | IngestionService + StreamingIngestionService |
| 2.2.4 | Query optimization | isA_Data | **Partial** | DuckDB executor patterns; StarRocks-specific tuning is new |
| 2.3.1 | MinIO/OSS storage | isA_Cloud | **Direct** | MinIO distributed 4-node + AsyncMinIOClient (35 methods) |
| 2.3.2 | Iceberg lake | isA_Data | **Adapt** | Delta Lake manager maps to Iceberg concepts |
| 2.3.3 | Multi-engine access | isA_Data | **Adapt** | Federation layer already handles multi-backend |
| 2.4.1 | Monitoring | isA_Cloud | **Direct** | ServiceMonitor CRDs + Prometheus rules |
| 2.4.2 | Job scheduling | — | **Partial** | Flink Operator handles some; DolphinScheduler is new |
| 2.4.3 | BigData MCP Server | isA_MCP | **Direct** | Enterprise server base + Flink/StarRocks tools |

### Module 3: Data Middle Platform (438 days → ~240 days saved)

| WBS | Task | Source | Level | Asset |
|-----|------|--------|-------|-------|
| 3.1.1 | DataPhin deployment | isA_Data | **Adapt** | Official SDK wrapper (`alibabacloud_dataphin_public20230630.Client`) already integrated |
| 3.1.2 | Data source registry | isA_Data | **Direct** | `DataCatalogService` + entity indexing + connectivity |
| 3.1.3 | Dev standards & spaces | isA_Data | **Direct** | Zone management (raw/curated/gold), dev/prod isolation |
| 3.2.1 | Governance standards | isA_Data | **Direct** | 5-layer governance framework (PII, contracts, gates, lineage, metadata) |
| 3.2.2 | Quality rules | isA_Data | **Direct** | `QualityRulesEngine` (NOT NULL, COMPLETENESS, UNIQUE, REGEX, RANGE, FK, OUTLIER) + `AIQualityService` (AI-powered anomaly detection) |
| 3.2.2.1 | Completeness/consistency | isA_Data | **Direct** | Rule types implemented: NOT_NULL, COMPLETENESS, UNIQUE, FOREIGN_KEY |
| 3.2.2.2 | Accuracy/timeliness | isA_Data | **Direct** | `AIAnomalyDetector` (isolation forest) + freshness monitoring |
| 3.2.2.3 | Quality reports | isA_Data | **Direct** | Quality scoring (0-100), component breakdown, remediation suggestions |
| 3.2.3 | Metadata & lineage | isA_Data | **Direct** | `AILineageService` (column-level), `ActiveMetadataService` (real-time), `CrossModalLineageService` |
| 3.3.1 | E-commerce crawlers | isA_OS | **Adapt** | Playwright browser automation (DOM + vision + hybrid) |
| 3.3.1.1 | Crawler architecture | isA_OS | **Adapt** | Browser Agent with proxy, anti-detection; scheduling framework needed |
| 3.3.1.2 | Price monitoring | — | **Partial** | Browser automation ready; domain scraping rules new |
| 3.3.1.3 | Listing/review scraping | isA_OS | **Adapt** | Playwright page parsing; platform-specific selectors new |
| 3.3.1.4 | BSR/market data | — | **Partial** | Infrastructure ready; data model new |
| 3.3.2 | Social media crawlers | isA_OS | **Adapt** | Browser Agent for TikTok/Pinterest/FB/Instagram |
| 3.3.3 | Supply chain data | — | **Partial** | API client patterns from isa_common |
| 3.3.4 | Ad/traffic data APIs | isA_Data | **Adapt** | Federation layer + API client patterns |
| 3.3.4.1 | Ad platform APIs | isA_Data | **Adapt** | Federation backend pattern for external APIs |
| 3.3.4.2 | Search trends | — | **Partial** | API patterns reusable |
| 3.4.1 | ODS layer | isA_Data | **Direct** | Raw zone = ODS, `IngestionService` + `BatchProcessor` |
| 3.4.2 | DWD detail layer | isA_Data | **Adapt** | Curated zone = DWD, `DataCleaningService` + `DataValidationService` |
| 3.4.2.1-3 | Domain DWD models | isA_Data | **Adapt** | `TransformationService` + `FeatureEngineeringService`; domain modeling new |
| 3.4.3 | DWS summary layer | isA_Data | **Adapt** | Gold zone = DWS, `DataAggregationService` + `MaterializedViewService` |
| 3.4.4 | ADS application layer | isA_Data | **Adapt** | Data products service (User360, analytics products) |
| 3.4.5 | Master data | isA_Data | **Direct** | `MasterDataBackend` with AI-powered entity matching |
| 3.4.6 | ETL tasks & scheduling | isA_Data | **Adapt** | ETL pipeline (ingest → clean → validate → transform → promote); scheduling new |
| 3.5.1 | Indicator system | isA_Data | **Direct** | `IndicatorBackend` + `MetricResolver` + `SemanticResolver` |
| 3.5.2 | Feature Store | isA_Data + isA_Model | **Direct** | `FeatureEngineeringService` (encoding, scaling, temporal, interaction) + Feast integration |
| 3.5.3 | Data Service API | isA_Data | **Direct** | 50+ API endpoints, unified data service |
| 3.6.1 | BI platform | isA_Data | **Adapt** | `BIBackend` (FineBI + Metabase adapters) |
| 3.6.2 | Report templates | isA_Data | **Partial** | Export engines exist; domain report templates new |
| 3.6.3 | Data portal & catalog | isA_Data | **Direct** | `DataCatalogService` + asset indexing + search |

### Module 4: Model Platform (360 days → ~235 days saved)

| WBS | Task | Source | Level | Asset |
|-----|------|--------|-------|-------|
| 4.1.1 | PAI platform | isA_Cloud | **Adapt** | Ray clusters (CPU+GPU+Data) + KubeRay Operator serve as PAI equivalent |
| 4.1.2 | MLflow experiment mgmt | isA_Cloud + isA_Model | **Direct** | MLflow 2-replica deployment + model experiment tracking integration |
| 4.1.3 | Notebook environment | isA_Cloud | **Direct** | JupyterHub deployment + GPU scheduling |
| 4.1.4 | Dataset management | isA_Data | **Adapt** | `IngestionService` + `DataValidationService`; labeling tools new |
| 4.2.1 | LLM deployment (Qwen) | isA_Model | **Direct** | Multi-provider serving (Qwen3.5 already supported), vLLM/SGLang engines |
| 4.2.2 | LLM fine-tuning | isA_Model | **Direct** | Lightning pipeline: LoRA-SFT, GRPO, APO, ETO + peft/bitsandbytes |
| 4.2.3 | Embedding/Reranker | isA_Model | **Direct** | OpenAI/Ollama embeddings + Jina Reranker v2 |
| 4.2.4 | Inference optimization | isA_Model | **Direct** | Quantization (GPTQ/AWQ/INT8/EXL2/GGUF) + KV cache + paged attention |
| 4.2.5 | Prompt engineering | isA_MCP + isA_Model | **Direct** | 38 prompt templates + prompt service + JSON mode + tool schemas |
| 4.3.1 | PMF market model | isA_Model | **Adapt** | Training pipeline ready; domain features/data new |
| 4.3.1.1 | Feature engineering | isA_Data + isA_Model | **Direct** | `FeatureEngineeringService` + Feast feature store |
| 4.3.1.2 | Model training | isA_Model | **Adapt** | Lightning pipeline + MLflow; XGBoost/LightGBM training code new |
| 4.3.2 | Pricing/forecast | isA_Model + isA_Trade | **Adapt** | Prediction patterns from isA_Trade; Prophet/DeepAR integration needed |
| 4.3.3 | Ad ROI model | isA_Model | **Adapt** | Training pipeline ready; ad-specific model architecture new |
| 4.3.4 | LLM content generation | isA_Creative + isA_Model | **Direct** | Creative content pipeline + multi-provider LLM serving |
| 4.3.4.1 | Listing generation | isA_Creative | **Adapt** | Content generation exists; SEO/platform-specific optimization new |
| 4.3.4.2 | Social/multi-language | isA_Creative + isA_Model | **Adapt** | Multi-modal generation; language-specific fine-tuning new |
| 4.3.4.3 | RAG knowledge base | isA_Data | **Direct** | 7 RAG patterns + vector service + evaluation |
| 4.4 | Sleep models (3) | isA_Model | **Adapt** | Training pipeline + serving infrastructure ready; domain models new |
| 4.5.1 | Model service gateway | isA_Model | **Direct** | Backend router (5 backends) + auto-selection + circuit breakers |
| 4.5.2 | Model monitoring/drift | isA_Model | **Direct** | Latency P50/95/99, quality scoring, TTFT/ITL/TPS, GPU NVML metrics |
| 4.5.3 | Auto-retrain pipeline | isA_Model | **Adapt** | Lightning pipeline + MLflow; trigger logic needs extension |
| 4.5.4 | Model security | isA_MCP + isA_Model | **Adapt** | Guardrails exist; domain-specific safety rules new |

### Module 5: Agent Platform (387 days → ~310 days saved)

| WBS | Task | Source | Level | Asset |
|-----|------|--------|-------|-------|
| 5.1.1 | SDK architecture | isA_Agent_SDK | **Direct** | Production architecture with 3,500+ tests |
| 5.1.2 | Python SDK | isA_Agent_SDK | **Direct** | Full SDK v0.2.0 (SmartAgentGraphBuilder, 9 nodes, resilience) |
| 5.1.3 | TypeScript SDK | isA_App_SDK | **Direct** | @isa/core, transport, hooks, ui-web |
| 5.1.4 | SDK tests & docs | isA_Agent_SDK | **Direct** | 349 test files, 68 doc files |
| 5.2.1-6 | Six characteristics | isA_Agent_SDK | **Direct** | All 6 modes: Persistence, Reactive, Proactive, Responsive, Autonomous, Interactive |
| 5.3.1 | MCP protocol core | isA_MCP | **Direct** | FastMCP + JSON-RPC + 3 transports (HTTP/stdio/SSE) |
| 5.3.2 | Enterprise MCP servers | isA_MCP | **Direct** | 4 templates: database, API gateway, filesystem, message queue |
| 5.3.3 | MCP tool integration | isA_MCP | **Direct** | Aggregator + marketplace + federation |
| 5.3.4 | MCP management | isA_MCP | **Adapt** | Admin routes + monitoring; management UI new |
| 5.4.1 | OS Agent | isA_OS | **Direct** | System tools, file ops, process mgmt, sandboxing |
| 5.4.2 | Browser Agent | isA_OS | **Direct** | Playwright: DOM + vision + hybrid routing |
| 5.4.3 | REPL Agent | isA_OS | **Direct** | Python/Node execution, sandboxing |
| 5.4.4 | Orchestration engine | isA_Agent_SDK | **Direct** | LangGraph SmartAgentGraphBuilder + SwarmOrchestrator |
| 5.4.5 | Agent monitoring | isA_Agent_SDK | **Direct** | OpenTelemetry + audit logging |
| 5.5.1 | VectorDB | isA_Cloud | **Direct** | AsyncQdrantClient (25 methods) + Qdrant deployment |
| 5.5.2 | GraphDB/KG | isA_Cloud | **Direct** | AsyncNeo4jClient (37 methods) + Neo4j deployment |

### Module 6: Agentic Apps (904 days → ~315 days saved)

Framework reuse from all platform layers. Each app follows: Agent SDK + MCP Tools + Domain Logic + UI.

| Category | Apps | Source | Level | Effort Saved |
|----------|------|--------|-------|-------------|
| 6 Marketing Agents | PMF, Listing, Pricer, Ads, Social, Promo | Agent_SDK + Mate + Creative + Marketing + Trade | **Adapt** | ~120 days |
| 5 Dashboards | Product 360, Market, Pricing, Ad ROI, Promo | Console + App_SDK + isA_Data products | **Adapt** | ~60 days |
| 4 Event Monitors | Sentiment, Competitor, Operations, Traffic | Agent_SDK reactive + NATS events | **Adapt** | ~40 days |
| 3 User Services | Sleep Advisor, DTC, Multi-lang CS | Mate (8 channels) + isA_Data RAG | **Adapt** | ~50 days |
| 5 Product APIs | Sleep quality/stage/risk/assessment/recommend | isA_Model gateway + serving | **Adapt** | ~30 days |
| Integration Testing | SIT/Performance/UAT | Agent_SDK test pyramid | **Partial** | ~15 days |

### Module 7: IAM & Security (97 days → ~82 days saved)

| WBS | Task | Source | Level | Asset |
|-----|------|--------|-------|-------|
| 7.1.1 | IAM architecture | IAM project | **Direct** | Complete multi-env K8s, 6 protocols, 30 tool modules |
| 7.1.2 | LDAP/AD integration | IAM project | **Direct** | LDAP outpost deployed, bind auth, user/group search |
| 7.1.3 | SSO (OIDC/SAML) | IAM project | **Direct** | Both protocols implemented with custom claims, federation |
| 7.1.4 | RBAC permissions | IAM project | **Direct** | Expression policies, 6 access groups, tested matrix |
| 7.1.5 | Multi-tenant | IAM project | **Direct** | Namespace isolation, resource quotas, brand management |
| 7.2.1 | Feilian gateway | IAM project | **Adapt** | RADIUS outpost (VPN/WiFi auth); Feilian-specific config new |
| 7.2.2 | Zero trust policies | IAM project | **Direct** | Device trust, conditional access, IP/header checks, continuous auth |
| 7.2.3 | Network security | IAM project + isA_Cloud | **Direct** | NetworkPolicies (deny-all + whitelist), External Secrets (Vault) |
| 7.3.1 | Security monitoring | IAM project | **Direct** | Audit logging + event search + Prometheus + Grafana |
| 7.3.2 | Data security/compliance | IAM project | **Direct** | SOC2/GDPR/ISO27001 mapping, PII handling, data retention |
| 7.3.3 | API security gateway | isA_Cloud | **Direct** | APISIX 3.8 + JWT auth + rate limiting + circuit breaker |

### Module 8: Project Management (103 days → 0 saved)

Process and people management — no software reuse.

---

## 4. Module-by-Module Deep Dive

### Module 1: Cloud Platform — 73 days, ~50% covered

**What isA_Cloud provides directly:**
- Complete K8s production manifests for 3 environments (local/staging/production)
- GPU Operator with driver management, DCGM metrics, node labeling
- Helm chart template for any microservice
- Full monitoring stack (Prometheus 13 ServiceMonitors + Grafana + Loki + Tempo)
- ArgoCD GitOps with app-of-apps, multi-env promotion, rollback
- APISIX API gateway with Consul-based service discovery and route sync
- 7 CI/CD workflows (test, security scan, manifest validation, promotion)
- Docker Compose for local development

**What remains:**
- Apsara-specific deployment (Alibaba Cloud proprietary tooling)
- Hardware vendor coordination (physical IDC work)
- Apsara control plane initialization
- ACK-specific configurations (vs generic K8s)

**Key files to fork:**
```
isA_Cloud/deployments/kubernetes/production/  → Full production K8s
isA_Cloud/deployments/charts/isa-service/     → Generic Helm chart
isA_Cloud/deployments/argocd/                 → GitOps configs
isA_Cloud/.github/workflows/                  → CI/CD pipelines
isA_Cloud/configs/                            → Monitoring configs
isA_Cloud/docker-compose.yml                  → Local dev stack
```

---

### Module 2: Big Data Platform — 100 days, ~40% covered

**What isA_Cloud + isA_Data provide:**
- Flink Operator Helm chart with RocksDB state backend + S3 checkpoints
- StarRocks Helm values (1 FE + 2 BE)
- MinIO distributed (4 nodes, S3-compatible, lifecycle management)
- Ray Data Cluster for distributed Polars/DuckDB processing
- DuckDB async client for embedded analytics
- CDC listener + streaming ingestion from isA_Data
- NATS JetStream for event streaming (maps to Kafka equivalent)
- ServiceMonitor CRDs for all components

**What remains:**
- Flink SQL Gateway platform
- StarRocks data model design (domain-specific)
- Iceberg-specific configurations (Delta Lake patterns adaptable)
- DolphinScheduler deployment
- Performance tuning (Flink state, StarRocks indexes)

**Key files to fork:**
```
isA_Cloud/deployments/kubernetes/production/values/flink-operator.yaml
isA_Cloud/deployments/kubernetes/production/values/starrocks.yaml
isA_Cloud/deployments/kubernetes/production/values/ray-data-cluster.yaml
isA_Cloud/isA_common/isa_common/async_duckdb_client.py
isA_Cloud/isA_common/isa_common/async_minio_client.py
isA_Cloud/isA_common/isa_common/async_nats_client.py
isA_Data/src/services/data_infra_service/ingestion/  → CDC + streaming
```

---

### Module 3: Data Middle Platform — 438 days, ~55% covered

**This is the biggest revision.** isA_Data IS a data middle platform with Dataphin integration.

**What isA_Data provides directly:**
- **Dataphin SDK integration** (official `alibabacloud_dataphin_public20230630.Client`)
- **5-backend federation** (warehouse, indicator, governance, MDM, BI)
- **Data lake zones** mapping to warehouse layers (raw=ODS, curated=DWD, gold=DWS/ADS)
- **ETL pipeline** (ingest → clean → validate → transform → aggregate → promote)
- **CDC** listener + streaming ingestion + change data processor
- **Data quality** (AI-powered profiler + anomaly detector + rules engine + quality scoring)
- **Data governance** (PII detection, GDPR compliance, lineage, contracts, SLA monitoring)
- **Active metadata** (real-time schema monitoring, change detection, drift alerts)
- **Master data management** (entity resolution, AI-powered matching)
- **Indicator/metric system** (metric resolver, semantic layer)
- **Feature Store** (feature engineering: encoding, scaling, temporal, interaction features)
- **Data service API** (50+ endpoints, unified data fabric)
- **Data catalog** (entity indexing, search, asset discovery)
- **NL→SQL** (AI-first intelligent query)
- **BI integration** (FineBI + Metabase adapters)

**What remains:**
- **Crawlers/RPA** (135 days in WBS) — isA_OS provides Playwright browser automation but platform-specific scraping rules, anti-detection strategies, and proxy IP pools are domain-specific. This is the biggest gap.
- **Domain data models** — actual table schemas for e-commerce (orders, products, ads, listings)
- **Platform API connectors** — Amazon Ads, Facebook Marketing, Google Ads specific integrations
- **Report templates** — domain-specific dashboard layouts

**Key files to fork:**
```
isA_Data/src/services/data_fabric_service/federation/dataphin/  → All 5 backends
isA_Data/src/services/data_infra_service/                       → Storage, ETL, quality
isA_Data/src/services/data_product_service/                     → Products + governance
isA_Data/src/services/digital_service/                          → RAG (7 patterns)
isA_Data/src/services/vector_service/                           → Vector DB backends
isA_Data/src/api/v1/                                            → 50+ API endpoints
```

---

### Module 4: Model Platform — 360 days, ~65% covered

**isA_Model + isA_Cloud together cover most of this module.**

**What's directly available:**
- Multi-provider LLM serving (9 providers, Qwen3.5 already supported)
- 4 inference engines (vLLM, SGLang, Triton, ONNX)
- Fine-tuning pipeline (5 algorithms: LoRA-SFT, GRPO, APO, Closed-Loop, ETO)
- Quantization (5 methods: GPTQ, AWQ, INT8, EXL2, GGUF)
- GPU management (VRAM allocation, NVML monitoring, Ray integration)
- MLflow (2-replica deployment + experiment tracking)
- JupyterHub (notebook environment)
- Ray clusters (CPU + GPU + Data, auto-scaling)
- Model registry (PostgreSQL-backed, full lifecycle)
- Model service gateway (5 backends, auto-selection, circuit breaker)
- A/B testing with quality-driven routing
- LLM caching (Redis, temperature-based TTL, 100x speedup)
- Embedding services (OpenAI, Ollama, Jina Reranker)
- Billing events (NATS, tenant usage ledger)
- Feature Store (Feast integration)
- Content generation (isA_Creative)
- 7 RAG patterns (isA_Data)

**What remains:**
- Domain-specific model training (PMF scoring, pricing elasticity, ad keyword prediction, sleep classification)
- Prophet/DeepAR time-series models
- Model security guardrails (domain-specific PII filters, hallucination detection for health)

**Key files to fork:**
```
isA_Model/isa_model/inference/          → Multi-provider AI factory
isA_Model/isa_model/serving/            → Gateway, routing, billing, caching, GPU
isA_Model/isa_model/training/           → Lightning pipeline, LoRA, GRPO
isA_Model/isa_model/model/              → Registry, quantization, loaders
isA_Model/isa_model/features/           → Feast feature store
isA_Cloud/deployments/kubernetes/production/values/mlflow.yaml
isA_Cloud/deployments/kubernetes/production/values/jupyterhub.yaml
isA_Cloud/deployments/kubernetes/production/values/ray-*.yaml
isA_Cloud/deployments/kubernetes/production/values/nvidia-gpu-operator.yaml
```

---

### Module 5: Agent Platform — 387 days, ~80% covered

Confirmed as the highest reuse module. Full details in v1 of this document.

---

### Module 6: Agentic Apps — 904 days, ~35% covered

Framework reuse from all platform layers. The domain business logic is the real work.

**isA_Mate as app template** provides:
- Multi-channel messaging (8 platforms)
- Multi-model routing
- Persistent conversation memory
- 190+ tools via MCP
- Docker deployment

---

### Module 7: IAM & Security — 97 days, ~85% covered

**The standalone IAM project covers almost everything in this module.**

Only real gaps:
- Feilian VPN gateway (ByteDance product — 10 days in WBS)
- Some network-specific zero trust tuning for SN's environment

**Key files to fork:**
```
~/Documents/Fun/Projects/IAM/helm/                    → Helm charts
~/Documents/Fun/Projects/IAM/infrastructure/          → K8s manifests, network policies
~/Documents/Fun/Projects/IAM/mcp-authentik/            → 129 MCP tools
~/Documents/Fun/Projects/IAM/blueprints/               → Auth flows, providers, policies
~/Documents/Fun/Projects/IAM/branding/                 → Custom CSS/logos (rebrand)
~/Documents/Fun/Projects/IAM/backup/                   → Backup infrastructure
~/Documents/Fun/Projects/IAM/docs/compliance/          → SOC2/GDPR/ISO27001 mapping
~/Documents/Fun/Projects/IAM/docs/operations/          → Runbooks
```

---

## 5. Gap Analysis — What's Truly Net-New

### Items with Zero Coverage

| WBS | Task | Person-Days | Why |
|-----|------|------------|-----|
| 1.1.1-3 | IDC hardware (rack, network, security) | 13 | Physical work |
| 1.2.1 | Apsara base deployment | 8 | Alibaba proprietary |
| 3.3.1.2 | Price monitoring crawlers (6+ platforms) | 12 | Domain scraping rules |
| 3.3.1.4 | BSR/market data scraping | 13 | Domain data model |
| 3.3.3 | Supply chain data (RPA) | 25 | ERP/WMS integration |
| 8.x | Project management | 103 | Process |
| | **Total truly net-new** | **~174** | |

### Items with Low Coverage (10-30%)

| WBS | Task | WBS Days | After Reuse | Gap |
|-----|------|---------|------------|-----|
| 3.3.1.1 | Crawler architecture (distributed) | 12 | ~8 | Scheduling, retry, IP pool management |
| 3.3.1.3 | Listing/review scraping | 13 | ~8 | Platform-specific selectors |
| 3.3.2 | Social media crawlers | 35 | ~25 | TikTok/Pinterest/FB/Instagram specifics |
| 3.3.4 | Ad/traffic API connectors | 25 | ~15 | Amazon/FB/Google Ads API specifics |
| 4.3.1.2 | PMF model training | 15 | ~10 | Domain model architecture |
| 4.3.2 | Pricing/forecast models | 35 | ~25 | Prophet/DeepAR, domain features |
| 4.3.3 | Ad ROI models | 30 | ~20 | Domain model architecture |
| 4.4 | Sleep models (3 models) | 70 | ~45 | Domain health ML |
| 6.1-6.6 | 23 Agentic Apps (domain logic) | 904 | ~589 | Business rules, domain workflows |

---

## 6. Revised Effort Savings

### By Module

| Module | WBS Days | After Reuse | Saved | % Saved | Key Source |
|--------|---------|------------|-------|---------|------------|
| 1. Cloud | 73 | **38** | 35 | 48% | isA_Cloud (K8s, monitoring, CI/CD, GPU) |
| 2. BigData | 100 | **60** | 40 | 40% | isA_Cloud (Flink, StarRocks, MinIO, Ray) |
| 3. Data | 438 | **198** | 240 | 55% | isA_Data (Dataphin federation, ETL, quality, governance) |
| 4. Model | 360 | **125** | 235 | 65% | isA_Model (serving, training, quantization, caching, GPU) |
| 5. Agent | 387 | **77** | 310 | 80% | isA_Agent_SDK + MCP + OS |
| 6. Apps | 904 | **589** | 315 | 35% | Framework reuse across all platforms |
| 7. IAM | 97 | **15** | 82 | 85% | IAM project (6 protocols, 129 tools, compliance) |
| 8. PM | 103 | **103** | 0 | 0% | Process, not software |
| **Subtotal** | **2,462** | **1,205** | **1,257** | **51%** | |
| Migration overhead | — | **+150** | -150 | — | Sanitization, rebranding, integration |
| **Net Total** | **2,462** | **1,355** | **1,107** | **45%** | |

### Financial Impact

| Metric | Original WBS | With Reuse | Savings |
|--------|-------------|-----------|---------|
| External person-days | 2,175 | ~1,100 | ~1,075 |
| External cost (blended ~2,765/day) | 601.5万 | ~304万 | **~297万** |
| Other costs (tools, travel, reserve) | 105.2万 | ~80万 | ~25万 |
| **Total external** | **706.7万** | **~384万** | **~323万 (46%)** |
| Timeline | 10 months | **6-7 months** | 3-4 months faster |
| Team size option | 48 people | **~30 people** | 18 fewer heads |

### Where Savings Concentrate (Revised Heatmap)

```
Module 1 (Cloud)      ██████████░░░░░░░░░░  48% reusable   ↑ was 20%
Module 2 (BigData)    ████████░░░░░░░░░░░░  40% reusable   ↑ was 15%
Module 3 (Data)       ███████████░░░░░░░░░  55% reusable   ↑ was 14%
Module 4 (Model)      █████████████░░░░░░░  65% reusable   ↑ was 33%
Module 5 (Agent)      ████████████████░░░░  80% reusable   ≈ was 77%
Module 6 (Apps)       ███████░░░░░░░░░░░░░  35% reusable   ↑ was 28%
Module 7 (IAM)        █████████████████░░░  85% reusable   ↑ was 52%
Module 8 (PM)         ░░░░░░░░░░░░░░░░░░░░   0% reusable   = was 0%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OVERALL               ██████████░░░░░░░░░░  51% effort saved (was 33%)
                                            45% net (after migration overhead)
```

---

## 7. White-Label Migration Strategy

### 7.1 Source Projects to Fork

**Priority 1 (Week 1 — foundations):**

| Source | Target | Why First |
|--------|--------|-----------|
| `isA_Cloud/isA_common/` | `packages/common/` | Foundation — all services depend on these 13 clients |
| `isA_Cloud/deployments/` | `infra/` | K8s, Helm, ArgoCD, Terraform, Docker |
| `isA_Cloud/.github/workflows/` | `.github/workflows/` | CI/CD pipelines |
| `IAM/` (entire project) | `services/iam/` | Standalone, minimal dependencies |

**Priority 2 (Week 2 — platform services):**

| Source | Target | Why |
|--------|--------|-----|
| `isA_Agent_SDK/` | `packages/agent-sdk/` | Core agent framework |
| `isA_MCP/` | `services/mcp-server/` | Tool server + enterprise templates |
| `isA_Model/` | `services/model-server/` | Model serving + training + GPU |
| `isA_OS/` | `services/os-server/` | Browser + system automation |

**Priority 3 (Week 3 — data & apps):**

| Source | Target | Why |
|--------|--------|-----|
| `isA_Data/` | `services/data-server/` | Data middle platform + Dataphin federation |
| `isA_App_SDK/` | `sdk-ts/` | TypeScript SDK packages |
| `isA_Mate/` | `agents/_template/` | Agent app template |
| `isA_Creative/` | `services/creative-server/` | Content generation |
| `isA_Console/` | `dashboards/_shared/` | Dashboard components |

### 7.2 Sanitization Scope

**isA projects — full sanitization required:**
- Replace `isa`, `isA`, `ISA` in all code, configs, comments, docs
- Replace `xenoISA`, `xenodennis` in all files
- New package namespace (e.g., `sn-*`, `@sn/*`)
- Fresh git history (`git init`)
- New CI/CD (no GitHub Actions referencing isA repos)
- New Docker registry references
- New Consul/APISIX service names

**IAM project — lighter sanitization:**
- This is Authentik-based (open source) — no isA branding to remove
- Remove personal identifiers only
- Rebrand UI (custom CSS/logos already supported via branding system)
- Update Helm chart names and namespace conventions

### 7.3 Automated Sanitization Script

```bash
# sanitize.sh — run against each forked project
#!/bin/bash
TARGET=$1
OLD_NS="isa"
NEW_NS="sn"  # or customer-chosen name

# Package names
find "$TARGET" -type f \( -name "*.py" -o -name "*.ts" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.md" -o -name "*.toml" \) \
  -exec sed -i '' \
    -e "s/isa_common/${NEW_NS}_common/g" \
    -e "s/isa_agent_sdk/${NEW_NS}_agent_sdk/g" \
    -e "s/isa_mcp/${NEW_NS}_mcp/g" \
    -e "s/isa_model/${NEW_NS}_model/g" \
    -e "s/isA_Cloud/${NEW_NS}_cloud/g" \
    -e "s/isA_Data/${NEW_NS}_data/g" \
    -e "s/isA_Model/${NEW_NS}_model/g" \
    -e "s/isA_MCP/${NEW_NS}_mcp/g" \
    -e "s/isA_Agent_SDK/${NEW_NS}_agent_sdk/g" \
    -e "s/isA_OS/${NEW_NS}_os/g" \
    -e "s/@isa\//@${NEW_NS}\//g" \
    -e "s/xenoISA/${NEW_NS}org/g" \
    -e "s/xenodennis//g" \
    -e "s/ISA_/${NEW_NS^^}_/g" \
    -e "s/isa-/${NEW_NS}-/g" \
    -e "s/isA/${NEW_NS^}/g" \
    {} \;

# Validate
echo "Remaining references:"
grep -r "isa\|isA\|ISA\|xeno" "$TARGET" --include="*.py" --include="*.ts" --include="*.json" --include="*.yaml" --include="*.md" | grep -v node_modules | grep -v __pycache__
```

---

## 8. Migration Execution Plan

### Phase 0: Setup (Week 1-2, before M1)

```
Week 1:
├── Choose project codename (sn-platform / nova / apex)
├── Create private monorepo
├── Write & test sanitization script
├── Fork isa-common → sn-common (13 async clients)
│   └── Run all integration tests (CDD logic contracts)
├── Fork isA_Cloud/deployments → sn infra configs
│   └── Rename all Helm charts, namespaces, service names
├── Fork IAM project → sn-iam
│   └── Rebrand UI (CSS, logos)
│   └── Update Helm chart names
└── Validate: zero isA/xeno references

Week 2:
├── Fork isA_Agent_SDK → sn-agent-sdk
│   └── Run 3,500+ tests with new package names
├── Fork isA_MCP → sn-mcp-server
├── Fork isA_Model → sn-model-server
├── Fork isA_Data → sn-data-server
│   └── Validate Dataphin federation still works
├── Fork isA_OS → sn-os-server
├── Fork isA_App_SDK → @sn/* packages
├── Set up private PyPI/npm registry
├── Set up CI pipelines (all tests must pass)
└── Final audit: zero isA references
```

### Phase 1: Infrastructure + IAM (M1-M3)

```
M1:
├── Deploy sn-iam on customer K8s (6 protocols ready)
│   ├── Configure LDAP/AD for enterprise directory
│   ├── Set up OIDC/SAML SSO for all apps
│   └── Configure RBAC for 15+ roles
├── Deploy sn-common as internal package
├── Begin Apsara/ACK deployment (Alibaba Cloud team)
├── Deploy monitoring stack (Prometheus/Grafana/Loki/Tempo)
├── Set up ArgoCD GitOps
└── Begin Flink/StarRocks deployment (from Helm values)

M2:
├── Deploy sn-model-server (add Qwen2.5 via vLLM)
│   ├── Configure Ray GPU cluster
│   ├── Deploy MLflow + JupyterHub
│   └── Enable LLM caching (Redis)
├── Deploy sn-mcp-server (180+ tools)
├── Deploy sn-os-server (browser + system agent)
├── Begin data platform work
│   ├── Deploy sn-data-server
│   ├── Configure Dataphin federation (5 backends)
│   └── Set up data lake zones
├── IAM: Enable zero trust policies, API security gateway
└── Begin crawler framework development (fork isA_OS browser)

M3:
├── Deploy sn-agent-sdk as internal package
├── Agent platform: verify all 6 characteristics
├── MCP: deploy enterprise servers (DB, API, FS, Queue)
├── Cloud platform delivered (K8s + monitoring + CI/CD)
├── Begin fine-tuning pipeline setup (LoRA-SFT)
└── Data: ETL pipelines operational, CDC running
```

### Phase 2: Data + Models (M3-M6)

```
M3-M4:
├── Data warehouse: ODS/DWD layers operational
├── Data quality: AI rules engine + profiler deployed
├── Data governance: PII detection + lineage + metadata
├── Crawlers: deploy for 2-3 priority platforms
├── Begin domain model training (PMF, pricing)
├── LLM content generation service (fork isA_Creative)
├── Feature Store operational
└── Indicator system deployed (MetricResolver)

M5-M6:
├── Data warehouse: DWS/ADS layers complete
├── Master data management operational
├── All crawlers deployed (6+ platforms)
├── Domain models trained + evaluated
├── Model service gateway operational
├── Model monitoring + A/B testing
├── BI platform deployed (FineBI/Metabase)
└── Data service API layer (50+ endpoints)
```

### Phase 3: Agentic Apps (M4-M9)

```
M4-M5:
├── Create agent app scaffold (from isA_Mate)
├── Build first 2 agents: PMF Analyzer + Listing Optimizer
├── Build first 2 dashboards: Product 360 + Market Opportunity
├── 5 Product Intelligence API services
└── Deploy business MCP servers (ERP, Ads, Social)

M5-M7:
├── Build remaining 4 marketing agents
├── Build remaining 3 dashboards
├── Build 4 event monitors
├── Sleep Advisor Agent + RAG knowledge base
└── DTC Recommendation Agent

M7-M9:
├── Multi-language Customer Service agent
├── Promotion Planner agent
├── Real-time Promo Dashboard
├── Cross-agent integration
└── Performance optimization
```

### Phase 4: Testing + Launch (M8-M10)

```
M8-M9:
├── SIT: 23 apps end-to-end
├── Performance: Black Friday scale load testing
├── Security: pen testing, compliance audit
├── UAT: business scenario validation
└── Bug fix iterations

M9-M10:
├── Canary rollout (10% → 50% → 100%)
├── Training & knowledge transfer
├── Documentation delivery
├── Final acceptance
└── Post-launch monitoring
```

---

## 9. Risk Analysis

### High Risk

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **isA reference leak** | Customer discovers origin | Automated CI scanning + pre-delivery audit |
| **Dataphin SDK compatibility** | isA_Data federation breaks in SN env | Test with customer's Dataphin instance early (M1) |
| **GPU cluster sizing** | Training/inference bottleneck | Use isA_Model's Ray auto-scaling; right-size based on workload |
| **isa-common dependency depth** | All 13 clients must work in new namespace | Fork + full integration test suite (CDD logic contracts exist) |

### Medium Risk

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Crawler anti-detection** | Blocked by platforms (Amazon, TikTok) | isA_OS browser automation provides base; invest in proxy IP pool |
| **Domain model accuracy** | PMF/pricing/sleep models need domain data | Start data collection M1; use isA_Model training pipeline |
| **IAM production gaps** | 4 RED items need 5-10 weeks | Address in M1-M2 as part of IAM deployment |
| **Alibaba Cloud integration** | Apsara/PAI/DataPhin API differences | Use MCP as integration boundary; isA_Data federation already handles Dataphin |

### Low Risk

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Test suite adaptation** | Tests need package name updates | Automated find-replace; budget 5-10 days |
| **TypeScript SDK sync** | Python + TS SDKs diverge | Contract tests between SDKs |
| **Team onboarding** | Delivery team unfamiliar with codebase | Internal architecture docs + training sessions |

---

## 10. Recommended Project Structure

```
sn-platform/
├── packages/
│   ├── common/                    ← isA_Cloud/isA_common (13 async clients)
│   ├── agent-sdk/                 ← isA_Agent_SDK
│   ├── model-client/              ← isA_Model client
│   └── mcp-client/                ← isA_MCP client
│
├── services/
│   ├── model-server/              ← isA_Model (serving + training + GPU)
│   ├── mcp-server/                ← isA_MCP (180+ tools + enterprise servers)
│   ├── data-server/               ← isA_Data (5 service domains + Dataphin)
│   ├── os-server/                 ← isA_OS (browser + system agent)
│   ├── creative-server/           ← isA_Creative
│   └── iam/                       ← IAM project (Authentik + 129 MCP tools)
│
├── mcp-servers/
│   ├── cloud-mcp/                 ← K8s resource management
│   ├── bigdata-mcp/               ← Flink/StarRocks operations
│   ├── database-mcp/              ← isA_MCP enterprise_servers/database_mcp
│   ├── api-gateway-mcp/           ← isA_MCP enterprise_servers/api_gateway_mcp
│   ├── erp-mcp/                   NEW: ERP/WMS integration
│   ├── ads-mcp/                   NEW: Ad platform APIs
│   └── social-mcp/                NEW: Social media APIs
│
├── agents/                        The 23 Agentic Apps
│   ├── _template/                 ← isA_Mate (cookiecutter)
│   ├── pmf-analyzer/
│   ├── listing-optimizer/
│   ├── dynamic-pricer/
│   ├── ads-optimizer/
│   ├── social-content-creator/
│   ├── promotion-planner/
│   ├── sleep-advisor/
│   ├── dtc-recommender/
│   ├── multilang-customer-service/
│   └── ...
│
├── dashboards/
│   ├── _shared/                   ← @sn/ui-web components
│   ├── product-360/
│   ├── market-opportunity/
│   ├── pricing-competitiveness/
│   ├── ad-roi/
│   └── promo-realtime/
│
├── monitors/
│   ├── sentiment-monitor/
│   ├── competitor-alert/
│   ├── operations-risk/
│   └── traffic-anomaly/
│
├── apis/
│   ├── sleep-quality/
│   ├── sleep-stage/
│   ├── health-risk/
│   ├── sleep-assessment/
│   └── personalized-recommendation/
│
├── models/                        ML Model Training
│   ├── pmf-scoring/
│   ├── price-elasticity/
│   ├── sales-forecast/
│   ├── ad-keyword/
│   ├── budget-allocation/
│   ├── sleep-quality/
│   ├── sleep-stage/
│   └── health-risk/
│
├── data/
│   ├── crawlers/                  ← isA_OS browser automation + domain rules
│   ├── etl/                       ← isA_Data ETL pipeline
│   └── feature-store/             ← isA_Data + isA_Model Feast
│
├── infra/
│   ├── k8s/                       ← isA_Cloud/deployments/kubernetes
│   ├── helm/                      ← isA_Cloud/deployments/charts
│   ├── argocd/                    ← isA_Cloud/deployments/argocd
│   ├── terraform/                 ← isA_Cloud/deployments/terraform
│   ├── monitoring/                ← Prometheus/Grafana/Loki/Tempo configs
│   ├── ci-cd/                     ← isA_Cloud/.github/workflows
│   └── docker/
│
├── sdk-ts/
│   ├── core/                      ← @isa/core
│   ├── transport/                 ← @isa/transport
│   ├── hooks/                     ← @isa/hooks
│   └── ui-web/                    ← @isa/ui-web
│
├── docs/                          All fresh, SN-branded
├── tools/
│   ├── sanitize.sh
│   ├── validate-clean.sh
│   └── scaffold-agent.py
│
└── pyproject.toml / pnpm-workspace.yaml
```

---

## 11. Next Steps

### Immediate (This Week)

1. **Choose project codename** — what replaces "isA" everywhere
2. **Write sanitization script** — automated find-replace + CI validation
3. **Start with isa-common** — fork 13 async clients, run CDD logic contracts
4. **Fork IAM project** — standalone, minimal dependencies, quick win

### Week 2-3

5. **Fork core platform** — Agent SDK, MCP, Model, Data, OS
6. **Run all test suites** — must pass with new namespace
7. **Test Dataphin federation** — ensure SDK wrapper works against target environment
8. **Create agent app template** — fork isA_Mate, strip to skeleton

### Ongoing

9. **Internal fork-point tracking** — map each file to source commit SHA (never share)
10. **Selective backporting** — cherry-pick improvements from isA (scrubbed)
11. **Internal training docs** — architecture explainers for delivery team

---

*End of Discovery Document v2*
