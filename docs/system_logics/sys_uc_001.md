# UCIC: Browse the Landing Page

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Draft | **Last Updated:** 2026-09-14

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-001 |
| Name | Browse the Landing Page |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_001.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` — Bentomux — run every coding agent in one window | The whole surface of this use case; a single scrolling document in the served band order `SEC-002` → `SEC-011` → `SEC-012` → `SEC-013` → `SEC-007` → `SEC-006`, then `SEC-010` |
| PAGE-003 | `/*` — catch-all | Rendered only when the visitor follows a stale or mistyped link; `noindex` and a route back to `PAGE-001` (`IA URL-005`) |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-009 NavItem | Supplies the navigation entries and their targets | Read |
| ENT-001 SiteConfig | Supplies site identity, the repository destination, and the metadata used for the route's `<head>` | Read |
| ENT-003 AgentRuntime | The detected-runtime count, derived at build time. Since v1.2 the roster has no band of its own: the count renders in capability row 04 and in the stat strip | Read |
| ENT-013 CapabilityRow | Supplies the five numbered rows and their evidence panels (`SEC-013`) | Read |
| ENT-014 AppMock | Supplies the window figure's workspaces, tabs and pane lines (`SEC-012`). The mock renders no agent panel: the application has none, and a runtime belongs to the tab that runs it | Read |
| ENT-015 StatFact | Supplies the strip's figures; the star fact is fetched at render time (`SEC-011`) | Read |
| ENT-005 InstallOption | Supplies the `SEC-006` install switcher and its panels | Read |
| ENT-010 InstallCommand | Supplies the verbatim commands rendered inside those panels | Read |
| ENT-011 InstallerStep | Supplies the three-step installer explanation | Read |
| ENT-012 ManualDownloadList | Supplies the manual-download line | Read |

`ENT-002` (feature blocks), `ENT-004` (palette options), `ENT-006` (FAQ items) and `ENT-007` (community links) are no longer touched: their bands were removed in v1.2 and the entities are retired in `data_model.md` §3.


## Sequence Diagram

```
Browser              Next.js (RSC)        Content Modules (build memory)
   |                      |                          |
   |--[GET /]------------>|                          |
   |                      |--[import modules]------->|
   |                      |<--[site, nav, caps, mock, stats]--|
   |                      |--[read the star count, one cached request (ENT-015)]
   |                      |--[build metadata from ENT-001]
   |                      |--[render the six bands, then the footer]
   |<--[HTML: full document, no data fetch]--|
   |                      |                          |
   |--[click nav anchor]->|  (no request; in-document scroll)
   |--[Tab / Space]------>|  (native focus and scroll)
```

*Describe each step in the sequence:*
1. **User/Frontend:** The visitor requests `/`. No client-side data fetch precedes or follows the response.
2. **API Gateway:** Not applicable — there is no API call in this use case. The request terminates at the Next.js route for `PAGE-001`.
3. **Backend Service:** The route imports the content modules and renders the document server-side. Band order, headings, and navigation are produced from `ENT-009`, `ENT-013`, `ENT-014`, `ENT-015` and `ENT-005`–`ENT-012`. Metadata is built from `ENT-001`. The one value not in the build is the repository's star count: it is read from the GitHub API once per revalidation window, and a failed read drops that figure from the strip instead of guessing (`FR-002.7`, `BR-002.3`).
4. **Database:** Not applicable. Modules are static, validated at build time (`data_model.md` §6). No query is issued.
5. **Response:** One complete HTML document containing every section's text before any JavaScript runs (`NFR-007.1`). Client JavaScript adds only the interactive islands: the window figure's workspace and tab controls, the waitlist form, the install option preselection and the copy control (`NFR-007.3`). The window figure's first pane is server-rendered, so the page is complete without script (`FR-002.3`).

## API Contract

### Endpoint

```
None — this use case makes no HTTP request.
```

The page is server-rendered and fully readable without JavaScript; the only outbound call is the star read described in step 3, which is non-fatal. What would otherwise be an API contract is a **component contract** for the shell and navigation, fixed here so implementation and tests agree.

### Component Contract — `SiteShell`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| — | — | — | `SiteShell` is a layout component. It takes `children` and renders the skip link, `NavBar`, `main`, and `Footer`. | Section order and `main` landmark are not configurable per page (`LAY-002`). |
| children | `ReactNode` | Yes | Page content placed inside the `main` landmark. | Exactly one `main` landmark per document. |

### Component Contract — `NavBar`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| items | `NavItem[]` | Yes | Navigation entries, pre-sorted by `order`. | The two anchors (`#capabilities`, `#install`) come from `items`; the GitHub link and the primary action are exported beside it (`navExternal`, `navPrimary`) and follow them (`FR-001.3`). |
| repositoryUrl | `string` | Yes | Repository destination resolved from `ENT-001`. | Absolute `https`; never a literal (`BR-001.3`). |
| onJumpToInstall | `() => void` | Yes | Scrolls to `SEC-006`, the install section owned by UC-003. | Does not navigate to another document and opens no dialog. |

Emitted events and state:

| Interaction | Result | Declared Behaviour |
|-------------|--------|--------------------|
| Click an `href="#sec-00N"` entry | In-document scroll to the matching `SEC-*` heading | The target heading carries `scroll-margin-block-start` equal to the navigation height so the heading clears the sticky bar (`LAY-005`, `NFR-006.5`) |
| Activate the first focusable element with `Tab` | Focus lands on the skip link, which is visible while focused | `NFR-007.2`, `design_system.md` §11 Accessibility Contract |
| Scroll past the hero | Navigation gains its hairline and background treatment | Opacity and colour only; no layout shift, no reflow (`MOT-001`) |
| Open at viewport width below `md` | Entries collapse behind a disclosure control | The control carries `aria-expanded`, focus moves into the opened panel, and returning focus goes back to the control (`NAV-007`) |

### Request Headers

Not applicable — no request is made.

### Request Payload

Not applicable.

### Response Payload (Success)

Not applicable at the HTTP level. The delivered artifact is one HTML document with this structure:

```html
<!-- PAGE-001 -->
<a href="#main">Skip to content</a>
<header>                     <!-- SEC-001 nav, 64px sticky -->
<main id="main">
  <section id="hero">        <!-- SEC-002: eyebrow, headline, command, meta line -->
  <section>                  <!-- SEC-011: at most four figures, no anchor -->
  <figure>                   <!-- SEC-012: FIG-001, the window mock -->
  <section id="capabilities"><!-- SEC-013: rows 01-05 -->
  <section id="waitlist">    <!-- SEC-007 -->
  <section id="install">     <!-- SEC-006 -->
</main>
<footer id="footer">         <!-- SEC-010 -->
```

`#agents`, `#features`, `#palettes`, `#faq` and `#community` are gone: their bands were removed in v1.2 and their ids stay retired (`F003`, `F006`, `F008`). `SEC-011` and `SEC-012` carry their own visually hidden headings (`stat-strip-heading`, `mock-heading`) so the outline stays intact.

### Status Codes

| Status | Meaning | Condition | Response Body |
|--------|---------|-----------|---------------|
| 200 | OK | The document rendered. | The full page. This is the expected outcome and the only success path. |
| 404 | Not Found | The visitor requested a path outside `PAGE-001`, `PAGE-002`, and the API route. | The `PAGE-003` catch-all, carrying `noindex` and a link back to `PAGE-001` (`IA URL-005`) |
| 500 | Internal Server Error | Rendering threw — in practice a content module that failed validation at build time. | Build-time failure means this cannot be reached in production; a schema error aborts deployment instead (`NFR-006.3`) |

No `400`, `401`, `403`, `405`, `409`, `422`, or `429` is reachable: the route accepts only `GET`, exposes nothing to authorise, and takes no input.

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Navigation entries | — (no request) | `ENT-009 NavItem.label`, `.href`, `.kind` | Rendered anchors and the action control | `kind = external` resolves its destination through `ENT-001` at render time |
| Logo and product name | — | `ENT-001 SiteConfig.siteName` | `<p>` in the bar and the footer heading | Same value in both places; no second literal |
| Hero headline, eyebrow, ribbon and sub-headline | — | the `hero` copy block of `ENT-001` (`src/content/site.ts`): `hero.headline`, `.headlineEmphasis`, `.eyebrow`, `.badge`, `.subheadline` | `<h1>` and the paragraph beneath it | The `<h1>` text is the marketing headline, not the document title verbatim; the emphasised phrase is a substring of `hero.headline` and is not stored twice |
| Band headings and capability rows | — | `ENT-013` rows, `ENT-003` count | The five numbered rows; the detected-runtime count in row 04 | Counts are derived from the module that owns the data, never typed as numerals in copy (`BR-002.2`) |
| `<head>` canonical and Open Graph URLs | — | `ENT-001 SiteConfig.siteUrl` | `link[rel=canonical]`, `og:url`, `og:image` absolute path | One source value; a missing value fails the build (`NFR-004.2`) |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| NavItem.href (kind = anchor) | Must equal `#` plus an existing `SEC-*` id | Build fails: `anchor target not found` | `BUILD_ANCHOR_UNRESOLVED` |
| NavItem.href (kind = external) | Must resolve through a `SiteConfig` field, never a literal | Build fails: `absolute URL literal in NavItem` | `BUILD_URL_LITERAL` |
| Band order | Must match the six bands then the footer: `SEC-002`, `SEC-011`, `SEC-012`, `SEC-013`, `SEC-007`, `SEC-006`, `SEC-010` | Build fails: `section order mismatch` | `BUILD_SECTION_ORDER` |
| Page headings | Exactly one `<h1>`; heading levels never skip | Lint failure: `heading level skipped` | `LINT_HEADING_ORDER` |
| NavItem list | The two anchors, then the external link, then the action | Build fails: `nav order mismatch` | `BUILD_NAV_ORDER` |
| Skip link | First focusable element; visible on focus | Lint failure: `skip link missing or not first` | `LINT_SKIP_LINK` |

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| JavaScript unavailable or blocked | N/A (no request) | Full document already delivered | Every section's text is readable; anchors scroll natively; the window figure renders its first workspace, tab and pane and the other controls leave the pane unchanged. The waitlist form degrades to a native post with an explanatory line (`NFR-007.3`, `NFR-008.1`) |
| Hash target missing or stale (visitor followed an old anchor) | 200 (document still served) | The document | The browser stays at the top instead of scrolling. No error is displayed; the visitor can still use the navigation. Verified by test `TC-F001-005` |
| Stale or mistyped path | 404 | `PAGE-003` catch-all | A short message, `noindex`, and a link back to `PAGE-001` (`IA URL-005`) |
| Content module fails validation | N/A | — | Deployment is aborted, so no visitor sees a partially rendered section (`NFR-006.3`). This is a build-time failure, not a runtime error page |
| Slow network, document still streaming | N/A | Progressive HTML | Text appears as it streams; no layout reservation depends on JavaScript, so no content shift occurs after first paint (`NFR-001.1`) |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_001.md` | This UCIC implements the flow defined there |
| Data Model | `docs/data_model.md` §3 — ENT-001, ENT-003, ENT-005, ENT-009, ENT-010, ENT-011, ENT-012, ENT-013, ENT-014, ENT-015 | This UCIC uses entities defined there; `ENT-002`, `ENT-004`, `ENT-006` and `ENT-007` are retired |
| SRS | `docs/srs.md` §3.1 F001, §3.2 F002, §6.1 NFR-001, §6.6 NFR-006, §6.7 NFR-007 | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §3 PAGE-001, §7 SEC-001, SEC-002, SEC-006, SEC-007, SEC-010, SEC-011, SEC-012, SEC-013 | Band ids, order, and copy budgets come from there |
| Design System | `docs/design_system.md` §8 LAY-002, LAY-005, §9.4 NAV-006 … NAV-008, §11 Accessibility Contract | Landmark, navigation height, and focus rules come from there |
