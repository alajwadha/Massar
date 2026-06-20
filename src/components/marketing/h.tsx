'use client';

/* =============================================================================
   Landing version H, "Question led".
   The page is built around the customer's real questions, each set as a big serif
   question, then answered with a short, warm, honest block and, where it fits, the
   matching product preview. Saudi voice, empathetic and direct. Covers graduates,
   career switchers, and people going for a promotion. Light and dark, Arabic first.
   On mobile the question text always comes before its preview card.
============================================================================= */

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
  ScoreCard,
  PathsCard,
  ContactsCard,
  StudyCard,
  OpportunitiesCard,
  TARGET_COMPANIES,
  PRICING,
  pick,
  type Loc,
} from '@/components/marketing/shared';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

/* ------------------------------------------------------------------- copy -- */

const T = {
  navWork: { ar: 'كيف يعمل', en: 'How it works' },
  navPlan: { ar: 'الخطة', en: 'The plan' },
  navPricing: { ar: 'السعر', en: 'Pricing' },
  cta: { ar: 'ابدأ الآن', en: 'Get started' },
  ctaPricing: { ar: 'شوف الأسعار', en: 'See pricing' },

  kicker: { ar: 'مسار · مصمم لسوق العمل السعودي', en: 'Masaar · built for the Saudi job market' },
  heroTitle: { ar: 'خريج، تبي تغير مجالك، أو تستهدف ترقية؟', en: 'A graduate, switching fields, or going for a promotion?' },
  heroLede: {
    ar: 'خلنا نجاوب على الأسئلة اللي تشغل بالك ونساعدك تحقق أهدافك.',
    en: 'Let us answer the questions on your mind, and help you reach your goals.',
  },

  // Q1 competitive
  q1: { ar: 'وش وضعي التنافسي بالضبط؟', en: 'Where do I actually stand?' },
  q1body: {
    ar: 'نقرأ سيرتك ونعطيك درجة صريحة من 100 لكل دور ولكل مستوى من المبتدئ للقيادي. ما نبالغ فيها عشان تثق فيها وتوريك بالضبط وش يرفعها وكم. ما فيه مجاملة بس صورة صادقة تنطلق منها.',
    en: 'We read your CV and give you an honest score out of 100 for each role and level, from Entry to Director. We never inflate it, so you can trust it, and it shows exactly what raises it and by how much. No flattery, just an honest starting point.',
  },
  q1note: { ar: 'نوريك مكانك بصدق عشان تبني على أساس صحيح.', en: 'We show you where you really stand, so you build on solid ground.' },

  // Q2 contact
  q2: { ar: 'مين أتواصل معهم؟ وكيف؟ وش أقول؟', en: 'Who do I reach, how, and what do I say?' },
  q2body: {
    ar: 'نرتب لك جهات اتصالك من لينكدإن ونطلع أقرب الناس لأهدافك ومع كل واحد رابط مباشر لحسابه ورسالة جاهزة تنسخها. كل اللي نحتاجه ملف جهات اتصالك من لينكدإن ونوريك كيف تطلعه خطوة بخطوة ويجيك خلال 12 إلى 24 ساعة. ونوصلك كمان بمسؤولي التوظيف المناسبين لمجالك.',
    en: 'We rank your LinkedIn connections and surface the people closest to your goals, each with a direct link to their profile and a ready message you copy. All we need is your LinkedIn connections file, we show you step by step how to export it, and it reaches you within 12 to 24 hours. We also connect you to the right recruiters for your field.',
  },
  q2note: { ar: 'رسائل مصممة لك وجاهزة تنسخها. بس خذ فكرتها والأفضل تكتبها بأسلوبك.', en: 'Messages are designed for you and ready to copy. But take the idea, and it is best to rewrite them in your own words.' },

  // Q3 online applications
  q3: { ar: 'هل التقديم أونلاين يفيد أصلًا؟', en: 'Does applying online even work?' },
  q3body: {
    ar: 'غالبًا لا. أغلب الوظائف تروح عن طريق المعارف والترشيح قبل لا تتنشر أصلًا واللي يتنشر تتفلتر سيرته آليًا قبل لا توصل لإنسان. عشان كذا نقلبها بالعكس نوصلك بالناس أول فتصير اسم معروف مو مجرد سيرة وسط آلاف الطلبات.',
    en: 'Usually not. Most jobs go through people and referrals before they are ever posted, and what is posted gets auto filtered before a human sees it. So we flip it: we connect you to people first, so you become a known name, not one CV among thousands.',
  },

  // Q4 plan
  q4: { ar: 'وش خطتي وكيف أطور نفسي وأكون مرشح أقوى أو أترقى؟', en: 'What is my plan to grow into a stronger candidate, or a promotion?' },
  q4body: {
    ar: 'من خلفيتك نرسم لك مسارات مهنية تناسبك ولكل مسار خارطة شهادات مرتبة حسب الأثر مع الوقت المتوقع لكل شهادة ورابط مباشر لموقعها الرسمي. ونوضح أي شهادة يعوض صندوق هدف نحو 50% من تكلفتها عشان تحط وقتك وفلوسك في اللي يفرق فعلًا.',
    en: 'From your background we map career paths that fit you, each with a certifications roadmap ordered by impact, the expected time for each, and a direct link to its official site. We flag which ones the Hadaf fund reimburses about 50% of, so you invest your time and money where it counts.',
  },
  q4note: { ar: 'علينا التخطيط وعليك التنفيذ.', en: 'The planning is on us, the doing is on you.' },

  // Q5 study (Pro)
  q5: { ar: 'وإذا حبيت أكمل دراستي؟', en: 'What if I want to study further?' },
  q5body: {
    ar: 'برامج دراسات عليا حسب تخصصك وأهليتك للابتعاث ومنه منحة رواد لأفضل 30 جامعة وخيارات الدوام الجزئي داخل السعودية والمواعيد النهائية وروابط البرامج مباشرة.',
    en: 'Graduate programs by field, your eligibility for scholarships including Pioneers for the top 30 universities, part time options inside Saudi, deadlines, and direct links to the programs.',
  },

  // Q6 resources (Pro)
  q6: { ar: 'وش غير يسهل علي الطريق؟', en: 'What else makes this easier for me?' },
  q6body: {
    ar: 'جهزنا لك مصادر تختصر عليك الطريق: بوابات التوظيف وصفحات الشركات السعودية حسب القطاع وأيام مهنية بمواعيدها ومهارات مطلوبة تتعلمها وأدلة لكتابة سيرتك واجتياز المقابلات وبرامج وطنية مثل تمهير.',
    en: 'We line up resources that shorten the road: Saudi job portals and company pages by sector, dated career days, in demand skills to learn, guides for your CV and interviews, and national programs like Tamheer.',
  },

  // Q7 pricing
  q7: { ar: 'وكم بيكلفني هذا؟', en: 'And what will this cost me?' },
  q7body: {
    ar: 'دفعة وحدة وبس بدون اشتراك. الأساسية 199 ريال والاحترافية 350 ريال. وبعدها نبدأ نجهز لك موقعك الخاص بأقرب وقت وتقدر تضيفه على شاشة جوالك وتفتحه بضغطة وحدة.',
    en: 'One payment, no subscription. Starter is 199 SAR, Pro is 350 SAR. Then we start preparing your own private site right away, and you can add it to your phone home screen and open it with one tap.',
  },
  oneTime: { ar: 'مرة وحدة', en: 'one time' },
  most: { ar: 'الأكثر اختيارًا', en: 'Most chosen' },
  choose: { ar: 'اختر', en: 'Choose' },

  trustedBy: { ar: 'ناس يطمحون لوظائف في', en: 'People aiming for roles at' },

  closeTitle: { ar: 'وش نحتاج عشان نصمم لك كل هذا؟', en: 'What do we need to build all this for you?' },
  closeBody: {
    ar: 'ارفع سيرتك لنا وخل باقي الشغل علينا وأبشر بالخير.',
    en: 'Upload your CV as it is today, leave the rest to us, and expect good things.',
  },
  closeValues: {
    ar: 'يهمنا مستقبلك. علينا وعليك العمل بالأسباب والتوفيق من الله.',
    en: 'Your future matters to us. We each do our part, and success is from God.',
  },
  footMade: { ar: 'عربي أول وثنائي اللغة بالكامل.', en: 'Arabic first, fully bilingual.' },
  footRights: { ar: 'مسار. جميع الحقوق محفوظة.', en: 'Masaar. All rights reserved.' },
} as const;

const RULE = 'border-stone-200/70 dark:border-white/10';

/* --------------------------------------------------------------- helpers -- */

function Fade({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-90px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A small index badge that prefixes each question, keeping the rhythm calm. */
function Ask({ n }: { n: string }) {
  return (
    <span className={cn('inline-grid h-9 w-9 place-items-center rounded-full text-[13px] font-semibold tabular-nums', SOFT)}>
      {n}
    </span>
  );
}

/** A small Pro tag for features that live in the Pro plan. */
function Pro() {
  return (
    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
      Pro
    </span>
  );
}

/** A short reassuring footnote under an answer, amber bordered. */
function Reassure({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex items-start gap-2.5 border-s-2 border-amber-500/60 ps-3.5">
      <ShieldCheck className={cn('mt-0.5 h-4 w-4 shrink-0', ACCENT)} />
      <Serif className="text-[15px] italic leading-relaxed text-stone-600 dark:text-stone-300">{children}</Serif>
    </div>
  );
}

/* ---------------------------------------------------------------- page -- */

export default function MarketingH({ locale }: { locale: Loc }) {
  const t = (k: keyof typeof T) => pick(T[k], locale);

  return (
    <div className={cn(PAGE, 'relative overflow-clip')}>
      <Grain />

      {/* ambient liquid glass wash, gives the frosted cards something to refract */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -start-24 -top-24 h-[30rem] w-[30rem] rounded-full bg-amber-300/25 blur-[120px] dark:bg-amber-500/[0.12]" />
        <div className="absolute -end-28 top-1/3 h-[32rem] w-[32rem] rounded-full bg-orange-200/25 blur-[130px] dark:bg-amber-600/[0.10]" />
        <div className="absolute bottom-0 start-1/3 h-[28rem] w-[28rem] rounded-full bg-rose-200/20 blur-[130px] dark:bg-indigo-500/[0.10]" />
      </div>

      {/* ---------------------------------------------------------- header -- */}
      <header className={cn('sticky top-0 z-40 border-b bg-[#f7f6f2]/80 backdrop-blur-md dark:bg-[#0a0a0b]/80', RULE)}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-2xl tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] text-stone-500 dark:text-stone-400 md:flex">
            <a href="#how" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navWork')}</a>
            <a href="#plan" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navPlan')}</a>
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('navPricing')}</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle locale={locale} />
            <Link
              href={{ pathname: '/checkout', query: { plan: 'pro' } }}
              className={cn('inline-flex rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors', PILL)}
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">

        {/* -------------------------------------------------------- hero -- */}
        <section className="border-b py-16 text-center sm:py-24">
          <Fade>
            <Eyebrow className="justify-center">{t('kicker')}</Eyebrow>
            <h1 className="mx-auto mt-6 max-w-3xl">
              <Serif className="block text-[2rem] leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">{t('heroTitle')}</Serif>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('heroLede')}</p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors', PILL)}
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
              </Link>
              <a
                href="#pricing"
                className={cn('inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors', GHOST)}
              >
                {t('ctaPricing')}
              </a>
            </div>
          </Fade>
        </section>

        {/* ---------------------------------- Q1 competitive (ScoreCard) -- */}
        <section id="how" className="scroll-mt-24 border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade>
              <div className="flex items-center gap-3">
                <Ask n="01" />
                <Serif className="text-2xl leading-[1.15] tracking-tight sm:text-4xl">{t('q1')}</Serif>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q1body')}</p>
              <Reassure>{t('q1note')}</Reassure>
            </Fade>
            <Fade delay={0.1}>
              <ScoreCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* ------------------------------------ Q2 who to contact (ContactsCard) -- */}
        <section className="border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade className="lg:order-2">
              <div className="flex items-center gap-3">
                <Ask n="02" />
                <Serif className="text-2xl leading-[1.15] tracking-tight sm:text-4xl">{t('q2')}</Serif>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q2body')}</p>
              <Reassure>{t('q2note')}</Reassure>
            </Fade>
            <Fade delay={0.1} className="lg:order-1">
              <ContactsCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* ----------------------------- Q3 does online apply work (copy only) -- */}
        <section className="border-b py-16 sm:py-20">
          <Fade>
            <div className="flex items-center gap-3">
              <Ask n="03" />
              <Serif className="text-2xl leading-[1.15] tracking-tight sm:text-4xl">{t('q3')}</Serif>
            </div>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q3body')}</p>
          </Fade>
        </section>

        {/* ----------------------------------------- Q4 my plan (PathsCard) -- */}
        <section id="plan" className="scroll-mt-24 border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade>
              <div className="flex items-center gap-3">
                <Ask n="04" />
                <Serif className="text-2xl leading-[1.15] tracking-tight sm:text-4xl">{t('q4')}</Serif>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q4body')}</p>
              <Reassure>{t('q4note')}</Reassure>
            </Fade>
            <Fade delay={0.1}>
              <PathsCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* --------------------------------------- Q5 study (StudyCard, Pro) -- */}
        <section className="border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade className="lg:order-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Ask n="05" />
                <Serif className="text-2xl leading-[1.15] tracking-tight sm:text-4xl">{t('q5')}</Serif>
                <Pro />
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q5body')}</p>
            </Fade>
            <Fade delay={0.1} className="lg:order-1">
              <StudyCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* --------------------------------- Q6 resources (OpportunitiesCard, Pro) -- */}
        <section className="border-b py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Fade>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <Ask n="06" />
                <Serif className="text-2xl leading-[1.15] tracking-tight sm:text-4xl">{t('q6')}</Serif>
                <Pro />
              </div>
              <p className="mt-6 text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q6body')}</p>
            </Fade>
            <Fade delay={0.1}>
              <OpportunitiesCard locale={locale} />
            </Fade>
          </div>
        </section>

        {/* ----------------------------------------------- Q7 pricing -- */}
        <section id="pricing" className="scroll-mt-24 border-b py-16 sm:py-20">
          <Fade>
            <div className="flex items-center gap-3">
              <Ask n="07" />
              <Serif className="text-2xl leading-[1.15] tracking-tight sm:text-4xl">{t('q7')}</Serif>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('q7body')}</p>
          </Fade>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {PRICING.map((tier, i) => (
              <Fade key={tier.id} delay={0.05 * i}>
                <div className={cn(CARD, 'flex h-full flex-col p-7')}>
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
                    <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
                  </Link>
                </div>
              </Fade>
            ))}
          </div>
        </section>

        {/* ----------------------------------------- social proof + close -- */}
        <section className="py-20 text-center sm:py-28">
          <Fade>
            <Eyebrow className="justify-center">{t('trustedBy')}</Eyebrow>
            <div className="mx-auto mt-5 flex max-w-2xl flex-wrap justify-center gap-1.5">
              {TARGET_COMPANIES.map((c) => (
                <span key={c} className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>{c}</span>
              ))}
            </div>
            <Serif className="mx-auto mt-10 block max-w-3xl text-[2rem] leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
              {t('closeTitle')}
            </Serif>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">{t('closeBody')}</p>
            <Serif className="mx-auto mt-5 block max-w-xl text-[17px] italic leading-relaxed text-amber-700 dark:text-amber-300">{t('closeValues')}</Serif>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={{ pathname: '/checkout', query: { plan: 'pro' } }}
                className={cn('inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors', PILL)}
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg]" />
              </Link>
              <a
                href="#pricing"
                className={cn('inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition-colors', GHOST)}
              >
                {t('ctaPricing')}
              </a>
            </div>
          </Fade>
        </section>
      </main>

      {/* ---------------------------------------------------------- footer -- */}
      <footer className={cn('relative z-10 border-t', RULE)}>
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-stone-500 dark:text-stone-400 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <Serif className="text-xl">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className="hidden h-4 w-px bg-stone-300/70 dark:bg-white/15 sm:block" />
            <span>{t('footMade')}</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#pricing" className="transition-colors hover:text-stone-900 dark:hover:text-white">{t('ctaPricing')}</a>
            <span>© {new Date().getFullYear()} {t('footRights')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
