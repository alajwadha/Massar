-- Masaar — scale the HR database goal to ~3,500 individual people.
-- Redistributed across the 16 sectors, keeping priority weighting and the
-- skew toward mid-market / SME / agencies (the responders).

update sectors set target_hr = 350 where slug = 'investment_finance';
update sectors set target_hr = 280 where slug = 'consulting';
update sectors set target_hr = 280 where slug = 'energy_petrochem';
update sectors set target_hr = 350 where slug = 'gigaprojects_realestate';
update sectors set target_hr = 250 where slug = 'government';
update sectors set target_hr = 300 where slug = 'recruitment_agencies';

update sectors set target_hr = 180 where slug = 'telecom_it';
update sectors set target_hr = 250 where slug = 'tech_startups';
update sectors set target_hr = 220 where slug = 'healthcare_pharma';
update sectors set target_hr = 190 where slug = 'manufacturing_mining';
update sectors set target_hr = 190 where slug = 'transport_logistics';

update sectors set target_hr = 170 where slug = 'retail_fmcg';
update sectors set target_hr = 160 where slug = 'education_training';
update sectors set target_hr = 150 where slug = 'tourism_entertainment';
update sectors set target_hr = 100 where slug = 'insurance';
update sectors set target_hr = 80  where slug = 'aerospace_defense';

-- Sum: P1 1810 + P2 1030 + P3 660 = 3500 individual HR contacts.
