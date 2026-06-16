'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Compass,
  Users,
  Activity,
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
  Command,
  CornerDownLeft,
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
  LEVELS,
  SECTOR_LABELS,
  TIER_LABELS,
  TIER_CAP,
  ui,
  type Contact,
  type ContactStatus,
  type CompanyTier,
  type Loc,
  type PickKind,
  type CareerPath,
} from '@/lib/app-data';

/* =============================================================================
   v4 "Atlas" — an editorial bento dashboard. Warm paper / tinted-near-black,
   a single rationed gold accent, an Instrument-Serif display face for the big
   numbers, a masked background grid + film grain, spring motion with layoutId
   morphs, and a ⌘K command palette. Dual-theme via explicit dark: variants.
   Reuses the whole shared data/state layer, so v1–v4 share the same plan,
   network, statuses and level per slug.
============================================================================= */

const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;
type Tab = 'home' | 'paths' | 'contacts' | 'tracker';

// Shared class tokens keep light + dark in lockstep across the whole file.
const CARD =
  'relative overflow-hidden rounded-[22px] border border-stone-200/80 bg-white/85 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_24px_60px_-34px_rgba(28,25,23,0.30)] backdrop-blur-sm dark:border-white/[0.07] dark:bg-white/[0.025] dark:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.7)]';
// A whisper-thin specular line along the top edge, like light catching a panel.
const EDGE =
  'before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-stone-900/10 before:to-transparent dark:before:via-white/15';
const INSET = 'rounded-2xl border border-stone-200/70 bg-stone-50/70 dark:border-white/[0.06] dark:bg-white/[0.02]';
const PILL = 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white';
const GHOST =
  'border border-stone-300/70 bg-white/60 text-stone-500 hover:border-stone-400 hover:text-stone-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400 dark:hover:text-white';
const SOFT = 'bg-stone-900/[0.05] text-stone-600 dark:bg-white/[0.06] dark:text-stone-300';
const ACCENT = 'text-amber-700 dark:text-amber-300';

// Film grain (feTurbulence) as a data URI; layered at very low opacity.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn(CARD, EDGE, className)}>{children}</div>;
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
      {children}
    </div>
  );
}

function Serif({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('font-serif font-normal', className)}>{children}</span>;
}

/* ---------------------------------------------------------------- theme toggle -- */
// Same contract as the shared toggle (flips `.dark`, persists masaar:theme), but
// styled to sit cleanly in the v4 chrome. A no-flash script in the root layout
// applies the saved choice before paint.
function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('masaar:theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={cn('grid h-9 w-9 place-items-center rounded-full transition-colors', GHOST)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'sun' : 'moon'}
          initial={{ rotate: -40, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 40, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {dark ? <Sun /> : <Moon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
// tiny inline icons so the toggle can animate the swap without layout shift
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
  common: { cls: 'text-stone-500 dark:text-stone-400', Icon: Sparkles, key: 'kindCommon' },
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
            {isRecruiter && (
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                {ui.contacts.recruiter[locale]}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] text-stone-500 dark:text-stone-400">{c.role[locale]}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-stone-600 dark:text-stone-300">{c.company[locale]}</p>
        </div>
      </div>

      {isRecruiter && (c.sector || c.companyTier) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.sector && SECTOR_LABELS[c.sector] && (
            <span className={cn('rounded-md px-2 py-0.5 text-[10.5px] font-semibold', SOFT)}>{SECTOR_LABELS[c.sector][locale]}</span>
          )}
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
              <button
                key={b.key}
                type="button"
                onClick={() => setStatus(c.id, active ? 'new' : b.key)}
                className={cn(
                  'flex-1 rounded-full px-2 py-1.5 text-[11px] font-bold transition-colors',
                  active ? b.on : 'bg-stone-900/[0.04] text-stone-500 hover:text-stone-900 dark:bg-white/[0.05] dark:text-stone-400 dark:hover:text-white',
                )}
              >
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
            <span className="truncate text-[11px] font-semibold text-stone-400 dark:text-stone-500">
              {ui.contacts.messagePreview[locale]} · {template.title[locale]}
            </span>
            <button
              type="button"
              onClick={() => setMsgLang((l) => (l === 'ar' ? 'en' : 'ar'))}
              title={ui.contacts.msgLangHint[locale]}
              className={cn('inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold', GHOST)}
            >
              <Languages className="h-3 w-3" />
              {msgLang === 'ar' ? 'EN' : 'ع'}
            </button>
          </div>
          <p dir={msgLang === 'ar' ? 'rtl' : 'ltr'} className="line-clamp-3 text-[12.5px] leading-relaxed text-stone-500 dark:text-stone-400">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={copy}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2.5 text-[13px] font-bold transition-colors',
            copied ? 'bg-stone-900/[0.06] text-stone-700 dark:bg-white/10 dark:text-stone-200' : PILL,
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? ui.contacts.copied[locale] : ui.contacts.copy[locale]}
        </button>
        <button type="button" onClick={() => setTpl((i) => i + 1)} title={ui.contacts.shuffle[locale]} className={cn('grid w-11 shrink-0 place-items-center rounded-full', GHOST)}>
          <Shuffle className="h-4 w-4" />
        </button>
        <a
          href={linkedinUrl(c)}
          target="_blank"
          rel="noopener noreferrer"
          title={ui.contacts.linkedin[locale]}
          className={cn('grid w-11 shrink-0 place-items-center rounded-full text-blue-600 dark:text-blue-300', GHOST)}
        >
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

/* -------------------------------------------------------------------- home -- */

function Home({ locale, go }: { locale: Loc; go: (t: Tab) => void }) {
  const plan = usePlan();
  const { primaryPath, cvScore } = plan;
  const { network } = useNetwork();
  const { level, setLevel, statuses, certsDone } = useProgress();

  const score = primaryPath.scoreByLevel[level];
  const potential = Math.min(100, score + cvScore.improvements.reduce((s, i) => s + i.delta, 0));
  const certsTotal = primaryPath.certs.length;
  const certsDoneCount = primaryPath.certs.filter((c) => certsDone[c.name.en]).length;
  const sv = Object.values(statuses);
  const sent = sv.filter((s) => s !== 'new').length;
  const replies = sv.filter((s) => s === 'replied').length;
  const current = primaryPath.certs.find((c) => c.status === 'current');
  const todays = network ? dailyPicks(rankConnections(network, planTargets(plan)), 3, Math.floor(Date.now() / 86_400_000)) : [];

  const stats = [
    { v: `${certsDoneCount}/${certsTotal}`, label: ui.overview.certsLabel[locale] },
    { v: `${sent}`, label: ui.overview.sentLabel[locale] },
    { v: `${replies}`, label: ui.overview.repliesLabel[locale] },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Bento: hero score + right rail */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4">
        <Card className="col-span-12 p-6 sm:p-8 lg:col-span-8">
          <div className="grid items-center gap-7 sm:grid-cols-[auto_1fr] sm:gap-9">
            <div className="flex flex-col items-center gap-4">
              <div className="text-amber-600 dark:text-amber-400">
                <ProgressRing value={score} size={168} stroke={7} color="currentColor" track="rgba(120,113,108,0.16)">
                  <div className="leading-none">
                    <Serif className="block text-6xl tracking-tight text-stone-900 dark:text-stone-50">
                      <Counter to={score} />
                    </Serif>
                    <div className="mt-1 text-[11px] font-medium text-stone-400 dark:text-stone-500">/ 100</div>
                  </div>
                </ProgressRing>
              </div>
              <div className="inline-flex rounded-full border border-stone-200/80 bg-stone-50/80 p-0.5 dark:border-white/10 dark:bg-white/[0.04]">
                {LEVELS.map((lv) => {
                  const on = level === lv.id;
                  return (
                    <button
                      key={lv.id}
                      type="button"
                      onClick={() => setLevel(lv.id)}
                      className={cn('relative rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors', on ? 'text-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white')}
                    >
                      {on && <motion.span layoutId="v4-level" className="absolute inset-0 -z-10 rounded-full bg-stone-900 dark:bg-stone-100" transition={SPRING} />}
                      {lv.label[locale]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0">
              <Eyebrow>{ui.overview.scoreLabel[locale]}</Eyebrow>
              <h1 className="mt-2 text-balance text-[26px] font-semibold leading-[1.1] tracking-tight text-stone-900 dark:text-stone-50 sm:text-[34px]">
                {cvScore.target[locale]}
              </h1>
              <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">{ui.overview.levelHint[locale]}</p>

              <div className="mt-5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-200">
                  <TrendingUp className={cn('h-3.5 w-3.5', ACCENT)} />
                  {ui.overview.improvementsTitle[locale]}
                </div>
                <ul className="mt-2.5 space-y-2">
                  {cvScore.improvements.map((imp, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[13px]">
                      <span className={cn('shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums', i === 0 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : SOFT)}>+{imp.delta}</span>
                      <span className="min-w-0 flex-1 text-stone-600 dark:text-stone-300">
                        {imp.action[locale]}
                        {i === 0 && (
                          <span className="ms-2 whitespace-nowrap rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">{ui.overview.quickWin[locale]}</span>
                        )}
                      </span>
                      <span className="shrink-0 text-[11px] text-stone-400 dark:text-stone-500">{imp.effort[locale]}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-stone-400 dark:text-stone-500">{ui.overview.reachable[locale]}</span>
                    <span className="tabular-nums text-stone-500 dark:text-stone-400">
                      {score} <span className="text-stone-300 dark:text-stone-600">→</span> <span className="font-bold text-stone-900 dark:text-stone-100">{potential}</span>
                    </span>
                  </div>
                  <div className="relative mt-1.5 h-2 overflow-hidden rounded-full bg-stone-900/[0.06] dark:bg-white/10">
                    <motion.div className="absolute inset-y-0 start-0 rounded-full bg-amber-400/40 dark:bg-amber-400/30" initial={{ width: 0 }} animate={{ width: `${potential}%` }} transition={{ duration: 1, ease: EASE }} />
                    <motion.div className="absolute inset-y-0 start-0 rounded-full bg-stone-900 dark:bg-stone-100" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, delay: 0.1, ease: EASE }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="col-span-12 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:col-span-4 lg:grid-cols-1">
          <Card className="flex items-start gap-3 p-5">
            <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', SOFT)}>
              <Sparkles className={cn('h-5 w-5', ACCENT)} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold text-stone-900 dark:text-stone-50">{ui.overview.tipTitle[locale]}</div>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-stone-500 dark:text-stone-400">{ui.overview.tip[locale]}</p>
            </div>
          </Card>
          {current && (
            <button type="button" onClick={() => go('paths')} className="group text-start">
              <Card className="flex h-full items-center gap-3 p-5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]">
                <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', SOFT)}>
                  <BadgeCheck className="h-5 w-5 text-stone-700 dark:text-stone-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">{ui.overview.nextCert[locale]}</div>
                  <div className="mt-0.5 truncate font-bold text-stone-900 dark:text-stone-50">{current.name[locale]}</div>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-stone-300 transition-colors group-hover:text-stone-900 dark:text-stone-600 dark:group-hover:text-white" />
              </Card>
            </button>
          )}
        </div>
      </div>

      {/* Stat strip with serif numerals */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 sm:p-5">
            <Serif className="block text-3xl tracking-tight text-stone-900 dark:text-stone-50 sm:text-4xl">{s.v}</Serif>
            <div className="mt-1 text-[11px] text-stone-400 dark:text-stone-500 sm:text-xs">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Today's connections */}
      <div className="pt-1">
        <div className="mb-1 flex items-end justify-between">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{ui.overview.actionsTitle[locale]}</h2>
          <button type="button" onClick={() => go('contacts')} className="inline-flex items-center gap-1 text-sm font-semibold text-stone-900 hover:text-stone-500 dark:text-stone-100 dark:hover:text-stone-400">
            {ui.overview.openContacts[locale]} <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
          </button>
        </div>
        <p className="text-sm text-stone-400 dark:text-stone-500">{ui.overview.actionsSub[locale]}</p>
        {todays.length > 0 ? (
          <CardGrid items={todays.map((r) => ({ contact: r.contact, kind: r.kind, reason: r.reason[locale] }))} locale={locale} />
        ) : (
          <button
            type="button"
            onClick={() => go('contacts')}
            className={cn('mt-4 flex w-full flex-col items-center gap-1 rounded-[22px] border border-dashed p-8 text-center transition-colors', 'border-stone-300/80 bg-white/40 hover:border-stone-400 dark:border-white/15 dark:bg-white/[0.02] dark:hover:border-white/30')}
          >
            <Network className="h-6 w-6 text-stone-700 dark:text-stone-200" />
            <span className="mt-1 text-sm font-semibold text-stone-900 dark:text-stone-50">{ui.network.locked[locale]}</span>
            <span className={cn('text-xs font-bold', ACCENT)}>{ui.network.upload[locale]}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- paths -- */

function CertTimeline({ path, locale }: { path: CareerPath; locale: Loc }) {
  const { certsDone, toggleCert } = useProgress();
  return (
    <div className="relative">
      {/* connector spine */}
      <div className="absolute bottom-4 top-4 w-px bg-stone-200 ltr:left-[11px] rtl:right-[11px] dark:bg-white/10" />
      <div className="space-y-3">
        {path.certs.map((cert) => {
          const isDone = certsDone[cert.name.en];
          const isCurrent = !isDone && cert.status === 'current';
          return (
            <div key={cert.name.en} className="relative ps-9">
              {/* node */}
              <span
                className={cn(
                  'absolute top-4 grid h-6 w-6 place-items-center rounded-full border text-[10px] ltr:left-0 rtl:right-0',
                  isDone
                    ? 'border-transparent bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : isCurrent
                      ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                      : 'border-stone-300 bg-white text-stone-300 dark:border-white/15 dark:bg-stone-900 dark:text-stone-600',
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
              </span>
              <Card className={cn('p-4', isDone && 'opacity-75')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-stone-900 dark:text-stone-50">{cert.name[locale]}</h4>
                    <p className="mt-1 text-[13px] leading-relaxed text-stone-500 dark:text-stone-400">{cert.desc[locale]}</p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-amber-500/[0.12] px-2 py-1 text-sm font-bold tabular-nums text-amber-700 dark:text-amber-300">+{cert.scoreAdd}</span>
                </div>
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
  const { network } = useNetwork();
  const { level, certsDone } = useProgress();
  const score = path.scoreByLevel[level];
  const done = path.certs.filter((c) => certsDone[c.name.en]).length;
  const totalScore = path.certs.reduce((s, c) => s + c.scoreAdd, 0);
  const picks = network ? rankConnections(network, path.targetCompanies).slice(0, 5) : [];

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
        <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        {ui.paths.back[locale]}
      </button>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{path.name[locale]}</h2>
          {path.primary && <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold', PILL)}>★ {ui.paths.primary[locale]}</span>}
        </div>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{path.targets[locale]}</p>
        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { v: score, l: ui.paths.score[locale] },
            { v: `${done}/${path.certs.length}`, l: ui.paths.statCerts[locale] },
            { v: path.months, l: ui.paths.statMonths[locale] },
            { v: `+${totalScore}`, l: ui.paths.totalScore[locale] },
          ].map((s) => (
            <div key={s.l} className={cn('px-2 py-3 text-center', INSET)}>
              <Serif className="block text-2xl tabular-nums text-stone-900 dark:text-stone-50">{s.v}</Serif>
              <div className="mt-0.5 text-[10px] text-stone-400 dark:text-stone-500">{s.l}</div>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{ui.certs.title[locale]}</h3>
        <p className="mt-0.5 text-sm text-stone-400 dark:text-stone-500">{ui.certs.sub[locale]}</p>
        <div className="mt-4">
          <CertTimeline path={path} locale={locale} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">{ui.paths.picksTitle[locale]}</h3>
        <p className="mt-0.5 text-sm text-stone-400 dark:text-stone-500">{ui.paths.picksSub[locale]}</p>
        {picks.length > 0 ? (
          <CardGrid items={picks.map((r) => ({ contact: r.contact, kind: r.kind, reason: r.reason[locale] }))} locale={locale} />
        ) : (
          <Card className="mt-4 p-6 text-center text-sm text-stone-500 dark:text-stone-400">{ui.network.locked[locale]}</Card>
        )}
      </div>
    </div>
  );
}

function Paths({ locale, selId, setSelId }: { locale: Loc; selId: string | null; setSelId: (id: string | null) => void }) {
  const { paths } = usePlan();
  const { level } = useProgress();
  const selected = selId ? paths.find((p) => p.id === selId) : null;
  if (selected) return <PathDetail path={selected} locale={locale} onBack={() => setSelId(null)} />;

  return (
    <div>
      <Eyebrow>{ui.paths.eyebrow[locale]}</Eyebrow>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{ui.paths.title[locale]}</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{ui.paths.sub[locale]}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {paths.map((p) => {
          const score = p.scoreByLevel[level];
          const totalScore = p.certs.reduce((s, c) => s + c.scoreAdd, 0);
          return (
            <button key={p.id} type="button" onClick={() => setSelId(p.id)} className={cn('group text-start', p.primary && 'sm:col-span-2')}>
              <Card className={cn('h-full p-5 transition-shadow hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.45)]', p.primary && 'border-amber-500/30 dark:border-amber-400/20')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-stone-900 dark:text-stone-50">{p.name[locale]}</h3>
                      {p.primary && <span className={cn('rounded-full px-2 py-0.5 text-[9.5px] font-bold', 'bg-amber-500/15 text-amber-700 dark:text-amber-300')}>★ {ui.paths.primary[locale]}</span>}
                    </div>
                    <p className="mt-1 text-[13px] text-stone-500 dark:text-stone-400">{p.targets[locale]}</p>
                  </div>
                  <Serif className="shrink-0 text-3xl tabular-nums text-stone-900 dark:text-stone-50">{score}</Serif>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-900/[0.06] dark:bg-white/10">
                  <motion.div className="h-full rounded-full bg-stone-900 dark:bg-stone-100" initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.9, ease: EASE }} />
                </div>
                <div className="mt-4 flex items-center gap-4 text-[12px] text-stone-400 dark:text-stone-500">
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
      <span className="shrink-0 text-xs font-semibold text-stone-400 dark:text-stone-500">{label}:</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
            value === o.id ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900' : GHOST,
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NetworkPanel({ locale, count, onFile, onClear }: { locale: Loc; count: number | null; onFile: (f: File) => void; onClear: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const Picker = (
    <input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }} />
  );
  if (count !== null) {
    return (
      <Card className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className={cn('grid h-10 w-10 place-items-center rounded-xl', SOFT)}><Network className="h-5 w-5" /></div>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-50">{ui.network.matched[locale](count)}</div>
            <div className="text-[12.5px] text-stone-500 dark:text-stone-400">{count > 0 ? ui.network.ranked[locale] : ui.network.none[locale]}</div>
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
          <p className="mt-1 text-[13px] leading-relaxed text-stone-500 dark:text-stone-400">{ui.network.body[locale]}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-amber-400/[0.14] px-3 py-2.5 text-[12.5px] font-semibold text-amber-700 dark:text-amber-300">{ui.network.note[locale]}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {([['howPhone', 'phoneSteps'], ['howLaptop', 'laptopSteps']] as const).map(([h, s]) => (
          <div key={h} className={cn('p-3.5', INSET)}>
            <div className="text-sm font-bold text-stone-900 dark:text-stone-50">{ui.network[h][locale]}</div>
            <ol className="mt-2.5 space-y-2">
              {ui.network[s][locale].map((step, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-stone-500 dark:text-stone-400">
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
  const [shown, setShown] = useState(24);
  useEffect(() => setShown(24), [part, query, hrSector, hrTier, network]);

  const cap = TIER_CAP[plan.tier];
  const onFile = (file: File) => {
    const r = new FileReader();
    r.onload = () => setFromCsv(String(r.result ?? ''));
    r.readAsText(file);
  };

  const q = query.trim().toLowerCase();
  const match = (c: Contact) => !q || c.name.en.toLowerCase().includes(q) || c.name.ar.includes(query) || c.company.en.toLowerCase().includes(q) || c.role.en.toLowerCase().includes(q);

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
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{ui.contacts.sub[locale]}</p>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
        {tabs.map((t) => {
          const on = part === t.id;
          return (
            <button key={t.id} type="button" onClick={() => setPart(t.id)} className="text-start">
              <Card className={cn('flex items-center gap-3 p-4 transition-shadow', on ? 'border-stone-900/30 dark:border-white/25' : 'hover:shadow-[0_30px_70px_-34px_rgba(28,25,23,0.4)]')}>
                <t.Icon className={cn('h-5 w-5 shrink-0', on ? 'text-stone-900 dark:text-stone-50' : 'text-stone-400 dark:text-stone-500')} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-50">{t.label}</span>
                    {t.badge !== null && <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums', SOFT)}>{t.badge}</span>}
                  </span>
                  <span className="block truncate text-[11px] text-stone-400 dark:text-stone-500">{t.hint}</span>
                </span>
              </Card>
            </button>
          );
        })}
      </div>

      {part === 'connections' && <NetworkPanel locale={locale} count={network ? ranked.length : null} onFile={onFile} onClear={clear} />}

      {(part === 'hr' || network) && (
        <Card className="mt-3 flex items-center gap-2.5 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-stone-400 dark:text-stone-500" />
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
          <p className="mt-10 text-center text-sm text-stone-400 dark:text-stone-500">{ui.contacts.empty[locale]}</p>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-stone-700 dark:text-stone-200">{ui.contacts.inProgress[locale]} <span className="text-stone-400 dark:text-stone-500">({active.length})</span></h3>
                <CardGrid items={active} locale={locale} />
              </div>
            )}
            <div className="mt-6">
              {active.length > 0 && <h3 className="mb-1 text-sm font-bold text-stone-700 dark:text-stone-200">{ui.contacts.notContacted[locale]}</h3>}
              <CardGrid items={main.slice(0, shown)} locale={locale} />
              {main.length > shown && (
                <div className="mt-5 flex flex-col items-center gap-2">
                  <button type="button" onClick={() => setShown((s) => s + 24)} className={cn('rounded-full px-5 py-2.5 text-sm font-bold', PILL)}>
                    {ui.contacts.showMore[locale](Math.min(24, main.length - shown))}
                  </button>
                  <span className="text-[11px] text-stone-400 dark:text-stone-500">{ui.contacts.showing[locale](Math.min(shown, main.length), main.length)}</span>
                </div>
              )}
            </div>
          </>
        ))}
    </div>
  );
}

/* ---------------------------------------------------------------- tracker -- */

function Tracker({ locale }: { locale: Loc }) {
  const { statuses } = useProgress();
  const vals = Object.values(statuses);
  const replied = vals.filter((s) => s === 'replied').length;
  const followup = vals.filter((s) => s === 'followup').length;
  const pending = vals.filter((s) => s === 'sent').length;
  const sent = replied + followup + pending;
  const rate = sent ? Math.round((replied / sent) * 100) : 0;
  const cards = [
    { v: sent, l: ui.tracker.sent[locale], c: 'text-stone-900 dark:text-stone-50' },
    { v: replied, l: ui.tracker.replied[locale], c: 'text-emerald-600 dark:text-emerald-300' },
    { v: pending, l: ui.tracker.pending[locale], c: 'text-amber-600 dark:text-amber-300' },
    { v: followup, l: ui.tracker.followup[locale], c: 'text-rose-600 dark:text-rose-300' },
  ];
  const legend = [
    { l: ui.tracker.replied[locale], cls: 'bg-emerald-500', w: sent ? (replied / sent) * 100 : 0 },
    { l: ui.tracker.followup[locale], cls: 'bg-amber-400', w: sent ? (followup / sent) * 100 : 0 },
    { l: ui.tracker.pending[locale], cls: 'bg-stone-400', w: sent ? (pending / sent) * 100 : 0 },
  ];

  return (
    <div>
      <Eyebrow>{ui.tracker.eyebrow[locale]}</Eyebrow>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-50">{ui.tracker.title[locale]}</h1>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{ui.tracker.sub[locale]}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.l} className="p-4 sm:p-5">
            <Serif className={cn('block text-4xl tracking-tight', c.c)}>{c.v}</Serif>
            <div className="mt-1 text-xs text-stone-400 dark:text-stone-500">{c.l}</div>
          </Card>
        ))}
      </div>

      {sent === 0 ? (
        <Card className="mt-4 p-6 text-center text-sm text-stone-500 dark:text-stone-400">{ui.tracker.empty[locale]}</Card>
      ) : (
        <>
          <Card className="mt-4 flex items-center gap-4 p-5">
            <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', SOFT)}><TrendingUp className={cn('h-6 w-6', ACCENT)} /></div>
            <div>
              <div className="flex items-baseline gap-1">
                <Serif className="text-4xl tabular-nums text-stone-900 dark:text-stone-50">{rate}</Serif>
                <span className="text-xl font-semibold text-stone-900 dark:text-stone-50">%</span>
                <span className="ms-2 text-sm text-stone-500 dark:text-stone-400">{ui.tracker.replyRate[locale]}</span>
              </div>
              <p className="mt-0.5 text-xs font-semibold text-stone-500 dark:text-stone-400">{ui.tracker.vsBenchmark[locale]}</p>
            </div>
          </Card>
          <Card className="mt-4 p-5">
            <h3 className="text-sm font-bold text-stone-700 dark:text-stone-200">{ui.tracker.breakdown[locale]}</h3>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-stone-900/[0.06] dark:bg-white/10">
              {legend.map((l, i) => <div key={i} className={l.cls} style={{ width: `${l.w}%` }} />)}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {legend.map((l, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  <span className={cn('h-2 w-2 rounded-full', l.cls)} /> {l.l}
                </span>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ command palette -- */

const NAV: { id: Tab; Icon: typeof LayoutDashboard }[] = [
  { id: 'home', Icon: LayoutDashboard },
  { id: 'paths', Icon: Compass },
  { id: 'contacts', Icon: Users },
  { id: 'tracker', Icon: Activity },
];

function CommandPalette({ open, setOpen, locale, go, openPath }: { open: boolean; setOpen: (v: boolean) => void; locale: Loc; go: (t: Tab) => void; openPath: (id: string) => void }) {
  const { paths } = usePlan();
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
        <motion.div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm dark:bg-black/50" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={SPRING}
            className={cn('relative w-full max-w-lg overflow-hidden p-2', CARD)}
          >
            <div className="flex items-center gap-2.5 px-3 py-2">
              <Search className="h-4 w-4 text-stone-400" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder={ui.cmd.placeholder[locale]}
                className="w-full bg-transparent text-[15px] text-stone-900 outline-none placeholder:text-stone-400 dark:text-stone-50 dark:placeholder:text-stone-500"
              />
              <kbd className={cn('rounded-md px-1.5 py-0.5 text-[10px] font-bold', SOFT)}>ESC</kbd>
            </div>
            <div className="mt-1 max-h-[46vh] overflow-y-auto px-1 pb-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-stone-400">{ui.contacts.empty[locale]}</p>
              ) : (
                filtered.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => { c.run(); setOpen(false); }}
                    className={cn('group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors', i === 0 ? 'bg-stone-900/[0.05] dark:bg-white/[0.06]' : 'hover:bg-stone-900/[0.04] dark:hover:bg-white/[0.04]')}
                  >
                    <c.Icon className="h-4 w-4 shrink-0 text-stone-500 dark:text-stone-400" />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-800 dark:text-stone-100">{c.label}</span>
                    <span className="shrink-0 text-[10.5px] font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500">{c.hint}</span>
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

function Shell() {
  const locale = useLocale() as Loc;
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { profile } = usePlan();
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
    <div className="relative min-h-dvh bg-[#f7f6f2] text-stone-900 dark:bg-[#0c0c0f] dark:text-stone-100">
      {/* Background: masked grid + accent wash + film grain */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(28,25,23,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,25,23,0.05) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
            maskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)',
          }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
            maskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 55% at 50% 0%, #000 35%, transparent 78%)',
          }}
        />
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[56rem] -translate-x-1/2 rounded-full bg-amber-300/25 blur-[150px] dark:bg-amber-500/[0.08]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay dark:opacity-[0.05]" style={{ backgroundImage: NOISE }} />
      </div>

      <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-[#f7f6f2]/80 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0c0c0f]/80">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-stone-900 font-extrabold text-white dark:bg-stone-100 dark:text-stone-900">م</span>
            <span className="text-lg font-semibold tracking-tight">مسار</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="me-1 hidden items-center gap-2 text-end sm:flex">
              <div className="leading-tight">
                <div className="text-[11px] text-stone-400 dark:text-stone-500">{ui.shell.greeting[locale]}</div>
                <div className="text-sm font-semibold">{profile.name[locale]}</div>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-stone-700 to-stone-900 text-sm font-bold text-stone-50 dark:from-stone-500 dark:to-stone-700">{profile.name[locale].charAt(0)}</span>
            </div>
            <button type="button" onClick={() => setCmdOpen(true)} aria-label={ui.cmd.placeholder[locale]} className={cn('hidden h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold sm:inline-flex', GHOST)}>
              <Command className="h-3.5 w-3.5" /> K
            </button>
            <ThemeToggle />
            <Link href={pathname} locale={locale === 'ar' ? 'en' : 'ar'} className={cn('grid h-9 w-9 place-items-center rounded-full text-xs font-bold', GHOST)}>
              {locale === 'ar' ? 'EN' : 'ع'}
            </Link>
          </div>
        </div>
      </header>

      {/* Floating segmented nav with a morphing pill */}
      <div className="sticky top-[72px] z-40 mt-4 flex justify-center px-4">
        <nav className={cn('flex gap-1 rounded-full p-1', CARD)}>
          {NAV.map((n) => {
            const on = tab === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => go(n.id)}
                className={cn('relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors', on ? 'text-white dark:text-stone-900' : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100')}
              >
                {on && <motion.span layoutId="v4-nav" className="absolute inset-0 -z-10 rounded-full bg-stone-900 dark:bg-stone-100" transition={SPRING} />}
                <n.Icon className="h-4 w-4" />
                <span>{ui.nav[n.id][locale]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-7 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + (pathSel ?? '')}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            {tab === 'home' && <Home locale={locale} go={go} />}
            {tab === 'paths' && <Paths locale={locale} selId={pathSel} setSelId={setPathSel} />}
            {tab === 'contacts' && <Contacts locale={locale} />}
            {tab === 'tracker' && <Tracker locale={locale} />}
          </motion.div>
        </AnimatePresence>
      </main>

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
