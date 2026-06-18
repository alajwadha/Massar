// Example #1: Ali Alajwad's personalised career plan, generated from his CV and
// scored against docs/SCORING.md (primary target: Energy Investment & Strategy).
// In production this object is generated per customer; contacts are RETRIEVED from
// the database (never invented). Arabic copy is native; numerals are Western.

export type Loc = 'ar' | 'en';
export type LS = { ar: string; en: string };

export function tr(s: LS, locale: Loc): string {
  return s[locale];
}

/* ----------------------------------------------------------------- profile -- */

// Saudi region, used to surface the nearest universities when the customer's
// location is known from their CV (optional: omit region if it is not on the CV).
export type SaudiRegion = 'eastern' | 'central' | 'western' | 'other';
// Highest completed degree; the Study tab targets the NEXT one up
// (diploma -> bachelor -> master -> phd).
export type Degree = 'diploma' | 'bachelor' | 'master' | 'phd';

export const profile = {
  name: { ar: 'علي الأجود', en: 'Ali Alajwad' } satisfies LS,
  headline: {
    ar: 'مهندس عمليات · ماجستير اقتصاديات الطاقة من كورنيل',
    en: 'Operations Engineer · M.Eng Energy Economics, Cornell',
  } satisfies LS,
  // From the CV: Ras Al-Khair plant, so the Eastern Province is home base.
  location: { ar: 'المنطقة الشرقية', en: 'Eastern Province' } satisfies LS,
  region: 'eastern' as SaudiRegion,
  // Completed BEng (Manchester); the master's is in progress, so next = master.
  degree: 'bachelor' as Degree,
};

// CV competitiveness for the primary target, plus the cheapest-first improvements
// (the "what raises it" from SCORING.md).
// The headline score now comes from the primary path's score at the selected
// level (see paths[].scoreByLevel); this object only carries the target + the
// level-agnostic improvements.
export const cvScore = {
  target: { ar: 'الاستثمار والاستراتيجية في الطاقة', en: 'Energy Investment & Strategy' } satisfies LS,
  improvements: [
    { action: { ar: 'أعد صياغة أبرز 3 إنجازات بصيغة مالية', en: 'Reframe your top 3 bullets for finance' }, delta: 6, effort: { ar: '30 دقيقة', en: '30 min' } },
    { action: { ar: 'أكمل شهادة FMVA للنمذجة المالية', en: 'Complete FMVA (financial modeling)' }, delta: 8, effort: { ar: '3 أشهر', en: '3 months' } },
    { action: { ar: 'أكمل CFA المستوى الأول', en: 'Complete CFA Level 1' }, delta: 15, effort: { ar: '6 أشهر', en: '6 months' } },
  ] as { action: LS; delta: number; effort: LS }[],
};

export const journey = {
  percent: 34,
  certsDone: 1,
  certsTotal: 5,
  messagesSent: 6,
  replies: 1,
};

/* ------------------------------------------------------------------- types -- */

export type AccentKey = 'brand' | 'sky' | 'violet' | 'amber' | 'rose';
export type IndustryKey = 'finance' | 'energy' | 'consulting' | 'government' | 'tech';

export type CompanyKey =
  | 'pif' | 'aramco' | 'acwa' | 'neom' | 'gov' | 'kapsarc' | 'swcc' | 'sabic'
  | 'mck' | 'bcg' | 'strat' | 'snb'
  | 'stc' | 'elm';

export type Cert = {
  name: LS;
  desc: LS;
  gain: LS;
  scoreAdd: number;
  official: string;
  status: 'done' | 'current' | 'future';
  cost: LS;
  duration: LS;
  hadaf?: boolean;
  hadafNote?: LS;
  why?: LS;
  opens?: LS[]; // positions this certificate unlocks (new roles or a promotion)
};

export type ContactStatus = 'new' | 'sent' | 'replied' | 'followup';
export type CompanyTier = 'giant' | 'large' | 'mid_market' | 'sme' | 'agency';

// CV competitiveness is scored against a target seniority. The same person is very
// competitive for Entry but not for Director (the gap is experience), so the score
// is shown per level and the customer picks which one they're aiming at.
export type Level = 'entry' | 'mid' | 'senior' | 'director';
export const LEVELS: { id: Level; label: LS }[] = [
  { id: 'entry', label: { ar: 'مبتدئ', en: 'Entry' } },
  { id: 'mid', label: { ar: 'متوسط', en: 'Mid' } },
  { id: 'senior', label: { ar: 'خبير', en: 'Senior' } },
  { id: 'director', label: { ar: 'قيادي', en: 'Director' } },
];

// A credential is most transformative early in a career: an entry candidate who
// earns a CFA jumps a lot. It matters progressively less at senior levels, where
// experience (not another certificate) becomes the real differentiator. So we
// scale one base delta DOWN as seniority rises, rather than hand-authoring a
// number per cert per level. Entry keeps the full boost.
export const LEVEL_DELTA_WEIGHT: Record<Level, number> = {
  entry: 1,
  mid: 0.85,
  senior: 0.7,
  director: 0.55,
};

export function scaledAdd(baseDelta: number, level: Level): number {
  return Math.max(1, Math.round(baseDelta * LEVEL_DELTA_WEIGHT[level]));
}

export type Contact = {
  id: string;
  name: LS;
  role: LS;
  company: LS;
  companyKey?: CompanyKey; // known brands only; real HR / uploaded contacts omit it
  sector?: string; // HR DB sector key (for the HR category filter)
  companyTier?: CompanyTier; // HR DB company-size tier
  industry?: IndustryKey;
  score?: number;
  status: ContactStatus;
  when: LS;
  linkedin?: string; // real profile URL (HR DB + uploaded connections); else we search
};

export const industries: { id: IndustryKey; label: LS }[] = [
  { id: 'finance', label: { ar: 'الاستثمار والتمويل', en: 'Investment & Finance' } },
  { id: 'energy', label: { ar: 'الطاقة', en: 'Energy' } },
  { id: 'consulting', label: { ar: 'الاستشارات', en: 'Consulting' } },
  { id: 'government', label: { ar: 'الحكومي والسياسات', en: 'Government & Policy' } },
  { id: 'tech', label: { ar: 'التقنية', en: 'Tech' } },
];

// HR database taxonomy (matches data/hr_contacts.clean.csv `sector` column).
export const SECTOR_LABELS: Record<string, LS> = {
  investment_finance: { ar: 'الاستثمار والتمويل', en: 'Investment & Finance' },
  energy_petrochem: { ar: 'الطاقة والبتروكيماويات', en: 'Energy & Petrochem' },
  consulting: { ar: 'الاستشارات', en: 'Consulting' },
  government: { ar: 'الجهات الحكومية', en: 'Government' },
  tech_startups: { ar: 'التقنية والشركات الناشئة', en: 'Tech & Startups' },
  telecom_it: { ar: 'الاتصالات وتقنية المعلومات', en: 'Telecom & IT' },
  recruitment_agencies: { ar: 'وكالات التوظيف', en: 'Recruitment Agencies' },
  retail_fmcg: { ar: 'التجزئة والسلع الاستهلاكية', en: 'Retail & FMCG' },
  gigaprojects_realestate: { ar: 'المشاريع الكبرى والعقار', en: 'Gigaprojects & Real Estate' },
  healthcare_pharma: { ar: 'الصحة والدواء', en: 'Healthcare & Pharma' },
  manufacturing_mining: { ar: 'التصنيع والتعدين', en: 'Manufacturing & Mining' },
  tourism_entertainment: { ar: 'السياحة والترفيه', en: 'Tourism & Entertainment' },
  education_training: { ar: 'التعليم والتدريب', en: 'Education & Training' },
  transport_logistics: { ar: 'النقل والخدمات اللوجستية', en: 'Transport & Logistics' },
  insurance: { ar: 'التأمين', en: 'Insurance' },
  aerospace_defense: { ar: 'الطيران والدفاع', en: 'Aerospace & Defense' },
};

export const TIER_LABELS: Record<CompanyTier, LS> = {
  giant: { ar: 'شركات عملاقة', en: 'Giant' },
  large: { ar: 'شركات كبيرة', en: 'Large' },
  mid_market: { ar: 'شركات متوسطة', en: 'Mid-market' },
  sme: { ar: 'منشآت صغيرة', en: 'SME' },
  agency: { ar: 'وكالات توظيف', en: 'Agency' },
};

// Number of HR contacts delivered per package tier.
// Per tier: connections shown AND HR contacts each capped at this (Starter 150 + 150,
// Pro 300 + 300). Pathways shown are capped by TIER_PATHS. Pro also unlocks the Pro pages.
export const TIER_CAP = { starter: 150, pro: 300 } as const;
export const TIER_PATHS = { starter: 3, pro: 5 } as const;
export type PlanTier = keyof typeof TIER_CAP;

/* ----------------------------------------------------- connections (targets) -- */
// Connections (the people to reach out to) come from the CUSTOMER'S OWN uploaded
// LinkedIn Connections.csv, parsed client-side and never stored. There is no seeded
// list. See parseUploadedConnections() and rankConnections() below, surfaced through
// src/components/app/network-context.tsx.

/* ----------------------------------------------------------- HR / recruiters -- */
// HR recruiters are RETRIEVED from the real database (data/hr_contacts.clean.csv,
// 1,209 rows), filtered to the customer's sectors and capped at their tier. The
// plan's hrContacts is filled per request by the page (server) via src/lib/hr-db.ts.

/* ------------------------------------------------------------------- paths -- */

export type PickKind = 'top' | 'mid' | 'common';

export type CareerPath = {
  id: string;
  name: LS;
  targets: LS;
  roles: LS; // the positions this path leads to (for a new job OR a promotion)
  accent: AccentKey;
  icon: 'finance' | 'energy' | 'consulting' | 'government' | 'tech';
  gradFields: ('finance' | 'energy' | 'consulting' | 'government' | 'tech')[]; // relevant graduate majors (Study tab)
  months: number;
  scoreByLevel: Record<Level, number>; // CV competitiveness 0-100 per seniority
  primary?: boolean;
  trail: LS;
  certs: Cert[];
  // Real company names this area targets; used to rank the customer's uploaded
  // network into the 5 warm intros shown under the path.
  targetCompanies: string[];
};

const CFA = 'https://www.cfainstitute.org/en/programs/cfa';

export const paths: CareerPath[] = [
  {
    id: 'energy-invest',
    name: { ar: 'الاستثمار والاستراتيجية في الطاقة', en: 'Energy Investment & Strategy' },
    targets: { ar: 'صندوق الاستثمارات العامة · كابسارك · صناديق الطاقة', en: 'PIF Energy Transition · KAPSARC · energy funds' },
    roles: { ar: 'محلل استثمار ← محلل أول ← مدير محفظة', en: 'Investment Analyst → Senior Analyst → Portfolio Manager' },
    accent: 'brand',
    icon: 'finance',
    gradFields: ['energy', 'finance', 'government'],
    months: 16,
    scoreByLevel: { entry: 96, mid: 80, senior: 58, director: 40 },
    primary: true,
    trail: { ar: 'تمويل المناخ → CME-1 → FMVA → CFA L1 → CFA L2', en: 'Climate Finance → CME-1 → FMVA → CFA L1 → CFA L2' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والتمويل المستدام وأسواق الكربون من مدرسة كابسارك للسياسة العامة. يربط خبرتك في الطاقة بلغة الاستثمار والـ ESG، وهي ميزة نادرة في سوق صناديق تحوّل الطاقة.', en: 'KAPSARC’s climate finance, sustainable finance, and carbon-markets program. It connects your energy background to the language of investment and ESG, a rare edge in the energy-transition fund market.' }, gain: { ar: 'يربط خبرتك في الطاقة بعالم الاستثمار المستدام', en: 'Bridges your energy background into sustainable investing' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'CME-1', en: 'CME-1' }, desc: { ar: 'الشهادة التأسيسية من المعهد المالي، وهي مطلب تنظيمي للعمل في الأسواق المالية السعودية. تغطّي أساسيات الأنظمة والمنتجات المالية وقواعد هيئة السوق المالية, خطوتك الأولى نحو دور استثماري معتمد.', en: 'The Financial Academy’s foundational license, a regulatory requirement to work in Saudi capital markets. It covers financial regulations, products, and CMA rules, your first step toward an accredited investment role.' }, gain: { ar: 'ترخيص للعمل في الأسواق المالية السعودية', en: 'License to work in Saudi capital markets' }, opens: [{ ar: 'محلل أسواق مالية', en: 'Capital Markets Analyst' }, { ar: 'محلل استثمار مبتدئ', en: 'Investment Analyst (entry)' }], scoreAdd: 6, official: 'https://fa.gov.sa', status: 'current', cost: { ar: '2,000 ر.س', en: '2,000 SAR' }, duration: { ar: '6 إلى 8 أسابيع', en: '6 to 8 weeks' }, hadaf: true, hadafNote: { ar: 'يدعمها صندوق هدف', en: 'Hadaf-supported' }, why: { ar: 'أسرع خطوة معتمدة تنقلك رسميًا إلى مسار الاستثمار، وتؤهّلك لأدوار الأسواق العامة في الصندوق. ابدأ بها قبل CFA.', en: 'The fastest accredited step that formally moves you into the investment track and qualifies you for PIF public-markets roles. Do it before the CFA.' } },
      { name: { ar: 'FMVA', en: 'FMVA' }, desc: { ar: 'برنامج معهد تمويل الشركات لبناء النماذج المالية وتقييم الشركات. عملي بالكامل: تتخرّج منه قادرًا على بناء نموذج مالي متكامل من الصفر، وهي المهارة الأكثر طلبًا في فرق الاستثمار والصفقات.', en: 'CFI’s hands-on program for financial modeling and company valuation. You finish able to build a full model from scratch, the most in-demand skill on investment and deals teams.' }, gain: { ar: 'إتقان النمذجة المالية المطلوبة في الصفقات', en: 'Deal-grade financial modeling skills' }, opens: [{ ar: 'محلل مالي', en: 'Financial Analyst' }, { ar: 'زميل استثمار', en: 'Investment Associate' }], scoreAdd: 8, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'CFA المستوى الأول', en: 'CFA Level 1' }, desc: { ar: 'المستوى الأول من شهادة محلل مالي معتمد، المعيار العالمي الأرفع في إدارة الاستثمار. يغطّي الأخلاقيات والأدوات الكمية والاقتصاد وتحليل القوائم المالية، وهو حجر الأساس لأي دور استثماري في الصندوق.', en: 'Level 1 of the Chartered Financial Analyst program, the global gold standard in investment management. It spans ethics, quantitative methods, economics, and financial reporting, the foundation for any investment role at PIF.' }, gain: { ar: 'المعيار الذهبي لوظائف الاستثمار في الصندوق', en: 'The gold standard for PIF investment roles' }, opens: [{ ar: 'محلل استثمار في الصندوق', en: 'Investment Analyst at PIF' }, { ar: 'محلل أبحاث أسهم', en: 'Equity Research Analyst' }], scoreAdd: 15, official: CFA, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '6 أشهر · 300 ساعة', en: '6 months · 300h' }, hadaf: true, hadafNote: { ar: 'تسترجع نحو 2,750 ر.س عبر هدف', en: 'Reclaim ~2,750 SAR via Hadaf' } },
      { name: { ar: 'CFA المستوى الثاني', en: 'CFA Level 2' }, desc: { ar: 'المستوى المتقدّم من برنامج CFA، ويركّز على تطبيق أدوات التقييم على فئات الأصول المختلفة. اجتيازه يضعك في نخبة المحللين ويفتح الأدوار القيادية في صناديق الاستثمار.', en: 'The advanced CFA level, focused on applying valuation tools across asset classes. Passing it puts you among elite analysts and opens senior fund roles.' }, gain: { ar: 'يفتح الأدوار القيادية في صناديق الاستثمار', en: 'Opens senior investment-fund roles' }, opens: [{ ar: 'محلل استثمار أول', en: 'Senior Investment Analyst' }, { ar: 'زميل إدارة محافظ', en: 'Portfolio Associate' }], scoreAdd: 12, official: CFA, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '8 أشهر', en: '8 months' }, hadaf: true },
    ],
    targetCompanies: ['Public Investment Fund', 'PIF', 'KAPSARC', 'Saudi National Bank', 'Sanabil', 'Jadwa', 'NEOM'],
  },
  {
    id: 'power-renewables',
    name: { ar: 'هندسة الطاقة والمتجددة', en: 'Power & Renewables Engineering' },
    targets: { ar: 'أرامكو · أكوا باور · تحلية المياه · نيوم', en: 'Aramco · ACWA · Water Authority · NEOM' },
    roles: { ar: 'مهندس ← مهندس أول ← مدير مشروع/عمليات', en: 'Engineer → Senior Engineer → Project / Operations Manager' },
    accent: 'sky',
    icon: 'energy',
    gradFields: ['energy', 'tech', 'consulting'],
    months: 12,
    scoreByLevel: { entry: 94, mid: 76, senior: 54, director: 36 },
    trail: { ar: 'التناضح العكسي → الطاقة الشمسية → PMP → CEM → Six Sigma', en: 'Reverse Osmosis → Solar PV → PMP → CEM → Six Sigma' },
    certs: [
      { name: { ar: 'التناضح العكسي', en: 'Reverse Osmosis' }, desc: { ar: 'شهادة مهندس متخصص في التناضح العكسي من أكاديمية المياه. تثبت خبرتك التشغيلية في أكبر محطات التحلية, أساس قوي لأدوار الطاقة والمياه.', en: 'Reverse Osmosis Specialist Engineer from the Water Academy. It certifies your operational expertise at the largest desalination plants, a strong base for power and water roles.' }, gain: { ar: 'تثبت خبرتك في أكبر محطات التحلية', en: 'Certifies your large-scale desalination expertise' }, scoreAdd: 7, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'تصميم الطاقة الشمسية', en: 'Solar PV Design' }, desc: { ar: 'مصمم أنظمة طاقة شمسية معتمد من أكاديمية المياه. يضيف تصميم المتجددة إلى خبرتك في التوليد التقليدي.', en: 'Certified Solar PV Designer from the Water Academy. It adds renewables design to your conventional-generation experience.' }, gain: { ar: 'تصميم المتجددة المطلوب في أكوا ونيوم', en: 'Renewables design valued at ACWA and NEOM' }, scoreAdd: 6, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'شهادة محترف إدارة المشاريع من معهد PMI، الأكثر اعترافًا عالميًا. لقيادة مشاريع الطاقة الكبرى في أرامكو وأكوا باور ومشاريع رؤية 2030.', en: 'PMI’s Project Management Professional, the most globally recognized PM credential, for leading major energy projects at Aramco, ACWA Power, and Vision 2030.' }, gain: { ar: 'يؤهّلك لقيادة مشاريع الطاقة الكبرى', en: 'Qualifies you to lead major energy projects' }, opens: [{ ar: 'مدير مشروع', en: 'Project Manager' }, { ar: 'مهندس أول', en: 'Senior Engineer' }], scoreAdd: 10, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'current', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'CEM', en: 'CEM' }, desc: { ar: 'مدير طاقة معتمد من جمعية مهندسي الطاقة (AEE). يثبت قدرتك على تحليل استهلاك الطاقة وتصميم حلول الكفاءة.', en: 'Certified Energy Manager from the AEE. It proves you can analyze energy use and design efficiency solutions.' }, gain: { ar: 'خبرة معتمدة في كفاءة الطاقة', en: 'Certified energy-efficiency expertise' }, opens: [{ ar: 'مدير طاقة', en: 'Energy Manager' }, { ar: 'أخصائي كفاءة', en: 'Efficiency Specialist' }], scoreAdd: 9, official: 'https://www.aeecenter.org/certified-energy-manager-cem/', status: 'future', cost: { ar: '$1,500', en: '$1,500' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'Six Sigma', en: 'Six Sigma' }, desc: { ar: 'الحزام الأخضر في منهجية ستة سيجما لتحسين العمليات وتقليل الهدر، وهي منهجية تعتمدها أرامكو وكبرى الشركات الصناعية.', en: 'Green Belt in Six Sigma for process improvement and waste reduction, relied on by Aramco and major industrial firms.' }, gain: { ar: 'تحسين العمليات المطلوب في أرامكو', en: 'Process improvement valued at Aramco' }, scoreAdd: 7, official: 'https://asq.org/cert/six-sigma-green-belt', status: 'future', cost: { ar: '2,500 ر.س', en: '2,500 SAR' }, duration: { ar: 'شهران', en: '2 months' }, hadaf: true },
    ],
    targetCompanies: ['Saudi Aramco', 'Aramco', 'ACWA Power', 'NEOM', 'Water Authority', 'SWCC', 'Marafiq', 'SABIC'],
  },
  {
    id: 'consulting',
    name: { ar: 'استشارات الطاقة والاستراتيجية', en: 'Energy Strategy Consulting' },
    targets: { ar: 'ماكنزي · BCG · ستراتيجي&', en: 'McKinsey · BCG · Strategy&' },
    roles: { ar: 'محلل ← مستشار ← مدير ارتباط', en: 'Analyst → Consultant → Engagement Manager' },
    accent: 'violet',
    icon: 'consulting',
    gradFields: ['consulting', 'finance', 'tech'],
    months: 12,
    scoreByLevel: { entry: 84, mid: 64, senior: 44, director: 28 },
    trail: { ar: 'مهارات الاستشارات → دراسات الحالة → GMAT → FMVA', en: 'Consulting Skills → Case Prep → GMAT → FMVA' },
    certs: [
      { name: { ar: 'مهارات الاستشارات', en: 'Consulting Skills' }, desc: { ar: 'برنامج مهارات الاستشارات الأساسية من مسرّعة مستشار. يمنحك إطار حلّ المشكلات والتواصل التنفيذي المطلوب في المقابلات.', en: 'Foundational consulting skills from the Mustashar accelerator. It gives you the problem-solving and executive-communication frame interviews demand.' }, gain: { ar: 'أساس حلّ المشكلات والتواصل التنفيذي', en: 'Problem-solving and executive-communication base' }, scoreAdd: 6, official: 'https://mustashar.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'إعداد دراسات الحالة', en: 'Case Prep' }, desc: { ar: 'تدريب مكثّف على حلّ دراسات الحالة، وهي جوهر مقابلات شركات الاستشارات. تتعلّم كيف تفكّك مشكلة عمل وتبني توصية منظّمة تحت الضغط.', en: 'Intensive case-interview training, the core of consulting hiring. You learn to break down a business problem and build a structured recommendation under pressure.' }, gain: { ar: 'تجتاز مقابلات الحالة في ماكنزي وBCG', en: 'Pass case interviews at McKinsey and BCG' }, opens: [{ ar: 'مستشار', en: 'Consultant' }, { ar: 'محلل أعمال', en: 'Business Analyst' }], scoreAdd: 9, official: 'https://www.preplounge.com/', status: 'current', cost: { ar: '$300', en: '$300' }, duration: { ar: 'شهران', en: '2 months' } },
      { name: { ar: 'GMAT', en: 'GMAT' }, desc: { ar: 'اختبار القبول المعياري لبرامج الإدارة العليا، وكثيرًا ما تطلبه شركات الاستشارات الكبرى. درجة قوية تعزّز ملفك.', en: 'The standardized admissions test for top management programs, often requested by major consulting firms. A strong score strengthens your profile.' }, gain: { ar: 'بوابة الاستشارات والـ MBA', en: 'Gateway to consulting and MBA' }, scoreAdd: 8, official: 'https://www.mba.com/exams/gmat-exam', status: 'future', cost: { ar: '$275', en: '$275' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'FMVA', en: 'FMVA' }, desc: { ar: 'برنامج النمذجة المالية والتقييم، يمنحك ثقلًا كمّيًا يقوّي ملفك أمام شركات الاستشارات. عملي ويغطّي بناء النماذج وتحليل الصفقات.', en: 'The financial modeling and valuation program, giving you quantitative weight that strengthens a consulting profile.' }, gain: { ar: 'تحليل كمّي يميّز ملفك الاستشاري', en: 'Quant edge for a consulting profile' }, scoreAdd: 8, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, desc: { ar: 'ماجستير إدارة الأعمال، يفتح أدوار ما بعد الاستشارات في القيادة والاستثمار، ويوسّع شبكتك بشكل كبير.', en: 'The MBA, opening post-consulting leadership and investment roles and widening your network.' }, gain: { ar: 'يفتح أدوار ما بعد الاستشارات', en: 'Opens post-consulting roles' }, opens: [{ ar: 'مدير ارتباط', en: 'Engagement Manager' }, { ar: 'مدير استراتيجية', en: 'Strategy Manager' }], scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    targetCompanies: ['McKinsey', 'BCG', 'Boston Consulting', 'Strategy&', 'Bain', 'Kearney', 'Oliver Wyman', 'PwC'],
  },
  {
    id: 'government',
    name: { ar: 'سياسات الطاقة والقطاع الحكومي', en: 'Energy Policy & Government' },
    targets: { ar: 'وزارة الطاقة · كابسارك · رؤية 2030', en: 'Ministry of Energy · KAPSARC · Vision 2030' },
    roles: { ar: 'أخصائي سياسات ← مدير برنامج ← مدير عام', en: 'Policy Specialist → Program Manager → Director' },
    accent: 'amber',
    icon: 'government',
    gradFields: ['government', 'consulting', 'finance'],
    months: 18,
    scoreByLevel: { entry: 86, mid: 66, senior: 46, director: 30 },
    trail: { ar: 'تمويل المناخ → دبلوم السياسات → PMP → PgMP', en: 'Climate Finance → Policy Diploma → PMP → PgMP' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والاستدامة من كابسارك. يربط نمذجتك لمسار 2060 بأدوات السياسة والتمويل المناخي.', en: 'KAPSARC’s climate finance and sustainability program. It ties your 2060-pathway modeling to policy and climate-finance tools.' }, gain: { ar: 'يربط نمذجتك بالسياسة والتمويل المناخي', en: 'Links your modeling to climate policy and finance' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'دبلوم السياسات العامة', en: 'Public Policy Diploma' }, desc: { ar: 'دبلوم متخصّص في تحليل وصياغة السياسات العامة. يؤهّلك لمكاتب الاستراتيجية والتخطيط في الوزارات والهيئات.', en: 'A specialized diploma in public-policy analysis and design. It prepares you for strategy and planning offices in ministries and authorities.' }, gain: { ar: 'صياغة وتحليل سياسات الطاقة', en: 'Energy policy design and analysis' }, opens: [{ ar: 'محلل سياسات', en: 'Policy Analyst' }, { ar: 'مسؤول استراتيجية', en: 'Strategy Officer' }], scoreAdd: 9, official: 'https://www.spsp.edu.sa/', status: 'current', cost: { ar: '5,000 ر.س', en: '5,000 SAR' }, duration: { ar: '5 أشهر', en: '5 months' }, hadaf: true },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'محترف إدارة المشاريع من PMI، لقيادة مشاريع التحول ضمن رؤية 2030 داخل الجهات الحكومية.', en: 'PMI’s Project Management Professional, for leading Vision 2030 transformation projects in government.' }, gain: { ar: 'قيادة مشاريع رؤية 2030', en: 'Lead Vision 2030 projects' }, scoreAdd: 9, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'PgMP', en: 'PgMP' }, desc: { ar: 'محترف إدارة البرامج من PMI، المستوى الأعلى من PMP، لقيادة محافظ المشاريع على مستوى المؤسسة.', en: 'PMI’s Program Management Professional, above PMP, for leading enterprise-level project portfolios.' }, gain: { ar: 'إدارة برامج الطاقة الكبرى', en: 'Manage large energy programs' }, opens: [{ ar: 'مدير برامج', en: 'Program Director' }], scoreAdd: 8, official: 'https://www.pmi.org/certifications/program-management-pgmp', status: 'future', cost: { ar: '$800', en: '$800' }, duration: { ar: '4 أشهر', en: '4 months' } },
      { name: { ar: 'دكتوراه إدارة الأعمال', en: 'DBA' }, desc: { ar: 'دكتوراه إدارة الأعمال، أعلى مؤهل تطبيقي للأدوار القيادية العليا في السياسات والاستراتيجية.', en: 'The Doctor of Business Administration, the top applied qualification for senior policy and strategy leadership.' }, gain: { ar: 'المؤهل الأعلى للقيادة', en: 'Top leadership credential' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '12 شهرًا', en: '12 months' } },
    ],
    targetCompanies: ['Ministry of Energy', 'KAPSARC', 'Ministry', 'Royal Commission', 'SEEC', 'Energy Efficiency', 'Vision 2030'],
  },
  {
    id: 'tech',
    name: { ar: 'الذكاء الاصطناعي والبيانات للطاقة', en: 'AI & Data for Energy' },
    targets: { ar: 'أرامكو الرقمية · stc · علم', en: 'Aramco Digital · stc · Elm' },
    roles: { ar: 'محلل بيانات ← مهندس بيانات ← قائد منتج', en: 'Data Analyst → Data Engineer → Product Lead' },
    accent: 'rose',
    icon: 'tech',
    gradFields: ['tech', 'consulting', 'finance'],
    months: 12,
    scoreByLevel: { entry: 80, mid: 60, senior: 40, director: 26 },
    trail: { ar: 'تحليل البيانات → AWS → Scrum → تحليلات متقدمة', en: 'Data Analyst → AWS → Scrum → Advanced Analytics' },
    certs: [
      { name: { ar: 'تحليل البيانات', en: 'Data Analyst' }, desc: { ar: 'شهادة محلل بيانات من IBM، تغطّي أدوات التحليل والتصوّر واتخاذ القرار بالبيانات. تكمّل خلفيتك في الذكاء الاصطناعي ومشروع نموذجك التنبؤي.', en: 'IBM’s Data Analyst certificate covering analysis, visualization, and data-driven decisions. It complements your AI background and your predictive-model project.' }, gain: { ar: 'تحليل البيانات واتخاذ القرار', en: 'Data analysis and decision-making' }, scoreAdd: 6, official: 'https://www.ibm.com/training/badge/data-analyst', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'AWS SAA', en: 'AWS SAA' }, desc: { ar: 'مهندس حلول معتمد على منصة AWS (المستوى المساعد). يثبت قدرتك على تصميم أنظمة سحابية موثوقة، وهي من أكثر الشهادات طلبًا في الجهات التقنية.', en: 'AWS Certified Solutions Architect - Associate. It proves you can design reliable cloud systems, one of the most in-demand tech credentials.' }, gain: { ar: 'تصميم الحلول السحابية المطلوبة', en: 'In-demand cloud architecture' }, opens: [{ ar: 'مهندس حلول', en: 'Solutions Architect' }, { ar: 'مهندس سحابة', en: 'Cloud Engineer' }], scoreAdd: 9, official: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', status: 'current', cost: { ar: '$150', en: '$150' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'PSM', en: 'PSM' }, desc: { ar: 'سكرَم ماستر محترف، لقيادة فرق التطوير الرشيقة. أساس العمل في فرق المنتجات التقنية الحديثة.', en: 'Professional Scrum Master, for leading agile development teams. Foundational to modern tech product teams.' }, gain: { ar: 'قيادة فرق أجايل', en: 'Lead agile teams' }, scoreAdd: 6, official: 'https://www.scrum.org/professional-scrum-master-certifications', status: 'future', cost: { ar: '$200', en: '$200' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: { ar: 'تحليلات متقدمة', en: 'Advanced Analytics' }, desc: { ar: 'برنامج تحليلات وتعلّم آلة متقدم يبني على أساسك في الذكاء الاصطناعي ومشروعك التنبؤي لمحطة كورنيل.', en: 'An advanced analytics and machine-learning program building on your AI foundation and your Cornell-plant predictive project.' }, gain: { ar: 'نمذجة تنبؤية لأنظمة الطاقة', en: 'Predictive modeling for energy systems' }, opens: [{ ar: 'عالم بيانات', en: 'Data Scientist' }, { ar: 'مهندس تعلم آلة', en: 'ML Engineer' }], scoreAdd: 9, official: 'https://www.coursera.org/professional-certificates/google-data-analytics', status: 'future', cost: { ar: '3,500 ر.س', en: '3,500 SAR' }, duration: { ar: '3 أشهر', en: '3 months' }, hadaf: true },
      { name: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, desc: { ar: 'ماجستير إدارة الأعمال، يجمع بين خبرتك التقنية والإدارة للانتقال إلى قيادة المنتجات والاستراتيجية الرقمية.', en: 'The MBA, bridging your technical expertise and management for product leadership and digital strategy.' }, gain: { ar: 'يجمع التقنية بالإدارة', en: 'Bridges tech and management' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    targetCompanies: ['Aramco Digital', 'stc', 'Elm', 'SDAIA', 'Lean', 'Tonomus', 'Google', 'Microsoft'],
  },
];

export const primaryPath = paths.find((p) => p.primary) ?? paths[0];

/* ----------------------------------------------------------------- messages -- */

export type Template = { id: string; title: LS; preview: LS; tone: LS };

export const templates: Template[] = [
  {
    id: 't1',
    title: { ar: 'تعريف مباشر', en: 'Direct Introduction' },
    preview: {
      ar: 'السلام عليكم {الاسم}، أنا علي، طالب ماجستير في اقتصاديات الطاقة بجامعة كورنيل (أتخرّج مايو 2026)، ولي خبرة سنتين كمهندس عمليات في رأس الخير. أتطلّع لفرصة في {الشركة}، ويسعدني لو نتحدّث قصيرًا.',
      en: "Hi {firstName}, I'm Ali, an Energy Economics M.Eng. at Cornell (graduating May 2026) with two years as an operations engineer at Ras Al-Khair. I'm keen on a role at {company} and would value a short chat.",
    },
    tone: { ar: 'رسمي', en: 'Formal' },
  },
  {
    id: 't2',
    title: { ar: 'جسر بحثي', en: 'Research Bridge' },
    preview: {
      ar: 'السلام عليكم {الاسم}، عملت على نمذجة مسار السعودية للطاقة 2060 ضمن دراستي في كورنيل، ولفت نظري عمل {الشركة} في تحوّل الطاقة. أودّ لو أسمع وجهة نظرك.',
      en: "Hi {firstName}, I modeled Saudi Arabia's 2060 energy pathway during my Cornell studies, and {company}'s energy-transition work caught my attention. I'd love to hear your perspective.",
    },
    tone: { ar: 'أكاديمي', en: 'Academic' },
  },
  {
    id: 't3',
    title: { ar: 'جسر شخصي', en: 'Personal Bridge' },
    preview: {
      ar: 'السلام عليكم أستاذ {الاسم}، أنا علي الأجود، خرّيج هندسة من مانشستر وعملت في رأس الخير. تابعت مسيرتك في {الشركة}، وأطمح لمسار مشابه في الاستثمار والطاقة.',
      en: "As-salamu alaykum {firstName}, I'm Ali Alajwad, a Manchester engineering graduate with experience at Ras Al-Khair. I've followed your path at {company} and aspire to a similar route in energy investment.",
    },
    tone: { ar: 'ودّي', en: 'Warm' },
  },
  {
    id: 't4',
    title: { ar: 'مختصرة ومباشرة', en: 'Short & Direct' },
    preview: {
      ar: 'السلام عليكم {الاسم}، خرّيج اقتصاديات طاقة من كورنيل (مايو 2026)، وخبرة سنتين في رأس الخير، وأستهدف {الشركة}. هل يناسبك حديث 10 دقائق؟',
      en: 'Hi {firstName}, Cornell Energy Economics grad (May 2026), two years at Ras Al-Khair, targeting {company}. Open to a 10-min chat?',
    },
    tone: { ar: 'مختصر', en: 'Tight' },
  },
];

export function fillTemplate(preview: string, c: Contact, locale: Loc): string {
  const first = c.name[locale].split(' ')[0];
  let out = preview;
  for (const [k, v] of [
    ['{الاسم}', first],
    ['{firstName}', first],
    ['{الشركة}', c.company[locale]],
    ['{company}', c.company[locale]],
    ['{الدور}', c.role[locale]],
    ['{role}', c.role[locale]],
  ] as const) {
    out = out.split(k).join(v);
  }
  return out;
}

export function linkedinUrl(c: Contact): string {
  if (c.linkedin) return c.linkedin; // real profile from the DB or the uploaded CSV
  const q = encodeURIComponent(`${c.name.en} ${c.company.en}`);
  return `https://www.linkedin.com/search/results/people/?keywords=${q}`;
}

/* ------------------------------------------- uploaded LinkedIn network -- */
// The customer's Connections.csv is parsed entirely in the browser and never
// uploaded or stored (PDPL). Every connection shown comes from this file; we rank
// it against the customer's target companies to surface the warmest intros first.

function normCompany(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Minimal CSV line splitter that respects quoted fields ("Acme, Inc.").
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

// LinkedIn's export prepends a few "Notes:" lines before the real header row
// (First Name, Last Name, URL, Email Address, Company, Position, Connected On).
export function parseUploadedConnections(text: string): Contact[] {
  const lines = text.split(/\r?\n/);
  let headerIdx = lines.findIndex((l) => /first name/i.test(l) && /last name/i.test(l));
  if (headerIdx === -1) headerIdx = 0;
  const header = splitCsvLine(lines[headerIdx] ?? '').map((h) => h.trim().toLowerCase());
  const iFirst = header.indexOf('first name');
  const iLast = header.indexOf('last name');
  const iCompany = header.indexOf('company');
  const iPosition = header.indexOf('position');
  const iUrl = header.indexOf('url');

  const out: Contact[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw || !raw.trim()) continue;
    const cells = splitCsvLine(raw);
    const first = ((iFirst >= 0 ? cells[iFirst] : cells[0]) ?? '').trim();
    const last = ((iLast >= 0 ? cells[iLast] : cells[1]) ?? '').trim();
    const name = `${first} ${last}`.trim();
    if (!name) continue;
    const company = ((iCompany >= 0 ? cells[iCompany] : '') ?? '').trim();
    const position = ((iPosition >= 0 ? cells[iPosition] : '') ?? '').trim();
    const url = ((iUrl >= 0 ? cells[iUrl] : '') ?? '').trim();
    out.push({
      id: `up-${i}`,
      name: { ar: name, en: name },
      role: { ar: position || '', en: position || '' },
      company: { ar: company || '', en: company || '' },
      status: 'new',
      when: { ar: 'من شبكتك', en: 'In your network' },
      linkedin: url || undefined,
    });
  }
  return out;
}

const SENIOR_RE = /chief|vice president|\bvp\b|head of|director|partner|managing|principal|\blead\b|founder|owner|\bceo\b|\bcfo\b|\bcoo\b|\bcto\b|general manager/i;

export type ScoredContact = { contact: Contact; relevance: number; reason: LS; kind: PickKind };

// Rank the uploaded network against target companies: at a target company + senior
// is the warmest (top), at a target OR senior is mid, the rest stay common.
export function rankConnections(contacts: Contact[], targets: string[]): ScoredContact[] {
  const t = targets.map(normCompany).filter((x) => x.length >= 3);
  const scored = contacts.map((c): ScoredContact => {
    const comp = normCompany(c.company.en);
    const hit = comp.length >= 3 && t.some((x) => comp.includes(x) || x.includes(comp));
    const senior = SENIOR_RE.test(c.role.en);
    const relevance = (hit ? 2 : 0) + (senior ? 1 : 0);
    const kind: PickKind = hit && senior ? 'top' : hit || senior ? 'mid' : 'common';
    const reason: LS = hit
      ? { ar: `يعمل في ${c.company.en}`, en: `Works at ${c.company.en}` }
      : senior
        ? { ar: 'جهة اتصال قيادية', en: 'Senior contact' }
        : { ar: 'ضمن شبكتك', en: 'In your network' };
    return { contact: c, relevance, reason, kind };
  });
  return scored.sort((a, b) => b.relevance - a.relevance);
}

// Every target company across the plan's areas (for the all-connections view).
export function planTargets(plan: CustomerPlan): string[] {
  return Array.from(new Set(plan.paths.flatMap((p) => p.targetCompanies)));
}

// Deterministic daily rotation: a different slice each day, cycling through all.
export function dailyPicks<T>(items: T[], count: number, dayNumber: number): T[] {
  if (items.length <= count) return items;
  const start = (dayNumber * count) % items.length;
  return Array.from({ length: count }, (_, i) => items[(start + i) % items.length]);
}

/* ------------------------------------------------------------------ tracker -- */

export type Activity = { kind: 'replied' | 'sent' | 'cert'; text: LS; when: LS };

export const tracker = {
  stats: { sent: 6, replied: 1, pending: 4, followup: 1 },
  replyRate: 16.7,
  weekly: [
    { label: { ar: 'الأحد', en: 'Sun' }, value: 1 },
    { label: { ar: 'الإثنين', en: 'Mon' }, value: 2 },
    { label: { ar: 'الثلاثاء', en: 'Tue' }, value: 0 },
    { label: { ar: 'الأربعاء', en: 'Wed' }, value: 2 },
    { label: { ar: 'الخميس', en: 'Thu' }, value: 1 },
    { label: { ar: 'الجمعة', en: 'Fri' }, value: 0 },
    { label: { ar: 'السبت', en: 'Sat' }, value: 0 },
  ],
  activity: [
    { kind: 'replied', text: { ar: 'ردّ عليك فهد العمري · أكوا باور', en: 'Fahad Alamri replied · ACWA Power' }, when: { ar: 'قبل ساعتين', en: '2h ago' } },
    { kind: 'sent', text: { ar: 'أرسلت إلى مازن العتيبي · الصندوق', en: 'Sent to Mazen Alotaibi · PIF' }, when: { ar: 'قبل 5 ساعات', en: '5h ago' } },
    { kind: 'cert', text: { ar: 'أنجزت شهادة تمويل المناخ · كابسارك', en: 'Completed Climate Finance · KAPSARC' }, when: { ar: 'أمس', en: 'Yesterday' } },
  ] as Activity[],
};

/* ---------------------------------------------------------------- cv review -- */
// Authored when the founder uploads the CV to Claude at generation time, so only
// derived text ships in the plan (never the raw CV). Hygiene issues each carry an
// id so the customer can mark them Fixed; the whole review hides once all are done.

export type CvIssueKind = 'length' | 'typo' | 'format' | 'bullet' | 'contact' | 'summary';
export type CvIssue = { id: string; kind: CvIssueKind; text: LS; severity: 'high' | 'med' | 'low' };
export type CvReview = { headline: LS; strengths: LS[]; issues: CvIssue[] };

// What blocks the NEXT level, per level. These are EXPERIENCE / other gaps that a
// certificate cannot fix; the certificate gaps are derived from the customer's
// active path instead, so this stays correct whichever path they pick.
export type LevelGap = { experience?: LS; other?: LS[] };

// What drives the CV score, shown as a breakdown so the customer sees that things
// like their university's standing are actually counted. `strength` tints the chip.
export type ScoreFactor = { label: LS; detail: LS; strength: 'strong' | 'good' | 'growing' };

/* -------------------------------------------------------------- customer plan -- */
// Everything that varies per customer. The dashboard renders ONE plan through
// <PlanProvider>, so each customer is fully isolated and reachable at their own
// /c/<slug> link. Shared copy (ui), generic industries, and the helper functions
// stay module-level. Add a customer by adding an entry to `plans` (later this is
// fetched from the database by slug instead of hard-coded here).

export type CustomerPlan = {
  slug: string;
  tier: PlanTier; // Starter (100 HR) or Pro (300 HR)
  sectors: string[]; // HR DB sectors relevant to this customer (SECTOR_LABELS keys)
  profile: typeof profile;
  cvScore: typeof cvScore;
  cvReview: CvReview;
  scoreFactors: ScoreFactor[];
  levelGaps: Record<Level, LevelGap>;
  journey: typeof journey;
  connections: Contact[];
  hrContacts: Contact[]; // filled per request from the real DB by the page
  paths: CareerPath[];
  primaryPath: CareerPath;
  templates: Template[];
  tracker: typeof tracker;
};

const aliCvReview: CvReview = {
  headline: {
    ar: 'ملف طاقة لافت. الخطوة القادمة أن تقدّمه بلغة المستثمر لا المشغّل.',
    en: 'A standout energy profile. The next step is to frame it for investors, not operators.',
  },
  strengths: [
    { ar: 'ماجستير اقتصاديات وهندسة الطاقة من كورنيل بمعدل 3.95 مع تخصص فرعي في الذكاء الاصطناعي', en: 'Cornell M.Eng in Energy Economics, GPA 3.95, with an AI and ML minor' },
    { ar: 'قُدت 30 مشغّلًا في رأس الخير، أكبر محطة طاقة وتحلية في العالم', en: "Led 30 operators at Ras Al-Khair, the world's largest power and desalination plant" },
    { ar: 'نمذجة فعلية لتحوّل الطاقة: مسار LEAP للسعودية 2060 وعمل تقني اقتصادي بالذكاء الاصطناعي', en: 'Real transition modeling: a Saudi 2060 LEAP pathway and AI techno-economic work' },
    { ar: 'شهادة تمويل مناخي من كابسارك تغطي الحوكمة البيئية وأسواق الكربون', en: 'A KAPSARC Climate Finance credential covering ESG and carbon markets' },
  ],
  issues: [
    { id: 'impact', kind: 'bullet', text: { ar: 'أضف الأثر المالي أو تحسّن الكفاءة لأبرز إنجازاتك، لا الإنتاج فقط.', en: 'Add the money or efficiency result to your top bullets, not just the output.' }, severity: 'high' },
    { id: 'summary', kind: 'summary', text: { ar: 'اجعل ملخصك يبدأ بـ«اقتصادي طاقة» لا «طالب دراسات عليا».', en: 'Lead the summary as an energy economist, not "graduate student".' }, severity: 'high' },
    { id: 'skills', kind: 'format', text: { ar: 'أبرز أدواتك التحليلية (SQL وPower BI)، فهي تُقرأ كمهارات محلّل.', en: 'Pull your data tools (SQL, Power BI) up; they read as analyst skills.' }, severity: 'med' },
    { id: 'years', kind: 'typo', text: { ar: 'استبدل «نحو سنتين» برقم محدد.', en: 'Replace "roughly two years" with a firm number.' }, severity: 'low' },
  ],
};

const aliScoreFactors: ScoreFactor[] = [
  { label: { ar: 'التعليم', en: 'Education' }, detail: { ar: 'ماجستير اقتصاديات الطاقة من كورنيل بمعدل 3.95، وبكالوريوس هندسة من مانشستر', en: 'Cornell M.Eng Energy Economics, GPA 3.95, plus a Manchester engineering degree' }, strength: 'strong' },
  { label: { ar: 'الخبرة', en: 'Experience' }, detail: { ar: 'سنتان بقيادة 30 مشغّلًا في أكبر محطة طاقة وتحلية في العالم', en: 'Two years leading 30 operators at the world’s largest power and desalination plant' }, strength: 'good' },
  { label: { ar: 'ملاءمة المجال', en: 'Field fit' }, detail: { ar: 'طاقة وتمويل، وهو هدفك تمامًا', en: 'Energy and finance, exactly your target' }, strength: 'strong' },
];

const aliLevelGaps: Record<Level, LevelGap> = {
  entry: {},
  mid: { experience: { ar: 'نحو سنتين إضافيتين من الخبرة ذات الصلة', en: '≈2 more years of relevant experience' } },
  senior: {
    experience: { ar: '5+ سنوات تشمل تحمّل مسؤولية أكبر', en: '5+ years including broader ownership' },
    other: [{ ar: 'قِدت مشروعًا أو مبادرة', en: 'Led a project or initiative' }],
  },
  director: {
    experience: { ar: '10+ سنوات مع خبرة قيادية', en: '10+ years with leadership experience' },
    other: [
      { ar: 'مسؤولية عن الأرباح والخسائر (P&L)', en: 'P&L ownership' },
      { ar: 'بنيت أو قدت فريقًا', en: 'Built or led a team' },
    ],
  },
};

export const aliPlan: CustomerPlan = {
  slug: 'ali-alajwad',
  tier: 'pro',
  sectors: [
    'investment_finance',
    'energy_petrochem',
    'consulting',
    'government',
    'tech_startups',
    'telecom_it',
    'gigaprojects_realestate',
    'recruitment_agencies',
  ],
  profile,
  cvScore,
  cvReview: aliCvReview,
  scoreFactors: aliScoreFactors,
  levelGaps: aliLevelGaps,
  journey,
  connections: [], // the customer's own network, loaded client-side from their CSV
  hrContacts: [], // injected by the page from hr-db.ts (real, tier-capped)
  paths,
  primaryPath,
  templates,
  tracker,
};

export const plans: Record<string, CustomerPlan> = {
  [aliPlan.slug]: aliPlan,
};

export function getPlan(slug: string): CustomerPlan | undefined {
  return plans[slug];
}

/* ----------------------------------------------------------- opportunities -- */
// Mostly shared (not per-customer) content for the «فرص / Opportunities» tab.
// Career-day dates use season framing on purpose so they do not go stale; refresh
// the list each quarter. Field tags (finance/energy/consulting/government/tech)
// let the tab surface what matches the customer's primary area first.

export type FieldTag = 'finance' | 'energy' | 'consulting' | 'government' | 'tech' | 'all';

export const tamheer = {
  link: 'https://www.taqat.sa',
  stipend: { ar: '≈ 3,000 ريال شهريًا', en: '≈ 3,000 SAR / month' },
  duration: { ar: 'حتى 6 أشهر', en: 'Up to 6 months' },
  eligibility: [
    { ar: 'سعودي/ة خرّيج دبلوم أو بكالوريوس فأعلى', en: 'Saudi diploma/bachelor graduate or above' },
    { ar: 'لم يمضِ على تخرّجك أكثر من 6 أشهر (أو غير مسجّل في التأمينات)', en: 'Graduated within ~6 months (or not registered in GOSI)' },
    { ar: 'غير موظّف حاليًا', en: 'Not currently employed' },
  ] as LS[],
};

// Dates are concrete (month + year), refreshed to the next upcoming edition; the
// card carries a "check the site" caveat since exact days can shift.
export const careerDays: { title: LS; org: LS; when: LS; city: LS; fields: FieldTag[]; link: string }[] = [
  { title: { ar: '24 فنتك', en: '24 Fintech' }, org: { ar: 'فنتك السعودية', en: 'Fintech Saudi' }, when: { ar: 'سبتمبر 2026', en: 'September 2026' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['finance', 'tech'], link: 'https://www.24fintech.com' },
  { title: { ar: 'منتدى بيبان', en: 'Biban Forum' }, org: { ar: 'منشآت', en: "Monsha'at" }, when: { ar: 'نوفمبر 2026', en: 'November 2026' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['all', 'consulting'], link: 'https://biban.sa' },
  { title: { ar: 'منتدى مسك العالمي', en: 'Misk Global Forum' }, org: { ar: 'مؤسسة مسك', en: 'Misk Foundation' }, when: { ar: 'نوفمبر 2026', en: 'November 2026' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['all'], link: 'https://miskglobalforum.com' },
  { title: { ar: 'مؤتمر القطاع المالي', en: 'Financial Sector Conference' }, org: { ar: 'البنك المركزي وهيئة السوق المالية', en: 'SAMA & CMA' }, when: { ar: 'فبراير 2027', en: 'February 2027' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['finance'], link: 'https://www.fsc.sa' },
  { title: { ar: 'ليب التقني (LEAP)', en: 'LEAP Tech' }, org: { ar: 'وزارة الاتصالات', en: 'MCIT' }, when: { ar: 'فبراير 2027', en: 'February 2027' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['tech'], link: 'https://onegiantleap.com' },
  { title: { ar: 'يوم المهنة، جامعة الملك فهد', en: 'KFUPM Career Day' }, org: { ar: 'جامعة الملك فهد للبترول والمعادن', en: 'KFUPM' }, when: { ar: 'فبراير 2027', en: 'February 2027' }, city: { ar: 'الظهران', en: 'Dhahran' }, fields: ['energy', 'tech'], link: 'https://www.kfupm.edu.sa' },
];

// Graduate-study options per field for the «الدراسات / Study» tab. Two buckets:
// Saudi (often part-time / executive, good while working) and Worldwide
// (full-time). `best` flags the strongest programs in that field; `link` points at
// that field's program/department page (approximate, verify before applying).
export type GradTier = 'high' | 'respected' | 'solid' | 'accessible';
// top30 flags universities ranked in the world's top 30, which qualify for the
// Saudi "Pioneers" scholarship (a guaranteed full scholarship once you hold an offer).
export type GradProgram = { uni: LS; program: LS; location: LS; link: string; tier: GradTier; top30?: boolean };

// Full-time degree options per field, four per major, ordered hardest to easiest:
// a high-level school that is hard to get into but NOT impossible (think Berkeley,
// Cornell, CMU, Imperial, JHU class, varied by field), then respected, solid, and
// easier ones. The near-impossible names (MIT, Stanford, Harvard, LBS) are excluded.
export const gradPrograms: Record<Exclude<FieldTag, 'all'>, GradProgram[]> = {
  finance: [
    { tier: 'high', top30: true, uni: { ar: 'إمبريال كوليدج لندن', en: 'Imperial College London' }, program: { ar: 'ماجستير التمويل', en: 'MSc Finance' }, location: { ar: 'لندن، المملكة المتحدة', en: 'London, UK' }, link: 'https://www.imperial.ac.uk/business-school/' },
    { tier: 'respected', uni: { ar: 'جامعة بوكوني', en: 'Bocconi University' }, program: { ar: 'ماجستير التمويل', en: 'MSc Finance' }, location: { ar: 'ميلانو، إيطاليا', en: 'Milan, Italy' }, link: 'https://www.unibocconi.eu' },
    { tier: 'solid', uni: { ar: 'كلية روتردام للإدارة', en: 'Rotterdam School of Management' }, program: { ar: 'ماجستير التمويل', en: 'MSc Finance' }, location: { ar: 'روتردام، هولندا', en: 'Rotterdam, Netherlands' }, link: 'https://www.rsm.nl' },
    { tier: 'accessible', uni: { ar: 'جامعة ستراثكلايد', en: 'University of Strathclyde' }, program: { ar: 'ماجستير التمويل', en: 'MSc Finance' }, location: { ar: 'غلاسكو، المملكة المتحدة', en: 'Glasgow, UK' }, link: 'https://www.strath.ac.uk/business/' },
  ],
  energy: [
    { tier: 'high', top30: true, uni: { ar: 'جامعة كاليفورنيا، بيركلي', en: 'UC Berkeley' }, program: { ar: 'الطاقة والموارد', en: 'Energy and Resources' }, location: { ar: 'كاليفورنيا، الولايات المتحدة', en: 'California, USA' }, link: 'https://erg.berkeley.edu' },
    { tier: 'respected', uni: { ar: 'كلية كولورادو للمناجم', en: 'Colorado School of Mines' }, program: { ar: 'هندسة أنظمة الطاقة', en: 'Energy Systems Engineering' }, location: { ar: 'الولايات المتحدة', en: 'United States' }, link: 'https://www.mines.edu' },
    { tier: 'solid', uni: { ar: 'جامعة هيريوت وات', en: 'Heriot-Watt University' }, program: { ar: 'هندسة الطاقة المتجددة', en: 'Renewable Energy Engineering' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.hw.ac.uk' },
    { tier: 'accessible', uni: { ar: 'جامعة كالغاري', en: 'University of Calgary' }, program: { ar: 'تطوير الطاقة المستدامة', en: 'Sustainable Energy Development' }, location: { ar: 'كندا', en: 'Canada' }, link: 'https://www.ucalgary.ca' },
  ],
  consulting: [
    { tier: 'high', top30: true, uni: { ar: 'جامعة كورنيل', en: 'Cornell University' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA, Johnson' }, location: { ar: 'نيويورك، الولايات المتحدة', en: 'New York, USA' }, link: 'https://www.johnson.cornell.edu' },
    { tier: 'respected', uni: { ar: 'كلية IE لإدارة الأعمال', en: 'IE Business School' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'مدريد، إسبانيا', en: 'Madrid, Spain' }, link: 'https://www.ie.edu/business-school/' },
    { tier: 'solid', uni: { ar: 'كلية كرانفيلد للإدارة', en: 'Cranfield School of Management' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.cranfield.ac.uk/som' },
    { tier: 'accessible', uni: { ar: 'جامعة دورهام', en: 'Durham University' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.durham.ac.uk/business/' },
  ],
  government: [
    { tier: 'high', top30: true, uni: { ar: 'جامعة جونز هوبكنز', en: 'Johns Hopkins SAIS' }, program: { ar: 'ماجستير السياسات العامة', en: 'Master of Public Policy' }, location: { ar: 'واشنطن، الولايات المتحدة', en: 'Washington, USA' }, link: 'https://sais.jhu.edu' },
    { tier: 'respected', uni: { ar: 'معهد العلوم السياسية', en: 'Sciences Po' }, program: { ar: 'ماجستير السياسات العامة', en: 'Master in Public Policy' }, location: { ar: 'باريس، فرنسا', en: 'Paris, France' }, link: 'https://www.sciencespo.fr/en' },
    { tier: 'solid', top30: true, uni: { ar: 'جامعة إدنبرة', en: 'University of Edinburgh' }, program: { ar: 'السياسات العامة', en: 'Public Policy' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.ed.ac.uk' },
    { tier: 'accessible', uni: { ar: 'جامعة يورك', en: 'University of York' }, program: { ar: 'السياسات العامة', en: 'Public Policy' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.york.ac.uk' },
  ],
  tech: [
    { tier: 'high', top30: true, uni: { ar: 'جامعة كارنيجي ميلون', en: 'Carnegie Mellon University' }, program: { ar: 'علوم الحاسب والذكاء الاصطناعي', en: 'Computer Science / AI' }, location: { ar: 'بنسلفانيا، الولايات المتحدة', en: 'Pennsylvania, USA' }, link: 'https://www.cs.cmu.edu' },
    { tier: 'respected', top30: true, uni: { ar: 'جامعة إدنبرة', en: 'University of Edinburgh' }, program: { ar: 'الذكاء الاصطناعي والمعلوماتية', en: 'AI and Informatics' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.ed.ac.uk/informatics' },
    { tier: 'solid', uni: { ar: 'جامعة ساوثهامبتون', en: 'University of Southampton' }, program: { ar: 'علوم الحاسب', en: 'Computer Science' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.southampton.ac.uk' },
    { tier: 'accessible', uni: { ar: 'جامعة غلاسكو', en: 'University of Glasgow' }, program: { ar: 'علوم الحاسب', en: 'Computer Science' }, location: { ar: 'المملكة المتحدة', en: 'United Kingdom' }, link: 'https://www.gla.ac.uk' },
  ],
};

// The graduate major that fits each field (shown as chips at the top of Study).
export const fieldMajors: Record<Exclude<FieldTag, 'all'>, LS> = {
  finance: { ar: 'التمويل', en: 'Finance' },
  energy: { ar: 'اقتصاديات وهندسة الطاقة', en: 'Energy Economics and Engineering' },
  consulting: { ar: 'إدارة الأعمال', en: 'Business and Management' },
  government: { ar: 'السياسات العامة', en: 'Public Policy' },
  tech: { ar: 'علوم الحاسب والذكاء الاصطناعي', en: 'Computer Science and AI' },
};

// Saudi part-time / executive options (study while working). Each is tagged with the
// fields it suits and a region, so the ones nearest the customer can come first.
export type PartTimeUni = { uni: LS; program: LS; city: LS; region: SaudiRegion; link: string; fields: Exclude<FieldTag, 'all'>[] };
export const partTimeSaudi: PartTimeUni[] = [
  { uni: { ar: 'جامعة الملك فهد للبترول والمعادن', en: 'KFUPM' }, program: { ar: 'ماجستير تنفيذي في الطاقة والمالية والحاسب', en: 'Executive MSc in Energy, Finance, CS' }, city: { ar: 'الظهران', en: 'Dhahran' }, region: 'eastern', link: 'https://cim.kfupm.edu.sa', fields: ['energy', 'finance', 'tech'] },
  { uni: { ar: 'جامعة الأمير محمد بن فهد', en: 'PMU' }, program: { ar: 'ماجستير علم البيانات وإدارة الأعمال', en: 'MS Data Science and MBA' }, city: { ar: 'الخبر', en: 'Khobar' }, region: 'eastern', link: 'https://www.pmu.edu.sa', fields: ['tech', 'consulting', 'finance'] },
  { uni: { ar: 'جامعة الملك سعود', en: 'King Saud University' }, program: { ar: 'ماجستير إدارة الأعمال (مسائي)', en: 'MBA, evening' }, city: { ar: 'الرياض', en: 'Riyadh' }, region: 'central', link: 'https://business.ksu.edu.sa', fields: ['finance', 'consulting', 'government'] },
  { uni: { ar: 'مدرسة كابسارك للسياسة العامة', en: 'KAPSARC School' }, program: { ar: 'السياسات العامة والطاقة', en: 'Public Policy and Energy' }, city: { ar: 'الرياض', en: 'Riyadh' }, region: 'central', link: 'https://www.kapsarc.org', fields: ['energy', 'government'] },
  { uni: { ar: 'كلية الأمير محمد بن سلمان', en: 'MBSC' }, program: { ar: 'ماجستير إدارة الأعمال وريادة الأعمال', en: 'MBA and Entrepreneurship' }, city: { ar: 'مدينة الملك عبدالله الاقتصادية', en: 'KAEC' }, region: 'western', link: 'https://www.mbsc.edu.sa', fields: ['consulting', 'finance', 'government'] },
];

// Field-specific note on which Saudi university leads (shown in Study > In Saudi).
export const saudiUniStrength: Record<Exclude<FieldTag, 'all'>, LS> = {
  finance: { ar: 'جامعة الملك سعود من الأقوى محليًا في الأعمال والمالية.', en: 'King Saud University is among the strongest locally for business & finance.' },
  energy: { ar: 'جامعة الملك فهد للبترول والمعادن هي الأقوى في السعودية للهندسة والطاقة.', en: 'KFUPM is the strongest university in Saudi for engineering & energy.' },
  consulting: { ar: 'كاوست وجامعة الفيصل الأبرز محليًا لإدارة الأعمال.', en: 'KAUST and Alfaisal lead locally for business & management.' },
  government: { ar: 'معهد الإدارة العامة هو المرجع المحلي للسياسات والإدارة.', en: 'IPA is the local reference for policy & administration.' },
  tech: { ar: 'كاوست وجامعة الملك فهد الأقوى محليًا في الحاسب والذكاء الاصطناعي.', en: 'KAUST and KFUPM are the strongest locally for computing & AI.' },
};

// In-demand, future-ready skills that suit any pathway (general, not field-specific).
export const skills: { name: LS; link: string }[] = [
  { name: { ar: 'إجادة الذكاء الاصطناعي والتوليدي', en: 'AI and GenAI literacy' }, link: 'https://www.coursera.org' },
  { name: { ar: 'تحليل البيانات (Excel وSQL)', en: 'Data analysis (Excel and SQL)' }, link: 'https://www.coursera.org' },
  { name: { ar: 'التواصل والعرض', en: 'Communication and presenting' }, link: 'https://www.coursera.org' },
  { name: { ar: 'إدارة المشاريع', en: 'Project management' }, link: 'https://www.coursera.org' },
  { name: { ar: 'حل المشكلات', en: 'Problem solving' }, link: 'https://www.coursera.org' },
  { name: { ar: 'المرونة والتعلّم المستمر', en: 'Adaptability and learning' }, link: 'https://www.coursera.org' },
  { name: { ar: 'القيادة والعمل الجماعي', en: 'Leadership and teamwork' }, link: 'https://www.coursera.org' },
  { name: { ar: 'الحس التجاري والمالي', en: 'Business and financial acumen' }, link: 'https://www.coursera.org' },
];

export const nationalPortals: { name: LS; desc: LS; url: string }[] = [
  { name: { ar: 'جدارات', en: 'Jadarat' }, desc: { ar: 'المنصة الوطنية للتوظيف', en: 'National jobs platform' }, url: 'https://jadarat.sa' },
  { name: { ar: 'قوى', en: 'Qiwa' }, desc: { ar: 'منصة سوق العمل', en: 'Labor market platform' }, url: 'https://www.qiwa.sa' },
  { name: { ar: 'طاقات / تمهير', en: 'Taqat / Tamheer' }, desc: { ar: 'برامج هدف والتدريب', en: 'Hadaf programs & training' }, url: 'https://www.taqat.sa' },
  { name: { ar: 'هدف', en: 'Hadaf (HRDF)' }, desc: { ar: 'دعم التوظيف والشهادات', en: 'Hiring & certification support' }, url: 'https://www.hrdf.org.sa' },
];

// Direct careers portals for the known target companies, matched by name fragments.
export const companyCareers: { match: string[]; name: LS; url: string }[] = [
  { match: ['public investment fund', 'pif', 'sanabil'], name: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, url: 'https://www.pif.gov.sa/en/careers/' },
  { match: ['aramco'], name: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' }, url: 'https://www.aramco.com/en/careers' },
  { match: ['acwa'], name: { ar: 'أكوا باور', en: 'ACWA Power' }, url: 'https://acwapower.com/en/careers/' },
  { match: ['neom'], name: { ar: 'نيوم', en: 'NEOM' }, url: 'https://www.neom.com/en-us/careers' },
  { match: ['sabic'], name: { ar: 'سابك', en: 'SABIC' }, url: 'https://www.sabic.com/en/careers' },
  { match: ['kapsarc'], name: { ar: 'كابسارك', en: 'KAPSARC' }, url: 'https://www.kapsarc.org/careers/' },
  { match: ['saudi national bank', 'snb', 'al ahli'], name: { ar: 'البنك الأهلي السعودي', en: 'Saudi National Bank' }, url: 'https://www.alahli.com/en-us/careers' },
  { match: ['stc'], name: { ar: 'stc', en: 'stc' }, url: 'https://www.stc.com.sa/content/stc/sa/en/personal/about-stc/careers.html' },
  { match: ['elm', 'علم'], name: { ar: 'علم', en: 'Elm' }, url: 'https://www.elm.sa/en/careers' },
  { match: ['mckinsey'], name: { ar: 'ماكنزي', en: 'McKinsey' }, url: 'https://www.mckinsey.com/careers' },
  { match: ['bcg', 'boston consulting'], name: { ar: 'بوسطن كونسلتنغ', en: 'BCG' }, url: 'https://careers.bcg.com' },
  { match: ['strategy&', 'pwc'], name: { ar: 'ستراتيجي&', en: 'Strategy&' }, url: 'https://www.strategyand.pwc.com/m1/en/careers.html' },
  { match: ['ministry of energy'], name: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' }, url: 'https://jadarat.sa' },
];

export function careersUrlFor(companyEn: string): string | undefined {
  const c = companyEn.toLowerCase();
  return companyCareers.find((e) => e.match.some((m) => c.includes(m)))?.url;
}

// A curated directory of ~60 Saudi employers, grouped by industry and tagged by size
// (big, medium, small). Links point to each company's official site (verify the live
// careers page before applying). Later this is filtered by the customer's CV.
export type CompanyIndustry = 'banking' | 'energy' | 'consulting' | 'tech' | 'giga' | 'consumer';
export type CompanySize = 'big' | 'medium' | 'small';
// Each industry maps to one HR-DB sector, so the directory is filtered to the
// customer's CV-derived sectors (the same source that drives their HR contacts).
export const companyIndustries: { id: CompanyIndustry; label: LS; sector: string }[] = [
  { id: 'banking', label: { ar: 'البنوك والتمويل', en: 'Banking and finance' }, sector: 'investment_finance' },
  { id: 'energy', label: { ar: 'الطاقة والصناعة', en: 'Energy and industry' }, sector: 'energy_petrochem' },
  { id: 'consulting', label: { ar: 'الاستشارات والخدمات', en: 'Consulting and services' }, sector: 'consulting' },
  { id: 'tech', label: { ar: 'التقنية والاتصالات', en: 'Tech and telecom' }, sector: 'tech_startups' },
  { id: 'giga', label: { ar: 'المشاريع الكبرى والعقار', en: 'Gigaprojects and real estate' }, sector: 'gigaprojects_realestate' },
  { id: 'consumer', label: { ar: 'الاستهلاك والصحة واللوجستيات', en: 'Consumer, health and logistics' }, sector: 'retail_fmcg' },
];
export const companyPortals: { name: LS; url: string; industry: CompanyIndustry; size: CompanySize }[] = [
  { name: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, url: 'https://www.pif.gov.sa', industry: 'banking', size: 'big' },
  { name: { ar: 'البنك الأهلي السعودي', en: 'Saudi National Bank' }, url: 'https://www.snb.com', industry: 'banking', size: 'big' },
  { name: { ar: 'مصرف الراجحي', en: 'Al Rajhi Bank' }, url: 'https://www.alrajhibank.com.sa', industry: 'banking', size: 'big' },
  { name: { ar: 'بنك الرياض', en: 'Riyad Bank' }, url: 'https://www.riyadbank.com', industry: 'banking', size: 'medium' },
  { name: { ar: 'البنك السعودي الأول', en: 'Saudi Awwal Bank' }, url: 'https://www.sab.com', industry: 'banking', size: 'medium' },
  { name: { ar: 'مصرف الإنماء', en: 'Alinma Bank' }, url: 'https://www.alinma.com', industry: 'banking', size: 'medium' },
  { name: { ar: 'جدوى للاستثمار', en: 'Jadwa Investment' }, url: 'https://www.jadwa.com', industry: 'banking', size: 'medium' },
  { name: { ar: 'سنابل', en: 'Sanabil' }, url: 'https://www.sanabil.com', industry: 'banking', size: 'medium' },
  { name: { ar: 'السوق المالية (تداول)', en: 'Saudi Exchange' }, url: 'https://www.saudiexchange.sa', industry: 'banking', size: 'medium' },
  { name: { ar: 'لندو', en: 'Lendo' }, url: 'https://www.lendo.com.sa', industry: 'banking', size: 'small' },
  { name: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' }, url: 'https://www.aramco.com', industry: 'energy', size: 'big' },
  { name: { ar: 'سابك', en: 'SABIC' }, url: 'https://www.sabic.com', industry: 'energy', size: 'big' },
  { name: { ar: 'معادن', en: "Ma'aden" }, url: 'https://www.maaden.com.sa', industry: 'energy', size: 'big' },
  { name: { ar: 'أكوا باور', en: 'ACWA Power' }, url: 'https://acwapower.com', industry: 'energy', size: 'big' },
  { name: { ar: 'الشركة السعودية للكهرباء', en: 'Saudi Electricity' }, url: 'https://www.se.com.sa', industry: 'energy', size: 'big' },
  { name: { ar: 'سبكيم', en: 'Sipchem' }, url: 'https://www.sipchem.com', industry: 'energy', size: 'medium' },
  { name: { ar: 'مرافق', en: 'Marafiq' }, url: 'https://www.marafiq.com.sa', industry: 'energy', size: 'medium' },
  { name: { ar: 'بترومين', en: 'Petromin' }, url: 'https://www.petromin.com', industry: 'energy', size: 'small' },
  { name: { ar: 'العبيكان', en: 'Obeikan' }, url: 'https://www.obeikan.com.sa', industry: 'energy', size: 'small' },
  { name: { ar: 'كابسارك', en: 'KAPSARC' }, url: 'https://www.kapsarc.org', industry: 'energy', size: 'small' },
  { name: { ar: 'ماكنزي وشركاه', en: 'McKinsey & Company' }, url: 'https://www.mckinsey.com', industry: 'consulting', size: 'big' },
  { name: { ar: 'مجموعة بوسطن الاستشارية', en: 'BCG' }, url: 'https://www.bcg.com', industry: 'consulting', size: 'big' },
  { name: { ar: 'بي دبليو سي الشرق الأوسط', en: 'PwC Middle East' }, url: 'https://www.pwc.com/m1', industry: 'consulting', size: 'big' },
  { name: { ar: 'ديلويت', en: 'Deloitte' }, url: 'https://www.deloitte.com', industry: 'consulting', size: 'medium' },
  { name: { ar: 'إرنست ويونغ', en: 'EY' }, url: 'https://www.ey.com', industry: 'consulting', size: 'medium' },
  { name: { ar: 'كي بي إم جي', en: 'KPMG' }, url: 'https://kpmg.com/sa', industry: 'consulting', size: 'medium' },
  { name: { ar: 'ستراتيجي&', en: 'Strategy&' }, url: 'https://www.strategyand.pwc.com', industry: 'consulting', size: 'medium' },
  { name: { ar: 'بين آند كومباني', en: 'Bain & Company' }, url: 'https://www.bain.com', industry: 'consulting', size: 'small' },
  { name: { ar: 'أوليفر وايمان', en: 'Oliver Wyman' }, url: 'https://www.oliverwyman.com', industry: 'consulting', size: 'small' },
  { name: { ar: 'كيرني', en: 'Kearney' }, url: 'https://www.kearney.com', industry: 'consulting', size: 'small' },
  { name: { ar: 'stc', en: 'stc' }, url: 'https://www.stc.com.sa', industry: 'tech', size: 'big' },
  { name: { ar: 'موبايلي', en: 'Mobily' }, url: 'https://www.mobily.com.sa', industry: 'tech', size: 'big' },
  { name: { ar: 'علم', en: 'Elm' }, url: 'https://www.elm.sa', industry: 'tech', size: 'big' },
  { name: { ar: 'سدايا', en: 'SDAIA' }, url: 'https://sdaia.gov.sa', industry: 'tech', size: 'medium' },
  { name: { ar: 'تحكم', en: 'Tahakom' }, url: 'https://www.tahakom.com', industry: 'tech', size: 'medium' },
  { name: { ar: 'لين', en: 'Lean' }, url: 'https://www.lean.sa', industry: 'tech', size: 'small' },
  { name: { ar: 'جيديا', en: 'Geidea' }, url: 'https://www.geidea.net', industry: 'tech', size: 'small' },
  { name: { ar: 'فودكس', en: 'Foodics' }, url: 'https://www.foodics.com', industry: 'tech', size: 'small' },
  { name: { ar: 'سلة', en: 'Salla' }, url: 'https://salla.com', industry: 'tech', size: 'small' },
  { name: { ar: 'مزن', en: 'Mozn' }, url: 'https://mozn.sa', industry: 'tech', size: 'small' },
  { name: { ar: 'نيوم', en: 'NEOM' }, url: 'https://www.neom.com', industry: 'giga', size: 'big' },
  { name: { ar: 'البحر الأحمر العالمية', en: 'Red Sea Global' }, url: 'https://www.redseaglobal.com', industry: 'giga', size: 'big' },
  { name: { ar: 'روшن', en: 'ROSHN' }, url: 'https://www.roshn.sa', industry: 'giga', size: 'big' },
  { name: { ar: 'القدية', en: 'Qiddiya' }, url: 'https://www.qiddiya.com', industry: 'giga', size: 'big' },
  { name: { ar: 'شركة الدرعية', en: 'Diriyah Company' }, url: 'https://www.diriyah.sa', industry: 'giga', size: 'medium' },
  { name: { ar: 'الوطنية للإسكان', en: 'National Housing (NHC)' }, url: 'https://www.nhc.sa', industry: 'giga', size: 'medium' },
  { name: { ar: 'دار الأركان', en: 'Dar Al Arkan' }, url: 'https://www.daralarkan.com', industry: 'giga', size: 'medium' },
  { name: { ar: 'منتزه الملك سلمان', en: 'King Salman Park' }, url: 'https://www.kingsalmanpark.sa', industry: 'giga', size: 'medium' },
  { name: { ar: 'جبل عمر', en: 'Jabal Omar' }, url: 'https://www.jabalomar.com.sa', industry: 'giga', size: 'small' },
  { name: { ar: 'تطوير السودة', en: 'Soudah Development' }, url: 'https://soudah.sa', industry: 'giga', size: 'small' },
  { name: { ar: 'المراعي', en: 'Almarai' }, url: 'https://www.almarai.com', industry: 'consumer', size: 'big' },
  { name: { ar: 'الخطوط السعودية', en: 'Saudia' }, url: 'https://www.saudia.com', industry: 'consumer', size: 'big' },
  { name: { ar: 'نوبكو', en: 'Nupco' }, url: 'https://www.nupco.com', industry: 'consumer', size: 'medium' },
  { name: { ar: 'جاهز', en: 'Jahez' }, url: 'https://www.jahez.net', industry: 'consumer', size: 'medium' },
  { name: { ar: 'تمارا', en: 'Tamara' }, url: 'https://tamara.co', industry: 'consumer', size: 'small' },
  { name: { ar: 'تابي', en: 'Tabby' }, url: 'https://tabby.ai', industry: 'consumer', size: 'small' },
  { name: { ar: 'نعناع', en: 'Nana' }, url: 'https://nana.sa', industry: 'consumer', size: 'small' },
  { name: { ar: 'كالو', en: 'Calo' }, url: 'https://calo.app', industry: 'consumer', size: 'small' },
  { name: { ar: 'ساري', en: 'Sary' }, url: 'https://sary.com', industry: 'consumer', size: 'small' },
  { name: { ar: 'زد', en: 'Zid' }, url: 'https://zid.sa', industry: 'consumer', size: 'small' },
];

// Generic, founder-curated CV and interview guidance (the same for everyone).
export const cvGuide: LS[] = [
  { ar: 'صفحة واحدة أو صفحتان كحد أقصى، بترتيب أنيق وثابت.', en: 'One page, two at most, with clean consistent formatting.' },
  { ar: 'ابدأ كل نقطة بفعل قوي وأرفقها برقم أو أثر قابل للقياس.', en: 'Start each bullet with a strong verb and a measurable result.' },
  { ar: 'رتّب الأكثر صلة بالوظيفة في الأعلى، واحذف الحشو.', en: 'Put the most role-relevant items first; cut filler.' },
  { ar: 'طابق كلمات السيرة مع كلمات الإعلان الوظيفي.', en: 'Mirror keywords from the specific job posting.' },
  { ar: 'راجع الأخطاء الإملائية واطلب من شخص آخر مراجعتها.', en: 'Proofread for typos and have someone else review it.' },
  { ar: 'سيرة بالإنجليزية للشركات العالمية والاستشارات، وبالعربية لبعض الجهات الحكومية.', en: 'English CV for MNCs/consulting, Arabic for some government bodies.' },
];

export const interviewTips: LS[] = [
  { ar: 'ابحث عن الشركة ومشاريعها الحديثة قبل المقابلة.', en: 'Research the company and its recent projects beforehand.' },
  { ar: 'استخدم أسلوب STAR (موقف، مهمة، إجراء، نتيجة) للأسئلة السلوكية.', en: 'Use the STAR method (Situation, Task, Action, Result) for behavioral questions.' },
  { ar: 'جهّز قصتك: لماذا هذا الدور ولماذا الآن.', en: 'Prepare your story: why this role and why now.' },
  { ar: 'اعرف سيرتك جيدًا واستعد لشرح أي بند فيها.', en: 'Know your CV cold and be ready to explain any line.' },
  { ar: 'للاستشارات: تدرّب على دراسات الحالة. للأدوار التقنية: راجع الأساسيات.', en: 'Consulting: practice cases. Technical roles: review fundamentals.' },
  { ar: 'حضّر أسئلة ذكية تطرحها، وأرسل رسالة شكر بعد المقابلة.', en: 'Prepare smart questions to ask, and send a thank-you afterward.' },
];

/* ---------------------------------------------------------------- referral -- */
// A referred friend lands on the MARKETING site (not a dashboard) with a code, so
// they sign up and get 20% off. Enforcing the discount needs Moyasar checkout.

export function referralCode(slug: string): string {
  return (slug.split('-')[0] || slug).toUpperCase();
}

export function referralLink(origin: string, locale: Loc, slug: string): string {
  return `${origin}/${locale}?ref=${referralCode(slug)}`;
}

/* ------------------------------------------------------------------- ui copy -- */

export const ui = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    paths: { ar: 'المسارات', en: 'Paths' },
    contacts: { ar: 'التواصل', en: 'Contacts' },
    tracker: { ar: 'الدراسات', en: 'Study' },
    opportunities: { ar: 'مصادر', en: 'Resources' },
  },
  shell: {
    greeting: { ar: 'أهلًا بعودتك', en: 'Welcome back' },
    disclaimer: { ar: 'تأكد من التفاصيل قبل أي خطوة، فقد نخطئ في أمرٍ ما.', en: 'Double-check the details before you act, we might get something wrong.' },
    disclaimerWarm: { ar: 'مستقبلك يهمّنا!', en: 'Your future matters to us!' },
    proLockTitle: { ar: 'هذه ميزة Pro', en: 'A Pro feature' },
    proLockBody: { ar: 'هذه الصفحة ضمن باقة Pro. رقِّ باقتك لفتح الدراسات العليا والمصادر.', en: 'This page is part of the Pro plan. Upgrade to unlock graduate study and resources.' },
    plan: { ar: 'الباقة الاحترافية', en: 'Pro plan' },
    journey: { ar: 'إنجاز خطتك المهنية', en: 'Your plan progress' },
    demoBadge: { ar: 'خطتك أنت', en: 'Your plan' },
  },
  overview: {
    eyebrow: { ar: 'لوحتك', en: 'Your dashboard' },
    title: { ar: 'خطتك المهنية كاملة، في مكان واحد', en: 'Your whole career plan, in one place' },
    journeyLabel: { ar: 'من خطتك', en: 'of your plan' },
    certsLabel: { ar: 'شهادات أنجزتها', en: 'Certifications done' },
    sentLabel: { ar: 'جهات تواصلت معها', en: 'Contacts reached' },
    repliesLabel: { ar: 'ردود وصلتك', en: 'Replies' },
    nextMove: {
      eyebrow: { ar: 'خطوتك التالية', en: 'Your next move' },
      connectTitle: { ar: 'اربط شبكتك', en: 'Connect your network' },
      connectDesc: { ar: 'ارفع جهات اتصالك لنُظهر أقرب الأشخاص إلى أهدافك.', en: 'Upload your connections to surface the warmest intros.' },
      reachTitle: { ar: 'تواصل اليوم', en: 'Reach out today' },
      reachDesc: { ar: (n: number) => `${n} من شبكتك جاهزون للتواصل الآن.`, en: (n: number) => `${n} people from your network are ready now.` },
      certTitle: { ar: 'واصل تقدّمك', en: 'Keep your momentum' },
      certDesc: { ar: (c: string) => `أكمل شهادتك الحالية: ${c}.`, en: (c: string) => `Continue your current certification: ${c}.` },
    },
    networkTitle: { ar: 'شبكتك', en: 'Your network' },
    networkCount: { ar: (n: number) => `${n} جهة مرتّبة حسب قربها من أهدافك`, en: (n: number) => `${n} connections ranked by fit` },
    networkEmpty: { ar: 'لم ترفع شبكتك بعد', en: 'No network uploaded yet' },
    customize: { ar: 'تخصيص', en: 'Customize' },
    customizeTitle: { ar: 'خصّص صفحتك', en: 'Customize your home' },
    customizeSub: { ar: 'اختر البطاقات التي تظهر هنا.', en: 'Choose which cards appear here.' },
    doneBtn: { ar: 'تم', en: 'Done' },
    wNextMove: { ar: 'خطوتك التالية', en: 'Next move' },
    wNetwork: { ar: 'شبكتك', en: 'Your network' },
    wCvReview: { ar: 'مراجعة السيرة', en: 'CV review' },
    wStats: { ar: 'الأرقام', en: 'Stats' },
    wPicks: { ar: 'تواصل اليوم', en: "Today's picks" },
    wGoal: { ar: 'هدف الأسبوع', en: 'Weekly goal' },
    wSnapshot: { ar: 'ملخّص التتبّع', en: 'Outreach snapshot' },
    wCert: { ar: 'شهادتك الحالية', en: 'Current certification' },
    wCareerDay: { ar: 'أقرب يوم مهني', en: 'Next career day' },
    certPeekTitle: { ar: 'شهادتك الحالية', en: 'Your current certification' },
    careerDayTitle: { ar: 'أقرب يوم مهني', en: 'Next career day' },
    goalTitle: { ar: 'هدف هذا الأسبوع', en: "This week's goal" },
    goalHint: { ar: (a: number, b: number) => `${a} من ${b} تواصلات`, en: (a: number, b: number) => `${a} of ${b} reach-outs` },
    goalDone: { ar: 'أنجزت هدف الأسبوع 🎉', en: "You hit this week's goal 🎉" },
    snapshotTitle: { ar: 'ملخّص تواصلك', en: 'Outreach snapshot' },
    scoreLabel: { ar: 'درجة تنافسية سيرتك', en: 'Your CV competitiveness' },
    scoreFor: { ar: 'لهدف', en: 'for' },
    levelLabel: { ar: 'المستوى الوظيفي المستهدف', en: 'Target seniority' },
    levelHint: { ar: 'درجتك تتغيّر حسب المستوى الذي تستهدفه', en: 'Your score changes with the level you aim for' },
    improvementsTitle: { ar: 'ما الذي يرفع درجتك', en: 'What raises your score' },
    scoreFactorsTitle: { ar: 'ما الذي يبني درجتك', en: "What's behind your score" },
    strengthStrong: { ar: 'قوي', en: 'Strong' },
    strengthGood: { ar: 'جيد', en: 'Good' },
    strengthGrowing: { ar: 'قيد البناء', en: 'Growing' },
    quickWin: { ar: 'أسرع مكسب', en: 'Quickest win' },
    reachable: { ar: 'درجتك إن أكملت هذه الخطوات', en: 'Your reachable score' },
    areasTitle: { ar: 'أعلى مساراتك', en: 'Your top areas' },
    areasSub: { ar: 'مرتّبة حسب درجتك التنافسية فيها', en: 'Ranked by your competitiveness' },
    tipTitle: { ar: 'أهمّ خطوة اليوم', en: "Today's top move" },
    tip: {
      ar: 'أسرع مكسب اليوم: أعد صياغة أبرز 3 إنجازات بصيغة مالية لرفع درجتك +6 فورًا.',
      en: 'Your quickest win today: reframe your top 3 bullets for finance to add +6 to your score now.',
    },
    actionsTitle: { ar: 'ابدأ بهؤلاء اليوم', en: 'Start with these today' },
    actionsSub: { ar: 'من شبكتك، تتجدّد يوميًا', en: 'From your network, refreshed daily' },
    openContacts: { ar: 'كل صنّاع القرار', en: 'All decision-makers' },
    nextCert: { ar: 'شهادتك الحالية', en: 'Your current certification' },
  },
  paths: {
    eyebrow: { ar: 'مساراتك المهنية', en: 'Your career paths' },
    title: { ar: 'خمسة مسارات مبنية على سيرتك', en: 'Five paths built on your CV' },
    sub: {
      ar: 'افتح أيّ مسار لترى خارطة شهاداته، وما تضيفه كل شهادة لدرجتك، وأهم من تتواصل معه.',
      en: 'Open any path for its certification roadmap, what each adds to your score, and who to reach out to.',
    },
    score: { ar: 'الدرجة', en: 'Score' },
    scoreOf: { ar: 'من 100', en: 'of 100' },
    primary: { ar: 'مسارك الرئيسي', en: 'Primary path' },
    roadmap: { ar: 'خارطة الشهادات', en: 'Roadmap' },
    open: { ar: 'افتح المسار', en: 'Open path' },
    statCerts: { ar: 'شهادات', en: 'certs' },
    statMonths: { ar: 'شهرًا', en: 'months' },
    back: { ar: 'كل المسارات', en: 'All paths' },
    progress: { ar: 'تقدّم المسار', en: 'Path progress' },
    totalScore: { ar: 'إجمالي ما يضيفه لدرجتك', en: 'Total score boost' },
    picksTitle: { ar: 'ابدأ بهؤلاء الخمسة', en: 'Start with these five' },
    picksSub: {
      ar: 'الأعلى منصبًا، ومن تشاركهم قاسمًا مشتركًا, مع رسالة جاهزة لكل واحد.',
      en: 'The most senior, and people you share common ground with, each with a ready message.',
    },
    kindTop: { ar: 'منصب رفيع', en: 'Senior' },
    kindMid: { ar: 'مستوى متوسط', en: 'Mid-level' },
    kindCommon: { ar: 'قاسم مشترك', en: 'Common ground' },
    roles: { ar: 'وظائف يفتحها هذا المسار', en: 'Roles this path opens' },
    forPromotions: { ar: 'لوظيفة جديدة أو ترقية', en: 'For a new role or a promotion' },
    setActive: { ar: 'اجعله مساري', en: 'Make this my path' },
    active: { ar: 'مسارك', en: 'Your path' },
  },
  certs: {
    title: { ar: 'خارطة الشهادات', en: 'Certification roadmap' },
    sub: { ar: 'مرتّبة بذكاء، مع ما تضيفه كل شهادة لدرجتك وتكلفتها بعد دعم هدف.', en: 'Smartly sequenced, with what each adds to your score and its cost after Hadaf.' },
    done: { ar: 'منجزة', en: 'Done' },
    current: { ar: 'الحالية', en: 'Current' },
    next: { ar: 'قادمة', en: 'Next' },
    hadaf: { ar: 'يدعمها هدف', en: 'Hadaf supported' },
    gain: { ar: 'ماذا تضيف لك', en: 'What it gives you' },
    scoreAdd: { ar: 'للدرجة', en: 'to score' },
    whyNow: { ar: 'لماذا الآن؟', en: 'Why now?' },
    official: { ar: 'الموقع الرسمي', en: 'Official site' },
    markDone: { ar: 'تحديد كمنجزة', en: 'Mark done' },
    markedDone: { ar: 'منجزة', en: 'Done' },
    bannerSub: { ar: 'تسترجع نحو نصف تكلفة كل شهادة معتمدة عبر هدف.', en: 'Reclaim about half of each approved certification via Hadaf.' },
    opens: { ar: 'يفتح أبواب', en: 'Opens doors to' },
  },
  contacts: {
    eyebrow: { ar: 'التواصل', en: 'Outreach' },
    title: { ar: 'تواصل مع من يقرّر', en: 'Reach the people who decide' },
    sub: {
      ar: 'صنّاع القرار للتواصل المباشر، والموارد البشرية للتقديم الرسمي. كل اسم مع رسالة جاهزة بصوتك.',
      en: 'Decision-makers for direct outreach, HR for the official application. Each with a ready message in your voice.',
    },
    tabConnections: { ar: 'صنّاع القرار', en: 'Connections' },
    tabHr: { ar: 'الموارد البشرية', en: 'HR' },
    connectionsHint: { ar: 'أهم الجهات للتواصل المباشر', en: 'Top targets for direct outreach' },
    hrHint: { ar: 'مسؤولو التوظيف · البوابة الرسمية', en: 'Recruiters · the official channel' },
    placeholderNote: { ar: 'نعرض لك مسؤولي توظيف من قاعدتنا مؤقتًا. ارفع جهات اتصالك في لينكدإن لتظهر أقرب الأشخاص إلى أهدافك للتواصل معهم أولًا.', en: 'Showing recruiters from our database for now. Upload your LinkedIn connections to reveal the warmest intros to reach out to first.' },
    outreachLog: { ar: 'متابعة رسائلك', en: 'Your outreach' },
    reachedLabel: { ar: 'تواصلت معهم', en: 'reached' },
    reachedOf: { ar: (a: number, b: number) => `${a} من ${b}`, en: (a: number, b: number) => `${a} of ${b}` },
    industry: { ar: 'المجال', en: 'Industry' },
    allIndustries: { ar: 'كل المجالات', en: 'All industries' },
    search: { ar: 'ابحث بالاسم أو الشركة…', en: 'Search by name or company…' },
    recruiter: { ar: 'توظيف', en: 'Recruiter' },
    messagePreview: { ar: 'رسالة جاهزة', en: 'Ready message' },
    copy: { ar: 'نسخ', en: 'Copy' },
    copied: { ar: 'تم النسخ', en: 'Copied' },
    shuffle: { ar: 'صيغة أخرى', en: 'Shuffle' },
    linkedin: { ar: 'لينكدإن', en: 'LinkedIn' },
    statusHint: { ar: 'حدّث الحالة بعد كل خطوة', en: 'Update the status after each step' },
    inNetwork: { ar: 'في شبكتك', en: 'In your network' },
    sameCompany: { ar: 'تعرف من في شركته', en: 'You know someone here' },
    sector: { ar: 'القطاع', en: 'Sector' },
    companySize: { ar: 'حجم الشركة', en: 'Company size' },
    allSectors: { ar: 'كل القطاعات', en: 'All sectors' },
    allSizes: { ar: 'كل الأحجام', en: 'All sizes' },
    handwrite: {
      ar: 'الأفضل أن تعيد صياغتها بأسلوبك!',
      en: 'Best to rewrite this in your own words!',
    },
    msgLangHint: { ar: 'لغة الرسالة', en: 'Message language' },
    showMore: { ar: (n: number) => `عرض المزيد (${n})`, en: (n: number) => `Show ${n} more` },
    showing: { ar: (a: number, b: number) => `تعرض ${a} من ${b}`, en: (a: number, b: number) => `Showing ${a} of ${b}` },
    inProgress: { ar: 'قيد المتابعة', en: 'In progress' },
    notContacted: { ar: 'لم تتواصل معهم بعد', en: 'Not contacted yet' },
    empty: { ar: 'لا نتائج مطابقة.', en: 'No matching results.' },
    status_new: { ar: 'جديد', en: 'New' },
    status_sent: { ar: 'مُرسل', en: 'Sent' },
    status_replied: { ar: 'ردّ', en: 'Replied' },
    status_followup: { ar: 'متابعة', en: 'Follow-up' },
  },
  network: {
    title: { ar: 'اربط شبكتك في لينكدإن', en: 'Connect your LinkedIn network' },
    body: {
      ar: 'ارفع ملف جهات اتصالك (Connections.csv) لنرتّب شبكتك ونُبرز أقرب الأشخاص إلى أهدافك للتواصل معهم أولًا. المقدمة الدافئة تتفوّق على الرسالة الباردة، والملف يبقى في متصفحك ولا نخزّنه.',
      en: 'Upload your Connections.csv so we can rank your network and surface the people closest to your targets to reach out to first. A warm intro beats a cold message, and the file stays in your browser; we never store it.',
    },
    note: { ar: 'يستغرق لينكدإن من 12 إلى 24 ساعة لإرسال الملف إلى بريدك.', en: 'LinkedIn takes 12 to 24 hours to email you the file.' },
    upload: { ar: 'ارفع Connections.csv', en: 'Upload Connections.csv' },
    matched: { ar: (n: number) => `حمّلنا ${n} جهة من شبكتك`, en: (n: number) => `Loaded ${n} of your connections` },
    ranked: { ar: 'رتّبنا الأقرب إلى أهدافك في الأعلى.', en: 'The closest matches to your targets are on top.' },
    none: { ar: 'لم نتعرّف على أي جهة, جرّب ملفًا آخر.', en: 'No connections found, try another file.' },
    clear: { ar: 'إزالة الملف', en: 'Clear file' },
    locked: { ar: 'ارفع جهات اتصالك لعرض أقرب من تعرفهم هنا', en: 'Upload your connections to reveal who you know here' },
    howPhone: { ar: '📱 من تطبيق الجوال', en: '📱 On the phone app' },
    howLaptop: { ar: '💻 من المتصفح', en: '💻 On a laptop' },
    phoneSteps: {
      ar: [
        'افتح تطبيق لينكدإن واضغط صورتك ثم «الإعدادات».',
        'اختر «خصوصية البيانات» ثم «الحصول على نسخة من بياناتك».',
        'اختر «جهات الاتصال» فقط، ثم «اطلب الأرشيف».',
        'خلال 12 إلى 24 ساعة يصلك بريد فيه رابط التحميل, نزّل Connections.csv ثم ارفعه هنا.',
      ],
      en: [
        'Open the LinkedIn app, tap your photo, then Settings.',
        'Go to Data privacy, then "Get a copy of your data".',
        'Pick "Connections" only, then Request archive.',
        'Within 12 to 24h you get an email with a download link, get Connections.csv and upload it here.',
      ],
    },
    laptopSteps: {
      ar: [
        'افتح linkedin.com واضغط «أنا» ثم «الإعدادات والخصوصية».',
        'من «خصوصية البيانات» اختر «الحصول على نسخة من بياناتك».',
        'اختر «جهات الاتصال» تحديدًا، ثم «اطلب الأرشيف».',
        'خلال 12 إلى 24 ساعة يصلك بريد فيه الرابط, نزّل Connections.csv ثم ارفعه هنا.',
      ],
      en: [
        'Open linkedin.com, click Me, then Settings & Privacy.',
        'Under Data privacy, choose "Get a copy of your data".',
        'Select "Connections" specifically, then Request archive.',
        'Within 12 to 24h you get an email with the link, download Connections.csv and upload it here.',
      ],
    },
  },
  tracker: {
    eyebrow: { ar: 'المتتبّع', en: 'Tracker' },
    title: { ar: 'سجلّك الشخصي', en: 'Your personal log' },
    sub: {
      ar: 'أنت تحدّث حالة كل تواصل بنفسك (لا نصل إلى لينكدإن)، وهنا تتجمّع أرقامك.',
      en: 'You update each outreach status yourself (we never touch LinkedIn); your numbers add up here.',
    },
    sent: { ar: 'جهات تواصلت معها', en: 'Contacts reached' },
    replied: { ar: 'ردود إيجابية', en: 'Positive replies' },
    ofRoadmap: { ar: 'من خارطتك', en: 'of your roadmap' },
    pending: { ar: 'بانتظار الردّ', en: 'Awaiting reply' },
    followup: { ar: 'تحتاج متابعة', en: 'Need follow-up' },
    replyRate: { ar: 'معدّل الردّ', en: 'Reply rate' },
    vsBenchmark: { ar: 'كل ما تحدّثه ينعكس هنا فورًا', en: 'Everything you log shows up here instantly' },
    breakdown: { ar: 'توزيع تواصلك', en: 'Your outreach breakdown' },
    empty: { ar: 'حدّث حالة كل تواصل من بطاقات «التواصل»، وستظهر أرقامك هنا.', en: 'Update each outreach from the Contacts cards and your numbers appear here.' },
    progressTitle: { ar: 'تقدّمك', en: 'Your progress' },
    certsDoneLabel: { ar: 'شهادات أنجزتها', en: 'Certifications done' },
    certsLeftLabel: { ar: 'شهادات متبقية', en: 'Certifications left' },
    outreachLabel: { ar: 'جهات تواصلت معها', en: 'Contacts reached' },
    prepTitle: { ar: 'استعد', en: 'Prepare' },
    prepSub: { ar: 'جهّز سيرتك ومقابلاتك قبل التواصل.', en: 'Sharpen your CV and interviews before you reach out.' },
  },
  study: {
    eyebrow: { ar: 'الدراسات العليا', en: 'Graduate study' },
    title: { ar: 'ارفع مؤهلك بدرجة عليا', en: 'Level up with a graduate degree' },
    sub: { ar: 'خيارات سعودية بدوام جزئي وأنت تعمل، ودرجات بدوام كامل في جامعات قوية يمكنك الوصول إليها فعلًا.', en: 'Saudi part-time options while you work, and full-time degrees at strong universities you can realistically reach.' },
    chosenFor: { ar: (p: string) => `اختيرت لتناسب مسارك: ${p}`, en: (p: string) => `Chosen to fit your path: ${p}` },
    majorsLabel: { ar: 'تخصصات تناسب مسارك', en: 'Majors that fit your path' },
    fullTimeTitle: { ar: 'بدوام كامل', en: 'Full-time degrees' },
    fullTimeSub: { ar: 'جامعات قوية في متناولك فعلًا، من الأصعب إلى الأسهل قبولًا', en: 'Strong universities you can realistically reach, hardest to easiest' },
    partTimeTitle: { ar: 'في السعودية', en: 'In Saudi Arabia' },
    partTimeSub: { ar: 'ادرس وأنت تعمل، أقرب خيارين إليك', en: 'Study while you work, your two nearest options' },
    partTimeHow: { ar: 'برامج تنفيذية تُقام مساءً أو نهاية الأسبوع، فتدرس وأنت محتفظ بوظيفتك، عادةً خلال سنتين إلى ثلاث.', en: 'Executive programs run evenings or weekends, so you study while keeping your job, usually over two to three years.' },
    degreeWord: { diploma: { ar: 'دبلوم في', en: 'Diploma in' }, bachelor: { ar: 'بكالوريوس في', en: "Bachelor's in" }, master: { ar: 'ماجستير في', en: "Master's in" }, phd: { ar: 'دكتوراه في', en: 'PhD in' } },
    tierHigh: { ar: 'عالمية، صعبة القبول', en: 'World class, hard to get in' },
    tierRespected: { ar: 'مرموقة ومعروفة', en: 'Respected and well known' },
    tierSolid: { ar: 'خيار قوي', en: 'A solid choice' },
    tierAccessible: { ar: 'أسهل قبولًا', en: 'Easier to get into' },
    nearYou: { ar: 'الأقرب', en: 'Nearest' },
    majorsHere: { ar: 'تخصصات متاحة هنا', en: 'Majors here' },
    pioneersBadge: { ar: 'رواد', en: 'Pioneers' },
    imdadBadge: { ar: 'إمداد', en: 'Imdad' },
    pioneersNote: { ar: 'جامعات أفضل 30 مؤهّلة لمنحة رواد (مضمونة)، والبقية ضمن أفضل 200 مؤهّلة لإمداد (غير مضمونة).', en: 'Top-30 schools qualify for Pioneers (guaranteed); the rest, in the top 200, qualify for Imdad (not guaranteed).' },
    deadlineLabel: { ar: 'الموعد النهائي', en: 'Deadline' },
    deadlineUS: { ar: 'ديسمبر', en: 'December' },
    deadlineUK: { ar: 'أبريل إلى مايو', en: 'April to May' },
    deadlineOther: { ar: 'يختلف، تحقق من الموقع', en: 'varies, check the site' },
    essentialsTitle: { ar: 'قبل التقديم', en: 'Before you apply' },
    reqLabel: { ar: 'المتطلبات', en: 'Requirements' },
    timelineLabel: { ar: 'الجدول الزمني', en: 'Timeline' },
    fundingLabel: { ar: 'التمويل', en: 'Funding' },
    reqBrief: { ar: ['معدل تراكمي جيد، عادةً 3.0 من 4 فأعلى', 'اختبار لغة: آيلتس 6.5 أو توفل 90', 'توصيات وخطاب أهداف (مقال قصير عن طموحك)', 'بعض البرامج تطلب GMAT أو GRE'], en: ['A good GPA, usually 3.0 out of 4 or higher', 'English test: IELTS 6.5 or TOEFL 90', 'References and a statement of purpose (a short goals essay)', 'Some programs also ask for the GMAT or GRE'] },
    timelineBrief: { ar: ['جهّز قبل 9 إلى 12 شهرًا', 'المواعيد تختلف حسب الدولة، مذكورة في كل بطاقة', 'أنجز اختبارات اللغة وGMAT مبكرًا'], en: ['Prepare 9 to 12 months ahead', 'Deadlines differ by country, shown on each card', 'Sit language and GMAT tests early'] },
    fundingBrief: { ar: ['منحة حكومية', 'رواد: قبول من أفضل 30، مضمونة', 'إمداد: قبول من أفضل 200، غير مضمونة'], en: ['Government scholarship', 'Pioneers: a top-30 offer, guaranteed', 'Imdad: a top-200 offer, not guaranteed'] },
    viewProgram: { ar: 'صفحة البرنامج', en: 'Program page' },
    worthItTitle: { ar: 'هل تستحق الدراسة العليا؟', en: 'Is a graduate degree worth it?' },
    worthIt: { ar: 'لمسارك، الماجستير يرفع سقف راتبك ويفتح الأدوار القيادية أسرع، خاصة من جامعة قوية في مجالك. القرار يعتمد على هدفك ووقتك.', en: 'For your path, a master’s raises your ceiling and opens senior roles faster, especially from a university strong in your field. It comes down to your goal and your time.' },
    admissionsTitle: { ar: 'متطلبات القبول النموذجية', en: 'Typical admission requirements' },
    admissions: {
      ar: ['معدّل تراكمي جيد (3.0 من 4 فأعلى عادةً).', 'اختبار GMAT أو GRE لبعض البرامج.', 'إثبات لغة إنجليزية: IELTS 6.5 أو TOEFL 90 فأعلى.', 'خطابات توصية وبيان غرض وسيرة ذاتية.'],
      en: ['A solid GPA (usually 3.0 / 4 or higher).', 'GMAT or GRE for some programs.', 'English proof: IELTS 6.5 or TOEFL 90 and up.', 'Recommendation letters, a statement of purpose, and a CV.'],
    },
    timelineTitle: { ar: 'الجدول الزمني للتقديم', en: 'Application timeline' },
    timeline: {
      ar: ['ابدأ قبل 9 إلى 12 شهرًا من موعد البدء.', 'جهّز اختبارات اللغة وGMAT مبكرًا.', 'مواعيد التقديم غالبًا في الخريف للقبول التالي.', 'قدّم على المنح بالتوازي مع طلب القبول.'],
      en: ['Start 9 to 12 months before your intended start.', 'Sit language tests and the GMAT early.', 'Deadlines are often in the autumn for the next intake.', 'Apply for scholarships in parallel with admission.'],
    },
    fundingTitle: { ar: 'التمويل والدعم', en: 'Funding and support' },
    funding: {
      ar: [
        'برنامج «بعثتك» من وزارة التعليم للدراسة في أفضل الجامعات عالميًا.',
        'ابتعاث جهة عملك أو إجازة دراسية مدفوعة (شائع للبرامج بدوام جزئي).',
        'زمالة كاوست: رسوم كاملة وراتب شهري وسكن.',
        'منح التفوّق والمساعدات البحثية والتدريسية داخل الجامعة.',
      ],
      en: [
        'The Ministry of Education “Your Scholarship” (بعثتك) program for top global universities.',
        'Employer sponsorship or paid study leave (common while working).',
        'KAUST fellowship: full tuition, a monthly stipend, and housing.',
        'University merit scholarships and teaching or research assistantships.',
      ],
    },
  },
  cmd: {
    placeholder: { ar: 'ابحث أو انتقل…', en: 'Search or jump to…' },
    go: { ar: 'انتقال', en: 'Go' },
    openPath: { ar: 'افتح المسار', en: 'Open path' },
  },
  cvBlock: {
    eyebrow: { ar: 'مراجعة سيرتك', en: 'Your CV review' },
    strengths: { ar: 'نقاط قوتك', en: "What's working" },
    needsPolish: { ar: 'تحتاج إلى تحسين', en: 'Needs polish' },
    markFixed: { ar: 'تم الإصلاح', en: 'Mark fixed' },
    fixed: { ar: 'تم', en: 'Fixed' },
    polished: { ar: 'سيرتك مصقولة بالكامل', en: 'Your CV is fully polished' },
    polishProgress: { ar: (a: number, b: number) => `أصلحت ${a} من ${b}`, en: (a: number, b: number) => `${a} of ${b} fixed` },
    gapsTitle: { ar: 'ما الذي ينقصك للمستوى المستهدف', en: 'What you need for your target level' },
    experience: { ar: 'الخبرة', en: 'Experience' },
    certNeeded: { ar: 'شهادة مطلوبة', en: 'Certification' },
    other: { ar: 'أخرى', en: 'Also' },
    ready: { ar: 'أنت جاهز لهذا المستوى, لا فجوات تذكر!', en: "You're ready for this level, no real gaps!" },
  },
  opp: {
    eyebrow: { ar: 'فرص ومصادر', en: 'Opportunities & resources' },
    title: { ar: 'أبعد من الشهادات', en: 'Beyond the certifications' },
    sub: { ar: 'برامج حكومية، أيام مهنية، دراسات عليا، وبوابات التوظيف الرسمية، مع نصائح جاهزة.', en: 'Government programs, career days, graduate study, official job portals, plus ready tips.' },
    tamheerTitle: { ar: 'برنامج تمهير', en: 'Tamheer program' },
    tamheerDesc: { ar: 'تدريب على رأس العمل للخريجين السعوديين عبر هدف، مع مكافأة شهرية.', en: 'On-the-job training for Saudi graduates via Hadaf, with a monthly reward.' },
    tamheerEligible: { ar: 'الشروط', en: 'Eligibility' },
    tamheerApply: { ar: 'سجّل في طاقات', en: 'Register on Taqat' },
    tamheerEntryHint: { ar: 'مناسب لك الآن كخرّيج في بداية المسار', en: 'A fit for you now as an early-career graduate' },
    careerDaysTitle: { ar: 'الأيام المهنية والمعارض', en: 'Career days & fairs' },
    careerDaysSub: { ar: 'تواريخ تقريبية، تحقّق من الموقع قبل الحضور.', en: 'Approximate timing, check the site before attending.' },
    relevantToYou: { ar: 'يناسب مجالك', en: 'Matches your field' },
    mastersTitle: { ar: 'الدراسات العليا', en: 'Graduate study' },
    mastersSub: { ar: 'برامج قوية في مجالك، الخيارات السعودية أولًا.', en: 'Strong programs in your field, Saudi options first.' },
    jobPortalsTitle: { ar: 'بوابات التوظيف', en: 'Where to apply' },
    portalsTitle: { ar: 'البوابات الرسمية', en: 'Official portals' },
    companyPortalsTitle: { ar: 'صفحات التوظيف في الشركات', en: 'Company career pages' },
    companyPortalsSub: { ar: 'مصنّفة حسب القطاع، مع حجم كل شركة.', en: 'Grouped by industry, with each company size.' },
    sizeBig: { ar: 'كبيرة', en: 'Large' },
    sizeMedium: { ar: 'متوسطة', en: 'Mid' },
    sizeSmall: { ar: 'صغيرة', en: 'Small' },
    apply: { ar: 'تقديم', en: 'Apply' },
    visit: { ar: 'زيارة', en: 'Visit' },
    cvGuideTitle: { ar: 'كيف تكتب سيرة قوية', en: 'How to write a strong CV' },
    interviewTitle: { ar: 'نصائح للمقابلات', en: 'Interview tips' },
    skillsTitle: { ar: 'مهارات مطلوبة تتعلّمها', en: 'In-demand skills to learn' },
    skillsSub: { ar: 'ابدأ بهذه المهارات لرفع قيمتك سريعًا.', en: 'Start with these to raise your value fast.' },
    learn: { ar: 'تعلّمها', en: 'Learn it' },
  },
  referral: {
    title: { ar: 'تعرف شخصًا يستحق فرصة أفضل؟', en: 'Know someone who deserves a better shot?' },
    body: { ar: 'أرسل له مسار، خطوته الأولى نحو وظيفته القادمة، ويحصل على خصم 30% عند الاشتراك عبر رابطك.', en: 'Send them Masaar, their first step to the next role. They get 30% off when they join through your link.' },
    yourLink: { ar: 'رابط الدعوة الخاص بك', en: 'Your invite link' },
    copy: { ar: 'انسخ الرابط', en: 'Copy link' },
    copied: { ar: 'تم النسخ', en: 'Copied' },
    share: { ar: 'مشاركة', en: 'Share' },
    pending: { ar: 'يُفعّل الخصم عند تشغيل الدفع.', en: 'The discount activates once checkout is live.' },
  },
  feedback: {
    title: { ar: 'رأيك يهمّنا', en: 'We value your feedback' },
    sub: { ar: 'كيف كانت تجربتك مع خطتك؟', en: 'How has your plan been so far?' },
    placeholder: { ar: 'اكتب ملاحظتك هنا…', en: 'Write your feedback here…' },
    rate: { ar: 'تقييمك', en: 'Your rating' },
    send: { ar: 'إرسال', en: 'Send' },
    thanks: { ar: 'شكرًا لك! وصلتنا ملاحظتك.', en: 'Thank you! We got your feedback.' },
  },
} as const;
