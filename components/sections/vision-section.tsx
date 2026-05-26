import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui';
import { Reveal } from '@/components/motion/reveal';

/**
 * VisionSection — manifesto block for the About page.
 *
 * Large display-serif quote anchors the section; supporting body copy
 * extends the message. Olive-900 background creates a quiet anchor before
 * the founder cards that follow.
 */
export function VisionSection() {
  const t = useTranslations('About');

  return (
    <section className="bg-olive-900 py-24 md:py-32" aria-labelledby="vision-heading">
      <Container size="md">
        <Reveal>
          <p className="text-bronze-400 text-center text-xs tracking-[0.3em] uppercase">
            {t('vision.eyebrow')}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote
            id="vision-heading"
            className="font-display text-cream-100 mt-6 text-center text-4xl leading-tight tracking-tight sm:text-5xl md:text-6xl"
          >
            {t('vision.quote')}
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="text-cream-100/70 mt-12 space-y-6 text-base leading-relaxed sm:text-lg">
            <p>{t('vision.body1')}</p>
            <p>{t('vision.body2')}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
