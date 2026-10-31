# DESIGN.md — Neo-Brutalist Portfolio System

The visual system for **aep.my.id**. Replaces the earlier dark/teal "developer console"
theme (the Cohere-derived notes that used to live in this file are no longer the target).

---

## Overview

The site is built like a printed poster that happens to scroll: a warm paper canvas,
heavy black rules, oversized condensed-in-spirit display type, and three flat accent
colours used as ink stamps rather than gradients. Everything is a rectangle with a 2px
border. Depth is a **hard offset shadow**, never a blur.

The tone is confident and editorial, not playful-cute: big claims, dense ledger-like
metadata, mono-spaced labels doing the "technical document" work.

**Key characteristics**

- 2px black borders on every raised surface; 0px radius everywhere (deliberately sharp).
- Hard offset shadows (`6px 6px 0 #111`) that grow on hover and snap back on press.
- Acid lime (`#d8ff3e`) as the primary action / highlight ink; electric blue for links;
  coral and lilac as small marker colours.
- Uppercase display type set tight (`line-height: 0.86`, negative tracking) for headlines,
  paired with a mono face at 10–12px for all labels, metadata and buttons.
- Section headers behave like a ledger: numbered chip + display heading + right-aligned
  mono note, closed by a 2px rule.
- Alternating surface rhythm: paper → paper → ink (dark band) → paper.

---

## Colors

### Surfaces

| Token | Value | Role |
|---|---|---|
| `--color-paper` | `#f4f1ea` | Default page canvas (warm off-white) |
| `--color-paper-2` | `#eae5d8` | Secondary panels, table headers, form blocks |
| `--color-paper-3` | `#ddd7c6` | Deeper inset areas |
| `--color-ink` | `#111111` | Borders, body text, dark bands, primary buttons |
| `--color-ink-2` | `#262624` | Body copy on paper |
| `--color-ink-3` | `#55554f` | Muted metadata, mono labels |

### Accents

| Token | Value | Role |
|---|---|---|
| `--color-acid` | `#d8ff3e` | Primary action, highlight stamp, marquee band, active states |
| `--color-acid-2` | `#c2ea22` | Hover state for acid surfaces |
| `--color-electric` | `#2b4eff` | Inline links, focus ring, "external" affordance |
| `--color-coral` | `#ff5c2b` | Live/now markers, "Full Time" chip, alerts |
| `--color-lilac` | `#c9b6ff` | Sticker badges, internship chips |

Rules of use: accents are **fills inside black borders**, never large page backgrounds
except the single acid contact band. Never gradient-fill a UI surface.

---

## Typography

| Role | Family | Size | Weight | Tracking | Notes |
|---|---|---|---|---|---|
| Display / h1–h3 | **Archivo Black** | `clamp(2rem, 6–12vw, 8rem)` | 400 | `-0.03em` | Uppercase, `line-height: 0.86–0.92` |
| Outline display | Archivo Black | same | 400 | same | `-webkit-text-stroke: 2px ink`, transparent fill |
| Body | **Plus Jakarta Sans** | 14–18px | 400–500 | 0 | `line-height: 1.7` |
| Strong / labels | Plus Jakarta Sans | 600–700 | — | 0 | |
| Mono labels & UI | **JetBrains Mono** | 10–12px | 500 | `0.08–0.14em` | Uppercase, used for buttons, chips, metadata |
| Prose body | Plus Jakarta Sans | 17px | 400 | 0 | `max-width: 68ch` |

`.display` / `.display-tight` are the two headline classes. `.mono-label`, `.index-num`
and `.chip` cover the technical-document voice. Outline type is reserved for one word per
headline (e.g. "SYSTEMS" in the hero) to create two-tone depth without colour.

---

## Layout

- Container: `max-width: 1240px`, 20px gutters (40px from `md`).
- Vertical rhythm: sections use `py-16` (mobile) / `py-24` (desktop); section heads are
  followed by `pb-6` + 2px rule.
- Home section order: Hero → Work (01) → Stack (02) → Experience (03) → About (04) →
  Education (05) → Certifications (06) → Contact (07) → Footer.
- Grids are 2-column from `md`; the first project card spans both columns as a lead item.
- Ledger rows (experience) use `grid-cols-[56px_1fr_220px]` on desktop and stack on mobile.

Spacing scale comes from Tailwind's default 4px base; the system adds no custom scale.

---

## Elevation & Depth

No blur, no transparency stacking. Depth = offset shadow + border.

| Token | Value | Use |
|---|---|---|
| `--shadow-brut-xs` | `2px 2px 0 ink` | Small controls, logo tile |
| `--shadow-brut-sm` | `4px 4px 0 ink` | Buttons, small cards |
| `--shadow-brut` | `6px 6px 0 ink` | Cards, panels, profile table |
| `--shadow-brut-lg` | `10px 10px 0 ink` | Hero terminal, command palette |
| hover | `translate(-3px,-3px)` + shadow grows to 8–9px | Interactive cards & buttons |
| active | `translate(0,0)` + shadow collapses to 1–2px | Press feedback |

---

## Components

**`button` (`.btn`)**
2px border, mono 12px uppercase, `13px 22px` padding, `4px 4px` shadow. Variants:
`.btn-acid` (primary), `.btn-ink` (secondary on light, dominant on light bands),
`.btn-sm` (nav/utility). Hover lifts 3px, press collapses.

**`highlight` (`.hl`)**
Acid fill + 4px hard shadow behind a word or phrase. Must be an inline (non-`inline-block`)
element with `box-decoration-break: clone` so it wraps safely at large sizes.

**`chip`**
1.5px border, mono 11px uppercase, no radius. Colour variants: `chip-acid`, `chip-ink`,
`chip-coral`, `chip-lilac`. Used for stack tags, project tags, employment type.

**`index-num`**
Acid tile with mono number in the section header (`01` … `07`), matching the nav order
when the section is in the top five.

**`section-head`**
Flex row: `[index-num] + label` + display heading on the left, mono explanatory note on
the right, closed with a 2px rule. Used by every home section.

**`hero-terminal`**
Ink panel with a window bar (coral/lime/lilac squares), mono shell transcript, and a
3-up stats strip (`6+ years`, `14+ projects`, `3.62 GPA`). A rotated lilac sticker sits
outside the top-right corner.

**`marquee`**
Full-bleed acid band with a duplicated track scrolling `-50%` on a 38s loop; pauses on
hover; disabled under `prefers-reduced-motion`.

**`project-card`**
Bordered card, numbered accent tile, display title, mono year chip, summary, tag chips,
and a dashed-rule footer with a visit link or "case study on request".

**`ledger-row`**
Experience row: index number, company display heading + type chip + role, bullet list,
period right-aligned in mono. Bottom border acts as the ledger rule.

**`profile-table`**
Definition-list panel with dashed row separators and an acid CTA footer row.

**`contact-channel-row`**
Full-width row inside a bordered table: mono label column, bold value + note, and a
square arrow tile that inverts to ink on hover.

**`command-palette`**
Centered `max-w-2xl` panel, `shadow-brut-lg`, input row with `esc` kbd, grouped command
list, arrow-key navigation, and Pagefind results with acid `<mark>` highlighting.

**`footer`**
Ink band: brand statement, two mono link columns, availability strip with blinking acid
dot, meta row, then an oversized `Afghan Eka Pangestu` wordmark clipped at 7% opacity.

---

## Do & Don't

**Do**
- Use paper + 2px black borders as the default surface language.
- Give every interactive card a lift-and-grow-shadow hover and a collapse-on-press state.
- Set labels, buttons and metadata in uppercase mono with wide tracking.
- Use one outline word per display headline for contrast.
- Alternate paper and ink sections to segment the page.

**Don't**
- Don't round corners — radius is 0 everywhere except nothing.
- Don't use blurred or soft shadows.
- Don't fill large page areas with accent colour (the contact band is the only exception).
- Don't set body copy in the display face, or display copy in a thin weight.
- Don't use `inline-block` for `.hl` inside wrapping headlines (causes horizontal overflow).
- Don't introduce gradients, glassmorphism, or translucency as decoration.

---

## Motion

- Entrance: `fade-up` (18px rise, 0.6s, staggered 80ms via `.delay-1…4`).
- Hover: 160ms transform/shadow transitions only.
- Loops: marquee (38s), `blink` (1.1s steps) used only for status dots and the terminal caret.
- `prefers-reduced-motion: reduce` disables marquee, shimmer and all transitions.

---

## Responsive

| Breakpoint | Behaviour |
|---|---|
| `< 640px` | Single column; hero headline ~`3rem`; nav collapses to 2-col border grid; section notes hidden below the rule |
| `640–768px` | Two-column card grids; footer link columns split |
| `768–1024px` | Full nav buttons (search + Writing), 2-col skill grid |
| `1024px+` | 5-link nav, 3-col writing grid, article TOC sidebar, 2-col contact layout |

Touch targets: buttons ≥ 40px tall, icon buttons 36×36, chips are non-interactive by
default so their 24px height is safe.

---

## Blog & Article Surfaces

- Blog index: grid-paper masthead with outline ampersand, mono tag filter row, 3-col card
  grid, dashed empty state, acid CTA band.
- Article: breadcrumb row, display headline + excerpt (left) beside a bordered metadata
  panel (published / reading time / length / author), reading progress bar in ink,
  prose with acid blockquotes, ink code blocks floating on a 6px acid shadow, author card,
  related posts, then comments.
- Prose specifics: list markers are `→`, `h2` carries a 2px underline, tables use an acid
  header row, images get a 2px border + 6px hard shadow.
