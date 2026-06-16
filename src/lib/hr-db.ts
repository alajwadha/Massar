// Server-only: reads the real HR database (data/hr_contacts.clean.csv, 1,209 rows)
// and returns a customer's recruiters filtered to their sectors and capped at their
// tier. Never import this from a client component (it uses the filesystem). The page
// (a server component) calls withHr() to fill plan.hrContacts before rendering.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { TIER_CAP, type CompanyTier, type Contact, type CustomerPlan } from './app-data';

type HrRow = {
  full_name: string;
  linkedin_url: string;
  title: string;
  company: string;
  sector: string;
  company_tier: string;
};

// Recruiters who actually respond first: mid-market and SME, then large, then
// agencies, with giants last (aspiration, not responders).
const TIER_RANK: Record<string, number> = { mid_market: 0, sme: 1, large: 2, agency: 3, giant: 4 };

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ',') { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

let cache: HrRow[] | null = null;

function loadRows(): HrRow[] {
  if (cache) return cache;
  const text = readFileSync(path.join(process.cwd(), 'data', 'hr_contacts.clean.csv'), 'utf8');
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const header = splitCsvLine(lines[0]).map((h) => h.trim());
  const col = (k: string) => header.indexOf(k);
  const [iName, iUrl, iTitle, iCompany, iSector, iTier] = [
    col('full_name'), col('linkedin_url'), col('title'), col('company'), col('sector'), col('company_tier'),
  ];
  const rows: HrRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const c = splitCsvLine(lines[i]);
    rows.push({
      full_name: c[iName] ?? '',
      linkedin_url: c[iUrl] ?? '',
      title: c[iTitle] ?? '',
      company: c[iCompany] ?? '',
      sector: c[iSector] ?? '',
      company_tier: c[iTier] ?? '',
    });
  }
  cache = rows;
  return rows;
}

function toContact(r: HrRow, i: number): Contact {
  return {
    id: `hr-${i}`,
    name: { ar: r.full_name, en: r.full_name },
    role: { ar: r.title, en: r.title },
    company: { ar: r.company, en: r.company },
    sector: r.sector,
    companyTier: (r.company_tier as CompanyTier) || undefined,
    status: 'new',
    when: { ar: 'جديد', en: 'New' },
    linkedin: r.linkedin_url || undefined,
  };
}

// Round-robins across the customer's sectors (responders-first within each) so the
// capped list stays diverse instead of being dominated by one sector.
export function getHrContacts(sectors: string[], cap: number): Contact[] {
  const rows = loadRows();
  const bySector = new Map<string, HrRow[]>();
  for (const s of sectors) {
    const list = rows.filter((r) => r.sector === s).sort((a, b) => (TIER_RANK[a.company_tier] ?? 9) - (TIER_RANK[b.company_tier] ?? 9));
    if (list.length) bySector.set(s, list);
  }
  const picked: HrRow[] = [];
  let progressed = true;
  while (picked.length < cap && progressed) {
    progressed = false;
    for (const s of sectors) {
      const list = bySector.get(s);
      if (list && list.length) {
        picked.push(list.shift() as HrRow);
        progressed = true;
        if (picked.length >= cap) break;
      }
    }
  }
  return picked.map(toContact);
}

// Fill plan.hrContacts from the real DB, capped at the plan's tier.
export function withHr(plan: CustomerPlan): CustomerPlan {
  return { ...plan, hrContacts: getHrContacts(plan.sectors, TIER_CAP[plan.tier]) };
}
