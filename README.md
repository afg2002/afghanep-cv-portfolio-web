# 🇮🇩 Afghan Eka Pangestu — Portfolio

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://www.aep.my.id)
[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

Personal portfolio website for **Afghan Eka Pangestu** — a Java Developer at Generali Indonesia focused on backend engineering and enterprise solutions.

**Live site:** [www.aep.my.id](https://www.aep.my.id)

---

## ✨ Features

- **Hero** — Animated intro with orbiting rings, floating tech labels, and contact links
- **Skills** — Categorized skill cards (Frontend, Backend, Database & Tools, etc.)
- **Experience** — Timeline-based work history with company, role, and highlights
- **Projects** — Featured projects grid + expandable list of more projects
- **Education** — Academic background with GPA and achievements
- **Certifications** — Course and certification cards
- **Contact** — Contact info cards + "Let's Work Together" CTA
- **Blog** — Blog index with tag filtering and individual article pages
- **Responsive** — Fully responsive design, mobile-first with Tailwind CSS
- **Dark theme** — GitHub-dark-inspired color scheme

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Astro](https://astro.build) 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 4 |
| **UI** | Custom components, `@phosphor-icons/web`, `@fontsource/*` |
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
