'use client';

import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ui, type Loc } from '@/lib/app-data';
import { useProgress } from './dashboard-state';
import { StatCard, SectionHeading } from './ui';

export function TrackerSection({ locale }: { locale: Loc }) {
  const { statuses } = useProgress();
  const vals = Object.values(statuses);
  const replied = vals.filter((s) => s === 'replied').length;
  const followup = vals.filter((s) => s === 'followup').length;
  const pending = vals.filter((s) => s === 'sent').length;
  const sent = replied + followup + pending; // total you reached out to
  const replyRate = sent > 0 ? Math.round((replied / sent) * 100) : 0;

  const legend = [
    { label: ui.tracker.replied[locale], cls: 'bg-sky-500', w: sent ? (replied / sent) * 100 : 0 },
    { label: ui.tracker.followup[locale], cls: 'bg-rose-500', w: sent ? (followup / sent) * 100 : 0 },
    { label: ui.tracker.pending[locale], cls: 'bg-amber-400', w: sent ? (pending / sent) * 100 : 0 },
  ];

  return (
    <div>
      <SectionHeading eyebrow={ui.tracker.eyebrow[locale]} title={ui.tracker.title[locale]} sub={ui.tracker.sub[locale]} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard value={sent} label={ui.tracker.sent[locale]} accentText="text-brand-600" />
        <StatCard value={replied} label={ui.tracker.replied[locale]} accentText="text-sky-600" />
        <StatCard value={pending} label={ui.tracker.pending[locale]} accentText="text-amber-600" />
        <StatCard value={followup} label={ui.tracker.followup[locale]} accentText="text-rose-600" />
      </div>

      {sent === 0 ? (
        <div className="glass mt-4 rounded-2xl p-6 text-center text-sm text-ink-soft">{ui.tracker.empty[locale]}</div>
      ) : (
        <>
          {/* Reply rate */}
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 backdrop-blur-sm">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tabular-nums text-ink">{replyRate}</span>
                <span className="text-xl font-extrabold text-ink">%</span>
                <span className="ms-2 text-sm font-medium text-ink-muted">{ui.tracker.replyRate[locale]}</span>
              </div>
              <p className="mt-0.5 text-xs font-semibold text-brand-700">{ui.tracker.vsBenchmark[locale]}</p>
            </div>
          </div>

          {/* Outreach breakdown */}
          <div className="glass mt-4 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-ink-soft">{ui.tracker.breakdown[locale]}</h3>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-black/5">
              {legend.map((l, i) => (
                <div key={i} className={l.cls} style={{ width: `${l.w}%` }} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {legend.map((l, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
                  <span className={cn('h-2 w-2 rounded-full', l.cls)} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
