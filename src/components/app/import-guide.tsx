'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Info, UploadCloud, Linkedin } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

const ease = [0.16, 1, 0.3, 1] as const;

export function ImportGuide() {
  const t = useTranslations('import');
  const tc = useTranslations('common');
  const steps = t.raw('steps') as string[];

  return (
    <div className="container-page py-10 sm:py-14">
      <Link
        href="/app"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowRight className="h-4 w-4 ltr:rotate-180" />
        {tc('back')}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="mt-6 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <Linkedin className="h-3.5 w-3.5" />
          {t('eyebrow')}
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-soft">{t('subtitle')}</p>
      </motion.div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Steps */}
        <div className="rounded-3xl border border-line bg-canvas-raised p-6 shadow-soft sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
            {t('steps_title')}
          </h2>
          <ol className="mt-5 space-y-4">
            {steps.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease }}
                className="flex items-start gap-3.5"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white tabular-nums">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-ink">{step}</span>
              </motion.li>
            ))}
          </ol>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-canvas px-4 py-3 text-sm text-ink-soft">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <span>{t('note')}</span>
          </div>
        </div>

        {/* Upload + privacy */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-dashed border-brand-300 bg-brand-50/40 p-8 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white">
              <UploadCloud className="h-6 w-6" />
            </div>
            <Button size="lg" variant="secondary" disabled className="mt-5 w-full">
              {t('upload_cta')} · {tc('soon')}
            </Button>
            <p className="mt-3 text-xs text-ink-muted">{t('upload_hint')}</p>
          </div>

          <div className="rounded-3xl border border-line bg-canvas-raised p-6 shadow-soft">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <h3 className="font-bold">{t('privacy_title')}</h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {t('privacy_body')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
