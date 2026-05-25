# ADR-0002: Repository Structure

- **Status**: Proposed
- **Date**: 2026-05-25
- **Deciders**: Project owner (Abdulmannan Bhatti), architect agent
- **Tags**: repo, structure, conventions, dx

## Context

Move&Meet Phase 1 is one deployable surface: the public website. There is no second app (no admin panel, no separate marketing site, no mobile client), and there are no shared libraries that need independent versioning. The team is small (founders plus the orchestrated agent workflow), so the repository structure must optimise for discoverability and short feedback loops, not for cross-package coordination.

Three structural questions need a binding answer before Sprint 1 touches code: monorepo or single app, where editorial content lives versus runtime code, and how the server/client boundary is signalled in folder names so reviewers and agents do not have to read the file header to know what runs where.

## Decision

We ship Move&Meet as a **single Next.js application in a single repository**. No pnpm workspaces, no Turborepo, no Nx. The repository is owned by the website; auxiliary scripts and content live alongside it, not as separate packages.

The top-level layout is fixed as follows.

```
move-and-meet/
  app/                      Next.js App Router routes, grouped by locale
    [locale]/
      (marketing)/
      events/
      api/
  components/               Bespoke Move&Meet React components
    ui/                     shadcn/ui primitives, copied in
    sections/               Page-level composed sections
  lib/                      Pure TS modules, no JSX
    server/                 Server-only helpers, imported with `import "server-only"`
    client/                 Browser-only helpers
    shared/                 Isomorphic helpers
  content/                  Editorial source of truth
    mdx/                    About, FAQ, legal pages (DE and EN siblings)
    events/                 Typed JSON event records, one file per event
    schema/                 Zod schemas for content validation
  messages/                 next-intl translation catalogues (de.json, en.json)
  public/                   Static assets served as-is
    images/
    fonts/
  styles/                   tokens.css, globals.css
  docs/
    adr/                    Architecture Decision Records
    runbooks/
  scripts/                  Node scripts for content validation, image prep
  tests/
    unit/
    e2e/
  .github/
    workflows/              CI pipelines
  .claude/                  Agent configuration and skill definitions
  next.config.ts
  tsconfig.json
  package.json
  pnpm-lock.yaml
  .nvmrc
  README.md
```

Naming conventions are enforced by lint rules and PR review. Files are **kebab-case** (`event-card.tsx`, `use-locale.ts`). React components are **PascalCase exports** (`export function EventCard()`). Hooks start with `use`. Server-only modules end in `.server.ts` in addition to living under `lib/server/`. Client components carry the `"use client"` directive on the first line; server components carry no directive. Anything in `lib/server/` imports `server-only` at the top and will fail the build if imported into a client module.

MDX content is split per locale as sibling files (`about.de.mdx`, `about.en.mdx`) inside `content/mdx/`. Event JSON files follow `content/events/<yyyy-mm-dd>-<slug>.json` and validate against `content/schema/event.ts` at build time via a `scripts/validate-content.ts` step wired into `pnpm build`.

The split between `/lib` and `/components` is strict: `/components` exports React only; `/lib` exports no JSX. Domain logic (date formatting, locale resolution, Resend client wrapper, Zod schemas for forms) lives in `/lib`, never inline in a component.

## Consequences

### Positive

- One `package.json`, one lockfile, one CI matrix. New contributors and agents orient in minutes.
- The folder names encode the runtime boundary, which reduces accidental client bundling of server code.
- Editorial content sits in one tree (`/content` plus `/messages`), which makes a future CMS migration a mechanical job.
- ADRs, runbooks, and agent config sit in-repo, so the project's institutional memory ships with the code.

### Negative / Trade-offs

- If Phase 2 adds a second deployable (admin UI, marketing microsite), we will need to migrate to workspaces. We accept this future cost in exchange for current simplicity.
- A single repo means a single CI lane; large test suites will eventually slow PRs. Not a problem at Phase 1 scale.

### Neutral

- Copied shadcn/ui code lives in `components/ui/` and is treated as owned source; we do not pull updates automatically.

## Alternatives Considered

### Alternative A: pnpm workspaces with `apps/web` and `packages/ui`

- **Pros**: Clean separation if a second app appears; reusable UI package.
- **Cons**: Adds a layer of indirection (workspace protocols, build orchestration) for no current consumer of the shared package.
- **Why rejected**: Premature abstraction. We can extract `packages/ui` later in a single PR when a second consumer exists.

### Alternative B: Turborepo monorepo

- **Pros**: Remote caching, parallel task graph, well-trodden Vercel integration.
- **Cons**: Same as Alternative A plus a new tool to learn and configure. Caching benefit is negligible for one app.
- **Why rejected**: Tool weight exceeds benefit at our scale.

### Alternative C: Flat `src/` directory with everything under it

- **Pros**: Conventional in many React projects; one less top-level entry.
- **Cons**: Hides the runtime boundary; `/app` is already a Next.js convention that conflicts with `src/app` nesting for some tooling.
- **Why rejected**: We prefer the explicit top-level layout above.

## Implementation Notes

Scaffold with `pnpm create next-app@latest move-and-meet --ts --app --tailwind --eslint --no-src-dir`. Immediately delete the generated `src/` if present, then create the directories above as empty folders with `.gitkeep`. Add `import "server-only"` to a stub in `lib/server/index.ts` to verify the boundary check works. Add a CI step that runs `tsc --noEmit`, `eslint .`, `pnpm test`, and `pnpm tsx scripts/validate-content.ts`. Commit a `CODEOWNERS` file pointing the founders at `/content/**` and the architect agent at `/docs/adr/**`.

## Open Questions

None.
