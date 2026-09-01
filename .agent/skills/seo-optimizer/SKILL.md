---
name: seo-optimizer
description: Optimizes websites and content for higher Google rankings. Applies keyword strategy, on-page SEO, technical SEO, meta tags, schema markup, and content best practices. Use when building web pages, writing content, auditing sites, or improving search visibility and organic traffic.
---

# SEO Optimizer — Full-Stack Search Engine Optimization

## When to Use This Skill
- Building or auditing any web page or website
- Writing SEO-friendly content, blog posts, or landing pages
- Generating meta titles, descriptions, or structured data
- Improving page speed, Core Web Vitals, or mobile usability
- Planning keyword strategy or content structure
- Reviewing a site for technical SEO issues

---

## 1. Core SEO Principles

> **Rule #1**: Optimize for humans first, search engines second.

- Focus on **user intent** — match content to what the searcher actually wants
- Create **valuable, original, and comprehensive** content (not thin or duplicate)
- Ensure **fast, mobile-friendly, and secure** pages (HTTPS required)
- Follow **white-hat SEO only** — no keyword stuffing, cloaking, or link schemes
- Build **topical authority** — cover a subject deeply, not just broadly
- **E-E-A-T**: Demonstrate Experience, Expertise, Authoritativeness, Trustworthiness

---

## 2. Keyword Strategy

### Step 1 — Keyword Research Process
1. Start with your **seed keyword** (core topic)
2. Expand to **secondary keywords** (related subtopics)
3. Find **long-tail keywords** (specific 4–6 word queries with lower competition)
4. Check **search volume + keyword difficulty** (target low-difficulty, decent volume)
5. Analyze **SERP features** (does Google show maps, snippets, videos?)

### Keyword Types
| Type | Definition | Example |
|---|---|---|
| **Primary** | Main topic keyword | "project management software" |
| **Secondary** | Supporting terms | "task tracking tool", "team collaboration app" |
| **Long-tail** | Specific queries | "best project management software for small teams" |
| **LSI/Semantic** | Related concepts | "Gantt chart", "sprint planning", "Kanban board" |

### Search Intent Types
| Intent | User Goal | Content Type |
|---|---|---|
| **Informational** | Learn something | Blog posts, guides, FAQs |
| **Navigational** | Find a specific site | Brand pages, login pages |
| **Transactional** | Buy or download now | Product pages, pricing pages |
| **Commercial** | Compare before buying | Reviews, comparisons, "best X" lists |

> **Match content type to intent** — a transactional keyword needs a landing page, not a blog post.

### Keyword Placement Strategy
- **H1 (Title)**: Include primary keyword naturally — once only
- **Meta Title**: Primary keyword, ideally near the start
- **Meta Description**: Include primary + one secondary keyword
- **First 100 words**: Primary keyword appears early
- **H2–H3 headings**: Secondary and long-tail keywords
- **URL slug**: Short, keyword-rich (dashes not underscores)
- **Image alt text**: Descriptive, keyword-relevant
- **Body copy**: Use keyword variants naturally every 100–150 words

---

## 3. On-Page SEO Checklist

### Content
- [ ] Primary keyword in H1 (once only)
- [ ] Keyword in first 100 words of content
- [ ] Secondary keywords in H2/H3 headings
- [ ] LSI/semantic keywords used naturally in body
- [ ] Content fully covers the topic (comprehensive, not thin)
- [ ] No duplicate content (use canonical tags if needed)
- [ ] Reading level appropriate for target audience

### Structure
- [ ] Single H1 per page
- [ ] Logical heading hierarchy: H1 → H2 → H3 (no skipping)
- [ ] Short paragraphs (2–4 lines max for readability)
- [ ] Bullet points and numbered lists for scannable content
- [ ] Table of contents for long-form content (1000+ words)

### Links
- [ ] Internal links to relevant pages (2–5 per page minimum)
- [ ] External links to authoritative sources (opens in new tab)
- [ ] All links use descriptive anchor text (not "click here")
- [ ] No broken links (404s)

### Visuals
- [ ] All images have descriptive alt text with keywords where natural
- [ ] Images compressed (WebP format preferred, <100KB ideally)
- [ ] Videos embedded with captions/transcripts for accessibility

### Technical On-Page
- [ ] Page loads in under 3 seconds
- [ ] Mobile-responsive layout
- [ ] HTTPS enabled
- [ ] Canonical tag set correctly
- [ ] No keyword cannibalization with other pages

---

## 4. Meta Tags — Structure & Templates

### Title Tag
- **Length**: 50–60 characters (Google truncates at ~580px width)
- **Format**: `Primary Keyword | Brand Name` or `Primary Keyword — Compelling Hook`
- **Rules**: Include keyword near the start, make it compelling to click

```html
<!-- Informational page -->
<title>How to Learn Python in 30 Days | Complete Beginner Guide</title>

<!-- Product/transactional page -->
<title>Buy Noise Cancelling Headphones — Free Shipping | SoundGeek</title>

<!-- Local business -->
<title>Plumber in Mumbai | 24/7 Emergency Plumbing Services</title>
```

### Meta Description
- **Length**: 150–160 characters (120–150 for mobile)
- **Format**: Describe the page value + include CTA + keyword
- **Rules**: Not a ranking factor directly, but affects CTR — write for humans

```html
<!-- Good meta description -->
<meta name="description" content="Learn Python from scratch with our 30-day structured guide. Includes projects, quizzes, and hands-on exercises. Start coding today — completely free.">

<!-- Product page -->
<meta name="description" content="Shop premium noise-cancelling headphones with 40hr battery life. Free shipping on orders over ₹999. 30-day returns. Rated 4.8/5 by 12,000+ customers.">
```

### Open Graph Tags (Social Sharing)
```html
<meta property="og:title" content="Page Title Here">
<meta property="og:description" content="Compelling description for social sharing">
<meta property="og:image" content="https://yoursite.com/og-image.jpg">
<meta property="og:url" content="https://yoursite.com/page-url">
<meta property="og:type" content="website">
```

### Twitter Card Tags
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title Here">
<meta name="twitter:description" content="Description for Twitter">
<meta name="twitter:image" content="https://yoursite.com/twitter-image.jpg">
```

### Robots Meta Tag
```html
<!-- Default: index and follow all links -->
<meta name="robots" content="index, follow">

<!-- Block from indexing (login pages, admin panels) -->
<meta name="robots" content="noindex, nofollow">

<!-- Index page but don't follow links -->
<meta name="robots" content="index, nofollow">
```

---

## 5. URL Structure

### Rules
- Use hyphens (`-`) not underscores (`_`)
- All lowercase letters
- Short and descriptive — remove stop words (a, the, and, of)
- Include primary keyword
- No special characters, dates (unless news), or random strings

```
✅ yoursite.com/seo-tips-beginners
✅ yoursite.com/blog/keyword-research-guide
❌ yoursite.com/blog/post?id=1234
❌ yoursite.com/p=how-to-do-seo-in-2024-updated-version-final
❌ yoursite.com/SEO_Tips_For_Beginners
```

---

## 6. Technical SEO

### Core Web Vitals (Google Ranking Signals)
| Metric | What It Measures | Target |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Loading performance | ≤ 2.5 seconds |
| **INP** (Interaction to Next Paint) | Interactivity | ≤ 200ms |
| **CLS** (Cumulative Layout Shift) | Visual stability | ≤ 0.1 |

### Page Speed Optimization
- Serve images in **WebP/AVIF** format
- Enable **lazy loading** for images below the fold (`loading="lazy"`)
- **Minify** HTML, CSS, and JavaScript
- Enable **Gzip/Brotli compression** on server
- Use a **CDN** (Content Delivery Network)
- Eliminate **render-blocking resources** (defer non-critical JS)
- Set correct **cache headers** for static assets
- Use **system fonts** or preload Google Fonts

```html
<!-- Preload critical font -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Lazy load images -->
<img src="hero.webp" alt="Hero Image" loading="lazy" width="800" height="400">
```

### Crawlability & Indexability
- **robots.txt** — Control which pages bots can crawl
- **XML Sitemap** — Submit to Google Search Console
- **Canonical Tags** — Prevent duplicate content issues
- **Pagination** — Use `rel="next"` and `rel="prev"` or paginated canonical

```txt
# robots.txt example
User-agent: *
Disallow: /admin/
Disallow: /login/
Allow: /
Sitemap: https://yoursite.com/sitemap.xml
```

```html
<!-- Canonical tag — in <head> -->
<link rel="canonical" href="https://yoursite.com/correct-url/">
```

### Mobile SEO
- Use responsive design (CSS media queries)
- Set viewport meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
- Touch targets ≥ 48px (no zoom required to tap links)
- No horizontal scrolling
- Font size ≥ 16px for body text
- Test with Google Mobile-Friendly Test

### HTTPS & Security
- All pages must be served over HTTPS
- Set up proper 301 redirects from HTTP → HTTPS
- Avoid mixed content (HTTP resources on HTTPS pages)

---

## 7. Schema Markup (Structured Data)

Schema helps Google display **rich results** (stars, FAQs, prices, etc.) in SERPs.

### Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Learn SEO in 30 Days",
  "author": { "@type": "Person", "name": "Aman Pal" },
  "datePublished": "2026-03-28",
  "image": "https://yoursite.com/image.jpg",
  "publisher": {
    "@type": "Organization",
    "name": "YourSite",
    "logo": { "@type": "ImageObject", "url": "https://yoursite.com/logo.png" }
  }
}
```

### FAQ Schema (Boosts SERP real estate)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO (Search Engine Optimization) is the process of improving a website's visibility in search engine results pages."
      }
    }
  ]
}
```

### Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Headphones Pro",
  "image": "https://yoursite.com/headphones.jpg",
  "description": "Premium noise-cancelling wireless headphones.",
  "offers": {
    "@type": "Offer",
    "price": "4999",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1247"
  }
}
```

### Local Business Schema
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Quick Fix Plumbing",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 MG Road",
    "addressLocality": "Mumbai",
    "postalCode": "400001",
    "addressCountry": "IN"
  },
  "telephone": "+91-9876543210",
  "openingHours": "Mo-Su 00:00-23:59"
}
```

> Add schema JSON-LD inside a `<script type="application/ld+json">` tag in `<head>`.

---

## 8. Content SEO Strategy

### Content Length Guidelines
| Page Type | Recommended Length |
|---|---|
| Blog post (informational) | 1,500–3,000 words |
| Pillar/cornerstone page | 3,000–5,000 words |
| Product page | 300–800 words |
| Landing page | 500–1,500 words |
| FAQ answer | 40–300 words per answer |

### Content Structure (for Ranking)
```
H1: Primary Keyword — Compelling Title
  [Introduction: Hook + what this page covers + primary keyword in first 100 words]

H2: Main Topic Section 1 (Secondary Keyword)
  H3: Subtopic
  H3: Subtopic

H2: Main Topic Section 2 (Secondary Keyword)
  H3: Subtopic

H2: FAQ Section (long-tail keywords as questions)
  H3: Question 1?
  H3: Question 2?

H2: Conclusion
  [Summary + CTA + internal link to related content]
```

### E-E-A-T Signals to Include
- **Experience**: First-person examples, case studies, original research
- **Expertise**: Author bio with credentials, cite sources
- **Authoritativeness**: Backlinks from trusted sites, mentions in press
- **Trustworthiness**: HTTPS, clear contact info, privacy policy, reviews

### Content Freshness
- Update old posts with new data and mark `dateModified` in schema
- Add a "Last Updated: [Date]" timestamp visibly on the page
- Re-promote refreshed content as if it's new

---

## 9. Link Building Strategy

### Internal Linking
- Link from high-authority pages to pages you want to rank
- Use descriptive anchor text (not "click here" or "read more")
- Aim for 2–5 relevant internal links per page
- Create a **content hub**: Pillar page → Cluster pages → Pillar page (reciprocal)

### External / Backlink Acquisition (White-Hat)
| Tactic | Description |
|---|---|
| **Guest Posting** | Write for authoritative niche sites with a bio link |
| **HARO / Qwoted** | Respond to journalist queries for press mentions |
| **Resource Link Building** | Get listed on curated "best tools" or resource pages |
| **Broken Link Building** | Find dead links on other sites, offer your page as replacement |
| **Original Research** | Publish data/studies — other sites cite and link naturally |
| **Skyscraper Technique** | Find top-ranked content, make something demonstrably better |

### Link Quality Signals
- **Domain Authority / Rating (DA/DR)**: Higher = better
- **Topical Relevance**: A cooking blog linking to a tech tool is low value
- **Dofollow vs. Nofollow**: Dofollow passes SEO value; nofollow still has referral traffic value
- **Link placement**: In-content links outperform footer/sidebar links

---

## 10. Local SEO (If Applicable)

- Create and optimize **Google Business Profile** (name, address, phone, hours, photos)
- Get consistent **NAP** (Name, Address, Phone) across all directories
- Collect **Google Reviews** (quantity + recency + rating all matter)
- Use **local keywords**: "[Service] in [City]" or "[City] [Service]"
- Build local citations on directories (Justdial, Sulekha, IndiaMART for India)
- Add **Local Business Schema** (see Section 7)
- Create location-specific landing pages for multi-location businesses

---

## 11. SEO Audit Checklist

### 🔍 Crawl & Index
- [ ] All important pages are indexable (check robots.txt + meta robots)
- [ ] XML sitemap submitted to Google Search Console
- [ ] No crawl errors in Google Search Console (404s, server errors)
- [ ] Canonical tags correctly implemented

### 📄 On-Page
- [ ] Every page has a unique title tag (50–60 chars)
- [ ] Every page has a unique meta description (150–160 chars)
- [ ] Single H1 per page with primary keyword
- [ ] Logical heading structure (H1 → H2 → H3)
- [ ] All images have alt text
- [ ] Internal links use descriptive anchor text

### ⚡ Performance
- [ ] LCP ≤ 2.5s (test with PageSpeed Insights)
- [ ] CLS ≤ 0.1
- [ ] INP ≤ 200ms
- [ ] Images served in WebP/AVIF format
- [ ] JS/CSS minified and compressed

### 🔒 Technical
- [ ] HTTPS enforced (no HTTP pages or mixed content)
- [ ] Mobile-friendly (Google Mobile-Friendly Test passes)
- [ ] No duplicate content issues
- [ ] Structured data validated (Google Rich Results Test)
- [ ] 301 redirects for changed/deleted URLs

### 🔗 Links
- [ ] No broken internal links
- [ ] External links open in new tab
- [ ] Backlink profile clean (no spammy links — use Google Disavow if needed)

---

## 12. SEO Mistakes to Avoid

### ❌ Critical Errors
- **Keyword stuffing** — Repeating keywords unnaturally; triggers Google penalty
- **Duplicate content** — Same content on multiple URLs; use canonical tags
- **Blocking CSS/JS in robots.txt** — Prevents Google from rendering your page
- **Missing canonical tags** — Causes Google to split ranking signals across URLs
- **Slow page speed** — Each 1-second delay drops conversions by ~7%
- **Ignoring mobile** — Google uses mobile-first indexing
- **Buying spammy backlinks** — Triggers manual penalty; very hard to recover from

### ⚠️ Common Mistakes
- Using exact-match anchor text for all backlinks (looks unnatural)
- No internal linking strategy (leaves pages as "orphans")
- Writing content without checking search intent (ranking for the wrong thing)
- Not having an XML sitemap submitted
- Multiple H1 tags on a page
- Using JavaScript-rendered content without SSR (Googlebot may not index it)
- Forgetting to update old content (loses freshness signal over time)

---

## 13. SEO Tools Reference

| Tool | Purpose | Cost |
|---|---|---|
| **Google Search Console** | Indexing, ranking, crawl errors | Free |
| **Google Analytics 4** | Traffic, user behavior | Free |
| **PageSpeed Insights** | Core Web Vitals analysis | Free |
| **Ahrefs / SEMrush** | Keyword research, backlinks, audit | Paid |
| **Ubersuggest** | Keyword research, site audit | Free/Paid |
| **Screaming Frog** | Full site crawl & audit | Free (500 URLs) |
| **Google Rich Results Test** | Validate schema markup | Free |
| **Yoast SEO / RankMath** | WordPress on-page SEO | Free/Paid |
| **AnswerThePublic** | Question-based keyword ideas | Free/Paid |

---

## Resources
- Google Search Central: developers.google.com/search
- Google Search Console: search.google.com/search-console
- Core Web Vitals: web.dev/vitals
- Schema.org reference: schema.org
- Ahrefs SEO Blog: ahrefs.com/blog
- Moz Beginner's Guide: moz.com/beginners-guide-to-seo
