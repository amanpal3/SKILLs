# Universal Agent Instructions

**Canonical rules:** Read and follow [`CLAUDE.md`](CLAUDE.md) for full project constraints and directory layout.

## Token-Optimized 8-Tier Dispatcher
On every task, match user intent against this hierarchy to prevent token waste:

1. **? Micro-Fix / Typo:** Direct inline fix (0 skill files read — preserve context).
2. **?? Small task / Refactor:** `ponytail` + 1 relevant domain specialist.
3. **?? Library Docs / Syntax:** `context7-mcp` (fetches live versioned docs, zero web bloat).
4. **?? Exploring New Feature:** `brainstorming-ideas` --? `planning-strategy` (convergent choices).
5. **?? Multi-File / Stateful:** `gsd` suite (isolated task context waves + checkpointing).
6. **?? Structured User Stories:** `ralph-prd` --? `ralph-loop` (deterministic execution + quality gates).
7. **?? Full Mission-Critical:** `unified-build-pipeline` (GSD specs + Ralph loop + CodeRabbit review).
8. **?? Explicit Squad Task:** `antigravity-agents` (multi-agent concurrent orchestration).

Never load multiple conflicting skills at once. Apply skills in clean, sequential phases.
