# Setup — One-Time Post-Clone Steps

Diese Datei beschreibt die einmaligen Schritte, um Move & Meet lokal lauffähig zu machen und den ersten Commit zu erzeugen. Nach diesem Setup arbeitet jeder Entwickler nur noch mit den Standard-Scripts aus dem README.

Alle Befehle laufen aus dem Repo-Root (`C:\Projects\move&meet\move-and-meet`) in einer Windows-PowerShell oder einem Terminal deiner Wahl.

## 1. Node 22 sicherstellen

```powershell
node --version
```

Sollte `v22.x.x` oder höher zeigen. Wenn du eine ältere Version hast, installiere Node 22 LTS von <https://nodejs.org/> oder via `nvm-windows`:

```powershell
nvm install 22
nvm use 22
```

Die Datei `.nvmrc` im Repo pinnt die Version für Tools die das lesen. Node 22 ist Pflicht weil Wrangler 4 und `@opennextjs/cloudflare` es voraussetzen.

## 2. pnpm installieren

```powershell
npm install -g pnpm@9
pnpm --version
```

Sollte `9.x` zeigen.

## 3. Abhängigkeiten installieren

```powershell
pnpm install
```

Beim ersten Lauf werden ca. 600 MB nach `node_modules/` heruntergeladen, das dauert ein paar Minuten. Husky-Hooks werden durch das `prepare`-Script automatisch eingerichtet.

## 4. Smoke-Tests

```powershell
pnpm dev
```

Öffne <http://localhost:3000>. Du solltest auf `/de` weitergeleitet werden und die "Move & Meet"-Hello-Page sehen.

Mit `Ctrl+C` beenden, dann:

```powershell
pnpm typecheck
pnpm lint
pnpm validate:content
pnpm build:cf
```

Alle vier sollten ohne Fehler durchlaufen. Falls etwas hängt, melden, ich diagnostiziere.

## 5. Git-Author für anonyme Commits konfigurieren

Per **Name-Minimierung-Anforderung** soll dein Klarname nicht in der Commit-History des öffentlichen Repos auftauchen. Wir setzen den Author **nur für dieses Repo** auf einen generischen Identifier:

```powershell
git config user.name "Move & Meet"
git config user.email "noreply@movemeet.ch"
```

Das `--local` Default überschreibt deine globale Git-Identität nur in diesem Repo. Andere Repos auf deinem Rechner bleiben unverändert.

Verifizieren:

```powershell
git config user.name
git config user.email
```

## 6. Erster Commit + Push

```powershell
git add .
git status
```

Schau über die Liste der gestagten Files. Wenn alles passt:

```powershell
git commit -m "chore: initial scaffold

- ADRs 0001-0003 (Tech Stack, Repo Structure, Hosting)
- PROJECT_BRIEF.md and supporting docs (CONTRIBUTING, LICENSE, README, SETUP)
- Next.js 15 App Router with TypeScript strict, Tailwind v4, next-intl DE/EN
- Cloudflare Pages config (wrangler.toml, custom image loader)
- Husky + commitlint enforcing Conventional Commits
- Sub-agent definitions under .claude/agents/
- Build-time content validation pipeline (Zod schemas)
- Example event content (Hike Seealpsee 2026-06-14)"
```

Dann pushen:

```powershell
git push -u origin main
```

Wenn `git push` einen SSH-Key-Fehler wirft, hast du noch keinen SSH-Key bei GitHub hinterlegt. Anleitung: <https://docs.github.com/en/authentication/connecting-to-github-with-ssh>.

Alternative HTTPS-URL (falls SSH nicht eingerichtet):

```powershell
git remote set-url origin https://github.com/AbdulBhatti2001/move-and-meet.git
git push -u origin main
```

GitHub fragt dann nach deinem Benutzernamen und einem Personal Access Token (nicht das Passwort).

## 7. Branch Protection aktivieren (manuell auf GitHub)

Bis der CI-Pipeline-Sprint kommt (Sprint 7), aktiviere manuell unter **Settings → Branches → Branch protection rules** für `main`:

- ✓ Require a pull request before merging
- ✓ Require linear history (forciert Squash-Merge)
- ✓ Do not allow bypassing the above settings
- (Status checks aktivieren wir in Sprint 7 sobald die Workflows da sind)

Damit ist der lokale + remote Setup fertig. Ab hier laufen alle weiteren Sprints über die Standard-Scripts.

## Wiederkehrende Befehle (für später)

| Command                 | Zweck                                  |
| ----------------------- | -------------------------------------- |
| `pnpm dev`              | Lokaler Dev-Server mit HMR             |
| `pnpm typecheck`        | TypeScript Strict Check                |
| `pnpm lint`             | ESLint                                 |
| `pnpm format`           | Prettier Write                         |
| `pnpm validate:content` | Event-JSON gegen Zod-Schema validieren |
| `pnpm build:cf`         | Cloudflare Pages Build                 |
| `pnpm preview:cf`       | Lokale Vorschau des CF-Builds          |
| `pnpm test`             | Vitest Unit-Tests                      |
| `pnpm test:e2e`         | Playwright E2E                         |
