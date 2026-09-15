# User Flow: Read the FAQ — Retired (2026-09-14)

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Retired (2026-09-14) | **Last Updated:** 2026-09-14

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-005 |
| Name | Read the FAQ |
| Actor | Evaluating engineer (unauthenticated visitor, per `SRS §2.3`) |
| Goal | Resolve the specific objections that decide whether to sign up for the waitlist — cost, release timing, platform support, agent compatibility, telemetry, and account requirements |
| Trigger | Retired — the visitor would once have scrolled to `SEC-008` (`#faq`) or selected **FAQ** in the navigation bar |
| Preconditions | None. The band, its content module and its requirements were removed in v1.2. |

> **Retired 2026-09-14 (v1.2).** The `#faq` band (`SEC-008`) and its accordion were removed in the v1.2 rebuild. The page carried too many items: the objections this flow answered are decided by the bands a visitor already reads, so a second, separate answer surface only added scroll. The requirements `FR-006.1`–`FR-006.7` and `BR-006.1`–`BR-006.5` are withdrawn in `docs/srs.md` v1.2. This flow is retained for traceability; the steps below are the ones that still hold, re-homed to the surface that now carries each answer.

## Why It Was Retired

1. The load-bearing answers were not questions-of-record but facts: licence, platforms, agents, release state and data handling.
2. Every one of those facts was already stated on the page — in the hero, the stat strip, capability row 04, the install band or the footer.
3. An accordion made them a second source, which `NFR-006.6` disallows: every fact has exactly one source, and a duplicate answer set is a second place to keep in step.
4. The band was not a gateway: no flow depended on it, and no call to action pointed at it.

## Retired Answers and Their Successors

| Question the accordion answered | Where the answer lives now | Requirement |
|---------------------------------|---------------------------|-------------|
| What does it cost? | Footer licence statement — the project is MIT (`SEC-010`) | `FR-009.1`, `BR-009.1` |
| What happens to the address I submit? | `/privacy` page, linked from the footer, and the waitlist consent line beside the form | `FR-009.5`, `FR-004.1` |
| Is this an official product of another project? | No longer asked or answered — the affiliation answer was withdrawn on 2026-09-15 with the port claim | `FR-009.2`, `FR-009.3`, `BR-009.3`, `BR-009.4` (withdrawn) |
| Can I download a build today? | Hero pre-release ribbon, restated in the install band's introduction | `BR-002.5`, `FR-001.1` |
| Which platforms are supported? | Stat strip — `3 platforms · macOS, Linux, Windows` | `FR-002.7` |
| Which agents are supported, and how many? | Capability row 04 — the claim, the `21 detected · 9 also configurable` note, and the eight named runtimes | `FR-002.7`, `BR-003.3` |
| Do I need an account? | The waitlist form's one-field copy; the page holds no login | `NFR-007.3` |
| Is anything measured about me? | Footer telemetry statement | `FR-009.6` |

## Steps That Still Hold, Re-Homed

*What a visitor who would have opened the accordion does today.*

1. Visitor arrives with a cost question → reads the footer's licence statement, which names MIT and links the licence file (`SEC-010`).
2. Visitor arrives with a data question → follows `Privacy` in the footer, or reads the consent line directly under the email field before submitting (`FR-004.1`).
3. Visitor arrives with a provenance question → reads the footer's attribution to the upstream project and its non-affiliation disclaimer.
4. Visitor arrives asking whether a build exists → reads the hero ribbon before scrolling, which states pre-release status, and the install band, which restates it above the commands (`BR-002.5`).
5. Visitor arrives asking about platforms or agents → reads the stat strip, and for the agent distinction, capability row 04's note (`FR-002.7`).
6. **Goal achieved:** The same objections are resolved from the page's own bands, in fewer interactions than the accordion required, and each answer has one source.

## What Was Lost

- A visitor can no longer scan one place where every question is enumerated. The answers are distributed across the bands that own the facts.
- There is no longer an in-page anchor for an objection. A support conversation must link the specific band instead (`#capabilities`, `#install`, `/privacy`).

## Exception Flows

### Exc-1: A visitor looks for the retired anchor
**Trigger:** A bookmarked `/#faq` link, or a stale external link into the retired band.

1. The browser resolves the hash to no element and stays at the top of the page; nothing errors (`sys_uc_001.md` §Error Handling).
2. The band's identifiers are gone and must not be reintroduced as links (`IA URL-002`); the smoke run fails if `faq` reappears as an anchor.
3. **Outcome:** The visitor lands on a working page and finds the fact in the band that owns it.

## Postconditions

*What must be true after this use case completes (success or failure).*

- No accordion, no `<details>` group and no FAQ anchor exists on the page.
- Every answer the accordion carried is reachable from the band that owns the fact, with one source per fact (`NFR-006.6`).
- The retired identifier `SEC-008` is not reused, and no requirement in this revision depends on the band (`IA §7`).

## Related Pages

*Screens or pages involved in this flow. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Carries the successor bands: `SEC-002` (release state), `SEC-011` (figures), `SEC-013` row 04 (agents), `SEC-006` (install), `SEC-010` (licence, attribution, telemetry). |
| PAGE-002 | Privacy policy | Carries the data-handling answer that used to be an accordion item. |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| `SiteConfig` | `src/content/site.ts` | Read | Licence identifier, telemetry statement, non-affiliation statement and contact address — the four facts the accordion used to restate (`ENT-009`). |
| `FooterLink`, `FooterGroup` | `src/content/chrome.ts` | Read | The footer routes that carry the answers: licence, privacy, attribution. |
| `agentCounts` | `src/content/agents.ts` | Read | Supersedes the accordion's agent answer; printed once, by capability row 04 and the stat strip (`FR-002.7`). |
| `WaitlistSubscriber` | — | None | Not used. |
| `FaqItem` | — | Deleted | The content module and its eight entries were removed in v1.2. |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] No accordion or disclosure group exists anywhere on the page
- [ ] No `#faq` anchor exists in the served HTML, and no link points at one
- [ ] The licence, telemetry, attribution and non-affiliation statements are each present in the footer
- [ ] Pre-release status is stated in the hero and restated in the install band
- [ ] The agent and platform facts are reachable from the stat strip and capability row 04
- [ ] Data handling is stated on `/privacy` and beside the waitlist form
- [ ] Each answer has exactly one source module (`NFR-006.6`)

## Traceability

*Link back to the SRS requirements this use case satisfies.* All requirements this flow originally traced to were withdrawn in `srs.md` v1.2; the rows below record their successors so the work is still traceable.

| Requirement ID | Requirement Description | How This Use Case Now Satisfies It |
|----------------|------------------------|-----------------------------------|
| FR-006.1–FR-006.7 | **Withdrawn (v1.2).** The accordion's question set | Retired with `SEC-008`; see the successor table above |
| BR-006.1–BR-006.5 | **Withdrawn (v1.2).** Accordion behaviour rules | Retired with `SEC-008` |
| FR-009.1 | Footer carries the licence statement | Retired answer 1 |
| FR-009.2, FR-009.3 | Footer attribution and non-affiliation disclaimer; trademark disclaimer text | Retired answer 3 |
| FR-009.6 | Footer telemetry statement | Retired answer 8 |
| FR-009.4, FR-009.5 | Privacy page linked from the footer, stating what the form does with the address | Retired answer 2 |
| FR-004.1 | Waitlist consent line states retention beside the field | Retired answer 2 |
| FR-002.7 | Stat strip renders the figures, including the detected agent count | Retired answers 5, 6 |
| BR-003.3 | Detection and configuration stated separately | Retired answer 6 |
| BR-002.5 | Pre-release status stated, not buried | Retired answer 4 |
| NFR-006.6 | Every fact has exactly one source | Why It Was Retired; AC 7 |
| IA URL-002 | Retired anchors are gone and must not be reintroduced | Exc-1; AC 2 |
