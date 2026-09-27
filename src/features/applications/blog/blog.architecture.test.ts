import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('blog architecture', () => {
  it('keeps governed content out of presentation', () => {
    const presentation = readFileSync('src/features/applications/blog/presentation/BlogListPage.tsx', 'utf8');
    expect(presentation).not.toContain('.json');
    expect(presentation).not.toContain('infrastructure/');
    expect(presentation).not.toContain('Diseñar productos que crecen');
  });

  it('keeps the explicit route before the applications wildcard', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    expect(router.indexOf('path="applications/blog/list"')).toBeGreaterThan(-1);
    expect(router.indexOf('path="applications/blog/list"')).toBeLessThan(router.indexOf("'applications/*'"));
  });
});
