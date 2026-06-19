// Trustworthy scoring rubric. Turns a small set of CV-grounded inputs into a
// per-seniority competitiveness score (0-100), so every number is DERIVED and
// explainable, not hand-picked. app-data builds each path's scoreByLevel from
// these inputs via withScore(). See docs/SCORING.md for the model in prose.

import type { Level } from './app-data';

type LS = { ar: string; en: string };

export type ScoreInput = {
  education: number; // degree level + field relevance, 0-100
  experience: number; // role relevance + quality, 0-100 (blended with employer caliber)
  skills: number; // tools, methods, and certs the path needs, 0-100
  impact: number; // quantified results and scope, 0-100
  trajectory: number; // years + promotions + leadership = seniority signal, 0-100
  employer?: string; // current or last employer; a recognized name lifts experience
  university?: string; // degree institution; its rank lifts education
};

// Company names matter: a recognized employer lifts the experience input.
// Caliber 0-100. Lookup is lowercase substring, so "Saudi Aramco" matches "aramco".
export const EMPLOYER_CALIBER: Record<string, number> = {
  aramco: 96, sabic: 92, 'baker hughes': 90, slb: 90, schlumberger: 90, halliburton: 88,
  'acwa power': 88, maaden: 86, "ma'aden": 86, pif: 95, 'public investment fund': 95, neom: 88,
  sadara: 84, tasnee: 82, zamil: 82, alfanar: 80, hadeed: 82, 'red sea global': 86, 'red sea gateway': 82,
  saipem: 88, mcdermott: 82, petrofac: 80, worley: 82, 'larsen & toubro': 82, 'l&t': 82, nesma: 76, 'nasser al hajri': 74,
  mckinsey: 96, bcg: 96, 'boston consulting': 96, bain: 96, 'strategy&': 90, kearney: 88, 'oliver wyman': 88,
  deloitte: 84, pwc: 84, ey: 84, kpmg: 84, accenture: 84,
  stc: 86, elm: 84, sdaia: 86, lean: 80, tonomus: 84, google: 95, microsoft: 94, ibm: 86, aws: 92, amazon: 92,
  bahri: 82, aramex: 80, smsa: 76, 'saudi post': 74, spl: 74, sar: 80, ajex: 74, almajdouie: 76,
  almarai: 84, nupco: 80, 'saudi national bank': 88, snb: 88, sanabil: 90, jadwa: 84,
  swcc: 78, 'ras al-khair': 80, 'ras al khair': 80, 'water authority': 76, marafiq: 78,
};

// University rank input (0-100), same lowercase substring lookup.
export const UNI_RANK: Record<string, number> = {
  mit: 99, stanford: 99, harvard: 99, oxford: 98, cambridge: 98, princeton: 98, yale: 97, caltech: 98,
  cornell: 95, columbia: 95, 'imperial college': 95, 'university of michigan': 90, michigan: 90,
  berkeley: 95, ucla: 90, 'carnegie mellon': 93, 'new york university': 88, nyu: 88,
  cranfield: 82, rotterdam: 84, erasmus: 84, sheffield: 82, manchester: 86, edinburgh: 88, warwick: 86,
  kaust: 92, kfupm: 88, 'king fahd': 88, ksu: 80, 'king saud': 80, kau: 78, 'king abdulaziz': 78,
  'king faisal': 72, 'prince mohammad': 70, pmu: 70, 'jubail industrial': 56, jubail: 56, 'prince sultan': 70,
};

function lookup(table: Record<string, number>, name?: string): number | null {
  if (!name) return null;
  const n = name.toLowerCase();
  for (const key of Object.keys(table)) {
    if (n.includes(key)) return table[key];
  }
  return null;
}

function blend(base: number, ref: number | null, refWeight: number): number {
  if (ref == null) return base;
  return Math.round(base * (1 - refWeight) + ref * refWeight);
}

// Quality (0-100): how strong the candidate is on this path, regardless of seniority.
export function baseStrength(i: ScoreInput): number {
  const edu = blend(i.education, lookup(UNI_RANK, i.university), 0.45);
  const exp = blend(i.experience, lookup(EMPLOYER_CALIBER, i.employer), 0.4);
  return edu * 0.15 + exp * 0.25 + i.skills * 0.35 + i.impact * 0.25;
}

// Each level blends quality (q) with the seniority signal (t), plus a baseline (b).
// Entry leans on quality and sits high; director leans on trajectory and sits low
// until years and leadership accumulate. This is why one strong junior is rightly
// entry-ready and far from director, with no number hand-typed.
const LEVEL_COEF: Record<Level, { q: number; t: number; b: number }> = {
  entry: { q: 0.7, t: 0.1, b: 28 },
  mid: { q: 0.6, t: 0.25, b: 9 },
  senior: { q: 0.45, t: 0.5, b: -8 },
  director: { q: 0.32, t: 0.68, b: -18 },
};

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

export function computeScoreByLevel(i: ScoreInput): Record<Level, number> {
  const B = baseStrength(i);
  const out = {} as Record<Level, number>;
  (Object.keys(LEVEL_COEF) as Level[]).forEach((l) => {
    const c = LEVEL_COEF[l];
    out[l] = clamp(Math.round(c.q * B + c.t * i.trajectory + c.b), 1, 99);
  });
  return out;
}

const DIM_LABEL: Record<'education' | 'experience' | 'skills' | 'impact', LS> = {
  education: { ar: 'التعليم', en: 'education' },
  experience: { ar: 'الخبرة', en: 'experience' },
  skills: { ar: 'المهارات', en: 'skills' },
  impact: { ar: 'الأثر', en: 'impact' },
};

// One derived line tying the number to its top two drivers and the chosen level.
export function scoreNote(i: ScoreInput, level: Level, locale: 'ar' | 'en'): string {
  const edu = blend(i.education, lookup(UNI_RANK, i.university), 0.45);
  const exp = blend(i.experience, lookup(EMPLOYER_CALIBER, i.employer), 0.4);
  const dimsRaw: { key: keyof typeof DIM_LABEL; v: number }[] = [
    { key: 'education', v: edu },
    { key: 'experience', v: exp },
    { key: 'skills', v: i.skills },
    { key: 'impact', v: i.impact },
  ];
  const dims = dimsRaw.sort((a, b) => b.v - a.v);
  const top = dims.slice(0, 2).map((d) => DIM_LABEL[d.key][locale]);
  const tagExp = dims.slice(0, 2).some((d) => d.key === 'experience') && i.employer ? ` (${i.employer})` : '';

  if (locale === 'ar') {
    const byLevel: Record<Level, string> = {
      entry: 'جاهز لأدوار البداية.',
      mid: 'وضعك ممتاز للأدوار المتوسطة.',
      senior: 'لمستوى الخبير، تحتاج سنوات وقيادة أكثر.',
      director: 'المستوى القيادي هدف على المدى الطويل، يجي مع الخبرة.',
    };
    return `أقوى ما عندك: ${top[0]} و${top[1]}${tagExp}. ${byLevel[level]}`;
  }
  const byLevel: Record<Level, string> = {
    entry: 'Ready for entry roles.',
    mid: 'Well placed for mid roles.',
    senior: 'Senior needs more years and leadership.',
    director: 'Director is a longer term goal as experience compounds.',
  };
  return `Strongest inputs: ${top[0]} and ${top[1]}${tagExp}. ${byLevel[level]}`;
}
