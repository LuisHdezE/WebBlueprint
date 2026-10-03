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
    for (const primitive of ['DataTable', 'DonutChartCard', 'FunnelChartCard', 'MetricCard', 'StatusBadge', 'SurfaceCard', 'TrendChartCard', 'PageShell']) expect(page).toContain(primitive);
  });

  it('keeps analytics drawing inside shared primitives', () => {
    const page = readFileSync('src/features/inventory/presentation/InventoryDashboardPage.tsx', 'utf8');
    expect(page).not.toContain('<svg');
    expect(page).toContain('dashboard.analytics.trend');
    expect(page).toContain('dashboard.analytics.distribution');
    expect(page).toContain('dashboard.analytics.funnel');
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

  it('keeps device intake demo data outside presentation', () => {
    for (const file of ['InventoryDevicesPage.tsx', 'InventoryDeviceIntakePage.tsx']) {
      const page = readFileSync(`src/features/inventory/presentation/${file}`, 'utf8');
      expect(page).not.toContain('.json');
      expect(page).not.toContain('infrastructure/');
      expect(page).not.toContain('iPhone 12');
      expect(page).not.toContain("'Pending Evaluation'");
      expect(page).not.toContain("'Donor'");
      expect(page).not.toContain("'Refurbish'");
    }
  });

  it('reuses shared table and form primitives for device intake', () => {
    const list = readFileSync('src/features/inventory/presentation/InventoryDevicesPage.tsx', 'utf8');
    expect(list).toContain('DataTable');
    expect(list).toContain('StatusBadge');
    expect(list).not.toContain('<table');

    const intake = readFileSync('src/features/inventory/presentation/InventoryDeviceIntakePage.tsx', 'utf8');
    for (const primitive of ['TextField', 'SelectField', 'TextAreaField', 'SurfaceCard', 'PageShell']) expect(intake).toContain(primitive);
  });

  it('extends the provider boundary for devices and intake', () => {
    const contracts = readFileSync('src/features/inventory/application/inventory.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/inventory/infrastructure/JsonInventoryDemoProvider.ts', 'utf8');
    expect(contracts).toContain('getDevicesView(): InventoryDevicesViewDto');
    expect(contracts).toContain('getDeviceIntakeView(): InventoryDeviceIntakeViewDto');
    expect(provider).toContain("import rawDevices from './inventory.devices.json'");
  });

  it('registers device intake routes before generic apps routes', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    for (const route of ['apps/inventory/devices', 'apps/inventory/devices/new']) {
      expect(router).toContain(`path="${route}"`);
      expect(router.indexOf(`path="${route}"`)).toBeLessThan(router.indexOf('path="apps/:slug"'));
    }
  });
});