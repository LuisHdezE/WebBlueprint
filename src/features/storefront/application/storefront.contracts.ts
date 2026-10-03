import type { StorefrontCartViewDto, StorefrontCheckoutViewDto, StorefrontCustomerIdentityViewDto, StorefrontFavoritesViewDto, StorefrontHomeViewDto, StorefrontProductDetailDto, StorefrontProductDetailViewDto, StorefrontProductListingViewDto, StorefrontShellViewDto, StorefrontShippingViewDto, StorefrontViewDto } from './storefront.dto';

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
  getShippingView(): StorefrontShippingViewDto;
  getFavoritesView(): StorefrontFavoritesViewDto;
}
