# Production pipeline and runbook

How we build and deliver one customer's plan, end to end, plus everything you need to
actually do it: where the code lives, the data model, a step by step recipe for adding
a customer, the scoring model, deployment, security, and a worked example.

This is the source of truth for the process. The two validation agents check the work
against this document.

## Contents

1. Overview (the process)
2. Hard rules
3. Codebase map
4. The data model (CustomerPlan)
5. How to add a new customer (recipe)
6. The scoring model
7. Contacts: connections vs HR
8. The Pro pages (Study and Opportunities) data
9. Bilingual and RTL
10. Build, verify, deploy
11. The research knowledge base
12. Worked example: Ali
13. Not yet built

---

## 1. Overview (the process)

After a customer sends their CV, before their link goes out:

1. Read the CV: profile, current degree, field, strengths, gaps, target sectors.
2. Score the CV per level for each path (entry, mid, senior, director).
3. Author the typed CustomerPlan. The grounding rule applies to every item.
4. Pull the data: HR contacts from the database by sector and tier, connections from
   the customer's LinkedIn CSV. Then a data sanity pass.
5. Tier and config check: pathways, caps, and Pro gating match the tier.
6. Source and fact check: every concrete claim checked against a real source or
   softened. Every verified fact is written to the research store.
7. Link health check: every URL loads and points to the right page.
8. Render verification: typecheck, production build, measured preview at desktop and
   phone, Arabic and English, light and dark.
9. Two agent validation gate (below).
10. Preview link first, click through every tab in both languages, then promote.
11. Version the customer record as a dated snapshot.
12. Deliver the link. The customer uploads their LinkedIn CSV and works the plan.

### The validation gate (THREE serial reviews; never lazy data)

- The gate is THREE FULL reviews in series. Run them in order; each must PASS before the
  next runs. If any fails, fix every finding and restart from agent one.
- AGENT ONE checks RELEVANCE and lazy data usage, first and above all. NEVER show a piece of
  shared data because it exists; it must FIT THIS PERSON. Fail the gate for any item reused
  but not relevant: a major, program, cert, company, or path that does not match the
  customer's real field and pathways (for example a Computer Science or Energy Economics
  master's for a mechanical oil-and-gas engineer, or a Solar PV cert for a non-solar
  profile). Every major, university, cert, company, and path must be justified for THIS person.
- AGENT TWO and AGENT THREE each do an independent FULL review of everything AND repeat the
  relevance and anti-lazy check. Agent three exists to catch what two missed.
- Give each agent the customer's CV and point it at the code. Run with the Agent tool one
  after another (each only after the previous passes), or a Workflow that enforces the order.

Every review covers, in full:
- Relevance and anti-lazy: every major, program, cert, company, and path fits THIS person's
  field and pathways; nothing is shown merely because it exists in the shared data.
- Full-time universities: the full-time graduate universities MUST be in the US or the UK only
  (the destinations Saudi scholarships target). Mix the two across a major. The Saudi part-time,
  study-while-working options are a separate section and stay Saudi.
- World class: at least ONE university per major must be in the QS World University Rankings
  top 30 (the OVERALL university ranking, NOT the subject/by-major ranking), flagged top30:true,
  so every major has a genuine world-class, Pioneers-eligible reach option.
- Technical: builds and renders; registered under the right slug with no collision; tier and
  sectors valid; the right number of paths each with a DERIVED score (`withScore`), valid
  icon and gradFields, complete certs with well-formed official links; one primary that
  `primaryPath` matches; Study shows 3 majors close to the pathways, 4 universities each.
- Grounding: every strength, score factor, and number traces to a CV line; nothing invented;
  certs are appropriate not padding; Arabic messages never spell the name in Latin letters.
- Honesty: no unverified external fact stated as certain; Hadaf flagged only where verified;
  the score follows the rubric inputs.

The bar is STRICT. A finding is not a soft note; any one of these fails the gate:
- Lazy or irrelevant data: an item shown because it exists, not because it fits the person.
- A full-time graduate university that is not in the US or the UK.
- A major with no QS World top 30 (overall ranking) university, or a top30 flag based on a
  subject/by-major ranking rather than the overall QS World ranking.
- A claim, score factor, or number that does not point to a specific line in the CV.
- Generic, template like content that could describe any candidate in the field.
- An unverified external fact stated as certain.
- A score that does not follow from the rubric inputs (scoring.ts), or inputs not grounded
  in the CV.

---

## 2. Hard rules (never break)

- Never store or commit the customer's CV. Read it, use it, do not save it.
- Never rewrite the customer's CV for them. Feedback and review are fine; the CV is
  theirs and tied to their future, so we do not take responsibility for rewriting it.
- The CV review lists only real, CV grounded, CV editable items. Never invent a flaw
  (no "too much white space" if there is none), and never put "earn a certificate" in
  the review (that is the certs roadmap, not a CV edit).
- Never expose HR personal data. `data/hr_contacts.clean.csv` holds 1,209 real people;
  `/admin` is Basic Auth gated; a customer view only shows what their tier allows.
- Ground everything. Every item traces to the CV or a sourced research record.
- House style: almost never use dashes in any copy, including the product UI. They read
  as machine written.
- Examples the customer gives are illustrative of the concept or level, not literal
  content to paste. Derive the real items from their actual CV and verify each.

---

## 3. Codebase map

| What | Where |
| --- | --- |
| Data, types, copy, plan registry, helpers | [src/lib/app-data.ts](src/lib/app-data.ts) |
| HR database reader (server only) | [src/lib/hr-db.ts](src/lib/hr-db.ts) |
| The real HR rows (1,209) | `data/hr_contacts.clean.csv` |
| The v4 "Atlas" UI (the product) | [src/components/v4/v4.tsx](src/components/v4/v4.tsx) |
| Plan context (PlanProvider / usePlan) | [src/components/app/plan-context.tsx](src/components/app/plan-context.tsx) |
| Client state (network + progress) | [src/components/app/dashboard-state.tsx](src/components/app/dashboard-state.tsx) |
| Main customer route (serves v4) | [src/app/[locale]/c/[slug]/page.tsx](src/app/[locale]/c/[slug]/page.tsx) |
| Alias route (also v4) | [src/app/[locale]/v4/[slug]/page.tsx](src/app/[locale]/v4/[slug]/page.tsx) |
| Locale routing (ar default, RTL) | [src/i18n/routing.ts](src/i18n/routing.ts) |
| Marketing landing | [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx) |
| Admin (HR PII, gated) | [src/app/[locale]/admin](src/app/[locale]/admin) |
| Research knowledge base | [research/README.md](research/README.md) |

Superseded, pending removal: v1 (`/app` demo + the old `Dashboard` and `AppShell`),
v2 (`/studio`), v3 (`/glass`). They share the same data layer but are not the product.

---

## 4. The data model (CustomerPlan)

Everything that varies per customer is one `CustomerPlan` object, rendered through
`<PlanProvider>` so each customer is fully isolated. Defined in `src/lib/app-data.ts`:

```ts
type CustomerPlan = {
  slug: string;             // the URL: /c/<slug>
  tier: 'starter' | 'pro';  // caps and Pro page access
  sectors: string[];        // SECTOR_LABELS keys; drives HR + company filtering
  profile: { name; headline; location; region; degree };
  cvScore: { target; improvements[] };   // level-agnostic suggested deltas
  cvReview: { headline; strengths[]; issues[] };
  scoreFactors: { label; detail; strength }[];   // why the score is what it is
  levelGaps: Record<Level, { experience?; other?[] }>; // what blocks the NEXT level
  journey: { percent; certsDone; certsTotal; messagesSent; replies };
  connections: Contact[];   // [] here; loaded client-side from the customer's CSV
  hrContacts: Contact[];    // [] here; filled by the page from hr-db.ts
  paths: CareerPath[];      // the career paths (capped by TIER_PATHS)
  primaryPath: CareerPath;
  templates: Template[];    // outreach message templates
  tracker: ...;             // activity feed
};
```

A `CareerPath` carries `scoreByLevel: Record<Level, number>` (CV competitiveness 0 to
100 per seniority), `certs: Cert[]`, `targetCompanies: string[]` (used to rank the
customer's network), `gradFields` (which graduate majors show in Study), `roles`,
`targets`, `months`, and one `primary?: true`.

Bilingual text everywhere uses `LS = { ar: string; en: string }`.

The registry and lookup:

```ts
export const plans: Record<string, CustomerPlan> = { [aliPlan.slug]: aliPlan };
export function getPlan(slug: string) { return plans[slug]; }
```

The route calls `getPlan(slug)`, 404s if missing, wraps in `withHr(plan)` to fill HR,
then renders `<PlanProvider plan={...}><V4 /></PlanProvider>`.

---

## 5. How to add a new customer (recipe)

> Reality check first. Today `aliPlan` reuses module level singletons (`profile`,
> `cvScore`, `paths`, `primaryPath`, `templates`, `tracker`). So the repo currently
> holds one customer's content at module scope. Before a real second customer, do the
> one time refactor: move `profile`, `cvScore`, `paths`, `cvReview`, `scoreFactors`,
> `levelGaps` into a per customer module (for example `src/lib/customers/<slug>.ts`)
> and have `plans` import each. The steps below assume that per customer shape.

1. Read the CV. Extract `profile`: `name`, `headline`, `location`, `region`
   (`eastern | central | western | other`), `degree` (`diploma | bachelor | master | phd`).
2. Choose `tier` (`starter` or `pro`) and `sectors` (a subset of the `SECTOR_LABELS`
   keys that match their field; this drives both HR pulls and the company directory).
3. Write `cvReview`: a `headline`, real `strengths[]`, and `issues[]` that are CV
   grounded and CV editable only. Each issue has `id`, `kind`, `text` (LS), `severity`.
4. Write `scoreFactors[]` (Education, Experience, Field fit, ... each with a `strength`
   of `strong | good | growing`) and `levelGaps` (what experience gap blocks each next
   level; certificate gaps are derived from the path, do not put them here).
5. Build `paths[]`. Cap the count at `TIER_PATHS[tier]` (3 for Starter, 5 for Pro). For
   each path set `scoreInput` via `...withScore({...})` (the five CV-grounded rubric
   inputs; it derives `scoreByLevel`, see section 6), `certs[]`, `targetCompanies[]` (real
   names, used to rank their network), `gradFields`, `roles`, `targets`, `months`. Mark
   one `primary: true` and set `primaryPath` to it.
6. Assemble the `CustomerPlan`. Set `connections: []` and `hrContacts: []` (both filled
   later, see section 7). Reuse `templates`, `tracker`, `journey` or customize them.
7. Register it: add the plan to `plans` keyed by its `slug`.
8. Verify: `npm run typecheck`, `npm run build`, link check, and a rendered preview in
   both languages and themes (section 10). Then the two agent gate.
9. Deploy and send them `/<locale>/c/<slug>`.

---

## 5b. The authoring playbook (reason per CV, do not fill a template)

The recipe above is where data goes. This is how to think, so each plan is reasoned for
the person and not a template with the names swapped. Work in this order.

1. Extract the atomic facts from the CV, nothing invented: degree and university, every
   employer with tenure, hard skills and tools, each quantified result (the numbers),
   location, languages, current level. These are the only raw material.
2. Choose the paths from the person's real trajectory and leverage points, not a fixed
   five. Ask what doors their actual experience opens, what an adjacent pivot is, what a
   stretch is. The count fits them (cap at TIER_PATHS). Do not pad to five with generic
   tracks.
3. Set the rubric inputs per path (section 6), each tied to a specific CV line, plus the
   real employer and university names so the caliber tables apply. The rubric derives the
   scores; never type an output number.
4. Build the cert ladder from the person's GAPS only. Start from what they already have
   (mark it done or current), then the cheapest high-impact missing step, then up. Do not
   repeat the same four certs on every path; each cert earns its place for this person and
   this path.
5. Pull Study and companies from the research base (research/ and the data module),
   filtered to their field and constraints: location for proximity, budget, and whether
   they are employed (then favor part-time and online). Do not hand-pick the same few.
6. Write the CV review and outreach in their voice: strengths and CV-editable issues each
   tied to a line, templates that name their real field and employer.
7. Anti template checklist before the gate. Every claim points to a CV line. Nothing is
   generic enough to describe another candidate in the field. No invented cost, link, or
   eligibility. The score follows the rubric. Then run the strict two agent gate (section 1).

The test of a good plan: paste it beside another customer's in the same field. If the
paths, certs, and wording are interchangeable, it is still a template. Make it specific.

---

## 6. The scoring model

The score is DERIVED from a rubric (src/lib/scoring.ts), not hand-picked, so it is
consistent across customers and explainable.

- Each path carries `scoreInput`: five CV-grounded inputs (education, experience, skills,
  impact, trajectory) plus the `employer` and `university` names. `withScore()` turns
  these into `scoreByLevel: { entry, mid, senior, director }` via `computeScoreByLevel()`.
- Company names matter: `EMPLOYER_CALIBER` lifts the experience input for a recognized
  employer, and `UNI_RANK` lifts education for a ranked university (lowercase substring
  lookup). So "Baker Hughes" or "Cornell" raise the score, and the rationale names them.
- The model: a quality base `B` (weighted education, experience, skills, impact) is
  blended per level with the seniority signal `trajectory`. Entry leans on quality and
  sits high; director leans on trajectory and sits low until years and leadership grow.
  This is why one strong junior is rightly entry ready and far from director, with no
  number typed by hand.
- `scoreNote(input, level, locale)` returns the one line "why" shown under the score
  (top two drivers plus the level read), so the number is transparent to the customer.
- `scoreFactors[]` and `levelGaps[level]` still give the human readable breakdown and the
  blockers to the next level.
- Certificates add on top by seniority via
  `scaledAdd(baseDelta, level) = max(1, round(baseDelta * LEVEL_DELTA_WEIGHT[level]))`,
  weights `entry 1, mid 0.85, senior 0.7, director 0.55`. `Cert.scoreAdd` is the base delta.

To recalibrate a customer, adjust their `scoreInput` (grounded in the CV), not the output
numbers. The constants in scoring.ts (weights, level coefficients, caliber tables) tune
the model for everyone at once.

---

## 7. Contacts: connections vs HR

Two different things, both capped at `TIER_CAP[tier]` (150 for Starter, 300 for Pro).

- Connections are the customer's OWN LinkedIn network. There is no seeded list. On the
  Contacts tab the customer uploads their `Connections.csv`; `parseUploadedConnections()`
  parses it in the browser, it is held in session storage by the network provider in
  `dashboard-state.tsx`, and never sent to a server. `rankConnections(contacts, targets)`
  ranks them against `planTargets(plan)` (the `targetCompanies` across their paths) to
  surface the warm intros under each path.
- HR contacts are RETRIEVED from our real database. `hr-db.ts` is server only (it reads
  the filesystem; never import it from a client component). `withHr(plan)` fills
  `plan.hrContacts = getHrContacts(plan.sectors, TIER_CAP[plan.tier])`.
  `getHrContacts` round robins across the customer's sectors so the capped list stays
  diverse, and within each sector orders responders first
  (`mid_market < sme < large < agency < giant`, giants last as aspiration).

Sanity pass: HR rows match the sectors, no duplicates, the ranking looks sensible, and
no raw PII leaks into anything the customer sees beyond what the product intends.

---

## 8. The Pro pages (Study and Opportunities) data

The v4 nav (in `v4.tsx`) is: `home`, `paths`, `contacts` (free), then `tracker` and
`opportunities` (both `pro: true`). For a Starter plan those two render a `ProUpsell`
instead of the page. The `tracker` tab renders the Study page; `opportunities` renders
the Opportunities page. (Their display labels are the two tab names still to be set.)

Study data (per field, in `app-data.ts`): `gradPrograms` (four universities per field,
tiered `high | respected | solid | accessible`, with `top30?` flagging Pioneers
scholarship eligibility), `fieldMajors`, `partTimeSaudi` (in country executive options
with `region` for proximity), `saudiUniStrength`. Degree aware: the next degree is
derived from `profile.degree` (diploma to bachelor to master to phd) and prefixes the
majors.

Opportunities data: `companyPortals` (around 60 employers, each with `industry` and
`size`) grouped by `companyIndustries`, each industry mapped to a `sector` so the
directory is filtered to the customer's `plan.sectors`. Plus `skills` (general, all
linking to Coursera), `careerDays` (dated events), `nationalPortals`, `tamheer`.

---

## 9. Bilingual and RTL

- Arabic first. Routes are under `/[locale]`; `/` redirects to `/ar`. Locales are `ar`
  and `en`, configured in `src/i18n/routing.ts`. Arabic renders RTL.
- Every user facing string is `LS = { ar, en }`. Render with `tr(value, locale)` or by
  indexing `value[locale]`. Never ship a one language string.
- Always verify both languages and both themes (light and dark) before delivery.

---

## 10. Build, verify, deploy

```bash
npm run typecheck      # tsc --noEmit
npm run build          # production build; must pass before deploy
```

Render verification (preview the production build and measure, do not eyeball only):
start a local production server, then check the customer page at desktop and phone
widths, in `ar` and `en`, light and dark. The footer one line fix is the reference for
why measuring beats eyeballing.

Deploy. The repo branch is `claude/product-dashboard`; pushing it deploys via Vercel
(framework pinned in `vercel.json`). Manual production deploy:

```powershell
& 'C:\Users\Ali-h\AppData\Roaming\npm\vercel.cmd' --prod --yes --token <YOUR_VERCEL_TOKEN>
```

Production alias: `massar-sigma.vercel.app`. Never commit a Vercel token; pass it on the
command line and revoke it when done. Never `--force` push or skip hooks.

After deploy, the customer link is `https://massar-sigma.vercel.app/<locale>/c/<slug>`.

---

## 11. The research knowledge base

A version controlled store at `research/` for every fact we research, so effort
compounds across customers instead of being redone. Full spec in
[research/README.md](research/README.md).

Reuse rule: before researching for a new customer, read the store first (filtered by
their field, sector, region, and degree), reuse what is there, and add what is missing.
It grows into the database and ports straight to Supabase later.

---

## 12. Worked example: Ali

`aliPlan` in `app-data.ts` is customer one.

- Profile: operations engineer, Cornell M.Eng Energy Economics, Eastern Province,
  degree `bachelor` (the master's is in progress, so the next degree is master).
- Tier: `pro`. Sectors: investment_finance, energy_petrochem, consulting, government,
  tech_startups, telecom_it, gigaprojects_realestate, recruitment_agencies.
- CV review: four CV editable issues only (reframe top bullets for finance, lead the
  summary as an energy economist, surface SQL and Power BI, replace "roughly two years"
  with a firm number). No "earn a certificate" item, because that is not a CV edit.
- Score factors: Education strong, Experience good, Field fit strong. The headline score
  is his primary path's `scoreByLevel` at the level he selects.
- Primary path: Energy Investment and Strategy (targets PIF, KAPSARC, energy funds).
- HR is pulled live from the database for his eight sectors, capped at 300; his
  connections come from his own uploaded CSV.
- Link: `massar-sigma.vercel.app/en/c/ali-alajwad` (and `/ar/`).

---

## 13. Not yet built

- CV to JSON generator: dropped on cost, so onboarding is manual today.
- The one time per customer refactor (section 5) to split the module level singletons
  into per customer modules. Required before a real second customer.
- Supabase persistence. After it, plan authoring reads from the research store and the
  customer registry instead of hard coded objects.
- The research store currently seeds career days; universities and companies still live
  in `app-data.ts` and migrate during the refactor.
- Two tab names for the Study and Opportunities Pro pages.
