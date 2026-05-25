import { setRequestLocale, getTranslations } from 'next-intl/server';

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');

  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-24">
      <div className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <p className="text-bronze-400 text-xs tracking-[0.3em] uppercase">{t('subtitle')}</p>
        <h1 className="text-cream-100 font-display text-6xl leading-tight tracking-tight sm:text-7xl md:text-8xl">
          {t('title')}
        </h1>
        <p className="text-cream-100/70 max-w-prose text-base leading-relaxed sm:text-lg">
          {t('intro')}
        </p>
      </div>
    </main>
  );
}
