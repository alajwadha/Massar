-- Masaar — initial schema (Phase 1)
-- Postgres / Supabase. See docs/DATA_MODEL.md for the narrative version.

create type plan as enum ('starter', 'pro');
create type goal_type as enum ('new_job', 'promotion');
create type outreach_status as enum ('drafted', 'sent', 'replied', 'no_reply');

-- profiles mirror auth.users (id = auth uid)
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  locale text not null default 'ar' check (locale in ('ar', 'en')),
  plan plan,
  referral_code text unique,
  referred_by uuid references profiles (id),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  storage_path text,
  extracted_text text,
  parsed jsonb,
  created_at timestamptz not null default now()
);

create table intake (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  target_companies text[] default '{}',
  desired_salary_min int,
  desired_salary_max int,
  goal goal_type not null default 'new_job',
  target_role_title text,
  notes text,
  created_at timestamptz not null default now()
);

-- shared catalog: employer prestige weighting
create table employers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  aliases text[] default '{}',
  sector text,
  prestige_tier int not null check (prestige_tier between 1 and 5),
  weight numeric not null default 1.0
);

-- shared catalog: certifications (+ Hadaf reimbursement)
create table certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text,
  cost_sar numeric,
  hadaf_reimbursable boolean not null default false,
  hadaf_percent numeric,
  domain text,
  typical_weeks int
);

create table career_paths (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  company text,
  fit_summary text,
  rank int not null default 0,
  plan_required plan not null default 'starter',
  created_at timestamptz not null default now()
);

create table path_certifications (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references career_paths (id) on delete cascade,
  certification_id uuid not null references certifications (id),
  "order" int not null default 0,
  rationale text
);

create table scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  cv_id uuid references cvs (id) on delete set null,
  path_id uuid references career_paths (id) on delete set null,
  role_title text not null,
  overall int not null check (overall between 0 and 100),
  s_education int check (s_education between 0 and 100),
  s_experience int check (s_experience between 0 and 100),
  s_employer_prestige int check (s_employer_prestige between 0 and 100),
  s_skills int check (s_skills between 0 and 100),
  s_writing_quality int check (s_writing_quality between 0 and 100),
  improvements jsonb default '[]',
  rubric_version text not null default 'v0',
  published boolean not null default false,
  reviewed_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- "Good Targets": decision-makers from the customer's own connections export
create table targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  full_name text not null,
  title text,
  company text,
  is_connection boolean not null default false,
  relevance int check (relevance between 0 and 100),
  reason text,
  linkedin_url text,
  created_at timestamptz not null default now()
);

-- HR: shared proprietary recruiter database (admin-write, paid-read)
create table hr_contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text,
  company text,
  sector text,
  linkedin_url text,
  email text,
  verified_at timestamptz,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table outreach (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  target_id uuid references targets (id) on delete cascade,
  hr_contact_id uuid references hr_contacts (id) on delete set null,
  channel text not null default 'linkedin' check (channel in ('linkedin', 'email')),
  message text,
  status outreach_status not null default 'drafted',
  sent_at timestamptz,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  moyasar_id text unique,
  amount_sar numeric,
  plan plan,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Row-Level Security ----------------------------------------------------------
alter table profiles enable row level security;
alter table cvs enable row level security;
alter table intake enable row level security;
alter table career_paths enable row level security;
alter table path_certifications enable row level security;
alter table scores enable row level security;
alter table targets enable row level security;
alter table outreach enable row level security;
alter table payments enable row level security;
alter table employers enable row level security;
alter table certifications enable row level security;
alter table hr_contacts enable row level security;

-- helper: is the current user an admin?
create or replace function is_admin() returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false);
$$ language sql security definer stable;

-- owner-only tables
create policy "own profile" on profiles
  for all using (id = auth.uid() or is_admin()) with check (id = auth.uid() or is_admin());

create policy "own cvs" on cvs
  for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid());
create policy "own intake" on intake
  for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid());
create policy "own paths" on career_paths
  for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid());
create policy "own scores" on scores
  for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid() or is_admin());
create policy "own targets" on targets
  for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid());
create policy "own outreach" on outreach
  for all using (user_id = auth.uid() or is_admin()) with check (user_id = auth.uid());
create policy "own payments" on payments
  for select using (user_id = auth.uid() or is_admin());
create policy "own path_certs" on path_certifications
  for all using (
    exists (select 1 from career_paths p where p.id = path_id and (p.user_id = auth.uid() or is_admin()))
  );

-- shared catalogs: public read, admin write
create policy "read employers" on employers for select using (true);
create policy "admin write employers" on employers for all using (is_admin()) with check (is_admin());
create policy "read certifications" on certifications for select using (true);
create policy "admin write certifications" on certifications for all using (is_admin()) with check (is_admin());

-- HR contacts: authenticated read, admin write
create policy "auth read hr" on hr_contacts for select using (auth.role() = 'authenticated');
create policy "admin write hr" on hr_contacts for all using (is_admin()) with check (is_admin());

-- Auto-create a profile row on signup
create or replace function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
