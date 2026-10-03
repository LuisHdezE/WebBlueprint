import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/apps/inventory/devices/new`;
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
    await waitFor(cdp, "Boolean(document.querySelector('[data-device-intake]'))");

    const initial = await evaluate(cdp, `({
      title: document.querySelector('h1')?.textContent,
      inputs: document.querySelectorAll('[data-device-intake] input').length,
      selects: document.querySelectorAll('[data-device-intake] select').length,
      textareas: document.querySelectorAll('[data-device-intake] textarea').length,
      submitDisabled: document.querySelector('[data-device-intake] button[type="submit"]')?.disabled,
      demoText: document.querySelector('[data-device-intake]')?.textContent,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Intake title is rendered', initial.title === 'Registrar dispositivo', initial);
    check('Intake fields render', initial.inputs === 7 && initial.selects === 4 && initial.textareas === 1, initial);
    check('Submission starts disabled until identity is complete', initial.submitDisabled === true, initial);
    check('Demo persistence boundary is visible', initial.demoText?.includes('no persiste datos'), initial);

    const interaction = await evaluate(cdp, `(async () => {
      const setInput = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      for (const [selector, value] of [
        ['#device-manufacturer', 'Apple'],
        ['#device-model', 'iPhone 13'],
        ['#device-identity', '359999999999991']
      ]) {
        const input = document.querySelector(selector);
        setInput.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await new Promise((resolve) => setTimeout(resolve, 80));
      const button = document.querySelector('[data-device-intake] button[type="submit"]');
      const enabled = button?.disabled === false;
      button?.click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      return {
        enabled,
        success: document.querySelector('[data-device-intake-success]')?.textContent,
        backLink: Boolean(document.querySelector('a[href="/apps/inventory/devices"]'))
      };
    })()`);
    check('Identity completion enables submit', interaction.enabled, interaction);
    check('Demo submit renders success feedback', interaction.success?.includes('Ingreso preparado'), interaction);
    check('Back to devices action is available', interaction.backLink, interaction);
    check('Desktop has no page overflow', !initial.overflow, initial);
    await shot('inventory-device-intake-desktop.png');

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-device-intake]'))");
    const mobile = await evaluate(cdp, `({
      form: Boolean(document.querySelector('[data-device-intake] form')),
      destination: Boolean(document.querySelector('#device-destination')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves intake form', mobile.form, mobile);
    check('Mobile preserves destination routing', mobile.destination, mobile);
    check('Mobile page avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('inventory-device-intake-mobile.png');
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'inventory.device-intake',
      targetUrl,
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Inventory device intake browser QA failed: ${failures.join('; ')}`);
}
