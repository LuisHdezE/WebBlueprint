import type { StorefrontCartViewDto, StorefrontCheckoutViewDto, StorefrontCustomerIdentityViewDto, StorefrontHomeViewDto, StorefrontProductDetailDto, StorefrontProductDetailViewDto, StorefrontProductListingViewDto, StorefrontShellViewDto, StorefrontViewDto } from './storefront.dto';

export interface StorefrontProvider {
  getStorefrontView(): StorefrontViewDto;
  getShellView(): StorefrontShellViewDto;
  getHomeView(): StorefrontHomeViewDto;
  getProductListingView(): StorefrontProductListingViewDto;
  getProductDetailView(): StorefrontProductDetailViewDto;
  getProductDetailBySlug(slug: string): StorefrontProductDetailDto | undefined;
  getCartView(): StorefrontCartViewDto;
  getCheckoutView(): StorefrontCheckoutViewDto;
  getCustomerIdentityView(): StorefrontCustomerIdentityViewDto;
}
