import {
  Calendar,
  Coffee,
  Footprints,
  Heart,
  MapPin,
  Mountain,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/shared';
import { formatEventDate } from '@/lib/shared/format-date';
import type { Activity, Difficulty, Event } from '@/content/schema/event';

const ACTIVITY_ICON: Record<Activity, typeof Footprints> = {
  hiking: Mountain,
  running: Footprints,
  walking: Footprints,
  pilates: Sparkles,
  strength: Zap,
  sup: Waves,
  matcha: Coffee,
  other: Heart,
};

const DIFFICULTY_TONE: Record<Difficulty, string> = {
  easy: 'text-success',
  moderate: 'text-warning',
  challenging: 'text-error',
};

type EventCardProps = {
  event: Event;
  variant?: 'default' | 'compact';
  className?: string;
};

/**
 * EventCard — compact preview used in the /events list and anywhere else an
 * event needs a clickable summary. Renders activity icon + bilingual title
 * + formatted date + meeting point + difficulty.
 *
 * Locale-aware: pulls title and meeting_point from event JSON's per-locale
 * fields. Difficulty + activity labels come from Pillars-style translation
 * namespaces.
 */
export function EventCard({ event, variant = 'default', className }: EventCardProps) {
  const locale = useLocale() as 'de' | 'en';
  const t = useTranslations('Events');
  const Icon = ACTIVITY_ICON[event.activity];

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={`/events/${event.slug}` as any}
      className={cn(
        'group ring-cream-100/5 hover:ring-bronze-400/40 bg-olive-700/40 hover:bg-olive-700/60',
        'flex flex-col gap-4 rounded-2xl p-6 ring-1 transition-colors',
        'focus-visible:outline-bronze-400 focus-visible:outline-2 focus-visible:outline-offset-2',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-bronze-400 flex items-center gap-2 text-xs tracking-widest uppercase">
          <Icon className="h-4 w-4" aria-hidden />
          <span>{t(`activity.${event.activity}`)}</span>
        </div>
        <span
          className={cn(
            'text-xs font-medium tracking-wide uppercase',
            DIFFICULTY_TONE[event.difficulty],
          )}
        >
          {t(`difficulty.${event.difficulty}`)}
        </span>
      </div>

      <h3
        className={cn(
          'font-display text-cream-100 leading-tight tracking-tight',
          variant === 'compact' ? 'text-2xl' : 'text-3xl',
        )}
      >
        {event.title[locale]}
      </h3>

      <dl className="text-cream-100/70 space-y-2 text-sm">
        <div className="flex items-start gap-2">
          <Calendar className="text-cream-100/50 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{formatEventDate(event.date, locale)}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="text-cream-100/50 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            {event.location.name} · {event.location.meeting_point[locale]}
          </span>
        </div>
      </dl>
    </Link>
  );
}
