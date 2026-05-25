import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Style Guide',
  description: 'Internal design-system reference.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function StyleGuideLayout({ children }: { children: ReactNode }) {
  return children;
}
