import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container, SectionHeader } from '@/components/ui';
import { FounderCard } from '@/components/sections/founder-card';
import { VisionSection } from '@/components/sections/vision-section';
import { Reveal } from '@/components/motion/reveal';
import { isValidLocale, routing } from '@/i18n/routing';

/** Pre-render per locale at build time; no runtime data fetching. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'About' });
  return { title: t('title') };
}

/**
 * /about — Über uns.
 *
 * Composition: page header → vision/manifesto block → two founder cards
 * (Aysin links, Michelle rechts). No registration CTAs here per Phase 1
 * scope; community on-ramps live on /join.
 */
export default async function AboutPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('About');

  return (
    <>
      <Container as="section" size="lg" className="py-20 md:py-28">
        <SectionHeader
          align="center"
          level={1}
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
      </Container>

      <VisionSection />

      <Container
        as="section"
        size="lg"
        className="space-y-24 py-16 md:space-y-32 md:py-24"
        aria-labelledby="founders-heading"
      >
        <Reveal>
          <h2
            id="founders-heading"
            className="font-display text-cream-100 text-center text-3xl tracking-tight sm:text-4xl"
          >
            {t('founders.heading')}
          </h2>
        </Reveal>

        <FounderCard founder="aysin" align="left" />
        <FounderCard founder="michelle" align="right" />
      </Container>
    </>
  );
}
