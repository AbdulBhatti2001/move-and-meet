import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { EventSchema, type Event } from '@/content/schema/event';

/**
 * Server-only event data layer.
 *
 * Reads and validates every JSON file under `content/events/`, caches the
 * parsed list per process, and exposes sorted / filtered views. All consumers
 * are server components or build-time helpers (generateStaticParams). The
 * fs imports never reach the Cloudflare Worker bundle because the pages
 * that use them are `dynamic = 'force-static'` and prerendered at build.
 */

const EVENTS_DIR = join(process.cwd(), 'content', 'events');

let cache: readonly Event[] | null = null;

async function loadAll(): Promise<readonly Event[]> {
  if (cache) return cache;

  let files: string[];
  try {
    files = await readdir(EVENTS_DIR);
  } catch {
    cache = [];
    return cache;
  }

  const jsonFiles = files.filter((f) => f.endsWith('.json'));
  const events = await Promise.all(
    jsonFiles.map(async (file) => {
      const raw = await readFile(join(EVENTS_DIR, file), 'utf-8');
      return EventSchema.parse(JSON.parse(raw));
    }),
  );

  // Ascending by date; upcoming-first filters do their own slicing.
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  cache = Object.freeze(events);
  return cache;
}

export async function getAllEvents(): Promise<readonly Event[]> {
  return loadAll();
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const all = await loadAll();
  return all.find((e) => e.slug === slug) ?? null;
}

export async function getUpcomingEvents(): Promise<readonly Event[]> {
  const all = await loadAll();
  const now = Date.now();
  return all.filter((e) => !e.cancelled && new Date(e.date).getTime() >= now);
}

export async function getPastEvents(): Promise<readonly Event[]> {
  const all = await loadAll();
  const now = Date.now();
  // Past events shown most-recent first.
  return [...all].filter((e) => new Date(e.date).getTime() < now).reverse();
}

export async function getNextEvent(): Promise<Event | null> {
  const upcoming = await getUpcomingEvents();
  return upcoming[0] ?? null;
}
