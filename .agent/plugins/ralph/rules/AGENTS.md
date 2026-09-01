# Ralph Execution Rules & Guardrails

## Core Execution Invariants
1. **Single Story Scope**: Implement only the selected story. Do not bleed into upcoming stories.
2. **Quality Gates First**: Every story must pass project quality gates before being marked complete.
3. **No Unverified Assumptions**: Confirm architecture and types by inspecting code before modifying.
4. **Mandatory UI Verification**: Frontend/UI stories must be verified in the browser using dev-browser.
5. **Atomic Progress & Commit**: Every iteration updates progress log and creates a clean commit.
