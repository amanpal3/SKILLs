# 🧠 AI Skills & Agent Ecosystem

> **A modular, production-grade AI Skill System and multi-agent orchestration framework for autonomous coding assistants.**

[![Skills](https://img.shields.io/badge/Skills-40+-blue.svg?style=flat-square)](#-skill-catalog)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20%26%20On--Demand-emerald.svg?style=flat-square)](#-loading-logic--decision-tree)
[![Methodology](https://img.shields.io/badge/Methodology-GSD%20%7C%20Ralph%20%7C%20Ponytail-purple.svg?style=flat-square)](#-autonomous-pipelines--execution)
[![Security](https://img.shields.io/badge/Security-OWASP%20Hardened-red.svg?style=flat-square)](#-security-testing--quality)

---

## 📖 Overview

This repository is a centralized **AI Skill & Plugin Store** designed for modern AI coding environments (such as **Google Antigravity**, **Claude Code**, **Cursor**, **Windsurf**, and **Roo/Cline**). 

Instead of cluttering the AI's context window with massive monolithic prompt files, this ecosystem implements an **on-demand skill loading architecture**: specialized instruction sets, guardrails, and workflows are dynamically loaded only when relevant to the task at hand.

---

## ✨ Key Capabilities

- 🎯 **Domain-Specific Mastery:** 40+ specialized skills covering backend architecture, UI/UX systems, OWASP security, testing, SEO, video generation, and go-to-market strategy.
- ⚡ **Zero-Bloat Context:** Skills are isolated and loaded on-demand, preserving maximum context window for your actual code.
- 🪓 **Ponytail Anti-Bloat Philosophy:** Built-in "Lazy Senior Dev" principles that prioritize YAGNI, standard library over dependencies, and minimal working diffs.
- 🔄 **Autonomous Build Pipelines:** Integrated **GSD (Get Shit Done)**, **Ralph Loop** deterministic execution, and **CodeRabbit** AI quality gates.
- 📦 **One-Click Portability:** PowerShell and Batch installers to sync skills into your global skill store or deploy them directly into any target project.

---

## 🗂️ Repository Structure

```
skill/
├── .agent/
│   ├── skills/                  # Core domain skills (SKILL.md in each folder)
│   │   ├── antigravity-agents/  # Multi-agent squad orchestration
│   │   ├── building-backend/    # Production APIs, databases, microservices
│   │   ├── code-review/         # Senior code review & security auditing
│   │   ├── designing-with-stitch/# Google Stitch UI generation & UX laws
│   │   ├── gsd/                 # Get Shit Done master methodology
│   │   ├── owasp-security/      # Vulnerability defense & auth boundaries
│   │   ├── ponytail/            # Minimal solution & anti-overengineering
│   │   ├── ralph-loop/          # Deterministic user story build loop
│   │   ├── ui-ux-pro-max/       # Advanced design system & UX psychology
│   │   └── ...                  # (40+ domain skills)
│   ├── plugins/                 # Namespaced plugin packages (GSD, Ralph, etc.)
│   └── workflows/               # Markdown workflow playbooks
├── AGENTS.md                    # Universal agent behavioral instructions
├── CLAUDE.md                    # Master project instructions & skill directory
├── PONYTAIL.md                  # The Lazy Senior Dev ladder & principles
├── backend.md                   # Production backend architecture guidelines
├── install-skills.ps1           # Portable PowerShell installer & synchronizer
└── install-skills.bat           # Windows batch wrapper for easy installation
```

---

## 🧭 Skill Catalog

### 🏗️ Backend & Architecture
| Skill | Path | Description |
| :--- | :--- | :--- |
| **`building-backend`** | `.agent/skills/building-backend/` | Architect & optimize REST/GraphQL/gRPC APIs, database schemas, Redis caching, and microservices. |
| **`managing-firebase`** | `.agent/skills/managing-firebase/` | Firebase MCP integration, Firestore schemas, Cloud Functions, and security rules. |
| **`error-handling-patterns`** | `.agent/skills/error-handling-patterns/` | Resilient error design, Result types, structured logging, and graceful degradation. |

### 🎨 Frontend & Design Systems
| Skill | Path | Description |
| :--- | :--- | :--- |
| **`ui-ux-pro-max`** | `.agent/skills/ui-ux-pro-max/` | Senior UI/UX design tokens, UX laws, conversion optimization, and responsive layouts. |
| **`designing-with-stitch`** | `.agent/skills/designing-with-stitch/` | Rapid interface generation and visual design workflows via Google Stitch MCP. |
| **`brand-identity`** | `.agent/skills/brand-identity/` | Single source of truth for design tokens, typography, color palettes, and tone of voice. |
| **`using-remotion`** | `.agent/skills/using-remotion/` | Programmatic video creation and motion graphics using React and Remotion. |

### 🛡️ Security, Testing & Quality
| Skill | Path | Description |
| :--- | :--- | :--- |
| **`owasp-security`** | `.agent/skills/owasp-security/` | OWASP Top 10 mitigation, auth boundaries, input validation, and defense-in-depth. |
| **`code-review`** | `.agent/skills/code-review/` | Senior engineer code review: security, performance, correctness, and clean diffs. |
| **`testing-code`** | `.agent/skills/testing-code/` | Comprehensive test suites across Unit, Integration, and E2E (Vitest, Jest, Playwright). |
| **`dev-browser`** | `.agent/skills/dev-browser/` | Persistent browser automation, UI testing, form interaction, and web scraping. |

### 🪓 Simplicity & Anti-Bloat (Ponytail)
| Skill | Path | Description |
| :--- | :--- | :--- |
| **`ponytail`** | `.agent/skills/ponytail/` | Enforces the shortest working solution (YAGNI, stdlib first, zero dead boilerplate). |
| **`ponytail-audit`** | `.agent/skills/ponytail-audit/` | Full-codebase scanner to identify over-engineering and bloated dependencies. |
| **`ponytail-review`** | `.agent/skills/ponytail-review/` | Laser-focused PR review hunting unnecessary complexity and speculative wrappers. |
| **`ponytail-debt`** | `.agent/skills/ponytail-debt/` | Harvests and tracks intentional shortcuts marked with `// ponytail:` comments. |

### 🔄 Autonomous Pipelines & Execution
| Skill | Path | Description |
| :--- | :--- | :--- |
| **`antigravity-agents`** | `.agent/skills/antigravity-agents/` | Orchestrates multi-agent squads working concurrently across specialized roles. |
| **`gsd` (Suite)** | `.agent/skills/gsd/` | Spec-driven development, planning locks, wave execution, and empirical verification. |
| **`ralph-loop`** | `.agent/skills/ralph-loop/` | Autonomous story loop implementing `prd.json` with quality gates and browser verification. |
| **`unified-build-pipeline`**| `.agent/skills/unified-build-pipeline/` | End-to-end synergy: GSD (specs) + Ralph Loop (execution) + CodeRabbit (reviews). |

### 📈 Product, Strategy & Growth
| Skill | Path | Description |
| :--- | :--- | :--- |
| **`project-management`** | `.agent/skills/project-management/` | Writes PRDs, sprint plans, user stories, roadmaps, and Jira/Linear task tickets. |
| **`gtm-strategy`** | `.agent/skills/gtm-strategy/` | Go-to-market launch plans, ICP profiles, positioning docs, and outreach sequences. |
| **`seo-optimizer`** | `.agent/skills/seo-optimizer/` | Technical SEO, JSON-LD schema markup, keyword strategy, and Core Web Vitals audit. |
| **`brainstorming-ideas`** | `.agent/skills/brainstorming-ideas/` | Creative exploration of features, user requirements, and architecture options. |

---

## 🚀 Installation & Portability

The repository includes a portable installer script to easily store and deploy skills across any project.

### 1. Store Skills Globally
Save all current skills, plugins, and configuration files to the central global store (`~/.gemini/global-skills`):

```powershell
# In PowerShell:
.\install-skills.ps1 store
```

### 2. Install Skills into Any Project
Inject the complete skill system directly into another repository or directory:

```powershell
# Install into the current directory
.\install-skills.ps1 install

# Or specify a target project path
.\install-skills.ps1 install -TargetPath "C:\Projects\my-new-app"
```

Or run via the batch script:
```cmd
install-skills.bat
```

---

## 🚦 Loading Logic & Decision Tree

When a prompt or task is received, the AI matches user intent against the skill index:

```
User Prompt
    │
    ├── 🎨 UI / Design / Styling       ──► ui-ux-pro-max + designing-with-stitch + brand-identity
    ├── 🛡️ Security / Auth / Audit      ──► owasp-security + code-review
    ├── 🏗️ API / Database / Microservice──► building-backend + error-handling-patterns
    ├── 🪓 Anti-Bloat / Minimal Code    ──► ponytail
    ├── 🔄 Autonomous Multi-Step Sprint ──► unified-build-pipeline / gsd / ralph-loop
    ├── 👥 Multi-Agent Squad           ──► antigravity-agents
    ├── 📋 PRD / Sprint / Roadmap       ──► project-management
    ├── 📈 Launch / GTM / SEO           ──► gtm-strategy + seo-optimizer
    └── 🛠️ New Skill Creation          ──► creating-skills
```

---

## 🛠️ Adding a New Skill

To add a new skill to the collection:

1. Refer to `.agent/skills/creating-skills/SKILL.md`.
2. Create a dedicated folder: `.agent/skills/<skill-name>/`.
3. Create a `SKILL.md` containing YAML frontmatter (`name`, `description`) and comprehensive instructions.
4. Register the new skill in `CLAUDE.md` and update `README.md`.
5. Run `.\install-skills.ps1 store` to update the global registry.

---

## 📜 Philosophy & Guidelines

- **Simplicity First:** The best line of code is the one you never had to write.
- **Empirical Validation:** Never consider a task done without automated test runs or browser verification.
- **Security by Default:** No secrets in code, full input validation, and strict auth boundaries.
- **Modularity:** Keep skills isolated, focused, and independently maintainable.
