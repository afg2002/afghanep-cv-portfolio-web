import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import mermaid from "astro-mermaid";

export default defineConfig({
  site: "https://aep.my.id",
  integrations: [
    mdx(),
    sitemap(),
    mermaid({
      theme: "base",
    }),
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