# ADR-0001: Technology Stack

- **Status**: Proposed (revised 2026-05-25 after scope cut)
- **Date**: 2026-05-25
- **Deciders**: Project owner (Abdulmannan Bhatti), architect agent
- **Tags**: frontend, framework, styling, i18n, content, tooling

## Context

Move&Meet is a Swiss premium community website for Muslim women, organised around three pillars (Movement, Connection, Sisterhood). The Phase 1 surface is a marketing and event-display site: bilingual DE/EN landing, About, three pillar pages, event index and detail pages, a small FAQ, social-link join page, legal pages.

**Phase 1 explicitly excludes event registration forms, newsletter signup, and any transactional email path.** Interest in events is captured by directing users to WhatsApp and Instagram. This scope cut removes the need for a forms backend, form validation library, captcha integration, and transactional mail service. Non-goals also include user accounts, payments, an admin CMS UI, and a native app.

The non-functional bar is high. Lighthouse mobile must reach 95 or higher across all four categories, the site must satisfy WCAG 2.1 AA, and the data layer must hold against CH revDSG and EU DSGVO. The brand tonality (Nike Women meets calm outdoor sisterhood) demands first-class motion and image quality without hurting performance budgets. Content updates are rare and editorial, not transactional.

These forces push toward a server-rendered React framework with a strong static path, type-safe content, and a small mature animation stack. No backend services for Phase 1.

## Decision

We use the following stack for Phase 1.

The application runs on **Next.js 15.x** with the App Router and **React 19.x**, written in **TypeScript 5.x with `strict: true`** and `noUncheckedIndexedAccess: true`. Styling uses **Tailwind CSS 4.x** with CSS custom properties as the single source of truth for design tokens (color, spacing, typography scale, radii, shadows). The component layer is **shadcn/ui** primitives, copied into `/components/ui`, with bespoke Move&Meet components composed on top in `/components`. Motion is **Framer Motion 11.x** for component-level transitions and **Lenis 1.x** for smooth scroll, both gated behind `prefers-reduced-motion`. Internationalisation uses **next-intl 3.x** with route-based locales (`/de`, `/en`). Static prose (About, FAQ, legal pages) lives as **MDX** rendered via `@next/mdx`. Events are authored as typed JSON validated by **Zod 3.x** at build time. The package manager is **pnpm 9.x** and the build runtime is **Node 20 LTS**. Images are pre-processed at build time by **Sharp** into AVIF and WebP variants under `public/images/optimised/`, then served via a custom `next/image` loader (see ADR-0003 for the Cloudflare Pages runtime context that drives this image strategy).

There is **no forms infrastructure** in Phase 1: no react-hook-form, no Resend, no react-email, no Turnstile. Interest CTAs link out to WhatsApp and Instagram. Server Actions remain available in the framework but are not used. If Phase 2 reactivates registrations and newsletter, the same stack accommodates them additively without rework (Zod schemas can be extended, Server Actions and Resend slot in).

## Consequences

### Positive

- Single framework owns routing, rendering, and image optimisation, which keeps the surface area small for a two-founder project.
- Tailwind v4 plus CSS variables makes design tokens portable to Figma and easy to theme without a JS runtime.
- shadcn/ui keeps components in-repo, fully ownable and auditable, which matters for accessibility tuning.
- Scope cut to display-only removes a full class of compliance work (PII processing via forms, transactional mail deliverability, third-party form processors).
- No database, no mail service, no captcha service in Phase 1 means fewer DPAs to track and a simpler privacy notice.

### Negative / Trade-offs

- Tailwind v4 is recent; the ecosystem of plugins and IDE tooling is still catching up, and some shadcn/ui generators currently default to v3 syntax and need manual migration.
- App Router plus React 19 server components require discipline around the server/client boundary; mistakes leak bundle size.
- Framer Motion ships roughly 40 KB gzipped; we accept this for brand-critical motion but must lazy-load it on routes that do not need it.
- Without on-site registration we have no first-party record of who is interested; all funnel signal lives in WhatsApp and Instagram analytics. Acceptable for Phase 1 by explicit owner choice.

### Neutral

- shadcn/ui's "copy, not install" model means upstream fixes are not automatic. We treat copied components as our own code and update intentionally.
- MDX for prose means content edits require a PR until we add a CMS in Phase 2.
- Server Actions are available in the framework but unused; this leaves a zero-cost extension point for Phase 2.

## Alternatives Considered

### Alternative A: Astro 5 + React islands

- **Pros**: Excellent default Lighthouse scores, minimal client JS, strong content collections story.
- **Cons**: Weaker first-class story for Server Actions if Phase 2 reactivates forms; smaller ecosystem at our maturity bar; less seamless integration with the Vercel preview workflow.
- **Why rejected**: We trade Next.js's integrated server primitives for marginal initial-load wins we can achieve in Next.js with discipline. Phase 2 reactivation would mean a rewrite.

### Alternative B: SvelteKit

- **Pros**: Smaller runtime, ergonomic templating, fast HMR.
- **Cons**: Smaller component and motion ecosystem; shadcn/ui is React-first; team familiarity favours React.
- **Why rejected**: Ecosystem cost outweighs runtime savings for a brand site of this size.

### Alternative C: Motion library swap (Motion One or GSAP instead of Framer Motion)

- **Pros**: Motion One is lighter; GSAP is best in class for timeline animation.
- **Cons**: Motion One lacks React-idiomatic layout and exit animations; GSAP's licence and bundle weight do not fit a brand site.
- **Why rejected**: Framer Motion's `AnimatePresence`, `layout`, and reduced-motion ergonomics fit our component model.

## Implementation Notes

Pin versions in `package.json` with caret ranges: `next@^15`, `react@^19`, `react-dom@^19`, `typescript@^5.6`, `tailwindcss@^4`, `framer-motion@^11`, `lenis@^1.1`, `next-intl@^3`, `@next/mdx@^15`, `zod@^3.23`. Add Sharp as a **devDependency only** (`sharp@^0.33`) since it is used at build time for image processing but never at runtime (the Cloudflare Workers runtime cannot load it). Add `.nvmrc` pinning `20`. Configure `tsconfig.json` with `strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`. Configure Tailwind v4 via `@import "tailwindcss"` and a `tokens.css` file holding CSS variables. Install shadcn/ui via the v4-compatible CLI flag and verify generated files do not contain v3 directives. Add an ESLint config extending `next/core-web-vitals` plus `@typescript-eslint/strict`. Do NOT install `react-hook-form`, `resend`, `react-email`, or any captcha SDK in Phase 1; they are Phase 2 candidates and adding them now adds bundle weight and dependency surface for no Phase 1 use.

**Cloudflare Pages runtime constraint** (see ADR-0003): server-side code must be Web-API compatible (no Node-only APIs at runtime). The image strategy uses Sharp at build time to pre-render AVIF and WebP variants into `public/images/optimised/`, served via a custom `next/image` loader. This is documented in `docs/runbooks/images.md` (Sprint 1 deliverable).

## Open Questions

None blocking. Tailwind v4 plugin maturity should be reviewed at the end of Sprint 1; fall back to v3.4 if a blocker emerges.
