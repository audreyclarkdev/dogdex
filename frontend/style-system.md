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
| Navy           | `--navy`      | `#16213E` | Reserved dark accent (not wired up yet)    |
| Navy tint      | `--navy-tint` | `#E2E5EE` | Reserved light tint (not wired up yet)     |
| Plum 600       | `--plum`      | `#7A3B65` | Primary buttons, active nav/filter state   |
| Plum 700       | `--plum-dark` | `#5C2C4C` | Primary hover/pressed                      |
| Plum tint      | `--plum-tint` | `#F3E3EE` | "Favorite" badge bg, journey step-number bg|
| Teal 600       | `--teal`      | `#1C8481` | Secondary buttons, links, tag hover        |
| Teal 700       | `--teal-dark` | `#146664` | Link/tag text, secondary hover             |
| Teal tint      | `--teal-tint` | `#DEF3F1` | Breed-group tag bg, dog-card action buttons|
| Coral          | `--coral`     | `#FA917A` | Favorite heart (active), spinner accent    |
| Coral dark     | `--coral-dark`| `#EC5837` | Eyebrow labels, coral hover                |
| Coral tint     | `--coral-tint`| `#FDCAB7` | Reserved coral background (not wired up)   |
| Page wash      | `--page-bg`   | `#E2E5EE` | Body background                            |
| Root bg        | `--bg`        | `#AEBBE2` | `:root` fallback background                |
| Ink            | `--text`      | `#241B2E` | Body text                                  |
| Heading ink    | `--text-h`    | `#111B36` | Heading text                               |
| Muted          | `--grey-text` | `#6B6077` | Secondary/caption text                     |
| Border         | `--border`    | `#E7E1EC` | Card/input outlines                        |
| White          | `--white`     | `#FFFFFF` | Card/navbar backgrounds                    |

Rule of thumb: brand-blue and plum carry most of the UI; teal is the
secondary/supporting color; coral is used sparingly so it stays special.
`--navy`, `--navy-tint`, and `--coral-tint` are defined as tokens but
aren't used by any component yet — available for future accents.

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
- Card actions (`.dog-actions button`): teal-tint fill (`--teal-tint`), teal-dark text; hover fills solid teal with white text.
- Filters (`.filters button`): white background, 1px `--border` outline; active state is plum fill + white text.

**Badges / tags** — pill (`border-radius: 999px`), bold text.
- Breed-group tags (`.breed`, temperament chips): teal-tint background, teal-dark text.
- Journey step numbers: plum-tint background, plum-dark text.

**Cards**
- Dog list cards (`.dog-list li`): white background, `border-radius: 20px`, shadow `0 4px 16px rgba(22,33,62,0.10)`, lifts on hover; a favorited card gets a 2px plum outline ring.
- Journey/feature cards: white background, `border-radius: 16px`, lighter shadow `0 1px 3px rgba(22,33,62,0.08)`; feature cards get a 4px top border colored by category (plum/teal/coral/brand-blue).
- Breed-of-day card: white background, `border-radius: 20px`, same shadow as dog-list cards.

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
and rounded-shadow cards all match the tables above. `--navy`,
`--navy-tint`, and `--coral-tint` remain defined-but-unused, available
for a future accent (e.g. an alert/"new" badge) without adding new
tokens.
