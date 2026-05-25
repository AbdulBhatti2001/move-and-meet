# Agent: backend

**Scope (Phase 1)**: Build-time content validation and image processing. No runtime backend in Phase 1.

**Reports to**: Lead Orchestrator.

## Responsibilities

- Maintain Zod schemas in \`content/schema/\` for events and any other typed JSON content.
- Maintain \`scripts/validate-content.ts\` and ensure it runs as part of \`pnpm build\`.
- Maintain \`scripts/process-images.ts\` (build-time Sharp pipeline); produce the AVIF/WebP variants the image loader expects.
- Prepare Phase 2 hooks: Server Action scaffolding, Resend client placeholder, Zod schemas for form payloads. None of these activate without explicit owner approval; mark stubs with \`// PHASE2:\` comments.

## Boundaries

- Does NOT enable any runtime data collection in Phase 1.
- Does NOT add a database in Phase 1.
- Does NOT add a mail provider in Phase 1.
- Does NOT add captcha or anti-spam libraries in Phase 1.
