import { Link } from 'react-router';
import { componentDocumentation, livingDocumentationPrinciples } from '@/documentation/documentation.catalog';

const productContracts = [
  {
    title: 'Public applications',
    description: 'The registry powers the application catalog, detail pages and public demos.',
    source: 'src/applications/applicationRegistry.ts',
  },
  {
    title: 'App Composer',
    description: 'One persistent configuration flows through Application, Branding, Preset, Features, Pages, Navigation and Review.',
    source: 'src/composer/ComposerWizard.tsx',
  },
  {
    title: 'Export Engine v0',
    description: 'A validated manifest becomes a deterministic React/Vite ZIP that is build-tested in CI.',
    source: 'src/export/export.engine.ts',
  },
] as const;

export function DocumentationPage() {
  const shellCount = componentDocumentation.filter((entry) => entry.category === 'Shell').length;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 lg:px-6 lg:py-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">Living documentation</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">Documentation follows the product.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            WebBlueprint documents reusable contracts as they become real. This page is the public map of what exists today, not a promise list for code that has not been built.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700" to="/components">
              Open component gallery
            </Link>
            <Link className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" to="/apps">
              Browse applications
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Current inventory</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Documented" value={componentDocumentation.length} />
            <Metric label="Shells" value={shellCount} />
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Inventory counts are derived from the same documentation catalog rendered by the component gallery.</p>
        </aside>
      </section>

      <section className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Product contracts</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {productContracts.map((contract) => (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={contract.title}>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">{contract.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{contract.description}</p>
              <p className="mt-4 break-all font-mono text-[11px] text-slate-400">{contract.source}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Documentation rule</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Small, current and verifiable.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">A new reusable component earns documentation when it enters the codebase. Stage closure reconciles the catalog with reality.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {livingDocumentationPrinciples.map((principle, index) => (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm" key={principle}>
              <span className="text-[10px] font-semibold text-brand-600">{String(index + 1).padStart(2, '0')}</span>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700">{principle}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Documented components</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Current reusable inventory</h2>
          </div>
          <Link className="text-sm font-semibold text-brand-700 hover:text-brand-800" to="/components">See live examples →</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {componentDocumentation.map((entry) => (
            <Link className="grid gap-2 p-4 transition hover:bg-slate-50 sm:grid-cols-[220px_1fr_auto] sm:items-center" key={entry.id} to={`/components#${entry.id}`}>
              <span className="font-semibold text-slate-900">{entry.name}</span>
              <span className="text-sm text-slate-600">{entry.summary}</span>
              <span className="text-xs font-semibold text-brand-700">{entry.category}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
    </div>
  );
}
