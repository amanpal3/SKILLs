---
name: designing-with-stitch
description: Provides instructions and workflows for using the StitchMCP server to design websites, create UI screens, and manage Stitch projects. Integrates senior UI/UX principles (UX laws, storytelling, micro-interactions, conversion optimization) into every screen generation. Use this skill when the user asks to design a website, generate screens, or interact with Google Stitch.
---

# Designing with Stitch (+ UI/UX Pro Max)

## When to Use This Skill
- When the user asks to design a website or app screen using Stitch.
- When generating new UI screens or variants via text prompts.
- When editing existing screens in a Stitch project.
- When creating or listing Stitch projects.
- When the user wants premium, conversion-optimized, or emotionally resonant UI.

---

## Workflow

Follow this workflow for every design task with Stitch:

### Step 1 — Understand Before You Design
Before generating anything, mentally answer:
- What is the **user's goal** on this screen?
- What is the **one primary action** this screen should drive?
- What **emotion** should this screen evoke (trust, excitement, calm)?
- What **UX law** applies? (See laws below)

### Step 2 — Check/Create Project
- Check for existing projects: `mcp_StitchMCP_list_projects`
- Create if needed: `mcp_StitchMCP_create_project` (pass a `title`)
- Save the `projectId` (strip the `projects/` prefix)

### Step 3 — Build a UI/UX-Rich Prompt
Do **not** write vague prompts. Use the prompt formula below to embed UX principles:

```
[Screen Type] for [Product/Context].
Layout: [storytelling arc — e.g., Hero → Problem → Solution → CTA]
Visual Hierarchy: [Headline dominates, then subheadline, then CTA button]
Color: [Primary for CTA, neutral backgrounds, semantic colors for status]
Typography: [Inter or Outfit, bold headlines, readable 16px body text]
Micro-interactions: [Button hover lift, input focus glow, animated CTA]
Spacing: [8pt grid — generous whitespace, grouped related elements]
Tone: [Professional / Friendly / Bold / Minimal — pick one]
Must include: [specific component — e.g., trust badges, progress bar, testimonial card]
```

### Step 4 — Generate Initial Screen
- `mcp_StitchMCP_generate_screen_from_text` with `projectId` + rich prompt
- Specify `deviceType`: `MOBILE`, `DESKTOP`, `TABLET`, or `AGNOSTIC`
- If `output_components` returns suggestions, present them to the user before proceeding

### Step 5 — Apply Design System (Optional but Recommended)
- List existing design systems: `mcp_StitchMCP_list_design_systems`
- Create one via `mcp_StitchMCP_create_design_system` if not present
- Apply via `mcp_StitchMCP_apply_design_system` to enforce consistent tokens
- Immediately call `mcp_StitchMCP_update_design_system` after creation to display it

### Step 6 — Iterate & Refine
- List generated screens: `mcp_StitchMCP_list_screens`
- Inspect a screen: `mcp_StitchMCP_get_screen`
- Edit with UX-focused prompts: `mcp_StitchMCP_edit_screens`
- Generate variants: `mcp_StitchMCP_generate_variants`

---

## Embedded UI/UX Principles (Apply to Every Screen)

### UX Laws — Quick Reference
| Law | Action |
|---|---|
| **Hick's Law** | Limit choices per screen. One primary CTA only. |
| **Fitts's Law** | Make buttons large (48px min height), centered or thumb-reachable |
| **Miller's Law** | Group content into chunks of ≤7 items |
| **Jakob's Law** | Follow familiar layout conventions (logo top-left, nav top-right) |
| **Von Restorff** | Make the CTA visually pop — contrasting color, larger size |
| **Doherty Threshold** | Always design loading/skeleton states (no blank screens) |
| **Zeigarnik Effect** | Use progress bars in multi-step flows |
| **Peak-End Rule** | Design success/confirmation states with delight |

### Storytelling Layout (Default Page Arc)
```
1. HOOK        → Emotional headline + aspirational visual
2. PROBLEM     → Mirror the user's pain point
3. SOLUTION    → Introduce the product as the hero
4. PROOF       → Testimonials, stats, logos
5. BENEFITS    → Feature → Benefit mapping (not just features)
6. OBJECTIONS  → FAQ, guarantee, risk reversal
7. CTA         → Clear, urgent, value-focused action
```

### Visual Hierarchy Rules
- One dominant element per screen (headline or hero image)
- Typography scale: Display 56px+ → H1 40px → H2 28px → Body 16px
- CTA button: High contrast, 48px tall min, action verb + outcome copy
- Spacing: Use 8pt grid multiples (8, 16, 24, 32, 48, 64px)
- Group related elements with proximity (Gestalt)

### Micro-Interaction Prompts to Add
Include these in your Stitch prompts for richer output:
- "Buttons with hover lift shadow effect"
- "Input fields with focus glow border"
- "Staggered card entrance animation"
- "Success state with confetti or checkmark pulse"
- "Skeleton loader for content areas"
- "Smooth page transition with fade"

### Conversion Optimization
- Place primary CTA **above the fold** and repeat at page bottom
- CTA copy formula: `[Action verb] + [Outcome]` → "Start Building Free" not "Submit"
- Add trust signals near CTAs: security badge, user count, guarantee
- Reduce form fields to the minimum required at this stage
- Include a secondary, lower-commitment CTA ("See how it works →")

---

## Prompt Quality Examples

### ❌ Weak Prompt
> "Design a landing page for my SaaS product"

### ✅ Strong Prompt (UI/UX Max)
> "Design a SaaS landing page for a project management tool. Layout follows a storytelling arc: bold hero headline ('Ship projects 3x faster') with subheadline and two CTAs ('Start Free Trial' primary, 'Watch Demo' secondary). Below: 3-column feature benefit cards with icons. Testimonial strip with avatars and star ratings. FAQ accordion. Final CTA with urgency ('Join 12,000 teams — free forever plan'). Use dark navy background (#0D1117), electric indigo (#6366F1) primary, Inter font, 8pt spacing grid. Buttons have hover lift animations. Include skeleton loaders as design notes."

---

## Instructions & Rules
- **Strip prefix IDs**: Always remove `projects/` or `screens/` before passing to tool params
- **Be patient**: Generation can take 2–3 minutes. Do not retry blindly — check with `get_screen` first
- **Device type**: Always specify `deviceType` — defaults to desktop if unsure
- **One primary action**: Every screen prompt must define a single primary CTA
- **All states**: Request default + hover + focus + error + loading states in your prompt
- **Accessibility**: Remind Stitch to use sufficient color contrast and readable font sizes

## Pre-Ship UX Checklist
- [ ] Single clear primary action per screen
- [ ] CTA visible above the fold
- [ ] Consistent spacing (8pt grid)
- [ ] Loading/skeleton state present
- [ ] Error state designed
- [ ] Mobile touch targets ≥44px
- [ ] Storytelling arc followed

---

## Resources
- StitchMCP server tools: `mcp_StitchMCP_*`
- Pair with `ui-ux-pro-max` skill for deep UX law reference
- Laws of UX: lawsofux.com
- Refactoring UI: refactoringui.com
