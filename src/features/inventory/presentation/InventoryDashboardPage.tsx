import { MetricCard } from '@/components/data-display/MetricCard';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { InventoryDemoProvider } from '../application/inventory.contracts';

export function InventoryDashboardPage({ provider }: { provider: InventoryDemoProvider }) {
  const dashboard = provider.getDashboard();

  return <PageShell breadcrumbs={dashboard.breadcrumbs.map((label) => ({ label }))} description={dashboard.description} title={dashboard.title}>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-inventory-metrics>
      {dashboard.metrics.map((metric) => <MetricCard icon={metric.icon} key={metric.id} label={metric.label} note={metric.note} tone={metric.tone} value={String(metric.value)} />)}
    </div>

    <div className="mt-6">
      <SurfaceCard>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-600">Cola operacional</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">{dashboard.attentionTitle}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{dashboard.attentionDescription}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{dashboard.queue.length} acciones</span>
        </div>

        <div className="mt-5 overflow-x-auto" data-inventory-queue>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead><tr className="border-b border-slate-200 text-xs text-slate-400"><th className="pb-3 font-medium">ID</th><th className="pb-3 font-medium">Dispositivo</th><th className="pb-3 font-medium">Contexto</th><th className="pb-3 font-medium">Estado</th><th className="pb-3 font-medium">Prioridad</th><th className="pb-3 text-right font-medium">Próxima acción</th></tr></thead>
            <tbody>
              {dashboard.queue.map((item) => <tr className="border-b border-slate-100 last:border-0" key={item.id}>
                <td className="py-3 font-mono text-xs font-semibold text-slate-500">{item.id}</td>
                <td className="py-3 font-medium text-slate-900">{item.deviceLabel}</td>
                <td className="py-3 text-slate-500">{item.context}</td>
                <td className="py-3"><StatusBadge label={item.status} tone={item.statusTone} /></td>
                <td className="py-3 text-slate-600">{item.priority}</td>
                <td className="py-3 text-right font-semibold text-brand-600">{item.actionLabel}</td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </SurfaceCard>
    </div>
  </PageShell>;
}
