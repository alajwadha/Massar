'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/reveal';

export function Problem() {
  const t = useTranslations('problem');
  const stats = [
    { v: t('stat1'), l: t('stat1label') },
    { v: t('stat2'), l: t('stat2label') },
    { v: t('stat3'), l: t('stat3label') },
  ];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {t('eyebrow')}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t('body')}</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-line bg-canvas-raised p-5 text-center shadow-soft"
              >
                <div className="text-3xl font-extrabold tracking-tight text-ink">{s.v}</div>
                <div className="mt-2 text-xs leading-relaxed text-ink-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
