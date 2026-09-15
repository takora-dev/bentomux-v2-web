# UCIC: Preview Theme Palettes

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Retired (v1.2, 2026-09-14) | **Last Updated:** 2026-09-14

> **This contract is withdrawn.** The band it specified was removed when the landing page was rebuilt to its six-band structure. The body below is kept as the record of what was implemented in v1.1, not as a contract to satisfy.

**What replaced it:** nothing. The site ships no theme switcher, so the accent stays `--color-accent` `#4C8EF9` on every surface and no `--palette-*` token is declared or read. The application's eight palettes are recorded as reference material in `docs/design_system.md` §4.3 (`SRS F008`, retired).

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-007 |
| Name | Preview Theme Palettes |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_007.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` | `SEC-005` holds the selector and the preview surface |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-004 PaletteOption | The eight selectable palettes, each carrying the token values the preview renders | Read |

No write occurs. The selection is component state for the page session and is never persisted anywhere (`BR-008.3`, `PAL-002`).

## Sequence Diagram

```
Visitor          Palette Selector        Preview Surface        Palette Tokens (CSS scope)
   |                    |                      |                        |
   |--[page load]------>|                      |                        |
   |                    |--[default selected]--|                        |
   |                    |                      |--[apply --palette-* from ENT-004 default]
   |--[click / arrow key]>|                    |                        |
   |                    |--[move selection---->|                        |
   |                    |                      |--[swap token values on the scoped scope]
   |<--[cross-fade, opacity only, 80ms]--|     |                        |
   |                    |                      |                        |
   |--[reload]--------->|  (selection lost by design; default returns)
```

*Describe each step in the sequence:*
1. **User/Frontend:** The visitor opens the selector and changes the selection by pointer or arrow keys.
2. **API Gateway:** Not applicable — no request, no fetch, no image swap. All eight palettes are present in the page's CSS scope from first paint.
3. **Backend Service:** At build time, `ENT-004` supplies both the option list and the token values. Values are transcriptions of the application's own theme blocks, so what the visitor previews is what the application renders (`FR-008.5`).
4. **Database:** Not applicable.
5. **Response:** The preview surface's `--palette-*` custom properties change on the scoped element only. The site's own chrome does not change appearance (`TOK-003`, `PAL-001`).

## API Contract

### Endpoint

```
None — this use case makes no HTTP request.
```

### Component Contract — `PaletteSelector`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| palettes | `PaletteOption[]` | Yes | The eight options, pre-sorted by `order` | Exactly eight; exactly one carries `isDefault` (`BR-008.1`) |
| selectedId | `string` | Yes | Currently selected palette id | Initial value is the entry with `isDefault = true` (`FR-008.4`) |
| onSelect | `(id: string) => void` | Yes | Selection change | Must not write to any storage, cookie, or URL (`BR-008.3`) |

Accessibility contract, per `design_system.md` §9.8:

| Aspect | Declared Behaviour |
|--------|--------------------|
| Roles | Container is `role="radiogroup"`; each option is `role="radio"` with `aria-checked` |
| Tab stops | Roving tabindex: the group is one Tab stop; only the selected option has `tabindex="0"` |
| Arrow keys | `ArrowRight` / `ArrowDown` move selection forward; `ArrowLeft` / `ArrowUp` move backward; both wrap. Selection follows focus, so no separate activation step is needed |
| `Home` / `End` | Move to the first and last option |
| Identity | Each option shows a three-swatch strip (background, text, accent) plus the palette name, so a palette is never identified by colour alone (`CLR-003`) |
| Selected indicator | Accent border, accent-tinted background, and a non-colour indicator glyph |

### Component Contract — `PalettePreview`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| palette | `PaletteOption` | Yes | The selected entry | — |

Scoped custom properties set on this element, from `ENT-004.tokens` only:

| Property | Source attribute | Must be visible in the preview |
|----------|------------------|-------------------------------|
| `--palette-bg` | `tokens.bg` | Yes — the surface background |
| `--palette-surface` | `tokens.surface` | Yes — a raised region |
| `--palette-content-bg` | `tokens.contentBg` | Yes — the content panel |
| `--palette-ink` | `tokens.ink` | Yes — primary text |
| `--palette-ink-2` | `tokens.ink2` | Yes — secondary text |
| `--palette-ink-3` | `tokens.ink3` | Permitted for non-essential UI only |
| `--palette-line` | `tokens.line` | Yes — a hairline |
| `--palette-line-2` | `tokens.line2` | Yes — a stronger divider |
| `--palette-accent` | `tokens.accent` | Yes — an accented element |
| `--palette-accent-ink` | `tokens.accentInk` | Permitted where the application uses it |
| `--palette-danger` | `tokens.danger` | Yes — a status or error colour (`FR-008.6`) |

### Request Headers

Not applicable.

### Request Payload

Not applicable.

### Response Payload (Success)

Not applicable at the HTTP level. The delivered structure is fixed:

```html
<section id="palettes">                        <!-- SEC-005 -->
  <h2>…  <!-- states the palette count, derived from ENT-004 -->
  <div role="radiogroup" aria-label="Theme palette">
    <button role="radio" aria-checked="true"  tabindex="0">  swatches + "Default"   </button>
    <button role="radio" aria-checked="false" tabindex="-1"> swatches + "Catppuccin"</button>
    <!-- six more: Rosé Pine, Gruvbox, Dracula, Nord, Classic, E-Ink -->
  </div>
  <div class="preview-scope">                  <!-- --palette-* applied here only -->
    <!-- terminal and chrome mock, showing bg, surface, text, muted, accent, danger -->
  </div>
</section>
```

With JavaScript unavailable, the selector renders as a static list of the eight palette names and the preview renders the default palette (`FR-008.7`, `PAL-003`).

### Status Codes

| Status | Meaning | Condition | Response Body |
|--------|---------|-----------|---------------|
| — | No HTTP exchange occurs | Entire use case | — |

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Selector option label | — | `ENT-004 PaletteOption.name` | Option text | Correct accents: Rosé Pine, Gruvbox, E-Ink |
| Selector option swatch | — | `ENT-004 PaletteOption.swatch` | Three chips | Background, accent, text — order is fixed |
| Option identity | — | `ENT-004 PaletteOption.id` | `value` of the radio | Stable; used by tests and by `defaultExpandedId`-style state |
| Default selection | — | `ENT-004 PaletteOption.isDefault` | Initial `aria-checked` | Exactly one entry; renders on first paint and after reload (`BR-008.3`) |
| Preview surface colours | — | `ENT-004 PaletteOption.tokens.*` | Scoped `--palette-*` properties | Values verbatim from the application stylesheet; never hand-tuned |
| Section heading count | — | `ENT-004` array length | Numeral in the heading | Derived, so it cannot drift from the selector |
| Provenance | — | `ENT-004 PaletteOption.sourceBlock` | Not rendered | Kept for verification: it names the stylesheet selector each entry was transcribed from (`FR-008.5`) |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| PaletteOption set | Exactly eight entries | Build fails: `expected 8 palettes` | `BUILD_PALETTE_COUNT` |
| PaletteOption.id | Member of the eight-value union | Build fails: `unknown palette id` | `BUILD_PALETTE_ID` |
| isDefault | Exactly one entry | Build fails: `expected exactly one default palette` | `BUILD_PALETTE_DEFAULT` |
| sourceBlock | Non-null for all seven non-default entries | Build fails: `palette missing source block` | `BUILD_PALETTE_SOURCE` |
| tokens.* | Valid `#RRGGBB` values matching the application stylesheet | Test: compare each token against `../Bentomux-v2/src/styles.css` | `CONTENT_PALETTE_DRIFT` |
| Token scope | No `--palette-*` property may be defined on `:root`, `body`, or the site chrome | Lint failure: `palette token leaked outside preview scope` | `LINT_PALETTE_LEAK` |
| Selection persistence | No cookie, `localStorage`, `sessionStorage`, or URL parameter carries a palette selection | Test: after selection, assert storage is empty and the URL is unchanged | `UI_PALETTE_PERSISTED` |
| Roving tabindex | Exactly one option has `tabindex="0"` at any time | Test: count focusable options after each arrow press | `UI_TABINDEX_BROKEN` |
| Keyboard operability | All eight reachable by arrow keys alone | Test: from the first option, `ArrowRight` seven times selects the last | `UI_PALETTE_KEYBOARD` |
| Contrast within the preview | Every text-on-background pair inside the preview meets 4.5:1 | Measured at implementation for all eight palettes; all eight currently pass | `CLR_PALETTE_CONTRAST` |
| Motion | Switch animates `opacity` only, `--duration-fast`, no layout transition | Test: no transition property other than opacity is declared on the scope | `UI_PALETTE_MOTION` |
| Reduced motion | The cross-fade collapses under `prefers-reduced-motion: reduce` | Test: computed transition duration is 0 in that context | `UI_PALETTE_REDUCED_MOTION` |
| No-JS fallback | Default palette renders and all eight names are listed as text | Test: with JavaScript disabled, the eight names are present and the preview shows the default | `UI_PALETTE_NOJS` |

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| JavaScript unavailable | N/A | Server-rendered markup | The default palette renders and the eight names are listed as text. The section still communicates that eight themes exist (`FR-008.7`) |
| A token value is wrong or missing | N/A | — | Deployment is aborted by the schema, or the drift test fails. A palette that does not match the application would undermine the section's whole premise (`FR-008.5`) |
| Contrast fails for one palette | N/A | — | Test failure at implementation time, not a runtime condition. The offending pair and its measured ratio are reported so the transcription can be re-checked against the stylesheet |
| Visitor's browser lacks a feature the preview uses | N/A | Server-rendered markup | Custom properties are the only modern feature required, and they are universally supported in the target range. The preview degrades to the default rendering rather than to nothing |
| Selection lost on reload and reported as a bug | N/A | — | Working as designed. `BR-008.3` forbids persistence; the contract states this so it is not "fixed" later by adding a cookie (`PAL-002`) |
| Reduced-motion preference set | N/A | — | The cross-fade collapses to an instant change (`MOT-003`) |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_007.md` | This UCIC implements the flow defined there |
| Data Model | `docs/data_model.md` §3 ENT-004; §4 PaletteOption transient state; §5 Palette Rules; §7 `paletteSetSchema` | This UCIC uses entities and invariants defined there |
| SRS | `docs/srs.md` §3.8 F008 (incl. `BR-008`), §6.7 NFR-007, §4.1 palette facts | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §7 SEC-005, §5 Content Hierarchy | Section role, copy budget, and the palette-count claim's ownership come from there |
| Design System | `docs/design_system.md` §9.8 Palette selector and preview, §3 TOK-003, §4 CLR-003, §7 MOT-001, MOT-003, §11 Accessibility Contract | Selector semantics, token scoping, colour-independence, and motion rules come from there |
