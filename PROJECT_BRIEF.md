# PROJECT_BRIEF — Move&Meet

> Lebendes Briefing. Wird nach jedem Sprint aktualisiert. Enthält aktuellen Stand, Architekturentscheidungen (via ADR-Links), Sprint-Status und offene Fragen.

**Letztes Update**: 2026-05-25 (Sprint 3 gemerged, Sprint 4 Implementation fertig)
**Aktueller Sprint**: 4 (About, Community, Founders)
**Sprint-Status**: Files auf Branch `feat/about-community-founders`, lokale Tests offen

---

## 1. Vision

**Move&Meet by Active Deen Sisters** ist eine Schweizer Community-Plattform für muslimische Frauen, die zusammen Sport machen, sich vernetzen und gemeinsam wachsen wollen. Drei Säulen: **Movement · Connection · Sisterhood**.

**Tonalität**: Nike Women × Outdoor Aesthetic × ruhige Premium Sisterhood. Modern, motivierend, spirituell ohne predigend. Nicht Vereinsoptik, nicht Fitnessstudio.

**Founders**: Aysin (Mother of four, Running & Strength Training Mindset), Michelle (Business Psychology Studentin, Gruppensport & Matcha Dates).

**Aktivitäten**: Walks, Runs, Hiking, Pilates, Standup Paddling, Strength Training, Matcha Dates, tiefgründige Gespräche.

## 2. Phase-1 Scope (revidiert 2026-05-25)

Move&Meet Phase 1 ist eine **reine Darstellungs-Site**. Sie zeigt die Community, die Events und die Story, sammelt aber **keine Daten von Userinnen ein**. Wer Interesse hat, klickt auf WhatsApp oder Instagram. Das vereinfacht Compliance, Hosting, Security und beschleunigt den Launch erheblich.

### Goals

- Lighthouse mobile ≥ 95 in allen vier Kategorien
- WCAG 2.1 AA bestanden
- Bilingual DE/EN
- CH revDSG + EU DSGVO konform (deutlich entspannter ohne Forms)
- SEO-stark für "Active Sisters Schweiz", "Frauen Sport Community Schweiz", "Hijabi Run Club St. Gallen"
- Events sind klar dargestellt, Interesse wird über Social-CTAs weitergeleitet
- Owner-Name erscheint genau **einmal** auf der gesamten Site (siehe Name-Minimierung)

### Non-Goals Phase 1

- Keine Event-Anmeldungen über die Website
- Kein Newsletter-Form
- Keine Kontakt-Formulare
- Keine E-Mail-Zusendungen, kein Resend, keine transactional Mail
- Keine Captcha, keine Turnstile, keine Anti-Spam-Stack
- Kein User-Login, kein Account-System
- Kein Online-Payment
- Kein eigenes CMS-Backend mit Editor-UI
- Keine native App
- Kein Verein in Phase 1

## 3. Architecture Decisions

| ADR                                                   | Titel                                                               | Status   |
| ----------------------------------------------------- | ------------------------------------------------------------------- | -------- |
| [ADR-0001](./docs/adr/0001-tech-stack.md)             | Technology Stack (revidiert: Cloudflare-kompatible Image-Strategie) | Proposed |
| [ADR-0002](./docs/adr/0002-repo-structure.md)         | Repository Structure                                                | Proposed |
| [ADR-0003](./docs/adr/0003-hosting-and-deployment.md) | Hosting and Deployment (revidiert: Cloudflare Pages statt Vercel)   | Proposed |

**Stack-Kurzfassung** (Details in ADR-0001):
Next.js 15 + React 19 + TypeScript strict, Tailwind v4 mit CSS Variables, shadcn/ui, Framer Motion + Lenis, next-intl, MDX für Prose, typed JSON + Zod für Events, pnpm 9, Node 20 LTS. Hosted on **Cloudflare Pages** via `@cloudflare/next-on-pages` adapter. Bilder werden build-time mit Sharp prä-optimiert. Keine Forms-Stack-Komponenten in Phase 1.

## 4. Name-Minimierung (Owner-Anforderung)

Owner möchte seinen Namen `Abdulmannan Bhatti` an möglichst wenigen Orten haben. CH revDSG Art. 19 verlangt eine identifizierbare verantwortliche Person, Initialen reichen nicht. Komplett anonym geht nicht.

**Lösung**: Eine einzige Legal-Seite `/rechtliches` (DE) bzw. `/legal` (EN) kombiniert Impressum und Datenschutzerklärung in einem Dokument. Owner-Name erscheint im Block "Verantwortlich für diese Website":

> Verantwortlich für diese Website: Abdulmannan Bhatti, Schweiz
> Kontakt: [E-Mail-Adresse]

**Geltungsbereich**:

- ✓ Genau **einmal** auf `/rechtliches`
- ✗ NICHT in About, Hero, Founder-Sektion, Footer-Text
- ✗ NICHT in HTML `<title>`, `<meta>` Tags, OpenGraph-Beschreibungen
- ✗ NICHT in `package.json` `author` Feld (nutzen wir generisch "Move&Meet")
- ✗ NICHT in Git-Commits (Author wird auf `Move&Meet <noreply@movemeet.ch>` gesetzt für Repo-Commits durch Sub-Agents; Owner committet als sich selbst)
- Footer-Link heisst nur "Rechtliches" / "Legal"

Wenn ein Verein in Phase 2 gegründet wird, ersetzt der Vereinsname den Owner-Namen mit einer einzigen Code-Änderung (Variable in einer MDX-Konstante).

## 5. Sub-Agents

Definitionen entstehen in `.claude/agents/<name>.md` als Teil von Sprint 0 Devops-Work.

| Agent         | Verantwortung                                                                            |
| ------------- | ---------------------------------------------------------------------------------------- |
| architect     | Tech-Stack, Repo-Struktur, ADRs, Dependency-Auswahl                                      |
| design-system | Tokens, Typo-Scale, Spacing, Komponenten-Inventar, Tailwind-Config                       |
| frontend      | Next.js Implementation, Komponenten, Pages                                               |
| motion        | Framer Motion / Lenis Animationen, Scroll-Trigger, Parallax                              |
| content-i18n  | Copywriting DE/EN, next-intl Setup, MDX-Inhalte                                          |
| backend       | Reduziert in Phase 1: nur Build-Time-Helfer für Content-Validierung und Image-Processing |
| security      | CSP, Security Headers, OWASP, DSG/DSGVO, Cookie-Consent                                  |
| devops        | GitHub Setup, Branch Protection, Actions Workflows, Cloudflare Pages Deploy              |
| qa            | Playwright E2E, Lighthouse CI, axe Accessibility, Cross-Browser                          |
| docs          | README, ADRs, Component Docs, Deployment Guide, Runbook                                  |

## 6. Sprint-Plan (revidiert)

| #   | Name                       | Scope                                                                                                                                        | Gate                                                                        |
| --- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 0   | Discovery & Foundation     | ADRs, Repo-Skelett, pnpm, husky, lint, typecheck, Hello-Layout, Cloudflare Pages Config                                                      | Stack akzeptiert, Repo grün, `pnpm dev` läuft, `pnpm build:cf` durchläuft   |
| 1   | Design System & Tokens     | Tailwind v4 Config, Tokens, Fonts via next/font, Button + SectionHeader + Container, Build-Time Image Pipeline                               | Style-Guide-Route zeigt Tokens, Atom-Komponenten, Image-Pipeline-Smoke-Test |
| 2   | Hero & Navigation          | Landing-Hero, Pillars-Band, Mobile-Nav, Sprach-Switch, next-intl Setup                                                                       | Hero live, Lighthouse Mobile ≥ 90, reduced-motion sauber                    |
| 3   | Events DISPLAY             | Event-Datenmodell (typed JSON), Liste, Detail, Featured-Card, CTA = WhatsApp/IG Deeplink                                                     | Events sichtbar, Bilingual sauber, Deeplinks funktionieren                  |
| 4   | About, Community, Founders | Vision, Founder-Snippets, Community-Galerie, Scroll-Reveals                                                                                  | Visueller Review freigegeben                                                |
| 5   | FAQ, Join, Legal           | FAQ-Accordion (a11y), `/join` mit Social-Buttons, `/rechtliches` (kombiniert Impressum + Datenschutz, Name einmalig)                         | Alle Pages vorhanden, Navigation komplett                                   |
| 6   | Security Hardening         | CSP via Cloudflare `_headers`, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, Cookie-Banner (Essentials-only)                   | securityheaders.com A+                                                      |
| 7   | CI/CD & DevOps             | Actions Workflows (ci, e2e, lighthouse, codeql), Branch Protection, semantic-release, CODEOWNERS, Issue/PR Templates                         | Erster grüner Pipeline-Run, Preview-Deploy funktioniert                     |
| 8   | QA & Launch                | Playwright (Nav, Lang-Switch, FAQ, Event-Detail), axe Audit, Cross-Browser, `movemeet.ch` registrieren via Cloudflare Registrar, DNS-Cutover | Launch-Checkliste, Go-Live-Freigabe vom Owner                               |

## 7. Strategische Entscheidungen (Owner-Choices)

| Thema                  | Entscheidung                                        | Begründung-Kurzform                                                                                 |
| ---------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Hosting                | **Cloudflare Pages**                                | Stärkere EU/Swiss-Privacy-Position, gratis DDoS/WAF, integrierte Registrar-Option für `movemeet.ch` |
| Cookie-Consent         | Custom Essentials-only                              | Sauberste DSG-Position, kein Drittanbieter                                                          |
| Forms-Backend          | Komplett vertagt auf Phase 2                        | Owner-Entscheidung 2026-05-25                                                                       |
| Newsletter             | Komplett vertagt auf Phase 2                        | Owner-Entscheidung 2026-05-25                                                                       |
| Event-Anmeldung        | Komplett vertagt auf Phase 2                        | Stattdessen WhatsApp/IG Deeplink                                                                    |
| Legal-Verantwortlicher | Abdulmannan Bhatti (Privatperson, temporär)         | Owner-Entscheidung, wird in späterer Phase überarbeitet                                             |
| **Name-Sichtbarkeit**  | **Genau einmal** auf `/rechtliches`, sonst nirgends | Owner-Anforderung 2026-05-25                                                                        |
| Domain                 | `movemeet.ch` via Cloudflare Registrar (at-cost)    | Owner-Entscheidung, Kauf vor Sprint 8                                                               |
| GitHub-Owner           | Personal `AbdulBhatti2001`                          | Keine Org nötig in Phase 1                                                                          |
| Repo-Name              | `move-and-meet`                                     | Domain und Repo-Name dürfen abweichen                                                               |

## 8. Offene Fragen / TODOs

### Blocker für spätere Sprints

| Sprint | TODO                                                                                                            | Eigentümer | Status              |
| ------ | --------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| 5      | Kontakt-E-Mail für Datenschutzerklärung (vorübergehend `bhattiabdul01@gmail.com`, später `kontakt@movemeet.ch`) | Owner      | Open                |
| 5      | Vollständige Adresse Owner (optional, nur falls Beanstandungs-Briefverkehr ankommen soll)                       | Owner      | Open, klärungsfähig |
| 1-4    | Logo-Dateien (SVG oder layered Vektor)                                                                          | Owner      | Open                |
| 2      | Hero-Video oder eigene Foto-Strecke (Hike, Run, Natur), sonst Pexels/Coverr Premium-Material                    | Owner      | Open                |
| 4      | Echte Community-Bilder mit dokumentiertem Einverständnis der Abgebildeten                                       | Owner      | Open                |
| 4      | Founder-Linien-Illustrationen Aysin & Michelle als Vektor oder Foto zum Nachzeichnen                            | Owner      | Open                |
| 4      | Founder-Bios (Vision, Motivation) final oder Draft-Freigabe                                                     | Owner      | Open                |
| 3      | Event-Liste vollständig (Daten, Orte, Schwierigkeiten, Treffpunkte)                                             | Owner      | Open                |
| 5      | Instagram-Handle final                                                                                          | Owner      | Open                |
| 5      | WhatsApp-Gruppen-Invite-Link oder Channel-Link                                                                  | Owner      | Open                |
| 8      | Domain `movemeet.ch` via Cloudflare Registrar registrieren (mind. 1 Woche vor Launch)                           | Owner      | Open                |

### Geklärt

- Sprachen Phase 1: DE + EN (FR/IT optional Phase 2)
- Empfänger-Mail Anmeldungen: irrelevant in Phase 1 (keine Forms)

## 9. Phase-2 Roadmap (geparkt)

Diese Funktionen wurden in Phase 1 bewusst ausgelassen und können reaktiviert werden, ohne dass der bisherige Code umgeschrieben werden muss:

- **Event-Anmeldungen**: Server Actions auf Cloudflare Workers + Zod-Schemas + Resend-Mail an Owner + Bestätigung an Userin, optional persistente Teilnehmer-Liste (Cloudflare D1 oder Supabase)
- **Newsletter**: Resend Audiences oder Brevo, Double-Opt-In
- **Kontakt-Formular**: gleicher Mail-Pfad
- **Form-Abuse-Schutz**: Cloudflare Turnstile (native auf Cloudflare-Stack)
- **Verein-Gründung "Move&Meet"**: Owner-Name auf `/rechtliches` wird durch Vereinsname ersetzt (eine Codezeile)
- **Eigene Mail-Domain** `hello@movemeet.ch` mit SPF/DKIM/DMARC via Resend
- **Cloudflare Images** ($5/Monat) wenn Build-Time Image-Pipeline an Grenzen kommt
- **Optionales CMS**: Sanity, Payload, oder Cloudflare-native (Pages CMS) für Aysin/Michelle ohne PR-Workflow
- ~~OpenNext-Migration~~: erledigt im Sprint 1 (vorgezogen wegen CF Workers Builds Default-Flow), siehe Sprint-1-Log.
- **next-intl 4.x Upgrade**: Aktuell 3.26 für API-Stabilität in Sprint 0. Upgrade auf 4.x sinnvoll wenn neue 4-only Features (z.B. eingebaute `hasLocale`, verbesserte Type-Safety) gebraucht werden.

## 10. Quality Gates (nicht verhandelbar)

Vor jedem Merge in `main`:

- [ ] ESLint pass
- [ ] `tsc --noEmit` pass
- [ ] Unit Tests (vitest) grün
- [ ] Playwright E2E grün
- [ ] Lighthouse Mobile ≥ 95 in allen vier Kategorien (auf Landing-Page)
- [ ] axe-core Accessibility 0 Violations
- [ ] WCAG 2.1 AA bestanden
- [ ] `pnpm build:cf` läuft sauber durch (Cloudflare-Adapter-Smoke-Test)

## 11. Repo-Koordinaten

- **Lokal**: `C:\Projects\move&meet\move-and-meet`
- **GitHub**: `git@github.com:AbdulBhatti2001/move-and-meet.git` (Private)
- **Branch**: `main` (protected nach Sprint 7)
- **Branch-Strategie**: Trunk-based, `feat/*`, `fix/*`, `chore/*`, Squash-Merge
- **Commits**: Conventional Commits, enforced via commitlint + husky

## 11a. Sprint 2 Log

- 2026-05-25 — Branch `feat/hero-navigation` aufgesetzt. Sprint 1 PR auf `main` gemerged, CF Production Worker live.
- 2026-05-25 — Frontend + Motion + Content-i18n Bundle: `components/motion/reveal.tsx` (Framer-Motion-Wrapper mit `prefers-reduced-motion`), `components/sections/{site-header,site-footer,hero,pillars-band,mobile-nav,language-switcher}.tsx` + Barrel. Hero ist typography-driven mit Radial-Gradient (Pexels-Bild kommt Sprint 4). PillarsBand mit Lucide-Icons (`Footprints`, `Users`, `Heart`) und Reveal-Stagger. SiteHeader sticky mit Backdrop-Blur, Mobile-Drawer mit body-scroll-lock + ESC-Close. LanguageSwitcher swappt Locale via `useRouter.replace(pathname, { locale })`. SiteFooter mit `/rechtliches`-Link (Owner-Name nicht hier per Name-Minimierung).
- 2026-05-25 — Layout extended: `app/[locale]/layout.tsx` rendert SiteHeader + `<main>` + SiteFooter. `app/[locale]/page.tsx` reduziert auf `<Hero /> + <PillarsBand />`.
- 2026-05-25 — `messages/{de,en}.json` ergänzt um `Navigation`, `LanguageSwitcher`, `Hero`, `Pillars`, `Footer` Namespaces (parity 23 Keys).
- 2026-05-25 — `lucide-react ^0.469.0` als Dependency.
- **Pending**: Owner führt `pnpm install` (für lucide-react), `pnpm check`, Smoke-Tests, Commit + Push.
- 2026-05-25 — Sprint-2-Hotfix: Production Worker crashte mit `Internal Server Error` und `Dynamic require of "/.next/server/middleware-manifest.json" is not supported`. Research-Agent hat bestätigt: bekannter Bug in @opennextjs/cloudflare (issues #1232 / #922 / workers-sdk #10236). Fix-Triade applied: (a) `wrangler.toml [vars] NEXT_PRIVATE_MINIMAL_MODE = "1"` (maintainer-recommended workaround, lässt Next-Server-Runtime den early-return Branch nehmen, next-intl Middleware läuft weiter weil OpenNext sie separat bundelt); (b) `compatibility_date` von Future-Date `2026-05-01` auf real `2025-09-23` (OpenNext probiert Compat-Flags basierend auf Datum, Future-Date verwirrt das); (c) `.npmrc` mit `shamefully-hoist=true` + `node-linker=hoisted` (pnpm Symlinks blockieren esbuild's statisches Manifest-Bundling). Plus `NEXT_PUBLIC_SITE_URL` als Var gesetzt damit Metadata-Base nicht auf localhost zeigt.

## 12. Sprint 1 Log

- 2026-05-25 — Branch `feat/design-system-foundation` erstellt. Parallel: Cloudflare Pages Setup via Owner.
- 2026-05-25 — Design-System-Agent liefert: `components/ui/{button,container,section-header}.tsx` + Barrel `index.ts`. Alle drei sind server-component-safe, React-19-Stil (ref-as-prop für Button), nutzen ausschliesslich Brand-Tokens, `cn()`-Helper aus `lib/shared`.
- 2026-05-25 — `/[locale]/style-guide` Route mit Layout (noindex/nofollow), Page mit Color-Swatches, Typo-Scale, Button-Variants/Sizes/States, SectionHeader-Beispielen, Container-Sizes. Production-Guard via `NODE_ENV` Check (`notFound()` in prod).
- 2026-05-25 — `app/[locale]/page.tsx` refactored: nutzt jetzt `Container as="main"` + `SectionHeader level={1}` mit `align="center"`, eyebrow/title/subtitle aus Translations.
- 2026-05-25 — `docs/design-system.md` mit Token-Tabelle (Color, Typo, Motion), Layout-Regeln, Primitive-API für Container/Button/SectionHeader, Composition-Rules, "Adding a new primitive" Workflow.
- 2026-05-25 — Owner Cloudflare-Setup-Befund: neue CF-UI legt Git-connected Projekte als **Workers** an (mit required Deploy command, API token, Version command), nicht als Pages. Erster Build mit `pnpm run build` + `wrangler deploy` läuft bis Build-Success, scheitert dann am Workers-Deploy ("Pages-specific command in a Workers project"). Konsequenz: OpenNext-Migration vorziehen (war Sprint-7-TODO).
- 2026-05-25 — In-Scope Bundle: Adapter-Swap `@cloudflare/next-on-pages` → `@opennextjs/cloudflare`. Files: `package.json` (deps + scripts: `build:cf`, `preview:cf`, `deploy:cf`), `wrangler.toml` (Workers config mit `main` + `assets`-Binding), neuer `open-next.config.ts`, `README.md` Scripts-Tabelle, `.gitignore` (`.open-next/`), ADR-0003 revidiert (Status: revised again, Decision auf Workers/OpenNext umgeschrieben). Sprint-7-TODO "OpenNext-Migration" wird nicht mehr nötig (jetzt erledigt).
- 2026-05-25 — Node-Version-Bump: Wrangler 4 (peer dep von @opennextjs/cloudflare) verlangt Node 22+. CF Build-Environment baute initial auf Node 20 und Deploy scheiterte. Fix: `.nvmrc` von `20` auf `22`, `engines.node` auf `>=22.0.0`, ADR-0001 / ADR-0003 / SETUP.md auf Node 22 LTS angepasst. Node 22 ist seit Q4 2024 Active LTS.
- 2026-05-25 — CF Dashboard Workaround: Trotz mehrerer Versuche speicherte das CF Workers Builds Dashboard die custom Build/Deploy-Commands nicht (UI zeigte "Invalid request body" / "An internal error prevented the form from submitting"). CF lief weiter mit Default `pnpm run build` und `npx wrangler versions upload`. Lösung: `pnpm run build` so umbiegen dass es das richtige tut. Script `build` zeigt jetzt auf `opennextjs-cloudflare build` (canonical Cloudflare-Build), `build:next` für reinen Next.js-Compile-Check, `build:cf` bleibt als Alias. Damit ist es egal ob CF Dashboard die Commands persistiert oder nicht: das Default-Verhalten ist jetzt korrekt. `wrangler versions upload` findet `.open-next/worker.js` via `wrangler.toml` `main`.
- 2026-05-25 — `"type": "module"` in package.json eliminiert Commitlint-Warnung beim Husky-Hook (commitlint.config.js wurde als ambiguous ESM/CJS interpretiert).
- 2026-05-25 — Build-Loop-Fix: vorheriger Versuch `build` auf `opennextjs-cloudflare build` zu setzen verursachte Infinite-Recursion, weil OpenNext intern `pnpm run build` aufruft. Korrektur: `build` zurück auf `next build`, OpenNext-Schritt über `wrangler.toml` `[build] command = "pnpm exec opennextjs-cloudflare build"` Hook. Wrangler führt das automatisch vor jedem `wrangler versions upload` / `wrangler deploy` aus, unabhängig vom CF Dashboard Setting.
- **Pending**: Owner führt `pnpm install` (zieht @opennextjs/cloudflare), lokale Smoke-Tests (`pnpm dev`, `pnpm typecheck`, `pnpm lint`, `pnpm build:cf`), Commit + Push, PR auf `main`, Merge. Parallel: CF Dashboard Build/Deploy-Commands auf `pnpm build:cf` / `pnpm deploy:cf` setzen, dann Re-Deploy triggern.

## 13. Sprint 0 Log

- 2026-05-25 — Briefing aufgenommen, Default-Stack vorgeschlagen, Owner-Choices erfasst
- 2026-05-25 — Repo-Verifikation: lokal git-initialisiert, Remote `origin` zeigt auf GitHub, keine Commits, Branch `main`
- 2026-05-25 — Architect-Agent draftet ADR-0001 bis ADR-0003 (erste Version)
- 2026-05-25 — Owner-Scope-Cut: keine Forms in Phase 1, kein Verein, keine Anmeldungen, keine Mails, Owner als temporär Verantwortlicher, Domain `movemeet.ch`
- 2026-05-25 — Owner-Anforderung: Name-Minimierung auf genau eine Stelle (`/rechtliches`)
- 2026-05-25 — Owner-Anforderung: Wechsel auf **Cloudflare Pages** wenn besser für EU/Swiss Privacy. Architekt-Analyse bestätigt: für reine Display-Site mit Phase-1-Scope ist Cloudflare marginal besser für Privacy, kommt mit gratis DDoS/WAF und integriertem Registrar
- 2026-05-25 — ADR-0001 (Sharp build-time only) und ADR-0003 (Cloudflare Pages) revidiert
- 2026-05-25 — Owner gibt revidierte ADRs frei ("go")
- 2026-05-25 — Devops-Agent baut Repo-Skelett: package.json mit allen Pinned Deps, tsconfig strict, ESLint 9 Flat Config + next/typescript, Prettier + Tailwind-Plugin, Husky + commitlint, EditorConfig, .nvmrc, .gitignore, .gitattributes, postcss.config.mjs für Tailwind v4, next.config.ts mit Cloudflare-Image-Loader und next-intl Plugin, wrangler.toml, .env.example, vollständige Tokens.css mit Brand-Palette, globals.css mit @theme, app/[locale]/layout.tsx + page.tsx (Hello mit Display-Serif), middleware.ts und i18n/ für DE/EN, messages/{de,en}.json, lib/{server,shared}/ Stubs mit server-only Guard, content/schema/event.ts (Zod), content/events/2026-06-14-hike-seealpsee.json als erstes echtes Beispiel, scripts/{validate-content,process-images}.ts, public/robots.txt, .claude/agents/\*.md für alle 10 Sub-Agents, .github/CODEOWNERS + PR-Template + Issue-Templates, README + CONTRIBUTING + LICENSE (proprietär) + SETUP. 49 Files insgesamt.
- 2026-05-25 — pnpm install im Sandbox geblockt (Windows-Mount-Permissions). Owner führt Install lokal in PowerShell aus per SETUP.md Schritt 3.
- 2026-05-25 — Owner lokal: pnpm install OK (944 Packages, 2m21s), pnpm lint OK. pnpm dev / typecheck / build:cf scheitert an `hasLocale` (next-intl 4-only API, wir haben 3.26), `experimental.typedRoutes` (in 15.5 nach Top-Level gewandert), Top-Level `await` in tsx scripts (CJS-Modus), `engines` zu strikt (Owner hat Node 24).
- 2026-05-25 — Fix-Patch: eigener `isValidLocale` Type-Guard in `i18n/routing.ts` statt `hasLocale`-Import; `typedRoutes` in next.config.ts auf Top-Level verschoben; beide tsx scripts wrappen Top-Level await in async-IIFE; engines auf `>=20.0.0` relaxed; tokens.css/globals.css aufgeräumt (next/font Variablen umbenannt auf `--font-fraunces/inter/jetbrains-mono`, @theme mappt sauber drauf, keine Self-Refs mehr).
- 2026-05-25 — Smoke-Tests alle grün: `pnpm dev` lädt `/en` (200), typecheck/lint/validate:content clean, `next build` generiert 5 prerendered Pages (de + en). `next-on-pages` Post-Process zeigt Windows-Quirk-Warning, Build selbst bleibt valid. CF-spezifische Validierung wird in CI (Sprint 7) auf Linux gemacht.
- 2026-05-25 — Initial Commit auf `main` gepusht (HTTPS Remote, 86 Objekte, 162 KiB). Sprint-0-Gate erreicht. Repo: `https://github.com/AbdulBhatti2001/move-and-meet`
