#!/usr/bin/env node
// Masaar — import validated HR contacts into Supabase (hr_contacts).
// Dependency-free: uses PostgREST via fetch. Upserts on linkedin_url so
// re-running is safe (needs the unique index from migration 0006).
//
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/import-hr.mjs [clean.csv]

import { readFileSync, existsSync } from 'node:fs';

const INPUT = process.argv[2] ?? 'data/hr_contacts.clean.csv';
const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_BASE || !KEY) {
  console.error('✗ Set NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!existsSync(INPUT)) {
  console.error(`✗ Not found: ${INPUT} — run "npm run hr:validate" first.`);
  process.exit(1);
}

function parseCsv(text) {
  const rows = [];
  let field = '', row = [], q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; } else field += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(field); rows.push(row); field = ''; row = []; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length && r.some((v) => v.trim() !== ''));
}

const rows = parseCsv(readFileSync(INPUT, 'utf8'));
const header = rows[0].map((h) => h.trim());
const records = rows.slice(1).map((r) => {
  const o = {};
  header.forEach((h, i) => { o[h] = (r[i] ?? '').trim() || null; });
  o.verified_at = new Date().toISOString();
  o.is_active = true;
  return o;
});

if (records.length === 0) { console.log('Nothing to import.'); process.exit(0); }

const endpoint = `${URL_BASE.replace(/\/$/, '')}/rest/v1/hr_contacts?on_conflict=linkedin_url`;
const BATCH = 500;
let imported = 0;

for (let i = 0; i < records.length; i += BATCH) {
  const batch = records.slice(i, i + BATCH);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) {
    console.error(`✗ Batch ${i / BATCH + 1} failed: ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  imported += batch.length;
  console.log(`  upserted ${imported}/${records.length}`);
}
console.log(`✓ Imported ${imported} HR contacts.`);
