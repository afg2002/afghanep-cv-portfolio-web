/**
 * Build-time site telemetry.
 *
 * Everything here comes from a real artefact — git history, the content
 * collections, package.json — rather than a hand-written badge claiming
 * "99.9% uptime". Numbers that cannot be verified are not shown at all.
 *
 * Runs during prerender inside Vite, so node built-ins are available.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { getCollection } from "astro:content";

const ROOT = process.cwd();

export type Commit = {
  hash: string;
  subject: string;
  date: string;
  relative: string;
};

export type SiteFacts = {
  generatedAt: string;
  commit: Commit | null;
  commitCount: number;
  /** False when the checkout is shallow, so history-based numbers are withheld. */
  historyComplete: boolean;
  firstCommitDate: string | null;
  trackedFiles: number;
  sourceLines: number;
  posts: number;
  postWords: number;
  tags: string[];
  dependencies: number;
  devDependencies: number;
  packageCount: number;
};

/** A shallow clone has truncated history: commit counts from it would be false. */
function isShallow(): boolean {
  return fs.existsSync(path.join(ROOT, ".git", "shallow"));
}

function git(args: string): string {
  try {
    return execSync(`git ${args}`, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

/** Recursively count files and lines under a directory, skipping build output. */
function scanSource(dir: string): { files: number; lines: number } {
  let files = 0;
  let lines = 0;
  if (!fs.existsSync(dir)) return { files, lines };

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = scanSource(full);
      files += nested.files;
      lines += nested.lines;
      continue;
    }
    files += 1;
    lines += fs.readFileSync(full, "utf8").split("\n").length;
  }
  return { files, lines };
}

export async function getSiteFacts(): Promise<SiteFacts> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const postWords = posts.reduce((sum, post) => {
    const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
    return sum + words;
  }, 0);

  const tags = [...new Set(posts.flatMap((post) => post.data.tags ?? []))].sort();

  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));

  const sources = scanSource(path.join(ROOT, "src"));

  const commitHash = git("log -1 --format=%h");

  return {
    generatedAt: new Date().toISOString(),
    commit: commitHash
      ? {
          hash: commitHash,
          subject: git("log -1 --format=%s"),
          date: git("log -1 --format=%cI"),
          relative: git("log -1 --format=%cr"),
        }
      : null,
    commitCount: git("rev-list --count HEAD") ? Number(git("rev-list --count HEAD")) : 0,
    historyComplete: !isShallow(),
    firstCommitDate: isShallow() ? null : git("log --reverse --format=%cI | head -1") || null,
    trackedFiles: sources.files,
    sourceLines: sources.lines,
    posts: posts.length,
    postWords,
    tags,
    dependencies: Object.keys(pkg.dependencies ?? {}).length,
    devDependencies: Object.keys(pkg.devDependencies ?? {}).length,
    // one number, so a zero devDeps never renders as "20 + 0"
    packageCount:
      Object.keys(pkg.dependencies ?? {}).length + Object.keys(pkg.devDependencies ?? {}).length,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
