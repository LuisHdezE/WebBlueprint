import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const presentationSource = readFileSync(
  new URL('./presentation/SignInPage.tsx', import.meta.url),
  'utf8',
);

describe('sign-in architecture boundary', () => {
  it('keeps presentation isolated from infrastructure concerns', () => {
    expect(presentationSource).not.toContain('/infrastructure/');
    expect(presentationSource).not.toContain('.json');
    expect(presentationSource).not.toContain('fetch(');
    expect(presentationSource).not.toContain('localStorage');
    expect(presentationSource).not.toContain('sessionStorage');
  });
});
