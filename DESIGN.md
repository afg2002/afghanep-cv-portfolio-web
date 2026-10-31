# DESIGN.md — Swiss + Mono Spec-Sheet

The visual system for **aep.my.id**. This replaces the earlier neo-brutalist direction
(and the Cohere-derived notes before that). Both are no longer the target.

---

## Overview

The site reads like a **technical specification sheet**: a strict 12-column grid, neutral
grotesk display type, monospace metadata, hairline rules, and exactly one accent colour.
Nothing is decorated that could be structured instead.

Where the previous system shouted (thick borders, hard offset shadows, acid lime), this one
is quiet and precise. Hierarchy comes from **type scale, weight, and whitespace** — not from
boxes. Cards are still used, but a hairline border is the only ornament they get.

**Key characteristics**

- 1px hairlines everywhere (`--line`), never 2px borders or offset shadows.
- Near-monochrome: near-black canvas by default, one accent (`#ff4a1c` / `#e0341c`).
- Space Grotesk (600) for headings at tight tracking; Inter for body; JetBrains Mono for all
  labels, numbers, and metadata.
- Section headers are an index + title on the left, a mono explanation on the right, closed
  by a full-width hairline.
- Lists beat boxes: the project and experience sections are rule-separated rows, not cards.
- Dotted leaders (`Company ······ 2024`) borrow from indexing/spec documents.
- Zero radius (2px max on small controls), no gradients, no glow, no blur except the sticky
  header's backdrop.

---

## Theme architecture

Two themes driven by the same semantic variables. Dark is the default; light is fully
supported. The `dark` class on `<html>` is the switch.

| Concern | Implementation |
|---|---|
| Default | `dark` (set on `<html>` in `BaseLayout`) |
| Storage | `localStorage.theme` = `dark` \| `light` \| `system` |
| First paint | Inline script in `<head>` sets the class **before** paint — no flash |
| Toggle | Header button cycles `dark → system → light → dark`, with per-state icons and `aria-label` |
| OS changes | `matchMedia('(prefers-color-scheme: dark)')` listener re-applies when mode is `system` |
| Native UI | `color-scheme` set per theme (scrollbars, form controls, autofill) |
| Embedded widgets | Giscus loads `dark_dimmed` or `light` based on the active class |

---

## Colors

All values are defined once in `:root` (light) and `.dark` overrides, then re-exported to
Tailwind via `@theme inline`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#fafaf9` | `#0a0a0b` | Page canvas |
| `--bg-subtle` | `#f2f2f0` | `#0e0e10` | Inset bands |
| `--surface` | `#ffffff` | `#121214` | Cards, panels, code blocks |
| `--surface-2` | `#f7f7f5` | `#17171a` | Hover / raised rows |
| `--line` | `rgba(10,10,11,.12)` | `rgba(255,255,255,.10)` | Hairline rules and borders |
| `--line-strong` | `rgba(10,10,11,.26)` | `rgba(255,255,255,.24)` | Emphasis borders, dotted leaders |
| `--text` | `#111113` | `#f4f4f5` | Primary text |
| `--text-2` | `#3f3f46` | `#d4d4d8` | Body copy |
| `--text-muted` | `#6b6b73` | `#9a9aa3` | Metadata, labels |
| `--accent` | `#e0341c` | `#ff4a1c` | Links, highlight word, active dot |
| `--accent-soft` | `rgba(224,52,28,.10)` | `rgba(255,74,28,.14)` | Search hit highlight |
| `--on-accent` | `#ffffff` | `#0a0a0b` | Text on accent fills |

Contrast: body text and muted metadata both clear WCAG AA on their respective canvas
(`#9a9aa3` on `#0a0a0b` ≈ 7:1; `#6b6b73` on `#fafaf9` ≈ 5.4:1).

Utility names are generated from the tokens: `bg-bg`, `bg-surface`, `text-text`, `text-text-2`,
`text-muted`, `border-line`, `border-line-strong`, `text-accent`, `bg-accent-soft`.

---

## Typography

| Role | Family | Size | Weight | Tracking / leading |
|---|---|---|---|---|
| Hero display | Space Grotesk | `clamp(2.35rem, 9.5vw, 5.75rem)` | 600 | `-0.04em` / `1.02` |
| Page title (`.display`) | Space Grotesk | `clamp(1.85rem, 5–8vw, 4.5rem)` | 600 | `-0.035em` / `1.04` |
| Section heading (`.heading`) | Space Grotesk | `clamp(1.75rem, 4.5vw, 2.75rem)` | 600 | `-0.022em` / `1.15` |
| Card / row title | Space Grotesk | 15–19px | 600 | `-0.01em` |
| Lead paragraph (`.lead`) | Inter | 17px | 400 | `1.65`, max `54ch` |
| Body | Inter | 13–14.5px | 400 | `1.6–1.7` |
| Mono label (`.mono-label`) | JetBrains Mono | 11px | 500 | uppercase, `0.12em` |
| Mono meta (`.mono-meta`) | JetBrains Mono | 11px | 400 | `0.02em` |
| Tabular numerals (`.tnum`) | JetBrains Mono | inherit | — | `tabular-nums`, `-0.02em` |

`line-height` on display type is **1.02–1.15**, deliberately looser than the previous
system's `0.86` — headlines stay legible and never collide across lines.

Numeric data (dates, counters, periods, GPA) always uses `.tnum` so columns align.

---

## Layout

- Container: `max-width: 1200px`; gutters 20 / 32 / 40px at base / `md` / `xl`.
- Vertical rhythm: `.section` = 64px block padding, 96px from `md`.
- `.section-head` = index + title (left), mono note (right), `20px` padding below, 1px rule,
  then 40–56px before content.
- Grid: 12-column feel via explicit fragments — `md:grid-cols-[64px_1fr_200px]` for work rows,
  `md:grid-cols-[1fr_168px]` for experience, `lg:grid-cols-[1fr_268px]` for the hero.
- Section order: Home → Work (01) → Stack (02) → Experience (03) → About (04) → Education (05)
  → Certifications (06) → Contact (07).

---

## Components

**`.btn`** — 1px border, 2px radius, mono 12px label, 42px min height. Variants: base
(transparent → surface on hover), `.btn-primary` (inverted solid; accent on hover),
`.btn-accent` (accent fill; inverts to text colour on hover), `.btn-sm` (34px, 11px).

**`.link-arrow`** — mono text with a 1px underline that turns accent on hover; the arrow
nudges up-right. Used for secondary actions.

**`.tag`** — 1px border, 10.5px mono uppercase. `.tag-accent` inverts the border/text to the
accent colour (used for "Current" and score badges).

**`.leader`** — dotted filler between a row's left and right content, giving the spec-sheet
`Company ····· 2024` rhythm.

**`.index-label`** — mono uppercase label; `::before` prints the section number from a
`data-index` attribute in accent colour.

**`.section-head`** — the recurring header shell described above.

**Spec panel** (hero, article metadata, about facts) — `bg-surface` with a hairline border, a
mono header strip, and rows separated by `divide-y`. Rows are label-left / value-right.

**Work row** — index, title + year, summary, tag list, and a trailing action. Separated by
hairlines; hover shifts the index and title to accent.

**Experience row** — company + dotted leader + period on one baseline, then role · type ·
"Current" chip, then a compact bullet list with 3px accent dots.

**Command palette** — `max-w-2xl`, hairline panel on `--bg`, mono kbd hints, arrow-key
navigation, Pagefind results with `--accent-soft` highlight marks.

**Footer** — three columns (statement, navigate, elsewhere) on `--bg` with a hairline top
border and a mono status row.

---

## Do & Don't

**Do**
- Reach for a hairline rule before reaching for a box.
- Let the gap between things do the grouping work.
- Keep one accent; use it for the single most important word or state on screen.
- Set every number, date, and label in mono.
- Verify both themes when changing a colour — tokens are shared.

**Don't**
- Add shadows (except the sticky-header and palette layering), glows, or gradients.
- Increase border weight to create emphasis — use weight, scale, or colour instead.
- Introduce a second accent hue.
- Set body copy in the display face, or mono for long paragraphs.
- Hard-code a hex value in a component — always go through a token.
- Use `line-height` below 1.0 on multi-line display text.

---

## Motion

- Entrance: `fade-up` (12px rise, 0.55s) staggered 60ms via `.delay-1…4`.
- Hover: colour and border transitions at 160ms; arrow nudges at 160ms.
- Status dot: `pulse-dot` at 2.4s, only on availability markers.
- `prefers-reduced-motion: reduce` disables entrance animation, pulse, and smooth scrolling.

---

## Responsive

| Breakpoint | Behaviour |
|---|---|
| `< 640px` | Single column; hero headline ~`2.35rem`; work/experience rows stack (period moves under the title); section notes wrap under the rule |
| `640–767px` | Two-column card grids; footer link columns split; certification list goes 2-up |
| `768–1023px` | Full header actions (CV), 2-column stack grid, work rows gain the year column |
| `1024px+` | 6-link nav, 3-column writing grid, article TOC sidebar, 2-column contact |

Touch targets: interactive rows and nav items are ≥44px tall; buttons ≥42px; chips are
non-interactive so their smaller height is safe.

---

## SEO

- One `h1` per page; headings never skip levels.
- `canonical` on every page; `robots` defaults to `index, follow, max-image-preview:large`
  and switches to `noindex, follow` on `?tag=` filtered views.
- Open Graph + Twitter cards share a single 1200×630 image with `og:site_name`, `og:locale`,
  and `image:alt`.
- JSON-LD: `Person` + `WebSite` globally; `ProfilePage` on home; `BlogPosting` (with
  `dateModified`, `wordCount`, `keywords`, author `@id`) + `BreadcrumbList` on articles.
- `sitemap` generated by `@astrojs/sitemap`; Pagefind supplies on-site search.
- Two `theme-color` metas (light/dark) so mobile browser chrome matches the active theme.

---

## Content accuracy

- Professional experience is stated as **2+ years** (since 2024). Freelance and internship
  work from 2019–2023 is listed but explicitly labelled as such and not counted toward that
  figure.
- Project counts are derived from the component data instead of hard-coded totals.
