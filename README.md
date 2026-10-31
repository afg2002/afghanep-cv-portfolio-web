# Afghan Eka Pangestu — Portfolio

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://www.aep.my.id)
[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

Personal portfolio website for **Afghan Eka Pangestu** — a Java Developer at Generali Indonesia focused on backend engineering and enterprise solutions.

**Live site:** [www.aep.my.id](https://www.aep.my.id)

---

## ✨ Features

- **Hero** — Oversized display headline, live terminal profile card, stat strip and tech marquee
- **Work** — Featured project grid (lead card spans full width) + expandable list of eight more builds
- **Stack** — Capability grid on an ink band, with language proficiency bars
- **Experience** — Rule-separated ledger of roles with type chips and highlights
- **About** — Statement block + profile facts table
- **Education / Certifications** — Score-badged cards and credential list
- **Contact** — Acid CTA band with direct channel table and email/CV actions
- **Blog** — Grid-paper masthead, tag filtering, card grid, and rich article pages (TOC, reading progress, code copy)
- **Command palette** — `Ctrl/Cmd + K` search across pages and articles (Pagefind)
- **Design system** — Neo-brutalist: paper canvas, 2px black rules, hard offset shadows, acid/coral/lilac accents (see `DESIGN.md`)
- **Responsive** — Mobile-first, fluid display type via `clamp()`, reduced-motion support

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Astro](https://astro.build) 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 4 |
| **UI** | Custom components, `@fontsource/archivo-black`, `@fontsource/plus-jakarta-sans`, `@fontsource/jetbrains-mono` |
| **Content** | Astro Content Collections (Markdown) |
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
