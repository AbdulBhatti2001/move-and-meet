import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { JoinCta } from '@/components/sections/join-cta';
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
  const t = await getTranslations({ locale, namespace: 'Join' });
  return { title: t('title') };
}

/**
 * /join — community on-ramp.
 *
 * Single section: JoinCta with WhatsApp + Instagram buttons. No form, no
 * email collection (Phase 1 scope). Everything coordinates externally.
 */
export default async function JoinPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  return <JoinCta />;
}
