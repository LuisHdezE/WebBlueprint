import { describe, expect, it } from 'vitest';
import { templateNavigation, templateRouteItems } from '@/config/templateNavigation';

describe('templateNavigation', () => {
  it('keeps every registered route absolute and every non-Volketas route unique', () => {
    expect(templateRouteItems.every((route) => route.to.startsWith('/'))).toBe(true);

    const nonVolketasRoutes = templateNavigation
      .filter((section) => section.label !== 'Volketas')
      .flatMap((section) => section.items.map((item) => item.to));

    expect(new Set(nonVolketasRoutes).size).toBe(nonVolketasRoutes.length);
  });

  it('exposes the complete G1 master navigation families plus visible Volketas shell', () => {
    expect(templateNavigation.map((section) => section.label)).toEqual([
      'General',
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
    expect(templateRouteItems).toHaveLength(155);
  });

  it('exposes reusable management views to the Composer catalog', () => {
    const managementRoutes = templateNavigation
      .find((section) => section.label === 'Gestión')
      ?.items.filter((item) => item.to.startsWith('/applications/management/'))
      .map((item) => item.to);

    expect(managementRoutes).toEqual([
      '/applications/management/dashboard',
      '/applications/management/dispatch',
      '/applications/management/service-order',
      '/applications/management/alerts',
      '/applications/management/asset',
      '/applications/management/customers',
      '/applications/management/orders',
      '/applications/management/inventory',
    ]);
  });

  it('keeps Volketas visible while marking pending routes as planned', () => {
    const volketas = templateNavigation.find((section) => section.label === 'Volketas');
    expect(volketas).toBeDefined();

    const implementedRoutes = volketas?.items.filter((item) => item.status !== 'planned').map((item) => item.to);
    const plannedRoutes = volketas?.items.filter((item) => item.status === 'planned').map((item) => item.to);

    expect(implementedRoutes).toEqual([
      '/applications/management/dashboard',
      '/applications/management/orders',
      '/applications/management/service-order',
      '/applications/management/dispatch',
      '/applications/calendar',
      '/maps',
      '/applications/management/customers',
      '/applications/management/asset',
      '/applications/management/alerts',
      '/user/profile',
      '/user/account-settings',
    ]);
    expect(plannedRoutes).toContain('/volketas/requests');
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
