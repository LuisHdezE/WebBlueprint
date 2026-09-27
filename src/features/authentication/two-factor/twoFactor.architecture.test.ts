import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('two factor architecture boundary', () => {
  it('keeps presentation isolated from transport, persistence and infrastructure', () => {
    const source = readFileSync(new URL('./presentation/TwoFactorPage.tsx', import.meta.url), 'utf8');
    for (const forbidden of ['/infrastructure/', '.json', 'fetch(', 'localStorage', 'sessionStorage']) expect(source).not.toContain(forbidden);
  });
});
