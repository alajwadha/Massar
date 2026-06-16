'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Send, MessageSquare, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { tracker, ui, type Loc } from '@/lib/app-data';
import { StatCard, SectionHeading } from './ui';

const EASE = [0.16, 1, 0.3, 1] as const;

const ACTIVITY_ICON = {
  replied: { Icon: MessageSquare, cls: 'bg-sky-50 text-sky-600' },
  sent: { Icon: Send, cls: 'bg-brand-50 text-brand-600' },
  cert: { Icon: GraduationCap, cls: 'bg-amber-50 text-amber-600' },
} as const;

export function TrackerSection({ locale }: { locale: Loc }) {
  const max = Math.max(...tracker.weekly.map((d) => d.value));

  return (
    <div>
      <SectionHeading eyebrow={ui.tracker.eyebrow[locale]} title={ui.tracker.title[locale]} sub={ui.tracker.sub[locale]} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard value={tracker.stats.sent} label={ui.tracker.sent[locale]} accentText="text-brand-600" />
        <StatCard value={tracker.stats.replied} label={ui.tracker.replied[locale]} accentText="text-sky-600" />
        <StatCard value={tracker.stats.pending} label={ui.tracker.pending[locale]} accentText="text-amber-600" />
        <StatCard value={tracker.stats.followup} label={ui.tracker.followup[locale]} accentText="text-rose-600" />
      </div>

      {/* Reply rate */}
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-5 backdrop-blur-sm">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tabular-nums text-ink">{tracker.replyRate}</span>
            <span className="text-xl font-extrabold text-ink">%</span>
            <span className="ms-2 text-sm font-medium text-ink-muted">{ui.tracker.replyRate[locale]}</span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-brand-700">{ui.tracker.vsBenchmark[locale]}</p>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="glass mt-4 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-ink-soft">{ui.tracker.weekly[locale]}</h3>
        <div className="mt-4 flex items-end justify-between gap-2">
          {tracker.weekly.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] font-bold tabular-nums text-ink-muted">{d.value}</span>
              <div className="flex h-28 w-full max-w-[34px] items-end">
                <motion.div
                  className="w-full rounded-t-md bg-gradient-to-t from-brand-600 to-brand-400"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${(d.value / max) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 + i * 0.06, ease: EASE }}
                />
              </div>
              <span className="text-[10px] text-ink-muted">{d.label[locale]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div className="glass mt-4 rounded-2xl p-2">
        <h3 className="px-3 pb-1 pt-3 text-sm font-bold text-ink-soft">{ui.tracker.recent[locale]}</h3>
        <div className="divide-y divide-white/40">
          {tracker.activity.map((a, i) => {
            const conf = ACTIVITY_ICON[a.kind];
            return (
              <div key={i} className="flex items-center gap-3 px-3 py-3">
                <div className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', conf.cls)}>
                  <conf.Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink">{a.text[locale]}</p>
                  <p className="text-[11px] text-ink-muted">{a.when[locale]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
