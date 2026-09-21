import { describe, expect, it } from 'vitest';
import { applicationRegistry } from '@/applications/applicationRegistry';
import { pageRegistry } from '@/applications/pageRegistry';

describe('page registry', () => {
  it('keeps registry keys, page keys and paths stable and unique', () => {
    const entries = Object.entries(pageRegistry);
    const paths = entries.map(([, page]) => page.path);

    expect(new Set(paths).size).toBe(paths.length);

    for (const [key, page] of entries) {
      expect(page.key).toBe(key);
      expect(page.label.length).toBeGreaterThan(0);
      expect(page.iconKey.length).toBeGreaterThan(0);
      expect(page.group.length).toBeGreaterThan(0);
    }
  });

  it('builds application demo metadata from the shared registry', () => {
    for (const application of applicationRegistry) {
      for (const demoPage of application.demoPages) {
        const page = pageRegistry[demoPage.pageKey];
        expect(demoPage.label).toBe(page.label);
        expect(demoPage.path).toBe(page.path);
        expect(demoPage.iconKey).toBe(page.iconKey);
        expect(demoPage.group).toBe(page.group);
      }
    }
  });
});
