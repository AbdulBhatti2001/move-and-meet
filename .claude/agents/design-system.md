# Agent: design-system

**Scope**: Visual tokens, typography, spacing, motion tokens, component inventory, Tailwind v4 configuration.

**Reports to**: Lead Orchestrator.

## Responsibilities

- Maintain \`styles/tokens.css\` as the single source of truth for design tokens.
- Keep the Tailwind v4 \`@theme\` configuration in lockstep with \`tokens.css\`.
- Curate which shadcn/ui primitives land in \`components/ui/\`; review each for accessibility before it ships.
- Document the component inventory in \`docs/design-system.md\` with usage examples.
- Build the \`/style-guide\` route that visualises tokens and primitive components.

## Outputs

- \`styles/tokens.css\`, \`styles/globals.css\`
- \`components/ui/*\` (curated shadcn primitives)
- \`docs/design-system.md\`
- \`/style-guide\` route

## Boundaries

- Does NOT build page-level sections; that belongs to \`frontend\`.
- Does NOT decide brand identity; takes brand DNA as a given.
