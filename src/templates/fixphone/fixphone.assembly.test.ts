import { describe, expect, it } from 'vitest';
import { getProjectPreset } from '@/composer/project.presets';
import { fixPhoneAssembly, fixPhoneImplementedRoutes } from '@/templates/fixphone/fixphone.assembly';

describe('FixPhone source assembly', () => {
  it('matches the exact implemented preset route selection', () => {
    const preset = getProjectPreset('fixphone');
    expect(preset).toBeDefined();
    expect(fixPhoneImplementedRoutes).toEqual(preset?.viewPaths);
  });

  it('keeps product debt outside the executable assembly', () => {
    expect(fixPhoneAssembly.debtRoutes.length).toBeGreaterThan(0);
    expect(fixPhoneImplementedRoutes).not.toEqual(expect.arrayContaining(fixPhoneAssembly.debtRoutes));
  });

  it('excludes generic demo families that would duplicate or contaminate FixPhone', () => {
    expect(fixPhoneAssembly.excludedRoots).toContain('src/features/applications/ecommerce');
    expect(fixPhoneAssembly.excludedRoots).toContain('src/service-orders');
    expect(fixPhoneAssembly.excludedRoots).toContain('src/assets');
  });

  it('targets a standalone web client inside the FixPhone repository', () => {
    expect(fixPhoneAssembly.targetDirectory).toBe('web');
    expect(fixPhoneAssembly.runtime).toBe('React + TypeScript + Vite');
  });
});
