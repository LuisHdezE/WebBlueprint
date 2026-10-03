export interface MasterDataBrandDto {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  active: boolean;
  sortOrder: number;
}

export interface MasterDataDeviceModelDto {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  modelCode: string | null;
  active: boolean;
  sortOrder: number;
}

export interface MasterDataCategoryDto {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string;
  imageOrIcon: string | null;
  active: boolean;
  showInStorefront: boolean;
  sortOrder: number;
}

export interface MasterDataCatalogDto {
  brands: readonly MasterDataBrandDto[];
  deviceModels: readonly MasterDataDeviceModelDto[];
  categories: readonly MasterDataCategoryDto[];
}
