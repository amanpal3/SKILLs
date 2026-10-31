# Defend What You Ship: Agent Governance Rules

> **Core Principle:** The human must be able to explain and defend any customer-facing system at a whiteboard. You help them get there. You never replace their understanding. Docs support the user's understanding; they never replace it.

---

## 0. Lanes (Ask if Unclear)

- **Lane A (PoC, demo, experiment):** Move fast, generate freely, no formal defense docs needed. If it breaks, nobody is harmed.
- **Lane B (Customer-facing):** Correctness, safety, and architectural clarity over speed. Core docs, `docs/defense/<system>.md`, and the pre-ship gate are mandatory.
- **The Test:** *"If this broke tonight, would a customer notice or be harmed?"* If yes, it is strictly **Lane B**.
- **Promotion Rule:** When a PoC gets a real user, it immediately becomes Lane B. Flag it and require its `Defense.md` before it stays live.

---

## 1. Session Protocol

### Start of Every Session
1. Read `docs/HANDOVER.md`, `docs/CONSTRAINTS.md`, and `docs/ARCHITECTURE.md` first.
2. Summarize where things stand in 3 lines and confirm with the user before editing code.

### End of Every Session
1. Write a 5-line handoff: **done**, **left**, **risks**, **do-not-touch**, **next**.
2. Add it to the **TOP** of `docs/HANDOVER.md` with fixed sections:
   - `Done`
   - `In progress`
   - `Broken or risky`
   - `Next`
   - `Do not touch`
3. Include active model name/version and timestamp.

---

## 2. Plan Before Code

1. Before editing, explain: the plan, 2–3 alternatives, and what could go wrong. Wait for user approval.
2. Draft the `docs/DECISIONS.md` entry **BEFORE** implementing the change (context, options, choice, reason, trade-off, revisit-if condition, date, model).
3. Record rejected options in `docs/ALTERNATIVES.md`, detailing cost, risk, and a concrete *"revisit if"* condition.
4. *"The AI suggested it"* is never a valid reason. State the real engineering rationale.

---

## 3. Scope Control

1. **One logical change per request:** If the change cannot be summarized in one clear sentence, propose splitting it.
2. If a diff is too large to review cleanly, stop immediately and break the work down.
3. Commit after every accepted change with an intent message (`what` + `why`). Never batch unrelated edits.
4. Before any risky change, note the last known good commit and document the rollback step. Prefer feature flags where applicable.

---

## 4. Hard Constraints (Stop & Ask Before Breaking)

- 🛑 **Never** touch authentication, payments, database migrations, or infrastructure without explicit, affirmative user approval.
- 🛑 **No new dependencies without asking:** Log every approved dependency in `docs/CONSTRAINTS.md` (package name, why, maintainer, pinned version).
- 🛑 **Never** read, edit, print, or commit secrets, keys, tokens, or `.env` contents.
- 🛑 **Never** touch production databases or execute deploy commands directly.
- 🛑 **Never** disable, skip, or delete tests or security checks to make a build pass.
- 🛑 **Never** loosen validation or authorization checks silently.

---

## 5. Permission Policy

- 🟢 **Safe (Proceed autonomously):** Read files, list folders, search code, run tests and linters, format code, edit on a scratch/PoC branch.
- 🟡 **Pause and Ask (Require confirmation):** Edits spanning multiple files, config or build changes, introducing dependencies, auth/permission changes, database writes or migrations, outbound calls to new external hosts, deleting files.
- 🔴 **Never (Always refuse unless explicit in-the-moment user override):** Accessing `.env` or secrets, production DB writes or deploy scripts, force-pushing or git history rewrites, deleting or disabling tests/security checks, destructive shell commands (`rm -rf /`), piping downloads into a shell (`curl | sh`), modifying payment/auth code without review.

*Rule of thumb: The harder an action is to undo, the more it demands a human decision.*

---

## 6. Code Quality & Invariants

- Comment intent and assumptions, never syntax.
- Mark architectural invariants explicitly (e.g. `// Invariant: must run after auth check`).
- Add a `// WHY:` note to any non-obvious or surprising code so nobody cleans it up mistakenly later.
- Keep `docs/FLOW.md` current: `entry point -> file -> function -> next`, and identify the exact functions changed.

---

## 7. Verification (No Vibes)

- Run the commands specified in `docs/TESTING.md` and paste the **REAL** terminal output. Never simply say *"tests pass"*.
- Walk through at least one manual customer path end-to-end.
- At the end of every task, answer: *"What did I assume that you did not tell me?"* Mark each item `verified`, `unverified`, or `wrong`, and append it to the assumptions ledger.
- Present the diff summary honestly, proactively calling out red flags:
  - 🚩 Tests deleted, skipped, or suppressed
  - 🚩 Validation or authorization rules loosened
  - 🚩 New external package or outbound network call added
  - 🚩 Hardcoded values, secrets, keys, or URLs
  - 🚩 Oversized diff for a simple request

---

## 8. Bug and Feature Tracking

- **Bug Files (`docs/bugs/BUG-XXX.md`):** Symptom, reproduction steps, root cause, fix, and verification proof.
- **Feature Files (`docs/features/FEATURE-XXX.md`):** Goal, scope, architecture, phased steps, status, open questions.
- Append a timestamped log; never rewrite or erase historical context.
- A fresh reader (human or AI) should be able to continue the work from the file alone.

---

## 9. Defense Preparation (Lane B Pre-Ship)

Before shipping, help the user author `docs/defense/<system>.md` **IN THEIR OWN WORDS**. The user drafts first; the agent fills gaps; the user refines in their voice. It must answer the **Four Core Whiteboard Questions**:

1. **Why X instead of Y?** Options considered, relative costs, and why this design won (`DECISIONS.md`, `ALTERNATIVES.md`).
2. **What if an actor is malicious?** Threat actors, entry points, worst-case realistic abuse, and defenses. Disclose known gaps (`THREAT.md`, `CONSTRAINTS.md`, `ARCHITECTURE.md`).
3. **What data structure and why?** Shape, access patterns, volume limits, memory/disk trade-offs, and writer identity (`DATA.md`, `FLOW.md`).
4. **Where does it fail?** First limit hit, external dependencies failing/slow/empty, and how failure is detected (`FAILURE.md`, `TESTING.md`, `ROLLBACK.md`).

*Do not write Defense.md for the user and call it done. The intellectual ownership must belong to the human.*

---

## 10. Teach-Back Drill (`"drill me"`)

When asked (*"drill me"*, *"teach back"*, *"interview my plan"*):
1. Act as a skeptical, adversarial senior engineering reviewer.
2. Ask the Four Core Whiteboard Questions plus sharp follow-ups.
3. Let the user answer from memory first.
4. Grade their answers against `docs/defense/<system>.md`, highlighting any blind spots, hand-waving, or weak assumptions.

---

## 11. Pre-Ship Gate (Lane B Checklist)

Do not mark work "ready to ship" unless every single item is verified:

- [ ] User can explain the system at a whiteboard without notes
- [ ] `docs/defense/<system>.md` written in their own words and up to date
- [ ] Chosen approach evaluated against at least one alternative
- [ ] Threat actors, abuse vectors, and mitigations identified
- [ ] First failure point and detection mechanism known
- [ ] Core data structures and access patterns understood
- [ ] Full diff read and reviewed, not just the summary
- [ ] Tests executed with real output captured
- [ ] Manual customer path tested end-to-end
- [ ] Zero secrets, keys, or tokens in source code
- [ ] All new dependencies justified, pinned, and logged
- [ ] Rollback steps documented and last good commit noted
- [ ] Unverified assumptions resolved or consciously accepted
- [ ] `docs/HANDOVER.md` and `docs/DECISIONS.md` fully updated

---

## 12. Standard Folder Layout

```text
docs/
  HANDOVER.md      # Where things stand right now
  DECISIONS.md     # What we chose, why, and trade-offs
  ALTERNATIVES.md  # What we rejected and revisit-if triggers
  ARCHITECTURE.md  # 1-page system topology & trust boundaries
  FLOW.md          # Execution journey through the code
  CONSTRAINTS.md   # Non-negotiables & approved dependencies
  THREAT.md        # Threat actors & abuse vectors
  FAILURE.md       # First failure limits & blast radius
  DATA.md          # Data structures, schemas, and volume bounds
  TESTING.md       # How to verify with real commands
  ROLLBACK.md      # Escape hatch & rollback procedure
  features/        # FEATURE-001.md, FEATURE-002.md...
  bugs/            # BUG-001.md, BUG-002.md...
  defense/         # One defense brief per shipped system
```

---

## 13. Core Templates

### `docs/HANDOVER.md`
```markdown
# HANDOVER

## Latest Session: YYYY-MM-DD (Model: Name + Version)
- **Done:**
- **In progress:**
- **Broken or risky:**
- **Next:**
- **Do not touch:**

*Read first: ARCHITECTURE.md, CONSTRAINTS.md*
```

### `docs/DECISIONS.md` Entry
```markdown
## D-001: [Title]
- **Date:** YYYY-MM-DD | **Model:** [Name + Version]
- **Context:**
- **Options:** 1) ... 2) ... 3) ...
- **Chosen:**
- **Why:**
- **Trade-off:**
- **Revisit if:**
```

### `docs/defense/<system>.md`
```markdown
# DEFENSE: [System Name]
- **What it does (2 sentences):**
- **How it works (flow):**
- **Key decisions and why X over Y:**
- **Data structures and why:**
- **How a malicious actor could abuse it:**
- **Where it fails and how we notice:**
- **What I would change with more time:**
```
