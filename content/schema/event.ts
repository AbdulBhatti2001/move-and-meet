import { z } from 'zod';

/**
 * Event content schema. Each event JSON file in `content/events/` must
 * validate against this. The validator runs at build time via
 * `scripts/validate-content.ts`.
 *
 * Naming convention for files: `yyyy-mm-dd-slug.json`.
 */

export const ActivitySchema = z.enum([
  'hiking',
  'running',
  'walking',
  'pilates',
  'strength',
  'sup',
  'matcha',
  'other',
]);

export const DifficultySchema = z.enum(['easy', 'moderate', 'challenging']);

export const BilingualStringSchema = z.object({
  de: z.string().min(1),
  en: z.string().min(1),
});

export const EventSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase kebab-case'),
  title: BilingualStringSchema,
  description: BilingualStringSchema,
  date: z.string().datetime({ offset: true }),
  duration_minutes: z.number().int().positive().optional(),
  location: z.object({
    name: z.string().min(1),
    address: z.string().optional(),
    meeting_point: BilingualStringSchema,
    map_url: z.string().url().optional(),
  }),
  difficulty: DifficultySchema,
  activity: ActivitySchema,
  capacity: z.number().int().positive().optional(),
  cover_image: z.string().optional(),
  whatsapp_link: z.string().url().optional(),
  instagram_link: z.string().url().optional(),
  cancelled: z.boolean().default(false),
});

export type Event = z.infer<typeof EventSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type Difficulty = z.infer<typeof DifficultySchema>;
