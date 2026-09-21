export type PageMenuVisibility = 'primary' | 'secondary' | 'hidden' | 'conditional';

export type PageDefinition = {
  key: string;
  label: string;
  path: string;
  group: string;
  iconKey: string;
  menuVisibility: PageMenuVisibility;
  order: number;
  permissionHint?: string;
};

export const pageRegistry = {
  dashboard: {
    key: 'dashboard',
    label: 'Panel',
    path: 'dashboard',
    group: 'Resumen',
    iconKey: 'layout-dashboard',
    menuVisibility: 'primary',
    order: 10,
    permissionHint: 'dashboard.read',
  },
  'product-catalog-admin': {
    key: 'product-catalog-admin',
    label: 'Productos',
    path: 'products',
    group: 'Comercio',
    iconKey: 'package-search',
    menuVisibility: 'primary',
    order: 100,
    permissionHint: 'products.read',
  },
  customers: {
    key: 'customers',
    label: 'Clientes',
    path: 'customers',
    group: 'Relaciones',
    iconKey: 'users-round',
    menuVisibility: 'primary',
    order: 110,
    permissionHint: 'customers.read',
  },
  orders: {
    key: 'orders',
    label: 'Pedidos',
    path: 'orders',
    group: 'Comercio',
    iconKey: 'shopping-cart',
    menuVisibility: 'primary',
    order: 120,
    permissionHint: 'orders.read',
  },
  inventory: {
    key: 'inventory',
    label: 'Inventario',
    path: 'inventory',
    group: 'Comercio',
    iconKey: 'boxes',
    menuVisibility: 'primary',
    order: 130,
    permissionHint: 'inventory.read',
  },
} as const satisfies Record<string, PageDefinition>;

export type PageKey = keyof typeof pageRegistry;

export function getPageDefinition(pageKey: PageKey): PageDefinition {
  return pageRegistry[pageKey];
}
