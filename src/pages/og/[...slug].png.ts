import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { renderOgImage } from "../../lib/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, "") },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const post = (props as any).post;
  const { title, tags, date } = post.data;

  const body: string = post.body || "";
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const d = new Date(date);
  const published = `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;

  const png = await renderOgImage({
    eyebrow: "Writing",
    title,
    footer: tags.length ? tags.slice(0, 2).join(" · ") : undefined,
    meta: [
      { label: "Published", value: published },
      { label: "Reading", value: `${readingTime} min` },
      { label: "Tags", value: String(tags.length), accent: true },
    ],
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
