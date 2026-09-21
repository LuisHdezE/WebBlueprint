import type { ApplicationDefinition, DemoPageDefinition } from '@/applications/application.types';
import { getPageDefinition, type PageKey } from '@/applications/pageRegistry';

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

function defineDemoPage(id: string, pageKey: PageKey, description: string): DemoPageDefinition {
  const page = getPageDefinition(pageKey);

  return {
    id,
    pageKey,
    label: page.label,
    path: page.path,
    description,
    iconKey: page.iconKey,
    group: page.group,
  };
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
      defineDemoPage('dashboard', 'dashboard', 'Resumen operativo con las señales clave que el equipo necesita consultar de un vistazo.'),
      defineDemoPage('products', 'product-catalog-admin', 'Catálogo de productos y espacio de trabajo orientado al stock.'),
      defineDemoPage('customers', 'customers', 'Directorio de clientes y contexto de la relación comercial.'),
      defineDemoPage('orders', 'orders', 'Seguimiento de pedidos y espacio de trabajo orientado al cumplimiento.'),
      defineDemoPage('inventory', 'inventory', 'Visibilidad de inventario y espacio de trabajo orientado a la reposición.'),
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
