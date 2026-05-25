'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/shared';

/**
 * LanguageSwitcher — toggle between DE and EN while preserving the current route.
 *
 * Uses next-intl's localised router so the URL pathname stays the same but the
 * locale prefix swaps. Wrapped in useTransition to avoid blocking the UI on
 * the navigation.
 */
export function LanguageSwitcher() {
  const locale = useLocale() as 'de' | 'en';
  const t = useTranslations('LanguageSwitcher');
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: 'de' | 'en') => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label={t('label')}
      className={cn(
        'flex items-center gap-1 text-xs font-medium tracking-widest uppercase',
        pending && 'opacity-60',
      )}
    >
      {(['de', 'en'] as const).map((target, i) => (
        <span key={target} className="flex items-center">
          {i > 0 ? (
            <span className="text-cream-100/30 px-1" aria-hidden>
              /
            </span>
          ) : null}
          <button
            type="button"
            onClick={() => switchTo(target)}
            aria-pressed={locale === target}
            className={cn(
              'transition-colors duration-200',
              'focus-visible:outline-bronze-400 focus-visible:outline-2 focus-visible:outline-offset-2',
              locale === target ? 'text-cream-100' : 'text-cream-100/50 hover:text-cream-100',
            )}
          >
            {t(target)}
          </button>
        </span>
      ))}
    </div>
  );
}
