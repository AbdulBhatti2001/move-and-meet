import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { Button, Container, SectionHeader } from '@/components/ui';

type Params = Promise<{ locale: string }>;

/**
 * Internal design-system reference. Visible only in development.
 * In production a 404 is returned (Cloudflare Pages serves no payload).
 */
export default async function StyleGuidePage({ params }: { params: Params }) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container as="main" size="xl">
      <div className="space-y-24 py-16">
        <SectionHeader
          eyebrow="Internal"
          title="Style Guide"
          subtitle="Tokens, primitives, and composition examples. Dev-only, not exposed in production."
        />

        <section className="space-y-8" aria-labelledby="sg-colors">
          <SectionHeader level={3} title={<span id="sg-colors">Color Tokens</span>} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {COLOR_TOKENS.map((token) => (
              <ColorSwatch key={token.name} {...token} />
            ))}
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="sg-type">
          <SectionHeader level={3} title={<span id="sg-type">Typography</span>} />
          <div className="space-y-6">
            <TypeRow label="display 7xl" className="font-display text-7xl" sample="Move & Meet" />
            <TypeRow
              label="display 5xl"
              className="font-display text-5xl"
              sample="Movement begins"
            />
            <TypeRow
              label="body lg"
              className="font-body text-lg"
              sample="The quick brown fox jumps over the lazy dog."
            />
            <TypeRow
              label="body base"
              className="font-body text-base"
              sample="The quick brown fox jumps over the lazy dog."
            />
            <TypeRow
              label="body sm"
              className="font-body text-sm"
              sample="The quick brown fox jumps over the lazy dog."
            />
            <TypeRow
              label="eyebrow"
              className="text-bronze-400 text-xs tracking-[0.3em] uppercase"
              sample="Movement · Connection"
            />
            <TypeRow
              label="mono"
              className="font-mono text-sm"
              sample="const tagline = 'Movement · Connection · Sisterhood';"
            />
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="sg-buttons">
          <SectionHeader level={3} title={<span id="sg-buttons">Buttons</span>} />
          <div className="space-y-6">
            <SwatchRow label="variants">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </SwatchRow>
            <SwatchRow label="sizes">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </SwatchRow>
            <SwatchRow label="states">
              <Button disabled>Disabled</Button>
            </SwatchRow>
          </div>
        </section>

        <section className="space-y-8" aria-labelledby="sg-headers">
          <SectionHeader level={3} title={<span id="sg-headers">Section Header</span>} />
          <div className="space-y-12">
            <SectionHeader
              eyebrow="Eyebrow text"
              title="Headline goes here"
              subtitle="Optional subtitle gives the section context without competing for attention."
            />
            <SectionHeader
              title="Centered example"
              subtitle="Without eyebrow, centered alignment."
              align="center"
            />
            <SectionHeader level={3} title="Level 3 sub-heading" />
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="sg-containers">
          <SectionHeader level={3} title={<span id="sg-containers">Container Sizes</span>} />
          <div className="space-y-2 text-sm">
            {CONTAINER_SIZES.map((size) => (
              <div key={size} className="rounded-md bg-olive-700/40 p-3">
                <p className="text-cream-100/60 font-mono text-xs">
                  size=&quot;{size}&quot; ({SIZE_PX[size]})
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Container>
  );
}

const COLOR_TOKENS = [
  { name: 'olive-900', value: '#2B2D17', cls: 'bg-olive-900' },
  { name: 'olive-800', value: '#3F4124', cls: 'bg-olive-800' },
  { name: 'olive-700', value: '#4A4D2E', cls: 'bg-olive-700' },
  { name: 'olive-600', value: '#5C6038', cls: 'bg-olive-600' },
  { name: 'cream-50', value: '#F7F3E8', cls: 'bg-cream-50' },
  { name: 'cream-100', value: '#F2EDE0', cls: 'bg-cream-100' },
  { name: 'cream-200', value: '#E6DEC8', cls: 'bg-cream-200' },
  { name: 'bronze-400', value: '#B8A77A', cls: 'bg-bronze-400' },
  { name: 'ink-950', value: '#0D0D0B', cls: 'bg-ink-950' },
  { name: 'success', value: '#6B8E4E', cls: 'bg-success' },
  { name: 'warning', value: '#C9A24B', cls: 'bg-warning' },
  { name: 'error', value: '#B65454', cls: 'bg-error' },
] as const;

const CONTAINER_SIZES = ['sm', 'md', 'lg', 'xl', 'full'] as const;
const SIZE_PX: Record<(typeof CONTAINER_SIZES)[number], string> = {
  sm: '768px',
  md: '1024px',
  lg: '1152px',
  xl: '1280px',
  full: 'no limit',
};

function ColorSwatch({ name, value, cls }: { name: string; value: string; cls: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${cls} border-cream-100/10 h-14 w-14 rounded-md border`} aria-hidden />
      <div className="font-mono text-xs">
        <p className="text-cream-100">{name}</p>
        <p className="text-cream-100/50">{value}</p>
      </div>
    </div>
  );
}

function TypeRow({
  label,
  className,
  sample,
}: {
  label: string;
  className: string;
  sample: string;
}) {
  return (
    <div className="border-cream-100/10 flex items-baseline gap-6 border-b pb-4">
      <span className="text-cream-100/40 w-32 shrink-0 font-mono text-xs">{label}</span>
      <span className={className}>{sample}</span>
    </div>
  );
}

function SwatchRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-cream-100/10 flex flex-wrap items-center gap-4 border-b pb-6">
      <span className="text-cream-100/40 w-32 shrink-0 font-mono text-xs">{label}</span>
      {children}
    </div>
  );
}
