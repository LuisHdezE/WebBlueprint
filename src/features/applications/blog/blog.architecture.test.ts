import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('blog architecture', () => {
  it('keeps governed content out of presentation', () => {
    for (const file of ['BlogListPage.tsx', 'BlogGridPage.tsx']) {
      const presentation = readFileSync(`src/features/applications/blog/presentation/${file}`, 'utf8');
      expect(presentation).not.toContain('.json');
      expect(presentation).not.toContain('infrastructure/');
      expect(presentation).not.toContain('Diseñar productos que crecen');
    }
  });

  it('reuses blog filters and post metadata across collection views', () => {
    const list = readFileSync('src/features/applications/blog/presentation/BlogListPage.tsx', 'utf8');
    const grid = readFileSync('src/features/applications/blog/presentation/BlogGridPage.tsx', 'utf8');
    for (const shared of ['BlogFilters', 'BlogPostAuthor', 'BlogPostStatus', 'filterBlogPosts', 'blogCategories']) {
      expect(list).toContain(shared);
      expect(grid).toContain(shared);
    }
  });

  it('keeps explicit blog routes before the applications wildcard', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const wildcardRouteIndex = router.indexOf('templateFamilies.map');
    expect(wildcardRouteIndex).toBeGreaterThan(-1);
    for (const route of ['applications/blog/list', 'applications/blog/grid']) {
      expect(router.indexOf(`path="${route}"`)).toBeGreaterThan(-1);
      expect(router.indexOf(`path="${route}"`)).toBeLessThan(wildcardRouteIndex);
    }
  });
});
