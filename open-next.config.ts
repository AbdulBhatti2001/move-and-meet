import { defineCloudflareConfig } from '@opennextjs/cloudflare/config';

/**
 * OpenNext configuration for Cloudflare Workers.
 *
 * Defaults are appropriate for Phase 1 (no incremental cache, no queue,
 * no tag cache). When forms or DB reactivate in Phase 2, this is where
 * we wire in a Cloudflare KV / D1 / Queues backed cache.
 */
export default defineCloudflareConfig({});
