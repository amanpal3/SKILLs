#!/usr/bin/env node
/**
 * init-docs.js
 * Scaffolds the standard 'docs/' governance directory for the Defend What You Ship methodology.
 * Safe and idempotent: does not overwrite existing documentation files.
 */

const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const docsDir = path.join(targetDir, 'docs');

const templates = {
  'HANDOVER.md': `# HANDOVER

## Latest Session: ${new Date().toISOString().slice(0, 10)} (Initial Setup)
- **Done:** Initialized Defend What You Ship documentation framework
- **In progress:** None
- **Broken or risky:** None
- **Next:** Define ARCHITECTURE.md and CONSTRAINTS.md
- **Do not touch:** Production configuration

*Read first: ARCHITECTURE.md, CONSTRAINTS.md*
`,

  'DECISIONS.md': `# Architecture Decision Records (ADRs)

## D-000: Adoption of Defend What You Ship
- **Date:** ${new Date().toISOString().slice(0, 10)} | **Model:** N/A
- **Context:** Ensuring engineering decisions remain explainable and defendable at a whiteboard.
- **Options:** 1) Ad-hoc AI generation, 2) Rigid heavyweight process, 3) Defend What You Ship dual-speed lanes.
- **Chosen:** Defend What You Ship.
- **Why:** Maximizes development velocity for PoCs (Lane A) while guaranteeing correctness, defense, and human understanding for customer-facing systems (Lane B).
- **Trade-off:** Requires drafting decisions and defense briefs before shipping to production.
- **Revisit if:** Project remains strictly disposable research.
`,

  'ALTERNATIVES.md': `# Rejected Alternatives & Revisit Triggers

## A-000: Unconstrained Autopilot Generation
- **Rejected Option:** Allowing AI agents to write code without drafting DECISIONS.md or Defense briefs.
- **Cost & Risk:** Sludge accumulation, loss of architectural ownership, inability to debug 3 AM production outages.
- **Revisit If:** Never for customer-facing systems (Lane B).
`,

  'ARCHITECTURE.md': `# System Architecture & Trust Boundaries

> **One-Page Rule:** A high-level topology map of components, interfaces, and trust boundaries.

## Components
- **Client / Ingress:**
- **Core Services:**
- **Data Stores:**

## Trust Boundaries
- Untrusted vs. Trusted zones:
- Invariant: All user input must be validated before reaching core business logic.
`,

  'FLOW.md': `# Execution Flow & Call Chains

## Primary User Journey
\`\`\`text
Entry Point -> Router -> Middleware -> Controller / Service -> Data Store -> Response
\`\`\`

## Active Traces
- *Document active function chains here during feature implementation.*
`,

  'CONSTRAINTS.md': `# Hard Constraints & Dependency Ledger

## Off-Limits Areas
- Never touch authentication, payments, or infrastructure without explicit human approval.
- Zero hardcoded secrets, keys, or .env contents in code.
- Never delete, skip, or disable tests or linter checks.

## Approved Dependencies
| Package | Version | Purpose | Approved By | Date |
| :--- | :--- | :--- | :--- | :--- |
`,

  'THREAT.md': `# Threat Modeling & Abuse Vectors

## Potential Threat Actors
- Anonymous web clients
- Compromised accounts
- Malicious automated bots

## Abuse Vectors & Defenses
1. **Input Manipulation:** Addressed via strict schema validation.
2. **Resource Exhaustion:** Addressed via rate limiting and pagination caps.
3. **Privilege Escalation:** Addressed via strict auth boundary checks.
`,

  'FAILURE.md': `# Failure Modes & Degradation Limits

## Known Bottlenecks & First Limits
- First limit hit under load:
- External dependency slow/down:
- Error detection & alerting mechanism:
`,

  'DATA.md': `# Data Structures & Schemas

## Core Models & Shapes
- Key entities, types, and relationships.

## Access Patterns & Volume
- Read vs. Write frequency:
- Volume limits and retention rules:
`,

  'TESTING.md': `# Verification & Test Execution

## Real Test Commands
\`\`\`bash
# Run unit and integration tests
npm test
\`\`\`

## Manual Customer Path
1. Step 1:
2. Step 2:
3. Verification:
`,

  'ROLLBACK.md': `# Rollback Plan & Escape Hatch

## Last Known Good State
- **Last Good Commit:** \`HEAD\`
- **Rollback Procedure:**
  \`\`\`bash
  git revert <commit>
  \`\`\`
`
};

const subdirs = ['defense', 'features', 'bugs'];

// Create docs directory
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
  console.log(`[+] Created ${docsDir}`);
}

// Create subdirectories
subdirs.forEach(sub => {
  const dirPath = path.join(docsDir, sub);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, '.gitkeep'), '', 'utf8');
    console.log(`[+] Created docs/${sub}/`);
  }
});

// Create template files
let created = 0;
let skipped = 0;

for (const [filename, content] of Object.entries(templates)) {
  const filePath = path.join(docsDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  [+] Created docs/${filename}`);
    created++;
  } else {
    skipped++;
  }
}

console.log(`\nDONE: Initialized docs/ (${created} files created, ${skipped} existing preserved).`);
