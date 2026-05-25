/**
 * Locale-aware event date formatting.
 *
 * Pinned to Europe/Zurich timezone so dates render consistently regardless of
 * the visitor's locale and the server's UTC default. Uses Intl.DateTimeFormat
 * (Web standard, available in the Cloudflare Workers runtime).
 */

type SupportedLocale = 'de' | 'en';

const INTL_LOCALE: Record<SupportedLocale, string> = {
  de: 'de-CH',
  en: 'en-CH',
};

const TZ = 'Europe/Zurich';

/** Long form: "Samstag, 14. Juni 2026, 08:00" or "Saturday, 14 June 2026, 08:00". */
export function formatEventDate(iso: string, locale: SupportedLocale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  }).format(new Date(iso));
}

/** Compact: "14. Jun" / "14 Jun" — for cards in tight grids. */
export function formatEventDateShort(iso: string, locale: SupportedLocale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: 'numeric',
    month: 'short',
    timeZone: TZ,
  }).format(new Date(iso));
}

/** Just time: "08:00". */
export function formatEventTime(iso: string, locale: SupportedLocale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  }).format(new Date(iso));
}

/** Duration in human-readable form, e.g. "4 h" / "90 min". */
export function formatDuration(minutes: number, locale: SupportedLocale): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (remainder === 0) return `${hours} h`;
    return locale === 'de' ? `${hours} h ${remainder} min` : `${hours} h ${remainder} min`;
  }
  return `${minutes} min`;
}
