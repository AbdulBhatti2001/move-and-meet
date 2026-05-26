import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container, SectionHeader } from '@/components/ui';
import { LegalContent } from '@/components/sections/legal-content';
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
  const t = await getTranslations({ locale, namespace: 'Legal' });
  return { title: t('title') };
}

/**
 * /rechtliches — combined Impressum + Datenschutzerklärung.
 *
 * Per PROJECT_BRIEF section 4 (Name-Minimierung) this is the ONLY public
 * surface where the owner's full name appears. Footer link reads
 * "Rechtliches" / "Legal" without the name, navigation never mentions it.
 *
 * Route name is intentionally Swiss German (`rechtliches`) for both locales —
 * the EN version still uses the same URL slug to keep a single canonical
 * legal page. The page heading and body translate normally.
 */
export default async function RechtlichesPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('Legal');

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

      <Container as="section" size="md" className="pb-24">
        <LegalContent />
      </Container>
    </>
  );
}
