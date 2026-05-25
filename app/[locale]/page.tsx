import { setRequestLocale } from 'next-intl/server';
import { FeaturedEvent, Hero, PillarsBand } from '@/components/sections';

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FeaturedEvent />
      <PillarsBand />
    </>
  );
}
