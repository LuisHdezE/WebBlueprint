import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('master data architecture', () => {
  it('keeps canonical DTOs free of feature-specific projections', () => {
    const dto = readFileSync('src/features/master-data/application/master-data.dto.ts', 'utf8');
    for (const name of ['MasterDataBrandDto', 'MasterDataDeviceModelDto', 'MasterDataCategoryDto', 'MasterDataCatalogDto']) expect(dto).toContain(name);
    expect(dto).not.toContain('InventoryBrandDto');
    expect(dto).not.toContain('EcommerceBrandDto');
    expect(dto).not.toContain('StoreBrandDto');
  });

  it('keeps JSON imports inside infrastructure only', () => {
    const contracts = readFileSync('src/features/master-data/application/master-data.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/master-data/infrastructure/JsonMasterDataProvider.ts', 'utf8');
    const adminProvider = readFileSync('src/features/master-data/infrastructure/JsonMasterDataAdminViewProvider.ts', 'utf8');
    expect(contracts).not.toContain('.json');
    expect(contracts).not.toContain('infrastructure/');
    expect(provider).toContain("import rawCatalog from './master-data.catalog.json'");
    expect(adminProvider).toContain("import rawViews from './master-data-admin.view.json'");
  });

  it('exposes one shared provider for brands, models and categories', () => {
    const contracts = readFileSync('src/features/master-data/application/master-data.contracts.ts', 'utf8');
    expect(contracts).toContain('export interface MasterDataProvider');
    expect(contracts).toContain('getCatalog(): MasterDataCatalogDto');
    expect(contracts).toContain('getBrands(): readonly MasterDataBrandDto[]');
    expect(contracts).toContain('getDeviceModels(): readonly MasterDataDeviceModelDto[]');
    expect(contracts).toContain('getCategories(): readonly MasterDataCategoryDto[]');
  });

  it('models Brand -> DeviceModel and Category parent hierarchy explicitly', () => {
    const dto = readFileSync('src/features/master-data/application/master-data.dto.ts', 'utf8');
    expect(dto).toContain('brandId: string');
    expect(dto).toContain('parentId: string | null');
    expect(dto).toContain('showInStorefront: boolean');
  });

  it('keeps admin presentation behind provider boundaries', () => {
    const page = readFileSync('src/features/master-data/presentation/MasterDataAdminPages.tsx', 'utf8');
    expect(page).not.toContain('.json');
    expect(page).not.toContain('infrastructure/');
    expect(page).toContain('masterDataProvider.getBrands()');
    expect(page).toContain("viewProvider.getView('brands')");
    expect(page).toContain('DataTable');
    expect(page).not.toContain('<table');
  });

  it('registers admin master data routes before generic public apps routes', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    for (const route of ['admin/master-data/brands', 'admin/master-data/device-models', 'admin/master-data/categories']) {
      expect(router).toContain(`path="${route}"`);
      expect(router.indexOf(`path="${route}"`)).toBeLessThan(router.indexOf('path="apps/:slug"'));
    }
  });
});
