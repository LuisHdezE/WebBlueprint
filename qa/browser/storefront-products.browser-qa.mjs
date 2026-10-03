import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const base = baseUrl.replace(/\/$/, '');
  const targetUrl = `${base}/store/products`;
  const detailUrl = `${base}/store/products/iphone-13-display-oled`;
  const cartUrl = `${base}/store/cart`;
  const checkoutUrl = `${base}/store/checkout`;
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
    const checkoutResponse = await fetch(checkoutUrl);
    check('Storefront checkout deep link responds successfully', checkoutResponse.ok, { status: checkoutResponse.status, checkoutUrl });

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
      productText: document.querySelector('[data-storefront-product-listing]')?.textContent ?? '',
      addToCartButtons: [...document.querySelectorAll('[data-storefront-listing-product-card] button')].filter((button) => button.textContent?.includes('Agregar')).length,
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);

    check('Storefront product listing renders inside storefront shell', desktop.shell && desktop.listing, desktop);
    check('Storefront product listing hero renders', desktop.title.includes('Productos preparados'), desktop);
    check('Storefront product listing exposes visual filters', desktop.filters === 4 && desktop.searchInputs >= 1 && desktop.sortControls === 1, desktop);
    check('Storefront product listing renders demo products', desktop.productCards === 6 && desktop.productText.includes('Display OLED iPhone 13'), desktop);
    check('Storefront product listing shows replacement cost labels', desktop.productText.includes('Costo repuesto nuevo'), desktop);
    check('Storefront product listing states non-transactional scope', desktop.notice.includes('Listado visual') && desktop.notice.includes('incrementos posteriores'), desktop);
    check('Storefront product listing has no add-to-cart behavior yet', desktop.addToCartButtons === 0, desktop);
    check('Storefront product listing avoids admin sidebar', !desktop.adminSidebar, desktop);
    check('Storefront product listing avoids public blueprint header copy', !desktop.publicShellBrand, desktop);
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

    await navigate(cdp, cartUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-cart]'))");
    const cart = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      cart: Boolean(document.querySelector('[data-storefront-cart]')),
      title: document.querySelector('[data-storefront-cart] h1')?.textContent ?? '',
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
      authGate: document.querySelector('[data-storefront-checkout-auth-gate]')?.textContent ?? '',
      shipping: document.querySelector('[data-storefront-checkout-shipping]')?.textContent ?? '',
      payment: document.querySelector('[data-storefront-checkout-payment]')?.textContent ?? '',
      summary: document.querySelector('[data-storefront-checkout-summary]')?.textContent ?? '',
      notices: document.querySelector('[data-storefront-checkout-notices]')?.textContent ?? '',
      disabledButtons: [...document.querySelectorAll('[data-storefront-checkout] button')].filter((button) => button.disabled).length,
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Storefront checkout renders inside storefront shell', checkout.shell && checkout.checkout, checkout);
    check('Storefront checkout requires authentication or registration', checkout.title.includes('Revisa la compra') && checkout.authGate.includes('Autenticación o registro requerido'), checkout);
    check('Storefront checkout exposes shipping placeholder', checkout.shipping.includes('Cálculo de envío pendiente') && checkout.shipping.includes('Zona de entrega'), checkout);
    check('Storefront checkout exposes payment placeholders', checkout.payment.includes('Mercado Pago') && checkout.payment.includes('Tarjeta') && checkout.payment.includes('WhatsApp'), checkout);
    check('Storefront checkout remains non-transactional', checkout.summary.includes('UYU 6.580') && checkout.disabledButtons >= 3 && checkout.notices.includes('Sin creación de orden'), checkout);
    check('Storefront checkout surfaces no-client-persistence guardrail', checkout.notices.includes('localStorage') && checkout.notices.includes('sessionStorage'), checkout);
    check('Storefront checkout avoids admin sidebar and public blueprint copy', !checkout.adminSidebar && !checkout.publicShellBrand, checkout);
    check('Storefront checkout desktop avoids horizontal overflow', !checkout.overflow, checkout);
    await shot('storefront-checkout-desktop.png');

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

    await shot('storefront-products-mobile.png');
  } catch (error) {
    check('Storefront product listing browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'storefront.product-listing-detail-cart-checkout',
      targetUrl,
      detailUrl,
      cartUrl,
      checkoutUrl,
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Storefront product listing/detail/cart/checkout browser QA failed: ${failures.join('; ')}`);
}
