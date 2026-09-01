# Ralph Loop Plugin Rules

- **Deterministic Execution:** Implement one story at a time from `prd.json` strictly in dependency order.
- **Quality Gates:** Every story must pass all defined `qualityGates` (build, lint, tests) before completion.
- **Browser Validation:** Verify all UI stories using real browser automation before marking as passed.
- **State Logging:** Append progress to `.ralph/progress.md` and log recurring errors in `.ralph/guardrails.md`.
