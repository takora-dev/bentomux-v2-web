# User Flow: Read the License, Attribution, and Privacy Statement

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Draft | **Last Updated:** 2026-09-13

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-008 |
| Name | Read the License and Privacy Statement |
| Actor | Cautious evaluator — a developer or engineering lead checking legal and data-handling posture before adopting or recommending the project (`SRS §2.3`) |
| Goal | Establish what licence the project carries, that the site collects nothing beyond a voluntarily submitted address, and how to have that address removed |
| Trigger | The visitor reads the footer's legal block, or follows the privacy policy link from the footer or from the waitlist consent statement |
| Preconditions | The site is deployed. `SiteConfig` contains the licence statement, the trademark disclaimer, and the contact address. The application repository carries an MIT `LICENSE` tracked on `master`, so the plain statement is in force (`SRS BR-009.1`, `CON-008`). |

## Main Flow

*The "happy path" — the most common, successful scenario.*

1. Visitor reaches the footer → reads a legal block below a hairline, containing the licence sentence, the trademark disclaimer, the telemetry line, and the copyright line (`SRS FR-009.1`, `FR-009.3`, `FR-009.6`).
2. Visitor reads the licence statement → it states that the project is open source under the MIT License, naming the same licence the application repository's `LICENSE` file carries, and it is stated plainly rather than in deferred form because that file exists (`SRS BR-009.1`, `CON-008`).
3. Visitor reads the trademark disclaimer → it states that agent and vendor names used on the page are the property of their owners and do not imply affiliation (`SRS BR-009.3`).
4. Visitor follows the privacy policy link → `/privacy` renders a complete statement: what is collected, why, where it is stored, how long it is kept, how to have it removed, and what the site does not do — no cookies, no tracking, no analytics (`SRS FR-009.6`).
5. Visitor reads the licence-and-data block within the policy → it restates the same licence statement used in the footer, rendered from the same content module so the two cannot disagree (`IA XPG-001`).
6. Visitor reads the removal instructions → they find the contact address and the removal route, which is the address configured in `SiteConfig` (`SRS FR-009.5`, `BR-004.5`).
7. **Goal achieved:** The visitor can state the licence position and exactly what happens to an email address they submit, and knows how to withdraw it.

## Alternative Flows

*Valid variations of the main flow that still lead to success.*

### Alt-1: Arrival at the policy from the waitlist consent statement
**Trigger:** The visitor is about to submit an address and follows the privacy link placed before the submit control (`SRS BR-004.2`).

1. `/privacy` renders with the collected-data block first, so the answer to "what happens to my address" is the first thing on the page.
2. The visitor returns using browser back; the waitlist form still holds the typed address, because the form state was never submitted or cleared.
3. **Outcome:** The visitor can make an informed decision and complete the signup in one more action.

### Alt-2: Direct arrival at `/privacy`
**Trigger:** The visitor follows an external link, a search result, or a bookmark to `/privacy`.

1. The page renders self-contained with its own title, description, canonical URL, and Open Graph tags (`SRS FR-009.5`, `NFR-008.2`).
2. The same navigation bar and footer are present, so the visitor can reach every other page.
3. **Outcome:** The policy is a first-class page and is indexable on its own (`IA §6 PAGE-002`).

### Alt-3: Visitor wants the licence text itself
**Trigger:** The visitor wants the actual licence document rather than a statement about it.

1. The licence block states that MIT is the licence the repository carries, and links the repository.
2. The visitor opens the repository and reads `LICENSE` there.
3. **Outcome:** The stated licence and the readable licence are the same document. The site states no licence the repository cannot show, and every licence link resolves (`SRS BR-009.2`, `BR-009.7`).

### Alt-4: Client-side JavaScript unavailable
**Trigger:** The visitor has JavaScript disabled.

1. The footer legal block and the whole of `/privacy` are static server-rendered prose; nothing depends on script.
2. **Outcome:** The full legal and privacy position is readable without JavaScript, which is the appropriate behaviour for pages of legal consequence.

### Alt-5: Visitor wants to withdraw a submitted address
**Trigger:** The visitor has signed up and later wants removal.

1. The policy states the removal route and the contact address (`SRS FR-009.5`).
2. The visitor sends the request to the configured address; removal is performed in Resend Contacts, which is the system of record (`SRS CON-001`).
3. **Outcome:** Withdrawal is possible without an account on the site, because the site has no accounts.

## Exception Flows

*Error conditions and failure scenarios.*

### Exc-1: A licence other than MIT is stated
**Trigger:** Any copy on the site names a licence other than the one the repository carries.

1. This contradicts `SRS BR-009.1` and `CON-008`: the application repository carries an MIT `LICENSE`, so the project's own licence is MIT.
2. No page may state a licence claim the repository cannot show, and such a claim must fail the content test that scans rendered copy (`SRS FR-009.2`).
3. **Outcome:** The site cannot ship a licence claim that is false.

### Exc-2: The licence statement diverges from the repository
**Trigger:** Copy states a licence the repository does not carry, or the deferred wording is rendered while `LICENSE` is present.

1. This contradicts `SRS BR-009.1` and `BR-009.2`: the statement must always name the licence the repository actually carries.
2. The deferred wording takes over only if `LICENSE` is ever removed or replaced, and is then a defect signal rather than a normal state (`SRS FR-009.7`).
3. **Outcome:** The visitor is never told a licence the project does not have. When `LICENSE` changes, the copy is updated by an SRS revision, not by an ad-hoc edit (`SRS LP-001`).

### Exc-3: The private data in the policy disagrees with what the site actually does
**Trigger:** The policy claims cookies or analytics are used on this site, claims no external service is involved, or omits the external processing that actually happens.

1. The policy must state that no cookies and no analytics are used by this site, and that an email address is processed through an external third-party email service which is the system of record (`SRS §4.2`, `§4.3`).
2. A policy that contradicts the implementation is a defect in whichever of the two is wrong; in v1 the implementation is the reference and the policy is corrected.
3. **Outcome:** The stated data practice matches the actual data practice.

### Exc-4: The policy becomes unreachable
**Trigger:** `/privacy` returns an error, or the footer link is removed.

1. The footer link and the consent-statement link are both required (`SRS FR-009.5`, `BR-004.2`), so their absence is a defect caught by the link test case.
2. **Outcome:** A consent statement can always reach the policy it references.

### Exc-5: The legal block omits a required sentence — **amended 2026-09-15**
**Trigger:** The footer is rendered without the licence statement or the trademark disclaimer.

1. This contradicts `SRS BR-009.1` and `FR-009.3`.
2. Both sentences are rendered from the content module, not hand-written per page, so they cannot be omitted by a page-level edit (`IA XPG-001`).
3. **Outcome:** The required sentences are present on every page that renders the footer. The former upstream-attribution exception is withdrawn: the port claim was withdrawn, so no page credits an upstream project.

## Postconditions

*What must be true after this use case completes (success or failure).*

- The footer on `/` and `/privacy` states the licence position (MIT, stated plainly), the trademark disclaimer, the telemetry line, and the copyright line.
- No page states a licence other than the one the repository carries, and no page names an upstream project.
- `/privacy` exists, is reachable from both the footer and the waitlist consent statement, and is indexable with its own metadata.
- The licence statement rendered on `/privacy` is byte-identical to the licence statement rendered in the footer, because both come from one content module.
- The policy states the removal route for a submitted address.
- No data was created or modified; the flow is read-only.

## Related Pages

*Screens or pages involved in this use case. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Entry point. `SEC-010` hosts the footer legal block; `SEC-007` hosts the consent statement that links to the policy. |
| PAGE-002 | Privacy policy | Primary destination. Holds the collected-data, licence, and removal blocks. |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| `SiteConfig` | `src/content/site.ts` | Read | Supplies `licenseStatement`, `trademarkDisclaimer`, `telemetryStatement`, `copyrightLine`, `contactEmail`, and the repository URL. Rendered identically by the footer and the policy page (`IA XPG-001`). |
| WaitlistSubscriber | Resend Contacts | Referenced only | Named in the policy as the only data the site holds about a visitor, and as the system of record for removal. Not created or read by this flow. |
| ~~`FaqItem`~~ | — | **Removed (v1.2)** | `ENT-006` was retired with the `#faq` band; the telemetry answer it used to carry is stated by the policy itself, which this flow reads directly (`IA FOWN-001`). |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] The footer on every page renders a licence statement, a trademark disclaimer, a telemetry line, and a copyright line
- [ ] The licence statement names MIT, matching the `LICENSE` file tracked on `master` of the application repository, and is not rendered in deferred form
- [ ] Every licence link on the site resolves
- [ ] The trademark disclaimer states that agent and vendor names belong to their owners and do not imply affiliation
- [ ] No page names an upstream project or claims any relationship with one
- [ ] `/privacy` is reachable from the footer and from the consent statement in `SEC-007`
- [ ] The policy states what is collected, why, where it is stored, how long it is kept, and how to have it removed
- [ ] The policy states that this site sets no cookies and runs no analytics
- [ ] The policy identifies the external email service as the system of record for a submitted address
- [ ] The licence statement rendered on `/privacy` is identical to the one rendered in the footer
- [ ] `/privacy` renders with its own title, description, and canonical URL, and is indexable
- [ ] Both pages are fully readable with JavaScript disabled
- [ ] The footer states that the desktop application sends no telemetry and that this site sets no tracking cookies

## Traceability

*Link back to the SRS requirements this use case satisfies.*

| Requirement ID | Requirement Description | How This Flow Satisfies It |
|----------------|------------------------|---------------------------|
| FR-009.1 | Footer states the licence on every page | Main flow step 2; AC 1, 3 |
| FR-009.2 | ~~Footer credits the upstream source of the ported detection logic and states its licence~~ — **withdrawn 2026-09-15**, `attributionStatement` deleted; see `docs/srs.md` | Not satisfied |
| FR-009.3 | Footer carries the agent and vendor trademark disclaimer | Main flow step 3; AC 4 |
| FR-009.4 | A privacy policy page exists and is linked from the footer | Main flow step 5; AC 7 |
| FR-009.5 | Policy states what is collected, why, where it is stored, how long it is kept, and how removal is requested | Main flow step 5; AC 8, 9, 10 |
| FR-009.6 | Footer states that the desktop application collects no telemetry | AC 14 |
| FR-009.7 | The licence statement names the licence the repository actually carries, and falls back to deferred wording if that file is ever absent | Main flow step 2; AC 2, 3 |
| FR-009.8 | ~~The repository must carry a `NOTICE` file discharging the Apache-2.0 attribution obligation~~ — **withdrawn 2026-09-15**; the site renders no credit either way | Not satisfied |
| BR-009.1 | Licence stated as MIT, matching the tracked `LICENSE`; stated plainly rather than deferred | Main flow step 2; AC 2 |
| BR-009.2 | Deferred wording applies only if `LICENSE` is removed or replaced; a statement that diverges from the repository is forbidden | Exc-2; AC 3 |
| BR-009.3 | Attribution names the upstream project, its licence, and links upstream — **withdrawn 2026-09-15** | Not satisfied |
| BR-009.4 | The disclaimer uses the exact approved wording — **withdrawn 2026-09-15** (the non-affiliation sentence) | Not satisfied |
| BR-009.5 | Policy reachable from the footer on every page and listed in the sitemap | Alt-2; AC 7, 12 |
| BR-009.6 | `NOTICE` is a launch precondition tracked as `FR-009.8`; the `LICENSE` half is already met | Exc-2; Postconditions |
| BR-009.7 | No statement the repository does not support | AC 3; Exc-1, Exc-2 |
| BR-009.8 | No fabricated organisation or legal entity in the copyright line | AC 1 |
| BR-004.2 | Consent stated before the submit control with a link to the policy | Alt-1; AC 7 |
| CON-001 | Next.js only — no separate backend and no database; storage is the external email service | AC 10 |
| CON-007 | ~~The ported code carries an Apache-2.0 attribution obligation that survives the project's own MIT declaration~~ — **superseded 2026-09-15**: no port is claimed, no attribution is rendered | Exc-1; AC 1, 3 |
| CON-008 | The repository carries an MIT `LICENSE`, so the licence is stated plainly | AC 2 |
| CON-009 | Third-party agent names require a descriptive-use disclaimer | AC 6 |
| LP-001 | `LICENSE` published in the application repository — satisfied by the MIT file on `master` | Main flow step 2 |
| LP-002 | ~~`NOTICE` crediting the upstream project published in the application repository~~ — **withdrawn 2026-09-15** | Not satisfied |
| NFR-008.1 | Unique title and meta description per page | AC 12 |
| NFR-008.2 | Sitemap and robots published | AC 12 |
| NFR-008.4 | Content server-rendered | AC 13 |
| XPG-001 | One content module owns the legal statements rendered on both pages | Postconditions; AC 11 |
