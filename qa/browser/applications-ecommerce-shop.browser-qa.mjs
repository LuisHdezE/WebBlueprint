import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/applications/ecommerce/shop`;
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
    await waitFor(cdp, "document.querySelectorAll('[data-product-card]').length===4");
    const initial = await evaluate(cdp, `({
      title: document.querySelector('h1')?.textContent,
      cards: [...document.querySelectorAll('[data-product-card]')].map((card) => card.textContent),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Shop title is rendered', initial.title === 'Tienda', initial);
    check('Only four commercial products render', initial.cards.length === 4, initial);
    check('Draft product is excluded', !initial.cards.some((text) => text.includes('Soporte Desk')), initial);
    check('Out-of-stock product remains visible', initial.cards.some((text) => text.includes('Lámpara Focus') && text.includes('Agotado')), initial);
    check('Desktop has no page overflow', !initial.overflow, initial);
    await shot('ecommerce-shop-desktop.png');

    await evaluate(cdp, `(() => {
      const input = document.querySelector('#shop-search');
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'Teclado');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    })()`);
    await waitFor(cdp, "document.querySelectorAll('[data-product-card]').length===1");
    check('Search filters commercial catalog', true, {});

    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('#shop-category'))");
    await evaluate(cdp, `(() => {
      const select = document.querySelector('#shop-category');
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
      setter.call(select, 'Accesorios');
      select.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await waitFor(cdp, "document.querySelectorAll('[data-product-card]').length===2");
    check('Category filter narrows published catalog', true, {});

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "document.querySelectorAll('[data-product-card]').length===4");
    const mobile = await evaluate(cdp, `({
      cards: document.querySelectorAll('[data-product-card]').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile keeps four commercial products', mobile.cards === 4, mobile);
    check('Mobile page avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('ecommerce-shop-mobile.png');
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0', view: 'applications.ecommerce-shop', targetUrl,
      generatedAt: new Date().toISOString(), status: failures.length ? 'FAIL' : 'PASS', checks, failures,
    }, null, 2));
  }
  if (failures.length) throw new Error(`Ecommerce shop browser QA failed: ${failures.join('; ')}`);
}
