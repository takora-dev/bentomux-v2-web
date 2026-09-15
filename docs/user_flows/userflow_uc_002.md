# User Flow: Join the Waitlist

**Document:** SoT-4 | **Derived From:** SoT-1 (SRS) | **Status:** Draft | **Last Updated:** 2026-09-13

## Use Case Information

| Field | Value |
|-------|-------|
| Use Case ID | UC-002 |
| Name | Join the Waitlist |
| Actor | Pre-release enthusiast (unauthenticated visitor, per `SRS §2.3`) |
| Goal | Register an email address so they are told once when the first Bentomux release ships |
| Trigger | The visitor submits the waitlist form in `SEC-007` |
| Preconditions | The site is deployed. `RESEND_API_KEY` is present in the server environment. The visitor has reached `SEC-007` by scrolling, by the hero action, by the navigation action, or by the footer. No account or prior visit is required. |

## Main Flow

*The "happy path" — the most common, successful scenario.*

1. Visitor reaches `SEC-007` → sees a heading, a one-sentence promise stating that one email will be sent at release, a labelled email input, a submit control, and a consent statement placed before the submit control (`SRS BR-004.2`).
2. Visitor enters an email address → client-side format validation runs on blur. Valid input produces no error; the value is not yet sent anywhere.
3. Visitor activates **Notify me** → the submit control enters its loading state, is disabled, and the input is disabled to prevent duplicate submissions (`SRS FR-004.5`).
4. Browser sends `POST /api/waitlist` with the email and the honeypot field → the request is same-origin.
5. Route Handler validates the request → the origin must match `NEXT_PUBLIC_SITE_URL`; the honeypot must be empty; the email must match the format and length rules (`SRS BR-004.1`, `NFR-002.2`).
6. Route Handler checks the best-effort rate limit → the submission is within the permitted rate (`SRS NFR-002.3`).
7. Route Handler calls the Resend Contacts API → creates a contact with the submitted email and `unsubscribed: false`, and assigns it to the configured waitlist topic when `RESEND_TOPIC_ID` is set.
8. Resend responds successfully → the Route Handler returns HTTP 200 with an anonymous success payload that does not disclose whether the address was new (`SRS BR-004.5`).
9. Visitor sees the success state → an inline `aria-live` region confirms registration and restates the expectation of one email at release (`SRS FR-004.3`). The form is replaced by, or visually settles into, a confirmed state; the address is not echoed back for re-submission.
10. **Goal achieved:** The visitor is a `WaitlistSubscriber` in Resend and will receive the release notification.

## Alternative Flows

*Valid variations of the main flow that still lead to success.*

### Alt-1: The email address is already registered
**Trigger:** The visitor submits an address that already exists as a Resend contact.

1. Route Handler detects that Resend reports the contact as existing, or that the create call resolves to the existing contact.
2. The handler returns the identical success payload and status used for a new signup (`SRS FR-004.6`).
3. **Outcome:** The visitor sees the same success state. No duplicate record is created, and nothing in the response reveals that the address was already on the list (`SRS BR-004.5`).

### Alt-2: Arrival from an action elsewhere on the page
**Trigger:** The visitor activates the **Join the waitlist** action in the hero or in the navigation bar instead of scrolling to the form.

1. The page scrolls to `#waitlist` with the section's heading clearance applied, so the heading is not hidden behind the sticky bar.
2. The email input receives focus.
3. The visitor completes steps 2–9 of the main flow.
4. **Outcome:** The remaining action on the page converts into a signup without the visitor having to find the section. The install section in `SEC-006` deliberately offers no such action: installing and joining the waitlist are separate intentions (`SRS FR-005.1`).

### Alt-3: Arrival with the honeypot populated by an automated client
**Trigger:** A naive bot fills every input it can find, including the hidden honeypot field.

1. Route Handler sees a non-empty honeypot and discards the submission without contacting Resend (`SRS BR-004.6`).
2. The handler returns the same success payload and status as a genuine signup.
3. **Outcome:** No contact is created, and the bot receives a success response, so it gains no signal that it was detected.

### Alt-4: Client-side JavaScript unavailable
**Trigger:** The visitor submits the form with JavaScript disabled (`SRS FR-004.9`).

1. The form performs a native POST to `/api/waitlist` with `Content-Type: application/x-www-form-urlencoded`.
2. The Route Handler accepts the form encoding as well as JSON, performs the same validation and Resend call, and redirects back to the page with a status query parameter (or renders the outcome directly).
3. **Outcome:** The submission succeeds or fails identically to the JavaScript path, and the resulting page states the outcome in text.

### Alt-5: Address normalised before storage
**Trigger:** The visitor types leading or trailing whitespace, or uppercase characters in the local part.

1. Route Handler trims surrounding whitespace before validation (`SRS §4.4`).
2. The address is stored as submitted apart from the trim; duplicate detection compares case-insensitively.
3. **Outcome:** A stray space does not produce a false validation error. `User@Example.com` and `user@example.com` are treated as the same subscriber.

## Exception Flows

*Error conditions and failure scenarios.*

### Exc-1: The email address is invalid
**Trigger:** The submitted address fails the format or length rules — no `@`, no domain, more than 254 characters, or a local part longer than 64 characters (`SRS BR-004.1`).

1. Client-side validation shows an inline error associated with the input and announces it (`SRS FR-004.4`). No request is sent.
2. If the value reaches the server anyway, the server rejects it and returns HTTP 400 with `error: "invalid_email"`.
3. The form re-enables, retains the typed value, and keeps the inline error visible until the value changes.
4. **Outcome:** The visitor is told precisely what is wrong and can correct it. No contact is created.

### Exc-2: Resend is unavailable or the API key is rejected
**Trigger:** The Resend API returns an error, times out after ten seconds, or the API key is missing or invalid (`SRS §5.3`, `NFR-004.1`).

1. The Route Handler does not leak the upstream body, status text, or the API key (`SRS NFR-002.4`). It returns HTTP 502 with a generic message.
2. The form exits its loading state, re-enables, retains the typed address, and shows an error stating that the address could not be saved with a retry affordance (`SRS FR-004.8`).
3. **Outcome:** No subscriber is silently lost. The visitor's input is preserved and retry is one action away.

### Exc-3: The request originates from another origin
**Trigger:** A request arrives with a missing or non-matching `Origin` header.

1. The Route Handler rejects the request with HTTP 403 before any validation or Resend call (`SRS NFR-002.2`).
2. **Outcome:** The endpoint cannot be used as an open relay for third-party forms.

### Exc-4: The submission rate is exceeded
**Trigger:** More than five submissions arrive from the same address within a minute (`SRS NFR-002.3`).

1. The Route Handler returns HTTP 429 with a message asking the visitor to try again shortly.
2. The form displays a non-destructive error and keeps the typed address.
3. **Outcome:** Automated abuse is slowed. Because the limit is per function instance and resets on cold start (`SRS CON-012`), it is a mitigation and not a guarantee — the honeypot remains the primary defence.

### Exc-5: The network request fails before reaching the server
**Trigger:** The visitor is offline, the connection drops, or the request is aborted.

1. The client-side fetch rejects. No server-side state changed, so no contact exists.
2. The form exits its loading state, retains the address, and shows a connection error with a retry affordance.
3. **Outcome:** The failure is reported honestly as a connection problem rather than as a rejected address.

## Postconditions

*What must be true after this use case completes (success or failure).*

- **On success:** a Resend contact exists for the submitted address with `unsubscribed: false`, assigned to the configured waitlist topic when one is set. Exactly one record exists per address — no duplicates.
- **On success:** the visitor has been shown a confirmation stating that one email will arrive at release.
- **On failure:** no contact was created, or the existing contact is unchanged. The visitor's typed address remains in the form with a visible retry path where the failure was recoverable.
- No subscriber email address is written to application logs (`SRS §4.3`).
- The API key has not been exposed to the browser under any outcome (`SRS NFR-002.1`).
- No cookie or session was created; the waitlist has no authenticated state.

## Related Pages

*Screens or pages involved in this use case. Reference IA (SoT #2).*

| Page ID | Page Name | Role in This Flow |
|---------|-----------|-------------------|
| PAGE-001 | Home | Entry point. `SEC-007` hosts the form; the hero and the navigation bar carry the actions that lead into it. |
| PAGE-002 | Privacy policy | Referenced by the consent statement so the visitor can read what happens to the address. |

## Data Used

*What data is created, read, updated, or deleted during this use case.*

| Data / Entity | Source | Operation | Notes |
|---------------|--------|-----------|-------|
| `WaitlistSubscriber` | Visitor input | Create | Created in Resend Contacts, not in a local database (`SRS CON-001`). System of record is Resend. |
| `WaitlistSubscriber` | Resend Contacts | Read | Read only to detect an existing contact so a repeat submission does not create a duplicate. |
| `SiteConfig` | `src/content/site.ts` | Read | Supplies the expected origin for the `Origin` check and the privacy policy path used in the consent statement. |
| ~~`FaqItem`~~ | — | **Removed (v1.2)** | `ENT-006` was retired with the `#faq` band, so the waitlist flow no longer names it; the consent wording carries its own meaning (`IA FOWN-001`). |

## Acceptance Criteria

*Testable conditions that must be met for this use case to be considered complete.*

- [ ] Submitting a valid new address creates a Resend contact and displays the success state
- [ ] Submitting an invalid address displays an inline error, sends no request, and creates no contact
- [ ] Submitting an address that already exists displays the success state and creates no duplicate contact
- [ ] A submission with a non-empty honeypot creates no contact and returns the same success response as a genuine signup
- [ ] A Resend failure returns HTTP 502, leaves the typed address in the form, and offers a retry
- [ ] A missing or invalid `RESEND_API_KEY` produces a handled error, never an unhandled exception page
- [ ] The browser network log contains no request to `api.resend.com`, and the API key appears in no client bundle
- [ ] A request with a non-matching `Origin` header is rejected with HTTP 403 before any Resend call
- [ ] The submit control is disabled during a request and cannot be activated twice
- [ ] The form is operable and submittable with JavaScript disabled
- [ ] The consent statement appears before the submit control in reading order and no option is pre-checked
- [ ] The success state confirms registration and the expectation of one email at release
- [ ] No subscriber address appears in server logs

## Traceability

*Link back to the SRS requirements this use case satisfies.*

| Requirement ID | Requirement Description | How This Flow Satisfies It |
|----------------|------------------------|---------------------------|
| FR-004.1 | Form with email input, submit control, consent statement | Main flow step 1 |
| FR-004.2 | Valid unseen address creates a Resend contact and returns success | Main flow steps 5–8 |
| FR-004.3 | Success state confirms registration and one-email expectation | Main flow step 9 |
| FR-004.4 | Validation errors inline, associated, announced | Exc-1 |
| FR-004.5 | Submit disabled in flight; no duplicate submissions | Main flow step 3 |
| FR-004.6 | Existing address returns the same success without disclosure | Alt-1 |
| FR-004.7 | Hidden honeypot field | Alt-3; `DS INP-003` |
| FR-004.8 | Failures preserve the address and offer retry | Exc-2, Exc-5 |
| FR-004.9 | Operable and submittable without client-side JavaScript | Alt-4 |
| BR-004.1 | Format validation and length limits | Exc-1; `SRS §4.4` |
| BR-004.2 | Consent stated, nothing pre-checked | Main flow step 1; AC 11 |
| BR-004.3 | Addresses used only for release notification and announcements | Postconditions; `PAGE-002` block 3 |
| BR-004.4 | API key never exposed to the browser | AC 7; Postconditions |
| BR-004.5 | Response must not disclose existing-subscriber status | Alt-1 |
| BR-004.6 | Honeypot submissions discarded with a success response | Alt-3 |
| BR-004.7 | Single opt-in with an explicit consent statement; double opt-in deferred | Main flow step 1; `SRS FUT-002` |
| NFR-003.3 | A failed submission degrades gracefully and never renders an unhandled error page | Exc-2, Exc-5 |
| NFR-002.1 | `RESEND_API_KEY` server-only | AC 7 |
| NFR-002.2 | Origin must match the configured site origin | Exc-3 |
| NFR-002.3 | Honeypot primary, per-IP rate limit secondary and best-effort | Alt-3; Exc-4 |
| NFR-002.4 | No stack traces, upstream bodies, or secrets in errors | Exc-2 |
| NFR-002.5 | All outbound user data validated server-side; client validation is never the only check | Exc-1; `UCIC-002` validation rules |
| NFR-002.6 | No address enumeration | Alt-1 |
| NFR-002.7 | Security headers set, including a CSP limited to the origins actually used | Postconditions |
| NFR-004.1 | Resend failure must not lose the typed address | Exc-2, Exc-5 |
| NFR-007.3 | Form completable in one field and one action | Main flow steps 2–3 |
| NFR-007.4 | Error messages state what went wrong and what to do next, in plain language without error codes | Exc-1, Exc-2 |
| LP-004 | Resend sending subdomain verified, or the endpoint deployed with the confirmation email deferred | Postconditions |
