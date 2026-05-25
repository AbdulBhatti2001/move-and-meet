import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Container, SectionHeader } from '@/components/ui';

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');

  return (
    <Container as="main" size="lg">
      <div className="flex min-h-dvh flex-col items-center justify-center py-24">
        <SectionHeader
          align="center"
          level={1}
          eyebrow={t('subtitle')}
          title={t('title')}
          subtitle={t('intro')}
        />
      </div>
    </Container>
  );
}
