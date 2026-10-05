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
    expect(shell.theme.primary).toBe('#16a34a');
    expect(shell.theme.primary).not.toBe('#000000');
    expect(shell.floatingAction.icon).toBe('whatsapp');
    expect(shell.floatingAction.href).toBe('/store/contact');
    expect(home.title).toContain('Storefront comercial');
    expect(home.ctas.map((cta) => cta.href)).toContain('/store/products');
    expect(home.featureTiles.map((tile) => tile.id)).toContain('admin-separated');
    expect(home.heroBanners).toHaveLength(3);
    expect(home.heroBanners.every((banner) => banner.image.src.startsWith('https://'))).toBe(true);
    expect(home.heroBanners.every((banner) => banner.image.alt.length > 0)).toBe(true);
  });

  it('exposes provider-driven catalog home sections', () => {
    const provider = new JsonStorefrontProvider();
    const home = provider.getHomeView();

    expect(home.categorySection.title).toContain('Categorías');
    expect(home.categorySection.categories).toHaveLength(4);
    expect(home.categorySection.categories.map((category) => category.href)).toContain('/store/used-phones');
    expect(home.productSection.title).toContain('Cards comerciales');
    expect(home.productSection.products).toHaveLength(4);
    expect(home.productSection.products.map((product) => product.id)).toContain('product-iphone-13-display');
    expect(home.productSection.products.some((product) => product.compareLabel?.includes('Costo repuesto nuevo'))).toBe(true);
    expect(home.productSection.products.every((product) => product.image.src.startsWith('https://'))).toBe(true);
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
    expect(listing.products.every((product) => product.image.alt.length > 0)).toBe(true);
    expect(listing.products.every((product) => product.discoveryFacets?.category)).toBe(true);
    expect(listing.products.every((product) => product.discoveryFacets?.['brand-model'])).toBe(true);
    expect(listing.products.every((product) => product.discoveryFacets?.condition)).toBe(true);
    expect(listing.products.every((product) => product.discoveryFacets?.price)).toBe(true);
    expect(listing.products.every((product) => product.discoverySortRanks?.recommended)).toBe(true);
    expect(listing.products.every((product) => product.discoverySortRanks?.['price-low'])).toBe(true);
    expect(listing.products.every((product) => product.discoverySortRanks?.recent)).toBe(true);
    expect(listing.listingNotice.title).toContain('visual');
  });

  it('resolves catalog route variants from the shared product listing', () => {
    const provider = new JsonStorefrontProvider();
    const catalog = provider.getCatalogView();
    const spareParts = provider.getCatalogRouteView('spare-parts');
    const usedPhones = provider.getCatalogRouteView('used-phones');
    const displays = provider.getCatalogRouteView('category:displays');

    expect(catalog.navigation).toHaveLength(7);
    expect(catalog.routes).toHaveLength(7);
    expect(spareParts?.products).toHaveLength(4);
    expect(spareParts?.products.map((product) => product.id)).toContain('listing-iphone-13-display');
    expect(usedPhones?.products.map((product) => product.id)).toEqual(['listing-iphone-12-used', 'listing-used-galaxy']);
    expect(displays?.products.map((product) => product.id)).toEqual(['listing-iphone-13-display']);
    expect(provider.getCatalogRouteView('category:missing')).toBeUndefined();
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

  it('exposes customer identity skeleton data without authentication state', () => {
    const provider = new JsonStorefrontProvider();
    const identity = provider.getCustomerIdentityView();

    expect(identity.returnToCheckoutHref).toBe('/store/checkout');
    expect(identity.signIn.fields.map((field) => field.id)).toEqual(['email', 'password']);
    expect(identity.register.fields.map((field) => field.id)).toEqual(['name', 'email', 'phone', 'password']);
    expect(identity.signIn.alternateHref).toBe('/store/account/register');
    expect(identity.register.alternateHref).toBe('/store/account/sign-in');
    expect(identity.notices.map((notice) => notice.id)).toEqual(['storefront-only', 'no-session', 'no-persistence']);
  });

  it('exposes warranty and returns policies without creating requests', () => {
    const provider = new JsonStorefrontProvider();
    const warranty = provider.getWarrantyView();

    expect(warranty.policies.map((policy) => policy.id)).toEqual(['warranty', 'returns']);
    expect(warranty.eligibility.rows).toHaveLength(3);
    expect(warranty.links.contactHref).toBe('/store/contact');
    expect(warranty.links.productsHref).toBe('/store/products');
    expect(warranty.notices.map((notice) => notice.id)).toEqual([
      'no-return-request',
      'no-order-lookup',
      'no-inventory-mutation',
    ]);
  });

  it('exposes contact channels without messaging or form persistence', () => {
    const provider = new JsonStorefrontProvider();
    const contact = provider.getContactView();

    expect(contact.channels.map((channel) => channel.id)).toEqual(['whatsapp', 'email']);
    expect(contact.service.hours).toHaveLength(3);
    expect(contact.links.productsHref).toBe('/store/products');
    expect(contact.links.shippingHref).toBe('/store/shipping');
    expect(contact.notices.map((notice) => notice.id)).toEqual([
      'no-messaging-api',
      'no-form-submit',
      'provider-driven',
    ]);
  });

  it('exposes favorites without customer persistence or cart mutation', () => {
    const provider = new JsonStorefrontProvider();
    const favorites = provider.getFavoritesView();

    expect(favorites.products).toHaveLength(3);
    expect(favorites.products.map((product) => product.id)).toEqual([
      'favorite-display',
      'favorite-battery',
      'favorite-used-phone',
    ]);
    expect(favorites.emptyState.actionHref).toBe('/store/products');
    expect(favorites.notices.map((notice) => notice.id)).toEqual([
      'no-persistence',
      'no-customer-mutation',
      'no-cart-mutation',
    ]);
  });

  it('exposes shipping zones without delivery persistence or order mutation', () => {
    const provider = new JsonStorefrontProvider();
    const shipping = provider.getShippingView();

    expect(shipping.zones).toHaveLength(4);
    expect(shipping.zones.map((zone) => zone.id)).toEqual([
      'montevideo-centro',
      'montevideo-metropolitana',
      'canelones-sur',
      'interior',
    ]);
    expect(shipping.pickup.priceLabel).toBe('Sin costo');
    expect(shipping.returnToCheckoutHref).toBe('/store/checkout');
    expect(shipping.addressPreview.fields).toHaveLength(3);
    expect(shipping.notices.map((notice) => notice.id)).toEqual([
      'no-address-persistence',
      'no-carrier',
      'no-order-mutation',
    ]);
  });

  it('exposes checkout auth gate data without transactional behavior', () => {
    const provider = new JsonStorefrontProvider();
    const checkout = provider.getCheckoutView();

    expect(checkout.title).toContain('Revisa la compra');
    expect(checkout.authGate.requiredLabel).toContain('Autenticación');
    expect(checkout.authGate.signInHref).toBe('/store/account/sign-in');
    expect(checkout.authGate.signUpHref).toBe('/store/account/register');
    expect(checkout.orderSummary.totalValue).toBe('UYU 6.580');
    expect(checkout.shipping.statusLabel).toContain('disponibles');
    expect(checkout.shipping.actionHref).toBe('/store/shipping');
    expect(checkout.payment.options.map((option) => option.id)).toEqual(['mercado-pago', 'card', 'whatsapp']);
    expect(checkout.notices.map((notice) => notice.id)).toEqual(['no-order', 'no-inventory', 'no-persistence']);
  });

  it('exposes interactive cart source data without transactional behavior', () => {
    const provider = new JsonStorefrontProvider();
    const cart = provider.getCartView();

    expect(cart.title).toContain('interacción local');
    expect(cart.emptyState.title).toContain('carrito demo está vacío');
    expect(cart.lines).toHaveLength(2);
    expect(cart.lines.map((line) => line.id)).toContain('cart-line-display');
    expect(cart.lines.every((line) => line.initialQuantity === 1)).toBe(true);
    expect(cart.lines.every((line) => line.maxQuantity > 1)).toBe(true);
    expect(cart.lines.every((line) => line.currencyCode === 'UYU')).toBe(true);
    expect(cart.lines.every((line) => line.unitPriceMinor > 0)).toBe(true);
    expect(cart.summary.totalValue).toBe('UYU 6.580');
    expect(cart.summary.checkoutDisabledLabel).toBe('Continuar al checkout');
    expect(cart.summary.checkoutPreviewHref).toBe('/store/checkout');
    expect(cart.notices.map((notice) => notice.id)).toEqual(['no-persistence', 'no-checkout', 'no-inventory-mutation']);
  });
});
