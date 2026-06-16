// Sample customer data for the Masaar product dashboard (the deliverable a
// customer receives after purchase). Demo data uses the founder's own profile;
// in production each field is generated per customer from their CV and goals.
//
// Arabic copy is written natively (not translated) to match the marketing voice.

export type Loc = 'ar' | 'en';
export type LS = { ar: string; en: string };

export function tr(s: LS, locale: Loc): string {
  return s[locale];
}

/* ----------------------------------------------------------------- profile -- */

export const profile = {
  name: { ar: 'علي الأجود', en: 'Ali Alajwad' } satisfies LS,
  headline: {
    ar: 'ماجستير اقتصاديات الطاقة · كورنيل',
    en: 'M.Eng Energy Economics · Cornell',
  } satisfies LS,
};

export const journey = {
  percent: 62,
  certsDone: 3,
  certsTotal: 5,
  messagesSent: 47,
  replies: 3,
};

/* ------------------------------------------------------------------- types -- */

export type AccentKey = 'brand' | 'sky' | 'violet' | 'amber' | 'rose';
export type IndustryKey = 'finance' | 'energy' | 'consulting' | 'government' | 'tech';

export type CompanyKey =
  | 'pif' | 'aramco' | 'acwa' | 'neom' | 'gov'
  | 'mck' | 'bcg' | 'bain' | 'strat' | 'pwc'
  | 'stc' | 'elm' | 'cst';

export type Cert = {
  name: string;
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
  score?: number; // AI match, 100-200 (omitted for HR)
  status: ContactStatus;
  when: LS;
};

export const industries: { id: IndustryKey; label: LS }[] = [
  { id: 'finance', label: { ar: 'المالية', en: 'Finance' } },
  { id: 'energy', label: { ar: 'الطاقة', en: 'Energy' } },
  { id: 'consulting', label: { ar: 'الاستشارات', en: 'Consulting' } },
  { id: 'government', label: { ar: 'الحكومي', en: 'Government' } },
  { id: 'tech', label: { ar: 'التقنية', en: 'Tech' } },
];

/* ----------------------------------------------------- connections (targets) -- */

export const connections: Contact[] = [
  { id: 'n1', name: { ar: 'عبدالرحمن العتيبي', en: 'Abdulrahman Alotaibi' }, role: { ar: 'رئيس برامج القطاع', en: 'Head of Sector Programs' }, company: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, companyKey: 'pif', industry: 'finance', score: 192, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n2', name: { ar: 'علي الصاحب', en: 'Ali Alsaheb' }, role: { ar: 'مدير محفظة أول', en: 'Senior Portfolio Director' }, company: { ar: 'الصندوق · تحوّل الطاقة', en: 'PIF · Energy Transition' }, companyKey: 'pif', industry: 'finance', score: 189, status: 'new', when: { ar: 'أمس', en: 'Yesterday' } },
  { id: 'n3', name: { ar: 'عبدالرحمن الفوزان', en: 'Abdulrahman Alfawzan' }, role: { ar: 'مدير ارتباط أول', en: 'Senior Engagement Manager' }, company: { ar: 'ماكنزي وشركاه', en: 'McKinsey & Company' }, companyKey: 'mck', industry: 'consulting', score: 178, status: 'replied', when: { ar: 'قبل ساعتين', en: '2h ago' } },
  { id: 'n4', name: { ar: 'مؤيد الشويعر', en: 'Mowayed Alshuwaier' }, role: { ar: 'رئيس تنفيذي · شركة مشروع', en: 'CEO, SPV' }, company: { ar: 'أكوا باور', en: 'ACWA Power' }, companyKey: 'acwa', industry: 'energy', score: 173, status: 'sent', when: { ar: 'قبل 4 أيام', en: '4 days ago' } },
  { id: 'n5', name: { ar: 'نورة السديري', en: 'Noura Alsudairi' }, role: { ar: 'مستشارة', en: 'Consultant' }, company: { ar: 'BCG', en: 'BCG' }, companyKey: 'bcg', industry: 'consulting', score: 170, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n6', name: { ar: 'ريم العمران', en: 'Reem Alomran' }, role: { ar: 'مديرة أولى · الصفقات', en: 'Senior Manager, Deals' }, company: { ar: 'PwC السعودية', en: 'PwC Saudi' }, companyKey: 'pwc', industry: 'finance', score: 167, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n7', name: { ar: 'أحمد الشهراني', en: 'Ahmed Alshahrani' }, role: { ar: 'مدير تخطيط أول', en: 'Senior Director, Planning' }, company: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' }, companyKey: 'gov', industry: 'government', score: 165, status: 'followup', when: { ar: 'متابعة · 9 أيام', en: 'Follow-up · 9d' } },
  { id: 'n8', name: { ar: 'سارة القحطاني', en: 'Sara Alqahtani' }, role: { ar: 'مديرة استقطاب المواهب', en: 'Talent Acquisition Lead' }, company: { ar: 'نيوم', en: 'NEOM' }, companyKey: 'neom', industry: 'energy', score: 164, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n9', name: { ar: 'فهد القرني', en: 'Fahad Alqarni' }, role: { ar: 'مساعد أول', en: 'Senior Associate' }, company: { ar: 'بِين وشركاه', en: 'Bain & Company' }, companyKey: 'bain', industry: 'consulting', score: 162, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n10', name: { ar: 'يوسف هاشم', en: 'Yusuf Hashem' }, role: { ar: 'مختصّ استثمار', en: 'Investment Associate' }, company: { ar: 'الصندوق · الأسواق العامة', en: 'PIF · Public Markets' }, companyKey: 'pif', industry: 'finance', score: 161, status: 'sent', when: { ar: 'قبل 5 ساعات', en: '5h ago' } },
  { id: 'n11', name: { ar: 'ريان الشمري', en: 'Rayan Alshammari' }, role: { ar: 'مدير منتج', en: 'Product Manager' }, company: { ar: 'stc', en: 'stc' }, companyKey: 'stc', industry: 'tech', score: 160, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n12', name: { ar: 'منيرة الحربي', en: 'Munira Alharbi' }, role: { ar: 'مديرة عامة', en: 'Director General' }, company: { ar: 'وزارة الاقتصاد والتخطيط', en: 'Ministry of Economy' }, companyKey: 'gov', industry: 'government', score: 158, status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'n13', name: { ar: 'خالد الدوسري', en: 'Khalid Aldossari' }, role: { ar: 'مدير تطوير أعمال', en: 'Business Development Manager' }, company: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' }, companyKey: 'aramco', industry: 'energy', score: 156, status: 'sent', when: { ar: 'قبل أسبوع', en: '1 week ago' } },
  { id: 'n14', name: { ar: 'هند العتيبي', en: 'Hind Alotaibi' }, role: { ar: 'قائدة هندسة برمجيات', en: 'Engineering Lead' }, company: { ar: 'علم', en: 'Elm' }, companyKey: 'elm', industry: 'tech', score: 155, status: 'new', when: { ar: 'جديد', en: 'New' } },
];

/* ----------------------------------------------------------- HR / recruiters -- */

export const hrContacts: Contact[] = [
  { id: 'h1', name: { ar: 'لمى الراجحي', en: 'Lama Alrajhi' }, role: { ar: 'شريكة استقطاب المواهب', en: 'Talent Acquisition Partner' }, company: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, companyKey: 'pif', industry: 'finance', status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'h2', name: { ar: 'بدر الدوسري', en: 'Badr Aldossari' }, role: { ar: 'قائد التوظيف', en: 'Recruitment Lead' }, company: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' }, companyKey: 'aramco', industry: 'energy', status: 'sent', when: { ar: 'قبل 3 أيام', en: '3 days ago' } },
  { id: 'h3', name: { ar: 'جواهر السبيعي', en: 'Jawaher Alsubaie' }, role: { ar: 'أخصائية توظيف أولى', en: 'Senior Recruiter' }, company: { ar: 'نيوم', en: 'NEOM' }, companyKey: 'neom', industry: 'energy', status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'h4', name: { ar: 'طلال العنزي', en: 'Talal Alanazi' }, role: { ar: 'شريك موارد بشرية', en: 'HR Business Partner' }, company: { ar: 'stc', en: 'stc' }, companyKey: 'stc', industry: 'tech', status: 'new', when: { ar: 'جديد', en: 'New' } },
  { id: 'h5', name: { ar: 'عبير الزهراني', en: 'Abeer Alzahrani' }, role: { ar: 'مسؤولة استقطاب', en: 'Talent Sourcer' }, company: { ar: 'ماكنزي وشركاه', en: 'McKinsey & Company' }, companyKey: 'mck', industry: 'consulting', status: 'sent', when: { ar: 'قبل أسبوع', en: '1 week ago' } },
  { id: 'h6', name: { ar: 'سلطان المالكي', en: 'Sultan Almalki' }, role: { ar: 'أخصائي توظيف', en: 'Recruiter' }, company: { ar: 'وزارة الموارد البشرية', en: 'Ministry of HR' }, companyKey: 'gov', industry: 'government', status: 'new', when: { ar: 'جديد', en: 'New' } },
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
  trail: string;
  certs: Cert[];
  picks: PathPick[];
};

export const paths: CareerPath[] = [
  {
    id: 'finance',
    name: { ar: 'المالية والاستثمار', en: 'Finance & Investment' },
    targets: { ar: 'صندوق الاستثمارات العامة · ماكنزي · Big 4', en: 'PIF · McKinsey · Big 4' },
    accent: 'brand',
    icon: 'finance',
    months: 18,
    matchPercent: 94,
    primary: true,
    trail: 'SOCPA → CME-1 → FMVA → CFA L1 → CFA L2',
    certs: [
      { name: 'SOCPA', desc: { ar: 'الزمالة السعودية للمحاسبين القانونيين، وهي أعلى اعتماد محاسبي في المملكة. تثبت إتقانك لمعايير المحاسبة والمراجعة السعودية، وتُعدّ شرطًا لكثير من الأدوار المالية العليا في الجهات الحكومية وشبه الحكومية.', en: 'The Saudi fellowship for chartered accountants, the highest accounting credential in the Kingdom. It proves command of Saudi accounting and audit standards and is often required for senior public-sector finance roles.' }, gain: { ar: 'يفتح الأدوار المالية المعتمدة في القطاع الحكومي', en: 'Unlocks accredited finance roles in the public sector' }, scoreAdd: 8, official: 'https://socpa.org.sa', status: 'done', cost: { ar: '3,500 ر.س', en: '3,500 SAR' }, duration: { ar: 'أنجزتها', en: 'Completed' }, hadaf: true },
      { name: 'CME-1', desc: { ar: 'الشهادة التأسيسية من المعهد المالي، وهي مطلب تنظيمي للعمل في الأسواق المالية السعودية. تغطّي أساسيات الأنظمة والمنتجات المالية وقواعد هيئة السوق المالية.', en: 'The Financial Academy’s foundational license, a regulatory requirement to work in Saudi capital markets. It covers financial regulations, products, and CMA rules.' }, gain: { ar: 'ترخيص للعمل في الأسواق المالية السعودية', en: 'License to work in Saudi capital markets' }, scoreAdd: 6, official: 'https://fa.gov.sa', status: 'done', cost: { ar: '2,000 ر.س', en: '2,000 SAR' }, duration: { ar: 'أنجزتها', en: 'Completed' }, hadaf: true },
      { name: 'FMVA', desc: { ar: 'برنامج معهد تمويل الشركات لبناء النماذج المالية وتقييم الشركات. عملي بالكامل: تتخرّج منه قادرًا على بناء نموذج مالي متكامل من الصفر، وهي من أكثر المهارات طلبًا في فرق الاستثمار والصفقات.', en: 'CFI’s hands-on program for financial modeling and company valuation. You finish able to build a full model from scratch, the most in-demand skill on investment and deals teams.' }, gain: { ar: 'إتقان النمذجة المالية المطلوبة في الصفقات', en: 'Deal-grade financial modeling skills' }, scoreAdd: 9, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'done', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      {
        name: 'CFA Level 1',
        desc: { ar: 'المستوى الأول من شهادة محلل مالي معتمد، المعيار العالمي الأرفع في إدارة الاستثمار. يغطّي الأخلاقيات والأدوات الكمية والاقتصاد وتحليل القوائم المالية، وهو حجر الأساس لأي دور استثماري في الصندوق.', en: 'Level 1 of the Chartered Financial Analyst program, the global gold standard in investment management. It spans ethics, quantitative methods, economics, and financial reporting, the foundation for any investment role at PIF.' },
        gain: { ar: 'المعيار الذهبي لوظائف الاستثمار في الصندوق', en: 'The gold standard for PIF investment roles' },
        scoreAdd: 15,
        official: 'https://www.cfainstitute.org/en/programs/cfa',
        status: 'current',
        cost: { ar: '5,500 ر.س', en: '5,500 SAR' },
        duration: { ar: '6 أشهر · 300 ساعة', en: '6 months · 300h' },
        hadaf: true,
        hadafNote: { ar: 'تسترجع نحو 2,750 ر.س عبر هدف', en: 'Reclaim ~2,750 SAR via Hadaf' },
        why: {
          ar: 'الشهادة الأهم لوظائف الاستثمار في الصندوق. امتحانها في فبراير 2027، فابدأ التحضير من يونيو.',
          en: 'The key credential for PIF investment roles. The exam is Feb 2027, so start studying in June.',
        },
      },
      { name: 'CFA Level 2', desc: { ar: 'المستوى المتقدّم من برنامج CFA، ويركّز على تطبيق أدوات التقييم على فئات الأصول المختلفة. اجتيازه يضعك في نخبة المحللين ويميّزك للأدوار القيادية في الـ Big 4 وصناديق الاستثمار.', en: 'The advanced CFA level, focused on applying valuation tools across asset classes. Passing it puts you among elite analysts and sets you apart for senior Big 4 and fund roles.' }, gain: { ar: 'يميّزك للأدوار القيادية في الـ Big 4', en: 'Sets you apart for senior Big 4 roles' }, scoreAdd: 12, official: 'https://www.cfainstitute.org/en/programs/cfa', status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '8 أشهر', en: '8 months' }, hadaf: true },
    ],
    picks: [
      { id: 'n1', kind: 'top', reason: { ar: 'رئيس برامج القطاع — أعلى أهدافك منصبًا في الصندوق', en: 'Head of Sector Programs — your most senior target at PIF' } },
      { id: 'n2', kind: 'top', reason: { ar: 'مدير محفظة أول في تحوّل الطاقة', en: 'Senior portfolio director in Energy Transition' } },
      { id: 'n10', kind: 'mid', reason: { ar: 'مختصّ استثمار — نقطة دخول أسهل للتعارف', en: 'Investment associate — an easier first contact' } },
      { id: 'n6', kind: 'common', reason: { ar: 'خرّيجة كورنيل مثلك', en: 'Cornell alum, like you' } },
      { id: 'n3', kind: 'common', reason: { ar: 'عمل سابقًا في رأس الخير', en: 'Previously worked at Ras Al-Khair' } },
    ],
  },
  {
    id: 'energy',
    name: { ar: 'الهندسة والطاقة', en: 'Engineering & Energy' },
    targets: { ar: 'أرامكو · أكوا باور · نيوم', en: 'Aramco · ACWA · NEOM' },
    accent: 'sky',
    icon: 'energy',
    months: 15,
    matchPercent: 88,
    trail: 'PMP → CEM → Six Sigma → ISO 50001 → MBA',
    certs: [
      { name: 'PMP', desc: { ar: 'شهادة محترف إدارة المشاريع من معهد PMI، وهي الأكثر اعترافًا عالميًا في هذا المجال. مطلوبة لقيادة المشاريع الكبرى في أرامكو وأكوا باور ومبادرات رؤية 2030.', en: 'PMI’s Project Management Professional, the most globally recognized PM credential. Expected for leading major projects at Aramco, ACWA Power, and Vision 2030 initiatives.' }, gain: { ar: 'يؤهّلك لقيادة مشاريع الطاقة الكبرى', en: 'Qualifies you to lead major energy projects' }, scoreAdd: 10, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: 'CEM', desc: { ar: 'مدير طاقة معتمد من جمعية مهندسي الطاقة (AEE). يثبت قدرتك على تحليل استهلاك الطاقة وتصميم حلول الكفاءة، وهي خبرة مطلوبة في قطاع الطاقة المتجددة.', en: 'Certified Energy Manager from the AEE. It proves you can analyze energy use and design efficiency solutions, sought-after in the renewables sector.' }, gain: { ar: 'خبرة معتمدة في كفاءة الطاقة', en: 'Certified energy-efficiency expertise' }, scoreAdd: 9, official: 'https://www.aeecenter.org/certified-energy-manager-cem/', status: 'future', cost: { ar: '$1,500', en: '$1,500' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'Six Sigma', desc: { ar: 'الحزام الأخضر في منهجية ستة سيجما لتحسين العمليات وتقليل الهدر. منهجية تعتمدها أرامكو وكبرى الشركات الصناعية لرفع الكفاءة التشغيلية.', en: 'Green Belt in the Six Sigma methodology for process improvement and waste reduction, relied on by Aramco and major industrial firms.' }, gain: { ar: 'تحسين العمليات المطلوب في أرامكو', en: 'Process improvement valued at Aramco' }, scoreAdd: 7, official: 'https://asq.org/cert/six-sigma-green-belt', status: 'future', cost: { ar: '2,500 ر.س', en: '2,500 SAR' }, duration: { ar: 'شهران', en: '2 months' }, hadaf: true },
      { name: 'ISO 50001', desc: { ar: 'تأهيل مدقّق رئيسي لأنظمة إدارة الطاقة وفق معيار ISO 50001. يؤهّلك لتدقيق واعتماد أنظمة الطاقة في المنشآت الكبرى.', en: 'Lead-auditor qualification for energy management systems under ISO 50001. It qualifies you to audit and certify energy systems at large facilities.' }, gain: { ar: 'تدقيق أنظمة إدارة الطاقة', en: 'Energy management system auditing' }, scoreAdd: 6, official: 'https://www.iso.org/iso-50001-energy-management.html', status: 'future', cost: { ar: '3,000 ر.س', en: '3,000 SAR' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: 'MBA', desc: { ar: 'ماجستير إدارة الأعمال، البوابة الكلاسيكية للأدوار القيادية. يجمع بين الإستراتيجية والمالية والقيادة، ويوسّع شبكتك المهنية بشكل كبير.', en: 'The MBA, the classic gateway to leadership roles. It blends strategy, finance, and leadership and widens your network dramatically.' }, gain: { ar: 'يفتح المسارات القيادية', en: 'Opens leadership tracks' }, scoreAdd: 14, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    picks: [
      { id: 'n4', kind: 'top', reason: { ar: 'رئيس تنفيذي لشركة مشروع في أكوا باور', en: 'CEO of an SPV at ACWA Power' } },
      { id: 'n7', kind: 'top', reason: { ar: 'يقود التخطيط في وزارة الطاقة', en: 'Leads planning at the Ministry of Energy' } },
      { id: 'n8', kind: 'mid', reason: { ar: 'استقطاب المواهب في نيوم', en: 'Talent acquisition at NEOM' } },
      { id: 'n13', kind: 'common', reason: { ar: 'خبرة في رأس الخير مثلك', en: 'Ras Al-Khair background, like you' } },
      { id: 'n2', kind: 'common', reason: { ar: 'يعمل في تحوّل الطاقة بالصندوق', en: 'Works in PIF Energy Transition' } },
    ],
  },
  {
    id: 'consulting',
    name: { ar: 'الاستشارات الإستراتيجية', en: 'Strategy Consulting' },
    targets: { ar: 'ماكنزي · BCG · Bain', en: 'McKinsey · BCG · Bain' },
    accent: 'violet',
    icon: 'consulting',
    months: 12,
    matchPercent: 82,
    trail: 'Case prep → GMAT → FMVA → PSPO → MBA',
    certs: [
      { name: 'Case Prep', desc: { ar: 'تدريب مكثّف على حلّ دراسات الحالة، وهي جوهر مقابلات شركات الاستشارات. تتعلّم كيف تفكّك مشكلة عمل وتبني توصية منظّمة تحت الضغط.', en: 'Intensive case-interview training, the core of consulting hiring. You learn to break down a business problem and build a structured recommendation under pressure.' }, gain: { ar: 'تجتاز مقابلات الحالة في ماكنزي وBCG', en: 'Pass case interviews at McKinsey and BCG' }, scoreAdd: 8, official: 'https://www.preplounge.com/', status: 'future', cost: { ar: '$300', en: '$300' }, duration: { ar: 'شهران', en: '2 months' } },
      { name: 'GMAT', desc: { ar: 'اختبار القبول المعياري لبرامج الإدارة العليا، وكثيرًا ما تطلبه شركات الاستشارات الكبرى. درجة قوية تفتح أبواب أفضل برامج الماجستير.', en: 'The standardized admissions test for top management programs, often requested by major consulting firms. A strong score opens the best master’s programs.' }, gain: { ar: 'بوابة القبول في الاستشارات والـ MBA', en: 'Gateway to consulting and MBA admissions' }, scoreAdd: 9, official: 'https://www.mba.com/exams/gmat-exam', status: 'future', cost: { ar: '$275', en: '$275' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'FMVA', desc: { ar: 'برنامج النمذجة المالية والتقييم، يمنحك ثقلًا كمّيًا يقوّي ملفك أمام شركات الاستشارات. عملي ويغطّي بناء النماذج وتحليل الصفقات.', en: 'The financial modeling and valuation program, giving you quantitative weight that strengthens a consulting profile. Hands-on across model building and deal analysis.' }, gain: { ar: 'تحليل كمّي يقوّي ملفك الاستشاري', en: 'Quant skills that strengthen a consulting profile' }, scoreAdd: 9, official: 'https://corporatefinanceinstitute.com/certifications/fmva-program/', status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'PSPO', desc: { ar: 'شهادة مالك المنتج المحترف في إطار سكرَم. تثبت إتقانك لإدارة المنتجات الرشيقة وتحديد الأولويات وقيادة الفرق.', en: 'Professional Scrum Product Owner certification. It proves command of agile product management, prioritization, and team leadership.' }, gain: { ar: 'إدارة المنتجات الرشيقة', en: 'Agile product management' }, scoreAdd: 5, official: 'https://www.scrum.org/professional-scrum-product-owner-certifications', status: 'future', cost: { ar: '$200', en: '$200' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: 'MBA', desc: { ar: 'ماجستير إدارة الأعمال، يفتح أدوار ما بعد الاستشارات في القيادة والاستثمار. يجمع الإستراتيجية والمالية والشبكة المهنية.', en: 'The MBA, opening post-consulting roles in leadership and investment. It combines strategy, finance, and a powerful network.' }, gain: { ar: 'يفتح أدوار ما بعد الاستشارات', en: 'Opens post-consulting roles' }, scoreAdd: 14, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    picks: [
      { id: 'n3', kind: 'top', reason: { ar: 'مدير ارتباط أول في ماكنزي', en: 'Senior engagement manager at McKinsey' } },
      { id: 'n5', kind: 'top', reason: { ar: 'مستشارة في BCG', en: 'Consultant at BCG' } },
      { id: 'n9', kind: 'mid', reason: { ar: 'مساعد أول في بِين — مدخل جيد', en: 'Senior associate at Bain — a good way in' } },
      { id: 'n6', kind: 'common', reason: { ar: 'خرّيجة كورنيل في فريق الصفقات', en: 'Cornell alum on the Deals team' } },
      { id: 'n1', kind: 'common', reason: { ar: 'يقود برامج إستراتيجية في الصندوق', en: 'Leads strategy programs at PIF' } },
    ],
  },
  {
    id: 'government',
    name: { ar: 'القطاع الحكومي', en: 'Government & Authorities' },
    targets: { ar: 'الوزارات · الهيئات · الصندوق', en: 'Ministries · Authorities · PIF' },
    accent: 'amber',
    icon: 'government',
    months: 24,
    matchPercent: 76,
    trail: 'PMP → CGAP → السياسات → PgMP → DBA',
    certs: [
      { name: 'PMP', desc: { ar: 'شهادة محترف إدارة المشاريع من PMI، الأكثر اعترافًا عالميًا. لقيادة مشاريع التحول ضمن رؤية 2030 داخل الوزارات والهيئات.', en: 'PMI’s Project Management Professional, the most recognized PM credential, for leading Vision 2030 transformation projects in ministries and authorities.' }, gain: { ar: 'قيادة مشاريع رؤية 2030', en: 'Lead Vision 2030 projects' }, scoreAdd: 10, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: 'CGAP', desc: { ar: 'مدقّق حكومي معتمد من معهد المدققين الداخليين، متخصّص في الرقابة والتدقيق على الجهات الحكومية. مطلوب في ديوان المراقبة والهيئات الرقابية.', en: 'Certified Government Auditing Professional from the IIA, specialized in oversight and audit of public entities. Sought in audit bureaus and regulators.' }, gain: { ar: 'التدقيق والرقابة الحكومية', en: 'Government audit and oversight' }, scoreAdd: 8, official: 'https://www.theiia.org/en/certifications/cgap/', status: 'future', cost: { ar: '$600', en: '$600' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'دبلوم السياسات', desc: { ar: 'دبلوم متخصّص في تحليل وصياغة السياسات العامة. يؤهّلك للعمل في مكاتب الإستراتيجية والتخطيط داخل الوزارات والهيئات.', en: 'A specialized diploma in public-policy analysis and design. It prepares you for strategy and planning offices inside ministries and authorities.' }, gain: { ar: 'صياغة وتحليل السياسات العامة', en: 'Public policy design and analysis' }, scoreAdd: 9, official: 'https://www.spsp.edu.sa/', status: 'future', cost: { ar: '5,000 ر.س', en: '5,000 SAR' }, duration: { ar: '5 أشهر', en: '5 months' }, hadaf: true },
      { name: 'PgMP', desc: { ar: 'محترف إدارة البرامج من PMI، المستوى الأعلى من PMP. لقيادة محافظ من المشاريع المترابطة على مستوى المؤسسة.', en: 'PMI’s Program Management Professional, a step above PMP, for leading portfolios of interrelated projects at the enterprise level.' }, gain: { ar: 'إدارة البرامج الكبرى', en: 'Manage large programs' }, scoreAdd: 8, official: 'https://www.pmi.org/certifications/program-management-pgmp', status: 'future', cost: { ar: '$800', en: '$800' }, duration: { ar: '4 أشهر', en: '4 months' } },
      { name: 'DBA', desc: { ar: 'دكتوراه إدارة الأعمال، أعلى مؤهل تطبيقي في الإدارة. للأدوار القيادية العليا والاستشارات رفيعة المستوى.', en: 'The Doctor of Business Administration, the top applied management qualification, for the most senior leadership and high-level advisory roles.' }, gain: { ar: 'المؤهل الأعلى للأدوار القيادية', en: 'Top credential for senior leadership' }, scoreAdd: 12, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '12 شهرًا', en: '12 months' } },
    ],
    picks: [
      { id: 'n7', kind: 'top', reason: { ar: 'مدير تخطيط أول في وزارة الطاقة', en: 'Senior planning director, Ministry of Energy' } },
      { id: 'n12', kind: 'top', reason: { ar: 'مديرة عامة في وزارة الاقتصاد والتخطيط', en: 'Director general, Ministry of Economy & Planning' } },
      { id: 'n1', kind: 'mid', reason: { ar: 'برامج القطاع في الصندوق', en: 'Sector programs at PIF' } },
      { id: 'n4', kind: 'common', reason: { ar: 'مشاريع طاقة كبرى قريبة من تخصصك', en: 'Major energy projects near your field' } },
      { id: 'n13', kind: 'common', reason: { ar: 'خبرة في رأس الخير مثلك', en: 'Ras Al-Khair background, like you' } },
    ],
  },
  {
    id: 'tech',
    name: { ar: 'التقنية', en: 'Technology' },
    targets: { ar: 'stc · علم · هيئة الاتصالات', en: 'stc · Elm · CST' },
    accent: 'rose',
    icon: 'tech',
    months: 14,
    matchPercent: 71,
    trail: 'AWS SAA → PMP → Scrum → بيانات → MBA',
    certs: [
      { name: 'AWS SAA', desc: { ar: 'مهندس حلول معتمد على منصة AWS (المستوى المساعد). يثبت قدرتك على تصميم أنظمة سحابية موثوقة وفعّالة، وهي من أكثر الشهادات طلبًا في السوق التقني.', en: 'AWS Certified Solutions Architect – Associate. It proves you can design reliable, efficient cloud systems, one of the most in-demand credentials in tech.' }, gain: { ar: 'تصميم الحلول السحابية المطلوبة', en: 'In-demand cloud architecture' }, scoreAdd: 9, official: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', status: 'future', cost: { ar: '$150', en: '$150' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'PMP', desc: { ar: 'شهادة محترف إدارة المشاريع من PMI. لقيادة مشاريع التحول الرقمي وفرق المنتجات في الجهات التقنية الكبرى.', en: 'PMI’s Project Management Professional, for leading digital-transformation projects and product teams at major tech entities.' }, gain: { ar: 'قيادة مشاريع التحول الرقمي', en: 'Lead digital transformation projects' }, scoreAdd: 10, official: 'https://www.pmi.org/certifications/project-management-pmp', status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: 'PSM', desc: { ar: 'سكرَم ماستر محترف، لقيادة فرق التطوير الرشيقة وإزالة العوائق. أساس العمل في فرق المنتجات التقنية الحديثة.', en: 'Professional Scrum Master, for leading agile development teams and removing blockers. Foundational to modern tech product teams.' }, gain: { ar: 'قيادة فرق أجايل', en: 'Lead agile teams' }, scoreAdd: 6, official: 'https://www.scrum.org/professional-scrum-master-certifications', status: 'future', cost: { ar: '$200', en: '$200' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: 'تحليل البيانات', desc: { ar: 'برنامج معتمد في تحليل البيانات، يغطّي أدوات التحليل والتصوّر واتخاذ القرار بالبيانات. مهارة عابرة للقطاعات ومطلوبة بقوة في الجهات الحكومية والتقنية.', en: 'A certified data-analysis program covering analysis, visualization, and data-driven decisions. A cross-sector skill in strong demand across government and tech.' }, gain: { ar: 'تحليل البيانات واتخاذ القرار', en: 'Data analysis and decision-making' }, scoreAdd: 9, official: 'https://www.coursera.org/professional-certificates/google-data-analytics', status: 'future', cost: { ar: '3,500 ر.س', en: '3,500 SAR' }, duration: { ar: '3 أشهر', en: '3 months' }, hadaf: true },
      { name: 'MBA', desc: { ar: 'ماجستير إدارة الأعمال، يجمع بين الخبرة التقنية والإدارة. للانتقال من الأدوار التقنية إلى القيادة وإدارة المنتجات.', en: 'The MBA, bridging technical expertise and management. For moving from technical roles into leadership and product management.' }, gain: { ar: 'يجمع التقنية بالإدارة', en: 'Bridges tech and management' }, scoreAdd: 14, official: 'https://www.mba.com/', status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    picks: [
      { id: 'n11', kind: 'top', reason: { ar: 'مدير منتج في stc', en: 'Product manager at stc' } },
      { id: 'n14', kind: 'top', reason: { ar: 'قائدة هندسة برمجيات في علم', en: 'Engineering lead at Elm' } },
      { id: 'n8', kind: 'mid', reason: { ar: 'استقطاب المواهب التقنية في نيوم', en: 'Tech talent acquisition at NEOM' } },
      { id: 'n6', kind: 'common', reason: { ar: 'خرّيجة كورنيل مثلك', en: 'Cornell alum, like you' } },
      { id: 'n4', kind: 'common', reason: { ar: 'تقاطع الطاقة والتقنية', en: 'Where energy meets tech' } },
    ],
  },
];

export const primaryPath = paths.find((p) => p.primary) ?? paths[0];

/* ----------------------------------------------------------------- messages -- */

export type Template = {
  id: string;
  title: LS;
  preview: LS;
  tone: LS;
};

export const templates: Template[] = [
  {
    id: 't1',
    title: { ar: 'تعريف مباشر', en: 'Direct Introduction' },
    preview: {
      ar: 'السلام عليكم {الاسم}، أنا علي، طالب ماجستير في اقتصاديات الطاقة بجامعة كورنيل (أتخرّج مايو 2026)، ولي خبرة تشغيلية في رأس الخير. أتطلّع لفرصة في {الشركة}، ويسعدني لو نتحدّث قصيرًا.',
      en: "Hi {firstName}, I'm Ali, an Energy Economics M.Eng. at Cornell (graduating May 2026) with operational experience at Ras Al-Khair. I'm keen on a role at {company} and would value a short chat.",
    },
    tone: { ar: 'رسمي', en: 'Formal' },
  },
  {
    id: 't2',
    title: { ar: 'جسر بحثي', en: 'Research Bridge' },
    preview: {
      ar: 'السلام عليكم {الاسم}، أشارك حاليًا في تأليف ورقة بحثية لمعهد أكسفورد لدراسات الطاقة، ولفت نظري عمل {الشركة} في هذا المجال. أودّ لو أسمع وجهة نظرك.',
      en: "Hi {firstName}, I'm co-authoring an OIES energy paper, and {company}'s work in the space caught my attention. I'd love to hear your perspective.",
    },
    tone: { ar: 'أكاديمي', en: 'Academic' },
  },
  {
    id: 't3',
    title: { ar: 'جسر شخصي', en: 'Personal Bridge' },
    preview: {
      ar: 'السلام عليكم أستاذ {الاسم}، أنا علي الأجود، خرّيج هندسة من مانشستر وطالب ماجستير في كورنيل. تابعت مسيرتك في {الشركة}، وأعجبني انتقالك إلى {الدور}، وأطمح لمسار مشابه.',
      en: "As-salamu alaykum {firstName}, I'm Ali Alajwad — a Manchester engineering graduate, now at Cornell. I've followed your path at {company} and admired your move into {role}; I'm aiming for something similar.",
    },
    tone: { ar: 'ودّي', en: 'Warm' },
  },
  {
    id: 't4',
    title: { ar: 'مختصرة ومباشرة', en: 'Short & Direct' },
    preview: {
      ar: 'السلام عليكم {الاسم}، خرّيج اقتصاديات طاقة من كورنيل (مايو 2026)، وخبرة سابقة في رأس الخير، وأستهدف {الشركة}. هل يناسبك حديث 10 دقائق؟',
      en: 'Hi {firstName}, Cornell Energy Economics grad (May 2026), prior ops at Ras Al-Khair, targeting {company}. Open to a 10-min chat?',
    },
    tone: { ar: 'مختصر', en: 'Tight' },
  },
];

// Fill a template preview with a specific contact's details for a live preview.
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

// LinkedIn people-search URL for a contact (best-effort, no LinkedIn API needed).
export function linkedinUrl(c: Contact): string {
  const q = encodeURIComponent(`${c.name.en} ${c.company.en}`);
  return `https://www.linkedin.com/search/results/people/?keywords=${q}`;
}

/* ------------------------------------------------------------------ tracker -- */

export type Activity = {
  kind: 'replied' | 'sent' | 'cert';
  text: LS;
  when: LS;
};

export const tracker = {
  stats: { sent: 47, replied: 3, pending: 12, followup: 5 },
  replyRate: 6.4,
  weekly: [
    { label: { ar: 'الأحد', en: 'Sun' }, value: 4 },
    { label: { ar: 'الإثنين', en: 'Mon' }, value: 7 },
    { label: { ar: 'الثلاثاء', en: 'Tue' }, value: 3 },
    { label: { ar: 'الأربعاء', en: 'Wed' }, value: 9 },
    { label: { ar: 'الخميس', en: 'Thu' }, value: 6 },
    { label: { ar: 'الجمعة', en: 'Fri' }, value: 2 },
    { label: { ar: 'السبت', en: 'Sat' }, value: 5 },
  ],
  activity: [
    { kind: 'replied', text: { ar: 'ردّ عليك عبدالرحمن الفوزان · ماكنزي', en: 'Abdulrahman Alfawzan replied · McKinsey' }, when: { ar: 'قبل ساعتين', en: '2h ago' } },
    { kind: 'sent', text: { ar: 'أرسلت إلى يوسف هاشم · الصندوق', en: 'Sent to Yusuf Hashem · PIF' }, when: { ar: 'قبل 5 ساعات', en: '5h ago' } },
    { kind: 'cert', text: { ar: 'سجّلت في CFA المستوى الأول', en: 'Registered for CFA Level 1' }, when: { ar: 'أمس', en: 'Yesterday' } },
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
    demoBadge: { ar: 'نسخة تجريبية', en: 'Demo' },
  },
  overview: {
    eyebrow: { ar: 'لوحتك', en: 'Your dashboard' },
    title: { ar: 'خطتك المهنية كاملة، في مكان واحد', en: 'Your whole career plan, in one place' },
    journeyLabel: { ar: 'من خطتك', en: 'of your plan' },
    certsLabel: { ar: 'شهادات أنجزتها', en: 'Certifications done' },
    sentLabel: { ar: 'رسائل أرسلتها', en: 'Messages sent' },
    repliesLabel: { ar: 'ردود وصلتك', en: 'Replies' },
    tipTitle: { ar: 'أهمّ خطوة اليوم', en: "Today's top move" },
    tip: {
      ar: 'ابدأ بعبدالرحمن العتيبي في صندوق الاستثمارات العامة — أعلى أهدافك ملاءمةً (192).',
      en: 'Start with Abdulrahman Alotaibi at PIF — your strongest match (192).',
    },
    actionsTitle: { ar: 'ابدأ بهؤلاء اليوم', en: 'Start with these today' },
    actionsSub: { ar: 'الأعلى ملاءمةً أولًا', en: 'Highest match first' },
    openContacts: { ar: 'كل صنّاع القرار', en: 'All decision-makers' },
    nextCert: { ar: 'شهادتك الحالية', en: 'Your current certification' },
  },
  paths: {
    eyebrow: { ar: 'مساراتك المهنية', en: 'Your career paths' },
    title: { ar: 'خمسة مسارات مبنية على خلفيتك', en: 'Five paths built on your background' },
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
    connectionsHint: { ar: 'أفضل 300 جهة للتواصل المباشر', en: 'Top 300 for direct outreach' },
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
    importCta: { ar: 'استورد جهات اتصالك من لينكدإن', en: 'Import your LinkedIn connections' },
    empty: { ar: 'لا نتائج مطابقة.', en: 'No matching results.' },
    status_new: { ar: 'جديد', en: 'New' },
    status_sent: { ar: 'مُرسل', en: 'Sent' },
    status_replied: { ar: 'ردّ', en: 'Replied' },
    status_followup: { ar: 'متابعة', en: 'Follow-up' },
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
    vsBenchmark: { ar: 'ثلاثة أضعاف المعدّل المعتاد', en: '3x the usual rate' },
    weekly: { ar: 'نشاطك هذا الأسبوع', en: 'This week' },
    recent: { ar: 'آخر النشاط', en: 'Recent activity' },
  },
} as const;
