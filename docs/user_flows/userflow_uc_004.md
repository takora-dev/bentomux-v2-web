# User Flow: Explore Supported Agent Runtimes

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Draft | **Last Updated:** 2026-09-15

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-004 |
| Name | Explore Supported Agent Runtimes |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Goal | Determine whether the CLI coding agent they already use is supported by Bentomux, and to what depth |
| Trigger | The visitor scrolls to capability row 04 (`#cap-runtimes` in `SEC-013`), or follows the stat strip's `21 agent CLIs detected` cell |
| Preconditions | The site is deployed. The agent content module matches the counts in `../Bentomux-v2/resources/manifests/` (21 files) and `../Bentomux-v2/src-tauri/src/agents/index.rs` (9 adapters). No account is required. |

## Main Flow

*The "happy path" — the most common, successful scenario.*

1. Visitor reaches capability row 04 (`#cap-runtimes`, in `SEC-013`) or the stat strip (`SEC-011`) → row 04 is titled **Runs what you already run.** and the strip carries the cell `21 agent CLIs detected`.
2. Visitor reads row 04's claim → *The CLIs on your PATH keep working as they are. Bentomux owns their terminal and derives their state; it does not wrap them, replace them or hold your prompts. 21 are detected out of the box.*
3. Visitor reads the evidence panel → eight runtime names as chips, and the note `21 detected · 9 also configurable`, which is what separates detection from a configuration surface (`BR-003.3`, `BR-003.4`).
4. Visitor looks for their own CLI → if it is among the eight names, the answer is immediate. It is a sample, not the roster: the figures and their labels are the whole of what the row states (`BR-002.1`).
5. Visitor optionally follows the repository link in the navigation bar or the footer → the manifest directory and the adapter registry are where the counts can be checked against the data (`BR-003.1`, `BR-003.2`).
6. Visitor optionally follows the stat strip's `21 agent CLIs detected` cell → it links to `#capabilities`, so the figure and the claim that explains it are one hop apart (`FR-002.8`).
7. **Goal achieved:** The visitor knows how many CLIs Bentomux detects, how many also get a configuration surface and which names the site is willing to show — without the site having overstated its capability.

## Alternative Flows

*Valid variations of the main flow that still lead to success.*

### Alt-1: The visitor's agent is detected but not configurable
**Trigger:** The visitor looks for an agent among the eight named in the panel and finds it, then asks whether it also gets a configuration surface.

1. The panel's note states the two counts separately: `21 detected · 9 also configurable`.
2. The claim itself states that Bentomux owns the terminal and derives the agent's state; configuration is presented as a subset, never as the default (`BR-003.3`).
3. The state vocabulary the row leans on — idle, working, blocked — is what the visitor has just read in the figure band (`SEC-012`): each workspace in the sidebar carries a state dot, and the selected pane states the state in words — `Working` beside its timer, `waiting for approval`, `state: idle · no prompt running` (`FR-002.2`, `FR-002.3`).
4. **Outcome:** The visitor learns that state tracking is the baseline and configuration is the exception. This is a truthful partial answer rather than an inflated complete one.

### Alt-2: The visitor's agent is not among the eight names shown
**Trigger:** The visitor's CLI is not one of the chips in row 04's evidence panel.

1. The note makes clear that the panel samples a larger set rather than exhausting it.
2. The row prints no repository path; the repository link in the navigation bar and the footer is the next step for a visitor who wants to compare the lists themselves (`BR-002.1` as amended, `FR-007.1`).
3. **Outcome:** The visitor leaves with the count, the distinction, and the path to the authoritative list — not with an unstated "probably not".

### Alt-3: Arrival on a narrow viewport
**Trigger:** The visitor views the row on a phone (`SRS BG-006`).

1. The row stacks its claim above its evidence panel, and the eight names wrap within the panel.
2. Every name stays readable; none is truncated, clipped, or hidden behind a "show more" control.
3. **Outcome:** The claim and its evidence are both readable at 375px width with no horizontal scrolling (`SRS BR-001.5`).

### Alt-4: Client-side JavaScript unavailable
**Trigger:** The visitor has JavaScript disabled.

1. The claim, the note and the eight names are server-rendered markup, not hydrated components.
2. The figure band renders its first workspace with its first tab, whose pane prints `Working` and `state: working`, so the state vocabulary is present without script (`FR-002.3`).
3. **Outcome:** The compatibility answer is fully available in the HTML.

### Alt-5: The visitor arrives from the stat strip
**Trigger:** The visitor activates the `21 agent CLIs detected` cell in `SEC-011`.

1. The page scrolls to the capability rows and row 04's heading comes to rest below the sticky navigation bar (`SRS FR-001.5`, `LAY-005`).
2. **Outcome:** The visitor sees the figure's own claim, with its evidence panel, in one hop (`FR-002.8`).

## Exception Flows

*Error conditions and failure scenarios.*

### Exc-1: The content module and the repository disagree
**Trigger:** The roster in `src/content/agents.ts` contains a different count or membership than `resources/manifests/*.toml` and `src-tauri/src/agents/index.rs` — for example, the site claims 21 while the repository has 22 manifests.

1. This is a content defect detected by the drift test case, not a runtime error (`SRS LP-006`).
2. Both printed numbers are derived from the roster's own arrays rather than typed, so an edited roster cannot produce a claim that contradicts its own panel (`BR-002.2`).
3. **Outcome:** Row 04 is internally consistent even while stale, and the drift test case reports the disagreement with the repository so the module can be corrected.

### Exc-2: A count is typed into the copy instead of derived
**Trigger:** Row 04's claim or the stat strip's label carries a literal `21` or `9` rather than reading `agentCounts`.

1. The build fails on the derived-count invariant, so a stale number cannot ship (`SRS BR-002.2`).
2. **Outcome:** The claim and the panel it sits above can never disagree with each other in production.

### Exc-3: The runtime names are styled to look interactive
**Trigger:** Hover styling, a pointer cursor, or a focus ring is applied to a runtime chip that has no action.

1. This contradicts `DS §9.6`: the names are list items inside an evidence panel, not controls.
2. **Outcome:** Prevented by review and by the test case asserting that no element in the panel is focusable or carries a button or link role.

### Exc-4: The star read fails while the other figures render
**Trigger:** The GitHub API read fails at build or revalidation time.

1. The star item is dropped from the strip; the `21 agent CLIs detected` cell, the platform count and the licence render as usual (`BR-002.3`).
2. **Outcome:** The band the visitor learns the counts from is never degraded by a third party's outage.

## Postconditions

*What must be true after this use case completes (success or failure).*

- The visitor has been told how many CLIs are detected and how many also receive a configuration surface, with both numbers derived from the same roster.
- The detection count and the configuration count are stated separately and labelled, so neither is read as the other.
- The site has not implied configuration support for any detection-only agent, and has not presented the eight names as the complete roster.
- The repository path behind the counts is not printed on the page; the figures and their labels are the whole of what the row states (2026-09-15).
- No data has been created or modified; the flow is read-only.

## Related Pages

*Screens or pages involved in this use case. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Entry point and the only page in this flow. `SEC-013` row 04 carries the claim; `SEC-011` carries the figure; `SEC-012` shows the state vocabulary the claim depends on. |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| `AgentRuntime` | `src/content/agents.ts` | Read | One entry per agent: identifier, display name, support level, and the repository artifact that evidences it. 21 entries carry `detected`; 9 of those carry `configurable`. |
| `agentCounts` | `src/content/agents.ts` | Read | Supplies both counts: row 04's claim, its panel's note, and the stat strip's cell. A typed literal for either number fails the build (`BR-002.2`). |
| `CapabilityRow` | `src/content/caps.ts` | Read | Row 04's number, title, claim, and the eight runtime names its panel shows. |
| `StatFact` | `src/content/stats.ts` | Read | The `21 agent CLIs detected` cell and its `#capabilities` destination (`FR-002.7`, `FR-002.8`). |
| `MockWorkspace`, `MockTab` | `src/content/mock.ts` | Read | The figure band's workspaces and their tabs; the selected tab's pane states the three states the claim refers to (`FR-002.2`). `MockAgentRow` was removed in v1.2 (2026-09-14): the application has no agent panel, so the mock draws workspaces only. |
| `SiteConfig` | `src/content/site.ts` | Read | Supplies the repository URL used by the navigation, the footer and the licence cell. |
| `WaitlistSubscriber` | — | None | Not used. |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] Row 04's claim states the detection count, and its evidence panel's note states the detection and configuration counts separately
- [ ] The stat strip renders the cell `21 agent CLIs detected` and links it to `#capabilities`
- [ ] The two printed counts are derived from `src/content/agents.ts`: a typed literal for either fails the build
- [ ] Row 04's evidence panel names eight runtimes, and the note makes clear that the configuration count is a subset of the detection count
- [ ] The panel presents itself as a sample rather than the roster: the figures and labels are the whole of what it states, and no repository path is printed
- [ ] The names in the panel are not focusable and carry no button or link role
- [ ] The count and membership agree with `resources/manifests/*.toml` (21 files) and `agents/index.rs` (9 adapters) (`LP-006`)
- [ ] Row 04 contains no claim of configuration support for a detection-only agent
- [ ] At 375px width every name in the panel is fully readable with no horizontal scrolling and no truncation
- [ ] The claim, the note and the names are present with JavaScript disabled

## Traceability

*Link back to the SRS requirements this use case satisfies.* The `F003` requirements `FR-003.1`–`FR-003.6` were withdrawn with the `#agents` band in `srs.md` v1.2. What this flow still verifies is the derivation rule set `BR-003.1`–`BR-003.7`, which stays in force, plus the two `F002` requirements that now render the counts.

| Requirement ID | Requirement Description | How This Flow Satisfies It |
|----------------|------------------------|---------------------------|
| FR-002.7 | Stat strip renders the detected agent count, the platform count and the licence | Main flow step 1; AC 2 |
| FR-002.8 | Each figure names its destination | Main flow step 6; Alt-5; AC 2 |
| FR-002.1 | Five capability rows, including the breadth of supported agent runtimes | Main flow step 1; `SEC-013` row 04 |
| FR-002.4 | Each row presents an ordinal, a heading, a claim and an evidence panel | Main flow steps 2, 3; AC 1, 4, 5 |
| FR-002.6 | Claims limited to behaviour present in the repository | Data Used table; AC 5, 7 |
| BR-002.1 | Counts are checked against repository paths that exist, and no path is printed | Main flow step 5; AC 5, 7 |
| BR-002.2 | Counts rendered from the typed module, never typed as literals | Exc-2; AC 3 |
| BR-002.3 | No figure the project cannot stand behind | Exc-4; AC 2 |
| BR-003.1 | Detection count is 21, from the manifest directory | AC 1, 3, 7 |
| BR-003.2 | Configuration list is 9, from the adapter registry | AC 1, 4, 7 |
| BR-003.3 | Must not state or imply configuration support for all agents; the panel must label the subset | Alt-1; AC 4, 8 |
| BR-003.4 | Wording pattern that states detection and deep-configuration separately | Main flow step 3; AC 1 |
| BR-003.5 | Agent names used descriptively; footer trademark disclaimer present | `SEC-010`; `SRS FR-009.3` |
| BR-003.7 | The runtime panel and both counts stay readable below `md` with no horizontal scrolling, and the panel names eight chips rather than all 21 | Alt-3; AC 4, 5, 9 |
| BR-003.6 | QwenPaw is configurable without a detection manifest | The roster carries it as configurable; `SEC-013` prints counts rather than membership, so the rule is enforced by the module and its invariants |
| CLR-001 | One accent only; the panel's names do not compete with the primary action | `DS §9.6` |
| CON-013 | README is stale; facts sourced from code | Exc-1; Main flow step 5 |
| NFR-006.3 | Malformed content fails the build | Exc-2 |
| NFR-008.4 | Primary content server-rendered and indexable | Alt-4 |
| LP-006 | Agent counts re-verified against the repository before each deploy | AC 7 |
