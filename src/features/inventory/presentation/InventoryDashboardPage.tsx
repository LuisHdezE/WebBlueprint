import { DataTable, type DataTableColumn, type DataTableFilter } from '@/components/data-display/DataTable';
import { MetricCard } from '@/components/data-display/MetricCard';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { InventoryDemoProvider } from '../application/inventory.contracts';
import type { InventoryQueueItemDto } from '../application/inventory.dto';

const queueColumns: readonly DataTableColumn<InventoryQueueItemDto>[] = [
  { id: 'id', header: 'ID', cell: (item) => <span className="font-mono text-xs font-semibold text-slate-500">{item.id}</span>, sortable: true, sortValue: (item) => item.id, searchValue: (item) => item.id },
  { id: 'device', header: 'Dispositivo', cell: (item) => <span className="font-medium text-slate-900">{item.deviceLabel}</span>, sortable: true, sortValue: (item) => item.deviceLabel, searchValue: (item) => item.deviceLabel },
  { id: 'context', header: 'Contexto', cell: (item) => item.context, searchValue: (item) => item.context },
  { id: 'status', header: 'Estado', cell: (item) => <StatusBadge label={item.status} tone={item.statusTone} />, sortable: true, sortValue: (item) => item.status, searchValue: (item) => item.status },
  { id: 'priority', header: 'Prioridad', cell: (item) => item.priority, sortable: true, sortValue: (item) => item.priority, searchValue: (item) => item.priority },
  { id: 'action', header: 'Próxima acción', align: 'right', cell: (item) => <span className="font-semibold text-brand-600">{item.actionLabel}</span>, searchValue: (item) => item.actionLabel },
];

const queueFilters: readonly DataTableFilter<InventoryQueueItemDto>[] = [
  {
    id: 'status',
    label: 'Estado',
    allLabel: 'Todos los estados',
    options: [
      { value: 'Pending Evaluation', label: 'Pendiente evaluación' },
      { value: 'Waiting', label: 'Esperando' },
      { value: 'Partially Dismantled', label: 'Desarme parcial' },
      { value: 'Refurbish', label: 'Reacondicionar' },
    ],
    value: (item) => item.status,
  },
  {
    id: 'priority',
    label: 'Prioridad',
    allLabel: 'Todas las prioridades',
    options: [{ value: 'High', label: 'Alta' }, { value: 'Normal', label: 'Normal' }],
    value: (item) => item.priority,
  },
];

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
        </div>

        <div className="mt-5" data-inventory-queue>
          <DataTable
            caption="Cola operacional de inventario"
            columns={queueColumns}
            filters={queueFilters}
            getRowId={(item) => item.id}
            initialPageSize={5}
            pageSizeOptions={[5, 10, 25]}
            rows={dashboard.queue}
            searchLabel="Buscar en la cola"
            searchPlaceholder="ID, dispositivo, estado o acción…"
            searchable
            selectable
          />
        </div>
      </SurfaceCard>
    </div>
  </PageShell>;
}
