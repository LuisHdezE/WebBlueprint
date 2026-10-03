import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/apps/inventory/devices/evaluation`;
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
    await waitFor(cdp, "Boolean(document.querySelector('[data-device-evaluation]'))");

    const desktop = await evaluate(cdp, `({
      title: document.querySelector('h1')?.textContent,
      text: document.querySelector('[data-device-evaluation]')?.textContent,
      metrics: document.querySelectorAll('[data-device-evaluation] article').length,
      select: document.querySelector('#device-evaluation-destination')?.value,
      backLink: Boolean(document.querySelector('a[href="/apps/inventory/devices"]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Evaluation title is rendered', desktop.title === 'Evaluación de dispositivo', desktop);
    check('Evaluation renders selected device context', desktop.text?.includes('DEV-0291') && desktop.text?.includes('iPhone 12'), desktop);
    check('Evaluation renders summary metrics and checks', desktop.metrics >= 3 && desktop.text?.includes('Revisión visual') && desktop.text?.includes('Pruebas funcionales'), desktop);
    check('Recommended destination is selected', desktop.select === 'Refurbish', desktop);
    check('Back to devices action is available', desktop.backLink, desktop);

    const interaction = await evaluate(cdp, `(async () => {
      const select = document.querySelector('#device-evaluation-destination');
      const setSelect = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
      setSelect.call(select, 'Donor');
      select.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 80));
      const textAfterChange = document.querySelector('[data-device-evaluation]')?.textContent;
      const button = document.querySelector('[data-device-evaluation] button[type="submit"]');
      button?.click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      return {
        selected: select.value,
        changedText: textAfterChange,
        success: document.querySelector('[data-device-evaluation-success]')?.textContent
      };
    })()`);
    check('Decision selector can change to donor', interaction.selected === 'Donor' && interaction.changedText?.includes('Donante'), interaction);
    check('Demo submit renders evaluation success feedback', interaction.success?.includes('Evaluación preparada'), interaction);
    check('Desktop page avoids horizontal overflow', !desktop.overflow, desktop);
    await shot('inventory-device-evaluation-desktop.png');

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-device-evaluation]'))");
    const mobile = await evaluate(cdp, `({
      page: Boolean(document.querySelector('[data-device-evaluation]')),
      decision: Boolean(document.querySelector('#device-evaluation-destination')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves evaluation view', mobile.page, mobile);
    check('Mobile preserves decision selector', mobile.decision, mobile);
    check('Mobile page avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('inventory-device-evaluation-mobile.png');
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'inventory.device-evaluation',
      targetUrl,
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Inventory device evaluation browser QA failed: ${failures.join('; ')}`);
}
