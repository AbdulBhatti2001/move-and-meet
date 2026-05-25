#!/usr/bin/env bash
# scripts/check.sh — lightweight project health check.
# Runs the fast, read-mostly verifications before a commit. Skips the
# slow Cloudflare build (CI / local `pnpm build:cf` handles that).
# Works in the orchestrator sandbox, Git Bash on Windows, WSL, Linux, macOS.
# Tools are invoked via node_modules/.bin so pnpm in PATH is not required.

set -u
cd "$(dirname "$0")/.."

if [ -t 1 ]; then
  GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[0;33m'; DIM='\033[2m'; NC='\033[0m'
else
  GREEN=''; RED=''; YELLOW=''; DIM=''; NC=''
fi

PASS=0
FAIL=0
FAILED=()
OUT="${TMPDIR:-/tmp}/mm-check.out"

find_bin() {
  for c in "node_modules/.bin/$1" "node_modules/.bin/$1.cmd" "node_modules/.bin/$1.CMD"; do
    [ -f "$c" ] && { echo "$c"; return 0; }
  done
  return 1
}

run() {
  local label="$1"; shift
  printf "  ${DIM}->${NC} %-22s" "$label"
  if "$@" > "$OUT" 2>&1; then
    printf "${GREEN}OK${NC}\n"; PASS=$((PASS+1))
  else
    printf "${RED}FAIL${NC}\n"
    sed 's/^/      /' "$OUT"
    FAIL=$((FAIL+1)); FAILED+=("$label")
  fi
}

echo
echo "Repo state"
echo "  branch:    $(git branch --show-current 2>/dev/null || echo unknown)"
echo "  modified:  $(git status --short 2>/dev/null | wc -l | tr -d ' ') file(s)"
echo "  node:      $(node --version 2>/dev/null || echo missing)"

echo
echo "Required files"
required=(
  package.json pnpm-lock.yaml tsconfig.json next.config.ts wrangler.toml
  open-next.config.ts postcss.config.mjs eslint.config.mjs commitlint.config.js
  middleware.ts
  i18n/routing.ts i18n/request.ts
  messages/de.json messages/en.json
  styles/tokens.css styles/globals.css
  "app/[locale]/layout.tsx" "app/[locale]/page.tsx"
  components/ui/index.ts components/ui/button.tsx components/ui/container.tsx components/ui/section-header.tsx
  lib/shared/cn.ts lib/shared/index.ts lib/shared/image-loader.ts lib/server/index.ts
  content/schema/event.ts
  scripts/validate-content.ts scripts/process-images.ts
  docs/adr/0001-tech-stack.md docs/adr/0002-repo-structure.md docs/adr/0003-hosting-and-deployment.md
  docs/design-system.md
  PROJECT_BRIEF.md README.md CONTRIBUTING.md LICENSE.md SETUP.md
  .github/CODEOWNERS .github/PULL_REQUEST_TEMPLATE.md
  .husky/pre-commit .husky/commit-msg
  .claude/agents/README.md
)
missing=0
for f in "${required[@]}"; do
  [ -f "$f" ] || { printf "  ${RED}MISSING${NC} %s\n" "$f"; missing=$((missing+1)); }
done
if [ $missing -eq 0 ]; then
  printf "  ${GREEN}OK${NC} (%d files)\n" "${#required[@]}"; PASS=$((PASS+1))
else
  printf "  ${RED}FAIL${NC} (%d missing)\n" "$missing"
  FAIL=$((FAIL+1)); FAILED+=("required files")
fi

echo
echo "Phase-1 scope guard"
forbidden=(resend react-email react-hook-form @marsidev/react-turnstile @cloudflare/next-on-pages)
viol=0
for p in "${forbidden[@]}"; do
  if grep -q "\"$p\":" package.json; then
    printf "  ${RED}FAIL${NC} %s in package.json\n" "$p"; viol=$((viol+1))
  fi
done
if [ $viol -eq 0 ]; then
  printf "  ${GREEN}OK${NC} (no forbidden Phase-1 deps)\n"; PASS=$((PASS+1))
else
  FAIL=$((FAIL+1)); FAILED+=("phase-1 scope")
fi

echo
echo "Translation parity"
PARITY=$(node --input-type=module -e "
import { readFileSync } from 'node:fs';
const de = JSON.parse(readFileSync('messages/de.json', 'utf-8'));
const en = JSON.parse(readFileSync('messages/en.json', 'utf-8'));
const keys = (o, p='') => Object.entries(o).flatMap(([k,v]) =>
  typeof v === 'object' && v !== null ? keys(v, p+k+'.') : [p+k]);
const dk = new Set(keys(de)), ek = new Set(keys(en));
const od = [...dk].filter(k => !ek.has(k));
const oe = [...ek].filter(k => !dk.has(k));
if (od.length || oe.length) {
  if (od.length) console.log('Only in DE: ' + od.join(', '));
  if (oe.length) console.log('Only in EN: ' + oe.join(', '));
  process.exit(1);
}
console.log(dk.size + ' keys in both locales');
" 2>&1)
if [ $? -eq 0 ]; then
  printf "  ${GREEN}OK${NC} %s\n" "$PARITY"; PASS=$((PASS+1))
else
  printf "  ${RED}FAIL${NC}\n"; echo "$PARITY" | sed 's/^/    /'
  FAIL=$((FAIL+1)); FAILED+=("translation parity")
fi

echo
echo "Code"
if [ ! -d node_modules ]; then
  printf "  ${YELLOW}SKIP${NC} (no node_modules; run pnpm install first)\n"
elif ! ls node_modules/typescript >/dev/null 2>&1; then
  printf "  ${YELLOW}SKIP${NC} (pnpm symlinks unreadable from this environment; run locally for full check)\n"
else
  TSC=$(find_bin tsc || true)
  NEXT=$(find_bin next || true)
  TSX=$(find_bin tsx || true)
  if [ -n "$TSC" ]; then run "typecheck" sh "$TSC" --noEmit; else printf "  ${YELLOW}SKIP${NC} typecheck\n"; fi
  if [ -n "$NEXT" ]; then run "lint" sh "$NEXT" lint --no-cache; else printf "  ${YELLOW}SKIP${NC} lint\n"; fi
  if [ -n "$TSX" ]; then run "validate:content" sh "$TSX" scripts/validate-content.ts; else printf "  ${YELLOW}SKIP${NC} validate:content\n"; fi
fi

echo
echo "-----------------------------------------"
if [ $FAIL -eq 0 ]; then
  printf "${GREEN}All %d checks passed${NC}\n" "$PASS"
  rm -f "$OUT"; exit 0
else
  printf "${RED}%d check(s) failed:${NC}\n" "$FAIL"
  for c in "${FAILED[@]}"; do echo "  - $c"; done
  printf "${DIM}(%d passed)${NC}\n" "$PASS"
  rm -f "$OUT"; exit 1
fi
