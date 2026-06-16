'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
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
  Crown,
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

const EASE = [0.16, 1, 0.3, 1] as const;
const INK = '#1d1d1f'; // Apple graphite
type Tab = 'home' | 'paths' | 'contacts' | 'tracker';

/* --------------------------------------------------------------- primitives --
   Apple "Liquid Glass": the material is CLEAR and neutral. It refracts the vivid
   wallpaper behind it (that is where color comes from), has a bright specular edge
   (glass-edge), heavy blur + saturation, generous rounding, and a soft deep
   shadow. The chrome itself is monochrome graphite/white; no brand fill. */

function Glass({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'glass-edge rounded-[26px] border border-white/55 bg-white/40 shadow-[0_28px_80px_-32px_rgba(20,22,48,0.45)] ring-1 ring-white/40 backdrop-blur-2xl backdrop-saturate-[2]',
        className,
      )}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">{children}</div>;
}

const KIND_META: Record<PickKind, { cls: string; Icon: typeof Crown; key: 'kindTop' | 'kindMid' | 'kindCommon' }> = {
  top: { cls: 'text-zinc-900', Icon: Crown, key: 'kindTop' },
  mid: { cls: 'text-amber-600', Icon: User, key: 'kindMid' },
  common: { cls: 'text-violet-600', Icon: Sparkles, key: 'kindCommon' },
};

const STATUS_BTNS: { key: ContactStatus; sk: 'status_sent' | 'status_replied' | 'status_followup'; on: string }[] = [
  { key: 'sent', sk: 'status_sent', on: 'bg-zinc-900 text-white' },
  { key: 'replied', sk: 'status_replied', on: 'bg-blue-600 text-white' },
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
    <Glass className="flex h-full flex-col p-4 transition-shadow duration-300 hover:shadow-[0_34px_90px_-32px_rgba(20,22,48,0.55)]">
      <div className="flex items-start gap-3">
        <Avatar initials={c.name[locale].charAt(0)} companyKey={c.companyKey} seed={c.company.en} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-semibold text-zinc-900">{c.name[locale]}</h3>
            {isRecruiter && (
              <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                {ui.contacts.recruiter[locale]}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] text-zinc-500">{c.role[locale]}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-zinc-600">{c.company[locale]}</p>
        </div>
      </div>

      {isRecruiter && (c.sector || c.companyTier) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.sector && SECTOR_LABELS[c.sector] && (
            <span className="rounded-md bg-zinc-900/[0.05] px-2 py-0.5 text-[10.5px] font-semibold text-zinc-600">
              {SECTOR_LABELS[c.sector][locale]}
            </span>
          )}
          {c.companyTier && (
            <span className="rounded-md bg-zinc-900/[0.05] px-2 py-0.5 text-[10.5px] font-semibold text-zinc-500">
              {TIER_LABELS[c.companyTier][locale]}
            </span>
          )}
        </div>
      )}

      {kind && reason && (
        <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-white/50 px-2.5 py-1.5 text-[11px]">
          {(() => {
            const I = KIND_META[kind].Icon;
            return <I className={cn('mt-0.5 h-3 w-3 shrink-0', KIND_META[kind].cls)} />;
          })()}
          <span className="text-zinc-600">
            <span className={cn('font-bold', KIND_META[kind].cls)}>{ui.paths[KIND_META[kind].key][locale]}</span> · {reason}
          </span>
        </div>
      )}

      <div className="mt-3 border-t border-zinc-900/[0.07] pt-3">
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
                  active ? b.on : 'bg-white/60 text-zinc-500 hover:text-zinc-900',
                )}
              >
                {ui.contacts[b.sk][locale]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex-1">
        <div className="mb-1.5 flex items-start gap-1.5 rounded-xl bg-amber-400/15 px-2.5 py-1.5 text-[11px] leading-relaxed text-amber-700">
          <PenLine className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{ui.contacts.handwrite[locale]}</span>
        </div>
        <div className="rounded-2xl border border-white/60 bg-white/45 p-3">
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="truncate text-[11px] font-semibold text-zinc-400">
              {ui.contacts.messagePreview[locale]} · {template.title[locale]}
            </span>
            <button
              type="button"
              onClick={() => setMsgLang((l) => (l === 'ar' ? 'en' : 'ar'))}
              title={ui.contacts.msgLangHint[locale]}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-900/10 bg-white/70 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 hover:text-zinc-900"
            >
              <Languages className="h-3 w-3" />
              {msgLang === 'ar' ? 'EN' : 'ع'}
            </button>
          </div>
          <p dir={msgLang === 'ar' ? 'rtl' : 'ltr'} className="line-clamp-3 text-[12.5px] leading-relaxed text-zinc-500">
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
            copied ? 'bg-zinc-900/[0.06] text-zinc-700' : 'bg-zinc-900 text-white hover:bg-zinc-800',
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? ui.contacts.copied[locale] : ui.contacts.copy[locale]}
        </button>
        <button
          type="button"
          onClick={() => setTpl((i) => i + 1)}
          title={ui.contacts.shuffle[locale]}
          className="grid w-11 shrink-0 place-items-center rounded-full border border-zinc-900/10 bg-white/60 text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <a
          href={linkedinUrl(c)}
          target="_blank"
          rel="noopener noreferrer"
          title={ui.contacts.linkedin[locale]}
          className="grid w-11 shrink-0 place-items-center rounded-full border border-zinc-900/10 bg-white/60 text-blue-600 transition-colors hover:bg-white"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </Glass>
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
    <div className="space-y-5">
      <Glass className="p-6 sm:p-9">
        <div className="grid gap-9 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-4">
            <ProgressRing value={score} size={160} stroke={9} color={INK} track="rgba(20,22,48,0.08)">
              <div className="leading-none">
                <Counter to={score} className="text-5xl font-semibold tracking-tight text-zinc-900" />
                <div className="mt-1 text-[11px] font-medium text-zinc-400">/ 100</div>
              </div>
            </ProgressRing>
            <div className="inline-flex rounded-full border border-white/60 bg-white/50 p-0.5 backdrop-blur">
              {LEVELS.map((lv) => (
                <button
                  key={lv.id}
                  type="button"
                  onClick={() => setLevel(lv.id)}
                  className={cn(
                    'rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-colors',
                    level === lv.id ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900',
                  )}
                >
                  {lv.label[locale]}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <Eyebrow>{ui.overview.scoreLabel[locale]}</Eyebrow>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl">{cvScore.target[locale]}</h1>
            <p className="mt-1.5 text-sm text-zinc-500">{ui.overview.levelHint[locale]}</p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/60 bg-white/40 px-3 py-3 text-center">
                  <div className="text-xl font-semibold text-zinc-900">{s.v}</div>
                  <div className="mt-0.5 text-[11px] text-zinc-400">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700">
                <TrendingUp className="h-3.5 w-3.5 text-zinc-900" />
                {ui.overview.improvementsTitle[locale]}
              </div>
              <ul className="mt-2.5 space-y-2">
                {cvScore.improvements.map((imp, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13px]">
                    <span className="shrink-0 rounded-md bg-zinc-900/[0.07] px-1.5 py-0.5 text-[11px] font-bold text-zinc-800 tabular-nums">+{imp.delta}</span>
                    <span className="min-w-0 flex-1 text-zinc-600">
                      {imp.action[locale]}
                      {i === 0 && (
                        <span className="ms-2 whitespace-nowrap rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          {ui.overview.quickWin[locale]}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-[11px] text-zinc-400">{imp.effort[locale]}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-zinc-400">{ui.overview.reachable[locale]}</span>
                  <span className="tabular-nums text-zinc-500">
                    {score} <span className="text-zinc-300">→</span> <span className="font-bold text-zinc-900">{potential}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-900/[0.07]">
                  <div className="h-full rounded-full bg-zinc-900/25" style={{ width: `${potential}%` }}>
                    <div className="h-full rounded-full bg-zinc-900" style={{ width: `${(score / potential) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Glass>

      <div className="grid gap-4 sm:grid-cols-2">
        <Glass className="flex items-start gap-3 p-5">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/60 text-zinc-800">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-900">{ui.overview.tipTitle[locale]}</div>
            <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-500">{ui.overview.tip[locale]}</p>
          </div>
        </Glass>
        {current && (
          <button type="button" onClick={() => go('paths')} className="group text-start">
            <Glass className="flex h-full items-center gap-3 p-5 transition-shadow hover:shadow-[0_34px_90px_-32px_rgba(20,22,48,0.55)]">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/60 text-zinc-800">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{ui.overview.nextCert[locale]}</div>
                <div className="mt-0.5 truncate font-bold text-zinc-900">{current.name[locale]}</div>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-900" />
            </Glass>
          </button>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-end justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">{ui.overview.actionsTitle[locale]}</h2>
          <button type="button" onClick={() => go('contacts')} className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-900 hover:text-zinc-600">
            {ui.overview.openContacts[locale]} <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
          </button>
        </div>
        <p className="text-sm text-zinc-400">{ui.overview.actionsSub[locale]}</p>
        {todays.length > 0 ? (
          <CardGrid items={todays.map((r) => ({ contact: r.contact, kind: r.kind, reason: r.reason[locale] }))} locale={locale} />
        ) : (
          <button
            type="button"
            onClick={() => go('contacts')}
            className="mt-4 flex w-full flex-col items-center gap-1 rounded-[26px] border border-dashed border-zinc-900/15 bg-white/35 p-8 text-center backdrop-blur transition-colors hover:border-zinc-900/30"
          >
            <Network className="h-6 w-6 text-zinc-700" />
            <span className="mt-1 text-sm font-semibold text-zinc-900">{ui.network.locked[locale]}</span>
            <span className="text-xs font-bold text-zinc-600">{ui.network.upload[locale]}</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- paths -- */

function PathDetail({ path, locale, onBack }: { path: CareerPath; locale: Loc; onBack: () => void }) {
  const { network } = useNetwork();
  const { level, certsDone, toggleCert } = useProgress();
  const score = path.scoreByLevel[level];
  const done = path.certs.filter((c) => certsDone[c.name.en]).length;
  const totalScore = path.certs.reduce((s, c) => s + c.scoreAdd, 0);
  const picks = network ? rankConnections(network, path.targetCompanies).slice(0, 5) : [];

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900">
        <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        {ui.paths.back[locale]}
      </button>

      <Glass className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{path.name[locale]}</h2>
          {path.primary && <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold text-white">★ {ui.paths.primary[locale]}</span>}
        </div>
        <p className="mt-1 text-sm text-zinc-500">{path.targets[locale]}</p>
        <div className="mt-5 grid grid-cols-4 gap-3">
          {[
            { v: score, l: ui.paths.score[locale] },
            { v: `${done}/${path.certs.length}`, l: ui.paths.statCerts[locale] },
            { v: path.months, l: ui.paths.statMonths[locale] },
            { v: `+${totalScore}`, l: ui.paths.totalScore[locale] },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-white/60 bg-white/40 px-2 py-3 text-center">
              <div className="text-lg font-semibold text-zinc-900 tabular-nums">{s.v}</div>
              <div className="mt-0.5 text-[10px] text-zinc-400">{s.l}</div>
            </div>
          ))}
        </div>
      </Glass>

      <div>
        <h3 className="text-lg font-semibold text-zinc-900">{ui.certs.title[locale]}</h3>
        <p className="mt-0.5 text-sm text-zinc-400">{ui.certs.sub[locale]}</p>
        <div className="mt-4 space-y-3">
          {path.certs.map((cert) => {
            const isDone = certsDone[cert.name.en];
            return (
              <Glass key={cert.name.en} className={cn('p-4', isDone && 'opacity-75')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-zinc-900">{cert.name[locale]}</h4>
                    <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{cert.desc[locale]}</p>
                  </div>
                  <span className="shrink-0 rounded-xl bg-zinc-900/[0.07] px-2 py-1 text-sm font-bold text-zinc-800 tabular-nums">+{cert.scoreAdd}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {cert.hadaf && <span className="rounded-md bg-zinc-900/[0.05] px-2 py-1 text-[11px] font-semibold text-zinc-700">{ui.certs.hadaf[locale]}</span>}
                  <span className="rounded-md bg-zinc-900/[0.05] px-2 py-1 text-[11px] font-semibold text-zinc-600">{cert.cost[locale]}</span>
                  <span className="rounded-md bg-zinc-900/[0.05] px-2 py-1 text-[11px] font-semibold text-zinc-500">{cert.duration[locale]}</span>
                  <div className="ms-auto flex gap-2">
                    <a href={cert.official} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-zinc-900/10 bg-white/60 px-3 py-1.5 text-[12px] font-semibold text-zinc-600 hover:text-zinc-900">
                      <ExternalLink className="h-3.5 w-3.5" /> {ui.certs.official[locale]}
                    </a>
                    <button
                      type="button"
                      onClick={() => toggleCert(cert.name.en)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold transition-colors',
                        isDone ? 'bg-zinc-900 text-white' : 'border border-zinc-900/10 bg-white/60 text-zinc-600 hover:text-zinc-900',
                      )}
                    >
                      <Check className="h-3.5 w-3.5" /> {isDone ? ui.certs.markedDone[locale] : ui.certs.markDone[locale]}
                    </button>
                  </div>
                </div>
              </Glass>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-900">{ui.paths.picksTitle[locale]}</h3>
        <p className="mt-0.5 text-sm text-zinc-400">{ui.paths.picksSub[locale]}</p>
        {picks.length > 0 ? (
          <CardGrid items={picks.map((r) => ({ contact: r.contact, kind: r.kind, reason: r.reason[locale] }))} locale={locale} />
        ) : (
          <Glass className="mt-4 p-6 text-center text-sm text-zinc-500">{ui.network.locked[locale]}</Glass>
        )}
      </div>
    </div>
  );
}

function Paths({ locale }: { locale: Loc }) {
  const { paths } = usePlan();
  const { level } = useProgress();
  const [sel, setSel] = useState<string | null>(null);
  const selected = sel ? paths.find((p) => p.id === sel) : null;
  if (selected) return <PathDetail path={selected} locale={locale} onBack={() => setSel(null)} />;

  return (
    <div>
      <Eyebrow>{ui.paths.eyebrow[locale]}</Eyebrow>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{ui.paths.title[locale]}</h1>
      <p className="mt-1 text-sm text-zinc-500">{ui.paths.sub[locale]}</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {paths.map((p) => {
          const score = p.scoreByLevel[level];
          const totalScore = p.certs.reduce((s, c) => s + c.scoreAdd, 0);
          return (
            <button key={p.id} type="button" onClick={() => setSel(p.id)} className="group text-start">
              <Glass className={cn('h-full p-5 transition-shadow hover:shadow-[0_34px_90px_-32px_rgba(20,22,48,0.55)]', p.primary && 'ring-2 ring-zinc-900/15')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-zinc-900">{p.name[locale]}</h3>
                    <p className="mt-1 text-[13px] text-zinc-500">{p.targets[locale]}</p>
                  </div>
                  {p.primary && <span className="shrink-0 rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white">★</span>}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-500">{ui.paths.score[locale]}</span>
                  <span className="font-bold text-zinc-900 tabular-nums">{score}<span className="ms-1 text-[10px] text-zinc-400">{ui.paths.scoreOf[locale]}</span></span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-900/[0.08]">
                  <div className="h-full rounded-full bg-zinc-900" style={{ width: `${score}%` }} />
                </div>
                <div className="mt-4 flex items-center gap-4 text-[12px] text-zinc-400">
                  <span><span className="font-bold text-zinc-600">{p.certs.length}</span> {ui.paths.statCerts[locale]}</span>
                  <span><span className="font-bold text-zinc-600">{p.months}</span> {ui.paths.statMonths[locale]}</span>
                  <span><span className="font-bold text-zinc-800">+{totalScore}</span> {ui.paths.totalScore[locale]}</span>
                  <ArrowUpRight className="ms-auto h-4 w-4 text-zinc-300 transition-colors group-hover:text-zinc-900" />
                </div>
              </Glass>
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
      <span className="shrink-0 text-xs font-semibold text-zinc-400">{label}:</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
            value === o.id ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-white/70 bg-white/55 text-zinc-500 hover:text-zinc-900',
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
      <Glass className="mt-4 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/60 text-zinc-800"><Network className="h-5 w-5" /></div>
          <div>
            <div className="font-bold text-zinc-900">{ui.network.matched[locale](count)}</div>
            <div className="text-[12.5px] text-zinc-500">{count > 0 ? ui.network.ranked[locale] : ui.network.none[locale]}</div>
          </div>
        </div>
        <button type="button" onClick={onClear} className="inline-flex items-center gap-1.5 rounded-full border border-zinc-900/10 bg-white/60 px-3.5 py-1.5 text-sm font-semibold text-zinc-600 hover:text-zinc-900">
          <X className="h-4 w-4" /> {ui.network.clear[locale]}
        </button>
        {Picker}
      </Glass>
    );
  }
  return (
    <Glass className="mt-4 p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/60 text-zinc-800"><Network className="h-5 w-5" /></div>
        <div>
          <h3 className="text-base font-semibold text-zinc-900">{ui.network.title[locale]}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">{ui.network.body[locale]}</p>
        </div>
      </div>
      <div className="mt-4 rounded-2xl bg-amber-400/15 px-3 py-2.5 text-[12.5px] font-semibold text-amber-700">{ui.network.note[locale]}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {([['howPhone', 'phoneSteps'], ['howLaptop', 'laptopSteps']] as const).map(([h, s]) => (
          <div key={h} className="rounded-2xl border border-white/60 bg-white/40 p-3.5">
            <div className="text-sm font-bold text-zinc-900">{ui.network[h][locale]}</div>
            <ol className="mt-2.5 space-y-2">
              {ui.network[s][locale].map((step, i) => (
                <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-zinc-500">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-zinc-900/[0.08] text-[11px] font-bold text-zinc-700 tabular-nums">{i + 1}</span>
                  <span className="flex-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800">
        <Upload className="h-4 w-4" /> {ui.network.upload[locale]}
      </button>
      {Picker}
    </Glass>
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
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{ui.contacts.title[locale]}</h1>
      <p className="mt-1 text-sm text-zinc-500">{ui.contacts.sub[locale]}</p>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {tabs.map((t) => {
          const on = part === t.id;
          return (
            <button key={t.id} type="button" onClick={() => setPart(t.id)} className="text-start">
              <Glass className={cn('flex items-center gap-3 p-4 transition-shadow', on ? 'ring-2 ring-zinc-900/15' : 'hover:shadow-[0_34px_90px_-32px_rgba(20,22,48,0.5)]')}>
                <t.Icon className={cn('h-5 w-5 shrink-0', on ? 'text-zinc-900' : 'text-zinc-400')} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-zinc-900">{t.label}</span>
                    {t.badge !== null && <span className="rounded-full bg-zinc-900/[0.07] px-1.5 py-0.5 text-[10px] font-bold text-zinc-500 tabular-nums">{t.badge}</span>}
                  </span>
                  <span className="block truncate text-[11px] text-zinc-400">{t.hint}</span>
                </span>
              </Glass>
            </button>
          );
        })}
      </div>

      {part === 'connections' && <NetworkPanel locale={locale} count={network ? ranked.length : null} onFile={onFile} onClear={clear} />}

      {(part === 'hr' || network) && (
        <Glass className="mt-3 flex items-center gap-2.5 px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui.contacts.search[locale]} className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400" />
        </Glass>
      )}

      {part === 'hr' && (
        <div className="mt-3 space-y-2">
          <Chips label={ui.contacts.sector[locale]} value={hrSector} onChange={setHrSector} options={[{ id: 'all', label: ui.contacts.allSectors[locale] }, ...hrSectors.map((s) => ({ id: s, label: SECTOR_LABELS[s]?.[locale] ?? s }))]} />
          <Chips label={ui.contacts.companySize[locale]} value={hrTier} onChange={setHrTier} options={[{ id: 'all' as const, label: ui.contacts.allSizes[locale] }, ...hrTiers.map((t) => ({ id: t, label: TIER_LABELS[t][locale] }))]} />
        </div>
      )}

      {(part === 'hr' || network) &&
        (items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-zinc-400">{ui.contacts.empty[locale]}</p>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-zinc-700">{ui.contacts.inProgress[locale]} <span className="text-zinc-400">({active.length})</span></h3>
                <CardGrid items={active} locale={locale} />
              </div>
            )}
            <div className="mt-6">
              {active.length > 0 && <h3 className="mb-1 text-sm font-bold text-zinc-700">{ui.contacts.notContacted[locale]}</h3>}
              <CardGrid items={main.slice(0, shown)} locale={locale} />
              {main.length > shown && (
                <div className="mt-5 flex flex-col items-center gap-2">
                  <button type="button" onClick={() => setShown((s) => s + 24)} className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800">
                    {ui.contacts.showMore[locale](Math.min(24, main.length - shown))}
                  </button>
                  <span className="text-[11px] text-zinc-400">{ui.contacts.showing[locale](Math.min(shown, main.length), main.length)}</span>
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
    { v: sent, l: ui.tracker.sent[locale], c: 'text-zinc-900' },
    { v: replied, l: ui.tracker.replied[locale], c: 'text-blue-600' },
    { v: pending, l: ui.tracker.pending[locale], c: 'text-amber-600' },
    { v: followup, l: ui.tracker.followup[locale], c: 'text-rose-600' },
  ];
  const legend = [
    { l: ui.tracker.replied[locale], cls: 'bg-blue-500', w: sent ? (replied / sent) * 100 : 0 },
    { l: ui.tracker.followup[locale], cls: 'bg-amber-400', w: sent ? (followup / sent) * 100 : 0 },
    { l: ui.tracker.pending[locale], cls: 'bg-zinc-400', w: sent ? (pending / sent) * 100 : 0 },
  ];

  return (
    <div>
      <Eyebrow>{ui.tracker.eyebrow[locale]}</Eyebrow>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">{ui.tracker.title[locale]}</h1>
      <p className="mt-1 text-sm text-zinc-500">{ui.tracker.sub[locale]}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Glass key={c.l} className="p-4">
            <div className={cn('text-3xl font-semibold tracking-tight', c.c)}>{c.v}</div>
            <div className="mt-1 text-xs text-zinc-400">{c.l}</div>
          </Glass>
        ))}
      </div>

      {sent === 0 ? (
        <Glass className="mt-4 p-6 text-center text-sm text-zinc-500">{ui.tracker.empty[locale]}</Glass>
      ) : (
        <>
          <Glass className="mt-4 flex items-center gap-4 p-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/60 text-zinc-800"><TrendingUp className="h-6 w-6" /></div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold tabular-nums text-zinc-900">{rate}</span>
                <span className="text-xl font-semibold text-zinc-900">%</span>
                <span className="ms-2 text-sm text-zinc-500">{ui.tracker.replyRate[locale]}</span>
              </div>
              <p className="mt-0.5 text-xs font-semibold text-zinc-500">{ui.tracker.vsBenchmark[locale]}</p>
            </div>
          </Glass>
          <Glass className="mt-4 p-5">
            <h3 className="text-sm font-bold text-zinc-700">{ui.tracker.breakdown[locale]}</h3>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-zinc-900/[0.07]">
              {legend.map((l, i) => <div key={i} className={l.cls} style={{ width: `${l.w}%` }} />)}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {legend.map((l, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
                  <span className={cn('h-2 w-2 rounded-full', l.cls)} /> {l.l}
                </span>
              ))}
            </div>
          </Glass>
        </>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- shell -- */

const NAV: { id: Tab; Icon: typeof LayoutDashboard }[] = [
  { id: 'home', Icon: LayoutDashboard },
  { id: 'paths', Icon: Compass },
  { id: 'contacts', Icon: Users },
  { id: 'tracker', Icon: Activity },
];

function Shell() {
  const locale = useLocale() as Loc;
  const pathname = usePathname();
  const { profile } = usePlan();
  const [tab, setTab] = useState<Tab>('home');

  // v3 is a light glass world; never inherit the global dark theme.
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="relative min-h-dvh text-zinc-900">
      {/* Vivid cool wallpaper, so the clear glass has rich color to refract. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#e7e9f1]" />
        <div className="absolute -top-32 start-[15%] h-[34rem] w-[34rem] rounded-full bg-indigo-400/45 blur-[120px]" />
        <div className="absolute top-[10%] end-[5%] h-[30rem] w-[30rem] rounded-full bg-sky-400/45 blur-[120px]" />
        <div className="absolute top-[40%] start-[40%] h-[26rem] w-[26rem] rounded-full bg-fuchsia-300/40 blur-[120px]" />
        <div className="absolute bottom-0 start-0 h-[30rem] w-[30rem] rounded-full bg-violet-400/40 blur-[120px]" />
        <div className="absolute bottom-[5%] end-[10%] h-[26rem] w-[26rem] rounded-full bg-rose-300/40 blur-[120px]" />
      </div>

      {/* Slim translucent header */}
      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/35 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-2xl bg-zinc-900 font-extrabold text-white">م</span>
            <span className="text-lg font-semibold tracking-tight">مسار</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-end sm:flex">
              <div className="leading-tight">
                <div className="text-[11px] text-zinc-400">{ui.shell.greeting[locale]}</div>
                <div className="text-sm font-semibold">{profile.name[locale]}</div>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-sm font-bold text-white">{profile.name[locale].charAt(0)}</span>
            </div>
            <Link href={pathname} locale={locale === 'ar' ? 'en' : 'ar'} className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/50 text-xs font-bold text-zinc-600 hover:text-zinc-900">
              {locale === 'ar' ? 'EN' : 'ع'}
            </Link>
          </div>
        </div>
      </header>

      {/* Floating clear-glass nav pill */}
      <div className="sticky top-20 z-40 flex justify-center px-4">
        <nav className="glass-edge flex gap-1 rounded-full border border-white/60 bg-white/45 p-1 shadow-[0_16px_50px_-16px_rgba(20,22,48,0.4)] ring-1 ring-white/40 backdrop-blur-2xl backdrop-saturate-[2]">
          {NAV.map((n) => {
            const on = tab === n.id;
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setTab(n.id)}
                className={cn('relative flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors', on ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-800')}
              >
                {on && <motion.span layoutId="glass-nav" className="absolute inset-0 -z-10 rounded-full bg-white/90 shadow-sm" transition={{ duration: 0.3, ease: EASE }} />}
                <n.Icon className="h-4 w-4" />
                <span>{ui.nav[n.id][locale]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <main className="mx-auto w-full max-w-5xl px-5 pb-12 pt-8 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: EASE }}>
            {tab === 'home' && <Home locale={locale} go={setTab} />}
            {tab === 'paths' && <Paths locale={locale} />}
            {tab === 'contacts' && <Contacts locale={locale} />}
            {tab === 'tracker' && <Tracker locale={locale} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export function Glass3() {
  const plan = usePlan();
  const initialCertsDone = plan.paths.flatMap((p) => p.certs).filter((c) => c.status === 'done').map((c) => c.name.en);
  return (
    <DashboardState slug={plan.slug} initialCertsDone={initialCertsDone}>
      <Shell />
    </DashboardState>
  );
}
