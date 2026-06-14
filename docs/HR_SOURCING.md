# Masaar — How to source the HR contacts (names + LinkedIn URLs)

The shared HR database needs **~3,500 real people**: `full_name` + working
`linkedin_url`, tagged with `sector` and `company_tier`. This document is the
honest, working method — and the unified format every contact must follow.

## Why we do NOT generate URLs with AI agents
- **LinkedIn blocks automated access.** You cannot programmatically open a
  profile to confirm a URL is live (it returns 999/403 to bots). So "verified
  working links" cannot be produced by a crawler/agent.
- **LLMs hallucinate profile URLs.** An agent asked to "find LinkedIn URLs" will
  emit plausible-looking links (`/in/firstname-lastname-1234`) that resolve to
  the wrong person or nobody. That poisons the database with fake PII.
- **Bad data destroys the product.** The HR list's only value is accuracy. Fake
  or stale contacts break trust and breach PDPL + LinkedIn ToS.

## Where the data actually comes from (pick one)
| Source | What you get | Notes |
|---|---|---|
| **Apollo.io** | Name, title, company, LinkedIn URL; CSV/API export | Free tier to start; good Saudi coverage of mid-market/SME |
| **Lusha / RocketReach / Cognism** | Same, paid | Higher accuracy, costs scale with volume |
| **LinkedIn Sales Navigator** | Search by title + company; manual capture | The official route; respect export limits |
| **Proxycurl API** | Structured LinkedIn profile data | Per-credit pricing; good for enrichment |

Recommended: **Apollo export for breadth (mid-market/SME), Sales Navigator for
the priority giants/agencies.** Export to the unified CSV below, then run the
validator + importer.

## The unified format (`data/hr_contacts.template.csv`)
One row per person. Columns, in order:

```
full_name,linkedin_url,title,company,sector,company_tier,source
```

- `full_name` — required.
- `linkedin_url` — required; any LinkedIn form is accepted and **normalized** to
  the canonical `https://www.linkedin.com/in/<id>/` by the validator.
- `sector` — one of the 16 slugs (see docs/SECTORS.md).
- `company_tier` — one of `giant | large | mid_market | sme | agency`.
- `source` — where it came from (e.g. `apollo`, `sales_navigator`), for audit.

## Workflow
```bash
# 1) Drop your exported rows into data/hr_contacts.csv (unified columns above)
# 2) Normalize + validate (dedupes, canonicalizes URLs, flags bad rows)
npm run hr:validate            # writes data/hr_contacts.clean.csv + a report
# 3) Load the clean file into Supabase (needs SUPABASE env vars)
npm run hr:import
```

The validator canonicalizes URLs (forces `https`, `www.linkedin.com`, strips
country subdomains like `sa.`, removes query/tracking params, enforces the
`/in/<id>/` shape) and rejects anything that isn't a real profile path — so what
lands in the DB is in **one consistent, working format**.

## PDPL guardrails
- **Business contact data only** — name, role, company, public LinkedIn URL. No
  personal emails/phones.
- Keep `verified_at` fresh; a contact who left the role is a liability.
- Honor deletion requests; record `source` for every row.

## Want a small real pilot?
I can run a limited best-effort web search to collect a handful of genuinely
public HR profiles to prove the pipeline end-to-end — clearly marked
`source=web_search_unverified` and never auto-trusted. Say the word and I'll do a
small batch (not thousands — that needs a real data source as above).
