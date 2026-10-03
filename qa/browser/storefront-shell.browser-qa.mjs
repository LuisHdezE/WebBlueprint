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
      navText: document.querySelector('[data-storefront-shell] header')?.textContent ?? '',
      footerText: document.querySelector('[data-storefront-footer]')?.textContent ?? '',
      adminSidebar: Boolean(document.querySelector('[data-template-sidebar]')),
      publicShellBrand: document.querySelector('header')?.textContent?.includes('WebBlueprint') ?? false,
      searchInputs: document.querySelectorAll('[data-storefront-shell] input[type="search"]').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);

    check('Storefront shell renders', desktop.shell && desktop.home, desktop);
    check('Storefront commercial header renders', desktop.navText.includes('Productos') && desktop.navText.includes('Carrito'), desktop);
    check('Storefront announcement is visible', desktop.announcement.includes('Storefront demo'), desktop);
    check('Storefront home hero renders', desktop.title.includes('Storefront comercial'), desktop);
    check('Storefront footer renders support links', desktop.footerText.includes('Consultar por WhatsApp') && desktop.footerText.includes('Envíos'), desktop);
    check('Storefront has commercial search inputs', desktop.searchInputs >= 2, desktop);
    check('Storefront does not render admin sidebar', !desktop.adminSidebar, desktop);
    check('Storefront does not reuse public blueprint header copy', !desktop.publicShellBrand, desktop);
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
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves storefront shell', mobile.shell && mobile.home && mobile.footer, mobile);
    check('Mobile exposes menu control', mobile.menu, mobile);
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
