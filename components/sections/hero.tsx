import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container, SectionHeader } from '@/components/ui';
import { Reveal } from '@/components/motion/reveal';

/**
 * Hero — landing-page hero section.
 *
 * Phase 1: typography-driven hero on a radial olive gradient. No background
 * image yet; Sprint 4 swaps in a real Move & Meet hike/run photo or video.
 *
 * Two CTAs: primary leads to /join (community sign-on), secondary to /events
 * (next events list). Both routes resolve in Sprint 3 / Sprint 5; until then
 * they 404 with the default Next.js error page.
 */
export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section
      className="relative isolate flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden bg-olive-800"
      aria-label={t('title')}
    >
      {/* Decorative background. Swap with <video> or <Image> in Sprint 4. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, var(--color-olive-700) 0%, var(--color-olive-800) 45%, var(--color-olive-900) 100%)',
        }}
      />
      <div
        aria-hidden
        className="from-ink-950/40 absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t to-transparent"
      />

      <Container size="lg">
        <Reveal className="flex flex-col items-center gap-10 py-20 text-center md:py-28">
          <SectionHeader
            align="center"
            level={1}
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/join"
              className="bg-cream-100 hover:bg-cream-50 active:bg-cream-200 focus-visible:outline-bronze-400 inline-flex h-14 items-center justify-center rounded-full px-8 text-base font-medium text-olive-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={'/events' as any}
              className="border-cream-100/40 text-cream-100 hover:bg-cream-100/10 active:bg-cream-100/20 focus-visible:outline-bronze-400 inline-flex h-14 items-center justify-center rounded-full border px-8 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
