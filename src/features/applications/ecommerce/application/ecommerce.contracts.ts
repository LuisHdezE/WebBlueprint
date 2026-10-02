import type { ProductDetailViewDto } from './detail.dto';
import type { ProductDto, ProductsViewDto } from './ecommerce.dto';
import type { ShopViewDto } from './shop.dto';

export interface EcommerceCatalogProvider {
  getProducts(): readonly [ProductDto, ...ProductDto[]];
  getProductsView(): ProductsViewDto;
  getShopView(): ShopViewDto;
  getProductDetailView(): ProductDetailViewDto;
}
