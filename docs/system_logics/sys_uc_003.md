# UCIC: Install Bentomux

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Draft | **Last Updated:** 2026-09-13

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-003 |
| Name | Install Bentomux |
| Actor | Visitor deciding whether to install (unauthenticated, per `SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_003.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` | `SEC-006` hosts the install switcher, the three panels, the installer steps and the manual-download line. No other page participates. |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-005 InstallOption | Supplies the three operating-system options, the server-rendered default, and the per-panel notes | Read |
| ENT-010 InstallCommand | Supplies every command as a single-line verbatim string with its role, source path and root requirement | Read |
| ENT-011 InstallerStep | Supplies the three-step explanation of what the installer does | Read |
| ENT-012 ManualDownloadList | Supplies the five artifact formats and the reference that resolves to the latest release page | Read |
| ENT-001 SiteConfig | Resolves the manual-download destination; the install commands carry their own script URLs and do not resolve through config | Read |

## Sequence Diagram

```
Visitor          Install Switcher      Panel (CSS)        Command Block        Clipboard
   |                    |                  |                    |                 |
   |--[load page]------>|                  |                    |                 |
   |                    |--[macOS checked in served HTML]------>|                 |
   |                    |                  |--[panel visible, command rendered as text]
   |                    |                  |                    |                 |
   |--[activate copy control]--------------------------------->|--[navigator.clipboard.writeText]
   |                    |                  |                    |<- - -[resolve/reject]
   |< - - - - - - - - - - - - - - - - - - - - - - - - - - - - -[text: "Copied" | "Copy failed…"]
   |                    |                  |                    |                 |
   |--[select Linux]--->|                  |                    |                 |
   |                    |--[checks radio; CSS reveals Linux panel]---------------->|
   |                    |                  |--[previous panel hidden, same scroll position]
   |                    |                  |                    |                 |
   |--[select Windows]->|--[same mechanism; PowerShell command and fallback shown]--->|
```

*Describe each step in the sequence:*
1. **User/Frontend:** The page is served with the macOS option already checked and all three panels in the HTML (`FR-005.2`, `FR-005.6`). No script is required to reach a usable state.
2. **API Gateway:** Not applicable — selecting a panel makes no request (`BR-005.8`). The commands themselves, when pasted into a shell, contact the repository's own hosts; that traffic belongs to the visitor's terminal, not to this page.
3. **Backend Service:** None. The install module is static content read at build time.
4. **Database:** Not applicable.
5. **Response:** Copy feedback is written into the command block's own region as text (`CPY-002`). If a client script preselected the detected platform, it did so before any interaction and changed only which radio is checked (`FR-005.4`).

## API Contract

### Endpoint

```
None — this use case makes no HTTP request.
```

The section renders from static content. Nothing is fetched on load, on panel switch, or on copy. The only network traffic the section can cause is the visitor's own shell following a pasted command, which the page neither performs nor proxies.

### Component Contract — `InstallSwitcher`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| options | `InstallOption[]` | Yes | The three operating-system options in render order | Exactly three; the schema fails the build otherwise (`FR-005.1`) |
| defaultId | `string` | Yes | Which option is checked in the served HTML | Must equal the entry whose `isDefault` is `true`, which must be `macos` (`FR-005.2`) |
| detectedId | `string \| null` | No | Hint from a client script after hydration | Applied only while the visitor has not interacted, and only by changing the checked input — never by rewriting text or re-ordering elements (`FR-005.4`) |

State transitions:

| From | To | Trigger | Declared Behaviour |
|------|----|---------|--------------------|
| `macos` checked | `linux` checked | Option activation by pointer | The Linux panel becomes visible in the same position; no request, no URL change, no scroll (`BR-005.8`) |
| `macos` checked | `windows` checked | Option activation by pointer | Windows panel visible; the PowerShell command and its fallback are both reachable |
| any | any | Arrow keys within the group | Selection moves with wrap-around; the group remains a single Tab stop (`NFR-007.10`) |
| any | any | `Tab` leaving the group | Focus moves to the copy control inside the visible panel |
| any | any | Page reload | Returns to `macos`, because nothing is persisted (`BR-005.8`) |

### Component Contract — `CommandBlock`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| command | `InstallCommand` | Yes | The entry to render | `command` must be a single line and must equal its source string character for character (`BR-005.1`) |
| caption | `string` | Yes | Names the platform and the command's role | Referenced from the block with `aria-labelledby` (`CMD-001`) |

State transitions:

| From | To | Trigger | Declared Behaviour |
|------|----|---------|--------------------|
| idle | copied | Copy control activated, clipboard write resolves | Text inside the block's region reads "Copied"; the command itself is unchanged and still selectable (`CPY-002`) |
| idle | failed | Copy control activated, clipboard write rejects or is unavailable | Text reads "Copy failed — select the command manually"; the command is still selectable (`CPY-003`) |
| copied / failed | idle | Short delay | Feedback text reverts; no persistent state is written |

### Request Headers

Not applicable.

### Request Payload

Not applicable.

### Response Payload (Success)

Not applicable at the HTTP level. The rendered content of each panel is fixed by the install module:

```text
macOS     switch option "macOS"      -> selected in served HTML (FR-005.2)
          command (kind=install)     -> transcribed from installers/install.sh
          note                       -> build is unsigned and unnotarized; first launch
                                        may require confirmation in System Settings
                                        -> Privacy & Security (FR-005.8)
Linux     command (kind=install)     -> AppImage install, transcribed from installers/install.sh
          command (kind=install)     -> package mode, requiresRoot = true (BR-005.5)
          note                       -> package mode needs root
          note                       -> AppImage needs libfuse2 (the only place "sudo" appears)
          note                       -> x86_64 only (FR-005.13)
Windows   command (kind=install)     -> PowerShell, transcribed from installers/install.ps1
          command (kind=fallback)    -> install.cmd for environments where PowerShell is blocked
          note                       -> installs without administrator rights
shared    steps (ENT-011)            -> resolve the manifest, verify SHA-256 and refuse a
                                        mismatch, install without administrator rights
shared    manual line (ENT-012)      -> .dmg, .AppImage, .deb, .msi, -setup.exe, one link to
                                        the latest release page
shared    pin example (kind=pin)     -> installer command with the manifest URL pinned to vX.Y.Z
```

No package-manager command may appear in this block (`BR-005.3`, `BR-005.6`).

### Status Codes

| Status | Meaning | Condition | Response Body |
|--------|---------|-----------|---------------|
| — | No HTTP exchange occurs | Every path in this use case | — |

The only HTTP status a visitor encounters on this page is the `200` of the document itself. A `404` on a release asset is outside this page's control and is prevented by the release gate rather than handled here (`LP-007`).

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Switcher option label | — | `ENT-005 InstallOption.label` | Option text | Operating system name only, no architecture (`BR-005.7`) |
| Selected option | — | `ENT-005 InstallOption.isDefault` | `checked` attribute in served HTML | Exactly one, and it is `macos` (`FR-005.2`) |
| Command text | — | `ENT-010 InstallCommand.command` | Rendered mono text | Verbatim from `sourcePath`; never re-wrapped or translated |
| Root note | — | `ENT-010 InstallCommand.requiresRoot` | Note beside the command | `true` only for the Linux package-mode command (`BR-005.5`) |
| Panel notes | — | `ENT-005 InstallOption.notes` | Rendered as `--text-muted` prose | The unsigned-build note uses `--color-warning` |
| Installer steps | — | `ENT-011 InstallerStep.text`, `.order` | Ordered list of three | Describes only behaviour the scripts have (`BR-009.7`) |
| Manual-download formats | — | `ENT-012 ManualDownloadList.formats` | One sentence naming five suffixes | Rendered as text, not as five links (`CMD-005`) |
| Manual-download link | — | `ENT-012 ManualDownloadList.destinationKey` → `ENT-001 SiteConfig.releasesLatestUrl` | Single anchor | Resolved from config, never a literal (`BR-001.3`) |
| Copy feedback | — | — | Text inside the block's region | Success and failure both announced as text, never by colour alone (`CLR-003`) |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| InstallCommand.command | Must appear character for character in the file named by `sourcePath` | Build fails: `command does not match its source` | `BUILD_COMMAND_MISMATCH` |
| InstallCommand.command | Single line; no `\n`, no trailing whitespace | Build fails: `command contains a line break` | `BUILD_COMMAND_WRAPPED` |
| InstallCommand.command | No version literal other than the `vX.Y.Z` placeholder in the `pin` entry | Build fails: `command contains a version literal` | `BUILD_COMMAND_VERSION_LITERAL` |
| InstallCommand.command | No host outside `github.com/takora-dev/bentomux-v2` and `raw.githubusercontent.com/takora-dev/bentomux-v2` | Build fails: `command references an unapproved host` | `BUILD_COMMAND_HOST` |
| InstallCommand.requiresRoot | `true` only on the Linux package-mode command | Build fails: `unexpected root requirement` | `BUILD_COMMAND_ROOT` |
| InstallOption.isDefault | Exactly one `true`, and it must be `macos` | Build fails: `install default is not macOS` | `BUILD_INSTALL_DEFAULT` |
| InstallOption.label | Operating system name only; no architecture, version, or file size | Content review: label contains an architecture string | `CONTENT_ARCHITECTURE_LABEL` |
| Panel content | No package-manager channel (`winget`, `choco`, `scoop`, `brew`, `apt` as an install channel, `yay`, `pacman`, `nix`, `flatpak`, `port`, Docker) | Content-absence test fails | `CONTENT_PACKAGE_MANAGER` |
| InstallerStep | Exactly three entries | Build fails: `installer step count mismatch` | `BUILD_STEP_COUNT` |
| ManualDownloadList.formats | Exactly five suffixes matching the artifacts the build workflow produces | Build fails: `manual download format mismatch` | `BUILD_MANUAL_FORMATS` |
| Panel switch | Must perform no navigation, no request, and no storage write | Test: switching options leaves the URL and storage untouched | `UI_PANEL_SIDE_EFFECT` |

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| JavaScript unavailable | N/A | Server-rendered markup | All three panels are present and the macOS panel is visible; the option group still switches panels through CSS alone. The copy control is absent, but every command is selectable text (`NFR-007.3`) |
| Copy control fails or clipboard unavailable | N/A | — | Text inside the block reports the failure and asks the visitor to select the command; the command is never hidden or replaced (`CPY-003`) |
| Client-side platform detection fails | N/A | — | The served default stands: macOS stays checked. The failure is silent because the fallback is already correct (`FR-005.2`) |
| Preselection would override an explicit choice | N/A | — | The script must check interaction state first and do nothing. Overriding the visitor's choice is a defect, not a fallback (`FR-005.4`) |
| Release manifest missing at the destination | N/A | — | The page renders unchanged; this condition is a release-gate failure caught by the deploy check, not by the page (`LP-007`) |
| Long command wider than its column | N/A | — | The command scrolls horizontally inside its own block and must not wrap or widen the page (`CMD-003`) |
| Reduced motion requested | N/A | — | Panel switching is instantaneous; no transition is defined for it (`MOT-002`, `MOT-003`) |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_003.md` | This UCIC implements the flow defined there |
| Data Model | `docs/data_model.md` §3 ENT-005, ENT-010, ENT-011, ENT-012, ENT-001; §5 Install Rules; §6 uniqueness keys | This UCIC uses entities and rules defined there |
| SRS | `docs/srs.md` §3.5 F005 (incl. `BR-005`), `CON-014`, `CON-015`, `LP-007` | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §7 SEC-006, §10 accessibility table | Section content, default state, and accessibility expectations come from there |
| Design System | `docs/design_system.md` §9.9 Install switcher and panels, §9.10 Install command block and copy control, §9.1 Button, §7 MOT-001/MOT-002/MOT-003, §11 Accessibility Contract | Switcher, command block, copy control, and motion rules come from there |
