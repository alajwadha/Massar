# Masaar (مسار)

A Saudi career platform that helps young professionals land jobs or promotions
at top Saudi firms (PIF, Aramco, NEOM, McKinsey, the Big 4, ministries) by:

- **Scoring CV competitiveness for a specific role** — and showing exactly what
  raises it ("CFA L1 takes you 60 → 75").
- **Building a certifications roadmap** with cost and **Hadaf reimbursement**
  flags (~50% government reimbursement most people don't know about).
- **Connecting to decision-makers directly** ("Good Targets") and recruiters
  ("HR") so you're known before you apply.

Mobile-first, Arabic-first (with English), installable as a PWA, premium UI with
intentional motion.

## Planning docs

The full plan lives in [`docs/`](./docs):

- [`docs/PLAN.md`](./docs/PLAN.md) — honest assessment, tech stack, phased build
  order, cost model, and product↔marketing strategy.
- [`docs/DATA_MODEL.md`](./docs/DATA_MODEL.md) — the data model.
- [`docs/SCORING.md`](./docs/SCORING.md) — the CV competitiveness score rubric.

## Tech stack

Next.js (App Router) + TypeScript · Tailwind CSS · Framer Motion · next-intl
(ar/en, RTL) · Supabase (Postgres/Auth/Storage) · Moyasar (mada, Apple Pay) ·
Claude API (CV scoring) · Vercel hosting.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in keys as you wire up each service
npm run dev                  # http://localhost:3000  → redirects to /ar
```

Other scripts:

```bash
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

## Project structure

```
src/
  app/[locale]/        # localized routes (ar default, en); RTL handled per-locale
  components/
    landing/           # landing-page sections (hero, score, features, pricing…)
    ui/                # primitives (button…)
  i18n/                # next-intl routing + request config
  messages/            # ar.json / en.json translation catalogs
  middleware.ts        # locale routing
supabase/migrations/   # Postgres schema (RLS-protected)
docs/                  # plan, data model, scoring rubric
```

## Status

Phase 0 (foundation) is in place: design system, i18n/RTL, PWA shell, landing
page, and the database schema. See `docs/PLAN.md` for what Phase 1 (the
human-in-the-loop MVP) adds next.
