import type { ServiceOrderDetail, ServiceOrderRepository } from '@/service-orders/serviceOrder.types';

const serviceOrder: ServiceOrderDetail = {
  id: 'service-order-2402',
  reference: 'OS-2402',
  title: 'Servicio programado',
  status: 'in_progress',
  customerName: 'Cliente Sur',
  contactLabel: 'Responsable operativo · +598 99 000 222',
  locationName: 'Sitio 07',
  locationAddress: 'Zona Oeste · Dirección operativa de ejemplo',
  scheduledWindowLabel: 'Hoy · 09:30–12:00',
  createdLabel: 'Creado hoy · 07:48',
  updatedLabel: 'Actualizado hace 12 min',
  assignments: [
    { id: 'assignment-driver', roleLabel: 'Responsable', assigneeLabel: 'Pedro Silva' },
    { id: 'assignment-unit', roleLabel: 'Unidad', assigneeLabel: 'Unidad 01' },
  ],
  resources: [
    { id: 'resource-01', typeLabel: 'Activo', resourceLabel: 'Activo 007' },
    { id: 'resource-02', typeLabel: 'Equipo', resourceLabel: 'Equipo auxiliar 02' },
  ],
  evidence: [
    { id: 'evidence-01', label: 'Foto de condición inicial', kind: 'photo' },
    { id: 'evidence-02', label: 'Comprobante de entrega', kind: 'document' },
    { id: 'evidence-03', label: 'Firma del receptor', kind: 'signature' },
  ],
  activity: [
    {
      id: 'activity-01',
      timestampLabel: '07:48',
      title: 'Solicitud registrada',
      description: 'La orden fue creada y quedó pendiente de programación.',
      status: 'done',
    },
    {
      id: 'activity-02',
      timestampLabel: '08:12',
      title: 'Recursos asignados',
      description: 'Se asignaron responsable y recursos operativos.',
      status: 'done',
    },
    {
      id: 'activity-03',
      timestampLabel: '09:21',
      title: 'En ruta',
      description: 'La operación inició desplazamiento hacia el sitio.',
      status: 'done',
    },
    {
      id: 'activity-04',
      timestampLabel: '09:37',
      title: 'En sitio',
      description: 'La tarea se encuentra en ejecución.',
      status: 'current',
    },
    {
      id: 'activity-05',
      timestampLabel: 'Pendiente',
      title: 'Cierre del servicio',
      status: 'pending',
    },
  ],
  notes: [
    'Acceso coordinado previamente con el contacto del sitio.',
    'Verificar evidencia antes de cerrar la operación.',
  ],
  financial: {
    subtotalLabel: '$ 8.500',
    adjustmentsLabel: '$ 650',
    totalLabel: '$ 9.150',
    paymentStatusLabel: 'Pendiente',
  },
};

export const mockServiceOrderRepository: ServiceOrderRepository = {
  async getById(id) {
    if (id !== serviceOrder.id) {
      return {
        status: 'empty',
        message: 'No encontramos una orden de servicio con ese identificador.',
      };
    }

    return {
      status: 'success',
      order: serviceOrder,
    };
  },
};
