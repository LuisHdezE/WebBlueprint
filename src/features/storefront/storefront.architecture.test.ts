import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('storefront architecture', () => {
  it('keeps storefront data behind a provider boundary', () => {
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');
    const listing = readFileSync('src/features/storefront/presentation/StorefrontProductListingPage.tsx', 'utf8');
    const detail = readFileSync('src/features/storefront/presentation/StorefrontProductDetailPage.tsx', 'utf8');
    const cart = readFileSync('src/features/storefront/presentation/StorefrontCartPage.tsx', 'utf8');
    const catalog = readFileSync('src/features/storefront/presentation/StorefrontCatalogPage.tsx', 'utf8');
    const contact = readFileSync('src/features/storefront/presentation/StorefrontContactPage.tsx', 'utf8');
    const checkout = readFileSync('src/features/storefront/presentation/StorefrontCheckoutPage.tsx', 'utf8');
    const identity = readFileSync('src/features/storefront/presentation/StorefrontCustomerIdentityPage.tsx', 'utf8');
    const favorites = readFileSync('src/features/storefront/presentation/StorefrontFavoritesPage.tsx', 'utf8');
    const shipping = readFileSync('src/features/storefront/presentation/StorefrontShippingPage.tsx', 'utf8');
    const warranty = readFileSync('src/features/storefront/presentation/StorefrontWarrantyPage.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(provider).toContain("import rawStorefront from './storefront.view.json'");
    expect(provider).toContain("import rawCart from './storefront.cart.json'");
    expect(provider).toContain("import rawCheckout from './storefront.checkout.json'");
    expect(provider).toContain("import rawIdentity from './storefront.identity.json'");
    expect(home).not.toContain('.json');
    expect(listing).not.toContain('.json');
    expect(detail).not.toContain('.json');
    expect(cart).not.toContain('.json');
    expect(catalog).not.toContain('.json');
    expect(contact).not.toContain('.json');
    expect(checkout).not.toContain('.json');
    expect(identity).not.toContain('.json');
    expect(favorites).not.toContain('.json');
    expect(shipping).not.toContain('.json');
    expect(warranty).not.toContain('.json');
    expect(shell).not.toContain('.json');
    expect(home).toContain('provider.getHomeView()');
    expect(listing).toContain('provider.getProductListingView()');
    expect(detail).toContain('provider.getProductDetailView()');
    expect(detail).toContain('provider.getProductDetailBySlug(slug)');
    expect(cart).toContain('provider.getCartView()');
    expect(catalog).toContain('provider.getCatalogView()');
    expect(catalog).toContain('provider.getCatalogRouteView(resolvedKey)');
    expect(contact).toContain('provider.getContactView()');
    expect(checkout).toContain('provider.getCheckoutView()');
    expect(identity).toContain('provider.getCustomerIdentityView()');
    expect(favorites).toContain('provider.getFavoritesView()');
    expect(shipping).toContain('provider.getShippingView()');
    expect(warranty).toContain('provider.getWarrantyView()');
    expect(shell).toContain('provider.getShellView()');
  });

  it('uses a dedicated storefront shell outside admin and public shells', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const storefrontShell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(router).toContain('path="store"');
    expect(router).toContain('path="store/products"');
    expect(router).toContain('path="store/products/:slug"');
    expect(router).toContain('path="store/spare-parts"');
    expect(router).toContain('path="store/used-phones"');
    expect(router).toContain('path="store/brands"');
    expect(router).toContain('path="store/categories/:category"');
    expect(router).toContain('path="store/cart"');
    expect(router).toContain('path="store/checkout"');
    expect(router).toContain('path="store/shipping"');
    expect(router).toContain('path="store/warranty"');
    expect(router).toContain('path="store/account/sign-in"');
    expect(router).toContain('path="store/account/register"');
    expect(router).toContain('<StorefrontShell provider={storefrontProvider} />');
    expect(router.indexOf('<StorefrontShell provider={storefrontProvider} />')).toBeLessThan(router.indexOf('<TemplateShell />'));
    expect(storefrontShell).not.toContain('TemplateSidebar');
    expect(storefrontShell).not.toContain('TemplateTopbar');
    expect(storefrontShell).not.toContain('PublicShell');
  });

  it('keeps storefront free of legacy ecommerce coupling', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');
    const listing = readFileSync('src/features/storefront/presentation/StorefrontProductListingPage.tsx', 'utf8');
    const detail = readFileSync('src/features/storefront/presentation/StorefrontProductDetailPage.tsx', 'utf8');
    const cart = readFileSync('src/features/storefront/presentation/StorefrontCartPage.tsx', 'utf8');
    const catalog = readFileSync('src/features/storefront/presentation/StorefrontCatalogPage.tsx', 'utf8');
    const contact = readFileSync('src/features/storefront/presentation/StorefrontContactPage.tsx', 'utf8');
    const checkout = readFileSync('src/features/storefront/presentation/StorefrontCheckoutPage.tsx', 'utf8');
    const identity = readFileSync('src/features/storefront/presentation/StorefrontCustomerIdentityPage.tsx', 'utf8');
    const favorites = readFileSync('src/features/storefront/presentation/StorefrontFavoritesPage.tsx', 'utf8');
    const warranty = readFileSync('src/features/storefront/presentation/StorefrontWarrantyPage.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(router).toContain('StorefrontHomePage');
    expect(router).toContain('StorefrontProductListingPage');
    expect(router).toContain('StorefrontProductDetailPage');
    expect(router).toContain('StorefrontCartPage');
    expect(router).toContain('StorefrontCatalogPage');
    expect(router).toContain('StorefrontContactPage');
    expect(router).toContain('StorefrontCheckoutPage');
    expect(router).toContain('StorefrontCustomerIdentityPage');
    expect(router).toContain('StorefrontFavoritesPage');
    expect(router).toContain('StorefrontShippingPage');
    expect(router).toContain('StorefrontWarrantyPage');
    expect(home).not.toContain('JsonEcommerceCatalogProvider');
    expect(listing).not.toContain('JsonEcommerceCatalogProvider');
    expect(detail).not.toContain('JsonEcommerceCatalogProvider');
    expect(cart).not.toContain('JsonEcommerceCatalogProvider');
    expect(catalog).not.toContain('JsonEcommerceCatalogProvider');
    expect(contact).not.toContain('JsonEcommerceCatalogProvider');
    expect(checkout).not.toContain('JsonEcommerceCatalogProvider');
    expect(identity).not.toContain('JsonEcommerceCatalogProvider');
    expect(favorites).not.toContain('JsonEcommerceCatalogProvider');
    expect(warranty).not.toContain('JsonEcommerceCatalogProvider');
    expect(shell).not.toContain('JsonEcommerceCatalogProvider');
    expect(home).not.toContain('ProductsPage');
    expect(listing).not.toContain('ProductsPage');
    expect(detail).not.toContain('ProductsPage');
    expect(cart).not.toContain('ProductsPage');
    expect(shell).not.toContain('ShopPage');
  });

  it('renders catalog home sections from storefront DTOs', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');

    expect(dto).toContain('StorefrontCategoryCardDto');
    expect(dto).toContain('StorefrontProductCardDto');
    expect(dto).toContain('StorefrontPromoBandDto');
    expect(home).toContain('home.categorySection.categories.map');
    expect(home).toContain('home.productSection.products.map');
    expect(home).toContain('home.promoBand');
    expect(home).toContain('StorefrontProductCard');
    const productCard = readFileSync('src/features/storefront/presentation/StorefrontProductCard.tsx', 'utf8');
    expect(productCard).toContain('data-storefront-product-card');
  });

  it('renders product listing skeleton from storefront DTOs without transactions', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const listing = readFileSync('src/features/storefront/presentation/StorefrontProductListingPage.tsx', 'utf8');

    expect(dto).toContain('StorefrontProductListingViewDto');
    expect(dto).toContain('StorefrontFilterOptionDto');
    expect(dto).toContain('discoveryFacets?: Readonly<Record<string, string>>');
    expect(dto).toContain('discoverySortRanks?: Readonly<Record<string, number>>');
    expect(contracts).toContain('getProductListingView');
    expect(provider).toContain('getProductListingView()');
    expect(listing).toContain('listing.filters.map');
    expect(listing).toContain('discovery.products.map');
    expect(listing).toContain('discoverStorefrontProducts');
    expect(listing).toContain('data-storefront-discovery-search');
    expect(listing).toContain('data-storefront-discovery-count');
    expect(listing).toContain('data-storefront-discovery-clear');
    expect(listing).toContain('filterSelections');
    expect(listing).toContain('data-storefront-discovery-filter');
    expect(listing).toContain('setFilterSelections');
    expect(listing).toContain('data-storefront-discovery-sort');
    expect(listing).toContain('setSortId');
    expect(listing).not.toContain('aria-label="Ordenamiento pendiente"');
    expect(listing).not.toContain('localStorage');
    expect(listing).not.toContain('sessionStorage');
    expect(listing).not.toContain('Agregar al carrito');
  });

  it('renders product detail skeleton from storefront DTOs without transactions', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const detail = readFileSync('src/features/storefront/presentation/StorefrontProductDetailPage.tsx', 'utf8');

    expect(dto).toContain('StorefrontProductDetailDto');
    expect(dto).toContain('StorefrontProductDetailViewDto');
    expect(contracts).toContain('getProductDetailView');
    expect(contracts).toContain('getProductDetailBySlug');
    expect(provider).toContain('getProductDetailBySlug(slug: string)');
    expect(detail).toContain('useParams');
    expect(detail).toContain('data-storefront-product-detail');
    expect(detail).toContain('data-storefront-product-action-notice');
    expect(detail).not.toContain('localStorage');
    expect(detail).not.toContain('sessionStorage');
    expect(detail).not.toContain('Agregar al carrito');
  });

  it('renders customer identity skeleton separate from admin authentication', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const identity = readFileSync('src/features/storefront/presentation/StorefrontCustomerIdentityPage.tsx', 'utf8');
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');

    expect(dto).toContain('StorefrontCustomerIdentityViewDto');
    expect(contracts).toContain('getCustomerIdentityView');
    expect(provider).toContain('getCustomerIdentityView()');
    expect(identity).toContain('data-storefront-customer-identity');
    expect(identity).toContain("mode: 'sign-in' | 'register'");
    expect(identity).toContain('returnToCheckoutHref');
    expect(identity).not.toContain('SignInPage');
    expect(identity).not.toContain('SignUpPage');
    expect(identity).not.toContain('localStorage');
    expect(identity).not.toContain('sessionStorage');
    expect(identity).not.toContain('fetch(');
    expect(router).toContain('<StorefrontCustomerIdentityPage mode="sign-in"');
    expect(router).toContain('<StorefrontCustomerIdentityPage mode="register"');
  });

  it('renders checkout auth gate skeleton without payments, orders or persistence', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const checkout = readFileSync('src/features/storefront/presentation/StorefrontCheckoutPage.tsx', 'utf8');

    expect(dto).toContain('StorefrontCheckoutViewDto');
    expect(contracts).toContain('getCheckoutView');
    expect(provider).toContain('getCheckoutView()');
    expect(checkout).toContain('data-storefront-checkout');
    expect(checkout).toContain('data-storefront-checkout-auth-gate');
    expect(checkout).toContain('data-storefront-checkout-shipping');
    expect(checkout).toContain('data-storefront-checkout-payment');
    expect(checkout).toContain('Confirmar compra pendiente');
    expect(checkout).not.toContain('localStorage');
    expect(checkout).not.toContain('sessionStorage');
    expect(checkout).not.toContain('fetch(');
    expect(checkout).not.toContain('MercadoPago');
  });

  it('renders cart interaction from storefront DTOs without persistence or transactions', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const cart = readFileSync('src/features/storefront/presentation/StorefrontCartPage.tsx', 'utf8');

    expect(dto).toContain('StorefrontCartViewDto');
    expect(dto).toContain('StorefrontCartLineDto');
    expect(contracts).toContain('getCartView');
    expect(provider).toContain('getCartView()');
    expect(cart).toContain('data-storefront-cart');
    expect(cart).toContain('data-storefront-cart-empty-state');
    expect(cart).toContain('data-storefront-cart-summary');
    expect(cart).toContain('provider.getProductListingView()');
    expect(cart).toContain('text-[18px]');
    expect(cart).toContain('text-[12px]');
    expect(cart).toContain('grid-cols-[4.75rem_minmax(0,1fr)]');
    expect(cart).toContain('deriveStorefrontCart');
    expect(cart).toContain('getInitialCartQuantities');
    expect(cart).toContain('data-storefront-cart-increase');
    expect(cart).toContain('data-storefront-cart-decrease');
    expect(cart).toContain('data-storefront-cart-remove');
    expect(cart).toContain('data-storefront-cart-clear');
    expect(cart).toContain('data-storefront-cart-restore');
    expect(cart).toContain('data-storefront-cart-checkout');
    expect(cart).not.toContain('StorefrontPageIntro');
    expect(cart).not.toContain('rounded-2xl');
    expect(cart).not.toContain('shadow-sm');
    expect(cart).not.toContain('localStorage');
    expect(cart).not.toContain('sessionStorage');
    expect(cart).not.toContain('fetch(');
  });
  it('keeps every completed storefront view discoverable from the Blueprint sidebar', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const navigation = readFileSync('src/config/templateNavigation.ts', 'utf8');

    const routedStaticStorefrontPaths = [...router.matchAll(/path=["'](store(?:\/[^"']*)?)["']/g)]
      .map((match) => `/${match[1]}`)
      .filter((route) => !route.includes(':') && route !== '/store/account');

    expect(navigation).toContain("label: 'Tienda online'");
    routedStaticStorefrontPaths.forEach((route) => {
      expect(navigation).toContain(`to: '${route}'`);
    });

    // Dynamic Storefront routes require deterministic sidebar previews.
    expect(router).toContain('path="store/products/:slug"');
    expect(navigation).toContain("to: '/store/products/iphone-13-display-oled'");
    expect(router).toContain('path="store/categories/:category"');
    expect(navigation).toContain("to: '/store/categories/displays'");
    expect(navigation).toContain("to: '/store/categories/batteries'");
    expect(navigation).toContain("to: '/store/categories/charge-connectors'");
    expect(navigation).toContain("to: '/store/categories/accessories'");
  });

  it('keeps storefront visual density compact through shared primitives', () => {
    const primitives = readFileSync('src/features/storefront/presentation/StorefrontPrimitives.tsx', 'utf8');
    const pages = [
      'StorefrontHomePage.tsx',
      'StorefrontProductListingPage.tsx',
      'StorefrontProductDetailPage.tsx',
      'StorefrontCartPage.tsx',
      'StorefrontCheckoutPage.tsx',
      'StorefrontCustomerIdentityPage.tsx',
    ].map((file) => readFileSync(`src/features/storefront/presentation/${file}`, 'utf8'));

    expect(primitives).toContain('StorefrontPageIntro');
    expect(primitives).toContain('StorefrontSectionIntro');
    expect(primitives).toContain('text-2xl');
    expect(primitives).not.toContain('sm:text-4xl');
    expect(primitives).not.toContain('text-3xl');
    expect(pages[0]).toContain('StorefrontSectionIntro');
    expect(pages[1]).toContain('StorefrontPageIntro');
    expect(pages[4]).toContain('StorefrontPageIntro');
    expect(pages[5]).toContain('StorefrontPageIntro');

    pages.forEach((page) => {
      expect(page).not.toContain('text-6xl');
      expect(page).not.toContain('text-5xl');
      expect(page).not.toContain('text-4xl');
      expect(page).not.toContain('text-3xl');
      expect(page).not.toContain('rounded-[2rem]');
      expect(page).not.toContain('min-h-[28rem]');
    });
  });

  it('keeps Storefront theme and images provider-driven', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const data = readFileSync('src/features/storefront/infrastructure/storefront.view.json', 'utf8');
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');
    const listing = readFileSync('src/features/storefront/presentation/StorefrontProductListingPage.tsx', 'utf8');
    const productCard = readFileSync('src/features/storefront/presentation/StorefrontProductCard.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(dto).toContain('StorefrontThemeDto');
    expect(dto).toContain('StorefrontMediaDto');
    expect(dto).toContain('StorefrontHeroBannerDto');
    expect(dto).toContain('StorefrontFloatingActionDto');
    expect(data).toContain('"heroBanners"');
    expect(data).toContain('"floatingAction"');
    expect(home).toContain('home.heroBanners');
    expect(home).toContain('activeBanner.image.src');
    expect(home).toContain('StorefrontProductCard');
    expect(listing).toContain('StorefrontProductCard');
    expect(productCard).toContain('product.image.src');
    expect(shell).toContain('shell.theme.primary');
    expect(shell).toContain('shell.floatingAction');
    expect(home).not.toContain('images.unsplash.com');
    expect(listing).not.toContain('images.unsplash.com');
    expect(productCard).not.toContain('images.unsplash.com');
    expect(shell).not.toContain('#25D366');
  });

  it('uses one portrait-oriented product card component across home and listing', () => {
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');
    const listing = readFileSync('src/features/storefront/presentation/StorefrontProductListingPage.tsx', 'utf8');
    const productCard = readFileSync('src/features/storefront/presentation/StorefrontProductCard.tsx', 'utf8');

    expect(home).toContain('xl:grid-cols-4');
    expect(listing).toContain('xl:grid-cols-4');
    expect(home).toContain('<StorefrontProductCard');
    expect(listing).toContain('<StorefrontProductCard');
    expect(productCard).toContain('min-h-[360px]');
    expect(productCard).toContain('aspect-[4/3]');
    expect(productCard).not.toContain('text-xl');
    expect(productCard).not.toContain('text-2xl');
  });

  it('completes storefront catalog routes with one provider-driven reusable page', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const catalog = readFileSync('src/features/storefront/presentation/StorefrontCatalogPage.tsx', 'utf8');
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const navigation = readFileSync('src/config/templateNavigation.ts', 'utf8');

    expect(dto).toContain('StorefrontCatalogRouteViewDto');
    expect(dto).toContain('StorefrontCatalogViewDto');
    expect(contracts).toContain('getCatalogView');
    expect(contracts).toContain('getCatalogRouteView');
    expect(provider).toContain("import rawCatalog from './storefront.catalog.json'");
    expect(provider).toContain('productIds');
    expect(catalog).toContain('StorefrontProductCard');
    expect(catalog).toContain('useParams');
    expect(catalog).toContain('data-storefront-catalog-route');
    expect(catalog).toContain('data-storefront-catalog-products');
    expect(catalog).not.toContain('localStorage');
    expect(catalog).not.toContain('sessionStorage');
    expect(catalog).not.toContain('fetch(');
    expect(router).toContain('routeKey="spare-parts"');
    expect(router).toContain('routeKey="used-phones"');
    expect(router).toContain('routeKey="brands"');
    expect(router).toContain('path="store/categories/:category"');
    expect(navigation).toContain("to: '/store/spare-parts'");
    expect(navigation).toContain("to: '/store/used-phones'");
    expect(navigation).toContain("to: '/store/brands'");
  });

  it('renders shipping zone skeleton without persistence, carrier integration or order mutation', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const shipping = readFileSync('src/features/storefront/presentation/StorefrontShippingPage.tsx', 'utf8');
    const navigation = readFileSync('src/config/templateNavigation.ts', 'utf8');

    expect(dto).toContain('StorefrontShippingViewDto');
    expect(dto).toContain('StorefrontShippingZoneDto');
    expect(contracts).toContain('getShippingView');
    expect(provider).toContain('getShippingView()');
    expect(provider).toContain("import rawShipping from './storefront.shipping.json'");
    expect(shipping).toContain('data-storefront-shipping');
    expect(shipping).toContain('data-storefront-shipping-zones');
    expect(shipping).toContain('data-storefront-shipping-address');
    expect(shipping).not.toContain('localStorage');
    expect(shipping).not.toContain('sessionStorage');
    expect(shipping).not.toContain('fetch(');
    expect(navigation).toContain("to: '/store/shipping'");
  });

  it('renders favorites skeleton without persistence, customer mutation or cart mutation', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const favorites = readFileSync('src/features/storefront/presentation/StorefrontFavoritesPage.tsx', 'utf8');
    const navigation = readFileSync('src/config/templateNavigation.ts', 'utf8');

    expect(dto).toContain('StorefrontFavoritesViewDto');
    expect(contracts).toContain('getFavoritesView');
    expect(provider).toContain('getFavoritesView()');
    expect(provider).toContain("import rawFavorites from './storefront.favorites.json'");
    expect(favorites).toContain('data-storefront-favorites');
    expect(favorites).toContain('data-storefront-favorites-products');
    expect(favorites).toContain('StorefrontProductCard');
    expect(favorites).not.toContain('localStorage');
    expect(favorites).not.toContain('sessionStorage');
    expect(favorites).not.toContain('fetch(');
    expect(navigation).toContain("to: '/store/favorites'");
  });

  it('renders contact landing skeleton without messaging API or client persistence', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const contact = readFileSync('src/features/storefront/presentation/StorefrontContactPage.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');
    const navigation = readFileSync('src/config/templateNavigation.ts', 'utf8');

    expect(dto).toContain('StorefrontContactViewDto');
    expect(dto).toContain('StorefrontContactChannelDto');
    expect(contracts).toContain('getContactView');
    expect(provider).toContain('getContactView()');
    expect(provider).toContain("import rawContact from './storefront.contact.json'");
    expect(contact).toContain('data-storefront-contact');
    expect(contact).toContain('data-storefront-contact-channels');
    expect(contact).toContain('data-storefront-contact-service');
    expect(contact).not.toContain('localStorage');
    expect(contact).not.toContain('sessionStorage');
    expect(contact).not.toContain('fetch(');
    expect(contact).not.toContain('https://wa.me');
    expect(shell).toContain('shell.floatingAction.href');
    expect(navigation).toContain("to: '/store/contact'");
  });

  it('renders warranty and returns skeleton without requests, order lookup or inventory mutation', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const warranty = readFileSync('src/features/storefront/presentation/StorefrontWarrantyPage.tsx', 'utf8');
    const navigation = readFileSync('src/config/templateNavigation.ts', 'utf8');

    expect(dto).toContain('StorefrontWarrantyViewDto');
    expect(dto).toContain('StorefrontWarrantyPolicyDto');
    expect(contracts).toContain('getWarrantyView');
    expect(provider).toContain('getWarrantyView()');
    expect(provider).toContain("import rawWarranty from './storefront.warranty.json'");
    expect(warranty).toContain('data-storefront-warranty');
    expect(warranty).toContain('data-storefront-warranty-policies');
    expect(warranty).toContain('data-storefront-warranty-eligibility');
    expect(warranty).not.toContain('localStorage');
    expect(warranty).not.toContain('sessionStorage');
    expect(warranty).not.toContain('fetch(');
    expect(navigation).toContain("to: '/store/warranty'");
  });

});
