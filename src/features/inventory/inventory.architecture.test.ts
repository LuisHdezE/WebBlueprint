import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('inventory foundation architecture', () => {
  it('keeps demo data outside presentation', () => {
    const page = readFileSync('src/features/inventory/presentation/InventoryDashboardPage.tsx', 'utf8');
    expect(page).not.toContain('.json');
    expect(page).not.toContain('infrastructure/');
    expect(page).not.toContain('iPhone 12');
    expect(page).toContain('provider.getDashboard()');
  });

  it('reuses blueprint primitives instead of duplicating them', () => {
    const page = readFileSync('src/features/inventory/presentation/InventoryDashboardPage.tsx', 'utf8');
    for (const primitive of ['DataTable', 'MetricCard', 'StatusBadge', 'SurfaceCard', 'PageShell']) expect(page).toContain(primitive);
  });

  it('uses the shared DataTable for the operational queue', () => {
    const page = readFileSync('src/features/inventory/presentation/InventoryDashboardPage.tsx', 'utf8');
    expect(page).not.toContain('<table');
    expect(page).toContain('searchable');
    expect(page).toContain('selectable');
    expect(page).toContain('dashboard.queueFilters');
    expect(page).not.toContain("value: 'Pending Evaluation'");
    expect(page).not.toContain("value: 'Partially Dismantled'");
  });

  it('keeps inventory behind an application provider boundary', () => {
    const contracts = readFileSync('src/features/inventory/application/inventory.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/inventory/infrastructure/JsonInventoryDemoProvider.ts', 'utf8');
    expect(contracts).toContain('getDashboard(): InventoryDashboardDto');
    expect(provider).toContain("import rawDashboard from './inventory.dashboard.json'");
  });

  it('registers the real inventory dashboard route before generic apps routes', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    expect(router).toContain('path="apps/inventory/dashboard"');
    expect(router.indexOf('path="apps/inventory/dashboard"')).toBeLessThan(router.indexOf('path="apps/:slug"'));
  });
});
