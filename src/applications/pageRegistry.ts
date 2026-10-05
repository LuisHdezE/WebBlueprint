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
  'volketas-dashboard': {
    key: 'volketas-dashboard',
    label: 'Volketas · Dashboard',
    path: 'applications/management/dashboard',
    group: 'Volketas',
    iconKey: 'layout-dashboard',
    menuVisibility: 'primary',
    order: 20,
    permissionHint: 'volketas.dashboard.read',
  },
  'volketas-dispatch': {
    key: 'volketas-dispatch',
    label: 'Volketas · Despacho',
    path: 'applications/management/dispatch',
    group: 'Volketas',
    iconKey: 'route',
    menuVisibility: 'primary',
    order: 30,
    permissionHint: 'volketas.dispatch.read',
  },
  'volketas-orders': {
    key: 'volketas-orders',
    label: 'Volketas · Servicios',
    path: 'applications/management/orders',
    group: 'Volketas',
    iconKey: 'clipboard-list',
    menuVisibility: 'primary',
    order: 40,
    permissionHint: 'volketas.orders.read',
  },
  'volketas-calendar': {
    key: 'volketas-calendar',
    label: 'Volketas · Calendario',
    path: 'applications/calendar',
    group: 'Volketas',
    iconKey: 'calendar-days',
    menuVisibility: 'primary',
    order: 50,
    permissionHint: 'volketas.calendar.read',
  },
  'volketas-map': {
    key: 'volketas-map',
    label: 'Volketas · Mapa',
    path: 'maps',
    group: 'Volketas',
    iconKey: 'map',
    menuVisibility: 'primary',
    order: 60,
    permissionHint: 'volketas.map.read',
  },
  'volketas-customers': {
    key: 'volketas-customers',
    label: 'Volketas · Clientes',
    path: 'applications/management/customers',
    group: 'Volketas',
    iconKey: 'users-round',
    menuVisibility: 'primary',
    order: 70,
    permissionHint: 'volketas.customers.read',
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
