/**
 * index-to-para.mjs
 * 
 * Indexes Astro's dist/ output to Para backend after build.
 * Uses para-cli to push HTML content for full-text search.
 * 
 * Usage: npm run index
 * Or run automatically after build: npm run build
 * 
 * Para setup:
 * 1. Create free account at https://paraio.com
 * 2. Create an app (gives you endpoint + access_key + secret_key)
 * 3. Set env vars or update the config below
 */

import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const DIST_DIR = join(__dirname, "..", "dist");
const BASE_URL = "https://aep.my.id";

// ── Para Config ──────────────────────────────────────────────────────
// Get these from your Para app at https://paraio.com (free tier works)
const PARA_ENDPOINT = process.env.PARA_ENDPOINT || "https://para.io";  // or your self-hosted
const PARA_ACCESS_KEY = process.env.PARA_ACCESS_KEY || "YOUR_ACCESS_KEY";
const PARA_SECRET_KEY = process.env.PARA_SECRET_KEY || "YOUR_SECRET_KEY";
// ─────────────────────────────────────────────────────────────────────

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

async function htmlToText(html) {
  // Simple HTML to text extraction
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

async function extractMeta(html) {
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
  console.log(`[para-index] Endpoint: ${PARA_ENDPOINT}`);
  console.log(`[para-index] Access Key: ${PARA_ACCESS_KEY.slice(0, 8)}...`);

  if (PARA_ACCESS_KEY === "YOUR_ACCESS_KEY" || PARA_SECRET_KEY === "YOUR_SECRET_KEY") {
    console.error("[para-index] ERROR: Please set PARA_ACCESS_KEY and PARA_SECRET_KEY environment variables.");
    console.error("[para-index] Or update the config in scripts/index-to-para.mjs");
    console.error("\nTo get credentials:");
    console.error("1. Sign up at https://paraio.com (free)");
    console.error("2. Create an app → Settings → API Keys");
    console.error("3. Set env vars:");
    console.error("   export PARA_ACCESS_KEY=your_key");
    console.error("   export PARA_SECRET_KEY=your_secret");
    process.exit(1);
  }

  const htmlFiles = await getAllHtmlFiles(DIST_DIR);
  console.log(`[para-index] Found ${htmlFiles.length} HTML files`);

  let success = 0;
  let failed = 0;

  for (const { fullPath, cleanPath } of htmlFiles) {
    try {
      const html = await readFile(fullPath, "utf-8");
      const { title, description } = await extractMeta(html);
      const content = await htmlToText(html);
      const url = BASE_URL + "/" + cleanPath.replace(/\.html$/, "").replace(/^\//, "");

      // Determine type
      const isBlog = cleanPath.includes("/blog/");
      const type = isBlog ? "blogpost" : "page";

      // Build JSON payload for Para
      const payload = JSON.stringify({
        type,
        title: title || "Untitled",
        description: description,
        content: content.slice(0, 10000), // Para has a limit
        url,
        timestamp: new Date().toISOString(),
      });

      // Use para-cli create command
      // Write payload to temp file to avoid shell escaping issues
      const { writeFileSync, unlinkSync } = await import("node:fs");
      const tmpFile = join(__dirname, ".para-tmp.json");
      writeFileSync(tmpFile, payload);

      const cmd = `para-cli create "${tmpFile}" --type "${type}" --sanitize --endpoint "${PARA_ENDPOINT}" --access-key "${PARA_ACCESS_KEY}" --secret-key "${PARA_SECRET_KEY}"`;

      try {
        execSync(cmd, { stdio: "pipe" });
        console.log(`[para-index] Indexed: ${url}`);
        success++;
      } catch (e) {
        console.warn(`[para-index] Failed: ${url} — ${e.message}`);
        failed++;
      } finally {
        unlinkSync(tmpFile);
      }
    } catch (err) {
      console.warn(`[para-index] Error reading ${fullPath}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n[para-index] Done! ${success} indexed, ${failed} failed`);
  if (failed > 0) {
    console.warn("[para-index] Some files failed. Check Para connection and retry.");
  }
}

main().catch((err) => {
  console.error("[para-index] Fatal:", err);
  process.exit(1);
});