# CODEX.md — Codex CLI Project Instructions

## Project Overview
This workspace is an advanced **AI Skill System** — a collection of 43 specialized instruction sets that extend AI capabilities for specific domains. Each skill lives in `.agent/skills/<skill-name>/SKILL.md` and is loaded on demand.

---

## Skill Loading Logic (Token-Optimized 8-Tier Dispatcher)

When executing tasks with Codex CLI, match user intent directly against the 8-tier hierarchy:

```
User Prompt
    ¦
    +-- ? 1. Micro-Fix / Typo          --? Direct inline fix (0 skill files read)
    +-- ?? 2. Small task / Refactor     --? ponytail + 1 domain specialist
    +-- ?? 3. Library Docs / Syntax     --? context7-mcp (Prevents hallucination & web bloat)
    +-- ?? 4. Exploring New Feature     --? brainstorming-ideas --? planning-strategy
    +-- ?? 5. Multi-File / Stateful     --? gsd suite (Isolated context waves)
    +-- ?? 6. Structured User Stories   --? ralph-prd --? ralph-loop
    +-- ?? 7. Full Mission-Critical     --? unified-build-pipeline (GSD + Ralph + CodeRabbit)
    +-- ?? 8. Explicit Squad Task       --? antigravity-agents
```

---

## Domain Specialist Mappings
When Tier 2 (Small task / Refactor) is matched, load `ponytail` alongside the single relevant specialist:
- ?? **UI / Frontend / Styling:** `ui-ux-pro-max` + `designing-with-stitch`
- ??? **Backend / APIs / Database:** `building-backend` + `integrating-sentry`
- ??? **Security & Auth Boundaries:** `owasp-security`
- ?? **Testing & Quality Assurance:** `testing-code`
- ?? **PRDs & Planning:** `project-management`
- ?? **Browser Automation:** `dev-browser`

---

## Canonical Rules & Constraints
- **Micro-Fix Bypass:** For obvious 1-line syntax/typo fixes, do not read any skill files. Keep tokens minimal.
- **Zero Hallucinations:** Use Context7 (`context7-mcp`) for up-to-date documentation on third-party libraries and APIs.
- **Always Include Sentry:** Every backend, frontend, or background worker must include Sentry exception handling.
- **YAGNI First:** Favor standard library and native platform capabilities before adding external packages.
