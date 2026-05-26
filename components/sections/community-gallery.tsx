import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/shared';

/**
 * CommunityGallery — placeholder gallery of typographic quote tiles.
 *
 * Phase 1 uses gradient tiles with brand quotes overlaid; the layout is
 * production-ready and will swap to real Move & Meet community photos
 * once the owner provides them (see PROJECT_BRIEF section 8 TODOs).
 *
 * Quote tiles are not vertically uniform; varying min-heights create the
 * mosaic feel typical of editorial galleries.
 */

const TILES = [
  { id: 'q1', tone: 'olive-deep', size: 'md' },
  { id: 'q2', tone: 'bronze', size: 'sm' },
  { id: 'q3', tone: 'olive-mid', size: 'lg' },
  { id: 'q4', tone: 'olive-deep', size: 'sm' },
  { id: 'q5', tone: 'bronze', size: 'md' },
  { id: 'q6', tone: 'olive-mid', size: 'sm' },
] as const;

const TONE_CLASS: Record<(typeof TILES)[number]['tone'], string> = {
  'olive-deep': 'bg-gradient-to-br from-olive-900 to-olive-700',
  'olive-mid': 'bg-gradient-to-br from-olive-700 to-olive-800',
  bronze: 'bg-gradient-to-br from-bronze-400/30 to-olive-700',
};

const SIZE_CLASS: Record<(typeof TILES)[number]['size'], string> = {
  sm: 'min-h-48',
  md: 'min-h-64',
  lg: 'min-h-80',
};

export function CommunityGallery() {
  const t = useTranslations('Community');

  return (
    <ul
      role="list"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6"
      aria-label={t('gallery.label')}
    >
      {TILES.map(({ id, tone, size }, index) => (
        <Reveal
          key={id}
          as="li"
          delay={(index % 3) * 0.06}
          className={cn(
            'group relative flex items-end overflow-hidden rounded-2xl p-6',
            TONE_CLASS[tone],
            SIZE_CLASS[size],
          )}
        >
          <p className="font-display text-cream-100 text-xl leading-snug text-balance sm:text-2xl">
            {t(`gallery.tiles.${id}`)}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}
