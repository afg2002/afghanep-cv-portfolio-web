# Afghan Eka Pangestu — Portfolio

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://www.aep.my.id)
[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

Personal portfolio website for **Afghan Eka Pangestu** — a Java Developer at Generali Indonesia focused on backend engineering and enterprise solutions.

**Live site:** [www.aep.my.id](https://www.aep.my.id)

---

## Features

- **Hero** — Swiss-style display headline, mono spec panel with live profile facts, and direct contact rails
- **Work** — Rule-separated project index (6 featured) plus an expandable list of 8 more builds
- **Stack** — Capability grid with language proficiency bars
- **Experience** — Spec-sheet rows with dotted leaders, employment type, and "Current" marker
- **About** — Statement block + facts table
- **Education / Certifications** — Score-badged cards and a two-column credential list
- **Contact** — Direct channel table + CTA panel with email and CV actions
- **Blog** — Tag filtering, card grid, and article pages with TOC, reading progress, and copy-code buttons
- **Command palette** — `Ctrl/Cmd + K` search across pages and articles (Pagefind)
- **Dark mode** — Dark by default, light supported; 3-state toggle (dark → system → light) with no first-paint flash
- **Dynamic OG images** — Per-article 1200×630 cards generated at build time with Satori + resvg (no headless browser), plus a site-wide card
- **RSS feed** — `/rss.xml`, advertised via `<link rel="alternate">` and linked in the footer
- **404 page** — On-brand not-found page with search and popular destinations, `noindex`
- **Status page** — `/status` reports the site's real build telemetry: per-route page weight, source size, content stats. Nothing is hardcoded; an `astro:build:done` hook measures `dist/` and writes `/status.json`, which the page fetches. Metrics that cannot be verified (e.g. commit count in a shallow clone) are omitted rather than faked
- **Image optimisation** — `astro:assets` + sharp: local blog covers are emitted as WebP with responsive `srcset`
- **SEO** — Canonical URLs, OG/Twitter cards, JSON-LD (`Person`, `WebSite`, `ProfilePage`, `BlogPosting`, `BreadcrumbList`), sitemap, `noindex` on filtered views and 404
- **Responsive** — Mobile-first, fluid `clamp()` type, ≥44px touch targets, reduced-motion support
- **Design system** — Swiss + monospace spec-sheet: hairline rules, one accent, zero decoration (see `DESIGN.md`)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Astro](https://astro.build) 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 4 |
| **UI** | Custom components, `@fontsource/space-grotesk`, `@fontsource/inter`, `@fontsource/jetbrains-mono` |
| **Content** | Astro Content Collections (Markdown) |
| **Media** | `astro:assets` + sharp, Satori + `@resvg/resvg-js` for OG cards |
| **Feeds** | `@astrojs/rss` |
| **Deployment** | [Vercel](https://vercel.com) (static + serverless functions) |
| **Package Manager** | [Bun](https://bun.sh) |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/afg2002/afghanep-cv-portfolio-web.git
cd afghanep-cv-portfolio-web

# Install dependencies
bun install

# Start dev server
bun run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|

## 📁 Project Structure

```
src/
├── components/       # Astro UI components
│   ├── Hero.astro         # Hero section with animations
│   ├── Skills.astro       # Skills grid
│   ├── Experience.astro   # Work timeline
│   ├── Projects.astro     # Projects grid
│   ├── Education.astro    # Education cards
│   ├── Certifications.astro
│   ├── Contact.astro      # Contact info + CTA
│   ├── Header.astro       # Nav bar with mobile menu
│   └── Footer.astro
├── content/
│   └── blog/              # Blog posts (Markdown + frontmatter)
├── layouts/
│   ├── BaseLayout.astro   # HTML shell, SEO tags, global CSS
│   └── BlogLayout.astro   # Blog-specific layout
├── pages/
│   ├── index.astro        # Homepage
│   └── blog/
│       ├── index.astro    # Blog index with tag filter
│       └── [...slug].astro # Blog article detail
└── styles/
    └── global.css         # Global styles & prose
```

## 📄 License

MIT — feel free to use as inspiration for your own portfolio.
