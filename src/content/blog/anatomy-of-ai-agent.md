---
title: "The Anatomy of an AI Agent: Tools, Memory, and Reasoning"
date: 2026-05-23
excerpt: "A technical deep dive into how AI agents actually work — tool calling, short-term vs long-term memory, planning loops, and why the difference between an agent and a chatbot is architecture, not just a better prompt."
tags: ["ai", "agents", "backend", "architecture", "llm"]
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=630&fit=crop&auto=format"
---

Everybody's talking about AI agents. But ask ten developers what an "agent" actually is, and you'll get twelve different answers.

Let's cut through the noise. An AI agent isn't magic — it's an architectural pattern. And once you understand the anatomy, you realize it's something any competent backend developer can build.

---

## What Makes an Agent Different from a Chatbot?

A chatbot is stateless: user sends a message → LLM responds. That's it. One turn, no memory, no tools, no autonomy.

An AI agent is **stateful and tool-augmented**:

```
Chatbot:
  User → LLM → Response

Agent:
  User → Agent Loop → [Think → Tool Call → Observe → Repeat] → Response
```

The difference isn't a better model or a cleverer prompt. It's **architecture**. An agent has four components a chatbot lacks:

| Component | What It Does |
|-----------|-------------|
| **Planning** | Breaks complex goals into steps, decides what to do next |
| **Tools** | Gives the LLM the ability to take action (run code, search the web, read files) |
| **Memory** | Retains context across turns and across sessions |
| **Orchestration** | The loop that ties everything together |

Let's dissect each one.

---

## 1. The Agent Loop (Orchestration)

At its core, every AI agent runs a variation of this loop:

```python
def agent_loop(user_goal: str, tools: list[Tool], max_steps: int = 20):
    messages = [{"role": "user", "content": user_goal}]
    
    for step in range(max_steps):
        # 1. Inject current state (memory + tools)
        context = build_context(messages, tools)
        
        # 2. LLM decides: respond or call a tool?
        response = llm.chat(context)
        
        if response.is_final_answer():
            return response.content
        
        # 3. Execute the tool call
        tool_result = execute_tool(response.tool_name, response.tool_args)
        
        # 4. Feed the result back into context
        messages.append({"role": "assistant", "content": response})
        messages.append({"role": "tool", "content": tool_result})
        
        # 5. Observe and continue
```

This is called the **ReAct pattern** (Reasoning + Acting). The LLM interleaves thought and action — it thinks about what to do, calls a tool, observes the result, and decides the next step.

Here's what it looks like in practice:

```
User: "What's the latest commit on my repo and who wrote it?"

Step 1: LLM thinks → "I need to run git log" → calls run_command("git log -1")
Step 2: Observes → commit hash, author, message
Step 3: LLM thinks → "I have the answer" → responds with formatted output
```

The loop terminates when the LLM decides it has enough information to answer — or when it hits `max_steps` (a safety valve to prevent infinite loops).

---

## 2. Tools: Giving the LLM Hands

A language model can only generate text. Tools give it **agency** — the ability to affect the world outside its context window.

### How Tool Calling Works

Tools are exposed as function signatures in the system prompt or via native tool-calling APIs:

```json
{
  "name": "web_search",
  "description": "Search the web for information",
  "parameters": {
    "query": "string — the search query",
    "limit": "integer — max results (default: 5)"
  }
}
```

The LLM doesn't "call" the tool directly. It outputs a structured response saying *which* tool to call and *with what arguments*. Your orchestration layer parses that, executes the actual function, and feeds the result back:

```
LLM outputs: {"tool": "web_search", "args": {"query": "golang generics tutorial"}}
Orchestrator runs: web_search("golang generics tutorial")
Returns to LLM: [
  {"title": "Tutorial: Getting started with generics - The Go Blog", ...},
  {"title": "Go Generics: A Practical Guide - DigitalOcean", ...}
]
```

### Designing Good Tools

The difference between a frustrating agent and a useful one often comes down to tool design:

**✅ Good tool descriptions are specific:**

```python
# ❌ Vague
def search(query: str): ...

# ✅ Precise — tells the LLM exactly when to use it
def web_search(
    query: str,  # "Search query. Use site:domain to restrict results."
    limit: int = 5  # "Number of results. Use 3 for quick lookups, 10 for research."
): ...
```

**✅ Tools should be idempotent when possible.** A `read_file` tool is safer than a `delete_file` tool. Give the LLM the minimum power it needs.

**✅ Return structured, compact results.** The LLM's context window is limited. Don't return 5000 lines of logs when 50 would do. I use a token optimizer (RTK) to compress tool outputs before they reach the LLM — it's the difference between a focused agent and one drowning in noise.

---

## 3. Memory: Short-Term vs Long-Term

Memory is what makes an agent feel coherent instead of like a goldfish.

### Short-Term Memory (Conversation Context)

This is the messages array — the ongoing conversation. It's ephemeral and resets when the session ends.

The challenge: LLM context windows are finite. A long agent session can overflow. Strategies to handle this:

- **Sliding window** — keep only the last N messages, drop the rest
- **Summarization** — periodically summarize older messages and replace them with a condensed version
- **Selective retrieval** — use embeddings to pull in only relevant past messages

### Long-Term Memory (Persistent Storage)

This is what survives across sessions — user preferences, project conventions, past decisions.

```python
# Conceptual: saving a durable fact
memory.save(
    target="user",
    content="User prefers Indonesian responses. Uses Bun, not npm."
)

# On next session start:
# All saved memories are injected into the system prompt
```

Implementation approaches:

| Approach | Pros | Cons |
|-----------|------|------|
| **Full-text search (FTS5/SQLite)** | Fast, local, no API cost | Keyword matching only |
| **Vector embeddings (Chroma/Pinecone)** | Semantic search, finds related concepts | Requires embedding model, more complex |
| **Hybrid (keyword + vector)** | Best of both worlds | Highest complexity |

For a solo developer, SQLite with FTS5 gets you 80% of the way with zero infrastructure. I've been running it for months without issues.

---

## 4. Planning: Breaking Down Complex Goals

Simple agents follow a linear ReAct loop: think → act → observe → repeat. But for complex tasks, you need **planning**.

### Plan-then-Execute

```
User: "Refactor the auth module to use JWT instead of sessions"

Without planning:
  → Agent jumps in, edits random files, breaks everything

With planning:
  → Agent first writes a plan:
    1. Read current auth implementation
    2. Identify session-dependent code
    3. Create JWT utility module
    4. Update middleware
    5. Update login/logout handlers
    6. Write tests
    7. Remove session code
  → Then executes step by step
```

The planning step forces the LLM to think about the *structure* of the task before touching any code. This dramatically reduces errors on complex work.

### Reflection and Self-Correction

Advanced agents add a reflection step after each action:

```
Execute step 3 → Tool result shows an error
  ↓
Reflection: "The JWT library I imported doesn't exist in this project.
            I should check package.json first before importing."
  ↓
Corrected action: Read package.json → Found actual dependency → Proceed
```

This turns the agent from a blind executor into something that can recover from its own mistakes.

---

## Putting It All Together: A Real Agent Architecture

Here's the architecture I run daily:

```
┌─────────────────────────────────────────┐
│              User Interface              │
│         (Terminal / Telegram)            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Orchestration Layer            │
│  ┌─────────┐  ┌──────────┐  ┌────────┐ │
│  │ ReAct   │  │ Planning │  │ Memory │ │
│  │ Loop    │  │ Module   │  │ Manager│ │
│  └─────────┘  └──────────┘  └────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Tool Registry                 │
│  ┌────────┐ ┌────────┐ ┌────────────┐  │
│  │Terminal│ │  Web   │ │File System │  │
│  │Tools   │ │ Search │ │  Tools     │  │
│  └────────┘ └────────┘ └────────────┘  │
│  ┌────────┐ ┌────────┐ ┌────────────┐  │
│  │ GitHub │ │  Cron  │ │ Delegation │  │
│  │  CLI   │ │  Jobs  │ │ (Sub-agent)│  │
│  └────────┘ └────────┘ └────────────┘  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           LLM Providers                 │
│     (Claude / DeepSeek / Groq)          │
└─────────────────────────────────────────┘
```

The LLM is just one box in the diagram. The real engineering is in the orchestration layer — deciding when to plan, how to manage memory, which tools to expose, and how to handle errors gracefully.

---

## Common Pitfalls (I've Hit All of These)

### 1. The Infinite Loop

An agent that keeps calling tools without converging. Fix: `max_steps` limit + a "final answer" detection heuristic. If the LLM hasn't produced a user-facing response in N steps, force it to summarize.

### 2. Tool Hallucination

The LLM invents tool parameters that don't exist. Fix: Use native tool-calling APIs (OpenAI function calling, Anthropic tool use) instead of parsing tool calls from raw text. The structured output constraint dramatically reduces hallucinations.

### 3. Context Bloat

Each tool call adds to the message history. After 20 steps, the context window is full of stale tool results. Fix: Aggressive output compression + periodic summarization of completed steps.

### 4. The Authority Problem

Agents are great at *suggesting* actions but terrible at knowing when they *shouldn't* act. Never give an agent unrestricted write access to production systems. Always require human approval for destructive operations.

---

## The Bottom Line

AI agents aren't a product category — they're an **architectural pattern**. And like any pattern, the quality of the implementation matters more than the quality of the model.

A well-architected agent with a mediocre LLM will outperform a poorly-architected agent with the best LLM. The difference is in the loop design, tool ergonomics, memory strategy, and error handling — all things that are firmly in the realm of traditional software engineering.

If you're a backend developer, you already have 80% of the skills needed to build useful agents. The remaining 20% is understanding how to structure prompts as tool-calling interfaces and designing memory systems that don't collapse under their own weight.

Start simple: a single-tool agent with a 5-step loop. Then add memory. Then add planning. The architecture scales, but only if you build it one layer at a time.

---

*Building something with AI agents? I'd love to hear about it. Find me on [GitHub](https://github.com/afg2002).*
