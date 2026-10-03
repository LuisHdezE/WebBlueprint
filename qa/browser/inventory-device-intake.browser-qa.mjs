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
      brandOptions: [...document.querySelectorAll('#device-brand option')].map((option) => option.textContent),
      modelOptionsBeforeBrand: [...document.querySelectorAll('#device-model option')].map((option) => option.textContent),
      submitDisabled: document.querySelector('[data-device-intake] button[type="submit"]')?.disabled,
      demoText: document.querySelector('[data-device-intake]')?.textContent,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Intake title is rendered', initial.title === 'Registrar dispositivo', initial);
    check('Intake fields render with canonical brand/model selects', initial.inputs === 5 && initial.selects === 6 && initial.textareas === 1, initial);
    check('Brand select is fed by master data', initial.brandOptions?.includes('Apple') && initial.brandOptions?.includes('Samsung'), initial);
    check('Model select waits for brand selection', initial.modelOptionsBeforeBrand?.includes('Selecciona primero una marca'), initial);
    check('Submission starts disabled until canonical identity is complete', initial.submitDisabled === true, initial);
    check('Demo persistence boundary is visible', initial.demoText?.includes('Datos Maestros') && initial.demoText?.includes('no persiste datos'), initial);

    const interaction = await evaluate(cdp, `(async () => {
      const sleep = () => new Promise((resolve) => setTimeout(resolve, 80));
      const setInput = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      const setSelect = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
      function input(selector, value) {
        const el = document.querySelector(selector);
        setInput.call(el, value);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
      function select(selector, value) {
        const el = document.querySelector(selector);
        setSelect.call(el, value);
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }

      select('#device-brand', 'brand-apple');
      await sleep();
      const modelOptionsAfterBrand = [...document.querySelectorAll('#device-model option')].map((option) => ({ value: option.value, text: option.textContent }));
      select('#device-model', 'model-iphone-13');
      input('#device-identity', '359999999999991');
      await sleep();
      const hint = document.querySelector('[data-device-master-data-hint]')?.textContent ?? '';
      const button = document.querySelector('[data-device-intake] button[type="submit"]');
      const enabled = button?.disabled === false;
      button?.click();
      await sleep();
      return {
        modelOptionsAfterBrand,
        hint,
        enabled,
        success: document.querySelector('[data-device-intake-success]')?.textContent,
        backLink: Boolean(document.querySelector('a[href="/apps/inventory/devices"]'))
      };
    })()`);
    check('Model select is filtered by selected brand', interaction.modelOptionsAfterBrand?.some((option) => option.value === 'model-iphone-13') && !interaction.modelOptionsAfterBrand?.some((option) => option.value === 'model-galaxy-s21'), interaction);
    check('Canonical brand/model hint is shown', interaction.hint?.includes('Apple') && interaction.hint?.includes('iPhone 13'), interaction);
    check('Canonical identity completion enables submit', interaction.enabled, interaction);
    check('Demo submit renders success feedback', interaction.success?.includes('Ingreso preparado'), interaction);
    check('Back to devices action is available', interaction.backLink, interaction);
    check('Desktop has no page overflow', !initial.overflow, initial);
    await shot('inventory-device-intake-desktop.png');

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-device-intake]'))");
    const mobile = await evaluate(cdp, `({
      form: Boolean(document.querySelector('[data-device-intake] form')),
      brand: Boolean(document.querySelector('#device-brand')),
      model: Boolean(document.querySelector('#device-model')),
      destination: Boolean(document.querySelector('#device-destination')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves intake form', mobile.form, mobile);
    check('Mobile preserves canonical brand/model selection', mobile.brand && mobile.model, mobile);
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
