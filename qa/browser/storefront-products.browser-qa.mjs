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
      products: document.querySelectorAll('[data-storefront-favorites-products] [data-storefront-listing-product-card]').length,
      emptyState: document.querySelector('[data-storefront-favorites-empty-state]')?.textContent ?? '',
      notices: document.querySelector('[data-storefront-favorites-notices]')?.textContent ?? '',
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront favorites renders inside storefront shell', favorites.shell && favorites.page, favorites);
    check('Storefront favorites renders three provider-driven products', favorites.title.includes('Guarda productos') && favorites.products === 3, favorites);
    check('Storefront favorites exposes empty state and persistence guardrails', favorites.emptyState.includes('Aún no hay favoritos reales') && favorites.notices.includes('localStorage') && favorites.notices.includes('Sin carrito automático'), favorites);
    check('Storefront favorites desktop avoids horizontal overflow', !favorites.overflow, favorites);
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
      summary: document.querySelector('[data-storefront-cart-summary]')?.textContent ?? '',
      notices: document.querySelector('[data-storefront-cart-notices]')?.textContent ?? '',
      disabledCheckoutButtons: [...document.querySelectorAll('[data-storefront-cart] button')].filter((button) => button.disabled && button.textContent?.includes('Checkout pendiente')).length,
      checkoutPreviewLinks: [...document.querySelectorAll('[data-storefront-cart] a')].filter((link) => link.getAttribute('href') === '/store/checkout').length,
      storageReferences: document.querySelector('[data-storefront-cart]')?.textContent?.includes('localStorage') || document.querySelector('[data-storefront-cart]')?.textContent?.includes('sessionStorage'),
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront cart renders inside storefront shell', cart.shell && cart.cart, cart);
    check('Storefront cart keeps compact H1 scale', cart.headingFontPx <= 26, cart);
    check('Storefront cart renders empty-state and demo lines', cart.title.includes('Carrito preparado') && cart.emptyState.includes('Tu carrito demo está vacío') && cart.cartLines === 2, cart);
    check('Storefront cart renders demo summary and blocked checkout', cart.summary.includes('UYU 6.580') && cart.disabledCheckoutButtons === 1, cart);
    check('Storefront cart exposes checkout preview navigation', cart.checkoutPreviewLinks === 1, cart);
    check('Storefront cart states future registration and checkout flow', cart.summary.includes('Registro requerido') && cart.notices.includes('Checkout bloqueado'), cart);
    check('Storefront cart surfaces client storage behavior', cart.storageReferences, cart);
    check('Storefront cart avoids admin sidebar and public blueprint copy', !cart.adminSidebar && !cart.publicShellBrand, cart);
    check('Storefront cart desktop avoids horizontal overflow', !cart.overflow, cart);
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
    check('Mobile preserves cart shell, lines and summary', mobileCart.shell && mobileCart.cart && mobileCart.title.includes('Carrito preparado') && mobileCart.cartLines === 2 && mobileCart.summary, mobileCart);
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
