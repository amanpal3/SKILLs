---
name: gtm-strategy
description: Builds go-to-market launch plans, positioning docs, ICP profiles, and outreach sequences. Processes market data and competitor research. Integrates with Slack and Google Drive workflows. Use when the user asks to plan a product launch, define positioning, research target customers, build outreach, or create a GTM strategy.
---

# GTM Strategy — Go-To-Market Intelligence

## When to Use This Skill
- Planning a product or feature launch
- Writing positioning docs, messaging frameworks, or value propositions
- Building ICP (Ideal Customer Profile) and persona research
- Creating outreach sequences (email, LinkedIn, cold call scripts)
- Processing competitive intelligence or market data
- Drafting launch announcements for Slack, Drive, or email

---

## 1. GTM Context Snapshot

> Establish this before any GTM work. Ask or infer:

```
Product:          [What is being launched]
Stage:            [MVP / Beta / GA / Feature update]
Target Market:    [Industry, company size, geography]
ICP:              [Who is the ideal customer?]
Differentiator:   [Why us over alternatives?]
Launch Date:      [Target date]
Channels:         [Where we'll reach customers — SEO, paid, PLG, sales, content]
Success Metrics:  [Signups, MQLs, revenue, DAU, etc.]
Budget:           [Available marketing/sales budget]
Team:             [Who owns launch — PM, marketing, sales, founder]
```

---

## 2. Launch Plan

### Launch Tiers
| Tier | Scope | Examples |
|---|---|---|
| **Tier 1 — Major** | Full company launch, all hands | New product, rebrand, Series A announcement |
| **Tier 2 — Feature** | Channel-specific, targeted | New integration, pricing change, major update |
| **Tier 3 — Minor** | Low-key, existing audience only | Bug fix release, small improvement, internal beta |

### Full Launch Plan Template
```markdown
# Launch Plan: [Product/Feature Name]
**Date**: [Launch Date] | **Tier**: [1 / 2 / 3] | **Owner**: [Name]

## Launch Goal
[One sentence — what does a successful launch look like?]

## Success Metrics
| Metric | Target | Timeframe |
|---|---|---|
| [Signups] | [1,000] | [Week 1] |
| [MQLs] | [50] | [Month 1] |
| [Revenue] | [$10k ARR] | [Month 3] |

## Target Audience
- **Primary ICP**: [Job title, company size, industry, pain]
- **Secondary ICP**: [Segment 2]
- **Influencers/Champions**: [Who influences the buying decision]

## Messaging
- **Headline**: [One punchy sentence — the "what + for whom"]
- **Value Prop**: [Why this beats alternatives]
- **Proof Point**: [Stat, customer quote, or case study]
- **CTA**: [Primary action you want them to take]

## Channel Plan
| Channel | Tactic | Owner | Date | KPI |
|---|---|---|---|---|
| Product Hunt | Launch post | [Name] | [Date] | Top 5 of the day |
| Email | Announcement to list | [Name] | [Date] | 40% open rate |
| LinkedIn | Founder post + paid | [Name] | [Date] | 500 impressions |
| SEO/Blog | Launch blog post | [Name] | [Date] | 100 organic visits |
| Slack communities | Share in 5 channels | [Name] | [Date] | 50 clicks |

## Pre-Launch Checklist
- [ ] Landing page live and tested
- [ ] Analytics tracking verified (GA4, Mixpanel, etc.)
- [ ] Email sequence set up and tested
- [ ] Social posts scheduled
- [ ] Press/media outreach sent (if Tier 1)
- [ ] Support team briefed
- [ ] Rollback plan defined

## Launch Day Runbook
| Time | Action | Owner |
|---|---|---|
| T-24h | Final QA, comms sent to team | PM |
| T-0h | Go live | Eng |
| T+1h | Post on Product Hunt / social | Marketing |
| T+4h | Monitor metrics, respond to feedback | PM |
| T+24h | First metrics report to team | PM |

## Post-Launch
- Week 1 retro: what worked, what didn't
- Update ICP based on who actually signed up
- Iterate messaging based on conversion data
```

---

## 3. Positioning Document

### Positioning Framework (Geoffrey Moore)
```
For [target customer]
Who [have this problem/need],
[Product name] is a [category]
That [primary benefit / key differentiator].
Unlike [primary competitor],
Our product [key differentiator that matters most to ICP].
```

**Example**:
> For early-stage SaaS founders who struggle to build consistent outreach pipelines, Outreach AI is a sales automation tool that writes and sends personalized cold emails in seconds. Unlike generic AI writers, Outreach AI trains on your ICP data and CRM to produce messages that convert.

### Full Positioning Doc Template
```markdown
# Positioning Doc: [Product Name]
**Version**: [v1.0] | **Date**: [Date] | **Owner**: [Name]

## Market Category
[What category does this product belong to? Where does it live in a buyer's mind?]

## Target Customer
- **Primary ICP**: [Description]
- **Jobs to be Done**: [What are they trying to accomplish?]
- **Pain Points**: [What frustrates them with current solutions?]

## Value Proposition
[2–3 sentences on what the product does, for whom, and the measurable outcome]

## Key Benefits (Not Features)
| Feature | Benefit | Who Cares |
|---|---|---|
| [Auto-sends emails] | [Saves 5h/week on outreach] | [SDRs, founders] |
| [CRM sync] | [No manual data entry] | [Sales ops] |

## Differentiation
| Competitor | Their Strength | Our Edge |
|---|---|---|
| [Competitor A] | [Price] | [Better personalization] |
| [Competitor B] | [Brand] | [Faster setup, no code] |

## Proof Points
- [Customer quote with name/company]
- [Stat: "X% improvement in Y"]
- [Case study: [Customer] achieved [result] in [timeframe]]

## Messaging Pillars (3 max)
1. [Pillar 1 — e.g., Speed]: [Supporting message]
2. [Pillar 2 — e.g., Personalization]: [Supporting message]
3. [Pillar 3 — e.g., Simplicity]: [Supporting message]

## Tagline Options
- [Option 1]
- [Option 2]
- [Option 3]
```

---

## 4. ICP Research

### ICP Profile Template
```markdown
# Ideal Customer Profile: [Segment Name]

## Firmographics
- **Industry**: [e.g., B2B SaaS, Fintech, E-commerce]
- **Company Size**: [e.g., 10–200 employees]
- **Revenue**: [e.g., $1M–$20M ARR]
- **Geography**: [e.g., US, UK, India]
- **Stage**: [Seed / Series A / Growth]

## Buyer Persona
- **Title**: [e.g., Head of Sales, Founder, VP Marketing]
- **Age Range**: [e.g., 28–45]
- **Reports To**: [e.g., CEO, CRO]
- **Team Size They Manage**: [e.g., 2–10 people]

## Psychographics
- **Goals**: [What does career success look like for them?]
- **Fears**: [What keeps them up at night?]
- **Motivations**: [What drives their buying decisions?]
- **Watering Holes**: [Where do they spend time — LinkedIn, Slack, newsletters, podcasts?]

## Pain Points (Before Your Product)
1. [Pain 1 — be specific]
2. [Pain 2]
3. [Pain 3]

## Trigger Events (When They're Ready to Buy)
- [e.g., Just hired first SDR]
- [e.g., Missed sales target last quarter]
- [e.g., Fundraised — now scaling fast]

## Where to Find Them
- LinkedIn: [Search filters — title, company size, industry]
- Communities: [Slack groups, Discord, Reddit, forums]
- Events: [Conferences, webinars they attend]
- Content: [Blogs, newsletters they read]

## Qualification Criteria (BANT)
- **Budget**: [Do they have $X/month budget?]
- **Authority**: [Can they sign or influence the deal?]
- **Need**: [Do they have the pain we solve?]
- **Timeline**: [Are they looking to solve this in 30/60/90 days?]
```

### ICP Research Sources
| Source | What to Extract |
|---|---|
| LinkedIn Sales Navigator | Job titles, company size, tech stack, recent hires |
| G2 / Capterra Reviews | Pain points in competitor reviews (exact customer language) |
| Reddit / Quora | Raw, unfiltered complaints and needs |
| Crunchbase | Funding stage, headcount growth, investor info |
| Job Postings | What roles they're hiring = what problems they're trying to solve |
| Customer Interviews | Trigger events, decision process, competing options considered |

---

## 5. Outreach Sequences

### Cold Email Framework (AIDA)
```
Subject: [Specific, personalized — mention their company or role]

Hi [First Name],

[A — Attention]: [1 sentence — relevant observation about them/their company]

[I — Interest]: [1 sentence — the problem you've noticed in companies like theirs]

[D — Desire]: [1–2 sentences — what outcome you deliver, backed by proof]

[A — Action]: [1 clear CTA — low friction, specific time ask]

[Name]
[Title] | [Company]
```

**Example**:
```
Subject: Outreach for [Company]'s SDR team

Hi Sarah,

Saw [Company] just hit 50 employees — congrats on the growth.

Most sales teams at your stage spend 3–4 hours a day on manual outreach before a single call is booked.

We helped [Similar Company] cut that to 30 minutes using AI-personalized sequences — they went from 12 to 47 demos/month in 60 days.

Worth a 20-min call this week to see if it applies to you?

[Name]
```

### 5-Touch Outreach Sequence
| Touch | Channel | Timing | Goal |
|---|---|---|---|
| **#1** | Cold email | Day 0 | First impression — AIDA format |
| **#2** | LinkedIn connect | Day 2 | Warm up + add social proof |
| **#3** | Email follow-up | Day 5 | Add new value (case study, insight) |
| **#4** | LinkedIn message | Day 8 | Personal note, ask for intro |
| **#5** | Final email | Day 12 | Breakup email — low pressure CTA |

### Breakup Email Template
```
Subject: Re: [Previous subject]

Hi [Name],

I've reached out a few times — I know your inbox is busy.

I'll leave it here, but if [specific trigger — e.g., "outreach efficiency ever becomes a priority"], I'd love to reconnect.

Feel free to book time here: [link]

[Name]
```

### LinkedIn Message Templates

**Connection Request** (300 char limit):
```
Hi [Name] — saw your post on [topic]. Working on something related to [their challenge]. Would love to connect and share what we're seeing.
```

**After Connect — First DM**:
```
Thanks for connecting, [Name].

Curious — how are you currently handling [specific pain]? We've helped teams like [Company A] and [Company B] solve this.

Happy to share what worked — no pitch, just context.
```

---

## 6. Competitive Intelligence

### Competitor Analysis Template
```markdown
# Competitor Analysis: [Competitor Name]

## Overview
- **Category**: [What do they sell?]
- **Founded / Stage**: [Year / Funding level]
- **Pricing**: [Model + price points]
- **Target Customer**: [Their ICP]

## Strengths
- [Strength 1]
- [Strength 2]

## Weaknesses (Harvested from G2/reviews)
- [Weakness 1 — include customer quote if possible]
- [Weakness 2]

## How We Win Against Them
| Their Weakness | Our Strength | Proof |
|---|---|---|
| [Slow onboarding] | [Live in 5 min] | [Customer X set up in 4 min] |

## Battle Card (for sales team)
- **Common objection**: "We already use [Competitor]"
- **Response**: "Great — most of our customers came from [Competitor]. The main thing they told us was [weakness]. Has that come up for you?"
```

---

## 7. Market Data Processing

### Structuring Raw Market Data
When given raw market data (reports, CSVs, surveys), extract:

1. **Market Size** — TAM / SAM / SOM
2. **Growth Rate** — YoY % growth of the category
3. **Key Trends** — What's driving adoption
4. **Buyer Behavior** — Decision timelines, budget authority, evaluation criteria
5. **Segment Breakdown** — Which sub-segments are growing fastest

### TAM / SAM / SOM Calculator Framework
```
TAM (Total Addressable Market):
  = [Total # of potential buyers globally] × [Average contract value]
  Example: 500,000 SMBs × $2,400/yr = $1.2B TAM

SAM (Serviceable Addressable Market):
  = TAM × [% you can realistically reach with your model]
  Example: 10% = $120M SAM

SOM (Serviceable Obtainable Market):
  = SAM × [% you can win in 3–5 years]
  Example: 5% = $6M SOM (your realistic 5-year revenue target)
```

---

## 8. Slack & Google Drive Connectors

### Slack — GTM Announcement Templates

**New Feature Launch**:
```
🚀 *[Feature Name] is live!*

*What it does*: [One line]
*Who it's for*: [User segment]
*Why it matters*: [The benefit, not the feature]

👉 [Try it here] | 📖 [Docs] | 💬 Drop feedback in #product
```

**Weekly GTM Standup**:
```
📊 *GTM Weekly — [Date]*

✅ *Launched*: [What shipped]
📈 *Numbers*: [Key metric update]
🔨 *This week*: [Priority focus]
🚧 *Blockers*: [None / describe]
```

**ICP Win Announcement**:
```
🎉 *New Customer: [Company Name]*

Industry: [X] | Size: [Y] | ARR: [$Z]
Pain solved: [What they struggled with before]
Why us: [What tipped them our way]

cc @sales @product — great signal for ICP refinement 🎯
```

### Google Drive — Folder Structure for GTM
```
📁 GTM/
├── 📁 Positioning/
│   ├── Positioning Doc v1.0
│   ├── Messaging Framework
│   └── Tagline Options
├── 📁 ICP Research/
│   ├── ICP Profile — [Segment A]
│   ├── Customer Interview Notes
│   └── Competitor Research
├── 📁 Launch Plans/
│   ├── Launch Plan — [Product Name]
│   └── Launch Runbook
├── 📁 Outreach/
│   ├── Email Sequences
│   ├── LinkedIn Scripts
│   └── Battle Cards
└── 📁 Metrics & Reporting/
    ├── Launch Dashboard
    └── Weekly GTM Report
```

---

## 9. GTM Anti-Patterns

### ❌ Avoid These
- **Launching to everyone** — No ICP = weak message = poor conversion
- **Feature-first positioning** — Customers buy outcomes, not features
- **One-touch outreach** — 80% of deals close after 5+ touchpoints
- **Copying competitor messaging** — You'll lose on their terms, not yours
- **No launch metrics** — If you can't measure it, you can't improve it
- **Launching without internal alignment** — Sales/support uninformed = bad first impressions

### ✅ GTM Principles
- Talk to 10 ICPs before writing a single positioning line
- Your best messaging comes from customer interviews, not brainstorming
- Distribution beats product — a great product with no GTM loses to a mediocre product with great GTM
- Nail one channel before expanding to the next
- Iterate messaging every 4 weeks based on conversion data

---

## Resources
- Positioning — April Dunford (Book): aprildunford.com
- Obviously Awesome (Book): on product positioning
- The Mom Test — Rob Fitzpatrick (customer interviews)
- Product Hunt launch guide: blog.producthunt.com
- Lenny's Newsletter (GTM tactics): lennysnewsletter.com
- SaaStr (B2B GTM): saastr.com
