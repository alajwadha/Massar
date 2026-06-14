'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Pricing() {
  const t = useTranslations('pricing');

  const tiers = [
    {
      name: t('starter'),
      desc: t('starter_desc'),
      price: '199',
      featured: false,
      features: [
        `2 ${t('feature_paths')}`,
        t('feature_score'),
        `10 ${t('feature_targets')}`,
        t('feature_roadmap'),
      ],
    },
    {
      name: t('pro'),
      desc: t('pro_desc'),
      price: '499',
      featured: true,
      features: [
        `5 ${t('feature_paths')}`,
        t('feature_score'),
        `40 ${t('feature_targets')}`,
        t('feature_roadmap'),
      ],
    },
  ];

  return (
    <section id="pricing" className="border-t border-line/70 bg-canvas py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft">{t('subtitle')}</p>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <div
                className={cn(
                  'relative h-full rounded-3xl border p-7 transition-all duration-300',
                  tier.featured
                    ? 'border-brand-300 bg-canvas-raised shadow-lift'
                    : 'border-line bg-canvas-raised shadow-soft hover:shadow-lift',
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3 start-7 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">
                    ★
                  </span>
                )}
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{tier.desc}</p>
                <div className="mt-4 flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                  <span className="mb-1 text-sm text-ink-muted">SAR</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  variant={tier.featured ? 'primary' : 'secondary'}
                  className="mt-7 w-full"
                >
                  {t('cta')}
                </Button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
