'use client';

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Briefcase, Landmark, Cpu, Route, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { contactById, ui, type CareerPath, type Contact, type PathPick, type Loc } from '@/lib/app-data';
import { usePlan } from './plan-context';
import { accent, SectionHeading, Stagger, StaggerItem } from './ui';
import { CertificationsSection } from './certifications';
import { ConnectionCard } from './contacts';

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS = {
  finance: TrendingUp,
  energy: Zap,
  consulting: Briefcase,
  government: Landmark,
  tech: Cpu,
} as const;

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="rounded-xl border border-white/50 bg-white/40 px-2 py-2.5 text-center">
      <div className="text-base font-extrabold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[10px] font-medium leading-tight text-ink-muted">{label}</div>
    </div>
  );
}

function MatchBar({ path, locale }: { path: CareerPath; locale: Loc }) {
  const a = accent[path.accent];
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink-soft">{ui.paths.match[locale]}</span>
        <span className="font-extrabold tabular-nums" style={{ color: a.stroke }}>
          {path.matchPercent}%
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5">
        <motion.div
          className={cn('h-full rounded-full', a.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${path.matchPercent}%` }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
        />
      </div>
    </div>
  );
}

function PathCard({ path, locale, onOpen }: { path: CareerPath; locale: Loc; onOpen: () => void }) {
  const a = accent[path.accent];
  const Icon = ICONS[path.icon];
  const totalScore = path.certs.reduce((s, c) => s + c.scoreAdd, 0);
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group glass relative h-full w-full overflow-hidden rounded-3xl p-5 text-start transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift',
        path.primary && 'ring-1 ring-brand-200',
      )}
    >
      {path.primary && (
        <span className="absolute end-5 top-0 rounded-b-lg bg-brand-600 px-2.5 py-1 text-[10px] font-bold text-white">
          ★ {ui.paths.primary[locale]}
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-soft', a.grad)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1 pe-12">
          <h3 className="text-[15px] font-extrabold leading-tight">{path.name[locale]}</h3>
          <p className="mt-1 text-[13px] text-ink-soft">{path.targets[locale]}</p>
        </div>
      </div>

      <div className="mt-4">
        <MatchBar path={path} locale={locale} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Stat value={path.certs.length} label={ui.paths.statCerts[locale]} />
        <Stat value={path.months} label={ui.paths.statMonths[locale]} />
        <Stat value={`+${totalScore}`} label={ui.paths.totalScore[locale]} />
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl border border-dashed border-white/60 bg-white/30 px-3 py-2.5">
        <Route className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" />
        <p className="text-[11px] leading-relaxed text-ink-soft" dir="ltr">
          <span className="font-semibold text-ink">{ui.paths.roadmap[locale]}: </span>
          {path.trail[locale]}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 text-sm font-bold" style={{ color: a.stroke }}>
        {ui.paths.open[locale]}
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
      </div>
    </button>
  );
}

function PathDetail({ path, locale, onBack }: { path: CareerPath; locale: Loc; onBack: () => void }) {
  const plan = usePlan();
  const a = accent[path.accent];
  const Icon = ICONS[path.icon];
  const [doneNames, setDoneNames] = useState<Set<string>>(
    () => new Set(path.certs.filter((c) => c.status === 'done').map((c) => c.name.en)),
  );
  const toggleDone = (name: string) =>
    setDoneNames((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  const done = doneNames.size;
  const total = path.certs.length;
  const totalScore = path.certs.reduce((s, c) => s + c.scoreAdd, 0);
  const picks = path.picks
    .map((p) => ({ pick: p, contact: contactById(plan, p.id) }))
    .filter((x): x is { pick: PathPick; contact: Contact } => x.contact !== undefined);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        {ui.paths.back[locale]}
      </button>

      {/* Path header */}
      <div className="glass mt-4 rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <div className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-soft', a.grad)}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight">{path.name[locale]}</h2>
              {path.primary && (
                <span className="rounded-md bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  ★ {ui.paths.primary[locale]}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-ink-soft">{path.targets[locale]}</p>
          </div>
        </div>
        <div className="mt-4">
          <MatchBar path={path} locale={locale} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat value={`${done}/${total}`} label={ui.paths.statCerts[locale]} />
          <Stat value={path.months} label={ui.paths.statMonths[locale]} />
          <Stat value={`+${totalScore}`} label={ui.paths.totalScore[locale]} />
        </div>
      </div>

      <div className="mt-6">
        <CertificationsSection certs={path.certs} locale={locale} doneNames={doneNames} onToggle={toggleDone} />
      </div>

      {/* Top connections to reach out to */}
      {picks.length > 0 && (
        <div className="mt-8">
          <SectionHeading title={ui.paths.picksTitle[locale]} sub={ui.paths.picksSub[locale]} />
          <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {picks.map(({ pick, contact }) => (
              <StaggerItem key={pick.id} className="h-full">
                <ConnectionCard contact={contact} locale={locale} kind={pick.kind} reason={pick.reason[locale]} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      )}
    </div>
  );
}

export function PathsSection({
  locale,
  selectedId,
  onSelect,
}: {
  locale: Loc;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { paths } = usePlan();
  const selected = selectedId ? paths.find((p) => p.id === selectedId) : null;

  if (selected) {
    return <PathDetail key={selected.id} path={selected} locale={locale} onBack={() => onSelect(null)} />;
  }

  return (
    <div>
      <SectionHeading eyebrow={ui.paths.eyebrow[locale]} title={ui.paths.title[locale]} sub={ui.paths.sub[locale]} />
      <Stagger className="grid gap-4 lg:grid-cols-2">
        {paths.map((p) => (
          <StaggerItem key={p.id} className={cn('h-full', p.primary && 'lg:col-span-2')}>
            <PathCard path={p} locale={locale} onOpen={() => onSelect(p.id)} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
