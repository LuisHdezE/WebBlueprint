import type {
  AlertCenterRepository,
  AlertCenterSummary,
  OperationalAlert,
  OperationalAlertFilter,
} from '@/alerts-center/alertCenter.types';

const alerts: readonly OperationalAlert[] = [
  {
    id: 'alert-001',
    title: 'Tarea vencida',
    description: 'La actividad programada superó su horario objetivo y todavía sigue abierta.',
    severity: 'critical',
    status: 'open',
    category: 'schedule',
    occurredAtLabel: 'Hace 18 min',
    contextLabel: 'OS-2404 · Zona Norte',
    actionLabel: 'Revisar despacho',
  },
  {
    id: 'alert-002',
    title: 'Permanencia excedida',
    description: 'El recurso asignado supera el período operativo configurado para este servicio.',
    severity: 'warning',
    status: 'open',
    category: 'service',
    occurredAtLabel: 'Hace 42 min',
    contextLabel: 'OS-2397 · Sitio 12',
    actionLabel: 'Revisar servicio',
  },
  {
    id: 'alert-003',
    title: 'Mantenimiento próximo',
    description: 'Un activo alcanzará su ventana de mantenimiento preventivo dentro de 48 horas.',
    severity: 'warning',
    status: 'acknowledged',
    category: 'maintenance',
    occurredAtLabel: 'Hoy · 08:15',
    contextLabel: 'Activo 018',
    actionLabel: 'Ver activo',
  },
  {
    id: 'alert-004',
    title: 'Documento por vencer',
    description: 'La documentación operativa asociada a una unidad vence esta semana.',
    severity: 'warning',
    status: 'open',
    category: 'document',
    occurredAtLabel: 'Hoy · 07:40',
    contextLabel: 'Unidad 03',
    actionLabel: 'Revisar documento',
  },
  {
    id: 'alert-005',
    title: 'Pago pendiente',
    description: 'El vencimiento registrado para este saldo ya fue superado.',
    severity: 'critical',
    status: 'open',
    category: 'payment',
    occurredAtLabel: 'Ayer · 17:30',
    contextLabel: 'Cuenta #C-1842',
    actionLabel: 'Revisar cuenta',
  },
  {
    id: 'alert-006',
    title: 'Incidencia reportada',
    description: 'Se registró una observación operativa que requiere seguimiento.',
    severity: 'info',
    status: 'resolved',
    category: 'incident',
    occurredAtLabel: 'Ayer · 15:12',
    contextLabel: 'OS-2388',
  },
];

function summarize(source: readonly OperationalAlert[]): AlertCenterSummary {
  return {
    open: source.filter((alert) => alert.status === 'open').length,
    critical: source.filter((alert) => alert.severity === 'critical' && alert.status !== 'resolved').length,
    warning: source.filter((alert) => alert.severity === 'warning' && alert.status !== 'resolved').length,
    acknowledged: source.filter((alert) => alert.status === 'acknowledged').length,
  };
}

export const mockAlertCenterRepository: AlertCenterRepository = {
  async list(filter: OperationalAlertFilter) {
    const filtered = alerts.filter((alert) => {
      const matchesSeverity = filter.severity === 'all' || alert.severity === filter.severity;
      const matchesStatus = filter.status === 'all' || alert.status === filter.status;
      return matchesSeverity && matchesStatus;
    });

    if (filtered.length === 0) {
      return {
        status: 'empty',
        message: 'No hay alertas operativas que coincidan con los filtros seleccionados.',
      };
    }

    return {
      status: 'success',
      alerts: filtered,
      summary: summarize(alerts),
    };
  },
};
