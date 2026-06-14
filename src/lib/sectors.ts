// The 16-sector taxonomy for the HR database (mirrors supabase/migrations
// 0002 + 0005 and docs/SECTORS.md). Kept here so the dashboard can compute
// progress without a database connection.

export type SectorSlug =
  | 'investment_finance'
  | 'consulting'
  | 'energy_petrochem'
  | 'gigaprojects_realestate'
  | 'government'
  | 'recruitment_agencies'
  | 'telecom_it'
  | 'tech_startups'
  | 'healthcare_pharma'
  | 'manufacturing_mining'
  | 'transport_logistics'
  | 'retail_fmcg'
  | 'education_training'
  | 'tourism_entertainment'
  | 'insurance'
  | 'aerospace_defense';

export type Sector = {
  slug: SectorSlug;
  name_ar: string;
  name_en: string;
  priority: 1 | 2 | 3;
  target: number;
};

export const SECTORS: Sector[] = [
  { slug: 'investment_finance', name_ar: 'الاستثمار والتمويل', name_en: 'Investment & Finance', priority: 1, target: 350 },
  { slug: 'consulting', name_ar: 'الاستشارات', name_en: 'Consulting', priority: 1, target: 280 },
  { slug: 'energy_petrochem', name_ar: 'الطاقة والبتروكيماويات', name_en: 'Energy & Petrochemicals', priority: 1, target: 280 },
  { slug: 'gigaprojects_realestate', name_ar: 'المشاريع الكبرى والعقار', name_en: 'Giga-projects & Real Estate', priority: 1, target: 350 },
  { slug: 'government', name_ar: 'الحكومة والقطاع العام', name_en: 'Government', priority: 1, target: 250 },
  { slug: 'recruitment_agencies', name_ar: 'مكاتب التوظيف والاستقدام', name_en: 'Recruitment & Staffing', priority: 1, target: 300 },
  { slug: 'telecom_it', name_ar: 'الاتصالات وتقنية المعلومات', name_en: 'Telecom & IT', priority: 2, target: 180 },
  { slug: 'tech_startups', name_ar: 'التقنية والشركات الناشئة', name_en: 'Tech & Startups', priority: 2, target: 250 },
  { slug: 'healthcare_pharma', name_ar: 'الصحة والأدوية', name_en: 'Healthcare & Pharma', priority: 2, target: 220 },
  { slug: 'manufacturing_mining', name_ar: 'الصناعة والتعدين', name_en: 'Manufacturing & Mining', priority: 2, target: 190 },
  { slug: 'transport_logistics', name_ar: 'النقل واللوجستيات', name_en: 'Transport & Logistics', priority: 2, target: 190 },
  { slug: 'retail_fmcg', name_ar: 'التجزئة والسلع الاستهلاكية', name_en: 'Retail & FMCG', priority: 3, target: 170 },
  { slug: 'education_training', name_ar: 'التعليم والتدريب', name_en: 'Education & Training', priority: 3, target: 160 },
  { slug: 'tourism_entertainment', name_ar: 'السياحة والترفيه', name_en: 'Tourism & Hospitality', priority: 3, target: 150 },
  { slug: 'insurance', name_ar: 'التأمين', name_en: 'Insurance', priority: 3, target: 100 },
  { slug: 'aerospace_defense', name_ar: 'الطيران والدفاع', name_en: 'Aerospace & Defense', priority: 3, target: 80 },
];

export const TOTAL_TARGET = SECTORS.reduce((s, x) => s + x.target, 0); // 3500

export const SECTOR_BY_SLUG: Record<string, Sector> = Object.fromEntries(
  SECTORS.map((s) => [s.slug, s]),
);

export type Tier = 'giant' | 'large' | 'mid_market' | 'sme' | 'agency';

export const TIER_LABELS: Record<Tier, { ar: string; en: string }> = {
  giant: { ar: 'عملاقة', en: 'Giant' },
  large: { ar: 'كبيرة', en: 'Large' },
  mid_market: { ar: 'متوسطة', en: 'Mid-market' },
  sme: { ar: 'صغيرة', en: 'SME' },
  agency: { ar: 'مكتب توظيف', en: 'Agency' },
};
