-- Masaar — add company-size dimension to the HR database (see docs/SECTORS.md)
-- Insight: prestige giants rarely reply; mid-market + SME + agencies are more
-- numerous and reply far more. The DB must skew toward smaller companies.

-- 1) Company tier dimension on every HR contact.
create type company_tier as enum ('giant', 'large', 'mid_market', 'sme', 'agency');
alter table hr_contacts add column company_tier company_tier;

-- 2) New cross-cutting sector: recruitment & staffing agencies (highest reply).
insert into sectors (slug, name_ar, name_en, priority, target_hr, sort_order, top_companies) values
  ('recruitment_agencies', 'مكاتب التوظيف والاستقدام', 'Recruitment & Staffing Agencies', 1, 80, 6,
    '{Maharah,SMASCO,Hays,ManpowerGroup,"Michael Page","Robert Half","Marc Ellis"}');

-- 3) Raise targets and weight toward responsive sectors (mid-market / SME heavy).
update sectors set target_hr = 90 where slug = 'investment_finance';
update sectors set target_hr = 80 where slug = 'consulting';
update sectors set target_hr = 80 where slug = 'energy_petrochem';
update sectors set target_hr = 90 where slug = 'gigaprojects_realestate';
update sectors set target_hr = 70 where slug = 'government';
update sectors set target_hr = 55 where slug = 'telecom_it';
update sectors set target_hr = 70 where slug = 'tech_startups';
update sectors set target_hr = 60 where slug = 'healthcare_pharma';
update sectors set target_hr = 55 where slug = 'manufacturing_mining';
update sectors set target_hr = 55 where slug = 'transport_logistics';
update sectors set target_hr = 45 where slug = 'retail_fmcg';
update sectors set target_hr = 45 where slug = 'education_training';
update sectors set target_hr = 40 where slug = 'tourism_entertainment';
update sectors set target_hr = 30 where slug = 'insurance';
update sectors set target_hr = 25 where slug = 'aerospace_defense';

-- keep sort order sensible after inserting agencies at position 6
update sectors set sort_order = 7  where slug = 'telecom_it';
update sectors set sort_order = 8  where slug = 'tech_startups';
update sectors set sort_order = 9  where slug = 'healthcare_pharma';
update sectors set sort_order = 10 where slug = 'manufacturing_mining';
update sectors set sort_order = 11 where slug = 'transport_logistics';
update sectors set sort_order = 12 where slug = 'retail_fmcg';
update sectors set sort_order = 13 where slug = 'education_training';
update sectors set sort_order = 14 where slug = 'tourism_entertainment';
update sectors set sort_order = 15 where slug = 'insurance';
update sectors set sort_order = 16 where slug = 'aerospace_defense';

-- 4) Tier-aware progress view: how many HR per sector AND per tier.
create or replace view hr_by_tier as
  select
    s.slug,
    s.name_en,
    s.priority,
    s.target_hr,
    coalesce(h.company_tier::text, 'unset') as tier,
    count(h.id) filter (where h.is_active) as contacts
  from sectors s
  left join hr_contacts h on h.sector = s.slug
  group by s.slug, s.name_en, s.priority, s.target_hr, s.sort_order, h.company_tier
  order by s.sort_order, tier;
