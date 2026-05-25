import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from '@/components/ui';

/**
 * SiteFooter — bottom site frame.
 *
 * Holds tagline, copyright, and the single Rechtliches link. Per the name-
 * minimisation policy (PROJECT_BRIEF section 4) the owner's name never appears
 * here, only in the legal page content itself.
 */
export function SiteFooter() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-cream-100/5 mt-24 border-t bg-olive-900 py-12">
      <Container size="xl">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-display text-cream-100 text-xl">Move &amp; Meet</p>
            <p className="text-cream-100/50 mt-1 text-sm">{t('tagline')}</p>
          </div>

          <nav aria-label="Footer" className="flex items-center gap-6 text-sm">
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={'/rechtliches' as any}
              className="text-cream-100/60 hover:text-cream-100 transition-colors"
            >
              {t('legal')}
            </Link>
          </nav>

          <p className="text-cream-100/40 text-xs">
            &copy; {year} Move &amp; Meet. {t('rights')}.
          </p>
        </div>
      </Container>
    </footer>
  );
}
