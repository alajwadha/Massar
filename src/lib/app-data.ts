// Sample customer data for the Masaar product dashboard.
// The deliverable a customer receives after purchase: their career plan, organised
// BY PATH. Each path (e.g. the finance path) contains its own certification
// roadmap, its decision-makers, and outreach messages. Demo data uses the
// founder's own profile; in production each field is generated per customer.
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

export type CompanyKey =
  | 'pif' | 'aramco' | 'acwa' | 'neom' | 'gov'
  | 'mck' | 'bcg' | 'bain' | 'strat' | 'pwc'
  | 'stc' | 'elm' | 'cst';

export type Cert = {
  name: string;
  desc: LS;
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
  score: number; // AI match, 100-200
  status: ContactStatus;
  when: LS;
  priority?: boolean;
};

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
  contacts: Contact[];
};

/* ------------------------------------------------------------------- paths -- */

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
      { name: 'SOCPA', desc: { ar: 'الزمالة السعودية للمحاسبين القانونيين', en: 'Saudi CPA fellowship' }, status: 'done', cost: { ar: '3,500 ر.س', en: '3,500 SAR' }, duration: { ar: 'أنجزتها', en: 'Completed' }, hadaf: true },
      { name: 'CME-1', desc: { ar: 'أساسيات الأسواق المالية من المعهد المالي', en: 'Capital markets foundations' }, status: 'done', cost: { ar: '2,000 ر.س', en: '2,000 SAR' }, duration: { ar: 'أنجزتها', en: 'Completed' }, hadaf: true },
      { name: 'FMVA', desc: { ar: 'محلّل نمذجة مالية وتقييم', en: 'Financial Modeling & Valuation Analyst' }, status: 'done', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      {
        name: 'CFA Level 1',
        desc: { ar: 'الشهادة الأهم في عالم الاستثمار', en: 'Chartered Financial Analyst' },
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
      { name: 'CFA Level 2', desc: { ar: 'المستوى المتقدّم الذي يميّزك في الـ Big 4', en: 'Advanced level that sets you apart at the Big 4' }, status: 'future', cost: { ar: '5,500 ر.س', en: '5,500 SAR' }, duration: { ar: '8 أشهر', en: '8 months' }, hadaf: true },
    ],
    contacts: [
      { id: 'f1', name: { ar: 'عبدالرحمن العتيبي', en: 'Abdulrahman Alotaibi' }, role: { ar: 'رئيس برامج القطاع', en: 'Head of Sector Programs' }, company: { ar: 'صندوق الاستثمارات العامة', en: 'PIF' }, companyKey: 'pif', score: 192, status: 'new', when: { ar: 'جديد', en: 'New' }, priority: true },
      { id: 'f2', name: { ar: 'علي الصاحب', en: 'Ali Alsaheb' }, role: { ar: 'مدير محفظة أول', en: 'Senior Portfolio Director' }, company: { ar: 'الصندوق · تحوّل الطاقة', en: 'PIF · Energy Transition' }, companyKey: 'pif', score: 189, status: 'new', when: { ar: 'أمس', en: 'Yesterday' }, priority: true },
      { id: 'f3', name: { ar: 'عبدالرحمن الفوزان', en: 'Abdulrahman Alfawzan' }, role: { ar: 'مدير ارتباط أول', en: 'Senior Engagement Manager' }, company: { ar: 'ماكنزي وشركاه', en: 'McKinsey & Company' }, companyKey: 'mck', score: 178, status: 'replied', when: { ar: 'قبل ساعتين', en: '2h ago' }, priority: true },
      { id: 'f4', name: { ar: 'ريم العمران', en: 'Reem Alomran' }, role: { ar: 'مديرة أولى · الصفقات', en: 'Senior Manager, Deals' }, company: { ar: 'PwC السعودية', en: 'PwC Saudi' }, companyKey: 'pwc', score: 167, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 'f5', name: { ar: 'يوسف هاشم', en: 'Yusuf Hashem' }, role: { ar: 'مختصّ استثمار', en: 'Investment Associate' }, company: { ar: 'الصندوق · الأسواق العامة', en: 'PIF · Public Markets' }, companyKey: 'pif', score: 161, status: 'sent', when: { ar: 'قبل 5 ساعات', en: '5h ago' } },
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
      { name: 'PMP', desc: { ar: 'محترف إدارة المشاريع', en: 'Project Management Professional' }, status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: 'CEM', desc: { ar: 'مدير طاقة معتمد', en: 'Certified Energy Manager' }, status: 'future', cost: { ar: '$1,500', en: '$1,500' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'Six Sigma', desc: { ar: 'الحزام الأخضر في تحسين العمليات', en: 'Green Belt, process improvement' }, status: 'future', cost: { ar: '2,500 ر.س', en: '2,500 SAR' }, duration: { ar: 'شهران', en: '2 months' }, hadaf: true },
      { name: 'ISO 50001', desc: { ar: 'مدقّق رئيسي لإدارة الطاقة', en: 'Energy management lead auditor' }, status: 'future', cost: { ar: '3,000 ر.س', en: '3,000 SAR' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: 'MBA', desc: { ar: 'تحضير ماجستير إدارة الأعمال', en: 'MBA preparation' }, status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    contacts: [
      { id: 'e1', name: { ar: 'مؤيد الشويعر', en: 'Mowayed Alshuwaier' }, role: { ar: 'رئيس تنفيذي · شركة مشروع', en: 'CEO, SPV' }, company: { ar: 'أكوا باور', en: 'ACWA Power' }, companyKey: 'acwa', score: 173, status: 'sent', when: { ar: 'قبل 4 أيام', en: '4 days ago' } },
      { id: 'e2', name: { ar: 'سارة القحطاني', en: 'Sara Alqahtani' }, role: { ar: 'مديرة استقطاب المواهب', en: 'Talent Acquisition Lead' }, company: { ar: 'نيوم', en: 'NEOM' }, companyKey: 'neom', score: 164, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 'e3', name: { ar: 'أحمد الشهراني', en: 'Ahmed Alshahrani' }, role: { ar: 'مدير تخطيط أول', en: 'Senior Director, Planning' }, company: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' }, companyKey: 'gov', score: 160, status: 'followup', when: { ar: 'متابعة · 9 أيام', en: 'Follow-up · 9d' } },
      { id: 'e4', name: { ar: 'خالد الدوسري', en: 'Khalid Aldossari' }, role: { ar: 'مدير تطوير أعمال', en: 'Business Development Manager' }, company: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' }, companyKey: 'aramco', score: 156, status: 'sent', when: { ar: 'قبل أسبوع', en: '1 week ago' } },
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
      { name: 'Case Prep', desc: { ar: 'إتقان حلّ دراسات الحالة', en: 'Mastering case interviews' }, status: 'future', cost: { ar: '$300', en: '$300' }, duration: { ar: 'شهران', en: '2 months' } },
      { name: 'GMAT', desc: { ar: 'اختبار القبول للدراسات العليا', en: 'Graduate admissions test' }, status: 'future', cost: { ar: '$275', en: '$275' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'FMVA', desc: { ar: 'محلّل نمذجة مالية وتقييم', en: 'Financial Modeling & Valuation Analyst' }, status: 'future', cost: { ar: '$497', en: '$497' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'PSPO', desc: { ar: 'مالك منتج محترف', en: 'Professional Scrum Product Owner' }, status: 'future', cost: { ar: '$200', en: '$200' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: 'MBA', desc: { ar: 'تحضير ماجستير إدارة الأعمال', en: 'MBA preparation' }, status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    contacts: [
      { id: 'c1', name: { ar: 'عبدالرحمن الفوزان', en: 'Abdulrahman Alfawzan' }, role: { ar: 'مدير ارتباط أول', en: 'Senior Engagement Manager' }, company: { ar: 'ماكنزي وشركاه', en: 'McKinsey & Company' }, companyKey: 'mck', score: 178, status: 'replied', when: { ar: 'قبل ساعتين', en: '2h ago' } },
      { id: 'c2', name: { ar: 'نورة السديري', en: 'Noura Alsudairi' }, role: { ar: 'مستشارة', en: 'Consultant' }, company: { ar: 'BCG', en: 'BCG' }, companyKey: 'bcg', score: 170, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 'c3', name: { ar: 'فهد القرني', en: 'Fahad Alqarni' }, role: { ar: 'مساعد أول', en: 'Senior Associate' }, company: { ar: 'بِين وشركاه', en: 'Bain & Company' }, companyKey: 'bain', score: 162, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 'c4', name: { ar: 'ليان الزهراني', en: 'Layan Alzahrani' }, role: { ar: 'مستشارة استراتيجية', en: 'Strategy Consultant' }, company: { ar: 'Strategy&', en: 'Strategy&' }, companyKey: 'strat', score: 159, status: 'sent', when: { ar: 'قبل 3 أيام', en: '3 days ago' } },
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
      { name: 'PMP', desc: { ar: 'محترف إدارة المشاريع', en: 'Project Management Professional' }, status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: 'CGAP', desc: { ar: 'مدقّق حكومي معتمد', en: 'Certified Government Auditing Professional' }, status: 'future', cost: { ar: '$600', en: '$600' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'دبلوم السياسات', desc: { ar: 'دبلوم السياسات العامة', en: 'Public policy diploma' }, status: 'future', cost: { ar: '5,000 ر.س', en: '5,000 SAR' }, duration: { ar: '5 أشهر', en: '5 months' }, hadaf: true },
      { name: 'PgMP', desc: { ar: 'محترف إدارة البرامج', en: 'Program Management Professional' }, status: 'future', cost: { ar: '$800', en: '$800' }, duration: { ar: '4 أشهر', en: '4 months' } },
      { name: 'DBA', desc: { ar: 'تحضير دكتوراه إدارة الأعمال', en: 'DBA preparation' }, status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '12 شهرًا', en: '12 months' } },
    ],
    contacts: [
      { id: 'g1', name: { ar: 'أحمد الشهراني', en: 'Ahmed Alshahrani' }, role: { ar: 'مدير تخطيط أول', en: 'Senior Director, Planning' }, company: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' }, companyKey: 'gov', score: 165, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 'g2', name: { ar: 'منيرة الحربي', en: 'Munira Alharbi' }, role: { ar: 'مديرة عامة', en: 'Director General' }, company: { ar: 'وزارة الاقتصاد والتخطيط', en: 'Ministry of Economy & Planning' }, companyKey: 'gov', score: 158, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 'g3', name: { ar: 'سعود المطيري', en: 'Saud Almutairi' }, role: { ar: 'مدير برنامج', en: 'Program Manager' }, company: { ar: 'هيئة المحتوى المحلي', en: 'Local Content Authority' }, companyKey: 'gov', score: 152, status: 'sent', when: { ar: 'قبل أسبوعين', en: '2 weeks ago' } },
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
      { name: 'AWS SAA', desc: { ar: 'مهندس حلول معتمد على AWS', en: 'AWS Solutions Architect Associate' }, status: 'future', cost: { ar: '$150', en: '$150' }, duration: { ar: '3 أشهر', en: '3 months' } },
      { name: 'PMP', desc: { ar: 'محترف إدارة المشاريع', en: 'Project Management Professional' }, status: 'future', cost: { ar: '4,000 ر.س', en: '4,000 SAR' }, duration: { ar: '4 أشهر', en: '4 months' }, hadaf: true },
      { name: 'PSM', desc: { ar: 'سكرَم ماستر محترف', en: 'Professional Scrum Master' }, status: 'future', cost: { ar: '$200', en: '$200' }, duration: { ar: 'شهر', en: '1 month' } },
      { name: 'تحليل البيانات', desc: { ar: 'محلّل بيانات معتمد', en: 'Certified Data Analyst' }, status: 'future', cost: { ar: '3,500 ر.س', en: '3,500 SAR' }, duration: { ar: '3 أشهر', en: '3 months' }, hadaf: true },
      { name: 'MBA', desc: { ar: 'تحضير ماجستير إدارة الأعمال', en: 'MBA preparation' }, status: 'future', cost: { ar: 'يختلف', en: 'Varies' }, duration: { ar: '6 أشهر', en: '6 months' } },
    ],
    contacts: [
      { id: 't1', name: { ar: 'ريان الشمري', en: 'Rayan Alshammari' }, role: { ar: 'مدير منتج', en: 'Product Manager' }, company: { ar: 'stc', en: 'stc' }, companyKey: 'stc', score: 160, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 't2', name: { ar: 'هند العتيبي', en: 'Hind Alotaibi' }, role: { ar: 'قائدة هندسة برمجيات', en: 'Engineering Lead' }, company: { ar: 'علم', en: 'Elm' }, companyKey: 'elm', score: 155, status: 'new', when: { ar: 'جديد', en: 'New' } },
      { id: 't3', name: { ar: 'ماجد الغامدي', en: 'Majed Alghamdi' }, role: { ar: 'مدير تطوير الأعمال', en: 'Business Development Manager' }, company: { ar: 'هيئة الاتصالات والفضاء والتقنية', en: 'CST' }, companyKey: 'cst', score: 151, status: 'sent', when: { ar: 'قبل أسبوع', en: '1 week ago' } },
    ],
  },
];

export const primaryPath = paths.find((p) => p.primary) ?? paths[0];

/* ----------------------------------------------------------------- messages -- */

export type Template = {
  id: string;
  title: LS;
  preview: LS;
  words: number;
  tone: LS;
  audience: LS;
  recommended?: boolean;
};

export const templates: Template[] = [
  {
    id: 't1',
    title: { ar: 'تعريف مباشر', en: 'Direct Introduction' },
    preview: {
      ar: 'السلام عليكم {الاسم}، أنا علي، طالب ماجستير في اقتصاديات الطاقة بجامعة كورنيل (أتخرّج مايو 2026)، ولي خبرة تشغيلية في رأس الخير. أتطلّع لفرصة في {الشركة}، ويسعدني لو نتحدّث قصيرًا...',
      en: "Hi {firstName}, I'm Ali, an Energy Economics M.Eng. at Cornell (graduating May 2026) with operational experience at Ras Al-Khair. I'm keen on a role at {company} and would value a short chat...",
    },
    words: 60,
    tone: { ar: 'رسمي', en: 'Formal' },
    audience: { ar: 'القيادات', en: 'Senior' },
    recommended: true,
  },
  {
    id: 't2',
    title: { ar: 'جسر بحثي', en: 'Research Bridge' },
    preview: {
      ar: 'السلام عليكم {الاسم}، أشارك حاليًا في تأليف ورقة بحثية لمعهد أكسفورد لدراسات الطاقة حول إزالة الكربون من مباني الهيدروجين في أوروبا، ولفت نظري عمل {الشركة} في هذا المجال...',
      en: "Hi {firstName}, I'm co-authoring an OIES paper on EU hydrogen-buildings decarbonization, and {company}'s work in this area caught my attention...",
    },
    words: 80,
    tone: { ar: 'أكاديمي', en: 'Academic' },
    audience: { ar: 'الباحثون', en: 'Researchers' },
  },
  {
    id: 't3',
    title: { ar: 'جسر شخصي', en: 'Personal Bridge' },
    preview: {
      ar: 'السلام عليكم أستاذ {الاسم}، أنا علي الأجود، خرّيج هندسة من مانشستر وطالب ماجستير في كورنيل، وعملت في رأس الخير. تابعت مسيرتك في {الشركة} وأعجبني انتقالك إلى {الدور}...',
      en: "As-salamu alaykum {firstName}, I'm Ali Alajwad — a Manchester engineering graduate, now at Cornell, with experience at Ras Al-Khair. I've followed your move into {role} at {company}...",
    },
    words: 70,
    tone: { ar: 'ودّي', en: 'Warm' },
    audience: { ar: 'قيادات سعودية', en: 'Senior Saudis' },
  },
  {
    id: 't4',
    title: { ar: 'خلفية مشتركة', en: 'Mutual Background' },
    preview: {
      ar: 'السلام عليكم {الاسم}، يجمعنا التخرّج من {مانشستر/كورنيل}. لاحظت انتقالك إلى {الدور} في {الشركة}، وهو تحديدًا المسار الذي أطمح إليه، فأحببت أن أتواصل معك...',
      en: "Hi {firstName}, fellow {Manchester/Cornell} alum here. I noticed your move into {role} at {company} — exactly the path I'm aiming for, so I wanted to reach out...",
    },
    words: 65,
    tone: { ar: 'ودّي', en: 'Warm' },
    audience: { ar: 'الخرّيجون', en: 'Alumni' },
  },
  {
    id: 't5',
    title: { ar: 'مختصرة ومباشرة', en: 'Short & Direct' },
    preview: {
      ar: 'السلام عليكم {الاسم}، خرّيج اقتصاديات طاقة من كورنيل (مايو 2026)، وخبرة سابقة في رأس الخير، وأستهدف قطاع الطاقة. هل يناسبك حديث 10 دقائق؟',
      en: 'Hi {firstName}, Cornell Energy Economics grad (May 2026), prior ops at Ras Al-Khair, targeting the energy sector. Open to a 10-min chat?',
    },
    words: 40,
    tone: { ar: 'مختصر', en: 'Tight' },
    audience: { ar: 'كبار التنفيذيين', en: 'C-Suite' },
  },
];

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
    openPath: { ar: 'افتح مسارك الرئيسي', en: 'Open your primary path' },
    nextCert: { ar: 'شهادتك الحالية', en: 'Your current certification' },
  },
  paths: {
    eyebrow: { ar: 'مساراتك المهنية', en: 'Your career paths' },
    title: { ar: 'خمسة مسارات مبنية على خلفيتك', en: 'Five paths built on your background' },
    sub: {
      ar: 'افتح أيّ مسار لترى شهاداته، وصنّاع القرار فيه، ورسائلك الجاهزة له.',
      en: 'Open any path to see its certifications, decision-makers, and ready messages.',
    },
    match: { ar: 'ملاءمة', en: 'match' },
    primary: { ar: 'مسارك الرئيسي', en: 'Primary path' },
    roadmap: { ar: 'خارطة الشهادات', en: 'Roadmap' },
    open: { ar: 'افتح المسار', en: 'Open path' },
    statCerts: { ar: 'شهادات', en: 'certs' },
    statMonths: { ar: 'شهرًا', en: 'months' },
    statContacts: { ar: 'صانع قرار', en: 'contacts' },
    back: { ar: 'كل المسارات', en: 'All paths' },
  },
  pathTabs: {
    certs: { ar: 'الشهادات', en: 'Certifications' },
    contacts: { ar: 'صنّاع القرار', en: 'Decision-makers' },
    messages: { ar: 'الرسائل', en: 'Messages' },
  },
  certs: {
    title: { ar: 'خارطة الشهادات', en: 'Certification roadmap' },
    sub: { ar: 'مرتّبة بذكاء، مع تكلفتها بعد دعم هدف.', en: 'Smartly sequenced, with cost after Hadaf support.' },
    done: { ar: 'منجزة', en: 'Done' },
    current: { ar: 'الحالية', en: 'Current' },
    next: { ar: 'قادمة', en: 'Next' },
    hadaf: { ar: 'يدعمها هدف', en: 'Hadaf supported' },
    whyNow: { ar: 'لماذا الآن؟', en: 'Why now?' },
    bannerSub: { ar: 'تسترجع نحو نصف تكلفة كل شهادة معتمدة عبر هدف.', en: 'Reclaim about half of each approved certification via Hadaf.' },
  },
  contacts: {
    title: { ar: 'صنّاع القرار', en: 'Decision-makers' },
    sub: { ar: 'في شركات هذا المسار، مرتّبون حسب ملاءمتهم لك.', en: "At this path's companies, ranked by how well they match you." },
    search: { ar: 'ابحث بالاسم أو الشركة…', en: 'Search by name or company…' },
    all: { ar: 'الكل', en: 'All' },
    hot: { ar: 'الأهمّ', en: 'Top' },
    new: { ar: 'جديد', en: 'New' },
    sent: { ar: 'مُرسل', en: 'Sent' },
    replied: { ar: 'ردّ', en: 'Replied' },
    followup: { ar: 'متابعة', en: 'Follow-up' },
    outreach: { ar: 'ابدأ التواصل', en: 'Start outreach' },
    reply: { ar: 'ردّ سريع', en: 'Quick reply' },
    followupCta: { ar: 'رسالة متابعة', en: 'Follow up' },
    empty: { ar: 'لا نتائج مطابقة.', en: 'No matching results.' },
  },
  messages: {
    title: { ar: 'رسائل بصوتك', en: 'Messages in your voice' },
    sub: { ar: 'جاهزة للإرسال عبر لينكدإن، مكتوبة بأسلوبك.', en: 'Ready to send on LinkedIn, written in your style.' },
    recommended: { ar: 'موصى به', en: 'Recommended' },
    copy: { ar: 'نسخ', en: 'Copy' },
    copied: { ar: 'تم النسخ', en: 'Copied' },
    vary: { ar: 'صيغة أخرى', en: 'Reword' },
    words: { ar: 'كلمة', en: 'words' },
  },
  tracker: {
    eyebrow: { ar: 'المتتبّع', en: 'Tracker' },
    title: { ar: 'تقدّمك الكامل', en: 'Your full progress' },
    sub: { ar: 'أرقام حقيقية، بلا تنبيهات مزعجة.', en: 'Real numbers, no noisy alerts.' },
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
