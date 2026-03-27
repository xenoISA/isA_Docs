# isA_Docs — Product Requirements Document

> **Product**: isA Developer Documentation Platform
> **Type**: Developer-facing documentation site (like docs.anthropic.com, platform.openai.com/docs)
> **Owner**: isA Platform Team
> **Repo**: `xenoISA/isA_Docs`
> **Created**: 2026-03-03
> **Last Updated**: 2026-03-03

---

## 1. Product Vision

isA_Docs is the **public developer portal** for the isA platform. It is not an internal project wiki — it is a product that developers use to evaluate, adopt, and build with isA services. Every page is a touchpoint that either builds or erodes developer trust.

**North Star**: A developer can go from "what is isA?" to a working agent in under 10 minutes using only the docs.

**Competitive set**: Anthropic Docs, OpenAI Platform Docs, Stripe Docs, Vercel Docs.

---

## 2. Target Users

| Persona | Goal | Key Pages |
|---------|------|-----------|
| **Evaluator** | Assess if isA fits their needs | Home, Architecture, FAQ, Playground |
| **Builder** | Build agents and integrations | Agent SDK, MCP, Model, Getting Started, Cookbook |
| **Operator** | Deploy and monitor in production | Cloud, OS, User Services, Deployment Guide |
| **Contributor** | Extend the platform | API Reference, CDD contracts, GitHub |

---

## 3. Platform Coverage

The docs must cover all isA projects. Status as of 2026-03-12:

| Project | Section | Status | Notes |
|---------|---------|--------|-------|
| isA_Agent_SDK | `/agent-sdk` (22 pages) | [Complete] | Comprehensive — 22 pages covering all features |
| isA_MCP | `/mcp` (15 pages) | [Complete] | Tools, security, multi-tenant, aggregator |
| isA_Model | `/model` (7 pages) | [Stale] | Missing: fine-tuning/LoRA, dataset API, checkpoint registry |
| isA_Cloud | `/cloud` (10 pages) | [Stale] | Missing: backup/restore, PDB, security scanning |
| isA_OS | `/os` (7 pages) | [Complete] | Pool Manager, Cloud OS, Desktop Agent, REPL |
| isA_Data | `/data` (5 pages) | [Complete] | RAG, data lake, fabric, file processing |
| isA_user | `/user` (13 pages) | [Stale] | Missing: Prometheus /metrics, graceful shutdown, circuit breakers |
| isA_Agent | `/agents` (4 pages) | [Complete] | Vibe, Creative, Default agents |
| isA_App_SDK | `/app-sdk` (1 page) | [Complete] | 6-package monorepo overview |
| isA_Frame | `/frame` (1 page) | [Complete] | EmoFrame smart photo system |
| isA_Console | `/console` (1 page) | [Complete] | Next.js dashboard |
| isA_Trade | `/trade` (1 page) | [Stale] | Missing: approval gates, Prometheus alerts, load testing |
| isA_Chain | `/chain` (1 page) | [Complete] | Blockchain core |
| isA_Vibe | via `/agents/vibe` | [Complete] | AI-SDLC orchestration |
| isA_Mate | `/mate` (1 page) | [Complete] | Added in epic #17 |
| isA_Orch | `/orch` (1 page) | [Complete] | Added in epic #17 |
| isA_Creative | — | [Not Started] | 36 commits, 0 docs — DAM, brand compliance, visual designer |
| isA_Marketing | — | [Not Started] | 32 commits, 0 docs — content, SEO, campaigns |

### Cross-Cutting Pages

| Page | Status | Notes |
|------|--------|-------|
| Home (`/`) | [Complete] | Platform overview with quick start |
| Getting Started | [Complete] | Installation, first agent, choose-your-path |
| Architecture | [Complete] | Full platform diagram and component details |
| Changelog | [Complete] | All releases through v0.6.0 |
| FAQ | [Complete] | 8 sections, some "coming soon" items |
| Playground | [Complete] | 4 demo playgrounds (simulated) |
| Cookbook (6 recipes) | [Complete] | Chatbot, RAG, code assistant, data, multi-agent, streaming |
| Quickstarts (5 guides) | [Complete] | Customer support, doc Q&A, Slack, Discord, API backend |

---

## 4. Completed Work

### Phase 1: Docs Catch-Up (Epic #3 — Closed 2026-03-03)

All issues resolved:

| Issue | Title | Status |
|-------|-------|--------|
| #4 | Bug: Incorrect GitHub org URL across docs | [Complete] |
| #5 | Bug: Stale MCP tool count and microservice count | [Complete] |
| #6 | Bug: 6 broken internal links to missing pages | [Complete] |
| #7 | Bug: FAQ references wrong MCP port | [Complete] |
| #8 | Update Agent SDK API examples to current surface | [Complete] |
| #9 | Update changelog with all releases since Jan 2025 | [Complete] |
| #10 | Document shipped features (voice, A2A, proxy, observability) | [Complete] |
| #11 | Add docs for App SDK, Console, Trade, Chain, Frame | [Complete] |
| #2 | SDK Migration: Adopt isA_App_SDK primitives | [Complete] |

---

## 5. Current Phase: Developer-Grade DX Overhaul

### 5.1 Problem Statement

A product audit (2026-03-03) against the implementation revealed 13 gaps across accuracy, completeness, and interactive components. The docs read like maintained project notes rather than a developer product. Key trust-breakers:

- **Contradictory numbers**: MCP tool count says "89+" in 10 places but "190+" in the Agent SDK tools page
- **Wrong model names**: 3 pages reference `gpt-5-nano` while 40+ pages use `gpt-4.1-nano`
- **Mocked components**: StatusBadge always returns "operational"; FeedbackWidget logs to console
- **Missing projects**: isA_Mate and isA_Orch have zero documentation
- **Unresolved placeholders**: 5+ "Coming Soon" sections across the site

### 5.2 Requirements

#### 5.2.1 Content Accuracy (P1)

**Requirement**: Every number, model name, and API example in the docs must be correct and consistent across all pages.

**Acceptance Criteria**:
- [ ] Single authoritative MCP tool count used everywhere (verify against `isA_MCP` source)
- [ ] Single authoritative default model name used everywhere (verify against `isA_Model` source)
- [ ] Tool names follow a documented capitalization convention (snake_case for MCP tools, PascalCase only for Claude Code tool references)
- [ ] Zero conflicting numbers or names across all 95 MDX files

**Stories**:
- Fix MCP tool count to single authoritative number across all pages (P1)
- Fix model name inconsistency — standardize gpt-5-nano vs gpt-4.1-nano (P1)
- Standardize tool name capitalization convention (P2)

#### 5.2.2 Platform Coverage (P2)

**Requirement**: Every isA project listed in the platform directory must have at minimum an index page with overview, architecture diagram, quick start, and tech stack.

**Acceptance Criteria**:
- [ ] `content/mate/index.mdx` exists with overview, architecture, getting-started
- [ ] `content/orch/index.mdx` exists with overview, architecture, getting-started
- [ ] Home page and architecture page reference all 16 projects

**Stories**:
- Add isA_Mate project documentation (P2)
- Add isA_Orch project documentation (P2)

#### 5.2.3 Interactive Components (P2)

**Requirement**: Every interactive component on the site must be functional — no mocked behaviors in production.

**Acceptance Criteria**:
- [ ] StatusBadge either fetches real status or displays static badge without fake fetch
- [ ] FeedbackWidget submits to an endpoint or is removed from rendered pages
- [ ] Search API has rate limiting (30 req/min/IP), configurable embedding model, 10s timeout
- [ ] Search API embedding model is env-configurable (not hardcoded `text-embedding-3-small`)

**Stories**:
- Fix StatusBadge — remove mock, use real status or static display (P2)
- Harden search API — rate limiting, timeouts, configurable model (P2)
- Wire FeedbackWidget to backend or remove from pages (P3)

#### 5.2.4 Placeholder Resolution (P2)

**Requirement**: No "Coming Soon" text without a linked tracking issue or concrete timeline.

**Acceptance Criteria**:
- [ ] `content/platform/index.mdx` "Coming Soon" section either documented or linked to issue
- [ ] `content/agents/creative.mdx` "Coming Soon" section resolved
- [ ] `content/agent-sdk/desktop-execution.mdx` cloud_pool reference resolved
- [ ] `content/faq.mdx` pricing and compliance "coming soon" items resolved
- [ ] `content/os/python-repl.mdx` architecture diagram `(TODO)` replaced

**Stories**:
- Resolve all "Coming Soon" placeholders across docs (P2)
- Fix Python REPL TODO in architecture diagram (P3)

### 5.3 Out of Scope (This Phase)

These are valuable but deferred to a future phase:

| Feature | Rationale |
|---------|-----------|
| Multi-language SDK parity (Python + JS + cURL on every page) | High effort, requires coordinating with SDK teams |
| Live API playground with real backend calls | Requires auth infrastructure for anonymous users |
| Automated docs generation from source code | Separate tooling initiative |
| Status page with historical uptime | Needs dedicated monitoring infrastructure |
| i18n / localization | Not needed at current scale |
| AI-powered search answers (RAG over docs) | Current vector search is functional; full RAG is a future enhancement |
| Developer onboarding analytics / funnel tracking | Needs analytics infrastructure first |

---

## 6. Phase 3: Production Readiness (Epic #31)

### 6.0 Problem Statement

A production readiness investigation (2026-03-05) found that the docs site builds cleanly (118 static pages) but has **no deployment path, no CI, no tests, and several API/component issues** that would prevent a reliable production deployment. The site works locally but is not production-grade.

### 6.1 Deployment & CI (P0-P1)

**Requirement**: The site must have a defined, repeatable deployment path and automated quality gates.

**Acceptance Criteria**:
- [ ] Dockerfile or Vercel config exists and produces a working deployment
- [ ] GitHub Actions CI runs build + lint on every PR
- [ ] ESLint and Prettier are configured with standard Next.js rules

**Stories**:
- Add deployment configuration — Dockerfile + container/Vercel config (P0, infra)
- Add GitHub Actions CI pipeline — build + lint on PR (P1, infra)
- Add ESLint + Prettier configuration (P1, infra)

### 6.2 API Hardening (P0-P1)

**Requirement**: Server-side API routes must be durable, observable, and resilient in production environments.

**Acceptance Criteria**:
- [ ] Feedback storage uses a durable backend (not local filesystem)
- [ ] Rate limiter works across instances and survives restarts (Redis or external)
- [ ] Search API has health checks; UI degrades gracefully when search is unavailable
- [ ] Search input is debounced (300ms minimum)

**Stories**:
- Replace feedback JSONL file storage with durable backend (P0, api/data)
- Replace in-memory rate limiter with Redis or external solution (P0, api/infra)
- Add search health check and graceful UI degradation (P1, api/ui)
- Add debounce to AI search input — 300ms (P1, ui)

### 6.3 Code Quality & DX (P1-P2)

**Requirement**: The codebase must have type safety, test coverage, error resilience, and SEO basics for a public-facing site.

**Acceptance Criteria**:
- [ ] TypeScript strict mode enabled with zero type errors
- [ ] Test suite exists covering API routes and key utilities
- [ ] React error boundaries wrap all interactive components
- [ ] No `console.error` in production code
- [ ] sitemap.xml and robots.txt are generated at build time
- [ ] Custom 404 page exists
- [ ] ApiPlayground proxies requests server-side (no client-side API keys)

**Stories**:
- Enable TypeScript strict mode and fix type errors (P1, core)
- Add basic test suite — unit + API route tests (P1, core)
- Add React error boundaries around interactive components (P2, ui)
- Replace console.error with structured logger or remove (P2, core)
- Add sitemap.xml and robots.txt generation (P2, docs/infra)
- Add custom 404 page (P2, ui)
- Add server-side proxy for ApiPlayground requests (P2, api)

### 6.4 Out of Scope (This Phase)

| Feature | Rationale |
|---------|-----------|
| Full monitoring/alerting | Requires dedicated observability infrastructure |
| CDN configuration | Depends on hosting decision |
| Production secrets management | Handled by isA_Cloud |
| Lighthouse performance audit | Separate optimization pass |
| Load testing | Premature before deployment target is defined |

---

## 7. Phase 4: Content Sync — Q1 2026 Platform Status

### 7.0 Problem Statement

A discovery audit (2026-03-12) compared documentation against actual project activity over the last 3 months (Dec 2025 – Mar 2026). Across the platform, **1,000+ commits landed** but documentation lagged behind. Two active projects (Creative: 36 commits, Marketing: 32 commits) have **zero documentation**. Several core projects shipped major features (Model fine-tuning, MCP health persistence, Trade approval gates) that are completely undocumented. The changelog's "Unreleased" section is missing work from 13+ projects.

### 7.1 Batch 1: Critical Gaps (P0-P1)

**Requirement**: Every active isA project must have at minimum a documentation page. Safety-critical features must be documented. The changelog must reflect shipped work.

**Acceptance Criteria**:
- [ ] `content/creative/index.mdx` exists with overview, architecture, features, getting-started
- [ ] `content/marketing/index.mdx` exists with overview, architecture, features, getting-started
- [ ] Trade docs cover live trading approval gates, Risk Agent veto, circuit breakers
- [ ] Changelog "Unreleased" section includes work from all 13+ active projects
- [ ] Architecture diagram includes Creative, Marketing, and Orch
- [ ] Platform index lists Creative and Marketing under Products

**Stories**:
- Add isA_Creative project documentation (P0, docs)
- Add isA_Marketing project documentation (P0, docs)
- Document Trade live trading approval gates and risk management (P0, docs)
- Update changelog with all unreleased cross-project work (P0, docs)
- Update architecture diagram for Creative, Marketing, Orch (P1, docs)
- Update platform index to list Creative and Marketing (P1, docs)

### 7.2 Batch 2: Feature Documentation (P1)

**Requirement**: Major shipped features across core projects must have documentation matching their implementation.

**Acceptance Criteria**:
- [ ] Model docs cover fine-tuning pipeline (LoRA SFT, dataset upload, checkpoint registry, Ollama deploy)
- [ ] MCP reliability docs cover health failure persistence and connection event tracking
- [ ] Agent SDK docs cover OAuth transport and macOS Keychain credential management
- [ ] Trade docs cover Prometheus alerting rules and Locust load testing

**Stories**:
- Document Model fine-tuning pipeline — LoRA SFT, datasets, checkpoints, Ollama deploy (P1, docs)
- Document MCP health failure persistence and connection event tracking (P1, docs)
- Document Agent SDK OAuth transport and Keychain integration (P1, docs)
- Document Trade Prometheus alerts and load testing baseline (P1, docs)

### 7.3 Batch 3: Polish (P2)

**Requirement**: Secondary documentation gaps across supporting projects should be addressed.

**Acceptance Criteria**:
- [ ] Model latency-aware routing includes percentile tracking and tuning guide
- [ ] Agent SDK A2A guide includes heartbeat streaming details
- [ ] Orch docs cover code index, cross-project search, impact analysis
- [ ] Cloud ops docs cover backup/restore, PDB templates, security scanning
- [ ] User Services ops docs cover Prometheus /metrics, graceful shutdown, circuit breakers

**Stories**:
- Enhance Model latency-aware routing documentation (P2, docs)
- Document Agent SDK heartbeat streaming in A2A guide (P2, docs)
- Update Orch docs with code index and cross-project search (P2, docs)
- Update Cloud operations docs with backup/restore and security scanning (P2, docs)
- Update User Services operations docs with Prometheus metrics and circuit breakers (P2, docs)

### 7.4 Out of Scope (This Phase)

| Feature | Rationale |
|---------|-----------|
| Full CDD contracts for Creative/Marketing | These are initial project pages, not full doc suites |
| Comprehensive Trade operations manual | Separate future phase — start with safety-critical docs |
| Automated changelog generation from commits | Separate tooling initiative |

---

## 8. Phase 5: v0.7 Content Sync — March 2026

### 8.0 Problem Statement

A discovery audit (2026-03-27) found that ~100 PRs merged across 10 repos in the last 30 days introduced six major undocumented epics. The changelog stops at v0.6 and no docs exist for the billing stack, the long-running agent hardening suite, the OAuth 2.0 authorization code flow, or the isA_Orch CLI.

### 8.1 Sprint 1: OAuth 2.0 & Auth Scope Migration (P0)

**Requirement**: Document the new OAuth 2.0 Authorization Code + PKCE flow and scope migration from `a2a.*` to `mcp:*`.

**Acceptance Criteria**:
- [ ] `content/user/oauth-pkce.mdx` — full PKCE flow with request/response examples
- [ ] `content/user/scope-migration.mdx` — `a2a.*` → `mcp:*` mapping table + migration steps
- [ ] `content/user/authentication.mdx` — updated with PKCE link + breaking-change callout
- [ ] `content/mcp/security.mdx` — OAuth resource server (RFC 8707) section added
- [ ] `content/console/index.mdx` — OAuth consent UI documented

**Stories**:
- Document OAuth 2.0 Authorization Code + PKCE flow (P0, api/sdk)
- Write scope migration guide: a2a.* → mcp:* (P0, api/docs)
- Update MCP security docs with RFC 8707 resource server (P1, docs)
- Document OAuth consent UI in Console (P2, ui/docs)

### 8.2 Sprint 2: Changelog Update (P0)

**Requirement**: Update changelog with all v0.7 release entries across all active repos.

**Acceptance Criteria**:
- [ ] v0.7.0 release entry covers all 6 epics: Agent SDK hardening, Billing, OAuth, MCP scalability, Orch, Vibe multi-turn
- [ ] Individual feature callouts for: BudgetGuard, SessionWatchdog, tiered memory, idempotency tokens, CommandGuard, connection pooling, scope migration, isa-orch CLI, Milvus backend, GraphRAG/RRF, AI copilot, deployment automation

**Stories**:
- Add v0.7 changelog entries covering all active epics (P0, docs)

### 8.3 Sprint 3: Long-Running Agent Hardening (P0–P2)

**Requirement**: Document the full agent hardening suite shipped in Epic #510.

**Acceptance Criteria**:
- [ ] `content/agent-sdk/memory.mdx` — tiered memory (working/episodic/semantic) with promotion diagram
- [ ] `content/agent-sdk/budget-guard.mdx` — BudgetGuard config table (pause/warn/stop thresholds, max_credits/max_tokens)
- [ ] `content/agent-sdk/session-watchdog.mdx` — SessionWatchdog + NATS liveness protocol, client polling example
- [ ] `content/agent-sdk/checkpointing.mdx` — checkpoint compaction, GC, warm restart, tagged snapshots
- [ ] `content/agent-sdk/tools.mdx` — idempotency tokens section
- [ ] `content/agent-sdk/command-guard.mdx` — CommandGuard pattern list, bypass policy

**Stories**:
- Document tiered memory hierarchy in agent-sdk/memory.mdx (P0, sdk/docs)
- Add BudgetGuard page to agent-sdk/ (P0, sdk/docs)
- Add SessionWatchdog page to agent-sdk/ (P1, sdk/docs)
- Update checkpointing page with compaction, GC, warm restart (P1, sdk/docs)
- Document idempotency tokens in tools page (P1, sdk/docs)
- Add CommandGuard page to agent-sdk/ (P2, sdk/docs)

### 8.4 Sprint 4: isA_Orch Platform Code Index (P0–P2)

**Requirement**: Expand the single-stub Orch page to full documentation for the platform CLI.

**Acceptance Criteria**:
- [ ] `content/orch/index.mdx` — expanded with architecture, indexing pipeline, language support
- [ ] `content/orch/cli.mdx` — full `isa-orch` CLI reference (index, search, impact, stats, projects, project-context, test-scaffold)
- [ ] `content/orch/semantic-search.mdx` — semantic search guide, sentence-transformers backend, `--semantic` flag
- [ ] `content/orch/test-scaffold.mdx` — test directory scaffolding guide

**Stories**:
- Expand orch/index.mdx with full architecture and getting-started (P0, docs)
- Write isa-orch CLI reference page (P0, docs)
- Write semantic search guide (P1, docs)
- Write test scaffold guide (P1, docs)

### 8.5 Sprint 5: Platform Billing & Metering (P0–P2)

**Requirement**: Document the entirely new billing infrastructure shipped in Epic #495.

**Acceptance Criteria**:
- [ ] `content/model/billing.mdx` — billing overview: meters, Redis reservation, credit alerts, NATS billing events
- [ ] `content/model/metering.mdx` — `/api/v1/usage` endpoint, MeterType enum, cost attribution
- [ ] `content/model/rbac.mdx` — per-resource RBAC, 11 resource types, `resource:action` model
- [ ] `content/model/audit-logging.mdx` — immutable audit log via NATS JetStream, admin query endpoint
- [ ] `content/model/api-reference.mdx` — billing/usage/RBAC endpoints added

**Stories**:
- Write billing overview page for model/ (P0, api/docs)
- Write metering and usage API reference (P1, api/docs)
- Write RBAC permission policies page (P1, api/docs)
- Write audit logging page (P2, api/docs)

### 8.6 Sprint 6: Data, Agent, Console & MCP Scalability (P1–P2)

**Requirement**: Document individual feature gaps across four repos.

**Acceptance Criteria**:
- [ ] `content/data/rag-patterns.mdx` — Milvus backend, Hybrid GraphRAG/RRF added
- [ ] `content/data/ai-copilot.mdx` — AI data dev copilot, `/api/v1/data/copilot` endpoint
- [ ] `content/agents/index.mdx` — template management API, config versioning, audit trail
- [ ] `content/agents/deployment.mdx` — canary/blue-green/rollback deployment automation
- [ ] `content/mcp/configuration.mdx` — connection pooling (LRU, 30-connection cap), server priority tiers

**Stories**:
- Update rag-patterns.mdx with Milvus and GraphRAG/RRF (P1, docs)
- Write AI data copilot page (P1, api/docs)
- Update agents/index.mdx with template management and config versioning (P1, docs)
- Write agents/deployment.mdx for canary/blue-green automation (P1, docs)
- Update mcp/configuration.mdx with connection pooling (P1, docs)

### 8.7 Out of Scope (This Phase)

| Feature | Rationale |
|---------|-----------|
| isA_Vibe multi-turn dispatch docs | Vibe is internal tooling; user-facing docs not required yet |
| isA_OS Argo Rollouts deep-dive | Covered by cloud/deployment.mdx at the ops level |
| isA_Console Grafana dashboard embed | Console page is a stub — full console docs are a separate initiative |

---

## 9. Future Phases (Backlog)

### Phase 5: Developer Experience Polish

- Expected output shown alongside every code example
- Framework/package-manager variant selectors on install commands (pip/uv/poetry)
- "Related pages" recommendations at page bottom
- Page-level "Edit on GitHub" links
- Versioned docs (pin docs to SDK version)

### Phase 6: Interactive & Trust

- Live API playground with sandboxed backend
- Per-service status dashboard with uptime history
- AI-powered search with RAG (answer questions, not just find pages)
- Developer feedback pipeline (submit → triage → fix → notify)
- Community contributions workflow

### Phase 7: Scale

- Multi-language docs (JS/TS SDK parity)
- Auto-generated API reference from OpenAPI/protobuf specs
- Onboarding funnel analytics (where do developers drop off?)
- Localization for top-traffic regions

---

## 8. Technical Architecture

### Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.x |
| Docs Engine | Nextra | 4.6.x |
| Styling | Tailwind CSS | 4.x |
| Search Backend | Qdrant | — |
| Embeddings | isA_Model service | — |
| Hosting | TBD | — |
| Language | TypeScript / React 19 | — |

### Key Files

| Path | Purpose |
|------|---------|
| `content/**/*.mdx` | All documentation content (125 files) |
| `app/layout.tsx` | Root layout with Nextra theme, nav, footer |
| `app/page.tsx` | Marketing home page |
| `app/content/[[...mdxPath]]/page.tsx` | Dynamic MDX content router |
| `app/api/search/route.ts` | AI search API endpoint |
| `components/` | 7 custom components (AISearch, ApiPlayground, etc.) |
| `lib/surfaces.ts` | Centralized env-driven URL config |
| `.env.example` | Environment variable template |

### Content Structure

```
content/
  index.mdx              # Home
  getting-started.mdx     # Onboarding
  architecture.mdx        # Platform overview
  changelog.mdx           # Release history
  faq.mdx                 # FAQ
  playground.mdx          # Interactive demos
  agent-sdk/              # 22 pages
  mcp/                    # 15 pages
  model/                  # 7 pages
  cloud/                  # 10 pages
  os/                     # 7 pages
  data/                   # 5 pages
  user/                   # 13 pages
  agents/                 # 4 pages
  app-sdk/                # 1 page
  frame/                  # 1 page
  console/                # 1 page
  trade/                  # 1 page
  chain/                  # 1 page
  platform/               # 1 page
  cookbook/                # 7 pages
  quickstarts/            # 6 pages
```

---

## 9. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Content accuracy | 0 contradictions across all pages | Automated grep audits |
| Platform coverage | 18/18 projects documented | Content directory check |
| Placeholder count | 0 unlinked "Coming Soon" items | Grep audit |
| Search reliability | < 2s p95 response time | API monitoring |
| Component functionality | 0 mocked behaviors in production | Code review |

---

## 10. Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-03-03 | isA Team | Initial PRD created from product audit findings |
| 2026-03-05 | isA Team | Added Phase 3: Production Readiness (14 stories, 3 themes) |
| 2026-03-12 | isA Team | Added Phase 4: Content Sync (15 stories, 3 batches); fixed stale coverage table; added Creative + Marketing projects |
| 2026-03-27 | isA Team | Added Phase 5: v0.7 Content Sync (29 stories, 6 sprints); discovery covered ~100 merged PRs across 10 repos |
