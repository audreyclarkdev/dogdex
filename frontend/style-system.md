# DogDex Design System

Playful, trustworthy field guide for dog breeds. Brand-blue grounds the
brand, plum drives primary actions, teal supports as the secondary color,
and coral is a single warm accent reserved for favorites/highlights.

Full visual reference (style guide + Breed Browse + Breed Detail mockups):
https://claude.ai/code/artifact/2d7d05b6-1fb5-4b71-9cca-3ccb1925acee

This doc mirrors the CSS custom properties defined in
`frontend/src/index.css`, which is the source of truth — update this
table whenever those tokens change.

## Color Palette

| Token          | CSS variable  | Hex       | Use                                        |
| -------------- | ------------- | --------- | ------------------------------------------- |
| Brand Blue 900 | `--brand-blue`| `#1B2F63` | Headings, nav/brand text                   |
| Brand Blue tint| `--brand-blue-tint` | `#DBE3F7` | Section-card bg (Home breed-of-day, Breed Detail) |
| Navy           | `--navy`      | `#16213E` | Reserved dark accent (not wired up yet)    |
| Navy tint      | `--navy-tint` | `#CCD2E0` | Section-card bg (Breed List)                |
| Plum 600       | `--plum`      | `#7A3B65` | Primary buttons, active nav/filter state   |
| Plum 700       | `--plum-dark` | `#5C2C4C` | Primary hover/pressed                      |
| Plum tint      | `--plum-tint` | `#F3E3EE` | "Favorite" badge bg, journey step-number bg, section-card bg (Home features, Spot Log) |
| Teal 600       | `--teal`      | `#1C8481` | Secondary buttons, links, tag hover        |
| Teal 700       | `--teal-dark` | `#146664` | Link/tag text, secondary hover             |
| Teal tint      | `--teal-tint` | `#DEF3F1` | Breed-group tag bg, dog-card action buttons, section-card bg (Home how-it-works, User Profile) |
| Coral          | `--coral`     | `#FA917A` | Favorite heart (active), spinner accent    |
| Coral dark     | `--coral-dark`| `#EC5837` | Eyebrow labels, coral hover                |
| Coral tint     | `--coral-tint`| `#FDCAB7` | Reserved coral background (not wired up)   |
| Page wash      | `--page-bg`   | `#E2E5EE` | Body background                            |
| Root bg        | `--bg`        | `#AEBBE2` | `:root` fallback background                |
| Ink            | `--text`      | `#241B2E` | Body text                                  |
| Heading ink    | `--text-h`    | `#111B36` | Heading text                               |
| Muted          | `--grey-text` | `#5A4F64` | Secondary/caption text                     |
| Border         | `--border`    | `#E7E1EC` | Card/input outlines                        |
| White          | `--white`     | `#FFFFFF` | Card/navbar backgrounds                    |

Rule of thumb: brand-blue and plum carry most of the UI; teal is the
secondary/supporting color; coral is used sparingly (favorites/highlights
only) so it stays special — it's intentionally not used as a section-card
background. `--navy` and `--coral-tint` are defined as tokens but aren't
used by any component yet — available for future accents.

`--grey-text` is intentionally darker than a typical "muted" gray
(`#5A4F64`, ~5.9:1 on white) so it still clears the 4.5:1 WCAG AA
minimum for body text even on the darker tint backgrounds (`--navy-tint`,
`--brand-blue-tint`), not just on white cards.

**Section-card color per page:** every page other than Home has exactly
one signature tint, so the color itself signals "you're on this page":
Breed List = navy, Breed Detail = brand-blue, Spot Log = plum, User
Profile = teal. Home is the exception on purpose — as the hub, its three
section cards sample three of the four tints (brand-blue, plum, teal) so
a first-time visitor sees a preview of the app's palette before they
navigate anywhere; navy stays reserved for Breed List alone so it keeps
its identity as a landmark color.

## Typography

- **Display / headings:** [Fraunces](https://fonts.google.com/specimen/Fraunces), weight 700 (h1) / 600 (h2) via `--heading` — rounded, playful.
- **Body / UI:** [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans), weights 400–800 via `--sans` — used for paragraphs, labels, buttons, nav links.

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Nunito+Sans:wght@400;600;700;800&display=swap">
```

Base body text is `18px`/145% line-height with `0.18px` letter-spacing,
dropping to `16px` at `max-width: 1024px`.

Type scale:

| Style | Font        | Weight | Size (desktop → ≤1024px) | Notes                        |
| ----- | ----------- | ------ | ------------------------- | ----------------------------- |
| H1    | Fraunces    | 700    | 48px → 34px                | letter-spacing -0.5px         |
| H2    | Fraunces    | 600    | 24px → 20px                | line-height 118%              |
| Body  | Nunito Sans | 400    | 18px → 16px                | letter-spacing 0.18px         |
| Eyebrow/label | Nunito Sans | 800 | ~14.4px (0.9rem) | uppercase, letter-spacing 0.09em |

## Components

**Buttons** — pill-shaped (`border-radius: 999px`), generous padding,
bold label text (`font-weight: 800`).
- Primary (`.home-btn`, `.spot-toggle`): plum fill (`--plum`), white text — main CTAs. Hover darkens to `--plum-dark`.
- Secondary (`.home-btn--secondary`): plum outline, transparent fill, plum text; hover fills solid plum with white text. Used for the hero's second CTA so it reads as lower-priority than the primary button next to it.
- Card actions (`.dog-actions button`): teal-tint fill (`--teal-tint`), teal-dark text; hover fills solid teal with white text.
- Filters (`.filters button`): white background, 1px `--border` outline; active state is plum fill + white text.

**Badges / tags** — pill (`border-radius: 999px`), bold text.
- Breed-group tags (`.breed`, temperament chips): teal-tint background, teal-dark text.
- Journey step numbers: plum-tint background, plum-dark text.

**Cards**
- Dog list cards (`.dog-list li`): white background, `border-radius: 20px`, shadow `0 4px 16px rgba(22,33,62,0.10)`, lifts on hover; a favorited card gets a 2px plum outline ring.
- Journey/feature cards: white background, `border-radius: 16px`, lighter shadow `0 1px 3px rgba(22,33,62,0.08)`; feature cards get a 4px top border colored by category (plum/teal/coral/brand-blue).
- Breed-of-day card: white background, `border-radius: 20px`, same shadow as dog-list cards; on Home it's laid out as a row (image + info side by side) at ≥640px instead of the stacked/centered layout used elsewhere, since it's the one card on the page meant to feel bigger and more special.
- Section cards (`.section-card`): wraps each page's main content block in its own card — `border-radius: 20px`, 1px `--border` outline, shadow `0 4px 16px rgba(22,33,62,0.08)`. Paired with one color modifier (`--teal`, `--plum`, `--navy`, `--brand-blue`) so each page/section reads as visually distinct; mirrors the card treatment in `landing-page/styles.css`.
- Featured section card (`.section-card--featured`): stacks onto `.section-card` for the one card per page that should outrank its siblings — more padding, a heavier shadow. Currently used on Home's Breed of the Day.

**Navbar** — white background, bottom corners rounded (`0 0 16px 16px`),
soft shadow `0 1px 3px rgba(22,33,62,0.06)`. Active nav link recolors to
teal so it "sinks into" the page; other links go brand-blue and lift
plum on hover.

## Icons

Inline SVG only (stroke-based, 16–24px), never emoji. Heart icon used
for favorites; search/chevron/hamburger icons follow the same stroke
style as the existing Navbar icon.

## Implementation status

This system is applied throughout `frontend/src/index.css` and
`frontend/src/App.css` — tokens, fonts, pill buttons/badges/filters,
and rounded-shadow cards all match the tables above. `--navy` and
`--coral-tint` remain defined-but-unused, available for a future
accent (e.g. an alert/"new" badge) without adding new tokens.
