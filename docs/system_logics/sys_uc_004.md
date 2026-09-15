# UCIC: Explore Supported Agent Runtimes

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Draft | **Last Updated:** 2026-09-15

> **Band note (v1.2).** The roster band (`SEC-003`, `#agents`) was removed when the landing page was rebuilt to its six-band structure; `SEC-003` stays retired and is never reused. This use case still exists and is still load-bearing: it surfaces through **capability row 04 of `SEC-013`** (the claim, the two counts and a panel of eight runtime chips) and through the **detected-runtime figure of the stat strip `SEC-011`**. Everything below describes those two surfaces.

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-004 |
| Name | Explore Supported Agent Runtimes |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_004.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` | Capability row 04 (`SEC-013`) states the claim and both counts; its evidence panel lists eight runtimes by name. The stat strip (`SEC-011`) repeats the detected count as one of its figures. |
| — | Repository | Not a screen. The row's counts are checked against the manifest directory and the adapter registry at content review; the page itself prints no path, since the evidence line was retired on 2026-09-15. |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-003 AgentRuntime | The roster: one entry per detected agent, plus the nine that also have an adapter | Read |
| ENT-013 CapabilityRow | Row `04` carries the claim, the two derived counts and the `runtimes` evidence panel | Read |
| ENT-015 StatFact | The runtime figure: the detected count, linking back to `#capabilities` | Read |

## Sequence Diagram

```
Visitor              Capability row 04 (RSC)        Content modules (build memory)
   |                          |                              |
   |--[scroll to row 04]----->|                              |
   |                          |--[agentCounts.detected------>|
   |                          |--[agentCounts.configurable-->|
   |                          |--[resolve 8 chip ids-------->|
   |                          |<--[21 / 9 / 8 names]---------|
   |                          |--[interpolate into body + note]
   |                          |--[render row + chip panel]
   |<--[HTML: number, title, body, chips, note]--|
   |                          |                              |
   |--[read the chips]------->|  (not interactive; no click, no request)
   |--[scroll to stat strip]->  (same count, different surface)
```

*Describe each step in the sequence:*
1. **User/Frontend:** The visitor scrolls to row 04 and reads. The chips are deliberately not interactive: there is no click, no tooltip and no expand (`design_system.md` §9.6, `CAP-002`).
2. **API Gateway:** Not applicable. This use case makes no request. The page's single outbound call — the star count read, owned by UC-001 and catalogued in the registry's §4.6 — is part of the stat strip and never touches the roster.
3. **Backend Service:** The row renders at build time from `ENT-013`, interpolating the counts from `ENT-003`. The body carries one count, the note carries both, and the eight chip labels are resolved from the roster by id, so the copy cannot claim a number or a name the data does not support (`CAP-003`).
4. **Database:** Not applicable. The roster is a validated static module (`data_model.md` §6).
5. **Response:** One numbered row: `04`, its title, a body that states the detected count, and the panel — eight chips plus a note carrying both counts. Every distinction the visitor must make is in text, not only in colour (`CLR-003`).

## API Contract

### Endpoint

```
None — this use case makes no HTTP request.
```

The row is server-rendered. It is the part of the page whose whole purpose is factual precision, so it must read as data with evidence rather than as prose.

### Component Contract — `CapsSection` (row `04`, panel kind `runtimes`)

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| capabilities | `readonly CapabilityRow[]` | Yes | The five rows, in `order` | Exactly five, one of which is `id: "runtimes"` (`requireCount`, `requireUnique`) |
| capability.body | `string` | Yes | The claim, with the detected count interpolated | Must contain `String(agentCounts.detected)` — a typed numeral fails the build (`CAP-003`) |
| evidence.names | `readonly string[]` | Yes | The eight chip labels | Each resolved from `ENT-003` by id; an unknown id throws at import |
| evidence.note | `string` | Yes | The line under the chips | Rendered from `agentCounts`; carries both counts |

Derived values, all computed from `ENT-003` rather than typed anywhere:

| Derived value | Computation | Rendered as |
|---------------|-------------|-------------|
| detected count | `detectedAgents.length` | The number in row 04's body, and the runtime figure in `SEC-011` |
| configurable count | `configurableAgents.length` | The second number in row 04's note |
| chip labels | `runtimeChipIds.map(id => detectedAgents.find(a => a.id === id)!.name)` | The eight chips |

### Chip treatment

| Rule | Source |
|------|--------|
| A chip is not interactive: no `onClick`, not focusable, not styled to suggest it is clickable | `design_system.md` §9.6, `CAP-002` |
| Chip text is the roster's own display name, not the manifest id | `ENT-003.name` |
| The panel states no count that is not also in the row's text | `BR-002.3` |

### Request Headers

Not applicable.

### Request Payload

Not applicable.

### Response Payload (Success)

Not applicable at the HTTP level. The delivered structure is fixed:

```html
<li id="cap-runtimes">           <!-- SEC-013, row 04 -->
  <p>04</p>
  <h3>Runs what you already run.</h3>
  <p>… 21 are detected out of the box.</p>   <!-- count interpolated, never typed -->
  <div>                                       <!-- evidence panel, kind "runtimes" -->
    8 chips: Claude Code · OpenAI Codex · Cursor · Gemini CLI · Grok CLI · OpenCode · pi · GitHub Copilot
    <span>21 detected · 9 also configurable</span>
  </div>
</li>
```

The wording may change; the two numbers may not, because they are rendered from the data.

### Status Codes

| Status | Meaning | Condition | Response Body |
|-------|---------|-----------|---------------|
| — | No HTTP exchange occurs | Entire use case | — |

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Row body count | — | `ENT-003` `detectedAgents.length` | The phrase "21 are detected out of the box" | 21 in v1. Never a literal in the copy source (`CAP-003`) |
| Panel note | — | `ENT-003` `detectedAgents.length`, `configurableAgents.length` | "21 detected · 9 also configurable" | The only place both numbers appear together |
| Chip label | — | `ENT-003 AgentRuntime.name` | Chip text | The display name the application's adapter reports, not the manifest id |
| Chip set | — | `ENT-003` entries whose `id` is in `runtimeChipIds` | Eight chips | A fixed subset of the 21, chosen for recognisability; the panel is not the roster |
| Runtime figure in `SEC-011` | — | `ENT-015 StatFact.value` = the detected count | The strip's "agents" figure, linking to `#capabilities` | Same source as the row, so the two cannot disagree (`FR-002.7`) |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| Roster size | Exactly 21 entries | Build fails: `[content] detected agent count must match the 21 manifests (BR-003.1)` | `BUILD_AGENT_COUNT` |
| Configurable subset | Exactly 9 entries | Build fails: `[content] configurable agent count must match the adapter registry (BR-003.2)` (also `configurableAgents must have exactly 9 entries, found N`) | `BUILD_AGENT_CONFIGURABLE_COUNT` |
| QwenPaw | Must not appear in the detected list (it has no detection manifest) | Build fails: `[content] QwenPaw has no detection manifest and must not appear in the detected list (BR-003.6)` | `BUILD_AGENT_QWENPAW` |
| Roster keys | No duplicate `id` in either list | Build fails: `[content] detectedAgents contains a duplicate key "<id>"` / `[content] configurableAgents contains a duplicate key "<id>"` | `BUILD_AGENT_DUPLICATE` |
| Row 04 count | Body must carry the derived number, not a typed numeral | Build fails: `[content] capability row 04 must carry the derived detected count, not a literal` | `BUILD_CAP_COUNT_LITERAL` |
| Row 04 chips | Every chip id must exist in the roster | Build fails: `[content] capability row 04 names unknown agent "<id>" (ENT-013)` | `BUILD_CAP_AGENT_UNKNOWN` |
| Row count | Exactly five capability rows, unique ids | Build fails: `[content] capabilities must have exactly 5 entries, found N` / `[content] capabilities contains a duplicate key "<id>"` | `BUILD_CAP_COUNT` |
| Configurable claim | Every `configurable` entry needs an adapter in `src-tauri/src/agents/index.rs` | Content review: `configurable claim unverified` | `CONTENT_AGENT_CLAIM` |
| Detected claim | Every entry needs a manifest under `resources/manifests/` | Content review: `detected claim unverified` | `CONTENT_AGENT_EVIDENCE` |
| Copy wording | Must not imply that every detected runtime is also configurable | Test: the note states both counts, and the body says detection only | `UI_AGENT_WORDING` |
| Chip interaction | Chips must not be focusable or clickable | Test: `Tab` skips every chip; no `role="button"` present | `UI_CHIP_INTERACTIVE` |

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| Content module fails a count invariant | N/A | — | Deployment is aborted. No visitor ever sees a row claiming a number the data does not support (`NFR-006.3`) |
| A chip id is dropped from the roster upstream | N/A | — | The build fails at import (`BUILD_CAP_AGENT_UNKNOWN`) rather than rendering a chip for a runtime the repository no longer detects |
| JavaScript unavailable | N/A | Server-rendered markup | The panel is fully readable; nothing here requires JavaScript (`NFR-007.3`) |
| Application adds an adapter or manifest after publication | N/A | — | The site is not auto-updated. `LP-006` requires re-verifying the roster and the two counts before the next deploy, which is exactly the review this row exists to support |
| An agent is renamed upstream | N/A | — | A content commit updates `ENT-003.name`. The `id` stays stable, so the chip lookup and the tests are unaffected |
| Star read fails | N/A | — | The stat strip drops its star figure and keeps the runtime figure; the two surfaces are independent (`FR-002.7`, `BR-002.3`) |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_004.md` | This UCIC implements the flow defined there; the flow's own band references are being re-homed to `SEC-013` row 04 |
| Data Model | `docs/data_model.md` §3 ENT-003, ENT-013, ENT-015; §5 Capability Row rules and Agent Roster rules; §6 uniqueness keys | This UCIC uses entities and invariants defined there |
| SRS | `docs/srs.md` §3.3 F003 (incl. `BR-003.1`–`BR-003.7`), §3.2 F002 (`FR-002.7`, `BR-002.2`, `BR-002.3`), `CON-013` | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §5 Content Hierarchy, §7 SEC-011 and SEC-013 | Claim placement, copy budgets, and the fact that the roster owns no band come from there |
| Design System | `docs/design_system.md` §9.6 Capability row (`CAP-002`, `CAP-003`; `CAP-001` retired 2026-09-15), §9.8 Stat strip, §4.4 CLR-003 | Panel anatomy, the no-prose rule, and colour-independence come from there |
