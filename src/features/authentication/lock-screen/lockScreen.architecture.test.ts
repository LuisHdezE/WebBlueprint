import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
describe('lock screen architecture boundary', () => { it('keeps presentation isolated from infrastructure', () => { const source = readFileSync(new URL('./presentation/LockScreenPage.tsx', import.meta.url), 'utf8'); for (const forbidden of ['/infrastructure/', '.json', 'fetch(', 'localStorage', 'sessionStorage']) expect(source).not.toContain(forbidden); }); });
