import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/store`;
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
    check('Storefront deep link responds successfully', response.ok, { status: response.status, targetUrl });

    chrome = await launchChrome();
    cdp = await connectCdp(chrome.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await setViewport(cdp, { width: 1365, height: 768 });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-shell]'))");

    const desktop = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      home: Boolean(document.querySelector('[data-storefront-home]')),
      announcement: document.querySelector('[data-storefront-announcement]')?.textContent ?? '',
      title: document.querySelector('h1')?.textContent ?? '',
      heroCarousel: Boolean(document.querySelector('[data-storefront-hero-carousel]')),
      heroImage: document.querySelector('[data-storefront-hero-image]')?.getAttribute('src') ?? '',
      heroControls: [...document.querySelectorAll('[data-storefront-hero-carousel] button')].length,
      floatingAction: document.querySelector('[data-storefront-floating-action]')?.getAttribute('href') ?? '',
      navText: document.querySelector('[data-storefront-shell] header')?.textContent ?? '',
      footerText: document.querySelector('[data-storefront-footer]')?.textContent ?? '',
      categoryText: document.querySelector('[data-storefront-category-section]')?.textContent ?? '',
      productText: document.querySelector('[data-storefront-product-section]')?.textContent ?? '',
      promoText: document.querySelector('[data-storefront-promo-band]')?.textContent ?? '',
      categoryCards: document.querySelectorAll('[data-storefront-category-section] a').length,
      productCards: document.querySelectorAll('[data-storefront-product-card]').length,
      addToCartButtons: [...document.querySelectorAll('[data-storefront-product-card] button')].filter((button) => button.textContent?.includes('Agregar')).length,
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      searchInputs: document.querySelectorAll('[data-storefront-shell] input[type="search"]').length,
      heroFontPx: parseFloat(getComputedStyle(document.querySelector('[data-storefront-home] h1')).fontSize),
      headerHeight: document.querySelector('[data-storefront-shell] header')?.getBoundingClientRect().height ?? 0,
      categorySectionTop: document.querySelector('[data-storefront-category-section]')?.getBoundingClientRect().top ?? 9999,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);

    check('Storefront shell renders', desktop.shell && desktop.home, desktop);
    check('Storefront commercial header renders', desktop.navText.includes('Productos') && desktop.navText.includes('Carrito'), desktop);
    check('Storefront announcement is visible', desktop.announcement.includes('Storefront demo'), desktop);
    check('Storefront media hero carousel renders', desktop.heroCarousel && desktop.title.length > 10 && desktop.heroImage.startsWith('https://') && desktop.heroControls >= 5, desktop);
    check('Storefront floating WhatsApp action renders', desktop.floatingAction === '/store/contact', desktop);
    check('Storefront footer renders support links', desktop.footerText.includes('Consultar por WhatsApp') && desktop.footerText.includes('Envíos'), desktop);
    check('Storefront has commercial search input', desktop.searchInputs >= 1, desktop);
    check('Storefront category section renders', desktop.categoryCards === 4 && desktop.categoryText.includes('Celulares usados'), desktop);
    check('Storefront product section renders demo products', desktop.productCards === 3 && desktop.productText.includes('Display OLED iPhone 13'), desktop);
    check('Storefront product cards expose replacement cost labels', desktop.productText.includes('Costo repuesto nuevo'), desktop);
    check('Storefront promo band states future auth flow', desktop.promoText.includes('registro') && desktop.promoText.includes('checkout'), desktop);
    check('Storefront product cards do not implement cart behavior yet', desktop.addToCartButtons === 0, desktop);
    check('Storefront does not render admin sidebar', !desktop.adminSidebar, desktop);
    check('Storefront does not reuse public blueprint header copy', !desktop.publicShellBrand, desktop);
    check('Storefront desktop uses compact heading scale', desktop.heroFontPx <= 40, desktop);
    check('Storefront desktop keeps commercial chrome compact', desktop.headerHeight <= 150, desktop);
    check('Storefront categories enter the initial viewport rhythm', desktop.categorySectionTop < 700, desktop);
    check('Storefront desktop avoids horizontal overflow', !desktop.overflow, desktop);
    await shot('storefront-shell-desktop.png');

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-storefront-shell]'))");
    const mobile = await evaluate(cdp, `({
      shell: Boolean(document.querySelector('[data-storefront-shell]')),
      menu: Boolean(document.querySelector('details summary')),
      home: Boolean(document.querySelector('[data-storefront-home]')),
      footer: Boolean(document.querySelector('[data-storefront-footer]')),
      categories: document.querySelectorAll('[data-storefront-category-section] a').length,
      hero: Boolean(document.querySelector('[data-storefront-hero-carousel]')),
      floatingAction: Boolean(document.querySelector('[data-storefront-floating-action]')),
      products: document.querySelectorAll('[data-storefront-product-card]').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves storefront shell', mobile.shell && mobile.home && mobile.footer, mobile);
    check('Mobile exposes menu control', mobile.menu, mobile);
    check('Mobile preserves catalog home sections', mobile.categories === 4 && mobile.products === 3, mobile);
    check('Mobile preserves media hero and WhatsApp action', mobile.hero && mobile.floatingAction, mobile);
    check('Mobile storefront avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('storefront-shell-mobile.png');
  } catch (error) {
    check('Storefront browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'storefront.shell',
      targetUrl,
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Storefront shell browser QA failed: ${failures.join('; ')}`);
}
