#!/usr/bin/env node
// Generate a single self-contained HTML dashboard from the HR dataset.
// No server/build needed — open the output file in any browser.
//   node scripts/build-dashboard-html.mjs
//   -> dist/hr-dashboard.html

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const SECTORS = [
  { slug: 'investment_finance', ar: 'الاستثمار والتمويل', en: 'Investment & Finance', priority: 1, target: 350 },
  { slug: 'consulting', ar: 'الاستشارات', en: 'Consulting', priority: 1, target: 280 },
  { slug: 'energy_petrochem', ar: 'الطاقة والبتروكيماويات', en: 'Energy & Petrochemicals', priority: 1, target: 280 },
  { slug: 'gigaprojects_realestate', ar: 'المشاريع الكبرى والعقار', en: 'Giga-projects & Real Estate', priority: 1, target: 350 },
  { slug: 'government', ar: 'الحكومة والقطاع العام', en: 'Government', priority: 1, target: 250 },
  { slug: 'recruitment_agencies', ar: 'مكاتب التوظيف والاستقدام', en: 'Recruitment & Staffing', priority: 1, target: 300 },
  { slug: 'telecom_it', ar: 'الاتصالات وتقنية المعلومات', en: 'Telecom & IT', priority: 2, target: 180 },
  { slug: 'tech_startups', ar: 'التقنية والشركات الناشئة', en: 'Tech & Startups', priority: 2, target: 250 },
  { slug: 'healthcare_pharma', ar: 'الصحة والأدوية', en: 'Healthcare & Pharma', priority: 2, target: 220 },
  { slug: 'manufacturing_mining', ar: 'الصناعة والتعدين', en: 'Manufacturing & Mining', priority: 2, target: 190 },
  { slug: 'transport_logistics', ar: 'النقل واللوجستيات', en: 'Transport & Logistics', priority: 2, target: 190 },
  { slug: 'retail_fmcg', ar: 'التجزئة والسلع الاستهلاكية', en: 'Retail & FMCG', priority: 3, target: 170 },
  { slug: 'education_training', ar: 'التعليم والتدريب', en: 'Education & Training', priority: 3, target: 160 },
  { slug: 'tourism_entertainment', ar: 'السياحة والترفيه', en: 'Tourism & Hospitality', priority: 3, target: 150 },
  { slug: 'insurance', ar: 'التأمين', en: 'Insurance', priority: 3, target: 100 },
  { slug: 'aerospace_defense', ar: 'الطيران والدفاع', en: 'Aerospace & Defense', priority: 3, target: 80 },
];

const TIERS = {
  giant: { ar: 'عملاقة', en: 'Giant' },
  large: { ar: 'كبيرة', en: 'Large' },
  mid_market: { ar: 'متوسطة', en: 'Mid-market' },
  sme: { ar: 'صغيرة', en: 'SME' },
  agency: { ar: 'مكتب توظيف', en: 'Agency' },
};

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

const csvPath = path.join(process.cwd(), 'data', 'hr_contacts.clean.csv');
const rows = parseCsv(readFileSync(csvPath, 'utf8'));
const header = rows[0].map((h) => h.trim());
const idx = (k) => header.indexOf(k);
const contacts = rows.slice(1).map((r) => ({
  n: r[idx('full_name')] ?? '',
  u: r[idx('linkedin_url')] ?? '',
  t: r[idx('title')] ?? '',
  c: r[idx('company')] ?? '',
  s: r[idx('sector')] ?? '',
  tier: r[idx('company_tier')] ?? '',
}));

const DATA = JSON.stringify({ contacts, sectors: SECTORS, tiers: TIERS });

const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Masaar — HR Database</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>
  :root{--ink:#0F1115;--soft:#3A3F47;--muted:#6B7280;--canvas:#FAFAF8;--raised:#fff;--line:#ECEAE4;--brand:#0E9F6E;--brand50:#ECFDF5;--brand700:#0B7A55;}
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--canvas);color:var(--ink);font-family:'Tajawal','Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.5}
  html[lang=en] body{font-family:'Inter',system-ui,sans-serif}
  .wrap{max-width:1100px;margin:0 auto;padding:24px 20px 60px}
  header.top{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--line);margin-bottom:24px}
  .logo{display:flex;align-items:center;gap:8px;font-weight:800}
  .logo .m{width:32px;height:32px;border-radius:10px;background:var(--ink);color:#fff;display:grid;place-items:center;font-weight:800}
  .btn{height:36px;padding:0 14px;border:1px solid var(--line);background:var(--raised);border-radius:999px;font:inherit;font-weight:600;color:var(--soft);cursor:pointer;transition:.2s}
  .btn:hover{border-color:rgba(15,17,21,.2);color:var(--ink)}
  h1{font-size:26px;font-weight:800;letter-spacing:-.02em}
  .sub{color:var(--muted);font-size:13px;margin-top:4px}
  .cards{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:24px}
  @media(min-width:760px){.cards{grid-template-columns:repeat(4,1fr)}}
  .card{border:1px solid var(--line);background:var(--raised);border-radius:16px;padding:18px;box-shadow:0 1px 2px rgba(15,17,21,.04),0 8px 24px rgba(15,17,21,.05)}
  .card .v{font-size:30px;font-weight:800;margin-top:10px;font-variant-numeric:tabular-nums}
  .card .l{font-size:12px;color:var(--muted);margin-top:2px}
  .dot{width:18px;height:18px;border-radius:6px;background:var(--brand50);display:inline-block}
  .panel{border:1px solid var(--line);background:var(--raised);border-radius:16px;padding:18px;margin-top:18px;box-shadow:0 1px 2px rgba(15,17,21,.04)}
  .bar{height:12px;background:var(--line);border-radius:999px;overflow:hidden;margin-top:12px}
  .bar>div{height:100%;background:var(--brand);border-radius:999px;transition:width .9s cubic-bezier(.16,1,.3,1)}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
  .chip{border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;background:#f1f0ec;color:var(--soft)}
  .pgroup{margin-top:26px}
  .pgroup h2{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px}
  .sectors{display:grid;grid-template-columns:1fr;gap:10px}
  @media(min-width:760px){.sectors{grid-template-columns:1fr 1fr}}
  .sec{border:1px solid var(--line);background:var(--raised);border-radius:12px;padding:13px;cursor:pointer;text-align:start;font:inherit;transition:.2s;color:inherit}
  .sec:hover{border-color:rgba(15,17,21,.2)}
  .sec.active{border-color:#34D399;box-shadow:0 1px 2px rgba(15,17,21,.06)}
  .sec .row{display:flex;justify-content:space-between;font-size:14px}
  .sec .row b{font-weight:600}
  .sec .num{color:var(--muted);font-variant-numeric:tabular-nums}
  .minibar{height:6px;background:var(--line);border-radius:999px;overflow:hidden;margin-top:8px}
  .minibar>div{height:100%;background:#10B981;border-radius:999px}
  .filters{display:flex;flex-direction:column;gap:10px;margin-top:34px}
  @media(min-width:680px){.filters{flex-direction:row;align-items:center}}
  .filters input,.filters select{height:44px;border:1px solid var(--line);background:var(--raised);border-radius:12px;padding:0 14px;font:inherit;outline:none}
  .filters input{flex:1}
  .filters input:focus,.filters select:focus{border-color:#34D399}
  .count{font-size:12px;color:var(--muted);margin:12px 0 8px}
  .tablewrap{border:1px solid var(--line);background:var(--raised);border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(15,17,21,.04)}
  .scroll{overflow-x:auto}
  table{width:100%;border-collapse:collapse;font-size:14px}
  th{text-align:start;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:500;padding:12px 16px;border-bottom:1px solid var(--line);white-space:nowrap}
  td{padding:12px 16px;border-bottom:1px solid rgba(236,234,228,.6)}
  tr:last-child td{border-bottom:0}
  tbody tr:hover{background:var(--canvas)}
  .name{font-weight:600}
  .tier{border-radius:6px;padding:2px 7px;font-size:11px;font-weight:600;white-space:nowrap}
  .tier.giant{background:rgba(15,17,21,.1);color:var(--ink)}
  .tier.large{background:#eff6ff;color:#1d4ed8}
  .tier.mid_market{background:var(--brand50);color:var(--brand700)}
  .tier.sme{background:#fffbeb;color:#b45309}
  .tier.agency{background:#f5f3ff;color:#6d28d9}
  a.li{color:var(--brand700);text-decoration:none;font-weight:600;white-space:nowrap}
  a.li:hover{color:var(--brand)}
  .muted{color:var(--muted)}
  .note{font-size:12px;color:var(--muted);margin-top:16px}
  .empty{text-align:center;color:var(--muted);padding:48px 0}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <div class="logo"><span class="m">م</span><span id="brand">مسار · الإدارة</span></div>
    <button class="btn" id="lang" onclick="toggleLang()">EN</button>
  </header>
  <h1 id="title">قاعدة بيانات HR</h1>
  <div class="sub" id="subtitle">تقدّم جمع جهات اتصال الموارد البشرية حسب القطاع والحجم.</div>
  <div class="cards" id="cards"></div>
  <div class="panel">
    <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:600">
      <span id="goalLabel">التقدّم نحو الهدف</span><span class="num muted" id="goalNum"></span>
    </div>
    <div class="bar"><div id="goalBar" style="width:0"></div></div>
  </div>
  <div class="chips" id="chips"></div>
  <div id="progress"></div>
  <div class="filters">
    <input id="q" oninput="render()" placeholder="ابحث بالاسم أو الشركة أو المنصب…"/>
    <select id="fsector" onchange="render()"></select>
    <select id="ftier" onchange="render()"></select>
  </div>
  <div class="count" id="count"></div>
  <div class="tablewrap"><div class="scroll"><table>
    <thead><tr id="thead"></tr></thead>
    <tbody id="tbody"></tbody>
  </table></div></div>
  <div class="note" id="note"></div>
</div>
<script>
const D = ${DATA};
let LANG = 'ar';
let activeSector = 'all';
const T = {
  ar:{brand:'مسار · الإدارة',title:'قاعدة بيانات HR',sub:'تقدّم جمع جهات اتصال الموارد البشرية حسب القطاع والحجم.',
    cards:['إجمالي جهات HR','الشركات','القطاعات المغطاة','من هدف 3500'],goal:'التقدّم نحو الهدف',
    p:{1:'أولوية ١',2:'أولوية ٢',3:'أولوية ٣'},allS:'كل القطاعات',allT:'كل الأحجام',
    q:'ابحث بالاسم أو الشركة أو المنصب…',th:['الاسم','المنصب','الشركة','القطاع','الحجم','LinkedIn'],open:'فتح',
    show:(a,b)=>'عرض '+a+' من '+b,empty:'لا نتائج',note:'المصدر: بحث ويب — غير مُتحقّق منه بعد. يُنصح بالتحقق قبل التواصل.',lang:'EN'},
  en:{brand:'Masaar · Admin',title:'HR database',sub:'Collection progress of HR contacts by sector and company size.',
    cards:['Total HR contacts','Companies','Sectors covered','of 3,500 goal'],goal:'Progress to goal',
    p:{1:'Priority 1',2:'Priority 2',3:'Priority 3'},allS:'All sectors',allT:'All tiers',
    q:'Search name, company, or title…',th:['Name','Title','Company','Sector','Tier','LinkedIn'],open:'Open',
    show:(a,b)=>'Showing '+a+' of '+b,empty:'No results',note:'Source: web search — unverified. Spot-check before outreach.',lang:'ع'}
};
const TOTAL_TARGET = D.sectors.reduce((s,x)=>s+x.target,0);
const sName = s => LANG==='ar'?s.ar:s.en;
const tName = k => D.tiers[k]?(LANG==='ar'?D.tiers[k].ar:D.tiers[k].en):k;
const esc = s => (s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function stats(){
  const bySec={},byTier={},comp=new Set();
  D.contacts.forEach(c=>{bySec[c.s]=(bySec[c.s]||0)+1;if(c.tier)byTier[c.tier]=(byTier[c.tier]||0)+1;if(c.c)comp.add(c.c.trim().toLowerCase())});
  return{total:D.contacts.length,companies:comp.size,covered:D.sectors.filter(s=>bySec[s.slug]).length,bySec,byTier};
}
const S = stats();

function toggleLang(){LANG=LANG==='ar'?'en':'ar';document.documentElement.lang=LANG;document.documentElement.dir=LANG==='ar'?'rtl':'ltr';build();render();}

function build(){
  const t=T[LANG];
  document.getElementById('brand').textContent=t.brand;
  document.getElementById('title').textContent=t.title;
  document.getElementById('subtitle').textContent=t.sub;
  document.getElementById('lang').textContent=t.lang;
  document.getElementById('goalLabel').textContent=t.goal;
  document.getElementById('goalNum').textContent=S.total.toLocaleString()+' / '+TOTAL_TARGET.toLocaleString();
  const pct=Math.round(S.total/TOTAL_TARGET*100);
  document.getElementById('goalBar').style.width=pct+'%';
  const cv=[S.total.toLocaleString(),S.companies.toLocaleString(),S.covered+' / 16',pct+'%'];
  document.getElementById('cards').innerHTML=t.cards.map((l,i)=>'<div class="card"><span class="dot"></span><div class="v">'+cv[i]+'</div><div class="l">'+l+'</div></div>').join('');
  document.getElementById('chips').innerHTML=Object.keys(D.tiers).map(k=>'<span class="chip">'+tName(k)+': '+((S.byTier[k]||0)).toLocaleString()+'</span>').join('');
  let prog='';
  [1,2,3].forEach(p=>{
    prog+='<div class="pgroup"><h2>'+t.p[p]+'</h2><div class="sectors">';
    D.sectors.filter(s=>s.priority===p).forEach(s=>{
      const n=S.bySec[s.slug]||0,w=Math.min(100,Math.round(n/s.target*100));
      prog+='<button class="sec'+(activeSector===s.slug?' active':'')+'" onclick="pick(\\''+s.slug+'\\')"><div class="row"><b>'+sName(s)+'</b><span class="num">'+n+' / '+s.target+'</span></div><div class="minibar"><div style="width:'+w+'%"></div></div></button>';
    });
    prog+='</div></div>';
  });
  document.getElementById('progress').innerHTML=prog;
  document.getElementById('q').placeholder=t.q;
  document.getElementById('fsector').innerHTML='<option value="all">'+t.allS+'</option>'+D.sectors.map(s=>'<option value="'+s.slug+'">'+sName(s)+'</option>').join('');
  document.getElementById('fsector').value=activeSector;
  document.getElementById('ftier').innerHTML='<option value="all">'+t.allT+'</option>'+Object.keys(D.tiers).map(k=>'<option value="'+k+'">'+tName(k)+'</option>').join('');
  document.getElementById('thead').innerHTML=t.th.map(h=>'<th>'+h+'</th>').join('');
}

function pick(slug){activeSector=activeSector===slug?'all':slug;build();render();}

function render(){
  const t=T[LANG];
  const q=document.getElementById('q').value.trim().toLowerCase();
  const fs=document.getElementById('fsector').value;
  const ft=document.getElementById('ftier').value;
  activeSector=fs;
  const sMap=Object.fromEntries(D.sectors.map(s=>[s.slug,sName(s)]));
  const list=D.contacts.filter(c=>{
    if(fs!=='all'&&c.s!==fs)return false;
    if(ft!=='all'&&c.tier!==ft)return false;
    if(!q)return true;
    return c.n.toLowerCase().includes(q)||c.c.toLowerCase().includes(q)||c.t.toLowerCase().includes(q);
  });
  document.getElementById('count').textContent=t.show(list.length,S.total);
  document.getElementById('tbody').innerHTML=list.length?list.map(c=>
    '<tr><td class="name">'+esc(c.n)+'</td><td class="muted">'+(esc(c.t)||'—')+'</td><td class="muted">'+esc(c.c)+'</td>'+
    '<td class="muted" style="white-space:nowrap;font-size:12px">'+(sMap[c.s]||c.s)+'</td>'+
    '<td>'+(c.tier?'<span class="tier '+c.tier+'">'+tName(c.tier)+'</span>':'')+'</td>'+
    '<td><a class="li" href="'+esc(c.u)+'" target="_blank" rel="noopener">'+t.open+' ↗</a></td></tr>'
  ).join(''):'<tr><td colspan="6" class="empty">'+t.empty+'</td></tr>';
  document.getElementById('note').textContent=t.note;
}
build();render();
</script>
</body>
</html>`;

const outDir = path.join(process.cwd(), 'dist');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'hr-dashboard.html');
writeFileSync(out, html);
console.log(`✓ Wrote ${out} (${contacts.length} contacts, ${(html.length / 1024).toFixed(0)} KB)`);
