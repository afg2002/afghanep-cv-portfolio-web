# Product Requirements Document (PRD)
## Personal Portfolio Website — Afghan Eka Pangestu

---

| Field | Detail |
|---|---|
| **Project** | Personal Portfolio Website |
| **Owner** | Afghan Eka Pangestu |
| **Role** | Software Developer — Web Application & API Developer |
| **Location** | Bogor, Indonesia |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-05-03 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Goals & Success Metrics](#2-goals--success-metrics)
3. [Target Audience](#3-target-audience)
4. [Brand & Tone](#4-brand--tone)
5. [Visual Design System](#5-visual-design-system)
6. [Site Architecture & Navigation](#6-site-architecture--navigation)
7. [Page / Section Specifications](#7-page--section-specifications)
   - [7.1 Hero Section](#71-hero-section)
   - [7.2 About Section](#72-about-section)
   - [7.3 Skills Section](#73-skills-section)
   - [7.4 Experience Section](#74-experience-section)
   - [7.5 Featured Projects Section](#75-featured-projects-section)
   - [7.6 Education Section](#76-education-section)
   - [7.7 Certifications Section](#77-certifications-section)
   - [7.8 Blog Section](#78-blog-section)
   - [7.9 Contact Section](#79-contact-section)
   - [7.10 Footer](#710-footer)
8. [Blog Engine Requirements](#8-blog-engine-requirements)
9. [Technical Requirements](#9-technical-requirements)
10. [Performance & SEO](#10-performance--seo)
11. [Responsive Behavior](#11-responsive-behavior)
12. [Accessibility](#12-accessibility)
13. [Out of Scope](#13-out-of-scope)
14. [Open Questions](#14-open-questions)
15. [Appendix: Full Content Copy](#15-appendix-full-content-copy)

---

## 1. Executive Summary

Afghan Eka Pangestu needs a premium personal portfolio website that positions him as a credible, technically-strong Software Developer with hands-on experience in modern web applications and APIs for both enterprise and freelance projects. The site must communicate clean architecture, scalability, maintainability, and practical business impact to recruiters, hiring managers, startup founders, enterprise clients, and technical collaborators.

The website will be a single-page application (SPA) with a dedicated blog section. It must feel polished, professional, structured, and technically strong — avoiding generic AI-generated aesthetics.

---

## 2. Goals & Success Metrics

### Primary Goals

| # | Goal | Success Metric |
|---|---|---|
| G1 | Present Afghan as a professional, hireable software developer | Qualitative: portfolio conveys trust, structure, and technical depth |
| G2 | Drive contact inquiries from recruiters and clients | Track CTA clicks on "Contact Me" and contact form submissions |
| G3 | Showcase real project experience with credibility | Each project card tells a clear tech-stack + impact story |
| G4 | Demonstrate technical writing & thought leadership via blog | Blog page views, time-on-page, social shares |
| G5 | Achieve fast, responsive, SEO-friendly performance | Lighthouse score ≥ 90 across all categories |

### Secondary Goals

- Serve as a single source of truth for Afghan's professional profile
- Rank on Google for "Software Developer Bogor", "Web Developer Indonesia", and related queries
- Provide an easy-to-update blog engine with markdown support

---

## 3. Target Audience

| Persona | What They Need |
|---|---|
| **Recruiters / Talent Acquisition** | Quick scan of role, skills, experience timeline, and contact info |
| **Engineering Managers / Tech Leads** | Evidence of technical depth, project complexity, architecture thinking |
| **Startup Founders** | Can this person build things end-to-end? Freelance availability? |
| **Enterprise Clients** | Past enterprise project experience, professionalism, reliability signals |
| **Technical Peers / Collaborators** | Blog content, GitHub link, tech stack alignment |

---

## 4. Brand & Tone

### Personality

- **Professional** — not corporate-stiff; confident and direct
- **Technically strong** — clear architecture, no fluff
- **Structured** — information hierarchy is obvious; scanning is easy
- **Trustworthy** — premium but not flashy; substance over decoration
- **Approachable** — open to opportunities, collaborative tone in copy

### Voice

- First-person where personal (About, Hero subtitle)
- Third-person neutral for factual sections (Experience, Education)
- Active, concise sentences
- No buzzwords or hype; let the work speak

---

## 5. Visual Design System

### 5.1 Design Direction

**Simple, elegant dark-mode portfolio.** The aesthetic is clean, refined, and understated — a premium dark interface with teal/emerald accents. Typography leads; color is used sparingly for emphasis and wayfinding. Cards are structured with generous breathing room. No terminal panels, no code-themed gimmicks, no gradients, no neon, no cartoons. The design communicates sophistication through restraint.

### 5.2 Color Palette

| Token | Hex | Usage |
|---|---|---|
| **Background Primary** | `#0d1117` | Main page background |
| **Background Secondary** | `#161b22` | Card surfaces, nav background |
| **Background Elevated** | `#1c2128` | Hover states, modals, elevated cards |
| **Border Subtle** | `#21262d` | Card borders, dividers |
| **Border Accent** | `#30363d` | Stronger borders, input fields |
| **Text Primary** | `#e6edf3` | Headlines, body text |
| **Text Secondary** | `#8b949e` | Dates, metadata, captions |
| **Text Muted** | `#484f58` | Placeholders, disabled text |
| **Accent Primary** | `#14b8a6` | Teal — primary CTA, active nav, links |
| **Accent Secondary** | `#10b981` | Emerald — skill badges, highlights, secondary accents |
| **Accent Glow** | `rgba(20,184,166,0.15)` | Subtle accent glows on hover |

### 5.3 Typography

| Role | Font Stack | Weight | Notes |
|---|---|---|---|
| **Display / Hero** | `"JetBrains Mono", "Fira Code", monospace` | 700 | Developer-first monospace headline; distinctive, technical |
| **Headings** | `"Plus Jakarta Sans", "Inter", sans-serif` | 600–700 | Clean geometric sans for section titles |
| **Body** | `"Plus Jakarta Sans", "Inter", sans-serif` | 400–500 | Readable at 15–16px |
| **Code / Tags** | `"JetBrains Mono", "Fira Code", monospace` | 400 | Tech stack tags, inline code |
| **Captions** | `"Plus Jakarta Sans", "Inter", sans-serif` | 400 | 13px metadata |

### 5.4 Spacing Scale

Base unit: `4px`

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 4px | Inline gaps, tight icon spacing |
| `space-sm` | 8px | Card padding (small), list gaps |
| `space-md` | 16px | Standard padding, card gaps |
| `space-lg` | 24px | Section-internal spacing |
| `space-xl` | 32px | Card padding (large), component gaps |
| `space-2xl` | 48px | Section padding (vertical) |
| `space-3xl` | 64px | Large section gaps |
| `space-4xl` | 96px | Hero spacing, major section breaks |
| `space-5xl` | 128px | Page-level breathing room |

### 5.5 Elevation & Depth

No heavy drop shadows. Depth is created via:

- Surface color alternation (primary bg → secondary bg → elevated)
- Subtle 1px borders (`#21262d`)
- A single refined `box-shadow` for hover lift:
  ```
  box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(20,184,166,0.08);
  ```
- Accent glow on interactive elements (teal at 15% opacity)

### 5.6 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Inline code, small tags |
| `radius-md` | 8px | Cards, buttons, inputs |
| `radius-lg` | 12px | Larger cards, modals |
| `radius-xl` | 16px | Featured project cards, hero visual panel |
| `radius-full` | 9999px | Pills: skill badges, CTA buttons |

### 5.7 Iconography

- Use `@phosphor-icons/web` (Phosphor Icons) — thin-to-regular weight, geometric, developer-friendly
- No emoji as icons
- No cartoon illustrations
- Optional: subtle geometric SVG patterns or code-inspired line art for the hero visual panel

---

## 6. Site Architecture & Navigation

### 6.1 Sticky Top Navigation

Always visible, frosted glass effect (`backdrop-filter: blur(12px)` over semi-transparent dark background).

```
[Logo/Initials]  [Home] [About] [Skills] [Experience] [Projects] [Blog] [Contact]
```

- Active section highlighted with teal accent underline
- Mobile: hamburger menu → slide-out drawer from right
- Smooth scroll to anchor sections on the homepage
- "Blog" navigates to `/blog` (separate route)

### 6.2 URL Structure

| Route | Content |
|---|---|
| `/` | Single-page portfolio (all sections) |
| `/blog` | Blog index — list of articles |
| `/blog/[slug]` | Individual blog article |

### 6.3 Page Shell

```
┌──────────────────────────────────────────┐
│ [Sticky Nav]                             │
├──────────────────────────────────────────┤
│                                          │
│  Hero                                    │
│  About                                   │
│  Skills                                  │
│  Experience                              │
│  Projects                                │
│  Education                               │
│  Certifications                          │
│  Contact                                 │
│                                          │
├──────────────────────────────────────────┤
│ [Footer]                                 │
└──────────────────────────────────────────┘
```

---

## 7. Page / Section Specifications

### 7.1 Hero Section

**Purpose:** Make an immediate strong impression. Tell visitors who Afghan is, what he does, and give them a clear next action.

**Layout (Desktop):**

```
┌──────────────────────┬──────────────────────┐
│                      │                      │
│  AFGHAN EKA          │   ┌──────────────┐   │
│  PANGESTU            │   │              │   │
│                      │   │  Abstract    │   │
│  Software Developer  │   │  Geometric   │   │
│                      │   │  Visual      │   │
│  Web Application &   │   │              │   │
│  API Developer       │   │  (dark bg,   │   │
│                      │   │  subtle      │   │
│  Short bio (2-3      │   │  layered     │   │
│  lines)              │   │  shapes,     │   │
│                      │   │  teal tones) │   │
│  [View Projects]     │   │              │   │
│  [Contact Me]        │   └──────────────┘   │
│                      │                      │
│  📞 085156283645     │                      │
│  ✉️ afghan...@gmail  │                      │
│  🔗 LinkedIn  GitHub │                      │
│  📍 Bogor, Indonesia │                      │
└──────────────────────┴──────────────────────┘
```

**Content:**

- **Name:** AFGHAN EKA PANGESTU (display type, monospace, large)
- **Role:** Software Developer
- **Subtitle:** Web Application & API Developer
- **Summary:**
  > Software Developer with hands-on experience in building modern web applications and APIs for both enterprise and freelance projects. Proficient in Vue.js, Vuetify, MongoDB, Laravel, and Java Spring Boot, with a strong focus on clean architecture, scalability, and maintainability.
- **CTA Buttons:**
  - Primary: "View Projects" → smooth scroll to Projects section
  - Secondary: "Contact Me" → smooth scroll to Contact section
- **Quick Contact Strip:**
  - Phone: `085156283645`
  - Email: `afghanekapangestu@gmail.com`
  - LinkedIn: `linkedin.com/in/afghan-eka-pangestu/`
  - GitHub: `github.com/afg2002`
  - Location: `Bogor, Indonesia`

**Visual Panel (Right Side):**
A simple, elegant abstract visual — not a terminal or code panel:
- A clean geometric composition: subtle layered shapes, thin lines, or a minimalist dot/hex pattern
- Dark surface (`#161b22`) with teal accent elements at low opacity
- Rounded corners (`radius-xl`)
- Purely decorative; no interactive elements
- The visual should feel premium and architectural, not gimmicky

**Animations:**
- Name and title fade-slide up on load (staggered, `animation-delay`)
- Visual panel fades in simultaneously
- CTA buttons scale slightly on hover
- Contact icons have subtle hover color transitions to teal

---

### 7.2 About Section

**Purpose:** Give a concise professional bio that builds credibility and personal connection.

**Layout:** Clean centered or left-aligned paragraph block with generous margins. Optional: a small profile photo or monogram.

**Content:**

> I am a software developer with experience delivering modern web applications, internal enterprise tools, chatbot-related solutions, and project-based systems. I am comfortable working with frontend and backend technologies and collaborating with teams to translate business requirements into reliable technical solutions. I focus on maintainable architecture, continuous improvement, and delivering useful technology for real users.

**Design Notes:**
- Use a slightly larger body font (17–18px) for readability
- Max-width ~680px for optimal reading line length
- Subtle left border accent (2px teal) or a small decorative element
- No card container — let the text breathe on the dark background
- Section heading: "About" with a subtle teal underline or bracket decoration

---

### 7.3 Skills Section

**Purpose:** Show technical breadth at a glance. Let recruiters quickly match keywords.

**Layout:** Skills grouped into categories, displayed as a grid of cards. Each card has:
- Category heading
- Skill badges/pills

**Skill Categories:**

| Category | Skills |
|---|---|
| **Frontend** | HTML, CSS, JavaScript, Vue.js, Vue.js 2, Vuetify, React |
| **Backend** | PHP, Laravel, Java, Spring Boot, Golang, Express |
| **Database & Tools** | MongoDB, MySQL, Git, Terminal, Visual Studio Code |
| **Professional Strengths** | Clean Architecture, Scalability, Maintainability, Teamwork, Communication, Problem Solving, Adaptation |
| **Languages** | Indonesia (Active), English (Passive) |

**Design:**
- 3-column grid on desktop (collapses to 2 on tablet, 1 on mobile)
- Each category card: `background-secondary`, `radius-md`, 1px border
- Skill badges: pill-shaped (`radius-full`), outlined with `border-accent`, `text-secondary`, monospace font
- Hover: badge gets teal border + subtle glow
- Category heading: `text-primary`, 18px, weight 600

**Optional Enhancement:** Add a small icon per category (Phosphor Icons: `Code`, `Server`, `Database`, `Lightbulb`, `Translate`)

---

### 7.4 Experience Section

**Purpose:** Show career progression with real companies, real responsibilities, and real impact. This is the trust-builder section.

**Layout:** Premium vertical timeline or alternating card layout. Each entry is a card or timeline node.

**Experience Entries:**

#### 1. PT Inmotion Inovasi Teknologi
- **Role:** Web Developer | Full Time
- **Period:** Feb 2024 – Jun 2024
- **Highlights:**
  - Developed applications using Java and MVEL for chatbot, omni-channel, Generative AI, and SRM solutions
  - Integrated Salesforce with chat platforms for a major national bank
  - Built chatbot solutions for financial institution automation
  - Designed WhatsApp Flows integrated with hospital scheduling and digital services
  - Provided technical consultation directly to clients

#### 2. PT BTPN Syariah Tbk
- **Role:** Web Developer | Internship
- **Period:** Feb 2024 – Jun 2024
- **Highlights:**
  - Developed a router application using Spring Boot and Vue.js 2 for dashboard listing and log monitoring
  - Assisted the Product Owner in documenting user feedback surveys
  - Participated in the MSIB Batch 6 program

#### 3. PT Ciptanusa Nuansa Mulia
- **Role:** Web Developer | Freelance
- **Period:** Sep 2023 – Dec 2023
- **Highlights:**
  - Developed a project management application using Laravel
  - Implemented project calculation, budgeting (RAB), and vendor management features
  - Improved workflow efficiency across the project management process

#### 4. PT Bintang Bahagia Selalu — Royal Star
- **Role:** Web Developer | Freelance
- **Period:** Sep 2022 – Oct 2022
- **Highlights:**
  - Improved the front-end user interface by enhancing slider, video display, navigation menu, and WhatsApp button
  - Improved the overall user experience and visual appearance

#### 5. CV Mitrasoft Global
- **Role:** Web Developer | Internship
- **Period:** Jan 2019 – Mar 2019
- **Highlights:**
  - Developed and migrated a desktop-based customer back-office application to a web platform using Java Spring
  - Improved operational efficiency by implementing new features and a more responsive user interface

**Design Notes:**
- Timeline: vertical line on the left (2px, `border-subtle`), with accent dots (8px circle, teal) at each entry
- Each entry: card with `background-secondary`, `radius-md`, subtle left border-highlight on hover
- Period badge: small pill, `text-secondary`, monospace
- Role: `text-primary`, weight 600
- Highlights: bullet list with teal bullet markers (`::before` pseudo-elements)
- Company name: weight 700, `text-primary`
- Employment type badge (Full Time / Freelance / Internship): small outlined pill in teal

---

### 7.5 Featured Projects Section

**Purpose:** Demonstrate real, shipped projects with tech stack and context. This is the proof-of-work section.

**Layout:** 2-column card grid on desktop (1 column on mobile). Each card is a premium case-study-style block.

**Primary Projects (6 featured):**

| # | Project | Year | Stack | Summary |
|---|---|---|---|---|
| 1 | SehatSegar.my.id | — | Laravel | Point-of-sale web application for product management, inventory tracking, cashier transactions, and sales reporting with dashboard and multi-user access |
| 2 | Movie Ticket Booking Web | 2024 | Vue.js 2, Vuetify, MongoDB | Movie ticket booking web application |
| 3 | Web Zero Waste Massive | 2024 | React, Express | API for cleaning service booking application |
| 4 | Project Management App | 2023 | Laravel | Budgeting, project calculation, and vendor management features |
| 5 | Router Dashboard App | 2024 | Spring Boot, Vue.js 2 | Dashboard listing and log monitoring |
| 6 | Baca Komik | 2020 | Python | Comic scraping and PDF conversion tool with search feature |

**Secondary Projects ("More Projects"):**

- Digital Library Web
- GYM Information System
- Boarding House Selection DSS with AHP
- Inventory Management Information System
- Major Selection Expert System
- Best Employee DSS with SAW
- Dengue Fever and Typhoid Diagnosis Expert System
- Java Swing Academic Information System

**Design:**
- Each card: `background-secondary`, `radius-lg`, 1px border
- Project title: weight 700, 20px
- Year badge: small pill, `text-muted`
- Tech stack tags: monospace pills with `border-accent`, teal on hover
- Summary: `text-secondary`, 15px
- Hover: card lifts slightly (`translateY(-4px)`), border accent changes to teal glow
- Secondary projects: smaller grid (3–4 columns), simpler cards with title + year only, expandable or in a collapsible section

**Card Skeleton During Development:**
```
┌─────────────────────────────────┐
│                                 │
│  Project Title          [2024]  │
│                                 │
│  Summary description goes here  │
│  in 2-3 lines maximum.          │
│                                 │
│  [Laravel] [Vue.js] [MySQL]     │
│                                 │
│  [View Project →]  [GitHub ↗]   │
│                                 │
└─────────────────────────────────┘
```

---

### 7.6 Education Section

**Purpose:** Establish formal qualifications and academic achievements.

**Layout:** Two clean cards in a vertical stack or side-by-side on desktop.

#### Entry 1: Universitas Indraprasta PGRI
- **Degree:** Bachelor of Informatics Engineering
- **Period:** 2020 – 2024
- **GPA:** 3.62 / 4.00
- **Highlights:**
  - Recommended as Laboratory Assistant
  - Participated in MSIB Batch 6
  - Published journal work on a decision support system for gastric disease diagnosis using the Forward Chaining method

#### Entry 2: SMK Negeri 1 Cibinong
- **Degree:** Software Engineering
- **Period:** 2017 – 2020
- **Score:** 84 / 100
- **Highlights:**
  - Earned LSP certification in Software Development with 23 competency units

**Design Notes:**
- Clean card layout (not timeline — education is shorter)
- GPA/Score displayed prominently as a stat badge
- Institution name: weight 700
- Period and highlights: same styling as Experience section

---

### 7.7 Certifications Section

**Purpose:** Quick validation of continuous learning and formal recognition.

**Layout:** Horizontal scroll or grid of compact cards.

**Certifications:**

| Certification | Issuer | Year |
|---|---|---|
| Theoretical Understanding of HTML | Sololearn | 2018 |
| Theoretical Understanding of PHP | Sololearn | 2018 |
| Pemrograman Go-Lang: Pemula sampai Mahir | Udemy | 2022 |
| Kampus Merdeka MSIB Batch 6 | PT BTPN Syariah Tbk | 2024 |

**Design:**
- Horizontal scrollable row of cards (or 2x2 grid)
- Each card: compact, `background-secondary`, icon + title + issuer + year
- Icons: Phosphor `Certificate` or `Award`
- Hover: subtle border accent + shadow lift

---

### 7.8 Blog Section

**Purpose:** Demonstrate technical writing, thought leadership, and improve SEO through content. The blog uses markdown files for content, with a generated index page.

**Blog Index Page (`/blog`):**

- Page heading: "Blog" or "Writing"
- Subtitle: "Thoughts on software development, architecture, and building for the web."
- Article list: card-based grid (2 columns desktop, 1 mobile)
- Each article card shows:
  - Title
  - Published date
  - Reading time (auto-calculated)
  - Excerpt / first 150 characters
  - Category/tag pills
  - Optional: cover image thumbnail
- Filter/search by tag or keyword
- Pagination or "Load More" for 10+ articles

**Blog Article Page (`/blog/[slug]`):**

- Rendered from markdown files
- Table of Contents (auto-generated from headings, sticky sidebar on desktop, collapsible on mobile)
- Responsive images with lazy loading
- Code blocks with syntax highlighting (dark theme, monospace)
- Reading progress bar at top of page
- Article metadata: date, reading time, author
- "Related Articles" section at bottom (3 articles, based on shared tags)
- Skeleton loading placeholder while content loads
- SEO meta tags per article (title, description, OG tags)

**Blog Technical Details:** See [Section 8: Blog Engine Requirements](#8-blog-engine-requirements).

---

### 7.9 Contact Section

**Purpose:** Convert interested visitors into contacts. Make it easy and trustworthy.

**Layout:** Two-column on desktop:
- Left: Contact information + CTA copy
- Right: Contact form (optional for v1; can be a mailto link or a simple form)

**Copy:**

> **Open to software development, web application, API, and enterprise project opportunities.**
>
> Whether you're a recruiter, a startup founder, or an enterprise team — I'd love to hear about your project and how I can help.

**Contact Details:**

| Channel | Value |
|---|---|
| 📞 Phone | `085156283645` |
| ✉️ Email | `afghanekapangestu@gmail.com` |
| 🔗 LinkedIn | `linkedin.com/in/afghan-eka-pangestu/` |
| 💻 GitHub | `github.com/afg2002` |
| 📍 Address | Perumahan Bukit Waringin Blok B1 No.15 RT 12 / RW 10, Bojonggede, Bogor |

**Design:**
- Contact items as interactive pills or bordered rows
- Each item: icon + label + value, with hover transition
- Email and phone should be clickable (`mailto:`, `tel:`)
- Social links open in new tab
- Accent color on hover (teal)

**Optional v1.5:** Add a working contact form (Name, Email, Subject, Message) with:
- Client-side validation
- `formsubmit.co` or similar backendless form handler
- Success/error toast notification
- Rate limiting / honeypot spam protection

---

### 7.10 Footer

**Purpose:** Bookend the page with minimal info and navigation.

**Layout:** Single row, centered.

```
© 2026 Afghan Eka Pangestu — Software Developer
[LinkedIn] [GitHub] [Email]
```

- `text-muted`, 13px
- Social links: small icons with hover teal transition
- Subtle top border (`border-subtle`)

---

## 8. Blog Engine Requirements

### 8.1 Content Management

- Blog posts stored as **markdown files** (`.md`) in a `/content/blog/` directory
- Frontmatter (YAML) for metadata:

```yaml
---
title: "Building Scalable APIs with Laravel"
date: 2026-01-15
excerpt: "A deep dive into API architecture patterns..."
tags: ["laravel", "api", "backend", "php"]
coverImage: "/images/blog/laravel-api.jpg"
---
```

### 8.2 Features (Per Article)

| Feature | Requirement |
|---|---|
| **Markdown Rendering** | GitHub-flavored markdown (GFM) — tables, code blocks, task lists, strikethrough |
| **Syntax Highlighting** | Dark theme, support for: js, ts, php, java, python, go, bash, yaml, json, sql |
| **Table of Contents** | Auto-generated from h2/h3 headings; sticky sidebar on desktop; collapsible `<details>` on mobile |
| **Responsive Images** | Images in markdown render as responsive `<img>` with `srcset`, lazy loading (`loading="lazy"`), and explicit width/height for CLS prevention |
| **Reading Time** | Calculated as `wordCount / 200` words-per-minute, displayed as "X min read" |
| **Related Articles** | Up to 3 articles sharing at least one common tag; sorted by recency |
| **SEO Meta Tags** | Per-article `<title>`, `<meta name="description">`, Open Graph, Twitter Cards |
| **Skeleton Loading** | While article content loads, show a placeholder skeleton (title bar, paragraph lines, image placeholder) |
| **Lazy Loading** | Article content and images lazy-loaded; above-the-fold content prioritized |
| **Reading Progress** | Thin progress bar (2px, teal) fixed to top of viewport, indicating scroll progress |
| **Social Sharing** | Share buttons for Twitter/X, LinkedIn, and copy-link (optional) |
| **RSS Feed** | Auto-generated RSS/Atom feed at `/blog/feed.xml` (optional, for v1.5) |

### 8.3 Blog Index Features

| Feature | Requirement |
|---|---|
| **Article Cards** | Title, date, reading time, excerpt, tags, optional cover thumbnail |
| **Skeleton Loading** | Placeholder cards while article list loads |
| **Tag Filtering** | Click a tag to filter articles by that tag; active tag highlighted |
| **Pagination** | "Load More" button or numbered pagination (10 articles per page) |
| **SEO** | Canonical URL, meta description for blog index page |
| **Empty State** | Friendly message when no articles match filter: "No articles found for this topic." |

---

## 9. Technical Requirements

### 9.1 Technology Stack (Recommended)

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Astro 4+ | Static-first, markdown-native, zero-JS-by-default, fast builds, excellent DX |
| **Styling** | Tailwind CSS 3.4+ | Utility-first, small bundle, design system tokens via `tailwind.config` |
| **Icons** | `@phosphor-icons/web` or `astro-icon` | Clean, geometric, developer-friendly icon set |
| **Markdown** | Astro Content Collections | Type-safe, built-in, frontmatter validation, first-class Astro integration |
| **Syntax Highlighting** | `@astrojs/mdx` + `rehype-pretty-code` + `shiki` | Dark theme, accurate highlighting, build-time processing |
| **Animations** | CSS-only or lightweight `@astrojs/` integrations | Staggered reveals, scroll-triggered, GPU-accelerated, no heavy JS libraries |
| **Deployment** | Vercel, Netlify, or Cloudflare Pages | Free tier, fast CDN, automatic SSL, Astro adapter support |
| **Fonts** | Self-hosted via `@fontsource` (`Plus Jakarta Sans`, `JetBrains Mono`) | Performance; no external requests; subset to latin |

### 9.2 Why Astro

Astro is the ideal choice for this portfolio because:
- **Zero JavaScript by default** — the entire portfolio site can ship with minimal or no client-side JS, maximizing performance
- **Content Collections** — native markdown support with type-safe frontmatter, perfect for blog posts
- **Partial Hydration** — if any interactive islands are needed (contact form, mobile nav), they hydrate independently
- **Static output** — pre-rendered HTML at build time, deployable anywhere
- **MDX support** — use components inside markdown for rich blog content
- **View Transitions** — built-in SPA-like page transitions without heavy JS
- **Fast builds** — Go-based compiler, sub-second HMR

### 9.3 Browser Support

- Chrome, Firefox, Safari, Edge — latest 2 versions
- Mobile Safari, Chrome for Android
- No IE11 support required

---

## 10. Performance & SEO

### 10.1 Performance Budget

| Metric | Target |
|---|---|
| **Lighthouse Performance** | ≥ 90 |
| **Lighthouse Accessibility** | ≥ 95 |
| **Lighthouse Best Practices** | ≥ 90 |
| **Lighthouse SEO** | ≥ 95 |
| **First Contentful Paint (FCP)** | < 1.5s |
| **Largest Contentful Paint (LCP)** | < 2.5s |
| **Total Blocking Time (TBT)** | < 200ms |
| **Cumulative Layout Shift (CLS)** | < 0.1 |
| **Total Page Weight** | < 300KB (compressed) |

### 10.2 Performance Strategies

- **Static Site Generation (SSG)** for all non-blog pages; pre-render at build time
- **Image optimization:** Use framework image components (`next/image`, `@astrojs/image`) with WebP/AVIF formats, responsive sizes, lazy loading
- **Font optimization:** Subset fonts to latin; use `font-display: swap`; self-host if possible
- **CSS:** Tailwind purges unused styles; CSS bundle < 10KB gzipped
- **JavaScript:** Minimal client JS; code-split blog syntax highlighting; defer non-critical scripts
- **Caching:** Static assets with immutable hashes + long cache TTL; HTML with short TTL
- **CDN:** Vercel/Cloudflare global edge network

### 10.3 SEO Requirements

- **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3), `<main>`, `<nav>`, `<article>`, `<section>`
- **Meta tags:** `<title>`, `<meta name="description">` per page
- **Open Graph:** `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- **Twitter Cards:** `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- **Canonical URLs:** Per page
- **Sitemap.xml:** Auto-generated, includes all pages + blog articles
- **Robots.txt:** Allow all, point to sitemap
- **Structured Data:** `JSON-LD` for Person schema (portfolio), Article schema (blog posts), BreadcrumbList
- **Alt text:** All images have descriptive `alt` attributes

---

## 11. Responsive Behavior

### 11.1 Breakpoints

| Breakpoint | Min Width | Layout Changes |
|---|---|---|
| **Mobile S** | 320px | Single column, compact nav, smaller type |
| **Mobile** | 480px | Single column, comfortable touch targets |
| **Tablet** | 768px | 2-column grids begin, expanded nav |
| **Desktop** | 1024px | Full layout: 2–3 column grids, sidebar TOC on blog |
| **Desktop L** | 1280px | Max-width container (1200px), generous spacing |
| **Desktop XL** | 1536px | Extra breathing room, larger type scale option |

### 11.2 Mobile-Specific Behaviors

- **Nav:** Hamburger menu → full-screen overlay or right-side drawer with nav links
- **Hero:** Stacks vertically; text first, visual panel below (smaller)
- **Skills:** 1 column (down from 3); badges wrap naturally
- **Experience:** Timeline dots align flush-left; cards full-width
- **Projects:** 1 column (down from 2)
- **Blog TOC:** Collapsible `<details>` element above content (not sidebar)
- **Contact:** Stacks vertically; contact info above
- **Touch targets:** Minimum 44x44px for all interactive elements

---

## 12. Accessibility

- **WCAG 2.1 AA** compliance target
- **Color contrast:** All text meets 4.5:1 ratio against background (tested with teal-on-dark, muted-on-dark pairings)
- **Keyboard navigation:** All interactive elements focusable; visible focus ring (teal outline, 2px offset)
- **Screen readers:** Semantic HTML, ARIA labels where needed, `alt` text for all images
- **Reduced motion:** Respect `prefers-reduced-motion` media query; disable animations
- **Skip link:** "Skip to content" link at top of page for keyboard users

---

## 13. Out of Scope (v1)

The following are explicitly excluded from v1 to keep scope manageable:

- ❌ CMS / admin dashboard for blog (use markdown files + git)
- ❌ User authentication / login
- ❌ Comments system (use external: Giscus, Disqus — optional later)
- ❌ Multi-language / i18n
- ❌ Dark/light mode toggle (dark mode only by design)
- ❌ Analytics dashboard (install Plausible/Fathom for privacy-friendly analytics, but no custom dashboard)
- ❌ Contact form backend (use `mailto:` or `formsubmit.co` for v1)
- ❌ CI/CD pipelines beyond what Vercel/Cloudflare provides by default

**v1.5 Candidates (if time permits):**
- Working contact form with validation
- RSS feed for blog
- View transitions / page transition animations
- Search functionality for blog

---

## 14. Open Questions

| # | Question | Status |
|---|---|---|
| Q1 | Should the contact form be functional in v1, or just `mailto:` links? | **Decided:** `mailto:` + contact info display for v1; form in v1.5 |
| Q2 | What framework? | **Decided:** Astro 4+ with Tailwind CSS |
| Q3 | What hero visual style? | **Decided:** Simple abstract geometric visual — clean shapes, subtle teal accents, no terminal/code gimmicks |
| Q4 | How many initial blog posts will be ready at launch? | **Pending** — aim for 3–5 seed articles |
| Q5 | Domain name? | **Pending** — e.g., `afghan.dev`, `afghaneka.com`, or similar |
| Q6 | Should we include a downloadable CV/Resume PDF? | **Pending** — recommended as a secondary CTA |
| Q7 | Analytics: Plausible, Fathom, or none for v1? | **Pending** — Plausible recommended for privacy + simplicity |

---

## 15. Appendix: Full Content Copy

### Hero Section

**Name:** AFGHAN EKA PANGESTU

**Role:** Software Developer

**Subtitle:** Web Application & API Developer

**Summary:**
> Software Developer with hands-on experience in building modern web applications and APIs for both enterprise and freelance projects. Proficient in Vue.js, Vuetify, MongoDB, Laravel, and Java Spring Boot, with a strong focus on clean architecture, scalability, and maintainability.

**Contact:**
- 📞 `085156283645`
- ✉️ `afghanekapangestu@gmail.com`
- 🔗 `linkedin.com/in/afghan-eka-pangestu/`
- 💻 `github.com/afg2002`
- 📍 Bogor, Indonesia

### About Section

> I am a software developer with experience delivering modern web applications, internal enterprise tools, chatbot-related solutions, and project-based systems. I am comfortable working with frontend and backend technologies and collaborating with teams to translate business requirements into reliable technical solutions. I focus on maintainable architecture, continuous improvement, and delivering useful technology for real users.

### Skills

| Category | Skills |
|---|---|
| Frontend | HTML, CSS, JavaScript, Vue.js, Vue.js 2, Vuetify, React |
| Backend | PHP, Laravel, Java, Spring Boot, Golang, Express |
| Database & Tools | MongoDB, MySQL, Git, Terminal, Visual Studio Code |
| Professional Strengths | Clean Architecture, Scalability, Maintainability, Teamwork, Communication, Problem Solving, Adaptation |
| Languages | Indonesia (Active), English (Passive) |

### Experience

1. **PT Inmotion Inovasi Teknologi** — Web Developer | Full Time (Feb 2024 – Jun 2024)
2. **PT BTPN Syariah Tbk** — Web Developer | Internship (Feb 2024 – Jun 2024)
3. **PT Ciptanusa Nuansa Mulia** — Web Developer | Freelance (Sep 2023 – Dec 2023)
4. **PT Bintang Bahagia Selalu — Royal Star** — Web Developer | Freelance (Sep 2022 – Oct 2022)
5. **CV Mitrasoft Global** — Web Developer | Internship (Jan 2019 – Mar 2019)

*(Full bullet points in Section 7.4)*

### Projects

1. **SehatSegar.my.id** — Laravel POS application
2. **Movie Ticket Booking Web** (2024) — Vue.js 2, Vuetify, MongoDB
3. **Web Zero Waste Massive** (2024) — React, Express API
4. **Project Management Application** (2023) — Laravel
5. **Router Dashboard Application** (2024) — Spring Boot, Vue.js 2
6. **Baca Komik** (2020) — Python

### Education

1. **Universitas Indraprasta PGRI** — Bachelor of Informatics Engineering (2020–2024), GPA 3.62
2. **SMK Negeri 1 Cibinong** — Software Engineering (2017–2020), Score 84/100

### Certifications

1. Theoretical Understanding of HTML — Sololearn (2018)
2. Theoretical Understanding of PHP — Sololearn (2018)
3. Pemrograman Go-Lang: Pemula sampai Mahir — Udemy (2022)
4. Kampus Merdeka MSIB Batch 6 — PT BTPN Syariah Tbk (2024)

### Contact CTA

> Open to software development, web application, API, and enterprise project opportunities.

---

*End of PRD*
