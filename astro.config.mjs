import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import mermaid from "astro-mermaid";
import pagefind from "astro-pagefind";

/** Walk a directory and map every file to its size in bytes. */
function collectFiles(dir, base = dir, out = {}) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, base, out);
    else out[path.relative(base, full).split(path.sep).join("/")] = fs.statSync(full).size;
  }
  return out;
}

export default defineConfig({
  site: "https://aep.my.id",
  integrations: [
    mdx(),
    sitemap(),
    mermaid({
      theme: "base",
    }),
    pagefind(),
    {
      name: "site-status",
      hooks: {
        /**
         * Real page weight can only be measured once every page exists, so the
         * machine-readable report is written after the build rather than
         * rendered as an Astro page. `/status.json` is served as a plain asset.
         */
        "astro:build:done": async ({ dir, pages, logger }) => {
          const distDir = fileURLToPath(dir);
          const files = collectFiles(distDir);

          // pagefind runs after build:done, so its runtime is never counted here
          const tracked = [
            { route: "/", label: "Home", file: "index.html" },
            { route: "/blog/", label: "Writing index", file: "blog/index.html" },
            { route: "/status/", label: "Status", file: "status/index.html" },
            { route: "/404", label: "Not found", file: "404.html" },
          ];

          const trackedPages = [];
          const uniqueCss = new Set();
          for (const { route, label, file } of tracked) {
            const htmlPath = path.join(distDir, file);
            if (!fs.existsSync(htmlPath)) continue;
            const html = fs.readFileSync(htmlPath, "utf8");
            const htmlBytes = files[file] ?? 0;

            let js = 0;
            let css = 0;
            for (const [, href] of html.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/g)) {
              css += files[href.replace(/^\//, "").split("?")[0]] ?? 0;
            }
            for (const [, src] of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
              if (src.includes("/pagefind/")) continue;
              js += files[src.replace(/^\//, "").split("?")[0]] ?? 0;
            }

            // the same stylesheet is loaded by every route: count it once in the
            // totals, or a 4-page site appears to ship 300 KB of CSS
            for (const [, href] of html.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/g)) {
              uniqueCss.add(href.replace(/^\//, "").split("?")[0]);
            }

            trackedPages.push({
              route,
              label,
              html: htmlBytes,
              js,
              css,
              total: htmlBytes + js + css,
            });
          }

          const authoredRoutes = pages.filter((p) => !p.pathname.startsWith("404")).length;

          let buildId = "unknown";
          try {
            buildId = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
          } catch {}

          const report = {
            generatedAt: new Date().toISOString(),
            buildId,
            routes: {
              total: pages.length,
              authored: authoredRoutes,
              generated: pages.length - authoredRoutes,
            },
            pages: trackedPages,
            totals: {
              html: trackedPages.reduce((s, p) => s + p.html, 0),
              js: trackedPages.reduce((s, p) => s + p.js, 0),
              css: [...uniqueCss].reduce((s, f) => s + (files[f] ?? 0), 0),
              transfer: trackedPages.reduce((s, p) => s + p.total, 0),
            },
            dist: {
              files: Object.keys(files).length,
              bytes: Object.values(files).reduce((s, n) => s + n, 0),
            },
          };

          fs.mkdirSync(distDir, { recursive: true });
          fs.writeFileSync(path.join(distDir, "status.json"), `${JSON.stringify(report, null, 2)}\n`);
          logger.info(
            `status.json → ${trackedPages.length} routes tracked, ${report.dist.files} files, ${(report.dist.bytes / 1024 / 1024).toFixed(2)} MB`,
          );
        },
      },
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
  adapter: vercel(),
  image: {
    // sharp powers build-time optimisation of blog covers (WebP/AVIF + srcset)
    service: { entrypoint: "astro/assets/services/sharp" },
  },
  server: {
    host: true,
    // Allow the sandbox preview proxy host during development
    allowedHosts: true,
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true,
    },
  },
});