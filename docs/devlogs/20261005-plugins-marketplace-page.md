# 20261005-plugins-marketplace-page

## What changed

Added PAGE-004, the public plugin marketplace index at `/plugins`, and wired it
into the site chrome. Nothing was removed.

| File | Change |
|---|---|
| `src/content/plugins.ts` | New. The catalog fetch (`fetchCatalog`), the search and paging functions, and every string the page renders. |
| `src/components/plugins/PluginCatalog.tsx` | New. The client-side list: search over the prerendered rows, ten a page. |
| `src/app/plugins/page.tsx` | New. The route: header, catalog, install guidance, publish guidance, honesty table. |
| `src/content/nav.ts` | A `Plugins` item between `Docs` and `Compare`. |
| `src/components/site/SiteFooter.tsx` | A `plugins` link between `docs` and `compare`. |
| `src/app/sitemap.ts` | `/plugins`, `changeFrequency: "daily"`, priority 0.7. |
| `src/app/docs/plugins/page.tsx` | The install section now says GitHub is the catalog and links to `/plugins`. |
| `scripts/smoke.mjs` | Seven checks for PAGE-004, plus `/plugins` in the sitemap check. |
| `docs/srs.md`, `docs/information_architecture.md`, `docs/test_cases.md` | `F010`/`FR-010.x`/`BR-010.x`, PAGE-004, `SEC-014`, `SEC-015`, `URL-007`, `TC-F010-001` … `TC-F010-010`, revision histories. |
| `README.md` | The route list, the component list, and a "The plugin catalog" section. |

## Why the catalog is read at build time

Unauthenticated GitHub allows **60 core requests an hour and 10 search requests
a minute, per IP** (the numbers in the application's `docs/PLUGIN_MARKETPLACE.md`,
read from the live API). One sweep of 30 repos costs one search plus one release
call each — 31 of the 60. The desktop app spends that from its own cache, every
six hours, and it is the app's budget to spend.

A page that fetched per visitor would spend the *visitor's* budget and show them
a rate-limit error instead of a catalog. So the build fetches once, prerenders
the rows, and the browser searches and pages over what it was given. The
`revalidate: 21600` on the fetch matches the app's six-hour TTL.

## Why the rules are copied, not invented

`src/content/plugins.ts` repeats the topic, the fork/archived exclusions, the
30-row cap, the stars-first order, the tie-break and the ten-row page size from
`src/shared/marketplace.ts` in `takora-dev/bentomux-v2`. It has to: the website
and the app describe the same catalog, and two surfaces that page differently
would put the same plugin on two different pages. A website cannot import Rust,
so the rules are restated and the smoke run asserts the strings that matter.

## What the page refuses to claim

The page is a discovery surface. It is not an installer, and the checks in
`scripts/smoke.mjs` hold it to that:

- **No hosted registry.** There is no server, no account, no submission form and
  no moderation queue, and the page says GitHub is the catalog.
- **No site-side install.** Installation happens in the app, which downloads the
  asset, verifies the sha256 GitHub published, and shows the permissions before
  anything runs. There is no download button here.
- **No sort the app does not implement.** Most-starred first is the only order.
  Herdr's page carries "Trending this week" and "New to the herd"; the app has
  no such thing, so neither does this page, and a check fails if the words
  reappear.
- **No invented numbers.** When GitHub does not answer the build, the list is
  empty with a reason and a link to the live topic search — the same rule the
  stat strip already follows for the star count.

## First listing

`farasjibran/petdex-plugins`, release `v1.6.0`, one `.zip` asset with a
published digest — the catalog's first real row, and the one this build
prerendered.

## How each state was exercised

A GitHub outage and a 23-row catalog cannot both be present in one build, so
`PLUGINS_FIXTURE` swaps the network read for a deterministic one. It is unset in
every real build; the only production path is the `getJson` call below it.

| State | How it was checked | Result |
|---|---|---|
| Live catalog | the real build, no fixture | one row, `petdex-plugins v1.6.0`, ★ 1 · ↓ 4, release link, no pager |
| Two pages | `PLUGINS_FIXTURE=many` (23 rows) | ten rows prerendered, `Page 1 of 3`, Next enabled / Previous disabled |
| Empty catalog | `PLUGINS_FIXTURE=empty` | the reason sentence, `No plugins published yet.`, and the live topic-search link |
| Not installable | the fixture rows carry the app's own `note` strings | `Not installable` badge, the note, and a Repository link instead of a Release link |

A real GitHub outage was not reproduced — the failure path is the same `null`
return the empty fixture exercises, and the `getJson` catch is a plain
`return null`.

## Not verified

No browser was available in this environment, so the following are reasoned
from the code and the prerendered HTML, not observed:

- **Focus management** while typing in the search box. The list repaints on
  every keystroke, but the input is a controlled React node that is never
  unmounted, so focus should hold; the app's `renderCatalog` needed an explicit
  split for exactly this reason, and this component's `Row` list is the only
  thing that re-renders.
- **Breakpoints.** The row is a flex column below `sm` and a two-column flex row
  at `sm` and up; the shell is the same `--layout-max` container every other
  page uses. No screenshot was taken.
- **Light mode.** The site has none — `globals.css` declares one dark palette and
  `layout.tsx` sets `colorScheme: "dark"`.
