import { useTranslations } from 'next-intl';
import { cn } from '@/lib/shared';
import { Reveal } from '@/components/motion/reveal';

type FounderKey = 'aysin' | 'michelle';

type FounderCardProps = {
  founder: FounderKey;
  align?: 'left' | 'right';
};

const INITIAL: Record<FounderKey, string> = {
  aysin: 'A',
  michelle: 'M',
};

/**
 * FounderCard — bio block for a single founder.
 *
 * Phase 1 uses a typographic placeholder portrait: a bronze-ringed circle
 * with the founder's display-serif initial. When real line illustrations
 * land (Sprint 4 TODO in PROJECT_BRIEF), this swaps to an SVG / Image
 * import without changing the card layout.
 *
 * Alternates portrait-text order via `align` so the About page reads as a
 * conversation rather than a list.
 */
export function FounderCard({ founder, align = 'left' }: FounderCardProps) {
  const t = useTranslations('Founders');
  const initial = INITIAL[founder];

  return (
    <article
      className={cn(
        'grid items-center gap-10 md:grid-cols-[auto_1fr] md:gap-16',
        align === 'right' && 'md:grid-cols-[1fr_auto]',
      )}
    >
      <Reveal className={align === 'right' ? 'md:order-2' : ''}>
        <div
          className="border-bronze-400/40 relative flex h-48 w-48 items-center justify-center rounded-full border bg-olive-700/30 md:h-64 md:w-64"
          aria-hidden
        >
          <span className="font-display text-cream-100 text-8xl leading-none md:text-9xl">
            {initial}
          </span>
          <span className="border-bronze-400/20 absolute inset-2 rounded-full border" />
        </div>
      </Reveal>

      <Reveal
        delay={0.1}
        className={cn('flex flex-col gap-4', align === 'right' && 'md:order-1 md:text-right')}
      >
        <p className="text-bronze-400 text-xs tracking-[0.3em] uppercase">{t(`${founder}.role`)}</p>
        <h3 className="font-display text-cream-100 text-4xl leading-tight tracking-tight sm:text-5xl">
          {t(`${founder}.name`)}
        </h3>
        <p className="text-cream-100/70 max-w-prose text-base leading-relaxed sm:text-lg">
          {t(`${founder}.bio`)}
        </p>
      </Reveal>
    </article>
  );
}
