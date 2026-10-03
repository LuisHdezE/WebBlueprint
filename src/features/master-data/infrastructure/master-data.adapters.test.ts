import { describe, expect, it } from 'vitest';
import { JsonMasterDataProvider } from './JsonMasterDataProvider';

describe('master data JSON adapter', () => {
  it('exposes a deterministic canonical catalog', () => {
    const catalog = new JsonMasterDataProvider().getCatalog();
    expect(catalog.brands.map((brand) => brand.slug)).toEqual(['apple', 'samsung', 'xiaomi', 'motorola', 'huawei']);
    expect(catalog.deviceModels.length).toBeGreaterThanOrEqual(10);
    expect(catalog.categories.length).toBeGreaterThanOrEqual(10);
  });

  it('keeps ids unique across each master data collection', () => {
    const catalog = new JsonMasterDataProvider().getCatalog();
    expect(new Set(catalog.brands.map((brand) => brand.id)).size).toBe(catalog.brands.length);
    expect(new Set(catalog.deviceModels.map((model) => model.id)).size).toBe(catalog.deviceModels.length);
    expect(new Set(catalog.categories.map((category) => category.id)).size).toBe(catalog.categories.length);
  });

  it('links device models to canonical brands', () => {
    const catalog = new JsonMasterDataProvider().getCatalog();
    const brandIds = new Set(catalog.brands.map((brand) => brand.id));
    expect(catalog.deviceModels.every((model) => brandIds.has(model.brandId))).toBe(true);

    const apple = catalog.brands.find((brand) => brand.slug === 'apple');
    expect(apple).toBeDefined();
    expect(catalog.deviceModels.filter((model) => model.brandId === apple?.id).map((model) => model.name)).toEqual(['iPhone 11', 'iPhone 12', 'iPhone 12 Pro', 'iPhone 13']);
  });

  it('supports hierarchical storefront categories with more than two levels', () => {
    const catalog = new JsonMasterDataProvider().getCatalog();
    const categoryIds = new Set(catalog.categories.map((category) => category.id));
    expect(catalog.categories.every((category) => category.parentId === null || categoryIds.has(category.parentId))).toBe(true);

    const spareParts = catalog.categories.find((category) => category.slug === 'repuestos');
    const batteries = catalog.categories.find((category) => category.slug === 'baterias');
    const appleBatteries = catalog.categories.find((category) => category.slug === 'baterias-apple');
    expect(spareParts?.parentId).toBeNull();
    expect(batteries?.parentId).toBe(spareParts?.id);
    expect(appleBatteries?.parentId).toBe(batteries?.id);
  });

  it('exposes collection-specific provider methods from the same source', () => {
    const provider = new JsonMasterDataProvider();
    const catalog = provider.getCatalog();
    expect(provider.getBrands()).toBe(catalog.brands);
    expect(provider.getDeviceModels()).toBe(catalog.deviceModels);
    expect(provider.getCategories()).toBe(catalog.categories);
  });
});
