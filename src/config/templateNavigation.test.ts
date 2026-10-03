import { describe, expect, it } from 'vitest';
import { templateNavigation, templateRouteItems } from '@/config/templateNavigation';

describe('templateNavigation', () => {
  it('keeps every registered route unique and absolute', () => {
    const routes = templateRouteItems.map((item) => item.to);

    expect(new Set(routes).size).toBe(routes.length);
    expect(routes.every((route) => route.startsWith('/'))).toBe(true);
  });

  it('exposes the complete G1 master navigation families', () => {
    expect(templateNavigation.map((section) => section.label)).toEqual([
      'General',
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
    expect(templateRouteItems).toHaveLength(115);
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
