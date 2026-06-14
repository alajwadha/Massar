'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Reveal } from '@/components/reveal';
import { motion } from 'framer-motion';

const components = [
  { ar: 'الخبرة العملية', en: 'Experience', weight: 35 },
  { ar: 'هيبة جهة العمل', en: 'Employer prestige', weight: 20 },
  { ar: 'جودة الصياغة', en: 'Writing quality', weight: 15 },
  { ar: 'الشهادات', en: 'Certifications', weight: 15 },
  { ar: 'التعليم', en: 'Education', weight: 15 },
];

export function ScoreSection() {
  const t = useTranslations('score');
  const locale = useLocale();
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="score" className="border-t border-line/70 bg-canvas py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {t('eyebrow')}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{t('body')}</p>
            <p className="mt-4 text-sm text-ink-muted">{t('note')}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-line bg-canvas-raised p-7 shadow-soft">
            <div className="space-y-4">
              {components.map((c, i) => (
                <div key={c.en}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{locale === 'ar' ? c.ar : c.en}</span>
                    <span className="tabular-nums text-ink-muted">{c.weight}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                    <motion.div
                      className="h-full rounded-full bg-brand-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${c.weight * 2.4}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
