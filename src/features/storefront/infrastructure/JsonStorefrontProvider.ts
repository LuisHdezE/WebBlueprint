import rawCart from './storefront.cart.json';
import rawCheckout from './storefront.checkout.json';
import rawContact from './storefront.contact.json';
import rawIdentity from './storefront.identity.json';
import rawFavorites from './storefront.favorites.json';
import rawStorefront from './storefront.view.json';
import rawShipping from './storefront.shipping.json';
import type { StorefrontProvider } from '../application/storefront.contracts';
import type { StorefrontCartViewDto, StorefrontCheckoutViewDto, StorefrontContactViewDto, StorefrontCustomerIdentityViewDto, StorefrontFavoritesViewDto, StorefrontHomeViewDto, StorefrontProductDetailDto, StorefrontProductDetailViewDto, StorefrontProductListingViewDto, StorefrontShellViewDto, StorefrontShippingViewDto, StorefrontViewDto } from '../application/storefront.dto';

export class JsonStorefrontProvider implements StorefrontProvider {
  getStorefrontView(): StorefrontViewDto {
    const view = {
      ...(rawStorefront as Omit<StorefrontViewDto, 'cart' | 'checkout' | 'customerIdentity' | 'shipping' | 'favorites' | 'contact'>),
      cart: rawCart as StorefrontCartViewDto,
      checkout: rawCheckout as StorefrontCheckoutViewDto,
      contact: rawContact as StorefrontContactViewDto,
      customerIdentity: rawIdentity as StorefrontCustomerIdentityViewDto,
      favorites: rawFavorites as StorefrontFavoritesViewDto,
      shipping: rawShipping as StorefrontShippingViewDto,
    } as StorefrontViewDto;

    if (
      !view.shell?.storeName
      || !view.shell.primaryNav.length
      || !view.shell.categoryNav.length
      || !view.shell.theme?.primary
      || !view.shell.floatingAction?.href
      || !view.home?.title
      || !view.home.ctas.length
      || !view.home.heroBanners.length
      || !view.home.heroBanners.every((banner) => banner.image?.src && banner.image.alt)
      || !view.productListing?.title
      || !view.productListing.products.length
      || !view.productListing.filters.length
      || !view.productDetail?.products.length
      || !view.productDetail.notFound.title
      || !view.cart?.title
      || !view.cart.emptyState.title
      || !view.cart.summary.items.length
      || !view.checkout?.title
      || !view.checkout.authGate.requiredLabel
      || !view.checkout.payment.options.length
      || !view.customerIdentity?.signIn.fields.length
      || !view.customerIdentity.register.fields.length
      || !view.shipping?.zones.length
      || !view.shipping.addressPreview.fields.length
      || !view.favorites?.products.length
      || !view.favorites.emptyState.title
      || !view.contact?.channels.length
      || !view.contact.service.hours.length
    ) {
      throw new Error('Storefront demo data is incomplete.');
    }
    return view;
  }

  getShellView(): StorefrontShellViewDto {
    return this.getStorefrontView().shell;
  }

  getHomeView(): StorefrontHomeViewDto {
    return this.getStorefrontView().home;
  }

  getProductListingView(): StorefrontProductListingViewDto {
    return this.getStorefrontView().productListing;
  }

  getProductDetailView(): StorefrontProductDetailViewDto {
    return this.getStorefrontView().productDetail;
  }

  getProductDetailBySlug(slug: string): StorefrontProductDetailDto | undefined {
    return this.getProductDetailView().products.find((product) => product.slug === slug);
  }

  getCartView(): StorefrontCartViewDto {
    return this.getStorefrontView().cart;
  }

  getCheckoutView(): StorefrontCheckoutViewDto {
    return this.getStorefrontView().checkout;
  }

  getCustomerIdentityView(): StorefrontCustomerIdentityViewDto {
    return this.getStorefrontView().customerIdentity;
  }

  getShippingView(): StorefrontShippingViewDto {
    return this.getStorefrontView().shipping;
  }

  getFavoritesView(): StorefrontFavoritesViewDto {
    return this.getStorefrontView().favorites;
  }

  getContactView(): StorefrontContactViewDto {
    return this.getStorefrontView().contact;
  }
}
