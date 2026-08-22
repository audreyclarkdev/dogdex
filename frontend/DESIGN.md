# DogDex Design System

Playful, trustworthy field guide for dog breeds. Navy grounds the brand,
plum drives primary actions, teal supports as the secondary color, and
coral is a single warm accent reserved for favorites/highlights.

Full visual reference (style guide + Breed Browse + Breed Detail mockups):
https://claude.ai/code/artifact/2d7d05b6-1fb5-4b71-9cca-3ccb1925acee

## Color Palette

| Token       | Hex       | Use                                       |
|-------------|-----------|--------------------------------------------|
| Navy 900    | `#16213E` | Headings, nav/brand text                   |
| Plum 600    | `#7A3B65` | Primary buttons, active nav/filter state   |
| Plum 700    | `#5C2C4C` | Primary hover/pressed                      |
| Teal 600    | `#1C8481` | Secondary buttons, links, tag text         |
| Teal 700    | `#146664` | Secondary hover, link hover                |
| Coral 500   | `#FF7A5C` | Favorite heart (active), alerts            |
| Coral 600   | `#E85F41` | Coral hover                                |
| Cream 50    | `#FBF8F3` | Page background                            |
| Plum 100    | `#F3E3EE` | "Favorite" badge background                |
| Teal 100    | `#DEF3F1` | Breed-group tag background                 |
| Coral 100   | `#FFE6DD` | "New" badge background                     |
| Ink         | `#241B2E` | Body text                                  |
| Muted       | `#6E6579` | Secondary/caption text                     |
| Border      | `#E7E1EC` | Card/input outlines                        |

Rule of thumb: navy and plum carry most of the UI; teal is the
secondary/supporting color; coral is used sparingly so it stays special.

## Typography

- **Display / headings:** [Baloo 2](https://fonts.google.com/specimen/Baloo+2), weights 600–700 — rounded, playful, used for `h1`/`h2` and brand wordmark.
- **Body / UI:** [Nunito Sans](https://fonts.google.com/specimen/Nunito+Sans), weights 400–800 — used for paragraphs, labels, buttons, nav links.

```html
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Nunito+Sans:wght@400;600;700;800&display=swap">
```

Type scale:

| Style   | Font        | Weight | Size  |
|---------|-------------|--------|-------|
| H1      | Baloo 2     | 700    | 38–44px |
| H2      | Baloo 2     | 600    | 22–26px |
| Body    | Nunito Sans | 400    | 15–16px |
| Eyebrow/label | Nunito Sans | 800 | 12–13px, uppercase, letter-spacing 1.2px |

## Components

**Buttons** — pill-shaped (`border-radius: 999px`), generous padding
(~13px 26–30px), bold label text.
- Primary: plum fill (`#7A3B65`), white text — main CTAs ("Add to My Collection").
- Secondary: transparent with a 2px teal outline (`#1C8481`) — supporting actions.
- Ghost: plum text, no fill — tertiary links ("Learn more →").
- Icon (favorite heart): 44–48px circle, white background, soft shadow. Coral-filled heart = favorited, gray outline heart = not favorited.

**Badges / tags** — pill (`border-radius: 999px`), bold 13px text, `padding: 7-8px 16-18px`.
- Breed-group tags (Herding, Toy, Working, etc.): teal-100 background, teal-700 text.
- "Favorite": plum-100 background, plum-700 text, small heart icon.
- "New" / alerts: coral-100 background, a darker coral/red text.

**Cards** — white background, `border-radius: 20px`, soft shadow
(`0 4px 16px rgba(22,33,62,0.10)`), ~14px padding. Photo/thumbnail on
top with rounded corners, favorite-heart button overlaid top-right,
name in Baloo 2, breed-group pill below.

**Filters** — same pill shape as badges; active filter uses plum fill
+ white text, inactive filters use white background + 1px border
(`#E7E1EC`).

## Icons

Inline SVG only (stroke-based, 16–24px), never emoji. Heart icon used
for favorites; search/chevron/hamburger icons follow the same stroke
style as the existing Navbar icon.

## Notes for implementation

This doc is a reference, not yet applied to the app. The current
`frontend/src/index.css` / `App.css` still use the older purple/blue
palette (`--purple: #6b3fa0`, `--blue: #2f5fa8`) and system-ui fonts.
When ready to apply this system, the swap is mostly:
- Replace the `--purple`/`--blue` CSS variables in `index.css` with
  the tokens above, and add `--navy`, `--teal`, `--coral`.
- Add the Google Fonts `<link>` to `index.html` and set `--heading`
  to Baloo 2, `--sans` to Nunito Sans.
- Round buttons/filters/badges to pill shape and update `.dog-list li`
  card radius/shadow to match.
