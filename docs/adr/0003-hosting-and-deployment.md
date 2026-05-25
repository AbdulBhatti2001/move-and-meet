# ADR-0003: Hosting and Deployment

- **Status**: Proposed (revised 2026-05-25, switched from Vercel to Cloudflare Pages)
- **Date**: 2026-05-25
- **Deciders**: Project owner (Abdulmannan Bhatti), architect agent
- **Tags**: hosting, deployment, infrastructure, compliance, dns, cloudflare

## Context

Move&Meet serves a Swiss and broader DACH audience of Muslim women. Latency targets are tight (Lighthouse mobile 95+ over a Swiss 4G profile), and the regulatory footprint is non-trivial: CH revDSG governs Swiss visitors, EU DSGVO governs visitors from member states, and both regimes care about where personal data is processed and stored, who the data processors are, and whether a Data Processing Agreement is in place.

Phase 1 does not process personal data at the application level: no forms, no event registrations, no newsletter, no contact form. The only PII flowing through the system is what the host and the visitor's browser exchange (IP, User-Agent for log lines), which is standard operator data and disclosed in the privacy notice.

The original proposal in this ADR was Vercel. After owner review the platform choice has been revisited with a stronger weight on EU/Swiss privacy posture, integrated DDoS/WAF, and the option to consolidate domain registration with the host. The new chosen platform is Cloudflare Pages.

## Decision

We deploy on **Cloudflare Pages** using its Git integration with GitHub. The repository's `main` branch maps to **Production**, every pull request gets a **Preview deployment** with its own URL, and every push to a branch refreshes that preview. The build command is `pnpm install --frozen-lockfile && pnpm build && npx @cloudflare/next-on-pages@1`, the output directory is `.vercel/output/static`, and the compatibility flag `nodejs_compat` is enabled.

**Runtime model**: Cloudflare Pages serves static assets from the global edge and runs Next.js server components plus Route Handlers on **Cloudflare Workers** (V8 isolates). This is functionally equivalent to "Edge runtime" in Next.js terms. We accept this constraint: all server-side code must be Web-API compatible (no Node-only APIs like `fs`, `child_process`, native modules). Sharp is not available at runtime; image optimization is solved at build time and through a custom image loader (see Implementation Notes).

**Region and data flow**: Cloudflare Workers run in the data centre closest to the visitor. For Swiss visitors this is typically Zurich (`ZRH`) or Geneva (`GVA`); for DACH visitors typically Frankfurt or Vienna. PII processing in Phase 1 is essentially zero at the application layer, so the "where does it run" question is mostly cosmetic for now. Cloudflare's stated EU Data Boundary commitments and their published Sub-Processor list cover the operational data (IP logs, security events). When Phase 2 reactivates forms, we will pin sensitive Workers to the EU via the `compatibility_flags` and `placement = "smart"` setting or move that surface to a dedicated EU-only Worker.

**Environment variables**: Cloudflare Pages exposes separate variable scopes for Production and Preview through its dashboard. Phase 1 holds only `NEXT_PUBLIC_SITE_URL` per scope. Local development uses `.env.local`, git-ignored. Secrets are never committed; `.env.example` lists key names only.

**Domain target**: `movemeet.ch`. Domain purchase is deferred to the end of the project. Until then the site runs on the Cloudflare Pages assigned subdomain (e.g. `move-and-meet.pages.dev`). When the domain is purchased it will be registered through **Cloudflare Registrar** at at-cost pricing, which keeps registrar, DNS, CDN, and WAF under one account.

**DNS** when the domain is live: managed at Cloudflare. The apex `movemeet.ch` and `www.movemeet.ch` are CNAME-flattened to the Pages project. HTTPS, HSTS, and TLS termination are handled by Cloudflare automatically. DNSSEC is enabled.

**Security and DDoS**: Cloudflare's standard DDoS protection, Bot Fight Mode, and WAF managed rules are enabled at the zone level. The "Under Attack Mode" toggle is available as an emergency lever. None of this costs anything on the free plan.

## Consequences

### Positive

- Privacy posture is stronger than Vercel: Cloudflare publishes detailed transparency reports, opposes overbroad surveillance requests on the record, and maintains an explicit EU Data Boundary stance for European customers.
- DDoS and WAF protection are included free at the platform level, removing the need to bolt anything on at the application layer.
- Registrar, DNS, CDN, TLS, and hosting all live in one account, which keeps the operational surface small.
- Free tier is unusually generous: unlimited bandwidth, unlimited requests, 500 builds per month, 100 custom domains.
- Cloudflare Registrar charges domains at-cost (no markup), which makes `movemeet.ch` cheaper to hold long-term than via most retail registrars.

### Negative / Trade-offs

- The Workers runtime is V8 isolates, not Node. Native Node APIs and packages that depend on them (Sharp at runtime, file-system writes, child processes) do not work. We design around this with build-time image processing and a custom image loader.
- Next.js compatibility lags Vercel by some weeks for the newest features. We pin Next.js carefully and test on the `next-on-pages` adapter before bumping.
- Cloudflare is US-headquartered, like Vercel. The compliance reality is similar (SCCs, EU regional commitments), but we still must list Cloudflare Inc. in the privacy notice as a processor when we publish it in Sprint 5.
- Phase 2 reactivation of forms with Server Actions works on Pages but requires the Workers-compatible Resend SDK path and explicit handling of the absence of Node APIs.

### Neutral

- No mail provider, no captcha provider, no analytics provider in Phase 1. The third-party runtime surface is the smallest it can be.
- Image optimization at build time means we pre-render multiple sizes and serve appropriate ones with `<picture>` and `srcset`; runtime resizing happens only if we later add Cloudflare Images ($5/month) or a custom image worker.

## Alternatives Considered

### Alternative A: Vercel (the original proposal)

- **Pros**: Native Next.js platform, Sharp at runtime, native `next/image`, first-class Server Actions, broader EU region pinning (`fra1`).
- **Cons**: Weaker privacy reputation than Cloudflare, no integrated DDoS/WAF in free tier, no integrated registrar, US processor with similar legal footprint.
- **Why rejected after revision**: Owner explicitly prioritised privacy posture and Swiss/EU compliance over Next.js convenience. The technical workarounds for image optimization and Workers runtime are well-understood and acceptable.

### Alternative B: Self-hosted on a Swiss VPS (Infomaniak, Exoscale)

- **Pros**: Full data locality in Switzerland.
- **Cons**: We own patching, scaling, TLS rotation, CDN, image optimisation, log retention. Two-founder team cannot absorb this.
- **Why rejected**: Operational cost is incompatible with the team size and Phase 1 timeline.

### Alternative C: Netlify

- **Pros**: Good Next.js story, generous free tier.
- **Cons**: US-headquartered, no integrated DDoS/WAF, no integrated registrar, no Swiss/EU privacy story stronger than Vercel.
- **Why rejected**: Offers no advantage over Vercel for our purposes and lacks Cloudflare's privacy posture.

## Implementation Notes

Create the Cloudflare Pages project linked to the GitHub repository. In Project Settings, set:

- Build command: `pnpm install --frozen-lockfile && pnpm build && npx @cloudflare/next-on-pages@1`
- Build output directory: `.vercel/output/static`
- Root directory: `/`
- Production branch: `main`
- Node version: `20`
- Compatibility flag: `nodejs_compat`

Add `wrangler.toml` at repo root with:

```toml
name = "move-and-meet"
compatibility_date = "2026-05-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"
```

Install the dev dependencies `@cloudflare/next-on-pages` and `wrangler` for local preview via `pnpm wrangler pages dev`. Add scripts to `package.json`: `"build:cf": "next build && npx @cloudflare/next-on-pages"`, `"preview:cf": "wrangler pages dev"`.

For images, use a custom Next.js image loader configured in `next.config.ts` that returns the original public-path URL unchanged. Pre-generate responsive sizes as part of the build via a `scripts/process-images.ts` step that uses Sharp locally (build environment has Node). The build script writes optimised AVIF and WebP variants into `public/images/optimised/` which the loader points at.

Headers and CSP are configured via a `_headers` file at the build output root (Cloudflare Pages reads it). This replaces the `next.config` headers approach for the Cloudflare deployment.

Add a GitHub Actions workflow `.github/workflows/ci.yml` running `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm tsx scripts/validate-content.ts`, and a dry-run of the Cloudflare build. Cloudflare Pages itself triggers the actual deployment on push.

Document the runbook in `docs/runbooks/deploy.md` covering rollback (Cloudflare Pages "Rollback to this deployment"), DNS change procedure (filled in when `movemeet.ch` is registered), and the build-time image pipeline.

## Open Questions

- Domain registration timing: register `movemeet.ch` via Cloudflare Registrar at the latest one week before the public launch (Sprint 8) to allow DNSSEC propagation and SSL provisioning lead time. Owner action.
- If runtime image quality becomes a bottleneck after Sprint 4 (Community gallery), evaluate Cloudflare Images at $5/month versus the build-time pipeline; decide before Sprint 6.
- Confirm Cloudflare processor disclosure wording for the privacy notice; depends on the legal entity recorded as data controller (owner-as-natural-person in Phase 1).
