import type { APIRoute } from "astro";

export const prerender = false;

// ── Simple in-memory IP rate limiter (daily) ────
// NOTE: Resets on Vercel cold starts, but good enough for a portfolio.
const ipCounts = new Map<string, { count: number; date: string }>();

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function getDailyLimit(): number {
  try {
    const env = import.meta.env as Record<string, string | undefined>;
    const val = env["PUBLIC_AI_CHAT_LIMIT"];
    if (val) return parseInt(val, 10) || 5;
  } catch {}
  if (typeof process !== "undefined" && process.env) {
    const val = process.env["PUBLIC_AI_CHAT_LIMIT"];
    if (val) return parseInt(val, 10) || 5;
  }
  return 5;
}

interface Provider {
  name: string;
  fetch: () => Promise<Response>;
}

const PROVIDER_CONFIGS = [
  {
    name: "Groq",
    envKeys: ["GROQ_API_KEY"],
    buildFetch: (messages: unknown[], key: string): Provider["fetch"] => {
      const model = getEnv("GROQ_MODEL") || "llama-3.3-70b-versatile";
      return async () => {
        return fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            max_tokens: 4096,
          }),
        });
      };
    },
  },
  // ── OpenCode Zen fallback chain (OpenAI-compatible) ──
  // Docs: https://opencode.ai/docs/zen/
  // Free models: Big Pickle, MiniMax M2.5 Free, Ling 2.6 Flash Free,
  //              Hy3 Preview Free, Nemotron 3 Super Free
  {
    name: "Zen Ling",
    envKeys: ["ZEN_API_KEY"],
    buildFetch: (messages: unknown[], key: string): Provider["fetch"] => {
      const model = getEnv("ZEN_LING_MODEL") || "ling-2.6-flash";
      return async () => {
        return fetch("https://opencode.ai/zen/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            max_tokens: 4096,
          }),
        });
      };
    },
  },
  {
    name: "Zen MiniMax",
    envKeys: ["ZEN_API_KEY"],
    buildFetch: (messages: unknown[], key: string): Provider["fetch"] => {
      const model = getEnv("ZEN_MINIMAX_MODEL") || "minimax-m2.5-free";
      return async () => {
        return fetch("https://opencode.ai/zen/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            max_tokens: 4096,
          }),
        });
      };
    },
  },
  {
    name: "Zen Nemotron",
    envKeys: ["ZEN_API_KEY"],
    buildFetch: (messages: unknown[], key: string): Provider["fetch"] => {
      const model = getEnv("ZEN_NEMOTRON_MODEL") || "nemotron-3-super-free";
      return async () => {
        return fetch("https://opencode.ai/zen/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            max_tokens: 4096,
          }),
        });
      };
    },
  },
  {
    name: "OpenRouter",
    envKeys: ["OPENROUTER_API_KEY"],
    buildFetch: (messages: unknown[], key: string): Provider["fetch"] => {
      const model =
        getEnv("OPENROUTER_MODEL") || "meta-llama/llama-3.1-8b-instruct:free";
      return async () => {
        return fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://aep.my.id",
            "X-Title": "Afghan Portfolio",
          },
          body: JSON.stringify({
            model,
            messages,
            stream: true,
            max_tokens: 4096,
          }),
        });
      };
    },
  },
];

function getEnv(key: string): string | undefined {
  // Astro/Vite exposes env vars via import.meta.env (server-side).
  // Fallback to process.env for Node.js / Vercel runtime.
  try {
    const env = import.meta.env as Record<string, string | undefined>;
    const val = env[key];
    if (val && val.length > 0) return val;
  } catch {}
  try {
    if (typeof process !== "undefined" && process.env) {
      const val = process.env[key];
      if (typeof val === "string" && val.length > 0) return val;
    }
  } catch {}
  return undefined;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || !body.messages || !Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: "messages array required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = body.messages;
  const clientTurnCount = body.turnCount || 0;
  const clientIP = getClientIP(request);
  const today = getTodayKey();
  const dailyLimit = getDailyLimit();

  // ── IP rate limiting (best-effort in-memory) ──
  let ipRecord = ipCounts.get(clientIP);
  if (!ipRecord || ipRecord.date !== today) {
    ipRecord = { count: 0, date: today };
    ipCounts.set(clientIP, ipRecord);
  }

  // Use the higher of client turnCount vs server count to stay in sync
  const effectiveCount = Math.max(clientTurnCount, ipRecord.count);
  ipRecord.count = effectiveCount;

  const remaining = Math.max(0, dailyLimit - effectiveCount);

  // If limit exceeded, reject immediately
  if (effectiveCount >= dailyLimit) {
    return new Response(
      JSON.stringify({
        error: "Daily limit reached",
        remaining: 0,
        reset: today,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Limit": String(dailyLimit),
          "X-RateLimit-Reset": today,
        },
      },
    );
  }

  // Increment count for this request
  ipRecord.count = effectiveCount + 1;
  const remainingAfter = Math.max(0, dailyLimit - ipRecord.count);

  const headersBase: Record<string, string> = {
    "X-RateLimit-Remaining": String(remainingAfter),
    "X-RateLimit-Limit": String(dailyLimit),
    "X-RateLimit-Reset": today,
  };

  // Build provider list — only include those with required env vars
  const providers: Provider[] = [];

  for (const cfg of PROVIDER_CONFIGS) {
    const envVars = cfg.envKeys.map(getEnv);
    if (envVars.every((v) => v !== undefined)) {
      providers.push({
        name: cfg.name,
        fetch: cfg.buildFetch(messages, envVars as string[]),
      });
    }
  }

  if (providers.length === 0) {
    const g = getEnv("GROQ_API_KEY") ? "✓" : "✗";
    const o = getEnv("OPENROUTER_API_KEY") ? "✓" : "✗";
    console.warn(
      `[chat] No AI providers configured. Env — GROQ_API_KEY ${g}, OPENROUTER_API_KEY ${o}`,
    );
    return new Response(
      JSON.stringify({ error: "No AI providers configured" }),
      { status: 503, headers: { ...headersBase, "Content-Type": "application/json" } },
    );
  }

  // Try each provider in order
  for (const provider of providers) {
    try {
      const response = await provider.fetch();

      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        console.warn(
          `[chat] ${provider.name} → ${response.status}:`,
          errText.slice(0, 250),
        );
        continue;
      }

      console.log(`[chat] ✅ ${provider.name} active`);

      // Pipe the upstream SSE stream directly to the client
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "X-AI-Provider": provider.name,
          ...headersBase,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[chat] ❌ ${provider.name}:`, msg);
    }
  }

  // Everything failed
  return new Response(
    JSON.stringify({
      error: "All AI providers are unavailable",
      detail: "Try again later or contact directly",
    }),
    { status: 503, headers: { ...headersBase, "Content-Type": "application/json" } },
  );
};
