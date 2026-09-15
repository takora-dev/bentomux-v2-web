# UCIC: Read the FAQ

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Retired (v1.2, 2026-09-14) | **Last Updated:** 2026-09-14

> **This contract is withdrawn.** The band it specified was removed when the landing page was rebuilt to its six-band structure. The body below is kept as the record of what was implemented in v1.1, not as a contract to satisfy.

**What replaced it:** the four answers a visitor actually needed now live in the footer legal block and on `/privacy` (`FR-009.1`–`FR-009.6`), the pre-release answer lives in the hero ribbon and the install band (`BR-002.5`), and the supported platforms and agents answer lives in the stat strip and capability row 04 (`FR-002.7`, `BR-003.3`). No disclosure widget exists anywhere on the page (`SRS F006`, retired).

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-005 |
| Name | Read the FAQ |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_005.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` | `SEC-008` holds the eight items |
| PAGE-002 | `/privacy` | Destination of the data-handling answer's link |
| — | `SEC-003`, `SEC-004`, `SEC-005`, `SEC-009` | Answers about agents, features, themes, and contributing point at the owning section rather than restating it (`FOWN-001`) |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-006 FaqItem | The eight question-and-answer pairs, each carrying its mandated topic and, where relevant, the section that owns the fact | Read |
| ENT-001 SiteConfig | Supplies the licence statement, the licence-file link, and the contact address referenced by three answers | Read |
| ENT-003 AgentRuntime | The compatibility answer points at `SEC-003`; no roster data is copied into the answer | Read (by reference) |
| ENT-004 PaletteOption | The themes answer states the count owned by `SEC-005`; the number is derived, not typed | Read (by reference) |

## Sequence Diagram

```
Visitor            Accordion (SEC-008)        Content module (build memory)
   |                       |                            |
   |--[scroll to SEC-008]->|                            |
   |                       |--[read ENT-006 array]----->|
   |                       |<--[8 items, answers present in HTML]--|
   |--[activate a row]---->|                            |
   |                       |--[toggle aria-expanded, rotate chevron]
   |<--[answer revealed / hidden]--|                    |
   |                       |                            |
   |--[follow a link in an answer]>  (anchor within the page, or PAGE-002, or mailto:)
```

*Describe each step in the sequence:*
1. **User/Frontend:** The visitor reads the questions and opens the ones they care about. Opening one row must not close another (`FR-006.4`).
2. **API Gateway:** Not applicable — no request is made at any point, including on expansion.
3. **Backend Service:** All eight answers are rendered into the HTML before any interaction, so browser find-on-page and search engines see them (`FR-006.5`). The interactive layer only toggles visibility; it fetches nothing and reveals nothing that was not already there.
4. **Database:** Not applicable.
5. **Response:** A row per item, the first one expanded by default, each control carrying `aria-expanded` and `aria-controls`. With JavaScript unavailable, every answer renders visible and the disclosure affordance is absent rather than broken.

## API Contract

### Endpoint

```
None — this use case makes no HTTP request.
```

Expansion is a client-side visibility toggle on markup that is already present. There is nothing to fetch, so there is no loading state and no failure mode beyond the interactive layer not running.

### Component Contract — `FaqAccordion`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| items | `FaqItem[]` | Yes | The FAQ entries, pre-sorted by `order` | At least six items; the seven mandated topics each covered at least once (`FR-006.1`) |
| defaultExpandedId | `string` | Yes | Which row starts expanded | Fixed to the first item by `design_system.md` §9.11 |

### Component Contract — `FaqRow`

| Prop | Type | Required | Description | Constraint |
|------|------|----------|-------------|------------|
| item | `FaqItem` | Yes | One entry | `question` is the control's accessible name; `answer` is the controlled region |
| expanded | `boolean` | Yes | Current state | Mirrored to `aria-expanded` on the control |
| onToggle | `() => void` | Yes | Toggles this row only | Must not affect any sibling row (`FR-006.4`) |

Interaction contract:

| Interaction | Result | Declared Behaviour |
|-------------|--------|--------------------|
| Activate a question row | That row's answer toggles | State exposed via `aria-expanded`; the answer region is referenced by `aria-controls` (`FR-006.3`) |
| Activate another row while one is open | Both are open | Independent rows; no accordion-style auto-collapse (`FR-006.4`) |
| Keyboard: `Tab` then `Enter` or `Space` | Same as pointer activation | The control is a native button, so no key handling is written |
| Find-on-page for a phrase inside an answer | Match found while the row is collapsed | The answer text is in the HTML before expansion (`FR-006.5`) |
| Follow a link inside an answer | Anchor scroll, page navigation, or `mailto:` | Anchor targets carry heading clearance; the privacy link stays same-tab; `mailto:` opens the mail client (`FR-007.5`) |

### Request Headers

Not applicable.

### Request Payload

Not applicable.

### Response Payload (Success)

Not applicable at the HTTP level. The delivered content is fixed by topic coverage:

| Question topic | `requiredTopic` | Discharges | Answer must reference |
|----------------|-----------------|-----------|----------------------|
| Cost and licensing | `pricing` | `FR-006.1` | The licence state from `ENT-001`, named plainly (`BR-009.1`) |
| Release timing | `release_timing` | `FR-006.1` | That no date is announced yet — and no date may be invented (`BR-006.4`) |
| Platforms | `platforms` | `FR-006.1` | `SEC-006`; the install commands are the answer, and no release date is named (`BR-006.4`) |
| Which agents are supported | `agent_compatibility` | `FR-006.1` | `SEC-003`, with both counts and the detected/configurable distinction (`BR-003.3`) |
| Data handling | `data_handling` | `FR-006.1` | `PAGE-002`, the waitlist address being the only data collected, and no analytics or tracking |
| Contributing | `contributing` | `FR-006.1` | `SEC-009` destinations |
| Relation to the upstream project | `herdr_affiliation` — **withdrawn 2026-09-15** | `FR-006.7` | Retired with the affiliation answer: the port claim was withdrawn, so `ENT-001` carries no upstream statement and no page answers this (`BR-009.3`) |
| Themes | `null` | — | `SEC-005` and the palette count, derived from `ENT-004` (`BR-008.1`) |

### Status Codes

| Status | Meaning | Condition | Response Body |
|--------|---------|-----------|---------------|
| — | No HTTP exchange occurs | Entire use case | — |

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Question row control | — | `ENT-006 FaqItem.question` | Rendered control text | Ends with a question mark; is the accessible name |
| Answer region | — | `ENT-006 FaqItem.answer` | Rendered prose | Present in the HTML before expansion; maximum measure `70ch` |
| Answer links to owning sections | — | `ENT-006 FaqItem.ownerSection` | Anchor target | Authoritative fact stays in the owning section (`FOWN-001`) |
| Pricing answer | — | `ENT-001 SiteConfig.licenseId`, `.licenseStatement`, `.licenseFilePublished` | Answer text | Names the licence the repository carries (`BR-009.1`) |
| Upstream credit — **withdrawn 2026-09-15** | — | — | Not rendered | `SiteConfig.attributionStatement` no longer exists on `ENT-001` |
| Contact affordance | — | `ENT-001 SiteConfig.contactEmail` | `mailto:` link | `mailto:` only — no contact form exists (`BR-007.4`) |
| Palette count in the themes answer | — | `ENT-004` array length | Numeral in the answer | Derived; a typed literal would drift from the selector |
| Topic coverage | — | `ENT-006 FaqItem.requiredTopic` | Not rendered | Enforced at build; drives the verdict in §Validation Rules |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| FaqItem count | At least six items | Build fails: `fewer than six FAQ items` | `BUILD_FAQ_COUNT` |
| requiredTopic coverage | Each of the seven mandated topics present at least once | Build fails: `FAQ topic not covered: <topic>` | `BUILD_FAQ_TOPIC_MISSING` |
| FaqItem.answer | Must not contain a release date, a month-and-year, or a committed availability window | Test: pattern scan across all answers finds no date | `CONTENT_FAQ_DATE` |
| FaqItem.answer | Must not restate a fact owned by another section; must link to it | Content review: answer duplicates an owning section's numbers | `CONTENT_FAQ_DUPLICATION` |
| FaqItem.answer | Must not claim `MIT` or any licence other than Apache-2.0 | Build fails: `licence claim mismatch` | `BUILD_FAQ_LICENCE` |
| FaqItem.answer | No raw HTML beyond inline links, emphasis, and code | Lint failure: `unsanitised markup in answer` | `LINT_FAQ_MARKUP` |
| FaqItem.question | Ends with `?`, non-empty, unique | Build fails: `malformed FAQ question` | `BUILD_FAQ_QUESTION` |
| FaqItem.order / id | Unique within the module | Build fails: `duplicate FAQ entry` | `BUILD_FAQ_DUPLICATE` |
| Expanded row | Exactly one row expanded on first render | Test: first row has `aria-expanded="true"` and no other row does | `UI_FAQ_DEFAULT_STATE` |
| Row independence | Expanding one row leaves others unchanged | Test: open two rows, assert both remain expanded | `UI_FAQ_INDEPENDENCE` |

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| JavaScript unavailable | N/A | Server-rendered markup | All eight answers render visible and the chevron affordance is omitted. Nothing is hidden that the visitor cannot reach (`design_system.md` §9.11) |
| Topic coverage incomplete in a content edit | N/A | — | Deployment is aborted. A missing mandated answer cannot ship (`FR-006.1`) |
| Answer links to a section that moved | N/A | — | Build fails on anchor resolution, so a stale link cannot ship (`BUILD_ANCHOR_UNRESOLVED`) |
| Visitor cannot find the answer at all | N/A | — | The section links to `SEC-009`, which offers a question destination and a private-address fallback. A question with no honest answer must not be answered with an invented one (`BR-006.4`) |
| Content team edits an answer to name a release date | N/A | — | The pattern check fails the build and the change is rejected with the offending string quoted (`CONTENT_FAQ_DATE`) |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_005.md` | This UCIC implements the flow defined there |
| Data Model | `docs/data_model.md` §3 ENT-006, ENT-001; §4 FaqItem relationships; §5 Content Module Rules | This UCIC uses entities and rules defined there |
| SRS | `docs/srs.md` §3.6 F006 (incl. `BR-006`), §3.4 F004, §3.9 F009 | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §5 Content Hierarchy, §7 SEC-008, `FOWN-001` | Topic coverage, answer budgets, and fact ownership come from there |
| Design System | `docs/design_system.md` §9.11 Accordion, §9.2 Inline link, §7 MOT-001, §11 Accessibility Contract | Row anatomy, chevron motion, and disclosure semantics come from there |
