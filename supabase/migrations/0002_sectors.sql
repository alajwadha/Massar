-- Masaar — sector taxonomy for the HR database (see docs/SECTORS.md)
-- A fixed reference list of 15 sectors. hr_contacts.sector / employers.sector
-- store the slug. Includes a research-target column and a progress view.

create table sectors (
  slug text primary key,
  name_ar text not null,
  name_en text not null,
  priority int not null default 2 check (priority between 1 and 3),
  target_hr int not null default 30,
  top_companies text[] default '{}',
  sort_order int not null default 0
);

alter table sectors enable row level security;
create policy "read sectors" on sectors for select using (true);
create policy "admin write sectors" on sectors for all using (is_admin()) with check (is_admin());

insert into sectors (slug, name_ar, name_en, priority, target_hr, sort_order, top_companies) values
  ('investment_finance', 'الاستثمار والتمويل', 'Investment & Finance', 1, 45, 1,
    '{PIF,"Saudi National Bank","Al Rajhi Bank",Tadawul,SAB,"Riyad Bank"}'),
  ('consulting', 'الاستشارات والخدمات المهنية', 'Consulting & Professional Services', 1, 45, 2,
    '{McKinsey,BCG,Bain,Deloitte,PwC,EY,KPMG,"Strategy&"}'),
  ('energy_petrochem', 'الطاقة والبتروكيماويات', 'Energy & Petrochemicals', 1, 45, 3,
    '{"Saudi Aramco",SABIC,"ACWA Power",Luberef}'),
  ('gigaprojects_realestate', 'المشاريع الكبرى والعقار والإنشاء', 'Giga-projects, Real Estate & Construction', 1, 45, 4,
    '{NEOM,Roshn,"Red Sea Global",Qiddiya,Diriyah,Bechtel}'),
  ('government', 'الحكومة والقطاع العام', 'Government & Public Sector', 1, 40, 5,
    '{Ministries,RCU,GEA,SDAIA,MISA,"Monsha''at"}'),
  ('telecom_it', 'الاتصالات وتقنية المعلومات', 'Telecom & IT', 2, 30, 6,
    '{stc,Mobily,Zain,Tonomus,AWS,Microsoft,Google}'),
  ('tech_startups', 'التقنية والشركات الناشئة', 'Tech & Startups', 2, 30, 7,
    '{Tamara,Jahez,Salla,"STV portfolio",Tabby}'),
  ('healthcare_pharma', 'الصحة والأدوية', 'Healthcare & Pharma', 2, 30, 8,
    '{MOH,KFSHRC,"Seha Virtual Hospital",Nupco,Lifera}'),
  ('manufacturing_mining', 'الصناعة والتعدين', 'Manufacturing & Mining', 2, 30, 9,
    '{"Ma''aden",Alfanar,Tasnee}'),
  ('transport_logistics', 'النقل واللوجستيات', 'Transport & Logistics', 2, 30, 10,
    '{Saudia,"Riyadh Air",Bahri,SAR,Aramex}'),
  ('tourism_entertainment', 'السياحة والترفيه والضيافة', 'Tourism, Entertainment & Hospitality', 3, 20, 11,
    '{SEVEN,GEA,"Red Sea hotels","Boutique Group"}'),
  ('retail_fmcg', 'التجزئة والسلع الاستهلاكية', 'Retail & FMCG', 3, 20, 12,
    '{Cenomi,Almarai,Savola,Panda,Nestle}'),
  ('aerospace_defense', 'الطيران والدفاع', 'Aerospace & Defense', 3, 20, 13,
    '{SAMI,GAMI,Lockheed,Boeing}'),
  ('education_training', 'التعليم والتدريب', 'Education & Training', 3, 20, 14,
    '{KAUST,KFUPM,TVTC,Misk,Elm}'),
  ('insurance', 'التأمين', 'Insurance', 3, 15, 15,
    '{"Bupa Arabia",Tawuniya,Walaa,CHI}');

-- Research progress per sector: target vs. how many HR contacts exist so far.
create or replace view sector_progress as
  select
    s.slug,
    s.name_en,
    s.priority,
    s.target_hr,
    count(h.id) filter (where h.is_active) as current_hr,
    greatest(s.target_hr - count(h.id) filter (where h.is_active), 0) as remaining
  from sectors s
  left join hr_contacts h on h.sector = s.slug
  group by s.slug, s.name_en, s.priority, s.target_hr, s.sort_order
  order by s.sort_order;
