import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui';
import { LanguageSwitcher } from './language-switcher';
import { MobileNav } from './mobile-nav';

const PRIMARY_NAV = ['events', 'about', 'community', 'faq'] as const;
const NAV_HREFS: Record<(typeof PRIMARY_NAV)[number], string> = {
  events: '/events',
  about: '/about',
  community: '/community',
  faq: '/faq',
};

/**
 * SiteHeader — sticky top navigation.
 *
 * Desktop layout: brand left, primary nav centre, language switcher + Join CTA right.
 * Mobile: brand left, language switcher + burger right. Burger opens MobileNav drawer.
 *
 * The header is sticky with a translucent olive background + backdrop blur so
 * scrolling content fades out beneath it.
 */
export function SiteHeader() {
  const t = useTranslations('Navigation');

  return (
    <header className="border-cream-100/5 sticky top-0 z-30 border-b bg-olive-800/80 backdrop-blur-md">
      <Container size="xl">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="font-display text-cream-100 hover:text-bronze-400 text-xl tracking-tight transition-colors"
          >
            Move &amp; Meet
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label={t('menu')}>
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={NAV_HREFS[item] as any}
                className="text-cream-100/80 hover:text-cream-100 text-sm transition-colors"
              >
                {t(item)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            <Link
              href="/join"
              className="bg-cream-100 hover:bg-cream-50 active:bg-cream-200 focus-visible:outline-bronze-400 hidden h-9 items-center justify-center rounded-full px-5 text-sm font-medium text-olive-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:inline-flex"
            >
              {t('join')}
            </Link>
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}
