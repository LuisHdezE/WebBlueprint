import { describe, expect, it } from 'vitest';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('provides stable application identity and theme defaults', () => {
    expect(appConfig.name).toBe('WebBlueprint');
    expect(appConfig.defaultTheme.mode).toBe('light');
    expect(appConfig.defaultTheme.accent).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
