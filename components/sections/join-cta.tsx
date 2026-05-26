import { ArrowUpRight, Instagram, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Container, SectionHeader } from '@/components/ui';
import { Reveal } from '@/components/motion/reveal';

/**
 * JoinCta — primary on-ramp into the community.
 *
 * Two large channel buttons: WhatsApp invite (group chat) and Instagram
 * handle (follow). Per Phase 1 scope (PROJECT_BRIEF section 2) there is no
 * email newsletter, no contact form, no event registration here — all
 * coordination happens in WhatsApp + Instagram.
 *
 * The URLs come from `messages/{locale}.json` so the owner can change them
 * without touching code. Update Join.whatsappUrl and Join.instagramUrl when
 * the real invite link / handle are confirmed (open TODO in brief section 8).
 */
export function JoinCta() {
  const t = useTranslations('Join');

  return (
    <Container as="section" size="md" className="py-16 md:py-24">
      <Reveal>
        <SectionHeader
          align="center"
          level={1}
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />
      </Reveal>

      <Reveal delay={0.1} className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <a
          href={t('whatsappUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cream-100 hover:bg-cream-50 active:bg-cream-200 focus-visible:outline-bronze-400 group inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-medium text-olive-900 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
          {t('whatsapp')}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </a>
        <a
          href={t('instagramUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="border-cream-100/40 text-cream-100 hover:bg-cream-100/10 active:bg-cream-100/20 focus-visible:outline-bronze-400 group inline-flex h-14 items-center justify-center gap-2 rounded-full border px-8 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Instagram className="h-5 w-5" aria-hidden />
          {t('instagram')}
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </a>
      </Reveal>

      <Reveal delay={0.2} className="mt-16">
        <p className="text-cream-100/60 mx-auto max-w-prose text-center text-sm leading-relaxed">
          {t('footnote')}
        </p>
      </Reveal>
    </Container>
  );
}
