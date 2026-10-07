import type { StorefrontCartViewDto, StorefrontCatalogRouteViewDto, StorefrontCatalogViewDto, StorefrontCheckoutViewDto, StorefrontContactViewDto, StorefrontCustomerIdentityViewDto, StorefrontFavoritesViewDto, StorefrontHomeViewDto, StorefrontProductDetailDto, StorefrontProductDetailViewDto, StorefrontProductListingViewDto, StorefrontShellViewDto, StorefrontShippingViewDto, StorefrontViewDto, StorefrontWarrantyViewDto } from './storefront.dto';
import type { StorefrontPaymentViewDto } from './storefront.payment.dto';

export interface StorefrontProvider {
  getStorefrontView(): StorefrontViewDto;
  getShellView(): StorefrontShellViewDto;
  getHomeView(): StorefrontHomeViewDto;
  getProductListingView(): StorefrontProductListingViewDto;
  getCatalogView(): StorefrontCatalogViewDto;
  getCatalogRouteView(key: string): StorefrontCatalogRouteViewDto | undefined;
  getProductDetailView(): StorefrontProductDetailViewDto;
  getProductDetailBySlug(slug: string): StorefrontProductDetailDto | undefined;
  getCartView(): StorefrontCartViewDto;
  getCheckoutView(): StorefrontCheckoutViewDto;
  getPaymentView(): StorefrontPaymentViewDto;
  getCustomerIdentityView(): StorefrontCustomerIdentityViewDto;
  getShippingView(): StorefrontShippingViewDto;
  getFavoritesView(): StorefrontFavoritesViewDto;
  getContactView(): StorefrontContactViewDto;
  getWarrantyView(): StorefrontWarrantyViewDto;
}
