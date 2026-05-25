# Contributing to Move & Meet

This is a private project. External contributions are not solicited. Internal contributors and orchestrated agents follow the rules below.

## Branch Strategy

Trunk-based. Branch from `main`, target `main` via pull request, squash-merge on green CI.

- `feat/*` — new user-visible features
- `fix/*` — bug fixes
- `chore/*` — tooling, dependency bumps, refactors without behaviour change
- `docs/*` — documentation only
- `test/*` — test additions or improvements
- `ci/*` — CI/CD pipeline changes

Never push directly to `main`. Branch protection enforces this from Sprint 7 onward.

## Commit Convention

Conventional Commits. Enforced by `commitlint` on every commit via the `commit-msg` husky hook.

```
type(scope?): subject

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `style`, `perf`, `ci`, `build`, `revert`.

Subject lines stay under 100 characters and avoid sentence-case / title-case / upper-case.

## Pull Requests

- One concern per PR. Mixed concerns get bounced.
- Description references the relevant ADR or `PROJECT_BRIEF.md` section.
- All CI status checks must be green before merge.
- Use squash-merge with a Conventional Commit message in the squash title; the squash body is auto-aggregated from individual commits.

## Quality Gates (per `PROJECT_BRIEF.md` section 10)

Every PR that touches user-visible code must pass:

- ESLint (`pnpm lint`)
- Type-check (`pnpm typecheck`)
- Unit tests (`pnpm test`)
- Playwright E2E (`pnpm test:e2e`) where relevant
- Lighthouse mobile ≥ 95 in all four categories on touched pages
- axe-core accessibility: 0 violations
- `pnpm build:cf` runs to completion (Cloudflare-adapter smoke test)

## Local Development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. The site redirects to `/de` (default locale) or `/en`.

## Pre-Commit Hooks

Installed automatically via `pnpm install` (husky `prepare` script).

- `pre-commit` runs `lint-staged` (ESLint + Prettier on staged files)
- `commit-msg` runs `commitlint` against the message

To bypass in an emergency: `git commit --no-verify`. Use sparingly and explain in the PR.

## Code Style

- TypeScript `strict: true` plus `noUncheckedIndexedAccess: true`
- Files in kebab-case: `event-card.tsx`, `use-locale.ts`
- React components in PascalCase exports: `export function EventCard()`
- Hooks start with `use`
- Server-only modules under `lib/server/`, mark with `import "server-only"`
- Client components start with `"use client"`; everything else is server by default
- Imports auto-sorted by Prettier; type imports use inline `type` syntax (`import { type Foo, bar } from '...';`)

## Adding Content

- Events: drop a JSON file in `content/events/` named `yyyy-mm-dd-slug.json`, validated by the Zod schema at build time
- Static prose (About, FAQ, legal): MDX in `content/mdx/` as paired locale files (`about.de.mdx`, `about.en.mdx`)
- UI strings: add the key to both `messages/de.json` and `messages/en.json`
