# Production pipeline

How we build and deliver one customer's plan, from the moment they send their CV to
the moment their link goes out. This is the source of truth for the process. The two
validation agents check the work against this document.

## Hard rules (never break)

- Never store or commit the customer's CV. Read it, use it, do not save it.
- Never rewrite the customer's CV for them. Feedback and review are fine. The CV is
  theirs and tied to their future, so we do not take responsibility for rewriting it.
- Never expose HR personal data. The admin database holds real people's details, is
  Basic Auth gated, and a customer view only ever shows what their tier allows.
- Ground everything. Every item in the plan must trace to the CV or to a sourced
  research record. Nothing invented.
- House style: almost never use dashes in any copy, including the product UI.

## Steps

1. Read the CV: profile, current degree, field, strengths, gaps, target sectors.
2. Score the CV per level for each path (entry, mid, senior, director).
3. Author the typed CustomerPlan. The grounding rule applies to every item.
4. Pull the data: HR contacts from the database by sector and tier, connections from
   the customer's LinkedIn CSV. Then a data sanity pass: sectors match, no duplicates,
   the ranking produced sensible top picks, and no private HR data shows in the view.
5. Tier and config check: number of pathways, connection and HR caps, and Pro page
   gating all match the customer's tier (see Tiers below).
6. Source and fact check: every concrete claim (deadlines, scholarship names,
   university tier, salary numbers) is checked against a real source or softened.
   Every verified fact is written to the research store.
7. Link health check: every URL in the plan loads and points to the right page.
8. Render verification: typecheck, production build, and a measured preview at desktop
   and phone, in Arabic and English, light and dark.
9. Two agent validation gate (see below).
10. Preview link first: publish to a private preview URL, click through every tab in
    both languages, then promote to the customer's real link.
11. Version the customer record: save a dated snapshot so later check ins can re score
    against a baseline and every edit is tracked.
12. Deliver the link. The customer uploads their LinkedIn CSV (parsed in the browser)
    and works the plan.

## The two agent validation gate

- Both agents are given the customer's CV.
- Agent one checks it technically works: it builds and renders, links resolve, the data
  is correct, and the tier configuration is right.
- Agent two checks it makes sense for this specific person: grounded in their CV, the
  right field and level, nothing invented or off.
- Both must pass to deliver the link.
- If either fails, it comes back, we fix it, and we re run until both pass.

## The research knowledge base

A version controlled store at `research/` for every fact we research, so effort
compounds across customers instead of being redone. Full spec in
[research/README.md](research/README.md).

Reuse rule: before researching anything for a new customer, read the store first,
filtered by their field, sector, region, and degree. Reuse fresh matches, research only
the gaps, and write new or updated facts back. It grows into the database and ports
straight to Supabase later.

## Tiers

- Starter: 3 pathways, 150 connections and 150 HR contacts, no Pro pages.
- Pro: 5 pathways, 300 connections and 300 HR contacts, plus the Pro pages (Study and
  Resources).

## Effort

- Automatable now: link health check, render verification, build and deploy.
- Light once set up: grounding, data sanity, tier and config check, preview first,
  version record.
- Real founder effort per customer: the fact check and the per CV research.

## Not yet built

- CV to JSON generator: dropped on cost, so onboarding is manual today.
- Supabase persistence and the one time per customer refactor: deferred. After it,
  plan authoring reads from the research store first.
- The research store currently seeds career days; universities and companies still
  live in `src/lib/app-data.ts` and migrate during the refactor.
