'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/reveal';

const COMPANIES = ['PIF', 'Aramco', 'NEOM', 'McKinsey', 'SABIC', 'stc', 'Roshn'];

export function TrustBar() {
  const t = useTranslations('hero');
  return (
    <section className="border-y border-line/70 bg-canvas-raised/60 py-8">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-wider text-ink-muted">
            {t('trust')}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {COMPANIES.map((c) => (
              <span key={c} className="text-lg font-bold tracking-tight text-ink/35">
                {c}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
