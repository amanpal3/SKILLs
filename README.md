# ⚡ AI Developer Agent Ecosystem

<p align="center">
  <img src="https://raw.githubusercontent.com/amanpal3/SKILLs/main/.agent/skills/brand-identity/assets/banner.png" alt="AI Developer Agent Ecosystem Banner" width="100%" onerror="this.style.display='none'"/>
</p>

<p align="center">
  <strong>A modular, enterprise-hardened AI Skill Store, MCP Tool Suite, and Multi-Agent Orchestration Framework for Autonomous Coding Assistants.</strong>
</p>

<p align="center">
  <a href="#-skill-catalog"><img src="https://img.shields.io/badge/Skills-47%20Verified-0ea5e9?style=for-the-badge&logo=probot" alt="Skills" /></a>
  <a href="#-namespaced-plugins"><img src="https://img.shields.io/badge/Plugins-6%20Packages-8b5cf6?style=for-the-badge&logo=powershell" alt="Plugins" /></a>
  <a href="#-real-time-mcp-integrations"><img src="https://img.shields.io/badge/MCP%20Servers-9%20Integrated-10b981?style=for-the-badge&logo=fastapi" alt="MCP Servers" /></a>
  <a href="#-security-hardening--governance"><img src="https://img.shields.io/badge/Security-OWASP%20Hardened-059669?style=for-the-badge&logo=shield" alt="Security" /></a>
  <a href="#-automated-testing--diagnostics"><img src="https://img.shields.io/badge/Tests-19%2F19%20Pass-22c55e?style=for-the-badge&logo=node.js" alt="Tests" /></a>
  <a href="#-cli-commands"><img src="https://img.shields.io/badge/CLI-Cross--Platform-f59e0b?style=for-the-badge&logo=gnubash" alt="CLI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-64748b?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-global-installation-doctrine">Global Store</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-skill-routing-hierarchy">Routing Hierarchy</a> •
  <a href="#-skill-catalog-47-skills">Skill Catalog</a> •
  <a href="#-namespaced-plugins">Plugins</a> •
  <a href="#-real-time-mcp-integrations">MCP Suite</a> •
  <a href="#-security-hardening--governance">Security</a>
</p>

---

## 📖 Overview

The **AI Developer Agent Ecosystem** is a production-grade, centralized skill catalog and runtime governance suite built for modern autonomous coding agents — including **Google Antigravity**, **OpenAI Codex CLI**, **Claude Code**, **Cursor**, **Windsurf**, and **Devin**.

Instead of saturating your LLM's context window with massive monolithic instructions, this ecosystem implements a **Progressive Disclosure Architecture**: specialized instruction sets, security guardrails, design systems, and deterministic workflows are dynamically retrieved **on-demand** only when relevant to the task.

```
                    ┌───────────────────────────────┐
                    │  Developer / User Prompt      │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ 8-Tier Context Router         │
                    │ (Progressive Disclosure)      │
                    └───────┬───────────────┬───────┘
                            │               │
            ┌───────────────▼───────┐       └───────────────────────┐
            │ Modular Skills (47)   │                               │
            │ • Backend & APIs      │                               ▼
            │ • UI/UX & Design      │               ┌───────────────────────────────┐
            │ • Security & Testing  │               │ 9 Real-Time MCP Servers       │
            │ • GSD & Ponytail      │               │ Context7, Stitch, Sentry,     │
            └───────────────┬───────┘               │ DevTools, GitHub, Playwright  │
                            │                       └───────────────┬───────────────┘
                            ▼                                       │
                    ┌───────────────────────────────────────────────▼┐
                    │ High-Confidence, Empirically-Verified Code     │
                    └────────────────────────────────────────────────┘
```

> 📚 **Complete Documentation:**
> - [**ECOSYSTEM.md**](ECOSYSTEM.md) — Comprehensive technical reference across all 47 skills, plugins, and architectures.
> - [**PLUGINS_AND_MCP_README.md**](PLUGINS_AND_MCP_README.md) — Master guide for MCP servers, CLI logins, and API Key requirements.
> - [**DEFEND.md**](DEFEND.md) — Human whiteboard defense and pre-ship quality checklists.
> - [**SECURITY_AUDIT.md**](SECURITY_AUDIT.md) — Vulnerability register, CVSS ratings, and hardening proof.

---

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/amanpal3/SKILLs.git
cd SKILLs
```

### 2. Verify Health & Security
Run the native diagnostic doctor to verify your environment, dependencies, and configuration integrity:
```bash
npm run doctor
```

```
============================================
  AI ECOSYSTEM SECURITY & HEALTH DIAGNOSTICS
============================================
[PASS] Node.js Version: v24.20.0 (>=18 required)
[PASS] Manifest Validation: 47 skills declared, 6 plugins declared
[PASS] MCP Configuration: 7 servers configured, zero hardcoded secrets
[PASS] Secret Detection: Scanned 1,108 files, 0 credentials exposed
[PASS] Package Integrity: 7 critical governance files verified
[PASS] Global Installation: Detected active store (~/.gemini ~/.agent)
--------------------------------------------
Overall Status: HEALTHY
--------------------------------------------
```

---

## 🌐 Global Installation Doctrine

> [!IMPORTANT]
> **One-Time Setup, Machine-Wide Availability:**  
> When you run the `store` command, all **47 skills**, **6 plugins**, and **governance rules** are stored in your user profile's global directories (`~/.gemini/config/skills/`, `~/.agent/skills/`, and `~/.codex/skills/`).  
> **Every repository and IDE session on your computer gets immediate access** without needing to re-copy files into every project folder.

### Run the Global Installer:

**Windows PowerShell:**
```powershell
powershell -NoProfile -ExecutionPolicy RemoteSigned -File .\install-skills.ps1 store
```

**Windows CMD:**
```cmd
install-skills.bat store
```

**Node / Universal CLI:**
```bash
node bin/ai-ecosystem.js install --global
```

#### What Happens Under the Hood:
1. **Google Antigravity Discovery:** Syncs skills to `~/.gemini/config/skills/` and plugins to `~/.gemini/config/plugins/`.
2. **Universal Agent Standard:** Syncs skills to `~/.agent/skills/` and rules to `~/.agent/rules/`.
3. **OpenAI Codex CLI Integration:** Syncs skills to `~/.codex/skills/` for instant `codex exec` resolution.
4. **Automated Safety Backups:** Automatically creates a rollback point in `~/.gemini/backups/` before any changes are written.

---

## 🚀 Project-Specific Installation (Optional)

If you prefer to commit skills directly into a specific project repository (e.g. for team collaboration):

```powershell
# Install into current project:
.\install-skills.ps1 install

# Or install into a custom path:
.\install-skills.ps1 install -TargetPath "C:\Projects\my-app"
```

Or via Node CLI:
```bash
node bin/ai-ecosystem.js install --target "C:\Projects\my-app"
```

---

## ✨ Key Features & Capabilities

<table>
  <tr>
    <td width="50%">
      <h3>🧠 Zero-Hallucination Docs</h3>
      <p>Integrated <strong>Context7 MCP</strong> retrieves live, version-specific library docs and verified API signatures in real-time, eliminating hallucinated methods in modern frameworks.</p>
    </td>
    <td width="50%">
      <h3>🛡️ Defend What You Ship</h3>
      <p>Strict whiteboard defense governance: <strong>Dual-Speed Lanes</strong> (PoC vs Customer-Facing), session handovers, zero-vibes empirical verification, and <code>docs/</code> decision ledgers.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>✂️ Ponytail Radical Simplicity</h3>
      <p>Anti-overengineering doctrine enforcing standard library first, YAGNI, zero speculative abstractions, minimal PR diffs, and deliberate debt ledger tracking.</p>
    </td>
    <td width="50%">
      <h3>⚡ GSD Autonomous Waves</h3>
      <p><strong>Get Shit Done (GSD)</strong> methodology with strict Spec Locks, dependency-ordered wave execution, context hygiene state dumps, and automatic git checkpointing.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎨 UI/UX Pro Max & Stitch</h3>
      <p>AI design system integrating <strong>Google Stitch MCP</strong>, <strong>shadcn</strong>, and <strong>21st.dev</strong> with senior UX psychology laws (Fitts, Hick, Miller) and fluid motion.</p>
    </td>
    <td width="50%">
      <h3>🔒 Hardened Security Architecture</h3>
      <p>Zero hardcoded keys, automated secret scanner, path traversal blockers, sandboxed agent permissions, and CodeRabbit AI quality review gates.</p>
    </td>
  </tr>
</table>

---

## 🚦 Skill Routing Hierarchy

When requests arrive, the agent matches user intent against this deterministic routing ladder to minimize token overhead:

```text
User Request
 │
 ├── 🎨 UI / Design / Mockup         ──► designing-with-stitch + ui-ux-pro-max + brand-identity
 ├── 🕸️ Codebase Graph / Architecture──► graphify + archify + gsd-codebase-mapper
 ├── 📚 Library Docs / API Reference ──► context7-mcp
 ├── 🚨 Error Tracking / APM / Sentry──► integrating-sentry + error-handling-patterns
 ├── 🛡️ Security / Whiteboard Defense──► defend-what-you-ship + security-audit + owasp-security
 ├── 🛠️ Backend / API / Database     ──► building-backend + integrating-sentry
 ├── ✂️ Anti-Bloat / Minimal Code    ──► ponytail
 ├── 🚀 Full Autonomous Delivery     ──► unified-build-pipeline (GSD + Ralph + CodeRabbit)
 ├── 👥 Multi-Agent Squad            ──► antigravity-agents
 ├── 📋 PRD / Sprint / Roadmap       ──► project-management + ralph-prd
 ├── 📈 Launch / SEO / GTM           ──► gtm-strategy + seo-optimizer
 └── 💡 Authoring a New Skill        ──► creating-skills
```

---

## 🧩 Skill Catalog (47 Skills)

### 🛠️ Backend, APIs & Infrastructure
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`building-backend`** | [`.agent/skills/building-backend/`](.agent/skills/building-backend/) | Production REST, GraphQL, gRPC APIs, database migrations, Redis caching, worker queues, and microservices. |
| **`integrating-sentry`** | [`.agent/skills/integrating-sentry/`](.agent/skills/integrating-sentry/) | Complete Sentry APM across Python (`sentry-sdk`), Next.js (`@sentry/nextjs`), and Node.js (`@sentry/node`). |
| **`managing-firebase`** | [`.agent/skills/managing-firebase/`](.agent/skills/managing-firebase/) | Firebase project setup, Firestore security rules, Cloud Functions, and Firebase MCP integrations. |
| **`error-handling-patterns`** | [`.agent/skills/error-handling-patterns/`](.agent/skills/error-handling-patterns/) | Fault-tolerant error propagation, Result types, structured logging, circuit breakers, and graceful degradation. |
| **`using-codex-cli`** | [`.agent/skills/using-codex-cli/`](.agent/skills/using-codex-cli/) | Headless execution, sandboxed non-interactive runs, and review pipelines with OpenAI Codex CLI. |

### 🎨 Frontend, UI/UX & Design Systems
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`ui-ux-pro-max`** | [`.agent/skills/ui-ux-pro-max/`](.agent/skills/ui-ux-pro-max/) | Senior UI/UX design tokens, UX psychology laws (Fitts, Hick, Miller), storytelling layouts, and micro-interactions. |
| **`designing-with-stitch`**| [`.agent/skills/designing-with-stitch/`](.agent/skills/designing-with-stitch/) | Screen generation, responsive device layouts, and design system tokens using Google Stitch MCP. |
| **`brand-identity`** | [`.agent/skills/brand-identity/`](.agent/skills/brand-identity/) | Design tokens, typography hierarchies, semantic color palettes, and voice/tone copywriting standards. |
| **`using-remotion`** | [`.agent/skills/using-remotion/`](.agent/skills/using-remotion/) | Programmatic motion graphics, data-driven video composition, and rendering using React & Remotion. |
| **`archify`** | [`.agent/skills/archify/`](.agent/skills/archify/) | Compiles architecture, workflow, sequence, ERD, and lifecycle models into standalone, interactive HTML diagrams. |

### 📚 Intelligence, Docs & Knowledge Graph
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`graphify`** | [`.agent/skills/graphify/`](.agent/skills/graphify/) | Transforms codebases into queryable AST knowledge graphs (`graph.json`, `graph.html`); powers `/graphify query`, `path`, and `explain`. |
| **`context7-mcp`** | [`.agent/skills/context7-mcp/`](.agent/skills/context7-mcp/) | Live, versioned library docs and code snippets via Context7 MCP to eliminate hallucinated APIs. |
| **`dev-browser`** | [`.agent/skills/dev-browser/`](.agent/skills/dev-browser/) | Persistent browser automation, end-to-end user flows, form filling, scraping, and visual testing. |

### 🛡️ Security, Governance & Testing
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`defend-what-you-ship`** | [`.agent/skills/defend-what-you-ship/`](.agent/skills/defend-what-you-ship/) | Human whiteboard defense: dual-speed lanes (PoC vs Lane B), session handovers, zero-vibes verification, teach-back drills. |
| **`security-audit`** | [`.agent/skills/security-audit/`](.agent/skills/security-audit/) | Adversarial security auditor: reconnaissance, coverage hunting across 10 attack classes, and candidate verification. |
| **`owasp-security`** | [`.agent/skills/owasp-security/`](.agent/skills/owasp-security/) | OWASP Top 10 mitigation, auth boundaries, strict input validation, secret hygiene, and SQLi/XSS defense. |
| **`code-review`** | [`.agent/skills/code-review/`](.agent/skills/code-review/) | Senior code review auditing for correctness, security vulnerabilities, performance bottlenecks, and clean diffs. |
| **`testing-code`** | [`.agent/skills/testing-code/`](.agent/skills/testing-code/) | Automated test architecture across Unit, Integration, and E2E tiers (Vitest, Jest, Pytest, Playwright). |

### ✂️ Simplicity & Anti-Overengineering (Ponytail Suite)
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`ponytail`** | [`.agent/skills/ponytail/`](.agent/skills/ponytail/) | Forces the shortest working solution: standard library first, zero speculative wrappers, YAGNI. |
| **`ponytail-audit`** | [`.agent/skills/ponytail-audit/`](.agent/skills/ponytail-audit/) | Whole-repo scan for over-engineering, dead flexibility, and redundant external dependencies. |
| **`ponytail-review`** | [`.agent/skills/ponytail-review/`](.agent/skills/ponytail-review/) | Code review focused exclusively on cutting unnecessary abstractions and speculative layers. |
| **`ponytail-debt`** | [`.agent/skills/ponytail-debt/`](.agent/skills/ponytail-debt/) | Harvests deliberate shortcuts tagged with `// ponytail:` into a persistent debt ledger. |
| **`ponytail-gain`** | [`.agent/skills/ponytail-gain/`](.agent/skills/ponytail-gain/) | Quantifies benchmark impact: lines deleted, dependencies reduced, and execution speed gained. |
| **`ponytail-help`** | [`.agent/skills/ponytail-help/`](.agent/skills/ponytail-help/) | Quick-reference card for Ponytail modes, intensity levels (lite, full, ultra), and rules. |

### 🚀 Autonomous Delivery & Multi-Agent Squads
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`antigravity-agents`** | [`.agent/skills/antigravity-agents/`](.agent/skills/antigravity-agents/) | Multi-agent squad orchestration (Commander, Architect, UI/UX, Backend, Security, Debugger). |
| **`unified-build-pipeline`**| [`.agent/skills/unified-build-pipeline/`](.agent/skills/unified-build-pipeline/) | End-to-end development loop: GSD specs + Ralph autonomous loop + CodeRabbit quality review. |
| **`ralph-loop`** | [`.agent/skills/ralph-loop/`](.agent/skills/ralph-loop/) | Deterministic story execution loop from `prd.json` with quality gates and browser verification. |
| **`ralph-prd`** | [`.agent/skills/ralph-prd/`](.agent/skills/ralph-prd/) | Generates machine-readable Product Requirements Document (PRD) JSON for autonomous loops. |

### ⚡ Spec-Driven Development (GSD Suite)
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`gsd`** | [`.agent/skills/gsd/`](.agent/skills/gsd/) | Master Get Shit Done methodology: planning locks, state persistence, and empirical proof. |
| **`gsd-planner`** | [`.agent/skills/gsd-planner/`](.agent/skills/gsd-planner/) | Decomposes roadmap phases into atomic `PLAN.md` specifications with wave dependencies. |
| **`gsd-plan-checker`** | [`.agent/skills/gsd-plan-checker/`](.agent/skills/gsd-plan-checker/) | Pre-execution plan validation catching scope creep, missing deps, and architectural risks. |
| **`gsd-executor`** | [`.agent/skills/gsd-executor/`](.agent/skills/gsd-executor/) | Executes atomic tasks in dependency-ordered waves with git checkpoint commits. |
| **`gsd-verifier`** | [`.agent/skills/gsd-verifier/`](.agent/skills/gsd-verifier/) | Independent empirical validation against must-haves using test commands and browser checks. |
| **`gsd-debugger`** | [`.agent/skills/gsd-debugger/`](.agent/skills/gsd-debugger/) | Systematic hypothesis-driven debugging on fresh contexts applying the 3-strike rule. |
| **`gsd-codebase-mapper`** | [`.agent/skills/gsd-codebase-mapper/`](.agent/skills/gsd-codebase-mapper/) | Reverse-engineers codebase architecture into living `STACK.md` and `ARCHITECTURE.md` maps. |
| **`gsd-subagent-delegation`**| [`.agent/skills/gsd-subagent-delegation/`](.agent/skills/gsd-subagent-delegation/) | Protocol for delegating subtasks to isolated subagents with branch workspace modes. |
| **`gsd-context-fetch`** | [`.agent/skills/gsd-context-fetch/`](.agent/skills/gsd-context-fetch/) | Search-first methodology preventing context degradation from reading unnecessary files. |
| **`gsd-context-compressor`**| [`.agent/skills/gsd-context-compressor/`](.agent/skills/gsd-context-compressor/) | Working memory compression strategies to maximize model reasoning fidelity. |
| **`gsd-context-health-monitor`**| [`.agent/skills/gsd-context-health-monitor/`](.agent/skills/gsd-context-health-monitor/) | Monitors token complexity and triggers proactive state dumps before reasoning degrades. |
| **`gsd-token-budget`** | [`.agent/skills/gsd-token-budget/`](.agent/skills/gsd-token-budget/) | Tracks token allocations across planning, execution, and verification phases. |
| **`gsd-empirical-validation`**| [`.agent/skills/gsd-empirical-validation/`](.agent/skills/gsd-empirical-validation/) | Zero-vibes proof enforcement: requires exit codes, test outputs, or browser snapshots. |

### 📈 Product, Strategy & Growth
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`project-management`** | [`.agent/skills/project-management/`](.agent/skills/project-management/) | Authoring PRDs, sprint planning sheets, roadmaps, and Linear/Jira/Notion tickets. |
| **`gtm-strategy`** | [`.agent/skills/gtm-strategy/`](.agent/skills/gtm-strategy/) | Go-to-market launch playbooks, ICP buyer personas, positioning, and outreach sequences. |
| **`seo-optimizer`** | [`.agent/skills/seo-optimizer/`](.agent/skills/seo-optimizer/) | Technical SEO, JSON-LD schemas, meta tags, search intent matching, and Core Web Vitals. |
| **`brainstorming-ideas`** | [`.agent/skills/brainstorming-ideas/`](.agent/skills/brainstorming-ideas/) | Divergent-convergent exploration of product features, user flows, and technical designs. |
| **`creating-skills`** | [`.agent/skills/creating-skills/`](.agent/skills/creating-skills/) | Meta-skill for authoring, structuring, testing, and registering new skills in the ecosystem. |

---

## 🔌 Namespaced Plugins

Plugins package complete domain capabilities (skills, instructions, and workflows) into standalone modules:

| Plugin | Core Purpose | Enforced Rules | Credentials Required? |
| :--- | :--- | :--- | :---: |
| **`coderabbit`** | Automated AI code reviews & security audits | Quality gates, input validation, pre-commit checklists | ❌ None (Local Intelligence) |
| **`gsd`** | Spec-driven autonomous execution | Planning locks, wave commits, context hygiene, empirical proof | ❌ None (Local Intelligence) |
| **`ponytail`** | Radical simplicity & anti-overengineering | YAGNI enforcement, standard library first, debt tracking | ❌ None (Local Intelligence) |
| **`ralph`** | PRD generation and validation | Machine-readable schema, user story dependency analysis | ❌ None (Local Intelligence) |
| **`ralph-loop`** | Deterministic test-driven build loop | Sequential story execution, quality gate checks, browser testing | ❌ None (Local Browser) |
| **`unified-build-pipeline`** | End-to-end software delivery | Combines GSD planning + Ralph execution + CodeRabbit review | ❌ None (Local Pipeline) |

---

## 🌐 Real-Time MCP Integrations

Pre-configured in [`mcp.json`](mcp.json) with security validation and schema checks:

| Server Name | Protocol / Command | Auth Required? | Tier / Cost | Key Provider / Setup |
| :--- | :--- | :---: | :--- | :--- |
| **`shadcn`** | `npx -y shadcn@latest mcp` | ❌ **No** | Free & Open Source | Built-in (Local Execution) |
| **`21st` (Magic UI)**| `npx -y @21st-dev/magic@latest` | ✅ **Yes** | Free Tier Available | Run `21st login` or [21st.dev/mcp](https://21st.dev/mcp) |
| **`context7`** | `https://mcp.context7.com/mcp` | ✅ **Yes** | Free Tier Available | [context7.com](https://context7.com) (`Authorization: Bearer <KEY>`) |
| **`StitchMCP`** | `npx -y mcp-remote ...` | ✅ **Yes** | Google Cloud / Stitch | [stitch.googleapis.com](https://stitch.googleapis.com) (`X-Goog-Api-Key: <KEY>`) |
| **`chrome-devtools-mcp`**| `npx -y chrome-devtools-mcp@latest` | ❌ **No** | Free & Local | Local Chrome / Node (Zero-Config) |
| **`playwright`** | `npx -y @playwright/mcp@latest` | ❌ **No** | Free & Local | Local Playwright (Zero-Config) |
| **`github-mcp-server`** | `npx -y @modelcontextprotocol/server-github` | ✅ **Yes** | Free (GitHub Account) | [github.com/settings/tokens](https://github.com/settings/tokens) (`GITHUB_PERSONAL_ACCESS_TOKEN`) |
| **`gmp-code-assist`** | `https://mapscodeassist.googleapis.com/mcp` | ⚠️ **Optional** | Google Cloud Tier | [console.cloud.google.com](https://console.cloud.google.com) (ADC / Header) |
| **`firebase-mcp-server`**| `npx -y firebase-mcp-server` | ✅ **Yes** | Free Tier Available | Run `firebase login` (CLI OAuth) |

> 📖 See [**`PLUGINS_AND_MCP_README.md`**](PLUGINS_AND_MCP_README.md) for detailed configuration, permission policies, and troubleshooting.

---

## 💻 CLI Commands

The ecosystem includes a cross-platform CLI tool in `bin/ai-ecosystem.js`:

```bash
# Run comprehensive environment and security diagnostics
node bin/ai-ecosystem.js doctor
# or
npm run doctor

# Install skills globally into user configuration stores
node bin/ai-ecosystem.js install --global

# Install skills into a target project repository
node bin/ai-ecosystem.js install --target "C:\Projects\my-project"

# Safely restore previous configuration from automated backup
node bin/ai-ecosystem.js rollback

# Cleanly uninstall ecosystem files without touching user project code
node bin/ai-ecosystem.js uninstall
```

---

## 🔒 Security Hardening & Governance

This repository adheres to enterprise DevSecOps standards and passed a full comprehensive security audit:

* **Zero Hardcoded Credentials:** Verified statically via automated regex scanners across 1,100+ files.
* **Safe Path Traversal Protections:** Automated path guards reject UNC network shares, drive roots, and sensitive vaults (`.ssh`, `.aws`, `.gnupg`, `.kube`, `.git`).
* **Non-Destructive Backups:** Timestamped backups created in `~/.gemini/backups/` before any filesystem write.
* **Continuous Security Testing:** Native Node.js test suite with 19/19 passing security tests:
  ```bash
  npm run test:security
  ```
* **Vulnerability Reporting:** See [**`SECURITY.md`**](SECURITY.md) for responsible disclosure guidelines.

---

## 🤝 Contributing & Community

Contributions are welcome! Please follow these standards:
1. Ensure all new skills follow the [`.agent/skills/creating-skills/`](.agent/skills/creating-skills/) specification.
2. Maintain UTF-8 without BOM across all files.
3. Run `npm run doctor` and `npm run test:security` before submitting pull requests.

---

<p align="center">
  <strong>Built with ⚡ for the next generation of autonomous AI developers.</strong><br/>
  <sub>Released under the <a href="LICENSE">MIT License</a>. Maintained by the community.</sub>
</p>
