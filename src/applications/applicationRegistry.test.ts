import { describe, expect, it } from 'vitest';
import { applicationRegistry, getApplicationBySlug, listPublicApplications } from './applicationRegistry';

describe('applicationRegistry', () => {
  it('keeps application slugs unique', () => {
    const slugs = applicationRegistry.map((application) => application.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('exposes promoted applications to the public catalog', () => {
    expect(listPublicApplications().every((application) => application.promoted)).toBe(true);
    expect(getApplicationBySlug('pet-shop')?.name).toBe('Pet Shop');
  });
});
