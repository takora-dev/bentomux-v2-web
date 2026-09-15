# UCIC: Open the Project Links and Star the Repository

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Draft | **Last Updated:** 2026-09-14

> **Band note (v1.2).** The community band (`SEC-009`, `#community`) and its four link cards were removed in the v1.2 rebuild; `SEC-009` stays retired and is never reused. This use case still exists — the destinations moved rather than disappeared:
>
> | Destination | Rendered at |
> |-------------|-------------|
> | Repository / star | Navigation bar (`SEC-001`, `FR-007.1`) and the stat strip's star figure (`SEC-011`, `FR-002.7`, `FR-007.2` retired) |
> | Repository, latest release, licence | Footer project group (`SEC-010`) |
> | Issues, discussions | Footer support group (`SEC-010`) |
> | Contact address | Footer legal block (`SEC-010`), as a `mailto:` |

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-006 |
| Name | Open the Project Links and Star the Repository |
| Actor | Evaluating engineer or prospective contributor (unauthenticated visitor, per `SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_006.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` | The navigation bar carries the repository link; the stat strip carries the star figure; the footer carries the project and support groups plus the contact `mailto:`. |
| PAGE-002 | `/privacy` | Second render site of the contact address and of the licence statement (`XPG-001`). No project links beyond those. |
| — | GitHub, mail client | External destinations. Not screens of this site; reached by leaving it. |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-001 SiteConfig | Owns every destination: `repositoryUrl`, `releasesLatestUrl`, `issuesUrl`, `discussionsUrl`, `contactEmail`, `licenseHref`. No component holds a URL of its own | Read |
| ENT-009 NavItem | The bar's anchors, plus the GitHub external entry (`navExternal`) | Read |
| ENT-015 StatFact | The star figure: `value`, the label `GitHub stars`, and the repository as its destination. Present only when a real count was read | Read (render-time read) |
| — (retired) | `ENT-007 CommunityLink` no longer exists (`data_model.md` §3) | — |

The footer's own link groups (`productLinks`, `projectLinks`, `supportLinks` in `src/content/chrome.ts`) are chrome rather than an entity: they are literal lists that resolve every destination through `ENT-001`, which is what makes `BR-007.1` checkable.

## Sequence Diagram

```
Visitor        StatStrip / SiteHeader / SiteFooter (RSC)   stats.ts + SiteConfig
   |                        |                                     |
   |--[GET /]-------------->|                                     |
   |                        |--[fetchStarCount(), revalidate 3600]->| github API
   |                        |<--[number | null]--------------------|
   |                        |--[resolve every href from ENT-001]-->|
   |<--[HTML: nav GitHub link, star figure (or none), footer groups, mailto]--|
   |                        |                                     |
   |--[activate a link]---->|  (leaves the site; no request to this origin)
   |--[activate mailto]---->|  (hands off to the mail client)
```

*Describe each step in the sequence:*
1. **User/Frontend:** The visitor reads the bar, the strip and the footer and activates one destination.
2. **API Gateway:** One outbound call exists on the page and this use case owns it: `GET https://api.github.com/repos/takora-dev/bentomux-v2` for `stargazers_count`. It is non-fatal (`NFR-004.4`) and cached for an hour (`FR-002.7`). No issue, contributor, fork, download or install count is ever read (`BR-007.3`).
3. **Backend Service:** `fetchStarCount()` returns a number or `null`; `statFacts()` prepends the star item only for a number. Every other destination is resolved from `ENT-001` at build time, so a link to a destination with no configured value cannot render (`BR-007.1`).
4. **Database:** Not applicable.
5. **Response:** The navigation bar's GitHub entry, the stat strip with or without its star figure, and the footer's groups. Every external anchor carries `target="_blank"`, `rel="noopener noreferrer"` and the screen-reader suffix (opens in a new tab) (`FR-007.6`, `NFR-002.8`).

## API Contract

### Endpoint

```
GET https://api.github.com/repos/takora-dev/bentomux-v2
Accept: application/vnd.github+json
```

One request per revalidation window (3600 s), issued from the server, never from the browser. No token, no pagination, no other GitHub endpoint.

### Request Headers

| Header | Value | Why |
|--------|-------|-----|
| `accept` | `application/vnd.github+json` | Pins the response shape to GitHub's versioned JSON media type |

### Request Payload

Not applicable — `GET`.

### Response Payload (Success, used fields)

```json
{ "stargazers_count": 42 }
```

Only `stargazers_count` is read. Nothing else in the response is stored, cached, or rendered.

### Response Payload (Failure)

No HTTP error is surfaced to the visitor, and none is possible: a non-2xx response, a rate limit, a network failure, a malformed body, or a non-finite value all resolve to `null`, which removes the figure.

```text
null  →  the star item is not rendered; the other three figures remain
```

### Delivered Structure

```html
<header>                              <!-- SEC-001 -->
  … <a href="{repositoryUrl}" target="_blank" rel="noopener noreferrer">GitHub<span class="sr-only"> (opens in a new tab)</span></a>
</header>
<section>                             <!-- SEC-011, stat strip -->
  <a href="{repositoryUrl}" …>42<span>GitHub stars</span></a>   <!-- only when the read succeeded -->
  <a href="#capabilities">21 agent CLIs detected</a>
  <a href="#install">3 platforms · macOS, Linux, Windows</a>
  <a href="{licenseHref}">MIT open source license</a>
</section>
<footer id="footer">                  <!-- SEC-010 -->
  … Repository · Latest release · License (MIT)      <!-- project group -->
  … Report a bug · Ask a question                    <!-- support group -->
  … <a href="mailto:{contactEmail}">Email Bentomux</a>  <!-- legal block, only when configured -->
</footer>
```

No issue count, contributor count, fork count, download count or "used by" figure appears anywhere.

### Status Codes

| Status | Meaning | Condition | Response Body |
|--------|---------|-----------|---------------|
| — | No HTTP exchange occurs with this origin | Entire use case | — |
| — | The upstream read is internal | See above: any failure becomes `null` | — |

If a destination has gone stale, the failure surfaces at GitHub or in the mail client, not as an error on this site. Destination liveness is a release-time content check (`BR-007.1`).

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Bar's GitHub entry | — | `ENT-009 NavItem` (`navExternal.href`) → `ENT-001 SiteConfig.repositoryUrl` | `href` | Resolution is one field deep; the item holds no URL |
| Star figure | `stargazers_count` | `ENT-015 StatFact.value` | The figure's big line | Formatted with `toLocaleString("en-US")`; never a literal, never `0` as a placeholder |
| Star figure label | — | `ENT-015 StatFact.label` | The line under the number | Exactly `GitHub stars`, so the count is never presented as anything else |
| Star figure destination | — | `ENT-015 StatFact.href` = `ENT-001.repositoryUrl` | `href` | Same destination as the bar, one source (`FR-007.1`) |
| Project group links | — | `src/content/chrome.ts` `projectLinks` → `ENT-001.repositoryUrl`, `.releasesLatestUrl`, `.licenseHref` | `href`s | The licence entry renders only while `licenseHref` is set (`BR-009.2`) |
| Support group links | — | `supportLinks` → `ENT-001.issuesUrl`, `.discussionsUrl` | `href`s | Bug reports and questions stay separate (`FR-007.3`, `FR-007.4`) |
| Contact link | — | `ENT-001.contactEmail` (nullable) | `mailto:` `href` in the legal block | Rendered only when `NEXT_PUBLIC_CONTACT_EMAIL` is set; the address is never printed as text (`BR-007.4`) |
| External marker | — | — | `target`, `rel`, and the suffix (opens in a new tab) | `FR-007.6`, `NFR-002.8` |
| Star count slot when the read fails | — | `statFacts(null)` | Not rendered | The cell is dropped, never zeroed (`BR-002.3`, `BR-007.3`) |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| Star value | Must be a finite number from the API, or the item is omitted | Runtime: `null` → item dropped | `DATA_STAR_UNAVAILABLE` |
| Star formatting | Rendered through `toLocaleString`, never a hand-written numeral | Build fails: no literal star value exists in the module graph | `BUILD_STAR_LITERAL` |
| Static facts | Exactly the three derived figures ship in the module | Build fails: `[content] staticFacts must have exactly 3 entries, found N` | `BUILD_STAT_COUNT` |
| Footer link ids | No duplicate `id` within a group | Build fails: `[content] footer.project.links contains a duplicate key "<id>"` | `BUILD_FOOTER_LINK_DUPLICATE` |
| Destination ownership | Every outbound `href` must resolve through a `SiteConfig` field | Build fails: `absolute URL literal in NavItem` / unresolved destination | `BUILD_URL_LITERAL` |
| Contact link | Must be a `mailto:`; absent when no address is configured; no `<form>` anywhere | Test: `href` starts with `mailto:`; no `<form>` in `SEC-010` | `UI_CONTACT_FORM` |
| Counts | No issue, contributor, fork, download or install count may appear, and no star figure other than the one read | Test `TC-F007-002`: a pattern scan finds no banned count; `GitHub stars` is the only permitted label | `CONTENT_LINK_COUNT_CLAIM` |
| External links | Must carry `target="_blank"` and `rel="noopener noreferrer"`, and announce the new context | Lint failure: `missing rel on external link` | `LINT_REL_MISSING` |
| Star read | Must not block the render and must not throw | Test: an offline build still renders the page with three figures | `NFR-004.4` |

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| GitHub unreachable, rate-limited, or the repository renamed | N/A | — | `fetchStarCount()` returns `null`; the strip renders three figures instead of four and the rest of the page is unaffected (`FR-002.7`, `BR-002.3`) |
| Destination removed or renamed upstream | N/A (external) | — | The visitor lands on GitHub's own not-found page. Verified at release as part of `BR-007.1`; a stale destination is a content defect caught by review, not a runtime error |
| JavaScript unavailable | N/A | Server-rendered markup | Every link and the figures it renders are plain anchors in the HTML; the strip's star figure is server-rendered from the same read (`NFR-007.1`) |
| No contact address configured | N/A | — | The legal block renders without the contact link rather than printing a placeholder (`BR-007.4`) |
| Visitor on a device without a mail client | N/A | — | The `mailto:` activation may do nothing. No alternative channel is claimed |
| Popup blocker interferes with the new tab | N/A (external) | — | Since every destination is a genuine anchor rather than a scripted window open, no popup blocker applies |
| Star count asked to be hidden in a later revision | N/A | — | Delete the `stars` branch of `statFacts()` and the read; the honest-numbers rule (`BR-002.3`) still holds without it |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_006.md` | This UCIC implements the flow defined there; the flow's own `SEC-009` references are being re-homed to the bar, the strip and the footer |
| Data Model | `docs/data_model.md` §3 ENT-001, ENT-009, ENT-015, ENT-013 (row 04's figure shares the roster with the strip); §4 destination resolution; §5 Business Rules | This UCIC uses entities and the one-field destination resolution defined there. `ENT-007` is retired |
| SRS | `docs/srs.md` §3.7 F007 (incl. `BR-007.1`–`BR-007.4`), §3.2 `FR-002.7`/`BR-002.3`, §6.4 NFR-004.4, §6.2 NFR-002.8 | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §7 SEC-001, SEC-010, SEC-011, `FOWN-001` | Link placement, destination ownership, and the three render sites of the repository link come from there |
| Design System | `docs/design_system.md` §9.14 Site footer, §9.8 Stat strip (`STAT-001`–`STAT-003`), §9.2 Inline link, §4.4 CLR-003 | Footer group anatomy, figure anatomy, external-link marking, and colour-independence come from there |
