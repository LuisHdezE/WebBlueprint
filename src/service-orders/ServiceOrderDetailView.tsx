import { useEffect, useState } from 'react';
import { StatusBadge, type StatusBadgeTone } from '@/components/data-display/StatusBadge';
import { InlineFeedback } from '@/components/feedback/InlineFeedback';
import { mockServiceOrderRepository } from '@/service-orders/mockServiceOrderRepository';
import type {
  ServiceOrderDetailState,
  ServiceOrderRepository,
  ServiceOrderStatus,
} from '@/service-orders/serviceOrder.types';

const statusLabels: Record<ServiceOrderStatus, string> = {
  requested: 'Solicitado',
  scheduled: 'Programado',
  in_progress: 'En curso',
  completed: 'Completado',
  cancelled: 'Cancelado',
  delayed: 'Atrasado',
};

const statusTones: Record<ServiceOrderStatus, StatusBadgeTone> = {
  requested: 'neutral',
  scheduled: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'neutral',
  delayed: 'warning',
};

const activityDotClasses = {
  done: 'bg-emerald-500',
  current: 'bg-[var(--theme-accent)] ring-4 ring-[var(--theme-accent-soft)]',
  pending: 'bg-slate-200',
} as const;

export type ServiceOrderDetailViewProps = {
  orderId?: string;
  repository?: ServiceOrderRepository;
};

export function ServiceOrderDetailView({
  orderId = 'service-order-2402',
  repository = mockServiceOrderRepository,
}: ServiceOrderDetailViewProps) {
  const [state, setState] = useState<ServiceOrderDetailState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    repository
      .getById(orderId)
      .then((nextState) => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', message: 'No fue posible cargar el detalle de la orden.' });
        }
      });

    return () => {
      active = false;
    };
  }, [orderId, repository]);

  if (state.status === 'loading') {
    return <InlineFeedback title="Cargando orden" message="Estamos preparando el detalle operativo." tone="info" />;
  }

  if (state.status === 'empty') {
    return <InlineFeedback title="Orden no encontrada" message={state.message} />;
  }

  if (state.status === 'error') {
    return <InlineFeedback title="No se pudo cargar la orden" message={state.message} tone="error" />;
  }

  const { order } = state;

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">{order.reference}</p>
              <StatusBadge label={statusLabels[order.status]} tone={statusTones[order.status]} />
            </div>
            <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900">{order.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{order.scheduledWindowLabel}</p>
          </div>

          <div className="grid gap-1 text-right text-[11px] text-slate-400">
            <span>{order.createdLabel}</span>
            <span>{order.updatedLabel}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="grid gap-4">
          <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5">
            <InfoBlock label="Cliente" primary={order.customerName} secondary={order.contactLabel} />
            <InfoBlock label="Ubicación" primary={order.locationName} secondary={order.locationAddress} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeading eyebrow="Recursos" title="Asignaciones operativas" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {order.assignments.map((assignment) => (
                <InfoTile key={assignment.id} label={assignment.roleLabel} value={assignment.assigneeLabel} />
              ))}
              {order.resources.map((resource) => (
                <InfoTile key={resource.id} label={resource.typeLabel} value={resource.resourceLabel} />
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <SectionHeading eyebrow="Actividad" title="Timeline operativo" />
            <div className="mt-4">
              {order.activity.map((activity, index) => (
                <div className="relative grid grid-cols-[18px_64px_minmax(0,1fr)] gap-3 pb-5 last:pb-0" key={activity.id}>
                  {index < order.activity.length - 1 ? (
                    <span className="absolute left-[8px] top-4 h-[calc(100%-4px)] w-px bg-slate-200" />
                  ) : null}
                  <span className={`relative z-10 mt-1 size-4 rounded-full ${activityDotClasses[activity.status]}`} />
                  <span className="pt-0.5 text-[10px] font-semibold text-slate-400">{activity.timestampLabel}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                    {activity.description ? (
                      <p className="mt-0.5 text-[11px] leading-5 text-slate-500">{activity.description}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-4">
          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeading eyebrow="Evidencia" title="Documentación asociada" />
            <div className="mt-3 grid gap-2">
              {order.evidence.map((item) => (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5" key={item.id}>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{item.label}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-slate-400">{item.kind}</p>
                  </div>
                  <span className="size-2 rounded-full bg-emerald-500" aria-label="Disponible" />
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeading eyebrow="Resumen" title="Importes" />
            <dl className="mt-3 grid gap-2 text-xs">
              <SummaryRow label="Subtotal" value={order.financial.subtotalLabel} />
              <SummaryRow label="Ajustes" value={order.financial.adjustmentsLabel} />
              <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-3">
                <dt className="font-semibold text-slate-700">Total</dt>
                <dd className="text-base font-semibold text-slate-950">{order.financial.totalLabel}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Pago</dt>
                <dd className="font-semibold text-amber-700">{order.financial.paymentStatusLabel}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeading eyebrow="Notas" title="Contexto operativo" />
            <ul className="mt-3 grid gap-2">
              {order.notes.map((note) => (
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

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-600">{eyebrow}</p>
      <h4 className="mt-1 text-sm font-semibold text-slate-900">{title}</h4>
    </div>
  );
}

function InfoBlock({ label, primary, secondary }: { label: string; primary: string; secondary: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{primary}</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">{secondary}</p>
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
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-700">{value}</dd>
    </div>
  );
}
