import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: "Afghan Eka Pangestu — Writing",
    description:
      "Notes on software development, backend architecture, and building for the web.",
    site: context.site!,
    items: sorted.map((post) => {
      const slug = post.id.replace(/\.(md|mdx)$/, "");
      return {
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: new Date(post.data.date),
        link: `/blog/${slug}/`,
        categories: post.data.tags,
        author: "Afghan Eka Pangestu",
      };
    }),
    customData: "<language>en</language>",
  });
}
