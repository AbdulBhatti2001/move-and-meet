import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/shared';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  ref?: Ref<HTMLButtonElement>;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-cream-100 text-olive-900 hover:bg-cream-50 active:bg-cream-200 focus-visible:bg-cream-50',
  secondary:
    'border border-cream-100/40 text-cream-100 hover:bg-cream-100/10 active:bg-cream-100/20 focus-visible:bg-cream-100/10',
  ghost:
    'text-cream-100 hover:text-bronze-400 active:text-bronze-400 focus-visible:text-bronze-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-base',
};

/**
 * Button — single brand-styled button primitive.
 * Variants map to brand surfaces; sizes to baseline scale.
 * Server-component-safe (no client handlers inside).
 * Consumers pass onClick from their own client components.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ref,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide whitespace-nowrap',
        'transition-colors duration-200 ease-[var(--ease-brand)]',
        'focus-visible:outline-bronze-400 focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
