'use client';

/* =============================================================================
   Minimal dashboard D, "Dense grid". The whole product, compressed into one calm
   at a glance bento of tight tiles that fit on a single screen with almost no
   chrome. Every page of the full dashboard is represented by one small tile:
     Score (Home)  ·  Next step (Path certs)  ·  Top contact (Contacts)
     Progress (journey)  ·  Study (grad programs)  ·  Opportunities  ·  Skills
   Real live data from the plan and the shared hooks. Bilingual via locale (no
   dir flips), light and dark, amber the only accent. Never a dash in any copy.
============================================================================= */

import {
  Linkedin,
  BadgeCheck,
  TrendingUp,
  Building2,
  GraduationCap,
  CalendarDays,
  Send,
  MessageSquare,
  Sparkles,
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

/* --------------------------------------------------------------------- copy -- */

const T = {
  wordmark: { ar: 'مسار', en: 'Masaar' },
  hi: { ar: 'مرحبًا', en: 'Hi' },
  full: { ar: 'اللوحة الكاملة', en: 'Full dashboard' },
  // tiles
  score: { ar: 'تنافسية السيرة', en: 'CV competitiveness' },
  ready: { ar: 'جاهز لمستوى', en: 'Ready for' },
  building: { ar: 'تبني نحو مستوى', en: 'Building toward' },
  nextStep: { ar: 'خطوتك القادمة', en: 'Next step' },
  allDone: { ar: 'أكملت كل الشهادات', en: 'All certifications done' },
  topContact: { ar: 'تواصل اليوم', en: 'Reach today' },
  noNet: { ar: 'ارفع شبكتك لترتيب أفضل المقدمات', en: 'Upload your network to rank warm intros' },
  progress: { ar: 'تقدّمك', en: 'Your progress' },
  certs: { ar: 'شهادات', en: 'Certs' },
  sent: { ar: 'رسائل', en: 'Sent' },
  replies: { ar: 'ردود', en: 'Replies' },
  study: { ar: 'الدراسات العليا', en: 'Graduate study' },
  pioneers: { ar: 'منحة رواد', en: 'Pioneers' },
  opps: { ar: 'الفرص', en: 'Opportunities' },
  skillsTitle: { ar: 'مهارات تستحق', en: 'Skills worth building' },
};

const TIER_LABEL: Record<string, { ar: string; en: string }> = {
  high: { ar: 'عالي المستوى', en: 'Top tier' },
  respected: { ar: 'مرموقة', en: 'Respected' },
  solid: { ar: 'متينة', en: 'Solid' },
  accessible: { ar: 'في المتناول', en: 'Accessible' },
};

/* ----------------------------------------------------------------- helpers -- */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '·';
}

// Known profile, else a LinkedIn people search by name so the link always works.
function linkedinHref(name: string, url?: string): string {
  if (url) return url;
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(name)}`;
}

function ringColor(score: number): string {
  return score >= 80 ? '#16a34a' : score >= 60 ? '#D97706' : '#0284C7';
}

/* ------------------------------------------------------------------- tiles -- */

function Tile({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className={cn(CARD, EDGE, 'flex flex-col p-4', className)}
    >
      {children}
    </motion.section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-medium', SOFT)}>{children}</span>
  );
}

/* ===========================================================================
   The dashboard
=========================================================================== */

export default function MinimalD({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { level, setLevel, certsDone } = useProgress();
  const { network } = useNetwork();

  const ar = locale === 'ar';

  // active path + live score for the selected level
  const activePath = plan.primaryPath;
  const score = activePath.scoreByLevel[level];
  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? LEVELS[0].label;
  const isReady = score >= 70;

  // next certification: prefer the current one, else the first unfinished
  const nextCert =
    activePath.certs.find((c) => !certsDone[c.name.en] && c.status === 'current') ??
    activePath.certs.find((c) => !certsDone[c.name.en]);

  // top contact: rank the uploaded network (or the HR list as a stand in)
  const people = rankConnections(network ?? plan.hrContacts, planTargets(plan));
  const top = people[0];
  const usingNetwork = Boolean(network && network.length);

  // study: top graduate program for the path's first field
  const field = activePath.gradFields[0];
  const programs = gradPrograms[field] ?? [];
  const topUni = programs[0];

  // opportunities: companies in the customer's sectors + the soonest career day
  const myInd = companyIndustries.filter((ind) => plan.sectors.includes(ind.sector));
  const myIndIds = new Set(myInd.map((i) => i.id));
  const companies = companyPortals.filter((c) => myIndIds.has(c.industry)).slice(0, 5);
  const day = careerDays[0];

  // skills: a few future ready ones
  const someSkills = skills.slice(0, 5);

  const name = pick(plan.profile.name, locale);

  return (
    <div className={cn(PAGE, 'relative')}>
      <Grain />

      {/* sticky header, minimal chrome */}
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f7f6f2]/85 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0a0a0b]/85">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-baseline gap-2">
            <Serif className="text-lg leading-none">{pick(T.wordmark, locale)}</Serif>
            <span className="hidden text-[12px] text-stone-400 sm:inline">
              {pick(T.hi, locale)} {name.split(' ')[0]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/c/${plan.slug}`}
              className={cn('hidden h-9 items-center rounded-full px-3 text-[12px] font-medium transition-colors sm:inline-flex', GHOST)}
            >
              {pick(T.full, locale)}
            </Link>
            <ThemeToggle />
            <LangToggle locale={locale} />
          </div>
        </div>
      </header>

      {/* the dense bento */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1) SCORE, spans two columns */}
          <Tile className="sm:col-span-2" delay={0}>
            <div className="flex items-center justify-between">
              <Eyebrow>{pick(T.score, locale)}</Eyebrow>
              <span className={cn('truncate text-[11.5px] font-medium', ACCENT)}>
                {pick(activePath.name, locale)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <ProgressRing value={score} size={96} stroke={9} color={ringColor(score)}>
                <Serif className="text-3xl leading-none">
                  <Counter to={score} />
                </Serif>
              </ProgressRing>
              <div className="min-w-0 flex-1">
                <div className={cn('text-sm font-semibold', isReady ? ACCENT : 'text-stone-500 dark:text-stone-400')}>
                  {pick(isReady ? T.ready : T.building, locale)} {pick(levelLabel, locale)}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {LEVELS.map((l) => {
                    const on = l.id === level;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLevel(l.id)}
                        className={cn(
                          'rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors',
                          on ? PILL : cn(SOFT, 'hover:opacity-80'),
                        )}
                      >
                        {pick(l.label, locale)}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 text-[11.5px] leading-snug text-stone-500 dark:text-stone-400">
                  {pick(activePath.roles, locale)}
                </div>
              </div>
            </div>
          </Tile>

          {/* 2) NEXT STEP */}
          <Tile delay={0.04}>
            <div className="flex items-center justify-between">
              <Eyebrow>{pick(T.nextStep, locale)}</Eyebrow>
              <BadgeCheck className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
            {nextCert ? (
              <div className="mt-3 flex flex-1 flex-col">
                <Serif className="text-[15px] leading-snug">{pick(nextCert.name, locale)}</Serif>
                <div className="mt-1 text-[12px] text-stone-500 dark:text-stone-400">
                  {pick(nextCert.duration, locale)}
                </div>
                <div className="mt-auto flex items-center gap-1.5 pt-3">
                  {nextCert.hadaf ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700 dark:text-amber-300">
                      {ar ? 'هدف يعوّض ٥٠٪' : 'Hadaf covers 50%'}
                    </span>
                  ) : null}
                  <span className={cn('ms-auto text-[13px] font-semibold tabular-nums', ACCENT)}>
                    +{scaledAdd(nextCert.scoreAdd, level)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-1 items-center gap-2 text-[13px] text-stone-500 dark:text-stone-400">
                <BadgeCheck className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                {pick(T.allDone, locale)}
              </div>
            )}
          </Tile>

          {/* 3) TOP CONTACT */}
          <Tile delay={0.08}>
            <div className="flex items-center justify-between">
              <Eyebrow>{pick(T.topContact, locale)}</Eyebrow>
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
            {top ? (
              <a
                href={linkedinHref(top.contact.name.en, top.contact.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(INSET, 'mt-3 flex flex-1 items-center gap-3 p-2.5 transition-colors hover:border-amber-500/40')}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-500/15 text-[12px] font-bold text-amber-700 dark:text-amber-300">
                  {initials(top.contact.name.en)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-stone-800 dark:text-stone-100">
                    {pick(top.contact.name, locale)}
                  </div>
                  <div className="truncate text-[11.5px] text-stone-500 dark:text-stone-400">
                    {pick(top.contact.role, locale)} · {pick(top.contact.company, locale)}
                  </div>
                  <div className={cn('mt-0.5 truncate text-[10.5px] font-semibold', ACCENT)}>
                    {pick(top.reason, locale)}
                  </div>
                </div>
                <Linkedin className="h-4 w-4 shrink-0 text-stone-400" />
              </a>
            ) : (
              <div className="mt-3 flex flex-1 flex-col justify-center gap-2 text-[12.5px] text-stone-500 dark:text-stone-400">
                {pick(T.noNet, locale)}
              </div>
            )}
            {!usingNetwork && top ? (
              <div className="pt-2 text-[10.5px] text-stone-400">
                {ar ? 'من قاعدة الموارد البشرية' : 'From the HR database'}
              </div>
            ) : null}
          </Tile>

          {/* 4) PROGRESS */}
          <Tile delay={0.12}>
            <Eyebrow>{pick(T.progress, locale)}</Eyebrow>
            <div className="mt-3 grid flex-1 grid-cols-3 gap-2">
              {[
                { label: T.certs, value: plan.journey.certsDone, total: plan.journey.certsTotal },
                { label: T.sent, value: plan.journey.messagesSent, icon: Send },
                { label: T.replies, value: plan.journey.replies, icon: MessageSquare },
              ].map((m, i) => (
                <div key={i} className={cn(INSET, 'flex flex-col items-center justify-center px-1 py-2.5 text-center')}>
                  <div className="text-xl font-semibold tabular-nums text-stone-800 dark:text-stone-100">
                    <Counter to={m.value} />
                    {m.total ? <span className="text-[12px] text-stone-400">/{m.total}</span> : null}
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-stone-500 dark:text-stone-400">
                    {pick(m.label, locale)}
                  </div>
                </div>
              ))}
            </div>
          </Tile>

          {/* 5) STUDY */}
          <Tile delay={0.16}>
            <div className="flex items-center justify-between">
              <Eyebrow>{pick(T.study, locale)}</Eyebrow>
              <GraduationCap className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
            {topUni ? (
              <a
                href={topUni.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex flex-1 flex-col"
              >
                <Serif className="text-[15px] leading-snug">{pick(topUni.uni, locale)}</Serif>
                <div className="text-[12px] text-stone-500 dark:text-stone-400">
                  {pick(topUni.program, locale)}
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3">
                  <Chip>{pick(TIER_LABEL[topUni.tier] ?? TIER_LABEL.solid, locale)}</Chip>
                  {topUni.top30 ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10.5px] font-semibold text-amber-700 dark:text-amber-300">
                      {pick(T.pioneers, locale)}
                    </span>
                  ) : null}
                </div>
              </a>
            ) : null}
          </Tile>

          {/* 6) OPPORTUNITIES */}
          <Tile delay={0.2}>
            <div className="flex items-center justify-between">
              <Eyebrow>{pick(T.opps, locale)}</Eyebrow>
              <Building2 className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {companies.map((c) => (
                <a
                  key={c.name.en}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors', SOFT, 'hover:text-amber-700 dark:hover:text-amber-300')}
                >
                  {pick(c.name, locale)}
                </a>
              ))}
            </div>
            {day ? (
              <a
                href={day.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(INSET, 'mt-auto flex items-center gap-2.5 p-2.5 transition-colors hover:border-amber-500/40')}
              >
                <CalendarDays className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
                <span className="truncate text-[12.5px] text-stone-700 dark:text-stone-200">
                  {pick(day.title, locale)}
                </span>
                <span className="ms-auto shrink-0 text-[11px] text-stone-400">
                  {pick(day.when, locale)} · {pick(day.city, locale)}
                </span>
              </a>
            ) : null}
          </Tile>

          {/* 7) SKILLS */}
          <Tile delay={0.24}>
            <div className="flex items-center justify-between">
              <Eyebrow>{pick(T.skillsTitle, locale)}</Eyebrow>
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {someSkills.map((s) => (
                <a
                  key={s.name.en}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors', SOFT, 'hover:text-amber-700 dark:hover:text-amber-300')}
                >
                  {pick(s.name, locale)}
                </a>
              ))}
            </div>
          </Tile>
        </div>
      </main>
    </div>
  );
}
