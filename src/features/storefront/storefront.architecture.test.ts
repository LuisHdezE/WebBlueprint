import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('storefront architecture', () => {
  it('keeps storefront data behind a provider boundary', () => {
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');
    const listing = readFileSync('src/features/storefront/presentation/StorefrontProductListingPage.tsx', 'utf8');
    const detail = readFileSync('src/features/storefront/presentation/StorefrontProductDetailPage.tsx', 'utf8');
    const cart = readFileSync('src/features/storefront/presentation/StorefrontCartPage.tsx', 'utf8');
    const checkout = readFileSync('src/features/storefront/presentation/StorefrontCheckoutPage.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(provider).toContain("import rawStorefront from './storefront.view.json'");
    expect(provider).toContain("import rawCart from './storefront.cart.json'");
    expect(provider).toContain("import rawCheckout from './storefront.checkout.json'");
    expect(home).not.toContain('.json');
    expect(listing).not.toContain('.json');
    expect(detail).not.toContain('.json');
    expect(cart).not.toContain('.json');
    expect(checkout).not.toContain('.json');
    expect(shell).not.toContain('.json');
    expect(home).toContain('provider.getHomeView()');
    expect(listing).toContain('provider.getProductListingView()');
    expect(detail).toContain('provider.getProductDetailView()');
    expect(detail).toContain('provider.getProductDetailBySlug(slug)');
    expect(cart).toContain('provider.getCartView()');
    expect(checkout).toContain('provider.getCheckoutView()');
    expect(shell).toContain('provider.getShellView()');
  });

  it('uses a dedicated storefront shell outside admin and public shells', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const storefrontShell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(router).toContain('path="store"');
    expect(router).toContain('path="store/products"');
    expect(router).toContain('path="store/products/:slug"');
    expect(router).toContain('path="store/cart"');
    expect(router).toContain('path="store/checkout"');
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
    const checkout = readFileSync('src/features/storefront/presentation/StorefrontCheckoutPage.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(router).toContain('StorefrontHomePage');
    expect(router).toContain('StorefrontProductListingPage');
    expect(router).toContain('StorefrontProductDetailPage');
    expect(router).toContain('StorefrontCartPage');
    expect(router).toContain('StorefrontCheckoutPage');
    expect(home).not.toContain('JsonEcommerceCatalogProvider');
    expect(listing).not.toContain('JsonEcommerceCatalogProvider');
    expect(detail).not.toContain('JsonEcommerceCatalogProvider');
    expect(cart).not.toContain('JsonEcommerceCatalogProvider');
    expect(checkout).not.toContain('JsonEcommerceCatalogProvider');
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
    expect(home).toContain('data-storefront-product-card');
  });

  it('renders product listing skeleton from storefront DTOs without transactions', () => {
    const dto = readFileSync('src/features/storefront/application/storefront.dto.ts', 'utf8');
    const contracts = readFileSync('src/features/storefront/application/storefront.contracts.ts', 'utf8');
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const listing = readFileSync('src/features/storefront/presentation/StorefrontProductListingPage.tsx', 'utf8');

    expect(dto).toContain('StorefrontProductListingViewDto');
    expect(dto).toContain('StorefrontFilterOptionDto');
    expect(contracts).toContain('getProductListingView');
    expect(provider).toContain('getProductListingView()');
    expect(listing).toContain('listing.filters.map');
    expect(listing).toContain('listing.products.map');
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

  it('renders cart shell from storefront DTOs without persistence or checkout', () => {
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
    expect(cart).toContain('disabled type="button"');
    expect(cart).not.toContain('localStorage');
    expect(cart).not.toContain('sessionStorage');
    expect(cart).not.toContain('fetch(');
  });
});
