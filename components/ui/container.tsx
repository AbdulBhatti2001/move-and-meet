import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/shared';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

type ContainerOwnProps<T extends ElementType> = {
  as?: T;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
};

type ContainerProps<T extends ElementType> = ContainerOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerOwnProps<T>>;

const sizeMap: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-none',
};

/**
 * Container — horizontal layout primitive.
 * Centres content with consistent horizontal padding and a max-width.
 * Polymorphic via `as` so sections can render as `<section>`, `<main>`, `<article>` etc.
 */
export function Container<T extends ElementType = 'div'>({
  as,
  size = 'xl',
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag className={cn('mx-auto w-full px-6 sm:px-8 lg:px-12', sizeMap[size], className)} {...rest}>
      {children}
    </Tag>
  );
}
