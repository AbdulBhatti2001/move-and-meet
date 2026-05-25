/**
 * Isomorphic helpers used by both server and client modules.
 * Anything here must run unchanged in both runtimes.
 */

export const SITE_NAME = 'Move & Meet' as const;
export const SITE_TAGLINE = 'Movement · Connection · Sisterhood' as const;
export const DEFAULT_LOCALE = 'de' as const;
export const SUPPORTED_LOCALES = ['de', 'en'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/** Compose Tailwind class names with conditional inputs. Wraps clsx + tailwind-merge. */
export { cn } from './cn';
