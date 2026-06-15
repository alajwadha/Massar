'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Zap, Briefcase, Landmark, Cpu, Route } from 'lucide-react';
import { cn } from '@/lib/utils';
import { paths, ui, type CareerPath, type Loc } from '@/lib/app-data';
import { accent, SectionHeading, Stagger, StaggerItem } from './ui';

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS = {
  finance: TrendingUp,
  energy: Zap,
  consulting: Briefcase,
  government: Landmark,
  tech: Cpu,
} as const;

function PathStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-canvas px-2 py-2.5 text-center">
      <div className="text-base font-extrabold tabular-nums">{value}</div>
      <div className="mt-0.5 text-[10px] font-medium text-ink-muted">{label}</div>
    </div>
  );
}

function PathCard({ path, locale }: { path: CareerPath; locale: Loc }) {
  const a = accent[path.accent];
  const Icon = ICONS[path.icon];
  return (
    <div
      className={cn(
        'relative h-full overflow-hidden rounded-3xl border bg-canvas-raised p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift',
        path.primary ? 'border-brand-200' : 'border-line',
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
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink-soft">{ui.paths.match[locale]}</span>
          <span className="font-extrabold tabular-nums" style={{ color: a.stroke }}>
            {path.matchPercent}%
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
          <motion.div
            className={cn('h-full rounded-full', a.bar)}
            initial={{ width: 0 }}
            whileInView={{ width: `${path.matchPercent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <PathStat value={path.certs} label={ui.paths.certs[locale]} />
        <PathStat value={path.months} label={ui.paths.months[locale]} />
        <PathStat value={path.contacts} label={ui.paths.contacts[locale]} />
      </div>

      {path.trail && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-dashed border-line bg-canvas px-3 py-2.5">
          <Route className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-muted" />
          <p className="text-[11px] leading-relaxed text-ink-soft" dir="ltr">
            <span className="font-semibold text-ink">{ui.paths.roadmap[locale]}: </span>
            {path.trail}
          </p>
        </div>
      )}
    </div>
  );
}

export function PathsSection({ locale }: { locale: Loc }) {
  return (
    <div>
      <SectionHeading
        eyebrow={ui.paths.eyebrow[locale]}
        title={ui.paths.title[locale]}
        sub={ui.paths.sub[locale]}
      />
      <Stagger className="grid gap-4 lg:grid-cols-2">
        {paths.map((p) => (
          <StaggerItem key={p.id} className={cn('h-full', p.primary && 'lg:col-span-2')}>
            <PathCard path={p} locale={locale} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
