'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Reveal — scroll-triggered fade-up wrapper.
 *
 * Honours `prefers-reduced-motion: reduce` by skipping the transform entirely
 * (children render in their final state immediately).
 *
 * Use sparingly; one Reveal per section is usually enough. Stagger children by
 * passing increasing `delay` values (e.g. `index * 0.08`).
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
