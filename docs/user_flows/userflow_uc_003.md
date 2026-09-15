# User Flow: Install Bentomux

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Draft | **Last Updated:** 2026-09-13

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-003 |
| Name | Install Bentomux |
| Actor | Visitor deciding whether to install (unauthenticated, per `SRS §2.3`) |
| Goal | Obtain the exact command that installs Bentomux on their own machine, or reach the release assets to install by hand |
| Trigger | The visitor reaches `SEC-006` and selects an operating system |
| Preconditions | The site is deployed. `SEC-006` is rendered. The installer scripts live in the application repository and are the source of every command shown (`SRS CON-014`). A tagged release publishing the release manifest and the platform assets exists before the site may deploy (`SRS LP-007`). |

## Main Flow

*The "happy path" — the most common, successful scenario.*

1. Visitor reaches `SEC-006` → reads a heading, one sentence naming the three supported operating systems, and a single-select group of three options: macOS, Linux, Windows (`SRS FR-005.1`, `FR-005.13`).
2. The macOS option is already selected in the served HTML, so the macOS panel is visible without any interaction (`SRS FR-005.2`). The visitor reads one command rendered as selectable text in a mono block (`SRS FR-005.3`), the unsigned-build note beside it (`SRS FR-005.8`), and the three-step list describing what the installer does: resolve the release manifest, verify the download against its SHA-256 digest and refuse a mismatch, then install without administrator rights (`SRS FR-005.10`).
3. Visitor activates the copy control beside the command → the control reports success as text, and the command stays readable and selectable (`SRS FR-005.5`).
4. Visitor selects Linux → the Linux panel becomes visible in place, in the same section and at the same scroll position. It shows the AppImage command, a note that the package mode needs root, and the libfuse2 remedy for the AppImage (`SRS FR-005.7`).
5. Visitor selects Windows → the Windows panel becomes visible with the PowerShell command and the `install.cmd` fallback for environments where PowerShell is blocked (`SRS FR-005.9`).
6. Visitor who prefers to install by hand reads the single manual-download line, which names the five published artifact formats and links once to the latest release page (`SRS FR-005.11`).
7. **Goal achieved:** The visitor has the verbatim installer command for their operating system, or a route to the release assets, without leaving the page.

## Alternative Flows

*Valid variations of the main flow that still lead to success.*

### Alt-1: Client-side JavaScript unavailable
**Trigger:** The visitor has JavaScript disabled.

1. All three panels are present in the served HTML, and the visibility of the two non-default panels is expressed in CSS from the checked option rather than by a script (`SRS FR-005.6`).
2. The macOS panel is visible, and selecting another option with a pointer or keyboard reveals its panel without a request.
3. The copy control is not available, but every command is real text that can be selected and copied by hand (`SRS FR-005.5`).
4. **Outcome:** The visitor installs from the same commands as a visitor with full scripting. No information is locked behind the copy control.

### Alt-2: Keyboard-only navigation
**Trigger:** The visitor operates by keyboard alone.

1. Tab reaches the option group as a single stop, and the option group accepts arrow keys with wrap-around to change the selection (`SRS NFR-007.10`).
2. Tab reaches the copy control, which reports its result as text when activated by Enter or Space (`SRS NFR-007.11`).
3. The manual-download link is reachable and names its destination in visible text.
4. **Outcome:** The whole section is operable without a pointer, and the visible selection state matches the keyboard state (`DS §9.9`).

### Alt-3: The detected operating system differs from macOS
**Trigger:** A client script detects the visitor's platform after hydration.

1. The script may move the selection to the detected option only while the visitor has not yet chosen one (`SRS FR-005.4`).
2. The swap changes which option is checked and nothing else: no text changes, no element is re-ordered, and no layout shift occurs.
3. **Outcome:** The visitor usually lands on the right panel without ever seeing the section jump. If they already chose, their choice stands.

### Alt-4: The clipboard is unavailable
**Trigger:** The visitor activates the copy control in a context where the clipboard API is blocked or unavailable.

1. The control reports the failure as text and asks the visitor to select the command manually (`SRS FR-005.5`).
2. The command remains fully selectable for the whole session (`SRS NFR-007.11`).
3. **Outcome:** The visitor's task is unchanged; only the convenience is lost. The failure is never silent and is never announced by colour alone.

### Alt-5: Returning to a previously viewed panel
**Trigger:** The visitor selects macOS again after viewing Linux and Windows.

1. The previously seen panel is shown again, in the same state as before (`SRS BR-005.8`).
2. No request is issued and no state is stored, so a reload returns the section to its default macOS state.
3. **Outcome:** The section is stateless by design; the visitor can never be stuck looking at a stale or empty panel.

## Exception Flows

*Error conditions and failure scenarios.*

### Exc-1: A rendered command diverges from the installer script
**Trigger:** A command is reworded, re-wrapped, translated into prose, or invented while editing the content module.

1. This is a specification violation rather than a runtime error: it contradicts `SRS BR-005.1` and `BR-005.9`.
2. It is caught by the build-time comparison that requires every rendered command to appear character for character in the file named by its source path, and by content review.
3. **Outcome:** The divergence cannot ship. If the installer itself changes, the site change ships in the same revision as the installer change (`SRS BR-005.9`).

### Exc-2: A version literal or an unapproved host appears
**Trigger:** A command, note, or step states a concrete version number, a release date, a size, or a host outside the repository's own two hosts.

1. Contradicts `SRS BR-005.4` and `BR-005.2`. A version number written into prose becomes stale silently, which is exactly what the rule forbids.
2. Caught by the schema pattern check over the install module and by the content-absence test case.
3. **Outcome:** The only version literal on the page remains the `vX.Y.Z` placeholder in the pinned-manifest example (`SRS FR-005.12`).

### Exc-3: The release destination does not resolve
**Trigger:** The latest release page or the release manifest referenced by the installer is missing.

1. The visitor may follow the manual-download link to a release page with no assets, or the installer may fail with "cannot reach the release manifest".
2. The site is not permitted to deploy in this state: a tagged release must publish the manifest and the platform assets first (`SRS LP-007`).
3. **Outcome:** The defect is treated as a release-gate failure, not as page copy to be softened. The section never restates an availability the release does not have.

### Exc-4: A channel is advertised that does not exist
**Trigger:** A package-manager line is added for a channel with no published formula, cask, or package.

1. Contradicts `SRS BR-005.3`. A Homebrew line is additionally barred while the cask does not resolve (`SRS BR-005.6`, `CON-015`).
2. Caught by the content-absence test case enumerating the forbidden channels.
3. **Outcome:** Only channels that resolve are shown. Adding one later is a content revision with evidence that it resolves, not an aspirational line.

### Exc-5: `prefers-reduced-motion` is set
**Trigger:** The visitor's operating system requests reduced motion.

1. Switching panels is an instantaneous state change rather than an animation, so no transition runs and nothing is lost (`DS MOT-003`).
2. **Outcome:** The section is fully functional; only animation is removed.

## Postconditions

*What must be true after this use case completes (success or failure).*

- The visitor has seen one command per supported operating system, each copied from the installer scripts in the application repository (`SRS BR-005.1`).
- Exactly one option is selected at all times, and it is the macOS option in the served HTML (`SRS FR-005.2`).
- No panel switch issued a network request, changed the URL, or persisted anything (`SRS BR-005.8`).
- Copy feedback was delivered as text, and the command remained selectable afterwards (`SRS NFR-007.11`).
- The macOS panel disclosed that the build is unsigned and unnotarized, and named where the first-launch confirmation lives (`SRS FR-005.8`).
- Linux is presented as x86_64 only (`SRS FR-005.13`).
- No command, note, or step contains a version number, a release date, or a size beyond the `vX.Y.Z` placeholder (`SRS BR-005.4`).

## Related Pages

*Screens or pages involved in this use case. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Entry point and the only page in this flow. `SEC-006` hosts the install switcher, the panels, the installer steps and the manual-download line. |
| PAGE-002 | Privacy policy | Reachable from the footer if the visitor wants to read the data policy before installing. The installer page itself collects nothing. |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| `InstallOption` | install content module under `src/content/` | Read | Supplies the three operating-system options, exactly one of which is the server-rendered default, plus the per-panel notes. |
| `InstallCommand` | install content module under `src/content/` | Read | Supplies every command as a single-line verbatim string with its role, its source path, and whether it needs root. |
| `InstallerStep` | install content module under `src/content/` | Read | Supplies the three-step explanation of what the installer does. |
| `ManualDownloadList` | install content module under `src/content/` | Read | Supplies the five artifact formats and the destination reference for the manual-download line. |
| `SiteConfig` | `src/content/site.ts` | Read | Supplies the latest-release destination through the reference the manual-download list holds, and the repository URL used by the nav and community sections. |
| `WaitlistSubscriber` | — | None | This use case creates no record. Installing collects no personal data, and no field is submitted from `SEC-006`. |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] The switcher renders exactly three options, labelled macOS, Linux, and Windows, with no architecture in any label
- [ ] macOS is selected in the HTML as served, before any script runs
- [ ] All three panels exist in the served HTML, with the two non-default panels hidden by CSS from the checked option rather than by scripting
- [ ] Every rendered command equals its source string character for character, including flag order and quoting
- [ ] The manual-download line is one link naming five artifact formats, not five links
- [ ] The pinned-manifest example is the only place a version appears, and it uses the `vX.Y.Z` placeholder
- [ ] `sudo` appears nowhere except in the Linux libfuse2 note, and the package mode is described as needing root without prefixing the command
- [ ] No `winget`, Chocolatey, Scoop, Homebrew, AUR, Nix, Flatpak, MacPorts, or Docker command appears anywhere on the page
- [ ] Panel switching issues no request, changes no URL, and writes no cookie or storage entry
- [ ] The copy control reports both success and failure as text, and the command stays selectable afterwards
- [ ] The whole switcher is one Tab stop and is operable with arrow keys
- [ ] No anchor anywhere on the page resolves to a 404 on the repository

## Traceability

*Link back to the SRS requirements this use case satisfies.*

| Requirement ID | Requirement Description | How This Flow Satisfies It |
|----------------|------------------------|---------------------------|
| FR-005.1 | Single-select group of exactly three operating-system options | Main flow step 1; AC 1 |
| FR-005.2 | macOS selected in the server-rendered HTML | Main flow step 2; AC 2 |
| FR-005.3 | One command block per panel, rendered as selectable mono text | Main flow step 2; `DS §9.10` |
| FR-005.4 | Client-side preselection may not override an explicit choice, change text, or shift layout | Alt-3 |
| FR-005.5 | Copy control reports success and failure as text | Main flow step 3; Alt-4; AC 10 |
| FR-005.6 | All panels server-rendered, visibility expressed in CSS | Main flow step 2; Alt-1; AC 3 |
| FR-005.7 | Linux panel: AppImage command, root requirement, libfuse2 remedy | Main flow step 4 |
| FR-005.8 | macOS panel: unsigned and unnotarized disclosure plus the first-launch path | Main flow step 2; Postconditions |
| FR-005.9 | Windows panel: PowerShell command plus the blocked-PowerShell fallback | Main flow step 5 |
| FR-005.10 | Three-step statement of what the installer does | Main flow step 2 |
| FR-005.11 | One manual-download line naming five formats behind a single link | Main flow step 6; AC 5 |
| FR-005.12 | Pinned-manifest example using the `vX.Y.Z` placeholder | Exc-2; AC 6 |
| FR-005.13 | Linux stated as x86_64 only | Main flow step 1; Postconditions |
| BR-005.1 | Commands are transcriptions, byte-identical to the installer scripts | Main flow step 2; Exc-1; AC 4 |
| BR-005.2 | Only the repository's own hosts may appear | Exc-2 |
| BR-005.3 | No package manager may be advertised as an install channel | Exc-4; AC 8 |
| BR-005.4 | No version literal except the `vX.Y.Z` placeholder | Exc-2; AC 6 |
| BR-005.5 | Root is required only by the Linux package mode | Main flow step 4; AC 7 |
| BR-005.6 | No Homebrew line while the cask does not resolve | Exc-4; AC 8 |
| BR-005.7 | Operating-system labels only, no architecture claims | AC 1 |
| BR-005.8 | Selection is stateless: no request, no navigation, no persistence | Alt-5; AC 9 |
| BR-005.9 | An installer change requires a same-revision site change | Exc-1 |
| NFR-007.10 | Switcher is one Tab stop, arrow-key operable, state exposed | Alt-2; AC 11 |
| NFR-007.11 | Copy feedback is text and the command stays readable | Main flow step 3; Alt-4; AC 10 |
| CON-014 | Installer scripts live in the application repository; the site quotes and never reimplements them | Preconditions; Exc-1 |
| LP-007 | A tagged release publishing the manifest and assets precedes deployment | Preconditions; Exc-3 |
| MOT-003 | All transitions collapse under reduced motion | Exc-5 |
