import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const base = baseUrl.replace(/\/$/, '');
  const targetUrl = `${base}/store/products`;
  const detailUrl = `${base}/store/products/iphone-13-display-oled`;
  const cartUrl = `${base}/store/cart`;
  const favoritesUrl = `${base}/store/favorites`;
  const checkoutUrl = `${base}/store/checkout`;
  const shippingUrl = `${base}/store/shipping`;
  const contactUrl = `${base}/store/contact`;
  const warrantyUrl = `${base}/store/warranty`;
  const sparePartsUrl = `${base}/store/spare-parts`;
  const usedPhonesUrl = `${base}/store/used-phones`;
  const brandsUrl = `${base}/store/brands`;
  const displaysUrl = `${base}/store/categories/displays`;
  const batteriesUrl = `${base}/store/categories/batteries`;
  const chargeConnectorsUrl = `${base}/store/categories/charge-connectors`;
  const accessoriesUrl = `${base}/store/categories/accessories`;
  const signInUrl = `${base}/store/account/sign-in`;
  const registerUrl = `${base}/store/account/register`;
  const checks = [], failures = [];
  let chrome, cdp;
  const check = (name, passed, details) => {
    checks.push({ name, status: passed ? 'PASS' : 'FAIL', details });
    if (!passed) failures.push(name);
  };
  const shot = async (name) => {
    const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    writeFileSync(join(artifactDir, name), Buffer.from(result.data, 'base64'));
  };
  mkdirSync(artifactDir, { recursive: true });

  try {
    const response = await fetch(targetUrl);
    check('Storefront products deep link responds successfully', response.ok, { status: response.status, targetUrl });
    const detailResponse = await fetch(detailUrl);
    check('Storefront product detail deep link responds successfully', detailResponse.ok, { status: detailResponse.status, detailUrl });
    const cartResponse = await fetch(cartUrl);
    check('Storefront cart deep link responds successfully', cartResponse.ok, { status: cartResponse.status, cartUrl });
    const favoritesResponse = await fetch(favoritesUrl);
    check('Storefront favorites deep link responds successfully', favoritesResponse.ok, { status: favoritesResponse.status, favoritesUrl });
    const checkoutResponse = await fetch(checkoutUrl);
    check('Storefront checkout deep link responds successfully', checkoutResponse.ok, { status: checkoutResponse.status, checkoutUrl });
    const shippingResponse = await fetch(shippingUrl);
    check('Storefront shipping deep link responds successfully', shippingResponse.ok, { status: shippingResponse.status, shippingUrl });
    const contactResponse = await fetch(contactUrl);
    check('Storefront contact deep link responds successfully', contactResponse.ok, { status: contactResponse.status, contactUrl });
    const warrantyResponse = await fetch(warrantyUrl);
    check('Storefront warranty deep link responds successfully', warrantyResponse.ok, { status: warrantyResponse.status, warrantyUrl });
    for (const [name, url] of [
      ['spare parts', sparePartsUrl],
      ['used phones', usedPhonesUrl],
      ['brands', brandsUrl],
      ['displays category', displaysUrl],
      ['batteries category', batteriesUrl],
      ['charge connectors category', chargeConnectorsUrl],
      ['accessories category', accessoriesUrl],
    ]) {
      const catalogResponse = await fetch(url);
      check(`Storefront ${name} deep link responds successfully`, catalogResponse.ok, { status: catalogResponse.status, url });
    }
    const signInResponse = await fetch(signInUrl);
    check('Storefront customer sign-in deep link responds successfully', signInResponse.ok, { status: signInResponse.status, signInUrl });
    const registerResponse = await fetch(registerUrl);
    check('Storefront customer register deep link responds successfully', registerResponse.ok, { status: registerResponse.status, registerUrl });

    chrome = await launchChrome();
    cdp = await connectCdp(chrome.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await setViewport(cdp, { width: 1365, height: 768 });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-product-listing]'))");

    const desktop = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      listing: Boolean(document.querySelector('[data-storefront-product-listing]')),
      title: document.querySelector('[data-storefront-product-listing] h1')?.textContent ?? '',
      notice: document.querySelector('[data-storefront-listing-notice]')?.textContent ?? '',
      filters: document.querySelectorAll('[data-storefront-listing-filters] fieldset').length,
      searchInputs: document.querySelectorAll('[data-storefront-product-listing] input[type="search"]').length,
      sortControls: document.querySelectorAll('[data-storefront-product-listing] select').length,
      productCards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      productImages: [...document.querySelectorAll('[data-storefront-listing-product-image]')].filter((image) => image.getAttribute('src')?.startsWith('https://') && image.getAttribute('alt')).length,
      productText: document.querySelector('[data-storefront-product-listing]')?.textContent ?? '',
      headingFontPx: parseFloat(getComputedStyle(document.querySelector('[data-storefront-product-listing] h1')).fontSize),
      firstCardTop: document.querySelector('[data-storefront-listing-product-card]')?.getBoundingClientRect().top ?? 9999,
      cardRects: [...document.querySelectorAll('[data-storefront-listing-product-card]')].slice(0, 4).map((card) => {
        const rect = card.getBoundingClientRect();
        return { top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) };
      }),
      addToCartButtons: [...document.querySelectorAll('[data-storefront-listing-product-card] button')].filter((button) => button.textContent?.includes('Agregar')).length,
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);

    check('Storefront product listing renders inside storefront shell', desktop.shell && desktop.listing, desktop);
    check('Storefront product listing hero renders', desktop.title.includes('Productos preparados'), desktop);
    check('Storefront product listing exposes visual filters', desktop.filters === 4 && desktop.searchInputs >= 1 && desktop.sortControls === 1, desktop);
    check('Storefront product listing renders demo products', desktop.productCards === 6 && desktop.productText.includes('Display OLED iPhone 13'), desktop);
    check('Storefront product listing renders provider-driven images', desktop.productImages === 6, desktop);
    check('Storefront product listing shows replacement cost labels', desktop.productText.includes('Costo repuesto nuevo'), desktop);
    check('Storefront product listing states non-transactional scope', desktop.notice.includes('Listado visual') && desktop.notice.includes('incrementos posteriores'), desktop);
    check('Storefront product listing has no add-to-cart behavior yet', desktop.addToCartButtons === 0, desktop);
    check('Storefront product listing avoids admin sidebar', !desktop.adminSidebar, desktop);
    check('Storefront product listing avoids public blueprint header copy', !desktop.publicShellBrand, desktop);
    check('Storefront product listing uses compact heading scale', desktop.headingFontPx <= 26, desktop);
    check('Storefront product cards start high enough for commercial density', desktop.firstCardTop < 620, desktop);
    check('Storefront listing shows four cards on the first desktop row', desktop.cardRects.length === 4 && desktop.cardRects.every((card) => Math.abs(card.top - desktop.cardRects[0].top) <= 2), desktop);
    check('Storefront listing cards are portrait-oriented', desktop.cardRects.every((card) => card.height > card.width), desktop);
    check('Storefront product listing desktop avoids horizontal overflow', !desktop.overflow, desktop);
    await shot('storefront-products-desktop.png');

    await evaluate(cdp, `(() => {
      const input = document.querySelector('[data-storefront-discovery-search]');
      if (!(input instanceof HTMLInputElement)) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(input, 'galaxy s21');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-listing-product-card]').length === 1");
    const searched = await evaluate(cdp, `({
      cards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      text: document.querySelector('[data-storefront-discovery-results]')?.textContent ?? '',
      count: document.querySelector('[data-storefront-discovery-count]')?.textContent ?? '',
      clearVisible: Boolean(document.querySelector('[data-storefront-discovery-clear]'))
    })`);
    check('Storefront discovery search filters products in memory', searched.cards === 1 && searched.text.includes('Batería Samsung S21') && searched.count.includes('1 de 6') && searched.clearVisible, searched);

    await evaluate(cdp, `(() => {
      const input = document.querySelector('[data-storefront-discovery-search]');
      if (!(input instanceof HTMLInputElement)) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(input, 'pixel 99');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-listing-empty-state]'))");
    const emptySearch = await evaluate(cdp, `({
      cards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      empty: document.querySelector('[data-storefront-listing-empty-state]')?.textContent ?? '',
      count: document.querySelector('[data-storefront-discovery-count]')?.textContent ?? ''
    })`);
    check('Storefront discovery exposes real zero-result state', emptySearch.cards === 0 && emptySearch.empty.includes('Sin resultados demo') && emptySearch.count.includes('0 de 6'), emptySearch);

    await evaluate(cdp, `document.querySelector('[data-storefront-listing-empty-state] button')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-listing-product-card]').length === 6");
    const clearedSearch = await evaluate(cdp, `({
      value: document.querySelector('[data-storefront-discovery-search]')?.value ?? 'missing',
      cards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      count: document.querySelector('[data-storefront-discovery-count]')?.textContent ?? ''
    })`);
    check('Storefront discovery clear restores the full listing', clearedSearch.value === '' && clearedSearch.cards === 6 && clearedSearch.count.includes('6 de 6'), clearedSearch);

    await evaluate(cdp, `document.querySelector('[data-storefront-discovery-filter="category"] input[value="used-phones"]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-listing-product-card]').length === 2");
    const categoryFilter = await evaluate(cdp, `({
      cards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      count: document.querySelector('[data-storefront-discovery-count]')?.textContent ?? '',
      summary: document.querySelector('[data-storefront-discovery-summary]')?.textContent ?? '',
      usedChecked: document.querySelector('[data-storefront-discovery-filter="category"] input[value="used-phones"]')?.checked ?? false
    })`);
    check('Storefront discovery category filter narrows provider-driven products', categoryFilter.cards === 2 && categoryFilter.count.includes('2 de 6') && categoryFilter.summary.includes('1 filtro activo') && categoryFilter.usedChecked, categoryFilter);

    await evaluate(cdp, `document.querySelector('[data-storefront-discovery-filter="brand-model"] input[value="iphone-12"]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-listing-product-card]').length === 1");
    const combinedFilters = await evaluate(cdp, `({
      cards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      text: document.querySelector('[data-storefront-discovery-results]')?.textContent ?? '',
      count: document.querySelector('[data-storefront-discovery-count]')?.textContent ?? '',
      summary: document.querySelector('[data-storefront-discovery-summary]')?.textContent ?? ''
    })`);
    check('Storefront discovery combines filters with AND semantics', combinedFilters.cards === 1 && combinedFilters.text.includes('iPhone 12 128 GB usado') && combinedFilters.count.includes('1 de 6') && combinedFilters.summary.includes('2 filtros activos'), combinedFilters);

    await evaluate(cdp, `document.querySelector('[data-storefront-discovery-clear]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-listing-product-card]').length === 6");
    const clearedFilters = await evaluate(cdp, `({
      cards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      categoryAll: document.querySelector('[data-storefront-discovery-filter="category"] input[value="all"]')?.checked ?? false,
      brandAll: document.querySelector('[data-storefront-discovery-filter="brand-model"] input[value="all"]')?.checked ?? false,
      clearVisible: Boolean(document.querySelector('[data-storefront-discovery-clear]'))
    })`);
    check('Storefront discovery clear resets all filters', clearedFilters.cards === 6 && clearedFilters.categoryAll && clearedFilters.brandAll && !clearedFilters.clearVisible, clearedFilters);

    await evaluate(cdp, `(() => {
      const select = document.querySelector('[data-storefront-discovery-sort]');
      if (!(select instanceof HTMLSelectElement)) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
      setter?.call(select, 'price-low');
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    })()`);
    await waitFor(cdp, "document.querySelector('[data-storefront-discovery-sort]')?.value === 'price-low'");
    const priceSorted = await evaluate(cdp, `({
      firstCard: document.querySelector('[data-storefront-listing-product-card]')?.textContent ?? '',
      sortValue: document.querySelector('[data-storefront-discovery-sort]')?.value ?? '',
      summary: document.querySelector('[data-storefront-discovery-summary]')?.textContent ?? '',
      clearVisible: Boolean(document.querySelector('[data-storefront-discovery-clear]'))
    })`);
    check('Storefront discovery sorts by provider-driven price rank', priceSorted.firstCard.includes('Conector de carga Xiaomi Redmi Note') && priceSorted.sortValue === 'price-low' && priceSorted.summary.includes('Menor precio') && priceSorted.clearVisible, priceSorted);

    await evaluate(cdp, `document.querySelector('[data-storefront-discovery-filter="category"] input[value="spare-parts"]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-listing-product-card]').length === 4");
    const sortedFiltered = await evaluate(cdp, `({
      cards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      firstCard: document.querySelector('[data-storefront-listing-product-card]')?.textContent ?? '',
      sortValue: document.querySelector('[data-storefront-discovery-sort]')?.value ?? ''
    })`);
    check('Storefront discovery composes sorting with active filters', sortedFiltered.cards === 4 && sortedFiltered.firstCard.includes('Conector de carga Xiaomi Redmi Note') && sortedFiltered.sortValue === 'price-low', sortedFiltered);

    await evaluate(cdp, `document.querySelector('[data-storefront-discovery-clear]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-listing-product-card]').length === 6");
    const clearedSort = await evaluate(cdp, `({
      sortValue: document.querySelector('[data-storefront-discovery-sort]')?.value ?? '',
      firstCard: document.querySelector('[data-storefront-listing-product-card]')?.textContent ?? '',
      categoryAll: document.querySelector('[data-storefront-discovery-filter="category"] input[value="all"]')?.checked ?? false,
      clearVisible: Boolean(document.querySelector('[data-storefront-discovery-clear]'))
    })`);
    check('Storefront discovery clear restores recommended sorting', clearedSort.sortValue === 'recommended' && clearedSort.firstCard.includes('Display OLED iPhone 13') && clearedSort.categoryAll && !clearedSort.clearVisible, clearedSort);

    await navigate(cdp, detailUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-product-detail]'))");
    const detail = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      detail: Boolean(document.querySelector('[data-storefront-product-detail]')),
      title: document.querySelector('[data-storefront-product-detail] h1')?.textContent ?? '',
      buyBox: document.querySelector('[data-storefront-product-buy-box]')?.textContent ?? '',
      notice: document.querySelector('[data-storefront-product-action-notice]')?.textContent ?? '',
      actions: document.querySelector('[data-storefront-product-actions]')?.textContent ?? '',
      text: document.querySelector('[data-storefront-product-detail]')?.textContent ?? '',
      addToCartButtons: [...document.querySelectorAll('[data-storefront-product-detail] button')].filter((button) => button.textContent?.includes('Agregar')).length,
      disabledCartButtons: [...document.querySelectorAll('[data-storefront-product-detail] button')].filter((button) => button.disabled && button.textContent?.includes('Carrito pendiente')).length,
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront product detail renders inside storefront shell', detail.shell && detail.detail, detail);
    check('Storefront product detail renders selected demo product', detail.title.includes('Display OLED iPhone 13'), detail);
    check('Storefront product detail exposes price, stock and compatibility', detail.buyBox.includes('UYU 4.890') && detail.buyBox.includes('Stock demo: 3') && detail.buyBox.includes('Compatible: iPhone 13'), detail);
    check('Storefront product detail exposes replacement cost label', detail.buyBox.includes('Costo repuesto nuevo'), detail);
    check('Storefront product detail states future transaction flow', detail.notice.includes('Compra futura') && detail.notice.includes('No agrega al carrito'), detail);
    check('Storefront product detail has no active add-to-cart behavior', detail.addToCartButtons === 0 && detail.disabledCartButtons === 1, detail);
    check('Storefront product detail avoids admin sidebar and public blueprint copy', !detail.adminSidebar && !detail.publicShellBrand, detail);
    check('Storefront product detail desktop avoids horizontal overflow', !detail.overflow, detail);
    await shot('storefront-product-detail-desktop.png');

    await navigate(cdp, favoritesUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-favorites]'))");
    const favorites = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      page: Boolean(document.querySelector('[data-storefront-favorites]')),
      title: document.querySelector('[data-storefront-favorites] h1')?.textContent ?? '',
      products: document.querySelectorAll('[data-storefront-favorite-item]').length,
      count: document.querySelector('[data-storefront-favorites-count]')?.textContent ?? '',
      summary: document.querySelector('[data-storefront-favorites-summary]')?.textContent ?? '',
      emptyState: document.querySelector('[data-storefront-favorites-empty-state]')?.textContent ?? '',
      notices: document.querySelector('[data-storefront-favorites-notices]')?.textContent ?? '',
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront favorites renders inside storefront shell', favorites.shell && favorites.page, favorites);
    check('Storefront favorites renders three active provider-driven products', favorites.title.includes('Tus productos guardados') && favorites.products === 3 && favorites.count.includes('3 favoritos') && favorites.summary.includes('3 de 3'), favorites);
    check('Storefront favorites hides empty state while items exist', favorites.emptyState === '', favorites);
    check('Storefront favorites exposes persistence and cart guardrails', favorites.notices.includes('localStorage') && favorites.notices.includes('Sin carrito automático'), favorites);
    check('Storefront favorites desktop avoids horizontal overflow', !favorites.overflow, favorites);

    await evaluate(cdp, `document.querySelector('[data-storefront-favorite-id="favorite-display"] [data-storefront-favorite-remove]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-favorite-item]').length === 2");
    const favoriteRemoved = await evaluate(cdp, `({
      products: document.querySelectorAll('[data-storefront-favorite-item]').length,
      count: document.querySelector('[data-storefront-favorites-count]')?.textContent ?? '',
      summary: document.querySelector('[data-storefront-favorites-summary]')?.textContent ?? '',
      removedStillVisible: Boolean(document.querySelector('[data-storefront-favorite-id="favorite-display"]'))
    })`);
    check('Storefront favorites removes one item in memory', favoriteRemoved.products === 2 && favoriteRemoved.count.includes('2 favoritos') && favoriteRemoved.summary.includes('2 de 3') && !favoriteRemoved.removedStillVisible, favoriteRemoved);

    await evaluate(cdp, `document.querySelector('[data-storefront-favorites-clear]')?.click()`);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-favorites-empty-state]'))");
    const favoritesEmpty = await evaluate(cdp, `({
      products: document.querySelectorAll('[data-storefront-favorite-item]').length,
      count: document.querySelector('[data-storefront-favorites-count]')?.textContent ?? '',
      emptyState: document.querySelector('[data-storefront-favorites-empty-state]')?.textContent ?? '',
      restoreVisible: Boolean(document.querySelector('[data-storefront-favorites-restore]'))
    })`);
    check('Storefront favorites clear exposes a real empty state', favoritesEmpty.products === 0 && favoritesEmpty.count.includes('0 favoritos') && favoritesEmpty.emptyState.includes('lista de favoritos está vacía') && favoritesEmpty.restoreVisible, favoritesEmpty);

    await evaluate(cdp, `document.querySelector('[data-storefront-favorites-restore]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-favorite-item]').length === 3");
    const favoritesRestored = await evaluate(cdp, `({
      products: document.querySelectorAll('[data-storefront-favorite-item]').length,
      count: document.querySelector('[data-storefront-favorites-count]')?.textContent ?? '',
      emptyVisible: Boolean(document.querySelector('[data-storefront-favorites-empty-state]'))
    })`);
    check('Storefront favorites restores provider initial state', favoritesRestored.products === 3 && favoritesRestored.count.includes('3 favoritos') && !favoritesRestored.emptyVisible, favoritesRestored);
    await shot('storefront-favorites-desktop.png');

    await navigate(cdp, cartUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-cart]'))");
    const cart = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      cart: Boolean(document.querySelector('[data-storefront-cart]')),
      title: document.querySelector('[data-storefront-cart] h1')?.textContent ?? '',
      headingFontPx: parseFloat(getComputedStyle(document.querySelector('[data-storefront-cart] h1')).fontSize),
      emptyState: document.querySelector('[data-storefront-cart-empty-state]')?.textContent ?? '',
      cartLines: document.querySelectorAll('[data-storefront-cart-line]').length,
      cartImages: document.querySelectorAll('[data-storefront-cart-line] img').length,
      summary: document.querySelector('[data-storefront-cart-summary]')?.textContent ?? '',
      total: document.querySelector('[data-storefront-cart-total]')?.textContent ?? '',
      itemCount: document.querySelector('[data-storefront-cart-item-count]')?.textContent ?? '',
      checkoutLinks: [...document.querySelectorAll('[data-storefront-cart] a')].filter((link) => link.getAttribute('href') === '/store/checkout').length,
      storageReferences: document.querySelector('[data-storefront-cart]')?.textContent?.includes('localStorage') || document.querySelector('[data-storefront-cart]')?.textContent?.includes('sessionStorage'),
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront cart renders inside storefront shell', cart.shell && cart.cart, cart);
    check('Storefront cart keeps ultra-compact H1 scale', cart.headingFontPx <= 20, cart);
    check('Storefront cart renders interactive provider lines without simultaneous empty state', cart.title.includes('interacción local') && cart.emptyState === '' && cart.cartLines === 2, cart);
    check('Storefront cart reuses provider-driven product images', cart.cartImages === 2, cart);
    check('Storefront cart derives initial total and item count', cart.total.includes('UYU 6.580') && cart.itemCount.includes('2 productos'), cart);
    check('Storefront cart exposes checkout navigation while items exist', cart.checkoutLinks === 1, cart);
    check('Storefront cart surfaces client storage behavior', cart.storageReferences, cart);
    check('Storefront cart avoids admin sidebar and public blueprint copy', !cart.adminSidebar && !cart.publicShellBrand, cart);
    check('Storefront cart desktop avoids horizontal overflow', !cart.overflow, cart);

    await evaluate(cdp, `document.querySelector('[data-storefront-cart-line-id="cart-line-display"] [data-storefront-cart-increase]')?.click()`);
    await waitFor(cdp, "document.querySelector('[data-storefront-cart-line-id=\"cart-line-display\"] [data-storefront-cart-quantity-value]')?.textContent === '2'");
    const increasedCart = await evaluate(cdp, `({
      quantity: document.querySelector('[data-storefront-cart-line-id="cart-line-display"] [data-storefront-cart-quantity-value]')?.textContent ?? '',
      lineTotal: document.querySelector('[data-storefront-cart-line-id="cart-line-display"] [data-storefront-cart-line-total]')?.textContent ?? '',
      total: document.querySelector('[data-storefront-cart-total]')?.textContent ?? '',
      itemCount: document.querySelector('[data-storefront-cart-item-count]')?.textContent ?? ''
    })`);
    check('Storefront cart increases quantity and recomputes totals', increasedCart.quantity === '2' && increasedCart.lineTotal.includes('UYU 9.780') && increasedCart.total.includes('UYU 11.470') && increasedCart.itemCount.includes('3 productos'), increasedCart);

    await evaluate(cdp, `document.querySelector('[data-storefront-cart-line-id="cart-line-battery"] [data-storefront-cart-remove]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-cart-line]').length === 1");
    const removedLine = await evaluate(cdp, `({
      lines: document.querySelectorAll('[data-storefront-cart-line]').length,
      total: document.querySelector('[data-storefront-cart-total]')?.textContent ?? '',
      itemCount: document.querySelector('[data-storefront-cart-item-count]')?.textContent ?? ''
    })`);
    check('Storefront cart removes a line and keeps derived totals coherent', removedLine.lines === 1 && removedLine.total.includes('UYU 9.780') && removedLine.itemCount.includes('2 productos'), removedLine);

    await evaluate(cdp, `document.querySelector('[data-storefront-cart-clear]')?.click()`);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-cart-empty-state]'))");
    const emptyCart = await evaluate(cdp, `({
      lines: document.querySelectorAll('[data-storefront-cart-line]').length,
      empty: document.querySelector('[data-storefront-cart-empty-state]')?.textContent ?? '',
      checkoutLinks: [...document.querySelectorAll('[data-storefront-cart] a')].filter((link) => link.getAttribute('href') === '/store/checkout').length,
      disabledEmptyButton: [...document.querySelectorAll('[data-storefront-cart] button')].some((button) => button.disabled && button.textContent?.includes('Carrito vacío'))
    })`);
    check('Storefront cart exposes empty state and blocks checkout after clearing', emptyCart.lines === 0 && emptyCart.empty.includes('Restaurar carrito demo') && emptyCart.checkoutLinks === 0 && emptyCart.disabledEmptyButton, emptyCart);

    await evaluate(cdp, `document.querySelector('[data-storefront-cart-restore]')?.click()`);
    await waitFor(cdp, "document.querySelectorAll('[data-storefront-cart-line]').length === 2");
    const restoredCart = await evaluate(cdp, `({
      lines: document.querySelectorAll('[data-storefront-cart-line]').length,
      total: document.querySelector('[data-storefront-cart-total]')?.textContent ?? '',
      quantities: [...document.querySelectorAll('[data-storefront-cart-quantity-value]')].map((node) => node.textContent)
    })`);
    check('Storefront cart restores provider initial state', restoredCart.lines === 2 && restoredCart.total.includes('UYU 6.580') && restoredCart.quantities.every((value) => value === '1'), restoredCart);
    await shot('storefront-cart-desktop.png');

    await navigate(cdp, checkoutUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-checkout]'))");
    const checkout = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      checkout: Boolean(document.querySelector('[data-storefront-checkout]')),
      title: document.querySelector('[data-storefront-checkout] h1')?.textContent ?? '',
      headingFontPx: parseFloat(getComputedStyle(document.querySelector('[data-storefront-checkout] h1')).fontSize),
      authGate: document.querySelector('[data-storefront-checkout-auth-gate]')?.textContent ?? '',
      shipping: document.querySelector('[data-storefront-checkout-shipping]')?.textContent ?? '',
      payment: document.querySelector('[data-storefront-checkout-payment]')?.textContent ?? '',
      summary: document.querySelector('[data-storefront-checkout-summary]')?.textContent ?? '',
      notices: document.querySelector('[data-storefront-checkout-notices]')?.textContent ?? '',
      disabledButtons: [...document.querySelectorAll('[data-storefront-checkout] button')].filter((button) => button.disabled).length,
      identityLinks: [...document.querySelectorAll('[data-storefront-checkout-auth-gate] a')].map((link) => link.getAttribute('href')),
      shippingLinks: [...document.querySelectorAll('[data-storefront-checkout-shipping] a')].map((link) => link.getAttribute('href')),
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront checkout renders inside storefront shell', checkout.shell && checkout.checkout, checkout);
    check('Storefront checkout keeps compact H1 scale', checkout.headingFontPx <= 26, checkout);
    check('Storefront checkout requires authentication or registration', checkout.title.includes('Revisa la compra') && checkout.authGate.includes('Autenticación o registro requerido'), checkout);
    check('Storefront checkout links to dedicated customer identity routes', checkout.identityLinks.includes('/store/account/sign-in') && checkout.identityLinks.includes('/store/account/register'), checkout);
    check('Storefront checkout exposes shipping zone navigation', checkout.shipping.includes('Tarifas demo disponibles') && checkout.shippingLinks.includes('/store/shipping'), checkout);
    check('Storefront checkout exposes payment placeholders', checkout.payment.includes('Mercado Pago') && checkout.payment.includes('Tarjeta') && checkout.payment.includes('WhatsApp'), checkout);
    check('Storefront checkout remains non-transactional', checkout.summary.includes('UYU 6.580') && checkout.disabledButtons >= 1 && checkout.notices.includes('Sin creación de orden'), checkout);
    check('Storefront checkout surfaces no-client-persistence guardrail', checkout.notices.includes('localStorage') && checkout.notices.includes('sessionStorage'), checkout);
    check('Storefront checkout avoids admin sidebar and public blueprint copy', !checkout.adminSidebar && !checkout.publicShellBrand, checkout);
    check('Storefront checkout desktop avoids horizontal overflow', !checkout.overflow, checkout);
    await shot('storefront-checkout-desktop.png');

    await navigate(cdp, shippingUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-shipping]'))");
    const shipping = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      page: Boolean(document.querySelector('[data-storefront-shipping]')),
      title: document.querySelector('[data-storefront-shipping] h1')?.textContent ?? '',
      zones: document.querySelectorAll('[data-storefront-shipping-zones] article').length,
      pickup: document.querySelector('[data-storefront-shipping-pickup]')?.textContent ?? '',
      disabledFields: document.querySelectorAll('[data-storefront-shipping-address] input:disabled').length,
      notices: document.querySelector('[data-storefront-shipping-notices]')?.textContent ?? '',
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront shipping renders four demo zones', shipping.shell && shipping.page && shipping.zones === 4, shipping);
    check('Storefront shipping preserves pickup and disabled address preview', shipping.pickup.includes('Sin costo') && shipping.disabledFields === 3, shipping);
    check('Storefront shipping surfaces non-persistence guardrails', shipping.notices.includes('localStorage') && shipping.notices.includes('Sin transportista') && shipping.notices.includes('Sin mutación de pedido'), shipping);
    check('Storefront shipping desktop avoids horizontal overflow', !shipping.overflow, shipping);
    await shot('storefront-shipping-desktop.png');

    await navigate(cdp, contactUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-contact]'))");
    const contact = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      page: Boolean(document.querySelector('[data-storefront-contact]')),
      title: document.querySelector('[data-storefront-contact] h1')?.textContent ?? '',
      channels: document.querySelectorAll('[data-storefront-contact-channels] article').length,
      disabledButtons: document.querySelectorAll('[data-storefront-contact-channels] button:disabled').length,
      service: document.querySelector('[data-storefront-contact-service]')?.textContent ?? '',
      notices: document.querySelector('[data-storefront-contact-notices]')?.textContent ?? '',
      floatingHref: document.querySelector('[data-storefront-floating-action]')?.getAttribute('href') ?? '',
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront contact renders inside storefront shell', contact.shell && contact.page, contact);
    check('Storefront contact renders provider-driven channels', contact.title.includes('Hablemos antes de confirmar') && contact.channels === 2, contact);
    check('Storefront contact blocks real messaging in B10', contact.disabledButtons === 2 && contact.notices.includes('Sin API de mensajería') && contact.notices.includes('Sin formulario enviado'), contact);
    check('Storefront floating WhatsApp action resolves to contact landing', contact.floatingHref === '/store/contact', contact);
    check('Storefront contact service area and hours render', contact.service.includes('Montevideo') && contact.service.includes('Lunes a viernes'), contact);
    check('Storefront contact desktop avoids horizontal overflow', !contact.overflow, contact);
    await shot('storefront-contact-desktop.png');

    await navigate(cdp, warrantyUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-warranty]'))");
    const warranty = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      page: Boolean(document.querySelector('[data-storefront-warranty]')),
      title: document.querySelector('[data-storefront-warranty] h1')?.textContent ?? '',
      policies: document.querySelectorAll('[data-storefront-warranty-policies] article').length,
      eligibilityRows: document.querySelectorAll('[data-storefront-warranty-eligibility] [class*="rounded-xl"]').length,
      disabledButtons: document.querySelectorAll('[data-storefront-warranty-eligibility] button:disabled').length,
      notices: document.querySelector('[data-storefront-warranty-notices]')?.textContent ?? '',
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront warranty renders inside storefront shell', warranty.shell && warranty.page, warranty);
    check('Storefront warranty renders warranty and returns policies', warranty.title.includes('Condiciones claras') && warranty.policies === 2, warranty);
    check('Storefront warranty keeps eligibility non-transactional', warranty.eligibilityRows >= 3 && warranty.disabledButtons === 1, warranty);
    check('Storefront warranty surfaces request/order/inventory guardrails', warranty.notices.includes('Sin solicitud real') && warranty.notices.includes('Sin consulta de órdenes') && warranty.notices.includes('Sin mutación de inventario'), warranty);
    check('Storefront warranty desktop avoids horizontal overflow', !warranty.overflow, warranty);
    await shot('storefront-warranty-desktop.png');

    await navigate(cdp, sparePartsUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-catalog-route]'))");
    const spareParts = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      routeKey: document.querySelector('[data-storefront-catalog-route]')?.getAttribute('data-storefront-catalog-route-key') ?? '',
      title: document.querySelector('[data-storefront-catalog-route] h1')?.textContent ?? '',
      cards: document.querySelectorAll('[data-storefront-catalog-products] [data-storefront-listing-product-card]').length,
      navigationLinks: document.querySelectorAll('[data-storefront-catalog-navigation] a').length,
      notice: document.querySelector('[data-storefront-catalog-notice]')?.textContent ?? '',
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront spare parts route reuses storefront catalog page', spareParts.shell && spareParts.routeKey === 'spare-parts' && spareParts.title.includes('Repuestos para reparación'), spareParts);
    check('Storefront spare parts renders shared product cards and route navigation', spareParts.cards === 4 && spareParts.navigationLinks === 7, spareParts);
    check('Storefront catalog declares provider reuse without backend filtering', spareParts.notice.includes('Catálogo reutilizado') && spareParts.notice.includes('No aplica filtros de backend'), spareParts);
    check('Storefront spare parts desktop avoids horizontal overflow', !spareParts.overflow, spareParts);
    await shot('storefront-catalog-spare-parts-desktop.png');

    await navigate(cdp, usedPhonesUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-catalog-route]'))");
    const usedPhones = await evaluate(cdp, `({
      routeKey: document.querySelector('[data-storefront-catalog-route]')?.getAttribute('data-storefront-catalog-route-key') ?? '',
      title: document.querySelector('[data-storefront-catalog-route] h1')?.textContent ?? '',
      cards: document.querySelectorAll('[data-storefront-catalog-products] [data-storefront-listing-product-card]').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront used phones route resolves its provider variant', usedPhones.routeKey === 'used-phones' && usedPhones.title.includes('Equipos usados') && usedPhones.cards === 2, usedPhones);
    check('Storefront used phones desktop avoids horizontal overflow', !usedPhones.overflow, usedPhones);

    await navigate(cdp, displaysUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-catalog-route]'))");
    const category = await evaluate(cdp, `({
      routeKey: document.querySelector('[data-storefront-catalog-route]')?.getAttribute('data-storefront-catalog-route-key') ?? '',
      title: document.querySelector('[data-storefront-catalog-route] h1')?.textContent ?? '',
      cards: document.querySelectorAll('[data-storefront-catalog-products] [data-storefront-listing-product-card]').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront dynamic category route resolves configured slug', category.routeKey === 'category:displays' && category.title.includes('Displays') && category.cards === 1, category);
    check('Storefront dynamic category desktop avoids horizontal overflow', !category.overflow, category);

    await navigate(cdp, signInUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-customer-identity]'))");
    const signIn = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      identity: Boolean(document.querySelector('[data-storefront-customer-identity]')),
      mode: document.querySelector('[data-storefront-customer-identity]')?.getAttribute('data-storefront-customer-identity-mode') ?? '',
      title: document.querySelector('[data-storefront-customer-identity] h1')?.textContent ?? '',
      disabledInputs: document.querySelectorAll('[data-storefront-customer-identity-form] input:disabled').length,
      disabledButtons: document.querySelectorAll('[data-storefront-customer-identity-form] button:disabled').length,
      links: [...document.querySelectorAll('[data-storefront-customer-identity-form] a')].map((link) => link.getAttribute('href')),
      notices: document.querySelector('[data-storefront-customer-identity-notices]')?.textContent ?? '',
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront customer sign-in renders inside storefront shell', signIn.shell && signIn.identity && signIn.mode === 'sign-in', signIn);
    check('Storefront customer sign-in stays visual and non-authenticating', signIn.title.includes('Inicia sesión') && signIn.disabledInputs === 2 && signIn.disabledButtons === 1, signIn);
    check('Storefront customer sign-in links to register and checkout', signIn.links.includes('/store/account/register') && signIn.links.includes('/store/checkout'), signIn);
    check('Storefront customer identity declares separation and no persistence', signIn.notices.includes('separada del administrador') && signIn.notices.includes('localStorage') && signIn.notices.includes('sessionStorage'), signIn);
    check('Storefront customer sign-in avoids admin sidebar and overflow', !signIn.adminSidebar && !signIn.overflow, signIn);
    await shot('storefront-customer-sign-in-desktop.png');

    await navigate(cdp, registerUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-customer-identity]'))");
    const register = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      mode: document.querySelector('[data-storefront-customer-identity]')?.getAttribute('data-storefront-customer-identity-mode') ?? '',
      title: document.querySelector('[data-storefront-customer-identity] h1')?.textContent ?? '',
      disabledInputs: document.querySelectorAll('[data-storefront-customer-identity-form] input:disabled').length,
      links: [...document.querySelectorAll('[data-storefront-customer-identity-form] a')].map((link) => link.getAttribute('href')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront customer register renders dedicated visual flow', register.shell && register.mode === 'register' && register.title.includes('Crea tu cuenta') && register.disabledInputs === 4, register);
    check('Storefront customer register links back to sign-in and checkout', register.links.includes('/store/account/sign-in') && register.links.includes('/store/checkout'), register);
    check('Storefront customer register desktop avoids horizontal overflow', !register.overflow, register);

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-product-listing]'))");
    const mobile = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      listing: Boolean(document.querySelector('[data-storefront-product-listing]')),
      filters: document.querySelectorAll('[data-storefront-listing-filters] fieldset').length,
      productCards: document.querySelectorAll('[data-storefront-listing-product-card]').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves product listing shell and sections', mobile.shell && mobile.listing && mobile.filters === 4 && mobile.productCards === 6, mobile);
    check('Mobile storefront product listing avoids horizontal overflow', !mobile.overflow, mobile);

    await navigate(cdp, detailUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-product-detail]'))");
    const mobileDetail = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      detail: Boolean(document.querySelector('[data-storefront-product-detail]')),
      title: document.querySelector('[data-storefront-product-detail] h1')?.textContent ?? '',
      buyBox: Boolean(document.querySelector('[data-storefront-product-buy-box]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves product detail shell and buy box', mobileDetail.shell && mobileDetail.detail && mobileDetail.buyBox && mobileDetail.title.includes('Display OLED iPhone 13'), mobileDetail);
    check('Mobile storefront product detail avoids horizontal overflow', !mobileDetail.overflow, mobileDetail);

    await navigate(cdp, cartUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-cart]'))");
    const mobileCart = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      cart: Boolean(document.querySelector('[data-storefront-cart]')),
      title: document.querySelector('[data-storefront-cart] h1')?.textContent ?? '',
      cartLines: document.querySelectorAll('[data-storefront-cart-line]').length,
      summary: Boolean(document.querySelector('[data-storefront-cart-summary]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves cart shell, lines and summary', mobileCart.shell && mobileCart.cart && mobileCart.title.includes('interacción local') && mobileCart.cartLines === 2 && mobileCart.summary, mobileCart);
    check('Mobile storefront cart avoids horizontal overflow', !mobileCart.overflow, mobileCart);

    await navigate(cdp, checkoutUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-checkout]'))");
    const mobileCheckout = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      checkout: Boolean(document.querySelector('[data-storefront-checkout]')),
      authGate: Boolean(document.querySelector('[data-storefront-checkout-auth-gate]')),
      payment: Boolean(document.querySelector('[data-storefront-checkout-payment]')),
      summary: Boolean(document.querySelector('[data-storefront-checkout-summary]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves checkout shell, auth gate, payment and summary', mobileCheckout.shell && mobileCheckout.checkout && mobileCheckout.authGate && mobileCheckout.payment && mobileCheckout.summary, mobileCheckout);
    check('Mobile storefront checkout avoids horizontal overflow', !mobileCheckout.overflow, mobileCheckout);

    await navigate(cdp, signInUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-customer-identity]'))");
    const mobileIdentity = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      identity: Boolean(document.querySelector('[data-storefront-customer-identity]')),
      form: Boolean(document.querySelector('[data-storefront-customer-identity-form]')),
      notices: Boolean(document.querySelector('[data-storefront-customer-identity-notices]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves customer identity shell, form and notices', mobileIdentity.shell && mobileIdentity.identity && mobileIdentity.form && mobileIdentity.notices, mobileIdentity);
    check('Mobile storefront customer identity avoids horizontal overflow', !mobileIdentity.overflow, mobileIdentity);

    await shot('storefront-products-mobile.png');
  } catch (error) {
    check('Storefront product listing browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'storefront.catalog-product-listing-detail-cart-checkout-customer-identity',
      targetUrl,
      detailUrl,
      cartUrl,
      favoritesUrl,
      checkoutUrl,
      shippingUrl,
      contactUrl,
      warrantyUrl,
      sparePartsUrl,
      usedPhonesUrl,
      brandsUrl,
      displaysUrl,
      batteriesUrl,
      chargeConnectorsUrl,
      accessoriesUrl,
      signInUrl,
      registerUrl,
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Storefront product listing/detail/cart/checkout/customer-identity browser QA failed: ${failures.join('; ')}`);
}
