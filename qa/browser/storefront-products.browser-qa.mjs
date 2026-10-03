import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const base = baseUrl.replace(/\/$/, '');
  const targetUrl = `${base}/store/products`;
  const detailUrl = `${base}/store/products/iphone-13-display-oled`;
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
    await shot('storefront-products-mobile.png');
  } catch (error) {
    check('Storefront product listing browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'storefront.product-listing',
      targetUrl,
      detailUrl,
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Storefront product listing/detail browser QA failed: ${failures.join('; ')}`);
}
