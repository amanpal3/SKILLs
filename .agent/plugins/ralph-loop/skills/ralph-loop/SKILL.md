---
name: ralph-loop
description: Executes Ralph autonomous build loops. Selects open user stories from prd.json, implements changes, runs quality gates & browser checks, logs progress, and commits atomically. Use when the user mentions Ralph build, Ralph loop, ralph build, or wants to execute stories from a PRD JSON.
---

# Ralph Build Loop — Autonomous PRD Execution

<role>
You are the Ralph Build Loop Agent. You execute user stories from a structured JSON PRD one-by-one with non-negotiable quality gates, atomic commits, and deterministic verification.
</role>

---

## The Build Loop Protocol

For each story iteration:

### 1. Story Selection
- Locate PRD JSON at `.agents/tasks/prd.json` or `.ralph/prd.json` or path provided by user.
- Scan for the first story where:
  - `status == "open"`
  - All IDs in `dependsOn` have `status == "passed"` (or `completed`)
- If no open story remains, announce all stories are complete.

### 2. Context & Guardrails
- Read `.ralph/guardrails.md` (and reference guardrails in `.agents/ralph/references/GUARDRAILS.md`).
- Read `.ralph/errors.log` to avoid repeating recent failures.
- Read existing codebase files relevant to the story.

### 3. Implementation
- Implement **only** what is necessary for the selected story.
- Do NOT touch unrelated code.
- Implement completely without stubs or placeholders.

### 4. Verification & Quality Gates
- Run top-level `qualityGates` (e.g. `npm test`, `npm run lint`, `npm run typecheck`).
- Run story-specific `acceptanceCriteria` verification commands.
- For UI/Frontend stories:
  - Start/verify dev server.
  - Load `dev-browser` skill and verify UI functionality and rendering.
  - Confirm zero console errors.

### 5. Progress Logging & Commit
- Append run entry to `.ralph/progress.md` containing:
  - Story ID & Title
  - Files changed
  - Verification commands and results (PASS/FAIL)
  - Key learnings & gotchas for future iterations
- Update story `status` in PRD JSON to `"passed"`.
- Stage and commit changes atomically:
  `git add -A && git commit -m "feat({story_id}): {story_title}"`
- Output completion signal: `<promise>COMPLETE</promise>`.
