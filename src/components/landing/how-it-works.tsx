'use client';

import { useTranslations } from 'next-intl';
import { FileUp, Gauge, Map, Send } from 'lucide-react';
import { Reveal } from '@/components/reveal';

export function HowItWorks() {
  const t = useTranslations('how');
  const steps = [
    { icon: FileUp, t: t('step1t'), b: t('step1b') },
    { icon: Gauge, t: t('step2t'), b: t('step2b') },
    { icon: Map, t: t('step3t'), b: t('step3b') },
    { icon: Send, t: t('step4t'), b: t('step4b') },
  ];
  return (
    <section id="how" className="border-t border-line/70 bg-canvas py-20 sm:py-28">
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl border border-line bg-canvas-raised p-6 shadow-soft">
                <span className="absolute end-5 top-5 text-4xl font-extrabold text-line">
                  {i + 1}
                </span>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
