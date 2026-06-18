import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Instrument_Serif } from 'next/font/google';
import MarketingA from '@/components/marketing/a';
import MarketingB from '@/components/marketing/b';
import MarketingC from '@/components/marketing/c';
import MarketingD from '@/components/marketing/d';
import MarketingE from '@/components/marketing/e';
import MarketingF from '@/components/marketing/f';
import MarketingG from '@/components/marketing/g';
import MarketingH from '@/components/marketing/h';
import type { Loc } from '@/lib/app-data';

// Three from-scratch marketing landing variants in the v4 "Atlas" design, each at
// /<locale>/m/<a|b|c>. Pick a winner and it becomes the root landing. The Instrument
// Serif display face is loaded here and scoped via --font-serif, matching v4.
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const VERSIONS = { a: MarketingA, b: MarketingB, c: MarketingC, d: MarketingD, e: MarketingE, f: MarketingF, g: MarketingG, h: MarketingH } as const;

export function generateStaticParams() {
  return Object.keys(VERSIONS).map((v) => ({ v }));
}

export default function MarketingPage({
  params: { locale, v },
}: {
  params: { locale: string; v: string };
}) {
  setRequestLocale(locale);
  const Comp = VERSIONS[v as keyof typeof VERSIONS];
  if (!Comp) notFound();
  return (
    <div className={serif.variable}>
      <Comp locale={locale as Loc} />
    </div>
  );
}
