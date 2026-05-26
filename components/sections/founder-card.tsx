import { useTranslations } from 'next-intl';
import { cn } from '@/lib/shared';
import { Reveal } from '@/components/motion/reveal';

type FounderKey = 'aysin' | 'michelle';
type FounderCardProps = {
  founder: FounderKey;
  align?: 'left' | 'right';
};

/**
 * FounderCard — typographic portrait placeholder for the /about page.
 *
 * Phase 1 does not ship real photos yet, so each founder is represented by a
 * bronze-ringed cream circle holding a display-serif initial. Once real
 * portraits land (Phase 2), swap the inner <div> for an <Image>.
 *
 * `align` flips the layout left/right so two cards form a gentle zig-zag
 * down the page. Bio + role come from messages/{locale}.json under the
 * About.founders.{founder} namespace.
 */
export function FounderCard({ founder, align = 'left' }: FounderCardProps) {
  const t = useTranslations(`About.founders.${founder}`);

  return (
    <Reveal
      className={cn(
        'flex flex-col items-center gap-8 sm:gap-12',
        align === 'left' ? 'sm:flex-row' : 'sm:flex-row-reverse',
      )}
    >
      <div
        aria-hidden
        className="ring-bronze-400/60 bg-cream-100/5 flex h-40 w-40 shrink-0 items-center justify-center rounded-full ring-2 ring-offset-4 ring-offset-olive-800 sm:h-48 sm:w-48"
      >
        <span className="font-display text-cream-100 text-6xl sm:text-7xl">{t('initial')}</span>
      </div>

      <div
        className={cn(
          'flex flex-col gap-3',
          align === 'left' ? 'sm:text-left' : 'sm:text-right',
          'text-center',
        )}
      >
        <p className="text-bronze-400 text-xs tracking-[0.3em] uppercase">{t('role')}</p>
        <h3 className="font-display text-cream-100 text-4xl tracking-tight sm:text-5xl">
          {t('name')}
        </h3>
        <p className="text-cream-100/70 max-w-prose text-base leading-relaxed sm:text-lg">
          {t('bio')}
        </p>
      </div>
    </Reveal>
  );
}
