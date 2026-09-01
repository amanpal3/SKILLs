---
name: ui-ux-pro-max
description: Senior UI/UX design system for AI. Applies UX laws, user psychology, storytelling layouts, micro-interactions, and conversion optimization. Use when designing interfaces, reviewing user flows, building forms, creating landing pages, or improving usability and delight.
---

# UI/UX Pro Max — Senior Design Intelligence

## When to Use This Skill
- Designing or reviewing any UI screen, component, or page layout
- Planning user flows, onboarding, or checkout funnels
- Adding micro-interactions, animations, or hover states
- Improving conversion rates, signups, or CTR
- Auditing UX for mistakes, friction, or confusion
- Applying storytelling and emotional design to layouts

---

## 1. Core UX Laws (Apply Automatically)

| Law | Rule | Apply When |
|---|---|---|
| **Hick's Law** | Fewer choices = faster decisions. Reduce options ruthlessly. | Menus, pricing pages, forms |
| **Fitts's Law** | Large, nearby targets are clicked faster. Make CTAs big. | Buttons, touch targets, modals |
| **Miller's Law** | Users can hold ~7 items in working memory. Chunk content. | Nav bars, forms, lists |
| **Jakob's Law** | Users expect your UI to work like sites they already know. | Layouts, icon conventions |
| **Gestalt Principles** | Group related elements visually (proximity, similarity, closure). | Cards, dashboards, grids |
| **Von Restorff Effect** | Highlighted items are remembered. Make your CTA stand out. | Hero sections, CTAs |
| **Doherty Threshold** | System feedback under 400ms feels instant. | Loaders, skeletons, transitions |
| **Zeigarnik Effect** | People remember incomplete tasks. Use progress bars. | Onboarding, multi-step forms |
| **Peak-End Rule** | Users judge experiences by the peak moment and end. | Confirmation screens, success states |
| **Pareto Principle** | 80% of users use 20% of features. Surface the top 20%. | Dashboard design, nav hierarchy |

---

## 2. User Flow Mapping

### Step-by-Step Process
1. **Define Entry Points** — Where does the user land? (Ad, organic, referral)
2. **Map the Happy Path** — Sequence of steps for a successful outcome
3. **Identify Exit Points** — Where do users drop off? (Use heatmaps, scroll depth)
4. **Design Error States** — What happens when something goes wrong?
5. **Add Recovery Paths** — Easy ways to undo, go back, or get help

### Flow Quality Checklist
- [ ] Every screen has one primary action (single CTA)
- [ ] Users always know where they are (breadcrumbs, progress indicators)
- [ ] No dead ends — every error has a resolution path
- [ ] No more than 3 steps to reach the core value
- [ ] Back button always works as expected

---

## 3. Storytelling in Layout

> **Rule**: Every page should tell a story — Problem → Solution → Proof → Action.

### Hero Section Formula
```
[Attention-Grabbing Headline]     ← Speaks the user's pain/desire
[Subheadline: What you do]        ← One sentence, outcome-focused
[Social Proof Signal]              ← "Trusted by 10,000+ users"
[Primary CTA]  [Secondary CTA]    ← Action + safety net
[Hero Visual]                      ← Shows the product in context
```

### Landing Page Story Arc
1. **Hook** — Lead with the emotion/outcome, not the feature
2. **Problem** — Confirm their pain (builds empathy and trust)
3. **Solution** — Introduce your product as the hero
4. **Proof** — Testimonials, stats, logos, case studies
5. **Benefit Breakdown** — Feature → Benefit mapping (not just features)
6. **Objection Handling** — FAQ, guarantees, risk reversal
7. **Final CTA** — Repeat the CTA with urgency or scarcity

### F-Pattern & Z-Pattern Reading
- Use **F-pattern** for text-heavy pages (blogs, docs) — put key info in the first two lines and left column
- Use **Z-pattern** for visual pages (landing pages) — logo → nav → hero → CTA flows diagonally

---

## 4. Interaction Design Rules

### Affordance & Signifiers
- Buttons must look clickable (shadow, border, or fill)
- Links must be distinguishable from body text (color + underline)
- Inputs must show focus state clearly (border color change + outline)
- Draggable items need grab cursor + subtle shadow lift

### Touch & Pointer Targets
- Minimum touch target: **44×44px** (iOS HIG) / **48×48dp** (Material)
- Group related actions within thumb reach on mobile
- Never place destructive actions (delete) next to safe ones (save)

### Feedback Hierarchy
```
Instant (0–100ms)  → Button press ripple, checkbox tick
Fast (100–300ms)   → Input validation, toggle switch
Moderate (300ms–1s) → Page transitions, form submission
Slow (1s+)         → Loading spinner + progress indicator
```

### Form Design Rules
- One column layout (proven higher completion rates)
- Label above input, never placeholder-only (accessibility)
- Real-time inline validation (not just on submit)
- Auto-advance on clear completion (e.g., phone number input)
- Show password option on password fields
- Smart defaults to reduce required input

---

## 5. Micro-Interactions & Animations

### The 4-Part Micro-Interaction Model (by Dan Saffer)
1. **Trigger** — What starts it (user action or system event)
2. **Rules** — What happens
3. **Feedback** — How the user knows it happened
4. **Loops/Modes** — Does it repeat? Change over time?

### Animation Principles
- **Easing**: Use `ease-out` for elements entering, `ease-in` for elements leaving
- **Duration**: UI transitions → 150–300ms. Page transitions → 300–500ms. Never over 700ms.
- **Purpose**: Every animation must communicate state change, hierarchy, or causality
- **Avoid**: Animations that block interaction, loop infinitely without control, or are purely decorative

### High-Value Micro-Interactions to Implement
```css
/* Button hover lift effect */
button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }

/* Input focus glow */
input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(primary-rgb, 0.15); }

/* Success state pulse */
@keyframes success-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }

/* Skeleton loading shimmer */
@keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
```

### Delightful Details
- Confetti or lottie animation on key completions (signup, purchase)
- Subtle page scroll parallax on hero sections
- Staggered list item entry animations (each 50ms delayed)
- Tooltip reveal on hover with 200ms delay (avoids flicker)
- Empty states with helpful illustration + action, not just "No data"

---

## 6. Conversion Optimization

### CTA (Call-to-Action) Formula
- **Copy**: Use action verbs + outcome ("Start Building Free" > "Sign Up")
- **Color**: Must contrast with background by at least 4.5:1 (WCAG AA)
- **Size**: At least 48px tall, full-width on mobile
- **Position**: Above the fold + repeated at bottom
- **Urgency triggers**: "Only 3 spots left", "Offer ends Friday"

### Trust Signals (Place Near Conversion Points)
- Security badges (SSL, payment logos)
- Money-back guarantee
- User count / review count
- Named testimonials with real photos
- Press logos ("As seen in...")

### Friction Reducers
- Social login (Google/Apple) reduces signup friction by ~40%
- Progress bars in multi-step forms increase completion by ~28%
- Autofill support for name, email, address
- Inline validation vs. submit-then-error
- "No credit card required" under pricing CTA

### A/B Test Priority Order
1. Headline copy
2. CTA button text + color
3. Hero image/video
4. Social proof placement
5. Form field count

---

## 7. Visual Hierarchy System

### Typography Scale (apply consistently)
```
Display: 56–72px / font-weight: 800   ← Hero headlines
H1:      40–48px / font-weight: 700   ← Page titles
H2:      28–32px / font-weight: 600   ← Section headers
H3:      20–24px / font-weight: 600   ← Card titles
Body:    16–18px / font-weight: 400   ← Readable body text
Small:   12–14px / font-weight: 400   ← Captions, labels
```

### Spacing System (8pt grid)
- Base unit: 8px
- Use multiples: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Consistent spacing creates rhythm and professionalism

### Color Roles
- **Primary**: Action (buttons, links, active states)
- **Secondary**: Supporting UI (tabs, chips, badges)
- **Neutral**: Structure (backgrounds, borders, text)
- **Semantic**: Status (success ✅, warning ⚠️, error ❌, info ℹ️)
- **Surface**: Layering (background → card → modal — each slightly different tone)

---

## 8. Accessibility (Non-Negotiable)
- **Color contrast**: 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- **Focus indicators**: Visible focus ring on all interactive elements
- **Alt text**: All images must have descriptive alt attributes
- **Semantic HTML**: Use `<button>` for buttons, `<nav>` for nav, `<main>` for main content
- **Keyboard navigation**: Tab order must be logical; modals must trap focus
- **ARIA labels**: Use `aria-label` on icon-only buttons

---

## 9. UX Mistakes to Avoid

### ❌ Critical Errors
- **Modal overload** — Opening modals on page load kills engagement
- **Auto-playing video with sound** — Immediate trust destroyer
- **Forms with no inline validation** — Forces users to re-enter data
- **CTA below the fold on desktop** — Users shouldn't have to scroll to act
- **Broken empty states** — "No results" with no actionable next step
- **Inconsistent component behavior** — Same interaction, different outcome = confusion
- **Dark patterns** — Pre-checked boxes, hidden unsubscribe, bait-and-switch pricing

### ⚠️ Common Friction Points
- Too many fields in signup form (ask only what's needed now)
- Generic error messages ("Something went wrong") — be specific
- No skeleton screens during loading — users think it's broken
- Hamburger menus on desktop — hide navigation from power users
- Using placeholder text as labels — disappears on focus

### 🔁 Review Checklist Before Shipping
- [ ] Every screen has a clear primary action
- [ ] No orphaned pages (every page is reachable and has a way out)
- [ ] Mobile touch targets are ≥44px
- [ ] All interactive states designed (default, hover, focus, active, disabled, loading, error, success)
- [ ] Color contrast passes WCAG AA
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Empty/error/loading states handled for every data component

---

## 10. Emotional Design Layers (Maslow for UX)

```
Level 5: DELIGHT     ← Surprise animations, personality, easter eggs
Level 4: TRUST       ← Consistent UI, honest copy, social proof
Level 3: EFFICIENCY  ← Fast load, keyboard shortcuts, smart defaults
Level 2: USABILITY   ← Clear flows, readable text, obvious CTAs
Level 1: FUNCTION    ← It works. Every time. On every device.
```
> Start from Level 1 and work up. Never skip levels.

---

## Resources
- Nielsen Norman Group: nngroup.com/articles
- Laws of UX: lawsofux.com
- Refactoring UI (Book): refactoringui.com
- Dan Saffer — Microinteractions (Book)
- Baymard Institute (E-commerce UX research): baymard.com
