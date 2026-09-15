# User Flow: Open the Project Links and Star the Repository

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Draft | **Last Updated:** 2026-09-15

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-006 |
| Name | Open the Project Links and Star the Repository |
| Actor | Evaluating engineer or prospective contributor (unauthenticated visitor, per `SRS §2.3`) |
| Goal | Reach the source repository, or the right channel for a bug, a question, or a private message |
| Trigger | The visitor activates a repository link in the navigation bar, the star cell in the stat strip, or one of the footer's **Project** and **Support** links |
| Preconditions | The site is deployed. `SiteConfig` contains the repository URL, the releases URL, the issues URL, the discussions URL, the licence URL, and the contact address. No account on the site itself is required; an account on the destination may be required to contribute. |

## Main Flow

*The "happy path" — the most common, successful scenario.*

1. Visitor reaches `SEC-010` → sees three groups: **Project** (Repository, Latest release, License (MIT)), **Support** (Report a bug, Ask a question), and **Product** (Capabilities, Install), with the legal block beneath them (`FR-007.1`).
2. Visitor reads the groups → every destination is one named link, so the visitor picks the correct channel rather than the nearest one.
3. Visitor activates **Report a bug** → the issues page opens in a new browsing context and the link's accessible name announces that (`SRS FR-007.6`).
4. The originating page remains where it was → the visitor can return to it without loss of position.
5. On the destination, the visitor files an issue with the repository's issue template → the report reaches the maintainers through the channel the repository already provides for it.
6. **Goal achieved:** The visitor has delivered their bug report, question, or star to the correct destination, and the site has not become a second, incomplete support channel.

## Alternative Flows

*Valid variations of the main flow that still lead to success.*

### Alt-1: Visitor wants to star the repository
**Trigger:** The visitor activates the star cell in the stat strip (`SEC-011`), or the **GitHub** link in the navigation bar.

1. The cell reads **GitHub stars** over the count read at render time, and links to the repository root (`BR-007.3`).
2. The repository page opens in a new browsing context.
3. GitHub's own authentication and star control handle the action.
4. **Outcome:** The site performs no client-side API call, holds no GitHub token, and shows the count it was told rather than a count it invented.

### Alt-2: Visitor has a question rather than a bug
**Trigger:** The visitor activates **Ask a question** in the **Support** group.

1. The repository's discussions area opens in a new browsing context.
2. The link's own name has already distinguished a question from a bug, so the visitor does not open an issue for a question.
3. **Outcome:** Questions and defects arrive in separate channels, each of which the maintainers already monitor.

### Alt-3: Visitor needs a private channel
**Trigger:** The visitor activates the footer's `Email Bentomux` link.

1. The visitor's mail client opens with the configured address (`BR-007.4`).
2. The legal block states that the project holds the address only for deletion requests and matters raised by mail, and points to the repository for anything public.
3. **Outcome:** Sensitive reports have a private path; public matters stay in public channels where others can find them.

### Alt-4: Navigation arrival
**Trigger:** The visitor activates the **GitHub** link in the navigation bar without having reached the footer.

1. The repository root opens in a new browsing context.
2. **Outcome:** The repository is reachable from the first viewport, not only from the footer (`FR-007.1`).

### Alt-5: Client-side JavaScript unavailable
**Trigger:** The visitor has JavaScript disabled.

1. Every external destination is already an anchor with a resolvable `href` in the server-rendered HTML; nothing depends on a scripted click handler.
2. The star count itself is part of the server-rendered HTML, because it is read before the page is rendered.
3. **Outcome:** Every link, and the figure on the star cell, work without JavaScript.

## Exception Flows

*Error conditions and failure scenarios.*

### Exc-1: A destination URL is unset or malformed
**Trigger:** One of the repository, releases, issues, discussions, licence, or contact values in `SiteConfig` is missing or is not an absolute URL.

1. Content validation fails the build (`SRS NFR-006.3`), or the affected link is not rendered at all — the licence links disappear entirely when `licenseHref` is unset (`BR-009.2`).
2. No anchor is emitted with an empty or relative `href`, which would otherwise resolve to a page on this site and produce a misleading 404.
3. **Outcome:** A broken destination surfaces as a build failure, not as a dead link in production.

### Exc-2: A destination does not resolve
**Trigger:** A configured URL is well formed but the destination returns an error or has been renamed.

1. The link opens a browser error page in a new tab.
2. The originating page is unaffected; its own content remains correct.
3. The outbound-link test case reports the failure so the configuration can be corrected (`BR-007.1`).
4. **Outcome:** Degradation is contained to the external destination.

### Exc-3: A new tab is opened without warning
**Trigger:** An external link opens in a new browsing context while leaving a screen reader without notice of the change.

1. This contradicts `SRS FR-007.6`, which requires the new-context behaviour to be conveyed.
2. Every external link carries the shared `opensInNewTab` suffix in addition to the visible marker, so the accessible name states the new context before activation (`CLR-003`).
3. **Outcome:** A screen-reader user is not silently moved to another page.

### Exc-4: The GitHub read fails
**Trigger:** The API read behind the star cell fails at build or revalidation time — offline build, rate limit, or a renamed repository.

1. `fetchStarCount()` returns `null` and the star cell is dropped from the strip; the repository is still linked from the navigation bar and the footer (`BR-007.3`, `NFR-004.4`).
2. A zero, a dash, or a stale cached count is never substituted.
3. **Outcome:** The failure is invisible to the visitor as an error and visible as an omission, which is the only honest rendering available.

### Exc-5: The external-link marker carries the only indication
**Trigger:** The new-context indication exists only as a decorative icon with no accessible equivalent.

1. This contradicts `CLR-003` and `SRS FR-007.6`.
2. The indication must exist as accessible text in addition to the icon.
3. **Outcome:** The behaviour is conveyed to users who do not perceive the icon.

## Postconditions

*What must be true after this use case completes (success or failure).*

- The visitor has been directed to the repository, its releases, its discussions, its issues, the licence file, or the contact address, whichever they chose.
- The site's only outbound metadata read is the GitHub star lookup, it happens on the server at render time, and its failure degrades the page by omission rather than by faking a figure (`SRS BR-007.3`, `NFR-004.4`).
- No issue, discussion, or star action was performed by the site itself; every action took place on the destination under the visitor's own account.
- The originating page retained its scroll position when the new context opened.
- No data was created or modified on this site; the flow is read-only.

## Related Pages

*Screens or pages involved in this use case. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Entry point and the only page on this site involved. `SEC-010` hosts the three destination groups and the legal block; `SEC-001` and `SEC-011` also link out. |
| PAGE-002 | Privacy policy | Not involved beyond the footer's `Privacy` route, which is linked from `SEC-010`. |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| `SiteConfig` | `src/content/site.ts` | Read | Supplies `repositoryUrl`, `releasesLatestUrl`, `issuesUrl`, `discussionsUrl`, `licenseHref` and `contactEmail`. All absolute external destinations live here and nowhere else (`IA FOWN-001`). |
| `StatFact` | `src/content/stats.ts` | Read | The star cell's count and repository destination, the platform cell's `#install` destination, the licence cell's destination (`ENT-015`). |
| `FooterGroup`, `FooterLink` | `src/content/chrome.ts` | Read | The three destination groups and the legal block. `productLinks` derives from `navItems`, so the footer cannot drift from the navigation bar. |
| `AgentRuntime` | `src/content/agents.ts` | Read | Not part of the link flow itself; row 04's counts are checked against the manifests and the adapter registry at content review (`FR-007.1`). |
| `WaitlistSubscriber` | — | None | Not used. |
| GitHub repository state | External | Read once per hour | Read on the server by `fetchStarCount()` with a one-hour revalidation window, so the visitor's browser never contacts `api.github.com`. A failed read drops the figure (`BR-007.3`, `NFR-004.4`). |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] The footer renders three destination groups: Project, Support and Product, plus the legal block
- [ ] Every footer and navigation destination is a resolvable absolute `href` in the server-rendered HTML
- [ ] The repository is linked from the navigation bar, the stat strip and the footer (`FR-007.1`)
- [ ] The star cell states `GitHub stars` over a count that came from the render-time read, and links to the repository root
- [ ] No install, download, contributor, fork, or user count is displayed anywhere on the page
- [ ] The page's HTML contains no request to `api.github.com` from the visitor's browser
- [ ] The Support group's bug link points to the repository's issue tracker and its question link to the discussions area
- [ ] The footer's email link is a `mailto:` link and is the only contact route; the waitlist form remains the site's only form (`SRS BR-007.4`)
- [ ] Every external link opens in a new browsing context and carries a perceptible indication of that fact
- [ ] The indication exists as text in the accessible name, not as an icon alone (`CLR-003`)
- [ ] Every external link carries `rel="noopener noreferrer"`
- [ ] With JavaScript disabled, every link and the star figure are still present
- [ ] Every configured external URL resolves successfully (`BR-007.1`)
- [ ] When the GitHub read fails, the star cell is absent and no substitute figure appears (`BR-007.3`)

## Traceability

*Link back to the SRS requirements this use case satisfies.* The community grid (`SEC-009`) was removed in v1.2; the destinations it held now live in the footer's **Project** and **Support** groups.

| Requirement ID | Requirement Description | How This Flow Satisfies It |
|----------------|------------------------|---------------------------|
| FR-007.1 | Repository linked from the navigation bar, the stat strip and the footer | Alt-4; Main flow step 1; AC 3 |
| FR-007.2 | **Retired (v1.2).** The separate star call to action was removed with the community band; the star is now reached through the stat strip's figure | Alt-1; AC 4 (`FR-002.7`) |
| FR-007.3 | Link to the repository's issues page for bug reports | Main flow step 3; AC 7 |
| FR-007.4 | Link to the repository's discussions page for questions | Alt-2; AC 7 |
| FR-007.5 | `mailto:` contact address for private enquiries | Alt-3; AC 8 |
| FR-007.6 | External links open in a new context and are marked so assistive technology announces it | Exc-3; AC 9, 10 |
| FR-007.7 | Outbound link targets defined in a typed configuration module | Data Used table; AC 2, 13; Exc-1, Exc-2 |
| BR-007.1 | Only destinations that resolve to a real page may be rendered | Exc-1, Exc-2; AC 13 |
| BR-007.2 | External links carry `rel` attributes preventing the destination from accessing the originating window | AC 11 |
| BR-007.3 | No fabricated or hard-coded star count; the only count shown comes from the render-time GitHub read, and the cell is dropped when it fails | Alt-1; Exc-4; AC 4, 5, 6, 14 |
| BR-007.4 | Contact address is a `mailto:` link; no contact form is in scope | Alt-3; AC 8 |
| BR-009.2 | The licence link renders only while the repository's LICENSE file exists | Exc-1 |
| CLR-003 | No indication conveyed by an icon alone | Exc-5; AC 10 |
| NFR-002.8 | External links carry `rel="noopener noreferrer"` | AC 11 |
| NFR-004.4 | Outbound metadata reads must be non-blocking and must never prevent rendering | Exc-4; Postconditions; AC 14 |
| NFR-006.1 | All link targets live in typed content modules | Data Used table; Exc-1 |
| NFR-006.3 | Unset or malformed URLs fail the build | Exc-1 |
| NFR-008.4 | Links and figures present in the server-rendered HTML | Alt-5; AC 12 |
| FR-009.1 | Footer carries the licence statement | Main flow step 1; Data Used table |
