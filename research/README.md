# Research knowledge base

One shared, version controlled store for every fact we research while building a
customer's plan, so research compounds across customers instead of being redone.
This is the lightweight start of the database. Each collection here maps to a
Supabase table later with no reshaping.

## The reuse rule (this is the point: do not waste effort)

When building a new customer's plan:

1. Read this store first, filtered by their field, sector, region, and degree.
2. Reuse any record that still matches and is fresh (verifiedOn within the last 6 months).
3. Research only the gaps, or refresh stale records.
4. Write every new or updated fact back here, with a source and a date.

Effort per customer drops as the store grows.

## Collections (one JSON file each, an array of records)

- `career-days.json`: career days, forums, and fairs, with dates.
- `universities.json`: graduate programs by field, with tier, deadlines, and scholarship eligibility.
- `companies.json`: employers by sector and size, with the official careers URL.
- `scholarships.json`: scholarship programs and eligibility.
- `salary-benchmarks.json`: pay ranges by role, level, and sector.
- `link-checks.json`: the result of the last link health check per URL.

## Shared fields on every record

- `id`: stable slug.
- `source`: the URL or place the fact was verified against (null if not yet verified).
- `status`: "verified" | "approximate" | "unverified".
- `verifiedOn`: ISO date of the last verification (null if never).
- `addedOn`: ISO date the record was first added.

Bilingual text uses `{ "en": "...", "ar": "..." }`. Collection specific fields are
documented inside each record by example.

## Keys used to match a customer

- `field`: energy, finance, consulting, government, tech.
- `sector`: the HR database sectors (investment_finance, energy_petrochem, ...).
- `region`: eastern, central, western, other.
- `degree`: diploma, bachelor, master, phd.

## Status

`career-days.json` is seeded from the first build with status "approximate", to be
confirmed during the fact check step. The other collections start empty and fill up
as we research real customers. The universities and companies currently live in
`src/lib/app-data.ts`; they move here during the one time per customer refactor, after
which plan authoring reads from this store first.

## Porting to Supabase

Each JSON file becomes a table of the same name, each record becomes a row, and the
shared fields plus the match keys become columns.
