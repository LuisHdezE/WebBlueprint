import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { connectCdp, evaluate, launchChrome, navigate, pressTab, setViewport, waitFor } from './cdp-client.mjs';

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${baseUrl.replace(/\/$/, '')}/authentication/two-factor`;
  const checks = [];
  const failures = [];
  let chrome;
  let cdp;
  const check = (name, passed, details) => {
    checks.push({ name, status: passed ? 'PASS' : 'FAIL', details });
    if (!passed) failures.push(name);
  };
  const screenshot = async (name) => {
    const result = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    writeFileSync(join(artifactDir, name), Buffer.from(result.data, 'base64'));
  };
  const setCode = async (value) => {
    await evaluate(cdp, `(() => {
      const input = document.querySelector('#two-factor-code');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)});
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    })()`);
    await waitFor(cdp, `document.querySelector('#two-factor-code').value === ${JSON.stringify(value)}`);
  };
  const submit = () => evaluate(cdp, `document.querySelector('form').requestSubmit()`);
  const layout = () => evaluate(cdp, `(() => {
    const sections = [...document.querySelectorAll('main > div > section')];
    const rects = sections.map(s => s.getBoundingClientRect());
    const card = document.querySelector('main > div').getBoundingClientRect();
    const input = document.querySelector('#two-factor-code').getBoundingClientRect();
    return {
      twoPanel: Math.abs(rects[0].top - rects[1].top) <= 2 && rects[0].right <= rects[1].left + 2,
      heroHidden: getComputedStyle(sections[0]).display === 'none',
      noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
      noVerticalOverflow: document.documentElement.scrollHeight <= innerHeight + 1,
      cardInside: card.top >= 0 && card.bottom <= innerHeight + 1,
      inputInside: input.left >= 0 && input.right <= innerWidth && input.bottom <= innerHeight,
      legalInside: document.querySelector('main a:last-child').getBoundingClientRect().bottom <= innerHeight + 1,
    };
  })()`);
  mkdirSync(artifactDir, { recursive: true });
  try {
    const response = await fetch(targetUrl);
    check('Deep link responds successfully', response.ok, { status: response.status });
    chrome = await launchChrome();
    cdp = await connectCdp(chrome.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', { source: `
      window.__twoFactorErrors = [];
      window.addEventListener('error', e => window.__twoFactorErrors.push(String(e.message)));
      window.addEventListener('unhandledrejection', e => window.__twoFactorErrors.push(String(e.reason)));
    ` });
    await setViewport(cdp, { width: 1365, height: 611 });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, `Boolean(document.querySelector('#two-factor-code'))`);
    const structure = await evaluate(cdp, `(() => {
      const input = document.querySelector('#two-factor-code');
      return {
        standalone: !document.querySelector('aside'),
        landmark: document.querySelector('main').getAttribute('aria-labelledby'),
        label: document.querySelector('label[for="two-factor-code"]')?.textContent.trim(),
        type: input.type, inputMode: input.inputMode, autocomplete: input.autocomplete,
        describedBy: input.getAttribute('aria-describedby'),
        demo: document.querySelector('#two-factor-demo-notice').textContent,
        primary: getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim(),
      };
    })()`);
    check('Standalone auth surface', structure.standalone, structure);
    check('Main has a named landmark', structure.landmark === 'two-factor-title');
    check('Code has a programmatic label', Boolean(structure.label));
    check('Code preserves zeros and requests numeric keyboard', structure.type === 'text' && structure.inputMode === 'numeric');
    check('Code supports OTP autocomplete', structure.autocomplete === 'one-time-code');
    check('Code hint is associated', structure.describedBy === 'two-factor-code-hint');
    check('Demonstration is explicit before submission', structure.demo.includes('demostración') && structure.demo.includes('sesión real'));
    check('Theme token is resolved', Boolean(structure.primary));
    const initial = await layout();
    check('Desktop uses two panels', initial.twoPanel, initial);
    check('Desktop initial fits 1365x611 without scrolling', initial.noHorizontalOverflow && initial.noVerticalOverflow && initial.cardInside && initial.legalInside, initial);
    await screenshot('two-factor-desktop-initial.png');
    await evaluate(cdp, `document.body.setAttribute('tabindex', '-1'); document.body.focus()`);
    await pressTab(cdp);
    check('Keyboard starts on code with visible focus', await evaluate(cdp, `document.activeElement.id === 'two-factor-code' && document.activeElement.matches(':focus-visible')`));
    await submit();
    await waitFor(cdp, `Boolean(document.querySelector('#two-factor-code-error'))`);
    check('Empty code has associated alert and focus', await evaluate(cdp, `document.querySelector('#two-factor-code').getAttribute('aria-invalid') === 'true' && document.querySelector('#two-factor-code').getAttribute('aria-describedby').includes('two-factor-code-error') && document.querySelector('#two-factor-code-error').getAttribute('role') === 'alert' && document.activeElement.id === 'two-factor-code'`));
    for (const [label, value] of [['short', '12345'], ['long', '1234567'], ['letters', '12a456']]) {
      await setCode(value);
      await waitFor(cdp, `!document.querySelector('#two-factor-code-error')`);
      await submit();
      await waitFor(cdp, `Boolean(document.querySelector('#two-factor-code-error'))`);
      check(`Rejects ${label} code`, await evaluate(cdp, `!document.querySelector('[role="status"]') && !document.querySelector('button[type="submit"]').disabled`));
    }
    await setCode('001234');
    await submit();
    await waitFor(cdp, `document.querySelector('form').getAttribute('aria-busy') === 'true'`);
    check('Pending verification blocks editing and repeat submits', await evaluate(cdp, `document.querySelector('#two-factor-code').readOnly && document.querySelector('button[type="submit"]').disabled`));
    await submit();
    await waitFor(cdp, `Boolean(document.querySelector('[role="status"]'))`);
    await waitFor(cdp, `document.activeElement.getAttribute('role') === 'status'`);
    check('Valid code including leading zeros reaches success', await evaluate(cdp, `document.querySelector('[role="status"]').textContent.includes('Demostración completada')`));
    check('Success clears code without echoing it', await evaluate(cdp, `document.querySelector('#two-factor-code').value === '' && !document.querySelector('[role="status"]').textContent.includes('001234')`));
    check('Success is announced and focused', await evaluate(cdp, `document.activeElement.getAttribute('role') === 'status' && document.activeElement.getAttribute('aria-live') === 'polite'`));
    check('Completed demonstration cannot be submitted again', await evaluate(cdp, `document.querySelector('button[type="submit"]').disabled && document.querySelector('#two-factor-code').readOnly && document.querySelector('form').getAttribute('aria-busy') === 'false'`));
    const success = await layout();
    check('Desktop success fits 1365x611 without scrolling', success.noHorizontalOverflow && success.noVerticalOverflow && success.cardInside && success.legalInside, success);
    check('Navigation contracts present', await evaluate(cdp, `['/authentication/sign-in','/pages/privacy-policy','/pages/terms-of-service'].every(path => [...document.querySelectorAll('a')].some(a => new URL(a.href).pathname === path))`));
    check('Desktop has no runtime errors', await evaluate(cdp, `window.__twoFactorErrors.length === 0`));
    await screenshot('two-factor-desktop-success.png');
    await evaluate(cdp, `document.querySelector('a[href="/authentication/sign-in"]').click()`);
    await waitFor(cdp, `location.pathname === '/authentication/sign-in'`);
    check('Back to sign in navigates', await evaluate(cdp, `location.pathname === '/authentication/sign-in'`));
    await setViewport(cdp, { width: 390, height: 844, mobile: true });
    await navigate(cdp, targetUrl);
    await waitFor(cdp, `Boolean(document.querySelector('#two-factor-code'))`);
    const mobile = await layout();
    check('Mobile prioritizes form', mobile.heroHidden && mobile.inputInside, mobile);
    check('Mobile has no horizontal overflow', mobile.noHorizontalOverflow, mobile);
    await screenshot('two-factor-mobile-initial.png');
    await setCode('654321');
    await submit();
    await waitFor(cdp, `Boolean(document.querySelector('[role="status"]'))`);
    check('Mobile completes verification', await evaluate(cdp, `document.querySelector('#two-factor-code').value === ''`));
    check('Mobile has no runtime errors', await evaluate(cdp, `window.__twoFactorErrors.length === 0`));
    await screenshot('two-factor-mobile-success.png');
  } catch (error) {
    check('Browser scenario completes without infrastructure/runtime exception', false, { error: String(error.stack ?? error) });
  } finally {
    cdp?.close();
    await chrome?.stop();
    writeFileSync(join(artifactDir, 'report.json'), JSON.stringify({ schemaVersion: '1.0', view: 'authentication.two-factor', targetUrl, generatedAt: new Date().toISOString(), status: failures.length ? 'FAIL' : 'PASS', checks, failures }, null, 2));
  }
  if (failures.length) throw new Error(`Two Factor browser QA failed: ${failures.join('; ')}`);
  console.log(`Browser QA PASS: authentication.two-factor (${checks.length} checks).`);
}
