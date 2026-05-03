---
title: "Building a Modern Blog with Astro: A Practical Guide"
date: 2026-05-04
excerpt: "How I built this very portfolio and blog using Astro 5, Tailwind CSS 4, and Vercel — from project setup to markdown content collections, dynamic routes, and deployment."
tags: ["astro", "frontend", "javascript", "tutorial"]
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop&auto=format"
---

If you're reading this, you're looking at a blog built with [Astro](https://astro.build). This post walks through how it was built — from zero to a fully deployed blog with markdown content, tag filtering, and a clean reading experience.

## Why Astro?

Astro is a web framework designed for content-heavy sites. Unlike React or Vue SPAs that ship JavaScript to the browser, Astro renders HTML by default and only sends JS when components explicitly need it.

**Key benefits for a blog:**

- **Zero JS by default** — Pages load instantly with no client-side JavaScript
- **Markdown & MDX support** — Write posts in Markdown with frontmatter
- **Content Collections** — Type-safe content management with schema validation
- **Static by design** — Outputs static HTML that can be deployed anywhere
- **Island architecture** — Drop in interactive components only where needed

## Setting Up the Project

Create a new Astro project with the official CLI:

```bash
# Create a new Astro project
bun create astro@latest

# Choose "Empty" template, then add:
# - TypeScript (yes)
# - Install dependencies (yes)
# - Initialize git (yes)

# Add blog-related integrations
npx astro add mdx
npx astro add sitemap
```

### Project Structure

The key directories for a blog:

```
src/
├── content/
│   └── blog/          # Markdown blog posts
├── layouts/
│   ├── BaseLayout.astro   # Global HTML shell
│   └── BlogLayout.astro   # Blog post layout
├── pages/
│   ├── blog/
│   │   ├── index.astro        # Blog listing
│   │   └── [...slug].astro    # Dynamic post route
│   └── index.astro       # Homepage
└── components/
    ├── BlogCard.astro    # Post preview card
    └── TableOfContents.astro  # Sidebar TOC
```

## Content Collections — The Backbone

Astro's [Content Collections](https://docs.astro.build/en/guides/content-collections/) provide type-safe content management. Define a schema in `src/content/config.ts`:

```typescript
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog: blogCollection };
```

Each blog post is a markdown file with frontmatter:

```markdown
---
title: "Building a Modern Blog with Astro"
date: 2026-05-04
excerpt: "How I built this portfolio and blog using Astro 5..."
tags: ["astro", "frontend", "javascript"]
coverImage: "/images/cover.jpg"
---

Your content here in **markdown**.
```

## Rendering Blog Posts

### Listing Page (`/blog`)

Use `getCollection()` to fetch posts, sorted by date:

```astro
---
import { getCollection } from "astro:content";

const allPosts = await getCollection("blog", ({ data }) => !data.draft);
const posts = allPosts.sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
---
```

For tag filtering, since this is a static site, you'll need client-side JavaScript. The approach I used:

1. Render all posts with `data-tags` attributes
2. Add a script that reads `?tag=` from the URL
3. Filter posts in the browser without a page reload

```javascript
// Client-side filter snippet
const tag = new URLSearchParams(window.location.search).get("tag") || "";
cards.forEach((card) => {
  const tags = card.dataset.tags.split(",");
  card.classList.toggle("hidden", tag && !tags.includes(tag));
});
```

### Dynamic Post Route (`/blog/[slug]`)

Use `getStaticPaths()` to generate a page for every post:

```astro
---
export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, "") },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();
---
```

The `headings` array from `post.render()` gives you the table of contents data for free — perfect for building a sidebar TOC.

## Styling with Tailwind CSS 4

Tailwind CSS 4 introduced a new configurationless setup. Install the Vite plugin:

```bash
npm install tailwindcss @tailwindcss/vite
```

Add to `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
});
```

Define custom colors in your global CSS using `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-bg-primary: #0d1117;
  --color-accent-primary: #14b8a6;
  --color-text-primary: #e6edf3;
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, sans-serif;
}
```

For blog content, style markdown elements with a `.prose` class:

```css
.prose h2 { font-size: 1.5em; margin-top: 2em; }
.prose p { margin-bottom: 1.2em; line-height: 1.8; }
.prose code {
  background: var(--color-bg-elevated);
  padding: 0.15em 0.4em;
  border-radius: 4px;
}
.prose table {
  display: block;
  overflow-x: auto;
  max-width: 100%;
}
```

## Adding a Table of Contents

The `headings` array from `post.render()` returns objects with `depth`, `text`, and `slug`. Render a sidebar TOC with active state tracking:

```astro
<nav class="sticky top-24">
  <h4>On this page</h4>
  <ul>
    {headings.filter(h => h.depth >= 2).map(h => (
      <li>
        <a href={`#${h.slug}`}
           class={h.depth === 2 ? "text-base" : "pl-4 text-sm"}>
          {h.text}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

Track the active heading using the Intersection Observer API:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Highlight the corresponding TOC link
    }
  });
}, { rootMargin: "-80px 0px -70% 0px" });
```

## Reading Progress Bar

A nice touch for blog posts — a progress bar at the top that fills as you scroll:

```javascript
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = `${Math.min(100, progress)}%`;
});
```

## SEO & Meta Tags

Use `Astro.site` and `Astro.url` to build canonical URLs and Open Graph tags dynamically:

```astro
---
const canonical = new URL(Astro.url.pathname, Astro.site).href;
---

<link rel="canonical" href={canonical} />
<meta property="og:title" content={`${title} | Afghan Eka Pangestu`} />
<meta property="og:type" content={article ? "article" : "website"} />
<meta name="twitter:card" content="summary_large_image" />
```

## Deployment

Deploy to Vercel with the `@astrojs/vercel` adapter:

```bash
npx astro add vercel
```

Push to GitHub, and Vercel auto-deploys. Since Astro outputs static HTML by default, your blog will be served globally via Vercel's CDN with no server costs.

```bash
# Output
➜ prerendering static routes
  └─ /blog/building-blog-with-astro/index.html (+12ms)
  └─ /blog/enterprise-web-app-guide/index.html (+5ms)
```

## What I'd Do Differently

- **MDX instead of Markdown** — If you need embedded React/Astro components inside posts, use `.mdx` files. Astro supports it natively.
- **RSS feed** — Add `@astrojs/rss` to generate an RSS feed automatically.
- **Image optimization** — Use Astro's built-in image component with `?width` query params for responsive images.
- **Search** — For larger blogs, add client-side search using Fuse.js or Pagefind.

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Content Collections Guide](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [Astro + Vercel Deploy Guide](https://docs.astro.build/en/guides/deploy/vercel/)

---

*This blog you're reading right now was built using the exact same stack described above. The full source code is available on [GitHub](https://github.com/afg2002/afghanep-cv-portfolio-web).*
