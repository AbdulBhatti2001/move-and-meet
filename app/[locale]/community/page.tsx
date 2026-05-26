import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container, SectionHeader } from '@/components/ui';
import { CommunityGallery } from '@/components/sections/community-gallery';
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
  const t = await getTranslations({ locale, namespace: 'Community' });
  return { title: t('title'), description: t('subtitle') };
}

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

      <Container size="xl" className="pb-24">
        <Reveal>
          <CommunityGallery />
        </Reveal>
      </Container>

      <section className="bg-olive-900 py-24 md:py-32" aria-labelledby="beginners-heading">
        <Container size="md">
          <Reveal>
            <SectionHeader
              align="center"
              level={2}
              eyebrow={t('beginners.eyebrow')}
              title={<span id="beginners-heading">{t('beginners.heading')}</span>}
              subtitle={t('beginners.body')}
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
