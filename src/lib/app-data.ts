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

export const profile = {
  name: { ar: 'علي الأجود', en: 'Ali Alajwad' } satisfies LS,
  headline: {
    ar: 'مهندس عمليات · ماجستير اقتصاديات الطاقة من كورنيل',
    en: 'Operations Engineer · M.Eng Energy Economics, Cornell',
  } satisfies LS,
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
export const TIER_CAP = { starter: 100, pro: 300 } as const;
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
  accent: AccentKey;
  icon: 'finance' | 'energy' | 'consulting' | 'government' | 'tech';
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
    accent: 'brand',
    icon: 'finance',
    months: 16,
    scoreByLevel: { entry: 88, mid: 72, senior: 52, director: 34 },
    primary: true,
    trail: { ar: 'تمويل المناخ → CME-1 → FMVA → CFA L1 → CFA L2', en: 'Climate Finance → CME-1 → FMVA → CFA L1 → CFA L2' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والتمويل المستدام وأسواق الكربون من مدرسة كابسارك للسياسة العامة. يربط خبرتك في الطاقة بلغة الاستثمار والـ ESG، وهي ميزة نادرة في سوق صناديق تحوّل الطاقة.', en: 'KAPSARC’s climate finance, sustainable finance, and carbon-markets program. It connects your energy background to the language of investment and ESG, a rare edge in the energy-transition fund market.' }, gain: { ar: 'يربط خبرتك في الطاقة بعالم الاستثمار المستدام', en: 'Bridges your energy background into sustainable investing' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'CME-1', en: 'CME-1' }, desc: { ar: 'الشهادة التأسيسية من المعهد المالي، وهي مطلب تنظيمي للعمل في الأسواق المالية السعودية. تغطّي أساسيات الأنظمة والمنتجات المالية وقواعد هيئة السوق المالية — خطوتك الأولى نحو دور استثماري معتمد.', en: 'The Financial Academy’s foundational license, a regulatory requirement to work in Saudi capital markets. It covers financial regulations, products, and CMA rules — your first step toward an accredited investment role.' }, gain: { ar: 'ترخيص للعمل في الأسواق المالية السعودية', en: 'License to work in Saudi capital markets' }, scoreAdd: 6, official: 'https://fa.gov.sa', status: 'current', cost: { ar: '2,000 ر.س', en: '2,000 SAR' }, duration: { ar: '6–8 أسابيع', en: '6–8 weeks' }, hadaf: true, hadafNote: { ar: 'يدعمها صندوق هدف', en: 'Hadaf-supported' }, why: { ar: 'أسرع خطوة معتمدة تنقلك رسميًا إلى مسار الاستثمار، وتؤهّلك لأدوار الأسواق العامة في الصندوق. ابدأ بها قبل CFA.', en: 'The fastest accredited step that formally moves you into the investment track and qualifies you for PIF public-markets roles. Do it before the CFA.' } },
      { name: { ar: 'FMVA', en: 'FMVA' }, desc: { ar: 'برنامج معهد تمويل الشركات لبناء النماذج المالية وتقييم الشركات. عملي بالكامل: تتخرّج منه قادرًا على بناء نموذج مالي متكامل من الصفر، وهي المهارة الأكثر طلبًا في فرق الاستثمار والصفقات.', en: 'CFI’s hands-on program for financial modeling and company valuation. You finish able to build a full model from scratch — the most in-demand skill on investment and deals teams.' }, gain: { ar: 'إتقان النمذجة المالية المطلوبة في الصفقات', en: 'Deal-grade financial modeling skills' }, scoreAdd: 8, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'CFA المستوى الأول', en: 'CFA Level 1' }, desc: { ar: 'المستوى الأول من شهادة محلل مالي معتمد، المعيار العالمي الأرفع في إدارة الاستثمار. يغطّي الأخلاقيات والأدوات الكمية والاقتصاد وتحليل القوائم المالية، وهو حجر الأساس لأي دور استثماري في الصندوق.', en: 'Level 1 of the Chartered Financial Analyst program, the global gold standard in investment management. It spans ethics, quantitative methods, economics, and financial reporting — the foundation for any investment role at PIF.' }, gain: { ar: 'المعيار الذهبي لوظائف الاستثمار في الصندوق', en: 'The gold standard for PIF investment roles' }, scoreAdd: 15, official: CFA, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '6 أشهر · 300 ساعة', en: '6 months · 300h' }, hadaf: true, hadafNote: { ar: 'تسترجع نحو 2,750 ر.س عبر هدف', en: 'Reclaim ~2,750 SAR via Hadaf' } },
      { name: { ar: 'CFA المستوى الثاني', en: 'CFA Level 2' }, desc: { ar: 'المستوى المتقدّم من برنامج CFA، ويركّز على تطبيق أدوات التقييم على فئات الأصول المختلفة. اجتيازه يضعك في نخبة المحللين ويفتح الأدوار القيادية في صناديق الاستثمار.', en: 'The advanced CFA level, focused on applying valuation tools across asset classes. Passing it puts you among elite analysts and opens senior fund roles.' }, gain: { ar: 'يفتح الأدوار القيادية في صناديق الاستثمار', en: 'Opens senior investment-fund roles' }, scoreAdd: 12, official: CFA, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '8 أشهر', en: '8 months' }, hadaf: true },
    ],
    targetCompanies: ['Public Investment Fund', 'PIF', 'KAPSARC', 'Saudi National Bank', 'Sanabil', 'Jadwa', 'NEOM'],
  },
  {
    id: 'power-renewables',
    name: { ar: 'هندسة الطاقة والمتجددة', en: 'Power & Renewables Engineering' },
    targets: { ar: 'أرامكو · أكوا باور · تحلية المياه · نيوم', en: 'Aramco · ACWA · Water Authority · NEOM' },
    accent: 'sky',
    icon: 'energy',
    months: 12,
    scoreByLevel: { entry: 90, mid: 70, senior: 50, director: 32 },
    trail: { ar: 'التناضح العكسي → الطاقة الشمسية → PMP → CEM → Six Sigma', en: 'Reverse Osmosis → Solar PV → PMP → CEM → Six Sigma' },
    certs: [
      { name: { ar: 'التناضح العكسي', en: 'Reverse Osmosis' }, desc: { ar: 'شهادة مهندس متخصص في التناضح العكسي من أكاديمية المياه. تثبت خبرتك التشغيلية في أكبر محطات التحلية — أساس قوي لأدوار الطاقة والمياه.', en: 'Reverse Osmosis Specialist Engineer from the Water Academy. It certifies your operational expertise at the largest desalination plants — a strong base for power and water roles.' }, gain: { ar: 'تثبت خبرتك في أكبر محطات التحلية', en: 'Certifies your large-scale desalination expertise' }, scoreAdd: 7, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'تصميم الطاقة الشمسية', en: 'Solar PV Design' }, desc: { ar: 'مصمم أنظمة طاقة شمسية معتمد من أكاديمية المياه. يضيف تصميم المتجددة إلى خبرتك في التوليد التقليدي.', en: 'Certified Solar PV Designer from the Water Academy. It adds renewables design to your conventional-generation experience.' }, gain: { ar: 'تصميم المتجددة المطلوب في أكوا ونيوم', en: 'Renewables design valued at ACWA and NEOM' }, scoreAdd: 6, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'شهادة محترف إدارة المشاريع من معهد PMI، الأكثر اعترافًا عالميًا. لقيادة مشاريع الطاقة الكبرى في أرامكو وأكوا باور ومشاريع رؤية 2030.', en: 'PMI’s Project Management Professional, the most globally recognized PM credential — for leading major energy projects at Aramco, ACWA Power, and Vision 2030.' }, gain: { ar: 'يؤهّلك لقيادة مشاريع الطاقة الكبرى', en: 'Qualifies you to lead major energy projects' }, scoreAdd: 10, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'current', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'CEM', en: 'CEM' }, desc: { ar: 'مدير طاقة معتمد من جمعية مهندسي الطاقة (AEE). يثبت قدرتك على تحليل استهلاك الطاقة وتصميم حلول الكفاءة.', en: 'Certified Energy Manager from the AEE. It proves you can analyze energy use and design efficiency solutions.' }, gain: { ar: 'خبرة معتمدة في كفاءة الطاقة', en: 'Certified energy-efficiency expertise' }, scoreAdd: 9, official: 'https://www.aeecenter.org/certified-energy-manager-cem/', status: 'future', cost: { ar: '$1,500', en: '$1,500' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'Six Sigma', en: 'Six Sigma' }, desc: { ar: 'الحزام الأخضر في منهجية ستة سيجما لتحسين العمليات وتقليل الهدر، وهي منهجية تعتمدها أرامكو وكبرى الشركات الصناعية.', en: 'Green Belt in Six Sigma for process improvement and waste reduction — relied on by Aramco and major industrial firms.' }, gain: { ar: 'تحسين العمليات المطلوب في أرامكو', en: 'Process improvement valued at Aramco' }, scoreAdd: 7, official: 'https://asq.org/cert/six-sigma-green-belt', status: 'future', cost: { ar: '2,500 ر.س', en: '2,500 SAR' }, duration: { ar: 'شهران', en: '2 months' }, hadaf: true },
    ],
    targetCompanies: ['Saudi Aramco', 'Aramco', 'ACWA Power', 'NEOM', 'Water Authority', 'SWCC', 'Marafiq', 'SABIC'],
  },
  {
    id: 'consulting',
    name: { ar: 'استشارات الطاقة والاستراتيجية', en: 'Energy Strategy Consulting' },
    targets: { ar: 'ماكنزي · BCG · ستراتيجي&', en: 'McKinsey · BCG · Strategy&' },
    accent: 'violet',
    icon: 'consulting',
    months: 12,
    scoreByLevel: { entry: 74, mid: 56, senior: 40, director: 26 },
    trail: { ar: 'مهارات الاستشارات → دراسات الحالة → GMAT → FMVA', en: 'Consulting Skills → Case Prep → GMAT → FMVA' },
    certs: [
      { name: { ar: 'مهارات الاستشارات', en: 'Consulting Skills' }, desc: { ar: 'برنامج مهارات الاستشارات الأساسية من مسرّعة مستشار. يمنحك إطار حلّ المشكلات والتواصل التنفيذي المطلوب في المقابلات.', en: 'Foundational consulting skills from the Mustashar accelerator. It gives you the problem-solving and executive-communication frame interviews demand.' }, gain: { ar: 'أساس حلّ المشكلات والتواصل التنفيذي', en: 'Problem-solving and executive-communication base' }, scoreAdd: 6, official: 'https://mustashar.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'إعداد دراسات الحالة', en: 'Case Prep' }, desc: { ar: 'تدريب مكثّف على حلّ دراسات الحالة، وهي جوهر مقابلات شركات الاستشارات. تتعلّم كيف تفكّك مشكلة عمل وتبني توصية منظّمة تحت الضغط.', en: 'Intensive case-interview training, the core of consulting hiring. You learn to break down a business problem and build a structured recommendation under pressure.' }, gain: { ar: 'تجتاز مقابلات الحالة في ماكنزي وBCG', en: 'Pass case interviews at McKinsey and BCG' }, scoreAdd: 9, official: 'https://www.preplounge.com/', status: 'current', cost: { ar: '$300', en: '$300' }, duration: { ar: 'شهران', en: '2 months' } },
      { name: { ar: 'GMAT', en: 'GMAT' }, desc: { ar: 'اختبار القبول المعياري لبرامج الإدارة العليا، وكثيرًا ما تطلبه شركات الاستشارات الكبرى. درجة قوية تعزّز ملفك.', en: 'The standardized admissions test for top management programs, often requested by major consulting firms. A strong score strengthens your profile.' }, gain: { ar: 'بوابة الاستشارات والـ MBA', en: 'Gateway to consulting and MBA' }, scoreAdd: 8, official: 'https://www.mba.com/exams/gmat-exam', status: 'future', cost: { ar: '$275', en: '$275' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'FMVA', en: 'FMVA' }, desc: { ar: 'برنامج النمذجة المالية والتقييم، يمنحك ثقلًا كمّيًا يقوّي ملفك أمام شركات الاستشارات. عملي ويغطّي بناء النماذج وتحليل الصفقات.', en: 'The financial modeling and valuation program, giving you quantitative weight that strengthens a consulting profile.' }, gain: { ar: 'تحليل كمّي يميّز ملفك الاستشاري', en: 'Quant edge for a consulting profile' }, scoreAdd: 8, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, desc: { ar: 'ماجستير إدارة الأعمال، يفتح أدوار ما بعد الاستشارات في القيادة والاستثمار، ويوسّع شبكتك بشكل كبير.', en: 'The MBA, opening post-consulting leadership and investment roles and widening your network.' }, gain: { ar: 'يفتح أدوار ما بعد الاستشارات', en: 'Opens post-consulting roles' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    targetCompanies: ['McKinsey', 'BCG', 'Boston Consulting', 'Strategy&', 'Bain', 'Kearney', 'Oliver Wyman', 'PwC'],
  },
  {
    id: 'government',
    name: { ar: 'سياسات الطاقة والقطاع الحكومي', en: 'Energy Policy & Government' },
    targets: { ar: 'وزارة الطاقة · كابسارك · رؤية 2030', en: 'Ministry of Energy · KAPSARC · Vision 2030' },
    accent: 'amber',
    icon: 'government',
    months: 18,
    scoreByLevel: { entry: 79, mid: 61, senior: 44, director: 28 },
    trail: { ar: 'تمويل المناخ → دبلوم السياسات → PMP → PgMP', en: 'Climate Finance → Policy Diploma → PMP → PgMP' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والاستدامة من كابسارك. يربط نمذجتك لمسار 2060 بأدوات السياسة والتمويل المناخي.', en: 'KAPSARC’s climate finance and sustainability program. It ties your 2060-pathway modeling to policy and climate-finance tools.' }, gain: { ar: 'يربط نمذجتك بالسياسة والتمويل المناخي', en: 'Links your modeling to climate policy and finance' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'دبلوم السياسات العامة', en: 'Public Policy Diploma' }, desc: { ar: 'دبلوم متخصّص في تحليل وصياغة السياسات العامة. يؤهّلك لمكاتب الاستراتيجية والتخطيط في الوزارات والهيئات.', en: 'A specialized diploma in public-policy analysis and design. It prepares you for strategy and planning offices in ministries and authorities.' }, gain: { ar: 'صياغة وتحليل سياسات الطاقة', en: 'Energy policy design and analysis' }, scoreAdd: 9, official: 'https://www.spsp.edu.sa/', status: 'current', cost: { ar: '5,000 ر.س', en: '5,000 SAR' }, duration: { ar: '5 أشهر', en: '5 months' }, hadaf: true },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'محترف إدارة المشاريع من PMI، لقيادة مشاريع التحول ضمن رؤية 2030 داخل الجهات الحكومية.', en: 'PMI’s Project Management Professional, for leading Vision 2030 transformation projects in government.' }, gain: { ar: 'قيادة مشاريع رؤية 2030', en: 'Lead Vision 2030 projects' }, scoreAdd: 9, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'PgMP', en: 'PgMP' }, desc: { ar: 'محترف إدارة البرامج من PMI، المستوى الأعلى من PMP، لقيادة محافظ المشاريع على مستوى المؤسسة.', en: 'PMI’s Program Management Professional, above PMP — for leading enterprise-level project portfolios.' }, gain: { ar: 'إدارة برامج الطاقة الكبرى', en: 'Manage large energy programs' }, scoreAdd: 8, official: 'https://www.pmi.org/certifications/program-management-pgmp', status: 'future', cost: { ar: '$800', en: '$800' }, duration: { ar: '4 أشهر', en: '4 months' } },
      { name: { ar: 'دكتوراه إدارة الأعمال', en: 'DBA' }, desc: { ar: 'دكتوراه إدارة الأعمال، أعلى مؤهل تطبيقي للأدوار القيادية العليا في السياسات والاستراتيجية.', en: 'The Doctor of Business Administration, the top applied qualification for senior policy and strategy leadership.' }, gain: { ar: 'المؤهل الأعلى للقيادة', en: 'Top leadership credential' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '12 شهرًا', en: '12 months' } },
    ],
    targetCompanies: ['Ministry of Energy', 'KAPSARC', 'Ministry', 'Royal Commission', 'SEEC', 'Energy Efficiency', 'Vision 2030'],
  },
  {
    id: 'tech',
    name: { ar: 'الذكاء الاصطناعي والبيانات للطاقة', en: 'AI & Data for Energy' },
    targets: { ar: 'أرامكو الرقمية · stc · علم', en: 'Aramco Digital · stc · Elm' },
    accent: 'rose',
    icon: 'tech',
    months: 12,
    scoreByLevel: { entry: 73, mid: 54, senior: 38, director: 24 },
    trail: { ar: 'تحليل البيانات → AWS → Scrum → تحليلات متقدمة', en: 'Data Analyst → AWS → Scrum → Advanced Analytics' },
    certs: [
      { name: { ar: 'تحليل البيانات', en: 'Data Analyst' }, desc: { ar: 'شهادة محلل بيانات من IBM، تغطّي أدوات التحليل والتصوّر واتخاذ القرار بالبيانات. تكمّل خلفيتك في الذكاء الاصطناعي ومشروع نموذجك التنبؤي.', en: 'IBM’s Data Analyst certificate covering analysis, visualization, and data-driven decisions. It complements your AI background and your predictive-model project.' }, gain: { ar: 'تحليل البيانات واتخاذ القرار', en: 'Data analysis and decision-making' }, scoreAdd: 6, official: 'https://www.ibm.com/training/badge/data-analyst', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'AWS SAA', en: 'AWS SAA' }, desc: { ar: 'مهندس حلول معتمد على منصة AWS (المستوى المساعد). يثبت قدرتك على تصميم أنظمة سحابية موثوقة، وهي من أكثر الشهادات طلبًا في الجهات التقنية.', en: 'AWS Certified Solutions Architect – Associate. It proves you can design reliable cloud systems, one of the most in-demand tech credentials.' }, gain: { ar: 'تصميم الحلول السحابية المطلوبة', en: 'In-demand cloud architecture' }, scoreAdd: 9, official: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', status: 'current', cost: { ar: '$150', en: '$150' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'PSM', en: 'PSM' }, desc: { ar: 'سكرَم ماستر محترف، لقيادة فرق التطوير الرشيقة. أساس العمل في فرق المنتجات التقنية الحديثة.', en: 'Professional Scrum Master, for leading agile development teams. Foundational to modern tech product teams.' }, gain: { ar: 'قيادة فرق أجايل', en: 'Lead agile teams' }, scoreAdd: 6, official: 'https://www.scrum.org/professional-scrum-master-certifications', status: 'future', cost: { ar: '$200', en: '$200' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: { ar: 'تحليلات متقدمة', en: 'Advanced Analytics' }, desc: { ar: 'برنامج تحليلات وتعلّم آلة متقدم يبني على أساسك في الذكاء الاصطناعي ومشروعك التنبؤي لمحطة كورنيل.', en: 'An advanced analytics and machine-learning program building on your AI foundation and your Cornell-plant predictive project.' }, gain: { ar: 'نمذجة تنبؤية لأنظمة الطاقة', en: 'Predictive modeling for energy systems' }, scoreAdd: 9, official: 'https://www.coursera.org/professional-certificates/google-data-analytics', status: 'future', cost: { ar: '3,500 ر.س', en: '3,500 SAR' }, duration: { ar: '3 أشهر', en: '3 months' }, hadaf: true },
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
      en: "As-salamu alaykum {firstName}, I'm Ali Alajwad — a Manchester engineering graduate with experience at Ras Al-Khair. I've followed your path at {company} and aspire to a similar route in energy investment.",
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
      role: { ar: position || '—', en: position || '—' },
      company: { ar: company || '—', en: company || '—' },
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
  journey: typeof journey;
  connections: Contact[];
  hrContacts: Contact[]; // filled per request from the real DB by the page
  paths: CareerPath[];
  primaryPath: CareerPath;
  templates: Template[];
  tracker: typeof tracker;
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

/* ------------------------------------------------------------------- ui copy -- */

export const ui = {
  nav: {
    home: { ar: 'الرئيسية', en: 'Home' },
    paths: { ar: 'المسارات', en: 'Paths' },
    contacts: { ar: 'التواصل', en: 'Contacts' },
    tracker: { ar: 'المتتبّع', en: 'Tracker' },
  },
  shell: {
    greeting: { ar: 'أهلًا بعودتك', en: 'Welcome back' },
    plan: { ar: 'الباقة الاحترافية', en: 'Pro plan' },
    journey: { ar: 'إنجاز خطتك المهنية', en: 'Your plan progress' },
    demoBadge: { ar: 'خطتك أنت', en: 'Your plan' },
  },
  overview: {
    eyebrow: { ar: 'لوحتك', en: 'Your dashboard' },
    title: { ar: 'خطتك المهنية كاملة، في مكان واحد', en: 'Your whole career plan, in one place' },
    journeyLabel: { ar: 'من خطتك', en: 'of your plan' },
    certsLabel: { ar: 'شهادات أنجزتها', en: 'Certifications done' },
    sentLabel: { ar: 'رسائل أرسلتها', en: 'Messages sent' },
    repliesLabel: { ar: 'ردود وصلتك', en: 'Replies' },
    scoreLabel: { ar: 'درجة تنافسية سيرتك', en: 'Your CV competitiveness' },
    scoreFor: { ar: 'لهدف', en: 'for' },
    levelLabel: { ar: 'المستوى الوظيفي المستهدف', en: 'Target seniority' },
    levelHint: { ar: 'درجتك تتغيّر حسب المستوى الذي تستهدفه', en: 'Your score changes with the level you aim for' },
    improvementsTitle: { ar: 'ما الذي يرفع درجتك', en: 'What raises your score' },
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
      ar: 'الأعلى منصبًا، ومن تشاركهم قاسمًا مشتركًا — مع رسالة جاهزة لكل واحد.',
      en: 'The most senior, and people you share common ground with — each with a ready message.',
    },
    kindTop: { ar: 'منصب رفيع', en: 'Senior' },
    kindMid: { ar: 'مستوى متوسط', en: 'Mid-level' },
    kindCommon: { ar: 'قاسم مشترك', en: 'Common ground' },
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
    note: { ar: 'يستغرق لينكدإن من 12 إلى 24 ساعة لإرسال الملف إلى بريدك.', en: 'LinkedIn takes 12–24 hours to email you the file.' },
    upload: { ar: 'ارفع Connections.csv', en: 'Upload Connections.csv' },
    matched: { ar: (n: number) => `حمّلنا ${n} جهة من شبكتك`, en: (n: number) => `Loaded ${n} of your connections` },
    ranked: { ar: 'رتّبنا الأقرب إلى أهدافك في الأعلى.', en: 'The closest matches to your targets are on top.' },
    none: { ar: 'لم نتعرّف على أي جهة — جرّب ملفًا آخر.', en: 'No connections found — try another file.' },
    clear: { ar: 'إزالة الملف', en: 'Clear file' },
    locked: { ar: 'ارفع جهات اتصالك لعرض أقرب من تعرفهم هنا', en: 'Upload your connections to reveal who you know here' },
    howPhone: { ar: '📱 من تطبيق الجوال', en: '📱 On the phone app' },
    howLaptop: { ar: '💻 من المتصفح', en: '💻 On a laptop' },
    phoneSteps: {
      ar: [
        'افتح تطبيق لينكدإن واضغط صورتك ثم «الإعدادات».',
        'اختر «خصوصية البيانات» ثم «الحصول على نسخة من بياناتك».',
        'اختر «جهات الاتصال» فقط، ثم «اطلب الأرشيف».',
        'خلال 12–24 ساعة يصلك بريد فيه رابط التحميل — نزّل Connections.csv ثم ارفعه هنا.',
      ],
      en: [
        'Open the LinkedIn app, tap your photo, then Settings.',
        'Go to Data privacy, then "Get a copy of your data".',
        'Pick "Connections" only, then Request archive.',
        'Within 12–24h you get an email with a download link — get Connections.csv and upload it here.',
      ],
    },
    laptopSteps: {
      ar: [
        'افتح linkedin.com واضغط «أنا» ثم «الإعدادات والخصوصية».',
        'من «خصوصية البيانات» اختر «الحصول على نسخة من بياناتك».',
        'اختر «جهات الاتصال» تحديدًا، ثم «اطلب الأرشيف».',
        'خلال 12–24 ساعة يصلك بريد فيه الرابط — نزّل Connections.csv ثم ارفعه هنا.',
      ],
      en: [
        'Open linkedin.com, click Me, then Settings & Privacy.',
        'Under Data privacy, choose "Get a copy of your data".',
        'Select "Connections" specifically, then Request archive.',
        'Within 12–24h you get an email with the link — download Connections.csv and upload it here.',
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
    sent: { ar: 'رسائل أرسلتها', en: 'Messages sent' },
    replied: { ar: 'ردود إيجابية', en: 'Positive replies' },
    pending: { ar: 'بانتظار الردّ', en: 'Awaiting reply' },
    followup: { ar: 'تحتاج متابعة', en: 'Need follow-up' },
    replyRate: { ar: 'معدّل الردّ', en: 'Reply rate' },
    vsBenchmark: { ar: 'كل ما تحدّثه ينعكس هنا فورًا', en: 'Everything you log shows up here instantly' },
    breakdown: { ar: 'توزيع تواصلك', en: 'Your outreach breakdown' },
    empty: { ar: 'حدّث حالة كل تواصل من بطاقات «التواصل»، وستظهر أرقامك هنا.', en: 'Update each outreach from the Contacts cards and your numbers appear here.' },
  },
} as const;
