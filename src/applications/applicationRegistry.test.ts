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
