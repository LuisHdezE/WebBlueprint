import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

const scenarios = [
  {
    view: 'master-data.brands',
    path: 'admin/master-data/brands',
    marker: 'data-master-data-brands',
    title: 'Marcas',
    representative: 'Apple',
    search: 'samsung',
    expectedSearch: 'Samsung',
    createName: 'Nokia Demo',
    updateName: 'Nokia Demo Actualizada',
    fillScript: `
      document.querySelector('#brand-name').value = 'Nokia Demo';
      document.querySelector('#brand-name').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#brand-slug').value = 'nokia-demo';
      document.querySelector('#brand-slug').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#brand-sort-order').value = '990';
      document.querySelector('#brand-sort-order').dispatchEvent(new Event('input', { bubbles: true }));
    `,
    editScript: `
      document.querySelector('#brand-name').value = 'Nokia Demo Actualizada';
      document.querySelector('#brand-name').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#brand-slug').value = 'nokia-demo-actualizada';
      document.querySelector('#brand-slug').dispatchEvent(new Event('input', { bubbles: true }));
    `,
  },
  {
    view: 'master-data.device-models',
    path: 'admin/master-data/device-models',
    marker: 'data-master-data-device-models',
    title: 'Modelos de dispositivo',
    representative: 'iPhone 12',
    search: 'Galaxy S21',
    expectedSearch: 'Galaxy S21',
    createName: 'Nokia G22 Demo',
    updateName: 'Nokia G22 Demo Actualizado',
    fillScript: `
      document.querySelector('#model-name').value = 'Nokia G22 Demo';
      document.querySelector('#model-name').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#model-slug').value = 'nokia-g22-demo';
      document.querySelector('#model-slug').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#model-code').value = 'TA-1528';
      document.querySelector('#model-code').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#model-sort-order').value = '991';
      document.querySelector('#model-sort-order').dispatchEvent(new Event('input', { bubbles: true }));
    `,
    editScript: `
      document.querySelector('#model-name').value = 'Nokia G22 Demo Actualizado';
      document.querySelector('#model-name').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#model-slug').value = 'nokia-g22-demo-actualizado';
      document.querySelector('#model-slug').dispatchEvent(new Event('input', { bubbles: true }));
    `,
  },
  {
    view: 'master-data.categories',
    path: 'admin/master-data/categories',
    marker: 'data-master-data-categories',
    title: 'Categorías',
    representative: 'Repuestos',
    search: 'baterias-apple',
    expectedSearch: 'Baterías Apple',
    createName: 'Accesorios Demo',
    updateName: 'Accesorios Demo Actualizados',
    fillScript: `
      document.querySelector('#category-name').value = 'Accesorios Demo';
      document.querySelector('#category-name').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#category-slug').value = 'accesorios-demo';
      document.querySelector('#category-slug').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#category-description').value = 'Categoría demo para validar CRUD en memoria.';
      document.querySelector('#category-description').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#category-sort-order').value = '992';
      document.querySelector('#category-sort-order').dispatchEvent(new Event('input', { bubbles: true }));
    `,
    editScript: `
      document.querySelector('#category-name').value = 'Accesorios Demo Actualizados';
      document.querySelector('#category-name').dispatchEvent(new Event('input', { bubbles: true }));
      document.querySelector('#category-slug').value = 'accesorios-demo-actualizados';
      document.querySelector('#category-slug').dispatchEvent(new Event('input', { bubbles: true }));
    `,
  },
];

export async function runBrowserQa({ baseUrl, artifactDir }) {
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
    chrome = await launchChrome();
    cdp = await connectCdp(chrome.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    for (const scenario of scenarios) {
      const targetUrl = `${baseUrl.replace(/\/$/, '')}/${scenario.path}`;
      const response = await fetch(targetUrl);
      check(`${scenario.view} deep link responds successfully`, response.ok, { status: response.status, targetUrl });

      await setViewport(cdp, { width: 1365, height: 768 });
      await navigate(cdp, targetUrl);
      await waitFor(cdp, `Boolean(document.querySelector('[${scenario.marker}] [data-data-table]'))`);

      const desktop = await evaluate(cdp, `({
        title: document.querySelector('h1')?.textContent,
        total: document.querySelector('[data-data-table-count]')?.textContent,
        rows: document.querySelectorAll('[${scenario.marker}] tbody tr').length,
        text: document.querySelector('[${scenario.marker}]')?.textContent,
        hasCreate: Boolean(document.querySelector('[data-master-data-create]')),
        hasPersistenceNote: document.querySelector('[${scenario.marker}]')?.textContent?.includes('CRUD demo en memoria'),
        overflow: document.documentElement.scrollWidth > innerWidth
      })`);
      check(`${scenario.view} title is rendered`, desktop.title === scenario.title, desktop);
      check(`${scenario.view} table renders deterministic rows`, desktop.rows === 5 && desktop.text?.includes(scenario.representative), desktop);
      check(`${scenario.view} exposes create action and demo persistence note`, desktop.hasCreate && desktop.hasPersistenceNote, desktop);
      check(`${scenario.view} desktop has no page overflow`, !desktop.overflow, desktop);

      const interactions = await evaluate(cdp, `(async () => {
        const sleep = () => new Promise((resolve) => setTimeout(resolve, 100));
        const setInput = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        const setTextArea = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
        window.confirm = () => true;
        function input(selector, value) {
          const el = document.querySelector(selector);
          if (!el) throw new Error('Missing input ' + selector);
          const setter = el.tagName === 'TEXTAREA' ? setTextArea : setInput;
          setter.call(el, value);
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
        function clickByText(text) {
          const button = [...document.querySelectorAll('button')].find((candidate) => candidate.textContent?.trim() === text);
          if (!button) throw new Error('Missing button ' + text);
          button.click();
        }
        function search(value) {
          input('#data-table-search', value);
        }
        function tableText() {
          return document.querySelector('[${scenario.marker}]')?.textContent ?? '';
        }
        function bodyText() {
          return document.querySelector('[${scenario.marker}] tbody')?.textContent ?? '';
        }

        clickByText(document.querySelector('[data-master-data-create]')?.textContent?.trim() ?? '');
        await sleep();
        ${scenario.fillScript}
        clickByText(document.querySelector('[data-master-data-form] button[type="submit"]')?.textContent?.trim() ?? '');
        await sleep();
        search(${JSON.stringify(scenario.createName)});
        await sleep();
        const createdText = bodyText();

        clickByText('Editar');
        await sleep();
        ${scenario.editScript}
        clickByText(document.querySelector('[data-master-data-form] button[type="submit"]')?.textContent?.trim() ?? '');
        await sleep();
        search(${JSON.stringify(scenario.updateName)});
        await sleep();
        const updatedText = bodyText();

        clickByText('Desactivar');
        await sleep();
        const disabledText = bodyText();

        clickByText('Eliminar');
        await sleep();
        const deletedText = tableText();

        const reset = [...document.querySelectorAll('button')].find((button) => button.textContent === 'Restablecer');
        reset?.click();
        await sleep();
        search(${JSON.stringify(scenario.search)});
        await sleep();
        const searchedRows = document.querySelectorAll('[${scenario.marker}] tbody tr').length;
        const searchedText = bodyText();
        reset?.click();
        await sleep();
        const resetText = bodyText();

        return { createdText, updatedText, disabledText, deletedText, searchedRows, searchedText, resetText };
      })()`);
      check(`${scenario.view} creates a demo record`, interactions.createdText?.includes(scenario.createName), interactions);
      check(`${scenario.view} edits a demo record`, interactions.updatedText?.includes(scenario.updateName), interactions);
      check(`${scenario.view} deactivates a demo record`, interactions.disabledText?.includes('Inactivo'), interactions);
      check(`${scenario.view} deletes a demo record`, !interactions.deletedText?.includes(scenario.updateName), interactions);
      check(`${scenario.view} search narrows records`, interactions.searchedRows >= 1 && interactions.searchedText?.includes(scenario.expectedSearch), interactions);
      check(`${scenario.view} reset restores table`, interactions.resetText?.includes(scenario.representative), interactions);
      await shot(`${scenario.view.replaceAll('.', '-')}-desktop.png`);

      await setViewport(cdp, { width: 390, height: 844, mobile: true });
      await navigate(cdp, targetUrl);
      await waitFor(cdp, `Boolean(document.querySelector('[${scenario.marker}] [data-data-table]'))`);
      const mobile = await evaluate(cdp, `({
        title: document.querySelector('h1')?.textContent,
        table: Boolean(document.querySelector('[${scenario.marker}] [data-data-table]')),
        create: Boolean(document.querySelector('[data-master-data-create]')),
        actions: document.querySelector('[${scenario.marker}] tbody')?.textContent?.includes('Editar'),
        overflow: document.documentElement.scrollWidth > innerWidth
      })`);
      check(`${scenario.view} mobile preserves CRUD table`, mobile.title === scenario.title && mobile.table && mobile.create && mobile.actions, mobile);
      check(`${scenario.view} mobile avoids horizontal overflow`, !mobile.overflow, mobile);
      await shot(`${scenario.view.replaceAll('.', '-')}-mobile.png`);
    }
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'master-data.admin',
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Admin master data browser QA failed: ${failures.join('; ')}`);
}
