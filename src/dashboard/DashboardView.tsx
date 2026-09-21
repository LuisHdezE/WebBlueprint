import { useEffect, useMemo, useState } from 'react';
import { ActivityFeed } from '@/components/data-display/ActivityFeed';
import { MetricCard } from '@/components/data-display/MetricCard';
import { InlineFeedback } from '@/components/feedback/InlineFeedback';
import type { DashboardDataProvider, DashboardDataState } from '@/dashboard/dashboard.types';
import { mockDashboardDataProvider } from '@/dashboard/mockDashboardDataProvider';

export type DashboardViewProps = {
  provider?: DashboardDataProvider;
};

export function DashboardView({ provider = mockDashboardDataProvider }: DashboardViewProps) {
  const [state, setState] = useState<DashboardDataState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    provider
      .load()
      .then((nextState) => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', message: 'No fue posible cargar el resumen operativo.' });
        }
      });

    return () => {
      active = false;
    };
  }, [provider]);

  if (state.status === 'loading') {
    return <InlineFeedback title="Cargando panel" message="Estamos preparando las señales operativas de esta demo." tone="info" />;
  }

  if (state.status === 'empty') {
    return <InlineFeedback title="Sin datos todavía" message={state.message} />;
  }

  if (state.status === 'error') {
    return <InlineFeedback title="No se pudo cargar el panel" message={state.message} tone="error" />;
  }

  return <DashboardContent data={state.data} />;
}

function DashboardContent({ data }: { data: Extract<DashboardDataState, { status: 'success' }>['data'] }) {
  const maxValue = useMemo(() => Math.max(...data.series.map((point) => point.value), 1), [data.series]);

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.id} label={metric.label} note={metric.note} tone={metric.tone} value={metric.value} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">Actividad reciente</p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Señales que requieren contexto</h3>
            </div>
            <span className="text-[11px] text-slate-400">{data.updatedLabel}</span>
          </div>
          <div className="mt-4">
            <ActivityFeed items={data.activity} />
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">Ritmo semanal</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Pedidos procesados</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">Resumen visual sin dependencia de una librería de charts.</p>

          <div className="mt-5 flex h-40 items-end gap-2" aria-label="Pedidos procesados por día">
            {data.series.map((point) => (
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={point.label}>
                <span className="text-[10px] font-semibold text-slate-500">{point.value}</span>
                <div className="flex h-28 w-full items-end rounded-lg bg-slate-100 p-1">
                  <div
                    className="w-full rounded-md bg-brand-500"
                    style={{ height: `${Math.max((point.value / maxValue) * 100, 8)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400">{point.label}</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
