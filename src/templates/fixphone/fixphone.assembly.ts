export type FixPhoneAssemblySource = {
  id: string;
  purpose: string;
  roots: readonly string[];
};

export const fixPhoneAssembly = {
  targetDirectory: 'web',
  runtime: 'React + TypeScript + Vite',
  sourceRepository: 'LuisHdezE/WebBlueprint',
  sourceBaseline: '013175eeec66e9edf76fb032d9db6f297e38a490',
  routeFamilies: {
    operations: [
      '/apps/inventory/dashboard',
      '/apps/inventory/devices',
      '/apps/inventory/devices/new',
      '/apps/inventory/devices/evaluation',
    ],
    management: [
      '/applications/management/inventory',
      '/applications/management/customers',
      '/applications/management/orders',
    ],
    masterData: [
      '/admin/master-data/brands',
      '/admin/master-data/device-models',
      '/admin/master-data/categories',
      '/admin/master-data/colors',
      '/admin/master-data/storage-capacities',
      '/admin/master-data/ram-capacities',
      '/admin/master-data/conditions',
      '/admin/master-data/spare-part-types',
    ],
    storefront: [
      '/store',
      '/store/products',
      '/store/spare-parts',
      '/store/used-phones',
      '/store/brands',
      '/store/products/iphone-13-display-oled',
      '/store/cart',
      '/store/favorites',
      '/store/checkout',
      '/store/shipping',
      '/store/contact',
      '/store/warranty',
      '/store/account/sign-in',
      '/store/account/register',
    ],
    account: [
      '/user/profile',
      '/user/account-settings',
      '/authentication/sign-in',
      '/authentication/password-reset',
      '/authentication/two-factor',
    ],
  },
  sources: [
    {
      id: 'app-shell',
      purpose: 'Router, shell, navigation, icons and theme infrastructure required by selected views.',
      roots: ['src/app', 'src/shell', 'src/components', 'src/theme', 'src/styles'],
    },
    {
      id: 'inventory-devices',
      purpose: 'Operational device dashboard, intake, listing and evaluation.',
      roots: ['src/features/inventory'],
    },
    {
      id: 'master-data',
      purpose: 'Phone master-data admin views and their JSON-backed providers.',
      roots: ['src/features/master-data'],
    },
    {
      id: 'management',
      purpose: 'Reusable inventory, customers and order management views.',
      roots: ['src/inventory', 'src/customers', 'src/orders'],
    },
    {
      id: 'storefront',
      purpose: 'Public customer storefront, cart, checkout, shipping, warranty and customer identity.',
      roots: ['src/features/storefront'],
    },
    {
      id: 'authentication',
      purpose: 'Internal authentication screens currently backed by replaceable mock adapters.',
      roots: ['src/features/authentication', 'src/auth'],
    },
    {
      id: 'user',
      purpose: 'Profile and account settings.',
      roots: ['src/features/user'],
    },
  ] satisfies readonly FixPhoneAssemblySource[],
  excludedRoots: [
    'src/features/applications/ecommerce',
    'src/features/applications/blog',
    'src/features/applications/chat',
    'src/features/applications/contacts',
    'src/features/applications/calendar',
    'src/dispatch',
    'src/service-orders',
    'src/alerts-center',
    'src/assets',
  ],
  debtRoutes: [
    '/fixphone/admin/users',
    '/fixphone/catalog/products',
    '/fixphone/acquisition-lots',
    '/fixphone/consignments',
    '/fixphone/diagnoses',
    '/fixphone/repair-orders',
    '/fixphone/dismantling-orders',
    '/fixphone/inventory/locations',
    '/fixphone/inventory/counts',
    '/fixphone/finance/expenses',
    '/fixphone/finance/consignment-settlements',
    '/fixphone/warranty-claims',
    '/fixphone/reports/profitability',
    '/fixphone/reports/inventory-aging',
    '/fixphone/integrations',
    '/fixphone/audit',
  ],
} as const;

export const fixPhoneImplementedRoutes = Object.values(fixPhoneAssembly.routeFamilies).flat();
