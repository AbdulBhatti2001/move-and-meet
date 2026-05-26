'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/shared';

type FaqItem = { id: string; question: string; answer: string };

/**
 * FaqAccordion — keyboard-accessible, single-open accordion.
 *
 * Uses the CSS grid-template-rows 0fr → 1fr trick for smooth height
 * animation without measuring panels in JS. Honours prefers-reduced-motion
 * by snapping the transition to 0ms via the global rule in globals.css.
 *
 * a11y: each trigger is a `<button>` with `aria-expanded` and
 * `aria-controls`; each panel uses `role="region"` and is hidden via
 * `aria-hidden` so AT skip closed answers entirely.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul role="list" className="divide-cream-100/10 border-cream-100/10 divide-y border-y">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-trigger-${item.id}`}
                className="text-cream-100 hover:text-bronze-400 focus-visible:outline-bronze-400 flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xl"
              >
                <span className="font-display">{item.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-300 ease-[var(--ease-brand)]',
                    isOpen && 'rotate-180',
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              role="region"
              id={`faq-panel-${item.id}`}
              aria-labelledby={`faq-trigger-${item.id}`}
              aria-hidden={!isOpen}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-[var(--ease-brand)]',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <p className="text-cream-100/70 max-w-prose pb-6 text-base leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
