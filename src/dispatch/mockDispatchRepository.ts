import type {
  DispatchBoardState,
  DispatchFilter,
  DispatchRepository,
  DispatchTask,
} from '@/dispatch/dispatch.types';

const tasks: readonly DispatchTask[] = [
  {
    id: 'dispatch-001',
    reference: 'OS-2401',
    scheduledTime: '08:00',
    type: 'delivery',
    status: 'assigned',
    customerName: 'Cliente Norte',
    locationLabel: 'Sitio 03 · Zona Centro',
    resourceLabel: 'Activo 018 · Unidad 03',
    assigneeName: 'Juan Pérez',
  },
  {
    id: 'dispatch-002',
    reference: 'OS-2402',
    scheduledTime: '09:30',
    type: 'pickup',
    status: 'en_route',
    customerName: 'Cliente Sur',
    locationLabel: 'Sitio 07 · Zona Oeste',
    resourceLabel: 'Activo 007 · Unidad 01',
    assigneeName: 'Pedro Silva',
  },
  {
    id: 'dispatch-003',
    reference: 'OS-2403',
    scheduledTime: '11:00',
    type: 'delivery',
    status: 'scheduled',
    customerName: 'Cliente Centro',
    locationLabel: 'Sitio 11 · Zona Este',
    resourceLabel: 'Activo 021 · Unidad 03',
    assigneeName: 'Juan Pérez',
  },
  {
    id: 'dispatch-004',
    reference: 'OS-2404',
    scheduledTime: '14:30',
    type: 'pickup',
    status: 'delayed',
    customerName: 'Cliente Rivera',
    locationLabel: 'Sitio 02 · Zona Norte',
    resourceLabel: 'Activo 014 · Unidad 02',
    assigneeName: 'Carlos Méndez',
    note: 'Demora reportada por tránsito.',
  },
  {
    id: 'dispatch-005',
    reference: 'OS-2405',
    scheduledTime: '16:00',
    type: 'transfer',
    status: 'on_site',
    customerName: 'Cliente Prado',
    locationLabel: 'Sitio 15 · Zona Centro',
    resourceLabel: 'Activo 004 · Unidad 04',
    assigneeName: 'Ana Torres',
  },
];

export const mockDispatchRepository: DispatchRepository = {
  async load(filter: DispatchFilter): Promise<DispatchBoardState> {
    const filteredTasks =
      filter.status === 'all' ? tasks : tasks.filter((task) => task.status === filter.status);

    if (filteredTasks.length === 0) {
      return {
        status: 'empty',
        message: 'No hay tareas de despacho que coincidan con el filtro seleccionado.',
      };
    }

    return {
      status: 'success',
      dateLabel: 'Operación de hoy',
      tasks: filteredTasks,
    };
  },
};
