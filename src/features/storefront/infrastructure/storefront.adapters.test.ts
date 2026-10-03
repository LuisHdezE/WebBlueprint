import { describe, expect, it } from 'vitest';
import { JsonStorefrontProvider } from './JsonStorefrontProvider';

describe('storefront provider', () => {
  it('exposes deterministic shell and home data', () => {
    const provider = new JsonStorefrontProvider();
    const shell = provider.getShellView();
    const home = provider.getHomeView();

    expect(shell.storeName).toBe('Elias Store Demo');
    expect(shell.primaryNav.map((item) => item.href)).toContain('/store');
    expect(shell.categoryNav).toHaveLength(4);
    expect(shell.utilityNav.map((item) => item.href)).toEqual(['/store/account', '/store/favorites', '/store/cart']);
    expect(shell.footerColumns.length).toBeGreaterThanOrEqual(2);
    expect(home.title).toContain('Storefront comercial');
    expect(home.ctas.map((cta) => cta.href)).toContain('/store/products');
    expect(home.featureTiles.map((tile) => tile.id)).toContain('admin-separated');
  });

  it('exposes provider-driven catalog home sections', () => {
    const provider = new JsonStorefrontProvider();
    const home = provider.getHomeView();

    expect(home.categorySection.title).toContain('Categorías');
    expect(home.categorySection.categories).toHaveLength(4);
    expect(home.categorySection.categories.map((category) => category.href)).toContain('/store/used-phones');
    expect(home.productSection.title).toContain('Cards comerciales');
    expect(home.productSection.products).toHaveLength(3);
    expect(home.productSection.products.map((product) => product.id)).toContain('product-iphone-13-display');
    expect(home.productSection.products.some((product) => product.compareLabel?.includes('Costo repuesto nuevo'))).toBe(true);
    expect(home.promoBand.title).toContain('registro');
  });

  it('exposes product listing skeleton data behind the storefront provider', () => {
    const provider = new JsonStorefrontProvider();
    const listing = provider.getProductListingView();

    expect(listing.title).toContain('Productos preparados');
    expect(listing.searchPlaceholder).toContain('Buscar');
    expect(listing.sortOptions.map((option) => option.id)).toEqual(['recommended', 'price-low', 'recent']);
    expect(listing.filters.map((filter) => filter.id)).toEqual(['category', 'brand-model', 'condition', 'price']);
    expect(listing.products).toHaveLength(6);
    expect(listing.products.map((product) => product.id)).toContain('listing-iphone-13-display');
    expect(listing.products.some((product) => product.compareLabel?.includes('Costo repuesto nuevo'))).toBe(true);
    expect(listing.listingNotice.title).toContain('visual');
  });

  it('exposes product detail skeleton data by slug', () => {
    const provider = new JsonStorefrontProvider();
    const detail = provider.getProductDetailView();
    const product = provider.getProductDetailBySlug('iphone-13-display-oled');

    expect(detail.backHref).toBe('/store/products');
    expect(detail.products).toHaveLength(3);
    expect(product?.title).toBe('Display OLED iPhone 13');
    expect(product?.compareLabel).toContain('Costo repuesto nuevo');
    expect(product?.stockLabel).toContain('Stock demo');
    expect(product?.specs.map((spec) => spec.label)).toContain('Modelo');
    expect(product?.notices.map((notice) => notice.id)).toContain('no-cart');
    expect(provider.getProductDetailBySlug('missing-demo-product')).toBeUndefined();
  });

  it('exposes cart shell data without transactional behavior', () => {
    const provider = new JsonStorefrontProvider();
    const cart = provider.getCartView();

    expect(cart.title).toContain('Carrito preparado');
    expect(cart.emptyState.title).toContain('carrito demo está vacío');
    expect(cart.lines).toHaveLength(2);
    expect(cart.lines.map((line) => line.id)).toContain('cart-line-display');
    expect(cart.summary.totalValue).toBe('UYU 6.580');
    expect(cart.summary.checkoutDisabledLabel).toBe('Checkout pendiente');
    expect(cart.notices.map((notice) => notice.id)).toEqual(['no-persistence', 'no-checkout', 'no-inventory-mutation']);
  });
});
