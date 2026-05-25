import { readdir, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Build-time image processing pipeline.
 *
 * Generates AVIF and WebP variants from source images so the runtime
 * (Cloudflare Workers, which cannot load Sharp) only ever serves
 * pre-optimised files. See ADR-0001 and ADR-0003.
 *
 * Source:  public/images/source/
 * Output:  public/images/optimised/
 *
 * Sprint 0 ships this as a no-op stub. Sprint 4 wires Sharp into it
 * when the community gallery and event covers land.
 */
async function processImages(): Promise<void> {
  const sourceDir = join(process.cwd(), 'public', 'images', 'source');
  const outputDir = join(process.cwd(), 'public', 'images', 'optimised');

  try {
    await stat(sourceDir);
  } catch {
    console.log('No source images directory, nothing to process.');
    return;
  }

  await mkdir(outputDir, { recursive: true });

  const files = await readdir(sourceDir);
  if (files.length === 0) {
    console.log('No source images to process.');
    return;
  }

  console.log(
    `Image pipeline stub: ${files.length} source file(s) found. Real Sharp processing lands in Sprint 4.`,
  );
}

processImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
