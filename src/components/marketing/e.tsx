'use client';

/* =============================================================================
   Landing version E. "The Journey Timeline".
   The whole page is one vertical journey, read top to bottom. A thin spine runs
   down the center with numbered nodes, each a step from uploading a CV to winning
   the role. On desktop the step content alternates either side of the spine, on
   mobile it stacks against a left rail. Product previews sit as exhibits at the
   steps they prove. Nodes reveal on scroll. Amber only, serif display, v4 Atlas.
============================================================================= */

import {
  PAGE,
  CARD,
  INSET,
  PILL,
  GHOST,
  SOFT,
  ACCENT,
  EASE,
  Serif,
  Eyebrow,
  Grain,
  ThemeToggle,
  LangToggle,
  ScoreCard,
  PathsCard,
  ContactsCard,
  DashboardPreview,
  TARGET_COMPANIES,
  PRICING,
  STATS,
  pick,
  type Loc,
} from '@/components/marketing/shared';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import {
  ArrowUpRight,
  Check,
  UploadCloud,
  Gauge,
  Route,
  Users,
  Trophy,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------- copy -- */

const T = {
  navJourney: { ar: 'الرحلة', en: 'The journey' },
  navPricing: { ar: 'السعر', en: 'Pricing' },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  ctaSee: { ar: 'شاهد الرحلة', en: 'See the journey' },

  kicker: { ar: 'رحلة من خمس خطوات', en: 'A journey in five steps' },
  heroTitle: { ar: 'من سيرتك الذاتية إلى الوظيفة.', en: 'From your CV to the role.' },
  heroLede: {
    ar: 'معظم الوظائف الجيدة تُملأ عبر العلاقات لا عبر نماذج التقديم. مسار يأخذك خطوة بخطوة، من قراءة سيرتك إلى الوصول للشخص المناسب وأنت معروف، لوظيفة جديدة أو ترقية.',
    en: 'Most good jobs are filled through people, not application forms. Masaar walks you step by step, from reading your CV to reaching the right person already known, for a new job or a promotion.',
  },
  heroExhibit: { ar: 'لوحة التحكم في رحلتك', en: 'Your journey, on one dashboard' },
  start: { ar: 'نقطة البداية', en: 'Where you begin' },

  // step bodies
  s1body: {
    ar: 'ترفع سيرتك الذاتية كما هي اليوم. لا نماذج طويلة ولا حسابات، فقط ملف واحد لنبدأ منه.',
    en: 'You upload your CV exactly as it is today. No long forms, no accounts, just one file to start from.',
  },
  s2body: {
    ar: 'نقرأ سيرتك ونعطيك درجة من ١٠٠ لكل مستوى من المبتدئ إلى القيادي. الدرجة محافظة عمدًا حتى تثق بها، وتُظهر بالضبط ما الذي يرفعها وبكم.',
    en: 'We read your CV and give you a score out of 100 for each level from Entry to Director. The score is deliberately conservative so you can trust it, and it shows exactly what raises it and by how much.',
  },
  s3body: {
    ar: 'نرسم مسارات مهنية تناسب خلفيتك، ولكل مسار خارطة شهادات مرتبة حسب الأثر، مع تمييز ما يعيد صندوق هدف نحو ٥٠٪ من كلفته.',
    en: 'We draw career paths that fit your background, each with a certifications roadmap ordered by impact, flagging what the government fund Hadaf reimburses about 50 percent of.',
  },
  s4body: {
    ar: 'سطحان للتواصل. جهات لينكدإن لديك تُحلَّل بسرية داخل متصفحك وحده وتُرتَّب إلى مقدّمات دافئة، إضافة إلى قاعدتنا من ١٢٠٩ جهة موارد بشرية وتوظيف بحد حسب الباقة. نصوغ الرسائل بصوتك، وترسلها بنفسك.',
    en: 'Two contact surfaces. Your own LinkedIn connections are parsed privately in your browser alone and ranked into warm introductions, plus our database of 1,209 HR and recruiter contacts, capped by tier. We draft the outreach in your voice, and you send it yourself.',
  },
  s5body: {
    ar: 'تصل إلى الشخص المناسب وأنت معروف، فتتحول المحادثة إلى مقابلة، والمقابلة إلى عرض. النتيجة وظيفة جديدة أو ترقية عند صاحب عملك الحالي.',
    en: 'You reach the right person already known, so a conversation turns into an interview, and an interview into an offer. The outcome is a new job or a promotion with your current employer.',
  },

  // study and opportunities aside (covered without extra previews)
  moreTitle: { ar: 'وعلى طول الطريق', en: 'And all along the way' },
  studyT: { ar: 'الدراسة', en: 'Study' },
  studyB: {
    ar: 'برامج الدراسات العليا حسب التخصص، وأهليتك لمنحة رواد لأفضل ٣٠ جامعة، وخيارات الدوام الجزئي السعودية بمواعيدها.',
    en: 'Graduate programs by field, your eligibility for the Pioneers scholarship for the top 30 universities, and Saudi part time options with their deadlines.',
  },
  oppT: { ar: 'الفرص', en: 'Opportunities' },
  oppB: {
    ar: 'نحو ٦٠ صفحة توظيف لشركات سعودية حسب القطاع، وأيام مهنية بتواريخها، ومهارات مطلوبة، وبرامج مثل تمهير.',
    en: 'Around 60 Saudi company career pages by sector, dated career days, in demand skills, and programs like Tamheer.',
  },

  proofTitle: { ar: 'إلى أين يصل المحترفون', en: 'Where professionals are headed' },
  proofBody: {
    ar: 'محترفون يستهدفون أبرز جهات العمل في المملكة عبر هذه الرحلة نفسها.',
    en: 'Professionals targeting the top employers in the Kingdom along this same journey.',
  },

  priceTitle: { ar: 'خطوة واحدة لتبدأ', en: 'One step to begin' },
  priceBody: {
    ar: 'دفعة واحدة بلا اشتراك، عبر ميسر بمدى أو آبل باي أو البطاقات، وتفتح رحلتك فورًا.',
    en: 'One payment, no subscription, through Moyasar with mada, Apple Pay, or cards, and your journey unlocks instantly.',
  },
  oneTime: { ar: 'دفعة واحدة', en: 'one time' },
  most: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  closeTitle: { ar: 'الخطوة الأولى تبدأ اليوم.', en: 'The first step starts today.' },
  closeBody: {
    ar: 'ابدأ بسيرتك كما هي، ودعنا نرسم بقية الطريق.',
    en: 'Start with your CV as it is, and let us map the rest of the road.',
  },
  footMade: { ar: 'عربي أولًا، بالكامل ثنائي اللغة.', en: 'Arabic first, fully bilingual.' },
  footRights: { ar: 'مسار. جميع الحقوق محفوظة.', en: 'Masaar. All rights reserved.' },
} as const;

const RULE = 'border-stone-200/70 dark:border-white/10';

/* --------------------------------------------------------------- helpers -- */

type Step = {
  n: string;
  icon: typeof Gauge;
  title: { ar: string; en: string };
  body: keyof typeof T;
  exhibit?: 'score' | 'paths' | 'contacts';
};

const STEPS: Step[] = [
  { n: '1', icon: UploadCloud, title: { ar: 'ارفع سيرتك', en: 'Upload your CV' }, body: 's1body' },
  { n: '2', icon: Gauge, title: { ar: 'اعرف درجتك الحقيقية', en: 'See your real score' }, body: 's2body', exhibit: 'score' },
  { n: '3', icon: Route, title: { ar: 'احصل على خطتك', en: 'Get your plan' }, body: 's3body', exhibit: 'paths' },
  { n: '4', icon: Users, title: { ar: 'تواصل مع المناسبين', en: 'Reach the right people' }, body: 's4body', exhibit: 'contacts' },
  { n: '5', icon: Trophy, title: { ar: 'اظفر بالدور', en: 'Win the role' }, body: 's5body' },
];

/** The numbered node that sits on the spine, with a subtle reveal. */
function Node({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.6, ease: EASE }}
      className={cn(
        'relative grid h-11 w-11 place-items-center rounded-full border bg-[#f7f6f2] dark:bg-[#0a0a0b]',
        RULE,
      )}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300">
        {children}
      </span>
    </motion.div>
  );
}

/** One timeline row: node on the spine, content sliding in from its side. */
function Row({
  step,
  side,
  locale,
}: {
  step: Step;
  side: 'start' | 'end';
  locale: Loc;
}) {
  const Icon = step.icon;
  const exhibit =
    step.exhibit === 'score' ? <ScoreCard locale={locale} /> :
    step.exhibit === 'paths' ? <PathsCard locale={locale} /> :
    step.exhibit === 'contacts' ? <ContactsCard locale={locale} /> : null;

  const content = (
    <motion.div
      initial={{ opacity: 0, x: side === 'start' ? -28 : 28 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
      className={cn('md:max-w-md', side === 'end' && 'md:ms-auto')}
    >
      <div className="flex items-center gap-3">
        <Serif className={cn('text-3xl leading-none', ACCENT)}>{step.n}</Serif>
        <Serif className="text-2xl leading-tight">{pick(step.title, locale)}</Serif>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">
        {pick(T[step.body], locale)}
      </p>
      {exhibit ? <div className="mt-5">{exhibit}</div> : null}
    </motion.div>
  );

  return (
    <div className="relative">
      {/* mobile: left rail node */}
      <div className="absolute -start-[1.4rem] top-0 md:hidden">
        <Node>
          <Icon className="h-4 w-4" />
        </Node>
      </div>

      {/* desktop: alternating grid with the spine node in the middle column */}
      <div className="grid md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-x-8">
        {side === 'start' ? (
          <>
            <div className="ps-8 md:ps-0">{content}</div>
            <div className="hidden md:block">
              <Node>
                <Icon className="h-4 w-4" />
              </Node>
            </div>
            <div className="hidden md:block" />
          </>
        ) : (
          <>
            <div className="hidden md:block" />
            <div className="hidden md:block">
              <Node>
                <Icon className="h-4 w-4" />
              </Node>
            </div>
            <div className="ps-8 md:ps-0">{content}</div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- page -- */

export default function MarketingE({ locale }: { locale: Loc }) {
  const t = (k: keyof typeof T) => pick(T[k], locale);

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* ---------------------------------------------------------- header -- */}
      <header className={cn('sticky top-0 z-40 border-b bg-[#f7f6f2]/80 backdrop-blur-md dark:bg-[#0a0a0b]/80', RULE)}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className={cn('hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:block', SOFT)}>
              {locale === 'ar' ? 'رحلة' : 'Journey'}
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] text-stone-500 dark:text-stone-400 md:flex">
            <a href="#journey" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navJourney')}</a>
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navPricing')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle locale={locale} />
            <Link
              href={{ pathname: '/checkout', query: { plan: 'pro' } }}
              className={cn('hidden rounded-full px-4 py-2 text-[13px] font-semibold transition-colors sm:inline-flex', PILL)}
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">

        {/* -------------------------------------------------------- hero -- */}
        <section className="py-16 text-center sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Eyebrow className="justify-center">{t('kicker')}</Eyebrow>
            <h1 className="mx-auto mt-6 max-w-3xl">
              <Serif className="block text-5xl leading-[1.05] tracking-tight sm:text-7xl">{t('heroTitle')}</Serif>
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('heroLede')}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors', PILL)}
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#journey"
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors', GHOST)}
              >
                {t('ctaSee')}
              </a>
            </div>
          </motion.div>

          {/* hero exhibit: the whole dashboard, the destination shown up front */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            className="mx-auto mt-14 max-w-4xl text-start"
          >
            <DashboardPreview locale={locale} />
            <Serif className="mt-3 block text-center text-sm italic text-stone-500 dark:text-stone-400">
              {t('heroExhibit')}
            </Serif>
          </motion.div>
        </section>

        {/* ------------------------------------------------------ journey -- */}
        <section id="journey" className="scroll-mt-24 py-10 sm:py-16">
          <div className="mb-12 text-center">
            <Eyebrow className="justify-center">{t('navJourney')}</Eyebrow>
            <Serif className="mt-3 block text-3xl sm:text-4xl">{t('start')}</Serif>
          </div>

          {/* the spine: a hairline behind every row, centered on desktop */}
          <div className="relative ms-6 md:ms-0">
            <div
              aria-hidden
              className="absolute inset-y-2 start-0 w-px bg-gradient-to-b from-transparent via-stone-300 to-transparent dark:via-white/15 md:start-1/2 md:-translate-x-1/2"
            />
            <div className="relative space-y-16 sm:space-y-20">
              {STEPS.map((step, i) => (
                <Row key={step.n} step={step} side={i % 2 === 0 ? 'start' : 'end'} locale={locale} />
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------- study and opportunities -- */}
        <section className="py-14 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="text-center">
              <Eyebrow className="justify-center">{t('moreTitle')}</Eyebrow>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className={cn(INSET, 'p-6')}>
                <Serif className="text-xl">{t('studyT')}</Serif>
                <p className="mt-3 text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{t('studyB')}</p>
              </div>
              <div className={cn(INSET, 'p-6')}>
                <Serif className="text-xl">{t('oppT')}</Serif>
                <p className="mt-3 text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{t('oppB')}</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --------------------------------------- proof: companies + stats -- */}
        <section className="border-t py-16 sm:py-20" style={{}}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center"
          >
            <Eyebrow className="justify-center">{t('proofTitle')}</Eyebrow>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{t('proofBody')}</p>
            <div className="mx-auto mt-7 flex max-w-2xl flex-wrap justify-center gap-2">
              {TARGET_COMPANIES.map((c) => (
                <span key={c} className={cn('rounded-full px-3 py-1 text-[12px] font-medium', SOFT)}>{c}</span>
              ))}
            </div>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.05 * i }}
                className={cn(CARD, 'p-6 text-center')}
              >
                <Serif className={cn('block text-5xl leading-none', i === 2 && ACCENT)}>{s.n}</Serif>
                <span className="mt-3 block text-[13px] leading-snug text-stone-500 dark:text-stone-400">{pick(s.label, locale)}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------- pricing -- */}
        <section id="pricing" className="scroll-mt-24 border-t py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center"
          >
            <Eyebrow className="justify-center">{t('navPricing')}</Eyebrow>
            <Serif className="mx-auto mt-3 block max-w-xl text-3xl sm:text-4xl">{t('priceTitle')}</Serif>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{t('priceBody')}</p>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
            {PRICING.map((tier, i) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.05 * i }}
                className={cn(CARD, 'flex h-full flex-col p-7', tier.popular && 'ring-1 ring-amber-500/30')}
              >
                <div className="flex items-baseline justify-between">
                  <Serif className="text-2xl">{pick(tier.name, locale)}</Serif>
                  {tier.popular ? (
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      {t('most')}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">{pick(tier.blurb, locale)}</p>
                <div className="mt-6 flex items-baseline gap-2">
                  <Serif className="text-5xl leading-none">{tier.price}</Serif>
                  <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{locale === 'ar' ? 'ريال' : 'SAR'}</span>
                  <span className={cn('ms-1 rounded-full px-2 py-0.5 text-[11px] font-medium', SOFT)}>{t('oneTime')}</span>
                </div>
                <ul className="mt-7 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f.en} className="flex items-start gap-2.5 text-[14px] text-stone-700 dark:text-stone-200">
                      <Check className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
                      <span>{pick(f, locale)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={{ pathname: '/checkout', query: { plan: tier.id } }}
                  className={cn(
                    'mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors',
                    tier.popular ? PILL : GHOST,
                  )}
                >
                  {t('choose')} {pick(tier.name, locale)}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- closing -- */}
        <section className="py-20 text-center sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Eyebrow className="justify-center">{t('kicker')}</Eyebrow>
            <Serif className="mx-auto mt-6 block max-w-3xl text-4xl leading-[1.08] tracking-tight sm:text-6xl">
              {t('closeTitle')}
            </Serif>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('closeBody')}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors', PILL)}
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className={cn('inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors', GHOST)}
              >
                {t('navPricing')}
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ---------------------------------------------------------- footer -- */}
      <footer className={cn('relative z-10 border-t', RULE)}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className="hidden h-4 w-px bg-stone-300/70 dark:bg-white/15 sm:block" />
            <span>{t('footMade')}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">
              {t('navPricing')}
            </a>
            <span>© {new Date().getFullYear()} {t('footRights')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
