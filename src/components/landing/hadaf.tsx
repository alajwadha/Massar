'use client';

import { useTranslations } from 'next-intl';
import { Check, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { Link } from '@/i18n/routing';

export function Hadaf() {
  const t = useTranslations('hadaf');
  const points = [t('point1'), t('point2'), t('point3')];
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 to-canvas-raised p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -end-16 -top-16 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-600/10 px-3 py-1 text-xs font-semibold text-brand-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('eyebrow')}
                </span>
                <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  {t('title')}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">{t('body')}</p>
                <Link
                  href="/#pricing"
                  className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-7 font-medium text-white shadow-soft transition-colors hover:bg-brand-700"
                >
                  {t('cta')}
                </Link>
              </div>
              <ul className="space-y-3">
                {points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-xl bg-canvas-raised/80 px-4 py-3 shadow-soft"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-medium text-ink">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
