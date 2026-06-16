'use client';

import { Sparkles, ArrowLeft, GraduationCap, BadgeCheck, Gauge, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { rankConnections, planTargets, dailyPicks, ui, type Loc } from '@/lib/app-data';
import { usePlan } from './plan-context';
import { useNetwork } from './dashboard-state';
import { accent, ProgressRing, Counter, SectionHeading, Stagger, StaggerItem } from './ui';
import { ConnectionCard } from './contacts';

export function OverviewSection({
  locale,
  onOpenPath,
  onOpenContacts,
}: {
  locale: Loc;
  onOpenPath: (id: string) => void;
  onOpenContacts: () => void;
}) {
  const plan = usePlan();
  const { primaryPath, journey, cvScore, paths } = plan;
  const { network } = useNetwork();
  const current = primaryPath.certs.find((c) => c.status === 'current');
  const topAreas = [...paths].sort((a, b) => b.score - a.score).slice(0, 3);
  const potential = Math.min(100, cvScore.value + cvScore.improvements.reduce((s, i) => s + i.delta, 0));
  // Today's outreach: a daily-rotating 5 from the customer's ranked network.
  const todays = network
    ? dailyPicks(rankConnections(network, planTargets(plan)), 5, Math.floor(Date.now() / 86_400_000))
    : [];

  return (
    <div>
      <SectionHeading eyebrow={ui.overview.eyebrow[locale]} title={ui.overview.title[locale]} />

      {/* Career journey hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-lift sm:p-7">
        <div aria-hidden className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -start-10 h-52 w-52 rounded-full bg-brand-400/20 blur-2xl" />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <ProgressRing value={journey.percent} color="#ffffff" track="rgba(255,255,255,0.22)">
            <div className="leading-none">
              <Counter to={journey.percent} suffix="%" className="text-3xl font-extrabold" />
              <div className="mt-1 text-[10px] font-medium text-white/75">{ui.overview.journeyLabel[locale]}</div>
            </div>
          </ProgressRing>

          <div className="w-full flex-1">
            <div className="text-sm font-semibold text-white/90">{ui.shell.journey[locale]}</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <div className="text-2xl font-extrabold">
                  <Counter to={journey.certsDone} suffix={`/${journey.certsTotal}`} />
                </div>
                <div className="mt-0.5 text-[11px] text-white/75">{ui.overview.certsLabel[locale]}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold">
                  <Counter to={journey.messagesSent} />
                </div>
                <div className="mt-0.5 text-[11px] text-white/75">{ui.overview.sentLabel[locale]}</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold">
                  <Counter to={journey.replies} />
                </div>
                <div className="mt-0.5 text-[11px] text-white/75">{ui.overview.repliesLabel[locale]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CV competitiveness score */}
      <div className="glass mt-4 rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
          <ProgressRing value={cvScore.value} size={108} stroke={10}>
            <div className="leading-none">
              <Counter to={cvScore.value} className="text-3xl font-extrabold" />
              <div className="mt-1 text-[10px] font-medium text-ink-muted">/ 100</div>
            </div>
          </ProgressRing>

          <div className="min-w-0 flex-1 text-center sm:text-start">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700">
              <Gauge className="h-3.5 w-3.5" />
              {ui.overview.scoreLabel[locale]}
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              {ui.overview.scoreFor[locale]} <span className="font-bold text-ink">{cvScore.target[locale]}</span>
            </p>

            <div className="mt-4 border-t border-white/40 pt-3 text-start">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                <TrendingUp className="h-3.5 w-3.5 text-brand-600" />
                {ui.overview.improvementsTitle[locale]}
              </div>
              <ul className="mt-2.5 space-y-2">
                {cvScore.improvements.map((imp, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[13px]">
                    <span className="inline-flex shrink-0 items-baseline gap-0.5 rounded-md bg-brand-600 px-1.5 py-0.5 text-[11px] font-bold text-white tabular-nums">
                      +{imp.delta}
                    </span>
                    <span className="min-w-0 flex-1 text-ink-soft">
                      {imp.action[locale]}
                      {i === 0 && (
                        <span className="ms-2 whitespace-nowrap rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          {ui.overview.quickWin[locale]}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-ink-muted">{imp.effort[locale]}</span>
                  </li>
                ))}
              </ul>

              {/* Reachable score if all the above are completed */}
              <div className="mt-3.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-ink-muted">{ui.overview.reachable[locale]}</span>
                  <span className="tabular-nums">
                    <span className="text-ink-soft">{cvScore.value}</span>
                    <span className="mx-1 text-ink-muted">→</span>
                    <span className="font-extrabold text-brand-700">{potential}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-brand-200" style={{ width: `${potential}%` }}>
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${(cvScore.value / potential) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top areas, ranked by score */}
      <div className="mt-8">
        <div className="mb-3">
          <h3 className="text-lg font-extrabold tracking-tight">{ui.overview.areasTitle[locale]}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">{ui.overview.areasSub[locale]}</p>
        </div>
        <Stagger className="space-y-2.5">
          {topAreas.map((p) => {
            const a = accent[p.accent];
            return (
              <StaggerItem key={p.id}>
                <button
                  type="button"
                  onClick={() => onOpenPath(p.id)}
                  className="group glass flex w-full items-center gap-3 rounded-2xl p-3.5 text-start transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold">{p.name[locale]}</span>
                      <span className="shrink-0 text-sm font-extrabold tabular-nums" style={{ color: a.stroke }}>
                        {p.score}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5">
                      <div className={cn('h-full rounded-full', a.bar)} style={{ width: `${p.score}%` }} />
                    </div>
                  </div>
                  <ArrowLeft className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
                </button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      {/* Today's top move */}
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/70 p-4 backdrop-blur-sm">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-700">{ui.overview.tipTitle[locale]}</h4>
          <p className="mt-0.5 text-[13px] leading-relaxed text-ink-soft">{ui.overview.tip[locale]}</p>
        </div>
      </div>

      {/* Current certification */}
      {current && (
        <button
          type="button"
          onClick={() => onOpenPath(primaryPath.id)}
          className="group glass mt-4 flex w-full items-center gap-4 rounded-2xl p-4 text-start transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              {ui.overview.nextCert[locale]}
            </div>
            <div className="mt-0.5 truncate font-bold">{current.name[locale]}</div>
            {current.hadafNote && (
              <div className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                {current.hadafNote[locale]}
              </div>
            )}
          </div>
          <ArrowLeft className="h-5 w-5 shrink-0 text-ink-muted transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1" />
        </button>
      )}

      {/* Today's actions */}
      <div className="mt-8 mb-4 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight">{ui.overview.actionsTitle[locale]}</h3>
          <p className="mt-0.5 text-sm text-ink-muted">{ui.overview.actionsSub[locale]}</p>
        </div>
        <button
          type="button"
          onClick={onOpenContacts}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-900 sm:inline-flex"
        >
          {ui.overview.openContacts[locale]}
          <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
        </button>
      </div>

      {todays.length > 0 ? (
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {todays.map((r) => (
            <StaggerItem key={r.contact.id} className="h-full">
              <ConnectionCard contact={r.contact} locale={locale} kind={r.kind} reason={r.reason[locale]} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <button
          type="button"
          onClick={onOpenContacts}
          className="glass flex w-full flex-col items-center gap-1 rounded-2xl p-6 text-center transition-shadow hover:shadow-lift"
        >
          <span className="text-sm font-semibold text-ink">{ui.network.locked[locale]}</span>
          <span className="text-xs font-bold text-brand-700">{ui.network.upload[locale]}</span>
        </button>
      )}

      <button
        type="button"
        onClick={onOpenContacts}
        className="glass mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold text-brand-700 hover:shadow-lift sm:hidden"
      >
        {ui.overview.openContacts[locale]}
        <ArrowLeft className="h-4 w-4 ltr:rotate-180" />
      </button>
    </div>
  );
}
