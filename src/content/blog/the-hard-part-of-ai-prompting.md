---
title: "The Hard Part of AI Prompting and How I Solved It"
date: 2026-09-17
excerpt: "AI prompting is difficult because useful answers depend on context, constraints, and iteration. Here is the workflow I use to turn vague requests into reliable results."
tags: ["ai prompting", "problem solving", "developer workflow"]
---

AI prompting looks easy until the output needs to be useful, consistent, and safe to apply to a real project. A short request can produce a confident answer, but confidence is not the same as correctness.

## Why Prompting Is Difficult

The hardest part is usually not finding the right words. It is understanding the problem well enough to give the model the information it needs.

Three problems appear repeatedly:

1. **Vague goals produce vague output.** “Make this better” does not define what better means.
2. **Missing context creates wrong assumptions.** Without the relevant code, framework version, or constraints, the answer may solve a different problem.
3. **Large requests hide multiple decisions.** A single prompt can mix discovery, design, implementation, and testing, which makes the result difficult to review.

## How I Solve It

I treat prompting like writing a small technical specification. Before asking for a solution, I define five things:

- **Goal:** the behavior I want to change
- **Context:** the files, existing patterns, and error messages that matter
- **Constraints:** what must stay unchanged and what tools or libraries are allowed
- **Output:** the exact format I need, such as a patch, explanation, or test
- **Validation:** the command or behavior that can prove the result works

For example, instead of asking “Fix my API,” I describe the failing endpoint, include the response and relevant handler, state that the public API must remain compatible, and request a focused change plus the test command.

## Iteration Beats One Giant Prompt

I also stopped expecting one prompt to produce a perfect solution. My workflow is incremental:

1. Ask for a narrow investigation.
2. Check the hypothesis against the code.
3. Make the smallest useful change.
4. Run a focused test or build.
5. Feed the actual result back into the next prompt.

This makes the process more reliable because every iteration is grounded in evidence rather than guesses. A failing test is valuable context; it tells me exactly which assumption needs to change.

## The Lesson

Good prompting is less about clever phrases and more about clear thinking. The model can help explore options, explain unfamiliar code, and accelerate repetitive work, but I still own the requirements and the final judgment.

The most effective prompt is usually the one that makes the problem smaller, gives enough context to reason about it, and names a cheap way to verify the answer.