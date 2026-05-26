import { useTranslations } from 'next-intl';

/**
 * LegalContent — combined Impressum + Datenschutzerklärung body.
 *
 * Per PROJECT_BRIEF section 4 (Name-Minimierung), the owner's full name
 * appears here exactly once, in the "Verantwortlich" block. The page itself
 * lives at /rechtliches and is the only public surface where the name is
 * visible. Footer link reads "Rechtliches" / "Legal" without the name.
 *
 * Content sourced from `messages/{locale}.json` Legal namespace. The owner's
 * address and contact email come from the same place — edit the JSON to
 * update, no code change needed.
 *
 * Legal posture: CH revDSG Art. 19 (identifiable controller + contact),
 * EU DSGVO Art. 13 disclosure, Cloudflare named as sub-processor. Owner is
 * the controller in Phase 1; switches to a Verein once founded (Phase 2).
 */
export function LegalContent() {
  const t = useTranslations('Legal');

  return (
    <div className="text-cream-100/80 space-y-12 text-base leading-relaxed">
      <section aria-labelledby="impressum-heading">
        <h2 id="impressum-heading" className="font-display text-cream-100 mb-4 text-3xl">
          {t('impressum.heading')}
        </h2>
        <div className="space-y-2">
          <p className="text-cream-100/50 text-xs tracking-widest uppercase">
            {t('impressum.responsibleLabel')}
          </p>
          <p className="text-cream-100 text-lg">{t('impressum.responsibleName')}</p>
          <p>{t('impressum.responsibleAddress')}</p>
          <p>
            <a
              href={`mailto:${t('impressum.contactEmail')}`}
              className="text-cream-100 hover:text-bronze-400 underline-offset-4 transition-colors hover:underline"
            >
              {t('impressum.contactEmail')}
            </a>
          </p>
        </div>
        <p className="text-cream-100/60 mt-6 max-w-prose text-sm">{t('impressum.disclaimer')}</p>
      </section>

      <section aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" className="font-display text-cream-100 mb-4 text-3xl">
          {t('privacy.heading')}
        </h2>

        <h3 className="text-cream-100 mt-8 mb-3 text-lg font-medium">
          {t('privacy.scope.heading')}
        </h3>
        <p className="max-w-prose">{t('privacy.scope.body')}</p>

        <h3 className="text-cream-100 mt-8 mb-3 text-lg font-medium">
          {t('privacy.controller.heading')}
        </h3>
        <p className="max-w-prose">{t('privacy.controller.body')}</p>

        <h3 className="text-cream-100 mt-8 mb-3 text-lg font-medium">
          {t('privacy.processing.heading')}
        </h3>
        <p className="max-w-prose">{t('privacy.processing.body')}</p>

        <h3 className="text-cream-100 mt-8 mb-3 text-lg font-medium">
          {t('privacy.cookies.heading')}
        </h3>
        <p className="max-w-prose">{t('privacy.cookies.body')}</p>

        <h3 className="text-cream-100 mt-8 mb-3 text-lg font-medium">
          {t('privacy.processors.heading')}
        </h3>
        <p className="max-w-prose">{t('privacy.processors.body')}</p>

        <h3 className="text-cream-100 mt-8 mb-3 text-lg font-medium">
          {t('privacy.rights.heading')}
        </h3>
        <p className="max-w-prose">{t('privacy.rights.body')}</p>

        <h3 className="text-cream-100 mt-8 mb-3 text-lg font-medium">
          {t('privacy.changes.heading')}
        </h3>
        <p className="max-w-prose">{t('privacy.changes.body')}</p>
      </section>
    </div>
  );
}
