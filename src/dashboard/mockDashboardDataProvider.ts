import type { DashboardDataProvider, DashboardDataState } from '@/dashboard/dashboard.types';

const successState: DashboardDataState = {
  status: 'success',
  data: {
    updatedLabel: 'Actualizado hace 5 min',
    metrics: [
      { id: 'active-products', label: 'Productos activos', value: '1.248', note: '+8,2% este mes', tone: 'positive' },
      { id: 'pending-orders', label: 'Pedidos pendientes', value: '38', note: '6 requieren revisión', tone: 'warning' },
      { id: 'today-orders', label: 'Pedidos de hoy', value: '126', note: '+12 desde ayer', tone: 'positive' },
      { id: 'fulfillment', label: 'Cumplimiento', value: '94%', note: 'Dentro del objetivo', tone: 'neutral' },
    ],
    activity: [
      {
        id: 'activity-001',
        title: 'Pedido #WB-1048 preparado',
        detail: 'El pedido quedó listo para despacho y espera retiro del transportista.',
        timeLabel: 'Hace 12 min',
        statusLabel: 'Listo',
        statusTone: 'success',
      },
      {
        id: 'activity-002',
        title: 'Stock bajo en alimento premium',
        detail: 'Quedan 8 unidades disponibles para la variante de 12 kg.',
        timeLabel: 'Hace 28 min',
        statusLabel: 'Revisar',
        statusTone: 'warning',
      },
      {
        id: 'activity-003',
        title: 'Nuevo cliente registrado',
        detail: 'Camila Torres completó su perfil y realizó su primer pedido.',
        timeLabel: 'Hace 46 min',
        statusLabel: 'Nuevo',
        statusTone: 'info',
      },
    ],
    series: [
      { label: 'Lun', value: 62 },
      { label: 'Mar', value: 78 },
      { label: 'Mié', value: 71 },
      { label: 'Jue', value: 86 },
      { label: 'Vie', value: 94 },
      { label: 'Sáb', value: 82 },
      { label: 'Dom', value: 68 },
    ],
  },
};

export const mockDashboardDataProvider: DashboardDataProvider = {
  async load() {
    return successState;
  },
};

export function createDashboardMockState(status: DashboardDataState['status']): DashboardDataState {
  if (status === 'success') {
    return successState;
  }

  if (status === 'empty') {
    return { status: 'empty', message: 'Todavía no hay datos suficientes para construir el resumen.' };
  }

  if (status === 'error') {
    return { status: 'error', message: 'No fue posible cargar el resumen operativo.' };
  }

  return { status: 'loading' };
}
