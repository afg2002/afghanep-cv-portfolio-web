import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import mermaid from "astro-mermaid";
import pagefind from "astro-pagefind";

export default defineConfig({
  site: "https://aep.my.id",
  integrations: [
    mdx(),
    sitemap(),
    mermaid({
      theme: "base",
    }),
    pagefind(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
});
