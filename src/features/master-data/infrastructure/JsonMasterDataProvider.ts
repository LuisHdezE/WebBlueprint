import rawCatalog from './master-data.catalog.json';
import type { MasterDataProvider } from '../application/master-data.contracts';
import type { MasterDataBrandDto, MasterDataCatalogDto, MasterDataCategoryDto, MasterDataDeviceModelDto } from '../application/master-data.dto';

function assertUniqueIds(items: readonly { id: string }[], label: string): void {
  const ids = new Set(items.map((item) => item.id));
  if (ids.size !== items.length) throw new Error(`Master data ${label} contains duplicated ids.`);
}

function assertRequiredCollection<T>(items: readonly T[], label: string): void {
  if (!items.length) throw new Error(`Master data ${label} collection is empty.`);
}

export class JsonMasterDataProvider implements MasterDataProvider {
  private readonly catalog: MasterDataCatalogDto;

  constructor() {
    this.catalog = rawCatalog as MasterDataCatalogDto;
    this.validateCatalog(this.catalog);
  }

  getCatalog(): MasterDataCatalogDto {
    return this.catalog;
  }

  getBrands(): readonly MasterDataBrandDto[] {
    return this.catalog.brands;
  }

  getDeviceModels(): readonly MasterDataDeviceModelDto[] {
    return this.catalog.deviceModels;
  }

  getCategories(): readonly MasterDataCategoryDto[] {
    return this.catalog.categories;
  }

  private validateCatalog(catalog: MasterDataCatalogDto): void {
    assertRequiredCollection(catalog.brands, 'brands');
    assertRequiredCollection(catalog.deviceModels, 'device models');
    assertRequiredCollection(catalog.categories, 'categories');
    assertUniqueIds(catalog.brands, 'brands');
    assertUniqueIds(catalog.deviceModels, 'device models');
    assertUniqueIds(catalog.categories, 'categories');

    const brandIds = new Set(catalog.brands.map((brand) => brand.id));
    const categoryIds = new Set(catalog.categories.map((category) => category.id));

    for (const model of catalog.deviceModels) {
      if (!brandIds.has(model.brandId)) throw new Error(`Master data device model ${model.id} references an unknown brand.`);
      if (!model.name || !model.slug) throw new Error(`Master data device model ${model.id} is incomplete.`);
    }

    for (const brand of catalog.brands) {
      if (!brand.name || !brand.slug) throw new Error(`Master data brand ${brand.id} is incomplete.`);
    }

    for (const category of catalog.categories) {
      if (!category.name || !category.slug) throw new Error(`Master data category ${category.id} is incomplete.`);
      if (category.parentId && !categoryIds.has(category.parentId)) throw new Error(`Master data category ${category.id} references an unknown parent.`);
    }
  }
}
