# Sub-Agents Directory

This folder defines the specialised sub-agents that the Lead Orchestrator delegates work to. Each agent has a single clear scope, declared inputs, outputs, and boundaries. The Lead Orchestrator integrates outputs across agents and presents consolidated results to the project owner.

## Roster

| Agent | Scope |
|---|---|
| [`architect`](./architect.md) | Tech and architecture decisions; owns ADRs |
| [`design-system`](./design-system.md) | Tokens, typography, spacing, motion-tokens, Tailwind config |
| [`frontend`](./frontend.md) | App Router pages, layouts, bespoke components |
| [`motion`](./motion.md) | Framer Motion, Lenis, scroll-triggers, parallax, micro-interactions |
| [`content-i18n`](./content-i18n.md) | DE/EN copy, MDX, next-intl catalogues |
| [`backend`](./backend.md) | Build-time content validation and image processing (Phase 1 scope) |
| [`security`](./security.md) | CSP, headers, cookie consent, DSG/DSGVO, OWASP |
| [`devops`](./devops.md) | Repo skeleton, CI/CD, Cloudflare Pages, branch protection |
| [`qa`](./qa.md) | Playwright E2E, axe a11y, Lighthouse CI, cross-browser |
| [`docs`](./docs.md) | README, ADRs (formatting), runbooks, changelog |

## How They Work Together

Sprints follow the plan in \`PROJECT_BRIEF.md\` section 6. Each sprint nominates one or two lead agents; supporting agents contribute as needed. The Lead Orchestrator opens the sprint, delegates, integrates, and runs the approval gate with the owner.

No agent commits directly to \`main\`. All work flows through PRs that satisfy the quality gates in \`PROJECT_BRIEF.md\` section 10.
