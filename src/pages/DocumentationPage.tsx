import { Link } from 'react-router';
import {
  componentDocumentation,
  getDocumentationCategoryLabel,
  livingDocumentationPrinciples,
} from '@/documentation/documentation.catalog';

const productContracts = [
  {
    title: 'Aplicaciones públicas',
    description: 'El registro alimenta el catálogo de aplicaciones, las páginas de detalle y las demos públicas.',
    source: 'src/applications/applicationRegistry.ts',
  },
  {
    title: 'Compositor de aplicaciones',
    description: 'Una única configuración persistente recorre Aplicación, Marca, Preset, Funciones, Páginas, Navegación y Revisión.',
    source: 'src/composer/ComposerWizard.tsx',
  },
  {
    title: 'Motor de exportación',
    description: 'Un manifest validado se convierte en un ZIP React/Vite determinista cuya compilación se prueba en CI.',
    source: 'src/export/export.engine.ts',
  },
] as const;

export function DocumentationPage() {
  const shellCount = componentDocumentation.filter((entry) => entry.category === 'Shell').length;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 lg:px-6 lg:py-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">Documentación viva</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">La documentación avanza con el producto.</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            WebBlueprint documenta contratos reutilizables cuando se vuelven reales. Esta página refleja lo que existe hoy, no una lista de promesas sobre código que todavía no se ha construido.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700" to="/components">
              Abrir galería de componentes
            </Link>
            <Link className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" to="/apps">
              Explorar aplicaciones
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Inventario actual</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Documentados" value={componentDocumentation.length} />
            <Metric label="Shells" value={shellCount} />
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">Los conteos se derivan del mismo catálogo de documentación que renderiza la galería de componentes.</p>
        </aside>
      </section>

      <section className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Contratos del producto</p>
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Regla de documentación</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Pequeña, actual y verificable.</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Cada nuevo componente reutilizable se documenta al entrar en el código. El cierre de etapa reconcilia el catálogo con la realidad.</p>
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Componentes documentados</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Inventario reutilizable actual</h2>
          </div>
          <Link className="text-sm font-semibold text-brand-700 hover:text-brand-800" to="/components">Ver ejemplos en vivo →</Link>
        </div>
        <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {componentDocumentation.map((entry) => (
            <Link className="grid gap-2 p-4 transition hover:bg-slate-50 sm:grid-cols-[220px_1fr_auto] sm:items-center" key={entry.id} to={`/components#${entry.id}`}>
              <span className="font-semibold text-slate-900">{entry.name}</span>
              <span className="text-sm text-slate-600">{entry.summary}</span>
              <span className="text-xs font-semibold text-brand-700">{getDocumentationCategoryLabel(entry.category)}</span>
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
