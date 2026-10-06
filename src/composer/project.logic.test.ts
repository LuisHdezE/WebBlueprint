import { describe, expect, it } from 'vitest';
import {
  applyProjectPreset,
  createDefaultProject,
  moveProjectView,
  sanitizeProject,
  toggleProjectView,
} from '@/composer/project.logic';
import { getPresetViewPresentation } from '@/composer/project.presets';

describe('project composer logic', () => {
  it('applies a preset as an editable view selection', () => {
    const presetProject = applyProjectPreset(createDefaultProject(), 'ecommerce');

    expect(presetProject.presetId).toBe('ecommerce');
    expect(presetProject.views).toContain('/applications/ecommerce/products');
    expect(presetProject.views).toContain('/applications/ecommerce/shop');

    const edited = toggleProjectView(presetProject, '/applications/ecommerce/editor');
    expect(edited.presetId).toBe('ecommerce');
    expect(edited.views).not.toContain('/applications/ecommerce/editor');
  });

  it('defines FixPhone as an editable MVP preset using implemented selectable views only', () => {
    const presetProject = applyProjectPreset(createDefaultProject(), 'fixphone');

    expect(presetProject.presetId).toBe('fixphone');
    expect(presetProject.theme.colorId).toBe('blue');
    expect(presetProject.views).toContain('/apps/inventory/devices');
    expect(presetProject.views).toContain('/admin/master-data/brands');
    expect(presetProject.views).toContain('/store/products');
    expect(presetProject.views).toContain('/store/cart');
    expect(presetProject.views).toContain('/applications/management/orders');
    expect(presetProject.views).not.toEqual(expect.arrayContaining([
      '/fixphone/repair-orders',
      '/fixphone/dismantling-orders',
      '/fixphone/integrations',
      '/applications/ecommerce/products',
      '/applications/ecommerce/shop',
    ]));

    const edited = toggleProjectView(presetProject, '/store/favorites');
    expect(edited.presetId).toBe('fixphone');
    expect(edited.views).not.toContain('/store/favorites');
  });

  it('keeps FixPhone-specific labels outside the generic view catalog', () => {
    expect(getPresetViewPresentation('fixphone', '/apps/inventory/dashboard')).toEqual({
      label: 'Panel operativo',
      section: 'Operación',
    });
    expect(getPresetViewPresentation('fixphone', '/store/products')).toEqual({
      label: 'Productos',
      section: 'Tienda online',
    });
    expect(getPresetViewPresentation('fixphone', '/applications/management/orders')).toEqual({
      label: 'Pedidos',
      section: 'Comercial',
    });
    expect(getPresetViewPresentation('crm', '/apps/inventory/dashboard')).toBeUndefined();
  });

  it('defines Volketas as an editable operational preset using selectable views only', () => {
    const presetProject = applyProjectPreset(createDefaultProject(), 'volketas');

    expect(presetProject.presetId).toBe('volketas');
    expect(presetProject.theme.colorId).toBe('volketas');
    expect(presetProject.views).toEqual([
      '/applications/management/dashboard',
      '/applications/management/dispatch',
      '/applications/management/orders',
      '/applications/management/service-order',
      '/applications/calendar',
      '/maps',
      '/applications/management/alerts',
      '/applications/management/customers',
      '/applications/management/asset',
      '/user/profile',
      '/user/account-settings',
      '/authentication/sign-in',
      '/authentication/password-reset',
      '/authentication/two-factor',
    ]);

    expect(presetProject.views).not.toEqual(expect.arrayContaining([
      '/applications/management/inventory',
      '/applications/tasks',
      '/applications/invoices/list',
      '/charts',
      '/widgets',
    ]));

    const edited = toggleProjectView(presetProject, '/applications/management/alerts');
    expect(edited.presetId).toBe('volketas');
    expect(edited.views).not.toContain('/applications/management/alerts');
  });

  it('keeps Volketas-specific labels outside the generic view catalog', () => {
    expect(getPresetViewPresentation('volketas', '/applications/management/dispatch')).toEqual({
      label: 'Despacho',
      section: 'Operaciones',
    });
    expect(getPresetViewPresentation('volketas', '/applications/management/asset')).toEqual({
      label: 'Activos',
      section: 'Activos',
    });
    expect(getPresetViewPresentation('crm', '/applications/management/dispatch')).toBeUndefined();
  });

  it('keeps the selected view sequence editable', () => {
    let project = createDefaultProject();
    project = toggleProjectView(project, '/applications/contacts');
    project = toggleProjectView(project, '/charts');

    expect(project.views).toEqual(['/dashboard', '/applications/contacts', '/charts']);

    project = moveProjectView(project, '/charts', -1);
    expect(project.views).toEqual(['/dashboard', '/charts', '/applications/contacts']);
  });

  it('blank preset clears the selected views without locking future edits', () => {
    let project = applyProjectPreset(createDefaultProject(), 'blank');
    expect(project.presetId).toBeNull();
    expect(project.views).toEqual([]);

    project = toggleProjectView(project, '/dashboard');
    expect(project.views).toEqual(['/dashboard']);
  });

  it('keeps reusable UI libraries outside the application-view selection', () => {
    const project = createDefaultProject();

    expect(toggleProjectView(project, '/components/cards')).toEqual(project);
    expect(toggleProjectView(project, '/elements/buttons')).toEqual(project);
    expect(toggleProjectView(project, '/forms/basic-inputs')).toEqual(project);
    expect(toggleProjectView(project, '/tables/basic')).toEqual(project);

    const sanitized = sanitizeProject({
      ...project,
      views: [
        '/dashboard',
        '/components/cards',
        '/elements/buttons',
        '/forms/basic-inputs',
        '/tables/basic',
      ],
    });

    expect(sanitized.views).toEqual(['/dashboard']);
  });
});
