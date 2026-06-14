'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';

export function CTA() {
  const t = useTranslations('cta');

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center sm:px-16">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 start-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
            />
            <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {t('title')}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/70">
              {t('body')}
            </p>
            <div className="relative mt-8 flex justify-center">
              <Button size="lg" className="bg-white text-ink hover:bg-white/90">
                {t('button')}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
