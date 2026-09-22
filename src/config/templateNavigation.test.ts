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
    expect(templateRouteItems).toHaveLength(96);
  });
});
