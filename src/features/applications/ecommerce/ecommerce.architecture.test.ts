import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('ecommerce architecture', () => {
  it('keeps canonical catalog out of presentation', () => {
    for (const file of ['ProductsPage.tsx', 'ProductStatus.tsx', 'ProductCard.tsx', 'ShopPage.tsx']) {
      const presentation = readFileSync(`src/features/applications/ecommerce/presentation/${file}`, 'utf8');
      expect(presentation).not.toContain('.json');
      expect(presentation).not.toContain('infrastructure/');
      expect(presentation).not.toContain('Auriculares Studio');
    }
  });

  it('reuses blueprint primitives across ecommerce surfaces', () => {
    const products = readFileSync('src/features/applications/ecommerce/presentation/ProductsPage.tsx', 'utf8');
    for (const primitive of ['DataTable', 'SearchField', 'SelectField', 'SurfaceCard']) expect(products).toContain(primitive);
    const shop = readFileSync('src/features/applications/ecommerce/presentation/ShopPage.tsx', 'utf8');
    for (const primitive of ['SearchField', 'SelectField', 'SurfaceCard', 'PageShell', 'ProductCard']) expect(shop).toContain(primitive);
  });

  it('keeps shop behind the ecommerce provider boundary', () => {
    const shop = readFileSync('src/features/applications/ecommerce/presentation/ShopPage.tsx', 'utf8');
    const contracts = readFileSync('src/features/applications/ecommerce/application/ecommerce.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/applications/ecommerce/infrastructure/JsonEcommerceCatalogProvider.ts', 'utf8');
    expect(shop).toContain('catalogProvider.getProducts()');
    expect(shop).toContain('catalogProvider.getShopView()');
    expect(contracts).toContain('getShopView(): ShopViewDto');
    expect(provider).toContain("import rawShopView from './shop.view.json'");
  });

  it('keeps explicit ecommerce routes before applications wildcard', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    for (const route of ['applications/ecommerce/products', 'applications/ecommerce/shop']) {
      expect(router.indexOf(`path="${route}"`)).toBeGreaterThan(-1);
      expect(router.indexOf(`path="${route}"`)).toBeLessThan(router.indexOf('templateFamilies.map'));
    }
  });
});
