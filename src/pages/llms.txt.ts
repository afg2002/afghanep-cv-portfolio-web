import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

/**
 * `/llms.txt` — a curated index of this site for language models.
 *
 * Honest caveat: no major provider has confirmed llms.txt as a ranking or
 * citation signal, and Google has said it does not use it. It is cheap to
 * publish and GPTBot/ClaudeBot/PerplexityBot are reported to read it, so it
 * sits alongside robots.txt and the sitemap rather than replacing either.
 *
 * Generated at build time so the post list cannot go stale.
 */
export const GET: APIRoute = async ({ site }) => {
  const origin = site?.href.replace(/\/$/, "") ?? "https://aep.my.id";

  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  const lines: string[] = [
    "# Afghan Eka Pangestu",
    "",
    "> Software developer in Bogor, Indonesia (GMT+7), working since 2024. Builds backend systems, REST APIs and enterprise applications, mainly in Java/Spring Boot and Laravel/PHP. Currently Java Developer at Generali Indonesia. Degree in Informatics Engineering, GPA 3.62/4.00.",
    "",
    "Notes for automated readers:",
    "",
    "- Every page is server-rendered; no JavaScript is required to read the content.",
    "- Each article also exists as raw Markdown at the same path with a `.md` suffix, linked in its HTML `<head>` and in the HTTP `Link` header.",
    "- Structured data (`Person`, `WebSite`, `BlogPosting`) is embedded as JSON-LD on every page.",
    "- Content may be summarised and quoted with attribution to " + origin + ".",
    "",
    "## About",
    "",
    `- [Home](${origin}/): overview, selected work, stack, experience, contact.`,
    `- [Status](${origin}/status/): build telemetry — page weight per route, source size, content stats.`,
    "",
    "## Writing",
    "",
    ...posts.map((post) => {
      const description = post.data.excerpt.replace(/\s+/g, " ").trim();
      const date = post.data.date.toISOString().slice(0, 10);
      return `- [${post.data.title}](${origin}/blog/${post.slug}.md): ${description} (${date})`;
    }),
    "",
    "## Optional",
    "",
    `- [RSS feed](${origin}/rss.xml): full-text feed, newest first.`,
    `- [Sitemap](${origin}/sitemap-index.xml): every indexable URL.`,
    `- [Curriculum vitae](${origin}/cv-afghan-eka-pangestu.pdf): PDF, one page.`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
