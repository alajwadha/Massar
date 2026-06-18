'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Users,
  Activity,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  Shuffle,
  Linkedin,
  Languages,
  PenLine,
  User,
  Network,
  Upload,
  X,
  Search,
  ExternalLink,
  BadgeCheck,
  ArrowLeft,
  Building2,
  TrendingUp,
  ChevronDown,
  CornerDownLeft,
  GraduationCap,
  CalendarDays,
  Globe,
  FileText,
  MessageCircle,
  Gift,
  Send,
  Star,
  Sliders,
  KeyRound,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import { usePlan } from '@/components/app/plan-context';
import { DashboardState, useNetwork, useProgress } from '@/components/app/dashboard-state';
import { ProgressRing, Counter, Avatar } from '@/components/app/ui';
import {
  rankConnections,
  planTargets,
  dailyPicks,
  fillTemplate,
  linkedinUrl,
  scaledAdd,
  referralLink,
  LEVELS,
  SECTOR_LABELS,
  TIER_LABELS,
  TIER_CAP,
  TIER_PATHS,
  tamheer,
  careerDays,
  gradPrograms,
  fieldMajors,
  partTimeSaudi,
  skills,
  nationalPortals,
  companyPortals,
  companyIndustries,
  cvGuide,
  interviewTips,
  ui,
  type Contact,
  type ContactStatus,
  type CompanyTier,
  type Loc,
  type Level,
  type PickKind,
  type CareerPath,
  type FieldTag,
  type GradProgram,
  type CompanySize,
} from '@/lib/app-data';

/* =============================================================================
   v4 "Atlas", an editorial bento dashboard. Warm paper / crisp near-black with
   SOLID elevated cards (the dark theme reworked for contrast), a single rationed
   gold accent, an Instrument-Serif display face, a masked grid + film grain,
   spring motion with layoutId morphs, a ⌘K palette, and a فرص/Opportunities hub.
   Fully responsive down to phone widths. Reuses the shared data/state layer.
============================================================================= */

const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
type Tab = 'home' | 'paths' | 'contacts' | 'tracker' | 'opportunities';

// Shared class tokens keep light + dark in lockstep. Dark uses SOLID elevated
// surfaces (#161619 on a #0a0a0b canvas) so cards actually read as panels.
const CARD =
  'relative overflow-hidden rounded-[22px] border border-stone-200/80 bg-white/85 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_24px_60px_-34px_rgba(28,25,23,0.30)] backdrop-blur-sm dark:border-white/[0.09] dark:bg-[#161619] dark:shadow-[0_22px_55px_-32px_rgba(0,0,0,0.9)]';
const EDGE =
  'before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-stone-900/10 before:to-transparent dark:before:via-white/20';
const INSET = 'rounded-2xl border border-stone-200/70 bg-stone-50/70 dark:border-white/[0.07] dark:bg-white/[0.035]';
const PILL = 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white';
const GHOST =
  'border border-stone-300/70 bg-white/60 text-stone-500 hover:border-stone-400 hover:text-stone-900 dark:border-white/10 dark:bg-white/[0.05] dark:text-stone-300 dark:hover:border-white/25 dark:hover:text-white';
const SOFT = 'bg-stone-900/[0.05] text-stone-600 dark:bg-white/[0.07] dark:text-stone-300';
const ACCENT = 'text-amber-700 dark:text-amber-300';

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn(CARD, EDGE, className)}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">{children}</div>;
}

function Serif({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('font-serif font-normal', className)}>{children}</span>;
}

/* ---------------------------------------------------------------- theme toggle -- */
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;
    // Briefly enable color transitions so the theme morphs smoothly (see globals.css).
    root.classList.add('theme-anim');
    window.setTimeout(() => root.classList.remove('theme-anim'), 800);
    setDark(next);
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem('masaar:theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };
  return (
    <button type="button" onClick={toggle} aria-label="Toggle dark mode" className={cn('grid h-9 w-9 place-items-center rounded-full transition-colors', GHOST)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? 'sun' : 'moon'} initial={{ rotate: -40, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 40, opacity: 0, scale: 0.6 }} transition={{ duration: 0.2 }}>
          {dark ? <Sun /> : <Moon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
function Sun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function Moon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

const KIND_META: Record<PickKind, { cls: string; Icon: typeof User; key: 'kindTop' | 'kindMid' | 'kindCommon' }> = {
  top: { cls: ACCENT, Icon: TrendingUp, key: 'kindTop' },
  mid: { cls: 'text-stone-600 dark:text-stone-300', Icon: User, key: 'kindMid' },
  common: { cls: 'text-stone-600 dark:text-stone-300', Icon: Sparkles, key: 'kindCommon' },
};

const STATUS_BTNS: { key: ContactStatus; sk: 'status_sent' | 'status_replied' | 'status_followup'; on: string }[] = [
  { key: 'sent', sk: 'status_sent', on: 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' },
  { key: 'replied', sk: 'status_replied', on: 'bg-emerald-600 text-white' },
  { key: 'followup', sk: 'status_followup', on: 'bg-amber-500 text-white' },
];

/* ------------------------------------------------------------- contact card -- */

function ContactCard({ contact: c, locale, kind, reason }: { contact: Contact; locale: Loc; kind?: PickKind; reason?: string }) {
  const { templates } = usePlan();
  const { statuses, setStatus } = useProgress();
  const [tpl, setTpl] = useState(0);
  const [copied, setCopied] = useState(false);
  const [msgLang, setMsgLang] = useState<Loc>(locale);

  const status = statuses[c.id] ?? c.status;
  const template = templates[tpl % templates.length];
  const message = fillTemplate(template.preview[msgLang], c, msgLang);
  const isRecruiter = Boolean(c.sector);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* clipboard may be blocked */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="flex h-full flex-col p-4 transition-shadow duration-300 hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]">
      <div className="flex items-start gap-3">
        <Avatar initials={c.name[locale].charAt(0)} companyKey={c.companyKey} seed={c.company.en} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold text-stone-900 dark:text-stone-50">{c.name[locale]}</h3>
            {isRecruiter && <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">{ui.contacts.recruiter[locale]}</span>}
          </div>
          <p className="mt-0.5 truncate text-[13px] text-stone-600 dark:text-stone-300">{c.role[locale]}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-stone-600 dark:text-stone-300">{c.company[locale]}</p>
        </div>
      </div>

      {isRecruiter && (c.sector || c.companyTier) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.sector && SECTOR_LABELS[c.sector] && <span className={cn('rounded-md px-2 py-0.5 text-[10.5px] font-semibold', SOFT)}>{SECTOR_LABELS[c.sector][locale]}</span>}
          {c.companyTier && <span className={cn('rounded-md px-2 py-0.5 text-[10.5px] font-semibold', SOFT)}>{TIER_LABELS[c.companyTier][locale]}</span>}
        </div>
      )}

      {kind && reason && (
        <div className={cn('mt-3 flex items-start gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px]', INSET)}>
          {(() => {
            const I = KIND_META[kind].Icon;
            return <I className={cn('mt-0.5 h-3 w-3 shrink-0', KIND_META[kind].cls)} />;
          })()}
          <span className="text-stone-600 dark:text-stone-300">
            <span className={cn('font-bold', KIND_META[kind].cls)}>{ui.paths[KIND_META[kind].key][locale]}</span> · {reason}
          </span>
        </div>
      )}

      <div className="mt-3 border-t border-stone-900/[0.07] pt-3 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          {STATUS_BTNS.map((b) => {
            const active = status === b.key;
            return (
              <button key={b.key} type="button" onClick={() => setStatus(c.id, active ? 'new' : b.key)} className={cn('flex-1 rounded-full px-2 py-1.5 text-[11px] font-bold transition-colors', active ? b.on : 'bg-stone-900/[0.04] text-stone-500 hover:text-stone-900 dark:bg-white/[0.05] dark:text-stone-400 dark:hover:text-white')}>
                {ui.contacts[b.sk][locale]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex-1">
        <div className="mb-1.5 flex items-start gap-1.5 rounded-xl bg-amber-400/[0.14] px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-300">
          <PenLine className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{ui.contacts.handwrite[locale]}</span>
        </div>
        <div className={cn('p-3', INSET)}>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-semibold text-stone-500 dark:text-stone-400">{ui.contacts.messagePreview[locale]} · {template.title[locale]}</span>
            <button type="button" onClick={() => setMsgLang((l) => (l === 'ar' ? 'en' : 'ar'))} title={ui.contacts.msgLangHint[locale]} className={cn('inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold', GHOST)}>
              <Languages className="h-3 w-3" />
              {msgLang === 'ar' ? 'EN' : 'ع'}
            </button>
          </div>
          <p dir={msgLang === 'ar' ? 'rtl' : 'ltr'} className="line-clamp-3 text-[12.5px] leading-relaxed text-stone-600 dark:text-stone-300">{message}</p>
        </div>
      </div>

      <div className="mt-2.5 flex gap-2">
        <button type="button" onClick={copy} className={cn('flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[13px] font-bold transition-colors', copied ? 'bg-stone-900/[0.06] text-stone-700 dark:bg-white/10 dark:text-stone-200' : PILL)}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? ui.contacts.copied[locale] : ui.contacts.copy[locale]}
        </button>
        <button type="button" onClick={() => setTpl((i) => i + 1)} title={ui.contacts.shuffle[locale]} className={cn('grid w-11 shrink-0 place-items-center rounded-full', GHOST)}>
          <Shuffle className="h-4 w-4" />
        </button>
        <a href={linkedinUrl(c)} target="_blank" rel="noopener noreferrer" title={ui.contacts.linkedin[locale]} className={cn('grid w-11 shrink-0 place-items-center rounded-full text-blue-600 dark:text-blue-300', GHOST)}>
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </Card>
  );
}

function CardGrid({ items, locale }: { items: { contact: Contact; kind?: PickKind; reason?: string }[]; locale: Loc }) {
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <ContactCard key={it.contact.id} contact={it.contact} locale={locale} kind={it.kind} reason={it.reason} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- your CV -- */

// Transient review card: shows strengths + hygiene issues, and unmounts entirely
// once every issue is marked Fixed (we never leave a resolved to-do hanging).
function CvReviewCard({ locale }: { locale: Loc }) {
  const { cvReview } = usePlan();
  const { cvFixed, toggleCvFix } = useProgress();
  const open = cvReview.issues.filter((i) => !cvFixed[i.id]);
  if (open.length === 0) return null;

  const total = cvReview.issues.length;
  const done = total - open.length;
  const sevDot: Record<string, string> = { high: 'bg-rose-500', med: 'bg-amber-500', low: 'bg-stone-400' };

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Eyebrow>{ui.cvBlock.eyebrow[locale]}</Eyebrow>
        {done > 0 && <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] font-bold tabular-nums', SOFT)}>{ui.cvBlock.polishProgress[locale](done, total)}</span>}
      </div>
      <p className="mt-2 text-[15px] font-semibold leading-snug text-stone-900 dark:text-stone-50">{cvReview.headline[locale]}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">{ui.cvBlock.strengths[locale]}</div>
          <ul className="mt-2 space-y-1.5">
            {cvReview.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px] text-stone-600 dark:text-stone-300">
                <Check className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', ACCENT)} />
                <span>{s[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">{ui.cvBlock.needsPolish[locale]}</div>
          <ul className="mt-2 space-y-2">
            <AnimatePresence initial={false}>
              {open.map((iss) => (
                <motion.li key={iss.id} layout initial={{ opacity: 1 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.25 }} className="flex items-start gap-2">
                  <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', sevDot[iss.severity])} />
                  <span className="min-w-0 flex-1 text-[13px] text-stone-600 dark:text-stone-300">{iss.text[locale]}</span>
                  <button type="button" onClick={() => toggleCvFix(iss.id)} className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors', GHOST)}>
                    <Check className="h-3 w-3" /> {ui.cvBlock.markFixed[locale]}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </Card>
  );
}

// What's missing for the selected level: the EXPERIENCE / other gaps a certificate
// cannot fix (the certs are covered by "what raises your score"). Lives with the
// score and persists.
function LevelGaps({ locale }: { locale: Loc }) {
  const { levelGaps } = usePlan();
  const { level } = useProgress();
  const gap = levelGaps[level];
  const empty = !gap.experience && (!gap.other || gap.other.length === 0);

  return (
    <div className="mt-5">
      <div className="text-xs font-bold text-stone-700 dark:text-stone-200">{ui.cvBlock.gapsTitle[locale]}</div>
      {empty ? (
        <p className={cn('mt-2 text-[13px] font-semibold', ACCENT)}>{ui.cvBlock.ready[locale]}</p>
      ) : (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {gap.experience && (
            <span className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-semibold', SOFT)}>
              <TrendingUp className="h-3 w-3" /> {gap.experience[locale]}
            </span>
          )}
          {gap.other?.map((o, i) => (
            <span key={i} className={cn('inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11.5px] font-semibold', SOFT)}>
              <Sparkles className="h-3 w-3" /> {o[locale]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------- home -- */
// Home is customizable: the score hero is the fixed core, and the surrounding
// cards are widgets the customer can toggle (persisted in homeWidgets). New
// widgets (weekly goal, snapshot) default off so they can be "added".
const HOME_WIDGETS: { id: string; label: keyof typeof ui.overview }[] = [
  { id: 'nextMove', label: 'wNextMove' },
  { id: 'network', label: 'wNetwork' },
  { id: 'cvReview', label: 'wCvReview' },
  { id: 'stats', label: 'wStats' },
  { id: 'picks', label: 'wPicks' },
  { id: 'goal', label: 'wGoal' },
  { id: 'snapshot', label: 'wSnapshot' },
  { id: 'currentCert', label: 'wCert' },
  { id: 'careerDay', label: 'wCareerDay' },
];
const WIDGET_DEFAULT: Record<string, boolean> = { nextMove: false, network: false, cvReview: true, stats: true, picks: true, goal: false, snapshot: false, currentCert: false, careerDay: false };
const WEEKLY_GOAL = 5;

function Home({ locale, go, openPath }: { locale: Loc; go: (t: Tab) => void; openPath: (id: string) => void }) {
  const plan = usePlan();
  const { network } = useNetwork();
  const { level, setLevel, statuses, certsDone, activePathId, setActivePath, homeWidgets, setWidget } = useProgress();
  const [customizing, setCustomizing] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [shuffle, setShuffle] = useState(0);
  // Day-of-epoch for the daily rotation; starts at 0 so SSR and the first client
  // render match (no hydration mismatch), then advances to today after mount.
  const [day, setDay] = useState(0);
  useEffect(() => setDay(Math.floor(Date.now() / 86_400_000)), []);

  // The customer's chosen path drives Home (falls back to the plan's primary).
  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;
  const paths = plan.paths.slice(0, TIER_PATHS[plan.tier]);

  const score = activePath.scoreByLevel[level];
  const upcoming = activePath.certs.filter((c) => !certsDone[c.name.en] && c.status !== 'done');
  // "What raises your score" is derived from the active path's remaining certs.
  const imps = upcoming.slice(0, 3).map((c) => ({ name: c.name, d: scaledAdd(c.scoreAdd, level), effort: c.duration, current: c.status === 'current' }));
  const potential = Math.min(100, score + imps.reduce((s, i) => s + i.d, 0));
  const certsTotal = activePath.certs.length;
  const certsDoneCount = activePath.certs.filter((c) => certsDone[c.name.en]).length;
  const sv = Object.values(statuses);
  const sent = sv.filter((s) => s !== 'new').length;
  const replied = sv.filter((s) => s === 'replied').length;
  const current = activePath.certs.find((c) => c.status === 'current');

  // Connection picks: the uploaded network if present, otherwise HR contacts as
  // placeholders (same ranking rules). Rotates daily, and the shuffle button
  // advances the rotation on demand. Works for both network and placeholders.
  const ranked = rankConnections(network ?? plan.hrContacts, planTargets(plan));
  const todays = dailyPicks(ranked, 3, day + shuffle);

  const nm: { title: string; desc: string; go: Tab } = !network
    ? { title: ui.overview.nextMove.connectTitle[locale], desc: ui.overview.nextMove.connectDesc[locale], go: 'contacts' }
    : todays.length > 0
      ? { title: ui.overview.nextMove.reachTitle[locale], desc: ui.overview.nextMove.reachDesc[locale](todays.length), go: 'contacts' }
      : { title: ui.overview.nextMove.certTitle[locale], desc: current ? ui.overview.nextMove.certDesc[locale](current.name[locale]) : ui.paths.sub[locale], go: 'paths' };

  const stats = [
    { v: `${certsDoneCount}/${certsTotal}`, label: ui.overview.certsLabel[locale] },
    { v: `${sent}`, label: ui.overview.sentLabel[locale] },
  ];

  const W = (id: string) => homeWidgets[id] ?? WIDGET_DEFAULT[id];
  const railOn = ['nextMove', 'network', 'goal', 'snapshot', 'currentCert', 'careerDay'].filter(W);
  const goalDone = sent >= WEEKLY_GOAL;
  // Data for the optional widgets.
  const field = activePath.icon as Exclude<FieldTag, 'all'>;
  const nextDay = [...careerDays].sort((a, b) => {
    const ra = a.fields.includes(field) || a.fields.includes('all') ? 0 : 1;
    const rb = b.fields.includes(field) || b.fields.includes('all') ? 0 : 1;
    return ra - rb;
  })[0];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* role selector (a compact dropdown to pick the role the score is for) + customize */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative min-w-0">
          <button type="button" onClick={() => setRoleOpen((v) => !v)} className={cn('inline-flex max-w-full items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold', GHOST)}>
            <span className="truncate">{activePath.name[locale]}</span>
            <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform', roleOpen && 'rotate-180')} />
          </button>
          {roleOpen && (
            <>
              <button type="button" aria-hidden tabIndex={-1} className="fixed inset-0 z-20 cursor-default" onClick={() => setRoleOpen(false)} />
              <div className="absolute start-0 z-30 mt-1.5 max-h-80 w-72 max-w-[80vw] overflow-auto rounded-2xl border border-stone-200/80 bg-white p-1 shadow-[0_20px_60px_-25px_rgba(28,25,23,0.45)] dark:border-white/10 dark:bg-[#161619]">
                {paths.map((p) => {
                  const on = p.id === activePath.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => { setActivePath(p.id); setRoleOpen(false); }}
                      className={cn('flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-start text-[13px] font-medium transition-colors', on ? cn(SOFT, 'text-stone-900 dark:text-stone-50') : 'text-stone-600 hover:bg-stone-900/[0.04] dark:text-stone-300 dark:hover:bg-white/[0.05]')}
                    >
                      <span className="truncate">{p.name[locale]}</span>
                      {on && <Check className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <button type="button" onClick={() => setCustomizing((v) => !v)} className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold', GHOST)}>
          <Sliders className="h-3.5 w-3.5" /> {ui.overview.customize[locale]}
        </button>
      </div>
      {customizing && (
        <Card className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-50">{ui.overview.customizeTitle[locale]}</div>
              <div className="text-[12.5px] text-stone-500 dark:text-stone-400">{ui.overview.customizeSub[locale]}</div>
            </div>
            <button type="button" onClick={() => setCustomizing(false)} className={cn('shrink-0 rounded-full px-4 py-1.5 text-[12px] font-bold', PILL)}>{ui.overview.doneBtn[locale]}</button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {HOME_WIDGETS.map((w) => {
              const on = W(w.id);
              return (
                <button key={w.id} type="button" onClick={() => setWidget(w.id, !on)} className={cn('flex items-center justify-between rounded-xl px-3 py-2.5 text-start transition-colors', INSET)}>
                  <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">{(ui.overview[w.label] as { ar: string; en: string })[locale]}</span>
                  <span className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', on ? 'bg-amber-500' : 'bg-stone-300 dark:bg-white/15')}>
                    <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all', on ? 'ltr:left-4 rtl:right-4' : 'ltr:left-0.5 rtl:right-0.5')} />
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        <Card className={cn('col-span-12 p-5 sm:p-6', railOn.length ? 'lg:col-span-8' : 'lg:col-span-12')}>
          <div className="grid items-start gap-5 sm:grid-cols-[auto_1fr] sm:gap-7">
            <div className="mx-auto flex flex-col items-center gap-3 sm:mx-0">
              <div className="text-amber-600 dark:text-amber-400">
                <ProgressRing value={score} size={118} stroke={6} color="currentColor" track="rgba(120,113,108,0.18)">
                  <div className="leading-none">
                    <Serif className="block text-5xl tracking-tight text-stone-900 dark:text-stone-50">
                      <Counter to={score} />
                    </Serif>
                    <div className="mt-0.5 text-[10px] font-medium text-stone-500 dark:text-stone-400">/ 100</div>
                  </div>
                </ProgressRing>
              </div>
              <div className="inline-flex rounded-full border border-stone-200/80 bg-stone-50/80 p-0.5 dark:border-white/10 dark:bg-white/[0.05]">
                {LEVELS.map((lv) => {
                  const on = level === lv.id;
                  return (
                    <button key={lv.id} type="button" onClick={() => setLevel(lv.id)} className={cn('relative rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors', on ? 'text-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white')}>
                      {on && <motion.span layoutId="v4-level" className="absolute inset-0 -z-10 rounded-full bg-stone-900 dark:bg-stone-100" transition={SPRING} />}
                      {lv.label[locale]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0">
              <Eyebrow>{ui.overview.scoreLabel[locale]}</Eyebrow>
              <h1 className="mt-2 text-balance text-[22px] font-semibold leading-[1.12] tracking-tight text-stone-900 dark:text-stone-50 sm:text-[28px]">{activePath.name[locale]}</h1>
              <p className="mt-1.5 text-sm text-stone-600 dark:text-stone-300">{ui.overview.levelHint[locale]}</p>

              {/* What's behind your score, condensed to chips (full detail on hover) */}
              <div className="mt-3.5">
                <div className="text-xs font-bold text-stone-700 dark:text-stone-200">{ui.overview.scoreFactorsTitle[locale]}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {plan.scoreFactors.map((f, i) => {
                    const tint = f.strength === 'strong' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : f.strength === 'good' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : SOFT;
                    return (
                      <span key={i} title={f.detail[locale]} className={cn('rounded-md px-2 py-0.5 text-[11px] font-semibold', tint)}>{f.label[locale]}</span>
                    );
                  })}
                  <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-semibold', certsDoneCount >= 3 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : SOFT)}>{ui.overview.certsLabel[locale]} {certsDoneCount}/{certsTotal}</span>
                </div>
              </div>

              <LevelGaps locale={locale} />

              {imps.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-200">
                    <TrendingUp className={cn('h-3.5 w-3.5', ACCENT)} />
                    {ui.overview.improvementsTitle[locale]}
                  </div>
                  <ul className="mt-2.5 space-y-2">
                    {imps.map((imp, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[13px]">
                        <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums', imp.current ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : SOFT)}>+{imp.d}</span>
                        <span className="min-w-0 flex-1 text-stone-600 dark:text-stone-300">
                          {imp.name[locale]}
                          {imp.current && <span className="ms-2 whitespace-nowrap rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">{ui.overview.quickWin[locale]}</span>}
                        </span>
                        <span className="shrink-0 text-[11px] text-stone-500 dark:text-stone-400">{imp.effort[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-stone-500 dark:text-stone-400">{ui.overview.reachable[locale]}</span>
                      <span className="tabular-nums text-stone-600 dark:text-stone-300">
                        {score} <span className="text-stone-300 dark:text-stone-600">→</span> <span className="font-bold text-stone-900 dark:text-stone-100">{potential}</span>
                      </span>
                    </div>
                    <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-stone-900/[0.06] dark:bg-white/10">
                      <motion.div className="absolute inset-y-0 start-0 rounded-full bg-amber-400/45 dark:bg-amber-400/30" initial={{ width: 0 }} animate={{ width: `${potential}%` }} transition={{ duration: 1, ease: EASE }} />
                      <motion.div className="absolute inset-y-0 start-0 rounded-full bg-stone-900 dark:bg-stone-100" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.1, ease: EASE }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {railOn.length > 0 && (
          <div className="col-span-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-4 lg:grid-cols-1">
            {W('nextMove') && (
              <button type="button" onClick={() => go(nm.go)} className="group text-start">
                <Card className="flex h-full items-start gap-3 p-5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]">
                  <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', SOFT)}>
                    <Sparkles className={cn('h-5 w-5', ACCENT)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{ui.overview.nextMove.eyebrow[locale]}</div>
                    <div className="mt-0.5 font-bold text-stone-900 dark:text-stone-50">{nm.title}</div>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-stone-600 dark:text-stone-300">{nm.desc}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                </Card>
              </button>
            )}
            {W('network') && (
              <button type="button" onClick={() => go('contacts')} className="group text-start">
                <Card className="flex h-full items-center gap-3 p-5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]">
                  <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', SOFT)}>
                    <Network className="h-5 w-5 text-stone-700 dark:text-stone-200" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{ui.overview.networkTitle[locale]}</div>
                    <div className="mt-0.5 text-[13px] font-semibold text-stone-700 dark:text-stone-200">{network ? ui.overview.networkCount[locale](network.length) : ui.overview.networkEmpty[locale]}</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                </Card>
              </button>
            )}
            {W('goal') && (
              <Card className="p-5">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{ui.overview.goalTitle[locale]}</div>
                {goalDone ? (
                  <p className={cn('mt-1.5 text-sm font-bold', ACCENT)}>{ui.overview.goalDone[locale]}</p>
                ) : (
                  <>
                    <div className="mt-2 flex items-baseline gap-1">
                      <Serif className="text-3xl tabular-nums text-stone-900 dark:text-stone-50">{Math.min(sent, WEEKLY_GOAL)}</Serif>
                      <span className="text-sm text-stone-500 dark:text-stone-400">/ {WEEKLY_GOAL}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-900/[0.06] dark:bg-white/10">
                      <motion.div className="h-full rounded-full bg-amber-500 dark:bg-amber-400" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (sent / WEEKLY_GOAL) * 100)}%` }} transition={{ duration: 0.8, ease: EASE }} />
                    </div>
                    <div className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">{ui.overview.goalHint[locale](sent, WEEKLY_GOAL)}</div>
                  </>
                )}
              </Card>
            )}
            {W('snapshot') && (
              <Card className="p-5">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{ui.overview.snapshotTitle[locale]}</div>
                <div className="mt-2 flex gap-6">
                  <div>
                    <Serif className="block text-3xl tabular-nums text-stone-900 dark:text-stone-50">{sent}</Serif>
                    <div className="text-[10.5px] text-stone-500 dark:text-stone-400">{ui.overview.sentLabel[locale]}</div>
                  </div>
                  <div>
                    <Serif className="block text-3xl tabular-nums text-emerald-600 dark:text-emerald-300">{replied}</Serif>
                    <div className="text-[10.5px] text-stone-500 dark:text-stone-400">{ui.tracker.replied[locale]}</div>
                  </div>
                </div>
              </Card>
            )}
            {W('currentCert') && current && (
              <button type="button" onClick={() => go('paths')} className="group text-start">
                <Card className="flex h-full items-center gap-3 p-5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]">
                  <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', SOFT)}><BadgeCheck className="h-5 w-5 text-stone-700 dark:text-stone-200" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{ui.overview.certPeekTitle[locale]}</div>
                    <div className="mt-0.5 truncate font-bold text-stone-900 dark:text-stone-50">{current.name[locale]}</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                </Card>
              </button>
            )}
            {W('careerDay') && nextDay && (
              <a href={nextDay.link} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="flex h-full items-center gap-3 p-5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]">
                  <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', SOFT)}><CalendarDays className="h-5 w-5 text-stone-700 dark:text-stone-200" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">{ui.overview.careerDayTitle[locale]}</div>
                    <div className="mt-0.5 truncate font-bold text-stone-900 dark:text-stone-50">{nextDay.title[locale]}</div>
                    <div className="text-[11.5px] text-stone-500 dark:text-stone-400">{nextDay.when[locale]}</div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                </Card>
              </a>
            )}
          </div>
        )}
      </div>

      {W('cvReview') && <CvReviewCard locale={locale} />}

      {W('stats') && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-4 sm:p-5">
              <Serif className="block text-3xl tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">{s.v}</Serif>
              <div className="mt-1 text-[11px] text-stone-500 dark:text-stone-400 sm:text-xs">{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      {W('picks') && (
        <div className="pt-1">
          <div className="mb-1 flex items-end justify-between gap-3">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{ui.overview.actionsTitle[locale]}</h2>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => setShuffle((s) => s + 1)} title={ui.contacts.shuffle[locale]} aria-label={ui.contacts.shuffle[locale]} className={cn('grid h-8 w-8 place-items-center rounded-full', GHOST)}>
                <Shuffle className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => go('contacts')} className="inline-flex items-center gap-1 text-sm font-semibold text-stone-900 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-400">
                {ui.overview.openContacts[locale]} <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
              </button>
            </div>
          </div>
          <p className="text-sm text-stone-500 dark:text-stone-400">{network ? ui.overview.actionsSub[locale] : ui.contacts.placeholderNote[locale]}</p>
          {todays.length > 0 && <CardGrid items={todays.map((r) => ({ contact: r.contact, kind: r.kind, reason: r.reason[locale] }))} locale={locale} />}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- paths -- */

function CertTimeline({ path, locale }: { path: CareerPath; locale: Loc }) {
  const { certsDone, toggleCert, level } = useProgress();
  return (
    <div className="relative">
      <div className="absolute bottom-4 top-4 w-px bg-stone-200 ltr:left-[11px] rtl:right-[11px] dark:bg-white/10" />
      <div className="space-y-3">
        {path.certs.map((cert) => {
          const isDone = certsDone[cert.name.en];
          const isCurrent = !isDone && cert.status === 'current';
          return (
            <div key={cert.name.en} className="relative ps-9">
              <span className={cn('absolute top-4 grid h-6 w-6 place-items-center rounded-full border text-[10px] ltr:left-0 rtl:right-0', isDone ? 'border-transparent bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : isCurrent ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'border-stone-300 bg-white text-stone-300 dark:border-white/15 dark:bg-[#161619] dark:text-stone-600')}>
                {isDone ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              <Card className={cn('p-4', isDone && 'opacity-75')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-stone-900 dark:text-stone-50">{cert.name[locale]}</h4>
                    <p className="mt-1 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{cert.desc[locale]}</p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-amber-500/[0.12] px-2 py-1 text-sm font-bold tabular-nums text-amber-700 dark:text-amber-300">+{scaledAdd(cert.scoreAdd, level)}</span>
                </div>
                {cert.opens && cert.opens.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300"><KeyRound className="h-3 w-3" /> {ui.certs.opens[locale]}:</span>
                    {cert.opens.map((o, i) => (
                      <span key={i} className="rounded-md bg-amber-500/[0.12] px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">{o[locale]}</span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {cert.hadaf && <span className={cn('rounded-md px-2 py-1 text-[11px] font-semibold', SOFT)}>{ui.certs.hadaf[locale]}</span>}
                  <span className={cn('rounded-md px-2 py-1 text-[11px] font-semibold', SOFT)}>{cert.cost[locale]}</span>
                  <span className={cn('rounded-md px-2 py-1 text-[11px] font-semibold', SOFT)}>{cert.duration[locale]}</span>
                  <div className="ms-auto flex gap-2">
                    <a href={cert.official} target="_blank" rel="noopener noreferrer" className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold', GHOST)}>
                      <ExternalLink className="h-3.5 w-3.5" /> {ui.certs.official[locale]}
                    </a>
                    <button type="button" onClick={() => toggleCert(cert.name.en)} className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors', isDone ? PILL : GHOST)}>
                      <Check className="h-3.5 w-3.5" /> {isDone ? ui.certs.markedDone[locale] : ui.certs.markDone[locale]}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PathDetail({ path, locale, onBack }: { path: CareerPath; locale: Loc; onBack: () => void }) {
  const plan = usePlan();
  const { network } = useNetwork();
  const { level, certsDone, activePathId, setActivePath } = useProgress();
  const score = path.scoreByLevel[level];
  const done = path.certs.filter((c) => certsDone[c.name.en]).length;
  const totalScore = path.certs.reduce((s, c) => s + scaledAdd(c.scoreAdd, level), 0);
  const isActive = (activePathId ?? plan.primaryPath.id) === path.id;
  // Same rule as connections: real network if uploaded, else HR placeholders.
  const picks = rankConnections(network ?? plan.hrContacts, path.targetCompanies).slice(0, 5);

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        {ui.paths.back[locale]}
      </button>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{path.name[locale]}</h2>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{path.targets[locale]}</p>
          </div>
          {isActive ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1.5 text-[12px] font-bold text-amber-700 dark:text-amber-300">★ {ui.paths.active[locale]}</span>
          ) : (
            <button type="button" onClick={() => setActivePath(path.id)} className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-bold', PILL)}>★ {ui.paths.setActive[locale]}</button>
          )}
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { v: score, l: ui.paths.score[locale] },
            { v: `${done}/${path.certs.length}`, l: ui.paths.statCerts[locale] },
            { v: path.months, l: ui.paths.statMonths[locale] },
            { v: `+${totalScore}`, l: ui.paths.totalScore[locale] },
          ].map((s) => (
            <div key={s.l} className={cn('px-2 py-3 text-center', INSET)}>
              <Serif className="block text-2xl tabular-nums text-stone-900 dark:text-stone-50">{s.v}</Serif>
              <div className="mt-0.5 text-[10px] text-stone-500 dark:text-stone-400">{s.l}</div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{ui.certs.title[locale]}</h3>
        <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{ui.certs.sub[locale]}</p>
        <div className="mt-4">
          <CertTimeline path={path} locale={locale} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{ui.paths.picksTitle[locale]}</h3>
        <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{network ? ui.paths.picksSub[locale] : ui.contacts.placeholderNote[locale]}</p>
        {picks.length > 0 ? (
          <CardGrid items={picks.map((r) => ({ contact: r.contact, kind: r.kind, reason: r.reason[locale] }))} locale={locale} />
        ) : (
          <Card className="mt-4 p-6 text-center text-sm text-stone-600 dark:text-stone-300">{ui.network.locked[locale]}</Card>
        )}
      </div>
    </div>
  );
}

function Paths({ locale, selId, setSelId }: { locale: Loc; selId: string | null; setSelId: (id: string | null) => void }) {
  const { paths: allPaths, primaryPath, tier } = usePlan();
  const paths = allPaths.slice(0, TIER_PATHS[tier]);
  const { level, activePathId } = useProgress();
  const activeId = activePathId ?? primaryPath.id;
  const selected = selId ? paths.find((p) => p.id === selId) : null;
  if (selected) return <PathDetail path={selected} locale={locale} onBack={() => setSelId(null)} />;

  return (
    <div>
      <Eyebrow>{ui.paths.eyebrow[locale]}</Eyebrow>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{ui.paths.title[locale]}</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{ui.paths.sub[locale]}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {paths.map((p) => {
          const score = p.scoreByLevel[level];
          const totalScore = p.certs.reduce((s, c) => s + scaledAdd(c.scoreAdd, level), 0);
          return (
            <button key={p.id} type="button" onClick={() => setSelId(p.id)} className={cn('group text-start', p.id === activeId && 'sm:col-span-2')}>
              <Card className={cn('h-full p-5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]', p.id === activeId && 'border-amber-500/30 dark:border-amber-400/20')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-50">{p.name[locale]}</h3>
                      {p.id === activeId && <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9.5px] font-bold text-amber-700 dark:text-amber-300">★ {ui.paths.active[locale]}</span>}
                    </div>
                    <p className="mt-1 text-[13px] text-stone-600 dark:text-stone-300">{p.targets[locale]}</p>
                  </div>
                  <Serif className="shrink-0 text-3xl tabular-nums text-stone-900 dark:text-stone-50">{score}</Serif>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-900/[0.06] dark:bg-white/10">
                  <motion.div className="h-full rounded-full bg-stone-900 dark:bg-stone-100" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.9, ease: EASE }} />
                </div>
                <div className="mt-4 flex items-center gap-4 text-[12px] text-stone-500 dark:text-stone-400">
                  <span><span className="font-bold text-stone-600 dark:text-stone-300">{p.certs.length}</span> {ui.paths.statCerts[locale]}</span>
                  <span><span className="font-bold text-stone-600 dark:text-stone-300">{p.months}</span> {ui.paths.statMonths[locale]}</span>
                  <span><span className={cn('font-bold', ACCENT)}>+{totalScore}</span> {ui.paths.totalScore[locale]}</span>
                  <ArrowUpRight className="ms-auto h-4 w-4 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- contacts -- */

function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 text-xs font-semibold text-stone-500 dark:text-stone-400">{label}:</span>
      {options.map((o) => (
        <button key={o.id} type="button" onClick={() => onChange(o.id)} className={cn('shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors', value === o.id ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900' : GHOST)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NetworkPanel({ locale, count, onFile, onClear }: { locale: Loc; count: number | null; onFile: (f: File) => void; onClear: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Picker = <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />;
  if (count !== null) {
    return (
      <Card className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className={cn('grid h-10 w-10 place-items-center rounded-xl', SOFT)}><Network className="h-5 w-5" /></div>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-50">{ui.network.matched[locale](count)}</div>
            <div className="text-[12.5px] text-stone-600 dark:text-stone-300">{count > 0 ? ui.network.ranked[locale] : ui.network.none[locale]}</div>
          </div>
        </div>
        <button type="button" onClick={onClear} className={cn('inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold', GHOST)}>
          <X className="h-4 w-4" /> {ui.network.clear[locale]}
        </button>
        {Picker}
      </Card>
    );
  }
  return (
    <Card className="mt-4 p-5">
      <div className="flex items-start gap-3">
        <div className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', SOFT)}><Network className="h-5 w-5" /></div>
        <div>
          <h3 className="text-base font-semibold text-stone-900 dark:text-stone-50">{ui.network.title[locale]}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{ui.network.body[locale]}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-amber-400/[0.14] px-3 py-2.5 text-[12.5px] font-semibold text-amber-700 dark:text-amber-300">{ui.network.note[locale]}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {([['howPhone', 'phoneSteps'], ['howLaptop', 'laptopSteps']] as const).map(([h, s]) => (
          <div key={h} className={cn('p-3.5', INSET)}>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-50">{ui.network[h][locale]}</div>
            <ol className="mt-2.5 space-y-2">
              {ui.network[s][locale].map((step, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-stone-600 dark:text-stone-300">
                  <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold tabular-nums', SOFT)}>{i + 1}</span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => inputRef.current?.click()} className={cn('mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold', PILL)}>
        <Upload className="h-4 w-4" /> {ui.network.upload[locale]}
      </button>
      {Picker}
    </Card>
  );
}

function Contacts({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { network, setFromCsv, clear } = useNetwork();
  const { statuses } = useProgress();
  const [part, setPart] = useState<'connections' | 'hr'>('connections');
  const [query, setQuery] = useState('');
  const [hrSector, setHrSector] = useState<string>('all');
  const [hrTier, setHrTier] = useState<CompanyTier | 'all'>('all');
  const [shown, setShown] = useState(3);
  useEffect(() => setShown(3), [part, query, hrSector, hrTier, network]);

  const cap = TIER_CAP[plan.tier];
  const onFile = (file: File) => {
    const r = new FileReader();
    r.onload = () => setFromCsv(String(r.result ?? ''));
    r.readAsText(file);
  };

  const q = query.trim().toLowerCase();
  const match = (c: Contact) => !q || c.name.en.toLowerCase().includes(q) || c.name.ar.includes(query) || c.company.en.toLowerCase().includes(q) || c.role.en.toLowerCase().includes(q);

  // Connections: the uploaded network if present, otherwise HR contacts as
  // placeholders (same ranking rules) until the CSV is uploaded.
  // Connections are the customer's OWN uploaded network only (HR lives in its own
  // tab, not mixed in here).
  const ranked = useMemo(() => (network ? rankConnections(network, planTargets(plan)).slice(0, cap) : []), [network, plan, cap]);
  const hrSectors = useMemo(() => Array.from(new Set(plan.hrContacts.map((c) => c.sector).filter(Boolean) as string[])), [plan.hrContacts]);
  const hrTiers = useMemo(() => Array.from(new Set(plan.hrContacts.map((c) => c.companyTier).filter(Boolean) as CompanyTier[])), [plan.hrContacts]);

  const items =
    part === 'connections'
      ? ranked.filter((r) => match(r.contact)).map((r) => ({ contact: r.contact, kind: r.kind, reason: r.reason[locale] }))
      : plan.hrContacts.filter((c) => (hrSector === 'all' || c.sector === hrSector) && (hrTier === 'all' || c.companyTier === hrTier) && match(c)).map((c) => ({ contact: c }));
  const statusOf = (c: Contact) => statuses[c.id] ?? c.status;
  const active = items.filter((it) => statusOf(it.contact) !== 'new');
  const main = items.filter((it) => statusOf(it.contact) === 'new');

  const tabs = [
    { id: 'connections' as const, Icon: Users, label: ui.contacts.tabConnections[locale], hint: ui.contacts.connectionsHint[locale], badge: network ? ranked.length : null },
    { id: 'hr' as const, Icon: Building2, label: ui.contacts.tabHr[locale], hint: ui.contacts.hrHint[locale], badge: plan.hrContacts.length },
  ];

  return (
    <div>
      <Eyebrow>{ui.contacts.eyebrow[locale]}</Eyebrow>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{ui.contacts.title[locale]}</h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{ui.contacts.sub[locale]}</p>

      <div className="mt-5">
        <OutreachLog locale={locale} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
        {tabs.map((t) => {
          const on = part === t.id;
          return (
            <button key={t.id} type="button" onClick={() => setPart(t.id)} className="text-start">
              <Card className={cn('flex items-center gap-3 p-4 transition-shadow', on ? 'border-stone-900/30 dark:border-white/25' : 'hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]')}>
                <t.Icon className={cn('h-5 w-5 shrink-0', on ? 'text-stone-900 dark:text-stone-50' : 'text-stone-500 dark:text-stone-400')} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-50">{t.label}</span>
                    {t.badge !== null && <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums', SOFT)}>{t.badge}</span>}
                  </span>
                  <span className="block truncate text-[11px] text-stone-500 dark:text-stone-400">{t.hint}</span>
                </span>
              </Card>
            </button>
          );
        })}
      </div>

      {part === 'connections' && <NetworkPanel locale={locale} count={network ? ranked.length : null} onFile={onFile} onClear={clear} />}

      {(part === 'hr' || network) && (
        <Card className="mt-3 flex items-center gap-2.5 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-stone-500 dark:text-stone-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.contacts.search[locale]} className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-50 dark:placeholder:text-stone-500" />
        </Card>
      )}

      {part === 'hr' && (
        <div className="mt-3 space-y-2">
          <Chips label={ui.contacts.sector[locale]} value={hrSector} onChange={setHrSector} options={[{ id: 'all', label: ui.contacts.allSectors[locale] }, ...hrSectors.map((s) => ({ id: s, label: SECTOR_LABELS[s]?.[locale] ?? s }))]} />
          <Chips label={ui.contacts.companySize[locale]} value={hrTier} onChange={setHrTier} options={[{ id: 'all' as const, label: ui.contacts.allSizes[locale] }, ...hrTiers.map((t) => ({ id: t, label: TIER_LABELS[t][locale] }))]} />
        </div>
      )}

      {(part === 'hr' || network) &&
        (items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-stone-500 dark:text-stone-400">{ui.contacts.empty[locale]}</p>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-stone-700 dark:text-stone-200">{ui.contacts.inProgress[locale]} <span className="text-stone-500 dark:text-stone-400">({active.length})</span></h3>
                <CardGrid items={active} locale={locale} />
              </div>
            )}
            <div className="mt-6">
              {active.length > 0 && <h3 className="mb-1 text-sm font-bold text-stone-700 dark:text-stone-200">{ui.contacts.notContacted[locale]}</h3>}
              <CardGrid items={main.slice(0, shown)} locale={locale} />
              {main.length > shown && (
                <div className="mt-5 flex flex-col items-center gap-2">
                  <button type="button" onClick={() => setShown((s) => s + 12)} className={cn('rounded-full px-5 py-2.5 text-sm font-bold', PILL)}>
                    {ui.contacts.showMore[locale](Math.min(12, main.length - shown))}
                  </button>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">{ui.contacts.showing[locale](Math.min(shown, main.length), main.length)}</span>
                </div>
              )}
            </div>
          </>
        ))}
    </div>
  );
}

/* ---------------------------------------------------- outreach log (in contacts) -- */
// The message tracker now lives inside Contacts: a compact funnel of the outreach
// the customer has logged (sent / replied / awaiting / follow-up) + reply rate.
function OutreachLog({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { network } = useNetwork();
  const { statuses } = useProgress();
  const vals = Object.values(statuses);
  const sent = vals.filter((s) => s === 'sent').length;
  const replied = vals.filter((s) => s === 'replied').length;
  const followup = vals.filter((s) => s === 'followup').length;
  const reached = sent + replied + followup;
  const total = (network?.length ?? 0) + plan.hrContacts.length;
  const pct = total ? Math.round((reached / total) * 100) : 0;
  const cards = [
    { v: sent, l: ui.contacts.status_sent[locale], c: 'text-stone-900 dark:text-stone-50' },
    { v: replied, l: ui.contacts.status_replied[locale], c: 'text-emerald-600 dark:text-emerald-300' },
    { v: followup, l: ui.contacts.status_followup[locale], c: 'text-amber-600 dark:text-amber-300' },
  ];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">{ui.contacts.outreachLog[locale]}</h3>
        <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
          <span className="font-bold text-stone-900 tabular-nums dark:text-stone-50">{pct}%</span> {ui.contacts.reachedLabel[locale]}
          <span className="ms-1 text-stone-500 dark:text-stone-400">· {ui.contacts.reachedOf[locale](reached, total)}</span>
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        {cards.map((c) => (
          <div key={c.l} className={cn('px-2 py-2.5 text-center', INSET)}>
            <Serif className={cn('block text-2xl tabular-nums sm:text-3xl', c.c)}>{c.v}</Serif>
            <div className="mt-0.5 text-[10px] text-stone-500 dark:text-stone-400 sm:text-[11px]">{c.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-900/[0.06] dark:bg-white/10">
        <motion.div className="h-full rounded-full bg-amber-500 dark:bg-amber-400" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: EASE }} />
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------- study -- */
// Graduate study for the customer's field: Saudi options (often part-time, good
// while working) and worldwide full-time programs, with the best ones flagged and
// each linking to that field's program page.
function Study({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { activePathId } = useProgress();
  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;
  // Three majors that fit this path; each major gets its own four universities
  // strong in THAT field, hardest to easiest (no Saudi in these tiers).
  const fields = activePath.gradFields;
  const primary = fields[0];
  const nextDeg = ({ diploma: 'bachelor', bachelor: 'master', master: 'phd', phd: 'phd' } as const)[plan.profile.degree];
  const dWord = ui.study.degreeWord[nextDeg][locale];
  // Only TWO Saudi options (study while working): best match for the path's majors,
  // nearest the customer's region (from the CV) first.
  const region = plan.profile.region;
  const saudiScore = (u: (typeof partTimeSaudi)[number]) =>
    u.fields.filter((f) => fields.includes(f)).length * 2 + (region && u.region === region ? 1 : 0);
  const partTime = [...partTimeSaudi].sort((a, b) => saudiScore(b) - saudiScore(a)).slice(0, 2);

  const tierLabel = (t: GradProgram['tier']) =>
    (t === 'high' ? ui.study.tierHigh : t === 'respected' ? ui.study.tierRespected : t === 'solid' ? ui.study.tierSolid : ui.study.tierAccessible)[locale];
  const deadlineFor = (loc: string) =>
    (/USA|United States/.test(loc) ? ui.study.deadlineUS : /UK|United Kingdom/.test(loc) ? ui.study.deadlineUK : ui.study.deadlineOther)[locale];

  const essentials = [
    { Icon: FileText, title: ui.study.reqLabel[locale], items: ui.study.reqBrief[locale] },
    { Icon: CalendarDays, title: ui.study.timelineLabel[locale], items: ui.study.timelineBrief[locale] },
    { Icon: Wallet, title: ui.study.fundingLabel[locale], items: ui.study.fundingBrief[locale] },
  ];

  return (
    <div className="space-y-7">
      <div>
        <Eyebrow>{ui.study.eyebrow[locale]}</Eyebrow>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{ui.study.title[locale]}</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{ui.study.sub[locale]}</p>
        <p className={cn('mt-1.5 text-[12.5px] font-semibold', ACCENT)}>{ui.study.chosenFor[locale](activePath.name[locale])}</p>
      </div>

      {/* Is it worth it? */}
      <Card className="flex items-start gap-3 p-5">
        <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', SOFT)}><GraduationCap className={cn('h-5 w-5', ACCENT)} /></div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50">{ui.study.worthItTitle[locale]}</h3>
          <p className="mt-0.5 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{ui.study.worthIt[locale]}</p>
        </div>
      </Card>

      {/* The essentials, briefly, all under ONE title: requirements, timeline, funding */}
      <Card className="p-5">
        <h2 className="mb-4 text-base font-semibold text-stone-900 dark:text-stone-50">{ui.study.essentialsTitle[locale]}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {essentials.map((e, idx) => (
            <div key={e.title} className={cn(idx > 0 && 'sm:border-s sm:border-stone-200/70 sm:ps-5 dark:sm:border-white/10')}>
              <div className="mb-2 flex items-center gap-2">
                <e.Icon className={cn('h-4 w-4', ACCENT)} />
                <h3 className="text-[13px] font-bold text-stone-900 dark:text-stone-50">{e.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {e.items.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] text-stone-600 dark:text-stone-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Full-time, BY MAJOR: each major gets four universities strong in that field */}
      <div className="space-y-6">
        <SectionTitle icon={Globe} title={ui.study.fullTimeTitle[locale]} sub={ui.study.fullTimeSub[locale]} />
        {fields.map((f) => (
          <div key={f}>
            <h3 className="mb-2.5 flex items-center gap-2 text-[13px] font-bold text-stone-900 dark:text-stone-50">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" /> {dWord} {fieldMajors[f][locale]}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(gradPrograms[f] ?? []).map((p, i) => (
                <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className={cn('flex h-full flex-col p-4 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]', p.tier === 'high' && 'border-stone-900/20 dark:border-white/20')}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', p.tier === 'high' ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900' : SOFT)}>{tierLabel(p.tier)}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                    </div>
                    <h4 className="mt-2 text-[14px] font-semibold text-stone-900 dark:text-stone-50">{p.uni[locale]}</h4>
                    <div className="mt-0.5 text-[12.5px] text-stone-600 dark:text-stone-300">{p.program[locale]}</div>
                    <span className={cn('mt-1.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[9.5px] font-bold', p.top30 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : SOFT)}>★ {(p.top30 ? ui.study.pioneersBadge : ui.study.imdadBadge)[locale]}</span>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px]">
                      <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400"><Globe className="h-3 w-3" /> {p.location[locale]}</span>
                      <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400"><CalendarDays className="h-3 w-3" /> {deadlineFor(p.location.en)}</span>
                      <span className={cn('ms-auto inline-flex items-center gap-1 font-semibold', ACCENT)}>{ui.study.viewProgram[locale]} <ArrowUpRight className="h-3 w-3" /></span>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Part-time inside Saudi (study while working), nearest first */}
      <div>
        <SectionTitle icon={GraduationCap} title={ui.study.partTimeTitle[locale]} sub={ui.study.partTimeSub[locale]} />
        <p className="-mt-1 mb-3 text-[12.5px] text-stone-500 dark:text-stone-400">{ui.study.partTimeHow[locale]}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {partTime.map((u, i) => {
            const near = !!region && u.region === region;
            const uniMajors = u.fields.filter((f) => fields.includes(f));
            const majors = uniMajors.length ? uniMajors : u.fields;
            return (
              <a key={i} href={u.link} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="flex h-full flex-col p-4 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="text-[14px] font-semibold text-stone-900 dark:text-stone-50">{u.uni[locale]}</h3>
                      {near && <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-700 dark:text-amber-300">{ui.study.nearYou[locale]}</span>}
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-[11.5px] text-stone-500 dark:text-stone-400"><Globe className="h-3 w-3" /> {u.city[locale]}</span>
                  </div>
                  <div className="mt-3 text-[10.5px] font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">{ui.study.majorsHere[locale]}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {majors.map((f) => (
                      <span key={f} className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-semibold', SOFT)}>{dWord} {fieldMajors[f][locale]}</span>
                    ))}
                  </div>
                  <span className={cn('mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold', ACCENT)}>{ui.study.viewProgram[locale]} <ArrowUpRight className="h-3 w-3" /></span>
                </Card>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* ------------------------------------------------------------ opportunities -- */

function SectionTitle({ icon: Icon, title, sub }: { icon: typeof GraduationCap; title: string; sub?: string }) {
  return (
    <div className="mb-3 flex items-start gap-2.5">
      <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', SOFT)}><Icon className={cn('h-5 w-5', ACCENT)} /></div>
      <div>
        <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">{title}</h2>
        {sub && <p className="text-[12.5px] text-stone-500 dark:text-stone-400">{sub}</p>}
      </div>
    </div>
  );
}

function Opportunities({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const { level, activePathId } = useProgress();
  const activePath = plan.paths.find((p) => p.id === (activePathId ?? plan.primaryPath.id)) ?? plan.primaryPath;
  const field = activePath.icon as Exclude<FieldTag, 'all'>;
  const isEntry = level === 'entry';

  const days = [...careerDays].sort((a, b) => {
    const ra = a.fields.includes(field) || a.fields.includes('all') ? 0 : 1;
    const rb = b.fields.includes(field) || b.fields.includes('all') ? 0 : 1;
    return ra - rb;
  });
  const prep = [
    { Icon: FileText, title: ui.opp.cvGuideTitle[locale], items: cvGuide },
    { Icon: MessageCircle, title: ui.opp.interviewTitle[locale], items: interviewTips },
  ];
  const sizeLabel = (s: CompanySize) => (s === 'big' ? ui.opp.sizeBig : s === 'medium' ? ui.opp.sizeMedium : ui.opp.sizeSmall)[locale];

  return (
    <div className="space-y-7">
      <div>
        <Eyebrow>{ui.opp.eyebrow[locale]}</Eyebrow>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{ui.opp.title[locale]}</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{ui.opp.sub[locale]}</p>
      </div>

      {/* Tamheer */}
      <Card className={cn('p-5 sm:p-6', isEntry && 'border-amber-500/30 dark:border-amber-400/25')}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle icon={GraduationCap} title={ui.opp.tamheerTitle[locale]} sub={ui.opp.tamheerDesc[locale]} />
          {isEntry && <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">{ui.opp.tamheerEntryHint[locale]}</span>}
        </div>
        <div className="mt-2 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">{ui.opp.tamheerEligible[locale]}</div>
            <ul className="mt-2 space-y-1.5">
              {tamheer.eligibility.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-stone-600 dark:text-stone-300">
                  <Check className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', ACCENT)} /> {e[locale]}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={cn('rounded-md px-2 py-1 text-[11px] font-semibold', SOFT)}>{tamheer.stipend[locale]}</span>
              <span className={cn('rounded-md px-2 py-1 text-[11px] font-semibold', SOFT)}>{tamheer.duration[locale]}</span>
            </div>
          </div>
          <a href={tamheer.link} target="_blank" rel="noopener noreferrer" className={cn('inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold', PILL)}>
            {ui.opp.tamheerApply[locale]} <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </Card>

      {/* Career days */}
      <div>
        <SectionTitle icon={CalendarDays} title={ui.opp.careerDaysTitle[locale]} sub={ui.opp.careerDaysSub[locale]} />
        <div className="grid gap-3 sm:grid-cols-2">
          {days.map((d, i) => {
            const relevant = d.fields.includes(field) || d.fields.includes('all');
            return (
              <a key={i} href={d.link} target="_blank" rel="noopener noreferrer" className="group">
                <Card className="flex h-full items-start gap-3 p-4 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[14px] font-semibold text-stone-900 dark:text-stone-50">{d.title[locale]}</h3>
                      {relevant && <span className="shrink-0 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9.5px] font-bold text-amber-700 dark:text-amber-300">{ui.opp.relevantToYou[locale]}</span>}
                    </div>
                    <p className="mt-0.5 truncate text-[12px] text-stone-600 dark:text-stone-300">{d.org[locale]}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] text-stone-500 dark:text-stone-400">
                      <span>{d.when[locale]}</span>
                      <span>· {d.city[locale]}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                </Card>
              </a>
            );
          })}
        </div>
      </div>

      {/* Skills to learn */}
      <div>
        <SectionTitle icon={Sparkles} title={ui.opp.skillsTitle[locale]} sub={ui.opp.skillsSub[locale]} />
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((sk, i) => (
            <a key={i} href={sk.link} target="_blank" rel="noopener noreferrer" className="group">
              <Card className="flex items-center justify-between gap-2 p-3.5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]">
                <span className="min-w-0 truncate text-[13px] font-semibold text-stone-800 dark:text-stone-100">{sk.name[locale]}</span>
                <span className={cn('inline-flex shrink-0 items-center gap-1 text-[11px] font-bold', ACCENT)}>{ui.opp.learn[locale]} <ArrowUpRight className="h-3 w-3" /></span>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Prepare: CV + interview guidance */}
      <div className="grid gap-5 lg:grid-cols-2">
        {prep.map((p) => (
          <Card key={p.title} className="p-5">
            <SectionTitle icon={p.Icon} title={p.title} />
            <ul className="space-y-2">
              {p.items.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-stone-600 dark:text-stone-300">
                  <span className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500')} /> {t[locale]}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* Where to apply: official portals, then a broad set of company career pages */}
      <div>
        <SectionTitle icon={Globe} title={ui.opp.jobPortalsTitle[locale]} />
        <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">{ui.opp.portalsTitle[locale]}</div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {nationalPortals.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="group">
              <Card className="flex items-center gap-3 p-3.5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]">
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold text-stone-900 dark:text-stone-50">{p.name[locale]}</div>
                  <div className="truncate text-[11.5px] text-stone-500 dark:text-stone-400">{p.desc[locale]}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-stone-300 group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
              </Card>
            </a>
          ))}
        </div>
        <div className="mt-5 text-[11px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">{ui.opp.companyPortalsTitle[locale]}</div>
        <p className="mb-2.5 mt-0.5 text-[12px] text-stone-500 dark:text-stone-400">{ui.opp.companyPortalsSub[locale]}</p>
        <div className="space-y-4">
          {companyIndustries.filter((ind) => plan.sectors.includes(ind.sector)).map((ind) => {
            const list = companyPortals.filter((c) => c.industry === ind.id);
            if (!list.length) return null;
            return (
              <div key={ind.id}>
                <div className="mb-2 text-[12.5px] font-bold text-stone-700 dark:text-stone-200">{ind.label[locale]}</div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((c, i) => (
                    <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className="group">
                      <Card className="flex items-center gap-2 p-3.5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]">
                        <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-stone-900 dark:text-stone-50">{c.name[locale]}</span>
                        <span className={cn('shrink-0 rounded-full px-1.5 py-0.5 text-[9.5px] font-bold', c.size === 'big' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : SOFT)}>{sizeLabel(c.size)}</span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- referral strip -- */
// Rendered in the Shell (outside the tab content) so the invite shows on every page.
function ReferralStrip({ locale }: { locale: Loc }) {
  const plan = usePlan();
  const [copied, setCopied] = useState(false);
  // Fill the link after mount so the server and first client render match (the
  // origin is only known in the browser); avoids a hydration text mismatch.
  const [refUrl, setRefUrl] = useState('');
  useEffect(() => setRefUrl(referralLink(window.location.origin, locale, plan.slug)), [locale, plan.slug]);
  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(refUrl);
    } catch {
      /* ignore */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-4 sm:px-8">
      <Card className="overflow-hidden p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', SOFT)}><Gift className={cn('h-5 w-5', ACCENT)} /></div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">
              {ui.referral.title[locale].split('30%').map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && <strong className="font-bold text-amber-700 dark:text-amber-300">30%</strong>}
                </span>
              ))}
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-600 dark:text-stone-300">{ui.referral.body[locale]}</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">{ui.referral.yourLink[locale]}</div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <div className={cn('min-w-0 flex-1 truncate rounded-full px-4 py-2.5 text-[13px] font-medium text-stone-600 dark:text-stone-300', INSET)} dir="ltr">{refUrl}</div>
            <div className="flex gap-2">
              <button type="button" onClick={copyRef} className={cn('inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold sm:flex-none', copied ? cn('text-stone-700 dark:text-stone-200', SOFT) : PILL)}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? ui.referral.copied[locale] : ui.referral.copy[locale]}
              </button>
            </div>
          </div>
          <p className="mt-2 text-[11.5px] text-stone-500 dark:text-stone-400">{ui.referral.pending[locale]}</p>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------ feedback footer -- */

function FeedbackFooter({ locale }: { locale: Loc }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <footer className="mx-auto w-full max-w-5xl px-5 pb-12 sm:px-8">
      <Card className="p-5 sm:p-6">
        {sent ? (
          <div className="flex items-center justify-center gap-2 py-4 text-center text-sm font-semibold text-stone-700 dark:text-stone-200">
            <Check className={cn('h-4 w-4', ACCENT)} /> {ui.feedback.thanks[locale]}
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50">{ui.feedback.title[locale]}</h2>
                <p className="text-[12.5px] text-stone-500 dark:text-stone-400">{ui.feedback.sub[locale]}</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${ui.feedback.rate[locale]} ${n}`} className="p-0.5">
                    <Star className={cn('h-5 w-5 transition-colors', n <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-600')} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={ui.feedback.placeholder[locale]} className={cn('min-w-0 flex-1 rounded-full px-4 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-50 dark:placeholder:text-stone-500', INSET)} />
              <button type="button" disabled={!text.trim() && rating === 0} onClick={() => setSent(true)} className={cn('inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-opacity disabled:opacity-40', PILL)}>
                <Send className="h-4 w-4" /> {ui.feedback.send[locale]}
              </button>
            </div>
          </>
        )}
      </Card>
    </footer>
  );
}

/* ------------------------------------------------------------ command palette -- */

const NAV: { id: Tab; Icon: typeof LayoutDashboard; pro?: boolean }[] = [
  { id: 'home', Icon: LayoutDashboard },
  { id: 'paths', Icon: Compass },
  { id: 'contacts', Icon: Users },
  { id: 'tracker', Icon: GraduationCap, pro: true },
  { id: 'opportunities', Icon: Briefcase, pro: true },
];

function CommandPalette({ open, setOpen, locale, go, openPath }: { open: boolean; setOpen: (v: boolean) => void; locale: Loc; go: (t: Tab) => void; openPath: (id: string) => void }) {
  const { paths: allPaths, tier } = usePlan();
  const paths = allPaths.slice(0, TIER_PATHS[tier]);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      const id = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(id);
    }
  }, [open]);

  type Cmd = { id: string; label: string; hint: string; Icon: typeof LayoutDashboard; run: () => void };
  const cmds: Cmd[] = [
    ...NAV.map((n) => ({ id: `nav-${n.id}`, label: ui.nav[n.id][locale], hint: ui.cmd.go[locale], Icon: n.Icon, run: () => go(n.id) })),
    ...paths.map((p) => ({ id: `path-${p.id}`, label: p.name[locale], hint: ui.cmd.openPath[locale], Icon: Compass, run: () => openPath(p.id) })),
  ];
  const ql = q.trim().toLowerCase();
  const filtered = ql ? cmds.filter((c) => c.label.toLowerCase().includes(ql) || c.label.includes(q)) : cmds;

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filtered[0]) {
      filtered[0].run();
      setOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm dark:bg-black/60" onClick={() => setOpen(false)} />
          <motion.div initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={SPRING} className={cn('relative w-full max-w-lg overflow-hidden p-2', CARD)}>
            <div className="flex items-center gap-2.5 px-3 py-2">
              <Search className="h-4 w-4 text-stone-400" />
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder={ui.cmd.placeholder[locale]} className="w-full bg-transparent text-[15px] text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-50 dark:placeholder:text-stone-500" />
              <kbd className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold', SOFT)}>ESC</kbd>
            </div>
            <div className="mt-1 max-h-[46vh] overflow-y-auto px-1 pb-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-stone-400">{ui.contacts.empty[locale]}</p>
              ) : (
                filtered.map((c, i) => (
                  <button key={c.id} type="button" onClick={() => { c.run(); setOpen(false); }} className={cn('group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors', i === 0 ? 'bg-stone-900/[0.05] dark:bg-white/[0.06]' : 'hover:bg-stone-900/[0.04] dark:hover:bg-white/[0.04]')}>
                    <c.Icon className="h-4 w-4 shrink-0 text-stone-600 dark:text-stone-300" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-800 dark:text-stone-100">{c.label}</span>
                    <span className="shrink-0 text-[10.5px] font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">{c.hint}</span>
                    {i === 0 && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-stone-400" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------------------------------------------- shell -- */

function ProUpsell({ locale }: { locale: Loc }) {
  return (
    <div className="mx-auto max-w-md py-6">
      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <div className={cn('grid h-12 w-12 place-items-center rounded-2xl', SOFT)}><KeyRound className={cn('h-6 w-6', ACCENT)} /></div>
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{ui.shell.proLockTitle[locale]}</h2>
        <p className="text-[13px] leading-relaxed text-stone-500 dark:text-stone-400">{ui.shell.proLockBody[locale]}</p>
      </Card>
    </div>
  );
}

function Shell() {
  const locale = useLocale() as Loc;
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { profile, tier } = usePlan();
  const [tab, setTab] = useState<Tab>('home');
  const [pathSel, setPathSel] = useState<string | null>(null);
  const [cmdOpen, setCmdOpen] = useState(false);

  const go = (t: Tab) => { setTab(t); if (t !== 'paths') setPathSel(null); };
  const openPath = (id: string) => { setTab('paths'); setPathSel(id); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative min-h-dvh bg-[#f7f6f2] text-stone-900 dark:bg-[#0a0a0b] dark:text-stone-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 dark:hidden" style={{ backgroundImage: 'linear-gradient(to right, rgba(28,25,23,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.05) 1px, transparent 1px)', backgroundSize: '54px 54px', maskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)' }} />
        <div className="absolute inset-0 hidden dark:block" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '54px 54px', maskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)', WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)' }} />
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[56rem] -translate-x-1/2 rounded-full bg-amber-300/25 blur-[150px] dark:bg-amber-500/[0.12]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay dark:opacity-[0.06]" style={{ backgroundImage: NOISE }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#f7f6f2]/80 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0a0a0b]/80">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-2 px-4 sm:gap-3 sm:px-8">
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-stone-900 font-extrabold text-white dark:bg-stone-100 dark:text-stone-900">م</span>
            <span className="hidden text-lg font-semibold tracking-tight sm:inline">مسار</span>
          </div>

          {/* Primary nav, on the same line as the controls (labels collapse to icons on phone) */}
          <nav className={cn('mx-auto flex gap-0.5 rounded-full p-1', CARD)}>
            {NAV.map((n) => {
              const on = tab === n.id;
              return (
                <button key={n.id} type="button" onClick={() => go(n.id)} className={cn('relative flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] font-semibold transition-colors sm:gap-2 sm:px-3.5 sm:py-2 sm:text-sm', on ? 'text-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100')}>
                  {on && <motion.span layoutId="v4-nav" className="absolute inset-0 -z-10 rounded-full bg-stone-900 dark:bg-stone-100" transition={SPRING} />}
                  <n.Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">{ui.nav[n.id][locale]}</span>
                  {n.pro && <span className={cn('ms-0.5 hidden rounded px-1 text-[8.5px] font-bold leading-tight md:inline', on ? 'bg-white/20 text-white dark:bg-stone-900/20 dark:text-stone-900' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300')}>Pro</span>}
                  {n.pro && <span className="ms-0.5 rounded bg-amber-500/15 px-1 text-[8px] font-bold leading-tight text-amber-700 dark:text-amber-300 md:hidden">Pro</span>}
                </button>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link href={pathname} locale={locale === 'ar' ? 'en' : 'ar'} className={cn('grid h-9 w-9 place-items-center rounded-full text-xs font-bold', GHOST)}>
              {locale === 'ar' ? 'EN' : 'ع'}
            </Link>
            {/* Identity, far right, on wide screens only so the nav stays on one line below lg */}
            <div className="ms-1 hidden items-center gap-2 lg:flex">
              <div className="hidden text-end leading-tight xl:block">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">{ui.shell.greeting[locale]}</div>
                <div className="text-sm font-semibold">{profile.name[locale]}</div>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-stone-700 to-stone-900 text-sm font-bold text-stone-50 dark:from-stone-500 dark:to-stone-700">{profile.name[locale].charAt(0)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-10 pt-7 sm:px-8">
        {/* A plain keyed motion.div (NOT AnimatePresence mode="wait"): it remounts
            on tab change and fades in. mode="wait" would wait for the old tab to
            finish exiting, and a layoutId element inside Home hangs that exit in
            production, leaving the new tab unmounted (the "only home works" bug). */}
        <motion.div key={tab + (pathSel ?? '')} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE }}>
          {tab === 'home' && <Home locale={locale} go={go} openPath={openPath} />}
          {tab === 'paths' && <Paths locale={locale} selId={pathSel} setSelId={setPathSel} />}
          {tab === 'contacts' && <Contacts locale={locale} />}
          {tab === 'tracker' && (tier === 'pro' ? <Study locale={locale} /> : <ProUpsell locale={locale} />)}
          {tab === 'opportunities' && (tier === 'pro' ? <Opportunities locale={locale} /> : <ProUpsell locale={locale} />)}
        </motion.div>
      </main>

      <ReferralStrip locale={locale} />
      <FeedbackFooter locale={locale} />

      <div className="mx-auto w-full max-w-5xl px-4 pb-10 text-center text-[12.5px] leading-relaxed text-stone-500 dark:text-stone-400 sm:px-8">
        <p className="whitespace-nowrap text-[clamp(8px,2.5vw,12.5px)]">{ui.shell.disclaimer[locale]}</p>
        <p className="mt-1 text-[13px] font-bold text-stone-700 dark:text-stone-200">{ui.shell.disclaimerWarm[locale]}</p>
      </div>

      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} locale={locale} go={go} openPath={openPath} />
    </div>
  );
}

export function V4() {
  const plan = usePlan();
  const initialCertsDone = plan.paths.flatMap((p) => p.certs).filter((c) => c.status === 'done').map((c) => c.name.en);
  return (
    <DashboardState slug={plan.slug} initialCertsDone={initialCertsDone}>
      <Shell />
    </DashboardState>
  );
}
