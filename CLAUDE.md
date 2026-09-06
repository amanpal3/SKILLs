# CLAUDE.md — Master Project Instructions

## Project Overview

This workspace is a modular **AI Skill System** — a collection of specialized instruction sets that extend AI capabilities for specific domains. Each skill lives in `.agent/skills/<skill-name>/SKILL.md` and is loaded on demand based on the task at hand.

---

## AI Behavior Rules

1. **Read SKILL.md before acting** — When a task matches a skill's domain, always read the relevant `SKILL.md` file using the `view_file` tool before doing any work.
2. **One skill at a time** — Load only the skills relevant to the current task. Do not preload all skills.
3. **Skills override defaults** — Skill instructions take priority over general AI behavior for that domain.
4. **Be modular** — Keep responses focused. If a task spans multiple skills, apply them in sequence, not simultaneously.
5. **Don't hallucinate skill content** — If a skill file exists, read it. Never assume what it says.
6. **Minimal output** — Be concise. Use bullet points, tables, and code blocks. Avoid verbose prose.
7. **Ask before creating new skills** — If no skill exists for a task, confirm with the user before creating one using the `creating-skills` skill.

---

## Skill Directory

All skills live in: `.agent/skills/`

| Skill                       | Folder                     | Load When...                                                                                         |
| --------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Brainstorming Ideas**     | `brainstorming-ideas/`     | User wants to explore ideas, features, or creative directions before building                        |
| **Brand Identity**          | `brand-identity/`          | Generating UI, writing copy, or applying design tokens consistently                                  |
| **Code Review**             | `code-review/`             | Reviewing, auditing, refactoring, or improving existing code                                         |
| **Creating Skills**         | `creating-skills/`         | User asks to build a new skill or add to the skill system                                            |
| **Designing with Stitch**   | `designing-with-stitch/`   | Designing websites or UI screens using Google Stitch / StitchMCP                                     |
| **Error Handling Patterns** | `error-handling-patterns/` | Implementing try/catch, Result types, or resilient error strategies                                  |
| **Managing Firebase**       | `managing-firebase/`       | Integrating, configuring, or deploying Firebase services                                             |
| **OWASP Security**          | `owasp-security/`          | Writing secure code, reviewing for vulnerabilities, or building auth systems                         |
| **Planning Strategy**       | `planning-strategy/`       | Breaking down a spec or multi-step task before writing any code                                      |
| **SEO Optimizer**           | `seo-optimizer/`           | Writing SEO content, meta tags, structured data, or auditing pages                                   |
| **UI/UX Pro Max**           | `ui-ux-pro-max/`           | Designing interfaces, user flows, micro-interactions, or improving usability                         |
| **Using Remotion**          | `using-remotion/`          | Creating programmatic video or animations using Remotion/React                                       |
| **Project Management**      | `project-management/`      | Writing PRDs, sprint docs, tickets, roadmaps, specs, or managing Jira/Notion/Slack workflows         |
| **GTM Strategy**            | `gtm-strategy/`            | Product launches, positioning docs, ICP research, outreach sequences, competitive intelligence       |
| **Antigravity Agents**      | `antigravity-agents/`      | Multi-agent orchestration for complex projects — squads of specialized AI agents working in parallel |
| **Ponytail**                | `ponytail/`                | Enforcing the simplest, minimal solution, YAGNI, cutting bloat/dependencies, or lazy mode            |
| **Context7 MCP**            | `context7-mcp/`            | Fetching up-to-date, version-specific library docs and code examples directly via Context7 MCP       |
| **Integrating Sentry**     | `integrating-sentry/`      | Configuring Sentry error tracking, distributed tracing, DSNs, and alerting across platforms          |
| **Using Codex CLI**         | `using-codex-cli/`         | Orchestrating Codex CLI for autonomous execution, reviews, and cross-agent workflows                 |

---

## Skill Loading Logic (Token-Optimized 8-Tier Dispatcher)

```
User Prompt
    │
    ├── ⚡ 1. Micro-Fix / Typo          ──► Direct inline fix (0 skill files read)
    ├── 🪓 2. Small task / Refactor     ──► ponytail + 1 domain specialist
    ├── 📚 3. Library Docs / Syntax     ──► context7-mcp (Prevents hallucination & web bloat)
    ├── 💡 4. Exploring New Feature     ──► brainstorming-ideas ──► planning-strategy
    ├── 🔄 5. Multi-File / Stateful     ──► gsd suite (Isolated context waves)
    ├── 📋 6. Structured User Stories   ──► ralph-prd ──► ralph-loop
    ├── 🚀 7. Full Mission-Critical     ──► unified-build-pipeline (GSD + Ralph + CodeRabbit)
    └── 👥 8. Explicit Squad Task       ──► antigravity-agents
```

---

## Constraints

- **No unverified assumptions** — If a requirement is unclear, ask one focused question before proceeding.
- **No over-engineering** — Match the solution complexity to the problem size.
- **No magic numbers or hardcoded secrets** — Always use constants and environment variables.
- **No skipping error handling** — Every external call must handle failures.
- **Always use Sentry** — Instrument Sentry for error tracking, exception capture, and observability across applications and services.
- **No shipping without a checklist** — Use the relevant skill's review/audit checklist before marking work as done.
- **Forward slashes in all paths** — Use `/` not `\` in all file references.

---

## Adding a New Skill

1. Use the `creating-skills` skill: read `.agent/skills/creating-skills/SKILL.md`
2. Create folder: `.agent/skills/<skill-name>/`
3. Create `SKILL.md` with proper YAML frontmatter (`name`, `description`)
4. Register it in the table above in this file

---

## Quick Reference

```
.agent/
└── skills/
    ├── brainstorming-ideas/   → Creative exploration
    ├── brand-identity/        → Design tokens & voice
    ├── code-review/           → Senior engineer review
    ├── creating-skills/       → Skill authoring
    ├── designing-with-stitch/ → UI design via Stitch
    ├── error-handling-patterns/ → Resilient error design
    ├── managing-firebase/     → Firebase integration
    ├── owasp-security/        → Secure coding
    ├── planning-strategy/     → Task planning
    ├── seo-optimizer/         → Search optimization
    ├── ui-ux-pro-max/         → UX laws & design
    ├── using-remotion/        → Programmatic video
    ├── project-management/    → PRDs, tickets, sprints, roadmaps
    ├── gtm-strategy/          → Launch plans, ICP, outreach, positioning
    ├── antigravity-agents/    → Multi-agent squads for complex projects
    ├── using-codex-cli/       → Codex CLI autonomous execution & workflows
    ├── context7-mcp/          → Real-time library docs & code examples
    ├── integrating-sentry/    → Sentry error tracking & APM
    └── ponytail/              → Minimal/lazy solution, YAGNI & anti-bloat
CLAUDE.md                      ← You are here
```
