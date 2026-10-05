import { useEffect, useState } from 'react';
import { StatusBadge, type StatusBadgeTone } from '@/components/data-display/StatusBadge';
import { InlineFeedback } from '@/components/feedback/InlineFeedback';
import { SelectField, type SelectFieldOption } from '@/components/forms/SelectField';
import { mockDispatchRepository } from '@/dispatch/mockDispatchRepository';
import type {
  DispatchBoardState,
  DispatchRepository,
  DispatchStatus,
  DispatchStatusFilter,
  DispatchTaskType,
} from '@/dispatch/dispatch.types';

const statusLabels: Record<DispatchStatus, string> = {
  scheduled: 'Programado',
  assigned: 'Asignado',
  en_route: 'En ruta',
  on_site: 'En sitio',
  completed: 'Completado',
  delayed: 'Atrasado',
  incident: 'Incidencia',
};

const statusTones: Record<DispatchStatus, StatusBadgeTone> = {
  scheduled: 'neutral',
  assigned: 'info',
  en_route: 'info',
  on_site: 'warning',
  completed: 'success',
  delayed: 'warning',
  incident: 'warning',
};

const typeLabels: Record<DispatchTaskType, string> = {
  delivery: 'Entrega',
  pickup: 'Retiro',
  transfer: 'Traslado',
  service: 'Servicio',
};

const filterOptions: readonly SelectFieldOption<DispatchStatusFilter>[] = [
  { value: 'all', label: 'Todos' },
  { value: 'scheduled', label: 'Programados' },
  { value: 'assigned', label: 'Asignados' },
  { value: 'en_route', label: 'En ruta' },
  { value: 'on_site', label: 'En sitio' },
  { value: 'completed', label: 'Completados' },
  { value: 'delayed', label: 'Atrasados' },
  { value: 'incident', label: 'Incidencias' },
];

export type DispatchBoardViewProps = {
  repository?: DispatchRepository;
};

export function DispatchBoardView({ repository = mockDispatchRepository }: DispatchBoardViewProps) {
  const [filter, setFilter] = useState<DispatchStatusFilter>('all');
  const [state, setState] = useState<DispatchBoardState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    repository
      .load({ status: filter })
      .then((nextState) => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', message: 'No fue posible cargar el tablero de despacho.' });
        }
      });

    return () => {
      active = false;
    };
  }, [filter, repository]);

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">Operación diaria</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Dispatch Board</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Coordina asignaciones, horarios, recursos y responsables desde una única superficie operativa.
            </p>
          </div>
          <div className="w-full max-w-[220px]">
            <SelectField
              id="dispatch-status-filter"
              label="Estado"
              onChange={(nextFilter) => {
                setState({ status: 'loading' });
                setFilter(nextFilter);
              }}
              options={filterOptions}
              value={filter}
            />
          </div>
        </div>
      </section>

      {state.status === 'loading' ? (
        <InlineFeedback title="Cargando despacho" message="Estamos preparando la agenda operativa." tone="info" />
      ) : null}

      {state.status === 'error' ? (
        <InlineFeedback title="No se pudo cargar el despacho" message={state.message} tone="error" />
      ) : null}

      {state.status === 'empty' ? (
        <InlineFeedback title="Sin tareas" message={state.message} />
      ) : null}

      {state.status === 'success' ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">{state.dateLabel}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">{state.tasks.length} tareas programadas</p>
            </div>
            <span className="rounded-md bg-[var(--theme-accent-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-accent)]">
              Agenda operativa
            </span>
          </header>

          <div className="divide-y divide-slate-100">
            {state.tasks.map((task) => (
              <article
                className="grid gap-3 px-4 py-3 md:grid-cols-[64px_minmax(110px,0.7fr)_minmax(180px,1.2fr)_minmax(170px,1fr)_minmax(130px,0.8fr)_auto] md:items-center"
                key={task.id}
              >
                <div>
                  <p className="text-base font-semibold tabular-nums text-slate-950">{task.scheduledTime}</p>
                  <p className="mt-0.5 text-[10px] font-medium text-slate-400">{task.reference}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Tipo</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{typeLabels[task.type]}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">{task.customerName}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{task.locationLabel}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Recurso</p>
                  <p className="mt-1 text-xs font-medium text-slate-700">{task.resourceLabel}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Responsable</p>
                  <p className="mt-1 text-xs font-medium text-slate-700">{task.assigneeName}</p>
                </div>

                <div className="md:justify-self-end">
                  <StatusBadge label={statusLabels[task.status]} tone={statusTones[task.status]} />
                  {task.note ? <p className="mt-1 max-w-40 text-[10px] leading-4 text-amber-700">{task.note}</p> : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
