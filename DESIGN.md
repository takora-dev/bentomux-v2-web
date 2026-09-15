# Design System Inspired by Herdr

> Auto-extracted from `https://herdr.dev/` on 2026-09-11

## 1. Visual Theme & Atmosphere

Refined dark mode with muted tones — cinematic and premium.

The hero section leads with "Run them anywhere. Leave them running." followed by "Herdr is where your coding agents live. However many you run, across however many projects, each in ".

**Key Characteristics:**
- Archivo as the heading font
- Inter as the body font for all running text
- Heading weight 900, letter-spacing -4.83879px
- Dark background (#17171a) as the primary canvas
- Primary accent `#d97757` used for CTAs and brand highlights
- 1 shadow level(s) detected — standard shadows
- Rounded corners (50px+) creating a friendly, approachable feel
- Tags: dark, rounded, accented, bold-typography, monospace, sans-serif

## 2. Color Palette & Roles

### Primary
- **Primary Accent** (`#d97757`) · `--color-primary`: Brand color, CTA backgrounds, link text, interactive highlights.
- **Secondary Accent** (`#cba6f7`) · `--color-secondary`: Secondary brand, hover states, complementary highlights.
- **Background** (`#17171a`) · `--color-bg`: Page background, primary canvas.
- **Background Secondary** (`#26262b`) · `--color-bg-secondary`: Cards, surfaces, alternating sections.

### Text
- **Text Primary** (`#eae8ee`) · `--color-text`: Headings and body text.
- **Text Secondary** (`#6c7086`) · `--color-text-secondary`: Muted text, captions, placeholders.

### Borders & Surfaces
- **Border** (`#11111b`) · `--color-border`: Dividers, outlines, input borders.

### Full Extracted Palette

| # | Hex | CSS Variable | Role | Area | Contrast |
|---|---|---|---|---|---|
| 1 | `#11111b` | `--palette-1` | section | large | text-light |
| 2 | `#26262b` | `--palette-2` | section | large | text-light |
| 3 | `#1e1e22` | `--palette-3` | block | large | text-light |
| 4 | `#a6e3a1` | `--palette-4` | button | medium | text-dark |
| 5 | `#6c7086` | `--palette-5` | text-accent | small | text-light |
| 6 | `#cba6f7` | `--palette-6` | text-accent | small | text-dark |
| 7 | `#9399b2` | `--palette-7` | text-accent | small | text-dark |
| 8 | `#b0afb6` | `--palette-8` | badge | small | text-dark |
| 9 | `#eae8ee` | `--palette-9` | badge | small | text-dark |
| 10 | `#d97757` | `--palette-10` | text-accent | small | text-dark |
| 11 | `#d9b66b` | `--palette-11` | text-accent | small | text-dark |
| 12 | `#cdd6f4` | `--palette-12` | text-accent | small | text-dark |

## 3. Typography Rules

- **Heading Font:** `Archivo`, sans-serif
- **Body Font:** `Inter`, sans-serif

### Type Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Archivo | 87.978px | 900 | 77.4206px | -4.83879px |
| H2 | Archivo | 32px | 800 | 35.2px | -1.12px |
| H3 | Archivo | 21px | 800 | 34.65px | -0.63px |
| Body | Inter | 16px | 400 | 27.2px | normal |
| Small | JetBrains Mono | 9.66767px | 400 | 13.3414px | normal |
| Code | JetBrains Mono | 13.5px | 400 | 22.275px | normal |

### Type Scale

| Token | Size | Suggested Usage |
|---|---|---|
| Display | `87.978px` | headings |
| H1 | `70px` | headings |
| H2 | `44px` | headings |
| H3 | `39.99px` | headings |
| H4 | `32px` | headings |
| Body L | `21px` | body / supporting text |
| Body | `20px` | body / supporting text |
| Small | `16px` | body / supporting text |
| XS | `15px` | body / supporting text |
| Caption | `14.5px` | body / supporting text |

## 4. Component Stylings

### Primary Button

```css
.btn-primary {
  background: #eae8ee;
  color: #17171a;
  border-radius: 0px;
  padding: 7px 10px;
  font-size: 10px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Ghost Button

```css
.btn-ghost {
  background: transparent;
  color: #b0afb6;
  border-radius: 0px;
  padding: 7px 10px;
  font-size: 10px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

### Outline Button

```css
.btn-outline {
  background: transparent;
  color: #eae8ee;
  border-radius: 0px;
  padding: 7px 15px;
  font-size: 11.5px;
  font-weight: 400;
  border: 1px solid rgb(53, 53, 61);
  cursor: pointer;
}
```

### Filled Button

```css
.btn-filled {
  background: #26262b;
  color: #26262b;
  border-radius: 0px;
  padding: 0px 0px;
  font-size: 14.5px;
  font-weight: 400;
  border: none;
  cursor: pointer;
}
```

## 5. Layout Principles

- **Base spacing unit:** `3.84px` — use multiples (7.68px, 11.52px, 15.36px, etc.)

### Spacing Scale (extracted from real elements)

| Token | Value | Role |
|---|---|---|
| spacing-1 | `3.84px` | element |
| spacing-2 | `6px` | element |
| spacing-3 | `13px` | element |
| spacing-4 | `7px` | element |
| spacing-5 | `15px` | element |
| spacing-6 | `26px` | card |
| spacing-7 | `7.99609px` | element |
| spacing-8 | `14px` | element |

### Border Radius Scale

| Token | Value | Element |
|---|---|---|
| radius-card | `50px` | card |

## 6. Depth & Elevation

| Level | Shadow | Usage |
|---|---|---|
| Low | `rgb(166, 227, 161) 0px 0px 0px 2px inset` | Cards, subtle elevation |


## 7. Do's and Don'ts

### Do
- Use `#17171a` as the primary background color
- Use `Archivo` for all headings and `Inter` for body text
- Use `#d97757` as the single dominant accent/CTA color
- Maintain `3.84px` as the base spacing unit — all gaps should be multiples
- Keep the overall feel dark — use dark surfaces throughout
- Use rounded corners (`50px`+) consistently for all interactive elements
- Make headlines large and bold — typography is the hero element
- Apply the shadow system for elevation — use the extracted shadow values
- Use weight 900 for headings to match the brand's typographic voice

### Don't
- Don't use colors outside the extracted palette without justification
- Don't substitute Archivo/Inter with generic alternatives
- Don't use irregular spacing — stick to 3.84px grid
- Don't introduce bright white surfaces — they break the dark palette
- Don't use sharp corners — they feel hostile in this rounded design language
- Don't use pure black (#000000) for text — use `#eae8ee` instead
- Don't add decorative elements not present in the original design — no badges, ribbons, banners, or ornaments unless the source site uses them
- Don't invent UI patterns the source site doesn't have — if the original has no NEW badge, don't add one just because a red is in the palette

## 8. Responsive Behavior

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 640px | Single column, stack sections, reduce font sizes ~80% |
| Tablet | 640–1024px | 2-column where appropriate, maintain spacing ratios |
| Desktop | 1024–1440px | Full layout as designed |
| Wide | > 1440px | Max-width container, center content |

- Touch targets: minimum 44×44px on mobile
- Maintain 3.84px base unit across breakpoints — only scale multipliers

## 9. Agent Prompt Guide

### Quick Color Reference

```
Background:  #17171a
Text:        #eae8ee
Accent:      #d97757
Secondary:   #cba6f7
Border:      #11111b
```

### Example Prompts

1. "Build a hero section with a `#17171a` background, `Archivo` heading in `#eae8ee`, and a `#d97757` CTA button with 0px radius."
2. "Create a pricing card using background `#26262b`, border `#11111b`, `Inter` for text, and 11.52px padding."
3. "Design a navigation bar — `#17171a` background, `#eae8ee` links, `#d97757` for active state."
4. "Build a feature grid with 3 columns, 11.52px gap, each card using the card component style."
5. "Create a footer with `#26262b` background, `#eae8ee` text, and 7.68px padding."

### Iteration Guide

1. Start with layout structure (sections, grid, spacing)
2. Apply colors from the palette — background first, then text, then accents
3. Set typography — font families, sizes from the type scale, weights
4. Add components — buttons, cards, inputs using the specs above
5. Apply border-radius consistently across all elements
6. Add shadows for depth — use the extracted shadow values, not defaults
7. Check responsive behavior — test mobile and tablet layouts
8. Final pass — verify all colors match, spacing is consistent, fonts are correct

## 10. CSS Custom Properties

> 48 custom properties extracted from `:root` / `html` stylesheets.

### Color Variables

| Variable | Value |
|---|---|
| `--bg` | `#f0eee9` |
| `--bg-elevated` | `#f5f3ee` |
| `--ink` | `#1a1a18` |
| `--ink-soft` | `#3a3a36` |
| `--muted` | `#6b6b66` |
| `--muted-2` | `#8a8a84` |
| `--line` | `#d8d6d0` |
| `--line-strong` | `#c4c2bb` |
| `--terminal` | `#0c0c0b` |
| `--terminal-2` | `#131312` |
| `--accent` | `#4a9eff` |
| `--accent-soft` | `color-mix(in srgb, var(--accent) 10%, transparent)` |
| `--green` | `#2d9f52` |
| `--yellow` | `#b8860b` |
| `--red` | `#c73e3e` |
| `--term-bg` | `#1a1d22` |
| `--term-sidebar-bg` | `#15181d` |
| `--term-active-bg` | `#20242c` |
| `--term-tab-bg` | `#20242c` |
| `--term-tab-active-bg` | `#4a9eff` |
| `--term-tab-active-text` | `#0c0c0b` |
| `--term-border` | `#2b3038` |
| `--term-text` | `#c8cdd4` |
| `--term-muted` | `#5a6068` |
| `--term-prompt` | `#4a9eff` |
| `--term-cmd` | `#8ecf7a` |
| `--term-str` | `#e6c060` |
| `--term-dim` | `#6a7078` |
| `--term-blue` | `#4a9eff` |
| `--term-green-bright` | `#7ecf8a` |
| ... | *(5 more)* |

### Spacing Variables

| Variable | Value |
|---|---|
| `--radius-lg` | `6px` |
| `--radius-md` | `4px` |
| `--radius-sm` | `2px` |
| `--max` | `1160px` |
| `--logo-opacity` | `0.72` |
| `--gut` | `34px` |

### Other Variables

| Variable | Value |
|---|---|
| `--mono` | `"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |
| `--body` | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` |
| `--logo-filter` | `none` |
| `--st-blocked` | `var(--red)` |
| `--st-working` | `var(--yellow)` |
| `--st-idle` | `var(--green)` |
| `--disp` | `"Archivo", system-ui, -apple-system, "Segoe UI", sans-serif` |
