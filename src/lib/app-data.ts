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
export const cvScore = {
  value: 72,
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

export type Contact = {
  id: string;
  name: LS;
  role: LS;
  company: LS;
  companyKey: CompanyKey;
  industry: IndustryKey;
  score?: number;
  status: ContactStatus;
  when: LS;
};

export const industries: { id: IndustryKey; label: LS }[] = [
  { id: 'finance', label: { ar: 'الاستثمار والتمويل', en: 'Investment & Finance' } },
  { id: 'energy', label: { ar: 'الطاقة', en: 'Energy' } },
  { id: 'consulting', label: { ar: 'الاستشارات', en: 'Consulting' } },
  { id: 'government', label: { ar: 'الحكومي والسياسات', en: 'Government & Policy' } },
  { id: 'tech', label: { ar: 'التقنية', en: 'Tech' } },
];

/* ----------------------------------------------------- connections (targets) -- */

export const connections: Contact[] = [
  { id: 'n1', name: { ar: 'عبدالعزيز القصبي', en: 'Abdulaziz Alqasabi' }, role: { ar: 'مدير استثمار · تحوّل الطاقة', en: 'Investment Director · Energy Transition' }, company: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, companyKey: 'pif', industry: 'finance', score: 191, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n2', name: { ar: 'ريم الدخيل', en: 'Reem Aldakhil' }, role: { ar: 'باحثة أولى · تمويل الطاقة', en: 'Senior Fellow · Energy Finance' }, company: { ar: 'كابسارك', en: 'KAPSARC' }, companyKey: 'kapsarc', industry: 'finance', score: 186, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n3', name: { ar: 'فهد العمري', en: 'Fahad Alamri' }, role: { ar: 'نائب رئيس · تطوير المشاريع', en: 'VP · Project Development' }, company: { ar: 'أكوا باور', en: 'ACWA Power' }, companyKey: 'acwa', industry: 'energy', score: 184, status: 'replied', when: { ar: 'قبل ساعتين', en: '2h ago' } },
  { id: 'n4', name: { ar: 'سعود المهنا', en: 'Saud Almohanna' }, role: { ar: 'مدير محطة', en: 'Plant Manager' }, company: { ar: 'المؤسسة العامة لتحلية المياه', en: 'Saudi Water Authority' }, companyKey: 'swcc', industry: 'energy', score: 178, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n5', name: { ar: 'نورة الفايز', en: 'Noura Alfayez' }, role: { ar: 'مديرة ارتباط · الطاقة', en: 'Engagement Manager · Energy' }, company: { ar: 'ماكنزي وشركاه', en: 'McKinsey & Company' }, companyKey: 'mck', industry: 'consulting', score: 176, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n6', name: { ar: 'خالد الزهراني', en: 'Khalid Alzahrani' }, role: { ar: 'قائد تحوّل الطاقة', en: 'Energy Transition Lead' }, company: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' }, companyKey: 'aramco', industry: 'energy', score: 173, status: 'sent', when: { ar: 'قبل 4 أيام', en: '4 days ago' } },
  { id: 'n7', name: { ar: 'لينا الحمدان', en: 'Lina Alhamdan' }, role: { ar: 'مديرة استثمار', en: 'Investment Manager' }, company: { ar: 'نيوم · الطاقة', en: 'NEOM · Energy' }, companyKey: 'neom', industry: 'finance', score: 171, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n8', name: { ar: 'عبدالله الشمري', en: 'Abdullah Alshammari' }, role: { ar: 'مدير الاستراتيجية', en: 'Director, Strategy' }, company: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' }, companyKey: 'gov', industry: 'government', score: 168, status: 'followup', when: { ar: 'متابعة · 9 أيام', en: 'Follow-up · 9d' } },
  { id: 'n9', name: { ar: 'مازن العتيبي', en: 'Mazen Alotaibi' }, role: { ar: 'مدير أول · الأسواق العامة', en: 'Senior Associate · Public Markets' }, company: { ar: 'الصندوق · الأسواق العامة', en: 'PIF · Public Markets' }, companyKey: 'pif', industry: 'finance', score: 166, status: 'sent', when: { ar: 'قبل 5 ساعات', en: '5h ago' } },
  { id: 'n10', name: { ar: 'هيا السبيعي', en: 'Haya Alsubaie' }, role: { ar: 'رئيسة التمويل المستدام', en: 'Head of Sustainable Finance' }, company: { ar: 'البنك الأهلي السعودي', en: 'Saudi National Bank' }, companyKey: 'snb', industry: 'finance', score: 164, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n11', name: { ar: 'تركي الدوسري', en: 'Turki Aldossari' }, role: { ar: 'مدير الاستراتيجية', en: 'Strategy Manager' }, company: { ar: 'سابك', en: 'SABIC' }, companyKey: 'sabic', industry: 'energy', score: 162, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n12', name: { ar: 'سارة القرني', en: 'Sara Alqarni' }, role: { ar: 'مستشارة · ممارسة الطاقة', en: 'Consultant · Energy Practice' }, company: { ar: 'BCG', en: 'BCG' }, companyKey: 'bcg', industry: 'consulting', score: 160, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n13', name: { ar: 'بدر الغامدي', en: 'Badr Alghamdi' }, role: { ar: 'مدير منتجات رقمية', en: 'Digital Product Lead' }, company: { ar: 'أرامكو الرقمية', en: 'Aramco Digital' }, companyKey: 'aramco', industry: 'tech', score: 158, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n14', name: { ar: 'منى العنزي', en: 'Mona Alanazi' }, role: { ar: 'مديرة بيانات وذكاء اصطناعي', en: 'Data & AI Manager' }, company: { ar: 'stc', en: 'stc' }, companyKey: 'stc', industry: 'tech', score: 156, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n15', name: { ar: 'ياسر الحربي', en: 'Yasser Alharbi' }, role: { ar: 'مبدأ · الطاقة', en: 'Principal · Energy' }, company: { ar: 'Strategy&', en: 'Strategy&' }, companyKey: 'strat', industry: 'consulting', score: 154, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n16', name: { ar: 'أحمد باوزير', en: 'Ahmed Bawazir' }, role: { ar: 'باحث سياسات الطاقة', en: 'Energy Policy Researcher' }, company: { ar: 'كابسارك', en: 'KAPSARC' }, companyKey: 'kapsarc', industry: 'government', score: 152, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n17', name: { ar: 'عمر الشهري', en: 'Omar Alshehri' }, role: { ar: 'مهندس أول · العمليات', en: 'Senior Operations Engineer' }, company: { ar: 'المؤسسة العامة لتحلية المياه', en: 'Saudi Water Authority' }, companyKey: 'swcc', industry: 'energy', score: 150, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n18', name: { ar: 'دانة المطيري', en: 'Dana Almutairi' }, role: { ar: 'قائدة هندسة', en: 'Engineering Lead' }, company: { ar: 'علم', en: 'Elm' }, companyKey: 'elm', industry: 'tech', score: 148, status: 'new', when: { ar: 'جديد', en: 'New' } },
];

/* ----------------------------------------------------------- HR / recruiters -- */

export const hrContacts: Contact[] = [
  { id: 'h1', name: { ar: 'لمى الراجحي', en: 'Lama Alrajhi' }, role: { ar: 'شريكة استقطاب المواهب', en: 'Talent Acquisition Partner' }, company: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, companyKey: 'pif', industry: 'finance', status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'h2', name: { ar: 'بدر الدوسري', en: 'Badr Aldossari' }, role: { ar: 'قائد التوظيف', en: 'Recruitment Lead' }, company: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' }, companyKey: 'aramco', industry: 'energy', status: 'sent', when: { ar: 'قبل 3 أيام', en: '3 days ago' } },
  { id: 'h3', name: { ar: 'جواهر السبيعي', en: 'Jawaher Alsubaie' }, role: { ar: 'أخصائية توظيف أولى', en: 'Senior Recruiter' }, company: { ar: 'نيوم', en: 'NEOM' }, companyKey: 'neom', industry: 'energy', status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'h4', name: { ar: 'طلال العنزي', en: 'Talal Alanazi' }, role: { ar: 'شريك موارد بشرية', en: 'HR Business Partner' }, company: { ar: 'أكوا باور', en: 'ACWA Power' }, companyKey: 'acwa', industry: 'energy', status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'h5', name: { ar: 'عبير الزهراني', en: 'Abeer Alzahrani' }, role: { ar: 'مسؤولة استقطاب', en: 'Talent Sourcer' }, company: { ar: 'كابسارك', en: 'KAPSARC' }, companyKey: 'kapsarc', industry: 'government', status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'h6', name: { ar: 'سلطان المالكي', en: 'Sultan Almalki' }, role: { ar: 'أخصائي توظيف', en: 'Recruiter' }, company: { ar: 'سابك', en: 'SABIC' }, companyKey: 'sabic', industry: 'energy', status: 'new', when: { ar: 'جديد', en: 'New' } },
];

export function contactById(id: string): Contact | undefined {
  return connections.find((c) => c.id === id) ?? hrContacts.find((c) => c.id === id);
}

/* ------------------------------------------------------------------- paths -- */

export type PickKind = 'top' | 'mid' | 'common';
export type PathPick = { id: string; kind: PickKind; reason: LS };

export type CareerPath = {
  id: string;
  name: LS;
  targets: LS;
  accent: AccentKey;
  icon: 'finance' | 'energy' | 'consulting' | 'government' | 'tech';
  months: number;
  matchPercent: number;
  primary?: boolean;
  trail: LS;
  certs: Cert[];
  picks: PathPick[];
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
    matchPercent: 92,
    primary: true,
    trail: { ar: 'تمويل المناخ → CME-1 → FMVA → CFA L1 → CFA L2', en: 'Climate Finance → CME-1 → FMVA → CFA L1 → CFA L2' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والتمويل المستدام وأسواق الكربون من مدرسة كابسارك للسياسة العامة. يربط خبرتك في الطاقة بلغة الاستثمار والـ ESG، وهي ميزة نادرة في سوق صناديق تحوّل الطاقة.', en: 'KAPSARC’s climate finance, sustainable finance, and carbon-markets program. It connects your energy background to the language of investment and ESG, a rare edge in the energy-transition fund market.' }, gain: { ar: 'يربط خبرتك في الطاقة بعالم الاستثمار المستدام', en: 'Bridges your energy background into sustainable investing' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'CME-1', en: 'CME-1' }, desc: { ar: 'الشهادة التأسيسية من المعهد المالي، وهي مطلب تنظيمي للعمل في الأسواق المالية السعودية. تغطّي أساسيات الأنظمة والمنتجات المالية وقواعد هيئة السوق المالية — خطوتك الأولى نحو دور استثماري معتمد.', en: 'The Financial Academy’s foundational license, a regulatory requirement to work in Saudi capital markets. It covers financial regulations, products, and CMA rules — your first step toward an accredited investment role.' }, gain: { ar: 'ترخيص للعمل في الأسواق المالية السعودية', en: 'License to work in Saudi capital markets' }, scoreAdd: 6, official: 'https://fa.gov.sa', status: 'current', cost: { ar: '2,000 ر.س', en: '2,000 SAR' }, duration: { ar: '6–8 أسابيع', en: '6–8 weeks' }, hadaf: true, hadafNote: { ar: 'يدعمها صندوق هدف', en: 'Hadaf-supported' }, why: { ar: 'أسرع خطوة معتمدة تنقلك رسميًا إلى مسار الاستثمار، وتؤهّلك لأدوار الأسواق العامة في الصندوق. ابدأ بها قبل CFA.', en: 'The fastest accredited step that formally moves you into the investment track and qualifies you for PIF public-markets roles. Do it before the CFA.' } },
      { name: { ar: 'FMVA', en: 'FMVA' }, desc: { ar: 'برنامج معهد تمويل الشركات لبناء النماذج المالية وتقييم الشركات. عملي بالكامل: تتخرّج منه قادرًا على بناء نموذج مالي متكامل من الصفر، وهي المهارة الأكثر طلبًا في فرق الاستثمار والصفقات.', en: 'CFI’s hands-on program for financial modeling and company valuation. You finish able to build a full model from scratch — the most in-demand skill on investment and deals teams.' }, gain: { ar: 'إتقان النمذجة المالية المطلوبة في الصفقات', en: 'Deal-grade financial modeling skills' }, scoreAdd: 8, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'CFA المستوى الأول', en: 'CFA Level 1' }, desc: { ar: 'المستوى الأول من شهادة محلل مالي معتمد، المعيار العالمي الأرفع في إدارة الاستثمار. يغطّي الأخلاقيات والأدوات الكمية والاقتصاد وتحليل القوائم المالية، وهو حجر الأساس لأي دور استثماري في الصندوق.', en: 'Level 1 of the Chartered Financial Analyst program, the global gold standard in investment management. It spans ethics, quantitative methods, economics, and financial reporting — the foundation for any investment role at PIF.' }, gain: { ar: 'المعيار الذهبي لوظائف الاستثمار في الصندوق', en: 'The gold standard for PIF investment roles' }, scoreAdd: 15, official: CFA, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '6 أشهر · 300 ساعة', en: '6 months · 300h' }, hadaf: true, hadafNote: { ar: 'تسترجع نحو 2,750 ر.س عبر هدف', en: 'Reclaim ~2,750 SAR via Hadaf' } },
      { name: { ar: 'CFA المستوى الثاني', en: 'CFA Level 2' }, desc: { ar: 'المستوى المتقدّم من برنامج CFA، ويركّز على تطبيق أدوات التقييم على فئات الأصول المختلفة. اجتيازه يضعك في نخبة المحللين ويفتح الأدوار القيادية في صناديق الاستثمار.', en: 'The advanced CFA level, focused on applying valuation tools across asset classes. Passing it puts you among elite analysts and opens senior fund roles.' }, gain: { ar: 'يفتح الأدوار القيادية في صناديق الاستثمار', en: 'Opens senior investment-fund roles' }, scoreAdd: 12, official: CFA, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '8 أشهر', en: '8 months' }, hadaf: true },
    ],
    picks: [
      { id: 'n1', kind: 'top', reason: { ar: 'مدير استثمار في تحوّل الطاقة بالصندوق — أعلى أهدافك', en: 'Investment Director, PIF Energy Transition — your top target' } },
      { id: 'n2', kind: 'top', reason: { ar: 'باحثة أولى في تمويل الطاقة بكابسارك', en: 'Senior Energy-Finance Fellow at KAPSARC' } },
      { id: 'n9', kind: 'mid', reason: { ar: 'مدير في الأسواق العامة — نقطة دخول أسهل', en: 'Public Markets associate — an easier way in' } },
      { id: 'n7', kind: 'common', reason: { ar: 'مديرة استثمار في طاقة نيوم — انتقلت من الهندسة إلى الاستثمار مثل مسارك', en: 'NEOM energy-investment manager — made the engineer-to-investing move you are making' } },
      { id: 'n10', kind: 'common', reason: { ar: 'تقود التمويل المستدام في الأهلي — تخصصك بعد شهادة تمويل المناخ', en: 'Leads sustainable finance at SNB — your niche after Climate Finance' } },
    ],
  },
  {
    id: 'power-renewables',
    name: { ar: 'هندسة الطاقة والمتجددة', en: 'Power & Renewables Engineering' },
    targets: { ar: 'أرامكو · أكوا باور · تحلية المياه · نيوم', en: 'Aramco · ACWA · Water Authority · NEOM' },
    accent: 'sky',
    icon: 'energy',
    months: 12,
    matchPercent: 90,
    trail: { ar: 'التناضح العكسي → الطاقة الشمسية → PMP → CEM → Six Sigma', en: 'Reverse Osmosis → Solar PV → PMP → CEM → Six Sigma' },
    certs: [
      { name: { ar: 'التناضح العكسي', en: 'Reverse Osmosis' }, desc: { ar: 'شهادة مهندس متخصص في التناضح العكسي من أكاديمية المياه. تثبت خبرتك التشغيلية في أكبر محطات التحلية — أساس قوي لأدوار الطاقة والمياه.', en: 'Reverse Osmosis Specialist Engineer from the Water Academy. It certifies your operational expertise at the largest desalination plants — a strong base for power and water roles.' }, gain: { ar: 'تثبت خبرتك في أكبر محطات التحلية', en: 'Certifies your large-scale desalination expertise' }, scoreAdd: 7, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'تصميم الطاقة الشمسية', en: 'Solar PV Design' }, desc: { ar: 'مصمم أنظمة طاقة شمسية معتمد من أكاديمية المياه. يضيف تصميم المتجددة إلى خبرتك في التوليد التقليدي.', en: 'Certified Solar PV Designer from the Water Academy. It adds renewables design to your conventional-generation experience.' }, gain: { ar: 'تصميم المتجددة المطلوب في أكوا ونيوم', en: 'Renewables design valued at ACWA and NEOM' }, scoreAdd: 6, official: 'https://wa.edu.sa', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'شهادة محترف إدارة المشاريع من معهد PMI، الأكثر اعترافًا عالميًا. لقيادة مشاريع الطاقة الكبرى في أرامكو وأكوا باور ومشاريع رؤية 2030.', en: 'PMI’s Project Management Professional, the most globally recognized PM credential — for leading major energy projects at Aramco, ACWA Power, and Vision 2030.' }, gain: { ar: 'يؤهّلك لقيادة مشاريع الطاقة الكبرى', en: 'Qualifies you to lead major energy projects' }, scoreAdd: 10, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'current', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'CEM', en: 'CEM' }, desc: { ar: 'مدير طاقة معتمد من جمعية مهندسي الطاقة (AEE). يثبت قدرتك على تحليل استهلاك الطاقة وتصميم حلول الكفاءة.', en: 'Certified Energy Manager from the AEE. It proves you can analyze energy use and design efficiency solutions.' }, gain: { ar: 'خبرة معتمدة في كفاءة الطاقة', en: 'Certified energy-efficiency expertise' }, scoreAdd: 9, official: 'https://www.aeecenter.org/certified-energy-manager-cem/', status: 'future', cost: { ar: '$1,500', en: '$1,500' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'Six Sigma', en: 'Six Sigma' }, desc: { ar: 'الحزام الأخضر في منهجية ستة سيجما لتحسين العمليات وتقليل الهدر، وهي منهجية تعتمدها أرامكو وكبرى الشركات الصناعية.', en: 'Green Belt in Six Sigma for process improvement and waste reduction — relied on by Aramco and major industrial firms.' }, gain: { ar: 'تحسين العمليات المطلوب في أرامكو', en: 'Process improvement valued at Aramco' }, scoreAdd: 7, official: 'https://asq.org/cert/six-sigma-green-belt', status: 'future', cost: { ar: '2,500 ر.س', en: '2,500 SAR' }, duration: { ar: 'شهران', en: '2 months' }, hadaf: true },
    ],
    picks: [
      { id: 'n3', kind: 'top', reason: { ar: 'نائب رئيس تطوير المشاريع في أكوا باور', en: 'VP Project Development at ACWA Power' } },
      { id: 'n6', kind: 'top', reason: { ar: 'يقود تحوّل الطاقة في أرامكو', en: 'Leads Energy Transition at Aramco' } },
      { id: 'n17', kind: 'mid', reason: { ar: 'مهندس عمليات أول — مدخل سهل', en: 'Senior ops engineer — an easy entry' } },
      { id: 'n4', kind: 'common', reason: { ar: 'مدير محطة في المؤسسة العامة للتحلية — زميل سابق محتمل', en: 'Plant Manager at the Water Authority — a likely former colleague' } },
      { id: 'n7', kind: 'common', reason: { ar: 'الاستثمار في طاقة نيوم — تقاطع تخصصك', en: 'NEOM energy investment — your crossover' } },
    ],
  },
  {
    id: 'consulting',
    name: { ar: 'استشارات الطاقة والاستراتيجية', en: 'Energy Strategy Consulting' },
    targets: { ar: 'ماكنزي · BCG · ستراتيجي&', en: 'McKinsey · BCG · Strategy&' },
    accent: 'violet',
    icon: 'consulting',
    months: 12,
    matchPercent: 85,
    trail: { ar: 'مهارات الاستشارات → دراسات الحالة → GMAT → FMVA', en: 'Consulting Skills → Case Prep → GMAT → FMVA' },
    certs: [
      { name: { ar: 'مهارات الاستشارات', en: 'Consulting Skills' }, desc: { ar: 'برنامج مهارات الاستشارات الأساسية من مسرّعة مستشار. يمنحك إطار حلّ المشكلات والتواصل التنفيذي المطلوب في المقابلات.', en: 'Foundational consulting skills from the Mustashar accelerator. It gives you the problem-solving and executive-communication frame interviews demand.' }, gain: { ar: 'أساس حلّ المشكلات والتواصل التنفيذي', en: 'Problem-solving and executive-communication base' }, scoreAdd: 6, official: 'https://mustashar.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'إعداد دراسات الحالة', en: 'Case Prep' }, desc: { ar: 'تدريب مكثّف على حلّ دراسات الحالة، وهي جوهر مقابلات شركات الاستشارات. تتعلّم كيف تفكّك مشكلة عمل وتبني توصية منظّمة تحت الضغط.', en: 'Intensive case-interview training, the core of consulting hiring. You learn to break down a business problem and build a structured recommendation under pressure.' }, gain: { ar: 'تجتاز مقابلات الحالة في ماكنزي وBCG', en: 'Pass case interviews at McKinsey and BCG' }, scoreAdd: 9, official: 'https://www.preplounge.com/', status: 'current', cost: { ar: '$300', en: '$300' }, duration: { ar: 'شهران', en: '2 months' } },
      { name: { ar: 'GMAT', en: 'GMAT' }, desc: { ar: 'اختبار القبول المعياري لبرامج الإدارة العليا، وكثيرًا ما تطلبه شركات الاستشارات الكبرى. درجة قوية تعزّز ملفك.', en: 'The standardized admissions test for top management programs, often requested by major consulting firms. A strong score strengthens your profile.' }, gain: { ar: 'بوابة الاستشارات والـ MBA', en: 'Gateway to consulting and MBA' }, scoreAdd: 8, official: 'https://www.mba.com/exams/gmat-exam', status: 'future', cost: { ar: '$275', en: '$275' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'FMVA', en: 'FMVA' }, desc: { ar: 'برنامج النمذجة المالية والتقييم، يمنحك ثقلًا كمّيًا يقوّي ملفك أمام شركات الاستشارات. عملي ويغطّي بناء النماذج وتحليل الصفقات.', en: 'The financial modeling and valuation program, giving you quantitative weight that strengthens a consulting profile.' }, gain: { ar: 'تحليل كمّي يميّز ملفك الاستشاري', en: 'Quant edge for a consulting profile' }, scoreAdd: 8, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, desc: { ar: 'ماجستير إدارة الأعمال، يفتح أدوار ما بعد الاستشارات في القيادة والاستثمار، ويوسّع شبكتك بشكل كبير.', en: 'The MBA, opening post-consulting leadership and investment roles and widening your network.' }, gain: { ar: 'يفتح أدوار ما بعد الاستشارات', en: 'Opens post-consulting roles' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    picks: [
      { id: 'n5', kind: 'top', reason: { ar: 'مديرة ارتباط في ممارسة الطاقة بماكنزي', en: 'Energy-practice EM at McKinsey' } },
      { id: 'n15', kind: 'top', reason: { ar: 'مبدأ في ممارسة الطاقة بستراتيجي&', en: 'Energy Principal at Strategy&' } },
      { id: 'n12', kind: 'mid', reason: { ar: 'مستشارة طاقة في BCG — مدخل جيد', en: 'Energy consultant at BCG — a good way in' } },
      { id: 'n2', kind: 'common', reason: { ar: 'باحثة كابسارك — تتقاطع مع تحليلك للطاقة', en: 'KAPSARC researcher — overlaps your energy analysis' } },
      { id: 'n1', kind: 'common', reason: { ar: 'يقود استثمارات الطاقة في الصندوق', en: 'Leads energy investments at PIF' } },
    ],
  },
  {
    id: 'government',
    name: { ar: 'سياسات الطاقة والقطاع الحكومي', en: 'Energy Policy & Government' },
    targets: { ar: 'وزارة الطاقة · كابسارك · رؤية 2030', en: 'Ministry of Energy · KAPSARC · Vision 2030' },
    accent: 'amber',
    icon: 'government',
    months: 18,
    matchPercent: 82,
    trail: { ar: 'تمويل المناخ → دبلوم السياسات → PMP → PgMP', en: 'Climate Finance → Policy Diploma → PMP → PgMP' },
    certs: [
      { name: { ar: 'تمويل المناخ', en: 'Climate Finance' }, desc: { ar: 'برنامج تمويل المناخ والاستدامة من كابسارك. يربط نمذجتك لمسار 2060 بأدوات السياسة والتمويل المناخي.', en: 'KAPSARC’s climate finance and sustainability program. It ties your 2060-pathway modeling to policy and climate-finance tools.' }, gain: { ar: 'يربط نمذجتك بالسياسة والتمويل المناخي', en: 'Links your modeling to climate policy and finance' }, scoreAdd: 7, official: 'https://www.kapsarc.org', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'دبلوم السياسات العامة', en: 'Public Policy Diploma' }, desc: { ar: 'دبلوم متخصّص في تحليل وصياغة السياسات العامة. يؤهّلك لمكاتب الاستراتيجية والتخطيط في الوزارات والهيئات.', en: 'A specialized diploma in public-policy analysis and design. It prepares you for strategy and planning offices in ministries and authorities.' }, gain: { ar: 'صياغة وتحليل سياسات الطاقة', en: 'Energy policy design and analysis' }, scoreAdd: 9, official: 'https://www.spsp.edu.sa/', status: 'current', cost: { ar: '5,000 ر.س', en: '5,000 SAR' }, duration: { ar: '5 أشهر', en: '5 months' }, hadaf: true },
      { name: { ar: 'PMP', en: 'PMP' }, desc: { ar: 'محترف إدارة المشاريع من PMI، لقيادة مشاريع التحول ضمن رؤية 2030 داخل الجهات الحكومية.', en: 'PMI’s Project Management Professional, for leading Vision 2030 transformation projects in government.' }, gain: { ar: 'قيادة مشاريع رؤية 2030', en: 'Lead Vision 2030 projects' }, scoreAdd: 9, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: { ar: 'PgMP', en: 'PgMP' }, desc: { ar: 'محترف إدارة البرامج من PMI، المستوى الأعلى من PMP، لقيادة محافظ المشاريع على مستوى المؤسسة.', en: 'PMI’s Program Management Professional, above PMP — for leading enterprise-level project portfolios.' }, gain: { ar: 'إدارة برامج الطاقة الكبرى', en: 'Manage large energy programs' }, scoreAdd: 8, official: 'https://www.pmi.org/certifications/program-management-pgmp', status: 'future', cost: { ar: '$800', en: '$800' }, duration: { ar: '4 أشهر', en: '4 months' } },
      { name: { ar: 'دكتوراه إدارة الأعمال', en: 'DBA' }, desc: { ar: 'دكتوراه إدارة الأعمال، أعلى مؤهل تطبيقي للأدوار القيادية العليا في السياسات والاستراتيجية.', en: 'The Doctor of Business Administration, the top applied qualification for senior policy and strategy leadership.' }, gain: { ar: 'المؤهل الأعلى للقيادة', en: 'Top leadership credential' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '12 شهرًا', en: '12 months' } },
    ],
    picks: [
      { id: 'n8', kind: 'top', reason: { ar: 'مدير الاستراتيجية في وزارة الطاقة', en: 'Director of Strategy, Ministry of Energy' } },
      { id: 'n2', kind: 'top', reason: { ar: 'باحثة أولى في كابسارك', en: 'Senior Fellow at KAPSARC' } },
      { id: 'n16', kind: 'mid', reason: { ar: 'باحث سياسات في كابسارك — مدخل بحثي', en: 'Policy researcher at KAPSARC — a research entry' } },
      { id: 'n1', kind: 'common', reason: { ar: 'تحوّل الطاقة في الصندوق — قريب من نمذجتك', en: 'PIF Energy Transition — close to your modeling' } },
      { id: 'n7', kind: 'common', reason: { ar: 'استثمار طاقة نيوم — مشاريع رؤية 2030', en: 'NEOM energy investment — Vision 2030 projects' } },
    ],
  },
  {
    id: 'tech',
    name: { ar: 'الذكاء الاصطناعي والبيانات للطاقة', en: 'AI & Data for Energy' },
    targets: { ar: 'أرامكو الرقمية · stc · علم', en: 'Aramco Digital · stc · Elm' },
    accent: 'rose',
    icon: 'tech',
    months: 12,
    matchPercent: 80,
    trail: { ar: 'تحليل البيانات → AWS → Scrum → تحليلات متقدمة', en: 'Data Analyst → AWS → Scrum → Advanced Analytics' },
    certs: [
      { name: { ar: 'تحليل البيانات', en: 'Data Analyst' }, desc: { ar: 'شهادة محلل بيانات من IBM، تغطّي أدوات التحليل والتصوّر واتخاذ القرار بالبيانات. تكمّل خلفيتك في الذكاء الاصطناعي ومشروع نموذجك التنبؤي.', en: 'IBM’s Data Analyst certificate covering analysis, visualization, and data-driven decisions. It complements your AI background and your predictive-model project.' }, gain: { ar: 'تحليل البيانات واتخاذ القرار', en: 'Data analysis and decision-making' }, scoreAdd: 6, official: 'https://www.ibm.com/training/badge/data-analyst', status: 'done', cost: { ar: 'منجزة', en: 'Completed' }, duration: { ar: 'أنجزتها', en: 'Completed' } },
      { name: { ar: 'AWS SAA', en: 'AWS SAA' }, desc: { ar: 'مهندس حلول معتمد على منصة AWS (المستوى المساعد). يثبت قدرتك على تصميم أنظمة سحابية موثوقة، وهي من أكثر الشهادات طلبًا في الجهات التقنية.', en: 'AWS Certified Solutions Architect – Associate. It proves you can design reliable cloud systems, one of the most in-demand tech credentials.' }, gain: { ar: 'تصميم الحلول السحابية المطلوبة', en: 'In-demand cloud architecture' }, scoreAdd: 9, official: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', status: 'current', cost: { ar: '$150', en: '$150' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: { ar: 'PSM', en: 'PSM' }, desc: { ar: 'سكرَم ماستر محترف، لقيادة فرق التطوير الرشيقة. أساس العمل في فرق المنتجات التقنية الحديثة.', en: 'Professional Scrum Master, for leading agile development teams. Foundational to modern tech product teams.' }, gain: { ar: 'قيادة فرق أجايل', en: 'Lead agile teams' }, scoreAdd: 6, official: 'https://www.scrum.org/professional-scrum-master-certifications', status: 'future', cost: { ar: '$200', en: '$200' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: { ar: 'تحليلات متقدمة', en: 'Advanced Analytics' }, desc: { ar: 'برنامج تحليلات وتعلّم آلة متقدم يبني على أساسك في الذكاء الاصطناعي ومشروعك التنبؤي لمحطة كورنيل.', en: 'An advanced analytics and machine-learning program building on your AI foundation and your Cornell-plant predictive project.' }, gain: { ar: 'نمذجة تنبؤية لأنظمة الطاقة', en: 'Predictive modeling for energy systems' }, scoreAdd: 9, official: 'https://www.coursera.org/professional-certificates/google-data-analytics', status: 'future', cost: { ar: '3,500 ر.س', en: '3,500 SAR' }, duration: { ar: '3 أشهر', en: '3 months' }, hadaf: true },
      { name: { ar: 'ماجستير إدارة الأعمال', en: 'MBA' }, desc: { ar: 'ماجستير إدارة الأعمال، يجمع بين خبرتك التقنية والإدارة للانتقال إلى قيادة المنتجات والاستراتيجية الرقمية.', en: 'The MBA, bridging your technical expertise and management for product leadership and digital strategy.' }, gain: { ar: 'يجمع التقنية بالإدارة', en: 'Bridges tech and management' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    picks: [
      { id: 'n13', kind: 'top', reason: { ar: 'مدير منتجات رقمية في أرامكو الرقمية', en: 'Digital Product Lead at Aramco Digital' } },
      { id: 'n14', kind: 'top', reason: { ar: 'مديرة بيانات وذكاء اصطناعي في stc', en: 'Data & AI Manager at stc' } },
      { id: 'n18', kind: 'mid', reason: { ar: 'قائدة هندسة في علم — مدخل تقني', en: 'Engineering lead at Elm — a technical entry' } },
      { id: 'n6', kind: 'common', reason: { ar: 'تحوّل الطاقة في أرامكو — تقاطع طاقة وتقنية', en: 'Aramco energy transition — energy-meets-tech' } },
      { id: 'n2', kind: 'common', reason: { ar: 'تحليلات الطاقة في كابسارك', en: 'Energy analytics at KAPSARC' } },
    ],
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
  const q = encodeURIComponent(`${c.name.en} ${c.company.en}`);
  return `https://www.linkedin.com/search/results/people/?keywords=${q}`;
}

/* ----------------------------------------- LinkedIn network CSV matching -- */
// The customer's Connections.csv is parsed entirely in the browser: it is never
// uploaded or stored (PDPL). We use it only to flag who they already know and to
// float warm intros to the top of the list.

export type NetworkData = { names: Set<string>; companies: Set<string> };
export type NetMatch = 'you' | 'company' | null;

function normName(s: string): string {
  return s.toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

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
export function parseConnectionsCsv(text: string): NetworkData {
  const names = new Set<string>();
  const companies = new Set<string>();
  const lines = text.split(/\r?\n/);
  let headerIdx = lines.findIndex((l) => /first name/i.test(l) && /last name/i.test(l));
  if (headerIdx === -1) headerIdx = 0;
  const header = splitCsvLine(lines[headerIdx] ?? '').map((h) => h.trim().toLowerCase());
  const iFirst = header.indexOf('first name');
  const iLast = header.indexOf('last name');
  const iCompany = header.indexOf('company');

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw || !raw.trim()) continue;
    const cells = splitCsvLine(raw);
    const first = (iFirst >= 0 ? cells[iFirst] : cells[0]) ?? '';
    const last = (iLast >= 0 ? cells[iLast] : cells[1]) ?? '';
    const full = normName(`${first} ${last}`);
    if (full) names.add(full);
    const company = (iCompany >= 0 ? cells[iCompany] : '') ?? '';
    const nc = normCompany(company);
    if (nc.length >= 3) companies.add(nc);
  }
  return { names, companies };
}

export function matchContact(c: Contact, net: NetworkData | null): NetMatch {
  if (!net) return null;
  if (net.names.has(normName(c.name.en))) return 'you';
  const comp = normCompany(c.company.en);
  if (comp.length >= 3) {
    for (const cc of net.companies) {
      const [short, long] = comp.length <= cc.length ? [comp, cc] : [cc, comp];
      if (short.length >= 3 && long.includes(short)) return 'company';
    }
  }
  return null;
}

// Attach a match flag to each contact and float warm intros (you > company) to
// the top, keeping the score order within each band.
export function rankByNetwork(
  list: Contact[],
  net: NetworkData | null,
): { contact: Contact; match: NetMatch }[] {
  const withMatch = list.map((contact) => ({ contact, match: matchContact(contact, net) }));
  if (!net) return withMatch;
  const rank = (m: NetMatch) => (m === 'you' ? 0 : m === 'company' ? 1 : 2);
  return withMatch.sort((a, b) => {
    const r = rank(a.match) - rank(b.match);
    if (r !== 0) return r;
    return (b.contact.score ?? 0) - (a.contact.score ?? 0);
  });
}

export function countMatches(list: Contact[], net: NetworkData | null): number {
  if (!net) return 0;
  return list.reduce((n, c) => (matchContact(c, net) ? n + 1 : n), 0);
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
    improvementsTitle: { ar: 'ما الذي يرفع درجتك', en: 'What raises your score' },
    tipTitle: { ar: 'أهمّ خطوة اليوم', en: "Today's top move" },
    tip: {
      ar: 'ابدأ بعبدالعزيز القصبي في تحوّل الطاقة بالصندوق — أعلى أهدافك ملاءمةً (191).',
      en: 'Start with Abdulaziz Alqasabi at PIF Energy Transition — your strongest match (191).',
    },
    actionsTitle: { ar: 'ابدأ بهؤلاء اليوم', en: 'Start with these today' },
    actionsSub: { ar: 'الأعلى ملاءمةً أولًا', en: 'Highest match first' },
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
    match: { ar: 'ملاءمة', en: 'match' },
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
    statusHint: { ar: 'اضغط الحالة لتحديثها', en: 'Tap the status to update it' },
    inNetwork: { ar: 'في شبكتك', en: 'In your network' },
    sameCompany: { ar: 'تعرف من في شركته', en: 'You know someone here' },
    empty: { ar: 'لا نتائج مطابقة.', en: 'No matching results.' },
    status_new: { ar: 'جديد', en: 'New' },
    status_sent: { ar: 'مُرسل', en: 'Sent' },
    status_replied: { ar: 'ردّ', en: 'Replied' },
    status_followup: { ar: 'متابعة', en: 'Follow-up' },
  },
  network: {
    title: { ar: 'اربط شبكتك في لينكدإن', en: 'Connect your LinkedIn network' },
    body: {
      ar: 'ارفع ملف جهات اتصالك (Connections.csv) لنبيّن لك مَن من هؤلاء تعرفه أصلًا أو تعرف زميلًا له — فالمقدمة الدافئة تتفوّق على الرسالة الباردة. الملف يبقى في متصفحك ولا نخزّنه.',
      en: 'Upload your Connections.csv to see which of these people you already know — or know a colleague of. A warm intro beats a cold message. The file stays in your browser; we never store it.',
    },
    note: { ar: 'يستغرق لينكدإن من 12 إلى 24 ساعة لإرسال الملف إلى بريدك.', en: 'LinkedIn takes 12–24 hours to email you the file.' },
    upload: { ar: 'ارفع Connections.csv', en: 'Upload Connections.csv' },
    matched: { ar: (n: number) => `تعرف ${n} من قائمتك`, en: (n: number) => `You know ${n} on your list` },
    ranked: { ar: 'رفعنا المقدمات الدافئة إلى أعلى القائمة.', en: 'Warm intros moved to the top of your list.' },
    none: { ar: 'لم نطابق أحدًا بعد — جرّب ملفًا آخر.', en: 'No matches yet — try another file.' },
    clear: { ar: 'إزالة الملف', en: 'Clear file' },
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
    vsBenchmark: { ar: 'أعلى بكثير من المتوسط', en: 'Well above average' },
    weekly: { ar: 'نشاطك هذا الأسبوع', en: 'This week' },
    recent: { ar: 'آخر النشاط', en: 'Recent activity' },
  },
} as const;
