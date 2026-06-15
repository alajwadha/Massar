// Sample customer data for the Masaar product dashboard.
// This is the deliverable a customer receives after purchase: their personalised
// career plan (paths, certifications with Hadaf reimbursement, target contacts,
// outreach messages, and a progress tracker). The demo is populated with the
// founder's own profile so the example is concrete; in production each field is
// generated per customer from their CV + goals.
//
// All customer-facing copy is bilingual (ar/en) and resolved at render time.

export type Loc = 'ar' | 'en';
export type LS = { ar: string; en: string };

export function tr(s: LS, locale: Loc): string {
  return s[locale];
}

/* ----------------------------------------------------------------- profile -- */

export const profile = {
  name: { ar: 'علي الأجود', en: 'Ali Alajwad' } satisfies LS,
  initials: 'ع',
  headline: {
    ar: 'ماجستير اقتصاديات الطاقة · كورنيل',
    en: 'M.Eng Energy Economics · Cornell',
  } satisfies LS,
  plan: 'pro' as const,
};

export const journey = {
  percent: 62,
  certsDone: 3,
  certsTotal: 5,
  messagesSent: 47,
  replies: 3,
  contactsUnlocked: 1000,
};

/* ------------------------------------------------------------------- paths -- */

export type AccentKey = 'brand' | 'sky' | 'violet' | 'amber' | 'rose';

export type CareerPath = {
  id: string;
  name: LS;
  targets: LS;
  accent: AccentKey;
  icon: 'finance' | 'energy' | 'consulting' | 'government' | 'tech';
  certs: number;
  months: number;
  contacts: number;
  matchPercent: number;
  primary?: boolean;
  trail?: string;
};

export const paths: CareerPath[] = [
  {
    id: 'finance',
    name: { ar: 'المسار المالي والاستثماري', en: 'Finance & Investment' },
    targets: { ar: 'PIF · ماكنزي · Big 4', en: 'PIF · McKinsey · Big 4' },
    accent: 'brand',
    icon: 'finance',
    certs: 5,
    months: 18,
    contacts: 312,
    matchPercent: 94,
    primary: true,
    trail: 'SOCPA → CME-1 → FMVA → CFA L1 → CFA L2',
  },
  {
    id: 'energy',
    name: { ar: 'المسار الهندسي والطاقة', en: 'Engineering & Energy' },
    targets: { ar: 'أرامكو · أكوا · نيوم', en: 'Aramco · ACWA · NEOM' },
    accent: 'sky',
    icon: 'energy',
    certs: 5,
    months: 15,
    contacts: 254,
    matchPercent: 88,
    trail: 'PMP → CEM → Six Sigma → ISO 50001 → MBA prep',
  },
  {
    id: 'consulting',
    name: { ar: 'المسار الاستشاري', en: 'Strategy Consulting' },
    targets: { ar: 'ماكنزي · BCG · Bain', en: 'McKinsey · BCG · Bain' },
    accent: 'violet',
    icon: 'consulting',
    certs: 5,
    months: 12,
    contacts: 181,
    matchPercent: 82,
    trail: 'Case prep → GMAT → FMVA → PSPO → MBA prep',
  },
  {
    id: 'government',
    name: { ar: 'المسار الحكومي', en: 'Government & Authorities' },
    targets: { ar: 'الوزارات · الهيئات · PIF', en: 'Ministries · Authorities · PIF' },
    accent: 'amber',
    icon: 'government',
    certs: 5,
    months: 24,
    contacts: 124,
    matchPercent: 76,
    trail: 'PMP → CGAP → Policy cert → PgMP → DBA prep',
  },
  {
    id: 'tech',
    name: { ar: 'المسار التقني', en: 'Technology' },
    targets: { ar: 'stc · علم · هيئة الاتصالات', en: 'stc · Elm · CST' },
    accent: 'rose',
    icon: 'tech',
    certs: 5,
    months: 14,
    contacts: 152,
    matchPercent: 71,
    trail: 'AWS SAA → PMP → Scrum → Data cert → MBA prep',
  },
];

/* ------------------------------------------------------------ certifications -- */

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

// Certification roadmap for the primary (Finance) path.
export const financeCerts: Cert[] = [
  {
    name: 'SOCPA',
    desc: { ar: 'محاسب قانوني سعودي معتمد', en: 'Saudi Certified Public Accountant' },
    status: 'done',
    cost: { ar: '٣,٥٠٠ ر.س', en: '3,500 SAR' },
    duration: { ar: 'منجزة', en: 'Completed' },
    hadaf: true,
  },
  {
    name: 'CME-1',
    desc: { ar: 'المعهد المالي · الأساسيات', en: 'Finance Institute · Foundations' },
    status: 'done',
    cost: { ar: '٢,٠٠٠ ر.س', en: '2,000 SAR' },
    duration: { ar: 'منجزة', en: 'Completed' },
    hadaf: true,
  },
  {
    name: 'FMVA',
    desc: {
      ar: 'محلل النمذجة المالية والتقييم',
      en: 'Financial Modeling & Valuation Analyst',
    },
    status: 'done',
    cost: { ar: '$497', en: '$497' },
    duration: { ar: '٣ أشهر', en: '3 months' },
  },
  {
    name: 'CFA Level 1',
    desc: { ar: 'محلل مالي معتمد', en: 'Chartered Financial Analyst' },
    status: 'current',
    cost: { ar: '٥,٥٠٠ ر.س', en: '5,500 SAR' },
    duration: { ar: '٦ أشهر · ٣٠٠ ساعة', en: '6 months · 300h' },
    hadaf: true,
    hadafNote: { ar: 'استرداد ~٢,٧٥٠ ر.س عبر هدف', en: 'Reclaim ~2,750 SAR via Hadaf' },
    why: {
      ar: 'المعيار الذهبي لوظائف PIF. امتحان فبراير ٢٠٢٧، فابدأ التحضير في يونيو.',
      en: 'The gold standard for PIF roles. Feb 2027 exam, so start studying in June.',
    },
  },
  {
    name: 'CFA Level 2',
    desc: {
      ar: 'المستوى المتقدم · يميّزك في Big 4',
      en: 'Advanced level · sets you apart at the Big 4',
    },
    status: 'future',
    cost: { ar: '٥,٥٠٠ ر.س', en: '5,500 SAR' },
    duration: { ar: '٨ أشهر', en: '8 months' },
    hadaf: true,
  },
];

/* ---------------------------------------------------------------- contacts -- */

export type CompanyKey = 'pif' | 'aramco' | 'acwa' | 'moe' | 'mck' | 'stc' | 'neom';
export type ContactStatus = 'new' | 'sent' | 'replied' | 'followup';

export type Contact = {
  id: string;
  name: LS;
  initials: string;
  role: LS;
  company: LS;
  companyKey: CompanyKey;
  score: number; // AI match, 100-200
  status: ContactStatus;
  when: LS;
  priority?: boolean;
};

export const contacts: Contact[] = [
  {
    id: 'c1',
    name: { ar: 'عبدالرحمن العتيبي', en: 'Abdulrahman Alotaibi' },
    initials: 'ع',
    role: { ar: 'رئيس برامج القطاع', en: 'Head of Sector Programs' },
    company: { ar: 'PIF · العقار', en: 'PIF · Real Estate' },
    companyKey: 'pif',
    score: 192,
    status: 'new',
    when: { ar: 'جديد', en: 'New' },
    priority: true,
  },
  {
    id: 'c2',
    name: { ar: 'علي الصاحب', en: 'Ali Alsaheb' },
    initials: 'ع',
    role: { ar: 'مدير محفظة أول', en: 'Senior Portfolio Director' },
    company: { ar: 'PIF · تحول الطاقة', en: 'PIF · Energy Transition' },
    companyKey: 'pif',
    score: 189,
    status: 'new',
    when: { ar: 'أمس', en: 'Yesterday' },
    priority: true,
  },
  {
    id: 'c3',
    name: { ar: 'عبدالرحمن الفوزان', en: 'Abdulrahman Alfawzan' },
    initials: 'ع',
    role: { ar: 'مدير ارتباط أول', en: 'Senior Engagement Manager' },
    company: { ar: 'ماكنزي وشركاه', en: 'McKinsey & Company' },
    companyKey: 'mck',
    score: 178,
    status: 'replied',
    when: { ar: 'قبل ساعتين', en: '2h ago' },
    priority: true,
  },
  {
    id: 'c4',
    name: { ar: 'مؤيد الشويعر', en: 'Mowayed Alshuwaier' },
    initials: 'م',
    role: { ar: 'رئيس تنفيذي · شركة مشروع', en: 'CEO, SPV' },
    company: { ar: 'أكوا باور', en: 'ACWA Power' },
    companyKey: 'acwa',
    score: 173,
    status: 'sent',
    when: { ar: 'قبل ٤ أيام', en: '4 days ago' },
  },
  {
    id: 'c5',
    name: { ar: 'أحمد الشهراني', en: 'Ahmed Alshahrani' },
    initials: 'أ',
    role: { ar: 'مدير التخطيط الأول', en: 'Senior Director, Planning' },
    company: { ar: 'وزارة الطاقة', en: 'Ministry of Energy' },
    companyKey: 'moe',
    score: 165,
    status: 'followup',
    when: { ar: 'متابعة · ٩ أيام', en: 'Follow-up · 9d' },
  },
  {
    id: 'c6',
    name: { ar: 'يوسف هاشم', en: 'Yusuf Hashem' },
    initials: 'ي',
    role: { ar: 'مشارك استثمار', en: 'Investment Associate' },
    company: { ar: 'PIF · الأسواق العامة', en: 'PIF · Public Markets' },
    companyKey: 'pif',
    score: 161,
    status: 'sent',
    when: { ar: 'قبل ٥ ساعات', en: '5h ago' },
  },
  {
    id: 'c7',
    name: { ar: 'سارة القحطاني', en: 'Sara Alqahtani' },
    initials: 'س',
    role: { ar: 'مديرة استقطاب المواهب', en: 'Talent Acquisition Lead' },
    company: { ar: 'نيوم', en: 'NEOM' },
    companyKey: 'neom',
    score: 158,
    status: 'new',
    when: { ar: 'جديد', en: 'New' },
  },
  {
    id: 'c8',
    name: { ar: 'خالد الدوسري', en: 'Khalid Aldossari' },
    initials: 'خ',
    role: { ar: 'مدير تطوير الأعمال', en: 'Business Development Manager' },
    company: { ar: 'أرامكو السعودية', en: 'Saudi Aramco' },
    companyKey: 'aramco',
    score: 154,
    status: 'sent',
    when: { ar: 'قبل أسبوع', en: '1 week ago' },
  },
];

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
    title: { ar: 'المقدّمة المباشرة', en: 'Direct Introduction' },
    preview: {
      ar: 'مرحباً {الاسم}، أنا علي، طالب ماجستير اقتصاديات الطاقة في كورنيل (تخرّج مايو ٢٠٢٦) مع خبرة تشغيلية في رأس الخير. أستكشف فرصاً في {الشركة}...',
      en: "Hi {firstName}, I'm Ali, an Energy Economics M.Eng. at Cornell (graduating May 2026) with operational experience at Ras Al-Khair. I'm exploring opportunities at {company}...",
    },
    words: 60,
    tone: { ar: 'رسمي', en: 'Formal' },
    audience: { ar: 'القيادات', en: 'Senior' },
    recommended: true,
  },
  {
    id: 't2',
    title: { ar: 'الجسر البحثي', en: 'Research Bridge' },
    preview: {
      ar: 'مرحباً {الاسم}، أشارك في تأليف ورقة عمل لمعهد أكسفورد لدراسات الطاقة حول إزالة الكربون من مباني الهيدروجين الأوروبية...',
      en: "Hi {firstName}, I'm co-authoring an OIES working paper on EU hydrogen buildings decarbonization...",
    },
    words: 80,
    tone: { ar: 'أكاديمي', en: 'Academic' },
    audience: { ar: 'الباحثون', en: 'Researchers' },
  },
  {
    id: 't3',
    title: { ar: 'الجسر الثقافي', en: 'Cultural Bridge' },
    preview: {
      ar: 'السلام عليكم أستاذ {الاسم}، أنا علي الأجود، طالب ماجستير اقتصاديات الطاقة بجامعة كورنيل، وخريج هندسة من مانشستر، وعملت في رأس الخير...',
      en: 'As-salamu alaykum Mr. {firstName}, I am Ali Alajwad, an Energy Economics master’s student at Cornell, an engineering graduate of Manchester, with experience at Ras Al-Khair...',
    },
    words: 70,
    tone: { ar: 'عربي رسمي', en: 'Arabic, formal' },
    audience: { ar: 'قيادات سعودية', en: 'Senior Saudis' },
  },
  {
    id: 't4',
    title: { ar: 'الخلفية المشتركة', en: 'Mutual Background' },
    preview: {
      ar: 'مرحباً {الاسم}، زميل خرّيج من {مانشستر/كورنيل}. لاحظت انتقالك إلى {الدور} في {الشركة}، وهو تماماً المسار الذي أطمح له...',
      en: 'Hi {firstName}, fellow {Manchester/Cornell} alum here. I noticed your move into {role} at {company} - exactly the path I am hoping to navigate...',
    },
    words: 65,
    tone: { ar: 'ودّي', en: 'Warm' },
    audience: { ar: 'الخرّيجون', en: 'Alumni' },
  },
  {
    id: 't5',
    title: { ar: 'القصيرة والمباشرة', en: 'Short & Direct' },
    preview: {
      ar: 'مرحباً {الاسم}، خرّيج اقتصاديات طاقة من كورنيل (مايو ٢٠٢٦)، خبرة سابقة في رأس الخير، أستهدف قطاع الطاقة السعودي. هل يناسبك حديث ١٠ دقائق؟',
      en: 'Hi {firstName}, Cornell Energy Economics grad (May 2026), prior ops at Ras Al-Khair, targeting the Saudi energy sector. Open to a 10-min chat?',
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
  benchmark: 2.0,
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
    {
      kind: 'replied',
      text: { ar: 'رد من عبدالرحمن الفوزان · ماكنزي', en: 'Reply from Abdulrahman Alfawzan · McKinsey' },
      when: { ar: 'قبل ساعتين', en: '2h ago' },
    },
    {
      kind: 'sent',
      text: { ar: 'أرسلت إلى يوسف هاشم · PIF', en: 'Sent to Yusuf Hashem · PIF' },
      when: { ar: 'قبل ٥ ساعات', en: '5h ago' },
    },
    {
      kind: 'cert',
      text: { ar: 'سجّلت في CFA المستوى الأول', en: 'Registered for CFA Level 1' },
      when: { ar: 'أمس', en: 'Yesterday' },
    },
  ] as Activity[],
};

/* ------------------------------------------------------------------- ui copy -- */

export const ui = {
  nav: {
    overview: { ar: 'نظرة عامة', en: 'Overview' },
    paths: { ar: 'المسارات', en: 'Paths' },
    certs: { ar: 'الشهادات', en: 'Certifications' },
    contacts: { ar: 'جهات الاتصال', en: 'Contacts' },
    messages: { ar: 'الرسائل', en: 'Messages' },
    tracker: { ar: 'المتتبّع', en: 'Tracker' },
  },
  shell: {
    greeting: { ar: 'أهلاً بعودتك', en: 'Welcome back' },
    plan: { ar: 'باقة برو', en: 'Pro plan' },
    journey: { ar: 'رحلتك المهنية', en: 'Your career journey' },
    demoBadge: { ar: 'عرض توضيحي', en: 'Live demo' },
  },
  overview: {
    eyebrow: { ar: 'لوحتك', en: 'Your dashboard' },
    title: { ar: 'كل خطتك المهنية في مكان واحد', en: 'Your whole career plan, in one place' },
    journeyLabel: { ar: 'اكتمال الرحلة', en: 'Journey complete' },
    certsLabel: { ar: 'شهادات منجزة', en: 'Certifications done' },
    sentLabel: { ar: 'رسائل مُرسلة', en: 'Messages sent' },
    repliesLabel: { ar: 'ردود', en: 'Replies' },
    contactsLabel: { ar: 'جهة اتصال', en: 'Contacts' },
    tipTitle: { ar: 'حركة اليوم', en: "Today's move" },
    tip: {
      ar: 'تواصل مع عبدالرحمن العتيبي في PIF اليوم، فهو أعلى فرصك (تقييم ١٩٢).',
      en: 'Reach out to Abdulrahman Alotaibi at PIF today, your strongest lead (score 192).',
    },
    actionsTitle: { ar: 'ثلاث مهام لهذا اليوم', en: 'Three things for today' },
    actionsSub: { ar: 'مرتّبة حسب الأولوية', en: 'Sorted by priority' },
    viewAll: { ar: 'عرض كل جهات الاتصال', en: 'View all contacts' },
    nextCert: { ar: 'شهادتك الحالية', en: 'Your current certification' },
  },
  paths: {
    eyebrow: { ar: 'مساراتك المهنية', en: 'Your career paths' },
    title: { ar: 'خمسة مسارات مصمَّمة لك', en: 'Five paths designed for you' },
    sub: {
      ar: 'بناءً على خلفيتك (كورنيل · مانشستر · رأس الخير) وسوق العمل السعودي.',
      en: 'Based on your background (Cornell · Manchester · Ras Al-Khair) and the Saudi market.',
    },
    match: { ar: 'تطابق', en: 'match' },
    certs: { ar: 'شهادات', en: 'certs' },
    months: { ar: 'شهراً', en: 'months' },
    contacts: { ar: 'جهة', en: 'contacts' },
    primary: { ar: 'المسار الرئيسي', en: 'Primary path' },
    roadmap: { ar: 'خارطة الشهادات', en: 'Certification roadmap' },
    view: { ar: 'استعرض المسار', en: 'Explore path' },
  },
  certs: {
    eyebrow: { ar: 'الشهادات', en: 'Certifications' },
    title: { ar: 'المسار المالي · ٥ شهادات', en: 'Finance path · 5 certifications' },
    sub: {
      ar: 'مرتَّبة بذكاء، مع تكلفتها الفعلية بعد دعم هدف.',
      en: 'Intelligently sequenced, with real cost after Hadaf support.',
    },
    done: { ar: 'منجزة', en: 'Done' },
    current: { ar: 'الحالية', en: 'Current' },
    next: { ar: 'قادمة', en: 'Next' },
    hadaf: { ar: 'مدعومة من هدف', en: 'Hadaf supported' },
    whyNow: { ar: 'لماذا الآن؟', en: 'Why now?' },
    savedTotal: { ar: 'إجمالي ما يمكن استرداده عبر هدف', en: 'Total reclaimable via Hadaf' },
  },
  contacts: {
    eyebrow: { ar: 'جهات الاتصال', en: 'Contacts' },
    title: { ar: '١,٠٠٠ جهة اتصال', en: '1,000 contacts' },
    sub: {
      ar: 'في الشركات التي تستهدفها، مرتَّبة حسب تقييم الذكاء الاصطناعي.',
      en: 'At your target companies, ranked by AI match score.',
    },
    search: { ar: 'ابحث بالاسم أو الشركة...', en: 'Search by name or company...' },
    all: { ar: 'الكل', en: 'All' },
    hot: { ar: 'الأهم', en: 'Hot' },
    new: { ar: 'جديد', en: 'New' },
    sent: { ar: 'مُرسل', en: 'Sent' },
    replied: { ar: 'ردّ', en: 'Replied' },
    followup: { ar: 'متابعة', en: 'Follow-up' },
    outreach: { ar: 'ابدأ التواصل', en: 'Start outreach' },
    reply: { ar: 'ردّ سريع', en: 'Quick reply' },
    followupCta: { ar: 'رسالة متابعة', en: 'Follow-up' },
    score: { ar: 'تقييم', en: 'Score' },
    empty: { ar: 'لا توجد نتائج مطابقة.', en: 'No matching contacts.' },
  },
  messages: {
    eyebrow: { ar: 'قوالب الرسائل', en: 'Message templates' },
    title: { ar: 'خمس رسائل بصوتك', en: 'Five messages in your voice' },
    sub: {
      ar: 'مكتوبة بأسلوبك · زر التنويع يعيد صياغتها.',
      en: 'Written in your style · the variation button rewords them.',
    },
    recommended: { ar: 'موصى به', en: 'Recommended' },
    copy: { ar: 'نسخ', en: 'Copy' },
    copied: { ar: 'تم النسخ', en: 'Copied' },
    vary: { ar: 'تنويع', en: 'Vary' },
    words: { ar: 'كلمة', en: 'words' },
  },
  tracker: {
    eyebrow: { ar: 'المتتبّع', en: 'Tracker' },
    title: { ar: 'تقدّمك الكامل', en: 'Your full progress' },
    sub: {
      ar: 'إحصاءات حقيقية، بلا تنبيهات مزعجة.',
      en: 'Real stats, no noisy notifications.',
    },
    sent: { ar: 'رسائل مُرسلة', en: 'Messages sent' },
    replied: { ar: 'ردود إيجابية', en: 'Positive replies' },
    pending: { ar: 'في الانتظار', en: 'Awaiting reply' },
    followup: { ar: 'تحتاج متابعة', en: 'Need follow-up' },
    replyRate: { ar: 'معدّل الرد', en: 'Reply rate' },
    vsBenchmark: { ar: 'أعلى من المتوسط بثلاثة أضعاف', en: '3x higher than average' },
    weekly: { ar: 'النشاط الأسبوعي', en: 'Weekly activity' },
    recent: { ar: 'آخر النشاطات', en: 'Recent activity' },
  },
} as const;
