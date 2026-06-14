import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { SECTORS, SECTOR_BY_SLUG, type Tier, type SectorSlug } from './sectors';

export type HrContact = {
  full_name: string;
  linkedin_url: string;
  title: string;
  company: string;
  sector: SectorSlug;
  company_tier: Tier | '';
  source: string;
};

// minimal CSV parser (handles quoted fields and escaped quotes)
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); field = ''; row = [];
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length && r.some((v) => v.trim() !== ''));
}

export function loadHrContacts(): HrContact[] {
  const file = path.join(process.cwd(), 'data', 'hr_contacts.clean.csv');
  if (!existsSync(file)) return [];
  const rows = parseCsv(readFileSync(file, 'utf8'));
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim());
  const idx = (k: string) => header.indexOf(k);
  return rows.slice(1).map((r) => ({
    full_name: r[idx('full_name')] ?? '',
    linkedin_url: r[idx('linkedin_url')] ?? '',
    title: r[idx('title')] ?? '',
    company: r[idx('company')] ?? '',
    sector: (r[idx('sector')] ?? '') as SectorSlug,
    company_tier: (r[idx('company_tier')] ?? '') as Tier | '',
    source: r[idx('source')] ?? '',
  }));
}

export type SectorStat = {
  slug: SectorSlug;
  name_ar: string;
  name_en: string;
  priority: 1 | 2 | 3;
  target: number;
  count: number;
};

export type HrStats = {
  total: number;
  companies: number;
  sectorsCovered: number;
  byTier: Record<string, number>;
  sectors: SectorStat[];
};

export function computeStats(contacts: HrContact[]): HrStats {
  const bySector = new Map<string, number>();
  const byTier: Record<string, number> = {};
  const companies = new Set<string>();
  for (const c of contacts) {
    bySector.set(c.sector, (bySector.get(c.sector) ?? 0) + 1);
    if (c.company_tier) byTier[c.company_tier] = (byTier[c.company_tier] ?? 0) + 1;
    if (c.company) companies.add(c.company.trim().toLowerCase());
  }
  const sectors: SectorStat[] = SECTORS.map((s) => ({
    slug: s.slug,
    name_ar: s.name_ar,
    name_en: s.name_en,
    priority: s.priority,
    target: s.target,
    count: bySector.get(s.slug) ?? 0,
  }));
  return {
    total: contacts.length,
    companies: companies.size,
    sectorsCovered: sectors.filter((s) => s.count > 0).length,
    byTier,
    sectors,
  };
}
