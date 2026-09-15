# Design System: Bentomux Landing Page

**Document Version:** v1.4 | **Status:** Implemented — verified by `scripts/smoke.mjs` | **Last Updated:** 2026-09-15 | **Author:** F. Jibran

> **This is SoT #3.** Derived from `docs/srs.md` (SoT #1) and `docs/information_architecture.md` (SoT #2). Every visual value used in implementation comes from this document. If a value is not here, it does not exist — implementation must not invent tokens.

---

## 1. Purpose and Provenance

This document defines the complete visual language of the Bentomux landing page: color, typography, spacing, radii, elevation, motion, layout, and the visual specification of every component.

**Provenance of every token — nothing here is invented:**

| Layer | Source | Why |
|-------|--------|-----|
| Color — brand | `../Bentomux-v2/src/styles.css`, default dark palette (`:root.dark`) | The marketing site must look like the product. The product's own tokens are the brand. |
| Color — palettes | `../Bentomux-v2/src/styles.css`, `:root.palette-*` blocks | Recorded for the application's identity, not consumed by the site since the preview band was removed in v1.2. |
| Typography — body | `../Bentomux-v2/src/styles.css` `--sans` and `--mono` | The application's own font stacks. |
| Composition, type scale, spacing feel | `DESIGN.md` (repo root, extracted from `herdr.dev`) | Visual composition reference (`SRS CON-010`). Layout and rhythm only — no Herdr color, copy, or asset is used. |
| Structure and requirements | `docs/srs.md`, `docs/information_architecture.md` | Sections, states, budgets, and constraints. |

**Hard boundary (`SRS BR-001.7`, `CON-010`):** Herdr's palette (`#d97757`, `#cba6f7`), its copy, and its imagery are **not used anywhere**. `DESIGN.md` is consulted for composition, type scale, and spacing rhythm only. Bentomux's blue is the accent; Bentomux's charcoal is the canvas.

---

## 2. Design Principles

1. **The product is the ornament.** The window mock is the richest visual element on the page. No decorative illustration, no gradient mesh, no abstract blob competes with it.
2. **Dark, calm, confident.** A single dark canvas, one accent, generous whitespace. There is no light theme for the marketing site (`SRS OQ-009`). Restraint is the aesthetic.
3. **Type does the heavy lifting.** Composition is carried by an oversized display face at tight tracking, not by color or ornament. Hierarchy is achieved through scale, weight, and space.
4. **Honest by construction.** Pre-release status, license state, and support levels all have a visual expression. Nothing in the design makes an unavailable thing look available.
5. **Nothing moves without a reason.** Animation conveys state change (a running agent in the window mock, install panel switching, the waitlist submit spinner). No ambient motion, no scroll-jacking, no entrance animations on content. Nothing animates on scroll.
6. **Reuse the product's tokens.** Where the application already made a decision — its canvas, its accent, its radii, its mono stack — the site inherits it rather than re-deciding.
7. **Accessible defaults, not accessible patches.** Every token pair in §4.4 is verified against WCAG 2.1 AA before being adopted. No component ships with a known contrast defect.

---

## 3. Token Architecture

Three layers. A component may only reference **semantic** tokens; it may never reference a primitive directly, and never a literal color value.

```
Layer 1 — Primitives        raw values, reserved
        --bm-ink, --bm-accent, --bm-bg-1 …          (application reference; no site surface uses these)

Layer 2 — Semantic          what a value MEANS in the marketing site
        --color-canvas, --color-surface, --color-text, --color-accent,
        --color-border, --color-danger, --color-success …

Layer 3 — Component         a semantic token bound to one component role
        --button-primary-bg, --input-border, --nav-bg, --chip-bg …
```

**Rules:**

- **TOK-001:** Semantic token names describe role, never appearance. `--color-text-muted`, not `--color-grey-500`.
- **TOK-002:** No hard-coded color, font size, radius, or spacing value may appear in a component or page file. Everything resolves to a token.
- **TOK-003:** No `--palette-*` token may be declared or read in this site. The preview band that used them was removed in v1.2; the accent is `--color-accent` everywhere.
- **TOK-004:** Tailwind CSS v4's CSS-first `@theme` block is the single definition site. Utilities are generated from these tokens; no parallel config file holds a second copy of a value.
- **TOK-005:** Adding a token requires adding a row to §4, §5, §6, or §7. An undocumented token is a defect.

---

## 4. Color

### 4.1 Site chrome — dark (the only site theme)

Source: `../Bentomux-v2/src/styles.css` `:root.dark`, mapped to semantic names.

| Semantic token | Value | Role |
|----------------|-------|------|
| `--color-canvas` | `#17181B` | Page background. The deepest surface. |
| `--color-canvas-raised` | `#1C1E22` | Alternating section band, so consecutive sections read as distinct without borders. |
| `--color-surface` | `#222428` | Cards, chips, the navigation bar at rest, the install command block. |
| `--color-surface-hover` | `#282B30` | Hover state of an interactive surface. |
| `--color-content` | `#17181B` | Canvas behind app-mock content, so the mock matches the real app interior. |
| `--color-text` | `#E8EAED` | Primary text. |
| `--color-text-muted` | `#A6ABB3` | Secondary text: descriptions, subheads. |
| `--color-text-subtle` | `#71767E` | Tertiary only: captions, meta, decorative labels. **Never for body copy** (3.88:1, §4.4). |
| `--color-accent` | `#4C8EF9` | Brand accent. Primary actions, links, focus rings, active states. |
| `--color-accent-hover` | `#6BA1FB` | Accent hover. |
| `--color-accent-strong` | `#7CACFF` | Accent text on canvas where the base accent is too dim for small type. |
| `--color-accent-tint` | `rgba(76,142,249,.16)` | Accent-tinted background: active nav item, selected chip, badge fill. |
| `--color-border` | `#2C2F34` | Default dividing line and card border. |
| `--color-border-strong` | `#3B3F45` | Hover border and emphasized separators. |
| `--color-tint` | `rgba(255,255,255,.07)` | Neutral surface tint for hover on list rows and ghost buttons. |
| `--color-danger` | `#E5534B` | Error text and error borders. Text meets AA at 4.79:1. |
| `--color-success` | `#3FB950` | Waitlist success state. **Added token** — the application has no success token; the site needs one for `FR-004.3`. |
| `--color-warning` | `#D29922` | The unsigned-build note in the install section. **Added token.** |

### 4.2 Site chrome — light

The marketing site is dark-only (`SRS OQ-009`). The light tokens are **defined and verified but not rendered in site chrome**; they exist for two reasons: they complete the token set so a future light theme is a switch rather than a redesign, and they document the light variants the application itself offers. No site surface renders a light palette.

| Semantic token | Value | Verified |
|----------------|-------|----------|
| `--color-canvas` | `#F1F2F4` | — |
| `--color-surface` | `#F9FAFB` | — |
| `--color-content` | `#FFFFFF` | — |
| `--color-text` | `#1F2328` | 14.10:1 AA |
| `--color-text-muted` | `#5A6472` | 5.36:1 AA |
| `--color-text-subtle` | `#8A919B` | **2.84:1 — fails AA. Use for non-text decoration only.** |
| `--color-accent` | `#2563EB` | 4.61:1 AA |
| `--color-accent-strong` | `#1D4ED8` | 5.98:1 AA |
| `--color-border` | `#DDE0E4` | — |
| `--color-border-strong` | `#C3C7CD` | — |
| `--color-danger` | `#DC2626` | 4.31:1 — AA for large text and UI only |

**Rule LIGHT-001:** while the site renders dark-only, no light token may be used in site chrome. Their presence in the theme file must not be read as permission to build a light section.

### 4.3 Application palettes — **Removed from the site** (v1.2, 2026-09-14)

The eight palettes declared in `../Bentomux-v2/src/shared/types.ts` (`PaletteName`), with dark-variant values read from `src/styles.css`. They are recorded below because they are part of the application's identity, but **no site surface uses them**: the preview band was removed in v1.2, so no `--palette-*` token is declared or read anywhere in this site's stylesheet, and the accent stays `--color-accent` `#4C8EF9`.

| # | Palette (`id`) | Display name | `--palette-bg` | `--palette-surface` | `--palette-text` | `--palette-accent` | `--palette-danger` |
|---|----------------|--------------|----------------|---------------------|------------------|--------------------|--------------------|
| 1 | `default` | Default | `#17181B` | `#222428` | `#E8EAED` | `#4C8EF9` | `#E5534B` |
| 2 | `catppuccin` | Catppuccin | `#1E1E2E` | `#181825` | `#CDD6F4` | `#89B4FA` | `#F38BA8` |
| 3 | `rose-pine` | Rosé Pine | `#191724` | `#1F1D2E` | `#E0DEF4` | `#9CCFD8` | `#EB6F92` |
| 4 | `gruvbox` | Gruvbox | `#1D2021` | `#282828` | `#EBDDB2` | `#83A598` | `#FB4934` |
| 5 | `dracula` | Dracula | `#21222C` | `#282A36` | `#F8F8F2` | `#BD93F9` | `#FF5555` |
| 6 | `nord` | Nord | `#2E3440` | `#3B4252` | `#ECEFF4` | `#88C0D0` | `#BF616A` |
| 7 | `classic` | Classic | `#1A1C2C` | `#21243C` | `#F4F4F4` | `#FFCD75` | `#FF004D` |
| 8 | `eink` | E-Ink | `#000000` | `#000000` | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |

Each palette also carries `--palette-line` and `--palette-text-muted`; values are read from the corresponding `:root.dark.palette-*` block in `src/styles.css` and must not be approximated. This table is reference material for the application, not a design token set for the site.

### 4.4 Verified contrast pairs

Every text-on-background pair used in site chrome was measured. Values below are computed contrast ratios, not estimates.

**Dark canvas `#17181B`:**

| Foreground | Ratio | Verdict | Permitted use |
|-----------|-------|---------|---------------|
| `--color-text` `#E8EAED` | 14.73:1 | AA / AAA | Any size |
| `--color-text-muted` `#A6ABB3` | 7.69:1 | AA / AAA | Any size |
| `--color-text-subtle` `#71767E` | 3.88:1 | AA large / UI | ≥24px, or non-text UI. **Not body copy.** |
| `--color-accent` `#4C8EF9` | 5.53:1 | AA | Links and body-size accent text |
| `--color-accent-strong` `#7CACFF` | 7.78:1 | AA / AAA | Accent text at any size |
| `--color-danger` `#E5534B` | 4.79:1 | AA | Error text |

**Light canvas `#F1F2F4`** — see §4.2. `--color-text` 14.10:1, `--color-text-muted` 5.36:1, `--color-accent` 4.61:1, `--color-danger` 4.31:1 (large/UI only), `--color-text-subtle` fails and is decoration-only.

**Primary button fills — the accent is not a safe label background for white text:**

| Combination | Ratio | Verdict | Decision |
|-------------|-------|---------|----------|
| White on `#4C8EF9` | **3.21:1** | Fails AA | **Not used.** |
| `#17181B` on `#4C8EF9` | **5.53:1** | AA | **Dark-theme primary button label.** |
| White on `#2563EB` | 5.17:1 | AA | Light-theme primary button label. |
| `#17181B` on `#2563EB` | 3.43:1 | Fails AA | Not used. |

**Rule BTN-001:** the primary button label color is theme-dependent — canvas ink on the accent in dark, white on the accent in light. White-on-blue in dark mode is explicitly forbidden: it fails AA at 3.21:1.

**Palette surfaces (reference only — no longer rendered by the site):**

| Palette | Ink on bg | Accent on bg |
|---------|-----------|--------------|
| Default | 14.73:1 | 5.53:1 |
| Catppuccin | 11.34:1 | 7.79:1 |
| Rosé Pine | 13.39:1 | 10.37:1 |
| Gruvbox | 11.95:1 | 6.09:1 |
| Dracula | 14.81:1 | 6.55:1 |
| Nord | 10.84:1 | 6.24:1 |
| Classic | 15.32:1 | 11.43:1 |
| E-Ink | 21.00:1 | 21.00:1 |

All eight pass AA for both pairs, so the application's palettes are legible in either mode. The site no longer renders any of them.

### 4.5 Color usage rules

- **CLR-001:** One accent only. `--color-accent` is reserved for primary actions, links, focus rings, and selection. It must not be used for decoration, borders on non-interactive elements, or headings.
- **CLR-002:** The accent must cover no more than roughly 5% of any viewport. Its scarcity is what makes it read as a call to action.
- **CLR-003:** Status is never conveyed by color alone (`SRS FR-002.4`). Every status carries text, an icon, or a shape difference — the window mock's sidebar states and the capability rows' state panels both print the state as a word beside the dot.
- **CLR-004:** `--color-success` and `--color-danger` appear only in the waitlist form's result state and error state respectively. They are not decorative.
- **CLR-005:** No gradients. The composition is flat surfaces, one accent, and hairline borders. There is no gradient anywhere on the site.
- **CLR-006:** Transparency is used for exactly three roles: `--color-tint` (neutral hover), `--color-accent-tint` (accent-tinted selection), and the navigation bar's backdrop. No other alpha values.

---

## 5. Typography

### 5.1 Families

| Role | Token | Value | Loading |
|------|-------|-------|---------|
| Display / headings | `--font-display` | **Archivo**, weights 800 and 900 only | `next/font/google`, `subsets: ['latin']`, `display: 'swap'`, preloaded |
| Body / UI | `--font-sans` | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | None — system stack from `../Bentomux-v2/src/styles.css` `--sans` |
| Terminal / code | `--font-mono` | `"SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace` | None — system stack from `../Bentomux-v2/src/styles.css` `--mono` |

**Rule TYP-001:** exactly one webfont family is loaded. Two weights of Archivo, latin subset, nothing else (`SRS NFR-001.4`).

**Deliberate deviation from the composition reference:** `DESIGN.md` pairs its display face with Inter for body text. This system uses the system UI stack instead. Rationale: it is the application's own body stack (`--sans` in `src/styles.css`), it costs zero bytes against the `NFR-001.4` budget, it renders instantly with no swap flash, and at body sizes the difference is not perceptible on a dark canvas. The consequence — a body face that varies by visitor OS — is accepted. If a fixed body face becomes necessary, Inter is the replacement and the budget in `SRS NFR-001.4` must be re-approved first.

### 5.2 Type scale

| Token | Size | Line height | Weight | Tracking | Family | Use |
|-------|------|-------------|--------|----------|--------|-----|
| `--text-display` | `clamp(2.75rem, 7vw, 6.5rem)` | 0.95 | 900 | `-0.045em` | display | Hero `h1` — the largest type on the site (`SRS BR-001.1`) |
| `--text-display-sm` | `clamp(2rem, 4.5vw, 3.25rem)` | 1.0 | 900 | `-0.035em` | display | Section `h2` |
| `--text-heading` | `clamp(1.375rem, 2vw, 1.75rem)` | 1.15 | 800 | `-0.02em` | display | Feature block `h3`, page titles on secondary routes |
| `--text-heading-sm` | `1.125rem` | 1.3 | 700 | `-0.01em` | display | FAQ questions, card titles |
| `--text-body-lg` | `1.125rem` | 1.6 | 400 | `0` | sans | Hero subheadline, section introductions |
| `--text-body` | `1rem` | 1.65 | 400 | `0` | sans | Descriptions, FAQ answers, privacy prose |
| `--text-body-sm` | `0.875rem` | 1.5 | 400 | `0` | sans | Card body, captions with content |
| `--text-caption` | `0.8125rem` | 1.45 | 500 | `0.01em` | sans | Labels, meta, footer fine print |
| `--text-overline` | `0.75rem` | 1.4 | 600 | `0.08em` | sans | Small uppercase eyebrow labels |
| `--text-mono` | `0.8125rem` | 1.6 | 400 | `0` | mono | Terminal preview, code, file paths |

**Rules:**

- **TYP-002:** Body copy is never smaller than `1rem` (`SRS NFR-007.9`, `RESP-003`). `--text-body-sm` and below are for supporting content only.
- **TYP-003:** Negative tracking applies to display sizes only. It must never be applied to body text.
- **TYP-004:** Uppercase text uses `--text-overline` with positive tracking. Uppercase body text is forbidden.
- **TYP-005:** Line length is constrained to 65–75 characters for prose. The privacy page uses a `65ch` measure.
- **TYP-006:** Headings use `text-wrap: balance`. Body paragraphs use `text-wrap: pretty`. No manual line breaks in marketing copy.
- **TYP-007:** Font sizes are expressed in `rem` and scale with the root font size, so the page survives 320% zoom (`SRS NFR-007.9`).
- **TYP-008:** Copy length per element is bounded by `docs/information_architecture.md` §5.3. A layout that breaks a budget is a copy defect, not a layout defect.

---

## 6. Spacing, Radii, Borders, Elevation

### 6.1 Spacing scale

4px base, geometric after the first steps. Only these values may be used.

| Token | Value | Typical use |
|-------|-------|-------------|
| `--space-1` | 4px | Icon-to-label gap |
| `--space-2` | 8px | Inside chips, tight stacks |
| `--space-3` | 12px | Input padding, chip padding |
| `--space-4` | 16px | Base gutter, list gaps |
| `--space-5` | 20px | Card padding (mobile) |
| `--space-6` | 24px | Card padding, block gaps |
| `--space-8` | 32px | Sub-block separation |
| `--space-10` | 40px | Page gutter (desktop) |
| `--space-12` | 48px | Section internal rhythm |
| `--space-16` | 64px | Section padding (mobile) |
| `--space-24` | 96px | Section padding (desktop) |
| `--space-32` | 128px | Major section separation |

**Rules:**

- **SPC-001:** Vertical section rhythm uses `--space-16` on mobile and `--space-24` on `lg` and above. Whitespace between sections is the primary hierarchy device (`DESIGN.md` rhythm, principle 3); it must not be compressed to fit more content above the fold.
- **SPC-002:** No arbitrary spacing values. If a design needs 18px, it uses `--space-4` (16px) or `--space-5` (20px).
- **SPC-003:** Margin collapse is not relied upon. Spacing between blocks is applied by the parent's `gap`, one direction only.

### 6.2 Radii

Taken from `../Bentomux-v2/src/styles.css` (`--radius` 4px / 6px) for anything that mimics the application, and larger values for marketing surfaces so the page reads as a website rather than an app window.

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 4px | Inputs, buttons, app-mock internals — matches the application exactly |
| `--radius-md` | 6px | Cards inside the app mock, terminal preview |
| `--radius-lg` | 12px | The window mock's frame |
| `--radius-xl` | 18px | Reserved; unused while the site ships no raster frame |
| `--radius-full` | 999px | Chips, pills, badges, avatars, status dots |

**Rule RAD-001:** app-mock surfaces use `--radius-sm` / `--radius-md` only. The mock must look like the application, and the application uses small radii. Large radii inside the mock would misrepresent the product.

### 6.3 Borders

| Token | Value | Use |
|-------|-------|-----|
| `--border-hairline` | `1px solid var(--color-border)` | Card and divider default |
| `--border-emphasis` | `1px solid var(--color-border-strong)` | Hovered card, focused container |
| `--border-accent` | `1px solid var(--color-accent)` | Selected chip, active install option |
| `--ring-focus` | `2px solid var(--color-accent)` with `2px` offset | Every focusable element |

### 6.4 Elevation

Shadows are used sparingly: on a near-black canvas a shadow reads as a smudge, and hairlines read more crisply.

| Token | Value | Use |
|-------|-------|-----|
| `--shadow-none` | `none` | Default for all cards — borders carry the separation |
| `--shadow-raised` | `0 1px 2px rgba(0,0,0,.4)` | Navigation bar once scrolled |

**Rule ELE-001:** no section, card or command block carries a shadow. Hierarchy comes from `--color-surface` against `--color-canvas` plus a hairline border. The scrolled navigation bar is the only element that lifts, and it does so with a background change and its bottom hairline rather than a shadow.

---

## 7. Motion

| Token | Value | Use |
|-------|-------|-----|
| `--duration-instant` | 80ms | Color and opacity changes on hover; one spinner frame |
| `--duration-fast` | 140ms | Reserved; available to interactive components |
| `--duration-base` | 200ms | Mobile menu enter |
| `--duration-slow` | 320ms | Reserved; unused |
| `--ease-standard` | `cubic-bezier(.2,.8,.2,1)` | All transforms and size changes |
| `--ease-out` | `cubic-bezier(0,0,.2,1)` | Opacity-only transitions |

**Rules:**

- **MOT-001:** Animated properties are limited to `opacity`, `transform`, and `color`. Animating layout properties (`height`, `width`, `top`, `left`) is forbidden.
- **MOT-002:** No content animates on scroll. No entrance animation, no scroll-triggered reveal, no parallax, no auto-playing motion.
- **MOT-003:** All durations and easings collapse to `0.01ms` under `prefers-reduced-motion: reduce` (`SRS NFR §5.1`); the mobile menu becomes an instantaneous state change.
- **MOT-004:** The only continuous animations permitted are the hero watermark's slow breath (`§10.2`; `opacity` 0.15→0.27 and `scale` 1→1.02 over 6s) and the window mock's spinner and working timer (`SEC-012`). Both must respect `MOT-003`; the mock discovers the preference in an effect, so the server HTML and the first client render are identical.
- **MOT-005:** No hover animation may be the sole affordance for an action (`SRS NFR-007.5`).

---

## 8. Layout

### 8.1 Breakpoints

| Token | Min width | Composition change |
|-------|-----------|-------------------|
| `base` | 0 | Single column; navigation collapsed; hero stacked |
| `sm` | 640px | Stat strip in two columns; inline form row |
| `md` | 768px | Navigation anchors inline; stat strip in four columns; window mock moves its sidebar beside the pane; three install panels in the switcher |
| `lg` | 1024px | Section padding increases to `--space-24`; wider gutters |
| `xl` | 1280px | Container reaches maximum width; content centres |

### 8.2 Container and grid

| Token | Value |
|-------|-------|
| `--container-max` | 1200px |
| `--container-prose` | 65ch |
| `--gutter-mobile` | `--space-4` (16px) |
| `--gutter-desktop` | `--space-10` (40px) |
| `--grid-columns` | 12 at `lg` and above; stacked below |

**Rules:**

- **LAY-001:** All content sits inside the container. Section bands may bleed to the viewport edge, but text never does.
- **LAY-002:** No horizontal overflow at any width from 360px to 2560px (`SRS BR-001.5`). Every wide element — the install command block, the window mock — must have an explicit `overflow` strategy.
- **LAY-003:** The hero must not push the install command or the waitlist hook below the fold on a 1440×900 desktop (`IA SEC-002`).
- **LAY-004:** Section bands alternate between `--color-canvas` and `--color-canvas-raised` so adjacent sections are distinguishable without borders.
- **LAY-005:** The sticky navigation bar's height is a token (`--nav-height`, 64px) and is added as scroll margin to every anchored section so headings are never obscured (`IA NAV`, `SRS FR-001.5`).

---

## 9. Component Specifications

Every component below is specified by role, variants, states, and token bindings. Implementation must not add a variant that is not listed.

### 9.1 Button

| Variant | Background | Label | Border | Use |
|---------|-----------|-------|--------|-----|
| `primary` | `--color-accent` | `--color-canvas` (5.53:1) | none | Waitlist submit, hero primary action, nav action |
| `secondary` | `--color-surface` | `--color-text` | hairline | Hero secondary action, "Watch repository" |
| `ghost` | transparent | `--color-text-muted` | none | Nav anchor links, footer links |
| `danger` | transparent | `--color-danger` | `danger` hairline | Not used in v1; reserved |

| Size | Height | Padding | Text |
|------|--------|---------|------|
| `sm` | 32px | `--space-3` | `--text-body-sm` |
| `md` | 40px | `--space-4` | `--text-body` |
| `lg` | 48px | `--space-6` | `--text-body-lg` |

**States:** default · hover (`--color-accent-hover` / `--color-surface-hover`) · active (translate 1px down) · focus-visible (`--ring-focus`) · disabled (`opacity: .5`, `cursor: not-allowed`, `aria-disabled`) · loading (`FR-004.5`: label replaced by an indeterminate indicator, width locked to prevent layout shift, `aria-busy="true"`).

**Rules:** BTN-002 — minimum touch target 44×44px below `md` (`SRS NFR-007.6`); height alone is insufficient, so `sm` and `md` buttons receive vertical padding on touch viewports. BTN-003 — no button may be an icon alone without an accessible name. BTN-004 — exactly one `primary` button per section, except the hero, which has one primary and one secondary.

### 9.2 Inline link

Color `--color-accent`, no underline at rest, underlined on hover and always when inside body prose. External links append an icon and an accessible "opens in a new tab" suffix (`SRS FR-007.6`).

### 9.3 Text field (waitlist email)

| Property | Value |
|----------|-------|
| Height | 48px |
| Background | `--color-surface` |
| Border | `1px solid var(--color-border)` |
| Radius | `--radius-sm` |
| Text | `--text-body`, `--color-text` |
| Placeholder | `--color-text-subtle` |
| Focus | `--color-accent` border + `--ring-focus` |
| Error | `--color-danger` border, `--color-danger` message below, `aria-invalid`, `aria-describedby` |
| Disabled | `opacity: .6`, during submit |

**Rules:** INP-001 — the label is visible, not placeholder-only. INP-002 — errors are associated with the input and announced (`SRS FR-004.4`). INP-003 — the honeypot field is visually hidden with a technique that keeps it out of the accessibility tree and off the tab order, while remaining visible to naive parsers (`SRS FR-004.7`).

### 9.4 Navigation bar

| Property | Value |
|----------|-------|
| Height | `--nav-height` (64px) |
| Position | sticky, top 0, `z-index` above content |
| Background (rest) | `rgba(23,24,27,.72)` + `backdrop-filter: blur(12px)`. Translucent so content remains partially visible (`SRS BR-001.4`). |
| Background (scrolled) | `rgba(23,24,27,.92)` + hairline bottom border + `--shadow-raised` |
| Anchors | `--text-body-sm`, `--color-text-muted`; active section `--color-text` + `--color-accent-tint` background |
| Below `md` | Logo, primary action, menu control. Anchors move into a panel. |
| No-JS | The menu control is hidden and the primary action remains; anchors are reachable from the footer (`IA §4.2`) |

**Rules:** NAV-006 — the bar must remain legible over every section without per-section restyling. NAV-007 — opening the mobile menu must move focus into it and closing must return focus to the control (`SRS FR-001.6`). NAV-008 — the bar must not overlap an anchored heading after a jump (`LAY-005`).

### 9.5 Section header

Eyebrow (`--text-overline`, `--color-accent`), `h2` in `--text-display-sm`, introduction in `--text-body-lg` / `--color-text-muted`, constrained to a `60ch` measure. Maximum width for the header block is 720px so headings wrap into two or three lines rather than one long line.

### 9.6 Capability row (`SEC-013`)

Was the feature block (`SEC-004`) until v1.2. One row is one claim with its evidence panel: number, `h3` title, claim paragraph, and an evidence panel.

| Element | Spec |
|---------|------|
| Layout | one column below `lg`, two from `lg` — claim column `minmax(0,1fr)`, evidence column `minmax(0,25rem)` |
| Separation | hairline `--color-border` between rows; a hairline above the first |
| Row number | `--text-mono` in `--color-text-subtle`, tabular figures |
| Title | `--text-heading` (`h3`) |
| Claim | `--text-body` / `--color-text-muted`, capped at `62ch` |
| Evidence panel | `--radius-sm`, hairline border, `--color-canvas-raised`, `p-4`, mono rows |
| Section heading | visually hidden `h2` — the rows are the band (`IA HIER-004`) |

**Evidence panel kinds** (`src/content/caps.ts`, one kind per row):

| Kind | Renders |
|------|---------|
| `tabs` | label / note row pairs — what is open in each pane |
| `states` | 8px state dot + label + the state as a word + a note; the word is mandatory (`CLR-003`) |
| `approval` | mono lines: the request, the permission line, the three actions as text, the bridge's transport |
| `runtimes` | chips — `--radius-sm`, hairline border, `--color-surface`, `--text-caption` mono — plus one note line carrying the two derived counts |
| `machines` | the monitor address in `--color-accent-strong` plus label / note row pairs |

**Rules:** CAP-001 — *retired 2026-09-15.* The repository-evidence line was cut from the row, so the rule has no subject and the id is kept, never reused (`SRS BR-002.1` as amended). CAP-002 — the evidence panel quotes a surface, it does not argue: no prose beyond one note line. CAP-003 — counts inside a row's copy are rendered from `src/content/agents.ts`, never typed; the build fails on a literal (`sys_uc_004`).

### 9.7 Application window mock (`SEC-012`, `FIG-001`)

The page's only image of the product, and it is markup, not a raster: on the app mock surface from `§9.6`'s rules, a two-column grid — sidebar (`minmax(0,15rem)`) and pane region — that stacks below `md`.

| Element | Spec |
|---------|------|
| Frame | `--radius-lg`, hairline `--color-border`, `--color-canvas-raised`; sidebar separated by a hairline |
| Panel label | `--text-overline`, uppercase, `--color-text-subtle`; the sidebar carries one label, "workspaces" — the application has no agent panel, so no second group is drawn (`SRS FR-002.2`) |
| Workspace row | 8px state dot, name, branch in `--text-mono`; 36px minimum height |
| Tab strip | mono labels, active tab on `--color-canvas` with a hairline border on three sides |
| Pane | `--color-canvas`, `p-4`, `--text-mono`, one line per output row |
| Tones | four only: `--color-text`, `--color-text-subtle`, `--color-accent-strong`, `--color-warning` (plus `--color-success` for a succeeded step) |
| Band label | visible, `--text-overline` uppercase — it names a figure, not the band |
| Caption | `--text-caption` in `--color-text-subtle` below the frame |

**Removed (v1.2, 2026-09-14):** the sidebar's second group — an "agents" panel label with one row per running agent (state glyph, workspace name, `state · runtime`) — was deleted with the agent panel it described. A runtime belongs to the tab that runs it, so the workspace row and its tab strip already carry it; the workspace row, the tab strip and the pane are the whole sidebar. The figure's caption reads "Three workspaces, one of them waiting on your approval."

**Rules:** MOCK-001 — the mock is a `group` of `aria-pressed` buttons, never an ARIA tablist: nothing behind it is running, and a tablist would promise the visitor an application. MOCK-002 — the spinner ticks every 80ms and the working timer every 1s, both starting only after hydration, so the server HTML and the first client render agree. MOCK-003 — both stop under `prefers-reduced-motion: reduce` (`MOT-004`). MOCK-004 — the window contents come from `src/content/mock.ts` and name runtimes from `src/content/agents.ts`; no version number, model name or measured figure appears in it. MOCK-005 — the first workspace, its first tab and its full pane text render without scripting.

### 9.8 Stat strip (`SEC-011`)

Was the palette selector and preview (`SEC-005`) until v1.2.

| Property | Value |
|----------|-------|
| Layout | four cells in one row from `md`; two columns below |
| Separators | 1px `--color-border` gaps between cells (`gap-px` over a border-coloured background) |
| Cell | `--color-canvas-raised`, `px-4 py-5`, whole cell is the link |
| Figure | `--font-display` at `--text-heading`, weight 800, tabular figures |
| Label | `--text-caption` in `--color-text-subtle` |
| Hover | cell background to `--color-surface` |
| Heading | visually hidden `h2`, so the list is a named region |

**Rules:** STAT-001 — each cell names a destination: repository, `#capabilities`, `#install`, or the licence file. STAT-002 — a figure the project cannot stand behind does not render. The star count is read at render time from the GitHub API and the cell is omitted, not faked, when that read fails (`SRS BR-002.3`). STAT-003 — the strip holds no download, install, contributor or fork figure.

### 9.9 Install switcher and panels (`SEC-006`)

**Switcher:** a single-select group of three options — macOS, Linux, Windows — built from native radio inputs whose labels are styled as tabs. One Tab stop, Arrow keys move selection with wrap-around, selected state exposed to assistive technology (`SRS FR-005.1`, `NFR-007.10`).

| Property | Value |
|----------|-------|
| Option label | OS name only — no architecture (`SRS BR-005.7`) |
| Selected | `--color-surface` background, `--color-text` label |
| Unselected | transparent, `--color-text-muted` |
| Hover | `--color-surface-hover` |
| Focus | `--ring-focus` |
| Radii | `--radius-sm` on both the group and each option |

**Panels:** all three panels are in the DOM. Visibility comes from the checked input — `input:checked ~ .panel { display: block }` — so no script decides which panel shows (`SRS FR-005.6`). The server-rendered HTML has macOS checked (`SRS FR-005.2`), so the section is complete with JavaScript disabled. A client script may swap the checked input to the detected platform only if the visitor has not already chosen; that swap must not alter text or shift layout (`SRS FR-005.4`). Switching panels is not animated: the panels differ in content, not in state (`MOT-002`).

**Panel contents:** one command block (`§9.10`), optional notes beneath it at `--text-body-sm` in `--color-text-muted`, and the macOS unsigned-build note in `--color-warning` (`SRS FR-005.8`).

### 9.10 Install command block, copy control, manual downloads (`SEC-006`)

Mono command text in a bordered block on `--color-surface`, `--radius-sm`, hairline `--color-border`, `--text-mono` in `--color-text`. Overflow scrolls inside the block (`overflow-x: auto`) so a long command never widens the page (`SRS NFR-007.9`). The command is real, selectable text — never an image, never a `title` attribute, never truncated.

**Rules:** CMD-001 — the block is a labelled region: a `figure` whose caption names the platform and the command's role, referenced with `aria-labelledby` (`SRS FR-005.3`). CMD-002 — the rendered characters must equal the source string in `../Bentomux-v2/installers/*`, including flag order and quoting (`SRS BR-005.1`). CMD-003 — the block must not wrap mid-command and must not end in an ellipsis. CMD-004 — no syntax highlighting; one base tone only, so the block cannot imply a shell it is not. CMD-005 — the manual-download line names the five artifact formats as text and carries exactly one link, to the latest release; it must not be five separate links (`SRS FR-005.11`). CMD-006 — the version-pinned example uses the same block style, is labelled as the pinned form, and shows `vX.Y.Z` as the only version literal on the page (`SRS FR-005.12`, `BR-005.4`).

**Copy control:** CPY-001 — a `button` with visible text "Copy", `--radius-sm`, `--color-surface-hover` on hover, placed in the block's top-right corner or directly beneath it. CPY-002 — feedback is text inside the block's own region: "Copied" on success, "Copy failed — select the command manually" on failure, reverting after a short delay. The command remains readable and selectable throughout (`SRS FR-005.5`, `NFR-007.11`). CPY-003 — the control is never the only route: with no clipboard API the command is still selectable text.

### 9.11 Accordion — **Retired** (v1.2, 2026-09-14)

Was: full-width disclosure rows for the FAQ band (`SEC-008`), each question a button with `aria-expanded` and `aria-controls`, every answer present in the HTML before expansion.

The band was removed, so the specification and the `faq-answer` / `faq-chevron` rules left `src/app/globals.css` with it. Reinstating an accordion anywhere on the page means reinstating this specification in full — an accordion without the "answers present in the HTML" rule is a no-JS regression.

### 9.12 Result state (waitlist)

An inline region beneath the form, `aria-live="polite"`, `aria-atomic="true"`.

| State | Visual | Copy tone |
|-------|--------|-----------|
| Idle | Hidden | — |
| Submitting | Button shows indicator, input disabled | — |
| Success | `--color-success` icon + `--color-text` message | Confirms registration, sets expectation of one email at release (`SRS FR-004.3`) |
| Error | `--color-danger` icon + message + retry action | States what failed and offers retry without losing the address (`SRS FR-004.8`) |

The success and error states must be visually distinct by icon and text, not color alone (`CLR-003`). The success state for a duplicate address is identical to a new signup (`SRS FR-004.6`).

### 9.13 Community card — **Retired** (v1.2, 2026-09-14)

Was: four external-link cards (Star, Report a bug, Ask a question, Email) under `SEC-009`. The band was removed; the footer carries all four destinations and the navigation bar carries the repository link, so the card style has no call site.

### 9.14 Footer (`SEC-010`)

| Element | Spec |
|---------|------|
| Layout | Brand column plus three link columns at `lg` (`minmax(0,1.4fr)` then three equal columns), two at `md`; the brand cell is the logo and nothing else |
| Link text | `--text-body-sm`, `--color-text-muted`, hover `--color-text`; rows are 44px below `md` (`BTN-002`) and 32px from `md` |
| Group heading | `--text-overline`, uppercase, `--color-text-subtle` |
| Legal block | Hairline spans the footer; the prose sits in a single column capped at `70ch`, `--text-caption`. The load-bearing licence sentence holds `--color-text-muted`; the trademark disclaimer and telemetry line are `--color-text-subtle` |
| Bottom bar | Hairline above; copyright (`--color-text-subtle`) left, Privacy and the `mailto:` address right, `--text-caption`; stacks below `sm` |
| Logo | `assets/bentomux.png` at 24px height, linking to `/`, with the wordmark beside it |
| Structure | Brand and links, then a hairline, then the legal block (licence statement, trademark disclaimer, telemetry), then a hairline, then copyright and the two routes out |

The legal block text is fixed by `SRS BR-009.1`–`BR-009.2` and must be rendered from a content module so it cannot drift per page (`IA XPG-001`). `--color-text-subtle` is permitted here because it is non-essential fine print at large size — but the license statement, being legally load-bearing, uses `--color-text-muted` (7.69:1).

> **Revised 2026-09-15.** The attribution and non-affiliation sentences, the upstream credit link, and the `SiteConfig.upstreamUrl` / `attributionStatement` / `nonAffiliationStatement` fields were removed: the claim that the application ports detection logic from another project was withdrawn, so the sentences that discharged it no longer describe anything. `BR-009.3`, `BR-009.4` and `FR-009.2` remain open in `docs/srs.md`; see `docs/devlogs/20260915-footer-restructure.md`.

### 9.15 Skip link

First focusable element. Visually hidden until focused, then rendered as a `primary` button pinned to the top-left, targeting `main` (`IA §10`).

---

## 10. Iconography and Imagery

### 10.1 Icons

- Style: 1.5px stroke, 24px nominal grid, no fills except status dots.
- Source: inline SVG in the repository. No icon font, no icon package (`SRS NFR-001.4`).
- Color: `currentColor` only.
- Sizing tokens: `--icon-sm` 16px, `--icon-md` 20px, `--icon-lg` 28px.
- Decorative icons carry `aria-hidden="true"`; meaningful icons carry an accessible name or adjacent text.
- Copy control icon: 16px (`--icon-sm`) clipboard glyph, always accompanied by text, never icon-only (`SRS FR-005.5`).

### 10.2 Logo

`assets/bentomux.png` (1024×1035), served at 24–32px height through the image optimiser. The 1024px source is a requirement, not a preference: the hero renders the same mark at up to 480 CSS px, so the raster must clear 2× that on a retina screen — the earlier 504px export did not, and the watermark read soft (`scripts/smoke.mjs` asserts the optimiser can still return ≥ 960px). One file serves the header, the hero and the tab icon.

The tab icon comes from the same artwork through the app-directory conventions: `src/app/icon.png` (512×512, the square app plate) and `src/app/apple-icon.png` (180×180) for Add-to-Home-Screen. Both are emitted as `<link rel="icon">` / `<link rel="apple-touch-icon">` by the build, so the head carries no hand-written icon tags (`SRS FR-001.8`). Wordmark text is set in `--font-display` at 800 weight beside the mark; it is text, not part of the image, so it scales and remains selectable.

### 10.3 Window mock in place of a screenshot — **Replaced** (v1.2, 2026-09-14)

`assets/screenshot.png` (2982×1974) was the v1.0 hero image, framed with `--radius-xl`, a chrome bar and a gradient mask. It is no longer referenced by any page, and `public/screenshot.png` is kept only as a repository asset.

The window is now drawn as markup (`§9.7`, `SEC-012`): no raster, no fixed aspect ratio, no CLS budget to defend, no `alt` text paraphrasing an interface, and it can be read at any zoom. If a real screenshot is reintroduced, the v1.0 rules come back with it — explicit `width` and `height`, descriptive `alt`, `--radius-xl` frame, and a crop rather than a scale below `md`.

### 10.4 Rules

- **IMG-001:** no stock photography, no illustration, no AI-generated imagery. The only imagery on the site is the window mock, which is markup.
- **IMG-002:** every raster asset is served through Next.js image optimisation in AVIF/WebP at display dimensions (`SRS NFR-001.3`). Page content ships two rasters — the hero mark (`§10.2`) and the window capture (`§10.3`) — and each carries the `sizes` hint its display size needs.
- **IMG-003:** no image may be a substitute for text. Every claim exists as text.

---

## 11. Accessibility Contract

| Requirement | Enforcement |
|-------------|-------------|
| Contrast AA on all text and UI | Every pair pre-verified in §4.4; `CLR-001`–`CLR-004` |
| Visible focus on all interactive elements | `--ring-focus`, never `outline: none` without replacement |
| Keyboard operation | All interactive components operable by keyboard; the window mock's workspace, tab and agent buttons are ordinary buttons, and the install switcher has defined key behaviour; the command blocks need no key behaviour beyond text selection |
| Semantic landmarks | `header`, `nav`, `main`, `footer`, one `h1`, no skipped heading levels (`IA §5.1`, `§10`) |
| Name, role, value | Every control exposes state; no icon-only control without a name |
| Status not by color alone | `CLR-003` |
| Copy feedback available without sight of the control | Copy success and failure are reported as text inside the block's region (`CPY-002`) |
| Target size | 44×44px minimum below `md` (`BTN-002`) |
| Zoom | Layout survives 320% zoom (`TYP-007`) |
| Reduced motion | `MOT-003` |
| Form errors | Associated and announced (`INP-002`) |
| Alternative to placeholder | Visible labels (`INP-001`) |

---

## 12. Token to Tailwind Mapping

Tailwind CSS v4 CSS-first configuration. This block is the single source of token truth (`TOK-004`). No `tailwind.config.js` duplicates these values.

```css
@theme {
  /* color — site chrome (dark) */
  --color-canvas: #17181B;
  --color-canvas-raised: #1C1E22;
  --color-surface: #222428;
  --color-surface-hover: #282B30;
  --color-content: #17181B;
  --color-text: #E8EAED;
  --color-text-muted: #A6ABB3;
  --color-text-subtle: #71767E;
  --color-accent: #4C8EF9;
  --color-accent-hover: #6BA1FB;
  --color-accent-strong: #7CACFF;
  --color-accent-tint: rgba(76, 142, 249, .16);
  --color-border: #2C2F34;
  --color-border-strong: #3B3F45;
  --color-tint: rgba(255, 255, 255, .07);
  --color-danger: #E5534B;
  --color-success: #3FB950;
  --color-warning: #D29922;

  /* typography */
  --font-display: var(--font-archivo), ui-sans-serif, system-ui, sans-serif;
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace;

  /* radii, spacing, layout */
  --radius-sm: 4px;   --radius-md: 6px;    --radius-lg: 12px;
  --radius-xl: 18px;  --radius-full: 999px;
  --spacing-nav: 64px;
  --container-max: 1200px;
}
```

**No palette tokens:** the palette preview was removed in v1.2, so no `--palette-*` token is declared anywhere. The accent is `--color-accent` `#4C8EF9` on every surface (`TOK-003`).

---

## 13. Do and Do Not

| Do | Do not |
|----|--------|
| Inherit the application's tokens | Invent a new brand palette |
| Let the window mock be the ornament | Add decorative gradients, blobs, or illustrations |
| Carry hierarchy with scale and whitespace | Carry hierarchy with color or shadow |
| Use one accent, sparingly | Introduce a second accent or tint a heading |
| Match the application's small radii inside app mocks | Round the mock into a marketing card |
| Quote the installer's own commands unchanged | Reword, re-wrap, or translate a command into prose |
| State figures the repository owns, and drop the star cell when the API does not answer | Show a count the project cannot stand behind |
| Offer one manual-download link to the latest release | List five artifact links, or link to a versioned release page |
| Keep the unsigned-build note beside the macOS command | Bury a limitation in a dialog or a FAQ deep link |
| Distinguish support levels with text and shape | Distinguish them with color alone |
| Use `--color-canvas` ink on the accent for primary buttons | Put white on the accent in dark mode (3.21:1, fails AA) |
| Load one webfont family | Load a second webfont for body text |
| Keep copy inside `IA §5.3` budgets | Fill space because the layout allows it |

---

## 14. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-13 | F. Jibran | Initial version. Tokens seeded from `../Bentomux-v2/src/styles.css`; composition from `DESIGN.md`; eight palettes from `src/shared/types.ts` with values from the `:root.dark.palette-*` blocks; all contrast pairs measured and recorded in §4.4. |
| 1.1 | 2026-09-13 | F. Jibran | §9.9 rewritten from a platform card into the install switcher and panels, §9.10 from the pre-release dialog into the command block, copy control and manual-download specification (`CMD-001`–`CMD-006`, `CPY-001`–`CPY-003`). Dialog rules `DLG-001`–`DLG-005` and the `--shadow-dialog` token retired with the dialog. `--color-warning` now serves the unsigned-build note. Typography, palettes, contrast pairs and layout tokens unchanged. Derived from `docs/srs.md` v1.1 and `docs/information_architecture.md` v1.1. |
| 1.2 | 2026-09-14 | F. Jibran | §9.6 rewritten from the feature block into the capability row (five rows, five evidence-panel kinds, `CAP-001`–`CAP-003`), §9.7 from the agent chip into the application window mock (`MOCK-001`–`MOCK-005`), §9.8 from the palette selector into the stat strip (`STAT-001`–`STAT-003`), §9.11 and §9.13 marked retired with their bands. §4.3 and the palette-surface half of §4.4 kept as application reference and marked unused by the site; palette tokens, accordion rules and the hero screenshot retired. `MOT-004` now admits the mock's spinner and timer; §8.1, `LAY-001`–`LAY-003` and the imagery rules updated. Accent unchanged at `#4C8EF9`. Derived from `docs/srs.md` v1.2 and `docs/information_architecture.md` v1.2. **Amended the same day (2026-09-14):** §9.7's sidebar is workspaces-only — the "agents" panel label and the agent-row spec were removed because the application has no agent panel. |
| 1.3 | 2026-09-15 | F. Jibran | §9.6: the repository-evidence line was removed from the capability-row spec — the prose, its table row, and `CAP-001`, which is now marked retired rather than reused because the rule has no subject. The evidence panel, its five kinds and `CAP-002`/`CAP-003` are unchanged. Derived from `docs/srs.md` v1.3. |
| 1.4 | 2026-09-15 | F. Jibran | §10.2: the logo source is now the 1024×1035 export (was 504×495) because the hero renders the mark at up to 480 CSS px, and the section records the two app-directory files that serve the tab icon and the Apple touch icon. `MOT-004` swapped the retired waitlist submit indicator for the hero watermark's 6s breath — the exception the code already claimed was documented — and names its opacity and scale swing, which the first build kept so shallow over 9s that the motion was easy to miss. `IMG-002` was corrected: it still claimed the site ships no raster in page content, which the hero mark and the window capture both contradict, so it now names the two and requires a `sizes` hint on each. Derived from `docs/srs.md` v1.4. |
