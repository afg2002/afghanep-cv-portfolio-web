/**
 * generate-search-index.mjs
 * 
 * Scans Astro's dist/ output and generates a FlexSearch-compatible
 * JSON index: search-index.json
 * 
 * Run AFTER `astro build`: npm run build
 */

import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const OUTPUT_FILE = join(__dirname, "..", "dist", "search-index.json");

// ── helpers ──────────────────────────────────────────────────────────

async function getAllHtmlFiles(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await getAllHtmlFiles(full, rel)));
    } else if (entry.name === "index.html") {
      files.push(rel.replace(/\/index\.html$/, "/") || "/");
    } else if (entry.name.endsWith(".html")) {
      files.push("/" + rel);
    }
  }
  return files;
}

async function extractPageData(htmlPath, baseUrl = "https://aep.my.id") {
  const raw = await readFile(htmlPath, "utf-8");
  const $ = await load(raw);

  // Title
  const title = $("h1, title").first().text().trim();

  // Meta description
  const description = $('meta[name="description"]').attr("content") || "";

  // Main content (strip nav, header, footer, script)
  const main = $("main, [data-pagefind-body], article, .content, #main-content")
    .first()
    .clone();
  main.find("script, style, nav, header, footer, [data-pagefind-ignore], [data-pagefind-body]").remove();
  const content = main.text().replace(/\s+/g, " ").trim().slice(0, 5000); // cap at 5k chars

  // Detect type
  const path = htmlPath.replace(DIST_DIR, "");
  const isBlog = path.includes("/blog/");
  const isIndex = path.endsWith("/index.html") && path.split("/").filter(Boolean).length <= 2;

  // Build URL
  const url = path
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "")
    .replace(/^\//, "");

  return {
    title: title.replace(/\|.*$/, "").trim(),
    description,
    content,
    url: "/" + url,
    type: isBlog ? "blog" : isIndex ? "home" : "page",
  };
}

// ── main ─────────────────────────────────────────────────────────────

async function main() {
  console.log("[search-index] Scanning dist/ ...");

  const htmlFiles = await getAllHtmlFiles(DIST_DIR);
  console.log(`[search-index] Found ${htmlFiles.length} HTML files`);

  const pages = [];
  for (const pagePath of htmlFiles) {
    const fullPath = join(DIST_DIR, pagePath === "/" ? "index.html" : pagePath);
    try {
      const data = await extractPageData(fullPath);
      pages.push(data);
    } catch (err) {
      console.warn(`[search-index] Skip ${pagePath}: ${err.message}`);
    }
  }

  // Sort: blog first, then pages, home last
  pages.sort((a, b) => {
    if (a.type === "blog" && b.type !== "blog") return -1;
    if (a.type !== "blog" && b.type === "blog") return 1;
    if (a.type === "home") return 1;
    if (b.type === "home") return -1;
    return 0;
  });

  await mkdir(DIST_DIR, { recursive: true });
  await writeFile(OUTPUT_FILE, JSON.stringify(pages, null, 2), "utf-8");
  console.log(`[search-index] Written ${pages.length} entries → dist/search-index.json`);
}

main().catch((err) => {
  console.error("[search-index] Fatal:", err);
  process.exit(1);
});