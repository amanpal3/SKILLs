# BRAND GUIDE — [Project/Product Name]

> Maintained by Wanda. The single source of truth for brand identity.  
> Every agent reads this before creating any user-facing output.

---

## Brand Personality

**Three words that define us**: [Adjective] · [Adjective] · [Adjective]

**We are**: [Brand archetype — e.g., The Creator, The Guide, The Rebel]  
**We sound like**: [e.g., "A senior engineer who's also your friend"]  
**We never sound like**: [e.g., "Corporate PR speak or a textbook"]

---

## Color Palette

| Role | Hex | CSS Variable | Use |
|---|---|---|---|
| Primary | `#` | `--color-primary` | CTAs, links, active states |
| Secondary | `#` | `--color-secondary` | Supporting UI, tabs, chips |
| Accent | `#` | `--color-accent` | Highlights, badges, focus rings |
| Background | `#` | `--color-bg` | Page background |
| Surface | `#` | `--color-surface` | Cards, panels |
| Text Primary | `#` | `--color-text` | Main body text |
| Text Muted | `#` | `--color-text-muted` | Labels, captions |
| Success | `#` | `--color-success` | Confirmations |
| Warning | `#` | `--color-warning` | Caution states |
| Error | `#` | `--color-error` | Errors, destructive actions |

```css
:root {
  --color-primary:    #;
  --color-secondary:  #;
  --color-accent:     #;
  --color-bg:         #;
  --color-surface:    #;
  --color-text:       #;
  --color-text-muted: #;
  --color-success:    #;
  --color-warning:    #;
  --color-error:      #;
}
```

---

## Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Display | [Font] | 800 | 56–72px |
| Heading 1 | [Font] | 700 | 40–48px |
| Heading 2 | [Font] | 600 | 28–32px |
| Heading 3 | [Font] | 600 | 20–24px |
| Body | [Font] | 400 | 16–18px |
| Small / Label | [Font] | 400 | 12–14px |
| Monospace | [Font] | 400 | 14px |

```css
@import url('https://fonts.googleapis.com/css2?family=[Font]&display=swap');

:root {
  --font-display: '[Font]', sans-serif;
  --font-body:    '[Font]', sans-serif;
  --font-mono:    '[Font]', monospace;
}
```

---

## Spacing System (8pt Grid)

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-6:  24px;
  --space-8:  32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
}
```

---

## Voice & Tone

### ✅ DO — On-Brand Copy
- [Example of brand-appropriate headline]
- [Example of brand-appropriate CTA]
- [Example of brand-appropriate error message]

### ❌ DON'T — Off-Brand Copy
- [Example of off-brand headline]
- [Example of off-brand CTA]
- [Example of off-brand error message]

### Copy Principles
- **Lead with outcome, not feature**: "Ship faster" not "Real-time collaboration enabled"
- **Use contractions**: "You're" not "You are" — we're human
- **Be specific**: "Save 3 hours a week" not "Save time"
- **Active voice always**: "We send you reports" not "Reports are sent"

---

## Logo Usage

- Minimum size: [Xpx / Xmm]
- Clear space: [X× height around logo]
- Approved backgrounds: [Light / Dark / Primary color]
- Never: Stretch, rotate, add effects, or place on busy backgrounds

---

## Component Style Defaults

```css
/* Buttons */
.btn-primary {
  background: var(--color-primary);
  color: white;
  border-radius: [X]px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease-out;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Cards */
.card {
  background: var(--color-surface);
  border-radius: [X]px;
  padding: var(--space-6);
  border: 1px solid rgba(255,255,255,0.08);
}

/* Input */
.input {
  border: 1.5px solid var(--color-border);
  border-radius: [X]px;
  padding: 10px 14px;
  font-size: 16px;
  transition: border-color 0.2s;
}
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(primary-rgb, 0.15);
  outline: none;
}
```
