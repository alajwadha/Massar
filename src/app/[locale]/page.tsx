import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { ScoreSection } from '@/components/landing/score-section';
import { Features } from '@/components/landing/features';
import { Contacts } from '@/components/landing/contacts';
import { Pricing } from '@/components/landing/pricing';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScoreSection />
        <Features />
        <Contacts />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
