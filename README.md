# Move & Meet

Swiss community website for the Move & Meet by Active Deen Sisters collective.

**Movement · Connection · Sisterhood**

## Stack

Next.js 15 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Framer Motion + Lenis · next-intl · MDX · Zod · pnpm 9 · Node 20 LTS · Cloudflare Pages

See [`docs/adr/`](./docs/adr/) for architecture decisions and [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) for the living project state.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The site redirects to `/de` or `/en` based on the browser locale.

## Cloudflare Pages Build

```bash
pnpm build:cf       # Build with @opennextjs/cloudflare (generates .open-next/)
pnpm preview:cf     # Local preview against the Cloudflare Workers runtime
pnpm deploy:cf      # Deploy to Cloudflare Workers (calls wrangler deploy)
```

## Scripts

| Command                 | Purpose                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm dev`              | Local dev server                                                                             |
| `pnpm build`            | Standard Next.js build (for diagnostics)                                                     |
| `pnpm build:cf`         | Cloudflare Workers build (OpenNext)                                                          |
| `pnpm preview:cf`       | Local preview of the Cloudflare build                                                        |
| `pnpm deploy:cf`        | Deploy to Cloudflare Workers                                                                 |
| `pnpm lint`             | ESLint                                                                                       |
| `pnpm typecheck`        | `tsc --noEmit`                                                                               |
| `pnpm test`             | Vitest unit tests                                                                            |
| `pnpm test:e2e`         | Playwright end-to-end                                                                        |
| `pnpm validate:content` | Validate event JSON against Zod schema                                                       |
| `pnpm process:images`   | Build-time image optimisation (Sharp)                                                        |
| `pnpm check`            | Lightweight health check (file presence, scope guard, i18n parity, typecheck, lint, content) |
| `pnpm format`           | Prettier write                                                                               |

## Project Documentation

- [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) — living briefing, sprint status, open questions
- [`docs/adr/`](./docs/adr/) — architecture decision records
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — branch strategy, commits, PR flow
- [`LICENSE.md`](./LICENSE.md) — proprietary, all rights reserved

## Status

Phase 1 in development. Display-only site, no forms, no registrations, no newsletter. See `PROJECT_BRIEF.md` section 2 for scope details.
