import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

/** Frontmatter fields that describe the entry rather than belong to its body. */
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

const asText = (value: unknown): string =>
  typeof value === "string" ? value : Array.isArray(value) ? value.join(", ") : String(value ?? "");

/**
 * Raw Markdown mirror of a post, served at `/blog/<slug>.md`.
 *
 * An agent reading the HTML version has to wade through the header nav, the
 * table of contents sidebar, the footer and a comment embed to reach the
 * argument. This route hands over the source itself, with a short frontmatter
 * preamble so the title, date and tags survive the conversion to plain text.
 */
export const GET: APIRoute = async ({ props }) => {
  const post = (props as { post: CollectionEntry<"blog"> }).post;
  const { data, body = "" } = post;

  const preamble = [
    `# ${data.title}`,
    "",
    `> ${data.excerpt}`,
    "",
    `Published: ${data.date.toISOString().slice(0, 10)}`,
    data.tags?.length ? `Tags: ${data.tags.map(asText).join(", ")}` : null,
    `Canonical: https://aep.my.id/blog/${post.slug}/`,
    "",
    "---",
    "",
  ]
    .filter((line) => line !== null)
    .join("\n");

  return new Response(preamble + body.trimStart(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // short cache: content edits should not wait a year to propagate
      "Cache-Control": "public, max-age=3600",
    },
  });
};

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}) satisfies GetStaticPaths;
