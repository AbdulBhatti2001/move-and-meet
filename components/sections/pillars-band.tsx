import { Footprints, Heart, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container, SectionHeader } from '@/components/ui';
import { Reveal } from '@/components/motion/reveal';

const PILLARS = [
  { key: 'movement', Icon: Footprints },
  { key: 'connection', Icon: Users },
  { key: 'sisterhood', Icon: Heart },
] as const;

/**
 * PillarsBand — Movement · Connection · Sisterhood.
 *
 * Three columns under a centred SectionHeader, each with a Lucide icon ringed
 * in a soft cream chip, brand-display title, and a short body line.
 *
 * Reveals stagger left-to-right via increasing delay on each card.
 */
export function PillarsBand() {
  const t = useTranslations('Pillars');

  return (
    <section className="bg-olive-800 py-20 sm:py-24 md:py-32" aria-labelledby="pillars-heading">
      <Container size="xl">
        <Reveal>
          <SectionHeader
            align="center"
            level={2}
            eyebrow={t('eyebrow')}
            title={<span id="pillars-heading">{t('heading')}</span>}
          />
        </Reveal>

        <ul role="list" className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {PILLARS.map(({ key, Icon }, index) => (
            <Reveal
              key={key}
              as="li"
              delay={index * 0.08}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="bg-cream-100/5 ring-cream-100/10 flex h-14 w-14 items-center justify-center rounded-full ring-1">
                <Icon className="text-bronze-400 h-6 w-6" aria-hidden />
              </div>
              <h3 className="font-display text-cream-100 text-3xl">{t(`${key}.title`)}</h3>
              <p className="text-cream-100/70 max-w-xs leading-relaxed">{t(`${key}.body`)}</p>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
