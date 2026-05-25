# ADR-0003: Hosting and Deployment

- **Status**: Proposed (revised 2026-05-25 — Cloudflare **Workers** via OpenNext, not Pages)
- **Date**: 2026-05-25
- **Deciders**: Project owner (Abdulmannan Bhatti), architect agent
- **Tags**: hosting, deployment, infrastructure, compliance, dns, cloudflare, opennext, workers

## Context

Move&Meet serves a Swiss and broader DACH audience of Muslim women. Latency targets are tight (Lighthouse mobile 95+ over a Swiss 4G profile). Compliance bar: CH revDSG and EU DSGVO. Phase 1 does not process personal data at the application level (no forms, no event registrations, no newsletter, no contact form). The only PII flowing through the system is what the host and the visitor's browser exchange (IP, User-Agent for log lines).

The original revision of this ADR proposed Cloudflare **Pages** with the `@cloudflare/next-on-pages` adapter. Two findings forced a re-revision during Sprint 0 setup:

1. `@cloudflare/next-on-pages` is officially deprecated in favour of `@opennextjs/cloudflare` (OpenNext). The Cloudflare team and the Next.js OSS community both point new projects at OpenNext.
2. Cloudflare's current dashboard funnel for new Git-connected projects produces **Workers Builds** projects (with required deploy command, version command, API token) rather than the classic Pages project type. Trying to coax the new flow into a Pages-shaped setup adds friction without value.

The correct response is to embrace Workers + OpenNext as the deployment target.

## Decision

We deploy on **Cloudflare Workers** using **Workers Builds** (Git integration), with the **OpenNext for Cloudflare** adapter (`@opennextjs/cloudflare`) producing the Worker bundle.

**Workflow**: `main` maps to Production. Every pull request triggers a Preview deployment (a separate Worker name suffixed with the branch / PR hash). Workers Builds runs `pnpm install --frozen-lockfile`, then the configured build command, then the configured deploy command, on Cloudflare-managed Linux runners.

**Build pipeline** (configured in Cloudflare dashboard, also runnable locally via `pnpm build:cf`):

- Build command: `pnpm build:cf` (resolves to `opennextjs-cloudflare build`, which internally runs `next build` and then packages the output into `.open-next/worker.js` and `.open-next/assets/`)
- Deploy command: `pnpm deploy:cf` (resolves to `opennextjs-cloudflare deploy`, which calls `wrangler deploy` with our `wrangler.toml`)

**Wrangler configuration** (`wrangler.toml`):

```toml
name = "move-and-meet"
main = ".open-next/worker.js"
compatibility_date = "2026-05-01"
compatibility_flags = ["nodejs_compat"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"
```

**OpenNext configuration** (`open-next.config.ts`) is minimal in Phase 1. Phase 2 adds incremental cache and tag cache bindings (Cloudflare KV, D1, or Queues) when forms / DB land.

**Runtime model**: The Worker runs on V8 isolates in Cloudflare's global network. Static assets are served from `[assets]` binding without invoking the Worker. Dynamic routes (Server Components, Route Handlers, middleware) hit the Worker.

**Region and data flow**: Workers run in the data centre closest to the visitor (Zurich `ZRH`, Geneva `GVA`, Frankfurt `FRA`, etc.). PII processing in Phase 1 is essentially zero at the application layer, so the "where does it run" question is mostly cosmetic. Cloudflare's EU Data Boundary commitments and Sub-Processor list cover operational data. Phase 2 form workers can be pinned to EU placement when reactivated.

**Environment variables**: Managed in the Cloudflare dashboard under the project's Variables & Secrets section. Phase 1 holds only `NEXT_PUBLIC_SITE_URL` per environment (Production and Preview separately). Local dev uses `.env.local` (git-ignored).

**Domain target**: `movemeet.ch`. Registration deferred to the end of Phase 1. Until then the site runs on the Workers-assigned subdomain (`*.workers.dev` style). When registered, the domain goes through **Cloudflare Registrar** at at-cost pricing. DNS is then managed at Cloudflare with the apex routed to the Worker via a Custom Domain binding.

**Security and DDoS**: Cloudflare's standard DDoS protection, Bot Fight Mode, and WAF managed rules apply at the zone level once the custom domain is connected. All free on the Workers Free plan.

## Consequences

### Positive

- OpenNext is the current, actively maintained adapter; we are on the supported path, not the deprecated one.
- Matches Cloudflare's preferred Git-connected project type (Workers Builds), so the dashboard UI works with us rather than against us.
- Privacy posture as strong as before: Cloudflare's transparency reporting and EU Data Boundary stance still apply.
- DDoS and WAF protection at the zone level once domain is connected, free tier covers our scale.
- Registrar, DNS, CDN, TLS, Worker, all under one Cloudflare account.
- Workers Free tier is generous for our scale (100k requests/day per Worker, ample for a community site).

### Negative / Trade-offs

- Worker runtime is V8 isolates, not Node. Node-only APIs (Sharp at runtime, file-system writes, child processes) do not work. We design around this with build-time image processing and the custom image loader; ADR-0001 covers the image strategy.
- OpenNext support for the bleeding edge of Next.js features sometimes lags by days or weeks. We pin Next.js carefully and run a local `pnpm build:cf` before bumping the framework.
- Cloudflare is US-headquartered. The compliance reality is similar to any major US cloud (SCCs, EU regional commitments). Cloudflare must be disclosed in the privacy notice as a processor when published in Sprint 5.
- Phase 2 form reactivation still works on Workers (Server Actions are supported) but requires Workers-compatible mail libraries (the Resend SDK works on Workers; some others do not).

### Neutral

- No mail provider, no captcha provider, no analytics provider in Phase 1. Third-party runtime surface stays minimal.
- Image optimization at build time generates AVIF/WebP variants in `public/images/optimised/`; the custom Next.js image loader points at them.

## Alternatives Considered

### Alternative A: Vercel (the originally proposed host)

- **Pros**: Native Next.js, Sharp at runtime, first-class Server Actions, broader EU region pinning (`fra1`).
- **Cons**: Weaker privacy reputation than Cloudflare, no integrated DDoS/WAF in free tier, no integrated registrar.
- **Why rejected**: Owner prioritised EU/Swiss privacy posture and integrated registrar.

### Alternative B: Cloudflare **Pages** with the deprecated `@cloudflare/next-on-pages` adapter

- **Pros**: The setup the original ADR described; works for a while still.
- **Cons**: Adapter is deprecated; Cloudflare's new dashboard funnels new projects into Workers Builds, not Pages; bug fixes and Next.js compatibility updates have stopped on the old adapter.
- **Why rejected**: Building new on a deprecated path is technical debt the day we ship.

### Alternative C: Self-hosted on a Swiss VPS (Infomaniak, Exoscale)

- **Pros**: Full data locality in Switzerland.
- **Cons**: We own patching, scaling, TLS rotation, CDN, image optimisation, log retention.
- **Why rejected**: Operational cost incompatible with team size and Phase 1 timeline.

## Implementation Notes

Create the Cloudflare project linked to the GitHub repository (Workers Builds flow). In Project Settings → Build configuration:

- **Build command**: `pnpm build:cf`
- **Deploy command**: `pnpm deploy:cf`
- **Non-production branch deploy command**: leave empty (uses the same)
- **Root directory**: `/`
- **API token**: auto-generated by Cloudflare
- **Production branch**: `main`

In Project Settings → Variables and Secrets:

- Production: `NEXT_PUBLIC_SITE_URL` = production URL, `NODE_VERSION` = `22`
- Preview: `NEXT_PUBLIC_SITE_URL` = preview URL pattern, `NODE_VERSION` = `22`

`wrangler.toml` lives at the repo root with the configuration shown above. `nodejs_compat` is required for Sharp's build-time use (build runs on Cloudflare's Linux runners which do have Node, so this is for compatibility of imported modules, not Sharp at runtime).

`open-next.config.ts` lives at the repo root as a minimal `defineCloudflareConfig({})` stub. Phase 2 fills it in.

Document the runbook in `docs/runbooks/deploy.md` covering rollback (Cloudflare deployment history → previous deployment → Rollback), DNS change procedure (filled in when `movemeet.ch` is registered), and the OpenNext build pipeline.

## Open Questions

- Domain registration timing: register `movemeet.ch` via Cloudflare Registrar at the latest one week before public launch (Sprint 8) to allow DNS propagation and SSL provisioning lead time. Owner action.
- Confirm Cloudflare processor disclosure wording for the privacy notice; depends on the legal entity recorded as data controller (owner-as-natural-person in Phase 1).
- If runtime image quality becomes a bottleneck after Sprint 4 (Community gallery), evaluate Cloudflare Images at USD 5/month versus the build-time pipeline; decide before Sprint 6.
