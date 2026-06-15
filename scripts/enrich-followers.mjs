#!/usr/bin/env node
// Masaar — enrich HR contacts with REAL LinkedIn follower/connection counts via
// Proxycurl, then sort by followers (a proxy for "is this person active").
// We do NOT invent numbers: a row only gets a follower count if the API returns one.
//
//   PROXYCURL_API_KEY=... node scripts/enrich-followers.mjs [input.csv] [output.csv]
//   (defaults: data/hr_contacts.clean.csv -> data/hr_contacts.enriched.csv)
//
// Resumable: re-running skips rows that already have a follower value in the
// output file, so you can stop/restart without paying for the same profile twice.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const INPUT = process.argv[2] ?? 'data/hr_contacts.clean.csv';
const OUTPUT = process.argv[3] ?? 'data/hr_contacts.enriched.csv';
const KEY = process.env.PROXYCURL_API_KEY;
const ENDPOINT = 'https://nubela.co/proxycurl/api/v2/linkedin';
// Inactivity heuristic: a real recruiter/TA profile in active use almost always
// has > this many followers. Tune freely; it only sets the `likely_active` flag.
const ACTIVE_FOLLOWER_THRESHOLD = Number(process.env.ACTIVE_THRESHOLD ?? 200);

if (!KEY) {
  console.error('✗ Set PROXYCURL_API_KEY (get one at nubela.co/proxycurl).');
  console.error('  The script is ready; it just needs a key to call the API.');
  process.exit(1);
}

function parseCsv(text) {
  const rows = []; let f = '', row = [], q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(f); rows.push(row); f = ''; row = []; }
    else f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => r.length && r.some((v) => v.trim() !== ''));
}
const cell = (v) => { const s = String(v ?? ''); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

const rows = parseCsv(readFileSync(INPUT, 'utf8'));
const header = rows[0].map((h) => h.trim());
const records = rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));

// resume: load any already-enriched followers keyed by URL
const prior = new Map();
if (existsSync(OUTPUT)) {
  const pr = parseCsv(readFileSync(OUTPUT, 'utf8'));
  const ph = pr[0].map((h) => h.trim());
  for (const r of pr.slice(1)) {
    const o = Object.fromEntries(ph.map((h, i) => [h, r[i] ?? '']));
    if (o.linkedin_url && o.followers !== '') prior.set(o.linkedin_url, o);
  }
}

async function fetchFollowers(url) {
  const u = `${ENDPOINT}?url=${encodeURIComponent(url)}&use_cache=if-present&fallback_to_cache=on-error`;
  const res = await fetch(u, { headers: { Authorization: `Bearer ${KEY}` } });
  if (res.status === 404) return { followers: '', connections: '', note: 'not_found' };
  if (res.status === 429) { await new Promise((r) => setTimeout(r, 3000)); return fetchFollowers(url); }
  if (!res.ok) return { followers: '', connections: '', note: `http_${res.status}` };
  const d = await res.json();
  return {
    followers: d.follower_count ?? '',
    connections: d.connections ?? '',
    note: '',
  };
}

let done = 0, enriched = 0;
for (const rec of records) {
  const cached = prior.get(rec.linkedin_url);
  if (cached) { rec.followers = cached.followers; rec.connections = cached.connections ?? ''; }
  else {
    const r = await fetchFollowers(rec.linkedin_url);
    rec.followers = r.followers; rec.connections = r.connections;
    if (r.followers !== '') enriched++;
    await new Promise((res) => setTimeout(res, 300)); // gentle pacing
  }
  rec.likely_active = rec.followers !== '' && Number(rec.followers) >= ACTIVE_FOLLOWER_THRESHOLD ? 'yes' : (rec.followers === '' ? 'unknown' : 'low');
  if (++done % 50 === 0) console.log(`  ${done}/${records.length} processed (${enriched} new lookups)`);
}

// sort by followers desc (rows with no data sink to the bottom)
records.sort((a, b) => (Number(b.followers) || -1) - (Number(a.followers) || -1));

const outCols = [...header.filter((h) => !['followers', 'connections', 'likely_active'].includes(h)), 'followers', 'connections', 'likely_active'];
const out = [outCols.join(',')];
for (const rec of records) out.push(outCols.map((c) => cell(rec[c])).join(','));
writeFileSync(OUTPUT, out.join('\n') + '\n');
console.log(`\n✓ Enriched ${enriched} profiles this run. Sorted by followers → ${OUTPUT}`);
