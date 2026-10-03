import type { MasterDataBrandDto, MasterDataCatalogDto, MasterDataCategoryDto, MasterDataDeviceModelDto } from './master-data.dto';
import type { MasterDataAdminViewDto, MasterDataAdminViewKind, MasterDataAdminViewsDto } from './master-data-admin.dto';

export interface MasterDataProvider {
  getCatalog(): MasterDataCatalogDto;
  getBrands(): readonly MasterDataBrandDto[];
  getDeviceModels(): readonly MasterDataDeviceModelDto[];
  getCategories(): readonly MasterDataCategoryDto[];
}

export interface MasterDataAdminViewProvider {
  getViews(): MasterDataAdminViewsDto;
  getView(kind: MasterDataAdminViewKind): MasterDataAdminViewDto;
}
