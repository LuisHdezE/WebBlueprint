import { describe, expect, it } from 'vitest';
import { templateNavigation, templateRouteItems } from '@/config/templateNavigation';

describe('templateNavigation', () => {
  it('keeps every registered route absolute and every non-vertical route unique', () => {
    expect(templateRouteItems.every((route) => route.to.startsWith('/'))).toBe(true);

    const nonVolketasRoutes = templateNavigation
      .filter((section) => !['Volketas', 'FixPhone'].includes(section.label))
      .flatMap((section) => section.items.map((item) => item.to));

    expect(new Set(nonVolketasRoutes).size).toBe(nonVolketasRoutes.length);
  });

  it('exposes the complete G1 master navigation families plus visible Volketas shell', () => {
    expect(templateNavigation.map((section) => section.label)).toEqual([
      'General',
      'FixPhone',
      'Volketas',
      'Gestión',
      'Inventario',
      'Master Data',
      'Tienda online',
      'Aplicaciones',
      'Componentes',
      'Elementos',
      'Formularios',
      'Tablas',
      'Visualización',
      'Páginas',
      'Usuario',
      'Autenticación',
      'Layouts',
      'Documentación',
    ]);
    expect(templateRouteItems).toHaveLength(202);
  });

  it('exposes reusable management views to the Composer catalog', () => {
    const managementRoutes = templateNavigation
      .find((section) => section.label === 'Gestión')
      ?.items.filter((item) => item.to.startsWith('/applications/management/'))
      .map((item) => item.to);

    expect(managementRoutes).toEqual([
      '/applications/management/dashboard',
      '/applications/management/dispatch',
      '/applications/management/customers',
      '/applications/management/orders',
      '/applications/management/inventory',
    ]);
  });

  it('keeps FixPhone visible while separating implemented views from debt', () => {
    const fixphone = templateNavigation.find((section) => section.label === 'FixPhone');
    expect(fixphone).toBeDefined();

    const implementedRoutes = fixphone?.items.filter((item) => item.status !== 'planned').map((item) => item.to);
    const plannedRoutes = fixphone?.items.filter((item) => item.status === 'planned').map((item) => item.to);

    expect(implementedRoutes).toContain('/apps/inventory/devices/new');
    expect(implementedRoutes).toContain('/admin/master-data/brands');
    expect(implementedRoutes).toContain('/store/products');
    expect(implementedRoutes).toContain('/applications/management/orders');
    expect(plannedRoutes).toContain('/fixphone/repair-orders');
    expect(plannedRoutes).toContain('/fixphone/dismantling-orders');
    expect(plannedRoutes).toContain('/fixphone/admin/users');
    expect(plannedRoutes).toContain('/fixphone/integrations');
  });

  it('keeps Volketas visible while marking pending routes as planned', () => {
    const volketas = templateNavigation.find((section) => section.label === 'Volketas');
    expect(volketas).toBeDefined();

    const implementedRoutes = volketas?.items.filter((item) => item.status !== 'planned').map((item) => item.to);
    const plannedRoutes = volketas?.items.filter((item) => item.status === 'planned').map((item) => item.to);

    expect(implementedRoutes).toEqual([
      '/applications/management/dashboard',
      '/applications/management/orders',
      '/applications/management/dispatch',
      '/applications/calendar',
      '/maps',
      '/applications/management/customers',
      '/user/profile',
      '/user/account-settings',
    ]);
    expect(plannedRoutes).toContain('/volketas/requests');
    expect(plannedRoutes).toContain('/applications/management/service-order');
    expect(plannedRoutes).toContain('/applications/management/alerts');
    expect(plannedRoutes).toContain('/applications/management/asset');
  });

  it('exposes the extended master data routes added in A4', () => {
    const masterDataRoutes = templateRouteItems.filter((item) => item.to.startsWith('/admin/master-data/')).map((item) => item.to);

    expect(masterDataRoutes).toEqual([
      '/admin/master-data/brands',
      '/admin/master-data/device-models',
      '/admin/master-data/categories',
      '/admin/master-data/colors',
      '/admin/master-data/storage-capacities',
      '/admin/master-data/ram-capacities',
      '/admin/master-data/conditions',
      '/admin/master-data/spare-part-types',
    ]);
  });
});
