import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/applications/ecommerce/detail`;
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
    check('Deep link responds successfully', response.ok, { status: response.status });
    chrome = await launchChrome();
    cdp = await connectCdp(chrome.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    await setViewport(cdp, { width: 1365, height: 768 });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-product-detail]'))");
    const desktop = await evaluate(cdp, `({
      title: document.querySelector('h1')?.textContent,
      detail: document.querySelector('[data-product-detail]')?.textContent,
      related: [...document.querySelectorAll('[data-related-products] [data-product-card]')].map((card) => card.textContent),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Detail title is rendered', desktop.title === 'Detalle del producto', desktop);
    check('Configured canonical product is rendered', desktop.detail?.includes('Auriculares Studio') && desktop.detail?.includes('WB-1001'), desktop);
    check('Canonical status and price are rendered', desktop.detail?.includes('Publicado') && desktop.detail?.includes('USD 129'), desktop);
    check('Related products reuse commercial catalog', desktop.related.length === 3 && !desktop.related.some((text) => text.includes('Soporte Desk')), desktop);
    check('Desktop has no page overflow', !desktop.overflow, desktop);
    await shot('ecommerce-detail-desktop.png');

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-product-detail]'))");
    const mobile = await evaluate(cdp, `({
      detail: document.querySelector('[data-product-detail]')?.textContent,
      related: document.querySelectorAll('[data-related-products] [data-product-card]').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves configured product', mobile.detail?.includes('Auriculares Studio'), mobile);
    check('Mobile preserves related products', mobile.related === 3, mobile);
    check('Mobile page avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('ecommerce-detail-mobile.png');
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0', view: 'applications.ecommerce-detail', targetUrl,
      generatedAt: new Date().toISOString(), status: failures.length ? 'FAIL' : 'PASS', checks, failures,
    }, null, 2));
  }
  if (failures.length) throw new Error(`Ecommerce detail browser QA failed: ${failures.join('; ')}`);
}
