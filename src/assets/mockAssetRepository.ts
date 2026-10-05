import type { AssetDetail, AssetRepository } from '@/assets/asset.types';

const asset: AssetDetail = {
  id: 'asset-018',
  code: 'AST-018',
  name: 'Activo operativo 18',
  categoryLabel: 'Contenedor operativo',
  status: 'assigned',
  conditionLabel: 'Operativo',
  locationLabel: 'Sitio 03 · Zona Centro',
  assignedToLabel: 'OS-2401',
  lastServiceLabel: 'Hoy · 08:00',
  nextMaintenanceLabel: 'En 2 días',
  acquisitionLabel: 'Alta · 12 feb 2025',
  valueLabel: '$ 48.000',
  notes: [
    'Inspección visual requerida al cierre del servicio actual.',
    'Sin incidencias críticas abiertas.',
  ],
  maintenance: [
    {
      id: 'maintenance-01',
      type: 'preventive',
      status: 'scheduled',
      title: 'Inspección preventiva',
      scheduledLabel: '07 oct · 08:30',
      providerLabel: 'Taller interno',
      notes: 'Control general, estructura y puntos de desgaste.',
    },
    {
      id: 'maintenance-02',
      type: 'inspection',
      status: 'completed',
      title: 'Control de condición',
      scheduledLabel: '12 sep · 15:00',
      completedLabel: '12 sep · 15:42',
      providerLabel: 'Operaciones',
      costLabel: '$ 0',
      notes: 'Sin observaciones relevantes.',
    },
    {
      id: 'maintenance-03',
      type: 'corrective',
      status: 'completed',
      title: 'Reparación menor',
      scheduledLabel: '18 jul · 09:00',
      completedLabel: '18 jul · 11:20',
      providerLabel: 'Proveedor externo',
      costLabel: '$ 2.450',
      notes: 'Corrección de componente estructural.',
    },
  ],
};

export const mockAssetRepository: AssetRepository = {
  async getById(id) {
    if (id !== asset.id) {
      return {
        status: 'empty',
        message: 'No encontramos un activo con ese identificador.',
      };
    }

    return {
      status: 'success',
      asset,
    };
  },
};
