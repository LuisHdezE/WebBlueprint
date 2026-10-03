import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

const routes = [
  { id: 'colors', path: '/admin/master-data/colors', title: 'Colores', expected: 'Negro' },
  { id: 'storage', path: '/admin/master-data/storage-capacities', title: 'Almacenamientos', expected: '128 GB' },
  { id: 'ram', path: '/admin/master-data/ram-capacities', title: 'RAM', expected: '8 GB' },
  { id: 'conditions', path: '/admin/master-data/conditions', title: 'Condiciones', expected: 'Usado A' },
  { id: 'spare-part-types', path: '/admin/master-data/spare-part-types', title: 'Tipos de repuesto', expected: 'Display OLED' },
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
    await setViewport(cdp, { width: 1365, height: 768 });

    for (const route of routes) {
      const targetUrl = `${baseUrl.replace(/\/$/, '')}${route.path}`;
      const response = await fetch(targetUrl);
      check(`${route.id}: deep link responds successfully`, response.ok, { status: response.status, targetUrl });

      await navigate(cdp, targetUrl);
      await waitFor(cdp, "Boolean(document.querySelector('[data-extended-master-data]'))");

      const initial = await evaluate(cdp, `({
        title: document.querySelector('h1')?.textContent,
        rootKind: document.querySelector('[data-extended-master-data]')?.getAttribute('data-extended-master-data'),
        tableText: document.querySelector('[data-extended-master-data]')?.textContent ?? '',
        createButton: Boolean(document.querySelector('[data-extended-master-data-create]')),
        rows: document.querySelectorAll('[data-extended-master-data] tbody tr').length,
        overflow: document.documentElement.scrollWidth > innerWidth
      })`);
      check(`${route.id}: title is rendered`, initial.title === route.title, initial);
      check(`${route.id}: canonical demo data is rendered`, initial.tableText.includes(route.expected), initial);
      check(`${route.id}: create action is available`, initial.createButton, initial);
      check(`${route.id}: table has rows`, initial.rows > 0, initial);
      check(`${route.id}: desktop has no horizontal overflow`, !initial.overflow, initial);

      const modal = await evaluate(cdp, `(async () => {
        document.querySelector('[data-extended-master-data-create]')?.click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        const dialog = document.querySelector('[role="dialog"]');
        const form = document.querySelector('[data-extended-master-data-form]');
        document.querySelector('[role="dialog"] button[type="button"]')?.click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        return {
          opened: Boolean(dialog),
          form: Boolean(form),
          closed: !document.querySelector('[role="dialog"]')
        };
      })()`);
      check(`${route.id}: compact create modal opens and closes`, modal.opened && modal.form && modal.closed, modal);
      await shot(`${route.id}-desktop.png`);
    }

    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, `${baseUrl.replace(/\/$/, '')}/admin/master-data/spare-part-types`);
    await waitFor(cdp, "Boolean(document.querySelector('[data-extended-master-data]'))");
    const mobile = await evaluate(cdp, `({
      root: Boolean(document.querySelector('[data-extended-master-data="sparePartTypes"]')),
      createButton: Boolean(document.querySelector('[data-extended-master-data-create]')),
      overflow: document.documentElement.scrollWidth > innerWidth
    })`);
    check('mobile preserves extended master data page', mobile.root && mobile.createButton, mobile);
    check('mobile page avoids horizontal overflow', !mobile.overflow, mobile);
    await shot('extended-master-data-mobile.png');
  } catch (error) {
    check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({
      schemaVersion: '1.0',
      view: 'master-data.extended',
      generatedAt: new Date().toISOString(),
      status: failures.length ? 'FAIL' : 'PASS',
      checks,
      failures,
    }, null, 2));
  }

  if (failures.length) throw new Error(`Extended master data browser QA failed: ${failures.join('; ')}`);
}
