import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Container, SectionHeader } from '@/components/ui';
import { EventCard } from '@/components/sections/event-card';
import { Reveal } from '@/components/motion/reveal';
import { isValidLocale, routing } from '@/i18n/routing';
import { getPastEvents, getUpcomingEvents } from '@/lib/server/events';

/** Pre-render per locale at build time; no runtime data fetching. */
export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: 'Events' });
  return { title: t('title') };
}

export default async function EventsPage({ params }: { params: Params }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('Events');
  const upcoming = await getUpcomingEvents();
  const past = await getPastEvents();

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

      <Container size="xl" className="pb-16" as="section" aria-labelledby="upcoming-heading">
        <Reveal>
          <h2
            id="upcoming-heading"
            className="font-display text-cream-100 text-3xl tracking-tight sm:text-4xl"
          >
            {t('upcoming')}
          </h2>
        </Reveal>

        {upcoming.length === 0 ? (
          <Reveal className="mt-8">
            <p className="text-cream-100/60 max-w-prose">{t('noUpcoming')}</p>
          </Reveal>
        ) : (
          <ul role="list" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, index) => (
              <Reveal key={event.slug} as="li" delay={index * 0.06}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </ul>
        )}
      </Container>

      {past.length > 0 ? (
        <Container size="xl" className="pb-24" as="section" aria-labelledby="past-heading">
          <Reveal>
            <h2
              id="past-heading"
              className="font-display text-cream-100/70 text-2xl tracking-tight sm:text-3xl"
            >
              {t('past')}
            </h2>
          </Reveal>
          <ul role="list" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((event, index) => (
              <Reveal key={event.slug} as="li" delay={index * 0.06}>
                <EventCard event={event} variant="compact" />
              </Reveal>
            ))}
          </ul>
        </Container>
      ) : null}
    </>
  );
}
