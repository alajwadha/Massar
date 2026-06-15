'use client';

import { useState, type ReactNode } from 'react';
import { Copy, Check, RefreshCw, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { templates as ALL_TEMPLATES, ui, type Template, type Loc } from '@/lib/app-data';
import { SectionHeading, Stagger, StaggerItem } from './ui';

function MetaTag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-line bg-canvas px-2 py-1 text-[11px] font-semibold text-ink-muted">
      {children}
    </span>
  );
}

function TemplateCard({ template: t, locale }: { template: Template; locale: Loc }) {
  const [copied, setCopied] = useState(false);
  const [spin, setSpin] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(t.preview[locale]);
    } catch {
      /* clipboard may be unavailable; the visual confirmation still fires */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className={cn(
        'flex h-full flex-col rounded-2xl border p-4 shadow-soft transition-shadow hover:shadow-lift',
        t.recommended ? 'border-brand-200 bg-gradient-to-b from-brand-50/60 to-canvas-raised' : 'border-line bg-canvas-raised',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-extrabold leading-tight">{t.title[locale]}</h3>
        {t.recommended && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
            <Star className="h-3 w-3 fill-current" />
            {ui.messages.recommended[locale]}
          </span>
        )}
      </div>

      <div className="mt-3 flex-1 rounded-xl border border-line bg-canvas p-3 text-[13px] leading-relaxed text-ink-soft">
        {t.preview[locale]}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <MetaTag>{t.words} {ui.messages.words[locale]}</MetaTag>
        <MetaTag>{t.tone[locale]}</MetaTag>
        <MetaTag>{t.audience[locale]}</MetaTag>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={copy}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors',
            copied ? 'bg-brand-50 text-brand-700' : 'bg-brand-600 text-white hover:bg-brand-700',
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? ui.messages.copied[locale] : ui.messages.copy[locale]}
        </button>
        <button
          type="button"
          onClick={() => {
            setSpin(true);
            setTimeout(() => setSpin(false), 600);
          }}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-line px-3 py-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:border-ink/20 hover:text-ink"
        >
          <RefreshCw className={cn('h-4 w-4', spin && 'animate-spin')} />
          {ui.messages.vary[locale]}
        </button>
      </div>
    </div>
  );
}

export function MessagesSection({ locale, templates = ALL_TEMPLATES }: { locale: Loc; templates?: Template[] }) {
  return (
    <div>
      <SectionHeading title={ui.messages.title[locale]} sub={ui.messages.sub[locale]} />
      <Stagger className="grid gap-3 lg:grid-cols-2">
        {templates.map((t) => (
          <StaggerItem key={t.id} className="h-full">
            <TemplateCard template={t} locale={locale} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
