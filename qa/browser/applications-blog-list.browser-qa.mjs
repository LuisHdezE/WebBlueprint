import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/applications/blog/list`;
  const checks = []; const failures = []; let chrome; let cdp;
  const check = (name, passed, details = undefined) => { checks.push({ name, status: passed ? 'PASS' : 'FAIL', details }); if (!passed) failures.push(name); };
  const screenshot = async (name) => { const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); writeFileSync(join(artifactDir, name), Buffer.from(result.data, 'base64')); };
  mkdirSync(artifactDir, { recursive: true });
  try {
    const response = await fetch(targetUrl); check('Deep link responds successfully', response.ok, { status: response.status });
    chrome = await launchChrome(); cdp = await connectCdp(chrome.webSocketDebuggerUrl); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
    await setViewport(cdp, { width: 1365, height: 768 }); await navigate(cdp, targetUrl); await waitFor(cdp, `Boolean(document.querySelector('#blog-search'))`);
    const initial = await evaluate(cdp, `(() => ({ title: document.querySelector('h1')?.textContent, articles: document.querySelectorAll('article').length, overflow: document.documentElement.scrollWidth > innerWidth, sidebar: Boolean(document.querySelector('aside')), category: document.querySelector('#blog-category')?.value }))()`);
    check('Blog list title is rendered', initial.title === 'Blog · Lista', initial); check('Four governed posts are rendered', initial.articles === 4, initial); check('Template shell remains present', initial.sidebar, initial); check('Desktop has no horizontal overflow', !initial.overflow, initial); check('Default category is all', initial.category === 'all', initial);
    await screenshot('blog-list-desktop.png');
    await evaluate(cdp, `(() => { const input=document.querySelector('#blog-search'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,'arquitectura'); input.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    await waitFor(cdp, `document.querySelectorAll('article').length === 1`); check('Search filters posts', await evaluate(cdp, `document.querySelectorAll('article').length===1`));
    await evaluate(cdp, `(() => { const input=document.querySelector('#blog-search'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,'sin coincidencias'); input.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    await waitFor(cdp, `document.querySelectorAll('article').length === 0`); check('Empty state is exposed', await evaluate(cdp, `document.body.textContent.includes('No encontramos publicaciones')`));
    await setViewport(cdp, { width: 390, height: 844, mobile: true }); await navigate(cdp, targetUrl); await waitFor(cdp, `Boolean(document.querySelector('#blog-search'))`);
    const mobile = await evaluate(cdp, `({ overflow: document.documentElement.scrollWidth > innerWidth, articles: document.querySelectorAll('article').length })`); check('Mobile keeps all posts', mobile.articles === 4, mobile); check('Mobile has no horizontal overflow', !mobile.overflow, mobile); await screenshot('blog-list-mobile.png');
  } catch (error) { check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) }); }
  finally { cdp?.close(); await chrome?.stop(); writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({ schemaVersion: '1.0', view: 'applications.blog-list', targetUrl, generatedAt: new Date().toISOString(), status: failures.length ? 'FAIL' : 'PASS', checks, failures }, null, 2)); }
  if (failures.length) throw new Error(`Blog List browser QA failed: ${failures.join('; ')}`);
}
