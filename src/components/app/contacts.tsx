'use client';

import { useMemo, useRef, useState } from 'react';
import {
  Search,
  Users,
  Building2,
  Copy,
  Check,
  Shuffle,
  Linkedin,
  Crown,
  Sparkles,
  User,
  Upload,
  Network,
  UserCheck,
  Smartphone,
  Laptop,
  Info,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  industries,
  fillTemplate,
  linkedinUrl,
  parseConnectionsCsv,
  rankByNetwork,
  countMatches,
  ui,
  type Contact,
  type ContactStatus,
  type IndustryKey,
  type Loc,
  type NetMatch,
  type NetworkData,
  type PickKind,
} from '@/lib/app-data';
import { usePlan } from './plan-context';
import { Avatar, ScoreRing, StatusPill, SectionHeading, Stagger, StaggerItem } from './ui';

const STATUS_ORDER: ContactStatus[] = ['new', 'sent', 'replied', 'followup'];

const KIND: Record<PickKind, { cls: string; Icon: typeof Crown; key: 'kindTop' | 'kindMid' | 'kindCommon' }> = {
  top: { cls: 'bg-brand-50 text-brand-700', Icon: Crown, key: 'kindTop' },
  mid: { cls: 'bg-amber-50 text-amber-700', Icon: User, key: 'kindMid' },
  common: { cls: 'bg-violet-50 text-violet-700', Icon: Sparkles, key: 'kindCommon' },
};

export function ConnectionCard({
  contact: c,
  locale,
  kind,
  reason,
  match,
}: {
  contact: Contact;
  locale: Loc;
  kind?: PickKind;
  reason?: string;
  match?: NetMatch;
}) {
  const { templates } = usePlan();
  const [tpl, setTpl] = useState(0);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<ContactStatus>(c.status); // manual self-logging
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

  const cycleStatus = () =>
    setStatus((s) => STATUS_ORDER[(STATUS_ORDER.indexOf(s) + 1) % STATUS_ORDER.length]);

  return (
    <div
      className={cn(
        'glass glass-edge flex h-full flex-col rounded-2xl p-4 transition-shadow duration-300 hover:shadow-lift',
        match && 'ring-1 ring-brand-200',
      )}
    >
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

      {/* Warm-intro flag from the user's uploaded LinkedIn network */}
      {match && (
        <div
          className={cn(
            'mt-3 inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset',
            match === 'you'
              ? 'bg-brand-50 text-brand-700 ring-brand-100'
              : 'bg-violet-50 text-violet-700 ring-violet-100',
          )}
        >
          {match === 'you' ? <UserCheck className="h-3 w-3" /> : <Users className="h-3 w-3" />}
          {match === 'you' ? ui.contacts.inNetwork[locale] : ui.contacts.sameCompany[locale]}
        </div>
      )}

      {kind && reason && (
        <div className={cn('mt-3 flex items-start gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px]', KIND[kind].cls)}>
          {(() => {
            const I = KIND[kind].Icon;
            return <I className="mt-0.5 h-3 w-3 shrink-0" />;
          })()}
          <span>
            <span className="font-bold">{ui.paths[KIND[kind].key][locale]}</span> · {reason}
          </span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/40 pt-3">
        <button type="button" onClick={cycleStatus} title={ui.contacts.statusHint[locale]} className="transition-opacity hover:opacity-75">
          <StatusPill status={status} locale={locale} />
        </button>
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
          aria-label={ui.contacts.shuffle[locale]}
          title={ui.contacts.shuffle[locale]}
          className="grid w-11 shrink-0 place-items-center rounded-xl border border-white/60 bg-white/40 text-ink-soft transition-colors hover:text-ink"
        >
          <Shuffle className="h-4 w-4" />
        </button>
        <a
          href={linkedinUrl(c)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ui.contacts.linkedin[locale]}
          title={ui.contacts.linkedin[locale]}
          className="grid w-11 shrink-0 place-items-center rounded-xl border border-white/60 bg-white/40 text-[#0A66C2] transition-colors hover:bg-white/70"
        >
          <Linkedin className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- network CSV panel -- */

function Steps({ title, Icon, steps }: { title: string; Icon: typeof Smartphone; steps: readonly string[] }) {
  return (
    <div className="rounded-xl border border-white/50 bg-white/40 p-3.5">
      <div className="flex items-center gap-2 text-sm font-bold">
        <Icon className="h-4 w-4 text-brand-600" />
        {title}
      </div>
      <ol className="mt-2.5 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-ink-soft">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white tabular-nums">
              {i + 1}
            </span>
            <span className="flex-1">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function NetworkPanel({
  locale,
  net,
  matchCount,
  onFile,
  onClear,
}: {
  locale: Loc;
  net: NetworkData | null;
  matchCount: number;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const Picker = (
    <input
      ref={inputRef}
      type="file"
      accept=".csv,text/csv"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = ''; // allow re-uploading the same file
      }}
    />
  );

  // After upload: a compact summary with the match count.
  if (net) {
    return (
      <div className="glass mt-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Network className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold">{ui.network.matched[locale](matchCount)}</div>
            <div className="text-[12.5px] text-ink-soft">
              {matchCount > 0 ? ui.network.ranked[locale] : ui.network.none[locale]}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-3.5 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" />
          {ui.network.clear[locale]}
        </button>
        {Picker}
      </div>
    );
  }

  // Empty state: explain how to export, then let them upload.
  return (
    <div className="glass mt-3 overflow-hidden rounded-3xl p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Network className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-extrabold tracking-tight">{ui.network.title[locale]}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{ui.network.body[locale]}</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p className="text-[12.5px] font-semibold leading-relaxed text-amber-800">{ui.network.note[locale]}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Steps title={ui.network.howPhone[locale]} Icon={Smartphone} steps={ui.network.phoneSteps[locale]} />
        <Steps title={ui.network.howLaptop[locale]} Icon={Laptop} steps={ui.network.laptopSteps[locale]} />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft transition-colors hover:bg-brand-700"
      >
        <Upload className="h-4 w-4" />
        {ui.network.upload[locale]}
      </button>
      {Picker}
    </div>
  );
}

/* ------------------------------------------------------------ contacts page -- */

type Part = 'connections' | 'hr';

export function ContactsSection({ locale }: { locale: Loc }) {
  const { connections, hrContacts } = usePlan();
  const [part, setPart] = useState<Part>('connections');
  const [industry, setIndustry] = useState<IndustryKey | 'all'>('all');
  const [query, setQuery] = useState('');
  const [net, setNet] = useState<NetworkData | null>(null);

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setNet(parseConnectionsCsv(String(reader.result ?? '')));
    reader.readAsText(file);
  };

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

  // Network matching applies to connections only; HR keeps its own order.
  const ranked = useMemo(
    () => rankByNetwork(filtered, part === 'connections' ? net : null),
    [filtered, net, part],
  );
  const matchCount = useMemo(() => countMatches(connections, net), [net]);

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

      {/* LinkedIn network import (connections only) */}
      {part === 'connections' && (
        <NetworkPanel locale={locale} net={net} matchCount={matchCount} onFile={onFile} onClear={() => setNet(null)} />
      )}

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

      {ranked.length === 0 ? (
        <p className="mt-10 text-center text-sm text-ink-muted">{ui.contacts.empty[locale]}</p>
      ) : (
        <Stagger className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ranked.map(({ contact, match }) => (
            <StaggerItem key={contact.id} className="h-full">
              <ConnectionCard contact={contact} locale={locale} match={part === 'connections' ? match : null} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
