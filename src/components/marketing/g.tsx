'use client';

/* =============================================================================
   Landing version G, "Classic SaaS, done in v4".
   The familiar, high converting marketing structure executed cleanly in the v4
   "Atlas" language: a centered hero, a trust logo row, a three up feature grid,
   a calm product band, a four step how it works, the stats row, pricing, a short
   FAQ, and a final call to action band. Conventional and safe, just polished and
   on brand. Light first, amber only, generous serif, hairline cards.
============================================================================= */

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
  ScoreCard,
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
  Gauge,
  Route,
  Users,
  Upload,
  GraduationCap,
  Building2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------- copy -- */

const T = {
  navFeatures: { ar: 'الميزات', en: 'Features' },
  navHow: { ar: 'كيف يعمل', en: 'How it works' },
  navPricing: { ar: 'الأسعار', en: 'Pricing' },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  ctaPricing: { ar: 'شاهد الأسعار', en: 'See pricing' },

  heroEyebrow: { ar: 'لوظيفة جديدة أو ترقية', en: 'For a new job or a promotion' },
  heroTitle: { ar: 'سيرتك تستحق خطة، لا مجرد إرسال.', en: 'Your CV deserves a plan, not just submissions.' },
  heroSub: {
    ar: 'مسار يقرأ سيرتك، يعطيك درجة تنافسية صادقة لكل دور ومستوى، ويرسم المسارات والشهادات والأشخاص الذين يوصلونك. عربي أولًا، دفعة واحدة، بلا اشتراك.',
    en: 'Masaar reads your CV, gives you an honest competitiveness score for each role and level, and lays out the paths, certifications, and people who get you there. Arabic first, one payment, no subscription.',
  },
  heroNote: { ar: 'تفتح لوحتك فورًا بعد الدفع.', en: 'Your dashboard unlocks instantly after payment.' },
  trusted: { ar: 'مبني للأدوار في', en: 'Built for roles at' },

  featuresEyebrow: { ar: 'الميزات', en: 'Features' },
  featuresTitle: { ar: 'كل ما تحتاجه للوصول', en: 'Everything you need to get there' },

  bandEyebrow: { ar: 'لوحة التحكم', en: 'The dashboard' },
  bandTitle: { ar: 'منتج واحد، هادئ وواضح', en: 'One product, calm and clear' },
  bandSub: {
    ar: 'درجتك ومسارك وجهات اتصالك في مكان واحد، بالعربية والإنجليزية، فاتح وداكن.',
    en: 'Your score, your path, and your contacts in one place, Arabic and English, light and dark.',
  },

  howEyebrow: { ar: 'كيف يعمل', en: 'How it works' },
  howTitle: { ar: 'من السيرة إلى أول رد، بأربع خطوات', en: 'From CV to first reply, in four steps' },

  statsEyebrow: { ar: 'لماذا الطريقة المعتادة لا تكفي', en: 'Why the usual way falls short' },
  statsTitle: { ar: 'الإرسال البارد لعبة خاسرة', en: 'Cold applications are a losing game' },

  pricingEyebrow: { ar: 'الأسعار', en: 'Pricing' },
  pricingTitle: { ar: 'ادفع مرة، تفتح لوحتك', en: 'Pay once, unlock your dashboard' },
  pricingSub: {
    ar: 'دفعة واحدة عبر ميسر: مدى، أبل باي، والبطاقات. لا اشتراك ولا رسوم متكررة.',
    en: 'One payment via Moyasar: mada, Apple Pay, and cards. No subscription, no recurring fees.',
  },
  per: { ar: 'ريال', en: 'SAR' },
  once: { ar: 'مرة واحدة', en: 'one time' },
  most: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  faqEyebrow: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  faqTitle: { ar: 'أسئلة قبل أن تبدأ', en: 'Questions before you start' },

  closeTitle: { ar: 'ابدأ بسيرتك كما هي اليوم.', en: 'Start with your CV exactly as it is today.' },
  closeSub: {
    ar: 'انضم إلى محترفين يستهدفون صندوق الاستثمارات العامة وأرامكو ونيوم وغيرها.',
    en: 'Join professionals targeting PIF, Aramco, NEOM, and more.',
  },
  footTag: { ar: 'عربي أولًا، بالكامل ثنائي اللغة.', en: 'Arabic first, fully bilingual.' },
  rights: { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },
} as const;

const FEATURES: { icon: typeof Gauge; title: { ar: string; en: string }; line: { ar: string; en: string } }[] = [
  {
    icon: Gauge,
    title: { ar: 'درجة تنافسية صادقة', en: 'An honest competitiveness score' },
    line: {
      ar: 'درجة من 100 لكل مستوى من المبتدئ إلى القيادي، محافظة عمدًا، تريك بالضبط ما يرفعها.',
      en: 'A score out of 100 for each level from Entry to Director, deliberately conservative, showing exactly what raises it.',
    },
  },
  {
    icon: Route,
    title: { ar: 'مسارات وشهادات بالأثر', en: 'Tailored paths and certifications' },
    line: {
      ar: 'مسارات تناسب خلفيتك وخارطة شهادات مرتبة بالأثر، مع تمييز ما يعيد هدف نحو 50 بالمئة منه.',
      en: 'Paths that fit your background and a certifications roadmap ordered by impact, flagging what Hadaf reimburses about 50 percent of.',
    },
  },
  {
    icon: Users,
    title: { ar: 'سطحان للتواصل', en: 'Two contact surfaces' },
    line: {
      ar: 'جهاتك على لينكدإن تُحلّل بسرية في متصفحك وتُرتّب إلى مقدمات دافئة، إضافة إلى قاعدتنا من 1,209 جهة موارد بشرية بحسب باقتك.',
      en: 'Your LinkedIn connections parsed privately in your browser and ranked into warm intros, plus our database of 1,209 HR contacts, capped by tier.',
    },
  },
  {
    icon: GraduationCap,
    title: { ar: 'الدراسة', en: 'Study' },
    line: {
      ar: 'برامج الدراسات العليا، أهلية منحة رواد لأفضل 30 جامعة، خيارات سعودية بدوام جزئي، والمواعيد النهائية.',
      en: 'Graduate programs, Pioneers scholarship eligibility for the top 30 universities, Saudi part time options, and deadlines.',
    },
  },
  {
    icon: Building2,
    title: { ar: 'الفرص', en: 'Opportunities' },
    line: {
      ar: 'نحو 60 صفحة توظيف سعودية حسب القطاع، أيام مهنية بمواعيدها، مهارات مطلوبة، وبرامج وطنية مثل تمهير.',
      en: 'Around 60 Saudi career pages by sector, dated career days, in demand skills, and national programs like Tamheer.',
    },
  },
  {
    icon: Sparkles,
    title: { ar: 'تواصل بصوتك', en: 'Outreach in your voice' },
    line: {
      ar: 'نصوغ رسائل التواصل بصوتك أنت، تراجعها وترسلها بنفسك، فتبقى أنت المتحكم.',
      en: 'We draft your outreach in your own voice, you review it and send it yourself, so you stay in control.',
    },
  },
];

const STEPS: { icon: typeof Gauge; title: { ar: string; en: string }; line: { ar: string; en: string } }[] = [
  {
    icon: Upload,
    title: { ar: 'ارفع سيرتك', en: 'Upload your CV' },
    line: { ar: 'اختر دورًا ومستوى تستهدفه.', en: 'Pick a role and level to target.' },
  },
  {
    icon: Gauge,
    title: { ar: 'اعرف درجتك', en: 'See your score' },
    line: { ar: 'درجة صادقة مع ما يرفعها بالضبط.', en: 'An honest score with what raises it.' },
  },
  {
    icon: Users,
    title: { ar: 'رتّب جهاتك', en: 'Rank your contacts' },
    line: { ar: 'مقدمات دافئة من شبكتك وقاعدتنا.', en: 'Warm intros from your network and ours.' },
  },
  {
    icon: Sparkles,
    title: { ar: 'تواصل بصوتك', en: 'Reach out, in your voice' },
    line: { ar: 'رسائل بصوتك ترسلها بنفسك.', en: 'Messages in your voice that you send.' },
  },
];

const FAQ: { q: { ar: string; en: string }; a: { ar: string; en: string } }[] = [
  {
    q: { ar: 'هل هذا اشتراك؟', en: 'Is this a subscription?' },
    a: {
      ar: 'لا. الأساسية 199 ريال والاحترافية 499 ريال، دفعة واحدة عبر ميسر، وتفتح لوحتك فورًا بلا رسوم متكررة.',
      en: 'No. Starter is 199 SAR and Pro is 499 SAR, a one time payment via Moyasar, and your dashboard unlocks instantly with no recurring fees.',
    },
  },
  {
    q: { ar: 'هل ترسلون رسائل نيابة عني؟', en: 'Do you message people on my behalf?' },
    a: {
      ar: 'لا. نصوغ الرسائل بصوتك، وأنت تراجعها وترسلها بنفسك، فتبقى أنت المتحكم دائمًا.',
      en: 'No. We draft the messages in your voice, and you review and send them yourself, so you always stay in control.',
    },
  },
  {
    q: { ar: 'كيف تتعاملون مع جهات لينكدإن؟', en: 'How do you handle my LinkedIn connections?' },
    a: {
      ar: 'تُحلّل جهاتك بسرية داخل متصفحك وحده وتُرتّب إلى مقدمات دافئة، إضافة إلى قاعدتنا من جهات الموارد البشرية بحسب باقتك.',
      en: 'Your connections are parsed privately inside your browser alone and ranked into warm intros, alongside our HR database, capped by your tier.',
    },
  },
  {
    q: { ar: 'هل الدرجة دقيقة؟', en: 'Is the score accurate?' },
    a: {
      ar: 'الدرجة محافظة عمدًا حتى تثق بها، وتعطيك درجة منفصلة لكل دور ومستوى مع خطوات واضحة ترفعها.',
      en: 'The score is deliberately conservative so you can trust it, with a separate score per role and level and clear steps that raise it.',
    },
  },
];

const RULE = 'border-stone-200/70 dark:border-white/10';

/* --------------------------------------------------------------- helpers -- */

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

/** A centered section heading: small eyebrow over a serif title. */
function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-3xl tracking-tight sm:text-4xl">
        <Serif>{title}</Serif>
      </h2>
      {sub ? <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{sub}</p> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ page -- */

export default function MarketingG({ locale }: { locale: Loc }) {
  const t = (k: keyof typeof T) => pick(T[k], locale);

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* ----------------------------------------------------------- header -- */}
      <header className={cn('sticky top-0 z-40 border-b bg-[#f7f6f2]/80 backdrop-blur-xl dark:bg-[#0a0a0b]/80', RULE)}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] text-stone-500 dark:text-stone-400 md:flex">
            <a href="#features" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navFeatures')}</a>
            <a href="#how" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navHow')}</a>
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

      <main className="relative z-10">
        {/* -------------------------------------------------------- hero -- */}
        <section className="relative mx-auto max-w-6xl px-5 pb-12 pt-16 text-center sm:px-8 sm:pt-24">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-10 -z-0 mx-auto h-72 max-w-2xl rounded-full bg-amber-500/15 blur-[120px] dark:bg-amber-500/15"
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative"
          >
            <span className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]', SOFT)}>
              {t('heroEyebrow')}
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              <Serif>{t('heroTitle')}</Serif>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-stone-600 dark:text-stone-300">
              {t('heroSub')}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors', PILL)}
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#pricing"
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors', GHOST)}
              >
                {t('ctaPricing')}
              </a>
            </div>
            <p className="mt-5 text-[13px] text-stone-500 dark:text-stone-400">{t('heroNote')}</p>
          </motion.div>
        </section>

        {/* -------------------------------------------------- trust row -- */}
        <section className="mx-auto max-w-6xl px-5 pb-6 sm:px-8">
          <Reveal>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">{t('trusted')}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {TARGET_COMPANIES.map((c) => (
                <span key={c} className="text-sm font-medium text-stone-400 dark:text-stone-500">{c}</span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* --------------------------------------------------- features -- */}
        <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow={t('featuresEyebrow')} title={t('featuresTitle')} />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title.en} delay={(i % 3) * 0.07} className="flex">
                  <motion.div whileHover={{ y: -4 }} transition={SPRING} className={cn(CARD, EDGE, 'flex w-full flex-col p-6')}>
                    <span className={cn('grid h-11 w-11 place-items-center rounded-xl', SOFT)}>
                      <Icon className={cn('h-5 w-5', ACCENT)} />
                    </span>
                    <Serif className="mt-4 block text-lg leading-snug text-stone-900 dark:text-white">{pick(f.title, locale)}</Serif>
                    <p className="mt-2 text-[14px] leading-relaxed text-stone-600 dark:text-stone-300">{pick(f.line, locale)}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------- product band -- */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow={t('bandEyebrow')} title={t('bandTitle')} sub={t('bandSub')} />
          </Reveal>
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <Reveal>
              <DashboardPreview locale={locale} />
            </Reveal>
            <Reveal delay={0.1} className="lg:pt-6">
              <ScoreCard locale={locale} />
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------- how it works -- */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow={t('howEyebrow')} title={t('howTitle')} />
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title.en} delay={i * 0.08} className="flex">
                  <div className={cn(CARD, EDGE, 'flex w-full flex-col gap-3 p-6')}>
                    <div className="flex items-center justify-between">
                      <span className={cn('grid h-10 w-10 place-items-center rounded-xl', SOFT)}>
                        <Icon className={cn('h-4 w-4', ACCENT)} />
                      </span>
                      <span className="font-serif text-3xl tabular-nums text-stone-300 dark:text-white/15">0{i + 1}</span>
                    </div>
                    <Serif className="block text-base text-stone-900 dark:text-white">{pick(step.title, locale)}</Serif>
                    <p className="text-[13.5px] leading-snug text-stone-600 dark:text-stone-300">{pick(step.line, locale)}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------- stats -- */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow={t('statsEyebrow')} title={t('statsTitle')} />
          </Reveal>
          <Reveal delay={0.05} className="mt-12">
            <div className={cn(CARD, EDGE, 'grid divide-stone-200/70 dark:divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:rtl:divide-x-reverse')}>
              {STATS.map((s, i) => (
                <div key={s.n} className="px-7 py-9 text-center">
                  <Serif className={cn('block text-5xl leading-none', ACCENT)}>{s.n}</Serif>
                  <div className="mt-3 text-[13.5px] leading-snug text-stone-500 dark:text-stone-400">{pick(s.label, locale)}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ----------------------------------------------- pricing -- */}
        <section id="pricing" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow={t('pricingEyebrow')} title={t('pricingTitle')} sub={t('pricingSub')} />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PRICING.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 0.1} className="flex">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={SPRING}
                  className={cn(
                    CARD,
                    EDGE,
                    'flex w-full flex-col p-7',
                    tier.popular && 'ring-2 ring-amber-500/70 dark:ring-amber-400/60',
                  )}
                >
                  <div className="flex items-center justify-between">
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
                    <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{t('per')}</span>
                    <span className={cn('ms-1 rounded-full px-2 py-0.5 text-[11px] font-medium', SOFT)}>{t('once')}</span>
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
              </Reveal>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------- faq -- */}
        <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <SectionHead eyebrow={t('faqEyebrow')} title={t('faqTitle')} />
          </Reveal>
          <div className="mt-12 space-y-4">
            {FAQ.map((item, i) => (
              <Reveal key={item.q.en} delay={i * 0.06}>
                <div className={cn(CARD, EDGE, 'p-6')}>
                  <Serif className="block text-lg text-stone-900 dark:text-white">{pick(item.q, locale)}</Serif>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-stone-600 dark:text-stone-300">{pick(item.a, locale)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------ closing band -- */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal>
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 mx-auto h-60 max-w-2xl -translate-y-1/2 rounded-full bg-amber-500/15 blur-[110px]"
              />
              <div className={cn(CARD, EDGE, 'relative flex flex-col items-center gap-6 px-6 py-14 text-center')}>
                <Eyebrow className="justify-center">{t('heroEyebrow')}</Eyebrow>
                <h2 className="max-w-2xl text-balance text-3xl tracking-tight sm:text-4xl">
                  <Serif>{t('closeTitle')}</Serif>
                </h2>
                <p className="max-w-xl text-[15px] leading-relaxed text-stone-600 dark:text-stone-300">{t('closeSub')}</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
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
                    {t('ctaPricing')}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ----------------------------------------------------------- footer -- */}
      <footer className={cn('relative z-10 border-t', RULE)}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className="hidden h-4 w-px bg-stone-300/70 dark:bg-white/15 sm:block" />
            <span>{t('footTag')}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navPricing')}</a>
            <span>© {new Date().getFullYear()} {locale === 'ar' ? 'مسار' : 'Masaar'}. {t('rights')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
