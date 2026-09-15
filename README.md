# Bentomux — marketing site

The website for **Bentomux**, a calm desktop app for running coding agents side by side: project workspaces, persistent split-pane terminals, live agent state and approvals.

This repository holds the site only. The desktop application lives at [takora-dev/bentomux-v2](https://github.com/takora-dev/bentomux-v2).

- One scroll, five bands: hero, stat strip, the application window capture, five capability rows, install close
- Plus `/privacy`, `/sitemap.xml`, `/robots.txt` and a build-time Open Graph image
- No database, no cookies, no analytics, no forms — nothing about a visitor is collected

## Stack

| | |
|---|---|
| Framework | Next.js 16.3 (App Router, React 19) |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS 4 with design tokens in `src/app/globals.css` |
| Type | Archivo via `next/font`, subset `latin`, weights 800/900 |
| Runtime deps | `next`, `react`, `react-dom` — nothing else |

Node **20.9+** is required (what Next 16 declares).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000. In development `NEXT_PUBLIC_SITE_URL` is optional and falls back to `http://localhost:3000`; a production build without it fails on purpose.

## Environment

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes, in production | Absolute `http(s)` URL. Canonical link, Open Graph URL, sitemap and `robots.txt` all derive from this one value. The build throws if it is missing (`NFR-004.2`). `.env.example` ships `https://bentomux.farrasjibran.dev`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Leave unset and every `mailto:` link is omitted rather than pointed at an invented address. |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next dev server |
| `npm run build` | Production build — needs `NEXT_PUBLIC_SITE_URL` |
| `npm run start` | Serve the built output |
| `npm run lint` | ESLint |
| `npm run smoke` | Starts the production server (port `3199`, override with `SMOKE_PORT`) and asserts the server-rendered HTML against `docs/test_cases.md` |

`npm run smoke` runs against a build, not against source, and exits non-zero if any check fails. There is no test framework: the script is dependency-free and reads what the built server actually returns — band order, the install commands, the derived agent counts, both icon links, that no repository path leaks into the page, and that the optimiser can still serve a ≥ 960px hero mark. Run it the way CI would:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com npm run build && npm run smoke
```

## Layout

```
src/app/            routes, metadata, icons, sitemap, robots, globals.css
src/components/
  sections/         Hero, StatStrip, ScreenshotFigure, CapsSection, InstallSection
  site/             header, footer, skip link, logo
  ui/               Button, icons, primitives, cx
  install/          command blocks and the copy button
src/content/        every user-visible string and every derived figure
scripts/smoke.mjs   the runnable checks
public/             the mark and the application capture
docs/               the source of truth (below)
```

### Content is not written in components

All copy, the agent roster, the capability rows, the install commands and the stat figures live in `src/content/*` and are imported by the components. The modules validate themselves at build time (`src/content/validate.ts`), so counts that must agree — 21 detected agents, 9 configurable, five capability rows, three install platforms — fail the build instead of rendering a wrong or empty section.

The one figure that does not come from this repository is the GitHub star count. It is read from the GitHub API at render time and the strip drops the item entirely when that read fails, rather than showing a stale or invented number.

## Docs are the source of truth

Requirements and design live in `docs/`, not in prose scattered through the code. Code comments cite the clause they implement (`FR-002.4`, `CAP-001`, `IMG-002`, `MOT-003`, …), and a requirement ID is never reused once retired.

| Document | Covers |
|---|---|
| `srs.md` | Requirements: `FR`, `NFR`, `BR`, `AS`, `CON` |
| `information_architecture.md` | Pages, sections, layout and navigation |
| `design_system.md` | Tokens, components, motion, imagery, spacing |
| `data_model.md` | Entities and validation rules |
| `user_flows/userflow_uc_001…008.md` | Visitor-facing flow per use case |
| `system_logics/sys_uc_001…008.md` | How each use case is implemented |
| `test_plan.md`, `test_cases.md`, `test_execution_sheet.md` | What is verified and with which case IDs |
| `prompts.txt` | The implementation-prompt record |
| `devlogs/YYYYMMDD-<branch>.md` | What changed on a branch, and why |

Working on this repository means updating the relevant document in the same change as the code: a behaviour that is not in `docs/` is not done.

## Deployment

Build with `NEXT_PUBLIC_SITE_URL` set to the canonical origin, then serve the output. Any Node host that can run `next build` and `next start` works.

Every route is prerendered at build time — `/`, `/privacy`, the icons, the Open Graph image, `sitemap.xml` and `robots.txt` are all static. The only runtime work is the star count: that one GitHub API read is cached for an hour (`revalidate: 3600`) and the strip drops the figure if the read fails.

The build itself reaches the network once, for the Google Fonts fetch that `next/font` performs.

Two things to remember when deploying:

- Setting a different `NEXT_PUBLIC_SITE_URL` changes canonical URLs, Open Graph URLs, `sitemap.xml` and `robots.txt` — set it before the build, not after.
- `/bentomux.png` and `/screenshot.png` keep their filenames across re-exports. Purge the CDN or browser cache when either asset changes.

## Licence

MIT — see [LICENSE](LICENSE). The desktop application is MIT too.
