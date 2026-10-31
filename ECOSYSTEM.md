# 🌐 AI Skills, MCPs, Plugins & Rules Master Ecosystem

> **The definitive catalog of all 47 modular skills, 9 Model Context Protocol (MCP) integrations, 6 autonomous plugins, and 7 core governance rules across the ecosystem.**

> [!IMPORTANT]
> **🌍 Global Installation:** All 47 skills, 6 plugins, and governance rules in this ecosystem are installed **globally** upon running `install-skills.ps1 store` (or `install-skills.bat`). Every workspace and coding agent on your computer immediately shares them without needing per-project duplication!
> 
> 📖 **Setup & Authentication Manual:** See [`PLUGINS_AND_MCP_README.md`](PLUGINS_AND_MCP_README.md) for plugin details, MCP setups, CLI login commands (`21st login`), and the **Master API Key Requirements Matrix**.

---

## 📑 Table of Contents

1. [All 47 Modular Skills](#-1-all-47-modular-skills)
   - [Backend, APIs & Reliability](#1-backend-apis--reliability)
   - [Frontend, UI/UX & Interactive Design](#2-frontend-uiux--interactive-design)
   - [Get Shit Done (GSD) Autonomous Suite](#3-get-shit-done-gsd-suite)
   - [Ponytail Anti-Bloat & Simplicity Suite](#4-ponytail-anti-bloat-suite)
   - [Build Loops, Story Execution & Multi-Agent Squads](#5-build-loops--multi-agent-squads)
   - [Testing, Code Review & Security Hardening](#6-testing-code-review--security)
   - [Product Strategy, SEO & Research](#7-product-strategy-seo--meta-skills)
2. [All Model Context Protocol (MCP) Integrations](#-2-all-model-context-protocol-mcp-integrations)
3. [All 6 Autonomous Plugins](#-3-all-6-autonomous-plugins)
4. [All Master Rule Systems](#-4-all-master-rule-systems)

---

## 🧩 1. All 47 Modular Skills

Every skill adheres to the Agent Skills standard with its own dedicated `SKILL.md` instruction specification, runtime scripts, and progressive disclosure boundaries.

### 1. Backend, APIs & Reliability

#### 1. `building-backend`

- **Directory:** `.agent/skills/building-backend/`
- **How It Works:** Guides architecture and code generation for production REST, GraphQL, and gRPC backends. Enforces connection pooling, database migrations (Prisma, Alembic, Drizzle), Redis caching strategies, idempotency keys, and async background workers (Celery, BullMQ).
- **When to Use:** Whenever designing database schemas, writing server endpoints, configuring message queues, or optimizing server latency.

#### 2. `integrating-sentry`

- **Directory:** `.agent/skills/integrating-sentry/`
- **How It Works:** Configures enterprise-grade Sentry error tracking and distributed tracing across Python (`sentry-sdk`), Next.js (`@sentry/nextjs`), and Node.js (`@sentry/node`). Enforces safe DSN loading via environment variables and explicit `capture_exception` in critical handlers.
- **When to Use:** Whenever scaffolding new projects, building API routes, adding worker error boundaries, or instrumenting APM performance.

#### 3. `managing-firebase`

- **Directory:** `.agent/skills/managing-firebase/`
- **How It Works:** Manages Firebase projects, Firestore database schemas, Firebase Authentication, Cloud Storage, and serverless Cloud Functions using the `firebase-mcp-server` integration.
- **When to Use:** When configuring serverless mobile/web backends, setting up Firestore security rules, or deploying Cloud Functions.

#### 4. `error-handling-patterns`

- **Directory:** `.agent/skills/error-handling-patterns/`
- **How It Works:** Implements resilient error handling patterns: Result types (`Result<T, E>`), domain exception hierarchies, circuit breakers, exponential backoff with jitter, structured contextual logging, and fail-safe defaults.
- **When to Use:** When writing reliable API boundaries, handling external third-party network failures, or refactoring unhandled exceptions.

---

### 2. Frontend, UI/UX & Interactive Design

#### 5. `archify`

- **Directory:** `.agent/skills/archify/`
- **How It Works:** Compiles typed JSON intermediate representations (IR) into self-contained, interactive single-file HTML diagrams. Features multi-viewport headless Chrome audits, dark/light themes, animated path tracing, and visual delta diffs (`archify compare`).
- **Supported Types:** `architecture`, `sequence`, `workflow`, `erd`, `lifecycle`, `dataflow`, `tree`, `class`, `timeline`, `waterfall`, `explainer`.
- **When to Use:** When explaining complex system topologies, mapping database schemas, visualizing API latency, or generating shareable one-page explainers.

#### 6. `designing-with-stitch`

- **Directory:** `.agent/skills/designing-with-stitch/`
- **How It Works:** Interacts with Google Stitch MCP (`StitchMCP`) to turn natural language requirements into complete responsive web pages, screen mockups, and cohesive design systems based on senior UX psychology laws.
- **When to Use:** When generating website designs, prototyping screen layouts, or building design system tokens.

#### 7. `ui-ux-pro-max`

- **Directory:** `.agent/skills/ui-ux-pro-max/`
- **How It Works:** Senior UI/UX design intelligence applying fundamental psychological laws (Fitts, Hick, Miller, Jakob), 8pt spatial rhythm, accessible WCAG contrast tokens, storytelling layouts (Hero → Problem → Solution → Social Proof → CTA), and micro-interactions.
- **When to Use:** When styling interfaces, designing forms, creating landing pages, or improving app usability and delight.

#### 8. `brand-identity`

- **Directory:** `.agent/skills/brand-identity/`
- **How It Works:** Serves as the single source of truth for visual brand guidelines, design tokens, typography scales, semantic color palettes, and voice/tone copy standards.
- **When to Use:** When generating user-facing assets, applying consistent company styles, or creating cohesive UI component libraries.

#### 9. `using-remotion`

- **Directory:** `.agent/skills/using-remotion/`
- **How It Works:** Generates programmatic, data-driven videos and motion graphics in React using Remotion. Uses code-driven timelines, compositions, transitions, and audio sync.
- **When to Use:** When programmatically producing video demos, social video clips, or animated product walkthroughs from code.

---

### 3. Get Shit Done (GSD) Suite (14 Sub-Skills)

The GSD methodology enforces spec-driven development, planning locks, context hygiene, and empirical verification.

#### 10. `gsd`

- **Directory:** `.agent/skills/gsd/`
- **How It Works:** The master methodology orchestrator. Enforces the rule: _Never write code without finalized specs and plans_. Coordinates phase-based wave execution and atomic state preservation.

#### 11. `gsd-planner`

- **Directory:** `.agent/skills/gsd-planner/`
- **How It Works:** Decomposes complex feature roadmaps into atomic phase plans (`PLAN.md`), dividing tasks into dependency-ordered execution waves.

#### 12. `gsd-plan-checker`

- **Directory:** `.agent/skills/gsd-plan-checker/`
- **How It Works:** Validates generated phase plans before execution begins. Checks for missing dependencies, overly broad task scopes, and missing verification criteria.

#### 13. `gsd-executor`

- **Directory:** `.agent/skills/gsd-executor/`
- **How It Works:** Executes tasks wave-by-wave with atomic commits after each task, logging execution summaries and managing deviations.

#### 14. `gsd-verifier`

- **Directory:** `.agent/skills/gsd-verifier/`
- **How It Works:** Validates implemented features against specification requirements using empirical evidence (command exit codes, test assertions, browser snapshots).

#### 15. `gsd-debugger`

- **Directory:** `.agent/skills/gsd-debugger/`
- **How It Works:** Systematic hypothesis-driven debugging on clean contexts. Enforces the 3-strike rule: if a bug isn't fixed in 3 attempts, pause and re-hypothesize.

#### 16. `gsd-codebase-mapper`

- **Directory:** `.agent/skills/gsd-codebase-mapper/`
- **How It Works:** Explores and reverse-engineers unfamiliar codebases, generating living documentation (`ARCHITECTURE.md`, `STACK.md`).

#### 17. `gsd-subagent-delegation`

- **Directory:** `.agent/skills/gsd-subagent-delegation/`
- **How It Works:** Manages task delegation to isolated subagents using workspace modes (`branch`, `share`, `inherit`) to keep the primary orchestrator's context window clean.

#### 18. `gsd-context-fetch`

- **Directory:** `.agent/skills/gsd-context-fetch/`
- **How It Works:** Search-first intelligence that greps/searches before reading entire files, preventing context saturation.

#### 19. `gsd-context-compressor`

- **Directory:** `.agent/skills/gsd-context-compressor/`
- **How It Works:** Summarizes and compresses accumulated conversation logs and session state into compact memory checkpoints.

#### 20. `gsd-context-health-monitor`

- **Directory:** `.agent/skills/gsd-context-health-monitor/`
- **How It Works:** Monitors LLM token usage and triggers state dumps to `.gsd/STATE.md` before reasoning begins degrading.

#### 21. `gsd-token-budget`

- **Directory:** `.agent/skills/gsd-token-budget/`
- **How It Works:** Tracks and budgets token consumption across planning, research, coding, and testing phases.

#### 22. `gsd-empirical-validation`

- **Directory:** `.agent/skills/gsd-empirical-validation/`
- **How It Works:** Strict rule enforcement: rejects "trust me, it works" claims. Mandates visible test output, clean exit codes, or browser traces.

---

### 4. Ponytail Anti-Bloat Suite (6 Skills)

Channels senior developer restraint: ruthless simplicity, YAGNI, standard library first.

#### 23. `ponytail`

- **Directory:** `.agent/skills/ponytail/`
- **How It Works:** Rejects premature abstractions, bloated libraries, and speculative configurability. Produces minimal diffs with maximum readability.
- **When to Use:** Whenever designing, refactoring, or writing code, or choosing external dependencies.

#### 24. `ponytail-audit`

- **Directory:** `.agent/skills/ponytail-audit/`
- **How It Works:** Scans an entire repository to find dead flexibility, reinvented standard library functions, and unnecessary third-party packages.
- **When to Use:** When auditing codebases for technical debt or slimming down oversized dependencies.

#### 25. `ponytail-review`

- **Directory:** `.agent/skills/ponytail-review/`
- **How It Works:** Focused code review hunting exclusively for over-engineering, unneeded wrappers, and premature generalizations in pull requests.
- **When to Use:** Reviewing code diffs specifically to reduce lines of code and simplify architectures.

#### 26. `ponytail-debt`

- **Directory:** `.agent/skills/ponytail-debt/`
- **How It Works:** Harvests all intentional shortcuts marked with `// ponytail: <reason>` into a centralized, actionable debt ledger.
- **When to Use:** Tracking deliberate simplifications so they are not forgotten.

#### 27. `ponytail-gain`

- **Directory:** `.agent/skills/ponytail-gain/`
- **How It Works:** Displays a compact scoreboard of measurable impact: lines of code deleted, dependencies avoided, and speed gained.
- **When to Use:** Quantifying the benefits of simplification refactors.

#### 28. `ponytail-help`

- **Directory:** `.agent/skills/ponytail-help/`
- **How It Works:** Interactive cheat sheet and reference guide for all Ponytail rules, command flags, and intensity levels (`lite`, `full`, `ultra`).
- **When to Use:** Quickly checking Ponytail commands and principles.

---

### 5. Build Loops, Story Execution & Multi-Agent Squads

#### 29. `antigravity-agents`

- **Directory:** `.agent/skills/antigravity-agents/`
- **How It Works:** Deploys and coordinates specialized AI agent squads (Architect, Planner, Coder, Security Specialist, QA Engineer) working concurrently on multi-step objectives.
- **When to Use:** When orchestrating large initiatives requiring distinct division of labor across specialized AI personas.

#### 30. `ralph-loop`

- **Directory:** `.agent/skills/ralph-loop/`
- **How It Works:** Executes deterministic autonomous build loops against `prd.json`. Implements stories sequentially in dependency order, running quality gates and browser tests after each story.
- **When to Use:** When executing a feature set autonomously from a validated PRD document.

#### 31. `ralph-prd`

- **Directory:** `.agent/skills/ralph-prd/`
- **How It Works:** Generates standardized, machine-readable PRD JSON documents with user stories, acceptance criteria, and quality gates ready for `ralph-loop`.
- **When to Use:** When planning new features and structuring them into executable stories.

#### 32. `unified-build-pipeline`

- **Directory:** `.agent/skills/unified-build-pipeline/`
- **How It Works:** Combines the best of three worlds: GSD (specifications and context engineering) + Ralph Loop (deterministic story execution) + CodeRabbit (AI code review & quality gates).
- **When to Use:** For full end-to-end, mission-critical autonomous feature development.

#### 33. `using-codex-cli`

- **Directory:** `.agent/skills/using-codex-cli/`
- **How It Works:** Orchestrates OpenAI Codex CLI for non-interactive autonomous code editing, script generation, and multi-model pairing.
- **When to Use:** Running background Codex jobs, bridge scripts, or cross-model coding reviews.

---

### 6. Testing, Code Review & Security Hardening

#### 34. `code-review`

- **Directory:** `.agent/skills/code-review/`
- **How It Works:** Senior software engineer review auditing for correctness, potential runtime bugs, performance bottlenecks, race conditions, and security risks.
- **When to Use:** Before merging PRs, committing code changes, or auditing existing implementations.

#### 35. `testing-code`

- **Directory:** `.agent/skills/testing-code/`
- **How It Works:** Architects and writes comprehensive automated test suites across Unit, Integration, and E2E tiers using Vitest, Jest, Pytest, and Playwright. Enforces deterministic, non-flaky testing.
- **When to Use:** When adding test coverage, configuring CI test runners, or applying Test-Driven Development (TDD).

#### 36. `owasp-security`

- **Directory:** `.agent/skills/owasp-security/`
- **How It Works:** Hardens applications against the OWASP Top 10 vulnerabilities: injection (SQLi, NoSQLi), broken authentication, SSRF, sensitive data exposure, and broken access control.
- **When to Use:** When writing authentication systems, public API endpoints, database queries, or conducting security audits.

#### 37. `security-audit`

- **Directory:** `.agent/skills/security-audit/`
- **How It Works:** Orchestrates a 6-phase adversarial multi-agent security audit (based on Cloudflare's vulnerability discovery harness): reconnaissance & architecture mapping (`architecture.md`, `coverage-ledger.json`), coverage-led hunting across 10 specialized attack classes (memory-safety, AI/LLM, auth/protocols, client-side, supply chain, cloud/IaC, messaging, resource exhaustion, data isolation, and desktop/IPC), independent adversarial candidate validation, structured schema-validated findings (`findings.json`), and comprehensive reporting (`REPORT.md`, `FINDINGS-DETAIL.md`). Includes built-in zero-dependency cross-platform Node.js validators.
- **When to Use:** When performing comprehensive security audits, vulnerability hunting, adversarial code analysis, penetration test preparation, or validating trust boundaries across a repository.

#### 38. `defend-what-you-ship`

- **Directory:** `.agent/skills/defend-what-you-ship/`
- **How It Works:** Enforces the "Defend What You Ship" human ownership doctrine across all customer-facing code. Implements dual-speed operating lanes (Lane A PoC vs. Lane B customer-facing), session handover continuity (`docs/HANDOVER.md`), plan-before-code requirements (`docs/DECISIONS.md`, `docs/ALTERNATIVES.md`), anti-vibes empirical verification, adversarial teach-back drills (`"drill me"`), and automated `docs/` scaffolding via `init-docs.js`.
- **When to Use:** Whenever working on customer-facing or production systems, conducting session handoffs, preparing for pre-ship architectural reviews, or stress-testing technical decisions against whiteboard defense standards.

#### 39. `dev-browser`

- **Directory:** `.agent/skills/dev-browser/`
- **How It Works:** Automates browser sessions with persistent state. Handles page navigation, form submission, screenshot capture, DOM scraping, and live visual verification.
- **When to Use:** When running automated UI acceptance tests, testing responsive layouts, or automating web workflows.

---

### 7. Product Strategy, SEO & Research

#### 40. `context7-mcp`

- **Directory:** `.agent/skills/context7-mcp/`
- **How It Works:** Fetches up-to-date, version-specific documentation and code examples straight from official library docs via the Context7 MCP server. Eliminates hallucinated methods and outdated APIs.
- **When to Use:** Whenever inquiring about libraries, SDKs, frameworks (React, Next.js, FastAPI, Prisma, Tailwind), or migration guides.

#### 41. `graphify`

- **Directory:** `.agent/skills/graphify/`
- **How It Works:** Transforms codebases, documentation, SQL schemas, and technical assets into an indexed, queryable knowledge graph using Tree-sitter AST parsing and Leiden community clustering. Generates standalone interactive visual graphs (`graph.html`), structured GraphRAG representations (`graph.json`), and comprehensive reports (`GRAPH_REPORT.md`). Powers agent commands `/graphify query` (BFS traversal), `/graphify query --dfs` (call chain tracing), `/graphify path` (shortest dependency route), and `/graphify explain` with zero token waste on parsing.
- **When to Use:** When exploring unfamiliar codebases, answering complex cross-file architecture questions, tracing execution and dependency paths, finding "god node" bottlenecks, or exporting code topology to Neo4j, FalkorDB, Gephi, or Obsidian.

#### 42. `brainstorming-ideas`

- **Directory:** `.agent/skills/brainstorming-ideas/`
- **How It Works:** Facilitates creative discovery before coding begins. Explores user journeys, evaluates alternative approaches, and helps select optimal technical trade-offs.
- **When to Use:** At the start of new feature ideation or when solving underspecified problems.

#### 43. `planning-strategy`

- **Directory:** `.agent/skills/planning-strategy/`
- **How It Works:** Bridges the gap between raw brainstorming and task breakdown. Structures high-level architectural decisions into phased milestones.
- **When to Use:** Before writing detailed task specifications or embarking on large refactors.

#### 44. `project-management`

- **Directory:** `.agent/skills/project-management/`
- **How It Works:** Authors production-grade PRDs, sprint planning sheets, user tickets, and roadmap timelines. Integrates with Jira, Linear, and Notion formats.
- **When to Use:** When converting product ideas into organized engineering tickets and sprint plans.

#### 45. `gtm-strategy`

- **Directory:** `.agent/skills/gtm-strategy/`
- **How It Works:** Builds go-to-market strategies: ideal customer profiles (ICPs), competitive positioning, launch messaging, and user outreach sequences.
- **When to Use:** When launching new products, drafting developer marketing material, or preparing release campaigns.

#### 46. `seo-optimizer`

- **Directory:** `.agent/skills/seo-optimizer/`
- **How It Works:** Optimizes websites for search engines: technical SEO, OpenGraph tags, JSON-LD structured schema markup, search intent matching, and Core Web Vitals.
- **When to Use:** When building public marketing pages, blogs, docs sites, or auditing page rankings.

#### 47. `creating-skills`

- **Directory:** `.agent/skills/creating-skills/`
- **How It Works:** The meta-skill that authors, validates, and registers new skills into `.agent/skills/`, enforcing YAML frontmatter and progressive disclosure guidelines.
- **When to Use:** When creating a brand-new skill for this repository or another project.

---

## 🔌 2. All Model Context Protocol (MCP) Integrations

The ecosystem connects to 9 dedicated MCP servers via standard JSON-RPC interfaces:

| MCP Server                | Key Tools                                                                                        | How It Works & Primary Use Cases                                                                                                                                                                                          |
| :------------------------ | :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`21st`**                | `npx @21st-dev/magic`<br>`https://21st.dev/api/mcp`                                              | Component and animation discovery engine for 21st.dev (Magic UI). Enables AI coding assistants to search modern React, Tailwind, and Framer Motion UI blocks, animations, and components and inject source code directly. |
| **`shadcn`**              | `npx shadcn@latest mcp`                                                                          | Official MCP server built into the `shadcn` CLI. Enables AI coding assistants to browse registries, inspect source code, and install shadcn/ui components, blocks, and templates directly with natural language.          |
| **`context7`**            | `resolve-library-id`<br>`query-docs`                                                             | Queries live, official developer documentation for any framework or SDK (React, Next.js, Prisma, FastAPI, Tailwind). Eliminates API hallucinations.                                                                       |
| **`StitchMCP`**           | `create_project`<br>`generate_screen_from_text`<br>`edit_screens`<br>`create_design_system`      | Turns natural language UI prompts into production-grade, conversion-optimized responsive web screens and design system tokens.                                                                                            |
| **`chrome-devtools-mcp`** | `navigate_page`<br>`click`, `type_text`<br>`take_screenshot`<br>`lighthouse_audit`               | Connects directly to Google Chrome via Chrome DevTools Protocol (CDP) for DOM inspection, network debugging, and performance audits.                                                                                      |
| **`playwright`**          | `browser_navigate`<br>`browser_click`<br>`browser_type`<br>`browser_snapshot`                    | Headless/headed browser automation for running E2E user tests, filling forms, and capturing visual regression states.                                                                                                     |
| **`github-mcp-server`**   | `search_repositories`<br>`get_file_contents`<br>`create_or_update_file`<br>`create_pull_request` | Interacts with GitHub repositories: searches code, inspects issues, pushes files, and manages pull requests.                                                                                                              |
| **`gmp-code-assist`**     | `retrieve-instructions`<br>`retrieve-google-maps-platform-docs`                                  | Retrieves official documentation and integration guidelines for Google Maps Platform APIs and SDKs.                                                                                                                       |
| **`firebase-mcp-server`** | `list_projects`<br>`get_project`<br>`manage_services`                                            | Connects to Firebase to manage Firestore schemas, security rules, Firebase Auth, and serverless Cloud Functions.                                                                                                          |

---

## 📦 3. All 6 Autonomous Plugins

Located in [`.agent/plugins/`](file:///C:/Users/amanp/OneDrive/Desktop/skill/.agent/plugins), plugins bundle skills, rules, and workflows into self-contained operational packs:

```
.agent/plugins/
├── coderabbit/            # AI Code Review & Security Gate Plugin
├── gsd/                   # Get Shit Done Autonomous Methodology Plugin
├── ponytail/              # Anti-Bloat, Minimal Diff & YAGNI Plugin
├── ralph/                 # PRD Specification & Validation Plugin
├── ralph-loop/            # Deterministic Story Execution Loop Plugin
└── unified-build-pipeline/# Full Enterprise End-to-End Delivery Pipeline
```

### 1. `coderabbit`

- **Purpose:** Automated senior code reviews and pre-commit audits.
- **Rules Enforced:** Strict quality hierarchy (Correctness → Security → Readability → Performance), zero hardcoded secrets, input validation checks, and minimal actionable diffs.

### 2. `gsd`

- **Purpose:** Spec-driven, context-engineered software development.
- **Rules Enforced:** Planning Lock (no code without finalized `SPEC.md` and `PLAN.md`), Wave Execution (atomic task waves), Context Hygiene (state dumps to `STATE.md`), and Empirical Proof.

### 3. `ponytail`

- **Purpose:** Ruthless simplicity and anti-overengineering.
- **Rules Enforced:** Radical Simplicity, YAGNI, standard library first, zero speculative wrappers, and intentional debt tracking via `// ponytail:` tags.

### 4. `ralph`

- **Purpose:** Machine-readable PRD generation.
- **Rules Enforced:** Translates product requirements into strict `prd.json` specifications with structured acceptance criteria and explicit quality gates.

### 5. `ralph-loop`

- **Purpose:** Deterministic autonomous story execution.
- **Rules Enforced:** Implements stories one-by-one from `prd.json` in dependency order, executing quality gates (lint, build, unit test) and browser checks before committing.

### 6. `unified-build-pipeline`

- **Purpose:** Enterprise mission-critical delivery pipeline.
- **Rules Enforced:** Unifies GSD planning locks with Ralph Loop deterministic execution and CodeRabbit pre-commit code review audits.

---

## 📜 4. All Master Rule Systems

The repository provides tailored instruction files for every modern AI coding runtime:

| Rule File                        | Environment               | Core Philosophy & Working                                                                                                                                                            |
| :------------------------------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[`GEMINI.md`](GEMINI.md)**     | **Google Antigravity**    | Defines the **Token-Optimized 8-Tier Dispatcher**, routing tasks from Tier 1 (micro-fix inline, 0 skill reads) up to Tier 8 (multi-agent squads) to preserve context.                |
| **[`CLAUDE.md`](CLAUDE.md)**     | **Claude Code & Cursor**  | Master development rules, coding conventions, architectural guidelines, directory structures, and git hygiene.                                                                       |
| **[`AGENTS.md`](AGENTS.md)**     | **Universal Multi-Agent** | Defines agent handoff protocols, role boundaries, subagent delegation contracts, and empirical verification gates.                                                                   |
| **[`CODEX.md`](CODEX.md)**       | **OpenAI Codex CLI**      | Sandbox configuration, autonomous non-interactive command execution protocols, and error tolerance rules.                                                                            |
| **[`PONYTAIL.md`](PONYTAIL.md)** | **All Agents**            | The core anti-bloat manifesto: standard library first, zero unnecessary dependencies, and minimal diffs.                                                                             |
| **[`backend.md`](backend.md)**   | **All Agents**            | Production backend rules: connection pooling, schema migrations, structured error envelopes, and caching patterns.                                                                   |
| **[`DEFEND.md`](DEFEND.md)**     | **All Agents**            | Defend What You Ship: enforces human whiteboard defense, dual-speed lanes (PoC vs customer-facing), zero-vibes verification, teach-back drills, and standardized `docs/` governance. |

---

### Global Governance Directives

1. **Context7 Rule:** Always use Context7 MCP to fetch live library documentation for any framework or SDK (React, Next.js, Prisma, Tailwind, FastAPI) rather than relying on training data memory.
2. **Sentry Rule:** Always include Sentry error tracking in backend/frontend scaffolding, load DSNs securely via environment variables, and explicitly catch exceptions in route boundaries.
3. **Google Stitch MCP Rule:** Always leverage Stitch MCP for UI design tasks, using senior UX storytelling layouts and consistent 8pt design system tokens.
