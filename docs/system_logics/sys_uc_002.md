# UCIC: Join the Waitlist

**Document:** SoT-7 | **Derived From:** SoT-4 (User Flow) + SoT-6 (Data Model) | **Status:** Draft | **Last Updated:** 2026-09-13

## Use Case Reference

| Field | Value |
|-------|-------|
| Use Case ID | UC-002 |
| Name | Join the Waitlist |
| Actor | Pre-release enthusiast (unauthenticated visitor, per `SRS §2.3`) |
| Related User Flow | `docs/user_flows/userflow_uc_002.md` |

## Related Screens

| Page ID | Page Name | Role |
|---------|-----------|------|
| PAGE-001 | `/` | `SEC-007` hosts the form. The hero and the navigation bar carry the actions that lead into it, which is Alt-2 of the flow. |
| PAGE-002 | `/privacy` | Destination of the consent statement's link; states what happens to the address (`FR-004.7`). |
| — | `POST /api/waitlist` | The only server endpoint in the system. Not a screen; listed because Alt-4 returns a redirect to `PAGE-001` with a status parameter. |

## Related Entities

| Entity | Role in This Use Case | Operations |
|--------|----------------------|------------|
| ENT-008 WaitlistSubscriber | The record created by this use case. Stored in Resend, not locally (`NFR-005.2`). | Create, Read (to detect an existing contact) |
| ENT-001 SiteConfig | Supplies the origin compared against the request `Origin`, the privacy path used in the consent statement, and the canonical URL used for the Alt-4 redirect. | Read |

## Sequence Diagram

```
Visitor / Form        Route Handler          Resend Contacts API
     |                     |                        |
     |--[submit email]---->|                        |
     |                     |--[Origin check]------->|  (local, no call)
     |                     |--[zod validate body]-->|
     |                     |--[honeypot check]----->|
     |                     |--[rate limit 5/min]--->|  (per-instance, in memory)
     |                     |--[create contact]----->|
     |                     |<--[200 / 4xx / timeout]-|
     |<--[200 {ok:true}]---|                        |
     |--[aria-live success]-|                       |
     |                     |                        |
     |  (failure paths)    |                        |
     |<--[400|403|429|502]--|                       |
     |--[inline error, value retained]--|           |
```

*Describe each step in the sequence:*
1. **User/Frontend:** The visitor submits, either through the enhanced form (fetch) or, with JavaScript unavailable, through a native form POST (`Alt-4`).
2. **API Gateway:** Not applicable. The route handler performs its own request checks: `Origin` match, `Content-Type` handling for both JSON and `application/x-www-form-urlencoded`, and the per-instance rate limit.
3. **Backend Service:** Validate, discard if the honeypot is filled, then create the contact. Validation runs against the trimmed value. Uniqueness is not resolved locally — the handler does not attempt to read the contact list first; it relies on Resend to accept or reject the address (see §Error Handling for the exact mapping).
4. **Database:** No local query. The only persistence is the Resend call: `POST https://api.resend.com/contacts` with `{ "email": "<trimmed>", "unsubscribed": false }`, plus the configured topic when `RESEND_TOPIC_ID` is set.
5. **Response:** A JSON outcome on the fetch path, or a redirect back to `PAGE-001` with a status parameter on the native-post path. Both carry identical semantics; only the transport differs.

## API Contract

### Endpoint

```
POST /api/waitlist
```

### Authentication

- **Type:** None. There is no account, session, or token anywhere in the system (`SRS §7`).
- **Required Role:** None.
- **Token Location:** Not applicable. The only credential is `RESEND_API_KEY`, which exists solely on the server (`NFR-002.1`).

The origin check below is an anti-abuse measure, not authentication, and must not be documented or presented as access control.

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | `application/json` (enhanced path) or `application/x-www-form-urlencoded` (no-JavaScript path) | Yes |
| Origin | The site's own origin, matching `ENT-001 SiteConfig.siteUrl` | Yes — a missing or non-matching value produces `403` |

### Request Payload

```json
{
  "email": "string (required)",
  "website": "string (honeypot — must be empty; any value discards the submission)"
}
```

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| email | string | Yes | The visitor's address | Trimmed; valid address format; total length ≤ 254; local part ≤ 64 characters; deduplicated case-insensitively (`BR-004.1`) |
| website | string | No | Honeypot, visually hidden and never announced, not a legitimate field for a visitor to fill | Any non-empty value causes the submission to be discarded and answered exactly as a success (`BR-004.6`) |

There is no field for a name, a company, a use case, or a password. `email` is the entire legitimate payload (`BR-004.3`).

### Response Payload (Success)

**HTTP Status:** `200 OK`

```json
{
  "ok": true,
  "message": "You're on the list. We'll email you once at release — nothing before that."
}
```

| Field | Type | Description |
|-------|------|-------------|
| ok | boolean | Always `true` on this path |
| message | string | Confirmation rendered in the `aria-live` region (`FR-004.3`) |

### Status Codes

| Status | Meaning | Condition | Response Body |
|--------|---------|-----------|---------------|
| 200 | OK | The contact was created. **Also returned** for a repeat address (`BR-004.5`) and for a discarded honeypot hit (`BR-004.6`) — those three cases are deliberately indistinguishable. | `{"ok":true,"message":"..."}` |
| 400 | Bad Request | The body is not parseable, or `email` fails validation | `{"ok":false,"error":"invalid_email","message":"Enter a valid email address.","details":[{"field":"email","error":"invalid_email"}]}` |
| 403 | Forbidden | The `Origin` header is missing or does not match `ENT-001 SiteConfig.siteUrl` (`NFR-002.2`) | `{"ok":false,"error":"forbidden_origin","message":"This request must come from the site."}` |
| 405 | Method Not Allowed | Any verb other than `POST` | `{"ok":false,"error":"method_not_allowed","message":"Use POST."}` |
| 429 | Too Many Requests | More than five submissions from one address in a minute (`NFR-002.3`). Best-effort and per instance (`CON-012`). | `{"ok":false,"error":"rate_limited","message":"Too many attempts. Try again in a minute."}` |
| 500 | Internal Server Error | An unexpected failure inside the handler, before or after the upstream call | `{"ok":false,"error":"server_error","message":"Something went wrong. Try again."}` |
| 502 | Bad Gateway | Resend timed out after ten seconds, was unreachable, or returned an error, or the API key is missing or rejected (`NFR-004.1`) | `{"ok":false,"error":"upstream_unavailable","message":"We couldn't save your address. Try again."}` |

`401`, `404`, `409`, and `422` are unreachable. The first two because there is nothing to authorise against and nothing to look up; `409` because a repeat address is answered with `200` on purpose; `422` because every input rule is a `400` in this contract.

## Data Mapping

| UI Field / Component | Request Payload Field | Domain Entity.Field | Response Payload Field | Notes |
|----------------------|----------------------|---------------------|------------------------|-------|
| Email input (`SEC-007`) | `email` | `ENT-008 WaitlistSubscriber.email` | — | Trimmed before validation. Stored as typed apart from the trim; compared case-insensitively |
| Hidden honeypot input | `website` | — | — | Never persisted, never logged, never echoed |
| Consent statement link | — | `ENT-001 SiteConfig.privacyPath` | — | Renders the path to `PAGE-002`; no data leaves the browser |
| Submit control | — | — | `ok`, `message` | Loading state while the request is in flight; disabled together with the input to prevent a double submit (`FR-004.5`) |
| Inline status region | — | — | `message` on success; `message` on failure | `aria-live="polite"`; the failure `message` is rendered beside the input, not only in the live region |
| Field-level error text | — | — | `details[].error` | Mapped to a written message per error code; the raw code is never shown |

## Validation Rules

| Field | Rule | Error Message | Error Code |
|-------|------|--------------|------------|
| email | Required | Enter your email address. | `email_required` |
| email | Valid address format | Enter a valid email address. | `invalid_email` |
| email | Total length ≤ 254 characters | That address is too long. | `email_too_long` |
| email | Local part ≤ 64 characters | That address is too long. | `email_local_too_long` |
| email | Surrounding whitespace is trimmed before any check | (no message — a stray space must not produce an error, `Alt-5`) | — |
| email | Duplicate submission, case-insensitive | (no message — answered as success, `BR-004.5`) | — |
| website (honeypot) | Must be empty | (no message — answered as success, no contact created, `BR-004.6`) | — |
| Request body | Parseable JSON, or a form encoding | Something went wrong. Try again. | `invalid_body` |
| Origin | Must equal `SiteConfig.siteUrl` | (not user-facing; the visitor cannot legitimately reach this state) | `forbidden_origin` |
| Submission rate | ≤ 5 per address per minute | Too many attempts. Try again in a minute. | `rate_limited` |

Client-side validation covers the two format rules on blur so an obviously invalid value never costs a request (`FR-004.4`). The server repeats every rule, because the client check is a convenience and never the check that counts (`NFR-002.5`).

## Error Handling

| Error Condition | HTTP Status | Response Body | Frontend Behavior |
|-----------------|-------------|---------------|-------------------|
| Invalid address, caught client-side | N/A (no request sent) | N/A | Inline error associated with the input via `aria-describedby`, announced once, cleared when the value changes (`FR-004.4`, `design_system.md` §9.3 `INP-002`) |
| Invalid address, reaching the server (`Exc-1`) | 400 | `{"ok":false,"error":"invalid_email","message":"Enter a valid email address."}` | Form re-enables, retains the typed value, keeps the inline error until the value changes |
| Request from another origin (`Exc-3`) | 403 | `{"ok":false,"error":"forbidden_origin","message":"This request must come from the site."}` | Rendered as a generic failure. Not reachable from the site's own form, so appearing in practice means the endpoint is being called from elsewhere |
| Rate exceeded (`Exc-4`) | 429 | `{"ok":false,"error":"rate_limited","message":"Too many attempts. Try again in a minute."}` | Non-destructive error; typed address retained; retry available without re-entering the address |
| Resend unavailable, key rejected, or ten-second timeout (`Exc-2`) | 502 | `{"ok":false,"error":"upstream_unavailable","message":"We couldn't save your address. Try again."}` | Loading state ends, form re-enables, address retained, retry offered. The upstream body, status text, and key are never surfaced or logged (`NFR-002.4`) |
| Network failure before reaching the server (`Exc-5`) | N/A (client-side) | N/A | Connection problem reported as such — explicitly not as a rejected address. Address retained, retry offered |
| Unexpected handler failure | 500 | `{"ok":false,"error":"server_error","message":"Something went wrong. Try again."}` | Generic failure message with retry; no internal detail displayed |
| Non-POST verb | 405 | `{"ok":false,"error":"method_not_allowed","message":"Use POST."}` | Not reachable from the UI |
| JavaScript unavailable (`Alt-4`) | 200 or 303 | HTML, not JSON | The form posts natively as `application/x-www-form-urlencoded`; the handler validates identically and redirects to `PAGE-001` with a status parameter, where the outcome is stated in text (`FR-004.9`) |
| Honeypot filled (`Alt-3`) | 200 | Success payload | The visitor never sees a difference. Nothing is displayed because no human filled the field (`BR-004.6`) |

## Traceability

| Source of Truth | Reference | Relationship |
|-----------------|-----------|--------------|
| User Flow | `docs/user_flows/userflow_uc_002.md` | This UCIC implements the flow defined there, including Alt-1 … Alt-5 and Exc-1 … Exc-5 |
| Data Model | `docs/data_model.md` §3 ENT-008, ENT-001; §5 Waitlist Rules; §7 `waitlistRequestSchema` | This UCIC uses entities and rules defined there |
| SRS | `docs/srs.md` §3.4 F004 (incl. `BR-004`), §6.2 NFR-002, §6.4 NFR-004.1, §6.5 NFR-005, §3.4 `CON-001`, `CON-002`, `CON-012` | This UCIC satisfies the requirements defined there |
| Information Architecture | `docs/information_architecture.md` §4 Navigation Structure (waitlist funnel), §7 SEC-007 | Copy budgets for the form, consent statement, and success message come from there |
| Design System | `docs/design_system.md` §6 ELE-001, §9.1 BTN-002 … BTN-004, §9.3 INP-001 … INP-003, §11 Accessibility Contract | Focus handling, error association, and input styling come from there |
