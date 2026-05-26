#!/usr/bin/env node
/**
 * scripts/check.mjs — lightweight project health check.
 *
 * Cross-platform Node ESM script. Runs the fast, read-mostly verifications
 * before a commit. Skips the slow Cloudflare build (CI handles that).
 *
 * Tools are invoked via `require.resolve` to find their actual entry points,
 * then spawned through `node` — this works identically on Windows, macOS, and
 * Linux, and through pnpm's symlinked node_modules without PATH gymnastics.
 *
 * Usage:
 *   pnpm check
 *   node scripts/check.mjs
 */

import { readFileSync, existsSync } from 'node:fs';
import { spawnSync, execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
process.chdir(root);
const require = createRequire(import.meta.url);

const isTTY = process.stdout.isTTY;
const C = {
  green: isTTY ? '\x1b[0;32m' : '',
  red: isTTY ? '\x1b[0;31m' : '',
  yellow: isTTY ? '\x1b[0;33m' : '',
  dim: isTTY ? '\x1b[2m' : '',
  reset: isTTY ? '\x1b[0m' : '',
};

let pass = 0;
let fail = 0;
const failedLabels = [];

const pad = (s, n) => (s + ' '.repeat(n)).slice(0, n);

const ok = (label) => {
  console.log(`  ${C.dim}->${C.reset} ${pad(label, 22)} ${C.green}OK${C.reset}`);
  pass++;
};

const bad = (label, detail) => {
  console.log(`  ${C.dim}->${C.reset} ${pad(label, 22)} ${C.red}FAIL${C.reset}`);
  if (detail) {
    console.log(
      detail
        .split('\n')
        .map((l) => '      ' + l)
        .join('\n'),
    );
  }
  fail++;
  failedLabels.push(label);
};

const skip = (label, reason) => {
  console.log(`  ${C.yellow}SKIP${C.reset} ${label}${reason ? ' (' + reason + ')' : ''}`);
};

const safeExec = (cmd) => {
  try {
    return execSync(cmd, { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
};

// ── Repo state ──────────────────────────────────────────────────────────────
console.log('\nRepo state');
console.log(`  branch:    ${safeExec('git branch --show-current') ?? 'unknown'}`);
const statusOut = safeExec('git status --short');
const modCount = statusOut ? statusOut.split('\n').filter(Boolean).length : 0;
console.log(`  modified:  ${modCount} file(s)`);
console.log(`  node:      ${process.version}`);

// ── Required files ──────────────────────────────────────────────────────────
console.log('\nRequired files');
const required = [
  'package.json',
  'pnpm-lock.yaml',
  'tsconfig.json',
  'next.config.ts',
  'wrangler.toml',
  'open-next.config.ts',
  'postcss.config.mjs',
  'eslint.config.mjs',
  'commitlint.config.js',
  'middleware.ts',
  'i18n/routing.ts',
  'i18n/request.ts',
  'messages/de.json',
  'messages/en.json',
  'styles/tokens.css',
  'styles/globals.css',
  'app/[locale]/layout.tsx',
  'app/[locale]/page.tsx',
  'components/ui/index.ts',
  'components/ui/button.tsx',
  'components/ui/container.tsx',
  'components/ui/section-header.tsx',
  'components/sections/index.ts',
  'components/sections/hero.tsx',
  'components/sections/pillars-band.tsx',
  'components/sections/site-header.tsx',
  'components/sections/site-footer.tsx',
  'components/sections/mobile-nav.tsx',
  'components/sections/language-switcher.tsx',
  'components/sections/event-card.tsx',
  'components/sections/event-meta.tsx',
  'components/sections/featured-event.tsx',
  'components/sections/vision-section.tsx',
  'components/sections/founder-card.tsx',
  'components/sections/community-gallery.tsx',
  'components/motion/reveal.tsx',
  'lib/server/events.ts',
  'lib/shared/format-date.ts',
  'app/[locale]/events/page.tsx',
  'app/[locale]/events/[slug]/page.tsx',
  'app/[locale]/about/page.tsx',
  'app/[locale]/community/page.tsx',
  'lib/shared/cn.ts',
  'lib/shared/index.ts',
  'lib/shared/image-loader.ts',
  'lib/server/index.ts',
  'content/schema/event.ts',
  'scripts/validate-content.ts',
  'scripts/process-images.ts',
  'scripts/check.mjs',
  'docs/adr/0001-tech-stack.md',
  'docs/adr/0002-repo-structure.md',
  'docs/adr/0003-hosting-and-deployment.md',
  'docs/design-system.md',
  'PROJECT_BRIEF.md',
  'README.md',
  'CONTRIBUTING.md',
  'LICENSE.md',
  'SETUP.md',
  '.github/CODEOWNERS',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.husky/pre-commit',
  '.husky/commit-msg',
  '.claude/agents/README.md',
];
const missing = required.filter((f) => !existsSync(f));
if (missing.length === 0) {
  ok(`required files (${required.length})`);
} else {
  bad('required files', missing.map((m) => 'MISSING: ' + m).join('\n'));
}

// ── Phase-1 scope guard ─────────────────────────────────────────────────────
console.log('\nPhase-1 scope guard');
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
const forbidden = [
  'resend',
  'react-email',
  'react-hook-form',
  '@marsidev/react-turnstile',
  '@cloudflare/next-on-pages',
];
const violations = forbidden.filter((p) => p in allDeps);
if (violations.length === 0) {
  ok('no forbidden Phase-1 deps');
} else {
  bad('phase-1 scope', violations.map((v) => 'FORBIDDEN: ' + v).join('\n'));
}

// ── Translation parity ──────────────────────────────────────────────────────
console.log('\nTranslation parity');
try {
  const de = JSON.parse(readFileSync('messages/de.json', 'utf-8'));
  const en = JSON.parse(readFileSync('messages/en.json', 'utf-8'));
  const collect = (obj, prefix = '') =>
    Object.entries(obj).flatMap(([k, v]) =>
      typeof v === 'object' && v !== null ? collect(v, prefix + k + '.') : [prefix + k],
    );
  const dk = new Set(collect(de));
  const ek = new Set(collect(en));
  const onlyDe = [...dk].filter((k) => !ek.has(k));
  const onlyEn = [...ek].filter((k) => !dk.has(k));
  if (onlyDe.length || onlyEn.length) {
    const detail = [
      onlyDe.length ? 'Only in DE: ' + onlyDe.join(', ') : null,
      onlyEn.length ? 'Only in EN: ' + onlyEn.join(', ') : null,
    ]
      .filter(Boolean)
      .join('\n');
    bad('translation parity', detail);
  } else {
    ok(`parity (${dk.size} keys in both locales)`);
  }
} catch (err) {
  bad('translation parity', err.message);
}

// ── Code checks via require.resolve + spawn ─────────────────────────────────
console.log('\nCode');
if (!existsSync('node_modules')) {
  skip('all code checks', 'no node_modules; run pnpm install first');
} else {
  const runNodeTool = (label, modulePath, args) => {
    let entry;
    try {
      entry = require.resolve(modulePath);
    } catch (err) {
      skip(label, `${modulePath} not resolvable (${err.code ?? 'unknown'})`);
      return;
    }
    const result = spawnSync(process.execPath, [entry, ...args], { encoding: 'utf-8' });
    if (result.status === 0) {
      ok(label);
    } else {
      const out = (result.stdout + result.stderr).trim();
      bad(label, out.length > 2000 ? out.slice(0, 2000) + '\n... (truncated)' : out);
    }
  };

  runNodeTool('typecheck', 'typescript/bin/tsc', ['--noEmit']);
  runNodeTool('lint', 'next/dist/bin/next', ['lint', '--no-cache']);
  // tsx 4.x exposes `.` in its package exports map; resolve via package name.
  runNodeTool('validate:content', 'tsx', ['scripts/validate-content.ts']);
}

// ── Summary ─────────────────────────────────────────────────────────────────
console.log('\n-----------------------------------------');
if (fail === 0) {
  console.log(`${C.green}All ${pass} checks passed${C.reset}`);
  process.exit(0);
} else {
  console.log(`${C.red}${fail} check(s) failed:${C.reset}`);
  for (const f of failedLabels) console.log(`  - ${f}`);
  console.log(`${C.dim}(${pass} passed)${C.reset}`);
  process.exit(1);
}
