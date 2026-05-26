import { useTranslations } from 'next-intl';
import { cn } from '@/lib/shared';
import { Reveal } from '@/components/motion/reveal';

/**
 * CommunityGallery — typographic placeholder mosaic for the /community page.
 *
 * Six tiles in a responsive grid, each with a brand quote on a soft cream/
 * olive gradient. Heights vary (sm/md/lg) so the layout feels like a real
 * photo mosaic. When real Move & Meet community photos arrive (Phase 2),
 * swap the inner <div> for an <Image> and drop the quote.
 *
 * Quotes come from messages/{locale}.json under Community.gallery.tile{1..6}.
 */

const TILES = [
  { key: 'tile1', span: 'sm:col-span-2', height: 'h-64 sm:h-80' },
  { key: 'tile2', span: '', height: 'h-64 sm:h-80' },
  { key: 'tile3', span: '', height: 'h-64 sm:h-96' },
  { key: 'tile4', span: 'sm:col-span-2', height: 'h-64 sm:h-72' },
  { key: 'tile5', span: '', height: 'h-64 sm:h-72' },
  { key: 'tile6', span: 'sm:col-span-3', height: 'h-64 sm:h-80' },
] as const;

const GRADIENTS = [
  'from-olive-700 to-olive-900',
  'from-olive-600 to-olive-800',
  'from-olive-800 to-olive-900',
  'from-olive-700 to-olive-800',
  'from-olive-600 to-olive-700',
  'from-olive-700 to-olive-900',
];

export function CommunityGallery() {
  const t = useTranslations('Community.gallery');

  return (
    <ul
      role="list"
      className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
      aria-label={t('label')}
    >
      {TILES.map((tile, index) => (
        <Reveal
          key={tile.key}
          as="li"
          delay={index * 0.05}
          className={cn(tile.span, 'overflow-hidden rounded-2xl')}
        >
          <div
            className={cn(
              'relative flex items-end bg-gradient-to-br p-6 sm:p-8',
              GRADIENTS[index % GRADIENTS.length],
              tile.height,
            )}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-bronze-400)_0%,_transparent_50%)] opacity-10"
            />
            <blockquote className="font-display text-cream-100 relative text-xl leading-snug sm:text-2xl">
              {t(tile.key)}
            </blockquote>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
