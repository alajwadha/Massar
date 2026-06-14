'use client';

import { useTranslations } from 'next-intl';
import { Target, Building2, Check, UserPlus } from 'lucide-react';
import { Reveal } from '@/components/reveal';

export function Contacts() {
  const t = useTranslations('contacts');

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50/60 to-canvas-raised p-7">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{t('targets_title')}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{t('targets_body')}</p>

              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-canvas-raised px-3.5 py-2.5 shadow-soft">
                  <span className="text-sm font-medium">Director, Strategy — PIF</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                    <Check className="h-3 w-3" /> 1st
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-canvas-raised px-3.5 py-2.5 shadow-soft">
                  <span className="text-sm font-medium">VP, Investments — NEOM</span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-ink/5 px-2 py-0.5 text-xs font-semibold text-ink-soft">
                    <UserPlus className="h-3 w-3" /> 2nd
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-line bg-canvas-raised p-7">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{t('hr_title')}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{t('hr_body')}</p>

              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {['PIF', 'Aramco', 'NEOM', 'SABIC', 'stc', 'الوزارات'].map((c) => (
                  <div
                    key={c}
                    className="rounded-xl border border-line bg-canvas px-2 py-3 text-xs font-semibold text-ink-soft"
                  >
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
