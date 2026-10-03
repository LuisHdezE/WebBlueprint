import type { StorefrontHomeViewDto, StorefrontProductListingViewDto, StorefrontShellViewDto, StorefrontViewDto } from './storefront.dto';

export interface StorefrontProvider {
  getStorefrontView(): StorefrontViewDto;
  getShellView(): StorefrontShellViewDto;
  getHomeView(): StorefrontHomeViewDto;
  getProductListingView(): StorefrontProductListingViewDto;
}
