import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container, SectionHeader } from '@/components/ui';
import { FounderCard } from '@/components/sections/founder-card';
import { VisionSection } from '@/components/sections/vision-section';
import { Reveal } from '@/components/motion/reveal';
import { isValidLocale, routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'About' });
  return { title: t('title'), description: t('subtitle') };
}

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
        className="py-24 md:py-32"
        aria-labelledby="founders-heading"
      >
        <Reveal>
          <SectionHeader
            align="center"
            level={2}
            eyebrow={t('founders.eyebrow')}
            title={<span id="founders-heading">{t('founders.heading')}</span>}
            subtitle={t('founders.intro')}
          />
        </Reveal>
        <div className="mt-20 flex flex-col gap-24">
          <FounderCard founder="aysin" align="left" />
          <FounderCard founder="michelle" align="right" />
        </div>
      </Container>
    </>
  );
}
