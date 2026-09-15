# UCIC: Read the License, Attribution, and Privacy Statement

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Draft | **Last Updated:** 2026-09-13

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-008 |
| Name | Read the License, Attribution, and Privacy Statement |
| Actor | Cautious evaluator — a developer or engineering lead checking legal and data-handling posture before adopting or recommending the project (`SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_008.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` | `SEC-010` carries the legal block. The waitlist consent statement in `SEC-007` links to the privacy policy. |
| PAGE-002 | `/privacy` | The full statement: what is collected, why, where it is stored, how to be removed, and what is deliberately not collected. Eight content blocks. |
| PAGE-003 | `/*` | Not part of this use case; noted because the catch-all must also carry the legal block, so a stale URL cannot present the product without its licence statement. |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-001 SiteConfig | Owns every legal statement. Both render sites read the same attributes, which is what makes the footer and `/privacy` unable to disagree. | Read |
| ENT-008 WaitlistSubscriber | Described but not touched: the statement explains exactly the one record that can exist, and how to have it removed | Read (described only) |

No record is created, changed, or deleted by this use case. That is the point of it.

## Sequence Diagram

```
Visitor              Footer (SEC-010)        /privacy (PAGE-002)      SiteConfig (build memory)
   |                       |                        |                          |
   |--[scroll to footer]-->|                        |                          |
   |                       |--[read legal block]---------------------------->  |
   |<--[licence, attribution, trademark, copyright]--|                          |
   |                       |                        |                          |
   |--[follow "Privacy"]-->|----------------------->|                          |
   |                       |                        |--[render 8 blocks]------>|
   |<--[full statement, same legal text as the footer]--|                       |
   |                       |                        |                          |
   |--[mail contact]------>|  (mailto: opens the mail client; no form, no request to this origin)
```

*Describe each step in the sequence:*
1. **User/Frontend:** The visitor reads the footer's legal block, optionally follows the privacy link, and optionally uses the contact link.
2. **API Gateway:** Not applicable. No request is made; the privacy page is a statically rendered route.
3. **Backend Service:** Both render sites read `ENT-001`. There is no second copy of the licence sentence, the attribution line, or the trademark disclaimer anywhere in the codebase (`XPG-001`).
4. **Database:** Not applicable.
5. **Response:** Identical legal text in both places, plus a full explanation of the single data flow the site performs.

## API Contract

### Endpoint

```
None — this use case makes no HTTP request.
```

The one endpoint in the system, `POST /api/waitlist`, is *documented* here rather than called: this use case is where its data-handling consequences are disclosed, which is a legal obligation rather than a technical one.

### Content Contract — the legal block

Rendered by `FooterLegal` in `SEC-010` and, in expanded form, by `PAGE-002`. Both read `ENT-001`; neither holds a string of its own.

| Slot | Source attribute | Required rendering | Binding rule |
|------|------------------|--------------------|--------------|
| Licence sentence | `SiteConfig.licenseStatement`, `SiteConfig.licenseId` | Present in the footer and on `/privacy`, worded identically | `licenseFilePublished = true`, so the sentence names MIT plainly and a licence link may render provided it resolves (`BR-009.1`, `CON-008`). If the file is ever removed, `false` restores the deferred wording and suppresses the link (`BR-009.2`) |
| Attribution — **withdrawn 2026-09-15** | — | Not rendered | `SiteConfig.attributionStatement` no longer exists on `ENT-001`; no page credits the upstream project (`FR-009.2`, `BR-009.3`) |
| Trademark disclaimer | `SiteConfig.trademarkDisclaimer` | Present on both render sites | Agent and vendor names belong to their owners; listing them implies no affiliation (`FR-009.3`) |
| Copyright | `SiteConfig.copyrightLine` | Present on both render sites | Names the project only; no organisation that does not exist (`BR-009.8`) |
| Privacy link | `SiteConfig.privacyPath` | Present in the footer and after the waitlist consent statement | Resolves to `PAGE-002` (`FR-009.4`, `FR-004.7`) |
| Contact | `SiteConfig.contactEmail` | Rendered as a `mailto:` link | Never as a form and never as bare text (`BR-007.4`) |

### Content Contract — `/privacy` blocks

Eight blocks, in this order. Each is rendered from `ENT-001` or is a fixed explanation of behaviour already fixed by this document.

| # | Block | Must state |
|---|-------|-----------|
| 1 | Controller and scope | What this policy covers: this website only, not the desktop application or the agents it runs |
| 2 | What is collected | The email address submitted to the waitlist form, and nothing else |
| 3 | Why | To send one notification when the application is released and no other message until the visitor asks for one |
| 4 | Where it is stored | Resend Contacts, acting as processor; no copy on site infrastructure and no local database (`NFR-005.2`) |
| 5 | What is **not** collected | No account, no name, no analytics, no advertising identifier, no cookie, no `localStorage`, no session replay, no third-party script, no IP address retained beyond a per-request rate-limit counter that is discarded with the invocation (`CON-012`) |
| 6 | Retention and removal | Retained until release notification plus unsubscribe, or until removal is requested; removal completes on request via the contact address |
| 7 | Legal basis and rights | The visitor's consent at submission; the right to withdraw it by asking for removal |
| 8 | Changes to the policy | The date on which the current version took effect, and that changes appear as a content commit, since there is no CMS (`CON-011`) |

### Request Headers

Not applicable.

### Request Payload

Not applicable.

### Response Payload (Success)

Not applicable at the HTTP level. The delivered artifacts are the fixed legal block in `SEC-010`, the eight blocks on `PAGE-002`, and the single consent sentence in `SEC-007`.

### Status Codes

| Status | Meaning | Condition | Response Body |
|--------|---------|-----------|---------------|
| 200 | OK | `/privacy` rendered | The statement |
| — | No other status is reachable | This use case performs no write and no lookup | — |

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Footer licence sentence | — | `ENT-001 SiteConfig.licenseStatement`, `.licenseId` | Rendered text | MIT, stated plainly while `licenseFilePublished = true` |
| Footer trademark disclaimer | — | `ENT-001 SiteConfig.trademarkDisclaimer` | Rendered text | Identical on `/privacy` |
| Footer copyright | — | `ENT-001 SiteConfig.copyrightLine` | Rendered text | No fabricated entity |
| Privacy link (footer and consent statement) | — | `ENT-001 SiteConfig.privacyPath` | `href` | One constant, two render sites |
| Contact link | — | `ENT-001 SiteConfig.contactEmail` | `mailto:` `href` | The removal path described in block 6 |
| Described subscriber record | — | `ENT-008 WaitlistSubscriber.email`, `.unsubscribed`, `.topicId` | Described in prose, never rendered as data | The site never displays a subscriber record; the statement explains the record's existence and lifetime |
| Licence file link | — | `ENT-001 SiteConfig.licenseFilePublished` | Rendered when `true` and resolvable | `true`. A licence link must resolve; a link that 404s would be worse than stating the licence without one (`BR-009.2`) |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| licenseId | Must equal the licence named by the tracked `LICENSE` file, i.e. `MIT` | Build fails: `licence must match the tracked LICENSE` | `BUILD_LICENCE_ID` |
| SiteConfig legal attributes | All four legal strings non-empty | Build fails: `legal statement missing` | `BUILD_LEGAL_MISSING` |
| Attribution | Must name the upstream project and its licence | Test: string contains both the upstream name and `Apache-2.0` | `CONTENT_ATTRIBUTION_INCOMPLETE` |
| licenceFilePublished | When `true`, any rendered licence link must resolve; when `false`, no licence-file link may render on any page | Test: scan every page for a licence-file link and assert it resolves, or that none exists | `UI_LICENCE_LINK_LEAK` |
| Licence wording | Must name the licence the repository carries, and may state Apache-2.0 only inside the attribution sentence | Test: pattern scan rejects a bare Apache-2.0 licence claim, and rejects the deferred wording while `licenseFilePublished = true` | `CONTENT_LICENCE_WORDING` |
| Parity | The legal block text on `PAGE-001` must equal the corresponding text on `PAGE-002` | Test: compare the rendered strings; any difference fails | `CONTENT_LEGAL_DRIFT` |
| `/privacy` completeness | All eight blocks present and non-empty | Test: assert eight blocks in order | `UI_PRIVACY_BLOCKS` |
| Data-collection claim | The "not collected" block must be accurate: no analytics, no cookie, no third-party script | Test: assert no `Set-Cookie` in the response, no storage write, no third-party script tag | `UI_TRACKING_PRESENT` |
| Copyright line | Must not name a company, foundation, or legal entity that does not exist | Content review: line names an entity | `CONTENT_COPYRIGHT_ENTITY` |
| Trademark names | Every listed agent or vendor name must be one the application actually supports | Test: cross-check against `ENT-003.name` | `CONTENT_TRADEMARK_UNSUPPORTED` |
| Launch precondition | `LP-002` (`NOTICE`) satisfied before the attribution obligation is described as discharged. `LP-001` is already met by the tracked MIT `LICENSE` | Release checklist item; not a build gate | `RELEASE_LICENCE_FILES` |

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| `NOTICE` provenance — **withdrawn 2026-09-15** | N/A | — | Not an error state. The site no longer renders an upstream credit, so no page can claim an attribution obligation is open or closed (`FR-009.8` / `LP-002` remain open in `docs/srs.md`) |
| Visitor asks what licence the project uses | N/A | — | The footer and block 5 state MIT, matching the tracked `LICENSE`; the repository is linked so the visitor can read the file (`BR-009.1`, `BR-009.7`) |
| Footer and privacy page drift apart | N/A | — | Build or test failure via `CONTENT_LEGAL_DRIFT`. Both sites read one entity precisely so this cannot happen silently (`XPG-001`) |
| The repository's `LICENSE` file is later removed or replaced | N/A | — | Flipping `licenseFilePublished` to `false` restores the deferred wording and suppresses the licence link. One attribute, one commit, both render sites updated together |
| A visitor asks to be removed | N/A | — | Handled by the maintainer in Resend, as block 6 states. There is no self-service removal, because there is no account and no way to verify the requester's address — inventing one would be a security regression, not a feature |
| A third-party script is added later for analytics | N/A | — | The "not collected" block becomes false, so the statement must be changed in the same commit. The parity and tracking tests fail until it is, which is the intended friction (`NFR-008.4`) |
| Visitor has JavaScript disabled | N/A | Server-rendered markup | The entire statement is static text and reads identically. Nothing in this use case depends on JavaScript |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_008.md` | This UCIC implements the flow defined there |
| Data Model | `docs/data_model.md` §3 ENT-001, ENT-008; §5 Licensing Rules, Waitlist Rules, State/Lifecycle; §8 Validation Rules Summary | This UCIC uses entities and rules defined there |
| SRS | `docs/srs.md` §3.9 F009 (incl. `BR-009`), §3.4 F004, §6.8 NFR-008, `CON-007`, `CON-008`, `CON-011`, `LP-001`, `LP-002`, `FR-009.8` | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §3 PAGE-002, §3 PAGE-003, §7 SEC-010, §7 SEC-007, `XPG-001` | Block inventory, render sites, and the parity rule come from there |
| Design System | `docs/design_system.md` §9.14 Footer, §9.2 Inline link, §4.4 contrast (`--color-text-muted` for legally load-bearing lines), §12 `--text-caption` mapping) | Footer anatomy, legal-block type treatment, and contrast choices come from there |
