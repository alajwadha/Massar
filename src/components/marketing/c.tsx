'use client';

/* =============================================================================
   Landing version C, "The Bold Pitch". A loud, centered, conversion driven page
   built as a vertical rhythm of alternating full width bands: bold near black
   bands pulse against calm light ones. Big serif statements, short punchy lines,
   repeated amber CTAs, the product preview front and center as the hero shot.
============================================================================= */

import {
  ArrowUpRight,
  ScanLine,
  Route,
  Users,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import {
  PAGE,
  CARD,
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
  DashboardPreview,
  TARGET_COMPANIES,
  PRICING,
  STATS,
  pick,
  type Loc,
} from '@/components/marketing/shared';

/* ------------------------------------------------------------------ copy -- */

export type CCopy = typeof COPY_C;

// Voice 1: confident and premium.
export const COPY_C = {
  nav: {
    how: { ar: 'كيف يعمل', en: 'How it works' },
    pricing: { ar: 'الأسعار', en: 'Pricing' },
    product: { ar: 'المنتج', en: 'Product' },
  },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  heroEyebrow: { ar: 'لوظيفة جديدة أو ترقية', en: 'For a new job or a promotion' },
  heroTitle: { ar: 'وظيفتك القادمة، بخطة حقيقية.', en: 'Your next role, with a real plan.' },
  heroSub: {
    ar: 'مسار يحوّل سيرتك إلى خطة واضحة: درجة تنافسية صادقة، والشهادات التي يموّل هدف نصفها، والأشخاص المناسبون للتواصل معهم. دفعة واحدة، ووصول فوري للوحتك.',
    en: 'Masaar turns your CV into a clear plan: an honest competitiveness score, the certifications Hadaf funds half of, and the exact people to reach. One payment, instant access to your dashboard.',
  },
  heroNote: { ar: 'بدون اشتراك. عربي أولًا، وثنائي اللغة بالكامل.', en: 'No subscription. Arabic first, fully bilingual.' },
  trusted: { ar: 'مصمّم لوظائف في', en: 'Built for roles at' },

  scoreboardEyebrow: { ar: 'المشكلة بالأرقام', en: 'The problem in numbers' },
  scoreboardTitle: { ar: 'التقديم بلا خطة لا يوصلك.', en: 'Applying without a plan rarely works.' },
  scoreboardSub: { ar: 'هكذا يبدو البحث عن وظيفة بلا اتجاه واضح.', en: 'This is what a job search with no direction looks like.' },

  scoreEyebrow: { ar: 'درجتك الحقيقية', en: 'Your real score' },
  scoreTitle: { ar: 'اعرف موقعك قبل أن تتقدّم.', en: 'Know where you stand before you apply.' },
  scoreSub: {
    ar: 'درجة تنافسية لكل دور ولكل مستوى، من المبتدئ إلى القيادي، متحفظة عن قصد، وتوضّح لك بدقة ما الذي يرفعها.',
    en: 'A competitiveness score for every role and level, from Entry to Director, deliberately conservative, showing you precisely what raises it.',
  },

  planEyebrow: { ar: 'خطتك', en: 'Your plan' },
  planTitle: { ar: 'هدف يموّل نصف الطريق.', en: 'Hadaf funds half the way.' },
  planSub: {
    ar: 'مسارات مهنية مبنية على خلفيتك، وخارطة شهادات مرتبة حسب الأثر، مع توضيح الشهادات التي يعوّض صندوق هدف نحو 50٪ من تكلفتها.',
    en: 'Career paths built on your background, and a certifications roadmap ordered by impact, showing which ones Hadaf reimburses about 50 percent of.',
  },

  peopleEyebrow: { ar: 'الأشخاص', en: 'The people' },
  peopleTitle: { ar: 'الوظائف تأتي من الأشخاص.', en: 'Jobs come from people.' },
  peopleSub: {
    ar: 'نرتّب شبكتك على لينكدإن إلى أقرب الأشخاص لأهدافك، إلى جانب قاعدتنا التي تضم 1,209 جهة موارد بشرية وتوظيف. رسائل تواصل جاهزة بأسلوبك، ترسلها بنفسك. نحفظ ملفك بأمان، ولا نشاركه، ويمكنك حذفه متى شئت.',
    en: 'We rank your LinkedIn network into the people closest to your goals, alongside our database of 1,209 HR and recruiter contacts. Outreach drafted in your voice, sent by you. Your file is stored securely, never shared, and you can delete it anytime.',
  },

  studyEyebrow: { ar: 'الدراسة والفرص', en: 'Study and opportunities' },
  studyTitle: { ar: 'وأبعد من وظيفتك القادمة.', en: 'And beyond your next role.' },
  studySub: {
    ar: 'برامج دراسات عليا حسب مجالك مع أهلية منحة رواد، وعشرات صفحات التوظيف السعودية مرتبة حسب القطاع، مع أيام مهنية بمواعيدها وبرامج مثل تمهير.',
    en: 'Graduate programs by field with Pioneers scholarship eligibility, and dozens of Saudi career pages grouped by sector, with dated career days and programs like Tamheer.',
  },

  // big bold band statements and stats
  scoreStat: { ar: 'لكل دور ومستوى', en: 'Per role and level' },
  scoreStatSub: {
    ar: 'من المبتدئ إلى القيادي، رقم واحد متحفظ يوضّح أين تقف بالضبط وما الذي يرفعه.',
    en: 'From Entry to Director, one conservative number that shows exactly where you stand and what raises it.',
  },
  scoreLine: { ar: 'اعرف رقمك قبل أي أحد.', en: 'Know your number before anyone else.' },

  planStat: { ar: '٥٠٪', en: '50%' },
  planStatSub: {
    ar: 'من تكلفة الشهادات المؤهلة يعوّضها صندوق هدف. نوضّح لك أيّها بالضبط، ونرتّبها حسب الأثر.',
    en: 'of eligible certification costs reimbursed by Hadaf. We show you exactly which, ordered by impact.',
  },
  planLine: { ar: 'مسار يموّل نصف الطريق إلى دورك القادم.', en: 'A path that funds half the way to your next role.' },

  peopleStat: { ar: '١٢٠٩', en: '1,209' },
  peopleStatSub: {
    ar: 'جهة موارد بشرية وتوظيف في قاعدتنا، إلى جانب شبكتك الخاصة. الوظائف تأتي من الأشخاص.',
    en: 'HR and recruiter contacts in our database, alongside your own network. Jobs come from people.',
  },
  peopleLine: { ar: 'رسائل تواصل جاهزة بأسلوبك، ترسلها بنفسك.', en: 'Outreach drafted in your voice, sent by you.' },

  studyStatA: { ar: 'منحة رواد', en: 'Pioneers' },
  studyStatASub: { ar: 'برامج دراسات عليا حسب مجالك مع أهلية المنحة.', en: 'Graduate programs by field with scholarship eligibility.' },
  studyStatB: { ar: 'تمهير وأكثر', en: 'Tamheer and more' },
  studyStatBSub: { ar: 'عشرات صفحات التوظيف السعودية بأيام مهنية بمواعيدها.', en: 'Dozens of Saudi career pages with dated career days.' },
  studyLine: { ar: 'وأبعد من وظيفتك القادمة بكثير.', en: 'And far beyond your next role.' },

  howEyebrow: { ar: 'كيف يعمل', en: 'How it works' },
  howTitle: { ar: 'أربع خطوات لا غير.', en: 'Four steps. That is all.' },
  howSub: { ar: 'من سيرتك إلى خطة تبدأ بها اليوم.', en: 'From a CV to a plan you can start today.' },

  priceEyebrow: { ar: 'الأسعار', en: 'Pricing' },
  priceTitle: { ar: 'ادفع مرة واحدة، وخطتك تبقى لك.', en: 'Pay once. Your plan stays yours.' },
  priceSub: {
    ar: 'دفعة واحدة عبر ميسر: مدى وآبل باي والبطاقات. بدون اشتراك، ووصول فوري للوحتك.',
    en: 'One payment via Moyasar: mada, Apple Pay and cards. No subscription, instant access.',
  },
  perOnce: { ar: 'ريال، مرة واحدة', en: 'SAR, one time' },
  popular: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  finalTitle: { ar: 'سيرتك جاهزة لخطة.', en: 'Your CV is ready for a plan.' },
  finalSub: { ar: 'ابدأ الآن، واحصل على درجتك ومسارك وأشخاصك خلال دقائق.', en: 'Start now and get your score, your path and your people in minutes.' },
  rights: { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },
};

export const STEPS_C: { icon: typeof ScanLine; t: { ar: string; en: string }; d: { ar: string; en: string } }[] = [
  {
    icon: ScanLine,
    t: { ar: 'ارفع سيرتك', en: 'Upload your CV' },
    d: { ar: 'دقيقة واحدة، ويفتح لك لوحتك فورًا.', en: 'One minute, and your dashboard unlocks instantly.' },
  },
  {
    icon: Sparkles,
    t: { ar: 'اعرف درجتك', en: 'See your score' },
    d: { ar: 'لكل دور ومستوى، مع ما الذي يرفعها.', en: 'Per role and level, with what raises it.' },
  },
  {
    icon: Route,
    t: { ar: 'اتبع خطتك', en: 'Follow your plan' },
    d: { ar: 'مسارات وشهادات يموّل هدف نصفها.', en: 'Paths and certifications Hadaf funds half of.' },
  },
  {
    icon: Users,
    t: { ar: 'تواصل', en: 'Reach out' },
    d: { ar: 'الأشخاص المناسبون، برسائل بأسلوبك.', en: 'The right people, in your own voice.' },
  },
];

export const BANNER_C: { icon: typeof ShieldCheck; t: { ar: string; en: string } }[] = [
  { icon: ShieldCheck, t: { ar: 'خصوصية أولًا، لا نشارك بياناتك ويمكنك حذفها متى شئت', en: 'Privacy first, we never share your data and you can delete it anytime' } },
  { icon: GraduationCap, t: { ar: 'أهلية منحة رواد لأفضل 30 جامعة', en: 'Pioneers eligibility for the top 30 universities' } },
  { icon: Users, t: { ar: '1,209 جهة موارد بشرية وتوظيف', en: '1,209 HR and recruiter contacts' } },
];

/* ------------------------------------------------------------- primitives -- */

const checkoutPro = { pathname: '/checkout', query: { plan: 'pro' } } as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A full width centered band. `dark` forces the bold near black look in any theme. */
function Band({
  children,
  dark = false,
  className,
  id,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('relative w-full px-5 py-14 sm:py-24 md:py-28', dark && 'bg-stone-950 text-stone-100', className)}>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">{children}</div>
    </section>
  );
}

function BandHead({
  eyebrow,
  title,
  sub,
  locale,
  onDark = false,
}: {
  eyebrow: { ar: string; en: string };
  title: { ar: string; en: string };
  sub: { ar: string; en: string };
  locale: Loc;
  onDark?: boolean;
}) {
  return (
    <Reveal className="flex flex-col items-center">
      <Eyebrow className={onDark ? 'text-stone-400' : undefined}>{pick(eyebrow, locale)}</Eyebrow>
      <Serif className="mt-3 text-balance text-4xl leading-[1.05] sm:text-5xl">{pick(title, locale)}</Serif>
      <p className={cn('mt-4 max-w-2xl text-pretty text-base sm:text-lg', onDark ? 'text-stone-300' : 'text-stone-600 dark:text-stone-300')}>
        {pick(sub, locale)}
      </p>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ page -- */

export function CDesign({ locale, T, STEPS, BANNER }: { locale: Loc; T: CCopy; STEPS: typeof STEPS_C; BANNER: typeof BANNER_C }) {
  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#f7f6f2]/80 backdrop-blur-md dark:border-white/10 dark:bg-[#0a0a0b]/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex items-center gap-2">
            <Serif className="text-2xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-stone-500 dark:text-stone-400 md:flex">
            <a href="#product" className="transition-colors hover:text-stone-900 dark:hover:text-white">{pick(T.nav.product, locale)}</a>
            <a href="#how" className="transition-colors hover:text-stone-900 dark:hover:text-white">{pick(T.nav.how, locale)}</a>
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{pick(T.nav.pricing, locale)}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LangToggle locale={locale} />
            <ThemeToggle />
            <Link
              href={checkoutPro}
              className={cn('inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-semibold transition-colors sm:px-4 sm:text-sm', PILL)}
            >
              {pick(T.cta, locale)}
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <Band className="pt-16 sm:pt-24">
        <Reveal className="flex flex-col items-center">
          <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium', SOFT)}>
            <Sparkles className="h-3.5 w-3.5" />
            {pick(T.heroEyebrow, locale)}
          </span>
          <Serif className="mt-6 max-w-3xl text-balance text-[2rem] leading-[1.12] sm:text-5xl md:text-7xl">
            {pick(T.heroTitle, locale)}
          </Serif>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-stone-600 dark:text-stone-300">{pick(T.heroSub, locale)}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href={checkoutPro}
              className={cn(
                'group inline-flex h-12 items-center gap-2 rounded-full px-7 text-base font-semibold text-stone-950 shadow-[0_14px_40px_-12px_rgba(245,158,11,0.7)] transition-transform hover:scale-[1.03]',
                'bg-amber-400 hover:bg-amber-300',
              )}
            >
              {pick(T.cta, locale)}
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
            </Link>
            <a
              href="#pricing"
              className={cn('inline-flex h-12 items-center rounded-full px-6 text-base font-semibold transition-colors', GHOST)}
            >
              {pick(T.priceEyebrow, locale)}
            </a>
          </div>
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">{pick(T.heroNote, locale)}</p>
        </Reveal>

        {/* hero shot: one large centered preview */}
        <Reveal delay={0.12} className="mt-14 w-full">
          <DashboardPreview locale={locale} className="mx-auto max-w-3xl" />
        </Reveal>

        {/* trust row */}
        <Reveal delay={0.2} className="mt-12 w-full">
          <Eyebrow>{pick(T.trusted, locale)}</Eyebrow>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-stone-400 dark:text-stone-500">
            {TARGET_COMPANIES.map((c) => (
              <span key={c} className="text-sm font-semibold tracking-tight">{c}</span>
            ))}
          </div>
        </Reveal>
      </Band>

      {/* BOLD DARK BAND: the problem scoreboard */}
      <Band dark id="problem">
        <BandHead eyebrow={T.scoreboardEyebrow} title={T.scoreboardTitle} sub={T.scoreboardSub} locale={locale} onDark />
        <div className="mt-12 grid w-full gap-8 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="flex flex-col items-center">
              <Serif className="text-6xl leading-none text-amber-400 sm:text-7xl">{s.n}</Serif>
              <p className="mt-3 max-w-[14rem] text-sm text-stone-400">{pick(s.label, locale)}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3} className="mt-12">
          <Link
            href={checkoutPro}
            className={cn('inline-flex h-12 items-center gap-2 rounded-full bg-amber-400 px-7 text-base font-semibold text-stone-950 transition-transform hover:scale-[1.03] hover:bg-amber-300')}
          >
            {pick(T.cta, locale)}
            <ArrowUpRight className="h-5 w-5 rtl:rotate-[-90deg]" />
          </Link>
        </Reveal>
      </Band>

      {/* CALM LIGHT BAND: your real score */}
      <Band id="product">
        <BandHead eyebrow={T.scoreEyebrow} title={T.scoreTitle} sub={T.scoreSub} locale={locale} />
        <Reveal delay={0.12} className="mt-12 flex flex-col items-center">
          <span className={cn('inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold', SOFT)}>
            <Sparkles className="h-4 w-4" />
            {pick(T.scoreStat, locale)}
          </span>
          <Serif className="mt-6 text-balance text-5xl leading-[1.05] sm:text-6xl">{pick(T.scoreLine, locale)}</Serif>
          <p className="mt-4 max-w-xl text-pretty text-base text-stone-600 dark:text-stone-300 sm:text-lg">
            {pick(T.scoreStatSub, locale)}
          </p>
        </Reveal>
      </Band>

      {/* BOLD DARK BAND: your plan, Hadaf pays half */}
      <Band dark>
        <BandHead eyebrow={T.planEyebrow} title={T.planTitle} sub={T.planSub} locale={locale} onDark />
        <Reveal delay={0.12} className="mt-12 flex flex-col items-center">
          <Serif className="text-7xl leading-none text-amber-400 sm:text-8xl">{pick(T.planStat, locale)}</Serif>
          <p className="mt-5 max-w-xl text-pretty text-base text-stone-300 sm:text-lg">{pick(T.planStatSub, locale)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-stone-100">
            <Route className="h-5 w-5 text-amber-400" />
            {pick(T.planLine, locale)}
          </p>
        </Reveal>
      </Band>

      {/* CALM LIGHT BAND: the people */}
      <Band>
        <BandHead eyebrow={T.peopleEyebrow} title={T.peopleTitle} sub={T.peopleSub} locale={locale} />
        <Reveal delay={0.12} className="mt-12 flex flex-col items-center">
          <Serif className={cn('text-7xl leading-none sm:text-8xl', ACCENT)}>{pick(T.peopleStat, locale)}</Serif>
          <p className="mt-5 max-w-xl text-pretty text-base text-stone-600 dark:text-stone-300 sm:text-lg">
            {pick(T.peopleStatSub, locale)}
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-base font-semibold text-stone-900 dark:text-stone-100">
            <Users className="h-5 w-5 text-amber-500" />
            {pick(T.peopleLine, locale)}
          </p>
        </Reveal>
      </Band>

      {/* BOLD DARK BAND: study and opportunities, side by side */}
      <Band dark>
        <BandHead eyebrow={T.studyEyebrow} title={T.studyTitle} sub={T.studySub} locale={locale} onDark />
        <div className="mt-12 grid w-full gap-6 sm:grid-cols-2">
          <Reveal delay={0.1} className="flex flex-col items-center">
            <GraduationCap className="h-8 w-8 text-amber-400" />
            <Serif className="mt-4 text-balance text-4xl leading-none text-amber-400 sm:text-5xl">{pick(T.studyStatA, locale)}</Serif>
            <p className="mt-3 max-w-xs text-sm text-stone-400">{pick(T.studyStatASub, locale)}</p>
          </Reveal>
          <Reveal delay={0.18} className="flex flex-col items-center">
            <ScanLine className="h-8 w-8 text-amber-400" />
            <Serif className="mt-4 text-balance text-4xl leading-none text-amber-400 sm:text-5xl">{pick(T.studyStatB, locale)}</Serif>
            <p className="mt-3 max-w-xs text-sm text-stone-400">{pick(T.studyStatBSub, locale)}</p>
          </Reveal>
        </div>
        <Reveal delay={0.26} className="mt-10">
          <p className="inline-flex items-center gap-2 text-base font-semibold text-stone-100">
            <Sparkles className="h-5 w-5 text-amber-400" />
            {pick(T.studyLine, locale)}
          </p>
        </Reveal>
      </Band>

      {/* CALM LIGHT BAND: how it works, four big steps */}
      <Band id="how">
        <BandHead eyebrow={T.howEyebrow} title={T.howTitle} sub={T.howSub} locale={locale} />
        <div className="mt-12 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.t.en} delay={i * 0.08}>
                <div className={cn(CARD, 'flex h-full flex-col items-center p-6 text-center')}>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <Serif className={cn('mt-4 text-3xl', ACCENT)}>{i + 1}</Serif>
                  <div className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-100">{pick(s.t, locale)}</div>
                  <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">{pick(s.d, locale)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Band>

      {/* BOLD DARK BAND: pricing */}
      <Band dark id="pricing">
        <BandHead eyebrow={T.priceEyebrow} title={T.priceTitle} sub={T.priceSub} locale={locale} onDark />
        <div className="mt-12 grid w-full gap-5 sm:grid-cols-2">
          {PRICING.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 0.12} className="h-full">
              <div
                className={cn(
                  'relative flex h-full flex-col rounded-[22px] border p-7 text-start',
                  tier.popular
                    ? 'border-amber-400/40 bg-stone-900 shadow-[0_30px_80px_-40px_rgba(245,158,11,0.5)]'
                    : 'border-white/10 bg-white/[0.04]',
                )}
              >
                {tier.popular ? (
                  <span className="absolute end-6 top-6 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-stone-950">
                    {pick(T.popular, locale)}
                  </span>
                ) : null}
                <div className="text-sm font-semibold uppercase tracking-wider text-stone-400">{pick(tier.name, locale)}</div>
                <div className="mt-3 flex items-baseline gap-2">
                  <Serif className="text-5xl leading-none text-stone-100">{tier.price}</Serif>
                  <span className="text-sm text-stone-400">{pick(T.perOnce, locale)}</span>
                </div>
                <p className="mt-2 text-sm text-stone-300">{pick(tier.blurb, locale)}</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f.en} className="flex items-start gap-2.5 text-sm text-stone-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <span>{pick(f, locale)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={{ pathname: '/checkout', query: { plan: tier.id } }}
                  className={cn(
                    'mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-transform hover:scale-[1.02]',
                    tier.popular
                      ? 'bg-amber-400 text-stone-950 hover:bg-amber-300'
                      : 'border border-white/15 bg-white/[0.06] text-stone-100 hover:border-white/30',
                  )}
                >
                  {pick(T.choose, locale)} {pick(tier.name, locale)}
                  <ArrowUpRight className="h-4.5 w-4.5 rtl:rotate-[-90deg]" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {/* reassurance banner */}
        <Reveal delay={0.2} className="mt-10 w-full">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {BANNER.map((b) => {
              const Icon = b.icon;
              return (
                <span key={b.t.en} className="inline-flex items-center gap-2 text-sm text-stone-400">
                  <Icon className="h-4 w-4 text-amber-400" />
                  {pick(b.t, locale)}
                </span>
              );
            })}
          </div>
        </Reveal>
      </Band>

      {/* CALM LIGHT BAND: final huge CTA */}
      <Band>
        <Reveal className="flex flex-col items-center">
          <Serif className="max-w-3xl text-balance text-[2rem] leading-[1.12] sm:text-5xl md:text-7xl">{pick(T.finalTitle, locale)}</Serif>
          <p className="mt-5 max-w-xl text-pretty text-lg text-stone-600 dark:text-stone-300">{pick(T.finalSub, locale)}</p>
          <Link
            href={checkoutPro}
            className={cn(
              'group mt-9 inline-flex h-14 items-center gap-2.5 rounded-full bg-amber-400 px-9 text-lg font-semibold text-stone-950 shadow-[0_18px_50px_-14px_rgba(245,158,11,0.75)] transition-transform hover:scale-[1.03] hover:bg-amber-300',
            )}
          >
            {pick(T.cta, locale)}
            <ArrowUpRight className="h-5.5 w-5.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-[-90deg]" />
          </Link>
          <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">{pick(T.heroNote, locale)}</p>
        </Reveal>
      </Band>

      {/* footer */}
      <footer className="border-t border-stone-200/60 px-5 py-10 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-start">
          <div className="flex items-center gap-2">
            <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className="text-sm text-stone-400">Masaar</span>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            © {new Date().getFullYear()} {locale === 'ar' ? 'مسار' : 'Masaar'}. {pick(T.rights, locale)}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function MarketingC({ locale }: { locale: Loc }) {
  return <CDesign locale={locale} T={COPY_C} STEPS={STEPS_C} BANNER={BANNER_C} />;
}
