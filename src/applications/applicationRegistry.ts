import type { ApplicationDefinition } from '@/applications/application.types';

const capabilityLabels: Readonly<Record<string, string>> = {
  Dashboard: 'Panel',
  Products: 'Productos',
  Customers: 'Clientes',
  Orders: 'Pedidos',
  Inventory: 'Inventario',
};

export function getCapabilityLabel(capability: string) {
  return capabilityLabels[capability] ?? capability;
}

export const applicationRegistry = [
  {
    id: 'pet-shop',
    slug: 'pet-shop',
    name: 'Pet Shop',
    summary:
      'Concepto responsive de gestión comercial para tiendas de mascotas que integra productos, clientes, pedidos e inventario en una experiencia navegable.',
    category: 'Comercio minorista',
    promoted: true,
    shellVariant: 'vertical-light-menu',
    capabilities: ['Dashboard', 'Products', 'Customers', 'Orders', 'Inventory'],
    demoPages: [
      {
        id: 'dashboard',
        label: 'Panel',
        path: 'dashboard',
        description: 'Resumen operativo con las señales clave que el equipo necesita consultar de un vistazo.',
      },
      {
        id: 'products',
        label: 'Productos',
        path: 'products',
        description: 'Catálogo de productos y espacio de trabajo orientado al stock.',
      },
      {
        id: 'customers',
        label: 'Clientes',
        path: 'customers',
        description: 'Directorio de clientes y contexto de la relación comercial.',
      },
      {
        id: 'orders',
        label: 'Pedidos',
        path: 'orders',
        description: 'Seguimiento de pedidos y espacio de trabajo orientado al cumplimiento.',
      },
      {
        id: 'inventory',
        label: 'Inventario',
        path: 'inventory',
        description: 'Visibilidad de inventario y espacio de trabajo orientado a la reposición.',
      },
    ],
  },
] as const satisfies readonly ApplicationDefinition[];

export function listPublicApplications() {
  return applicationRegistry.filter((application) => application.promoted);
}

export function getApplicationBySlug(slug: string | undefined) {
  if (!slug) {
    return undefined;
  }

  return applicationRegistry.find((application) => application.slug === slug);
}
