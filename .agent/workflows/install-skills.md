---
description: Install all 15 AI skills into any project from the global skill store
---

# Install Skills Workflow

This workflow copies all stored skills from `~/.gemini/global-skills/` into a target project.

## Prerequisites
- Skills must first be stored globally using the `store` command (already done).
- Global store location: `C:\Users\amanp\.gemini\global-skills\`

## Steps

### Option A: Install into current project directory
// turbo
1. Run: `powershell -ExecutionPolicy Bypass -File "C:\Users\amanp\.gemini\global-skills\install-skills.ps1" install`

### Option B: Install into a specific project
1. Run: `powershell -ExecutionPolicy Bypass -File "C:\Users\amanp\.gemini\global-skills\install-skills.ps1" install -TargetPath "C:\path\to\your\project"`

### Option C: Update the global store (after adding new skills)
1. Navigate to the project with your latest skills
2. Run: `powershell -ExecutionPolicy Bypass -File ".\install-skills.ps1" store`

## What gets installed
- `.agent/skills/` — All 15 skill folders
- `CLAUDE.md` — Master AI instructions
- `AGENTS.md` — Agent loading rules

## Included Skills
| # | Skill | Domain |
|---|-------|--------|
| 1 | antigravity-agents | Multi-agent orchestration |
| 2 | brainstorming-ideas | Creative exploration |
| 3 | brand-identity | Design tokens & voice |
| 4 | code-review | Senior engineer review |
| 5 | creating-skills | Skill authoring |
| 6 | designing-with-stitch | UI design via Stitch |
| 7 | error-handling-patterns | Resilient error design |
| 8 | gtm-strategy | Launch plans & positioning |
| 9 | managing-firebase | Firebase integration |
| 10 | owasp-security | Secure coding |
| 11 | planning-strategy | Task planning |
| 12 | project-management | PRDs, tickets, sprints |
| 13 | seo-optimizer | Search optimization |
| 14 | ui-ux-pro-max | UX laws & design |
| 15 | using-remotion | Programmatic video |
