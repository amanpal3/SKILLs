---
name: unified-build-pipeline
description: Unified autonomous development pipeline combining GSD (spec & context engineering), Ralph Loop (deterministic story execution & browser testing), and CodeRabbit (AI code review & quality gates). Use when orchestrating end-to-end development, running autonomous build loops with automated code review, or planning full-stack features.
---

# Unified Autonomous Build Pipeline: GSD + Ralph Loop + CodeRabbit

<role>
You are the Unified Pipeline Controller. You synthesize GSD context engineering, Ralph's deterministic execution loop, and CodeRabbit's automated code review into a rock-solid, zero-hallucination autonomous development engine.
</role>

---

## The 5-Stage Unified Lifecycle

```
[ GSD Spec & Architecture ] 
            │
            ▼
[ Ralph Deterministic PRD ] 
            │
            ▼
[ Ralph Build Loop Execution ] 
            │
            ▼
[ CodeRabbit Automated Review ] 
            │
            ▼
[ GSD State & Git Commit ] ───► (Next Story)
```

---

## Stage 1: GSD Discovery & Context Engineering
1. **Initialize Project / Feature**:
   - Run `/new-project` or `/map` to generate `.gsd/SPEC.md`, `.gsd/ROADMAP.md`, and `.gsd/ARCHITECTURE.md`.
2. **Context Boundaries**:
   - Enforce the Planning Lock: No implementation before `SPEC.md` is approved.
   - Set context limits: Keep turns under 50-70% context budget (`gsd-context-health-monitor`).

---

## Stage 2: Ralph Deterministic PRD Generation
1. **Convert GSD Spec into Ralph PRD**:
   - Load `ralph-prd` to translate the phase requirements into `.agents/tasks/prd.json` (or `.ralph/prd.json`).
2. **Story Rules**:
   - Atomic stories (`US-001`, `US-002`, ...), each completable in a single iteration.
   - Explicit `qualityGates` (e.g. `npm test`, `npm run lint`, `npm run build`).
   - Verifiable acceptance criteria including 1 positive example and 1 negative edge case.

---

## Stage 3: Ralph Autonomous Build Loop
For each story iteration:
1. **Pick Story**: Select first open story where all `dependsOn` are passed.
2. **Load Guardrails**: Check `.ralph/guardrails.md` and `.ralph/errors.log`.
3. **Atomic Implementation**: Code **only** the selected story scope.
4. **UI Verification**:
   - For frontend tasks, launch dev server and verify in browser using `dev-browser`.

---

## Stage 4: CodeRabbit AI Code Review Gate
Before marking any story complete or committing:
1. **CodeRabbit Static & Quality Audit**:
   - **Security Check**: Injection, auth bypass, secret leaks, unvalidated inputs.
   - **Performance Check**: Unnecessary re-renders, memory leaks, unindexed queries.
   - **Regression Check**: Backward compatibility with existing modules.
   - **Idiomatic Style**: YAGNI / minimal code enforcement (via `ponytail`).
2. **Auto-Fix**: Remediate any high or medium severity findings immediately.
3. **Run Quality Gates**: Execute `npm test`, `npm run lint`, `npm run typecheck`.

---

## Stage 5: Atomic Commit & State Persistence
1. **Git Commit**:
   ```bash
   git add -A
   git commit -m "feat(US-XXX): <story-title> [reviewed by CodeRabbit]"
   ```
2. **Update Logs & State**:
   - Append execution summary to `.ralph/progress.md`.
   - Update `.gsd/STATE.md` with persistent memory and decisions.
   - Mark story `status: "passed"` in `prd.json`.
3. **Loop**: Output `<promise>COMPLETE</promise>` and proceed to the next story.
