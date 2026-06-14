-- Masaar — enforce one row per LinkedIn profile so imports upsert cleanly
-- (scripts/import-hr.mjs uses on_conflict=linkedin_url). NULLs stay distinct,
-- so contacts without a URL are still allowed.
create unique index if not exists hr_contacts_linkedin_url_key
  on hr_contacts (linkedin_url);
