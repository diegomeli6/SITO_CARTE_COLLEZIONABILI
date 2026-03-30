# CLAUDE.md — Collectible Cards Site

Read this file at the start of every session. It contains the full project context, design system, and build instructions. Also read `SKILL.md` (taste-skill) for typography, spacing, border radius, and motion rules — taste-skill governs all generic frontend quality decisions.

**Taste-skill reference:** https://github.com/Leonxlnx/taste-skill
Install with: `npx skills add https://github.com/Leonxlnx/taste-skill`
For every frontend decision not explicitly defined in this file (typography, spacing, border radius, motion, component quality), follow the rules in taste-skill's SKILL.md exactly.

---

## Project overview

A multi-page informational website about collectible cards. The site covers two distinct worlds:
- **The technical world** — how cards are physically made (printing, finishes, anatomy)
- **The universe world** — the cultural communities around specific card games

The site is an exam project. It will be evaluated on design quality, UX flow, and code quality. Build everything as production-grade: clean semantic HTML, organised CSS, readable code.

**Language: Italian.** All visible copy — headings, body text, labels, buttons, nav items, alt text, aria labels — must be written in Italian. Every HTML file must include `lang="it"` on the `<html>` tag.

---

## Site structure

### Pages

| Page | File | Section |
|---|---|---|
| Home | `index.html` | — |
| Making Of | `technical/making-of.html` | Technical |
| Special Finishes | `technical/special-finishes.html` | Technical |
| Card Anatomy | `technical/card-anatomy.html` | Technical |
| Pokémon | `universes/pokemon.html` | Universes |
| Magic: The Gathering | `universes/magic.html` | Universes |
| Yūgiōh | `universes/yugioh.html` | Universes |
| Sport Cards | `universes/sport.html` | Universes |
| Cuphead | `universes/cuphead.html` | Universes |
| Gallery | `gallery.html` | — |

### Navigation

- Sticky minimal navbar — hidden on load, slides in after scrolling past the hero
- Two dropdowns: **Technical Process** and **Universes**
- One standalone CTA link: **Gallery** (always highlighted in gold)
- No hub pages — the dropdown IS the navigation
- On Technical pages, the Technical dropdown label is bold (active state)
- On Universe pages, the Universes dropdown label is bold (active state)

### File structure

```
/
├── index.html
├── gallery.html
├── technical/
│   ├── making-of.html
│   ├── special-finishes.html
│   └── card-anatomy.html
├── universes/
│   ├── pokemon.html
│   ├── magic.html
│   ├── yugioh.html
│   ├── sport.html
│   └── cuphead.html
├── style.css             (single file — all styles, organized by section comments)
├── js/
│   ├── navbar.js         (scroll trigger, sticky behaviour)
│   └── gallery.js        (modal open/close logic)
├── assets/
│   ├── video/
│   │   └── hero.mp4      (hero background video — silent loop)
│   ├── cards/            (card images for gallery)
│   └── universes/        (universe-specific imagery)
└── CLAUDE.md
```

---

## Design system

### Color palette

All colors defined as CSS custom properties in `style.css`, inside the `/* 1. VARIABLES & RESET */` section at the top of the file.

```css
:root {
  /* Base */
  --color-bg:           #FAF8F5;   /* warm white — page background */
  --color-surface:      #F2EFE9;   /* cards, alternate sections */
  --color-border:       #E8E4DC;   /* default borders */
  --color-text-primary: #1C1C1E;   /* warm near-black */
  --color-text-secondary: #636366; /* medium grey */

  /* Technical section — deep teal */
  --teal-main:  #0D7377;
  --teal-light: #E6F4F4;
  --teal-dark:  #0A5C5F;

  /* Universes section — vibrant orange-red */
  --red-main:  #E63946;
  --red-light: #FDE8E9;
  --red-dark:  #B22D38;

  /* Gallery — subtle gold */
  --gold-main:  #C9A843;
  --gold-light: #FBF4E0;
  --gold-dark:  #8B7129;
}
```

### Section color logic

Every section badge, eyebrow label, CTA, and accent element follows this mapping — never mix them up:

| Section | Main | Light (backgrounds) | Dark (text on light bg) |
|---|---|---|---|
| Technical Process | `--teal-main` | `--teal-light` | `--teal-dark` |
| Universes | `--red-main` | `--red-light` | `--red-dark` |
| Gallery | `--gold-main` | `--gold-light` | `--gold-dark` |

### Typography

Governed by taste-skill — read `SKILL.md` for font families, size scale, weight system, and tracking rules. Do not use Inter, Arial, Roboto, or system fonts.

### Spacing & border radius

Governed by taste-skill — read `SKILL.md` for base unit, section padding, gap system, and component-level border radius rules.

### taste-skill settings

When generating any frontend code, use these settings:
- `DESIGN_VARIANCE`: 7 — bold, asymmetric, editorial
- `MOTION_INTENSITY`: 5 — foil shimmer + smooth scroll, no overdoing it
- `VISUAL_DENSITY`: 3 — spacious, luxury, short punchy content

---

## Page templates

### All pages share

- Same navbar (sticky, appears on scroll)
- Same footer (logo left, three nav links right)
- Background: `--color-bg`
- Section alternation: `--color-bg` → `--color-surface` → `--color-bg` → repeat

### Home page (`index.html`)

1. **Hero** — full viewport height, `<video autoplay muted loop playsinline>` background with `object-fit: cover`, dark overlay, headline centered, scroll indicator at bottom. Navbar not visible here.
2. **Entry points** — three equal-weight cards (teal / red / gold). Each links to its section.
3. **Technical preview** — split layout (text left, 3 page-links right). CTA links to Special Finishes.
4. **Universe preview** — brand color swatches for all 5 universes. CTA links to Pokémon.
5. **Gallery teaser** — binder preview (two open pages, spine with rings). CTA links to Gallery.
6. **Footer**

### Technical pages (shared template)

1. **Hero** — 200px tall, `--teal-light` background, teal eyebrow badge, page title, subtitle
2. **Intro** — split layout: editorial copy left, scannable technique list right (`--color-surface` bg)
3. **Visual explainer** — diagram or illustration of the production process (`--color-surface` bg)
4. **Universe cross-links** — which universes use this technique. Each row links to that universe page. Uses `--red-light` / `--red-dark` badge styling.
5. **Example cards** — horizontal card row (cards tinted with their universe color). "See all in gallery →" CTA in gold.
6. **Footer**

### Universe pages (shared template)

1. **Hero** — 240px tall, brand palette takes over (see universe palette section below). Universe eyebrow badge, universe name, subtitle
2. **Identity** — split layout: editorial intro left, 4 stat cards right (`--color-bg` bg)
3. **Technical decisions** — which techniques this universe uses. Each row links to the relevant technical page. Uses `--teal-light` / `--teal-dark` badge styling.
4. **Iconic cards** — mini binder showing this universe's cards (slots tinted in universe brand color). "See all in gallery →" CTA in gold.
5. **Footer**

### Gallery page (`gallery.html`)

1. **Page header** — no hero, just title + card count
2. **Filters** — filter by Universe AND by Technique (pills). Default: All.
3. **Binder layout** — spine with rings on the left, rows of 4 cards per page. Card slots tinted with universe brand color.
4. **Modal** — clicking a card opens a modal with: card image, name, description, universe badge (links to universe page), technique badge (links to technical page)
5. **Footer**

---

## Universe brand palettes

Each universe page overrides the base palette in a scoped block. These are FIXED — do not deviate.

| Universe | Primary | Background tint |
|---|---|---|
| Pokémon | `#FFD700` (yellow) | `#FFFBE6` |
| Magic: The Gathering | `#1A1A1A` (dark) | `#1A1A1A` with light text |
| Yūgiōh | `#7B68EE` (purple) | `#F0EEFF` |
| Sport Cards | `#B22222` (americana red) | `#FFF0F0` |
| Cuphead | `#E8532A` (vintage orange) | `#FFF4EF` |

---

## Cross-linking logic

This is the system that connects the three sections. Always implement it:

- Every **Technical page** links to universes that use that technique (section 4)
- Every **Universe page** links to techniques that universe uses (section 3)
- Every **Technical page** shows example cards and links to Gallery (section 5)
- Every **Universe page** shows example cards and links to Gallery (section 4)
- Every **Gallery modal** links to one universe page AND one technical page per card
- The **Gallery filter** connects back to both sections

### Badge color rule

| Link destination | Badge background | Badge text color |
|---|---|---|
| Technical page | `--teal-light` | `--teal-dark` |
| Universe page | `--red-light` | `--red-dark` |
| Gallery | `--gold-light` | `--gold-dark` |

---

## CSS conventions

- **Single file** — all styles live in `style.css`, one HTTP request, no `@import`
- Internal organization by numbered section comments:
  ```
  /* ============================================================
     1. VARIABLES & RESET
     2. BASE TYPOGRAPHY
     3. LAYOUT UTILITIES
     4. COMPONENTS — navbar, footer, buttons, badges, cards
     5. HOME PAGE
     6. TECHNICAL PAGES
     7. UNIVERSE PAGES
     8. UNIVERSE BRAND PALETTES
     9. GALLERY & MODAL
    10. RESPONSIVE
     ============================================================ */
  ```
- All custom properties in `:root` at the top of section 1
- Class naming: BEM-style — `.block__element--modifier`
- No inline styles except for dynamic JS values
- Mobile-first responsive — base styles for mobile, `@media (min-width: 768px)` for tablet, `@media (min-width: 1024px)` for desktop
- Never use `!important`

## HTML conventions

- Semantic elements throughout: `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<header>`, `<footer>`
- Every image has a meaningful `alt` attribute
- All interactive elements are keyboard accessible
- Section order in HTML matches visual order on page

## JS conventions

- Vanilla JS only — no frameworks, no libraries except for specific effects if needed
- Every function has a one-line comment explaining what it does
- `navbar.js` handles only the scroll trigger and sticky behaviour
- `gallery.js` handles only modal open/close and filter logic

---

## Key design principles

1. **Light editorial base** — warm white canvas, content and card art do the visual work
2. **Bold, impactful typography** — display font for all headings, clean body font for text
3. **Section color coding** — teal, red, gold are navigation aids as much as design elements
4. **Cards are objects** — treat card images with the same care as fine art photography
5. **Punchy copy** — short, energetic, never more than 2-3 sentences per paragraph
6. **One source of truth** — gallery cards are referenced on universe and technical pages, never duplicated

---

## Exam requirements

The examiner evaluates: Design & UX, Code quality/structure, and overall web design fundamentals. This means:
- Every CSS decision must be intentional and defensible
- HTML must be semantic and readable
- The user flow must feel natural — a visitor should never feel lost
- You must be able to explain every JS function out loud