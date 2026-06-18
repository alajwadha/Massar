'use client';

/* =============================================================================
   Marketing version B, "The Product Console".
   Dark first, product led, bento grid with the confident energy of a modern
   developer tool (Linear, Vercel) expressed in the v4 "Atlas" tokens. The
   product itself is the hero. Terse, technical voice, gold on near black.
============================================================================= */

import { useEffect } from 'react';
import {
  ArrowUpRight,
  Command,
  CornerDownLeft,
  Check,
  Gauge,
  Route,
  Users,
  GraduationCap,
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import {
  PAGE,
  CARD,
  EDGE,
  INSET,
  PILL,
  GHOST,
  SOFT,
  ACCENT,
  SPRING,
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

/* ----------------------------------------------------------------- copy -- */

const T = {
  nav: {
    product: { ar: 'المنتج', en: 'Product' },
    features: { ar: 'الميزات', en: 'Features' },
    pricing: { ar: 'الأسعار', en: 'Pricing' },
  },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  heroEyebrow: { ar: 'لوحة تحكم مهنية', en: 'Your career console' },
  heroTitle: {
    ar: 'كل ما تحتاجه لوظيفة أو ترقية، في لوحة واحدة.',
    en: 'Everything you need for a job or a promotion, in one console.',
  },
  heroSub: {
    ar: 'درجة تنافسية لكل دور ومستوى، مسارات وشهادات، جهات اتصال دافئة، ورسائل بصوتك. دفعة واحدة، بلا اشتراك.',
    en: 'A per role, per level score, paths and certs, warm contacts, and outreach in your own voice. One payment, no subscription.',
  },
  hintRun: { ar: 'افتح لوحتك', en: 'Open your console' },
  proof: { ar: 'مبني لمن يستهدف', en: 'Built for people targeting' },
  featuresEyebrow: { ar: 'الأنظمة', en: 'The systems' },
  featuresTitle: { ar: 'منتج واحد، لوحات تعمل معًا', en: 'One product, panels that work together' },
  stepsEyebrow: { ar: 'التشغيل', en: 'Runtime' },
  stepsTitle: { ar: 'من السيرة إلى أول رد، بأربع خطوات', en: 'From CV to first reply, in four steps' },
  pricingEyebrow: { ar: 'التفعيل', en: 'Activate' },
  pricingTitle: { ar: 'ادفع مرة، تفتح اللوحة فورًا', en: 'Pay once, the console unlocks instantly' },
  pricingNote: {
    ar: 'دفعة واحدة عبر ميسر: مدى، أبل باي، والبطاقات. لا اشتراك.',
    en: 'One payment via Moyasar: mada, Apple Pay, and cards. No subscription.',
  },
  per: { ar: 'ريال', en: 'SAR' },
  once: { ar: 'مرة واحدة', en: 'one time' },
  footTag: { ar: 'لوحة التحكم المهنية للسوق السعودي.', en: 'The career console for the Saudi market.' },
  rights: { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },
};

const TILES: {
  k: string;
  span: string;
  icon: typeof Gauge;
  eyebrow: { ar: string; en: string };
  title: { ar: string; en: string };
  line: { ar: string; en: string };
  stat?: { value: string; label: { ar: string; en: string } };
}[] = [
  {
    k: 'score',
    span: 'lg:col-span-3',
    icon: Gauge,
    eyebrow: { ar: 'التنافسية', en: 'Competitiveness' },
    title: { ar: 'درجة لكل دور ومستوى', en: 'A score per role and level' },
    line: {
      ar: 'درجة من 0 إلى 100 لكل مستوى، تريك بالضبط ما الذي يرفعها، ومحافظة عمدًا.',
      en: 'A 0 to 100 score per level that shows exactly what raises it, kept deliberately conservative.',
    },
    stat: { value: '100', label: { ar: 'أعلى درجة لكل مستوى', en: 'top score per level' } },
  },
  {
    k: 'paths',
    span: 'lg:col-span-3',
    icon: Route,
    eyebrow: { ar: 'المسارات', en: 'Paths and certs' },
    title: { ar: 'مسارات وشهادات بالأثر', en: 'Paths and certs by impact' },
    line: {
      ar: 'مسارات من خلفيتك، وخارطة شهادات مرتبة بالأثر، تُعلّم ما يسترد هدف نصفه.',
      en: 'Paths from your background and a certs roadmap ordered by impact, flagging what Hadaf reimburses.',
    },
    stat: { value: '50%', label: { ar: 'يسترده هدف', en: 'Hadaf reimburses' } },
  },
  {
    k: 'contacts',
    span: 'lg:col-span-2',
    icon: Users,
    eyebrow: { ar: 'الشبكة', en: 'Network' },
    title: { ar: 'جهات اتصال دافئة', en: 'Warm contacts' },
    line: {
      ar: 'شبكتك تُحلّل في متصفحك بخصوصية، وقاعدة 1,209 من الموارد البشرية.',
      en: 'Your connections parsed privately in your browser, plus 1,209 HR and recruiter contacts.',
    },
    stat: { value: '1,209', label: { ar: 'جهة موارد بشرية', en: 'HR contacts' } },
  },
  {
    k: 'study',
    span: 'lg:col-span-2',
    icon: GraduationCap,
    eyebrow: { ar: 'الدراسة', en: 'Study' },
    title: { ar: 'برامج عليا ومنح', en: 'Graduate programs and grants' },
    line: {
      ar: 'برامج عليا حسب المجال، أهلية منحة رواد، وخيارات سعودية بدوام جزئي.',
      en: 'Graduate programs by field, Pioneers scholarship eligibility, and Saudi part time options.',
    },
  },
  {
    k: 'opps',
    span: 'lg:col-span-2',
    icon: Building2,
    eyebrow: { ar: 'الفرص', en: 'Opportunities' },
    title: { ar: 'فرص ومسارات توظيف', en: 'Openings and hiring tracks' },
    line: {
      ar: 'نحو 60 صفحة توظيف سعودية حسب القطاع، أيام مهنية بمواعيد، وبرامج مثل تمهير.',
      en: 'Around 60 Saudi career pages by sector, dated career days, and programs like Tamheer.',
    },
    stat: { value: '~60', label: { ar: 'صفحة توظيف', en: 'career pages' } },
  },
];

/* -------------------------------------------------------------- helpers -- */

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-[11px] font-semibold tabular-nums', SOFT)}>
      {children}
    </span>
  );
}

/* ----------------------------------------------------------------- page -- */

export default function MarketingB({ locale }: { locale: Loc }) {
  const L = (s: { ar: string; en: string }) => pick(s, locale);

  // Dark first: default to dark only when the user has made no explicit choice.
  useEffect(() => {
    try {
      if (!localStorage.getItem('masaar:theme')) {
        document.documentElement.classList.add('dark');
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* header */}
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#f7f6f2]/80 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0a0a0b]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
              <Zap className="h-4 w-4" />
            </span>
            <Serif className="text-lg">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
          <nav className="ms-2 hidden items-center gap-6 text-sm text-stone-500 dark:text-stone-400 md:flex">
            <a href="#product" className="transition-colors hover:text-stone-900 dark:hover:text-white">{L(T.nav.product)}</a>
            <a href="#features" className="transition-colors hover:text-stone-900 dark:hover:text-white">{L(T.nav.features)}</a>
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{L(T.nav.pricing)}</a>
          </nav>
          <div className="ms-auto flex items-center gap-2">
            <LangToggle locale={locale} />
            <ThemeToggle />
            <Link
              href={{ pathname: '/checkout', query: { plan: 'pro' } }}
              className={cn('hidden rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:inline-flex', PILL)}
            >
              {L(T.cta)}
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section id="product" className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 sm:pt-20">
        {/* amber glow behind the product */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-24 -z-0 mx-auto h-[420px] max-w-3xl rounded-full bg-amber-500/25 blur-[120px] dark:bg-amber-500/20" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Eyebrow>{L(T.heroEyebrow)}</Eyebrow>
            <h1 className="mt-4 text-balance text-4xl leading-[1.07] tracking-tight sm:text-5xl">
              <Serif>{L(T.heroTitle)}</Serif>
            </h1>
            <p className="mt-5 max-w-md text-pretty text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">
              {L(T.heroSub)}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors', PILL)}
              >
                {L(T.cta)}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className={cn('inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors', GHOST)}
              >
                {L(T.nav.pricing)}
              </a>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Kbd><Command className="h-3 w-3" />K</Kbd>
              <span>{L(T.hintRun)}</span>
              <Kbd><CornerDownLeft className="h-3 w-3" /></Kbd>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26, rotate: -1.4 }}
            animate={{ opacity: 1, y: 0, rotate: -1.4 }}
            transition={{ ...SPRING, delay: 0.1 }}
            className="relative [transform:perspective(1600px)_rotateY(3deg)]"
          >
            <DashboardPreview locale={locale} />
          </motion.div>
        </div>

        {/* social proof, no invented testimonials */}
        <Reveal delay={0.1} className="mt-14">
          <Eyebrow>{L(T.proof)}</Eyebrow>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {TARGET_COMPANIES.map((c) => (
              <span key={c} className={cn('rounded-full px-3 py-1 text-[13px] font-medium', SOFT)}>{c}</span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* stats */}
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className={cn(CARD, EDGE, 'grid divide-stone-200/70 p-2 dark:divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:rtl:divide-x-reverse')}>
          {STATS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="px-5 py-5">
              <div className={cn('text-3xl font-semibold tabular-nums', ACCENT)}>{s.n}</div>
              <div className="mt-1 text-[13px] leading-snug text-stone-500 dark:text-stone-400">{L(s.label)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* bento features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-12">
        <Reveal>
          <Eyebrow>{L(T.featuresEyebrow)}</Eyebrow>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
            <Serif>{L(T.featuresTitle)}</Serif>
          </h2>
        </Reveal>

        <div className="mt-8 grid auto-rows-fr gap-4 lg:grid-cols-6">
          {TILES.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <Reveal key={tile.k} delay={(i % 3) * 0.07} className={cn('flex', tile.span)}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={SPRING}
                  className={cn(CARD, EDGE, 'flex w-full flex-col gap-4 p-5')}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', SOFT)}>
                      <Icon className={cn('h-4 w-4', ACCENT)} />
                    </span>
                    <div className="min-w-0">
                      <Eyebrow>{L(tile.eyebrow)}</Eyebrow>
                      <Serif className="mt-1.5 block text-[15px] leading-snug text-stone-900 dark:text-white">{L(tile.title)}</Serif>
                    </div>
                  </div>
                  <p className="text-[13px] leading-snug text-stone-600 dark:text-stone-300">{L(tile.line)}</p>
                  {tile.stat ? (
                    <div className="mt-auto flex items-baseline gap-2">
                      <span className={cn('text-2xl font-semibold tabular-nums', ACCENT)}>{tile.stat.value}</span>
                      <span className="text-[12px] text-stone-500 dark:text-stone-400">{L(tile.stat.label)}</span>
                    </div>
                  ) : null}
                </motion.div>
              </Reveal>
            );
          })}

          {/* what raises it tile */}
          <Reveal delay={0.07} className="flex lg:col-span-2">
            <motion.div whileHover={{ y: -5 }} transition={SPRING} className={cn(CARD, EDGE, 'flex w-full flex-col gap-4 p-5')}>
              <div className="flex items-start gap-3">
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', SOFT)}>
                  <Gauge className={cn('h-4 w-4', ACCENT)} />
                </span>
                <div className="min-w-0">
                  <Eyebrow>{locale === 'ar' ? 'ما الذي يرفعها' : 'What raises it'}</Eyebrow>
                  <Serif className="mt-1.5 block text-[15px] leading-snug text-stone-900 dark:text-white">
                    {locale === 'ar' ? 'كل خطوة محسوبة بأثرها' : 'Every step, weighted'}
                  </Serif>
                </div>
              </div>
              <p className="text-[13px] leading-snug text-stone-600 dark:text-stone-300">
                {locale === 'ar' ? 'كل خطوة محسوبة بأثرها على الدرجة، بلا مبالغة.' : 'Every step weighted by its effect on the score, never inflated.'}
              </p>
              <ul className="mt-auto space-y-1.5 text-[13px] text-stone-600 dark:text-stone-300">
                {[
                  { ar: 'صياغة الإنجازات', en: 'Reframe bullets', d: '+6' },
                  { ar: 'شهادة FMVA', en: 'FMVA', d: '+8' },
                  { ar: 'CFA المستوى الأول', en: 'CFA Level 1', d: '+15' },
                ].map((r) => (
                  <li key={r.en} className="flex items-center gap-2">
                    <span className={cn('font-semibold tabular-nums', ACCENT)}>{r.d}</span>
                    <span>{L(r)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </Reveal>

          {/* outreach in your voice, copy tile */}
          <Reveal delay={0.14} className="flex lg:col-span-2">
            <motion.div whileHover={{ y: -5 }} transition={SPRING} className={cn(CARD, EDGE, 'flex w-full flex-col gap-4 p-5')}>
              <div className="flex items-start gap-3">
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', SOFT)}>
                  <Sparkles className={cn('h-4 w-4', ACCENT)} />
                </span>
                <div>
                  <Eyebrow>{locale === 'ar' ? 'التواصل' : 'Outreach'}</Eyebrow>
                  <p className="mt-1.5 text-[13px] leading-snug text-stone-600 dark:text-stone-300">
                    {locale === 'ar' ? 'رسائل بصوتك ترسلها بنفسك، فتبقى مسيطرًا وخصوصيتك محفوظة.' : 'Messages in your voice that you send yourself, so you stay in control and private.'}
                  </p>
                </div>
              </div>
              <div className={cn(INSET, 'mt-auto p-3 text-[12.5px] leading-relaxed text-stone-600 dark:text-stone-300')}>
                {locale === 'ar'
                  ? '«مرحبًا سارة، لاحظت عملكم في تمويل الطاقة المتجددة وأود التعلم من خبرتكم...»'
                  : '"Hi Sarah, I noticed your work in renewable energy finance and would value learning from your experience..."'}
              </div>
            </motion.div>
          </Reveal>

          {/* tiers tile, built from PRICING */}
          <Reveal delay={0.07} className="flex lg:col-span-2">
            <motion.div whileHover={{ y: -5 }} transition={SPRING} className={cn(CARD, EDGE, 'flex w-full flex-col gap-4 p-5')}>
              <div>
                <Eyebrow>{locale === 'ar' ? 'الباقات' : 'Tiers'}</Eyebrow>
                <p className="mt-1.5 text-[13px] leading-snug text-stone-600 dark:text-stone-300">
                  {locale === 'ar' ? 'دفعة واحدة، بلا اشتراك. اختر تغطيتك.' : 'One payment, no subscription. Pick your coverage.'}
                </p>
              </div>
              <div className="mt-auto space-y-2">
                {PRICING.map((tier) => (
                  <div key={tier.id} className={cn(INSET, 'flex items-center justify-between px-3 py-2.5')}>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-stone-800 dark:text-stone-100">{L(tier.name)}</span>
                      {tier.popular ? (
                        <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                          {locale === 'ar' ? 'الأكثر اختيارًا' : 'Popular'}
                        </span>
                      ) : null}
                    </div>
                    <span className={cn('text-sm font-semibold tabular-nums', ACCENT)}>
                      {tier.price} {L(T.per)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <Reveal>
          <Eyebrow>{L(T.stepsEyebrow)}</Eyebrow>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
            <Serif>{L(T.stepsTitle)}</Serif>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: ShieldCheck, ar: 'ارفع سيرتك واختر دورًا ومستوى', en: 'Upload your CV, pick a role and level' },
            { i: Gauge, ar: 'احصل على درجتك وما يرفعها', en: 'Get your score and what raises it' },
            { i: Users, ar: 'رتّب جهات الاتصال الدافئة', en: 'Rank your warm contacts' },
            { i: Sparkles, ar: 'أرسل رسائلك بصوتك', en: 'Send your outreach, in your voice' },
          ].map((step, i) => {
            const Icon = step.i;
            return (
              <Reveal key={step.en} delay={i * 0.08} className="flex">
                <div className={cn(CARD, EDGE, 'flex w-full flex-col gap-3 p-5')}>
                  <div className="flex items-center justify-between">
                    <span className={cn('grid h-9 w-9 place-items-center rounded-xl', SOFT)}>
                      <Icon className={cn('h-4 w-4', ACCENT)} />
                    </span>
                    <span className="font-serif text-2xl tabular-nums text-stone-300 dark:text-white/15">0{i + 1}</span>
                  </div>
                  <p className="text-[13.5px] leading-snug text-stone-700 dark:text-stone-200">{L(step)}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className="mx-auto max-w-5xl px-5 py-12">
        <Reveal className="text-center">
          <Eyebrow className="justify-center">{L(T.pricingEyebrow)}</Eyebrow>
          <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
            <Serif>{L(T.pricingTitle)}</Serif>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-stone-500 dark:text-stone-400">{L(T.pricingNote)}</p>
        </Reveal>

        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          {PRICING.map((tier, i) => (
            <Reveal key={tier.id} delay={i * 0.1} className="flex">
              <motion.div
                whileHover={{ y: -5 }}
                transition={SPRING}
                className={cn(
                  CARD,
                  EDGE,
                  'flex w-full flex-col p-6',
                  tier.popular && 'ring-2 ring-amber-500/70 dark:ring-amber-400/60',
                )}
              >
                <div className="flex items-center justify-between">
                  <Serif className="text-xl">{L(tier.name)}</Serif>
                  {tier.popular ? (
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                      {locale === 'ar' ? 'الأكثر اختيارًا' : 'Most popular'}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">{L(tier.blurb)}</p>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tabular-nums">{tier.price}</span>
                  <span className="text-sm text-stone-500 dark:text-stone-400">{L(T.per)}</span>
                  <span className={cn('ms-1 rounded-full px-2 py-0.5 text-[11px] font-medium', SOFT)}>{L(T.once)}</span>
                </div>
                <ul className="mt-6 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f.en} className="flex items-start gap-2.5 text-[13.5px] text-stone-700 dark:text-stone-200">
                      <Check className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
                      <span>{L(f)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={{ pathname: '/checkout', query: { plan: tier.id } }}
                  className={cn(
                    'mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors',
                    tier.popular ? PILL : GHOST,
                  )}
                >
                  {L(T.cta)}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* closing call to action */}
      <section className="mx-auto max-w-5xl px-5 py-12">
        <Reveal>
          <div className="relative">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 mx-auto h-64 max-w-2xl -translate-y-1/2 rounded-full bg-amber-500/15 blur-[110px]" />
            <div className={cn(CARD, EDGE, 'relative flex flex-col items-center gap-5 px-6 py-12 text-center')}>
              <Eyebrow className="justify-center">{L(T.pricingEyebrow)}</Eyebrow>
              <h2 className="max-w-xl text-balance text-3xl tracking-tight sm:text-4xl">
                <Serif>{L(T.heroTitle)}</Serif>
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                  className={cn('inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors', PILL)}
                >
                  {L(T.cta)}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href="#pricing"
                  className={cn('inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors', GHOST)}
                >
                  {L(T.nav.pricing)}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <Kbd><Command className="h-3 w-3" />K</Kbd>
                <span>{L(T.hintRun)}</span>
                <Kbd><CornerDownLeft className="h-3 w-3" /></Kbd>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* footer */}
      <footer className="mt-8 border-t border-stone-200/60 dark:border-white/[0.07]">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900">
                <Zap className="h-4 w-4" />
              </span>
              <Serif className="text-lg">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            </div>
            <p className="mt-3 max-w-xs text-[13px] text-stone-500 dark:text-stone-400">{L(T.footTag)}</p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <Link
              href={{ pathname: '/checkout', query: { plan: 'pro' } }}
              className={cn('inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors', PILL)}
            >
              {L(T.cta)}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <p className="text-[12px] text-stone-400 dark:text-stone-500">
              © {new Date().getFullYear()} {locale === 'ar' ? 'مسار' : 'Masaar'}. {L(T.rights)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
