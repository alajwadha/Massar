# Masaar — Data Model

Postgres (Supabase). All user‑owned tables are protected by Row‑Level Security
(RLS) so a user can only read/write their own rows; `hr_contacts` and
`employers` and `certifications` are shared read‑only catalogs maintained by
admin.

## Enums
- `plan`: `starter | pro`
- `goal_type`: `new_job | promotion`
- `outreach_status`: `drafted | sent | replied | no_reply`
- `score_band`: derived in app, not stored.

## Tables

### profiles
Mirrors `auth.users`. `id` (uuid, PK, = auth uid), `full_name`, `locale`
(`ar|en`), `plan`, `referral_code`, `referred_by`, `created_at`.

### cvs
`id`, `user_id` → profiles, `storage_path`, `extracted_text`, `parsed` (jsonb:
education[], experience[], skills[], certs[]), `created_at`.

### intake
`id`, `user_id`, `target_companies` (text[]), `desired_salary_min/max`,
`goal` (goal_type), `target_role_title`, `notes`, `created_at`.

### employers  (shared catalog)
`id`, `name`, `aliases` (text[]), `sector`, `prestige_tier` (1=top e.g. PIF,
McKinsey, ministries … 5=unknown), `weight` (numeric). Drives the
employer‑prestige component of the score.

### certifications  (shared catalog)
`id`, `name`, `provider`, `cost_sar`, `hadaf_reimbursable` (bool),
`hadaf_percent` (numeric), `domain` (e.g. finance, pm, data), `typical_weeks`.

### career_paths
`id`, `user_id`, `title`, `company`, `fit_summary`, `rank`, `plan_required`
(starter|pro), `created_at`.

### path_certifications  (ordered roadmap)
`id`, `path_id` → career_paths, `certification_id` → certifications, `order`,
`rationale`.

### scores
A score is for a (cv × role). `id`, `user_id`, `cv_id`, `path_id` (nullable for
ad‑hoc role), `role_title`, `overall` (0–100),
sub‑scores: `s_education`, `s_experience`, `s_employer_prestige`, `s_skills`,
`s_writing_quality`, `improvements` (jsonb array of
`{action, delta, effort, category}`), `rubric_version`, `published` (bool),
`reviewed_by` (admin uid, human‑in‑the‑loop), `created_at`.

> Conservative by design. `improvements` powers "60 → 75 with CFA L1".

### targets  ("Good Targets")
Decision‑makers from the customer's own connections export. `id`, `user_id`,
`full_name`, `title`, `company`, `is_connection` (bool — already connected vs
needs request), `relevance` (0–100), `reason`, `linkedin_url`, `created_at`.

### hr_contacts  (shared proprietary DB)
`id`, `full_name`, `title`, `company`, `sector`, `linkedin_url`, `email`
(business only), `verified_at`, `source`, `is_active`. Read‑shared; admin‑write.
PDPL: business‑contact basis, deletion on request, keep `verified_at` fresh.

### outreach  (tracker)
`id`, `user_id`, `target_id` (nullable), `hr_contact_id` (nullable),
`channel` (linkedin|email), `message` (text, drafted in customer's voice),
`status` (outreach_status), `sent_at`, `replied_at`, `created_at`.

### payments
`id`, `user_id`, `moyasar_id`, `amount_sar`, `plan`, `status`, `created_at`.

## RLS summary
- `profiles, cvs, intake, career_paths, path_certifications, scores, targets,
  outreach, payments`: owner‑only (`user_id = auth.uid()`), plus admin override.
- `employers, certifications`: public read, admin write.
- `hr_contacts`: authenticated read (paid users), admin write.
