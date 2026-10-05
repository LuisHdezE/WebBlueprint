import { describe, expect, it } from 'vitest';
import { applicationRegistry, getApplicationBySlug, listPublicApplications } from './applicationRegistry';
import { leftMenuVariants } from '@/shell/shell.types';

describe('applicationRegistry', () => {
  it('keeps application slugs unique', () => {
    const slugs = applicationRegistry.map((application) => application.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('exposes promoted applications to the public catalog', () => {
    expect(listPublicApplications().every((application) => application.promoted)).toBe(true);
    expect(getApplicationBySlug('pet-shop')?.name).toBe('Pet Shop');
    expect(getApplicationBySlug('volketas')?.name).toBe('Volketas');
  });

  it('exposes Volketas as an operational composer preset', () => {
    const volketas = getApplicationBySlug('volketas');

    expect(volketas?.category).toBe('Logística operativa');
    expect(volketas?.capabilities).toEqual(['Dashboard', 'Dispatch', 'Orders', 'Scheduling', 'Map', 'Customers']);
    expect(volketas?.demoPages.map((page) => page.path)).toEqual([
      'applications/management/dashboard',
      'applications/management/dispatch',
      'applications/management/orders',
      'applications/calendar',
      'maps',
      'applications/management/customers',
    ]);
  });

  it('uses only governed left-menu variants', () => {
    expect(applicationRegistry.every((application) => leftMenuVariants.includes(application.shellVariant))).toBe(true);
  });

  it('provides at least one uniquely routed page for every demo', () => {
    for (const application of applicationRegistry) {
      const paths = application.demoPages.map((page) => page.path);
      expect(paths.length).toBeGreaterThan(0);
      expect(new Set(paths).size).toBe(paths.length);
    }
  });
});
