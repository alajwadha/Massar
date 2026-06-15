'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AccentKey, CompanyKey, ContactStatus, Loc } from '@/lib/app-data';
import { ui } from '@/lib/app-data';

const EASE = [0.16, 1, 0.3, 1] as const;

/* -------------------------------------------------------------- accent maps -- */

export const accent: Record<
  AccentKey,
  { softBg: string; softText: string; stroke: string; grad: string; bar: string }
> = {
  brand: { softBg: 'bg-brand-50', softText: 'text-brand-700', stroke: '#0E9F6E', grad: 'from-brand-500 to-brand-700', bar: 'bg-brand-500' },
  sky: { softBg: 'bg-sky-50', softText: 'text-sky-700', stroke: '#0284C7', grad: 'from-sky-400 to-sky-600', bar: 'bg-sky-500' },
  violet: { softBg: 'bg-violet-50', softText: 'text-violet-700', stroke: '#7C3AED', grad: 'from-violet-500 to-purple-700', bar: 'bg-violet-500' },
  amber: { softBg: 'bg-amber-50', softText: 'text-amber-700', stroke: '#D97706', grad: 'from-amber-400 to-orange-600', bar: 'bg-amber-500' },
  rose: { softBg: 'bg-rose-50', softText: 'text-rose-700', stroke: '#E11D48', grad: 'from-rose-500 to-pink-600', bar: 'bg-rose-500' },
};

export const companyGrad: Record<CompanyKey, string> = {
  pif: 'from-emerald-500 to-emerald-700',
  aramco: 'from-amber-500 to-orange-600',
  acwa: 'from-cyan-500 to-teal-600',
  neom: 'from-teal-500 to-emerald-600',
  gov: 'from-blue-600 to-indigo-700',
  mck: 'from-violet-500 to-purple-700',
  bcg: 'from-indigo-500 to-violet-700',
  bain: 'from-fuchsia-500 to-purple-700',
  strat: 'from-violet-600 to-indigo-700',
  pwc: 'from-orange-500 to-red-600',
  stc: 'from-rose-500 to-pink-600',
  elm: 'from-sky-500 to-blue-600',
  cst: 'from-slate-500 to-slate-700',
};

/* ------------------------------------------------------------------ counter -- */

export function Counter({
  to,
  duration = 1.3,
  className,
  suffix = '',
}: {
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (reduce) return setV(to);
    const c = animate(0, to, { duration, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [to, duration, reduce]);
  return (
    <span className={cn('tabular-nums', className)}>
      {v}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------- progress ring -- */

export function ProgressRing({
  value,
  size = 132,
  stroke = 12,
  color = '#0E9F6E',
  track = '#ECEAE4',
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? offset : c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, delay: 0.2, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- score ring -- */

export function ScoreRing({ score, size = 46, stroke = 4 }: { score: number; size?: number; stroke?: number }) {
  const reduce = useReducedMotion();
  const pct = Math.max(0, Math.min(1, (score - 100) / 100));
  const tone = score >= 180 ? '#0E9F6E' : score >= 160 ? '#D97706' : '#0284C7';
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ECEAE4" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduce ? offset : c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
        />
      </svg>
      <span className="absolute text-[13px] font-extrabold tabular-nums" style={{ color: tone }}>
        {score}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ stat card -- */

export function StatCard({
  value,
  label,
  accentText = 'text-ink',
  suffix = '',
  animate: doAnimate = true,
}: {
  value: number;
  label: string;
  accentText?: string;
  suffix?: string;
  animate?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-canvas-raised p-4 shadow-soft">
      <div className={cn('text-2xl font-extrabold tracking-tight sm:text-3xl', accentText)}>
        {doAnimate ? <Counter to={value} suffix={suffix} /> : `${value}${suffix}`}
      </div>
      <div className="mt-1 text-xs font-medium leading-snug text-ink-muted">{label}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- status pill -- */

const statusStyle: Record<ContactStatus, { cls: string; key: keyof typeof ui.contacts; dot: string }> = {
  new: { cls: 'bg-amber-50 text-amber-700 ring-amber-100', key: 'new', dot: 'bg-amber-500' },
  sent: { cls: 'bg-brand-50 text-brand-700 ring-brand-100', key: 'sent', dot: 'bg-brand-500' },
  replied: { cls: 'bg-sky-50 text-sky-700 ring-sky-100', key: 'replied', dot: 'bg-sky-500' },
  followup: { cls: 'bg-rose-50 text-rose-700 ring-rose-100', key: 'followup', dot: 'bg-rose-500' },
};

export function StatusPill({ status, locale }: { status: ContactStatus; locale: Loc }) {
  const s = statusStyle[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset', s.cls)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
      {(ui.contacts[s.key] as { ar: string; en: string })[locale]}
    </span>
  );
}

/* -------------------------------------------------------------------- avatar -- */

export function Avatar({
  initials,
  companyKey,
  className = 'h-11 w-11 text-sm',
}: {
  initials: string;
  companyKey: CompanyKey;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid shrink-0 place-items-center rounded-xl bg-gradient-to-br font-extrabold text-white shadow-soft',
        companyGrad[companyKey],
        className,
      )}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------- section header -- */

export function SectionHeading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">{eyebrow}</div>
      )}
      <h2 className={cn('text-xl font-extrabold tracking-tight sm:text-2xl', eyebrow && 'mt-1.5')}>
        {title}
      </h2>
      {sub && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-soft">{sub}</p>}
    </div>
  );
}

/* --------------------------------------------------------------- motion list -- */

// Staggered fade-up wrapper for cards within a section.
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
