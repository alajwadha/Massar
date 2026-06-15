'use client';

import { useMemo, useState } from 'react';
import { Search, Send, Reply, RefreshCw, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ui, type Contact, type ContactStatus, type Loc } from '@/lib/app-data';
import { Avatar, ScoreRing, StatusPill, SectionHeading, Stagger, StaggerItem } from './ui';

function actionFor(status: ContactStatus) {
  if (status === 'replied') return { key: 'reply', Icon: Reply } as const;
  if (status === 'followup') return { key: 'followupCta', Icon: RefreshCw } as const;
  return { key: 'outreach', Icon: Send } as const;
}

export function ContactCard({ contact: c, locale }: { contact: Contact; locale: Loc }) {
  const action = actionFor(c.status);
  return (
    <div className="group rounded-2xl border border-line bg-canvas-raised p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start gap-3">
        <Avatar initials={c.name[locale].charAt(0)} companyKey={c.companyKey} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[15px] font-bold leading-tight">{c.name[locale]}</h3>
            <ScoreRing score={c.score} />
          </div>
          <p className="mt-1 truncate text-[13px] text-ink-soft">{c.role[locale]}</p>
          <p className="mt-0.5 truncate text-xs font-semibold text-brand-700">{c.company[locale]}</p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-line pt-3">
        <StatusPill status={c.status} locale={locale} />
        <span className="shrink-0 text-[11px] text-ink-muted">{c.when[locale]}</span>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-brand-700"
        >
          <action.Icon className="h-4 w-4" />
          {(ui.contacts[action.key] as { ar: string; en: string })[locale]}
        </button>
        <button
          type="button"
          aria-label="LinkedIn"
          className="grid w-11 place-items-center rounded-xl border border-line text-ink-soft transition-colors hover:border-ink/20 hover:text-ink"
        >
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

type Filter = 'all' | 'hot' | ContactStatus;

export function ContactsSection({ contacts, locale }: { contacts: Contact[]; locale: Loc }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(
    () => ({
      all: contacts.length,
      hot: contacts.filter((c) => c.score >= 175).length,
      new: contacts.filter((c) => c.status === 'new').length,
      sent: contacts.filter((c) => c.status === 'sent').length,
      replied: contacts.filter((c) => c.status === 'replied').length,
      followup: contacts.filter((c) => c.status === 'followup').length,
    }),
    [contacts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (filter === 'hot' && c.score < 175) return false;
      if (filter !== 'all' && filter !== 'hot' && c.status !== filter) return false;
      if (!q) return true;
      return (
        c.name.ar.includes(query) ||
        c.name.en.toLowerCase().includes(q) ||
        c.company.ar.includes(query) ||
        c.company.en.toLowerCase().includes(q) ||
        c.role.en.toLowerCase().includes(q)
      );
    });
  }, [contacts, query, filter]);

  const allChips: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: ui.contacts.all[locale], count: counts.all },
    { id: 'hot', label: '🔥 ' + ui.contacts.hot[locale], count: counts.hot },
    { id: 'new', label: ui.contacts.new[locale], count: counts.new },
    { id: 'sent', label: ui.contacts.sent[locale], count: counts.sent },
    { id: 'replied', label: ui.contacts.replied[locale], count: counts.replied },
    { id: 'followup', label: ui.contacts.followup[locale], count: counts.followup },
  ];
  const chips = allChips.filter((c) => c.id === 'all' || c.count > 0);

  return (
    <div>
      <SectionHeading title={ui.contacts.title[locale]} sub={ui.contacts.sub[locale]} />

      <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-canvas-raised px-4 py-3 shadow-soft">
        <Search className="h-4 w-4 shrink-0 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ui.contacts.search[locale]}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setFilter(chip.id)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              filter === chip.id
                ? 'border-ink bg-ink text-white'
                : 'border-line bg-canvas-raised text-ink-soft hover:border-ink/20',
            )}
          >
            {chip.label}
            <span className={cn('ms-1.5 tabular-nums', filter === chip.id ? 'text-white/70' : 'text-ink-muted')}>
              {chip.count}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-muted">{ui.contacts.empty[locale]}</p>
      ) : (
        <Stagger className="mt-4 grid gap-3 sm:grid-cols-2">
          {filtered.map((c) => (
            <StaggerItem key={c.id}>
              <ContactCard contact={c} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
