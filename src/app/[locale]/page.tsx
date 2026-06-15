import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { TrustBar } from '@/components/landing/trust-bar';
import { Problem } from '@/components/landing/problem';
import { ScoreSection } from '@/components/landing/score-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Features } from '@/components/landing/features';
import { Contacts } from '@/components/landing/contacts';
import { Hadaf } from '@/components/landing/hadaf';
import { Testimonials } from '@/components/landing/testimonials';
import { Pricing } from '@/components/landing/pricing';
import { FAQ } from '@/components/landing/faq';
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
        <TrustBar />
        <Problem />
        <ScoreSection />
        <HowItWorks />
        <Features />
        <Contacts />
        <Hadaf />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
