import type { MasterDataBrandDto, MasterDataCatalogDto, MasterDataCategoryDto, MasterDataDeviceModelDto } from './master-data.dto';

export interface MasterDataProvider {
  getCatalog(): MasterDataCatalogDto;
  getBrands(): readonly MasterDataBrandDto[];
  getDeviceModels(): readonly MasterDataDeviceModelDto[];
  getCategories(): readonly MasterDataCategoryDto[];
}
