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
      storageOptions: [...document.querySelectorAll('#device-storage option')].map((option) => option.textContent),
      colorOptions: [...document.querySelectorAll('#device-color option')].map((option) => option.textContent),
      conditionOptions: [...document.querySelectorAll('#device-condition option')].map((option) => option.textContent),
      submitDisabled: document.querySelector('[data-device-intake] button[type="submit"]')?.disabled,
      demoText: document.querySelector('[data-device-intake]')?.textContent,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Intake title is rendered', initial.title === 'Registrar dispositivo', initial);
    check('Intake fields render with canonical master data selects', initial.inputs === 3 && initial.selects === 8 && initial.textareas === 1, initial);
    check('Brand select is fed by master data', initial.brandOptions?.includes('Apple') && initial.brandOptions?.includes('Samsung'), initial);
    check('Model select waits for brand selection', initial.modelOptionsBeforeBrand?.includes('Selecciona primero una marca'), initial);
    check('Storage select is fed by master data', initial.storageOptions?.includes('128 GB') && initial.storageOptions?.includes('256 GB'), initial);
    check('Color select is fed by master data', initial.colorOptions?.includes('Negro') && initial.colorOptions?.includes('Azul'), initial);
    check('Condition select is fed by master data', initial.conditionOptions?.includes('Usado A') && initial.conditionOptions?.includes('Para repuesto'), initial);
    check('Submission starts disabled until canonical attributes are complete', initial.submitDisabled === true, initial);
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
      select('#device-storage', 'storage-128gb');
      select('#device-color', 'color-black');
      select('#device-condition', 'condition-used-a');
      input('#device-identity', '359999999999991');
      await sleep();
      const hint = document.querySelector('[data-device-master-data-hint]')?.textContent ?? '';
      const conditionHint = document.querySelector('[data-device-condition-hint]')?.textContent ?? '';
      const button = document.querySelector('[data-device-intake] button[type="submit"]');
      const enabled = button?.disabled === false;
      button?.click();
      await sleep();
      return {
        modelOptionsAfterBrand,
        hint,
        conditionHint,
        enabled,
        success: document.querySelector('[data-device-intake-success]')?.textContent,
        backLink: Boolean(document.querySelector('a[href="/apps/inventory/devices"]'))
      };
    })()`);
    check('Model select is filtered by selected brand', interaction.modelOptionsAfterBrand?.some((option) => option.value === 'model-iphone-13') && !interaction.modelOptionsAfterBrand?.some((option) => option.value === 'model-galaxy-s21'), interaction);
    check('Canonical identity and attribute hint is shown', interaction.hint?.includes('Apple') && interaction.hint?.includes('iPhone 13') && interaction.hint?.includes('128 GB') && interaction.hint?.includes('Negro'), interaction);
    check('Canonical condition hint is shown', interaction.conditionHint?.includes('Usado A') && interaction.conditionHint?.includes('A'), interaction);
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
      storage: Boolean(document.querySelector('#device-storage')),
      color: Boolean(document.querySelector('#device-color')),
      condition: Boolean(document.querySelector('#device-condition')),
      destination: Boolean(document.querySelector('#device-destination')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves intake form', mobile.form, mobile);
    check('Mobile preserves canonical master data selection', mobile.brand && mobile.model && mobile.storage && mobile.color && mobile.condition, mobile);
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
