import { AppIcon } from '@/components/AppIcon';
import { PageShell } from '@/shell/PageShell';

const summaryItems = [
  { label: 'Secciones', value: '12', icon: 'layers' as const },
  { label: 'Vistas registradas', value: '96', icon: 'pages' as const },
  { label: 'Tema activo', value: 'Dinámico', icon: 'palette' as const },
  { label: 'Estado', value: 'G1', icon: 'dashboard' as const },
];

export function TemplateOverviewPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: 'Dashboard' }]}
      description="Shell general del Blueprint. Todas las futuras vistas se construirán sobre esta estructura compacta y theme-safe."
      title="WebBlueprint UI"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map((item) => (
          <div key={item.label} className="rounded-md border border-slate-200 bg-white p-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{item.value}</p>
              </div>
              <div className="grid size-8 place-items-center rounded-md bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]">
                <AppIcon className="size-4" name={item.icon} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-[13px] font-semibold text-slate-900">Application Shell</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">Primera superficie visible del nuevo roadmap.</p>
            </div>
            <span className="rounded bg-[var(--theme-primary-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--theme-primary)]">En construcción</span>
          </div>
          <div className="grid gap-2 pt-3 sm:grid-cols-2">
            {[
              ['Topbar', 'Compacta, 48 px y conectada al tema'],
              ['Sidebar', '232 px, denso, colapsable y responsive'],
              ['Router', 'Todas las familias ya son navegables'],
              ['Tema', 'Color primario sin hardcodes de marca'],
            ].map(([title, text]) => (
              <div key={title} className="rounded border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[11px] font-semibold text-slate-800">{title}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="text-[13px] font-semibold text-slate-900">Regla de avance</h2>
          <div className="mt-3 space-y-2">
            {['Construir componente', 'Integrar en la vista', 'CI y revisión', 'Publicar en EliasWorks'].map((step, index) => (
              <div key={step} className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[var(--theme-primary-soft)] text-[9px] font-bold text-[var(--theme-primary)]">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
