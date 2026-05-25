'use client';

import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/shared';
import { LanguageSwitcher } from './language-switcher';

const NAV_ITEMS = ['events', 'about', 'community', 'faq', 'join', 'legal'] as const;
const NAV_HREFS: Record<(typeof NAV_ITEMS)[number], string> = {
  events: '/events',
  about: '/about',
  community: '/community',
  faq: '/faq',
  join: '/join',
  legal: '/rechtliches',
};

/**
 * MobileNav — burger button + slide-in drawer for narrow viewports.
 *
 * Locks body scroll while open, closes on Esc, traps clicks on the backdrop.
 * Drawer transitions are pure CSS (no Framer Motion needed for a one-off slide).
 */
export function MobileNav() {
  const t = useTranslations('Navigation');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('menu')}
        aria-expanded={open}
        aria-controls="mobile-nav-drawer"
        className="text-cream-100 hover:text-bronze-400 focus-visible:outline-bronze-400 inline-flex h-10 w-10 items-center justify-center rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      <div
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        className={cn(
          'bg-ink-950/70 fixed inset-0 z-40 transition-opacity duration-300 ease-[var(--ease-brand)] md:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal={open}
        aria-label={t('menu')}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-olive-900 px-6 py-6 shadow-2xl',
          'transition-transform duration-300 ease-[var(--ease-brand)] md:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-cream-100 text-xl">Move &amp; Meet</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t('close')}
            className="text-cream-100 hover:text-bronze-400 focus-visible:outline-bronze-400 inline-flex h-10 w-10 items-center justify-center rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <nav className="mt-12 flex flex-col gap-6" aria-label={t('menu')}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={NAV_HREFS[item] as any}
              onClick={() => setOpen(false)}
              className="font-display text-cream-100 hover:text-bronze-400 text-3xl transition-colors"
            >
              {t(item)}
            </Link>
          ))}
        </nav>

        <div className="border-cream-100/10 mt-auto flex items-center justify-between border-t pt-6">
          <LanguageSwitcher />
        </div>
      </aside>
    </>
  );
}
