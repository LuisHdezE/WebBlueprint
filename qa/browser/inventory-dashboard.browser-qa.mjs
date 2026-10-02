import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/apps/inventory/dashboard`;
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
    await waitFor(cdp, "document.querySelectorAll('[data-inventory-metrics] article').length===8");
    const desktop = await evaluate(cdp, `({
      title: document.querySelector('h1')?.textContent,
      metrics: [...document.querySelectorAll('[data-inventory-metrics] article')].map((node) => node.textContent),
      queue: document.querySelector('[data-inventory-queue]')?.textContent,
      rows: document.querySelectorAll('[data-inventory-queue] tbody tr').length,
      total: document.querySelector('[data-data-table-count]')?.textContent,
      pagination: document.querySelector('[data-data-table-pagination]')?.textContent,
      icons: document.querySelectorAll('[data-inventory-metrics] article svg').length,
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Inventory title is rendered', desktop.title === 'Inventario', desktop);
    check('Eight operational KPIs render', desktop.metrics.length === 8, desktop);
    check('Every KPI renders a semantic icon', desktop.icons === 8, desktop);
    check('Inventory flow KPIs are visible', desktop.metrics.some((text) => text.includes('Pendientes de evaluación')) && desktop.metrics.some((text) => text.includes('Listos para venta')), desktop);
    check('Operational queue renders first paginated slice', desktop.rows === 5 && desktop.total?.includes('8 de 8') && desktop.pagination?.includes('2'), desktop);
    const interactions = await evaluate(cdp, `(async () => {
      const search = document.querySelector('#data-table-search');
      const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setValue.call(search, 'Galaxy A52'); search.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 50));
      const searchedRows = document.querySelectorAll('[data-inventory-queue] tbody tr').length;
      const searchedText = document.querySelector('[data-inventory-queue] tbody')?.textContent;
      document.querySelector('button[type="button"]:last-of-type');
      const reset = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Restablecer'); reset?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const firstRowCheck = document.querySelector('[data-inventory-queue] tbody input[type="checkbox"]'); firstRowCheck?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const selected = document.querySelector('[data-data-table-selected]')?.textContent;
      const page2 = [...document.querySelectorAll('[data-data-table-pagination] button')].find((button) => button.textContent === '2'); page2?.click();
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { searchedRows, searchedText, selected, page: document.querySelector('[data-data-table-pagination]')?.parentElement?.textContent, rowsOnPage2: document.querySelectorAll('[data-inventory-queue] tbody tr').length };
    })`);
    check('DataTable search narrows the queue', interactions.searchedRows === 1 && interactions.searchedText?.includes('Galaxy A52'), interactions);
    check('DataTable row selection updates counter', interactions.selected === '1 seleccionados', interactions);
    check('DataTable pagination reaches second page', interactions.page?.includes('Página 2 de 2') && interactions.rowsOnPage2 === 3, interactions);
    check('Desktop has no page overflow', !desktop.overflow, desktop);
    await shot('inventory-dashboard-desktop.png');

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, "document.querySelectorAll('[data-inventory-metrics] article').length===8");
    const mobile = await evaluate(cdp, `({
      metrics: document.querySelectorAll('[data-inventory-metrics] article').length,
      icons: document.querySelectorAll('[data-inventory-metrics] article svg').length,
      queue: Boolean(document.querySelector('[data-inventory-queue]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('Mobile preserves all KPIs', mobile.metrics === 8, mobile);
    check('Mobile preserves KPI icons', mobile.icons === 8, mobile);
    check('Mobile preserves operational queue', mobile.queue, mobile);
    check('Mobile page avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('inventory-dashboard-mobile.png');
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0', view: 'inventory.dashboard', targetUrl,
      generatedAt: new Date().toISOString(), status: failures.length ? 'FAIL' : 'PASS', checks, failures,
    }, null, 2));
  }
  if (failures.length) throw new Error(`Inventory dashboard browser QA failed: ${failures.join('; ')}`);
}
