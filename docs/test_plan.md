# Test Plan: Bentomux Landing Page

**Document:** Test Strategy | **Derived From:** SoT-4 (User Flows) + SoT-7 (UCIC) | **Status:** Draft | **Last Updated:** 2026-09-15

> Test cases are derived from Sources of Truth (User Flows + UCIC), not from code. Tests exist before implementation begins.

## 1. Introduction

### 1.1 Purpose

This plan governs verification of the Bentomux marketing site against its Sources of Truth: the SRS (`docs/srs.md`), the information architecture (`docs/information_architecture.md`), the design system (`docs/design_system.md`), the eight user flows (`docs/user_flows/`), the data model (`docs/data_model.md`), and the eight integration contracts (`docs/system_logics/`). It defines what is tested, at which levels, in which environment, and what must be true before the site may be called a release candidate. Since the 2026-09-14 rebuild the site renders four anchored bands — hero, capabilities, waitlist, install — around a figure and a stat strip; the FAQ and palette flows (UC-005, UC-007) are retired and carry no executable cases.

The system under test is one statically rendered Next.js site with a single server endpoint. That shape decides the strategy: most verification is content-and-markup verification that can be asserted mechanically at build time, and exactly one use case needs runtime HTTP testing with a stubbed upstream.

### 1.2 Objectives

- Verify each of the eight use cases completes per its user flow, including alternative and exception paths.
- Verify the single endpoint `POST /api/waitlist` conforms to its UCIC contract: request shape, every reachable status code, and the deliberately indistinguishable success responses.
- Verify the client-side contracts — install option group semantics, copy-control feedback, figure-band markup, the mock's keyboard semantics and reduced-motion behaviour, anchor resolution — which are the parts no HTTP test can reach.
- Verify that every install command rendered in `SEC-006` is byte-identical to a string that already exists in the application repository, and that no version number is stated in prose.
- Confirm every acceptance criterion listed in each user flow.
- Confirm the 21-detected / 9-configurable agent claim and the figures the stat strip states against the application repository, since those are the facts most likely to drift.
- Confirm that no claim is made about a release date, a downloadable artifact, or a licence state that the repository does not support.

### 1.3 References

- SRS: `docs/srs.md`
- Information Architecture: `docs/information_architecture.md`
- Design System: `docs/design_system.md`
- User Flows: `docs/user_flows/` (eight flows plus `index.md`)
- Data Model: `docs/data_model.md`
- UCIC: `docs/system_logics/` (eight contracts plus `index.md`)
- Test Cases: `docs/test_cases.md`
- Test Execution Sheet: `docs/test_execution_sheet.md`
- Read-only evidence base: `../Bentomux-v2` (application repository, source of product facts)

## 2. Test Scope

### 2.1 In Scope

#### 2.1.1 Test Types Included

- **Functional testing** — each use case's main, alternative, and exception flows.
- **Contract testing** — the waitlist endpoint's request/response shapes and status codes, with the Resend upstream stubbed so failure paths are reachable on demand.
- **Build-time validation testing** — the schema invariants in `data_model.md` §7: entity counts, unique keys, resolvable destinations, the licence rule, and the derived-count rules the capability rows and the stat strip are built from. These are tested by deliberately breaking a fixture and asserting the build fails.
- **Command-fidelity testing** — every string rendered inside an install panel is compared byte-for-byte against the application repository's `installers/install.sh`, `installers/install.ps1`, `installers/install.cmd` and the README install block. The comparison is a source read, not a hand-copied snapshot. A command that differs by one character, that wraps, or that names a version other than the pin placeholder fails.
- **Client behaviour testing** — install option-group semantics and panel selection, copy-control success and failure feedback, workspace and tab selection in the figure band, the mock's keyboard reachability and reduced-motion collapse, anchor scroll clearance.
- **Accessibility spot checks** — one `h1`, no skipped heading levels, focus visibility, keyboard operability of every interactive control, 44px targets below `md`, colour-independence of support level and form state, reduced-motion collapse.
- **Content-accuracy testing** — factual claims cross-checked against the application repository, and the absence of forbidden claims (release dates, a licence state the repository does not support, re-hosted or mirrored artifacts, Homebrew availability, and any issue, fork, contributor or install count; a star figure is permitted only under the `GitHub stars` label).
- **User acceptance testing** — the product owner validates the acceptance criteria in each flow.

### 2.2 Out of Scope

- **Load and stress testing.** The site is static and the single endpoint is rate-limited by design. `CON-003` fixes hosting at zero cost, so no capacity target exists to test against.
- **Penetration testing.** Separate engagement. The only writable surface is a create-only endpoint with an origin check, a honeypot, and a best-effort rate limit; `CON-012` records the limit as a mitigation rather than a guarantee.
- **Desktop application behaviour.** The application is a separate repository and is read-only reference material for this project. Verifying that the app's Git panel works is not this plan's job; verifying that the site's description of it is accurate is.
- **Email deliverability.** Whether a release notification reaches an inbox depends on DNS and the ESP, not on this site. In scope is only that the correct contact is created.
- **Cross-browser visual pixel comparison.** Not automated. The visual review is a manual check against the design system at the defined breakpoints.
- **Double opt-in.** Deferred (`FUT-002`, `OQ-007`). The current contract is single opt-in with an explicit consent statement, and that is what is tested.
- **Installer execution.** Whether `install.sh` actually installs Bentomux is verified in the application repository, which owns `scripts/verify-installer.sh` and `npm run test:installer`. This site quotes those scripts verbatim, so the site's obligation is command fidelity, not installation correctness.
- **Homebrew cask correctness.** No cask resolves (`CON-015`), so there is nothing on the site to verify beyond its absence from the rendered copy.

## 3. Test Strategy

### 3.1 Testing Levels

**Level 1 — Build-time content validation**
Scope: every module in `src/content/` against its schema. Entity counts, unique ids and orders, unique link ids and resolvable destinations, anchor targets, the licence rule, the derived agent counts, the command-transcription rule, and the manual-download format list. Method: run the build with a valid corpus, then with one deliberately corrupted fixture per invariant, and assert that each corruption fails the build with the recorded error code — including `BUILD_COMMAND_MISMATCH`, `BUILD_COMMAND_WRAPPED`, `BUILD_COMMAND_VERSION_LITERAL`, `BUILD_COMMAND_HOST`, `BUILD_COMMAND_ROOT`, `BUILD_INSTALL_DEFAULT`, `CONTENT_ARCHITECTURE_LABEL` and `CONTENT_PACKAGE_MANAGER` (`sys_uc_003.md`).

**Level 2 — Component behaviour**
Scope: the interactive islands in isolation — `InstallSwitcher`, `InstallPanel`, `CommandBlock`, `ManualDownloads`, `TerminalMock`, `WaitlistForm`, `NavBar`. Method: render with fixtures and drive by keyboard and pointer.

**Level 3 — Endpoint contract**
Scope: `POST /api/waitlist`. Method: call the route handler directly with constructed requests, with the Resend client stubbed to return success, an existing contact, a timeout, and an error. Assert status code, body shape, and that no subscriber address reaches the log.

**Level 4 — System / end-to-end**
Scope: the full page against a production build, plus `/privacy` and the catch-all. Method: browser automation for the flows; manual pass for the visual and no-JS reviews.

**Level 5 — User acceptance**
Scope: the acceptance criteria in each flow, validated by the product owner.

### 3.2 Testing Approach

**Functional testing approach**
- Positive: the main flow completes and every postcondition in the flow holds.
- Negative: invalid input is rejected with the exact status and error identifier recorded in the UCIC, and the UI retains the visitor's input where the contract requires it.
- Exception: upstream failure, wrong origin, rate limit, missing configuration, and no-JavaScript behaviour each produce the documented outcome rather than a generic error page.

**Content-accuracy approach**
Every factual claim in the page is checked against the application repository at content review, and `AgentRuntime`/`AgentAdapter` supplies the counts the copy and the stat strip state. The page renders no repository path — the capability rows' evidence line was retired on 2026-09-15 — so verification re-reads those artifacts rather than trusting the copy. The two counts are asserted as schema invariants, so the check is mechanical; the one external figure — repository stars — is read at render time and dropped, never invented, when the read fails.

**Command-fidelity approach**
Install commands are the one place where the site reproduces executable text, so they are verified as text, not as prose: the rendered string must equal the string in the repository's installer or README byte-for-byte, the repository's own installer tests remain the authority on whether a command works, and the licence state is read from the tracked `LICENSE` file rather than from the README, which `CON-013` records as stale.

**Defect management**
Each defect is logged with its test case, expected versus actual, severity, and suspected source. The source matters more than the count:

- **Implementation defect** → fix the code; the artifact stands.
- **Source-of-Truth defect** → fix the artifact first, then re-validate every downstream artifact before touching code. A wrong user flow invalidates its UCIC, its test cases, and anything implemented from them.

Severity scale: **Critical** (a claim is false, or data is lost), **High** (a flow's main path fails, or a required status code is wrong), **Medium** (an alternative or exception path behaves incorrectly), **Low** (copy, spacing, or polish).

## 4. Test Environment

### 4.1 Hardware Requirements

- Developer workstation. No special hardware.
- One device or emulated viewport below `md` for the touch-target and mobile-menu checks.

### 4.2 Software Requirements

| Component | Specification |
|-----------|---------------|
| Runtime | Node.js 20 LTS (Vercel's default), matching the deployment target |
| Framework under test | Next.js App Router, production build |
| Browser automation | Playwright, Chromium plus one WebKit run for the no-JS and focus checks |
| Component testing | Vitest with Testing Library, or the framework's equivalent; no additional library is required by the design system |
| Endpoint testing | The route handler invoked directly, with the Resend client replaced by a stub |
| Database | None (`CON-001`) |
| Upstream stub | Resend Contacts API, stubbed for success, duplicate, timeout, and error responses |

### 4.3 Network Requirements

- Local development for Levels 1–4. No external network dependency is required, because the only upstream call is stubbed.
- One live-environment check at release for destination liveness (`BR-007.1`): every external destination the page renders must resolve. This is a checklist item, not an automated test, since it depends on third-party availability.

### 4.4 Test Data Requirements

- **Content corpus:** the real `src/content/` modules, plus one corrupted fixture per build-time invariant, kept beside the tests.
- **Waitlist addresses:** reserved documentation addresses only (for example `waitlist-test@example.com`). No real address may be used in any test, and no test may leave a contact behind in a live Resend account.
- **Repository figure stub:** the GitHub metadata read is stubbed in two states — one answering with a count, one failing — because the failing state is the one that must drop the star item rather than print a zero (TC-F003-006).
- **Command source of record:** `../Bentomux-v2/installers/install.sh`, `install.ps1`, `install.cmd`, and the install block in `../Bentomux-v2/README.md`, read directly at test time. A command whose only evidence is a hand-copied string is not verified.
- **Licence source of record:** the `LICENSE` file tracked on `master` of the application repository, plus the presence or absence of a `NOTICE` file. Both are read at test time rather than recorded in the site's copy.
- **Reset:** build-time tests are stateless. Endpoint tests create no persistent state because the upstream is stubbed. No teardown is required.

## 5. Roles & Responsibilities

| Role | Responsibility |
|------|----------------|
| Product owner (F. Jibran) | Owns the Sources of Truth; validates each phase; performs UAT and signs off acceptance criteria |
| Developer | Implements from the artifacts; authors and executes the lower-level tests |
| AI assistant | Generates the artifacts and the test cases from them; executes and reports; never edits code to make a failing test pass without first deciding whether the artifact or the implementation is wrong |

## 6. Test Schedule

| Phase | Activity | Output |
|-------|----------|--------|
| 1 | Generate test cases from the SoT (complete) | `docs/test_cases.md` |
| 2 | Validate SoT artifacts with the product owner, phase by phase | Validated artifacts, revision history entries |
| 3 | Implement the site from the artifacts | Deployable build |
| 4 | Execute Levels 1–4 | `docs/test_execution_sheet.md` filled |
| 5 | Triage failures: implementation versus Source of Truth | Defect log |
| 6 | UAT against each flow's acceptance criteria | Acceptance record |

## 7. Entry & Exit Criteria

### 7.1 Entry Criteria

- [x] Sources of Truth validated: SRS, information architecture, design system, eight user flows, data model, eight UCICs
- [ ] Test cases generated and reviewed by the product owner
- [ ] `NEXT_PUBLIC_SITE_URL` set and parseable in the environment under test (`NFR-004.2`)
- [ ] Resend stub in place for endpoint tests
- [ ] Implementation deployed to the test environment

### 7.2 Exit Criteria

- [ ] 100% of in-scope test cases executed (Acceptance Pass Rate target: 100% for the main and alternative flows)
- [ ] Every acceptance criterion in all eight user flows passes
- [ ] No open Critical or High defects
- [ ] Agent roster and figure counts re-verified against the application repository (`LP-006`)
- [ ] Every rendered install command matches its source string byte-for-byte, and no prose states a version number
- [ ] A tagged release has published `latest.json` and the platform assets, so every install command resolves (`LP-007`)
- [ ] Every external destination resolves at release (`BR-007.1`)
- [ ] Release preconditions recorded: `LICENSE` already satisfied by the tracked MIT file; `NOTICE` open (`LP-001`, `LP-002`, `FR-009.8`)
- [ ] UAT signed off

### 7.3 Suspension Criteria

- A blocking defect prevents more than half the cases from executing.
- A Source-of-Truth defect is found, which requires the Revision Loop: stop executing, fix the artifact, re-validate downstream artifacts, then re-derive the affected cases.
- `NEXT_PUBLIC_SITE_URL` is unset or unparseable, since the build itself must fail in that state.

## 8. Test Deliverables

- Test plan (this document)
- Test cases: `docs/test_cases.md`
- Test execution sheet: `docs/test_execution_sheet.md`
- Defect log, with the implementation-versus-artifact diagnosis for each entry
- Acceptance record
- Release checklist covering `LP-001`, `LP-002`, `LP-006`, `LP-007`, and destination liveness

## 9. Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| A SoT defect is found late and propagates into code | Revision Loop: fix the artifact first, then re-validate every downstream artifact. The traceability tables are what make the affected set computable rather than guessed |
| Product facts drift as the application evolves (agent count, capability set, figure set) | Counts are schema invariants, so a drift breaks the build rather than shipping quietly; `LP-006` requires re-verification before each deploy |
| The one external figure is unavailable when the page is built | The star item is read at render time and dropped from the strip on any failure — never rendered as zero and never cached as a stale number; TC-F003-006 covers the failing read |
| Test cases written from code instead of artifacts | Cases cite their UCIC section and user flow in the traceability matrix; a case with no traceable source is rejected during review |
| A test passes with a real subscriber address and leaves it in the live account | Reserved documentation addresses only; the upstream is stubbed in all automated runs |
| Upstream failure paths never exercised because the stub always succeeds | The stub is required to simulate duplicate, timeout, and error responses; the contract's `502` path has a dedicated case |
| Accessibility regressions introduced by visual work | The accessibility spot checks are part of the standard case set, not a separate engagement |
| No-JavaScript path silently broken by a client-side refactor | Every interactive feature has a no-JS case, and the entry criteria list the production build rather than the dev server |
| Visual review drift from the design system | Manual pass at the five defined breakpoints, comparing against `docs/design_system.md` rather than against a previous screenshot |
| An install command is transcribed correctly but the release it resolves does not exist yet, so the site's primary action dead-ends | `LP-007` is an explicit exit criterion: the manifest must return `latest.json` and the assets before the site is announced. Until then the section is provably correct and unusable, which is recorded rather than hidden |
| The application README is stale and a command is copied from it rather than from `installers/*` (`CON-013`) | Command fidelity is asserted against the installer scripts, not the README; the README is a cross-check only, and its known drift (agent count, palette count, Homebrew cask) is recorded in `CON-013` and `CON-015` |
| A package-manager line (Homebrew, winget, Scoop, apt) is added because it looks helpful | `BR-005.6` and `CON-015` forbid advertising an unverified channel; the case set asserts the absence of every channel name, and the cask is unresolvable today |
| A licence claim drifts back to the pre-v1.1 assumption | The licence text is asserted as MIT against the tracked `LICENSE`; the case set rejects a bare Apache-2.0 licence claim and rejects the deferred wording while the file exists |

## 10. Approval

| Name | Role | Date | Signature |
|------|------|------|-----------|
| F. Jibran | Product owner | | |

## 11. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-09-13 | F. Jibran | Initial plan. Strategy fixed by the system's shape: one endpoint, everything else build-time-validated content and client behaviour. |
| 1.1 | 2026-09-13 | F. Jibran | Added the command-fidelity test type and level for the install section (`SEC-006`), the `LP-007` release-gate exit criterion, installer execution moved out of scope, and three new risks covering the unresolvable manifest, README drift, and package-manager creep. |
| 1.2 | 2026-09-14 | F. Jibran | Landing page rebuilt to four bands on 2026-09-14: palette and FAQ flows retired, so their client-behaviour and content-accuracy clauses are replaced by the figure band, the mock and the stat strip. Level 2 component list, test data, exit criteria and risks updated to match; one risk added for the unreadable external figure. |
| 1.3 | 2026-09-15 | F. Jibran | Content-accuracy approach restated: the capability rows no longer print a repository path, so the check reads the application repository directly (`ENT-003`, `ENT-013`) instead of comparing the page against a `sourceFeature` field that no longer exists. Derived from `docs/srs.md` v1.3 and `docs/test_cases.md` v1.4. |
