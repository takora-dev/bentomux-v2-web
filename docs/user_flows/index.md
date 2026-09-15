# User Flows — Registry

**Document:** SoT-4 (index) | **Derived From:** SoT-1 (SRS) | **Status:** Draft — pending validation | **Last Updated:** 2026-09-14

## 1. Purpose

This index is the entry point to the user flow set. It answers three questions without opening every file: which flows exist, which requirement each flow discharges, and which page each flow touches.

Every file in this directory decomposes one vertical slice of visitor intent into a main flow, alternative flows, exception flows, postconditions, acceptance criteria, and a traceability table back to the SRS. Together they are the bridge from requirements to the data model (SoT-6) and the system logics (SoT-7).

A flow is the unit of validation. When a requirement changes, the affected flow file is the artifact to re-validate — not the code.

## 2. File Structure

| Path | Contents |
|------|----------|
| `docs/user_flows/index.md` | This registry |
| `docs/user_flows/userflow_uc_001.md` | Browse the Landing Page |
| `docs/user_flows/userflow_uc_002.md` | Join the Waitlist |
| `docs/user_flows/userflow_uc_003.md` | Install Bentomux |
| `docs/user_flows/userflow_uc_004.md` | Explore Supported Agent Runtimes |
| `docs/user_flows/userflow_uc_005.md` | Read the FAQ — **Retired (2026-09-14)** |
| `docs/user_flows/userflow_uc_006.md` | Open the Project Links and Star the Repository |
| `docs/user_flows/userflow_uc_007.md` | Preview Theme Palettes — **Retired (2026-09-14)** |
| `docs/user_flows/userflow_uc_008.md` | Read the License, Attribution, and Privacy Statement |

## 3. Catalog

| UC ID | Name | SRS Feature | Primary Page | File Path | Status |
|-------|------|-------------|--------------|-----------|--------|
| UC-001 | Browse the Landing Page | F001, F002 | PAGE-001 | `userflow_uc_001.md` | Revised (v1.2) |
| UC-002 | Join the Waitlist | F004 | PAGE-001 | `userflow_uc_002.md` | Draft |
| UC-003 | Install Bentomux | F005 | PAGE-001 | `userflow_uc_003.md` | Draft |
| UC-004 | Explore Supported Agent Runtimes | F003 (retired) — counts now printed by F002 | PAGE-001 | `userflow_uc_004.md` | Revised (v1.2) |
| UC-005 | Read the FAQ | F006 (withdrawn) | PAGE-001 | `userflow_uc_005.md` | **Retired (2026-09-14)** |
| UC-006 | Open the Project Links and Star the Repository | F007 | PAGE-001 | `userflow_uc_006.md` | Revised (v1.2) |
| UC-007 | Preview Theme Palettes | F008 (withdrawn) | PAGE-001 | `userflow_uc_007.md` | **Retired (2026-09-14)** |
| UC-008 | Read the License, Attribution, and Privacy Statement | F009 | PAGE-001, PAGE-002 | `userflow_uc_008.md` | Draft |

Three notes on the table:

- `F003` is retired in `srs.md` v1.2: `FR-003.1`–`FR-003.6` are withdrawn and the derivation rules `BR-003.1`–`BR-003.7` are carried by UC-004. The counts those rules govern are now printed by capability row 04 and the stat strip, both in `F002`.
- `UC-005` and `UC-007` are retained as flows for traceability only. Their bands, content modules and requirements were removed in v1.2; neither has an executable test case in `docs/test_cases.md`, and their system logic files are kept as retired records.
- `UC-003` is titled **Install Bentomux** from v1.2 to match the band it describes; the "Request an App Download" name described a mock download surface that no longer exists.

## 4. Requirement → Use Case Mapping

Every SRS functional requirement and business rule maps to at least one flow. Requirements that are structural or infrastructural (document head, build constraints) are carried by UC-001, which owns the page as a whole.

| Requirement | Use Case | Requirement | Use Case |
|-------------|----------|-------------|----------|
| FR-001.1 | UC-001 | BR-001.1 | UC-001 |
| FR-001.2 | UC-001 | BR-001.2 | UC-001 |
| FR-001.3 | UC-001 | BR-001.3 | UC-001 |
| FR-001.4 | UC-001 | BR-001.4 | UC-001 |
| FR-001.5 | UC-001 | BR-001.5 | UC-001 |
| FR-001.6 | UC-001 | BR-001.6 | UC-001 |
| FR-001.7 | UC-001 | BR-001.7 | UC-001 |
| FR-001.8 | UC-001 | BR-001.8 | UC-001 |
| FR-001.9 | UC-001 | BR-002.1 | UC-001, UC-004 |
| FR-002.1 | UC-001 | BR-002.2 | UC-001 |
| FR-002.2 | UC-001 | BR-002.3 | UC-001 |
| FR-002.3 | UC-001 | BR-002.4 | UC-001 |
| FR-002.4 | UC-001 | BR-002.5 | UC-001, UC-003 |
| FR-002.5 | UC-001 | BR-002.6 | UC-001 |
| FR-002.6 | UC-001 | BR-003.1 | UC-004 |
| FR-002.7 | UC-001 | BR-003.2 | UC-004 |
| FR-002.8 | UC-001 | BR-003.3 | UC-004 |
| FR-002.9 | UC-001 | BR-003.4 | UC-004 |
| FR-002.10 | UC-001 | BR-003.5 | UC-004 |
| FR-002.11 | UC-001 | BR-003.6 | UC-004 |
| FR-004.1 | UC-002 | BR-003.7 | UC-004 |
| FR-004.2 | UC-002 | BR-004.1 | UC-002 |
| FR-004.3 | UC-002 | BR-004.2 | UC-002 |
| FR-004.4 | UC-002 | BR-004.3 | UC-002 |
| FR-004.5 | UC-002 | BR-004.4 | UC-002 |
| FR-004.6 | UC-002 | BR-004.5 | UC-002 |
| FR-004.7 | UC-002 | BR-004.6 | UC-002 |
| FR-004.8 | UC-002 | BR-004.7 | UC-002 |
| FR-004.9 | UC-002 | BR-005.1 | UC-003 |
| FR-005.1 | UC-003 | BR-005.2 | UC-003 |
| FR-005.2 | UC-003 | BR-005.3 | UC-003 |
| FR-005.3 | UC-003 | BR-005.4 | UC-003 |
| FR-005.4 | UC-003 | BR-005.5 | UC-003 |
| FR-005.5 | UC-003 | BR-005.6 | UC-003 |
| FR-005.6 | UC-003 | BR-005.7 | UC-003 |
| FR-005.7 | UC-003 | BR-005.8 | UC-003 |
| FR-005.8 | UC-003 | BR-005.9 | UC-003 |
| FR-005.9 | UC-003 | BR-006.1–BR-006.5 | Withdrawn (v1.2) |
| FR-005.10 | UC-003 | BR-007.1 | UC-006 |
| FR-005.11 | UC-003 | BR-007.2 | UC-006 |
| FR-005.12 | UC-003 | BR-007.3 | UC-006 |
| FR-005.13 | UC-003 | BR-007.4 | UC-006 |
| FR-005.14 | UC-003 | BR-008.1–BR-008.4 | Withdrawn (v1.2) |
| FR-006.1–FR-006.7 | Withdrawn (v1.2) | BR-009.1 | UC-008 |
| FR-007.1 | UC-006 | BR-009.2 | UC-008 |
| FR-007.2 | UC-006 | BR-009.3 | UC-008 |
| FR-007.3 | UC-006 | BR-009.4 | UC-008 |
| FR-007.4 | UC-006 | BR-009.5 | UC-008 |
| FR-007.5 | UC-006 | BR-009.6 | UC-008 |
| FR-007.6 | UC-006 | BR-009.7 | UC-008 |
| FR-007.7 | UC-006 | BR-009.8 | UC-008 |
| FR-008.1–FR-008.7 | Withdrawn (v1.2) |  |  |
| FR-009.1 | UC-008 |  |  |
| FR-009.2 | UC-008 |  |  |
| FR-009.3 | UC-008 |  |  |
| FR-009.4 | UC-008 |  |  |
| FR-009.5 | UC-008 |  |  |
| FR-009.6 | UC-008 |  |  |
| FR-009.7 | UC-008 |  |  |
| FR-009.8 | UC-008 |  |  |

**Non-functional requirements.** NFR-001.x (performance) and NFR-007.x (usability) are carried by the flow that owns the affected surface: loading budgets by UC-001 and UC-003, form ergonomics by UC-002, keyboard operation by the flow owning the control, and the window figure's controls and animation by UC-001 (`NFR-007.12`, `NFR-007.13`). NFR-002.x is carried by UC-002 for the endpoint and by UC-001 for headers. NFR-006.6 (one source per fact) is carried by UC-001 and UC-004, because the counts that rule governs are printed by both bands. NFR-008.x is carried by UC-001 for the indexable home page and by UC-008 for `/privacy`.

Retired flows carry no requirement: `FR-006.x`/`BR-006.x` (FAQ) and `FR-008.x`/`BR-008.x` (palette preview) were withdrawn in `srs.md` v1.2, so the rows above record the withdrawal rather than a mapping.

## 5. Page → Use Case Mapping

| Page | Use Cases |
|------|-----------|
| PAGE-001 `/` | UC-001, UC-002, UC-003, UC-004, UC-006, UC-008. `UC-005` and `UC-007` no longer have a surface on this page: both bands were removed in v1.2. |
| PAGE-002 `/privacy` | UC-008 |
| PAGE-003 `/*` | None. The not-found page has no flow of its own; it is the terminal state of an exception path recorded in UC-001. |
| `/api/waitlist` (route handler, not a page) | UC-002 |

## 6. Dependencies

The flow set depends on, and must remain consistent with:

| Dependency | Relationship |
|------------|--------------|
| `docs/srs.md` (SoT-1) | Source of every requirement ID cited in a traceability table. If a requirement changes, the citing flow is invalidated. |
| `docs/information_architecture.md` (SoT-2) | Source of `PAGE-*`, `SEC-*`, `NAV-*`, `XPG-*`, and `FOWN-001`. Flows reference section IDs, never restate their content. |
| `docs/design_system.md` (SoT-3) | Source of `PAL-*`, `TOK-*`, `CLR-*`, `MOT-*`, `LAY-*`, `BTN-*`, `INP-*`, `IMG-*`. Flows cite these for interaction behaviour such as focus, reduced motion, and colour-only signalling. |
| `docs/data_model.md` (SoT-6) | Derived **from** this flow set. Each entity in the data model must trace to a `Data Used` row in a flow. A flow may not reference an entity the data model does not define. |
| `docs/system_logics/` (SoT-7) | Derived from this flow set plus the data model. Each `sys_uc_NNN.md` corresponds one-to-one with the flow of the same number, except for the retired `sys_uc_005.md` (FAQ) and `sys_uc_007.md` (palettes), which are kept as retired records so the one-to-one mapping stays visible. |

Ordering rule: requirements → flows → data model → system logics. A change made out of order propagates downward and must be re-validated at every step.

## 7. Revision History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | 2026-09-13 | F. Jibran | Initial registry. Eight flows catalogued; requirement and page mappings recorded. |
| 1.2 | 2026-09-14 | F. Jibran | Registry re-validated against the v1.2 page and `srs.md` v1.2. `UC-005` (FAQ) and `UC-007` (palettes) retired with their bands and their requirements withdrawn; `UC-004` re-pointed to capability row 04 and the stat strip; `UC-006` re-pointed from the community grid to the footer's Project and Support groups; `UC-003` renamed to **Install Bentomux**; requirement mapping rebuilt with `FR-002.7`–`FR-002.11`, `BR-003.7` and the withdrawn families recorded as withdrawals; page mapping for PAGE-001 shortened. |
