/**
 * index-to-para.mjs
 * 
 * Indexes Astro's dist/ output to Para backend after build.
 * Run automatically: npm run build (includes "&& npm run index")
 * 
 * Para credentials from environment variables:
 *   PARA_APP_ID      - your app name/id (e.g. "cv-portfolio")
 *   PARA_ACCESS_KEY  - access key (e.g. "app:cv-portfolio")
 *   PARA_SECRET_KEY  - secret key for indexing
 *   PARA_ENDPOINT    - optional, defaults to https://para.io
 */

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const BASE_URL = "https://aep.my.id";

// ── Para Config from env ─────────────────────────────────────────────
const PARA_APP_ID = process.env.PARA_APP_ID || "cv-portfolio";
const PARA_ENDPOINT = process.env.PARA_ENDPOINT || "https://para.io";
const PARA_ACCESS_KEY = process.env.PARA_ACCESS_KEY || "app:cv-portfolio";
const PARA_SECRET_KEY = process.env.PARA_SECRET_KEY || "";
// ─────────────────────────────────────────────────────────────────────

if (!PARA_SECRET_KEY) {
  console.error("[para-index] ERROR: PARA_SECRET_KEY environment variable is not set.");
  console.error("[para-index] Set it with: export PARA_SECRET_KEY=your_secret_key");
  process.exit(1);
}

async function getAllHtmlFiles(dir, base = "") {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...(await getAllHtmlFiles(full, rel)));
    } else if (entry.name === "index.html") {
      const cleanPath = rel.replace(/\/index\.html$/, "") || "";
      files.push({ fullPath: full, cleanPath });
    } else if (entry.name.endsWith(".html")) {
      files.push({ fullPath: full, cleanPath: rel });
    }
  }
  return files;
}

function htmlToText(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMeta(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  return {
    title: titleMatch?.[1]?.replace(/\|.*$/, "").trim() || "",
    description: descMatch?.[1] || ogTitleMatch?.[1] || "",
  };
}

async function main() {
  console.log("[para-index] Starting indexing to Para...");
  console.log(`[para-index] App: ${PARA_APP_ID}`);
  console.log(`[para-index] Endpoint: ${PARA_ENDPOINT}`);

  const htmlFiles = await getAllHtmlFiles(DIST_DIR);
  console.log(`[para-index] Found ${htmlFiles.length} HTML files to index`);

  let success = 0;
  let failed = 0;

  for (const { fullPath, cleanPath } of htmlFiles) {
    try {
      const html = await readFile(fullPath, "utf-8");
      const { title, description } = extractMeta(html);
      const content = htmlToText(html);
      const url = BASE_URL + "/" + cleanPath.replace(/\.html$/, "").replace(/^\//, "");

      const isBlog = cleanPath.includes("/blog/");
      const type = isBlog ? "blogpost" : "page";

      const payload = JSON.stringify({
        type,
        name: url,
        title: title || "Untitled",
        description: description,
        content: content.slice(0, 10000),
        url,
        timestamp: new Date().toISOString(),
      });

      const tmpFile = join(__dirname, ".para-tmp.json");
      writeFileSync(tmpFile, payload);

      const cmd = [
        "para-cli",
        "create", `"${tmpFile}"`,
        "--type", type,
        "--sanitize",
        "--endpoint", `"${PARA_ENDPOINT}"`,
        "--access-key", `"${PARA_ACCESS_KEY}"`,
        "--secret-key", `"${PARA_SECRET_KEY}"`,
      ].join(" ");

      try {
        execSync(cmd, { stdio: "pipe" });
        console.log(`[para-index] ✓ ${url}`);
        success++;
      } catch (e) {
        console.warn(`[para-index] ✗ ${url} — ${(e as Error).message}`);
        failed++;
      }

      unlinkSync(tmpFile);
    } catch (err) {
      console.warn(`[para-index] Error: ${fullPath} — ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n[para-index] Done! ${success} indexed, ${failed} failed`);
  if (success > 0) {
    console.log(`[para-index] Search should now work at https://aep.my.id (Ctrl+K)`);
  }
}

main().catch((err) => {
  console.error("[para-index] Fatal:", err);
  process.exit(1);
});