import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

/**
 * Type guard for incoming locale strings (e.g. from `params`).
 * Inlined here so the project does not depend on next-intl >= 4's `hasLocale`.
 */
export function isValidLocale(value: string | undefined): value is Locale {
  return value !== undefined && (routing.locales as readonly string[]).includes(value);
}

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
