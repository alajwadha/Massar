'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Reveal } from '@/components/reveal';

export function FAQ() {
  const t = useTranslations('faq');
  const [open, setOpen] = useState<number | null>(0);
  const items = [1, 2, 3, 4, 5].map((n) => ({ q: t(`q${n}`), a: t(`a${n}`) }));

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="container-page max-w-3xl">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </Reveal>
        <div className="mt-10 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.04}>
                <div className="overflow-hidden rounded-2xl border border-line bg-canvas-raised">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-ink">{it.q}</span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="px-5 pb-5 leading-relaxed text-ink-soft">{it.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
