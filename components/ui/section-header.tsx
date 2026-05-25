import type { ReactNode } from 'react';
import { cn } from '@/lib/shared';

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  level?: 1 | 2 | 3;
  className?: string;
};

const titleSizes: Record<NonNullable<SectionHeaderProps['level']>, string> = {
  1: 'text-5xl sm:text-6xl md:text-7xl',
  2: 'text-4xl sm:text-5xl md:text-6xl',
  3: 'text-3xl sm:text-4xl md:text-5xl',
};

/**
 * SectionHeader — composed page/section heading.
 * Pattern: optional eyebrow (small uppercase bronze tag), main title (Fraunces),
 * optional subtitle (body). Level controls heading semantic tag and size scale.
 */
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  level = 2,
  className,
}: SectionHeaderProps) {
  const Heading = `h${level}` as 'h1' | 'h2' | 'h3';
  return (
    <header
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-bronze-400 text-xs tracking-[0.3em] uppercase">{eyebrow}</p>
      ) : null}
      <Heading
        className={cn(
          'font-display text-cream-100 leading-tight tracking-tight',
          titleSizes[level],
        )}
      >
        {title}
      </Heading>
      {subtitle ? (
        <p className="text-cream-100/70 max-w-prose text-base leading-relaxed sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
