import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  reactStrictMode: true,
  poweredByHeader: false,

  // Typed Link routes (moved out of experimental in Next 15.5).
  typedRoutes: true,

  // Cloudflare Workers cannot run Sharp at runtime, so we use a custom loader
  // that points to build-time-optimised AVIF/WebP variants. See ADR-0003.
  images: {
    loader: 'custom',
    loaderFile: './lib/shared/image-loader.ts',
    formats: ['image/avif', 'image/webp'],
  },
};

export default withNextIntl(withMDX(nextConfig));
