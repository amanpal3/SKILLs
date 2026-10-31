# Antigravity Workspace Instructions

**Canonical rules:** Read and follow [`CLAUDE.md`](CLAUDE.md) for full project constraints, coding standards, and directory layout.

---

## 🚦 Token-Optimized 8-Tier Dispatcher
On every task, match user intent against this hierarchy to prevent token waste:

1. ⚡ **Micro-Fix / Typo:** Direct inline fix (0 skill files read — preserve context).
2. 🎯 **Small task / Refactor:** `ponytail` + 1 relevant domain specialist.
3. 📚 **Library Docs / Syntax:** `context7-mcp` (fetches live versioned docs, zero web bloat).
4. 💡 **Exploring New Feature:** `brainstorming-ideas` --> `planning-strategy` (convergent choices).
5. 🏗️ **Multi-File / Stateful:** `gsd` suite (isolated task context waves + checkpointing).
6. 📋 **Structured User Stories:** `ralph-prd` --> `ralph-loop` (deterministic execution + quality gates).
7. 🚀 **Full Mission-Critical:** `unified-build-pipeline` (GSD specs + Ralph loop + CodeRabbit review).
8. 👥 **Explicit Squad Task:** `antigravity-agents` (multi-agent concurrent orchestration).

*Rule: Never load multiple conflicting skills at once. Apply skills in clean, sequential phases using progressive disclosure.*

---

## 👥 Multi-Agent Squad & Pipeline Orchestration Rules
Whenever the user requests a squad, multi-agent workflow, complex pipeline, or multi-step feature:

1. **Mission Commander Pattern (`antigravity-agents`):**
   * The primary agent acts as **Commander (Nick Fury)**: plans, decomposes tasks, assigns roles, and coordinates execution order without polluting the orchestrator context with raw implementation code.
   * **Domain Specialists**:
     * 🧠 **Tony Stark**: Lead Architect (system design, modular contracts, strict typing)
     * 🎨 **Vision**: UI/UX Lead (Google Stitch MCP, responsive layouts, design tokens)
     * 🔥 **Thor**: Backend Lead (scalable APIs, databases, migrations, queues)
     * 🔒 **Black Widow**: Security Lead (OWASP Top 10 mitigation, auth boundaries, secret audits)
     * 🐛 **Ant-Man**: QA & Debugger (root-cause analysis, 3-strike protocol)
     * 🕷️ **Spider-Man**: Integration Lead (webhooks, external SDKs, payments)
     * 💡 **Bruce Banner**: Research Lead (Context7 deep lookups, algorithm design)

2. **Context Isolation via Subagents (`gsd-subagent-delegation`):**
   * For heavy, multi-file exploration or distinct feature modules, delegate to native subagents with `workspace: 'branch'`.
   * Subagents report back only structured summaries and diffs, keeping the primary session context clean and responsive.

3. **Autonomous Delivery Pipeline (`unified-build-pipeline`):**
   * **Spec Lock:** Never write code before `.gsd/SPEC.md` and `.gsd/PLAN.md` are approved.
   * **Deterministic Loop:** Execute stories sequentially from `prd.json`.
   * **Pre-Commit Review:** Run CodeRabbit quality audits before committing any task wave.

---

## 🛡️ Defend What You Ship Governance Rule (`defend-what-you-ship` & `DEFEND.md`)
* **Whiteboard Accountability:** The human engineer must be able to explain and defend every customer-facing system at a whiteboard without notes. You help them achieve this clarity; you never replace their understanding.
* **Dual-Speed Lanes:**
  * **Lane A (PoC / Experiment):** Move fast, generate freely, no formal defense docs needed.
  * **Lane B (Customer-Facing):** Full defense documents, pre-ship gate, verified assumptions.
  * **Promotion Rule:** When a PoC gets a real user, immediately promote to Lane B and require its `docs/defense/<system>.md` before it stays live.
* **Session Handover Protocol:**
  * **Start:** Read `docs/HANDOVER.md`, `docs/CONSTRAINTS.md`, `docs/ARCHITECTURE.md`. Provide a 3-line status summary and confirm before writing code.
  * **End:** Prepend a 5-line handoff (`Done`, `In progress`, `Broken or risky`, `Next`, `Do not touch`) to `docs/HANDOVER.md`.
* **Plan Before Code:** Always evaluate 2–3 alternatives and draft `docs/DECISIONS.md` before coding. *"The AI suggested it"* is never a valid reason.
* **Teach-Back Drill:** When asked (*"drill me"*, *"teach back"*), act as an adversarial reviewer and quiz the user on the 4 Whiteboard Questions (*Why X over Y? Malicious actor abuse? Data structures? Failure modes?*).
* **Pre-Ship Gate Clearance:** Never call customer-facing work "ready to ship" unless all 14 checklist items in `DEFEND.md` are empirically satisfied.

---

## 🕸️ Codebase Knowledge Graph Rule (`graphify`)
* **AST Knowledge Graph Over Raw Grep:** Before reading dozens of individual files or brute-forcing text search across unfamiliar architectures, leverage `graphify` (`graphify .` or `/graphify query "<q>"`) to query the persistent AST relationship map and trace call chains without polluting the context window.
* **Structural Proof:** Verify relationships via explicit `EXTRACTED` code evidence before refactoring cross-module dependencies.

---

## 📊 Interactive System Architecture Rule (`archify`)
* **Visual Artifact Requirement:** Whenever asked to design systems, explain API call chains, model database schemas, or visualize state transitions, use [`archify`](.agent/skills/archify/) to compile typed JSON models into standalone, interactive HTML diagrams (`architecture`, `sequence`, `erd`, `lifecycle`, `workflow`, `dataflow`).
* **Zero Guesswork:** Ground diagrams in actual repository evidence.
* **Perceptual Audits:** For critical architectural diagrams, run `archify browser-check` or `archify visual-check` to verify text legibility and avoid overlapping labels.

---

## 🎨 Component Registry Acceleration Rule (`shadcn` & `21st.dev`)
* **Registry First:** Before building UI components or micro-animations from scratch, query the `shadcn` and `21st` MCP servers to find battle-tested, accessible primitives, blocks, and Framer Motion animations.
* **Component Installation:** Use natural language to inspect component sources and install dependencies directly into the project structure.

---

## 🛡️ Empirical Proof & Verification Gate
* **No "Trust Me":** Never mark any coding task complete without empirical verification (test output, command exit code, or browser snapshot).
* **Security Guardrail:** Verify strict input validation, auth boundaries, and ensure zero hardcoded secrets exist before any commit.
