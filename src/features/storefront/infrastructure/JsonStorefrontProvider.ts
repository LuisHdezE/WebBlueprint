import rawStorefront from './storefront.view.json';
import type { StorefrontProvider } from '../application/storefront.contracts';
import type { StorefrontHomeViewDto, StorefrontProductDetailDto, StorefrontProductDetailViewDto, StorefrontProductListingViewDto, StorefrontShellViewDto, StorefrontViewDto } from '../application/storefront.dto';

export class JsonStorefrontProvider implements StorefrontProvider {
  getStorefrontView(): StorefrontViewDto {
    const view = rawStorefront as StorefrontViewDto;
    if (
      !view.shell?.storeName
      || !view.shell.primaryNav.length
      || !view.shell.categoryNav.length
      || !view.home?.title
      || !view.home.ctas.length
      || !view.productListing?.title
      || !view.productListing.products.length
      || !view.productListing.filters.length
      || !view.productDetail?.products.length
      || !view.productDetail.notFound.title
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
}
