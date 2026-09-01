# GSD Plugin Rules

- **Planning Lock:** Never write implementation code until `.gsd/SPEC.md` and `.gsd/PLAN.md` are approved.
- **Wave Execution:** Execute tasks in dependency-ordered waves. Commit atomically after each completed wave.
- **Empirical Proof:** Never mark a task complete without empirical verification (test output, command exit code, or browser snapshot).
- **Context Hygiene:** Monitor token budget and trigger state dumps (`.gsd/STATE.md`) before token usage degrades response quality.
