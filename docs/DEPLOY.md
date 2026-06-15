# Deploying Masaar to Vercel

This is the operational runbook for the production deployment. It also records the
root cause of the early production 404 and how it was fixed, so it does not recur.

## Production at a glance

- Hosting: Vercel, project `massar` (scope `alialajwad951-5144s-projects`).
- Production domain: https://massar-sigma.vercel.app (a `*.vercel.app` domain;
  no custom domain is attached yet).
- Bare `/` redirects to `/ar` at the framework level (see `next.config.mjs`) and
  also via `next-intl` middleware, so the Arabic homepage is the default landing.

## Required environment variables (Vercel, Production)

Set these in Vercel under Project, Settings, Environment Variables, scoped to the
Production environment. They mirror `.env.example`.

| Variable | Purpose | Status |
| --- | --- | --- |
| `ADMIN_USER` | Basic Auth user for `/admin` | set (`admin`) |
| `ADMIN_PASSWORD` | Basic Auth password for `/admin`; if unset, `/admin` returns 404 | set (rotate as needed) |
| `NEXT_PUBLIC_SITE_URL` | Public base URL; used for the Moyasar payment callback | set to the production URL |
| `MOYASAR_PUBLISHABLE_KEY` | Moyasar hosted form key | add when the merchant account is ready |
| `MOYASAR_SECRET_KEY` | Moyasar server-side verification key | add when the merchant account is ready |

Until the Moyasar keys are present, checkout shows a "payment not configured"
notice and the rest of the site works normally. After adding them, redeploy so
the production build picks them up (`NEXT_PUBLIC_SITE_URL` is read at build time).

## How to deploy

Either path produces a production deployment and assigns the production domain:

- From this repo: `vercel --prod` (requires the Vercel CLI and `vercel link` to
  the existing `massar` project).
- Git integration: pushing to the production branch triggers a production build.

## Root cause of the original production 404 (and the fix)

Two project-level settings, not the code, caused the bare domain to 404:

1. **Framework Preset was blank** in the Vercel project. Git-integration builds
   ran `next build` but Vercel did not wire up the Next.js routing layer, so every
   app route (including `/ar`) returned a platform `NOT_FOUND`. Fixed by setting
   the Framework Preset to Next.js, and pinned in `vercel.json` (`"framework":
   "nextjs"`) so it survives any future project re-import or settings reset.

2. **Vercel Authentication (Deployment Protection)** was enabled at the
   `all_except_custom_domains` level. Because the production domain is a
   `*.vercel.app` domain (not a custom domain), it sat behind a Vercel login wall
   and could never be publicly viewable. It was turned off for this project so the
   marketing site is public.

After both changes, a fresh `vercel --prod` made `massar-sigma.vercel.app` serve
the site publicly.

## The `/admin` HR dashboard stays private

`/admin` exposes recruiter and HR contact PII, so it must never be public. It is
protected independently of Vercel Deployment Protection, in `src/middleware.ts`:

- On production, it is gated by HTTP Basic Auth using `ADMIN_USER` and
  `ADMIN_PASSWORD`. No credentials returns 401.
- On preview deployments, `ADMIN_PASSWORD` is not set, so `/admin` returns 404
  (hidden by default).

Because of this, turning off Vercel Authentication for the public site does not
expose the HR data. Keep `ADMIN_PASSWORD` set in Production, and rotate it in
Vercel if it is ever shared.
