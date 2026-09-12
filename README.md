# ?? AI Skills & Agent Ecosystem

> **A modular, production-grade AI Skill System and multi-agent orchestration framework for autonomous coding assistants.**

<p align="center">
  <a href="#-skill-catalog"><img src="https://img.shields.io/badge/Skills-43%20Active-blue?style=for-the-badge&logo=probot" alt="Skills" /></a>
  <a href="#-namespaced-plugins"><img src="https://img.shields.io/badge/Plugins-6%20Packages-purple?style=for-the-badge&logo=powershell" alt="Plugins" /></a>
  <a href="#-real-time-mcp-integrations"><img src="https://img.shields.io/badge/MCP-Context7%20%7C%20Stitch%20%7C%20Sentry-emerald?style=for-the-badge&logo=fastapi" alt="MCP Servers" /></a>
  <a href="#-methodology"><img src="https://img.shields.io/badge/Methodology-GSD%20%7C%20Ralph%20%7C%20Ponytail-orange?style=for-the-badge&logo=target" alt="Methodology" /></a>
  <a href="#-security-testing--quality"><img src="https://img.shields.io/badge/Security-OWASP%20Hardened-red?style=for-the-badge&logo=shield" alt="Security" /></a>
</p>

---

## 📖 Overview

This repository is a centralized, cross-platform **AI Skill & Plugin Store** designed for modern AI coding agents — including **Google Antigravity**, **OpenAI Codex CLI**, **Claude Code**, **Cursor**, **Windsurf**, and **Devin**.

Instead of saturating your LLM's context window with massive monolithic prompt files, this ecosystem implements an **on-demand skill loading architecture**: specialized instruction sets, production guardrails, and deterministic workflows are dynamically retrieved only when relevant to the task at hand.

---

## ⚡ Quick Start: Clone & 1-Command Global Setup

Anyone can clone this repository from GitHub and install all 43 skills globally across their machine in seconds:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SKILLs.git
cd SKILLs
```

### 2. Store Skills Globally (Syncs to All Agents)
Run the automated installer to sync all skills, plugins, and instructions into your global user directories:

```powershell
# In PowerShell (ExecutionPolicy Bypass ensures Windows doesn't block the script):
powershell -ExecutionPolicy Bypass -File .\install-skills.ps1 store
```

Or on standard Windows CMD:
```cmd
install-skills.bat store
```

> [!TIP]
> **What `store` does automatically:**
> 1. Syncs all 43 skills directly to `~/.gemini/config/skills/` (Google Antigravity Native Global Discovery)
> 2. Syncs all 6 plugins directly to `~/.gemini/config/plugins/` (Google Antigravity Native Global Plugins)
> 3. Syncs global rules to `~/.gemini/config/rules/` and `~/.gemini/GEMINI.md`
> 4. Syncs all 43 skills to `~/.agent/skills/` and `~/.agents/skills/` (Universal Agent standards)
> 5. Syncs all 43 skills to `~/.codex/skills/` (OpenAI Codex CLI)
> 6. Synchronizes `CLAUDE.md`, `CODEX.md`, `AGENTS.md`, `GEMINI.md`, workflows, and `manifest.json` to `~/.gemini/global-skills/`
>
> **Progressive Disclosure Note:** In Google Antigravity, skills are indexed dynamically and loaded on-demand when relevant tasks are requested, preserving your token budget rather than dumping all skills into the prompt upfront.

---

## 🚀 Installing Skills into a Specific Project

If you want to inject the skills and instructions directly into an existing project or new repository (e.g. to commit `.agent/` into your team's Git repo):

```powershell
# Install into the current project directory:
powershell -ExecutionPolicy Bypass -File .\install-skills.ps1 install

# Or install into a specific target directory:
powershell -ExecutionPolicy Bypass -File .\install-skills.ps1 install -TargetPath "C:\Projects\my-new-app"
```

Or on standard Windows CMD:
```cmd
install-skills.bat install
# Or:
install-skills.bat install "C:\Projects\my-new-app"
```

This will copy:
- `.agent/skills/` (All 43 modular domain skills)
- `.agent/plugins/` (All 6 autonomous plugins)
- `.agent/workflows/` (Autonomous workflows & runbooks)
- `GEMINI.md` (Native Google Antigravity rules & instructions)
- `AGENTS.md` (Universal multi-agent instructions)
- `CLAUDE.md` (Master instructions for Claude Code & Cursor)
- `CODEX.md` (Master instructions for OpenAI Codex CLI)
- `PONYTAIL.md` & `backend.md` (Architectural rules)

---

## ✨ Key Highlights

- ?? **Context7 Real-Time Documentation:** Zero-hallucination library docs and version-specific code examples fetched dynamically straight from official sources.
- ??? **Sentry Error Tracking & APM:** Automated error boundaries, distributed tracing, and breadcrumb-rich exception capturing for Python, Next.js, and Node.js.
- ?? **Google Stitch MCP UI Generation:** Turn natural language prompts into production-grade, conversion-optimized UI designs backed by senior UX psychology.
- ?? **Ponytail Anti-Bloat Philosophy:** Ruthless enforcement of YAGNI, standard library first, zero speculative abstractions, and minimal diffs.
- ?? **Autonomous Execution Pipelines:** Battle-tested **GSD (Get Shit Done)**, **Ralph Loop** deterministic user stories, and **CodeRabbit** AI code review gates.
- ? **Zero-Bloat Context:** Every skill is isolated into its own `SKILL.md` domain file, preserving token budget for your actual codebase.

---

## 🗂️ Repository Architecture

```
skill/
+-- .agent/
�   +-- skills/                  # 43 modular domain skills
�   �   +-- antigravity-agents/  # Multi-agent squad orchestration
�   �   +-- building-backend/    # Production APIs, schemas & microservices
�   �   +-- context7-mcp/        # Real-time docs & versioned library search
�   �   +-- designing-with-stitch/# Google Stitch UI screens & design systems
�   �   +-- integrating-sentry/  # Sentry APM, exception capture & DSNs
�   �   +-- gsd/                 # Get Shit Done master methodology
�   �   +-- owasp-security/      # OWASP Top 10 defense & auth boundaries
�   �   +-- ponytail/            # Minimal solution & anti-overengineering
�   �   +-- ralph-loop/          # Autonomous story execution loop
�   �   +-- ui-ux-pro-max/       # Senior UX laws & design system tokens
�   �   +-- ...                  # (Full catalog detailed below)
�   +-- plugins/                 # 6 namespaced plugins (GSD, Ralph, Ponytail, etc.)
�   +-- workflows/               # Autonomous development playbooks
+-- AGENTS.md                    # Universal agent behavior instructions
+-- CLAUDE.md                    # Canonical rules & skill loading logic
+-- PONYTAIL.md                  # Lazy Senior Dev decision ladder
+-- backend.md                   # Enterprise backend architectural rules
+-- install-skills.ps1           # Portable PowerShell installer & global synchronizer
+-- install-skills.bat           # Windows 1-click batch installer
```

---

## 🧭 Skill Catalog (43 Skills)

### ??? Backend, APIs & Observability
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`building-backend`** | `.agent/skills/building-backend/` | Production REST, GraphQL, gRPC APIs, database migrations, Redis caching, worker queues, and microservices. |
| **`integrating-sentry`** | `.agent/skills/integrating-sentry/` | Complete Sentry instrumentation across Python (`sentry-sdk`), Next.js (`@sentry/nextjs`), and Node.js (`@sentry/node`) with safe DSN loading. |
| **`managing-firebase`** | `.agent/skills/managing-firebase/` | Firebase project initialization, Firestore schemas, Cloud Functions, and Firebase MCP integrations. |
| **`error-handling-patterns`** | `.agent/skills/error-handling-patterns/` | Fault-tolerant error propagation, Result types, structured logs, circuit breakers, and graceful degradation. |

### ?? Frontend, UI/UX & Design Systems
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`ui-ux-pro-max`** | `.agent/skills/ui-ux-pro-max/` | Senior UI/UX design tokens, UX psychology laws (Fitts, Hick, Miller), storytelling layouts, and micro-interactions. |
| **`designing-with-stitch`**| `.agent/skills/designing-with-stitch/` | Screen generation, responsive device layouts, and design system tokens using Google Stitch MCP. |
| **`brand-identity`** | `.agent/skills/brand-identity/` | Design tokens, typography hierarchies, semantic color palettes, and brand voice guidelines. |
| **`using-remotion`** | `.agent/skills/using-remotion/` | Programmatic motion graphics, data-driven animations, and video rendering using React & Remotion. |

### ?? Documentation & Developer Intelligence
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`context7-mcp`** | `.agent/skills/context7-mcp/` | Fetches live, version-specific library docs and code snippets via Context7 MCP to eliminate hallucinated APIs. |
| **`dev-browser`** | `.agent/skills/dev-browser/` | Persistent browser automation, end-to-end user flows, form filling, scraping, and visual testing. |

### ??? Security, Code Quality & Testing
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`owasp-security`** | `.agent/skills/owasp-security/` | OWASP Top 10 mitigation, auth boundaries, strict input validation, secret hygiene, and SQLi/XSS defense. |
| **`code-review`** | `.agent/skills/code-review/` | Senior code review auditing for correctness, security vulnerabilities, performance bottlenecks, and clean diffs. |
| **`testing-code`** | `.agent/skills/testing-code/` | Automated test suite architecture across Unit, Integration, and E2E (Vitest, Jest, Pytest, Playwright). |

### ?? Simplicity & Anti-Overengineering (Ponytail Suite)
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`ponytail`** | `.agent/skills/ponytail/` | Enforces the shortest working solution: standard library first, zero speculative wrappers, YAGNI. |
| **`ponytail-audit`** | `.agent/skills/ponytail-audit/` | Repository-wide scanner to identify bloated packages, duplicate utilities, and over-engineered layers. |
| **`ponytail-review`** | `.agent/skills/ponytail-review/` | PR diff review focusing strictly on eliminating complexity and speculative flexibility. |
| **`ponytail-debt`** | `.agent/skills/ponytail-debt/` | Harvests and tracks intentional shortcuts tagged with `// ponytail:` into a persistent ledger. |
| **`ponytail-gain`** | `.agent/skills/ponytail-gain/` | Calculates metrics on deleted code, reduced dependencies, and improved execution speed. |
| **`ponytail-help`** | `.agent/skills/ponytail-help/` | Quick-reference cheat sheet for all Ponytail commands, intensity tiers, and rules. |

### ?? Autonomous Build Pipelines & Orchestration
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`antigravity-agents`** | `.agent/skills/antigravity-agents/` | Orchestrates multi-agent squads (planners, coders, security, UI) running parallel workflows. |
| **`unified-build-pipeline`**| `.agent/skills/unified-build-pipeline/` | End-to-end development loop: GSD (specifications) + Ralph Loop (stories) + CodeRabbit (reviews). |
| **`ralph-loop`** | `.agent/skills/ralph-loop/` | Autonomous story execution loop processing `prd.json` with automated quality gates and browser checks. |
| **`ralph-prd`** | `.agent/skills/ralph-prd/` | Generates standardized, machine-readable PRD JSON specifications ready for Ralph execution. |

### ? Get Shit Done (GSD Suite - 14 Sub-Skills)
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`gsd`** | `.agent/skills/gsd/` | Master GSD methodology: planning lock, wave execution, state dumps, and empirical verification. |
| **`gsd-planner`** | `.agent/skills/gsd-planner/` | Decomposes roadmaps into atomic phase plans (`PLAN.md`) with dependency waves. |
| **`gsd-plan-checker`** | `.agent/skills/gsd-plan-checker/` | Validates plans before execution to catch scope creep, missing deps, and architectural flaws. |
| **`gsd-executor`** | `.agent/skills/gsd-executor/` | Executes atomic tasks in dependency-ordered waves with git checkpointing. |
| **`gsd-verifier`** | `.agent/skills/gsd-verifier/` | Independent empirical validation against must-haves using test commands and browser verification. |
| **`gsd-debugger`** | `.agent/skills/gsd-debugger/` | Systematic, hypothesis-driven debugging on fresh contexts using the 3-strike protocol. |
| **`gsd-codebase-mapper`** | `.agent/skills/gsd-codebase-mapper/`| Analyzes architecture, directory layouts, and dependencies into living map documents. |
| **`gsd-subagent-delegation`**| `.agent/skills/gsd-subagent-delegation/`| Canonical protocol for delegating tasks to isolated subagents with branch workspace modes. |
| **`gsd-context-fetch`** | `.agent/skills/gsd-context-fetch/` | Search-first methodology to prevent context bloat from reading unnecessary files. |
| **`gsd-context-compressor`**| `.agent/skills/gsd-context-compressor/`| Compresses and summarizes working memory to maximize token efficiency. |
| **`gsd-context-health-monitor`**| `.agent/skills/gsd-context-health-monitor/`| Monitors token complexity and triggers state persistence before degraded reasoning. |
| **`gsd-token-budget`** | `.agent/skills/gsd-token-budget/` | Estimates and manages token allocations across planning, execution, and verification phases. |
| **`gsd-empirical-validation`**| `.agent/skills/gsd-empirical-validation/`| Enforces proof requirements (test output, command exit code) before marking any task complete. |

### ?? Product, Strategy & Growth
| Skill | Directory | Core Capabilities |
| :--- | :--- | :--- |
| **`project-management`** | `.agent/skills/project-management/` | Creates PRDs, sprint planning sheets, roadmaps, and Linear/Jira/Notion tickets. |
| **`gtm-strategy`** | `.agent/skills/gtm-strategy/` | Go-to-market launch playbooks, ICP personas, positioning narratives, and outreach sequences. |
| **`seo-optimizer`** | `.agent/skills/seo-optimizer/` | Technical SEO, JSON-LD schemas, meta tags, search intent matching, and Core Web Vitals optimization. |
| **`brainstorming-ideas`** | `.agent/skills/brainstorming-ideas/` | Divergent-convergent exploration of product features, user journeys, and technical designs. |
| **`creating-skills`** | `.agent/skills/creating-skills/` | Meta-skill for authoring, structuring, and registering new skills into the ecosystem. |

---

## 🔌 Namespaced Plugins

Plugins bundle rules, skills, and tools into unified modules located in `.agent/plugins/`:

| Plugin | Purpose | Integrated Rules |
| :--- | :--- | :--- |
| **`coderabbit`** | Automated AI code reviews & security audits | Quality gates, input boundary validation, pre-commit checklists |
| **`gsd`** | Spec-driven autonomous execution | Planning lock, wave execution, context hygiene, empirical proof |
| **`ponytail`** | Extreme simplicity & anti-overengineering | YAGNI enforcement, standard library first, debt tracking |
| **`ralph`** | PRD generation and validation | Machine-readable schema, user story dependencies |
| **`ralph-loop`** | Deterministic test-driven build loop | Sequential story execution, quality gate checks, browser automation |
| **`unified-build-pipeline`** | End-to-end software delivery | Combines GSD planning + Ralph execution + CodeRabbit review |

---

## 🌐 Real-Time MCP Integrations

This ecosystem comes pre-configured with top-tier Model Context Protocol (MCP) integrations:

```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_CONTEXT7_API_KEY" }
    },
    "StitchMCP": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://stitch.googleapis.com/mcp", "--header", "X-Goog-Api-Key: YOUR_API_KEY"]
    },
    "chrome-devtools-mcp": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

---

## 🚦 Skill Loading Logic

When user requests arrive, the AI dynamically resolves intent into the optimal skill chain:

```
User Request
    �
    +-- ?? UI / Design / Mockup         --? designing-with-stitch + ui-ux-pro-max + brand-identity
    +-- ?? Library Docs / API Reference --? context7-mcp
    +-- ??? Error Tracking / APM / Sentry--? integrating-sentry + error-handling-patterns
    +-- ?? Security / Auth / Audit      --? owasp-security + code-review
    +-- ??? Backend / API / Database     --? building-backend + integrating-sentry
    +-- ?? Anti-Bloat / Minimal Code    --? ponytail
    +-- ?? Full-Stack Autonomous Build  --? unified-build-pipeline (GSD + Ralph + CodeRabbit)
    +-- ?? Multi-Agent Squad            --? antigravity-agents
    +-- ?? PRD / Sprint / Roadmap       --? project-management
    +-- ?? Launch / SEO / GTM           --? gtm-strategy + seo-optimizer
    +-- ??? Authoring a New Skill        --? creating-skills
```

---

## 🚀 One-Click Global Sync & Portability

The repository includes a portable installer to back up, sync, and deploy skills into any workspace on your machine.

### 1. Sync All Skills Globally
Stores and syncs all 42 skills and 6 plugins into your global agent stores (`~/.agent/` and `~/.gemini/global-skills/`):

```powershell
.\install-skills.ps1 store
```

### 2. Inject Skills into Any Project
Install the entire ecosystem into any target project folder with a single command:

```powershell
# Install into current project
.\install-skills.ps1 install

# Or specify a target directory
.\install-skills.ps1 install -TargetPath "C:\Projects\my-awesome-app"
```

Or on Windows:
```cmd
install-skills.bat
```

---

## 🤖 Using with OpenAI Codex CLI

This repository is built for native, zero-config compatibility with **OpenAI Codex CLI**:

1. **Global Access:** Once `install-skills.ps1 store` is run, Codex CLI automatically detects all skills from `~/.codex/skills/`.
2. **Project Instructions (`CODEX.md`):** Automatically guides Codex CLI to load domain skills on-demand.
3. **Headless Execution Example:**
   ```bash
   codex exec -s workspace-write --approve-for-me "Build a FastAPI authentication endpoint using owasp-security and integrating-sentry"
   ```
4. **Automated Code Review:**
   ```bash
   codex review
   ```

---

## 🛠️ Adding a New Skill

To add a new skill to this repository:

1. Read the specification guidelines in [`.agent/skills/creating-skills/SKILL.md`](.agent/skills/creating-skills/SKILL.md).
2. Create the folder: `.agent/skills/<skill-name>/`.
3. Create `SKILL.md` with standard YAML frontmatter (`name`, `description`).
4. Register the new skill in [`CLAUDE.md`](CLAUDE.md) and [`README.md`](README.md).
5. Run `.\install-skills.ps1 store` to push changes to your global registry.

---

## 📜 Principles & Guidelines

- **Simplicity First:** The fastest, most secure code is the code you never write. Standard library > third-party dependencies.
- **Context Hygiene:** Keep prompts lean by loading only what is needed.
- **Empirical Proof:** Never consider a task done without verified test runs, clean exit codes, or browser snapshots.
- **Continuous Observability:** Instrument Sentry and comprehensive error handling on day one.
