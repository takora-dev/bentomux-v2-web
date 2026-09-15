# User Flow: Preview Theme Palettes — Retired (2026-09-14)

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Retired (2026-09-14) | **Last Updated:** 2026-09-14

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-007 |
| Name | Preview Theme Palettes |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Goal | See how the application looks in each of its shipped colour palettes, and confirm that one of them suits their taste or their vision needs |
| Trigger | Retired — the visitor would once have scrolled to `SEC-005` (`#palettes`) or selected **Themes** in the navigation bar |
| Preconditions | None. The band, its content module and its requirements were removed in v1.2. |

> **Retired 2026-09-14 (v1.2).** The `#palettes` band (`SEC-005`) and its palette preview were removed in the v1.2 rebuild. The site ships no theme control: the accent is fixed at the Bentomux blue `#4c8ef9`, and the composition is dark only. A band that let a visitor re-theme a mock surface therefore advertised a choice the page itself does not offer. The requirements `FR-008.1`–`FR-008.7` and `BR-008.1`–`BR-008.4` are withdrawn in `docs/srs.md` v1.2, and no `--palette-*` token is declared anywhere in the stylesheet. This flow is retained for traceability.

## Why It Was Retired

1. The preview was a control, not content: it implied the marketing page could be re-themed, which it cannot (`BR-008.2` was the warning it tripped).
2. The eight palettes are an application feature. Documenting them on the landing page duplicated a surface the application owns.
3. The band carried eight interactive swatches and their colour tables — the single largest block removed in the rebuild.
4. No flow depended on it, and no call to action pointed at it.

## Where the Palettes Are Recorded Now

| What the band showed | Where it lives now | Reference |
|----------------------|--------------------|-----------|
| The eight palette identifiers | `docs/design_system.md` §4.3, as application reference marked unused by the site | `AC-009`, `CON-013` |
| The colour values | `../Bentomux-v2/src/styles.css` — the application's own tokens, not the site's | `CON-013` |
| The accent the site actually uses | `--color-accent: #4c8ef9`, one accent only, no theme control | `BR-001.2`, `CLR-001` |
| The dark-only decision | `OQ-009` in `docs/srs.md`: the site is dark only; the application's light appearance is not represented | `OQ-009` |
| The README's claim of six palettes | Still stale; the `PaletteName` union declares eight | `CON-013` |

## What Was Lost

- A visitor can no longer see the application's palette set before installing it.
- The site no longer demonstrates that the application is themeable at all. That claim is not made, which is deliberate: the site must not advertise a choice it does not offer.

## Alternative Flows That Still Hold

### Alt-1: A visitor wants to know what the site itself looks like
**Trigger:** The visitor asks whether the landing page has a light mode or a different accent.

1. The answer is no: the site renders one dark composition with one accent (`BR-001.2`, `OQ-009`).
2. There is no control to look for, and no `prefers-color-scheme` branch in the stylesheet.
3. **Outcome:** The visitor knows the page's appearance is fixed, without hunting for a switcher.

### Alt-2: Arrival on a retired anchor
**Trigger:** A bookmarked `/#palettes` link, or a stale external link into the retired band.

1. The hash resolves to no element; the page stays at the top and nothing errors (`sys_uc_001.md` §Error Handling).
2. The retired identifiers are gone and must not be reintroduced as links (`IA URL-002`); the smoke run fails if `palettes` reappears as an anchor.
3. **Outcome:** The visitor lands on a working page.

## Exception Flows

### Exc-1: A palette token is reintroduced into the stylesheet
**Trigger:** A `--palette-*` custom property or a palette-specific rule returns to `src/app/globals.css`.

1. This contradicts `BR-001.2` and the retired rows in `docs/design_system.md` §9.11.
2. The dead-CSS smoke check fails on the served stylesheet, so a reintroduced token cannot ship unnoticed.
3. **Outcome:** The appearance stays fixed to the single accent.

### Exc-2: A theme control reappears
**Trigger:** A switcher, a `prefers-color-scheme` branch, or an `[data-theme]` attribute is added to the page.

1. This contradicts `BR-001.2` and `OQ-009`, which record the site as dark only.
2. **Outcome:** Prevented in review: no `FR-` requirement in this revision calls for a theme control, so none may be added without reopening `OQ-009`.

## Postconditions

*What must be true after this use case completes (success or failure).*

- No palette band, palette control, or palette token exists on the site.
- The site declares exactly one accent and no theme branch (`BR-001.2`).
- The retired identifier `SEC-005` is not reused by any band, and no requirement in this revision depends on the preview (`IA §7`).
- The eight application palettes remain documented as application reference, not as a site feature.

## Related Pages

*Screens or pages involved in this flow. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Carries the fixed accent the retired band used to demonstrate; no band replaces the preview. |
| PAGE-002, PAGE-003 | Privacy policy, 404 | Not involved. |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| Design tokens | `src/app/globals.css` | Read | The site's own tokens: one accent, no palette variables (`CLR-001`–`CLR-004`). |
| `SiteConfig` | `src/content/site.ts` | Read | Not used by this flow; retained because it owns the site's chrome facts. |
| Application palettes | `../Bentomux-v2/src/styles.css`, `src/shared/types.ts` | Reference only | Recorded in `docs/design_system.md` §4.3 as application reference. Not rendered anywhere on the site. |
| `Palette`, `PaletteSelector`, `PalettePreview` | — | Deleted | The content module, its eight entries and both components were removed in v1.2. |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] No palette band, palette swatch, or palette name appears in the served HTML
- [ ] No `#palettes` anchor exists, and no link points at one
- [ ] No `--palette-*` token and no palette-specific rule appears in the served stylesheet
- [ ] The page declares one accent and renders no theme control
- [ ] No `prefers-color-scheme` branch or `[data-theme]` switching exists
- [ ] The entry point performs no theme detection and writes no theme preference

## Traceability

*Link back to the SRS requirements this use case satisfies.* All requirements this flow originally traced to were withdrawn in `srs.md` v1.2; the rows below record what now governs the same surface.

| Requirement ID | Requirement Description | How This Use Case Now Satisfies It |
|----------------|------------------------|-----------------------------------|
| FR-008.1–FR-008.7 | **Withdrawn (v1.2).** Palette preview behaviour | Retired with `SEC-005`; see the redirection table above |
| BR-008.1–BR-008.4 | **Withdrawn (v1.2).** Palette preview rules | Retired with `SEC-005` |
| BR-001.2 | One dominant accent, no competing accent, no theme control | AC 4, 5; Alt-1; Exc-2 |
| CLR-001 | One accent, reserved for primary actions | Alt-1 |
| CON-013 | Product facts sourced from code, never the README | Redirection table row 5 |
| OQ-009 | The site is dark only; the application's light appearance is not represented | AC 5; Alt-1; Exc-2 |
| IA URL-002 | Retired anchors are gone and must not be reintroduced | Alt-2; AC 2 |
| IA §7 | `SEC-005` is retired and not reused | Postconditions; AC 1 |
