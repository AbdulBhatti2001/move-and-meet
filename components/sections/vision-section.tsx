import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui';
import { Reveal } from '@/components/motion/reveal';

/**
 * VisionSection — short manifesto block for the /about page.
 *
 * Typographic layout: oversized opening quote ("Strong women. Soft hearts."),
 * then 2–3 supporting paragraphs framed left-aligned at prose-width. No
 * imagery; the founder cards below carry the visual weight.
 *
 * Content lives in messages/{locale}.json under the About.vision namespace.
 */
export function VisionSection() {
  const t = useTranslations('About.vision');

  return (
    <Container as="section" size="md" className="py-20 md:py-28" aria-labelledby="vision-heading">
      <Reveal>
        <p className="text-bronze-400 text-xs tracking-[0.3em] uppercase">{t('eyebrow')}</p>
      </Reveal>

      <Reveal delay={0.05}>
        <blockquote
          id="vision-heading"
          className="font-display text-cream-100 mt-6 text-4xl leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
        >
          {t('quote')}
        </blockquote>
      </Reveal>

      <div className="text-cream-100/80 mt-10 max-w-prose space-y-6 text-base leading-relaxed sm:text-lg">
        <Reveal delay={0.1}>
          <p>{t('paragraph1')}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p>{t('paragraph2')}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <p>{t('paragraph3')}</p>
        </Reveal>
      </div>
    </Container>
  );
}
