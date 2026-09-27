import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/applications/blog/grid`;
  const checks = []; const failures = []; let chrome; let cdp;
  const check = (name, passed, details = undefined) => { checks.push({ name, status: passed ? 'PASS' : 'FAIL', details }); if (!passed) failures.push(name); };
  const screenshot = async (name) => { const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true }); writeFileSync(join(artifactDir, name), Buffer.from(result.data, 'base64')); };
  mkdirSync(artifactDir, { recursive: true });
  try {
    const response = await fetch(targetUrl); check('Deep link responds successfully', response.ok, { status: response.status });
    chrome = await launchChrome(); cdp = await connectCdp(chrome.webSocketDebuggerUrl); await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
    await setViewport(cdp, { width: 1365, height: 768 }); await navigate(cdp, targetUrl); await waitFor(cdp, `Boolean(document.querySelector('#blog-grid-search'))`);
    const initial = await evaluate(cdp, `(() => ({ title: document.querySelector('h1')?.textContent, articles: document.querySelectorAll('article').length, overflow: document.documentElement.scrollWidth > innerWidth, sidebar: Boolean(document.querySelector('aside')) }))()`);
    check('Grid title is rendered', initial.title === 'Blog · Cuadrícula', initial); check('Four shared posts are rendered', initial.articles === 4, initial); check('Template shell remains present', initial.sidebar, initial); check('Desktop has no horizontal overflow', !initial.overflow, initial); await screenshot('blog-grid-desktop.png');
    await evaluate(cdp, `(() => { const input=document.querySelector('#blog-grid-search'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,'arquitectura'); input.dispatchEvent(new Event('input',{bubbles:true})); })()`);
    await waitFor(cdp, `document.querySelectorAll('article').length === 1`); check('Shared search behavior filters grid', await evaluate(cdp, `document.querySelectorAll('article').length===1`));
    await setViewport(cdp, { width: 390, height: 844, mobile: true }); await navigate(cdp, targetUrl); await waitFor(cdp, `Boolean(document.querySelector('#blog-grid-search'))`);
    const mobile = await evaluate(cdp, `({ overflow: document.documentElement.scrollWidth > innerWidth, articles: document.querySelectorAll('article').length })`); check('Mobile keeps all posts', mobile.articles === 4, mobile); check('Mobile has no horizontal overflow', !mobile.overflow, mobile); await screenshot('blog-grid-mobile.png');
  } catch (error) { check('Browser scenario completes without runtime exception', false, { error: String(error.stack ?? error) }); }
  finally { cdp?.close(); await chrome?.stop(); writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({ schemaVersion: '1.0', view: 'applications.blog-grid', targetUrl, generatedAt: new Date().toISOString(), status: failures.length ? 'FAIL' : 'PASS', checks, failures }, null, 2)); }
  if (failures.length) throw new Error(`Blog Grid browser QA failed: ${failures.join('; ')}`);
}
