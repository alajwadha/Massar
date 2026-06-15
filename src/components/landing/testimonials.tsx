'use client';

import { useTranslations } from 'next-intl';
import { Quote } from 'lucide-react';
import { Reveal } from '@/components/reveal';

export function Testimonials() {
  const t = useTranslations('testimonials');
  const items = [
    { q: t('q1'), n: t('n1'), r: t('r1') },
    { q: t('q2'), n: t('n2'), r: t('r2') },
    { q: t('q3'), n: t('n3'), r: t('r3') },
  ];
  return (
    <section className="border-t border-line/70 bg-canvas py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {t('eyebrow')}
            </span>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.n + i} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-canvas-raised p-6 shadow-soft">
                <Quote className="h-6 w-6 text-brand-300" />
                <blockquote className="mt-3 flex-1 leading-relaxed text-ink">{it.q}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                    {it.n.charAt(0)}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold text-ink">{it.n}</span>
                    <span className="text-ink-muted">{it.r}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
