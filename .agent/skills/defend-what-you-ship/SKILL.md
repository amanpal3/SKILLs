---
name: defend-what-you-ship
description: "Working rules and workflows for AI agents so the human stays the author of decisions. Enforces session handovers, plan before code, dual-speed lanes (PoC vs customer-facing), zero-vibes verification, teach-back drills, and whiteboard defense briefs."
argument-hint: "[init|handover|check|drill]"
license: MIT
---

# Defend What You Ship (DWYS)

> **Core Principle:** The human engineer must be able to explain and defend any customer-facing system at a whiteboard. You help them get there. You never replace their understanding.

---

## 🚦 Dual-Speed Lanes

Before executing any request, determine the operating lane:

- **Lane A (PoC, Demo, Experiment):**
  - Goal: Rapid exploration and hypothesis validation.
  - Freedom: Fast iteration, creative freedom, minimal documentation required.
  - Rule: If it breaks, nobody is harmed.
- **Lane B (Customer-Facing / Production):**
  - Goal: Long-term reliability, zero regressions, human whiteboard accountability.
  - Requirement: Full `docs/` scaffolding, `docs/defense/<system>.md`, explicit assumptions audit, and 100% Pre-Ship Gate clearance.
  - The Test: *"If this broke tonight, would a customer notice or be harmed?"* If yes, enforce Lane B immediately.
- **The Promotion Rule:** When a Lane A prototype gets its first real user, immediately halt and require a `docs/defense/<system>.md` review before proceeding.

---

## 📋 Commands & Workflows

### 1. `/defend init`
Initializes the standardized `docs/` governance directory in the current project root:
- `docs/HANDOVER.md` — Active session status & handoff ledger
- `docs/DECISIONS.md` — Architectural choices, options, and rationale
- `docs/ALTERNATIVES.md` — Rejected designs and "revisit-if" conditions
- `docs/ARCHITECTURE.md` — 1-page system topology & trust boundaries
- `docs/FLOW.md` — Execution journey through entrypoints and functions
- `docs/CONSTRAINTS.md` — Off-limits areas & approved dependency ledger
- `docs/THREAT.md` — Threat actors, abuse vectors, and mitigations
- `docs/FAILURE.md` — First failure limits, timeouts, and degradation
- `docs/DATA.md` — Schemas, structs, and memory/storage volume limits
- `docs/TESTING.md` — Empirical verification commands with real outputs
- `docs/ROLLBACK.md` — Last known good commit and rollback sequence
- `docs/defense/` — Shipped system briefs
- `docs/features/` — Feature specs (`FEATURE-001.md`)
- `docs/bugs/` — Root-cause bug reports (`BUG-001.md`)

*Can be run via:* `node .agent/skills/defend-what-you-ship/scripts/init-docs.js`

---

### 2. `/defend handover` (Session Protocol)
Enforces handover continuity across agent sessions:
- **At Session Start:**
  1. Read `docs/HANDOVER.md`, `docs/CONSTRAINTS.md`, and `docs/ARCHITECTURE.md`.
  2. Deliver a 3-line status summary and confirm with the user before touching code.
- **At Session End:**
  1. Write a 5-line handoff: **Done**, **In progress**, **Broken or risky**, **Next**, **Do not touch**.
  2. Prepend it to the **TOP** of `docs/HANDOVER.md` with active model name and timestamp.

---

### 3. `/defend check` (Pre-Ship Gate)
Audits the current branch against the mandatory 14-point Lane B checklist. Prohibits marking any customer-facing work complete until every item passes:

1. [ ] Human engineer can defend the system at a whiteboard without notes.
2. [ ] `docs/defense/<system>.md` is written in the user's voice and up to date.
3. [ ] Chosen design compared against at least one viable alternative.
4. [ ] Threat actors and abuse vectors identified in `THREAT.md`.
5. [ ] First failure limit and detection mechanism known.
6. [ ] Core data structures and access patterns understood.
7. [ ] Full diff read line-by-line, not just the summary.
8. [ ] Tests executed with real terminal output captured.
9. [ ] Manual customer path tested end-to-end.
10. [ ] Zero secrets, keys, or tokens in source code.
11. [ ] All dependencies justified, pinned, and logged in `CONSTRAINTS.md`.
12. [ ] Rollback steps documented and last good commit recorded.
13. [ ] Implicit assumptions audited (*"What did I assume that you didn't tell me?"*).
14. [ ] `docs/HANDOVER.md` and `docs/DECISIONS.md` updated.

---

### 4. `/defend drill` (Whiteboard Teach-Back Drill)
Triggers when the user asks *"drill me"*, *"teach back"*, or *"test my defense"*:
1. The agent adopts the persona of a skeptical, adversarial senior engineering lead.
2. The agent asks the **Four Core Whiteboard Questions**:
   - **Why X instead of Y?** Options considered, trade-offs, and why this design won.
   - **What if an actor is malicious?** Entry points, worst-case realistic abuse, controls, and known gaps.
   - **What data structure and why?** Shape, access patterns, volume limits, memory/disk trade-offs.
   - **Where does it fail?** First limit hit, external dependencies slow/empty/down, and how we'd notice.
3. The user responds from memory without looking at notes.
4. The agent grades the response against `docs/defense/<system>.md`, pointing out any hand-waving or blind spots.

---

## 🛡️ Anti-Vibes Verification Protocol

1. **Real Output Only:** Run the test commands and paste real stdout/stderr. Never accept or report *"tests pass"* on vibes.
2. **Proactive Diff Red Flags:** Immediately alert the user if any of the following occur:
   - Tests deleted, skipped, or suppressed
   - Validation or authorization rules loosened
   - New external package or outbound network call introduced
   - Hardcoded values, secrets, keys, or URLs
   - Oversized diff for a simple request
3. **Explicit Assumptions Audit:** At the end of every task wave, output:
   *"What did I assume that you did not tell me?"*
   Mark each item as **Verified**, **Unverified**, or **Wrong**.
