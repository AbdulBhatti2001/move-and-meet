import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container, SectionHeader } from '@/components/ui';
import { FaqAccordion } from '@/components/sections/faq-accordion';
import { Reveal } from '@/components/motion/reveal';
import { isValidLocale, routing } from '@/i18n/routing';

/** Pre-render per locale at build time; no runtime data fetching. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

const FAQ_IDS = [
  'beginners',
  'womenOnly',
  'cost',
  'equipment',
  'religion',
  'safety',
  'signup',
  'kids',
] as const;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'FAQ' });
  return { title: t('title') };
}

/**
 * /faq — Häufige Fragen.
 *
 * Eight questions covering the most common newcomer concerns: experience
 * level, women-only policy, cost, gear, religion, safety, sign-up flow,
 * children. Accordion is a client component; everything around it stays
 * server-rendered.
 */
export default async function FaqPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('FAQ');

  const items = FAQ_IDS.map((id) => ({
    id,
    question: t(`items.${id}.question`),
    answer: t(`items.${id}.answer`),
  }));

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
        <Reveal>
          <FaqAccordion items={items} />
        </Reveal>
      </Container>
    </>
  );
}
