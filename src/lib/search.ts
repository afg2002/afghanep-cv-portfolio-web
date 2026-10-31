/**
 * Shared client-side search for the site.
 *
 * Pagefind 1.x ships `pagefind.js` as an **ES module** (`export { search, init, … }`).
 * It never assigns `window.pagefind`, so it must be loaded with a dynamic `import()`
 * — using a classic `<script src>` tag both fails to expose an API and throws a
 * syntax error on the `export` statement.
 *
 * A small document manifest is rendered into every page by BaseLayout and used as a
 * fallback, so search keeps working when the index is absent (e.g. `astro dev`,
 * where Pagefind only runs at build time) or if the index request fails.
 */

export type SearchKind = "post" | "page";

export interface SearchHit {
  url: string;
  title: string;
  excerpt: string;
  kind: SearchKind;
}

interface Doc {
  t: string;
  d: string;
  u: string;
  k: SearchKind;
}

let docsCache: Doc[] | null = null;
let pagefindPromise: Promise<any | null> | null = null;

/** Read the fallback manifest injected by BaseLayout. */
export function localDocs(): Doc[] {
  if (docsCache) return docsCache;
  docsCache = [];
  try {
    const el = document.getElementById("search-docs");
    if (el?.textContent) {
      const parsed = JSON.parse(el.textContent);
      if (Array.isArray(parsed)) docsCache = parsed as Doc[];
    }
  } catch {
    /* malformed manifest — fall back to an empty list */
  }
  return docsCache;
}

/**
 * Lazily import the Pagefind module once. Resolves to `null` when unavailable.
 *
 * The specifier is built at runtime (not a string literal) so bundlers leave it
 * alone: `/pagefind/pagefind.js` only exists in the build output, not in source.
 */
export function loadPagefind(): Promise<any | null> {
  if (!pagefindPromise) {
    const url = ["", "pagefind", "pagefind.js"].join("/");
    pagefindPromise = import(/* @vite-ignore */ url).catch(() => null);
  }
  return pagefindPromise;
}

export function stripTags(html: string): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

function scoreDoc(doc: Doc, terms: string[]): number {
  const title = doc.t.toLowerCase();
  const body = `${doc.d} ${doc.k === "post" ? "writing post article blog" : "page"}`.toLowerCase();
  let score = 0;
  for (const term of terms) {
    const inTitle = title.includes(term);
    const inBody = body.includes(term);
    if (!inTitle && !inBody) return 0; // every term must match somewhere
    score += inTitle ? 6 : 0;
    score += inBody ? 2 : 0;
    if (title.startsWith(term)) score += 4;
  }
  return score;
}

function searchLocal(query: string, limit: number): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return localDocs()
    .map((doc) => ({ doc, score: scoreDoc(doc, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc }) => ({
      url: doc.u,
      title: doc.t,
      excerpt: doc.d,
      kind: doc.k,
    }));
}

/**
 * Search the site. Uses Pagefind when the index is available, otherwise the
 * local manifest. Always resolves (never throws) so callers can render safely.
 */
export async function searchSite(query: string, limit = 8): Promise<SearchHit[]> {
  const q = query.trim();
  if (!q) return [];

  const pagefind = await loadPagefind();

  if (pagefind?.search) {
    try {
      const result = await pagefind.search(q);
      const raw = (result?.results ?? []).slice(0, limit);
      const loaded = await Promise.all(raw.map((r: any) => r.data()));
      const hits: SearchHit[] = loaded
        .filter((d: any) => d && d.url)
        .map((d: any) => ({
          url: d.url,
          title: d.meta?.title || stripTags(d.excerpt) || "Untitled",
          excerpt: stripTags(d.excerpt || d.meta?.description || ""),
          kind: String(d.url).includes("/blog/") ? "post" : "page",
        }));
      if (hits.length) return hits;
    } catch {
      /* fall through to the local manifest */
    }
  }

  return searchLocal(q, limit);
}

/** True when the Pagefind index is present and usable. */
export async function pagefindAvailable(): Promise<boolean> {
  const pagefind = await loadPagefind();
  return Boolean(pagefind?.search);
}
