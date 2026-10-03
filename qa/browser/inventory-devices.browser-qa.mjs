import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/apps/inventory/devices`;
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
    await waitFor(cdp, "document.querySelectorAll('[data-inventory-devices] tbody tr').length===5");

    const desktop = await evaluate(cdp, `({
      title: document.querySelector('h1')?.textContent,
      total: document.querySelector('[data-data-table-count]')?.textContent,
      rows: document.querySelectorAll('[data-inventory-devices] tbody tr').length,
      hasNewLink: Boolean(document.querySelector('a[href="/apps/inventory/devices/new"]')),
      text: document.querySelector('[data-inventory-devices]')?.textContent,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Devices title is rendered', desktop.title === 'Dispositivos', desktop);
    check('Device list exposes 12 deterministic records', desktop.rows === 5 && desktop.total?.includes('12 de 12'), desktop);
    check('New device action is available', desktop.hasNewLink, desktop);
    check('Representative device data renders', desktop.text?.includes('iPhone 12') && desktop.text?.includes('Galaxy S21'), desktop);

    const interactions = await evaluate(cdp, `(async () => {
      const search = document.querySelector('#data-table-search');
      const setInput = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setInput.call(search, 'DEV-0291');
      search.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 60));
      const searchedRows = document.querySelectorAll('[data-inventory-devices] tbody tr').length;
      const searchedText = document.querySelector('[data-inventory-devices] tbody')?.textContent;

      const reset = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Restablecer');
      reset?.click();
      await new Promise((resolve) => setTimeout(resolve, 60));

      const filter = document.querySelector('#data-table-filter-destination');
      const setSelect = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
      setSelect.call(filter, 'Donor');
      filter.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 60));
      const filteredText = document.querySelector('[data-inventory-devices] tbody')?.textContent;
      const count = document.querySelector('[data-data-table-count]')?.textContent;

      reset?.click();
      await new Promise((resolve) => setTimeout(resolve, 60));
      const page2 = [...document.querySelectorAll('[data-data-table-pagination] button')].find((button) => button.textContent === '2');
      page2?.click();
      await new Promise((resolve) => setTimeout(resolve, 60));
      const pageText = document.querySelector('[data-data-table-pagination]')?.parentElement?.textContent;
      const pageRows = document.querySelectorAll('[data-inventory-devices] tbody tr').length;

      return { searchedRows, searchedText, filteredText, count, pageText, pageRows };
    })()`);
    check('Device search narrows to one record', interactions.searchedRows === 1 && interactions.searchedText?.includes('DEV-0291'), interactions);
    check('Destination filter isolates donors', interactions.count?.includes('4 de 12') && interactions.filteredText?.includes('Donante'), interactions);
    check('Device pagination reaches second page', interactions.pageText?.includes('Página 2 de 3') && interactions.pageRows === 5, interactions);
    check('Desktop has no page overflow', !desktop.overflow, desktop);
    await shot('inventory-devices-desktop.png');

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "Boolean(document.querySelector('[data-inventory-devices]'))");
    const mobile = await evaluate(cdp, `({
      table: Boolean(document.querySelector('[data-inventory-devices] [data-data-table]')),
      newLink: Boolean(document.querySelector('a[href="/apps/inventory/devices/new"]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves devices table', mobile.table, mobile);
    check('Mobile preserves intake action', mobile.newLink, mobile);
    check('Mobile page avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('inventory-devices-mobile.png');
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'inventory.devices',
      targetUrl,
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Inventory devices browser QA failed: ${failures.join('; ')}`);
}
