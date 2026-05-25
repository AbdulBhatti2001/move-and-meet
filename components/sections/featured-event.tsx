import { ArrowRight } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Container, SectionHeader } from '@/components/ui';
import { Reveal } from '@/components/motion/reveal';
import { formatEventDate } from '@/lib/shared/format-date';
import { getNextEvent } from '@/lib/server/events';

/**
 * FeaturedEvent — landing-page section that highlights the next upcoming
 * event. Renders nothing if there are no upcoming events (no empty state on
 * the home page; the /events list handles that case).
 *
 * Server component, awaits data at build time during SSG.
 */
export async function FeaturedEvent() {
  const event = await getNextEvent();
  if (!event) return null;

  const locale = (await getLocale()) as 'de' | 'en';
  const t = await getTranslations('Events');

  return (
    <section
      className="bg-olive-900 py-20 sm:py-24 md:py-32"
      aria-labelledby="featured-event-heading"
    >
      <Container size="lg">
        <Reveal>
          <SectionHeader
            align="center"
            level={2}
            eyebrow={t('featured.eyebrow')}
            title={<span id="featured-event-heading">{t('featured.heading')}</span>}
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <article className="ring-cream-100/10 flex flex-col gap-8 rounded-3xl bg-olive-700/40 p-8 ring-1 md:p-12">
            <div className="flex flex-col gap-3">
              <p className="text-bronze-400 text-xs tracking-[0.3em] uppercase">
                {t(`activity.${event.activity}`)} · {t(`difficulty.${event.difficulty}`)}
              </p>
              <h3 className="font-display text-cream-100 text-4xl leading-tight tracking-tight sm:text-5xl">
                {event.title[locale]}
              </h3>
              <p className="text-cream-100/70 text-base sm:text-lg">
                {formatEventDate(event.date, locale)} · {event.location.name},{' '}
                {event.location.meeting_point[locale]}
              </p>
            </div>

            <p className="text-cream-100/80 max-w-prose leading-relaxed">
              {event.description[locale]}
            </p>

            <div>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={`/events/${event.slug}` as any}
                className="text-cream-100 hover:text-bronze-400 group focus-visible:outline-bronze-400 inline-flex items-center gap-2 rounded-sm text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {t('featured.cta')}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
