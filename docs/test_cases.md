# Test Cases: Bentomux Landing Page

**Document:** Test Cases | **Document Version:** 1.4 | **Derived From:** SoT-4 (User Flows) + SoT-7 (UCIC) | **Status:** Draft | **Last Updated:** 2026-09-15

> Every test case traces to a Use Case (User Flow) and a Feature (SRS). Derive from the SoT — do not reverse-engineer from code.

## 1. Introduction

### 1.1 Purpose

Provide testable, traceable cases that verify the implementation against the validated Sources of Truth. Each case names the UCIC clause or user flow section it comes from, so a case that fails can be attributed either to the implementation or to the artifact that produced it.

### 1.2 Scope

All nine SRS features and all eight use cases, two of which are now retired. Fifty-nine executable cases: 34 positive, 16 negative, 9 exception. Fifteen retired cases keep their identifiers and are marked `Removed (2026-09-14)` so the traceability tables and the execution sheet keep a stable denominator; none of them is executed against v1.2.

Thirteen of the fifty-nine cover UC-002, because the waitlist is the only use case with runtime state, an external dependency, and failure paths that must be reachable on purpose; sixteen cover UC-003, because the install section is the only place where the site reproduces executable text and where a wrong character changes what a visitor runs. UC-001 carries fifteen cases, UC-004 seven, UC-006 two, and UC-008 six. UC-005 (FAQ) and UC-007 (palette preview) have no executable cases left: both bands were removed from the landing page on 2026-09-14.

Three families of cases are unusual and worth calling out before reading the index:

- **Build-time validation cases** (TC-F001-006, TC-F003-003, TC-F005-004, TC-F005-005, TC-F005-006) assert that the *build fails* when a data-model invariant is violated. They are executed by corrupting one fixture and confirming the build rejects it with the recorded error code. Their point is that a wrong fact cannot reach a visitor.
- **Command-fidelity cases** (TC-F005-004, TC-F005-012) compare rendered executable text against the application repository's installer scripts and README install block byte for byte, because the site's commands are transcriptions of someone else's working code (see `test_plan.md` §2.1).
- **Content-accuracy cases** (TC-F003-004, TC-F003-005, TC-F003-006, TC-F003-007, TC-F007-002, TC-F009-007) assert the *absence* of a claim, which is the shape most of this project's risk takes: no release date, no version literal beyond the pin placeholder, no advertised package manager, no numeric issue/fork/contributor/install count, no star count that is unlabelled or that outlives its read, no licence identifier that contradicts the tracked file, no named upstream project or claimed relationship with one.

### 1.3 Test Case Format

| Field | Description |
|-------|-------------|
| TC ID | Unique identifier: `TC-F00X-00Y` |
| Related UC | Use case this case exercises |
| Related Feature | SRS feature ID |
| Test Scenario | One-line description of what is verified |
| Type | Positive / Negative / Exception |
| Preconditions | State required before execution |
| Test Data | Specific inputs or fixtures |
| Test Steps | Ordered actions |
| Expected Result | Observable outcome per the user flow and the UCIC |

## 2. Test Case Index

| TC ID | Feature | Use Case | Scenario | Type |
|-------|---------|----------|----------|------|
| TC-F001-001 | F001 | UC-001 | Page renders the four anchored bands in IA order with a single `h1`, and no retired band | Positive |
| TC-F001-002 | F001 | UC-001 | Every nav anchor and hero link scrolls to its target with heading clearance | Positive |
| TC-F001-003 | F001 | UC-001 | Skip link is the first focusable element and targets `main` | Positive |
| TC-F001-004 | F001 | UC-001 | Full content is readable and usable with JavaScript disabled | Positive |
| TC-F001-005 | F001 | UC-001 | A stale hash target does not scroll and shows no error | Exception |
| TC-F001-006 | F001 | UC-001 | Build rejects an unresolved nav anchor or a literal URL | Negative |
| TC-F001-007 | F001 | UC-001 | The figure band labels and captions the window mock and ships no raster image | Positive |
| TC-F001-008 | F001 | UC-001 | Selecting a workspace or a tab in the mock swaps the pane content | Positive |
| TC-F001-009 | F001 | UC-001 | Every mock control is a keyboard-reachable button, announced as one group | Positive |
| TC-F001-010 | F001 | UC-001 | The mock's spinner and working timer do not move under reduced motion | Exception |
| TC-F001-011 | F001 | UC-001 | The mock's selection is never persisted to storage, cookie, or URL | Negative |
| TC-F002-001 | F002 | UC-001 | Six feature blocks render with 2–5 bullets and non-empty alt text | Removed |
| TC-F002-002 | F002 | UC-001 | Build rejects a feature block with 1 or 6 bullets | Removed |
| TC-F002-003 | F002 | UC-001 | Every capability claim is limited to behaviour the application ships | Positive |
| TC-F002-004 | F002 | UC-001 | Five numbered capability rows render, one claim each, in a fixed order | Positive |
| TC-F002-005 | F002 | UC-001 | Every capability row prints the repository path its claim comes from | Removed |
| TC-F002-006 | F002 | UC-001 | Each capability row carries the evidence panel its kind defines | Positive |
| TC-F003-001 | F003 | UC-004 | Row 04 and the stat strip state 21 detected and 9 configurable, both derived | Positive |
| TC-F003-002 | F003 | UC-004 | Runtime names in row 04 are data, not controls | Positive |
| TC-F003-003 | F003 | UC-004 | Build rejects a roster that violates either count, or a typed-in derived count | Negative |
| TC-F003-004 | F003 | UC-004 | Copy never implies all 21 agents are configurable | Negative |
| TC-F003-005 | F003 | UC-004 | The stat strip states three repository-owned figures with their labels | Positive |
| TC-F003-006 | F003 | UC-004 | An unreadable star count drops the item instead of faking a number | Exception |
| TC-F003-007 | F003 | UC-004 | No GitHub metadata request is made from the visitor's browser | Negative |
| TC-F004-001 | F004 | UC-002 | Valid submission creates a contact and shows the success state | Positive |
| TC-F004-002 | F004 | UC-002 | Repeat address returns the identical success response | Positive |
| TC-F004-003 | F004 | UC-002 | Filled honeypot is discarded and answered as success | Positive |
| TC-F004-004 | F004 | UC-002 | Dialog primary action focuses the waitlist email input | Positive |
| TC-F004-005 | F004 | UC-002 | Whitespace is trimmed and duplicates compare case-insensitively | Positive |
| TC-F004-006 | F004 | UC-002 | Invalid address is caught client-side with no request sent | Negative |
| TC-F004-007 | F004 | UC-002 | Invalid address reaching the server returns 400 `invalid_email` | Negative |
| TC-F004-008 | F004 | UC-002 | Upstream error or timeout returns a generic 502 and keeps the address | Exception |
| TC-F004-009 | F004 | UC-002 | Request from another origin is rejected with 403 | Exception |
| TC-F004-010 | F004 | UC-002 | The sixth submission in a minute returns 429 | Exception |
| TC-F004-011 | F004 | UC-002 | Submission succeeds with JavaScript disabled | Positive |
| TC-F004-012 | F004 | UC-002 | Non-POST verb returns 405 | Negative |
| TC-F004-013 | F004 | UC-002 | No subscriber address is logged and no server secret reaches the client | Positive |
| TC-F005-001 | F005 | UC-003 | Three OS options render and macOS is the selection in the server-rendered HTML | Positive |
| TC-F005-002 | F005 | UC-003 | Arrow keys move the selection, the panels follow with no script, and nothing is persisted | Positive |
| TC-F005-003 | F005 | UC-003 | All three panels are present in the server HTML and exactly one is visible | Positive |
| TC-F005-004 | F005 | UC-003 | Every rendered command matches its repository source byte for byte | Positive |
| TC-F005-005 | F005 | UC-003 | Every command and download host belongs to the project repository | Negative |
| TC-F005-006 | F005 | UC-003 | No version literal, date, size, package-manager channel or Homebrew command appears | Negative |
| TC-F005-007 | F005 | UC-003 | The Linux panel shows the AppImage command, the `--deb` alternative, and the libfuse2 note | Positive |
| TC-F005-008 | F005 | UC-003 | The macOS panel states the build is unsigned and gives the first-launch path | Positive |
| TC-F005-009 | F005 | UC-003 | The Windows panel shows the PowerShell command, the `install.cmd` fallback, and the no-admin statement | Positive |
| TC-F005-010 | F005 | UC-003 | The section states what the installer does, including the refusal on digest mismatch | Positive |
| TC-F005-011 | F005 | UC-003 | The manual download line names five formats behind one link | Positive |
| TC-F005-012 | F005 | UC-003 | The pin example uses `vX.Y.Z` and the manifest override the installer documents | Positive |
| TC-F005-013 | F005 | UC-003 | The copy control copies the exact command and reports both outcomes in text | Positive |
| TC-F005-014 | F005 | UC-003 | Detected-platform preselection never overrides an explicit choice | Exception |
| TC-F005-015 | F005 | UC-003 | The Linux x86_64 limit is stated and no arm64 support is implied | Negative |
| TC-F005-016 | F005 | UC-003 | The section is not announced while the install commands cannot resolve | Exception |
| TC-F006-001 | F006 | UC-005 | Eight items render, first expanded, all seven topics covered | Removed |
| TC-F006-002 | F006 | UC-005 | Expanding one item leaves the others unchanged | Removed |
| TC-F006-003 | F006 | UC-005 | Answers are present in the HTML before expansion | Removed |
| TC-F006-004 | F006 | UC-005 | No answer states a release date or an uncommitted availability | Removed |
| TC-F006-005 | F006 | UC-005 | The upstream answer matches the footer credit | Removed |
| TC-F007-001 | F007 | UC-006 | Four cards resolve from `SiteConfig` with `rel` attributes set | Removed |
| TC-F007-002 | F007 | UC-006 | No numeric issue, fork, contributor or install count appears anywhere | Negative |
| TC-F007-003 | F007 | UC-006 | The contact action is a `mailto:` link and the waitlist is the only form | Negative |
| TC-F007-004 | F007 | UC-006 | Build rejects a card naming an unknown `targetKey` | Removed |
| TC-F008-001 | F008 | UC-007 | Eight palette options render with the default selected | Removed |
| TC-F008-002 | F008 | UC-007 | Arrow keys, `Home`, and `End` move selection with a roving tabindex | Removed |
| TC-F008-003 | F008 | UC-007 | Selection is not persisted to storage, cookie, or URL | Removed |
| TC-F008-004 | F008 | UC-007 | Palette token values match the application stylesheet | Removed |
| TC-F008-005 | F008 | UC-007 | Palette tokens do not leak outside the preview and all eight meet AA | Removed |
| TC-F008-006 | F008 | UC-007 | With JavaScript disabled the default palette and eight names render | Removed |
| TC-F009-001 | F009 | UC-008 | Footer states the licence plainly and links the tracked licence file | Positive |
| TC-F009-002 | F009 | UC-008 | `/privacy` renders all eight blocks in order | Positive |
| TC-F009-003 | F009 | UC-008 | Footer and `/privacy` legal text are identical | Negative |
| TC-F009-004 | F009 | UC-008 | No tracking: no cookie, no third-party script, no storage write | Negative |
| TC-F009-005 | F009 | UC-008 | The MIT statement is not the only licence text, and no page denies it | Negative |
| TC-F009-006 | F009 | UC-008 | The attribution credit appears while the duty it creates is still open | Exception |

`Removed` rows are retained identifiers, not executable cases: the band they exercised was deleted from the landing page on 2026-09-14, and each one carries a dated removal note in §3.2, §3.6, §3.7 and §3.8 with the reason it no longer applies. The fifteen live cases added in v1.2 are TC-F001-007 … TC-F001-011, TC-F002-004 … TC-F002-006 and TC-F003-005 … TC-F003-007.

## 3. Test Cases

### 3.1 Feature F001: Page Shell, Hero and Navigation

#### 3.1.1 UC-001: Browse the Landing Page

**TC-F001-001: Page renders the four anchored bands in the IA order with a single `h1`**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-001 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | The document renders `#hero`, `#capabilities`, `#waitlist` and `#install` in order, exactly one `h1`, and none of the retired bands |
| Type | Positive |
| Preconditions | Production build served; JavaScript enabled |
| Test Data | The four anchored bands listed in `information_architecture.md` §3.1 (v1.2) |
| Test Steps | 1. Open `/`  2. Read the DOM in document order  3. Count `h1` elements  4. List the anchored sections  5. Search the DOM for the retired anchor ids |
| Expected Result | The four bands appear in the order hero → capabilities → waitlist → install; exactly one `h1` in the hero; no heading level is skipped; `#agents`, `#features`, `#palettes`, `#faq` and `#community` are absent from the document (`sys_uc_001.md` §Main Flow) |

**TC-F001-002: Navigation anchor scrolls to its section with heading clearance**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-002 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | Following each of the two nav anchors, and the hero's two in-page links, puts the target below the sticky bar |
| Type | Positive |
| Preconditions | Viewport at `md` or wider |
| Test Data | The two nav anchors and the primary waitlist action from `ENT-009`; the hero's `#install` and `#waitlist` links |
| Test Steps | 1. Open `/`  2. Activate each nav anchor  3. Measure the target heading's top offset against the navigation height  4. Activate the hero's two links |
| Expected Result | Each anchor scrolls to its section and the heading is fully visible, never hidden beneath the 64px bar; the two hero links reach the install band and the form, and the waitlist link moves focus into the email field (`LAY-005`, `NAV-008`, `FR-001.2`, `NFR-007.2`) |

**TC-F001-003: Skip link is the first focusable element and targets `main`**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-003 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | Keyboard entry lands on the skip link, which becomes visible and moves focus to `main` |
| Type | Positive |
| Preconditions | Page loaded, focus at document start |
| Test Data | None |
| Test Steps | 1. Press `Tab` once  2. Observe the focused element  3. Press `Enter` |
| Expected Result | The skip link is the first focused element, is visible while focused, has an accessible name, and activating it moves focus into the `main` landmark (`NFR-007.2`) |

**TC-F001-004: Full content is readable with JavaScript disabled**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-004 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | Every band's text is present and no interactive surface is required to read the page |
| Type | Positive |
| Preconditions | JavaScript disabled in the browser context |
| Test Data | None |
| Test Steps | 1. Load `/` with JavaScript off  2. Read each band  3. Read all three install panels  4. Submit the waitlist form  5. Read the figure band |
| Expected Result | All text is present; anchors work natively; the three install panels are readable with macOS selected; the form posts to `/api/waitlist` and shows the no-script note; the mock renders its first workspace with the spinner on its first frame; nothing is hidden behind a control that no longer functions (`NFR-008.4`, `FR-002.3`) |

**TC-F001-005: A stale hash target does not scroll and shows no error**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-005 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | Following a hash that no longer matches a section leaves the page usable |
| Type | Exception |
| Preconditions | Page loaded |
| Test Data | `/#section-that-no-longer-exists` |
| Test Steps | 1. Enter the stale URL  2. Observe the scroll position and the page  3. Use the navigation |
| Expected Result | The page loads normally at the top, no error is displayed, no broken state occurs, and the navigation still works (`sys_uc_001.md` §Error Handling) |

**TC-F001-006: Build rejects an unresolved nav anchor or a literal URL**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-006 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | A nav entry pointing at a nonexistent section, or carrying a hard-coded URL, fails the build |
| Type | Negative |
| Preconditions | Fixture copy of the content module |
| Test Data | (a) `href: '#no-such-section'`; (b) `href: 'https://github.com/...'` as a literal |
| Test Steps | 1. Apply fixture (a)  2. Run the build  3. Apply fixture (b)  4. Run the build |
| Expected Result | Both builds fail, with `BUILD_ANCHOR_UNRESOLVED` and `BUILD_URL_LITERAL` respectively. Neither reaches a deployable artifact (`BR-001.3`) |

**TC-F001-007: The figure band labels and captions the mock and ships no raster image**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-007 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | The band that shows the window is markup, named and captioned |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | `ENT-014` copy |
| Test Steps | 1. Read the band's heading and hint  2. Read the `figcaption`  3. Search the band's DOM for an `img` element  4. Repeat below `md` |
| Expected Result | The band carries the heading `the window, with nobody sitting at it` and the hint `click a workspace`; one `figure` holds the mock and the caption `Three workspaces, one of them waiting on your approval.`; the frame is built from markup and contains no `img`; the band sits between the stat strip and the capability rows (`FR-002.2`, `IMG-001`, `MOCK-004`, `design_system.md` §9, §10.3) |

**TC-F001-008: Selecting a workspace or a tab in the mock swaps the pane content**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-008 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | The mock demonstrates the window instead of only illustrating it |
| Type | Positive |
| Preconditions | Page loaded; JavaScript enabled |
| Test Data | The three workspaces and their tabs in `ENT-014` |
| Test Steps | 1. Activate each of the three workspace buttons  2. Read the pane title and its lines  3. Activate each tab inside `bentomux-v2`  4. Activate a workspace and read the sidebar's pressed state  5. Watch the request log |
| Expected Result | The pane title and lines follow the selection (`bentomux-v2` / `website` / `scratch`); opening a workspace selects its first tab; exactly one workspace button and one tab report `aria-pressed="true"`, and the sidebar holds five pressed-state buttons in total (three workspaces plus the two tabs of the selected one) with no agent list among them; the working pane shows the spinner and the running timer; no request is made (`FR-002.2`, `FR-002.3`, `FR-002.11`, `MOCK-001`) |

**TC-F001-009: Every mock control is a keyboard-reachable button, announced as one group**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-009 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | The mock is operable, and honest about what it is |
| Type | Positive |
| Preconditions | Page loaded |
| Test Data | None |
| Test Steps | 1. `Tab` into the frame and continue to the end of it  2. Activate a workspace and a tab with `Enter` and `Space`  3. Inspect the frame's role and accessible name  4. Inspect the tab strip's roles |
| Expected Result | Every workspace and tab control is a native `button` in document order, reachable and operable from the keyboard; the sidebar lists workspaces only and carries no agent panel (`FR-002.2`); the frame is a labelled `group` rather than a `tablist`, so no tab semantics are promised for a window that is not running; the selected entries expose their state, and the band stays readable without operating it (`FR-002.3`, `NFR-007.8`, `NFR-007.12`, `MOCK-001`, `design_system.md` §9.7) |

**TC-F001-010: The mock's spinner and working timer do not move under reduced motion**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-010 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | The only animation on the page stops when the visitor asks it to |
| Type | Exception |
| Preconditions | `prefers-reduced-motion: reduce` emulated |
| Test Data | None |
| Test Steps | 1. Load `/` with the preference set  2. Watch the working line for ten seconds  3. Read the timer text  4. Inspect the page for any running animation |
| Expected Result | The spinner frame and the working timer never advance; the line stays readable as static text; no transition or animation runs anywhere on the page; the server HTML and the first client render are identical (`FR-002.10`, `NFR-007.13`, `MOT-003`, `MOT-004`, `MOCK-003`) |

**TC-F001-011: The mock's selection is never persisted to storage, cookie, or URL**

| Field | Value |
|-------|-------|
| TC ID | TC-F001-011 |
| Related UC | UC-001 |
| Related Feature | F001 |
| Test Scenario | Looking at another surface leaves no trace and does not survive a reload |
| Type | Negative |
| Preconditions | Page loaded; storage and URL observed |
| Test Data | None |
| Test Steps | 1. Select a workspace and a tab other than the first  2. Inspect cookies, `localStorage`, `sessionStorage` and the URL  3. Reload  4. Read the frame's selection |
| Expected Result | No storage write, no cookie and no URL change; after a reload the frame is back on `bentomux-v2` and its first tab; the selection is presentation state only (`MOCK-002`, `sys_uc_001.md` §Postconditions) |

### 3.2 Feature F002: Feature Showcase Sections

> **Revised 2026-09-14 (v1.2).** The six alternating feature blocks (`SEC-004` in the v1.1 numbering) and their `ENT-002` module were deleted with the landing-page rebuild. The band below the figure is now `SEC-013`, five numbered capability rows with an evidence panel each (`FR-002.1`, `FR-002.4`–`FR-002.6`). F002 keeps its number so the traceability tables stay comparable; TC-F002-001 and TC-F002-002 are retired, and the remaining cases answer the same question — does every claim on this page trace to something the application really does?

#### 3.2.1 UC-001: Browse the Landing Page

**TC-F002-001, TC-F002-002, TC-F002-005 — Removed**

| TC ID | Status | Reason the case no longer applies |
|-------|--------|-----------------------------------|
| TC-F002-001 | Removed (2026-09-14) | The six alternating feature blocks and `ENT-002` were deleted; there are no bullet counts, no `alt` text and no alternating orientation left to check. `RAD-001` media frames survive only inside the capability-row evidence panels. |
| TC-F002-002 | Removed (2026-09-14) | The 2–5 bullet build invariant belonged to `ENT-002`. Its role — a copy rule enforced at build time rather than reviewed — is now carried by TC-F002-006 and TC-F003-003. |
| TC-F002-005 | Removed (2026-09-15) | The capability rows no longer print the repository path their claim was checked against: `ENT-013.sourceFeature`, its five values and the `scripts/smoke.mjs` assertion that counted them were deleted, so there is no evidence line left to read or compare (`BR-002.1` as amended). TC-F002-003 carries the honesty check on its own. |

**TC-F002-003: Every capability claim is limited to behaviour the application ships**

| Field | Value |
|-------|-------|
| TC ID | TC-F002-003 |
| Related UC | UC-001 |
| Related Feature | F002 |
| Test Scenario | No capability row advertises a behaviour the application does not implement |
| Type | Positive |
| Preconditions | Application repository available for reading |
| Test Data | The five rows' claims in `src/content/caps.ts` |
| Test Steps | 1. Read each row's claim  2. Open the application repository artifacts that implement it (`README.md`, `src-tauri/src/state.rs`, `src-tauri/src/detect`, `src-tauri/src/bridge_config.rs`, `resources/manifests`, `src-tauri/src/remote`)  3. Confirm the capability exists and matches the wording  4. Check that row 04's count comes from `ENT-003` rather than from the copy |
| Expected Result | Every claim is traceable to a file that implements it — `README.md`, `src-tauri/src/state.rs`, `src-tauri/src/detect`, `src-tauri/src/bridge_config.rs`, `resources/manifests`, `src-tauri/src/remote`; nothing is advertised on intent alone. The row itself prints no path (`FR-002.6`, `BR-002.1`, `BR-002.4`) |

**TC-F002-004: Five numbered capability rows render, one claim each, in a fixed order**

| Field | Value |
|-------|-------|
| TC ID | TC-F002-004 |
| Related UC | UC-001 |
| Related Feature | F002 |
| Test Scenario | The band's shape is the contract, and it does not grow |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | `ENT-013` as authored |
| Test Steps | 1. Count the rows  2. Read each number and title  3. Read the band's accessible name  4. Repeat at a viewport below `md` |
| Expected Result | Five rows numbered 01–05 in the order persistent, state, approvals, runtimes, remote; each row has a number, a title and exactly one claim paragraph; the band has an accessible name and carries no visible heading that repeats row 01; below `md` a row stacks its copy above its panel (`FR-002.1`, `FR-002.4`, `FR-002.9`, `information_architecture.md` §7 SEC-013) |

**TC-F002-006: Each capability row carries the evidence panel its kind defines**

| Field | Value |
|-------|-------|
| TC ID | TC-F002-006 |
| Related UC | UC-001 |
| Related Feature | F002 |
| Test Scenario | The right column illustrates the claim above it, and stays inert |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | `ENT-013.evidence` for all five rows |
| Test Steps | 1. Read each row's panel  2. Match the panel's contents to its row  3. Confirm row 04's note carries both derived counts  4. Attempt to focus and activate anything inside a panel |
| Expected Result | Row 01 shows terminal tabs, row 02 three agents in the words idle/working/blocked, row 03 the permission prompt with its three answers, row 04 the runtime names with `21 detected · 9 also configurable`, row 05 the monitor address and its clients; a state is never signalled by colour alone; no element inside a panel is focusable or interactive; the copy comes from the typed module (`FR-002.4`, `FR-002.5`, `design_system.md` §9.6, `CLR-001`) |

### 3.3 Feature F003: Agent Runtime Showcase

> **Revised 2026-09-14 (v1.2).** The roster of chips (`SEC-003` in the v1.1 numbering) was deleted, and `F003` is retired in `docs/srs.md` v1.2: `FR-003.1`–`FR-003.6` are withdrawn. The derivation rules `BR-003.1`–`BR-003.7` remain in force and are what these cases exercise; `BR-003.7` carries the panel's below-`md` readability rule (v1.1 `FR-003.6`). Detection now surfaces in two places, both in `F002`: capability row 04, whose body and evidence note carry the derived 21 / 9, and the stat strip's `21 agent CLIs detected` cell (`FR-002.7`). `ENT-002` is unchanged and remains the only source of those numbers.

#### 3.3.1 UC-004: Explore Supported Agent Runtimes

**TC-F003-001: Row 04 and the stat strip state 21 detected and 9 configurable, both derived**

| Field | Value |
|-------|-------|
| TC ID | TC-F003-001 |
| Related UC | UC-004 |
| Related Feature | F003 |
| Test Scenario | Both counts render from the data, in the claim and in the figures |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | `ENT-002` as authored |
| Test Steps | 1. Read row 04's claim  2. Read its evidence panel's note  3. Read the stat strip  4. Count `resources/manifests/*.toml` and the adapters in `src-tauri/src/agents/index.rs` |
| Expected Result | Row 04's claim states 21, its panel notes `21 detected · 9 also configurable`, and the stat strip labels its cell `agent CLIs detected`; every number matches the application repository (`FR-002.7`, `BR-003.1`, `BR-003.2`) |

**TC-F003-002: Runtime names in row 04 are data, not controls**

| Field | Value |
|-------|-------|
| TC ID | TC-F003-002 |
| Related UC | UC-004 |
| Related Feature | F003 |
| Test Scenario | The runtime names read as data, not as a selector |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | None |
| Test Steps | 1. Press `Tab` through row 04  2. Attempt to click a name and to activate it with `Enter` and `Space`  3. Inspect the element's role and cursor |
| Expected Result | `Tab` never stops on a runtime name; no activation occurs; no `role="button"` and no pointer cursor; the names are list items inside the evidence panel, resolved from the agent roster so the figure cannot name a runtime the roster lacks, and the panel wraps below `md` with no horizontal scrolling (`FR-002.4`, `FR-002.11`, `BR-003.7`, `design_system.md` §9.6) |

**TC-F003-003: Build rejects a roster that violates either count, or a typed-in derived count**

| Field | Value |
|-------|-------|
| TC ID | TC-F003-003 |
| Related UC | UC-004 |
| Related Feature | F003 |
| Test Scenario | The counts are enforced at build time, wherever they are rendered |
| Type | Negative |
| Preconditions | Fixture copy of the roster and of the capability content module |
| Test Data | (a) 20 entries; (b) 8 entries marked `configurable`; (c) row 04's body with `21` typed as a literal instead of taken from `ENT-002` |
| Test Steps | 1. Apply each fixture in turn  2. Run the build on each |
| Expected Result | Each build fails with the corresponding invariant error; the third fails on the derived-count rule that `src/content/caps.ts` now owns, so a stale number cannot ship (`BR-002.2`, `BR-003.1`, `BR-003.2`) |

**TC-F003-004: Copy never implies all 21 agents are configurable**

| Field | Value |
|-------|-------|
| TC ID | TC-F003-004 |
| Related UC | UC-004 |
| Related Feature | F003 |
| Test Scenario | Wording keeps detection and configuration distinct |
| Type | Negative |
| Preconditions | Content corpus as authored |
| Test Data | Every sentence that mentions agents: row 04 of `SEC-013`, its evidence note, and the stat strip label |
| Test Steps | 1. Read every sentence that mentions agents  2. Look for a claim that all detected agents can be configured, or a count applied to the wrong verb |
| Expected Result | No such sentence exists; `detected` and `configurable` appear with their distinguishing verb in every occurrence, and the strip's label names CLIs rather than configurations (`BR-003.3`, `BR-003.5`) |

**TC-F003-005: The stat strip states three repository-owned figures with their labels**

| Field | Value |
|-------|-------|
| TC ID | TC-F003-005 |
| Related UC | UC-004 |
| Related Feature | F003 |
| Test Scenario | Each figure the site states is one it can stand behind |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | `ENT-015.staticFacts` |
| Test Steps | 1. Read the strip's cells  2. Read each value and its label as a pair  3. Follow each cell's destination  4. Check the strip's accessible name |
| Expected Result | The strip renders `21 agent CLIs detected` linking `#capabilities`, `3 platforms · macOS, Linux, Windows` linking `#install`, and `MIT open source license` linking the tracked licence file; the strip has an accessible name; no figure is stated without the label that says what it counts, and each figure comes from the module that owns it (`FR-002.7`, `FR-002.8`, `BR-002.2`, `ENT-015`) |

**TC-F003-006: An unreadable star count drops the item instead of faking a number**

| Field | Value |
|-------|-------|
| TC ID | TC-F003-006 |
| Related UC | UC-004 |
| Related Feature | F003 |
| Test Scenario | The one external figure fails closed |
| Type | Exception |
| Preconditions | The GitHub API stub made to fail, or to answer with a non-numeric `stargazers_count` |
| Test Data | (a) HTTP 403 from the API; (b) HTTP 200 with `stargazers_count: null` |
| Test Steps | 1. Rebuild with each fixture  2. Count the strip's cells  3. Inspect the served HTML for a placeholder figure or a dash  4. Confirm the rest of the page is intact |
| Expected Result | The strip renders three cells; the star cell is absent entirely — not zero, not a dash, not a stale number; the build and the page succeed (`BR-002.3`, `BR-007.3`) |

**TC-F003-007: No GitHub metadata request is made from the visitor's browser**

| Field | Value |
|-------|-------|
| TC ID | TC-F003-007 |
| Related UC | UC-004 |
| Related Feature | F003 |
| Test Scenario | Reading the figure does not send the visitor to a third party |
| Type | Negative |
| Preconditions | Production build served; network log open |
| Test Data | None |
| Test Steps | 1. Load `/` with the network log open  2. Filter the requests for `api.github.com`  3. Read the star value as rendered  4. Read the response headers for the revalidation window |
| Expected Result | No request to `api.github.com` originates from the document; the figure arrives already rendered and is revalidated hourly on the server; a visitor's browser is never sent to a third party to read a number (`NFR-004.4`, `BR-007.3`) |

### 3.4 Feature F004: Waitlist Capture

#### 3.4.1 UC-002: Join the Waitlist

**TC-F004-001: Valid submission creates a contact and shows the success state**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-001 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | The main flow completes end to end |
| Type | Positive |
| Preconditions | Resend stub returns a created contact; page loaded at `SEC-007` |
| Test Data | `waitlist-test@example.com` |
| Test Steps | 1. Enter the address  2. Activate **Notify me**  3. Observe the button state  4. Read the response  5. Read the live region |
| Expected Result | Button enters loading state with the input disabled; request is `POST /api/waitlist`; response is `200` with `ok: true`; the stub received `{ email, unsubscribed: false }`; the live region confirms registration and states that one email will arrive at release (`FR-004.3`, `FR-004.5`) |

**TC-F004-002: Repeat address returns the identical success response**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-002 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Alt-1. A second submission of the same address discloses nothing and creates nothing |
| Type | Positive |
| Preconditions | Stub reports the contact as already existing |
| Test Data | The same address submitted twice |
| Test Steps | 1. Submit  2. Record status and body  3. Submit again  4. Compare the two responses byte for byte |
| Expected Result | Both responses are `200` with the same body; no duplicate contact is created; nothing distinguishes the second response from the first (`BR-004.5`, `FR-004.6`) |

**TC-F004-003: Filled honeypot is discarded and answered as success**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-003 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Alt-3. A naive bot gains no signal that it was detected |
| Type | Positive |
| Preconditions | Stub records whether it was called |
| Test Data | `email: waitlist-test@example.com`, `website: "http://spam.example"` |
| Test Steps | 1. POST the payload  2. Read the response  3. Check whether the stub was called |
| Expected Result | `200` with the success body; the stub was never called; no contact exists; the honeypot value appears nowhere in any log (`BR-004.6`) |

**TC-F004-004: Hero and navigation waitlist actions reach the form and focus the input**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-004 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Alt-2. Arrival from an action elsewhere on the page lands on a usable form |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | None |
| Test Steps | 1. Activate the hero waitlist action  2. Observe the scroll position and `document.activeElement`  3. Repeat from the navigation action |
| Expected Result | The page scrolls to `SEC-007` with the heading clear of the fixed navigation and the email input ends up focused; the install section offers no equivalent action and is not the source of the arrival (`FR-004.4`, `FR-005.1`, `sys_uc_002.md` §State transitions) |

**TC-F004-005: Whitespace is trimmed and duplicates compare case-insensitively**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-005 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Alt-5. Trivial variation does not create a second contact |
| Type | Positive |
| Preconditions | Stub reports the second address as existing |
| Test Data | `  waitlist-test@example.com  `, then `Waitlist-Test@Example.com` |
| Test Steps | 1. Submit the padded address  2. Inspect the payload the stub received  3. Submit the varied-case address  4. Compare the responses |
| Expected Result | The stub receives the trimmed value with no surrounding whitespace; the second submission is treated as the same subscriber and returns the identical success response |

**TC-F004-006: Invalid address is caught client-side with no request sent**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-006 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Exc-1, first half. An obviously invalid value costs no request |
| Type | Negative |
| Preconditions | Page loaded; network requests observed |
| Test Data | `not-an-email`, then `missing@domain` |
| Test Steps | 1. Type the value  2. Move focus out of the field  3. Read the inline error  4. Check the network log |
| Expected Result | An inline error is displayed and associated with the input via `aria-describedby`; no request is issued (`FR-004.4`) |

**TC-F004-007: Invalid address reaching the server returns 400 `invalid_email`**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-007 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Exc-1, second half. The server repeats every rule the client checks |
| Type | Negative |
| Preconditions | Server validation exercised directly |
| Test Data | (a) `not-an-email`; (b) an address of 255 characters; (c) a local part of 65 characters |
| Test Steps | 1. POST each payload  2. Read status and body  3. Observe the UI state after a forced rejection |
| Expected Result | Each returns `400` with `error: "invalid_email"` and a `details` entry; the form re-enables, retains the typed value, and keeps the error visible until the value changes; no contact is created (`FR-004.4`, `NFR-002.5`) |

**TC-F004-008: Upstream error or timeout returns a generic 502 and keeps the address**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-008 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Exc-2. A subscriber is never silently lost |
| Type | Exception |
| Preconditions | Stub configured to return an error, then to hang past ten seconds, then to reject the key |
| Test Data | A valid address |
| Test Steps | 1. Submit under each stub configuration  2. Read status and body  3. Inspect the UI  4. Inspect the server log |
| Expected Result | Each returns `502` with `error: "upstream_unavailable"` and a generic message; the upstream body, status text, and key appear nowhere in the response or the log; the form exits loading, re-enables, retains the address, and offers retry (`NFR-002.4`, `NFR-004.1`) |

**TC-F004-009: Request from another origin is rejected with 403**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-009 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Exc-3. The endpoint cannot be used as an open relay |
| Type | Exception |
| Preconditions | Stub records whether it was called |
| Test Data | Requests with (a) `Origin: https://example.com`; (b) no `Origin` header |
| Test Steps | 1. POST each request  2. Read the status  3. Check the stub call count |
| Expected Result | Both return `403`; the stub is never called; rejection happens before validation and before any upstream call (`NFR-002.2`) |

**TC-F004-010: The sixth submission in a minute returns 429**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-010 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Exc-4. Abuse is slowed within one instance |
| Type | Exception |
| Preconditions | Fresh function instance; stub returns success |
| Test Data | Six valid submissions from one address within a minute |
| Test Steps | 1. Submit five times  2. Submit a sixth  3. Read the sixth response  4. Observe the UI |
| Expected Result | The first five succeed; the sixth returns `429` with `error: "rate_limited"`; the UI shows a non-destructive error and keeps the typed address (`NFR-002.3`) |

**TC-F004-011: Submission succeeds with JavaScript disabled**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-011 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | Alt-4. The no-script path reaches the same outcome |
| Type | Positive |
| Preconditions | JavaScript disabled; stub returns success |
| Test Data | A valid address |
| Test Steps | 1. Submit the native form  2. Observe the redirect  3. Read the resulting page's outcome text |
| Expected Result | The form posts as `application/x-www-form-urlencoded`; the handler validates identically; the visitor lands back on `PAGE-001` and the outcome is stated in text (`FR-004.9`) |

**TC-F004-012: Non-POST verb returns 405**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-012 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | The endpoint accepts one verb only |
| Type | Negative |
| Preconditions | Stub records calls |
| Test Data | `GET`, `PUT`, `DELETE` against `/api/waitlist` |
| Test Steps | 1. Issue each request  2. Read the status  3. Check the stub call count |
| Expected Result | Each returns `405` with `error: "method_not_allowed"`; the stub is never called |

**TC-F004-013: No subscriber address is logged and no server secret reaches the client**

| Field | Value |
|-------|-------|
| TC ID | TC-F004-013 |
| Related UC | UC-002 |
| Related Feature | F004 |
| Test Scenario | The privacy statement's claims hold under a real submission |
| Type | Positive |
| Preconditions | Stub returns success; server log captured; client bundle available |
| Test Data | A distinctive documentation address |
| Test Steps | 1. Submit  2. Search the full server log for the address  3. Search the built client bundle for the API key and for the address  4. Inspect response headers and browser storage |
| Expected Result | The address appears in no log; the key appears in no client asset; no cookie is set; no storage is written (`NFR-002.1`, `NFR-002.4`) |

### 3.5 Feature F005: Install and Platform Availability

#### 3.5.1 UC-003: Install Bentomux

**TC-F005-001: Three OS options render and macOS is the selection in the server-rendered HTML**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-001 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | The switcher is a closed set with a deterministic default that does not depend on script |
| Type | Positive |
| Preconditions | Production build served; response body captured before any script runs |
| Test Data | `ENT-005` as authored |
| Test Steps | 1. Read the raw HTML of `SEC-006`  2. Count the options and read their labels  3. Read which input carries `checked`  4. Tab to the group and observe the tab stop count |
| Expected Result | Exactly three options labelled macOS, Linux and Windows; macOS is the one carrying `checked` in the server response; the group occupies a single tab stop (`FR-005.1`, `FR-005.2`) |

**TC-F005-002: Arrow keys move the selection, the panels follow with no script, and nothing is persisted**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-002 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | The switcher is keyboard-operable and its side effects are confined to visibility |
| Type | Positive |
| Preconditions | Switcher rendered; network and storage inspected |
| Test Data | None |
| Test Steps | 1. Focus the group and press the arrow keys through all three options  2. Observe the visible panel after each press  3. Watch the network panel and `document.cookie` and `localStorage`  4. Confirm the URL does not change |
| Expected Result | Focus moves within the group; the visible panel follows the selection; no request is issued by the page; nothing is written to cookies or storage; the URL does not change (`FR-005.1`, `FR-005.6`, `BR-005.8`) |

**TC-F005-003: All three panels are present in the server HTML and exactly one is visible**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-003 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | Panel availability does not depend on JavaScript |
| Type | Positive |
| Preconditions | JavaScript disabled; production build served |
| Test Data | None |
| Test Steps | 1. Load `/` with JavaScript off  2. Search the response for each platform command  3. Confirm which panel is visible under CSS |
| Expected Result | All three panels exist in the document; exactly one panel is visible and it is the macOS panel, because macOS is the selected option; no empty region or placeholder is shown (`FR-005.6`, `NFR-007.3`) |

**TC-F005-004: Every rendered command matches its repository source byte for byte**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-004 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | Executable text is transcribed, never paraphrased |
| Type | Positive |
| Preconditions | A checkout of `../Bentomux-v2` available to the test |
| Test Data | `INSTALLERS`: the install block of `README.md` in `../Bentomux-v2`, and the three short links it publishes (`/install.sh`, `/install.ps1`, `/install.cmd`) |
| Test Steps | 1. Read each command string from the rendered page  2. Read the corresponding string from the README install block  3. Compare byte for byte  4. Confirm each short link resolves to the matching `installers/*` file with a 307  5. Repeat for every panel including the fallback commands |
| Expected Result | Each rendered command is byte-identical to a string in the README install block; a divergence is a `BR-005.1`/`BR-005.9` content defect, caught by review against the block rather than by a build check (`CON-014`, `DS CMD-002`) |

**TC-F005-005: Every command and download host belongs to the project repository**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-005 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | No mirror, CDN or third-party download page is introduced |
| Type | Negative |
| Preconditions | Rendered markup extracted as text |
| Test Data | A scan pattern over every `http` occurrence in `SEC-006` |
| Test Steps | 1. Extract every URL rendered in the section  2. Compare each host against the permitted pair  3. Confirm the manual-download link points to `releases/latest` on the repository host |
| Expected Result | Only `SiteConfig.siteUrl` (the `/install.sh`, `/install.ps1`, `/install.cmd` short links, which are 307 redirects and not copies) and `github.com/takora-dev/bentomux-v2` appear; `raw.githubusercontent.com` appears in no rendered command. A command naming any other host fails the build through the host invariant in `src/content/install.ts` (`BR-005.2`, `FR-005.11`) |

**TC-F005-006: No version literal, date, size, package-manager channel or Homebrew command appears**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-006 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | The section states no fact the release does not support |
| Type | Negative |
| Preconditions | Rendered text of the whole page extracted |
| Test Data | A scan pattern set: digit-bearing version strings, dates, byte sizes, the channel names of `BR-005.3`, and `brew` |
| Test Steps | 1. Scan the section text for each pattern  2. Confirm the only version-shaped string is `vX.Y.Z`  3. Confirm `apt` appears once and only inside the libfuse2 note  4. Confirm no channel name is presented as an install route  5. Confirm no Homebrew command or cask reference exists |
| Expected Result | The only version literal is the `vX.Y.Z` placeholder; no date or download size is stated; no package manager is advertised as a channel; no Homebrew text appears anywhere; each violation fails the build with its own code (`BR-005.3`, `BR-005.4`, `BR-005.6`, `CON-015`) |

**TC-F005-007: The Linux panel shows the AppImage command, the `--deb` alternative, and the libfuse2 note**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-007 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | The Linux path is complete and its one privileged branch is labelled |
| Type | Positive |
| Preconditions | Linux option selected |
| Test Data | `install.sh` and its `--help` text |
| Test Steps | 1. Select Linux  2. Read the primary command  3. Read the `--deb` alternative and its root note  4. Read the FUSE note  5. Confirm `sudo` appears nowhere else in the section |
| Expected Result | The AppImage command is the primary one; `--deb` is present, described as needing root, and is not prefixed with `sudo`; the libfuse2 note is present and is the only place `sudo` appears (`FR-005.7`, `BR-005.5`, `DS CMD-006`) |

**TC-F005-008: The macOS panel states the build is unsigned and gives the first-launch path**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-008 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | A visitor who meets Gatekeeper is told what to expect before it happens |
| Type | Positive |
| Preconditions | macOS option selected; this is the default panel |
| Test Data | The README install block and the installer's macOS branch |
| Test Steps | 1. Read the macOS panel without interacting  2. Look for the signing statement  3. Look for the first-launch instruction |
| Expected Result | The panel states that the build is not signed or notarized and that macOS may require confirmation of the first launch under System Settings → Privacy & Security; no dialog text is invented beyond that path (`FR-005.8`) |

**TC-F005-009: The Windows panel shows the PowerShell command, the `install.cmd` fallback, and the no-admin statement**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-009 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | The Windows path covers the environment where PowerShell cannot reach the internet |
| Type | Positive |
| Preconditions | Windows option selected |
| Test Data | `install.ps1`, `install.cmd`, and the README install block |
| Test Steps | 1. Select Windows  2. Read the PowerShell command  3. Read the fallback command and its stated purpose  4. Read the privilege statement |
| Expected Result | Both commands render verbatim; the fallback is described as existing for environments that block PowerShell downloads; the section states that the per-user install needs no administrator rights (`FR-005.9`) |

**TC-F005-010: The section states what the installer does, including the refusal on digest mismatch**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-010 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | Verification behaviour is disclosed rather than implied |
| Type | Positive |
| Preconditions | Any panel selected |
| Test Data | `install.sh` and the README install block |
| Test Steps | 1. Read the installer explanation  2. Count the steps  3. Confirm the digest step states what happens on mismatch |
| Expected Result | Three steps are stated: read the release manifest, download and verify the SHA-256 digest, then install; the digest step states that installation is refused when the digest does not match (`FR-005.10`, `BUILD_STEP_COUNT`) |

**TC-F005-011: The manual download line names five formats behind one link**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-011 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | A visitor who prefers to download by hand is served without a second surface being built |
| Type | Positive |
| Preconditions | Any panel selected; release published |
| Test Data | `ManualDownloadList` and `SiteConfig.releasesLatestUrl` |
| Test Steps | 1. Read the manual-download line  2. Count the format labels  3. Count the links  4. Follow the link |
| Expected Result | One line naming `.dmg`, `.AppImage`, `.deb`, `.msi` and `-setup.exe`, behind a single link to the latest release; the link resolves once `LP-007` holds (`FR-005.11`, `DS CMD-005`) |

**TC-F005-012: The pin example uses `vX.Y.Z` and the manifest override the installer documents**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-012 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | The pinned path is the installer's own override, not an invented one |
| Type | Positive |
| Preconditions | Pin example present in the section |
| Test Data | `BENTOMUX_MANIFEST_URL` from `install.sh` |
| Test Steps | 1. Read the pin example  2. Confirm the placeholder spelling  3. Compare its manifest URL against the installer default with `/latest/download/` replaced by `/download/vX.Y.Z/`  4. Confirm the environment variable name |
| Expected Result | The example pins the version as `vX.Y.Z` and overrides `BENTOMUX_MANIFEST_URL`; the URL matches the installer default apart from the version segment (`FR-005.12`, `BR-005.1`) |

**TC-F005-013: The copy control copies the exact command and reports both outcomes in text**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-013 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | Copying is the section's most used interaction and must never be the only feedback channel |
| Type | Positive |
| Preconditions | Clipboard permission granted, then denied for the failure half |
| Test Data | A rendered command |
| Test Steps | 1. Activate the copy control with permission granted  2. Compare the clipboard contents with the rendered string  3. Activate again with permission denied  4. Read the reported outcome in both states  5. Select the command by hand after the failure |
| Expected Result | The clipboard holds exactly the rendered command; success and failure are each reported as text inside the block; after a failure the command remains selectable and reaches the clipboard by hand (`FR-005.5`, `DS CPY-001`, `DS CPY-002`, `DS CPY-003`) |

**TC-F005-014: Detected-platform preselection never overrides an explicit choice**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-014 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | A helpful default must not become a refusal to listen |
| Type | Exception |
| Preconditions | Client with a spoofed platform hint that disagrees with the visitor's actions |
| Test Data | A platform string different from the option the visitor selects |
| Test Steps | 1. Load the page  2. Select an option explicitly  3. Observe whether the selection reverts  4. Confirm the rendered text and layout of the panels are unchanged by detection |
| Expected Result | Detection runs at most once, before any interaction; an explicit selection is never overridden; no panel text changes and no layout shift occurs (`FR-005.4`, `BR-005.8`) |

**TC-F005-015: The Linux x86_64 limit is stated and no arm64 support is implied**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-015 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | Architecture support is stated exactly as far as the release pipeline goes |
| Type | Negative |
| Preconditions | Any panel selected |
| Test Data | The release workflow matrix |
| Test Steps | 1. Read the Linux panel  2. Look for the architecture statement  3. Scan the section for any Apple Silicon or arm64 wording |
| Expected Result | The section states that Linux builds are published for x86_64 only and that no aarch64 Linux build exists yet; no other architecture is named as supported (`FR-005.13`, `BR-005.7`) |

**TC-F005-016: The section is not announced while the install commands cannot resolve**

| Field | Value |
|-------|-------|
| TC ID | TC-F005-016 |
| Related UC | UC-003 |
| Related Feature | F005 |
| Test Scenario | The primary action is gated on a real release rather than on copy that merely looks finished |
| Type | Exception |
| Preconditions | Release gate evaluated as part of the release checklist, not of the build |
| Test Data | `https://github.com/takora-dev/bentomux-v2/releases/latest/download/latest.json` |
| Test Steps | 1. Request the manifest URL  2. Read the status  3. If the release is absent, confirm the announcement is blocked while the section itself remains reviewable |
| Expected Result | While the manifest does not resolve the site must not be announced (`LP-007`); the failure is recorded as an open exit criterion rather than worked around by softening the copy |

### 3.6 Feature F006: FAQ

> **Retired 2026-09-14 (v1.2).** The FAQ band (`SEC-008` in the v1.1 numbering, `ENT-006`) was deleted with the landing-page rebuild; the page has no question-and-answer surface left. The five cases below keep their identifiers so the traceability tables and the execution sheet keep a stable denominator. None of them is executed against v1.2.

#### 3.6.1 UC-005: Read the FAQ — Removed (2026-09-14)

| TC ID | Status | Reason the case no longer applies |
|-------|--------|-----------------------------------|
| TC-F006-001 | Removed (2026-09-14) | Eight items, seven mandated topics and an `aria-expanded` default no longer exist; there is no disclosure control on the page. |
| TC-F006-002 | Removed (2026-09-14) | The independence rule between items belonged to the accordion, which was removed with the FAQ band (`SEC-008` in the v1.1 numbering). |
| TC-F006-003 | Removed (2026-09-14) | The "answers present before expansion" rule had one subject — the collapsed answers. Every band now renders its text unconditionally, which the amended TC-F001-001 and TC-F001-004 cover. |
| TC-F006-004 | Removed (2026-09-14) | The release-date ban is not dropped: it is carried by TC-F005-006 for the install band, which is now the only place a date or a version could appear. |
| TC-F006-005 | Removed (2026-09-14) | The upstream comparison had two render sites; one was the FAQ answer. The statement was reduced to a single footer credit, and is now removed entirely (2026-09-15) — the no-drift intent survives in TC-F009-007. |

### 3.7 Feature F007: Project Links, Community and Repository Star

> **Revised 2026-09-14 (v1.2).** The four-card community band (`SEC-009` in the v1.1 numbering) was deleted. The links it held survive in the footer's Project and Support groups (`ENT-008`), and the star figure now appears in the stat strip with its source stated. Two cases are retired, two are re-homed.

#### 3.7.1 UC-006: Open the Project Links and Star the Repository

**TC-F007-001 / TC-F007-004 — Removed (2026-09-14)**

| TC ID | Status | Reason the case no longer applies |
|-------|--------|-----------------------------------|
| TC-F007-001 | Removed (2026-09-14) | The four-card grid and `ENT-007` were deleted. Its still-valid half — every external destination carries `rel="noopener noreferrer"` and announces the new context — is now checked against the footer groups by TC-F009-001 and the v1.2 smoke check for `FR-007.6`. |
| TC-F007-004 | Removed (2026-09-14) | `targetKey` resolution existed only in the community module. The footer group builder now asserts link-id uniqueness instead, which the build enforces for both remaining groups. |

**TC-F007-002: No numeric issue, fork, contributor or install count appears anywhere**

| Field | Value |
|-------|-------|
| TC ID | TC-F007-002 |
| Related UC | UC-006 |
| Related Feature | F007 |
| Test Scenario | No fabricated or unverifiable figure is displayed |
| Type | Negative |
| Preconditions | Production build served |
| Test Data | None |
| Test Steps | 1. Scan the whole page for a numeral next to `issues`, `forks`, `contributors`, `installs`, `downloads` or `users`  2. Read the stat strip's star cell  3. Check that the figure is labelled with whose it is  4. Check it is not older than the revalidation window |
| Expected Result | No issue, fork, contributor, install, download or user count appears anywhere; the star count may appear, and only as `GitHub stars`; no figure is stated as a bare numeral (`BR-007.3`, `BR-002.3`, `NFR-004.4`) |

**TC-F007-003: The contact action is a `mailto:` link and the waitlist is the only form**

| Field | Value |
|-------|-------|
| TC ID | TC-F007-003 |
| Related UC | UC-006 |
| Related Feature | F007 |
| Test Scenario | Private enquiries have a path, and no address-collecting form was invented |
| Type | Negative |
| Preconditions | Production build served |
| Test Data | None |
| Test Steps | 1. Inspect the footer's contact link  2. Search the whole document for a `form` element  3. Check whether a contact address is printed as body text |
| Expected Result | The footer's contact link begins with `mailto:` while `contactEmail` is configured, and is absent while it is not; the waitlist form is the only `form` on the page; no address is exposed as plain text (`BR-007.4`, `FR-007.5`) |

### 3.8 Feature F008: Theme Palette Preview

> **Retired 2026-09-14 (v1.2).** The palette preview (`SEC-005` in the v1.1 numbering, `ENT-004`) was deleted with the landing-page rebuild. The site ships one theme — the Bentomux blue on the dark canvas — and offers no theme selector, no ink/paper toggle and no `--palette-*` property anywhere in the stylesheet. The six cases below keep their identifiers; none is executed against v1.2.

#### 3.8.1 UC-007: Preview Theme Palettes — Removed (2026-09-14)

| TC ID | Status | Reason the case no longer applies |
|-------|--------|-----------------------------------|
| TC-F008-001 | Removed (2026-09-14) | There is no palette set, no selector and no `default` entry; the eight names are gone from the copy. |
| TC-F008-002 | Removed (2026-09-14) | The roving-tabindex radio-group contract belonged to the selector. The page's remaining composite control is the install switcher, covered by TC-F005-002. |
| TC-F008-003 | Removed (2026-09-14) | With no selector there is no selection to persist. The equivalent rule for the mock's presentation state is now TC-F001-011. |
| TC-F008-004 | Removed (2026-09-14) | The `CONTENT_PALETTE_DRIFT` comparison had no subject once `ENT-004` was deleted; no token in the site is copied from the application stylesheet. |
| TC-F008-005 | Removed (2026-09-14) | The leak and contrast sweep is replaced by a build-level check: the stylesheet must contain no palette rule or `--palette-*` declaration at all (see `globals.css` and the v1.2 smoke check). |
| TC-F008-006 | Removed (2026-09-14) | The no-script palette claim cannot exist for a feature that was removed; TC-F001-004 now covers the no-script reading path for the bands that remain. |

### 3.9 Feature F009: Licensing, Attribution and Privacy

#### 3.9.1 UC-008: Read the License, Attribution, and Privacy Statement

**TC-F009-001: Footer states the licence plainly and links the tracked licence file**

| Field | Value |
|-------|-------|
| TC ID | TC-F009-001 |
| Related UC | UC-008 |
| Related Feature | F009 |
| Test Scenario | The licence statement matches the file the repository actually tracks |
| Type | Positive |
| Preconditions | `licenseFilePublished = true`; `../Bentomux-v2/LICENSE` present on `master` and read by the test |
| Test Data | `ENT-001` legal attributes; the tracked `LICENSE` file |
| Test Steps | 1. Read `licenseId` from `LICENSE`  2. Read the footer sentence  3. Follow the licence link  4. Confirm no deferred wording remains |
| Expected Result | The footer and `/privacy` state the same licence identifier as the tracked file — MIT — and the licence link resolves; no deferred or hedged wording appears (`FR-009.7`, `BR-009.1`, `CON-008`) |

**TC-F009-002: `/privacy` renders all eight blocks in order**

| Field | Value |
|-------|-------|
| TC ID | TC-F009-002 |
| Related UC | UC-008 |
| Related Feature | F009 |
| Test Scenario | The statement is complete, not a stub |
| Type | Positive |
| Preconditions | Production build served |
| Test Data | The eight blocks defined in `sys_uc_008.md` |
| Test Steps | 1. Open `/privacy`  2. Read the blocks in order  3. Verify each block's content against the contract, especially the "not collected" list |
| Expected Result | Eight non-empty blocks in the fixed order; the "not collected" block names analytics, cookies, advertising identifiers, session replay, third-party scripts, and retained IP addresses; the removal path names the contact address (`FR-009.5`, `FR-009.6`) |

**TC-F009-003: Footer and `/privacy` legal text are identical**

| Field | Value |
|-------|-------|
| TC ID | TC-F009-003 |
| Related UC | UC-008 |
| Related Feature | F009 |
| Test Scenario | One source, two render sites, no divergence |
| Type | Negative |
| Preconditions | Both pages rendered |
| Test Data | The licence sentence, attribution, trademark disclaimer, and copyright line |
| Test Steps | 1. Extract each string from the footer  2. Extract the same string from `/privacy`  3. Compare character by character |
| Expected Result | All four strings are identical; the test fails on any whitespace or wording difference (`XPG-001`) |

**TC-F009-004: No tracking: no cookie, no third-party script, no storage write**

| Field | Value |
|-------|-------|
| TC ID | TC-F009-004 |
| Related UC | UC-008 |
| Related Feature | F009 |
| Test Scenario | The privacy statement describes the site's actual behaviour |
| Type | Negative |
| Preconditions | Production build served; network and storage observed |
| Test Data | None |
| Test Steps | 1. Load `/` and `/privacy` with the network log open  2. Inspect response headers for `Set-Cookie`  3. List all scripts and classify their origins  4. Inspect storage before and after browsing every section |
| Expected Result | No `Set-Cookie`; every script is same-origin; no `localStorage` or `sessionStorage` write; no analytics or tag-manager request. Under a privacy-review pass, the "not collected" block is true as written (`NFR-008.4`) |

**TC-F009-005: The MIT statement is not the only licence text, and no page denies it** — **Removed (2026-09-15)**, replaced by TC-F009-007. The case distinguished the project's own licence from a credit line for an upstream project; with the port claim withdrawn there is no second licence on the site to keep separate. The licence-identifier guard survives unchanged in TC-F009-001 and TC-F009-004.

**TC-F009-006: The attribution credit appears while the duty it creates is still open** — **Removed (2026-09-15)**, replaced by TC-F009-007. There is no credit to render, so there is no open duty for the copy to avoid claiming as closed (`FR-009.8` / `LP-002` remain open in `docs/srs.md`, which is now a repository-side matter with no site rendering).

**TC-F009-007: Nothing on the site names an upstream project**

| Field | Value |
|-------|-------|
| TC ID | TC-F009-007 |
| Related UC | UC-008 |
| Related Feature | F009 |
| Test Scenario | The withdrawn provenance claim stays withdrawn |
| Type | Negative |
| Preconditions | Production build served from `next start` |
| Test Data | The SSR HTML of `/` and `/privacy` |
| Test Steps | 1. Fetch both pages  2. Scan the rendered HTML case-insensitively for the upstream project's name  3. Scan for any Apache-2.0 mention  4. Confirm the licence statement still names MIT |
| Expected Result | Neither page contains the upstream name or an Apache-2.0 mention; the MIT licence sentence renders as before. Enforced by the two negative assertions in `scripts/smoke.mjs` and by TC-F009-001 (`FR-009.2` withdrawn, `BR-009.1`) |

## 4. Traceability Matrix

### 4.1 Test Case → Requirement

| Feature ID | Feature Name | TC IDs |
|------------|--------------|--------|
| F001 | Page Shell, Hero and Navigation | TC-F001-001 … TC-F001-011 |
| F002 | Capability Rows, Application Window and Stat Strip (v1.2) | TC-F002-003 … TC-F002-006; TC-F002-001 and TC-F002-002 removed |
| F003 | Agent Runtime Showcase — retired in `srs.md` v1.2; its derivation rules are exercised through `F002` | TC-F003-001 … TC-F003-007 |
| F004 | Waitlist Capture | TC-F004-001 … TC-F004-013 |
| F005 | Install and Platform Availability | TC-F005-001 … TC-F005-016 |
| F006 | FAQ | All five removed (2026-09-14) |
| F007 | Project Links, Community and Repository Star | TC-F007-002, TC-F007-003; TC-F007-001 and TC-F007-004 removed |
| F008 | Theme Palette Preview | All six removed (2026-09-14) |
| F009 | Licensing, Attribution and Privacy | TC-F009-001 … TC-F009-004, TC-F009-007 |

### 4.2 Test Case → Use Case

| Use Case ID | Use Case Name | TC IDs |
|-------------|---------------|--------|
| UC-001 | Browse the Landing Page | TC-F001-001 … TC-F001-011, TC-F002-003 … TC-F002-006 |
| UC-002 | Join the Waitlist | TC-F004-001 … TC-F004-013 |
| UC-003 | Install Bentomux | TC-F005-001 … TC-F005-016 |
| UC-004 | Explore Supported Agent Runtimes | TC-F003-001 … TC-F003-007 |
| UC-005 | Read the FAQ | None — the flow is retired (2026-09-14); TC-F006-001 … TC-F006-005 are retained identifiers |
| UC-006 | Open the Project Links and Star the Repository | TC-F007-002, TC-F007-003 |
| UC-007 | Preview Theme Palettes | None — the flow is retired (2026-09-14); TC-F008-001 … TC-F008-006 are retained identifiers |
| UC-008 | Read the License, Attribution, and Privacy Statement | TC-F009-001 … TC-F009-004, TC-F009-007 |

### 4.3 Test Case → UCIC

| UCIC | Contract Clause Exercised | TC IDs |
|------|---------------------------|--------|
| UCIC-001 | Component contracts, error handling table | TC-F001-001 … TC-F001-011 |
| UCIC-002 | Status codes, validation rules, error handling table | TC-F004-001 … TC-F004-013 |
| UCIC-003 | Install switcher and command-block contracts, validation rules, panel state | TC-F005-001 … TC-F005-016 |
| UCIC-004 | Derived counts, runtime-name contract, figure-strip contract | TC-F003-001 … TC-F003-007 |
| UCIC-005 | Topic coverage, interaction contract | Retired with the FAQ band (`SEC-008` in the v1.1 numbering, 2026-09-14); no clause is exercised by v1.2 |
| UCIC-006 | `targetKey` resolution table, validation rules | Retired with the community band (`SEC-009` in the v1.1 numbering, 2026-09-14); the footer link builder's uniqueness rule is exercised by TC-F007-003 |
| UCIC-007 | Selector accessibility contract, token scope table | Retired with the palette band (`SEC-005` in the v1.1 numbering, 2026-09-14); the equivalent table for the figure band is exercised by TC-F001-007 … TC-F001-011 |
| UCIC-008 | Legal block content contract, licence rule, eight privacy blocks | TC-F009-001 … TC-F009-006 |

### 4.4 Test Type Summary

| Type | Count |
|------|-------|
| Positive | 34 |
| Negative | 16 |
| Exception | 9 |
| **Total** | **59** |

Fifteen further identifiers are retained as `Removed (2026-09-14)` and are excluded from the counts above: nine positive, four negative and two exception cases whose bands no longer exist.

## 5. Test Execution Notes

### 5.1 Test Environment

| Component | Specification |
|-----------|---------------|
| Browser | Chromium (recent stable) for automation; one manual pass in Safari or WebKit |
| Runtime | Node.js 20 LTS |
| Database | None |
| Upstream | Resend Contacts API, stubbed |
| Deployment under test | Production build served locally, or a Vercel preview |

### 5.2 Test Data Setup

- Content fixtures live beside the tests, one corrupted variant per build-time invariant.
- Waitlist tests use reserved documentation addresses only and always with a stubbed upstream.
- The GitHub metadata read is stubbed in two states: one answering with a real count, one failing. The failing state is the interesting one, because the strip must drop the star cell rather than render a zero (TC-F003-006).
- No teardown is needed: no test writes durable state.

### 5.3 Acronyms

| Acronym | Definition |
|---------|------------|
| TC | Test Case |
| UC | Use Case |
| UCIC | Use Case Integration Contract (`docs/system_logics/`) |
| SoT | Source of Truth |
| UAT | User Acceptance Testing |
| AA | WCAG 2.2 Level AA contrast requirement (4.5:1 for body text) |

## 6. Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-09-13 | F. Jibran | Initial set. Fifty cases derived from the eight user flows and eight UCICs. |
| 1.1 | 2026-09-13 | F. Jibran | Install section rebuilt as `SEC-006` with verbatim installer commands: UC-003 expanded from four card/dialog cases to sixteen switcher, command-fidelity, panel-content and release-gate cases. Licence cases rewritten for the tracked MIT file, plus an attribution-duty case. Sixty-three cases: 36 positive, 18 negative, 9 exception. |
| 1.2 | 2026-09-14 | F. Jibran | Landing page rebuilt to the four-band structure: the agents, feature, palette, FAQ and community bands (`SEC-003`, `SEC-004`, `SEC-005`, `SEC-008`, `SEC-009` in the v1.1 numbering) removed. TC-F001-001 rewritten for the four anchored bands; TC-F007-002 amended to ban issue, fork, contributor and install counts while allowing a labelled star figure; five mock and figure cases added to F001, three capability-row cases to F002, three stat-strip cases to F003; fifteen cases retired with dated reasons; UC-005 and UC-007 left without executable cases. Fifty-nine cases: 34 positive, 16 negative, 9 exception. Revised in the same pass: the window mock's sidebar was cut back to workspaces only, because the application has no agent panel — `mockAgentRows` and the `MockAgentRow` entity are gone, TC-F001-007 is re-pointed at the new caption `Three workspaces, one of them waiting on your approval.`, and TC-F001-008 now expects five pressed-state buttons (three workspaces plus the selected workspace's two tabs), not eight. |
| 1.3 | 2026-09-15 | F. Jibran | The withdrawn port claim removed from the site: TC-F009-005 and TC-F009-006 retired and replaced by TC-F009-007, which asserts the absence of any upstream name or Apache-2.0 mention on `/` and `/privacy`. Fifty-eight cases: 33 positive, 17 negative, 9 exception. The footer legal block is now a single column carrying the licence sentence, the trademark disclaimer and the telemetry line; the attribution and non-affiliation sentences and the upstream link are gone (`FR-009.2`, `BR-009.3`, `BR-009.4` remain open in `docs/srs.md`). |
| 1.4 | 2026-09-15 | F. Jibran | The capability rows stopped printing the repository path their claim was checked against, so TC-F002-005 is retired and TC-F002-003 is retitled and re-pointed straight at the application repository — there is no `sourceFeature` field left to compare against. Fifty-seven cases: 32 positive, 17 negative, 9 exception. Enforced by `scripts/smoke.mjs`, which asserts instead that no repository path appears on the page (`FR-002.4`, `FR-002.6`, `BR-002.1` as amended). |
