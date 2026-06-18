'use client';

/* =============================================================================
   Minimal E, "Focus mode". One thing at a time.

   A single calm focus area in the centre shows ONE section at a time, while a
   tiny switcher (a left rail on desktop, a chip row on mobile) flips the focus
   between Score, Next step, People, Study and Opportunities, so every page is
   still reachable. Local state holds the focus; the focus change is animated
   with AnimatePresence. Default focus is the CV score.

   Fully functional: level pills call setLevel and move the score live, the path
   chips switch the active path through the same shared state the real dashboard
   uses, and every contact and apply link works.
============================================================================= */

import { useState } from 'react';
import {
  Gauge,
  Compass,
  Users,
  GraduationCap,
  Sparkles,
  Building2,
  CalendarDays,
  BadgeCheck,
  ArrowUpRight,
  TrendingUp,
  Linkedin,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  pick,
  type Loc,
} from '@/components/marketing/shared';
import { usePlan } from '@/components/app/plan-context';
import { useProgress, useNetwork } from '@/components/app/dashboard-state';
import { ProgressRing, Counter } from '@/components/app/ui';
import {
  rankConnections,
  planTargets,
  scaledAdd,
  LEVELS,
  gradPrograms,
  companyPortals,
  companyIndustries,
  careerDays,
  skills,
} from '@/lib/app-data';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

/* ----------------------------------------------------------------- focuses -- */

type FocusId = 'score' | 'next' | 'people' | 'study' | 'opportunities';

const FOCUSES: { id: FocusId; icon: typeof Gauge; label: { ar: string; en: string } }[] = [
  { id: 'score', icon: Gauge, label: { ar: 'الدرجة', en: 'Score' } },
  { id: 'next', icon: Compass, label: { ar: 'الخطوة القادمة', en: 'Next step' } },
  { id: 'people', icon: Users, label: { ar: 'الأشخاص', en: 'People' } },
  { id: 'study', icon: GraduationCap, label: { ar: 'الدراسة', en: 'Study' } },
  { id: 'opportunities', icon: Sparkles, label: { ar: 'الفرص', en: 'Opportunities' } },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '•';

/* ================================================================== shell == */

export default function MinimalE({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { level, setLevel, certsDone, activePathId, setActivePath } = useProgress();
  const { network } = useNetwork();
  const [focus, setFocus] = useState<FocusId>('score');

  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;
  const score = activePath.scoreByLevel[level];

  return (
    <div className={cn(PAGE, 'relative')}>
      <Grain />

      {/* compact sticky header */}
      <header className="sticky top-0 z-30 border-b border-stone-200/60 bg-[#f7f6f2]/80 backdrop-blur-md dark:border-white/[0.06] dark:bg-[#0a0a0b]/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-baseline gap-2">
            <Serif className="text-lg tracking-tight">{locale === 'ar' ? 'مسار' : 'Masaar'}</Serif>
            <span className={cn('hidden text-[10px] font-semibold uppercase tracking-[0.22em] sm:inline', ACCENT)}>
              {locale === 'ar' ? 'وضع التركيز' : 'Focus'}
            </span>
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <LangToggle locale={locale} />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {/* greeting */}
        <div className="mb-5 sm:mb-8">
          <Eyebrow>{locale === 'ar' ? 'لوحتك' : 'Your dashboard'}</Eyebrow>
          <h1 className="mt-1.5 text-balance">
            <Serif className="text-2xl leading-tight sm:text-[28px]">
              {locale === 'ar' ? 'ركّز على شيء واحد، ' : 'One thing at a time, '}
              {pick(plan.profile.name, locale).split(' ')[0]}
            </Serif>
          </h1>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* switcher: chip row on mobile, left rail on desktop */}
          <FocusSwitcher locale={locale} focus={focus} setFocus={setFocus} />

          {/* the one calm focus area */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={focus}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {focus === 'score' && (
                  <ScoreFocus
                    locale={locale}
                    plan={plan}
                    activePath={activePath}
                    score={score}
                    level={level}
                    setLevel={setLevel}
                    setActivePath={setActivePath}
                  />
                )}
                {focus === 'next' && (
                  <NextFocus locale={locale} activePath={activePath} certsDone={certsDone} level={level} setFocus={setFocus} />
                )}
                {focus === 'people' && <PeopleFocus locale={locale} plan={plan} network={network} />}
                {focus === 'study' && <StudyFocus locale={locale} activePath={activePath} />}
                {focus === 'opportunities' && <OpportunitiesFocus locale={locale} plan={plan} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================== switcher == */

function FocusSwitcher({
  locale,
  focus,
  setFocus,
}: {
  locale: Loc;
  focus: FocusId;
  setFocus: (f: FocusId) => void;
}) {
  return (
    <nav
      aria-label={locale === 'ar' ? 'التنقل' : 'Focus'}
      className="flex shrink-0 gap-1.5 overflow-x-auto pb-1 sm:w-44 sm:flex-col sm:gap-1 sm:overflow-visible sm:pb-0"
    >
      {FOCUSES.map((f) => {
        const on = focus === f.id;
        const Icon = f.icon;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => setFocus(f.id)}
            aria-current={on ? 'true' : undefined}
            className={cn(
              'group relative flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium transition-colors sm:rounded-xl sm:px-3 sm:py-2.5',
              on ? PILL : GHOST,
            )}
          >
            {on && (
              <motion.span
                layoutId="focus-rail"
                transition={SPRING}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full bg-stone-900 dark:bg-stone-100 sm:rounded-xl"
              />
            )}
            <Icon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{pick(f.label, locale)}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ================================================================ score == */

function ScoreFocus({
  locale,
  plan,
  activePath,
  score,
  level,
  setLevel,
  setActivePath,
}: {
  locale: Loc;
  plan: ReturnType<typeof usePlan>;
  activePath: ReturnType<typeof usePlan>['primaryPath'];
  score: number;
  level: (typeof LEVELS)[number]['id'];
  setLevel: (l: (typeof LEVELS)[number]['id']) => void;
  setActivePath: (id: string) => void;
}) {
  const ready = score >= 75;
  const ringColor = score >= 80 ? '#d97706' : score >= 60 ? '#d97706' : '#a16207';
  const levelLabel = LEVELS.find((l) => l.id === level)?.label;

  return (
    <div className={cn(CARD, EDGE, 'p-6 sm:p-8')}>
      <Eyebrow>{locale === 'ar' ? 'تنافسية السيرة' : 'CV competitiveness'}</Eyebrow>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <ProgressRing value={score} size={150} stroke={12} color={ringColor} track="rgba(120,113,108,0.16)">
          <div className="leading-none">
            <Counter to={score} className="font-serif text-4xl font-normal" />
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-stone-400">{locale === 'ar' ? 'من 100' : 'of 100'}</div>
          </div>
        </ProgressRing>

        <div className="min-w-0 flex-1 text-center sm:text-start">
          <div className="text-sm text-stone-500 dark:text-stone-400">{pick(activePath.name, locale)}</div>
          <div className={cn('mt-1 text-base font-semibold', ACCENT)}>
            {ready
              ? locale === 'ar'
                ? `جاهز لمستوى ${pick(levelLabel!, locale)}`
                : `Ready for ${pick(levelLabel!, locale)} level`
              : locale === 'ar'
                ? `تبني نحو مستوى ${pick(levelLabel!, locale)}`
                : `Building toward ${pick(levelLabel!, locale)} level`}
          </div>

          {/* level pills, live */}
          <div className="mt-4 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {LEVELS.map((lv) => (
              <button
                key={lv.id}
                type="button"
                onClick={() => setLevel(lv.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-[12px] font-medium transition-colors',
                  level === lv.id ? PILL : SOFT,
                )}
              >
                {pick(lv.label, locale)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* readiness line */}
      <div className={cn(INSET, 'mt-6 flex items-center gap-3 px-4 py-3')}>
        <TrendingUp className={cn('h-4 w-4 shrink-0', ACCENT)} />
        <p className="text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">
          {locale === 'ar'
            ? 'الدرجة تتغيّر مع المستوى الذي تستهدفه. اختر مسارًا أدناه وشاهد تنافسيتك تتحرّك.'
            : 'Your score moves with the level you aim at. Pick a path below and watch your readiness shift.'}
        </p>
      </div>

      {/* path switcher, drives the shared active path */}
      <div className="mt-5">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
          {locale === 'ar' ? 'مسارك المهني' : 'Your career path'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {plan.paths.map((p) => {
            const on = p.id === activePath.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePath(p.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors',
                  on ? cn('bg-amber-500/15', ACCENT) : SOFT,
                )}
              >
                {pick(p.name, locale)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================================================================= next == */

function NextFocus({
  locale,
  activePath,
  certsDone,
  level,
  setFocus,
}: {
  locale: Loc;
  activePath: ReturnType<typeof usePlan>['primaryPath'];
  certsDone: Record<string, boolean>;
  level: (typeof LEVELS)[number]['id'];
  setFocus: (f: FocusId) => void;
}) {
  const nextCert =
    activePath.certs.find((c) => !certsDone[c.name.en] && c.status === 'current') ??
    activePath.certs.find((c) => !certsDone[c.name.en]);

  const total = activePath.certs.length;
  const done = activePath.certs.filter((c) => certsDone[c.name.en]).length;

  if (!nextCert) {
    return (
      <div className={cn(CARD, EDGE, 'flex flex-col items-center gap-3 p-8 text-center sm:p-10')}>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <BadgeCheck className="h-6 w-6" />
        </span>
        <Serif className="text-xl">{locale === 'ar' ? 'أكملت كل الشهادات' : 'Every certificate is done'}</Serif>
        <p className="max-w-sm text-[13px] text-stone-500 dark:text-stone-400">
          {locale === 'ar'
            ? 'لا خطوة تالية في هذا المسار. ركّز على الأشخاص والفرص.'
            : 'No next step on this path. Turn your focus to people and opportunities.'}
        </p>
        <button type="button" onClick={() => setFocus('people')} className={cn('mt-1 rounded-full px-4 py-2 text-[13px] font-medium', PILL)}>
          {locale === 'ar' ? 'إلى الأشخاص' : 'Go to people'}
        </button>
      </div>
    );
  }

  const add = scaledAdd(nextCert.scoreAdd, level);

  return (
    <div className={cn(CARD, EDGE, 'p-6 sm:p-8')}>
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>{locale === 'ar' ? 'خطوتك القادمة' : 'Your next step'}</Eyebrow>
        <span className="text-[11px] font-medium tabular-nums text-stone-400">
          {done}/{total} {locale === 'ar' ? 'منجزة' : 'done'}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <GraduationCap className="h-7 w-7" />
        </span>
        <div className="min-w-0 flex-1">
          <Serif className="text-2xl leading-tight">{pick(nextCert.name, locale)}</Serif>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-stone-500 dark:text-stone-400">
            <span>{pick(nextCert.duration, locale)}</span>
            <span aria-hidden className="text-stone-300 dark:text-stone-600">·</span>
            <span>{pick(nextCert.cost, locale)}</span>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-1 text-sm font-semibold tabular-nums text-amber-700 dark:text-amber-300">
          +{add}
        </span>
      </div>

      {nextCert.hadaf && (
        <div className={cn(INSET, 'mt-4 flex items-center gap-2.5 px-3.5 py-2.5')}>
          <BadgeCheck className={cn('h-4 w-4 shrink-0', ACCENT)} />
          <span className="text-[13px] font-medium text-stone-700 dark:text-stone-200">
            {nextCert.hadafNote ? pick(nextCert.hadafNote, locale) : locale === 'ar' ? 'مدعومة من صندوق هدف' : 'Supported by Hadaf'}
          </span>
        </div>
      )}

      <p className="mt-4 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">
        {pick(nextCert.why ?? nextCert.desc, locale)}
      </p>

      {nextCert.opens && nextCert.opens.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            {locale === 'ar' ? 'يفتح لك' : 'Opens for you'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {nextCert.opens.map((o, i) => (
              <span key={i} className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>
                {pick(o, locale)}
              </span>
            ))}
          </div>
        </div>
      )}

      <a
        href={nextCert.official}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium', PILL)}
      >
        {locale === 'ar' ? 'ابدأ الشهادة' : 'Start this'}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* =============================================================== people == */

function PeopleFocus({
  locale,
  plan,
  network,
}: {
  locale: Loc;
  plan: ReturnType<typeof usePlan>;
  network: ReturnType<typeof useNetwork>['network'];
}) {
  // The customer's ranked network when uploaded, else our retrieved HR list.
  const source = network ?? plan.hrContacts;
  const fromNetwork = !!network;
  const people = rankConnections(source, planTargets(plan)).slice(0, 3);

  return (
    <div className={cn(CARD, EDGE, 'p-6 sm:p-8')}>
      <Eyebrow>{locale === 'ar' ? 'مع من تتواصل' : 'Who to reach'}</Eyebrow>
      <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        {fromNetwork
          ? locale === 'ar'
            ? 'أقرب 3 جهات من شبكتك'
            : 'Your 3 warmest connections'
          : locale === 'ar'
            ? 'أقرب 3 جهات من قاعدة الموارد البشرية'
            : 'Top 3 from our HR database'}
      </div>

      {people.length > 0 ? (
        <div className="mt-5 space-y-2.5">
          {people.map(({ contact, reason }) => {
            const name = pick(contact.name, locale);
            const href =
              contact.linkedin ??
              `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${contact.name.en} ${contact.company.en}`)}`;
            return (
              <a
                key={contact.id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(INSET, 'flex items-center gap-3 p-3 transition-colors hover:border-amber-500/40')}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-500/15 text-[12px] font-semibold text-amber-700 dark:text-amber-300">
                  {initials(contact.name.en || name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{name}</div>
                  <div className="truncate text-[12px] text-stone-500 dark:text-stone-400">
                    {[pick(contact.role, locale), pick(contact.company, locale)].filter(Boolean).join(locale === 'ar' ? ' · ' : ' · ')}
                  </div>
                  <div className={cn('mt-0.5 text-[11px] font-semibold', ACCENT)}>{pick(reason, locale)}</div>
                </div>
                <Linkedin className="h-4 w-4 shrink-0 text-stone-400" />
              </a>
            );
          })}
        </div>
      ) : (
        <div className={cn(INSET, 'mt-5 px-4 py-6 text-center')}>
          <p className="text-[13px] text-stone-500 dark:text-stone-400">
            {locale === 'ar'
              ? 'ارفع ملف Connections.csv من لينكدإن لترتيب أقرب جهاتك.'
              : 'Upload your LinkedIn Connections.csv to rank your warmest intros.'}
          </p>
        </div>
      )}
    </div>
  );
}

/* ================================================================ study == */

function StudyFocus({ locale, activePath }: { locale: Loc; activePath: ReturnType<typeof usePlan>['primaryPath'] }) {
  const field = activePath.gradFields[0];
  const programs = (gradPrograms[field] ?? []).slice(0, 2);

  return (
    <div className={cn(CARD, EDGE, 'p-6 sm:p-8')}>
      <Eyebrow>{locale === 'ar' ? 'الدراسات العليا' : 'Graduate study'}</Eyebrow>
      <div className="mt-1 text-sm text-stone-500 dark:text-stone-400">
        {locale === 'ar' ? 'برنامجان يناسبان مسارك' : 'Two programs that fit your path'}
      </div>

      <div className="mt-5 space-y-3">
        {programs.map((p, i) => (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(INSET, 'block p-4 transition-colors hover:border-amber-500/40')}
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <Serif className="text-lg leading-tight">{pick(p.uni, locale)}</Serif>
                <div className="mt-0.5 text-[13px] text-stone-500 dark:text-stone-400">{pick(p.program, locale)}</div>
                <div className="mt-1 flex items-center gap-1 text-[12px] text-stone-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {pick(p.location, locale)}
                </div>
                {p.top30 && (
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                    <BadgeCheck className="h-3 w-3" />
                    {locale === 'ar' ? 'ضمن أفضل 30 · مؤهّل لمنحة رواد' : 'Top 30 · Pioneers eligible'}
                  </span>
                )}
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-400" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ======================================================== opportunities == */

function OpportunitiesFocus({ locale, plan }: { locale: Loc; plan: ReturnType<typeof usePlan> }) {
  // Companies whose industry sits in the customer's CV-derived sectors.
  const matchedInds = companyIndustries.filter((ind) => plan.sectors.includes(ind.sector));
  const indIds = new Set(matchedInds.map((ind) => ind.id));
  const companies = companyPortals.filter((c) => indIds.has(c.industry)).slice(0, 8);
  const day = careerDays[0];
  const topSkills = skills.slice(0, 6);

  return (
    <div className={cn(CARD, EDGE, 'p-6 sm:p-8')}>
      <Eyebrow>{locale === 'ar' ? 'الفرص' : 'Opportunities'}</Eyebrow>

      {/* companies */}
      <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        {locale === 'ar' ? 'صفحات التوظيف' : 'Company career pages'}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {companies.map((c, i) => (
          <a
            key={i}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-amber-500/15 hover:text-amber-700 dark:hover:text-amber-300',
              SOFT,
            )}
          >
            <Building2 className="h-3 w-3 shrink-0 opacity-60" />
            {pick(c.name, locale)}
          </a>
        ))}
      </div>

      {/* career day */}
      {day && (
        <a
          href={day.link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(INSET, 'mt-4 flex items-center gap-3 p-3 transition-colors hover:border-amber-500/40')}
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">{pick(day.title, locale)}</div>
            <div className="truncate text-[12px] text-stone-500 dark:text-stone-400">
              {pick(day.when, locale)} · {pick(day.city, locale)}
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-400" />
        </a>
      )}

      {/* skills */}
      <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
        {locale === 'ar' ? 'مهارات تستحق الصقل' : 'Skills worth sharpening'}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {topSkills.map((s, i) => (
          <span key={i} className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', SOFT)}>
            {pick(s.name, locale)}
          </span>
        ))}
      </div>
    </div>
  );
}
