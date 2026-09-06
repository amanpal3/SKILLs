---
name: using-codex-cli
description: Orchestrates, runs, and integrates OpenAI's Codex CLI for autonomous coding, non-interactive execution, code reviews, and multi-agent workflows. Use when invoking Codex CLI (`codex exec`, `codex review`), configuring Codex sandboxes and models, sharing skills between Antigravity and Codex, or bridging tools.
---

# Using Codex CLI

Orchestrates, runs, and integrates OpenAI's **Codex CLI** (`codex`) alongside modern AI coding agents like Antigravity, Claude Code, and Cursor.

## When to Use This Skill

Activate this skill when:
- Executing autonomous or non-interactive code generation via `codex exec`
- Running autonomous code reviews using `codex review`
- Configuring Codex sandbox modes, approval policies, and models
- Setting up shared skill directories across Antigravity (`.agent`) and Codex (`.codex`)
- Delegating sub-tasks or background verification passes to Codex CLI

---

## Skill Architecture & Cross-Tool Compatibility

Codex CLI and Antigravity share a compatible `SKILL.md` specification format:

### Discovery Paths
Codex CLI automatically scans and loads skills from:
1. **User Global Skills**: `~/.codex/skills/<skill-name>/SKILL.md`
2. **Project Local Skills**: `.codex/skills/`, `.agents/skills/`, or `.agent/skills/`
3. **Canonical Instructions**: `CODEX.md` and `AGENTS.md` in the project root

### Instruction Hierarchy
In any project repository:
- `CODEX.md` / `AGENTS.md`: Instructs Codex CLI on project architecture, skill loading rules, and constraints.
- `.agent/skills/<skill-name>/SKILL.md`: The actionable domain instructions loaded on-demand by Codex CLI.

---

## Codex CLI Execution Recipes

### 1. Non-Interactive Autonomous Execution (`codex exec`)
Run a prompt headlessly with controlled workspace write access:
```bash
# Execute a task in the current workspace
codex exec -s workspace-write --approve-for-me "Implement user authentication in auth.ts following the owasp-security skill"
```

Options:
- `-s, --sandbox <MODE>`: `read-only`, `workspace-write`, `danger-full-access`
- `--approve-for-me`: Automatically reviews and approves safe tool operations
- `-m, --model <MODEL>`: Specify model (e.g., `gpt-5.6-terra`, `o3`, or local OSS)
- `--search`: Enables live web search without per-call confirmation prompts

### 2. Autonomous Code Review (`codex review`)
Run an automated review of uncommitted changes or branches:
```bash
codex review
```

### 3. Applying Diffs (`codex apply`)
If a task was planned or produced by Codex in a separate session, apply its git patch:
```bash
codex apply
```

### 4. Background Delegation from Antigravity / Orchestrators
To delegate a specialized sub-task to Codex CLI from Antigravity:
```powershell
# Run Codex non-interactively in background
codex exec -C "C:\path\to\repo" -s workspace-write --approve-for-me "Run unit tests and fix failing assertions"
```

---

## Setting Up Codex CLI in Any Project

When initializing or working in a repository with Codex CLI:

### 1. Add `CODEX.md` to Project Root
Create a `CODEX.md` linking Codex to the `.agent/skills` folder:
```markdown
# CODEX.md — Instructions for Codex CLI

## Project Overview
This project uses a modular skill architecture located in `.agent/skills/`.

## Skill Loading Rules
- Always check `.agent/skills/<skill-name>/SKILL.md` before starting work in that domain.
- When working on APIs or database schemas, load `building-backend` and `integrating-sentry`.
- When designing UI or screens, load `ui-ux-pro-max` and `designing-with-stitch`.
- When reviewing or refactoring code, load `ponytail` and `code-review`.
- Always handle errors gracefully with Sentry instrumentation.
```

### 2. Sync Global Skills
Ensure all 43 skills are synced to `~/.codex/skills/`:
```powershell
.\install-skills.ps1 store
```

---

## Troubleshooting & Verification

- Check Codex installation: `codex --version`
- Run diagnostic health check: `codex doctor`
- List configured MCP servers: `codex mcp list`
- List installed plugins: `codex plugin list`
