import type { ApplicationDefinition } from '@/applications/application.types';

export const applicationRegistry = [
  {
    id: 'pet-shop',
    slug: 'pet-shop',
    name: 'Pet Shop',
    summary:
      'A responsive retail management concept for pet stores, combining products, customers, orders and inventory in one navigable experience.',
    category: 'Retail',
    promoted: true,
    shellVariant: 'vertical-light-menu',
    capabilities: ['Dashboard', 'Products', 'Customers', 'Orders', 'Inventory'],
    demoPages: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: 'dashboard',
        description: 'Operational overview with the key signals a pet-store team needs at a glance.',
      },
      {
        id: 'products',
        label: 'Products',
        path: 'products',
        description: 'Product catalog and stock-oriented workspace.',
      },
      {
        id: 'customers',
        label: 'Customers',
        path: 'customers',
        description: 'Customer directory and relationship context.',
      },
      {
        id: 'orders',
        label: 'Orders',
        path: 'orders',
        description: 'Order tracking and fulfillment-oriented workspace.',
      },
      {
        id: 'inventory',
        label: 'Inventory',
        path: 'inventory',
        description: 'Inventory visibility and replenishment-oriented workspace.',
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
