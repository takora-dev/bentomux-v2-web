# User Flow: Browse the Landing Page

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Draft | **Last Updated:** 2026-09-15

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-001 |
| Name | Browse the Landing Page |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Goal | Decide within roughly thirty seconds whether Bentomux solves a problem they have, and learn whether it is released |
| Trigger | The visitor opens `https://bentomux.farrasjibran.dev` or arrives at an anchored section from an external link |
| Preconditions | The site is deployed and `NEXT_PUBLIC_SITE_URL` is configured (`SRS BR-001.3`). No account, cookie, or prior visit is required. Client-side JavaScript may be unavailable — the flow must still succeed (`SRS NFR-008.4`). |

## Main Flow

*The "happy path" — the most common, successful scenario.*

1. Visitor requests `/` → server returns fully rendered HTML containing the navigation bar, hero, stat strip, figure band, capability rows, waitlist band, install band, and the footer. No content depends on a client fetch or hydration (`SRS NFR-008.4`).
2. Visitor reads the hero → sees the eyebrow, the headline `Run every coding agent in one window`, the subheadline, the macOS install command with its copy control, the platform meta line, and the primary call to action. The hero carries no screenshot: the window itself is shown further down, as markup (`IA §3.2 SEC-002`).
3. Visitor forms a relevance judgement → either continues scrolling or leaves. The hero alone must be sufficient to answer "what is this" and "is it out yet" (`SRS NFR-007.1`).
4. Visitor scrolls → bands appear in the fixed order defined in `IA §3.1`: hero, stat strip, figure band, capability rows, waitlist, install, footer. The four anchor-able bands are `#hero`, `#capabilities`, `#waitlist` and `#install`.
5. Visitor optionally uses a navigation anchor → the page scrolls to the target band, and the band's heading comes to rest below the sticky navigation bar, not behind it (`SRS FR-001.5`).
6. Visitor reaches the figure band → sees three workspaces with their branches, the tab strip of the selected workspace, and the pane that tab is running: one workspace working, one blocked on the visitor, one idle. The sidebar lists workspaces only — the application has no agent panel, so the mock draws none, and the runtime a pane runs appears in that pane's tab label and title. Activating a workspace or a tab swaps the pane; the working line carries a spinner and a running timer. The band is presentational: it reads no data and writes nothing.
7. Visitor reads the stat strip and the five numbered capability rows → each figure states what it counts, and each row states one claim with an evidence panel illustrating it. Every claim is honest and traceable to the application repository at content review (`SRS FR-002.4`, `FR-002.6`).
8. Visitor reaches the footer → sees the license statement, the trademark disclaimer, the privacy policy link, and the project link groups.
9. **Goal achieved:** The visitor can state, without further research, what Bentomux is, which agents it works with, whether a build is available, what it costs, and where the repository lives.

## Alternative Flows

*Valid variations of the main flow that still lead to success.*

### Alt-1: Arrival on a mobile viewport
**Trigger:** The visitor opens the site on a phone, typically from a social link (`SRS BG-006`).

1. Server returns the same HTML → the layout collapses to a single column: navigation reduces to logo, primary action, and a menu control; the hero stacks its text above the install command; the figure band stacks its sidebar above the pane and its controls stay 44px tall.
2. Visitor taps the menu control → focus moves into the menu panel; anchors are presented as a vertical list.
3. Visitor selects an anchor → the page scrolls and the menu closes, returning focus to the menu control.
4. **Outcome:** Identical information and identical conversion paths, with no horizontal scrolling at 360px width (`SRS BR-001.5`).

### Alt-2: Entry at a deep anchor
**Trigger:** The visitor follows an external link such as `/#capabilities`, or a shared link to `/#install`.

1. Browser loads the page and jumps to the anchored band.
2. The band's heading renders below the sticky navigation bar because every anchored band carries scroll margin equal to the navigation height (`DS LAY-005`).
3. **Outcome:** The visitor lands directly on the relevant band with its heading legible, not obscured.

### Alt-3: Client-side JavaScript unavailable
**Trigger:** The visitor has JavaScript disabled, or the bundle fails to load.

1. Server-rendered HTML already contains every heading, claim, evidence panel, install command, and legal statement.
2. Anchor navigation works natively as browser fragment navigation.
3. Presentational state degrades to its stated default: the figure band renders its first workspace and its first tab with the spinner on its first frame and its timer at its initial value; tabs other than the first are not reachable because the band is not running.
4. The install band shows the macOS panel with its command as selectable text while the other two panels stay reachable through the option group.
5. **Outcome:** The visitor can read the whole page and reach the waitlist form, which submits as a standard form POST (`SRS FR-004.9`).

### Alt-4: Prefers reduced motion
**Trigger:** The visitor's operating system requests reduced motion.

1. All transition durations collapse to near zero (`DS MOT-003`).
2. Anchor navigation becomes an instant jump rather than a smooth scroll.
3. The figure band's spinner and running timer do not advance; the working line stays readable as static text (`DS MOT-004`).
4. **Outcome:** The visitor's preference is honoured; no content is lost or hidden.

## Exception Flows

*Error conditions and failure scenarios.*

### Exc-1: A content module is malformed
**Trigger:** An agent entry, a capability row, a mock workspace, or a site configuration value fails its schema or is missing a required field (`SRS NFR-006.3`).

1. The build fails during content validation, before deployment.
2. No partially populated page is published; the previously deployed build continues to serve.
3. **Outcome:** A content defect surfaces as a build failure with the offending entry named, never as a blank or half-empty band in production.

### Exc-2: The display webfont fails to load
**Trigger:** The Archivo font request fails or is blocked by the visitor's network.

1. Headings fall back to the system sans-serif stack declared after the display font in `--font-display`.
2. Metrics change slightly; no layout collapse, no clipped heading, no horizontal overflow.
3. **Outcome:** The page remains legible and correctly composed with reduced typographic character.

### Exc-3: The repository star count cannot be read
**Trigger:** The build-time read of the repository's star count fails, times out, or returns a value that is not a number.

1. The stat strip renders its three repository-owned figures and drops the star item entirely.
2. No zero, dash, or stale number is rendered in its place (`SRS BR-002.3`).
3. The build succeeds and the rest of the page is unaffected.
4. **Outcome:** The visitor never reads a figure the site cannot stand behind.

### Exc-4: The canonical URL is not configured
**Trigger:** `NEXT_PUBLIC_SITE_URL` is absent or malformed at build time.

1. The build fails rather than emitting a site with incorrect canonical and Open Graph URLs (`SRS NFR-004.2`).
2. **Outcome:** A misconfigured environment cannot produce a site that advertises the wrong canonical address.

## Postconditions

*What must be true after this use case completes (success or failure).*

- The visitor has been served the complete marketing page with all bands in the fixed order, and with no retired band present.
- No visitor data has been created, read, or modified. Browsing is entirely read-only (`SRS §7`).
- No cookie, local storage entry, or session record has been written by the site — including the figure band's selection, which is presentation state only.
- The page exposes correct canonical and Open Graph metadata derived from `NEXT_PUBLIC_SITE_URL`.
- The document outline contains exactly one `h1` and no skipped heading levels (`DS §11`).
- Every figure the page states is one the repository supports, or is omitted.

## Related Pages

*Screens or pages involved in this use case. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Entry point and the only page in the main flow |
| PAGE-002 | Privacy policy | Reachable destination from the footer's legal group |
| PAGE-003 | Not found | Rendered instead if the visitor requests an unknown path |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| `SiteConfig` | `src/content/site.ts` | Read | Canonical URL, repository URL, contact address, license statement, hero copy. Read by layout, metadata, and the hero (`IA FOWN-001`). |
| `AgentRuntime` | `src/content/agents.ts` | Read | Supplies the derived 21 / 9 counts rendered by capability row 04 and the stat strip. Never restated. |
| `CapabilityRow` | `src/content/caps.ts` | Read | Renders the five numbered capability rows in `SEC-013` with their evidence panels. |
| `MockWorkspace`, `MockTab`, `MockLine` | `src/content/mock.ts` | Read | Renders the figure band's window in `SEC-012`; the band holds no state beyond the current selection. |
| `StatFact` | `src/content/stats.ts` | Read | Renders the stat strip in `SEC-011`, including the star figure read from the repository at render time. |
| `InstallOption`, `InstallCommand`, `InstallerStep`, `ManualDownloadList` | install content module under `src/content/` | Read | Render the three operating-system panels in `SEC-006` with their verbatim commands, the three installer steps, and the manual-download line. |
| `WaitlistSubscriber` | — | None | Not touched. Browsing creates no record (`SRS §7`). |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] `/` renders the navigation bar, hero, stat strip, figure band, five capability rows, waitlist band, install band, and footer in the order fixed by `IA §3.1` (v1.2), and none of the retired bands
- [ ] The hero's install command and the waitlist action are both operable by keyboard and by pointer, with the waitlist action visually more prominent and no competing accent (`SRS BR-001.2`)
- [ ] Every navigation anchor scrolls to its target and the target heading is fully visible below the sticky navigation bar
- [ ] At 360px width the page has no horizontal scrollbar; at 1440×900 the hero's headline, subheadline and install command are above the fold
- [ ] The document outline contains exactly one `h1`, section headings are `h2`, and no heading level is skipped
- [ ] The page source contains a canonical link and Open Graph tags whose host matches `NEXT_PUBLIC_SITE_URL`
- [ ] With JavaScript disabled, every heading, claim, evidence panel, install command and legal statement is present in the HTML, and the figure band renders its first workspace
- [ ] Under `prefers-reduced-motion: reduce`, no transition exceeds a near-zero duration, no content is hidden, and the figure band's spinner and timer do not advance
- [ ] Every control in the figure band is a keyboard-reachable button, and the band announces itself as a group rather than as a tablist
- [ ] The footer renders the license statement, the trademark disclaimer, and a link to `/privacy`
- [ ] Each figure in the stat strip is stated with the label that says what it counts; the star item is absent, not zero, when the repository read fails
- [ ] Browsing writes no cookie and no local storage entry, and the figure band's selection does not survive a reload

## Traceability

*Link back to the SRS requirements this use case satisfies.*

| Requirement ID | Requirement Description | How This Flow Satisfies It |
|----------------|------------------------|---------------------------|
| FR-001.1 | Hero renders first with name, headline, subheadline, two CTAs | Main flow step 2 |
| FR-001.2 | Primary action precedes secondary in DOM and prominence | Main flow step 2; AC 2 |
| FR-001.3 | Navigation contains logo, its anchors, the repository link, and the primary action | Main flow step 1; `IA §4.1` |
| FR-001.4 | Navigation is sticky and collapses below `md` | Alt-1; `DS §9.4` |
| FR-001.5 | Anchors scroll with heading clear of the navigation bar | Main flow step 5; Alt-2; `DS LAY-005` |
| FR-001.6 | Footer carries navigation, repository, license, privacy | Main flow step 8 |
| FR-001.7 | Hero must not carry a product screenshot; the page's product image is the markup window figure | Main flow step 2; AC 6 (`FR-002.2`) |
| FR-001.8 | Head exposes title, description, canonical, Open Graph, Twitter | Postconditions; AC 6 |
| FR-001.9 | Hero states the core promise without scrolling | Main flow step 3 |
| FR-002.1 | Five numbered capability rows (`SEC-013`) in ordinal order, covering workspaces, agent state, approvals, runtimes and the remote monitor | Main flow step 7; `IA §7 SEC-013` |
| FR-002.2 | The application window figure (`SEC-012`, `FIG-001`) between the stat strip and the capability rows, inside a `figure` with a visible heading and a caption | Main flow step 6; AC 6 |
| FR-002.3 | The figure is operable by pointer and keyboard, exposes its selection, and renders its first pane in the server HTML | Alt-3; AC 8 |
| FR-002.4 | Each row carries an ordinal, a heading, a description and an evidence panel; the band heading is visually hidden | Main flow step 7; AC 5 |
| FR-002.5 | Capability content sourced from a typed content module | Data Used table |
| FR-002.6 | Claims limited to behaviour present in the repository | Main flow step 7 |
| FR-002.7 | Stat strip renders the detected agent count, the platform count, the licence, and the render-time star count | Main flow step 7; Exc-3 |
| FR-002.8 | Each strip figure names its destination and links to it | Main flow step 7 |
| FR-002.9 | Correct heading outline, no skipped levels | AC 5 |
| FR-002.10 | The figure's animation is inert in the server HTML, starts after hydration, and stops under reduced motion | Alt-4; AC 8 |
| FR-002.11 | The figure's agent names and states resolve from the agent roster module, and it states no count of its own | Main flow step 6; AC 8 |
| BR-001.1 | Hero headline is the largest type | Main flow step 2; `DS §5.2` |
| BR-001.2 | One dominant accent colour for all primary actions; no competing accent on a call to action | Main flow step 2; `DS CLR-001` |
| BR-001.3 | All absolute URLs derive from one constant | Exc-4; Postconditions |
| BR-001.4 | Navigation bar is translucent with a backdrop blur so the section beneath stays partly visible | Alt-1; `DS NAV-006` |
| BR-001.5 | No horizontal overflow 360px–2560px | Alt-1; AC 4 |
| BR-001.6 | Focus is never trapped or lost when the mobile menu opens and closes | Alt-1 |
| BR-001.7 | No Herdr copy or assets reproduced | Main flow step 7 (`DS §1` provenance) |
| BR-002.1 | A capability may only be advertised if it exists in the repository as of the last content review, and the row prints no path | Main flow step 7 |
| BR-002.2 | Every figure comes from the module that owns the data rather than being retyped in prose; a count typed back into copy fails the build | Exc-3; Data Used table |
| BR-002.3 | No band shows a figure the project cannot stand behind; the star count is omitted rather than zeroed, and no install, download, contributor, fork or user count appears | Main flow step 9; Exc-3 |
| NFR-001.1 | LCP under 2.5s on simulated 4G mid-tier mobile | Main flow step 1 |
| NFR-001.2 | CLS under 0.1 — the figure band's frame is fixed, so its controls never resize the page | Main flow step 6 |
| NFR-001.3 | Raster images served through image optimisation in AVIF or WebP at displayed size | Main flow step 2; the page ships no in-page raster — the figure band is markup, and the Open Graph card is the only generated image (`DS IMG-001`) |
| NFR-001.4 | First-load JavaScript under 120 KB compressed | Main flow step 1; Postconditions |
| NFR-001.5 | Initial HTML under 150 KB uncompressed | Main flow step 1 |
| NFR-001.6 | INP under 200ms for the install option group, the copy control, and the figure band's workspace and tab controls | Main flow step 6 |
| NFR-002.7 | Security headers set, including CSP limited to used origins | Postconditions |
| NFR-006.1 | All copy lives in typed content modules | Data Used table |
| NFR-006.3 | Malformed content fails the build | Exc-1 |
| NFR-006.4 | Presentational components receive data as props | `IA §2` component ownership |
| NFR-007.1 | Product identity and release status clear from the first viewport | Main flow steps 2–3 |
| NFR-007.2 | Every primary action reachable within one interaction from hero and footer | Main flow steps 2, 8 |
| NFR-007.6 | 44×44px touch targets below `md` | Alt-1; `DS BTN-002` |
| NFR-007.7 | Text contrast meets WCAG AA | `DS §4.4` verified pairs |
| NFR-007.9 | Usable at 320% zoom | `DS TYP-007` |
| NFR-006.6 | Every count, agent roster, capability row, stat fact and mock pane line has exactly one source | Data Used table; Exc-1 |
| NFR-007.12 | The figure's controls are buttons exposing their selected state, keyboard reachable, and optional | Alt-3; AC 8 |
| NFR-007.13 | The figure's animation is inert before hydration, stops under reduced motion, and never carries a fact alone | Alt-4; `DS MOT-004` |
| NFR-008.3 | Structured data identifies the product and the repository | Postconditions; AC 6 |
| NFR-008.4 | Primary content server-rendered and indexable | Alt-3; AC 7 |
| NFR-008.5 | Open Graph and Twitter card images at least 1200×630 | Postconditions; AC 6 |
| CON-002 | Static serverless deployment; no persistent in-memory state relied upon | Postconditions |
| CON-003 | Zero hosting cost — Vercel, Resend, and the existing domain only | Postconditions |
| CON-005 | Canonical URL is a single configuration constant | Exc-4 |
| CON-006 | Hosted on a subdomain of a personal domain; portable to an owned domain later | Exc-4 |
| CON-010 | Composition modeled on herdr.dev; only layout and scale are borrowed | `DS §1` provenance |
| CON-011 | No CMS; copy changes require a commit | Data Used table |
| LP-003 | Repository description and homepage URL set before launch | Postconditions |
| LP-005 | `NEXT_PUBLIC_SITE_URL` set in production | Preconditions; Exc-4 |
| CON-001 | Next.js only — no separate backend or database | Postconditions |
| NFR-004.2 | Missing canonical config fails the build | Exc-4 |
