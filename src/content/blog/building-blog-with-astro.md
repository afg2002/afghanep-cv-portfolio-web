---
title: "Building a Blog with Astro 5: Complete Step-by-Step Guide"
date: 2026-05-04
excerpt: "A comprehensive, beginner-friendly guide to building a blog with Astro 5, Tailwind CSS 4, and Vercel — covering project setup, content collections, markdown, dynamic routing, tag filtering, table of contents, SEO, and deployment."
tags: ["astro", "frontend", "tutorial", "javascript", "webdev"]
coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop&auto=format"
---

If you're reading this, you're looking at a blog built entirely with [Astro](https://astro.build). This guide walks through every step from zero to a fully deployed blog with markdown content, tag filtering, a table of contents sidebar, and auto-deployment via GitHub + Vercel.

No prior Astro experience needed — just basic familiarity with HTML, CSS, and JavaScript.

---

## Table of Contents

- [Step 1: Project Setup](#step-1-project-setup)
- [Step 2: Install Tailwind CSS 4](#step-2-install-tailwind-css-4)
- [Step 3: Create a Base Layout](#step-3-create-a-base-layout)
- [Step 4: Set Up Content Collections](#step-4-set-up-content-collections)
- [Step 5: Write Your First Blog Post](#step-5-write-your-first-blog-post)
- [Step 6: Build the Blog Listing Page](#step-6-build-the-blog-listing-page)
- [Step 7: Build the Blog Post Page](#step-7-build-the-blog-post-page)
- [Step 8: Add a Table of Contents](#step-8-add-a-table-of-contents)
- [Step 9: Add Tag Filtering](#step-9-add-tag-filtering)
- [Step 10: Add a Reading Progress Bar](#step-10-add-a-reading-progress-bar)
- [Step 11: Style Markdown Content (Prose)](#step-11-style-markdown-content-prose)
- [Step 12: Add SEO Meta Tags](#step-12-add-seo-meta-tags)
- [Step 13: Deploy to Vercel](#step-13-deploy-to-vercel)
- [Step 14: Auto-Deploy with GitHub](#step-14-auto-deploy-with-github)

---

## Step 1: Project Setup

### Prerequisites

- **Node.js** 18+ or **Bun** (I use Bun — it's faster)
- A code editor (VS Code recommended)
- Basic terminal knowledge

### Create the Project

Run the Astro CLI to scaffold a new project:

```bash
# Using npm
npm create astro@latest my-blog

# Using Bun (faster)
bun create astro@latest my-blog
```

You'll be prompted with questions. Choose:

```
✔ Where should we create your new project? › my-blog
✔ How would you like to start? › Empty (minimal)
✔ Do you plan to write TypeScript? › Yes
✔ Install dependencies? › Yes
✔ Initialize a Git repository? › Yes
```

Navigate into the project:

```bash
cd my-blog
```

### Install Blog Integrations

Add the official integrations for MDX (optional) and sitemap:

```bash
npx astro add mdx
npx astro add sitemap
```

These commands automatically update your `astro.config.mjs`.

### Folder Structure

Here's what we'll build toward:

```
my-blog/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── BlogCard.astro
│   │   ├── TableOfContents.astro
│   │   └── ScrollToTop.astro
│   ├── content/
│   │   ├── blog/          # Markdown blog posts live here
│   │   │   └── hello-world.md
│   │   └── config.ts      # Content collection schema
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Global HTML shell
│   │   └── BlogLayout.astro    # Blog-specific wrapper
│   ├── pages/
│   │   ├── blog/
│   │   │   ├── index.astro         # Blog listing (/blog)
│   │   │   └── [...slug].astro     # Dynamic post route (/blog/:slug)
│   │   └── index.astro             # Homepage
│   └── styles/
│       └── global.css     # Global styles
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Step 2: Install Tailwind CSS 4

Tailwind CSS 4 has a new configurationless setup. Install via npm:

```bash
npm install tailwindcss @tailwindcss/vite
```

### Configure the Vite Plugin

Open `astro.config.mjs` and add the Tailwind Vite plugin:

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://yourdomain.com",          // ← Change this to your domain
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Define a Theme

Create `src/styles/global.css` and define your custom color palette using Tailwind's `@theme` directive. This is a dark theme inspired by GitHub's dark mode:

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-bg-primary: #0d1117;
  --color-bg-secondary: #161b22;
  --color-bg-elevated: #1c2128;
  --color-border-subtle: #21262d;
  --color-border-accent: #30363d;
  --color-text-primary: #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-muted: #848d97;
  --color-accent-primary: #14b8a6;
  --color-accent-secondary: #10b981;
  --color-accent-glow: rgba(20, 184, 166, 0.15);

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

Now you can use these colors anywhere in your templates: `bg-bg-primary`, `text-text-secondary`, `border-border-subtle`, etc.

### Add Global Base Styles

In the same file, add base styles:

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px;
}

body {
  font-family: var(--font-sans);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

---

## Step 3: Create a Base Layout

The base layout wraps every page with the HTML shell, meta tags, and global CSS import.

Create `src/layouts/BaseLayout.astro`:

```astro
---
// src/layouts/BaseLayout.astro
import "../styles/global.css";

export interface Props {
  title: string;
  description: string;
  ogImage?: string;
  article?: boolean;
}

const {
  title,
  description,
  ogImage = "/og-default.png",
  article = false,
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).href;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <title>{title} | My Blog</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <!-- Open Graph -->
    <meta property="og:title" content={`${title} | My Blog`} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content={article ? "article" : "website"} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`${title} | My Blog`} />
    <meta name="twitter:description" content={description} />
  </head>
  <body class="min-h-screen flex flex-col bg-bg-primary text-text-primary antialiased">
    <slot />
  </body>
</html>
```

The `<slot />` is where page content gets injected.

---

## Step 4: Set Up Content Collections

Content Collections are Astro's type-safe way to manage markdown content. They validate frontmatter at build time and provide autocomplete in your editor.

Create the config file at `src/content/config.ts`:

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

export const collections = {
  blog: blogCollection,
};
```

**What each field means:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title |
| `date` | date | Yes | Publish date |
| `excerpt` | string | Yes | Short summary (used in listing & SEO) |
| `tags` | string[] | No | Categories for filtering |
| `coverImage` | string | No | Hero image URL |
| `draft` | boolean | No | Hide from production when `true` |

The `draft` field is especially useful — set a post to `draft: true` and it won't appear on your live site, but you can still preview it in dev mode.

---

## Step 5: Write Your First Blog Post

Create `src/content/blog/hello-world.md`:

```markdown
---
title: "Hello, World! My First Blog Post"
date: 2026-05-04
excerpt: "Getting started with blogging on Astro — a simple hello world to test the waters."
tags: ["astro", "webdev"]
---

Welcome to my blog! This is my first post powered by **Astro**.

## Why I Started Blogging

I've been building web applications for years, and I've learned a ton along the way. This blog is my way of giving back to the community.

## What to Expect

- Practical tutorials on web development
- Lessons learned from production projects
- Deep dives into architecture decisions

Stay tuned for more content!
```

**A note about dates:** Astro expects ISO 8601 date format (`YYYY-MM-DD`). The date is used for sorting posts and is displayed on the post page.

---

## Step 6: Build the Blog Listing Page

The listing page at `/blog` shows all published posts sorted by date.

### Create the Page

Create `src/pages/blog/index.astro`:

```astro
---
// src/pages/blog/index.astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import BlogCard from "../../components/BlogCard.astro";
import { getCollection } from "astro:content";

// Fetch all non-draft posts, sorted by date descending
const allPosts = await getCollection("blog", ({ data }) => !data.draft);
const posts = allPosts.sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);

// Collect all unique tags for the filter UI
const allTags = [...new Set(posts.flatMap((p) => p.data.tags))].sort();
---

<BaseLayout title="Blog" description="Read my thoughts on web development, architecture, and building for the web.">
  <main class="max-w-4xl mx-auto px-6 pt-24 pb-24">
    <h1 class="text-4xl font-bold mb-2">Blog</h1>
    <p class="text-text-secondary mb-8">Thoughts on software development.</p>

    <!-- Tag filter buttons -->
    <div id="tag-filters" class="flex flex-wrap gap-2 mb-8">
      <a href="/blog" data-tag=""
         class="tag-btn px-3 py-1.5 text-xs rounded-full border transition-colors
                text-text-secondary border-border-accent">
        All
      </a>
      {allTags.map((tag) => (
        <a href={`/blog?tag=${tag}`} data-tag={tag}
           class="tag-btn px-3 py-1.5 text-xs rounded-full border transition-colors
                  text-text-secondary border-border-accent hover:border-accent-primary/30">
          {tag}
        </a>
      ))}
    </div>

    <!-- Post cards -->
    <div id="posts-grid" class="grid sm:grid-cols-2 gap-6">
      {posts.map((post) => (
        <div class="post-card" data-tags={post.data.tags.join(",")}>
          <BlogCard post={post} />
        </div>
      ))}
    </div>

    <!-- Empty state (hidden by default, shown by JS when filter yields no results) -->
    <div id="empty-state" class="text-center py-16 hidden">
      <p class="text-text-muted">No articles found for this topic.</p>
      <a href="/blog" class="text-accent-primary hover:underline mt-4 inline-block">View all articles</a>
    </div>
  </main>
</BaseLayout>

<script>
  // Client-side tag filtering (explained in Step 9)
  const tag = new URLSearchParams(window.location.search).get("tag") || "";
  // ... (filtering logic will go here)
</script>
```

### Create the BlogCard Component

Create `src/components/BlogCard.astro`:

```astro
---
// src/components/BlogCard.astro
import type { CollectionEntry } from "astro:content";

export interface Props {
  post: CollectionEntry<"blog">;
}

const { post } = Astro.props;
const { title, date, excerpt, tags, coverImage } = post.data;
const slug = post.id.replace(/\.(md|mdx)$/, "");
const formattedDate = new Date(date).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
---

<a href={`/blog/${slug}`}
   class="block p-6 bg-bg-secondary border border-border-subtle rounded-xl
          hover:border-accent-primary/20 transition-colors no-underline group">
  
  <!-- Cover image -->
  {coverImage && (
    <img src={coverImage} alt={title}
         class="w-full h-40 object-cover rounded-lg mb-4"
         loading="lazy" />
  )}

  <!-- Tags -->
  <div class="flex flex-wrap gap-1.5 mb-3">
    {tags.slice(0, 3).map((tag) => (
      <span class="px-2 py-0.5 text-[10px] font-mono border border-border-accent rounded-full text-text-muted">
        {tag}
      </span>
    ))}
  </div>

  <!-- Title -->
  <h2 class="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
    {title}
  </h2>

  <!-- Excerpt -->
  {excerpt && (
    <p class="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-3">
      {excerpt}
    </p>
  )}

  <!-- Date -->
  <time class="text-xs font-mono text-text-muted">{formattedDate}</time>
</a>
```

---

## Step 7: Build the Blog Post Page

This is the most important page — it renders individual blog posts with a reading layout, sidebar table of contents, and related articles.

### Dynamic Route: `[...slug].astro`

Create `src/pages/blog/[...slug].astro`. The `[...slug]` syntax is Astro's catch-all route — it matches `/blog/any-post-slug`.

```astro
---
// src/pages/blog/[...slug].astro
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getCollection } from "astro:content";

// Generate a page for every non-draft blog post at build time
export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, "") },
    props: { post },
  }));
}

const { post } = Astro.props;
const { title, date, excerpt, tags, coverImage } = post.data;
const { Content, headings = [] } = await post.render();

const formattedDate = new Date(date).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

// Calculate reading time
const body = post.body || "";
const wordCount = body.split(/\s+/).filter(Boolean).length;
const readingTime = Math.max(1, Math.ceil(wordCount / 200));
---

<BaseLayout title={title} description={excerpt} article={true}>
  <main class="pb-24">

    <!-- Cover hero (if image exists) -->
    {coverImage && (
      <div class="relative h-[40vh] min-h-[300px] overflow-hidden">
        <img src={coverImage} alt={title}
             class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary"></div>
      </div>
    )}

    <!-- Article header -->
    <div class="max-w-4xl mx-auto px-6">
      <header class={coverImage ? "-mt-20 relative z-10 mb-6" : "pt-20 mb-6"}>
        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <a href={`/blog?tag=${tag}`}
               class="px-2.5 py-1 text-[11px] font-mono border border-border-accent rounded-full
                      text-text-secondary hover:border-accent-primary/30 transition-colors no-underline">
              {tag}
            </a>
          ))}
        </div>

        <!-- Title -->
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">{title}</h1>

        <!-- Meta -->
        <div class="flex items-center gap-3 text-sm text-text-muted font-mono">
          <time datetime={date.toISOString()}>{formattedDate}</time>
          <span class="w-1 h-1 rounded-full bg-text-muted"></span>
          <span>{readingTime} min read</span>
          <span class="w-1 h-1 rounded-full bg-text-muted"></span>
          <span class="text-accent-primary">{wordCount.toLocaleString()} words</span>
        </div>
      </header>
    </div>

    <!-- Content + Sidebar TOC -->
    <div class="max-w-6xl mx-auto px-6">
      <!-- Mobile TOC (collapsible, shown on small screens) -->
      {headings.length > 0 && (
        <details class="mb-8 lg:hidden bg-bg-secondary border border-border-subtle rounded-xl">
          <summary class="px-5 py-3 text-sm font-medium cursor-pointer select-none
                        text-text-secondary hover:text-text-primary transition-colors">
            Table of Contents
          </summary>
          <div class="px-5 pb-4">
            <nav class="border-l border-border-subtle pl-4 space-y-1.5">
              {headings.filter(h => h.depth >= 2 && h.depth <= 3).map(h => (
                <a href={`#${h.slug}`}
                   class={`block text-sm transition-colors hover:text-accent-primary
                           ${h.depth === 2 ? "text-text-secondary" : "pl-3 text-text-muted text-xs"}`}>
                  {h.text}
                </a>
              ))}
            </nav>
          </div>
        </details>
      )}

      <!-- Article content -->
      <div class="prose max-w-none" itemscope itemprop="articleBody">
        <Content />
      </div>
    </div>
  </main>
</BaseLayout>
```

**How `getStaticPaths()` works:**

When you build the site, Astro calls `getStaticPaths()` to determine which pages to generate. Each returned object creates one HTML file:

```
/blog/hello-world/index.html
/blog/building-blog-with-astro/index.html
```

The `params.slug` value becomes `Astro.params.slug` for each page.

### `post.render()` — What It Returns

```javascript
const { Content, headings } = await post.render();
```

- `Content` — An Astro component that renders the markdown body as HTML
- `headings` — An array of `{ depth: number, slug: string, text: string }` extracted from all headings in the post

---

## Step 8: Add a Table of Contents

The TOC sidebar enhances readability by showing the post structure. Let's build a component with active heading tracking.

### Create the Component

Create `src/components/TableOfContents.astro`:

```astro
---
// src/components/TableOfContents.astro
interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export interface Props {
  headings: Heading[];
}

const { headings } = Astro.props;
const toc = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
---

{toc.length > 0 && (
  <nav class="sticky top-24" aria-label="Table of Contents">
    <h4 class="text-xs font-mono text-text-muted uppercase tracking-wider mb-3">
      On this page
    </h4>
    <ul class="space-y-1.5 border-l border-border-subtle pl-4">
      {toc.map((h) => (
        <li>
          <a href={`#${h.slug}`}
             class={`toc-link block text-sm transition-colors hover:text-accent-primary
                     ${h.depth === 2
                       ? "text-text-secondary"
                       : "pl-3 text-text-muted text-xs"}`}>
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
)}
```

### Active Heading Tracking (Client-side)

Add this script to your blog post page to highlight the current heading as the user scrolls:

```javascript
// Add this inside a <script> tag on your blog post page
const tocLinks = document.querySelectorAll(".toc-link");
const headings = Array.from(document.querySelectorAll(".prose h2[id], .prose h3[id]"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = document.querySelector(`[href="#${entry.target.id}"]`);
      if (entry.isIntersecting) {
        // Remove active state from all links
        tocLinks.forEach((l) => l.classList.remove("text-accent-primary", "font-medium"));
        // Add active state to the current link
        if (link) link.classList.add("text-accent-primary", "font-medium");
      }
    });
  },
  { rootMargin: "-80px 0px -70% 0px" } // Trigger when heading is 80px from top
);

headings.forEach((h) => observer.observe(h));
```

**How it works:** The Intersection Observer watches each heading. When a heading enters the viewport (with an 80px offset for the fixed header), the corresponding TOC link gets highlighted.

---

## Step 9: Add Tag Filtering

Since Astro outputs a static site, server-side query parameters won't work at runtime. We need client-side JavaScript.

Add this script to your blog listing page (`index.astro`):

```javascript
// Inside the page's <script> tag
const cards = document.querySelectorAll("#posts-grid .post-card");
const empty = document.getElementById("empty-state");
const btns = document.querySelectorAll(".tag-btn");

function filterBy(selectedTag) {
  let visible = 0;
  cards.forEach((card) => {
    const tags = (card.getAttribute("data-tags") || "").split(",");
    const match = !selectedTag || tags.includes(selectedTag);
    card.classList.toggle("hidden", !match);
    if (match) visible++;
  });
  // Show/hide empty state
  if (empty) empty.classList.toggle("hidden", visible > 0);
}

function updateActive(selectedTag) {
  btns.forEach((btn) => {
    const btnTag = btn.getAttribute("data-tag") || "";
    const active = btnTag === selectedTag;
    btn.classList.toggle("bg-accent-primary/10", active);
    btn.classList.toggle("text-accent-primary", active);
    btn.classList.toggle("text-text-secondary", !active);
  });
}

// Apply filter from URL on page load
const tag = new URLSearchParams(window.location.search).get("tag") || "";
if (tag) {
  filterBy(tag);
  updateActive(tag);
}

// Intercept clicks to filter without page reload
btns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const t = btn.getAttribute("data-tag") || "";
    history.replaceState(null, "", t ? `/blog?tag=${t}` : "/blog");
    filterBy(t);
    updateActive(t);
  });
});
```

**How it works:**

1. Each `.post-card` has a `data-tags` attribute with comma-separated tags
2. Clicking a tag button reads its `data-tag` value
3. It shows/hides cards based on whether they contain the selected tag
4. The URL is updated via `history.replaceState()` (no page reload)
5. On page load, it reads `?tag=` from the URL and applies the filter

---

## Step 10: Add a Reading Progress Bar

A small visual indicator at the top of the page showing how far the reader has scrolled.

Add this to your blog post template:

```html
<div id="progress-bar"
     class="fixed top-0 left-0 h-0.5 bg-accent-primary z-50 transition-all"
     style="width: 0%"></div>
```

```javascript
const bar = document.getElementById("progress-bar");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  bar.style.width = `${Math.min(100, progress)}%`;
}, { passive: true });
```

---

## Step 11: Style Markdown Content (Prose)

Markdown rendered by Astro needs styling. Add these styles to `global.css`:

```css
/* src/styles/global.css */

/* Prose container */
.prose {
  color: var(--color-text-primary);
  line-height: 1.8;
  max-width: 72ch;
}

/* Headings */
.prose h2 {
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 0.6em;
  scroll-margin-top: 100px;
  color: var(--color-text-primary);
}

.prose h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  scroll-margin-top: 100px;
}

/* Paragraphs */
.prose p {
  margin-bottom: 1.2em;
}

/* Links */
.prose a {
  color: var(--color-accent-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose a:hover {
  color: var(--color-accent-secondary);
}

/* Code blocks */
.prose code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--color-bg-elevated);
  padding: 0.15em 0.4em;
  border-radius: 4px;
  color: var(--color-accent-secondary);
}

.prose pre {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-subtle);
  border-radius: 8px;
  padding: 16px 20px;
  overflow-x: auto;
  margin: 1.5em 0;
}
.prose pre code {
  background: transparent;
  padding: 0;
  color: var(--color-text-primary);
}

/* Blockquotes */
.prose blockquote {
  border-left: 3px solid var(--color-accent-primary);
  padding-left: 16px;
  color: var(--color-text-secondary);
  margin: 1.5em 0;
  font-style: italic;
}

/* Lists */
.prose ul, .prose ol {
  padding-left: 1.5em;
  margin-bottom: 1.2em;
}
.prose li {
  margin-bottom: 0.4em;
}

/* Images */
.prose img {
  border-radius: 8px;
  margin: 1.5em 0;
  max-width: 100%;
}

/* Horizontal rules */
.prose hr {
  border: none;
  border-top: 1px solid var(--color-border-subtle);
  margin: 2em 0;
}

/* Tables */
.prose table {
  display: block;
  overflow-x: auto;
  max-width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}
.prose th, .prose td {
  padding: 8px 16px;
  border: 1px solid var(--color-border-subtle);
  text-align: left;
}
.prose th {
  background: var(--color-bg-secondary);
  font-weight: 600;
}
```

**Why `scroll-margin-top: 100px` on headings?** When clicking a TOC link, the browser scrolls to the heading. The 100px offset accounts for the fixed navigation bar so the heading isn't hidden behind it.

---

## Step 12: Add SEO Meta Tags

Astro makes SEO straightforward with its server-side rendering. Add these to your `BaseLayout.astro`:

```astro
---
const canonical = new URL(Astro.url.pathname, Astro.site).href;
const ogImageUrl = new URL(ogImage, Astro.site).href;
---

<!-- Canonical URL — prevents duplicate content issues -->
<link rel="canonical" href={canonical} />

<!-- Open Graph (Facebook, LinkedIn, Discord) -->
<meta property="og:title" content={`${title} | My Blog`} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImageUrl} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content={article ? "article" : "website"} />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={`${title} | My Blog`} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImageUrl} />

<!-- Structured Data (JSON-LD) — helps Google show rich results -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": article ? "Article" : "WebSite",
  headline: title,
  description: description,
  url: canonical,
})} />
```

For blog posts specifically, add article-specific structured data:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: excerpt,
  datePublished: date.toISOString(),
  author: {
    "@type": "Person",
    name: "Your Name",
    url: Astro.site,
  },
  url: canonical,
})} />
```

---

## Step 13: Deploy to Vercel

Vercel is the easiest deployment option for Astro sites.

### Install the Vercel Adapter

```bash
npx astro add vercel
```

This updates `astro.config.mjs` to use the Vercel adapter:

```javascript
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "static",     // Static HTML output
  adapter: vercel(),    // Vercel adapter
});
```

### Deploy via CLI

```bash
# Login to Vercel (if not already)
npx vercel login

# Deploy to production
npx vercel --prod
```

The CLI will ask you to:
1. Link to an existing Vercel project or create a new one
2. Confirm the deployment

After deployment, you'll get a URL like `https://my-blog.vercel.app`.

### Set a Custom Domain

In the Vercel dashboard:

1. Go to your project → **Settings** → **Domains**
2. Add your domain (e.g., `blog.yourname.com`)
3. Update your DNS records as instructed

---

## Step 14: Auto-Deploy with GitHub

Push-to-deploy means every `git push` automatically triggers a new Vercel deployment.

### Connect GitHub to Vercel

```bash
# In your project directory
npx vercel git connect
```

This links your local project to the GitHub repository. Once linked:

1. Push your code to GitHub
2. Vercel detects the push
3. Vercel builds and deploys automatically

Your workflow becomes:

```bash
# Make changes
git add .
git commit -m "Add new blog post"
git push    # ← Vercel auto-deploys!
```

### Environment Variables on Vercel

For any API keys or configuration, set them in the Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add variables like `PUBLIC_AI_CHAT_LIMIT=5`
3. They'll be available at build time

Variables prefixed with `PUBLIC_` are available in client-side code via `import.meta.env.PUBLIC_*`.

---

## What's Next?

Now that you have a working blog, here are some enhancements to consider:

| Feature | How |
|---------|-----|
| **RSS Feed** | Add `@astrojs/rss` — generates an XML feed automatically |
| **Image optimization** | Use Astro's `<Image />` component for automatic resizing |
| **Search** | Add [Pagefind](https://pagefind.app) for static full-text search |
| **Comments** | Embed [Giscus](https://giscus.app) (GitHub Discussions as comments) |
| **Dark/light toggle** | Use Tailwind's `dark:` variant + localStorage |
| **Analytics** | Add Umami, Plausible, or Cloudflare Web Analytics |

---

## The Full Source Code

This entire site (including the blog you're reading) is open source:

👉 [github.com/afg2002/afghanep-cv-portfolio-web](https://github.com/afg2002/afghanep-cv-portfolio-web)

Feel free to use it as a reference or starting point for your own blog!
