-- Masaar — scale the HR database goal to ~2,550 individual people.
-- Targets redistributed across the 16 sectors, keeping priority weighting and
-- the skew toward mid-market / SME / agencies (the responders).

update sectors set target_hr = 250 where slug = 'investment_finance';
update sectors set target_hr = 200 where slug = 'consulting';
update sectors set target_hr = 200 where slug = 'energy_petrochem';
update sectors set target_hr = 250 where slug = 'gigaprojects_realestate';
update sectors set target_hr = 180 where slug = 'government';
update sectors set target_hr = 220 where slug = 'recruitment_agencies';

update sectors set target_hr = 130 where slug = 'telecom_it';
update sectors set target_hr = 180 where slug = 'tech_startups';
update sectors set target_hr = 160 where slug = 'healthcare_pharma';
update sectors set target_hr = 140 where slug = 'manufacturing_mining';
update sectors set target_hr = 140 where slug = 'transport_logistics';

update sectors set target_hr = 120 where slug = 'retail_fmcg';
update sectors set target_hr = 120 where slug = 'education_training';
update sectors set target_hr = 110 where slug = 'tourism_entertainment';
update sectors set target_hr = 80  where slug = 'insurance';
update sectors set target_hr = 70  where slug = 'aerospace_defense';

-- Sum: P1 1300 + P2 750 + P3 500 = 2550 individual HR contacts.
