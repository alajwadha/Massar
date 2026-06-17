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
  roles: LS; // the positions this path leads to (for a new job OR a promotion)
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
    roles: { ar: 'محلل استثمار ← محلل أول ← مدير محفظة', en: 'Investment Analyst → Senior Analyst → Portfolio Manager' },
    accent: 'brand',
    icon: 'finance',
    months: 16,
    scoreByLevel: { entry: 88, mid: 72, senior: 52, director: 34 },
    primary: true,
    trail: { ar: 'تمويل المناخ → CME-1 → FMVA → CFA L1 → CFA L2', en: 'Climate Finance → CME-1 → FMVA → CFA L1 → CFA L2' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والتمويل المستدام وأسواق الكربون من مدرسة كابسارك للسياسة العامة. يربط خبرتك في الطاقة بلغة الاستثمار والـ ESG، وهي ميزة نادرة في سوق صناديق تحوّل الطاقة.', en: 'KAPSARC’s climate finance, sustainable finance, and carbon-markets program. It connects your energy background to the language of investment and ESG, a rare edge in the energy-transition fund market.' }, gain: { ar: 'يربط خبرتك في الطاقة بعالم الاستثمار المستدام', en: 'Bridges your energy background into sustainable investing' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'CME-1', en: 'CME-1' }, desc: { ar: 'الشهادة التأسيسية من المعهد المالي، وهي مطلب تنظيمي للعمل في الأسواق المالية السعودية. تغطّي أساسيات الأنظمة والمنتجات المالية وقواعد هيئة السوق المالية — خطوتك الأولى نحو دور استثماري معتمد.', en: 'The Financial Academy’s foundational license, a regulatory requirement to work in Saudi capital markets. It covers financial regulations, products, and CMA rules — your first step toward an accredited investment role.' }, gain: { ar: 'ترخيص للعمل في الأسواق المالية السعودية', en: 'License to work in Saudi capital markets' }, opens: [{ ar: 'محلل أسواق مالية', en: 'Capital Markets Analyst' }, { ar: 'محلل استثمار مبتدئ', en: 'Investment Analyst (entry)' }], scoreAdd: 6, official: 'https://fa.gov.sa', status: 'current', cost: { ar: '2,000 ر.س', en: '2,000 SAR' }, duration: { ar: '6–8 أسابيع', en: '6–8 weeks' }, hadaf: true, hadafNote: { ar: 'يدعمها صندوق هدف', en: 'Hadaf-supported' }, why: { ar: 'أسرع خطوة معتمدة تنقلك رسميًا إلى مسار الاستثمار، وتؤهّلك لأدوار الأسواق العامة في الصندوق. ابدأ بها قبل CFA.', en: 'The fastest accredited step that formally moves you into the investment track and qualifies you for PIF public-markets roles. Do it before the CFA.' } },
      { name: { ar: 'FMVA', en: 'FMVA' }, desc: { ar: 'برنامج معهد تمويل الشركات لبناء النماذج المالية وتقييم الشركات. عملي بالكامل: تتخرّج منه قادرًا على بناء نموذج مالي متكامل من الصفر، وهي المهارة الأكثر طلبًا في فرق الاستثمار والصفقات.', en: 'CFI’s hands-on program for financial modeling and company valuation. You finish able to build a full model from scratch — the most in-demand skill on investment and deals teams.' }, gain: { ar: 'إتقان النمذجة المالية المطلوبة في الصفقات', en: 'Deal-grade financial modeling skills' }, opens: [{ ar: 'محلل مالي', en: 'Financial Analyst' }, { ar: 'زميل استثمار', en: 'Investment Associate' }], scoreAdd: 8, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'CFA المستوى الأول', en: 'CFA Level 1' }, desc: { ar: 'المستوى الأول من شهادة محلل مالي معتمد، المعيار العالمي الأرفع في إدارة الاستثمار. يغطّي الأخلاقيات والأدوات الكمية والاقتصاد وتحليل القوائم المالية، وهو حجر الأساس لأي دور استثماري في الصندوق.', en: 'Level 1 of the Chartered Financial Analyst program, the global gold standard in investment management. It spans ethics, quantitative methods, economics, and financial reporting — the foundation for any investment role at PIF.' }, gain: { ar: 'المعيار الذهبي لوظائف الاستثمار في الصندوق', en: 'The gold standard for PIF investment roles' }, opens: [{ ar: 'محلل استثمار في الصندوق', en: 'Investment Analyst at PIF' }, { ar: 'محلل أبحاث أسهم', en: 'Equity Research Analyst' }], scoreAdd: 15, official: CFA, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '6 أشهر · 300 ساعة', en: '6 months · 300h' }, hadaf: true, hadafNote: { ar: 'تسترجع نحو 2,750 ر.س عبر هدف', en: 'Reclaim ~2,750 SAR via Hadaf' } },
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
    months: 12,
    scoreByLevel: { entry: 90, mid: 70, senior: 50, director: 32 },
    trail: { ar: 'التناضح العكسي → الطاقة الشمسية → PMP → CEM → Six Sigma', en: 'Reverse Osmosis → Solar PV → PMP → CEM → Six Sigma' },
    certs: [
      { name: { ar: 'التناضح العكسي', en: 'Reverse Osmosis' }, desc: { ar: 'شهادة مهندس متخصص في التناضح العكسي من أكاديمية المياه. تثبت خبرتك التشغيلية في أكبر محطات التحلية — أساس قوي لأدوار الطاقة والمياه.', en: 'Reverse Osmosis Specialist Engineer from the Water Academy. It certifies your operational expertise at the largest desalination plants — a strong base for power and water roles.' }, gain: { ar: 'تثبت خبرتك في أكبر محطات التحلية', en: 'Certifies your large-scale desalination expertise' }, scoreAdd: 7, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'تصميم الطاقة الشمسية', en: 'Solar PV Design' }, desc: { ar: 'مصمم أنظمة طاقة شمسية معتمد من أكاديمية المياه. يضيف تصميم المتجددة إلى خبرتك في التوليد التقليدي.', en: 'Certified Solar PV Designer from the Water Academy. It adds renewables design to your conventional-generation experience.' }, gain: { ar: 'تصميم المتجددة المطلوب في أكوا ونيوم', en: 'Renewables design valued at ACWA and NEOM' }, scoreAdd: 6, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'شهادة محترف إدارة المشاريع من معهد PMI، الأكثر اعترافًا عالميًا. لقيادة مشاريع الطاقة الكبرى في أرامكو وأكوا باور ومشاريع رؤية 2030.', en: 'PMI’s Project Management Professional, the most globally recognized PM credential — for leading major energy projects at Aramco, ACWA Power, and Vision 2030.' }, gain: { ar: 'يؤهّلك لقيادة مشاريع الطاقة الكبرى', en: 'Qualifies you to lead major energy projects' }, opens: [{ ar: 'مدير مشروع', en: 'Project Manager' }, { ar: 'مهندس أول', en: 'Senior Engineer' }], scoreAdd: 10, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'current', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'CEM', en: 'CEM' }, desc: { ar: 'مدير طاقة معتمد من جمعية مهندسي الطاقة (AEE). يثبت قدرتك على تحليل استهلاك الطاقة وتصميم حلول الكفاءة.', en: 'Certified Energy Manager from the AEE. It proves you can analyze energy use and design efficiency solutions.' }, gain: { ar: 'خبرة معتمدة في كفاءة الطاقة', en: 'Certified energy-efficiency expertise' }, opens: [{ ar: 'مدير طاقة', en: 'Energy Manager' }, { ar: 'أخصائي كفاءة', en: 'Efficiency Specialist' }], scoreAdd: 9, official: 'https://www.aeecenter.org/certified-energy-manager-cem/', status: 'future', cost: { ar: '$1,500', en: '$1,500' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'Six Sigma', en: 'Six Sigma' }, desc: { ar: 'الحزام الأخضر في منهجية ستة سيجما لتحسين العمليات وتقليل الهدر، وهي منهجية تعتمدها أرامكو وكبرى الشركات الصناعية.', en: 'Green Belt in Six Sigma for process improvement and waste reduction — relied on by Aramco and major industrial firms.' }, gain: { ar: 'تحسين العمليات المطلوب في أرامكو', en: 'Process improvement valued at Aramco' }, scoreAdd: 7, official: 'https://asq.org/cert/six-sigma-green-belt', status: 'future', cost: { ar: '2,500 ر.س', en: '2,500 SAR' }, duration: { ar: 'شهران', en: '2 months' }, hadaf: true },
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
    months: 12,
    scoreByLevel: { entry: 74, mid: 56, senior: 40, director: 26 },
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
    months: 18,
    scoreByLevel: { entry: 79, mid: 61, senior: 44, director: 28 },
    trail: { ar: 'تمويل المناخ → دبلوم السياسات → PMP → PgMP', en: 'Climate Finance → Policy Diploma → PMP → PgMP' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والاستدامة من كابسارك. يربط نمذجتك لمسار 2060 بأدوات السياسة والتمويل المناخي.', en: 'KAPSARC’s climate finance and sustainability program. It ties your 2060-pathway modeling to policy and climate-finance tools.' }, gain: { ar: 'يربط نمذجتك بالسياسة والتمويل المناخي', en: 'Links your modeling to climate policy and finance' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'دبلوم السياسات العامة', en: 'Public Policy Diploma' }, desc: { ar: 'دبلوم متخصّص في تحليل وصياغة السياسات العامة. يؤهّلك لمكاتب الاستراتيجية والتخطيط في الوزارات والهيئات.', en: 'A specialized diploma in public-policy analysis and design. It prepares you for strategy and planning offices in ministries and authorities.' }, gain: { ar: 'صياغة وتحليل سياسات الطاقة', en: 'Energy policy design and analysis' }, opens: [{ ar: 'محلل سياسات', en: 'Policy Analyst' }, { ar: 'مسؤول استراتيجية', en: 'Strategy Officer' }], scoreAdd: 9, official: 'https://www.spsp.edu.sa/', status: 'current', cost: { ar: '5,000 ر.س', en: '5,000 SAR' }, duration: { ar: '5 أشهر', en: '5 months' }, hadaf: true },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'محترف إدارة المشاريع من PMI، لقيادة مشاريع التحول ضمن رؤية 2030 داخل الجهات الحكومية.', en: 'PMI’s Project Management Professional, for leading Vision 2030 transformation projects in government.' }, gain: { ar: 'قيادة مشاريع رؤية 2030', en: 'Lead Vision 2030 projects' }, scoreAdd: 9, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'PgMP', en: 'PgMP' }, desc: { ar: 'محترف إدارة البرامج من PMI، المستوى الأعلى من PMP، لقيادة محافظ المشاريع على مستوى المؤسسة.', en: 'PMI’s Program Management Professional, above PMP — for leading enterprise-level project portfolios.' }, gain: { ar: 'إدارة برامج الطاقة الكبرى', en: 'Manage large energy programs' }, opens: [{ ar: 'مدير برامج', en: 'Program Director' }], scoreAdd: 8, official: 'https://www.pmi.org/certifications/program-management-pgmp', status: 'future', cost: { ar: '$800', en: '$800' }, duration: { ar: '4 أشهر', en: '4 months' } },
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
    months: 12,
    scoreByLevel: { entry: 73, mid: 54, senior: 38, director: 24 },
    trail: { ar: 'تحليل البيانات → AWS → Scrum → تحليلات متقدمة', en: 'Data Analyst → AWS → Scrum → Advanced Analytics' },
    certs: [
      { name: { ar: 'تحليل البيانات', en: 'Data Analyst' }, desc: { ar: 'شهادة محلل بيانات من IBM، تغطّي أدوات التحليل والتصوّر واتخاذ القرار بالبيانات. تكمّل خلفيتك في الذكاء الاصطناعي ومشروع نموذجك التنبؤي.', en: 'IBM’s Data Analyst certificate covering analysis, visualization, and data-driven decisions. It complements your AI background and your predictive-model project.' }, gain: { ar: 'تحليل البيانات واتخاذ القرار', en: 'Data analysis and decision-making' }, scoreAdd: 6, official: 'https://www.ibm.com/training/badge/data-analyst', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'AWS SAA', en: 'AWS SAA' }, desc: { ar: 'مهندس حلول معتمد على منصة AWS (المستوى المساعد). يثبت قدرتك على تصميم أنظمة سحابية موثوقة، وهي من أكثر الشهادات طلبًا في الجهات التقنية.', en: 'AWS Certified Solutions Architect – Associate. It proves you can design reliable cloud systems, one of the most in-demand tech credentials.' }, gain: { ar: 'تصميم الحلول السحابية المطلوبة', en: 'In-demand cloud architecture' }, opens: [{ ar: 'مهندس حلول', en: 'Solutions Architect' }, { ar: 'مهندس سحابة', en: 'Cloud Engineer' }], scoreAdd: 9, official: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', status: 'current', cost: { ar: '$150', en: '$150' }, duration: { ar: '3 أشهر', en: '3 months' } },
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
    ar: 'سيرتك قوية بأساس متين، يفصلك عنها القليل لإغلاق الفجوات.',
    en: 'Strong foundation, just a few gaps to close.',
  },
  strengths: [
    { ar: 'ماجستير اقتصاديات الطاقة من كورنيل', en: 'M.Eng Energy Economics, Cornell' },
    { ar: 'سنتان خبرة تشغيلية في رأس الخير', en: '2 years hands-on operations at Ras Al-Khair' },
    { ar: 'ثنائي اللغة + مشروع نمذجة تنبؤية بالذكاء الاصطناعي', en: 'Bilingual + an AI predictive-modeling project' },
    { ar: 'هندسة من مانشستر مع شهادات معتمدة', en: 'Manchester engineering degree with certifications' },
  ],
  issues: [
    { id: 'bullets', kind: 'bullet', text: { ar: 'أضف أرقامًا وأثرًا قابلًا للقياس لأبرز 3 إنجازات', en: 'Add concrete metrics and impact to your top 3 bullets' }, severity: 'high' },
    { id: 'length', kind: 'length', text: { ar: 'اختصر السيرة إلى صفحتين كحد أقصى', en: 'Trim the CV to 2 pages maximum' }, severity: 'med' },
    { id: 'summary', kind: 'summary', text: { ar: 'أضف ملخصًا من سطرين موجّهًا للاستثمار في الطاقة', en: 'Add a 2-line summary aimed at energy investment' }, severity: 'med' },
    { id: 'keywords', kind: 'format', text: { ar: 'استخدم كلمات مفتاحية من إعلانات الصندوق وكابسارك', en: 'Mirror keywords from PIF and KAPSARC job posts' }, severity: 'low' },
  ],
};

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

export const careerDays: { title: LS; org: LS; when: LS; city: LS; fields: FieldTag[]; link: string }[] = [
  { title: { ar: 'يوم المهنة - جامعة الملك فهد', en: 'KFUPM Career Day' }, org: { ar: 'جامعة الملك فهد للبترول والمعادن', en: 'KFUPM' }, when: { ar: 'سنويًا · فبراير', en: 'Annually · February' }, city: { ar: 'الظهران', en: 'Dhahran' }, fields: ['energy', 'tech'], link: 'https://www.kfupm.edu.sa' },
  { title: { ar: 'مؤتمر القطاع المالي', en: 'Financial Sector Conference' }, org: { ar: 'البنك المركزي وهيئة السوق المالية', en: 'SAMA & CMA' }, when: { ar: 'سنويًا · الربع الأول', en: 'Annually · Q1' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['finance'], link: 'https://www.fsc.sa' },
  { title: { ar: 'ليب التقني (LEAP)', en: 'LEAP Tech' }, org: { ar: 'وزارة الاتصالات', en: 'MCIT' }, when: { ar: 'سنويًا · فبراير', en: 'Annually · February' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['tech'], link: 'https://onegiantleap.com' },
  { title: { ar: 'منتدى مسك العالمي', en: 'Misk Global Forum' }, org: { ar: 'مؤسسة مسك', en: 'Misk Foundation' }, when: { ar: 'سنويًا · الربع الرابع', en: 'Annually · Q4' }, city: { ar: 'الرياض', en: 'Riyadh' }, fields: ['all'], link: 'https://miskglobalforum.com' },
  { title: { ar: 'ملتقى التوظيف - طاقات', en: 'Taqat Job Fair' }, org: { ar: 'صندوق تنمية الموارد البشرية (هدف)', en: 'HRDF (Hadaf)' }, when: { ar: 'دوريًا على مدار السنة', en: 'Recurring through the year' }, city: { ar: 'عدة مدن', en: 'Multiple cities' }, fields: ['all'], link: 'https://www.taqat.sa' },
];

// Graduate-study options per field for the «الدراسات / Study» tab. Two buckets:
// Saudi (often part-time / executive, good while working) and Worldwide
// (full-time). `best` flags the strongest programs in that field; `link` points at
// that field's program/department page (approximate, verify before applying).
export type GradMode = 'part_time' | 'full_time';
export type GradProgram = { uni: LS; program: LS; location: LS; link: string; mode: GradMode; saudi: boolean; best?: boolean };

export const gradPrograms: Record<Exclude<FieldTag, 'all'>, GradProgram[]> = {
  finance: [
    { uni: { ar: 'جامعة الملك فهد للبترول والمعادن', en: 'KFUPM' }, program: { ar: 'ماجستير التمويل', en: 'MSc Finance' }, location: { ar: 'الظهران', en: 'Dhahran' }, link: 'https://cim.kfupm.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة الفيصل', en: 'Alfaisal University' }, program: { ar: 'ماجستير تنفيذي - تمويل', en: 'Executive MBA — Finance' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://cob.alfaisal.edu', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة الملك سعود', en: 'King Saud University' }, program: { ar: 'ماجستير إدارة الأعمال (مسائي)', en: 'MBA (evening)' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://business.ksu.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'كلية لندن للأعمال', en: 'London Business School' }, program: { ar: 'ماجستير التمويل', en: 'Masters in Finance' }, location: { ar: 'لندن', en: 'London' }, link: 'https://www.london.edu/masters-degrees/masters-in-finance', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'كلية لندن للاقتصاد', en: 'LSE' }, program: { ar: 'ماجستير التمويل', en: 'MSc Finance' }, location: { ar: 'لندن', en: 'London' }, link: 'https://www.lse.ac.uk/finance', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'إم آي تي سلون', en: 'MIT Sloan' }, program: { ar: 'ماجستير التمويل', en: 'Master of Finance' }, location: { ar: 'بوسطن', en: 'Boston' }, link: 'https://mitsloan.mit.edu/mfin', mode: 'full_time', saudi: false, best: true },
  ],
  energy: [
    { uni: { ar: 'جامعة الملك عبدالله (كاوست)', en: 'KAUST' }, program: { ar: 'علوم وهندسة الطاقة', en: 'Energy Science & Engineering' }, location: { ar: 'ثول', en: 'Thuwal' }, link: 'https://cemse.kaust.edu.sa', mode: 'full_time', saudi: true, best: true },
    { uni: { ar: 'جامعة الملك فهد للبترول والمعادن', en: 'KFUPM' }, program: { ar: 'هندسة البترول والطاقة', en: 'Petroleum & Energy Engineering' }, location: { ar: 'الظهران', en: 'Dhahran' }, link: 'https://www.kfupm.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة الملك سعود', en: 'King Saud University' }, program: { ar: 'هندسة الطاقة المتجددة', en: 'Renewable Energy Eng.' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://engineering.ksu.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'إمبريال كوليدج لندن', en: 'Imperial College London' }, program: { ar: 'مستقبل الطاقة المستدامة', en: 'Sustainable Energy Futures' }, location: { ar: 'لندن', en: 'London' }, link: 'https://www.imperial.ac.uk/study/courses/postgraduate-taught/sustainable-energy-futures/', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'جامعة ستانفورد', en: 'Stanford University' }, program: { ar: 'علوم وهندسة الطاقة', en: 'Energy Science & Engineering' }, location: { ar: 'كاليفورنيا', en: 'California' }, link: 'https://energy.stanford.edu', mode: 'full_time', saudi: false, best: true },
  ],
  consulting: [
    { uni: { ar: 'جامعة الفيصل', en: 'Alfaisal University' }, program: { ar: 'ماجستير إدارة الأعمال التنفيذي', en: 'Executive MBA' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://cob.alfaisal.edu', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة الملك عبدالله (كاوست)', en: 'KAUST' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'ثول', en: 'Thuwal' }, link: 'https://www.kaust.edu.sa', mode: 'full_time', saudi: true },
    { uni: { ar: 'جامعة الملك سعود', en: 'King Saud University' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://business.ksu.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'إنسياد', en: 'INSEAD' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'فونتينبلو/أبوظبي', en: 'Fontainebleau / Abu Dhabi' }, link: 'https://www.insead.edu/master-programmes/mba', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'كلية لندن للأعمال', en: 'London Business School' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'لندن', en: 'London' }, link: 'https://www.london.edu/masters-degrees/mba', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'وارتون', en: 'Wharton' }, program: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, location: { ar: 'فيلادلفيا', en: 'Philadelphia' }, link: 'https://mba.wharton.upenn.edu', mode: 'full_time', saudi: false, best: true },
  ],
  government: [
    { uni: { ar: 'معهد الإدارة العامة', en: 'IPA / SPSP' }, program: { ar: 'السياسات العامة', en: 'Public Policy' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://www.spsp.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة الملك سعود', en: 'King Saud University' }, program: { ar: 'ماجستير الإدارة العامة', en: 'Master of Public Admin.' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://business.ksu.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة نايف العربية', en: 'Naif Arab University' }, program: { ar: 'السياسات والإدارة', en: 'Policy & Administration' }, location: { ar: 'الرياض', en: 'Riyadh' }, link: 'https://www.nauss.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'كلية كينيدي - هارفارد', en: 'Harvard Kennedy School' }, program: { ar: 'ماجستير السياسات العامة', en: 'Master in Public Policy' }, location: { ar: 'بوسطن', en: 'Boston' }, link: 'https://www.hks.harvard.edu/educational-programs/masters-programs/master-public-policy', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'كلية بلافاتنيك - أكسفورد', en: 'Oxford Blavatnik' }, program: { ar: 'ماجستير السياسات العامة', en: 'Master of Public Policy' }, location: { ar: 'أكسفورد', en: 'Oxford' }, link: 'https://www.bsg.ox.ac.uk/study/master-public-policy', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'كلية لندن للاقتصاد', en: 'LSE' }, program: { ar: 'ماجستير الإدارة العامة', en: 'MPA Public Administration' }, location: { ar: 'لندن', en: 'London' }, link: 'https://www.lse.ac.uk/school-of-public-policy', mode: 'full_time', saudi: false, best: true },
  ],
  tech: [
    { uni: { ar: 'جامعة الملك عبدالله (كاوست)', en: 'KAUST' }, program: { ar: 'علوم الحاسب / الذكاء الاصطناعي', en: 'Computer Science / AI' }, location: { ar: 'ثول', en: 'Thuwal' }, link: 'https://cemse.kaust.edu.sa', mode: 'full_time', saudi: true, best: true },
    { uni: { ar: 'جامعة الملك فهد للبترول والمعادن', en: 'KFUPM' }, program: { ar: 'علوم الحاسب', en: 'Computer Science' }, location: { ar: 'الظهران', en: 'Dhahran' }, link: 'https://www.kfupm.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة الأمير محمد بن فهد', en: 'PMU' }, program: { ar: 'ماجستير علم البيانات', en: 'MS Data Science' }, location: { ar: 'الخبر', en: 'Khobar' }, link: 'https://www.pmu.edu.sa', mode: 'part_time', saudi: true },
    { uni: { ar: 'جامعة ستانفورد', en: 'Stanford University' }, program: { ar: 'ماجستير علوم الحاسب (ذكاء اصطناعي)', en: 'MS Computer Science (AI)' }, location: { ar: 'كاليفورنيا', en: 'California' }, link: 'https://cs.stanford.edu', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'جامعة كارنيجي ميلون', en: 'Carnegie Mellon' }, program: { ar: 'ماجستير الذكاء الاصطناعي', en: 'MS Artificial Intelligence' }, location: { ar: 'بيتسبرغ', en: 'Pittsburgh' }, link: 'https://www.cs.cmu.edu', mode: 'full_time', saudi: false, best: true },
    { uni: { ar: 'إم آي تي', en: 'MIT' }, program: { ar: 'الهندسة الكهربائية وعلوم الحاسب', en: 'EECS' }, location: { ar: 'بوسطن', en: 'Boston' }, link: 'https://www.eecs.mit.edu', mode: 'full_time', saudi: false, best: true },
  ],
};

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
    opportunities: { ar: 'النمو', en: 'Grow' },
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
    goalTitle: { ar: 'هدف هذا الأسبوع', en: "This week's goal" },
    goalHint: { ar: (a: number, b: number) => `${a} من ${b} تواصلات`, en: (a: number, b: number) => `${a} of ${b} reach-outs` },
    goalDone: { ar: 'أنجزت هدف الأسبوع 🎉', en: "You hit this week's goal 🎉" },
    snapshotTitle: { ar: 'ملخّص تواصلك', en: 'Outreach snapshot' },
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
    sub: { ar: 'خيارات بدوام جزئي داخل السعودية وأنت تعمل، أو بدوام كامل في أفضل جامعات العالم في مجالك.', en: 'Part-time options inside Saudi while you work, or full-time at the best universities worldwide in your field.' },
    inSaudi: { ar: 'في السعودية', en: 'In Saudi Arabia' },
    inSaudiSub: { ar: 'مناسبة للدراسة أثناء العمل', en: 'Good to study while working' },
    worldwide: { ar: 'حول العالم', en: 'Worldwide' },
    worldwideSub: { ar: 'برامج بدوام كامل في أقوى الجامعات', en: 'Full-time at top universities' },
    partTime: { ar: 'دوام جزئي', en: 'Part-time' },
    fullTime: { ar: 'دوام كامل', en: 'Full-time' },
    best: { ar: 'الأفضل في مجالك', en: 'Best in field' },
    viewProgram: { ar: 'صفحة البرنامج', en: 'Program page' },
    fundingTitle: { ar: 'التمويل والدعم', en: 'Funding & support' },
    funding: {
      ar: ['ابتعاث الموظفين أو إجازة دراسية من جهة عملك للبرامج الجزئية.', 'برنامج الابتعاث (خادم الحرمين / KASP) للدراسة بالخارج.', 'منح الجامعات نفسها — كاوست تغطّي الرسوم وراتبًا شهريًا.'],
      en: ['Employer sponsorship or study leave for part-time programs.', 'King Salman scholarship (KASP) for studying abroad.', 'University scholarships — KAUST covers tuition plus a monthly stipend.'],
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
    ready: { ar: 'أنت شبه جاهز لهذا المستوى!', en: "You're nearly ready for this level!" },
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
    companyPortalsTitle: { ar: 'الشركات المستهدفة', en: 'Target companies' },
    apply: { ar: 'تقديم', en: 'Apply' },
    visit: { ar: 'زيارة', en: 'Visit' },
    cvGuideTitle: { ar: 'كيف تكتب سيرة قوية', en: 'How to write a strong CV' },
    interviewTitle: { ar: 'نصائح للمقابلات', en: 'Interview tips' },
  },
  referral: {
    title: { ar: 'أهدِ صديقًا خصم 20%', en: 'Give a friend 20% off' },
    body: { ar: 'شارك رابطك مع من تظن أن مسار يفيده: يحصل على خصم 20% عند الاشتراك عبره.', en: 'Share your link with someone Masaar could help: they get 20% off when they join through it.' },
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
