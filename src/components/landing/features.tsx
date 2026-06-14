'use client';

import { useTranslations } from 'next-intl';
import { Route, Award, Users, MessageSquare } from 'lucide-react';
import { Reveal } from '@/components/reveal';

export function Features() {
  const t = useTranslations('features');

  const items = [
    { icon: Route, title: t('paths_title'), body: t('paths_body') },
    { icon: Award, title: t('certs_title'), body: t('certs_body') },
    { icon: Users, title: t('targets_title'), body: t('targets_body') },
    { icon: MessageSquare, title: t('messages_title'), body: t('messages_body') },
  ];

  return (
    <section id="features" className="border-t border-line/70 bg-canvas py-20 sm:py-28">
      <div className="container-page">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-line bg-canvas-raised p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
