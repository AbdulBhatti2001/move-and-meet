/**
 * Custom Next.js image loader for Cloudflare Pages.
 *
 * Cloudflare Workers cannot run Sharp at runtime, so we serve pre-optimised
 * images directly from `public/images/`. The build-time pipeline at
 * `scripts/process-images.ts` generates AVIF and WebP variants per source
 * image and stores them under `public/images/optimised/`.
 *
 * Phase 1 (Sprint 0): pass-through loader. Width-aware variant resolution
 * lands in Sprint 4 when the gallery requires it.
 *
 * See ADR-0003 for context.
 */

type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src }: LoaderProps): string {
  return src;
}
