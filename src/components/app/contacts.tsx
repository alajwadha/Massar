'use client';

import { useMemo, useState } from 'react';
import { Search, Users, Building2, Copy, Check, Shuffle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  connections,
  hrContacts,
  industries,
  templates,
  fillTemplate,
  ui,
  type Contact,
  type IndustryKey,
  type Loc,
} from '@/lib/app-data';
import { Avatar, ScoreRing, StatusPill, SectionHeading, Stagger, StaggerItem } from './ui';

export function ConnectionCard({ contact: c, locale }: { contact: Contact; locale: Loc }) {
  const [tpl, setTpl] = useState(0);
  const [copied, setCopied] = useState(false);
  const template = templates[tpl % templates.length];
  const message = fillTemplate(template.preview[locale], c, locale);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      /* clipboard may be blocked; visual confirmation still fires */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="glass flex h-full flex-col rounded-2xl p-4 transition-shadow duration-300 hover:shadow-lift">
      <div className="flex items-start gap-3">
        <Avatar initials={c.name[locale].charAt(0)} companyKey={c.companyKey} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-bold leading-tight">{c.name[locale]}</h3>
            {c.score != null ? (
              <ScoreRing score={c.score} />
            ) : (
              <span className="shrink-0 rounded-full bg-sky-50/80 px-2 py-0.5 text-[10px] font-bold text-sky-700 ring-1 ring-inset ring-sky-100">
                {ui.contacts.recruiter[locale]}
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-[13px] text-ink-soft">{c.role[locale]}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-brand-700">{c.company[locale]}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/40 pt-3">
        <StatusPill status={c.status} locale={locale} />
        <span className="shrink-0 text-[11px] text-ink-muted">{c.when[locale]}</span>
      </div>

      {/* Ready message preview */}
      <div className="mt-3 flex-1 rounded-xl border border-white/50 bg-white/40 p-3">
        <div className="mb-1.5 text-[11px] font-semibold text-ink-muted">
          {ui.contacts.messagePreview[locale]} · {template.title[locale]}
        </div>
        <p className="line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">{message}</p>
      </div>

      <div className="mt-2.5 flex gap-2">
        <button
          type="button"
          onClick={copy}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors',
            copied ? 'bg-brand-50 text-brand-700' : 'bg-brand-600 text-white hover:bg-brand-700',
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? ui.contacts.copied[locale] : ui.contacts.copy[locale]}
        </button>
        <button
          type="button"
          onClick={() => setTpl((i) => i + 1)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/60 bg-white/40 px-3 py-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <Shuffle className="h-4 w-4" />
          {ui.contacts.shuffle[locale]}
        </button>
      </div>
    </div>
  );
}

type Part = 'connections' | 'hr';

export function ContactsSection({ locale }: { locale: Loc }) {
  const [part, setPart] = useState<Part>('connections');
  const [industry, setIndustry] = useState<IndustryKey | 'all'>('all');
  const [query, setQuery] = useState('');

  const base = part === 'connections' ? connections : hrContacts;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base.filter((c) => {
      if (part === 'connections' && industry !== 'all' && c.industry !== industry) return false;
      if (!q) return true;
      return (
        c.name.ar.includes(query) ||
        c.name.en.toLowerCase().includes(q) ||
        c.company.ar.includes(query) ||
        c.company.en.toLowerCase().includes(q) ||
        c.role.en.toLowerCase().includes(q)
      );
    });
  }, [base, part, industry, query]);

  const parts: { id: Part; Icon: typeof Users; label: string; hint: string }[] = [
    { id: 'connections', Icon: Users, label: ui.contacts.tabConnections[locale], hint: ui.contacts.connectionsHint[locale] },
    { id: 'hr', Icon: Building2, label: ui.contacts.tabHr[locale], hint: ui.contacts.hrHint[locale] },
  ];

  return (
    <div>
      <SectionHeading eyebrow={ui.contacts.eyebrow[locale]} title={ui.contacts.title[locale]} sub={ui.contacts.sub[locale]} />

      {/* Two-part toggle */}
      <div className="glass grid grid-cols-2 gap-1 rounded-2xl p-1">
        {parts.map((p) => {
          const active = part === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPart(p.id)}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-3 text-start transition-colors',
                active ? 'bg-brand-600 text-white shadow-soft' : 'text-ink-soft hover:bg-white/50',
              )}
            >
              <p.Icon className="h-5 w-5 shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-bold leading-tight">{p.label}</span>
                <span className={cn('block truncate text-[11px]', active ? 'text-white/80' : 'text-ink-muted')}>
                  {p.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="glass mt-3 flex items-center gap-2.5 rounded-2xl px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui.contacts.search[locale]}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </div>

      {/* Industry filter (connections only) */}
      {part === 'connections' && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-xs font-semibold text-ink-muted">{ui.contacts.industry[locale]}:</span>
          {([{ id: 'all' as const, label: ui.contacts.allIndustries[locale] }, ...industries.map((i) => ({ id: i.id, label: i.label[locale] }))]).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setIndustry(opt.id)}
              className={cn(
                'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                industry === opt.id
                  ? 'border-ink bg-ink text-white'
                  : 'border-white/60 bg-white/40 text-ink-soft hover:text-ink',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-muted">{ui.contacts.empty[locale]}</p>
      ) : (
        <Stagger className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <StaggerItem key={c.id} className="h-full">
              <ConnectionCard contact={c} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
