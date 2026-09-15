# System Logics (UCIC) — Registry

**Document:** SoT-7 (index) | **Document Version:** v1.2 | **Derived From:** SoT-4 (User Flows) + SoT-6 (Data Model) | **Status:** Draft | **Last Updated:** 2026-09-14

## 1. Purpose

This directory holds one Use Case Integration Contract per user flow. A UCIC is the last artifact before code: it fixes, for a single use case, which components take part, which entities are touched, how data moves from a UI control to a request and back, every validation rule with its user-facing message, and every error condition with its HTTP status and the behaviour the visitor sees.

Two things make this set unusual, and both are deliberate consequences of `CON-001` (Next.js only, no separate backend):

- **There is exactly one server endpoint in the whole system.** `POST /api/waitlist`, owned by UC-002. Every other use case is discharged entirely in the browser against statically rendered markup, so its "API contract" section documents the component contract — props, events, and state — instead of HTTP. Where the template expects an endpoint, those files state plainly that no server call occurs. That is a contract, not a gap.
- **The server has no state.** Route handlers are stateless (`CON-002`), storage is Resend's (`NFR-005.2`), and rate limiting is per-instance and best-effort (`CON-012`).

A UCIC is the artifact to change when an implementation detail must deviate. Changing code without changing the contract puts the two out of sync, and the test cases in `docs/test_cases.md` are derived from the contract.

## 2. File Structure

| Path | Contents |
|------|----------|
| `docs/system_logics/index.md` | This registry, plus the API overview below |
| `docs/system_logics/sys_uc_001.md` | UC-001 Browse the Landing Page |
| `docs/system_logics/sys_uc_002.md` | UC-002 Join the Waitlist |
| `docs/system_logics/sys_uc_003.md` | UC-003 Install Bentomux |
| `docs/system_logics/sys_uc_004.md` | UC-004 Explore Supported Agent Runtimes |
| `docs/system_logics/sys_uc_005.md` | UC-005 Read the FAQ — **Retired (v1.2, 2026-09-14)**; kept as the v1.1 record |
| `docs/system_logics/sys_uc_006.md` | UC-006 Open the Project Links and Star the Repository |
| `docs/system_logics/sys_uc_007.md` | UC-007 Preview Theme Palettes — **Retired (v1.2, 2026-09-14)**; kept as the v1.1 record |
| `docs/system_logics/sys_uc_008.md` | UC-008 Read the License, Attribution, and Privacy Statement |

## 3. Catalog

| UCIC ID | Use Case | Server Call | Contract Type | File Path | Status |
|---------|----------|-------------|---------------|-----------|--------|
| UCIC-001 | Browse the Landing Page | None | Server-rendered markup + anchor scroll | `sys_uc_001.md` | Draft |
| UCIC-002 | Join the Waitlist | `POST /api/waitlist` | HTTP JSON | `sys_uc_002.md` | Draft |
| UCIC-003 | Install Bentomux | None | Component contracts + CSS-driven state (no script decides visibility) | `sys_uc_003.md` | Draft |
| UCIC-004 | Explore Supported Agent Runtimes | None | Server-rendered markup | `sys_uc_004.md` | Draft |
| UCIC-005 | Read the FAQ | None | Disclosure widget (`<details>`-based) | `sys_uc_005.md` | **Retired (v1.2, 2026-09-14)** — the `SEC-008` band was removed; the answers moved to the footer legal block, `/privacy`, the hero ribbon, the install band and capability row 04 |
| UCIC-006 | Open the Project Links and Star the Repository | `GET api.github.com` for the star figure (non-fatal, cached 3600 s) | Anchor links with `rel` attributes + one cached read | `sys_uc_006.md` | Draft |
| UCIC-007 | Preview Theme Palettes | None | Single-select group + transient state | `sys_uc_007.md` | **Retired (v1.2, 2026-09-14)** — the `SEC-005` band was removed and the site ships no theme switcher |
| UCIC-008 | Read the License, Attribution, and Privacy Statement | None | Server-rendered markup | `sys_uc_008.md` | Draft |

## 4. API Overview

### 4.1 Base URL

Absolute URLs derive from one value, never from a literal.

| Environment | `NEXT_PUBLIC_SITE_URL` | Notes |
|-------------|------------------------|-------|
| Production | `https://bentomux.farrasjibran.dev` | Canonical origin (`CON-005`). A missing or unparseable value fails the build (`NFR-004.2`, `LP-005`). |
| Preview (Vercel) | the deployment URL | Injected by the platform for preview builds. |
| Local | `http://localhost:3000` | Development only. |

The one endpoint is same-origin: `/api/waitlist`. No request in the system crosses an origin from the browser, which is why no CORS configuration exists and why the `Origin` header check in UC-002 is meaningful rather than decorative.

### 4.2 Authentication

**None.** The site has no accounts, no sessions, no tokens, and no protected resources (`SRS §7`). The only credential in the system is `RESEND_API_KEY`, which is server-only and never sent to a browser (`NFR-002.1`).

Implication for the contract: there is no `401` and no `403`-by-role anywhere in this system. The single `403` means "the request did not come from the site's own origin" and nothing else.

### 4.3 Common Response Shape

Every endpoint response — success or failure — is JSON with a boolean `ok` discriminator. Success carries `message`; failure carries a machine-readable `error` and a human-readable `message`.

```json
{ "ok": true,  "message": "You're on the list." }
```

```json
{ "ok": false, "error": "invalid_email", "message": "Enter a valid email address." }
```

Rules:
- `error` is a stable snake_case identifier. Clients branch on it; tests assert it.
- `message` is safe to render. It never contains a stack trace, an upstream response body, an environment value, or the API key (`NFR-002.4`).
- Field-level detail, when present, appears in an optional `details` array of `{ field, error }`. Only UC-002 uses it.

### 4.4 HTTP Status Codes

| Status | Meaning Here | Where Used |
|--------|--------------|-----------|
| `200 OK` | The submission was accepted. Also returned for a repeat address and for a discarded honeypot hit — the response is intentionally indistinguishable (`BR-004.5`, `BR-004.6`). | UC-002 |
| `400 Bad Request` | The body failed validation, or the JSON could not be parsed. | UC-002 |
| `403 Forbidden` | The request `Origin` did not match `SiteConfig.siteUrl`, or was absent. Rejected before any Resend call (`NFR-002.2`). | UC-002 |
| `405 Method Not Allowed` | Anything other than `POST` on `/api/waitlist`. | UC-002 |
| `429 Too Many Requests` | More than 5 submissions from one address in a minute. Best-effort and per instance; not a guarantee (`NFR-002.3`, `CON-012`). | UC-002 |
| `500 Internal Server Error` | An unexpected failure in the handler. | UC-002 |
| `502 Bad Gateway` | Resend was unreachable or returned an error. The visitor's address is preserved and a retry is offered (`NFR-004.1`). | UC-002 |

`401`, `404`, `409`, and `422` are not used. There is nothing to authenticate to, no resource to look up, no uniqueness conflict the client may learn about, and no business-rule violation that is not already a `400`.

### 4.5 Server Environment Variables

| Variable | Scope | Required | Purpose |
|----------|-------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | build + client | Yes | Canonical origin. Failure to set it fails the build (`NFR-004.2`). |
| `RESEND_API_KEY` | server only | Yes for the waitlist | Bearer credential for the Resend Contacts API. Must never be exposed to the client (`NFR-002.1`). |
| `RESEND_TOPIC_ID` | server only | No | Waitlist topic assigned to a new contact. Absent means the contact is created without a topic, which stays valid (`FUT-002`). |

### 4.6 External Dependency

Two outbound calls exist in the system.

1. **`POST https://api.resend.com/contacts`** — from the UC-002 route handler, with `Authorization: Bearer ${RESEND_API_KEY}` and body `{ "email": "<normalised>", "unsubscribed": false }`. Its failure maps to `502` and never to an unhandled error page (`NFR-003.3`).
2. **`GET https://api.github.com/repos/takora-dev/bentomux-v2`** — from the home route at render time, for `stargazers_count` only, cached for 3600 s (`FR-002.7`). It is non-fatal: any failure resolves to `null`, and the stat strip drops the star figure rather than showing a stale or invented one (`BR-002.3`, `BR-007.3`, `NFR-004.4`). It is the only count read from outside, and no issue, contributor, fork, download or install count is fetched anywhere (`BR-007.3`).

## 5. Use Case → Contract Mapping

| UCIC | Related Flow | Entities Touched | Primary Components |
|------|--------------|------------------|--------------------|
| UCIC-001 | `docs/user_flows/userflow_uc_001.md` | ENT-001, ENT-003, ENT-005, ENT-009, ENT-010, ENT-011, ENT-012, ENT-013, ENT-014, ENT-015 | `SkipLink`, `SiteHeader`, `Hero`, `StatStrip`, `MockFigure`, `CapsSection`, `SiteFooter` |
| UCIC-002 | `docs/user_flows/userflow_uc_002.md` | ENT-008, ENT-001 | `WaitlistForm`, `/api/waitlist` route handler |
| UCIC-003 | `docs/user_flows/userflow_uc_003.md` | ENT-005, ENT-010, ENT-011, ENT-012, ENT-001 | `InstallSwitcher`, `InstallPanel`, `CommandBlock`, `ManualDownloads` |
| UCIC-004 | `docs/user_flows/userflow_uc_004.md` | ENT-003, ENT-013 (row `04`), ENT-015 | `CapsSection` (row `04`, `runtimes` panel), `StatStrip` |
| UCIC-005 | `docs/user_flows/userflow_uc_005.md` | ENT-006 (retired), ENT-001 | `FaqAccordion` (removed) — **retired v1.2** |
| UCIC-006 | `docs/user_flows/userflow_uc_006.md` | ENT-001, ENT-009, ENT-015 | `SiteHeader`, `StatStrip`, `SiteFooter` |
| UCIC-007 | `docs/user_flows/userflow_uc_007.md` | ENT-004 (retired), ENT-001 | `PalettePreview`, `PaletteSelector` (removed) — **retired v1.2** |
| UCIC-008 | `docs/user_flows/userflow_uc_008.md` | ENT-001, ENT-008 | `FooterLegal`, `/privacy` page |

## 6. Dependencies

| Dependency | Relationship |
|------------|--------------|
| `docs/user_flows/index.md` (SoT-4) | One UCIC per flow, same numbering. A flow change invalidates its UCIC. |
| `docs/data_model.md` (SoT-6) | Source of every entity named in a contract. A UCIC may not invent an entity. |
| `docs/design_system.md` (SoT-3) | Source of component behaviour: focus handling, motion, colour-only signalling, radii, and the token names referenced in contracts. |
| `docs/information_architecture.md` (SoT-2) | Source of page and section identifiers, copy budgets, and the fact-ownership rule (`FOWN-001`). |
| `docs/test_cases.md` (SoT-7 derived) | Validation rules and error conditions here are the direct source of the negative test cases. |

Ordering rule: flow → data model → UCIC → implementation → tests. A contract that contradicts its flow is wrong by definition; fix the contract, not the flow, unless the flow itself is the error.

## 7. Revision History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-09-13 | F. Jibran | Initial registry. Eight UCICs catalogued; single-endpoint API overview recorded; unused status codes declared explicitly as out of scope. |
| 1.2 | 2026-09-14 | F. Jibran | Registry realigned with the six-band landing page. `sys_uc_005` (FAQ) and `sys_uc_007` (palette preview) catalogued as retired, matching the withdrawal notes in those files. `sys_uc_004` rewritten around capability row 04 (`SEC-013`) and the stat strip (`SEC-011`), since the roster band `SEC-003` no longer exists; `sys_uc_006` re-homed onto the navigation bar, the stat strip's star figure and the footer after `SEC-009` was removed. §4.6 now records **two** outbound calls — Resend plus the cached GitHub star read — instead of claiming no GitHub call exists. §5 entity and component columns corrected to the v1.2 set. |
