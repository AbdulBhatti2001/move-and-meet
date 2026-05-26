import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container, SectionHeader } from '@/components/ui';
import { CommunityGallery } from '@/components/sections/community-gallery';
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
  const t = await getTranslations({ locale, namespace: 'Community' });
  return { title: t('title') };
}

/**
 * /community — what the community is and how it feels.
 *
 * Composition: page header → typographic gallery mosaic (placeholder until
 * real Move & Meet photos land in Phase 2) → "beginners welcome" closing
 * note. The /join page handles actual on-ramps.
 */
export default async function CommunityPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('Community');

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

      <Container size="xl" className="pb-16" as="section" aria-labelledby="gallery-heading">
        <Reveal>
          <h2
            id="gallery-heading"
            className="font-display text-cream-100 text-3xl tracking-tight sm:text-4xl"
          >
            {t('gallery.heading')}
          </h2>
        </Reveal>
        <CommunityGallery />
      </Container>

      <Container
        as="section"
        size="md"
        className="py-16 md:py-24"
        aria-labelledby="welcome-heading"
      >
        <Reveal>
          <h2
            id="welcome-heading"
            className="font-display text-cream-100 text-3xl tracking-tight sm:text-4xl"
          >
            {t('welcome.heading')}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-cream-100/80 mt-6 max-w-prose text-base leading-relaxed sm:text-lg">
            {t('welcome.body')}
          </p>
        </Reveal>
      </Container>
    </>
  );
}
