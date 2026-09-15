# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (Turbopack)
npm run build        # production build
npm run lint         # ESLint
npm run build && npm run smoke   # full smoke test suite
```

`SMOKE_PORT` env overrides the smoke server port (default 3199).

## Environment

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://...   # required in production builds — missing value fails build
NEXT_PUBLIC_CONTACT_EMAIL=...      # optional; omit to suppress mailto: links
```

## Architecture

Single-scroll marketing landing page for Bentomux (a desktop app for running coding agents side by side). Next.js 15 App Router, React 19, Tailwind 4, TypeScript.

**Content layer** (`src/content/`) — all copy lives here as typed constants, never inline in components:
- `site.ts` — `SiteConfig` (URLs, metadata, license). Single source for every absolute URL; derives from `NEXT_PUBLIC_SITE_URL`.
- `sections.ts` — page band copy + anchor IDs + privacy policy blocks.
- `caps.ts`, `install.ts`, `chrome.ts`, `screenshot.ts`, `stats.ts`, `agents.ts`, `nav.ts` — per-section data.
- `validate.ts` — `invariant()` helper used for build-time env guards.

**Components** (`src/components/`):
- `sections/` — one component per page band (Hero, StatStrip, CapsSection, InstallSection, ScreenshotFigure).
- `install/` — CommandBlock, CopyButton.
- `site/` — SiteHeader, SiteFooter, SkipLink.
- `ui/` — primitives, Button, icons, `cx.ts` (classname helper).

**Pages** (`src/app/`): `page.tsx` composes section components; `layout.tsx` sets metadata + JSON-LD; `privacy/page.tsx`; `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`.

## Design System

Defined in `DESIGN.md`. Key CSS custom properties set in `globals.css`:
- Background: `--bg` (`#f0eee9`), elevated: `--bg-elevated`
- Accent: `--accent` (`#4a9eff`)
- Terminal colors prefixed `--term-*`
- Fonts: `--body` (Inter), `--disp` (Archivo), `--mono` (JetBrains Mono)
- Max content width: `--max` (1160px), gutter: `--gut` (34px)

CSP in `next.config.ts` is strict — no external scripts, fonts, or fetch targets allowed.

## Smoke Tests

`scripts/smoke.mjs` starts the production server and validates rendered HTML/CSS against spec IDs (BR-*, NFR-*, TC-F*, IMG-*). Run after every build. No test framework — exits non-zero on first failure. Content constants are duplicated in the script intentionally; drift surfaces as a failing check.
