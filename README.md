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

## Sales site & payments

The public site sells the product end to end: a professional, modern marketing
landing (hero + CV-score showcase, problem, how-it-works, features, Hadaf hook,
testimonials, pricing, FAQ) → **checkout** → **Moyasar payment** (mada / cards /
STC Pay) → **server-side verification** → unlock. The payment integration is
code-complete and env-gated; see **`docs/PAYMENTS.md`** for the keys needed to go
live. Until keys are set, checkout shows a "not configured" notice and the rest
of the site works.

## Deploy (Vercel)

1. Push to GitHub (done) and import the repo at vercel.com → New Project.
2. Framework preset: **Next.js** (auto-detected). No build config needed.
3. Add environment variables (Project → Settings → Environment Variables):
   `NEXT_PUBLIC_SITE_URL`, `MOYASAR_PUBLISHABLE_KEY`, `MOYASAR_SECRET_KEY`
   (and Supabase/Anthropic/Resend keys when those phases land — see `.env.example`).
4. Deploy. Set a custom domain when ready; update `NEXT_PUBLIC_SITE_URL` to match
   (it's used for the Moyasar payment callback).

To keep the internal `/admin` HR dashboard private, add auth (Phase 1) before
sharing the deployed URL, or gate it with Vercel password protection.

## Status

Foundation + sales site are in place: design system, i18n/RTL, PWA, full
marketing site, Moyasar checkout, and the HR database (1,200+ contacts) with its
admin dashboard. See `docs/PLAN.md` for the remaining Phase 1 work (Supabase +
auth, CV scoring, customer dashboard).
