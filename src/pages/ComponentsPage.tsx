import { applicationRegistry } from '@/applications/applicationRegistry';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { ApplicationPreview } from '@/components/applications/ApplicationPreview';
import {
  componentDocumentation,
  getMaturityLabel,
} from '@/documentation/documentation.catalog';
import { leftMenuVariants } from '@/shell/shell.types';

export function ComponentsPage() {
  const sampleApplication = applicationRegistry[0];

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 lg:px-6 lg:py-10">
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">Galería de componentes</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">Componentes reales, documentados donde viven.</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          La galería comienza con las piezas reutilizables que ya alimentan WebBlueprint. Los ejemplos en vivo usan datos del registro real, no fixtures paralelos.
        </p>
      </section>

      {sampleApplication ? (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Ejemplos en vivo</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Presentación de aplicaciones</h2>
            </div>
            <p className="text-xs text-slate-500">Datos fuente: applicationRegistry / {sampleApplication.name}</p>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:p-5">
              <ApplicationCard application={sampleApplication} />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:p-5">
              <ApplicationPreview application={sampleApplication} />
              <div className="mt-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                <p className="text-xs font-semibold text-slate-700">Variante compacta</p>
                <div className="mt-2"><ApplicationPreview application={sampleApplication} compact /></div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600">Variantes gobernadas</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Shells de navegación izquierda</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {leftMenuVariants.map((variant) => <ShellVariantPreview key={variant} variant={variant} />)}
        </div>
      </section>

      <section className="mt-10 space-y-5">
        {componentDocumentation.map((entry) => (
          <article className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" id={entry.id} key={entry.id}>
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold tracking-tight text-slate-900">{entry.name}</h2>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">{getMaturityLabel(entry.maturity)}</span>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{entry.summary}</p>
              </div>
              <p className="break-all font-mono text-[11px] text-slate-400">{entry.sourcePath}</p>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Propiedades</h3>
                {entry.props.length > 0 ? (
                  <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-[720px] w-full border-collapse text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr><th className="px-3 py-2.5 font-semibold">Prop</th><th className="px-3 py-2.5 font-semibold">Tipo</th><th className="px-3 py-2.5 font-semibold">Obligatoria</th><th className="px-3 py-2.5 font-semibold">Descripción</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {entry.props.map((prop) => (
                          <tr key={prop.name}>
                            <td className="px-3 py-3 align-top font-mono font-semibold text-slate-800">{prop.name}</td>
                            <td className="px-3 py-3 align-top font-mono text-brand-700">{prop.type}{prop.defaultValue ? ` · ${prop.defaultValue}` : ''}</td>
                            <td className="px-3 py-3 align-top text-slate-600">{prop.required ? 'sí' : 'no'}</td>
                            <td className="px-3 py-3 align-top leading-5 text-slate-600">{prop.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">No tiene props públicas. Este componente se usa como layout del router.</p>}
              </div>

              <div className="space-y-4">
                <SpecList label="Variantes" values={entry.variants} />
                <SpecList label="Estados" values={entry.states} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">Uso</p>
                  <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-950 p-3 text-[11px] leading-5 text-slate-200"><code>{entry.example}</code></pre>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function SpecList({ label, values }: { label: string; values: readonly string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {values.map((value) => <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600" key={value}>{value}</span>)}
      </div>
    </div>
  );
}

function ShellVariantPreview({ variant }: { variant: (typeof leftMenuVariants)[number] }) {
  const dark = variant === 'vertical-dark-menu';
  const collapsible = variant === 'collapsible-menu';

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid min-h-48 grid-cols-[76px_1fr]">
        <aside className={`p-3 ${dark ? 'bg-slate-900' : 'bg-white'} border-r ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="size-8 rounded-lg bg-brand-600" />
          <div className="mt-4 grid gap-2">
            {[0, 1, 2, 3].map((item) => <div className={`h-6 rounded-md ${item === 0 ? 'bg-brand-100' : dark ? 'bg-white/10' : 'bg-slate-100'}`} key={item} />)}
          </div>
        </aside>
        <div className="bg-slate-50 p-3">
          <div className="h-7 rounded-lg border border-slate-200 bg-white" />
          <div className="mt-3 grid grid-cols-2 gap-2"><div className="h-14 rounded-lg bg-white ring-1 ring-slate-200" /><div className="h-14 rounded-lg bg-white ring-1 ring-slate-200" /></div>
          <div className="mt-2 h-16 rounded-lg bg-white ring-1 ring-slate-200" />
        </div>
      </div>
      <div className="border-t border-slate-100 p-3">
        <p className="font-mono text-xs font-semibold text-slate-700">{variant}</p>
        <p className="mt-1 text-[11px] text-slate-500">{collapsible ? 'Contracción en escritorio + drawer móvil' : dark ? 'Superficie oscura persistente en escritorio + drawer móvil' : 'Superficie clara persistente en escritorio + drawer móvil'}</p>
      </div>
    </article>
  );
}
