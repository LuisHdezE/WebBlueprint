import { describe, expect, it } from 'vitest';
import { componentDocumentation } from '@/documentation/documentation.catalog';

describe('component documentation catalog', () => {
  it('keeps ids and source paths unique', () => {
    const ids = componentDocumentation.map((entry) => entry.id);
    const sourcePaths = componentDocumentation.map((entry) => entry.sourcePath);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(sourcePaths).size).toBe(sourcePaths.length);
  });

  it('documents real source paths and at least one governed variant', () => {
    for (const entry of componentDocumentation) {
      expect(entry.sourcePath.startsWith('src/')).toBe(true);
      expect(entry.variants.length).toBeGreaterThan(0);
      expect(entry.states.length).toBeGreaterThan(0);
      expect(entry.example.length).toBeGreaterThan(0);
    }
  });

  it('keeps prop names unique inside each component contract', () => {
    for (const entry of componentDocumentation) {
      const propNames = entry.props.map((prop) => prop.name);
      expect(new Set(propNames).size).toBe(propNames.length);
    }
  });
});
