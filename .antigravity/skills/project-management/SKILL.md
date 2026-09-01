---
name: project-management
description: Writes PRDs, sprint documents, tickets, roadmaps, and technical specs. Maintains sprint context memory across sessions. Integrates with Jira, Slack, and Notion workflows. Use when the user asks to plan a feature, write a PRD, create tickets, define a roadmap, or manage a sprint.
---

# Project Management — AI Product & Sprint Intelligence

## When to Use This Skill
- Writing a PRD (Product Requirements Document) or feature spec
- Creating Jira tickets, user stories, or bug reports
- Planning a sprint — goals, capacity, backlog grooming
- Building a product roadmap (quarterly or annual)
- Drafting Notion pages, Slack standup summaries, or release notes
- Maintaining context across an ongoing sprint or project

---

## 1. Sprint Context Memory

> At the start of any PM session, establish context first. Always ask or infer:

### Context Snapshot (Fill Before Working)
```
Project:        [App/product name]
Sprint:         [Sprint #] | [Start Date → End Date]
Goal:           [One sentence — what does this sprint ship?]
Team Size:      [# of engineers, designers, QA]
Velocity:       [Story points per sprint — if known]
Active Epic:    [Current epic/theme being worked on]
Blockers:       [Any known blockers or dependencies]
Tools:          [Jira / Notion / Linear / GitHub Issues / Slack]
```

### Persistent Rules
- Reference the sprint goal before writing any ticket or spec
- Flag if a new request is **in-scope** or **out-of-scope** for the current sprint
- Remind user of blockers when relevant
- Keep ticket estimates consistent with team velocity

---

## 2. PRD — Product Requirements Document

### PRD Template
```markdown
# PRD: [Feature Name]

## Overview
**What**: [One sentence on what this feature is]
**Why**: [Business or user problem being solved]
**Who**: [Target users / personas]

## Problem Statement
[2–3 sentences describing the pain point with supporting data if available]

## Goals & Success Metrics
| Goal | Metric | Target |
|---|---|---|
| [Goal 1] | [Metric] | [Value] |
| [Goal 2] | [Metric] | [Value] |

## Non-Goals (Out of Scope)
- [What this feature will NOT do — critical to define]

## User Stories
- As a [user type], I want to [action] so that [outcome].

## Functional Requirements
### Must Have (P0)
- [ ] [Requirement 1]
- [ ] [Requirement 2]

### Should Have (P1)
- [ ] [Requirement 3]

### Nice to Have (P2)
- [ ] [Requirement 4]

## UX / Design Notes
[Link to Figma / Stitch screens, or describe key flows]

## Technical Considerations
[APIs needed, performance requirements, dependencies, risks]

## Edge Cases & Error States
- [Edge case 1 and how it's handled]
- [Edge case 2]

## Open Questions
- [ ] [Decision needed from stakeholder]
- [ ] [TBD item]

## Timeline
| Milestone | Target Date |
|---|---|
| Design complete | [Date] |
| Dev complete | [Date] |
| QA sign-off | [Date] |
| Launch | [Date] |
```

---

## 3. Ticket Creation

### Jira Ticket Types

#### 🟦 User Story
```
Title: [As a <user>, I want to <action> so that <benefit>]

Description:
  Context: [Why this story exists]
  Acceptance Criteria:
    - [ ] Given [condition], when [action], then [result]
    - [ ] Given [condition], when [action], then [result]

Story Points: [1 / 2 / 3 / 5 / 8 / 13]
Priority: [P0 Critical / P1 High / P2 Medium / P3 Low]
Labels: [frontend / backend / design / infra]
Epic Link: [Epic name]
Sprint: [Sprint #]
```

#### 🐛 Bug Report
```
Title: [Bug] [Component] — [Short description of what's broken]

Description:
  Environment: [Production / Staging / Local]
  Browser/OS: [e.g., Chrome 121 / macOS Sonoma]
  
  Steps to Reproduce:
    1. [Step 1]
    2. [Step 2]
    3. [Step 3]
  
  Expected Behavior: [What should happen]
  Actual Behavior: [What actually happens]
  
  Impact: [# of users affected / severity]
  Screenshots/Logs: [Attach or paste]

Priority: [P0 / P1 / P2]
Story Points: [estimate]
```

#### ⚙️ Technical Task
```
Title: [Tech] [Short action-oriented title]

Description:
  Why: [Technical reason — refactor, performance, debt]
  What: [Exactly what needs to be done]
  Definition of Done:
    - [ ] [Criterion 1]
    - [ ] [Criterion 2]
  
  Dependencies: [Other tickets or services]
  Risk: [Low / Medium / High]

Story Points: [estimate]
Labels: [tech-debt / infra / performance]
```

#### 📌 Epic
```
Title: [Epic Name — usually a theme or major feature area]

Description:
  Goal: [What this epic delivers]
  Business Value: [Why it matters]
  
  Child Stories:
    - [ ] Story 1
    - [ ] Story 2
    - [ ] Story 3
  
  Start: [Date]
  Target Completion: [Date]
  Status: [Planning / In Progress / Done]
```

### Story Point Guide (Fibonacci)
| Points | Complexity |
|---|---|
| **1** | Trivial — copy change, config tweak |
| **2** | Simple — single component, clear scope |
| **3** | Small — 1–2 files, minor logic |
| **5** | Medium — multiple files, some complexity |
| **8** | Large — cross-system, needs design + dev |
| **13** | Extra large — break it down further |
| **∞** | Too big — must be split before estimating |

---

## 4. Sprint Planning

### Sprint Document Template
```markdown
# Sprint [#] Plan — [Team Name]
**Dates**: [Start] → [End]  
**Sprint Goal**: [One clear sentence — what does this sprint deliver?]  
**Capacity**: [X story points] ([N engineers] × [Y days] × [Z velocity factor])

## Committed Stories
| Ticket | Title | Assignee | Points | Status |
|---|---|---|---|---|
| [PROJ-101] | [Title] | [Name] | 5 | To Do |
| [PROJ-102] | [Title] | [Name] | 3 | To Do |

**Total Committed**: [X pts]

## Stretch Goals (if capacity allows)
| Ticket | Title | Points |
|---|---|---|
| [PROJ-110] | [Title] | 3 |

## Dependencies & Blockers
- [ ] [Dependency 1 — who owns it, when needed]
- [ ] [Blocker — escalation owner]

## Definition of Done
- [ ] Code reviewed and merged to main
- [ ] Tests written and passing
- [ ] QA sign-off received
- [ ] Feature flagged or deployed to staging
- [ ] Docs/Notion updated if needed

## Risks
- [Risk 1 — mitigation plan]
```

### Sprint Ceremonies Cheat Sheet
| Ceremony | When | Duration | Output |
|---|---|---|---|
| **Sprint Planning** | Day 1 | 2h | Committed backlog + sprint goal |
| **Daily Standup** | Every day | 15min | Blockers surfaced |
| **Backlog Grooming** | Mid-sprint | 1h | Next sprint stories refined |
| **Sprint Review** | Last day | 1h | Demo to stakeholders |
| **Retrospective** | Last day | 1h | What went well / improve |

---

## 5. Roadmap

### Quarterly Roadmap Template
```markdown
# Product Roadmap — Q[X] [Year]

## Theme: [Overarching quarterly theme]

### Now (This Quarter)
| Feature | Status | Owner | ETA |
|---|---|---|---|
| [Feature 1] | In Progress | [Team] | [Month] |
| [Feature 2] | Planning | [Team] | [Month] |

### Next (Next Quarter)
| Feature | Priority | Notes |
|---|---|---|
| [Feature 3] | P0 | [Dependency / risk] |
| [Feature 4] | P1 | [Draft spec exists] |

### Later (3–6 months)
| Feature | Priority | Notes |
|---|---|---|
| [Feature 5] | P2 | [Exploratory] |

## Key Milestones
| Milestone | Date | Owner |
|---|---|---|
| [Beta Launch] | [Date] | [PM] |
| [v1.0 Release] | [Date] | [Eng Lead] |

## Success Metrics (Q[X] OKRs)
- **Objective**: [What we're trying to achieve]
  - KR1: [Measurable key result]
  - KR2: [Measurable key result]
```

---

## 6. Technical Spec Template

```markdown
# Tech Spec: [Feature/System Name]

**Author**: [Name]  
**Date**: [Date]  
**Status**: Draft / In Review / Approved  
**Related PRD**: [Link]

## Summary
[2–3 sentence description of what's being built and why]

## Background
[Context, existing system state, and why this change is needed now]

## Proposed Solution
[High-level approach — describe the system design]

## Architecture / Data Flow
[Diagram or step-by-step description of how data flows]

## API Design
### Endpoint: `POST /api/v1/[resource]`
- **Auth**: Required (JWT)
- **Request Body**:
  ```json
  { "field": "value" }
  ```
- **Response**:
  ```json
  { "id": "uuid", "status": "created" }
  ```
- **Error Codes**: 400, 401, 403, 500

## Database Changes
| Table | Change | Migration Required |
|---|---|---|
| `users` | Add `verified_at` column | Yes |

## Edge Cases
- [Edge case 1 — how handled]
- [Edge case 2]

## Testing Plan
- [ ] Unit tests for [function]
- [ ] Integration test for [flow]
- [ ] Load test for [endpoint] at [N] RPS

## Rollout Plan
- [ ] Feature flag: `enable_[feature]`
- [ ] Internal test → Staging → 5% rollout → 100%
- [ ] Rollback: Disable feature flag

## Open Questions
- [ ] [Decision needed]
```

---

## 7. Notion Page Structures

### Feature Brief (Notion)
```
📄 [Feature Name]
├── 🎯 Goal
├── 👤 User Problem
├── ✅ Success Criteria
├── 🗓️ Timeline
├── 🔗 Links → [Figma] [PRD] [Jira Epic]
└── 📝 Notes & Decisions Log
```

### Sprint Retrospective (Notion)
```
🔁 Sprint [#] Retro — [Date]

✅ What went well:
  - [Item]

🚧 What could improve:
  - [Item]

🎯 Action items:
  - [ ] [Owner] → [Action] by [Date]
```

---

## 8. Slack Templates

### Daily Standup
```
*[Name] — Standup [Date]*
✅ Yesterday: [What was completed]
🔨 Today: [What's being worked on]
🚫 Blockers: [None / describe blocker]
```

### Sprint Goal Announcement
```
🚀 *Sprint [#] Kickoff*
*Goal*: [Sprint goal sentence]
*Duration*: [Start] → [End]
*Team*: [@ mentions]
*Committed*: [X story points across Y tickets]
Key tickets: [PROJ-101], [PROJ-102]
Let's ship it 💪
```

### Release Announcement
```
🎉 *[Feature Name] is live!*
*What's new*: [One-line summary]
*Who it affects*: [User segment]
*Docs*: [Link]
*Feedback*: Drop in #feedback or tag @pm
```

---

## 9. PM Rules & Anti-Patterns

### ✅ Good PM Habits
- Every ticket has a clear **Definition of Done** before sprint starts
- PRDs have explicit **Non-Goals** — scope creep starts here
- Tickets are sized to fit within one sprint (≤13pts; prefer ≤8pts)
- Blockers are surfaced in standup the moment they're known
- Roadmap is updated after every sprint, not just quarterly

### ❌ Anti-Patterns to Avoid
- Writing tickets with no acceptance criteria ("make it work" = unshippable)
- Putting 13+ story point tickets into a sprint without splitting
- No sprint goal — team ships features, not outcomes
- Roadmap promises to stakeholders before engineering estimates exist
- Skipping retrospectives — debt compounds silently

---

## Resources
- Atlassian Agile Guide: atlassian.com/agile
- Shape Up (Basecamp's PM method): basecamp.com/shapeup
- Notion PM Templates: notion.so/templates
- Linear (modern Jira alternative): linear.app
- RICE Scoring Model (prioritization): intercom.com/blog/rice-simple-prioritization
