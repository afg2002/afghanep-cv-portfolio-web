---
title: "How I Use AI Agents to Automate My Development Workflow"
date: 2026-05-23
excerpt: "Real-world ways I use AI agents and LLMs to speed up coding, automate job applications, monitor crypto, and handle freelance gigs — with practical prompt examples and lessons learned."
tags: ["ai", "automation", "productivity", "backend", "tools"]
coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop&auto=format"
---

Let me be honest: a year ago, I was skeptical about AI coding assistants. I'd tried a few and found them more annoying than helpful — suggesting incorrect syntax, hallucinating APIs, and getting in the way.

Fast forward to 2026, and AI agents are now an indispensable part of my daily workflow. Not as a replacement for thinking (they still can't do that), but as a **force multiplier** for the mechanical, repetitive parts of development.

Here's exactly how I use them — no hype, just real workflows.

---

## My AI Stack

Before diving into use cases, here's what I actually use:

| Tool | Purpose | Cost |
|------|---------|------|
| **Hermes Agent** | Primary AI assistant — runs in terminal, Telegram, and browser | Free / BYO API key |
| **OpenRouter** | API gateway to multiple models (Claude, DeepSeek, Qwen) | Pay-per-token, generous free tier |
| **Groq** | Fast inference for real-time tasks | Free tier |
| **Claude Code / Codex CLI** | Autonomous coding sub-agents for PRs and features | BYO key |
| **RTK (Rust Token Killer)** | Token-optimized CLI output to reduce AI context waste | Open source |

The key insight: **no single model is best at everything**. I route tasks to the right model — Claude for complex reasoning, Groq for speed, DeepSeek for cost-effective bulk work.

---

## Use Case 1: Automating Job Applications

Job hunting is tedious. Tailoring each resume, writing cover letters, tracking applications — it's a full-time job on top of a full-time job.

I built a Python script that, given a job listing URL, generates a tailored cover letter using an LLM. The prompt includes my CV context, the job description, and specific instructions about tone:

```python
# Simplified version of my job application generator
system_prompt = """You are a professional cover letter writer.
Use the candidate's CV and the job description to write a
concise, tailored cover letter. Rules:
- Max 250 words
- Mention 2-3 specific skills that match the job
- Professional but warm tone
- No generic fluff like 'I am writing to apply...'"""

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"CV:\n{cv_text}\n\nJob:\n{job_text}"}
    ]
)
```

The result? Applications that took 45 minutes now take 5. I still review everything the AI writes — it's an assistant, not a replacement for judgment. But it handles the blank-page problem perfectly.

**Lesson learned:** The quality of output depends 90% on the quality of your CV data and prompt. Garbage in, garbage out is still the rule.

---

## Use Case 2: Gig Notifier Bot

Freelance platforms like Projects.co.id and Fastwork are competitive. New gigs get flooded with proposals within minutes. Speed matters.

I built a Telegram bot that:

1. **Scrapes** multiple freelance platforms every few minutes
2. **Filters** gigs by keywords (Laravel, Golang, Java, React, Backend)
3. **Notifies** me via Telegram when matching gigs appear
4. **Drafts proposals** using AI based on the gig description and my portfolio

The scraper uses cloudscraper to bypass Cloudflare protection, and the AI proposal generation uses the same LLM pipeline as my job applications:

```
New gig detected: "Build REST API with Golang + PostgreSQL"
↓
AI generates draft proposal with:
  - Relevant past projects
  - Tech stack match analysis
  - Estimated timeline
  - Professional introduction
↓
I review, tweak, and submit in 2 minutes instead of 20
```

**Lesson learned:** Web scraping in 2026 is an arms race. Cloudflare, captcha, and rate limiting require constant adaptation. I've learned more about HTTP headers and TLS fingerprints than I ever wanted to know.

---

## Use Case 3: Token-Optimized CLI

Here's a subtle but massive productivity boost: **reducing AI context waste**.

When you're working with AI agents, every byte of terminal output you feed into context costs tokens. A `git diff` or `npm install` can easily dump thousands of lines of noise.

RTK (Rust Token Killer) is a CLI wrapper that filters and compresses command output before it reaches the AI:

```bash
# Without RTK: full cargo build output (~2000 tokens)
$ cargo build
   Compiling serde v1.0.210
   Compiling tokio v1.42.0
   ...

# With RTK: only what matters (~200 tokens)
$ rtk cargo build
✓ Build succeeded (12 crates compiled, 0 warnings)
```

It's not just about saving money — it's about **keeping the AI focused**. Less noise means better responses.

| Command | Token Savings |
|---------|---------------|
| `cargo test` | ~90% |
| `vitest run` | ~99% |
| `git diff` | ~80% |
| `tsc` | ~83% |

**Lesson learned:** The quality of AI output is inversely proportional to the amount of irrelevant context you feed it. Curate your input ruthlessly.

---

## Use Case 4: Crypto Portfolio Monitoring

I track a handful of crypto tokens, but checking prices manually is a waste of time. My AI agent runs scheduled jobs every 6 hours:

- Fetches prices from Binance, KuCoin, and DexScreener (for tokens not on major exchanges)
- Formats them into a clean Telegram message
- Delivers directly to my phone

```python
# Scheduled via cron job — no manual checking
# The agent knows my preferred exchanges:
# BTC/ETH/NIGHT → Binance
# HYPE/AZTEC/DEGEN → KuCoin
# Meme tokens → DexScreener
```

The beautiful part? I haven't manually checked a crypto price in months. The information finds me, not the other way around.

---

## Use Case 5: Code Review and Refactoring

When I'm working on a feature branch and want a second pair of eyes, I delegate code review to an AI sub-agent:

```bash
# Spawn a sub-agent to review a PR
$ hermes agent "Review the changes in feature/auth-refactor
  branch. Focus on security issues, error handling, and
  API consistency."
```

The agent:
1. Reads the git diff
2. Analyzes for common issues (SQL injection, missing validation, inconsistent error responses)
3. Returns a structured review with specific line references
4. Suggests fixes with code examples

I still make the final call — the AI catches mechanical issues so I can focus on architectural decisions.

**Lesson learned:** AI is great at pattern matching (finding missing null checks, inconsistent naming) but terrible at architectural reasoning. Use it for the checklist stuff, not the big decisions.

---

## Prompt Engineering Tips (That Actually Work)

After hundreds of hours of trial and error, here are my non-obvious tips:

### 1. Be Specific About What NOT to Do

```
❌ "Write a REST API endpoint"
✅ "Write a REST API endpoint for user registration.
    - Use golang-chi router
    - Return JSON, never HTML
    - Use snake_case for JSON keys
    - Do NOT use ORM — raw SQL with sqlx
    - Include input validation
    - Return 201 on success, 400 on validation error"
```

Negatives ("do NOT use ORM") are often more important than positives.

### 2. Provide Examples of Output Format

LLMs pattern-match. Show them the exact format you want once, and they'll replicate it:

```
Return errors in this exact format:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Username is required",
    "field": "username"
  }
}
```

### 3. Use System Prompts for Standing Instructions

Things like "never apologize," "be concise," "use Indonesian for comments" belong in system prompts. They persist across the conversation and save you from repeating yourself.

### 4. Context Window is Everything

The single biggest factor in response quality is **what context you provide**. Include:
- Relevant file contents
- Error messages (full, not truncated)
- Your tech stack versions
- Any constraints or gotchas

A mediocre model with great context beats a great model with mediocre context.

---

## What I Don't Use AI For

It's just as important to know the limits:

- **Security-critical code** — authentication, encryption, permission systems. I write these myself and review them manually.
- **Architecture decisions** — AI can list options, but weighing trade-offs requires understanding the business context.
- **Anything that requires original thinking** — AI remixes existing patterns. Novel solutions still require human creativity.

---

## The Bottom Line

AI agents haven't made me a 10x developer. But they've made me a **3x developer with less burnout**. They handle the tedious 80% so I can focus on the interesting 20%.

The key is treating AI as a **junior developer with infinite energy but zero judgment** — great at executing clear instructions, terrible at knowing what to build or why.

If you're not using AI in your workflow yet, start small. Pick one repetitive task and automate it. The productivity compounding is real.

---

*Got questions about my setup? Find me on [GitHub](https://github.com/afg2002) or drop a comment below.*
