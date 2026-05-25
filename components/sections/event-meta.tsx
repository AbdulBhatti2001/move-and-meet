import { Calendar, Clock, Gauge, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { formatDuration, formatEventDate } from '@/lib/shared/format-date';
import type { Event } from '@/content/schema/event';

/**
 * EventMeta — structured info block for the event detail page.
 * Date, duration, meeting point, difficulty as a labelled definition list.
 */
export function EventMeta({ event }: { event: Event }) {
  const locale = useLocale() as 'de' | 'en';
  const t = useTranslations('Events');

  const rows: { Icon: typeof Calendar; label: string; value: string }[] = [
    {
      Icon: Calendar,
      label: t('meta.date'),
      value: formatEventDate(event.date, locale),
    },
    ...(event.duration_minutes
      ? [
          {
            Icon: Clock,
            label: t('meta.duration'),
            value: formatDuration(event.duration_minutes, locale),
          },
        ]
      : []),
    {
      Icon: MapPin,
      label: t('meta.meetingPoint'),
      value: `${event.location.name}, ${event.location.meeting_point[locale]}`,
    },
    {
      Icon: Gauge,
      label: t('meta.difficulty'),
      value: t(`difficulty.${event.difficulty}`),
    },
  ];

  return (
    <dl className="ring-cream-100/5 grid gap-6 rounded-2xl bg-olive-700/30 p-6 ring-1 sm:grid-cols-2">
      {rows.map(({ Icon, label, value }) => (
        <div key={label} className="flex items-start gap-3">
          <Icon className="text-bronze-400 mt-1 h-5 w-5 shrink-0" aria-hidden />
          <div className="flex flex-col">
            <dt className="text-cream-100/50 text-xs tracking-widest uppercase">{label}</dt>
            <dd className="text-cream-100 mt-1 text-base">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
