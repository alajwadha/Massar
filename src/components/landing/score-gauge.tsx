'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from 'framer-motion';
import { useRef, useState } from 'react';
import { TrendingUp, Clock } from 'lucide-react';

const FROM = 60;
const TO = 85;
const ease = [0.16, 1, 0.3, 1] as const;

export function ScoreGauge() {
  const t = useTranslations('score');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const value = useMotionValue(FROM);
  const [display, setDisplay] = useState(FROM);
  // Arc: 0–100 maps onto a 270° sweep.
  const dash = useTransform(value, (v) => `${(v / 100) * 270} 360`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, TO, {
      duration: 1.6,
      delay: 0.3,
      ease,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  const levers = [
    { label: t('lever_rewrite'), delta: '+8', effort: t('effort_minutes'), icon: Clock },
    { label: t('lever_cfa'), delta: '+15', effort: t('effort_months'), icon: TrendingUp },
    { label: t('lever_exp'), delta: '+10', effort: t('effort_years'), icon: TrendingUp },
  ];

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-md rounded-3xl border border-line bg-canvas-raised p-6 shadow-lift sm:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
          {t('eyebrow')}
        </span>
        <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
          {t('example_role')}
        </span>
      </div>

      <div className="relative mx-auto mt-6 grid h-48 w-48 place-items-center">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-[135deg]">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#ECEAE4"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="270 360"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#0E9F6E"
            strokeWidth="10"
            strokeLinecap="round"
            style={{ strokeDasharray: dash }}
            pathLength={360}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-extrabold tabular-nums tracking-tight">
            {display}
          </span>
          <span className="mt-1 text-xs text-ink-muted">
            {t('from')} {FROM} {t('to')} {TO}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {levers.map((lever, i) => (
          <motion.div
            key={lever.label}
            initial={{ opacity: 0, x: 12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.6 + i * 0.12, ease }}
            className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3.5 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <lever.icon className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-medium text-ink">{lever.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-muted">{lever.effort}</span>
              <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-xs font-bold text-brand-700">
                {lever.delta}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-ink-muted">{t('note')}</p>
    </div>
  );
}
