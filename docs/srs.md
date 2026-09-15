# SRS: Bentomux Landing Page

**Document Version:** v1.4 | **Status:** Implemented — verified by `scripts/smoke.mjs` | **Last Updated:** 2026-09-15 | **Author:** F. Jibran (product owner)

> **This is SoT #1.** Every downstream artifact (IA, Design System, User Flows, Data Model, UCIC, tests) traces back to a requirement in this document. If a requirement changes, change it here first, re-validate, then propagate downstream.

---

## 1. Introduction

### 1.1 Purpose

This SRS defines the software requirements for the **Bentomux marketing landing page** — a Next.js marketing site for the Bentomux desktop application. It guides:

- Implementation of the marketing site (Next.js App Router, deployed on Vercel)
- Generation of IA, Design System, User Flows, Data Model, and UCIC artifacts
- Derivation of test cases before implementation begins
- Scope control: what the site does and, more importantly, what it does not do

**Primary audience:** the developer implementing the site (with AI assistance), and the test author deriving test cases from the Sources of Truth.

**Explicit non-audience:** contributors to the Bentomux desktop app itself. This document governs the marketing site only.

### 1.2 Scope

**In Scope:**

- A single-page marketing site at `https://bentomux.farrasjibran.dev`
- Hero section with product positioning, the quick-start install command and its copy control
- Five numbered capability rows with their evidence panels
- An interactive application window figure, drawn in markup
- A stat strip of figures the repository owns
- Platform install section (macOS / Linux / Windows) presenting the maintainers' own install commands, verbatim, with a copy control and a JavaScript-free OS switcher
- One-line manual download link to the latest release, covering the five published artifact formats
- A version-pinned install example for visitors who must not track the latest release
- Waitlist email capture backed by Resend Contacts
- Footer with project links, license and attribution
- Privacy policy page (required because the site collects email addresses)
- 404 page
- SEO metadata, Open Graph tags, sitemap, robots.txt
- Accessibility to WCAG 2.1 AA on all interactive elements

**Out of Scope:**

- The Bentomux desktop application itself (Tauri 2 / Rust / vanilla TypeScript) — it exists at `../Bentomux-v2` and is **not** modified by this project
- Any authenticated surface: no login, no accounts, no dashboard, no admin UI
- Signing, notarization and auto-update of the desktop builds. The published builds are unsigned; the site states this and nothing more
- Hosting, mirroring or re-packaging release artifacts. GitHub Releases is the only distribution channel (`CON-004`)
- Package-manager distribution beyond the maintainers' own Homebrew cask, and that cask only once it resolves (`CON-015`, `FUT-010`)
- A documentation site (no `/docs` route; the footer links to the repository, its latest release, its issues and its discussions)
- Blog, changelog, pricing page, or careers page
- Payment, subscriptions, or billing of any kind
- A contact form (contact is handled through GitHub Issues, Discussions, and a `mailto:` link)
- A theme or palette preview of the application's eight palettes, and an FAQ band — both retired in the v1.2 rebuild (`F006`, `F008`)
- Native mobile apps
- A CMS — all copy lives in TypeScript content modules under version control
- Analytics beyond what the hosting platform provides by default

### 1.3 Stakeholders

| Stakeholder | Role | Involvement |
|-------------|------|-------------|
| F. Jibran (`farrasjibran.dev`) | Product owner, sole maintainer | Approves every Source of Truth; owns domain, Resend account, Vercel project, and the upstream Bentomux repo |
| Developer (with AI assistance) | Implementer | Implements from validated SoT only; may not invent requirements |
| Test author (with AI assistance) | QA | Derives test cases from User Flows + UCIC, not from code |
| Prospective user | Visitor | Evaluates the product, optionally joins the waitlist, stars the repo |
| Open-source community | Contributor / visitor | Evaluates licensing and contribution entry points |

### 1.4 Definitions

| Term | Definition |
|------|------------|
| **Bentomux** | The desktop application being marketed. Tauri 2 shell, Rust backend, vanilla TypeScript renderer. Version 0.1.0, unreleased. |
| **Landing page** | The marketing site described by this SRS. A separate codebase from Bentomux. |
| **Agent runtime** | A CLI coding agent that Bentomux can run inside a terminal pane (e.g. Claude Code, Codex, Cursor). Since v1.2 the roster has no band of its own: its counts render inside capability row 04 and the stat strip (`F003`). |
| **Detection manifest** | A TOML rule file (`resources/manifests/*.toml` in the Bentomux repo) declaring terminal-screen patterns used to derive an agent's live state (idle / working / blocked). |
| **Deep configuration** | An agent adapter in Bentomux that exposes Model, Memory, Skills, and MCP configuration surfaces. Distinct from detection-only support. |
| **Profile bridge** | Bentomux's hook bridge that intercepts agent permission prompts and routes them to the approval overlay. Unix domain socket on macOS/Linux, named pipe on Windows. |
| **Remote monitor** | Bentomux's optional HTTP/WebSocket server that mirrors panes and approvals to a browser on the local network, paired by QR code. |
| **Capability row** | One numbered claim in `SEC-013`, carrying the claim and an evidence panel that shows it rather than restating it. Five exist, `01` to `05`. |
| **Stat strip** | The band of at most four figures under the hero (`SEC-011`). It is the only place on the site where a number is displayed outside a sentence. |
| **Window figure** | The markup drawing of the application window (`SEC-012`, `FIG-001`, `ENT-014`). Deliberately not a screenshot: it is composed from the page's own elements, so it cannot go stale or misrepresent the application's chrome. |
| **Retired (v1.2)** | A band or requirement removed on 2026-09-14 when the landing page was rebuilt to the herdr.dev structure. The identifier is kept and never reused. |
| **Honest-numbers rule** | `BR-002.3`: the page states only figures the project can stand behind. A count is either derived from repository data or read at render time, and a read that fails removes the figure rather than filling the gap. |
| **Waitlist subscriber** | A person who submitted an email address through the landing page waitlist form. |
| **Resend Contact** | A record in Resend's global Contacts store. The system of record for waitlist subscribers. |
| **Install command** | One command string shown in an OS panel of `SEC-006`. It is quoted verbatim from the application repository's installer scripts or its README, never composed on the site. |
| **Release manifest** | The `latest.json` file published by the application repository's build workflow on each tagged release. It maps each platform target to an artifact URL and its SHA-256 digest. The installer scripts read it; the site never fetches it. |
| **Verbatim command** | A command whose rendered characters are identical to the string in `../Bentomux-v2/installers/*` or `../Bentomux-v2/README.md`. Rewording, reformatting or re-wrapping a verbatim command is a defect (`BR-005.1`). |
| **SoT** | Source of Truth — a validated artifact that authorizes downstream work. |
| **Visitor** | An unauthenticated person browsing the landing page. |

### 1.5 References

| Reference | Location | Role |
|-----------|----------|------|
| Bentomux desktop app | `../Bentomux-v2` (GitHub: `takora-dev/bentomux-v2`) | Subject of the marketing site; source of all product facts and the logo |
| Bentomux installer scripts | `../Bentomux-v2/installers/install.sh`, `install.ps1`, `install.cmd` | Authoritative source of every install command quoted on the site (`CON-014`) |
| Bentomux release manifest | `../Bentomux-v2/scripts/release-manifest.mjs` | Authoritative definition of the `latest.json` schema and its platform targets |
| Bentomux README | `../Bentomux-v2/README.md` | Feature list, tagline, positioning language |
| Bentomux agent manifests | `../Bentomux-v2/resources/manifests/*.toml` | Authoritative agent detection count (21) |
| Bentomux agent adapters | `../Bentomux-v2/src-tauri/src/agents/index.rs` | Authoritative deep-configuration list (9) |
| Bentomux design tokens | `../Bentomux-v2/src/styles.css` | Product's own palette and theme tokens |
| Herdr | `https://herdr.dev` / `github.com/herdrdev/herdr` | Visual composition reference for the landing page; upstream source of ported detection code (see `CON-007`). The v1.2 rebuild follows its band order: navigation, hero with the install command, stat strip, window figure, numbered capability rows, waitlist, install close, footer. |
| GitHub REST API, `stargazers_count` | `https://api.github.com/repos/takora-dev/bentomux-v2` | The one external value the page reads at render time (`ENT-015`, `FR-002.7`) |
| Herdr-derived design extract | `DESIGN.md` (repo root) | Layout, typography and palette reference for the Design System |
| Chain of Truth workflow | `docs/` in this repo | Artifact chain this SRS anchors |

---

## 2. Product Overview

### 2.1 Product Summary

The landing page is a single-purpose marketing site for **Bentomux**, a calm desktop application for running multiple AI coding agents at once. It must communicate, within seconds of arrival, that Bentomux gives software engineers one native window for project workspaces, persistent split-pane terminals, live agent state, approval handling, and remote monitoring — instead of a scattering of terminal tabs and editor windows. Its job is not to sell a subscription (Bentomux is free and open source) but to **convert interest into three measurable actions**: join the waitlist, star the repository, and return when the first release ships.

The page is one scrolling column of bands: the hero with its install command, a stat strip, the drawn window of `FIG-001`, five numbered capability rows, the waitlist, and the install close. Everything a visitor is asked to believe is either stated in a sentence or shown, and every claim names the repository artifact behind it.

The site is static-first: all content is compiled into the Next.js bundle. The only server-side behavior is a single waitlist endpoint that forwards an email address to Resend, plus one cached read of the repository's star count. There is no database, no user account, and no authenticated area.

### 2.2 Business Goals

| ID | Goal | Measure |
|----|------|---------|
| BG-001 | Establish a credible public home for Bentomux | Site live at `https://bentomux.farrasjibran.dev`, all sections rendering, zero broken outbound links |
| BG-002 | Prove demand before the first public release | ≥ 50 waitlist subscribers within 30 days of launch, and install commands used successfully by at least one visitor per platform |
| BG-003 | Drive repository visibility | Repository star count grows from baseline 4 to ≥ 25 within 30 days |
| BG-004 | Attract contributors | Repository README gains a "Contributing" entry point; Issues/Discussions reachable from the site footer |
| BG-005 | Satisfy licensing obligations of the upstream project | License and attribution present on the site and in the repository before public launch (`CON-007`) |
| BG-006 | Convert mobile visitors without compromising desktop-first composition | Layout usable at 360px width with no horizontal overflow |

### 2.3 User Types / Roles

| Role | Description | Goals |
|------|-------------|-------|
| **Evaluating engineer** | A software engineer who currently runs one or more CLI coding agents and feels friction from juggling terminals, editors, and permission prompts. Arrives from social media, a search result, or word of mouth. | Decide within ~30 seconds whether Bentomux solves a problem they have; see proof (the window figure, the install command, the supported agents) |
| **Pre-release enthusiast** | An engineer who is convinced and wants the app, but the app is not released. | Get notified on release; not be asked to sign up for marketing spam |
| **OSS evaluator** | An engineer assessing whether to depend on, contribute to, or fork the project. | Find the repository, read the license, understand attribution and governance |
| **Mobile visitor** | Any of the above, on a phone, often arriving from a social link. | Confirm relevance quickly; join the waitlist without pinch-zooming |
| **Site maintainer** | The product owner. Not a site user — the operator. | Update copy and links without touching layout code; read the waitlist; know when the site is broken |

### 2.4 Operating Environment

- **Frontend framework:** Next.js (App Router), React Server Components by default, TypeScript strict mode
- **Styling:** Tailwind CSS with the Design System tokens defined in `docs/design_system.md`
- **Runtime:** Node.js 20+ (Vercel-managed)
- **Database:** None. The waitlist system of record is Resend Contacts (third-party SaaS)
- **Deployment:** Vercel, deployed from the Git repository, production domain `bentomux.farrasjibran.dev`
- **DNS:** CNAME `bentomux` → `cname.vercel-dns.com` on the `farrasjibran.dev` zone
- **Email sending:** Resend, from a verified sending subdomain (`send.farrasjibran.dev`), used for waitlist confirmation/launch broadcasts
- **Release distribution:** GitHub Releases. The build workflow publishes platform artifacts plus a `latest.json` manifest on every tagged release; nothing is hosted by this project (`CON-004`)
- **Browser support:** The two most recent stable versions of Chrome, Edge, Firefox, Safari; iOS Safari 16+; Chrome for Android (last two versions)
- **Mobile support:** Responsive web only. No native mobile app, no PWA install prompt
- **JavaScript:** All primary content must render without client-side JavaScript. This includes every install command and every OS panel of `SEC-006`: the switcher is a native single-select control whose panels are shown by CSS, not by script (`FR-005.1`, `FR-005.13`), and the window figure's first pane is server-rendered (`FR-002.3`). Script only enhances (window figure interaction, OS preselection, copy controls, waitlist form)

### 2.5 Assumptions

| ID | Assumption |
|----|------------|
| AS-001 | The Bentomux desktop app publishes unsigned, unnotarized builds through GitHub Releases, and the repository already carries its installer scripts on `master`. The site may therefore link to real install paths, but must disclose the unsigned state (`FR-005.8`). |
| AS-002 | The product owner controls the `farrasjibran.dev` DNS zone and can add records without third-party approval. |
| AS-003 | A Resend account with API access is available and a sending subdomain can be verified. |
| AS-004 | The 21 detection manifests and 9 agent adapters in the Bentomux repository are stable enough to be quoted as marketing facts. Any change invalidates `BR-003.1` and `BR-003.2`. |
| AS-005 | Expected first-year traffic is below 50,000 visits, which Vercel's free tier and Resend's free tier absorb. No caching layer beyond Next.js defaults is required. |
| AS-006 | The site is read-only for visitors. There is no user-generated content, therefore no content moderation requirement. |
| AS-007 | `assets/bentomux.png` and `assets/screenshot.png` in the Bentomux repository may be used as brand assets on the site. The marketing site no longer renders the screenshot; it is kept as a source asset only (`FR-001.7`). |
| AS-008 | Copy is written in English only. No localization in v1. |
| AS-009 | The eight palettes declared in `../Bentomux-v2/src/shared/types.ts` (`PaletteName`) are all user-facing and stable: `default`, `catppuccin`, `rose-pine`, `gruvbox`, `dracula`, `nord`, `classic`, `eink`. |

### 2.6 Constraints

| ID | Constraint | Consequence |
|----|-----------|-------------|
| CON-001 | **Next.js only.** No separate backend service, no database, no server framework. | Server behavior is limited to Next.js Route Handlers. Any feature requiring a datastore is out of scope. |
| CON-002 | **Deployed on Vercel.** | Route Handlers are serverless and stateless; in-memory state does not persist between invocations. |
| CON-003 | **Zero hosting cost target.** | Only Vercel free tier, Resend free tier, and the existing domain. No paid third-party services. |
| CON-004 | **Release artifacts are produced by the application repository's build workflow on tag push**, published as GitHub Releases assets plus a `latest.json` manifest. No release was published when this revision was written. | The site may link only to `releases/latest` and to the repository's own installer scripts. No other host or mirror may be referenced (`BR-005.2`). The first tagged release must publish the manifest and platform assets before launch (`LP-007`). |
| CON-005 | **Canonical URL is a single configuration constant.** | All absolute URLs derive from one environment variable so the site can move to an owned domain later without a refactor. |
| CON-006 | **`bentomux.farrasjibran.dev` is a subdomain of a personal domain.** | Apex redirect and cross-domain consolidation are out of scope; the site must be portable to a dedicated domain. |
| CON-007 | **The Bentomux application contains code ported from Herdr, which is licensed Apache-2.0** (`github.com/herdrdev/herdr`). Verified in `src-tauri/src/detect/manifests.rs` ("Rule strings for Claude Code are ported from herdr's bundled manifest (github.com/herdrdev/herdr)"), `src-tauri/src/detect/rules.rs` ("compact port of herdr's agent-detection idea"), and `src-tauri/src/bridge_config.rs` (`HERDR_ENV`, `HERDR_SOCKET_PATH`, `HERDR_PANE_ID`). | The Apache-2.0 attribution obligation survives whatever licence the project declares for its own code. Herdr must be credited as the upstream source of the ported detection work, and the repository must carry a `NOTICE` file before public launch (`LP-002`, `FR-009.8`). |
| CON-008 | **The Bentomux repository carries an MIT `LICENSE`** (commit `af49991`, tracked on `master`; 1066 bytes). | The licence the site states is **MIT**, and it is stated plainly rather than deferred (`BR-009.1`). Because the repository holds Apache-2.0-derived code, the MIT declaration is only complete once the `NOTICE` obligation of `CON-007` is discharged (`LP-002`). |
| CON-009 | **Agent runtimes are third-party trademarks.** | Names may be used descriptively to indicate compatibility, but must not imply endorsement, and the footer must carry a trademark disclaimer (`BR-009.4`). |
| CON-010 | **The visual composition is modeled on herdr.dev.** | Layout, spacing, typographic scale, and palette derive from `DESIGN.md`. Text, imagery, and branding must be Bentomux's own — no Herdr copy or assets may be reproduced (`BR-001.7`). |
| CON-011 | **No CMS.** | Copy changes require a code commit. Content lives in typed modules under `src/content/`. |
| CON-012 | **Rate limiting on a serverless function is best-effort.** | Limits are enforced per function instance and reset on cold start; the honeypot is the primary spam defence (`NFR-002.3`). |
| CON-013 | **The Bentomux repository README is stale relative to its own code.** It names 9 agent runtimes while 21 detection manifests exist, and it names six palettes while eight are declared in `src/shared/types.ts`. It also advertises a Homebrew cask that does not resolve (`CON-015`). | Product facts on the site must be sourced from code (`resources/manifests/*.toml`, `src-tauri/src/agents/index.rs`, `src/shared/types.ts`), never transcribed from the README. The README is a copy-writing reference only, and its install block is authoritative for command text only where it agrees with `installers/*` (`BR-005.1`). |
| CON-014 | **The installer scripts live in the application repository**, at `installers/install.sh` (macOS and Linux), `installers/install.ps1` and `installers/install.cmd` (Windows), and they resolve the release through the manifest named by `BENTOMUX_MANIFEST_URL`. | The site quotes these scripts; it never reimplements, re-hosts or wraps them. Every command on the page is a copy of a string that already exists in the repository (`BR-005.1`). |
| CON-015 | **No Homebrew cask is published.** The build workflow writes `bentomux.rb` into `takora-dev/homebrew-tap` only when `HOMEBREW_TAP_TOKEN` is configured, and `brew info --cask takora-dev/tap/bentomux` currently fails with "Cask 'takora-dev/tap/bentomux' is unavailable. This command requires the tap takora-dev/tap." | The Homebrew line must not appear on the site while the cask does not resolve (`BR-005.6`, `FUT-010`), even though the repository README still advertises it. |

---

## 3. System Features

### 3.1 F001: Page Shell, Hero and Navigation (Priority: High)

**Description:** The structural frame of the site: document head, navigation bar, hero section, global footer, and the section container primitives every other feature renders into. The hero carries the product positioning statement and the two primary calls to action.

**Functional Requirements:**

- FR-001.1: The root route `/` must render a hero section (`SEC-002`) as the first viewport-filling band, containing the eyebrow label, the positioning headline, a supporting subheadline, a pre-release ribbon linking to `#install`, and the quick-start install command of `FR-005.14`.
- FR-001.2: The hero must present the quick-start install command and its copy control as the primary action, with the waitlist hook adjacent and the link into the install section as the secondary path.
- FR-001.3: The navigation bar must contain the Bentomux logo, anchor links to `#capabilities` and `#install`, a link to the repository, and a primary call to action pointing at `#waitlist`.
- FR-001.4: The navigation bar must be sticky, must remain legible over every section it scrolls across, and must collapse its anchor links into a menu control below the `md` breakpoint.
- FR-001.5: Every anchor link must scroll to its target section with the section heading clear of the sticky navigation bar.
- FR-001.6: The footer must contain: the logo, the repository link, navigation anchors, the license statement, the Herdr attribution, the trademark disclaimer, and a privacy policy link.
- FR-001.7: The hero must not carry a product screenshot; the page's image of the product is the markup window figure specified in `F002` (`FR-002.2`). The logo from `assets/bentomux.png` appears in the navigation and footer.
- FR-001.8: The document head must expose a unique title, meta description, canonical URL, Open Graph title/description/image, Twitter card metadata, and a PNG favicon with an Apple touch icon.
- FR-001.9: The hero must state the product's core promise without requiring the visitor to scroll.

**Business Rules:**

- BR-001.1: The hero headline must be the largest type on the page (Design System `text-display`).
- BR-001.2: The site must use exactly one dominant accent colour for all primary actions: the Bentomux blue `--color-accent` (`#4c8ef9`) that the Design System fixes. No competing accent may appear on a call to action, and the site ships no light/dark appearance or theme control (`OQ-009`).
- BR-001.3: All absolute URLs (canonical, Open Graph, sitemap) must derive from a single configuration value read from `NEXT_PUBLIC_SITE_URL` (`CON-005`).
- BR-001.4: The navigation bar must be translucent with a backdrop blur so the underlying section remains partially visible while scrolling.
- BR-001.5: No element may cause horizontal overflow at any viewport width from 360px to 2560px.
- BR-001.6: Focus must never be trapped or lost when the mobile menu opens and closes.
- BR-001.7: Marketing copy, imagery, and branding must be original to Bentomux. Herdr's text and assets must not be reproduced (`CON-010`).
- BR-001.8: The hero must state pre-release status, and the install band must restate it, so no surface implies a build is downloadable today (`BR-002.5`).

**Acceptance Criteria:**

- [ ] `/` renders the six bands in order — hero (`SEC-002`), stat strip (`SEC-011`), window figure (`SEC-012`), capability rows (`SEC-013`), waitlist (`SEC-007`), install (`SEC-006`) — then the footer (`SEC-010`), with the anchors `#hero`, `#capabilities`, `#waitlist`, `#install` and `#footer`, and the skip link targeting `#main`
- [ ] The hero install command and its copy control are operable by keyboard and pointer
- [ ] Anchored navigation scrolls to the correct section with the heading visible below the nav bar
- [ ] At 360px width the page has no horizontal scrollbar and the mobile menu opens and closes
- [ ] Page source contains a canonical link, Open Graph tags matching `NEXT_PUBLIC_SITE_URL`, and both icon links (`rel="icon"`, `rel="apple-touch-icon"`)
- [ ] The hero, the stat strip and the window figure's first pane render with client-side JavaScript disabled
- [ ] The page requests no raster product screenshot; the window figure is markup (`FR-001.7`)
- [ ] Footer contains the license statement, Herdr attribution, trademark disclaimer, and privacy link

### 3.2 F002: Capability Rows, Application Window and Stat Strip (Priority: High)

**Description:** The proof half of the page. A strip of figures the project can stand behind, an interactive window figure drawn in markup, and five numbered claims, each followed by the evidence panel that carries it.

**Functional Requirements:**

- FR-002.1: The site must render five numbered capability rows (`SEC-013`) in ordinal order 01 to 05, covering, at minimum: persistent workspaces and split-pane terminals; live agent state; the approval overlay and profile bridge; the breadth of supported agent runtimes; and the remote monitor.
- FR-002.2: The site must render an application window figure (`SEC-012`, `FIG-001`) between the stat strip and the capability rows, inside a `figure` element with a visible band heading above the frame and a caption below it. The frame carries a workspace list, a tab strip per workspace and a pane of terminal output; the workspace list is the whole sidebar, because the application has no agent panel (a runtime belongs to the tab that runs it).
- FR-002.3: The window figure must be operable with pointer and keyboard — selecting a workspace or a tab updates the pane shown, the control exposes whether it is selected, and the pane that renders before any interaction must be present in the server HTML.
- FR-002.4: Each capability row must present an ordinal, a heading, a plain-language description, and an evidence panel; the band's own heading is visually hidden because the rows are the band.
- FR-002.5: Capability content must be sourced from a typed content module so copy can be edited without touching layout code (`CON-011`).
- FR-002.6: Every capability claim must be limited to behavior present in the Bentomux repository as of the site's last content review.
- FR-002.7: The stat strip (`SEC-011`) must render the figures the project can stand behind — the detected agent count, the number of platforms with an installer, and the project licence — plus the repository's star count read from the GitHub API at render time.
- FR-002.8: Each figure in the stat strip must name its destination (repository, capabilities, install, or licence file) and must be a link to it; the strip carries no figures beyond `FR-002.7`.
- FR-002.9: Each capability row and the window figure must preserve a correct document outline (no skipped heading levels).
- FR-002.10: The figure's animation — the spinner and the running timer — must be inert in the server-rendered HTML, must start only after hydration, and must not run when `prefers-reduced-motion: reduce` matches. No animation may carry information that is not also stated in text.
- FR-002.11: The tab labels and pane titles the figure shows must be resolved from the agent roster module, so the figure cannot name a runtime the roster lacks; the figure must state no count of its own.

**Business Rules:**

- BR-002.1: A capability may only be advertised if it exists in the Bentomux repository as of the site's last content review (`FR-002.6`). The row does not print the path it was checked against: the repository-evidence line was retired on 2026-09-15.
- BR-002.2: A figure shown in any band must come from the module that owns the data rather than being retyped in prose: the agent counts render from the roster module (`src/content/agents.ts`), the platform count from the installer option list, and the licence name from the site config. A count typed back into copy where a module already owns it is a build failure, enforced by a content invariant.
- BR-002.3: No band may show a figure the project cannot stand behind. The star count is omitted entirely when the GitHub read fails, never zeroed or estimated, and the strip must hold no install, download, contributor, fork, or user count (`BR-007.3`).
- BR-002.4: Claims must describe user-visible outcomes, not implementation internals. The words Tauri and Rust must not appear as marketing prose.
- BR-002.5: No claim may imply availability the product does not have. Pre-release status must be stated in the hero or the install band, not buried.
- BR-002.6: The window figure is illustrative markup, not a running application: it must not promise live product data, and it must show no version number, model name, or measured figure that the repository does not state.

**Acceptance Criteria:**

- [ ] Five capability rows render in order, each with an ordinal, a heading and one claim paragraph, and no row prints a repository path
- [ ] Every advertised capability corresponds to behaviour present in the application repository
- [ ] The window figure renders between the stat strip and the capability rows, with its first pane present in the server HTML
- [ ] Selecting a workspace or a tab changes the pane without a page reload
- [ ] Three figures render in the strip when the GitHub read returns nothing, and four when it returns a count; the star cell is absent rather than zeroed on failure
- [ ] The strip's figures are the detected agent count (`21`, from the roster module), three platforms, the project licence, and — when read — the star count, each with a label naming what it counts
- [ ] Capability row 04 states both counts (`21 detected`, `9 also configurable`) and both come from the roster module
- [ ] No install, download, contributor, fork, issue or user count appears anywhere on the page
- [ ] With JavaScript disabled the figure renders its first pane and no animation runs
- [ ] Heading outline has no skipped levels (H1 → H2 → H3)

### 3.3 F003: Agent Runtime Showcase — **Retired** (v1.2, 2026-09-14)

Was a section of its own (`SEC-003`, `#agents`) listing all 21 detected runtimes and the 9 that also receive configuration. The band was removed in v1.2 because the page carried too many items, and `SEC-003` stays retired — the new bands are numbered `SEC-011` to `SEC-013` rather than reusing it. Its load-bearing content survives in two places, both in `F002`: the stat strip (`SEC-011`) carries the detected count as one of its figures, and capability row 04 states both counts in one line beside a panel of eight runtime chips.

So that no requirement is lost, the derivation rules stay in force and remain the source for every count the site prints:

- BR-003.1: The **detection** count is **21**, derived from the 21 TOML files in `../Bentomux-v2/resources/manifests/`: `amp`, `antigravity`, `claude`, `cline`, `codex`, `cursor`, `devin`, `droid`, `gemini`, `github-copilot`, `grok`, `hermes`, `kilo`, `kimi`, `kiro`, `maki`, `muse`, `opencode`, `pi`, `qodercli`, `qwen`.
- BR-003.2: The **deep configuration** list is **9 agents**, derived from the adapter registry in `../Bentomux-v2/src-tauri/src/agents/index.rs`: Claude Code, pi, Qwen CLI, OpenAI Codex, OpenCode, Gemini CLI, Cursor, Kilo Code, QwenPaw.
- BR-003.3: The site must not state or imply that all 21 agents receive configuration surfaces. Configurable agents must be presented as a subset, and the runtime panel must label that subset in text rather than by colour alone.
- BR-003.4: The wording is the two counts stated together and sourced from one module: `<N> are detected out of the box` in row 04's claim and `<N> detected · <M> also configurable` in its panel note, or an unambiguous equivalent. Both numbers are rendered from the roster module (`BR-002.2`), and no other spelling of either count may appear on the page (`NFR-006.6`).
- BR-003.5: Agent names must be used descriptively only. The footer trademark disclaimer (`BR-009.4`) must be present whenever agent names are displayed.
- BR-003.6: QwenPaw is configurable but has no detection manifest; it must appear in the configuration list and not in the detection list.
- BR-003.7: The runtime panel and both counts must remain readable below the `md` breakpoint without horizontal scrolling, and the panel must name eight detected runtimes as chips rather than all 21 — the counts, not the chips, carry the roster's size (was `FR-003.6`).

**Retired requirements:** `FR-003.1`–`FR-003.6` are withdrawn with the band, and their ids are not reused. The count (`FR-003.1`) is now `FR-002.7` and `BR-003.4`; the support-level distinction (`FR-003.3`, `FR-003.4`) is now `BR-003.3`; the typed-module source rule (`FR-003.5`) is now `BR-002.2`; the below-`md` readability rule (`FR-003.6`) is now `BR-003.7`. `FR-003.2` is narrowed rather than lost: the panel names eight detected runtimes, and the counts state the size of the rest.

### 3.4 F004: Waitlist Capture (Priority: High)

**Description:** An email capture form that registers a visitor's interest so they can be notified when Bentomux ships its first release. Submissions are stored as Resend Contacts and added to a waitlist topic.

**Functional Requirements:**

- FR-004.1: The site must render a waitlist form containing an email input, a submit control, and a consent statement explaining what the address will be used for.
- FR-004.2: Submitting a syntactically valid, previously unseen email address must create a Resend Contact and return a success state.
- FR-004.3: The success state must confirm that the address was registered and set the expectation of one email at release.
- FR-004.4: Validation errors must be displayed inline, associated with the input, and announced to assistive technology.
- FR-004.5: The submit control must be disabled while a submission is in flight and must not allow duplicate submissions from the same page session.
- FR-004.6: Submitting an email that already exists as a Contact must produce the same success state as a new signup, without revealing whether the address was already registered.
- FR-004.7: The form must include a honeypot field that is hidden from users and assistive technology but visible to naive bots.
- FR-004.8: Request failures must preserve the entered address and present a retry path.
- FR-004.9: The form must be operable and submittable without client-side JavaScript.

**Business Rules:**

- BR-004.1: Email addresses are validated by format and rejected if longer than 254 characters or if the local part exceeds 64 characters.
- BR-004.2: Consent text must state the purpose and must not pre-check any option.
- BR-004.3: Stored contacts must never be sold, shared, or used for anything other than release notification and product announcements.
- BR-004.4: The API key must never be exposed to the browser. All Resend calls occur server-side (`NFR-002.1`).
- BR-004.5: The response must not disclose existing-subscriber status, to prevent address enumeration.
- BR-004.6: A submission with a filled honeypot must be discarded, and the response must be indistinguishable from success, so bots receive no feedback signal.
- BR-004.7: Double opt-in confirmation is deliberately deferred (`FUT-002`). A single explicit consent statement is required in its place.

**Acceptance Criteria:**

- [ ] A valid new address creates a Resend Contact and the UI shows a success state
- [ ] An invalid address shows an inline error and no API call is made
- [ ] A duplicate address shows the same success state as a new address
- [ ] A submission with the honeypot populated creates no Contact and returns success
- [ ] With the API key absent, the endpoint returns a handled error and the UI offers retry without losing the typed address
- [ ] The browser network log contains no request to `api.resend.com`
- [ ] The form can be submitted with JavaScript disabled

### 3.5 F005: Install and Platform Availability (Priority: High)

**Description:** The install block for the desktop application. It presents the maintainers' own installer scripts for macOS, Linux and Windows behind a JavaScript-free OS switcher, one copy control per command, an explanation of what the installer does, a single manual-download line, and a version-pinned alternative. Every command quoted here already exists in the application repository.

**Functional Requirements:**

- FR-005.1: The section must present a single-select switcher with exactly three options: macOS, Linux and Windows, marked up as a native radio group.
- FR-005.2: Exactly one option must be selected in the server-rendered HTML. macOS must be the selected option whenever no platform information is available.
- FR-005.3: Each option must own a panel containing that platform's install command as selectable text.
- FR-005.4: The site may preselect the visitor's platform on the client. Detection must never override an explicit visitor selection, must not change any rendered text, and must not shift layout.
- FR-005.5: Every command block must offer a copy control. Copy success and copy failure must both be reported in text; after a failure the command must remain selectable.
- FR-005.6: All three panels must be present in the server-rendered HTML. Panel visibility must be driven by the selected input through CSS, not by script.
- FR-005.7: The Linux panel must present the AppImage install command, the `--deb` alternative marked as needing root, and the libfuse2 note.
- FR-005.8: The macOS panel must state that the build is unsigned and not notarized, and must give the first-launch path through System Settings → Privacy & Security.
- FR-005.9: The Windows panel must present the PowerShell command, the `install.cmd` fallback for environments that block PowerShell from the internet, and the statement that the per-user setup needs no administrator rights.
- FR-005.10: The section must state what the installer does: read the release manifest, verify the download against its SHA-256 digest, then install.
- FR-005.11: The section must offer one manual download line naming the five published artifact formats — `.dmg`, `.AppImage`, `.deb`, `.msi` and `-setup.exe` — behind a single link to the latest release.
- FR-005.12: The section must offer a version-pinned install example that overrides the release manifest through the `BENTOMUX_MANIFEST_URL` environment variable, showing the version as the placeholder `vX.Y.Z`.
- FR-005.13: The section must state that Linux builds are published for x86_64 only and that no aarch64 Linux build exists yet.
- FR-005.14: The hero must quote one install command — the macOS command — by identifier from the same content module the panels read, so the quick start and the macOS panel cannot quote different scripts. The hero command carries a copy control and a one-line note naming what it installs.

**Business Rules:**

- BR-005.1: Every command rendered in the section must be byte-identical to its source in `../Bentomux-v2/installers/*` or `../Bentomux-v2/README.md`. The pin example of `FR-005.12` is the only composed command permitted, and its manifest URL must match the installer's own default with `/latest/download/` replaced by `/download/vX.Y.Z/`. The hero's quick-start command of `FR-005.14` is the same string as the macOS panel's install command, resolved by identifier rather than retyped.
- BR-005.2: Only `github.com/takora-dev/bentomux-v2` and `raw.githubusercontent.com/takora-dev/bentomux-v2` may appear as command or download hosts. No mirror, CDN or third-party download page may be referenced.
- BR-005.3: The site must not advertise winget, Chocolatey, Scoop, apt, AUR, Nix, Flatpak, MacPorts or Docker as a channel for installing Bentomux. `apt` may appear only inside the libfuse2 note, where it installs a FUSE dependency rather than Bentomux itself.
- BR-005.4: No version number, release date or download size may appear in prose. The only version literal permitted anywhere in the section is the `vX.Y.Z` placeholder of `FR-005.12`.
- BR-005.5: `sudo` may appear only in the libfuse2 note. The `--deb` path must be described as needing root without prefixing the quoted command with `sudo`.
- BR-005.6: The Homebrew cask line must not be shown while `brew info --cask takora-dev/tap/bentomux` fails to resolve, however prominently the repository README advertises it (`CON-013`, `CON-015`, `FUT-010`).
- BR-005.7: Platform labels must name the operating system only. Architecture may be mentioned only as the Linux x86_64 limit of `FR-005.13`; no Apple Silicon or arm64 support may be stated or implied.
- BR-005.8: Changing the selected option must not navigate, must not issue a network request from the page, and must not persist the selection to cookies or any other storage.
- BR-005.9: When the installer scripts change, the section's command text changes in the same revision cycle. A divergence between the page and `installers/*` is a content defect, not a runtime failure (`BR-005.1`).

**Acceptance Criteria:**

- [ ] Three OS options render, and macOS is the one selected in the server-rendered HTML
- [ ] With JavaScript disabled all three panels are present and exactly one is visible
- [ ] Arrow keys move selection between the options, and the group occupies a single tab stop
- [ ] Every rendered command matches its repository source byte for byte
- [ ] The Linux panel shows the `--deb` alternative, its root requirement, and the libfuse2 note
- [ ] The macOS panel states the unsigned, unnotarized state and the first-launch path
- [ ] The Windows panel shows the PowerShell command and the `install.cmd` fallback
- [ ] The manual download line names five artifact formats and links only to the latest release
- [ ] The pin example uses `vX.Y.Z`, and no other version literal appears in the section
- [ ] No forbidden package manager is named as an install channel
- [ ] No Homebrew command appears anywhere in the section
- [ ] Copy controls report success and failure in text, not by colour alone
- [ ] The x86_64-only Linux statement is present
- [ ] The hero's quick-start command is character-identical to the macOS panel's install command (`FR-005.14`)

### 3.6 F006: FAQ — **Retired** (v1.2, 2026-09-14)

Was an accordion of eight question-and-answer pairs (`SEC-008`, `#faq`). The band was removed in v1.2; the page carried too many items and its answers belonged somewhere a visitor already looks. `FR-006.1`–`FR-006.7` and `BR-006.1`–`BR-006.5` are withdrawn. Their load-bearing answers now live in:

| Question it answered | Where the answer lives now |
|----------------------|---------------------------|
| Pricing and licensing | Footer licence statement (`FR-009.1`, `BR-009.1`) |
| Data handling, retention, deletion | `/privacy` (`FR-009.5`) and the waitlist consent line (`FR-004.1`) |
| Provenance and Herdr affiliation | Footer attribution and disclaimer (`FR-009.2`, `FR-009.3`, `BR-009.3`) |
| Are builds available yet | Hero ribbon and the install band's introduction (`BR-002.5`, `FR-005.1`) |
| Supported platforms and agents | Stat strip (`FR-002.7`) and capability row 04 (`BR-003.3`) |

No accordion exists anywhere on the page, and no requirement in this revision depends on one. `SEC-008` stays retired and is not reused.

### 3.7 F007: Project Links, Community and Repository Star (Priority: Medium)

**Description:** The outbound entry points to the open-source project: the repository, its issues and discussions pages, and a direct contact address. Was the band `SEC-009` (`#community`) until v1.2, when its four link cards were removed and the destinations moved into the navigation bar and footer.

**Functional Requirements:**

- FR-007.1: The site must link to the Bentomux repository from the navigation bar, the stat strip, and the footer.
- FR-007.2: **Retired (`v1.2`).** The separate star call to action was removed with the community band. The star is now reached through the stat strip's star figure, which links to the repository whenever it renders (`FR-002.7`); the navigation bar carries the repository link regardless.
- FR-007.3: The site must link to the repository's issues page for bug reports.
- FR-007.4: The site must link to the repository's discussions page for questions.
- FR-007.5: The site must provide a `mailto:` contact address for private enquiries.
- FR-007.6: All external links must open in a new browsing context and must be marked so assistive technology announces that behaviour.
- FR-007.7: Outbound link targets must be defined in a typed configuration module (`CON-005`, `CON-011`).

**Business Rules:**

- BR-007.1: Only link destinations that resolve to a real page may be rendered. A placeholder such as a documentation site or a social profile that does not exist must be omitted rather than linked.
- BR-007.2: External links must carry `rel` attributes preventing the destination from accessing the originating window.
- BR-007.3: The star call to action must not display a fabricated or hard-coded star count. The only count the site may show comes from the GitHub API read at render time, and the cell is dropped entirely rather than zeroed or estimated when that read fails (`BR-002.3`).
- BR-007.4: The contact address must be a `mailto:` link. No contact form is in scope.

**Acceptance Criteria:**

- [ ] Repository, issues, discussions, and `mailto:` links render in the footer
- [ ] Every rendered outbound link returns a non-404 response
- [ ] No link to a documentation site or social profile exists in v1
- [ ] External links open in a new tab and announce that they do
- [ ] No hard-coded star count appears anywhere on the page: the only star figure is the one read at render time (`BR-007.3`)
- [ ] The `mailto:` link opens the visitor's mail client with a prefilled subject

### 3.8 F008: Theme Palette Preview — **Retired** (v1.2, 2026-09-14)

Was an interactive band (`SEC-005`, `#palettes`) letting a visitor re-theme a mock surface through the eight palettes the application ships. The band was removed in v1.2: the site ships no theme switcher, so the preview advertised a choice the site does not offer (`BR-008.2` was the warning). `FR-008.1`–`FR-008.7` and `BR-008.1`–`BR-008.4` are withdrawn, and no `--palette-*` token is declared anywhere in the stylesheet.

The accent stays the Bentomux blue `#4c8ef9` on every surface. The application's eight palette identifiers (`PaletteName` in `../Bentomux-v2/src/shared/types.ts`) remain recorded in `docs/design_system.md` §4.3 as application reference material — the README's claim of six palettes is still stale and must not be used (`CON-013`).

### 3.9 F009: Licensing, Attribution and Privacy (Priority: High)

**Description:** The legal surface of the site: the license statement, upstream attribution, third-party trademark disclaimer, and a privacy policy page covering the waitlist data.

**Functional Requirements:**

- FR-009.1: The footer must state the project's license.
- FR-009.2: The footer must credit Herdr as the upstream source of ported detection logic and state its Apache-2.0 license.
- FR-009.3: The footer must carry a trademark disclaimer covering agent runtime names and third-party marks.
- FR-009.4: The site must link to a privacy policy page at `/privacy`.
- FR-009.5: The privacy policy must state what data is collected (email address), the purpose (release notification), the processor (Resend), the retention rule, and how to request deletion.
- FR-009.6: The footer must state that the desktop application itself collects no telemetry.
- FR-009.7: The license statement must name the license actually present in the Bentomux repository, and must fall back to deferred language if that file is ever absent.
- FR-009.8: The repository must carry a `NOTICE` file discharging the Apache-2.0 attribution obligation created by the ported Herdr code. This is a launch precondition, not a site feature: the site states the credit either way, but launch is blocked until the file exists (`LP-002`).

**Business Rules:**

- BR-009.1: The stated license is **MIT**, matching the `LICENSE` file tracked on `master` of `takora-dev/bentomux-v2` (commit `af49991`). It is stated plainly rather than in deferred form, because the file exists (`CON-008`).
- BR-009.2: If the repository's `LICENSE` file is removed or replaced, the deferred wording takes over until the statement matches the repository again: "Open source — the license is being finalised and will be published with the first release." A license statement that does not match the repository is forbidden (`CON-008`).
- BR-009.3: Attribution must name Herdr and its license, and must link to the upstream repository.
- BR-009.4: The trademark disclaimer text must be: "All product names, logos, and brands are property of their respective owners. Use of these names does not imply endorsement."
- BR-009.5: The privacy policy must be reachable from the footer on every page and must be included in the sitemap.
- BR-009.6: Adding the `NOTICE` file to the Bentomux repository is a launch precondition, tracked as `FR-009.8` and `LP-002`. The `LICENSE` half of that precondition is already met: the repository carries an MIT `LICENSE`. Naming MIT on the site does not discharge the attribution obligation, so both statements must appear (`CON-007`).
- BR-009.7: No statement on the site may claim a capability, license, or release that the repository does not support.
- BR-009.8: The site must not present a fabricated organisation, company, or legal entity. It is a personal open-source project and may say so.

**Acceptance Criteria:**

- [ ] Footer states MIT, and the statement matches the `LICENSE` file tracked in the application repository
- [ ] Footer credits Herdr, links upstream, and states Apache-2.0
- [ ] Footer carries the exact trademark disclaimer from `BR-009.4`
- [ ] `/privacy` renders and is linked from the footer
- [ ] `/privacy` names Resend as processor and states the retention and deletion rules
- [ ] The Herdr credit appears alongside the MIT statement, and no page claims the attribution obligation is already discharged

---

## 4. Data Requirements

### 4.1 Core Business Objects

| Object | Description | Owner | Lifecycle |
|--------|-------------|-------|-----------|
| `WaitlistSubscriber` | An email address registered for release notification. System of record is Resend Contacts. | Site maintainer (controller); Resend (processor) | Created on form submit; retained until release notification is sent and the recipient unsubscribes or requests deletion |
| `AgentRuntime` | A CLI coding agent the desktop application works with, its support level, and its display name. Static content. | Repository (`resources/manifests/`, `agents/index.rs`) | Authored in a content module; revised when the application's support changes |
| `CapabilityRow` | A marketed capability of the desktop application, with the evidence panel that carries it. Static content. | Repository (`README.md`, source tree) | Authored in a content module; revised when the application changes |
| `AppMock` | The workspaces, tabs and pane lines the window figure renders. Static content. | Site maintainer | Authored in a content module; tab labels and pane titles resolved against `AgentRuntime` |
| `StatFact` | One figure in the stat strip, with its label and destination. Static content, except the star count, which is read at render time. | Repository (manifests, installers, `LICENSE`) and the GitHub API | Authored in a content module; the star figure is fetched and never typed |
| `InstallOption` | One OS panel of the install section: its label, its panel notes, and which option is selected before any interaction. Static content. | Application repository (`installers/*`) | Authored in a content module; revised when the installer's platform coverage changes |
| `InstallCommand` | One command inside a panel: its verbatim text, its role (install, fallback or pin), and whether it needs root. Static content. | Application repository (`installers/*`) | Authored in a content module; revised in the same cycle as the installer scripts (`BR-005.9`) |
| `InstallerStep` | One item of the "what the installer does" list. Static content. | Application repository (`installers/*`) | Authored in a content module; revised when the installer's behaviour changes |
| `ManualDownloadList` | The five published artifact formats offered behind one link to the latest release. Static content. | Application repository (build workflow) | Authored in a content module; revised when the build workflow's artifact set changes |
| `SiteConfig` | Canonical URL, repository URL, upstream attribution, contact address, and license statement used across the site. | Site maintainer | Authored in a configuration module; read by layout, metadata, and footer |

### 4.2 Ownership Rules

- **WaitlistSubscriber:** created anonymously by any visitor submitting the form. Read and deleted only by the site maintainer through the Resend dashboard. No visitor may read another visitor's record. The site exposes no read endpoint.
- **AgentRuntime, CapabilityRow, AppMock, StatFact, InstallOption, InstallCommand, InstallerStep, ManualDownloadList, SiteConfig:** owned by the site maintainer, modified only by editing the content module and deploying. Not writable at runtime by any actor. The install objects transcribe strings that already exist in the application repository, so they are edited in step with `installers/*` (`BR-005.9`).
- There is no user account, so no per-user permission model exists. See §7.

### 4.3 Data Retention Rules

- **WaitlistSubscriber:** retained until the release notification is sent, then retained for a maximum of 12 months or until the subscriber unsubscribes, whichever comes first. Deletion requests are honoured within 30 days and are executed in the Resend dashboard or through the Resend API.
- **Static content objects:** retained indefinitely in version control. No runtime retention policy applies.
- **Server logs:** retained according to the hosting platform's default policy. The application does not write subscriber email addresses to application logs.

### 4.4 Data Validation Rules

| Scope | Rule |
|-------|------|
| Field-level | Email must match a single-address email format, be at most 254 characters total, and have a local part of at most 64 characters. Leading and trailing whitespace is trimmed; the local part is not case-normalised for storage but is compared case-insensitively for duplicate detection. |
| Field-level | Honeypot field must be absent or empty. Any non-empty value causes silent rejection. |
| Cross-field | Consent must be established by submission of the form; no checkbox gates submission, so the consent statement must precede the submit control in reading order. |
| Business-level | A submission may only be accepted if the request originates from a browser context; requests without an `Origin` header matching the configured site origin are rejected. |
| Business-level | A submission is accepted at most once per email address. Repeat submissions resolve to success without creating a duplicate record. |
| Business-level | Agent counts and support levels rendered on the site must match the repository. A mismatch is a content defect, not a runtime validation failure. |
| Content-level | Every rendered install command must equal its source string in the application repository character for character (`BR-005.1`). |
| Content-level | The install section must render exactly one selected option, and it must be macOS whenever the visitor's platform is unknown (`FR-005.2`). |
| Content-level | Only the pin example may contain a version literal, and it must be the placeholder `vX.Y.Z` (`BR-005.4`). |
| Content-level | A command may be marked as needing root only if it is the Linux `--deb` command (`BR-005.5`). |

---

## 5. External Interfaces

### 5.1 UI Requirements

- **Layout:** Single scrolling page of six bands — hero, stat strip, window figure, capability rows, waitlist, install — with anchored sections and a footer; secondary pages for privacy policy and not-found
- **Visual language:** Defined exhaustively in `docs/design_system.md` (SoT #3). This SRS does not restate colors or type scale
- **Responsive:** Desktop-first composition, fully usable from 360px upward; no horizontal overflow at any width
- **Accessibility:** WCAG 2.1 AA on contrast, focus visibility, keyboard operation, name/role/value for every control, and semantic landmark structure
- **Motion:** All non-essential animation must respect `prefers-reduced-motion: reduce`
- **Language:** English only (`AS-008`)
- **No JavaScript requirement:** All copy, navigation anchors, agent names, the window figure's first pane, the stat strip figures, all three install panels and their commands must be present in server-rendered HTML. Panel visibility is decided by CSS from the selected input (`FR-005.6`)

### 5.2 External Systems

| System | Purpose | Direction | Failure mode |
|--------|---------|-----------|--------------|
| **Resend Contacts API** | Create waitlist subscriber records | Outbound, server-side only | Submission fails; UI must preserve the address and offer retry (`FR-004.8`) |
| **Vercel** | Hosting, DNS binding, TLS, deployment | Platform | Site unavailable; outside the application's control |
| **GitHub REST API** | Repository, issues and discussions links; the repository's star count, read at render time (`FR-002.7`) | Outbound links from the page, plus one cached read of `api.github.com/repos/takora-dev/bentomux-v2` (`revalidate: 3600`) | Links remain valid, and the read is non-fatal: a failure drops the star figure and leaves the other three in place (`BR-002.3`, `NFR-004.4`) |
| **GitHub Releases** | Published builds and the `latest.json` release manifest | Outbound from the visitor's terminal only — the page never fetches it | Not a page-load dependency. A missing manifest fails the visitor's install command, not the site. The first release must publish the manifest and assets before launch (`LP-007`) |
| **raw.githubusercontent.com** | The installer scripts quoted by the install section | Outbound from the visitor's terminal only | The page quotes these URLs as text, so a broken raw URL is a command-fidelity defect rather than a rendering failure (`BR-005.1`) |
| **Google Fonts or self-hosted fonts** | Archivo (display) and Inter (body) | Outbound or bundled | Body text must remain legible using the fallback stack; no layout collapse |
| **Resend sending domain** | Waitlist confirmation and launch broadcast | Outbound | Not required for the waitlist write path; blocking only for outbound email |

### 5.3 Communication Requirements

- **Browser → site:** HTTPS only. The `.dev` top-level domain enforces HTTPS via HSTS preload, so plaintext access is impossible.
- **Site → Resend:** HTTPS `POST https://api.resend.com/contacts`, `Authorization: Bearer <RESEND_API_KEY>`, `Content-Type: application/json`. The key is injected as a server-only environment variable and is never sent to the browser.
- **Encoding:** JSON request and response bodies, UTF-8.
- **Site → browser response:** The waitlist endpoint returns JSON only; the site degrades to a standard form POST with a server-rendered result state when JavaScript is unavailable (`FR-004.9`).
- **CORS:** The waitlist endpoint accepts same-origin requests only.
- **Timeouts:** Outbound Resend calls must fail within 10 seconds rather than hanging the serverless invocation.

---

## 6. Non-Functional Requirements

### 6.1 Performance

- NFR-001.1: Largest Contentful Paint on the home page must be under 2.5 seconds on a simulated 4G connection and mid-tier mobile device.
- NFR-001.2: Cumulative Layout Shift must be under 0.1. The page ships no raster image in content, so this is met by the window figure being markup rather than a sized bitmap, and by reserving space for the waitlist result state.
- NFR-001.3: Any raster asset added to page content later must be served through Next.js image optimisation, in an AVIF or WebP format, at the dimensions actually displayed.
- NFR-001.4: Total JavaScript transferred on first load must not exceed 120 KB compressed. Any additional dependency must justify its weight against this budget.
- NFR-001.5: The initial HTML document must be under 150 KB uncompressed.
- NFR-001.6: Interaction to Next Paint must be under 200 ms for the window figure's workspace, tab and agent controls, the install option group and the copy control.

### 6.2 Security

- NFR-002.1: `RESEND_API_KEY` must be a server-only environment variable. It must not be prefixed for client exposure, must not appear in any client bundle, and must not be committed to the repository.
- NFR-002.2: The waitlist endpoint must reject requests whose `Origin` does not match the configured site origin.
- NFR-002.3: Spam mitigation uses a honeypot field as the primary defence and a best-effort per-IP rate limit of 5 submissions per minute as a secondary defence. Because Route Handlers are stateless (`CON-002`, `CON-012`), the rate limit must not be presented as a guarantee. A challenge service may be added only if observed abuse justifies it.
- NFR-002.4: No error response may include stack traces, upstream response bodies, environment values, or the API key.
- NFR-002.5: All outbound user-supplied data must be validated server-side. Client-side validation is a convenience and must never be the only check.
- NFR-002.6: The waitlist response must not disclose whether an email address is already registered (`BR-004.5`).
- NFR-002.7: All security headers must be set: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy` that permits only the origins the site actually uses.
- NFR-002.8: External links must carry `rel="noopener noreferrer"` (`BR-007.2`).
- NFR-002.9: The site must have no dependency with a known critical vulnerability at the time of deployment, verified through the package manager's audit output.

### 6.3 Availability

- NFR-003.1: The site must be available as a static deployment with no runtime dependency on a third-party service for page rendering. Resend unavailability must affect only waitlist submission.
- NFR-003.2: No uptime target beyond the hosting platform's default is required; the site is a marketing page, not a transactional system.
- NFR-003.3: A failed waitlist submission must degrade gracefully and must never render an unhandled error page.

### 6.4 Reliability

- NFR-004.1: A Resend failure must not lose the visitor's typed address; the value must remain in the input with a visible retry affordance.
- NFR-004.2: A missing or invalid `NEXT_PUBLIC_SITE_URL` must fail the build rather than emit a site with incorrect canonical URLs.
- NFR-004.3: The site must build successfully with no TypeScript errors and no unhandled lint errors.
- NFR-004.4: Outbound metadata reads, if any, must be non-blocking. A GitHub API failure must never prevent the page from rendering.

### 6.5 Scalability

- NFR-005.1: The architecture must serve up to 50,000 visits per month within the hosting free tier without configuration changes (`AS-005`).
- NFR-005.2: Waitlist storage must scale through Resend's service rather than application-side storage.
- NFR-005.3: Adding a page must not require modifying global layout or navigation beyond adding a content entry.

### 6.6 Maintainability

- NFR-006.1: All marketing copy, agent data, capability rows, the window figure's contents, stat facts, and link targets must live in typed content modules under `src/content/`. No copy may be hard-coded inside layout or presentational components.
- NFR-006.2: TypeScript strict mode must be enabled.
- NFR-006.3: Every content module must be validated so a missing or malformed entry fails the build rather than rendering a blank section. The site enforces this with the `invariant`, `requireCount`, `requireUnique` and `requireNonEmpty` helpers in `src/content/validate.ts`, which throw while the module is imported.
- NFR-006.4: Components must be presentational and receive data as props. Data modules must not fetch from within presentational components.
- NFR-006.5: The repository must contain a README describing local setup, the environment variables required, and the deployment target.
- NFR-006.6: Every count, agent roster, capability row, stat fact, mock pane line and link target must have exactly one source. Updating any of them requires editing one file, and a count typed into copy rather than rendered from its module must fail the build (`BR-002.2`).
- NFR-006.7: Every install command must live in exactly one content module, so that following a change in the application repository's installer scripts is a single-file edit with no component change (`BR-005.9`).

### 6.7 Usability

- NFR-007.1: A visitor must be able to determine what Bentomux is and whether it is released from the first viewport, without scrolling.
- NFR-007.2: Every primary call to action must be reachable within one interaction from the hero and from the footer.
- NFR-007.3: The waitlist form must be completable in one field and one action.
- NFR-007.4: Error messages must state what went wrong and what to do next, in plain language, without error codes.
- NFR-007.5: No interactive element may rely on hover as its only affordance.
- NFR-007.6: Touch targets must be at least 44×44 CSS pixels on viewports below 768px.
- NFR-007.7: Text contrast must meet WCAG AA: 4.5:1 for body text and 3:1 for text at 24px or larger.
- NFR-007.8: Focus must be visible on every interactive element and must never be removed without an equivalent indicator.
- NFR-007.9: The page must remain usable at 320% zoom without loss of content or function.
- NFR-007.10: The install switcher must be operable with arrow keys as a single-select group occupying one tab stop, and its selected state must be exposed to assistive technology (`FR-005.1`).
- NFR-007.11: A copy control must report success or failure in text inside its own region, must leave the command text readable after a failure, and must never be the only route to the command (`FR-005.5`).
- NFR-007.12: Every control inside the window figure must be a button that exposes its selected state, must be reachable by keyboard, and must be optional: the band is readable, captioned and complete without operating it (`FR-002.3`).
- NFR-007.13: The figure's animation must be inert before hydration, must stop under `prefers-reduced-motion: reduce`, and must never be the only carrier of a fact (`FR-002.10`).

### 6.8 SEO and Discoverability

- NFR-008.1: Every page must have a unique title and meta description.
- NFR-008.2: The site must publish `sitemap.xml` and `robots.txt`.
- NFR-008.3: The site must publish structured data identifying the product and the repository.
- NFR-008.4: The page must render its full primary content server-side so it is indexable without JavaScript execution.
- NFR-008.5: Open Graph and Twitter card images must be present and at least 1200×630 pixels.

---

## 7. Permissions and Access Control

The site has no authentication and no user accounts. Access control is therefore expressed at the surface level rather than per role.

| Actor | Create | Read | Update | Delete | Notes |
|-------|--------|------|--------|--------|-------|
| **Visitor** | `WaitlistSubscriber` (own email only, once) | Public static content | Nothing | Nothing | Cannot read any subscriber record, including their own. Cannot enumerate existing subscribers (`BR-004.5`). |
| **Site maintainer** | `AgentRuntime`, `CapabilityRow`, `AppMock`, `StatFact`, `InstallOption`, `InstallCommand`, `InstallerStep`, `ManualDownloadList`, `SiteConfig` (via commit) | All content, all subscriber records in the Resend dashboard | All content; subscriber unsubscribe state | `WaitlistSubscriber` | The only actor with administrative access. Access is through GitHub and the Resend dashboard, not through a site UI. |
| **Search engine crawler** | Nothing | Public static content, sitemap | Nothing | Nothing | Must not be blocked from any page except the waitlist endpoint and the not-found page. |
| **Resend (processor)** | Nothing originating | `WaitlistSubscriber` records it stores | Unsubscribe state | On maintainer instruction | Not an authenticated role. No site credential grants Resend access; the API key grants only contact creation. |

**Enforcement:**

- The waitlist endpoint is the only writable surface. It accepts `POST` only and requires a matching `Origin` (`NFR-002.2`).
- No endpoint may return subscriber data of any kind.
- Administrative operations occur outside the site, so the site exposes no administrative route, no admin path, and no privileged API.

---

## 8. Feature Inventory

| Feature ID | Feature Name | Priority | Dependencies | Status |
|------------|--------------|----------|--------------|--------|
| F001 | Page Shell, Hero and Navigation | High | None | Implemented |
| F002 | Capability Rows, Application Window and Stat Strip | High | F001 | Implemented |
| F003 | Agent Runtime Showcase | High | F001 | Removed in v1.2 — counts and subset rule live in F002 |
| F004 | Waitlist Capture | High | F001, external Resend account | Implemented |
| F005 | Install and Platform Availability | High | F001, external GitHub Releases | Implemented |
| F006 | FAQ | Medium | F001 | Removed in v1.2 — answers live in F009 and F005 |
| F007 | Project Links, Community and Repository Star | Medium | F001 | Implemented |
| F008 | Theme Palette Preview | Medium | F001 | Removed in v1.2 — the site ships no theme switcher |
| F009 | Licensing, Attribution and Privacy | High | F001 | Implemented |

**Launch preconditions** — the site must not be announced publicly until all hold:

| ID | Precondition | Owner | Verdict rule |
|----|--------------|-------|--------------|
| LP-001 | `LICENSE` file published in `takora-dev/bentomux-v2` — **satisfied**: an MIT `LICENSE` is tracked on `master` (commit `af49991`) | Site maintainer | Required by `CON-008`; the licence statement names MIT precisely because this holds (`BR-009.1`) |
| LP-002 | `NOTICE` file crediting Herdr added to `takora-dev/bentomux-v2` — **still open** | Site maintainer | Required by `CON-007`, `FR-009.8`. The site renders the Herdr credit regardless, but the MIT declaration is incomplete without this file |
| LP-003 | Repository description and homepage URL set on GitHub | Site maintainer | Referenced by Open Graph metadata |
| LP-004 | Resend sending subdomain verified, or the waitlist endpoint deployed with confirmation email deferred | Site maintainer | Required by `AS-003` |
| LP-005 | `NEXT_PUBLIC_SITE_URL` set in the production environment | Site maintainer | Required by `BR-001.3` |
| LP-006 | Agent counts on the site re-verified against `resources/manifests/` and `agents/index.rs` | Site maintainer | Required by `BR-003.1`, `BR-003.2` |
| LP-007 | A tagged release has published `latest.json` and the platform assets, so every install command resolves — **not yet met**: the manifest returned HTTP 404 when this revision was written, and `install.sh --dry-run` exits with "cannot reach …/releases/latest/download/latest.json" | Site maintainer | Required by `CON-004`, `FR-005.10`, `FR-005.11`. The install section may be built and reviewed before this holds, but the site must not be announced while its primary action cannot resolve |

---

## 9. Open Questions

Each entry records the decision taken for v1 so that implementation is unambiguous. Unresolved entries are not permitted — an open question must resolve into a requirement, a constraint, or a future consideration.

| ID | Question | Resolution for v1 |
|----|----------|-------------------|
| OQ-001 | When will the first Bentomux release ship, and should the site carry a target date? | **No date is published.** `BR-009.7` forbids a statement the repository does not support, and the retired FAQ rule that forbade uncommitted dates is carried forward by `BR-002.5`: the site states pre-release status and collects waitlist addresses. |
| OQ-002 | Should the site show a live GitHub star count? | **Not in the hero, and not as a hard-coded number.** Since v1.2 the stat strip carries it as a figure read from the GitHub API at render time (`revalidate: 3600`), and the figure is dropped entirely when the read fails (`FR-002.7`, `BR-002.3`). |
| OQ-003 | Should a documentation site exist at `/docs`? | **No in v1.** `OW-001` in §1.2. The footer links to the repository, its latest release, its issues and its discussions; the FAQ that once linked the README was retired in v1.2 (`F006`). A documentation site is `FUT-003`. |
| OQ-004 | Is a contact form needed? | **No.** `FR-007.5` provides a `mailto:` address; issues and discussions cover public contact. A form would create an inbox and a spam surface with no benefit at this scale. |
| OQ-005 | How is "21 agent runtimes" phrased without overstating configuration support? | **`BR-003.4` wording**, rendered in capability row 04 since the `#agents` band was retired: the detected count is stated as detection, and the configurable count is stated beside it as a subset. |
| OQ-006 | Which license should the project carry, given ported Herdr code? | **MIT for the project's own code, with the Apache-2.0 attribution obligation discharged through a `NOTICE` file.** The repository carries an MIT `LICENSE` (commit `af49991`), so `BR-009.1` states MIT plainly. The ported detection code remains Apache-2.0-derived: Herdr must be credited and the `NOTICE` file must exist (`CON-007`, `FR-009.2`, `FR-009.8`, `LP-002`). |
| OQ-007 | Should waitlist signup use double opt-in? | **Deferred** (`BR-004.7`, `FUT-002`). A single explicit consent statement is used in v1. Revisit when the launch broadcast is composed. |
| OQ-008 | Should the site live on a subdomain of a personal domain permanently? | **No, but v1 ships there.** `CON-005` keeps all absolute URLs behind one constant so the move to a dedicated domain is a configuration change. |
| OQ-009 | Are light and dark appearances both required for the marketing site? | **Dark only.** The visual reference is a dark composition (`CON-010`). The application's light appearance is not represented anywhere on the site since the palette preview band was retired in v1.2 (`F008`). |
| OQ-010 | Are the `classic` and `eink` palettes user-facing, or internal experiments the README intentionally omits? | **Treated as user-facing: eight palettes.** They are declared in the public `PaletteName` union and applied by `src/main.ts`, so they are reachable by users. This is application-facing now that the preview band is retired; if the maintainer rules the two internal, the change is a note in `docs/design_system.md` §4.3 plus `CON-013`, not a site requirement. |
| OQ-011 | Should the site offer Linux aarch64 builds? | **Not advertised.** `install.sh` can detect `aarch64`, but the build workflow publishes no Linux aarch64 artifact, so the section states x86_64 only (`FR-005.13`, `BR-005.7`). Revisit when the workflow gains an arm64 Linux runner (`FUT-011`). |
| OQ-012 | Should the site advertise the Homebrew cask, as the repository README does? | **No.** `brew info --cask takora-dev/tap/bentomux` fails because the tap is unpublished — the workflow writes the cask only when `HOMEBREW_TAP_TOKEN` is configured. The command stays off the site until it resolves (`CON-015`, `BR-005.6`, `FUT-010`). |

---

## 10. Future Considerations

| ID | Item | Rationale for deferral |
|----|------|------------------------|
| FUT-001 | Replace mocked downloads with real release artifacts and platform-specific labels | **Delivered in SRS v1.1.** `F005` now presents the repository's own install commands, so this entry is kept only as a record of what the mocked v1 deferred. |
| FUT-002 | Double opt-in confirmation and a dedicated launch broadcast | Adds a token flow and a confirmation route. Justified only when the first broadcast is composed (`OQ-007`). |
| FUT-003 | Documentation site or `/docs` route | Valuable once the application's configuration surface is stable enough to document. |
| FUT-004 | Live GitHub star count and release metadata | **Partly delivered in SRS v1.2.** The star count is read at render time and shown in the stat strip; release metadata is still typed into the content modules rather than fetched (`OQ-002`). |
| FUT-005 | Blog or changelog for release notes | The repository's GitHub releases can serve this until content volume justifies a route. |
| FUT-006 | Localization | `AS-008`. No non-English audience identified yet. |
| FUT-007 | Analytics beyond hosting defaults | Privacy cost must be weighed against a marketing page's need. If added, prefer aggregate, cookieless measurement. |
| FUT-008 | Automated content drift check comparing agent data against the repository | Would replace `LP-006`'s manual verification and make `BR-003.1` self-enforcing. |
| FUT-009 | Dedicated domain (`bentomux.dev`) with a 301 from the subdomain | `OQ-008`. Preparation is already covered by `CON-005`. |
| FUT-010 | Publish the Homebrew cask and add a one-line `brew install` to the macOS panel | The cask generator already exists in the application repository; the tap stays unpublished until `HOMEBREW_TAP_TOKEN` is configured (`CON-015`, `OQ-012`). |
| FUT-011 | Linux aarch64 builds with a matching panel note | `install.sh` detects `aarch64`, but no such artifact is published today, so no arm64 claim may be made (`OQ-011`). |
| FUT-012 | Signed and notarized macOS builds, removing the unsigned-build disclosure | Requires a paid Apple Developer certificate. Until then `FR-005.8` requires the warning to stay. |

---

## 11. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-13 | F. Jibran | Initial version. Derived from the Bentomux v2 repository (`takora-dev/bentomux-v2`), product-owner decisions on CTA scope, waitlist processor, canonical domain, design direction, and deployment target. |
| 1.1 | 2026-09-13 | F. Jibran | F005 rewritten from a mocked download dialog into the repository's real install commands: `FR-005.1`–`FR-005.13` and `BR-005.1`–`BR-005.9` replace the dialog contract, the download dialog is removed, and `FR-005.8` of the previous revision is dropped because the community section already owns the repository star action. Repository organisation corrected to `takora-dev/bentomux-v2` and installer scripts added as an external interface (`CON-004`, `CON-014`, `CON-015`). Licence changed to MIT to match the tracked `LICENSE`, with the Herdr credit and `NOTICE` obligation retained (`CON-007`, `CON-008`, `BR-009.1`, `BR-009.2`, `FR-009.8`). `FR-009.8` defined, which earlier revisions referenced without defining. Launch precondition `LP-007` added for the unpublished release manifest. Data objects `InstallOption`, `InstallCommand`, `InstallerStep` and `ManualDownloadList` replace `DownloadArtifact`. |
| 1.2 | 2026-09-14 | F. Jibran | Landing page rebuilt to the six-band herdr-style structure and the requirements moved with it. F002 rewritten from alternating feature blocks into the five capability rows, the markup application window figure and the stat strip (`FR-002.1`–`FR-002.9`, `BR-002.1`–`BR-002.6`). `F003` retired with the `#agents` band: `FR-003.1`–`FR-003.6` withdrawn, and the derivation rules `BR-003.1`–`BR-003.6` kept as the source for the counts `F002` prints. `F006` (FAQ) and `F008` (palette preview) retired with their bands, with each retired answer mapped to the requirement that now carries it. `F001` amended for the install-command hero, the two-anchor navigation and the removal of the screenshot (`FR-001.1`, `FR-001.3`, `FR-001.7`), and `BR-001.2` restated as the single Bentomux blue accent with no theme control. `F002` extended with the honest-numbers rule, the inert-until-hydrated figure animation (`FR-002.10`), the roster-sourced figure names (`FR-002.11`) and the no-counts-of-our-own rule (`BR-002.3`). `F005` gains `FR-005.14`: the hero quotes the macOS command by identifier from the panel module. `F007` amended: the star call to action (`FR-007.2`) is retired into the stat strip's star figure, and the repository link moves from the hero to the navigation bar, the stat strip and the footer. `NFR-006.3`, `NFR-006.6`, `NFR-007.12`, `NFR-007.13`, `NFR-001.2`, `NFR-001.3`, `NFR-001.6` and `AS-007` updated for a page that ships no raster in content and must keep every count in one module. Retired ids (`F003`, `F006`, `F008`, `SEC-003`–`SEC-005`, `SEC-008`, `SEC-009`) are kept and never reused; the new bands are `SEC-011` (stat strip), `SEC-012` (`FIG-001`) and `SEC-013` (capability rows) per `docs/information_architecture.md` v1.2. **Amended the same day (2026-09-14):** the window figure's sidebar is a workspace list only. The application has no agent panel — a runtime belongs to the tab that runs it — so `FR-002.2`, `FR-002.3` and `FR-002.11` no longer describe an agent list or an agent row, and the figure's caption reads "Three workspaces, one of them waiting on your approval." |
| 1.3 | 2026-09-15 | F. Jibran | The repository-evidence line was cut from the capability rows. `FR-002.4` no longer lists it, `FR-002.6` no longer requires a row to record the source feature it comes from, `BR-002.1` keeps the honesty rule but drops the clause that made a row name an existing path, and `BR-002.4` loses its `src-tauri/…` carve-out because no path is rendered any more. `ENT-013.sourceFeature`, the five values it held and the smoke assertion that counted them were deleted with it; the glossary entry for the capability row, the `CapabilityRow` data object and two acceptance criteria were restated. The evidence panel, its five kinds and the derived counts are unchanged. Enforced by `scripts/smoke.mjs`, which now asserts that no repository path appears on the page. |
| 1.4 | 2026-09-15 | F. Jibran | The head gained its icon: `FR-001.8` now also requires a PNG favicon and an Apple touch icon, and the matching acceptance criterion names both `rel` values. They are served by the app-directory files `src/app/icon.png` and `src/app/apple-icon.png`, so no icon tag is hand-written. Separately, the logo's source was re-exported at 1024px: the hero renders the mark at up to 480 CSS px and the 504px file left it soft on a retina screen; `scripts/smoke.mjs` asserts the optimiser can still return ≥ 960px. |
