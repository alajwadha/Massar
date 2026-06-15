'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ScoreGauge } from './score-gauge';

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden">
      {/* soft brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-gradient-to-b from-brand-100/60 to-transparent blur-2xl"
      />
      <div className="container-page relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas-raised px-3 py-1.5 text-xs font-medium text-ink-soft"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-600" />
            {t('badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="mt-5 text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl"
          >
            {t('title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft"
          >
            {t('subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#pricing"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-600 px-7 text-base font-medium text-white shadow-soft transition-colors duration-200 hover:bg-brand-700"
            >
              {t('cta_primary')}
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-0 ltr:rotate-180" />
            </a>
            <a
              href="#how"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-canvas-raised px-7 text-base font-medium text-ink transition-colors duration-200 hover:border-ink/20"
            >
              {t('cta_secondary')}
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="mt-8 text-sm text-ink-muted"
          >
            {t('trust')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="relative"
        >
          <ScoreGauge />
        </motion.div>
      </div>
    </section>
  );
}
