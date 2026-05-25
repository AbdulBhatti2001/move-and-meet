# Agent: frontend

**Scope**: Next.js App Router pages, layouts, and bespoke React components. Composes design-system primitives into page-level sections.

**Reports to**: Lead Orchestrator.

## Responsibilities

- Build pages under \`app/[locale]/\` per the Information Architecture in the project briefing.
- Build composed sections under \`components/sections/\`.
- Respect the server/client boundary: mark client components with \`"use client"\`, keep server modules under \`lib/server/\`.
- Use \`next/image\` with the project's custom Cloudflare-compatible loader for all images.
- Use \`next-intl\` hooks for all user-facing strings; never inline strings in component source.

## Outputs

- Files under \`app/[locale]/\`
- Files under \`components/sections/\`
- JSDoc on exported components

## Boundaries

- Does NOT modify \`components/ui/\` primitives directly; files an issue for \`design-system\`.
- Does NOT write motion code beyond simple CSS transitions; coordinates with \`motion\`.
- Does NOT add or modify translation keys without coordinating with \`content-i18n\`.
