# Design System

Move & Meet's tokens, primitives, and composition rules. This document is the contract between brand intent and what ships.

Live reference: `/de/style-guide` or `/en/style-guide` in development. The route is gated to `NODE_ENV !== 'production'` and carries `robots: noindex, nofollow` headers.

## Tokens

Tokens are declared in `styles/tokens.css` and exposed to Tailwind v4 via the `@theme` directive. Use the generated utility classes; never inline raw hex.

### Color

| Token        | Hex       | Tailwind          | Intended use                          |
| ------------ | --------- | ----------------- | ------------------------------------- |
| `olive-900`  | `#2B2D17` | `bg-olive-900`    | Deep brand surface, footers, overlays |
| `olive-800`  | `#3F4124` | `bg-olive-800`    | Primary background (body)             |
| `olive-700`  | `#4A4D2E` | `bg-olive-700`    | Elevated surface (cards, panels)      |
| `olive-600`  | `#5C6038` | `bg-olive-600`    | Hover/active surface                  |
| `cream-50`   | `#F7F3E8` | `bg-cream-50`     | Brightest text/surface                |
| `cream-100`  | `#F2EDE0` | `text-cream-100`  | Primary text on olive                 |
| `cream-200`  | `#E6DEC8` | `bg-cream-200`    | Muted cream variant                   |
| `bronze-400` | `#B8A77A` | `text-bronze-400` | Accent, linework, eyebrow tags        |
| `ink-950`    | `#0D0D0B` | `bg-ink-950`      | Hero overlay, deepest contrast        |
| `success`    | `#6B8E4E` | `text-success`    | Success state                         |
| `warning`    | `#C9A24B` | `text-warning`    | Warning state                         |
| `error`      | `#B65454` | `text-error`      | Error state                           |

Opacity modifiers via Tailwind: `text-cream-100/70`, `bg-cream-100/10`, etc. Prefer these over introducing new tokens.

### Typography

Three font stacks, loaded via `next/font/google` in `app/[locale]/layout.tsx`. The loader-generated CSS variables (`--font-fraunces`, `--font-inter`, `--font-jetbrains-mono`) are mapped to brand tokens in `tokens.css`.

| Token          | Family                    | Tailwind       | Use                        |
| -------------- | ------------------------- | -------------- | -------------------------- |
| `font-display` | Fraunces (variable)       | `font-display` | Headlines, section titles  |
| `font-body`    | Inter (variable)          | `font-body`    | Default body, UI           |
| `font-mono`    | JetBrains Mono (variable) | `font-mono`    | Code in docs, technical UI |

Scale (Tailwind defaults are kept; project preference is responsive sizing via breakpoint utilities, e.g. `text-4xl sm:text-5xl md:text-6xl`).

### Motion

| Token                | Value                            | Use                                        |
| -------------------- | -------------------------------- | ------------------------------------------ |
| `--ease-brand`       | `cubic-bezier(0.22, 1, 0.36, 1)` | Default easing for reveals and transitions |
| `--duration-base`    | `600ms`                          | Standard scroll-reveal duration            |
| `--duration-hover`   | `200ms`                          | Hover state transitions                    |
| `--duration-stagger` | `80ms`                           | Stagger between list items                 |
| `--duration-max`     | `1200ms`                         | Hard upper bound for any motion            |

All motion respects `prefers-reduced-motion: reduce` via the global override in `styles/globals.css`. Component-level animations must additionally check the preference where relevant.

## Layout

- **Baseline grid**: 8px. Tailwind spacing scale uses `--spacing: 0.5rem` so `p-4 = 32px`, `gap-2 = 16px`, etc.
- **Container max-widths**: configured by the `Container` primitive's `size` prop (sm 768, md 1024, lg 1152, xl 1280, full unbounded).
- **Section padding-Y**: `clamp(80px, 12vw, 160px)` is the brand-default vertical rhythm for marketing sections (`py-20 sm:py-24 md:py-32` or inline `clamp`).
- **Breakpoints**: Tailwind defaults (sm 640, md 768, lg 1024, xl 1280, 2xl 1536). Mobile-first.

## Primitives

Server-component-safe React primitives live under `components/ui/`. Import from the barrel:

```tsx
import { Button, Container, SectionHeader } from '@/components/ui';
```

### Container

Horizontal layout primitive. Centres content, applies consistent padding, caps max-width.

```tsx
<Container as="main" size="lg" className="py-24">
  …
</Container>
```

| Prop        | Type                                     | Default | Notes                                                  |
| ----------- | ---------------------------------------- | ------- | ------------------------------------------------------ |
| `as`        | `ElementType`                            | `'div'` | Render as any HTML tag (`section`, `main`, `article`…) |
| `size`      | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'xl'`  | Max-width preset                                       |
| `className` | `string`                                 | —       | Merged via `cn()`                                      |
| `children`  | `ReactNode`                              | —       | required                                               |

### Button

Single brand-styled button primitive. Three variants, three sizes. Server-safe.

```tsx
<Button variant="primary" size="lg">Join Community</Button>
<Button variant="secondary">Upcoming Events</Button>
<Button variant="ghost">Read more</Button>
```

| Prop                    | Type                                  | Default     | Notes                               |
| ----------------------- | ------------------------------------- | ----------- | ----------------------------------- |
| `variant`               | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Maps to brand surface               |
| `size`                  | `'sm' \| 'md' \| 'lg'`                | `'md'`      | Standard form-control sizes         |
| All `button` HTML attrs | —                                     | —           | Forwarded to the underlying element |

When the click needs interactivity, the **parent** component is `"use client"`; Button itself stays a server component.

### SectionHeader

Composed page/section heading: eyebrow + title + subtitle.

```tsx
<SectionHeader
  eyebrow="Movement · Connection · Sisterhood"
  title="Move & Meet"
  subtitle="A Swiss community for women who run, hike, and grow together."
  align="center"
  level={1}
/>
```

| Prop       | Type                 | Default  | Notes                                           |
| ---------- | -------------------- | -------- | ----------------------------------------------- |
| `eyebrow`  | `string`             | optional | Renders as small bronze uppercase tag           |
| `title`    | `ReactNode`          | required | Renders inside `<h1>`/`<h2>`/`<h3>` per `level` |
| `subtitle` | `ReactNode`          | optional | Body text under the title                       |
| `align`    | `'left' \| 'center'` | `'left'` | Horizontal alignment                            |
| `level`    | `1 \| 2 \| 3`        | `2`      | Heading semantic + size scale                   |

## Composition rules

- One `h1` per page, always via `SectionHeader level={1}` so the styling is consistent.
- Sections compose: `<Container><SectionHeader …/> <content /></Container>`. Never nest Containers.
- `cn()` (from `@/lib/shared`) is the only sanctioned way to merge Tailwind classes; it deduplicates via `tailwind-merge`.
- No inline styles. No raw hex. No new fonts. If something doesn't fit a token, the design-system agent adds the token first.

## Adding a new primitive

1. Drop the component at `components/ui/<kebab-name>.tsx`. PascalCase export.
2. Server-component-safe by default; add `"use client"` only if the component itself owns interactive state.
3. Export from `components/ui/index.ts`.
4. Add an entry to the `/style-guide` route under an appropriate section.
5. Add a row to the "Primitives" section of this doc with the prop table.
6. Open a PR; no merge without the style-guide visual showing the new state and a dark + reduced-motion check.
