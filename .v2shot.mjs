import { chromium } from 'playwright';
import fs from 'fs';
const OUT = 'C:/Users/Ali-h/masaar-docs/v2shots';
fs.mkdirSync(OUT, { recursive: true });
const B = 'https://massar-sigma.vercel.app';
const shots = [
  { n: 'm-ar-light', url: '/ar/v2/mahdi-alarifi', w: 390, h: 844, dsf: 2, full: true },
  { n: 'm-ar-dark', url: '/ar/v2/mahdi-alarifi', w: 390, h: 844, dsf: 2, full: true, dark: true },
  { n: 'd-ar-light', url: '/ar/v2/mahdi-alarifi', w: 1280, h: 900, dsf: 1, full: false },
  { n: 'm-en-light', url: '/en/v2/mahdi-alarifi', w: 390, h: 844, dsf: 2, full: true },
];
const br = await chromium.launch();
for (const s of shots) {
  const ctx = await br.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.dsf, locale: s.url.includes('/ar/') ? 'ar' : 'en' });
  const p = await ctx.newPage();
  if (s.dark) await p.addInitScript(() => { try { localStorage.setItem('masaar:theme', 'dark'); } catch (e) {} });
  try { await p.goto(B + s.url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) { await p.goto(B + s.url, { waitUntil: 'domcontentloaded', timeout: 60000 }); }
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${OUT}/${s.n}.jpg`, type: 'jpeg', quality: 72, fullPage: !!s.full });
  console.log('shot', s.n);
  await ctx.close();
}
await br.close();
console.log('DONE');
