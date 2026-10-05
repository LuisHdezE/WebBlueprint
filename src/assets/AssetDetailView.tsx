import { useEffect, useState } from 'react';
import { StatusBadge, type StatusBadgeTone } from '@/components/data-display/StatusBadge';
import { InlineFeedback } from '@/components/feedback/InlineFeedback';
import { mockAssetRepository } from '@/assets/mockAssetRepository';
import type {
  AssetDetailState,
  AssetRepository,
  AssetStatus,
  MaintenanceStatus,
  MaintenanceType,
} from '@/assets/asset.types';

const assetStatusLabels: Record<AssetStatus, string> = {
  available: 'Disponible',
  assigned: 'Asignado',
  in_service: 'En servicio',
  maintenance: 'Mantenimiento',
  inactive: 'Inactivo',
};

const assetStatusTones: Record<AssetStatus, StatusBadgeTone> = {
  available: 'success',
  assigned: 'info',
  in_service: 'warning',
  maintenance: 'warning',
  inactive: 'neutral',
};

const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  preventive: 'Preventivo',
  corrective: 'Correctivo',
  inspection: 'Inspección',
};

const maintenanceStatusLabels: Record<MaintenanceStatus, string> = {
  scheduled: 'Programado',
  in_progress: 'En curso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const maintenanceStatusTones: Record<MaintenanceStatus, StatusBadgeTone> = {
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'neutral',
};

export type AssetDetailViewProps = {
  assetId?: string;
  repository?: AssetRepository;
};

export function AssetDetailView({
  assetId = 'asset-018',
  repository = mockAssetRepository,
}: AssetDetailViewProps) {
  const [state, setState] = useState<AssetDetailState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    repository
      .getById(assetId)
      .then((nextState) => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', message: 'No fue posible cargar el detalle del activo.' });
        }
      });

    return () => {
      active = false;
    };
  }, [assetId, repository]);

  if (state.status === 'loading') {
    return <InlineFeedback title="Cargando activo" message="Estamos preparando la información operativa y de mantenimiento." tone="info" />;
  }

  if (state.status === 'empty') {
    return <InlineFeedback title="Activo no encontrado" message={state.message} />;
  }

  if (state.status === 'error') {
    return <InlineFeedback title="No se pudo cargar el activo" message={state.message} tone="error" />;
  }

  const { asset } = state;

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">{asset.code}</p>
              <StatusBadge label={assetStatusLabels[asset.status]} tone={assetStatusTones[asset.status]} />
            </div>
            <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900">{asset.name}</h3>
            <p className="mt-1 text-xs text-slate-500">{asset.categoryLabel}</p>
          </div>
          <div className="grid gap-1 text-right text-[11px] text-slate-400">
            <span>{asset.lastServiceLabel}</span>
            {asset.nextMaintenanceLabel ? <span>Próximo mantenimiento · {asset.nextMaintenanceLabel}</span> : null}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="grid gap-4">
          <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5">
            <InfoTile label="Condición" value={asset.conditionLabel} />
            <InfoTile label="Ubicación" value={asset.locationLabel} />
            <InfoTile label="Asignado a" value={asset.assignedToLabel ?? 'Sin asignación'} />
            <InfoTile label="Valor" value={asset.valueLabel ?? 'No informado'} />
            <InfoTile label="Alta" value={asset.acquisitionLabel ?? 'No informada'} />
            <InfoTile label="Próximo mantenimiento" value={asset.nextMaintenanceLabel ?? 'Sin programación'} />
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-600">Mantenimiento</p>
                <h4 className="mt-0.5 text-sm font-semibold text-slate-900">Historial y programación</h4>
              </div>
              <span className="rounded-md bg-[var(--theme-accent-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-accent)]">
                {asset.maintenance.length} registros
              </span>
            </header>

            <div className="divide-y divide-slate-100">
              {asset.maintenance.map((record) => (
                <article
                  className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1.3fr)_110px_120px_minmax(120px,0.8fr)] md:items-center"
                  key={record.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{record.title}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                        {maintenanceTypeLabels[record.type]}
                      </span>
                    </div>
                    {record.notes ? <p className="mt-1 text-[11px] leading-5 text-slate-500">{record.notes}</p> : null}
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Fecha</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">{record.scheduledLabel}</p>
                  </div>

                  <div>
                    <StatusBadge label={maintenanceStatusLabels[record.status]} tone={maintenanceStatusTones[record.status]} />
                    {record.completedLabel ? <p className="mt-1 text-[10px] text-slate-400">{record.completedLabel}</p> : null}
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Responsable / costo</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">{record.providerLabel ?? 'No informado'}</p>
                    {record.costLabel ? <p className="mt-0.5 text-[10px] font-semibold text-slate-500">{record.costLabel}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-4">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-600">Estado operacional</p>
            <h4 className="mt-1 text-sm font-semibold text-slate-900">Resumen del activo</h4>
            <dl className="mt-3 grid gap-2 text-xs">
              <SummaryRow label="Ubicación" value={asset.locationLabel} />
              <SummaryRow label="Condición" value={asset.conditionLabel} />
              <SummaryRow label="Asignación" value={asset.assignedToLabel ?? 'Libre'} />
              <SummaryRow label="Último servicio" value={asset.lastServiceLabel} />
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-600">Notas</p>
            <h4 className="mt-1 text-sm font-semibold text-slate-900">Contexto operativo</h4>
            <ul className="mt-3 grid gap-2">
              {asset.notes.map((note) => (
                <li className="rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-5 text-slate-600" key={note}>
                  {note}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-xs font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-700">{value}</dd>
    </div>
  );
}
