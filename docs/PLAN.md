# Masaar (مسار) — Product & Build Plan

> A Saudi career platform that helps young professionals reach decision‑makers
> directly, score their CV competitiveness for a *specific* role, and build a
> certifications roadmap (with Hadaf reimbursement) — instead of applying into
> the ATS void.

This document is the single source of truth for the plan. It captures the
honest assessment, the tech stack, the data model, the phased build order, the
cost model, and how product and marketing reinforce each other.

---

## 1. Honest Assessment

### What's genuinely strong
- **The wedge is real.** Saudi hiring at PIF/Aramco/NEOM/ministries is
  relationship‑ and referral‑driven. "Become known before you apply" is a true
  insight, not a gimmick.
- **The CV Competitiveness Score is the moat.** Role‑specific, conservative,
  and — crucially — *actionable* ("CFA L1 takes you 60→75"). It creates
  instant value (rewrite your bullets, score jumps today) and a recurring
  reason to come back. This is the feature to obsess over.
- **The Hadaf hook is a marketing gift.** ~50% certification reimbursement that
  most people don't know about is a perfect top‑of‑funnel content angle and a
  tangible "we save you money" promise.
- **One‑time pricing fits the culture** and lowers the commitment barrier vs.
  subscription.
- **Distribution exists.** 1,000+ LinkedIn connections + a revenue‑share
  marketer who is the public face is a credible launch path for a founder who
  wants to stay behind the scenes.

### What's risky (and what to do about it)
1. **LinkedIn outreach is the legal/ToS soft spot.** Do **not** scrape LinkedIn
   or automate sending. The compliant model: the *customer* exports their own
   connections (LinkedIn lets users download their data) and uploads it; we
   match and *draft* messages; the customer sends manually. Keep all automation
   on the customer's side and the human in the loop. Frame this clearly in ToS.
2. **The HR database is the operationally hard asset.** A shared, maintained
   database of recruiters across Saudi companies is valuable *and* a liability
   (PDPL — Saudi's data protection law). Store only business‑contact data,
   honor deletion requests, and have a lawful basis. Start small and accurate
   over large and stale.
3. **Score trust is fragile.** One inflated score in front of someone who knows
   the market kills credibility. Stay conservative, show the reasoning, and
   never promise outcomes. "Competitiveness," never "you'll get hired."
4. **Manual CV analysis won't scale past ~dozens/week.** That's fine for MVP and
   actually the right call — you learn the scoring rubric by doing it by hand
   with Claude before you automate. Build the product so a human (you) can sit
   in the loop and "approve/edit" generated output from day one.
5. **PDPL / payments compliance.** Saudi PDPL is in force. You need a privacy
   policy, consent, data residency awareness, and a registered way to take
   money. Moyasar/Tap handle the payment compliance; you handle data.
6. **Single‑founder bus factor.** Keep the stack boring and managed. Every hour
   spent on infra is an hour not spent on the score rubric and content.

### What's missing from the brief (decide these early)
- **Refund / guarantee policy** for a one‑time product (sets support load).
- **What exactly the customer gets in the deliverable** — is it a live
  dashboard, a one‑time report, or both? (Recommendation: live dashboard, so
  the score/roadmap stays useful and re‑scoring drives return visits.)
- **Starter vs Pro line** — concrete limits (paths, targets, re‑scores).
- **Data deletion & retention** UX (PDPL requirement, also a trust feature).

---

## 2. Recommended Tech Stack

Optimized for: one part‑time maintainer, <1000 SAR/month, mobile‑first PWA,
Arabic‑first RTL, Saudi payments, and a human‑in‑the‑loop scoring workflow.

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | One codebase for SEO landing, app, and API routes. Huge ecosystem, easy for one person. |
| UI | **Tailwind CSS + shadcn/ui (Radix)** | Accessible, RTL‑friendly primitives; fast to build a premium look. |
| Motion | **Framer Motion** | The "nothing snaps" requirement: fast ease‑out, layout animations, micro‑interactions. |
| i18n / RTL | **next-intl** | First‑class App Router i18n; `[locale]` routing for `ar`/`en`, `dir` switching. |
| Fonts | **Tajawal / IBM Plex Sans Arabic** (AR) + **Inter** (EN) | Clean, modern, excellent Arabic rendering. |
| DB + Auth + Storage | **Supabase (Postgres)** | One managed service for DB, auth, file storage, row‑level security. Generous free tier; scales cheaply. |
| Payments | **Moyasar** (primary) or **Tap** | Native mada + Apple Pay, SAR, one‑time payments, Saudi‑registered. |
| CV parsing | **unpdf / pdf-parse** (text) + **Claude API** (analysis) | Extract text locally, reason with Claude. Human approves output in MVP. |
| Hosting | **Vercel** | Best Next.js DX, cheap, global edge, easy previews. |
| PWA | **next-pwa / Serwist** | Installable on phones, offline shell, app‑like feel. |
| Email | **Resend** | Transactional (receipts, "your report is ready"). |
| Analytics | **Vercel Analytics + PostHog (free tier)** | Funnel + product analytics for the marketing loop. |
| Error tracking | **Sentry (free tier)** | One‑person teams need to know when things break. |

**Why not a separate backend?** Next.js API routes + Supabase covers it. Adding
a separate server is overhead a solo founder doesn't need yet.

**Why Supabase over Firebase?** Postgres (relational data: paths, certs,
targets, scores all relate), SQL you can reason about, row‑level security, and
no lock‑in to a proprietary query model.

---

## 3. Data Model (high level)

See `docs/DATA_MODEL.md` for the full schema and `supabase/migrations` for SQL.
Core entities:

- **users / profiles** — auth + locale + plan (`starter` | `pro`).
- **cvs** — uploaded file ref + extracted text + parsed structured JSON.
- **intake** — target companies, desired salary, goal (job vs promotion).
- **career_paths** — generated paths per user (title, company, fit summary).
- **certifications** — master catalog (name, cost, Hadaf‑reimbursable, provider).
- **path_certifications** — ordered roadmap linking a path to certs.
- **scores** — a score for (cv × role/path): overall + sub‑scores (education,
  experience, employer_prestige, skills, writing_quality) + `improvements[]`
  (each: action, delta, effort) so the UI can render "60 → 75".
- **employers** — prestige weighting table (PIF, Aramco, McKinsey… → tier).
- **targets** ("Good Targets") — decision‑makers matched to a user, with
  `is_connection` (already connected vs needs request) + relevance score.
- **hr_contacts** — the shared, proprietary recruiter database (company, sector,
  role, verified_at). Read‑shared across users; written by admin.
- **outreach** — per (user × target) message draft + status (drafted / sent /
  replied) for the tracker.
- **payments** — Moyasar transaction records, plan purchased.

Two contact surfaces, deliberately separate:
- **Good Targets** = decision‑makers from the *customer's own* connection export
  (strategic, relationship outreach; `is_connection` drives the approach).
- **HR** = our shared, maintained database (formal application gateway).

---

## 4. Phased Build Order

### Phase 0 — Foundation (this commit)
Scaffold, design system, i18n/RTL, PWA shell, landing page, DB schema, planning
docs. The repo becomes a real, runnable project.

### Phase 1 — MVP that proves the concept (human‑in‑the‑loop)
Goal: a paying customer uploads a CV and gets a role‑specific score + roadmap +
target list, with **you** approving the Claude‑generated output behind an admin
screen.
- Auth (Supabase) + plan gating.
- Payment (Moyasar one‑time, mada + Apple Pay) → unlocks the dashboard.
- CV upload + text extraction + intake form.
- **Admin queue**: you review the extracted CV, run the scoring rubric with
  Claude, edit, and publish the score + paths + roadmap to the customer.
- Customer dashboard: score with "what raises it", certifications roadmap with
  Hadaf flags, Good Targets list (from their uploaded connections export) with
  `is_connection` badges and relevance scores, outreach drafts + tracker.
- Shareable score image (the marketing engine — see §6).
- Landing page live with Arabic/English, PWA install.

### Phase 2 — Automation & scale
- Automate the scoring pipeline (Claude API) with you as approver, then
  auto‑publish for high‑confidence cases.
- Self‑serve re‑scoring ("rewrite a bullet, see the score move").
- Grow + verify the HR database; admin tooling for it.
- Referral loop + before/after share cards instrumented.

### Phase 3 — Depth
- More paths/targets for Pro, salary benchmarking, certification provider
  deep‑links, employer‑prestige model refinement, SEO content engine.

---

## 5. Cost Model (monthly, SAR, ~3.75 SAR/USD)

| Users | Vercel | Supabase | Claude API | Moyasar | Email/misc | Total (SAR) |
|---|---|---|---|---|---|---|
| 0–50 | Free | Free | ~$5 | per‑txn fee only | ~$5 | **~75–110** |
| 50–300 | $20 (Pro) | Free→$25 | ~$30 | per‑txn fee | ~$15 | **~340–450** |
| 300–1000 | $20 | $25 | ~$80 | per‑txn fee | ~$25 | **~560–760** |

Comfortably inside the 500–1000 SAR/month target through ~1,000 customers,
because pricing is one‑time (no per‑user recurring infra pressure) and the
heaviest cost (Claude analysis) is gated behind a paid action. Payment
processing is a per‑transaction % (Moyasar), netted from revenue, not fixed
overhead.

---

## 6. Product ↔ Marketing Reinforcement

- **Shareable score card** — the product generates a clean image: "From 60 → 85
  for PIF — Investment Analyst." Built‑in OG image generation (Next.js
  `ImageResponse`). This is organic distribution baked into the product.
- **Hadaf awareness content** — "You can get ~50% of your certification cost
  back. Here's how." Evergreen, high‑intent, SEO‑friendly, perfect for the
  marketer to run on X/LinkedIn/TikTok.
- **Before/after framing** — the score's improvement deltas are the content.
  "I applied to 80 jobs with no reply — here's what I changed."
- **Referral loop** — give a discount or extra paths for referrals; track via a
  `referral_code` on the user.
- **SEO** — programmatic pages for "كيف تعمل في صندوق الاستثمارات العامة" /
  "career path at Aramco" etc., generated from the paths/certs data.
- **Founder stays behind the scenes** — everything above works through the
  product + the marketer; none requires the founder to be the public face.

Build‑in vs. manual at first: build the **share card** and **referral code**
(cheap, compounding). Do the **content calendar** and **HR database growth**
manually until patterns are clear.

---

## 7. Open Decisions (need your input later)
1. Deliverable = live dashboard (recommended) vs one‑time report?
2. Starter vs Pro concrete limits (paths / targets / re‑scores)?
3. Refund policy for a one‑time purchase?
4. Moyasar vs Tap (recommend Moyasar) — needs a Saudi entity/CR to register.
5. Exact brand palette/logo (current scaffold uses a premium emerald + ink).

---

## 8. Onboarding process and deferred ideas (agreed 2026-06-16)

This section is the agreed operating model going forward. Some of it is built,
some is queued. Read this first when picking the work back up.

### 8.1 Per-customer onboarding flow
1. Scan the customer's CV. Identify the current area plus potential areas, and
   score each area 0-100 with the SCORING.md rubric.
2. The highest-scoring area is the headline on the Home page. Home also lists the
   top 3 areas with their scores.
3. Each path is one area and shows its score (NOT a separate "match %"; the old
   match metric is removed in favor of one scoring mechanism everywhere).
4. Research real certifications per path: name, description, official link, Hadaf
   eligibility, and the score gain each adds.
5. Contacts:
   - HR (recruiters) come from our database, tiered by package: Starter = 100,
     Pro = 300 (HR only). HR is CATEGORIZED like Connections and gets the same
     filter UI: by sector/industry (finance, energy, consulting, government,
     tech, ...) and by company tier (giant / large / mid-market / SME / agency
     per SECTORS.md, skewed to mid-market and SME, which actually respond). So
     the customer can narrow their 100/300 recruiters to the field they want.
   - Connections (the people the customer reaches out to) come from the
     customer's own uploaded LinkedIn Connections.csv. We do NOT invent or
     supply decision-makers. The file is parsed client-side (never uploaded or
     stored) and auto-ranked by the customer's target companies/sectors. The
     per-path "5 picks" and the Home "top connections" also draw from this
     ranked network, so they are empty until the customer uploads.
6. Messages are generated automatically on upload by filling templates written
   in the customer's voice (from the CV) with each recipient's name, company, and
   role. Personalized on both ends, instant, free, and fully client-side.
7. Assemble the CustomerPlan, add the slug, deploy, and send /c/<slug>.

Net effect: per customer the only manual step is the one-time CV -> plan
(score, paths, certs, HR list, message templates). Connections and messages then
generate themselves whenever the customer uploads their CSV.

This also settles two earlier open decisions: deliverable = the live dashboard;
Starter/Pro = 100/300 HR contacts.

### 8.2 Deferred: AI-written outreach messages (optional upgrade)
Today messages are smart templates (a few variants, auto-filled per recipient).
A future option is to have every message uniquely AI-written per person.
- Cost: tiny. Short outreach (~100 words) is about $0.002/message on Haiku
  (~$0.20 per 100, ~$0.60 per 300) or ~$0.006 on Sonnet (~$0.60 / ~$1.80).
  Prompt-caching the customer profile cuts repeat input cost another 5-10x. So
  it is pennies per customer; cost is not the deciding factor.
- Effort: ~1-2 hours. One /api route + an ANTHROPIC_API_KEY env var on Vercel +
  the Anthropic SDK + a "Write with AI" button per contact card. The app already
  has an /api folder, so it is a standard integration, low risk.
- Tradeoffs (the real reason it is deferred, not cost or difficulty):
  1. Privacy. AI-writing sends the recipient's name/company to our server and to
     Anthropic, which breaks the "your file never leaves your browser" promise we
     show. Would need a consent step or a reworded promise.
  2. Small quality gain. The CSV only has name/company/title (no shared school or
     recent post), so the AI mostly rephrases the same facts the template already
     uses. Bigger uplift would require feeding it richer per-person data.
- Decision: ship templates first (instant, free, private); add AI-written
  messages later as an optional toggle if we want the polish.

### 8.3 Deferred: persistence and automation
- Supabase (customers + contacts tables): plans persist and getPlan reads the DB
  by slug; the 100/300 HR are pulled live from the DB by field instead of seeded
  in code. Privacy note: serving real, web-sourced HR PII on a public unguessable
  link is a PDPL exposure - add a magic-link/consent gate when doing this.
- CV -> JSON generator: automate producing the CustomerPlan object from an
  uploaded CV so onboarding is near-instant.
