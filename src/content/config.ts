import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  // `image` is provided by the schema context (not exported from astro:content).
  // It resolves a relative path in frontmatter into ImageMetadata so that
  // astro:assets can optimise the cover at build time.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      excerpt: z.string(),
      tags: z.array(z.string()).default([]),
      // Order matters: `image()` must come first so local files resolve to
      // ImageMetadata. Remote URLs fail image() and fall through to z.string().
      coverImage: z.union([image(), z.string()]).optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = {
  blog: blogCollection,
};
