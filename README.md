# 🇮🇩 Afghan Eka Pangestu — Portfolio

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://www.aep.my.id)
[![Astro](https://img.shields.io/badge/Astro-5.0-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

Personal portfolio website for **Afghan Eka Pangestu** — a Software Developer specializing in backend engineering, AI-integrated systems, and enterprise solutions.

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
- **AI Chat** — Floating chatbot that answers questions about Afghan (powered by Groq/OpenRouter)
- **Responsive** — Fully responsive design, mobile-first with Tailwind CSS
- **Dark theme** — GitHub-dark-inspired color scheme

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Astro](https://astro.build) 5 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) 4 |
| **UI** | Custom components, `@phosphor-icons/web`, `@fontsource/*` |
| **Content** | Astro Content Collections (Markdown) |
| **AI Chat** | Groq API / OpenRouter (streaming SSE) |
| **Deployment** | [Vercel](https://vercel.com) (static + serverless functions) |
| **Package Manager** | [Bun](https://bun.sh) |

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/afg2002/afghanep-cv-portfolio-web.git
cd afghanep-cv-portfolio-web

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env — add at least one API key (Groq or OpenRouter)

# Start dev server
bun run dev
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ (recommended) | Groq API key (fastest, generous free tier) |
| `OPENROUTER_API_KEY` | ❌ (fallback) | OpenRouter API key |
| `PUBLIC_AI_CHAT_LIMIT` | ❌ | Max AI chat messages per day (default: 5) |

## 📁 Project Structure

```
src/
├── components/       # Astro UI components
│   ├── AIChat.astro       # Floating AI chatbot widget
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
├── data/
│   └── afghan-prompt.ts   # AI system prompt
├── layouts/
│   ├── BaseLayout.astro   # HTML shell, SEO tags, global CSS
│   └── BlogLayout.astro   # Blog-specific layout
├── pages/
│   ├── index.astro        # Homepage
│   ├── api/chat.ts        # AI chat API endpoint (serverless)
│   └── blog/
│       ├── index.astro    # Blog index with tag filter
│       └── [...slug].astro # Blog article detail
└── styles/
    └── global.css         # Global styles & prose
```

## 📄 License

MIT — feel free to use as inspiration for your own portfolio.
