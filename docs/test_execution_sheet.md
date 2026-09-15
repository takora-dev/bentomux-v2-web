# Test Execution Sheet: Bentomux Landing Page

**Document:** Execution Tracking | **Derived From:** docs/test_cases.md | **Status:** Draft | **Last Updated:** 2026-09-15

> Records actual execution results against the test cases derived from the Sources of Truth. Failures are diagnosed as Implementation error vs Source-of-Truth error (see Revision Loop in SKILL.md).

## 1. Instructions

- Execute each TC from `docs/test_cases.md` and record the actual result and status.
- **Status values:** PASS / FAIL / N/A (blocked or out-of-scope for this run). Leave blank before the run.
- On FAIL: record the actual result, then triage — is the defect in the implementation (fix code) or in a Source of Truth (fix the artifact, re-validate downstream)?
- Row content is generated from `docs/test_cases.md`, so scenario, steps and expected result cannot drift from the case set. Regenerate the rows whenever the case set changes; never edit them here.
- Fifty-nine rows are executable in v1.2. The fifteen cases retained as `Removed (2026-09-14)` in `docs/test_cases.md` keep their identifiers in §7 and §9 but have no row, because there is nothing left on the page to execute them against.
- **Run header (fill per execution run):** Build/commit ________ · Environment ________ · Executor ________ · Date ________

## 2. Feature F001: Page Shell, Hero and Navigation

### 2.1 UC-001: Browse the Landing Page

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status | Notes |
|-------|---------------|------------|-----------------|---------------|--------|-------|
| TC-F001-001 | The document renders `#hero`, `#capabilities`, `#waitlist` and `#install` in order, exactly one `h1`, and none of the retired bands | 1. Open `/`  2. Read the DOM in document order  3. Count `h1` elements  4. List the anchored sections  5. Search the DOM for the retired anchor ids | The four bands appear in the order hero → capabilities → waitlist → install; exactly one `h1` in the hero; no heading level is skipped; `#agents`, `#features`, `#palettes`, `#faq` and `#community` are absent from the document (`sys_uc_001.md` §Main Flow) | | | |
| TC-F001-002 | Following each of the two nav anchors, and the hero's two in-page links, puts the target below the sticky bar | 1. Open `/`  2. Activate each nav anchor  3. Measure the target heading's top offset against the navigation height  4. Activate the hero's two links | Each anchor scrolls to its section and the heading is fully visible, never hidden beneath the 64px bar; the two hero links reach the install band and the form, and the waitlist link moves focus into the email field (`LAY-005`, `NAV-008`, `FR-001.2`, `NFR-007.2`) | | | |
| TC-F001-003 | Keyboard entry lands on the skip link, which becomes visible and moves focus to `main` | 1. Press `Tab` once  2. Observe the focused element  3. Press `Enter` | The skip link is the first focused element, is visible while focused, has an accessible name, and activating it moves focus into the `main` landmark (`NFR-007.2`) | | | |
| TC-F001-004 | Every band's text is present and no interactive surface is required to read the page | 1. Load `/` with JavaScript off  2. Read each band  3. Read all three install panels  4. Submit the waitlist form  5. Read the figure band | All text is present; anchors work natively; the three install panels are readable with macOS selected; the form posts to `/api/waitlist` and shows the no-script note; the mock renders its first workspace with the spinner on its first frame; nothing is hidden behind a control that no longer functions (`NFR-008.4`, `FR-002.3`) | | | |
| TC-F001-005 | Following a hash that no longer matches a section leaves the page usable | 1. Enter the stale URL  2. Observe the scroll position and the page  3. Use the navigation | The page loads normally at the top, no error is displayed, no broken state occurs, and the navigation still works (`sys_uc_001.md` §Error Handling) | | | |
| TC-F001-006 | A nav entry pointing at a nonexistent section, or carrying a hard-coded URL, fails the build | 1. Apply fixture (a)  2. Run the build  3. Apply fixture (b)  4. Run the build | Both builds fail, with `BUILD_ANCHOR_UNRESOLVED` and `BUILD_URL_LITERAL` respectively. Neither reaches a deployable artifact (`BR-001.3`) | | | |
| TC-F001-007 | The band that shows the window is markup, named and captioned | 1. Read the band's heading and hint  2. Read the `figcaption`  3. Search the band's DOM for an `img` element  4. Repeat below `md` | The band carries the heading `the window, with nobody sitting at it` and the hint `click a workspace`; one `figure` holds the mock and the caption `Three workspaces, one of them waiting on your approval.`; the frame is built from markup and contains no `img`; the band sits between the stat strip and the capability rows (`FR-002.2`, `IMG-001`, `MOCK-004`, `design_system.md` §9, §10.3) | | | |
| TC-F001-008 | The mock demonstrates the window instead of only illustrating it | 1. Activate each of the three workspace buttons  2. Read the pane title and its lines  3. Activate each tab inside `bentomux-v2`  4. Activate a workspace and read the sidebar's pressed state  5. Watch the request log | The pane title and lines follow the selection (`bentomux-v2` / `website` / `scratch`); opening a workspace selects its first tab; exactly one workspace button and one tab report `aria-pressed="true"`, and the sidebar holds five pressed-state buttons in total (three workspaces plus the two tabs of the selected one) with no agent list among them; the working pane shows the spinner and the running timer; no request is made (`FR-002.2`, `FR-002.3`, `FR-002.11`, `MOCK-001`) | | | |
| TC-F001-009 | The mock is operable, and honest about what it is | 1. `Tab` into the frame and continue to the end of it  2. Activate a workspace and a tab with `Enter` and `Space`  3. Inspect the frame's role and accessible name  4. Inspect the tab strip's roles | Every workspace and tab control is a native `button` in document order, reachable and operable from the keyboard; the sidebar lists workspaces only and carries no agent panel (`FR-002.2`); the frame is a labelled `group` rather than a `tablist`, so no tab semantics are promised for a window that is not running; the selected entries expose their state, and the band stays readable without operating it (`FR-002.3`, `NFR-007.8`, `NFR-007.12`, `MOCK-001`, `design_system.md` §9.7) | | | |
| TC-F001-010 | The only animation on the page stops when the visitor asks it to | 1. Load `/` with the preference set  2. Watch the working line for ten seconds  3. Read the timer text  4. Inspect the page for any running animation | The spinner frame and the working timer never advance; the line stays readable as static text; no transition or animation runs anywhere on the page; the server HTML and the first client render are identical (`FR-002.10`, `NFR-007.13`, `MOT-003`, `MOT-004`, `MOCK-003`) | | | |
| TC-F001-011 | Looking at another surface leaves no trace and does not survive a reload | 1. Select a workspace and a tab other than the first  2. Inspect cookies, `localStorage`, `sessionStorage` and the URL  3. Reload  4. Read the frame's selection | No storage write, no cookie and no URL change; after a reload the frame is back on `bentomux-v2` and its first tab; the selection is presentation state only (`MOCK-002`, `sys_uc_001.md` §Postconditions) | | | |

## 3. Feature F002: Feature Showcase Sections

### 3.1 UC-001: Browse the Landing Page

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status | Notes |
|-------|---------------|------------|-----------------|---------------|--------|-------|
| TC-F002-003 | No capability row advertises a behaviour the application does not implement | 1. Read each row's claim  2. Open the artifact in the application repository that implements it  3. Confirm the capability exists and matches the wording  4. Check that row 04's count comes from `ENT-003` rather than from the copy | Every claim is traceable to a file that implements it — `README.md`, `src-tauri/src/state.rs`, `src-tauri/src/detect`, `src-tauri/src/bridge_config.rs`, `resources/manifests`, `src-tauri/src/remote`; nothing is advertised on intent alone, and no row prints a path (`FR-002.6`, `BR-002.1`, `BR-002.4`) | | | |
| TC-F002-004 | The band's shape is the contract, and it does not grow | 1. Count the rows  2. Read each number and title  3. Read the band's accessible name  4. Repeat at a viewport below `md` | Five rows numbered 01–05 in the order persistent, state, approvals, runtimes, remote; each row has a number, a title and exactly one claim paragraph; the band has an accessible name and carries no visible heading that repeats row 01; below `md` a row stacks its copy above its panel (`FR-002.1`, `FR-002.4`, `FR-002.9`, `information_architecture.md` §7 SEC-013) | | | |
| TC-F002-005 | ~~The evidence is on the page, not only in the repository~~ — **removed 2026-09-15** | The capability rows no longer print the repository path their claim was checked against, so there is no evidence line to read (`ENT-013.sourceFeature` and its five values were deleted). | Removed: the honesty check is carried by TC-F002-003 alone; the build instead asserts that no repository path appears on the page (`FR-002.4`, `BR-002.1` as amended) | | | |
| TC-F002-006 | The right column illustrates the claim above it, and stays inert | 1. Read each row's panel  2. Match the panel's contents to its row  3. Confirm row 04's note carries both derived counts  4. Attempt to focus and activate anything inside a panel | Row 01 shows terminal tabs, row 02 three agents in the words idle/working/blocked, row 03 the permission prompt with its three answers, row 04 the runtime names with `21 detected · 9 also configurable`, row 05 the monitor address and its clients; a state is never signalled by colour alone; no element inside a panel is focusable or interactive; the copy comes from the typed module (`FR-002.4`, `FR-002.5`, `design_system.md` §9.6, `CLR-001`) | | | |

## 4. Feature F003: Agent Runtime Showcase

### 4.1 UC-004: Explore Supported Agent Runtimes

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status | Notes |
|-------|---------------|------------|-----------------|---------------|--------|-------|
| TC-F003-001 | Both counts render from the data, in the claim and in the figures | 1. Read row 04's claim  2. Read its evidence panel's note  3. Read the stat strip  4. Count `resources/manifests/*.toml` and the adapters in `src-tauri/src/agents/index.rs` | Row 04's claim states 21, its panel notes `21 detected · 9 also configurable`, and the stat strip labels its cell `agent CLIs detected`; every number matches the application repository (`FR-002.7`, `BR-003.1`, `BR-003.2`) | | | |
| TC-F003-002 | The runtime names read as data, not as a selector | 1. Press `Tab` through row 04  2. Attempt to click a name and to activate it with `Enter` and `Space`  3. Inspect the element's role and cursor | `Tab` never stops on a runtime name; no activation occurs; no `role="button"` and no pointer cursor; the names are list items inside the evidence panel, resolved from the agent roster so the figure cannot name a runtime the roster lacks, and the panel wraps below `md` with no horizontal scrolling (`FR-002.4`, `FR-002.11`, `BR-003.7`, `design_system.md` §9.6) | | | |
| TC-F003-003 | The counts are enforced at build time, wherever they are rendered | 1. Apply each fixture in turn  2. Run the build on each | Each build fails with the corresponding invariant error; the third fails on the derived-count rule that `src/content/caps.ts` now owns, so a stale number cannot ship (`BR-002.2`, `BR-003.1`, `BR-003.2`) | | | |
| TC-F003-004 | Wording keeps detection and configuration distinct | 1. Read every sentence that mentions agents  2. Look for a claim that all detected agents can be configured, or a count applied to the wrong verb | No such sentence exists; `detected` and `configurable` appear with their distinguishing verb in every occurrence, and the strip's label names CLIs rather than configurations (`BR-003.3`, `BR-003.5`) | | | |
| TC-F003-005 | Each figure the site states is one it can stand behind | 1. Read the strip's cells  2. Read each value and its label as a pair  3. Follow each cell's destination  4. Check the strip's accessible name | The strip renders `21 agent CLIs detected` linking `#capabilities`, `3 platforms · macOS, Linux, Windows` linking `#install`, and `MIT open source license` linking the tracked licence file; the strip has an accessible name; no figure is stated without the label that says what it counts, and each figure comes from the module that owns it (`FR-002.7`, `FR-002.8`, `BR-002.2`, `ENT-015`) | | | |
| TC-F003-006 | The one external figure fails closed | 1. Rebuild with each fixture  2. Count the strip's cells  3. Inspect the served HTML for a placeholder figure or a dash  4. Confirm the rest of the page is intact | The strip renders three cells; the star cell is absent entirely — not zero, not a dash, not a stale number; the build and the page succeed (`BR-002.3`, `BR-007.3`) | | | |
| TC-F003-007 | Reading the figure does not send the visitor to a third party | 1. Load `/` with the network log open  2. Filter the requests for `api.github.com`  3. Read the star value as rendered  4. Read the response headers for the revalidation window | No request to `api.github.com` originates from the document; the figure arrives already rendered and is revalidated hourly on the server; a visitor's browser is never sent to a third party to read a number (`NFR-004.4`, `BR-007.3`) | | | |

## 5. Feature F004: Waitlist Capture

### 5.1 UC-002: Join the Waitlist

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status | Notes |
|-------|---------------|------------|-----------------|---------------|--------|-------|
| TC-F004-001 | The main flow completes end to end | 1. Enter the address  2. Activate **Notify me**  3. Observe the button state  4. Read the response  5. Read the live region | Button enters loading state with the input disabled; request is `POST /api/waitlist`; response is `200` with `ok: true`; the stub received `{ email, unsubscribed: false }`; the live region confirms registration and states that one email will arrive at release (`FR-004.3`, `FR-004.5`) | | | |
| TC-F004-002 | Alt-1. A second submission of the same address discloses nothing and creates nothing | 1. Submit  2. Record status and body  3. Submit again  4. Compare the two responses byte for byte | Both responses are `200` with the same body; no duplicate contact is created; nothing distinguishes the second response from the first (`BR-004.5`, `FR-004.6`) | | | |
| TC-F004-003 | Alt-3. A naive bot gains no signal that it was detected | 1. POST the payload  2. Read the response  3. Check whether the stub was called | `200` with the success body; the stub was never called; no contact exists; the honeypot value appears nowhere in any log (`BR-004.6`) | | | |
| TC-F004-004 | Alt-2. Arrival from an action elsewhere on the page lands on a usable form | 1. Activate the hero waitlist action  2. Observe the scroll position and `document.activeElement`  3. Repeat from the navigation action | The page scrolls to `SEC-007` with the heading clear of the fixed navigation and the email input ends up focused; the install section offers no equivalent action and is not the source of the arrival (`FR-004.4`, `FR-005.1`, `sys_uc_002.md` §State transitions) | | | |
| TC-F004-005 | Alt-5. Trivial variation does not create a second contact | 1. Submit the padded address  2. Inspect the payload the stub received  3. Submit the varied-case address  4. Compare the responses | The stub receives the trimmed value with no surrounding whitespace; the second submission is treated as the same subscriber and returns the identical success response | | | |
| TC-F004-006 | Exc-1, first half. An obviously invalid value costs no request | 1. Type the value  2. Move focus out of the field  3. Read the inline error  4. Check the network log | An inline error is displayed and associated with the input via `aria-describedby`; no request is issued (`FR-004.4`) | | | |
| TC-F004-007 | Exc-1, second half. The server repeats every rule the client checks | 1. POST each payload  2. Read status and body  3. Observe the UI state after a forced rejection | Each returns `400` with `error: "invalid_email"` and a `details` entry; the form re-enables, retains the typed value, and keeps the error visible until the value changes; no contact is created (`FR-004.4`, `NFR-002.5`) | | | |
| TC-F004-008 | Exc-2. A subscriber is never silently lost | 1. Submit under each stub configuration  2. Read status and body  3. Inspect the UI  4. Inspect the server log | Each returns `502` with `error: "upstream_unavailable"` and a generic message; the upstream body, status text, and key appear nowhere in the response or the log; the form exits loading, re-enables, retains the address, and offers retry (`NFR-002.4`, `NFR-004.1`) | | | |
| TC-F004-009 | Exc-3. The endpoint cannot be used as an open relay | 1. POST each request  2. Read the status  3. Check the stub call count | Both return `403`; the stub is never called; rejection happens before validation and before any upstream call (`NFR-002.2`) | | | |
| TC-F004-010 | Exc-4. Abuse is slowed within one instance | 1. Submit five times  2. Submit a sixth  3. Read the sixth response  4. Observe the UI | The first five succeed; the sixth returns `429` with `error: "rate_limited"`; the UI shows a non-destructive error and keeps the typed address (`NFR-002.3`) | | | |
| TC-F004-011 | Alt-4. The no-script path reaches the same outcome | 1. Submit the native form  2. Observe the redirect  3. Read the resulting page's outcome text | The form posts as `application/x-www-form-urlencoded`; the handler validates identically; the visitor lands back on `PAGE-001` and the outcome is stated in text (`FR-004.9`) | | | |
| TC-F004-012 | The endpoint accepts one verb only | 1. Issue each request  2. Read the status  3. Check the stub call count | Each returns `405` with `error: "method_not_allowed"`; the stub is never called | | | |
| TC-F004-013 | The privacy statement's claims hold under a real submission | 1. Submit  2. Search the full server log for the address  3. Search the built client bundle for the API key and for the address  4. Inspect response headers and browser storage | The address appears in no log; the key appears in no client asset; no cookie is set; no storage is written (`NFR-002.1`, `NFR-002.4`) | | | |

## 6. Feature F005: Install and Platform Availability

### 6.1 UC-003: Install Bentomux

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status | Notes |
|-------|---------------|------------|-----------------|---------------|--------|-------|
| TC-F005-001 | The switcher is a closed set with a deterministic default that does not depend on script | 1. Read the raw HTML of `SEC-006`  2. Count the options and read their labels  3. Read which input carries `checked`  4. Tab to the group and observe the tab stop count | Exactly three options labelled macOS, Linux and Windows; macOS is the one carrying `checked` in the server response; the group occupies a single tab stop (`FR-005.1`, `FR-005.2`) | | | |
| TC-F005-002 | The switcher is keyboard-operable and its side effects are confined to visibility | 1. Focus the group and press the arrow keys through all three options  2. Observe the visible panel after each press  3. Watch the network panel and `document.cookie` and `localStorage`  4. Confirm the URL does not change | Focus moves within the group; the visible panel follows the selection; no request is issued by the page; nothing is written to cookies or storage; the URL does not change (`FR-005.1`, `FR-005.6`, `BR-005.8`) | | | |
| TC-F005-003 | Panel availability does not depend on JavaScript | 1. Load `/` with JavaScript off  2. Search the response for each platform command  3. Confirm which panel is visible under CSS | All three panels exist in the document; exactly one panel is visible and it is the macOS panel, because macOS is the selected option; no empty region or placeholder is shown (`FR-005.6`, `NFR-007.3`) | | | |
| TC-F005-004 | Executable text is transcribed, never paraphrased | 1. Read each command string from the rendered page  2. Read the install block of `../Bentomux-v2/README.md`  3. Compare byte for byte  4. Confirm `/install.sh`, `/install.ps1` and `/install.cmd` each answer with a 307 to the matching `installers/*` file  5. Repeat for every panel including the fallback commands | Each rendered command is byte-identical to a string in the README install block; a divergence is a `BR-005.1`/`BR-005.9` content defect caught by this comparison (`CON-014`, `DS CMD-002`) | | | |
| TC-F005-005 | No mirror, CDN or third-party download page is introduced | 1. Extract every URL rendered in the section  2. Compare each host against the permitted pair — `SiteConfig.siteUrl` and the repository  3. Confirm `raw.githubusercontent.com` appears in no rendered command  4. Confirm the manual-download link points to `releases/latest` on the repository host | Only the site's own origin (as a 307 redirector, holding no copy) and `github.com/takora-dev/bentomux-v2` appear; a command naming any other host fails the build through the host invariant in `src/content/install.ts` (`BR-005.2`, `FR-005.11`) | | | |
| TC-F005-006 | The section states no fact the release does not support | 1. Scan the section text for each pattern  2. Confirm the only version-shaped string is `vX.Y.Z`  3. Confirm `apt` appears once and only inside the libfuse2 note  4. Confirm no channel name is presented as an install route  5. Confirm no Homebrew command or cask reference exists | The only version literal is the `vX.Y.Z` placeholder; no date or download size is stated; no package manager is advertised as a channel; no Homebrew text appears anywhere; each violation fails the build with its own code (`BR-005.3`, `BR-005.4`, `BR-005.6`, `CON-015`) | | | |
| TC-F005-007 | The Linux path is complete and its one privileged branch is labelled | 1. Select Linux  2. Read the primary command  3. Read the `--deb` alternative and its root note  4. Read the FUSE note  5. Confirm `sudo` appears nowhere else in the section | The AppImage command is the primary one; `--deb` is present, described as needing root, and is not prefixed with `sudo`; the libfuse2 note is present and is the only place `sudo` appears (`FR-005.7`, `BR-005.5`, `DS CMD-006`) | | | |
| TC-F005-008 | A visitor who meets Gatekeeper is told what to expect before it happens | 1. Read the macOS panel without interacting  2. Look for the signing statement  3. Look for the first-launch instruction | The panel states that the build is not signed or notarized and that macOS may require confirmation of the first launch under System Settings → Privacy & Security; no dialog text is invented beyond that path (`FR-005.8`) | | | |
| TC-F005-009 | The Windows path covers the environment where PowerShell cannot reach the internet | 1. Select Windows  2. Read the PowerShell command  3. Read the fallback command and its stated purpose  4. Read the privilege statement | Both commands render verbatim; the fallback is described as existing for environments that block PowerShell downloads; the section states that the per-user install needs no administrator rights (`FR-005.9`) | | | |
| TC-F005-010 | Verification behaviour is disclosed rather than implied | 1. Read the installer explanation  2. Count the steps  3. Confirm the digest step states what happens on mismatch | Three steps are stated: read the release manifest, download and verify the SHA-256 digest, then install; the digest step states that installation is refused when the digest does not match (`FR-005.10`, `BUILD_STEP_COUNT`) | | | |
| TC-F005-011 | A visitor who prefers to download by hand is served without a second surface being built | 1. Read the manual-download line  2. Count the format labels  3. Count the links  4. Follow the link | One line naming `.dmg`, `.AppImage`, `.deb`, `.msi` and `-setup.exe`, behind a single link to the latest release; the link resolves once `LP-007` holds (`FR-005.11`, `DS CMD-005`) | | | |
| TC-F005-012 | The pinned path is the installer's own override, not an invented one | 1. Read the pin example  2. Confirm the placeholder spelling  3. Compare its manifest URL against the installer default with `/latest/download/` replaced by `/download/vX.Y.Z/`  4. Confirm the environment variable name | The example pins the version as `vX.Y.Z` and overrides `BENTOMUX_MANIFEST_URL`; the URL matches the installer default apart from the version segment (`FR-005.12`, `BR-005.1`) | | | |
| TC-F005-013 | Copying is the section's most used interaction and must never be the only feedback channel | 1. Activate the copy control with permission granted  2. Compare the clipboard contents with the rendered string  3. Activate again with permission denied  4. Read the reported outcome in both states  5. Select the command by hand after the failure | The clipboard holds exactly the rendered command; success and failure are each reported as text inside the block; after a failure the command remains selectable and reaches the clipboard by hand (`FR-005.5`, `DS CPY-001`, `DS CPY-002`, `DS CPY-003`) | | | |
| TC-F005-014 | A helpful default must not become a refusal to listen | 1. Load the page  2. Select an option explicitly  3. Observe whether the selection reverts  4. Confirm the rendered text and layout of the panels are unchanged by detection | Detection runs at most once, before any interaction; an explicit selection is never overridden; no panel text changes and no layout shift occurs (`FR-005.4`, `BR-005.8`) | | | |
| TC-F005-015 | Architecture support is stated exactly as far as the release pipeline goes | 1. Read the Linux panel  2. Look for the architecture statement  3. Scan the section for any Apple Silicon or arm64 wording | The section states that Linux builds are published for x86_64 only and that no aarch64 Linux build exists yet; no other architecture is named as supported (`FR-005.13`, `BR-005.7`) | | | |
| TC-F005-016 | The primary action is gated on a real release rather than on copy that merely looks finished | 1. Request the manifest URL  2. Read the status  3. If the release is absent, confirm the announcement is blocked while the section itself remains reviewable | While the manifest does not resolve the site must not be announced (`LP-007`); the failure is recorded as an open exit criterion rather than worked around by softening the copy | | | |

## 7. Feature F006: FAQ

### 7.1 UC-005: Read the FAQ — Removed (2026-09-14)

The FAQ band and `ENT-006` were deleted on 2026-09-14; the page has no question-and-answer surface, so no case in this section can be executed. The identifiers `TC-F006-001` … `TC-F006-005` are retained so the denominator in §11 stays comparable; their dated removal notes live in `docs/test_cases.md`.

## 8. Feature F007: Project Links, Community and Repository Star

### 8.1 UC-006: Open the Project Links and Star the Repository

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status | Notes |
|-------|---------------|------------|-----------------|---------------|--------|-------|
| TC-F007-002 | No fabricated or unverifiable figure is displayed | 1. Scan the whole page for a numeral next to `issues`, `forks`, `contributors`, `installs`, `downloads` or `users`  2. Read the stat strip's star cell  3. Check that the figure is labelled with whose it is  4. Check it is not older than the revalidation window | No issue, fork, contributor, install, download or user count appears anywhere; the star count may appear, and only as `GitHub stars`; no figure is stated as a bare numeral (`BR-007.3`, `BR-002.3`, `NFR-004.4`) | | | |
| TC-F007-003 | Private enquiries have a path, and no address-collecting form was invented | 1. Inspect the footer's contact link  2. Search the whole document for a `form` element  3. Check whether a contact address is printed as body text | The footer's contact link begins with `mailto:` while `contactEmail` is configured, and is absent while it is not; the waitlist form is the only `form` on the page; no address is exposed as plain text (`BR-007.4`, `FR-007.5`) | | | |

## 9. Feature F008: Theme Palette Preview

### 9.1 UC-007: Preview Theme Palettes — Removed (2026-09-14)

The palette band and `ENT-004` were deleted on 2026-09-14; the site ships one theme with no selector, so no case in this section can be executed. The identifiers `TC-F008-001` … `TC-F008-006` are retained so the denominator in §11 stays comparable; their dated removal notes live in `docs/test_cases.md`.

## 10. Feature F009: Licensing, Attribution and Privacy

### 10.1 UC-008: Read the License, Attribution, and Privacy Statement

| TC ID | Test Scenario | Test Steps | Expected Result | Actual Result | Status | Notes |
|-------|---------------|------------|-----------------|---------------|--------|-------|
| TC-F009-001 | The licence statement matches the file the repository actually tracks | 1. Read `licenseId` from `LICENSE`  2. Read the footer sentence  3. Follow the licence link  4. Confirm no deferred wording remains | The footer and `/privacy` state the same licence identifier as the tracked file — MIT — and the licence link resolves; no deferred or hedged wording appears (`FR-009.7`, `BR-009.1`, `CON-008`) | | | |
| TC-F009-002 | The statement is complete, not a stub | 1. Open `/privacy`  2. Read the blocks in order  3. Verify each block's content against the contract, especially the "not collected" list | Eight non-empty blocks in the fixed order; the "not collected" block names analytics, cookies, advertising identifiers, session replay, third-party scripts, and retained IP addresses; the removal path names the contact address (`FR-009.5`, `FR-009.6`) | | | |
| TC-F009-003 | One source, two render sites, no divergence | 1. Extract each string from the footer  2. Extract the same string from `/privacy`  3. Compare character by character | The licence sentence and the trademark disclaimer are identical on both sites; the test fails on any whitespace or wording difference (`XPG-001`) | | | |
| TC-F009-004 | The privacy statement describes the site's actual behaviour | 1. Load `/` and `/privacy` with the network log open  2. Inspect response headers for `Set-Cookie`  3. List all scripts and classify their origins  4. Inspect storage before and after browsing every section | No `Set-Cookie`; every script is same-origin; no `localStorage` or `sessionStorage` write; no analytics or tag-manager request. Under a privacy-review pass, the "not collected" block is true as written (`NFR-008.4`) | | | |
| TC-F009-005 | ~~The two licences in play are stated separately and neither erases the other~~ — **removed 2026-09-15**; superseded by TC-F009-007 | — | — | | | |
| TC-F009-006 | ~~A precondition that is not met must show up in the release checklist, not in the copy~~ — **removed 2026-09-15**; superseded by TC-F009-007 | — | — | | | |
| TC-F009-007 | Nothing on the site names an upstream project | 1. Fetch `/` and `/privacy` from the production server  2. Scan the HTML case-insensitively for the upstream name  3. Scan for any Apache-2.0 mention  4. Confirm the MIT sentence still renders | Neither page contains the upstream name or an Apache-2.0 mention, and the licence sentence is unchanged (`FR-009.2` withdrawn, `BR-009.1`) | | | |

## 11. Execution Summary

| Feature | Total TC | PASS | FAIL | N/A | Pass Rate |
|---------|----------|------|------|-----|-----------|
| F001 | 11 | | | | |
| F002 | 3 | | | | |
| F003 | 7 | | | | |
| F004 | 13 | | | | |
| F005 | 16 | | | | |
| F006 | 0 | | | | |
| F007 | 2 | | | | |
| F008 | 0 | | | | |
| F009 | 6 | | | | |
| **Total** | **58** | | | | |

Case types: 33 positive, 9 exception, 16 negative. F006 and F008 are retired bands: their fifteen identifiers are retained in `docs/test_cases.md` and excluded from this table. The grand total trails `docs/test_cases.md` v1.3 by the two retired F009 rows, which are kept struck-through below rather than recounted.

### 11.1 Defect Triage Summary

| TC ID | Suspected Source | Action Taken | Resolved? |
|-------|------------------|--------------|-----------|
| | | | |

### 11.2 Entry & Exit Criteria Check

| Criterion | Status | Notes |
|-----------|--------|-------|
| All SoT artifacts validated | | |
| All 59 executable cases executed | | |
| No open Critical or High defects | | |
| Agent roster counts re-verified against the app repo (`LP-006`) | | |
| Every external destination on the page resolves, and the figures the strip states match the repository | | |
| Every rendered install command matches its repository source byte for byte | | |
| A tagged release publishes `latest.json` and the platform assets (`LP-007`) | | |
| `LICENSE` present — MIT, tracked on `master` (`LP-001`, `BR-009.1`) | | |
| `NOTICE` present crediting the upstream project under Apache-2.0 (`LP-002`, `FR-009.8`) — **withdrawn 2026-09-15**, no site rendering depends on it | | |
| UAT signed off | | |

## 12. Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-09-13 | F. Jibran | Initial execution sheet, 50 cases across nine features. Pre-run: results blank by design. |
| 1.1 | 2026-09-13 | F. Jibran | Rows regenerated from the case set after the install section replaced the mock download surface: 63 cases, including 16 for UC-003 and 6 for UC-008. Exit criteria now carry the command-fidelity, `LP-007` release-gate and `LP-001`/`LP-002` licence rows. |
| 1.2 | 2026-09-14 | F. Jibran | Rows regenerated from the v1.2 case set after the landing page was rebuilt to four bands: 59 executable cases (F001 11, F002 4, F003 7, F007 2), F006 and F008 retired to identifier-only sections, exit-criteria wording updated for the removal of palettes and the community grid. Same-pass revision: the window mock's sidebar was cut back to workspaces only (the application has no agent panel), so rows TC-F001-007, TC-F001-008 and TC-F001-009 were regenerated against the amended cases — new caption, five pressed-state buttons instead of eight, and no agent row in the frame. Row count unchanged at 59. |
| 1.3 | 2026-09-15 | F. Jibran | The capability rows stopped printing the repository path their claim was checked against, matching `docs/test_cases.md` v1.4: TC-F002-005 is struck through as removed and TC-F002-003 is re-pointed at the application repository instead of at a `sourceFeature` field that no longer exists. F002 falls from four cases to three and the grand total from 59 to 58. This pass adjusts the two F002 rows only — the totals block continues to trail `docs/test_cases.md` v1.3, whose retired F009 rows are kept struck-through below rather than recounted, and the waitlist cases (F004) are still listed although the shipped site has no form. |

