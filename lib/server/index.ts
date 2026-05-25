import 'server-only';

/**
 * Server-only module barrel.
 *
 * Anything exported from here MUST be safe to run in the Node/Workers
 * server runtime. Importing this module (or any file in `lib/server/`)
 * from a client component will fail the build, which is the intended guard.
 */

export const SERVER_BOUNDARY_MARKER = 'move-and-meet:server-only' as const;
