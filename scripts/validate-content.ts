import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { EventSchema } from '../content/schema/event';

/**
 * Validate all event JSON files in `content/events/` against the Zod schema.
 * Exits non-zero on first failure so CI catches malformed content.
 */
async function validateEvents(): Promise<void> {
  const eventsDir = join(process.cwd(), 'content', 'events');
  let files: string[];
  try {
    files = await readdir(eventsDir);
  } catch {
    console.log('No events directory yet, nothing to validate.');
    return;
  }

  const jsonFiles = files.filter((f) => f.endsWith('.json'));
  if (jsonFiles.length === 0) {
    console.log('No event JSON files to validate.');
    return;
  }

  let errors = 0;
  for (const file of jsonFiles) {
    const path = join(eventsDir, file);
    const raw = await readFile(path, 'utf-8');
    try {
      const data = JSON.parse(raw);
      EventSchema.parse(data);
      console.log(`OK   ${file}`);
    } catch (err) {
      console.error(`FAIL ${file}:`, err instanceof Error ? err.message : err);
      errors += 1;
    }
  }

  if (errors > 0) {
    console.error(`\nContent validation failed (${errors} error(s)).`);
    process.exit(1);
  }
  console.log(`\nValidated ${jsonFiles.length} event file(s).`);
}

validateEvents().catch((err) => {
  console.error(err);
  process.exit(1);
});
