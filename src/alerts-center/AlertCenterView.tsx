import { useEffect, useState } from 'react';
import { InlineFeedback } from '@/components/feedback/InlineFeedback';
import { SelectField, type SelectFieldOption } from '@/components/forms/SelectField';
import { mockAlertCenterRepository } from '@/alerts-center/mockAlertCenterRepository';
import type {
  AlertCenterRepository,
  AlertCenterState,
  OperationalAlertFilter,
  OperationalAlertSeverity,
  OperationalAlertStatus,
} from '@/alerts-center/alertCenter.types';

const severityOptions: readonly SelectFieldOption<OperationalAlertFilter['severity']>[] = [
  { value: 'all', label: 'Todas' },
  { value: 'critical', label: 'Críticas' },
  { value: 'warning', label: 'Advertencias' },
  { value: 'info', label: 'Informativas' },
];

const statusOptions: readonly SelectFieldOption<OperationalAlertFilter['status']>[] = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abiertas' },
  { value: 'acknowledged', label: 'Reconocidas' },
  { value: 'resolved', label: 'Resueltas' },
];

const severityLabels: Record<OperationalAlertSeverity, string> = {
  critical: 'Crítica',
  warning: 'Advertencia',
  info: 'Informativa',
};

const statusLabels: Record<OperationalAlertStatus, string> = {
  open: 'Abierta',
  acknowledged: 'Reconocida',
  resolved: 'Resuelta',
};

const severityClasses: Record<OperationalAlertSeverity, string> = {
  critical: 'border-rose-200 bg-rose-50 text-rose-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
};

const statusClasses: Record<OperationalAlertStatus, string> = {
  open: 'bg-rose-50 text-rose-700 ring-rose-200',
  acknowledged: 'bg-amber-50 text-amber-700 ring-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const initialFilter: OperationalAlertFilter = {
  severity: 'all',
  status: 'all',
};

export type AlertCenterViewProps = {
  repository?: AlertCenterRepository;
};

export function AlertCenterView({ repository = mockAlertCenterRepository }: AlertCenterViewProps) {
  const [filter, setFilter] = useState<OperationalAlertFilter>(initialFilter);
  const [state, setState] = useState<AlertCenterState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });

    repository
      .list(filter)
      .then((nextState) => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', message: 'No fue posible cargar el centro de alertas.' });
        }
      });

    return () => {
      active = false;
    };
  }, [filter, repository]);

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">Centro de acción</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Alert Center</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Prioriza situaciones que requieren atención sin mezclar alertas operativas con notificaciones generales.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 xl:max-w-[460px]">
            <SelectField
              id="alert-severity-filter"
              label="Severidad"
              onChange={(severity) => setFilter((current) => ({ ...current, severity }))}
              options={severityOptions}
              value={filter.severity}
            />
            <SelectField
              id="alert-status-filter"
              label="Estado"
              onChange={(status) => setFilter((current) => ({ ...current, status }))}
              options={statusOptions}
              value={filter.status}
            />
          </div>
        </div>
      </section>

      {state.status === 'loading' ? (
        <InlineFeedback title="Cargando alertas" message="Estamos preparando las prioridades operativas." tone="info" />
      ) : null}

      {state.status === 'error' ? (
        <InlineFeedback title="No se pudieron cargar las alertas" message={state.message} tone="error" />
      ) : null}

      {state.status === 'empty' ? (
        <InlineFeedback title="Sin alertas" message={state.message} />
      ) : null}

      {state.status === 'success' ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Abiertas" value={state.summary.open} />
            <SummaryCard label="Críticas" value={state.summary.critical} />
            <SummaryCard label="Advertencias" value={state.summary.warning} />
            <SummaryCard label="Reconocidas" value={state.summary.acknowledged} />
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">Prioridades activas</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">{state.alerts.length} alertas mostradas</p>
              </div>
              <span className="rounded-md bg-[var(--theme-accent-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-accent)]">
                Acción requerida
              </span>
            </header>

            <div className="divide-y divide-slate-100">
              {state.alerts.map((alert) => (
                <article
                  className="grid gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(150px,0.6fr)_120px_auto] lg:items-center"
                  key={alert.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${severityClasses[alert.severity]}`}>
                        {severityLabels[alert.severity]}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900">{alert.title}</h4>
                    </div>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">{alert.description}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Contexto</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">{alert.contextLabel}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">{alert.occurredAtLabel}</p>
                    <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ring-1 ring-inset ${statusClasses[alert.status]}`}>
                      {statusLabels[alert.status]}
                    </span>
                  </div>

                  <div className="lg:justify-self-end">
                    {alert.actionLabel ? (
                      <button
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700 transition hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)]"
                        type="button"
                      >
                        {alert.actionLabel}
                      </button>
                    ) : (
                      <span className="text-[10px] font-semibold text-emerald-600">Sin acción pendiente</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{value}</p>
    </article>
  );
}
