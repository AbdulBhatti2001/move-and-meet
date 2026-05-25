import { ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Container, SectionHeader } from '@/components/ui';
import { EventMeta } from '@/components/sections/event-meta';
import { Reveal } from '@/components/motion/reveal';
import { isValidLocale, routing } from '@/i18n/routing';
import { getAllEvents, getEventBySlug } from '@/lib/server/events';

export const dynamic = 'force-static';

type Params = Promise<{ locale: string; slug: string }>;

export async function generateStaticParams() {
  const events = await getAllEvents();
  return events.flatMap((event) => routing.locales.map((locale) => ({ locale, slug: event.slug })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const event = await getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.title[locale],
    description: event.description[locale].slice(0, 160),
  };
}

export default async function EventDetailPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const _locale = (await getLocale()) as 'de' | 'en';
  const t = await getTranslations('Events');

  return (
    <Container as="article" size="md" className="py-16 md:py-24">
      <Reveal>
        <Link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          href={'/events' as any}
          className="text-cream-100/60 hover:text-cream-100 focus-visible:outline-bronze-400 mb-12 inline-flex items-center gap-2 rounded-sm text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('backToList')}
        </Link>
      </Reveal>

      <Reveal>
        <SectionHeader
          level={1}
          eyebrow={`${t(`activity.${event.activity}`)} · ${t(`difficulty.${event.difficulty}`)}`}
          title={event.title[_locale]}
        />
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <EventMeta event={event} />
      </Reveal>

      <Reveal delay={0.15} className="prose prose-invert mt-12 max-w-none">
        <p className="text-cream-100/80 text-lg leading-relaxed">{event.description[_locale]}</p>
      </Reveal>

      {(event.whatsapp_link ?? event.instagram_link ?? event.location.map_url) ? (
        <Reveal delay={0.2} className="mt-12">
          <h2 className="font-display text-cream-100 text-2xl">{t('detail.joinHeading')}</h2>
          <p className="text-cream-100/70 mt-2 max-w-prose text-sm">{t('detail.joinIntro')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {event.whatsapp_link ? (
              <a
                href={event.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cream-100 hover:bg-cream-50 active:bg-cream-200 focus-visible:outline-bronze-400 inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium text-olive-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {t('detail.whatsapp')}
              </a>
            ) : null}
            {event.instagram_link ? (
              <a
                href={event.instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="border-cream-100/40 text-cream-100 hover:bg-cream-100/10 focus-visible:outline-bronze-400 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                {t('detail.instagram')}
              </a>
            ) : null}
            {event.location.map_url ? (
              <a
                href={event.location.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-cream-100/40 text-cream-100 hover:bg-cream-100/10 focus-visible:outline-bronze-400 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                {t('detail.map')}
              </a>
            ) : null}
          </div>
        </Reveal>
      ) : null}
    </Container>
  );
}
