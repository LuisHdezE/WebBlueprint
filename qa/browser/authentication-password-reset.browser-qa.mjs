import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  connectCdp,
  evaluate,
  launchChrome,
  navigate,
  pressTab,
  setViewport,
  waitFor,
} from './cdp-client.mjs';

const desktopViewport = { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false };
const mobileViewport = { width: 390, height: 844, deviceScaleFactor: 1, mobile: true };

function normalizeBaseUrl(baseUrl) {
  return baseUrl.replace(/\/$/, '');
}

async function captureScreenshot(cdp, path) {
  const result = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    fromSurface: true,
  });
  writeFileSync(path, Buffer.from(result.data, 'base64'));
}

async function setInputValue(cdp, selector, value) {
  const selectorLiteral = JSON.stringify(selector);
  const valueLiteral = JSON.stringify(value);
  return evaluate(cdp, `(() => {
    const input = document.querySelector(${selectorLiteral});
    if (!(input instanceof HTMLInputElement)) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    if (!setter) return false;
    setter.call(input, ${valueLiteral});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return input.value === ${valueLiteral};
  })()`);
}

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${normalizeBaseUrl(baseUrl)}/authentication/password-reset`;
  const checks = [];
  const failures = [];
  let chrome;
  let cdp;

  function check(name, passed, details = undefined) {
    checks.push({ name, status: passed ? 'PASS' : 'FAIL', details });
    if (!passed) failures.push(name);
  }

  mkdirSync(artifactDir, { recursive: true });

  try {
    const response = await fetch(targetUrl, { redirect: 'follow' });
    check('Deep link responds successfully', response.ok, { status: response.status, url: response.url });

    chrome = await launchChrome();
    cdp = await connectCdp(chrome.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        window.__webBlueprintQaErrors = [];
        window.addEventListener('error', (event) => {
          window.__webBlueprintQaErrors.push(String(event.error?.stack ?? event.message ?? 'window.error'));
        });
        window.addEventListener('unhandledrejection', (event) => {
          window.__webBlueprintQaErrors.push(String(event.reason?.stack ?? event.reason ?? 'unhandledrejection'));
        });
      `,
    });

    await setViewport(cdp, desktopViewport);
    await navigate(cdp, targetUrl);
    await waitFor(cdp, `document.querySelector('#password-reset-email') instanceof HTMLInputElement`);

    const desktopStructure = await evaluate(cdp, `(() => {
      const main = document.querySelector('main');
      const card = main?.firstElementChild;
      const sections = card ? [...card.querySelectorAll(':scope > section')] : [];
      const email = document.querySelector('#password-reset-email');
      const submit = document.querySelector('button[type="submit"]');
      const firstRect = sections[0]?.getBoundingClientRect();
      const secondRect = sections[1]?.getBoundingClientRect();
      const cardStyle = card ? getComputedStyle(card) : null;
      return {
        labelledBy: main?.getAttribute('aria-labelledby') ?? null,
        hasAside: Boolean(document.querySelector('aside')),
        hasEmail: email instanceof HTMLInputElement,
        emailLabel: document.querySelector('label[for="password-reset-email"]')?.textContent?.trim() ?? null,
        emailAutocomplete: email instanceof HTMLInputElement ? email.autocomplete : null,
        hasSubmit: submit instanceof HTMLButtonElement,
        primary: getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim(),
        cardRadius: cardStyle ? parseFloat(cardStyle.borderRadius) : 0,
        cardShadow: cardStyle?.boxShadow ?? 'none',
        twoColumn: Boolean(firstRect && secondRect && Math.abs(firstRect.top - secondRect.top) <= 2 && firstRect.right <= secondRect.left + 2),
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      };
    })()`);

    check('Standalone surface has no application sidebar', desktopStructure.hasAside === false, desktopStructure);
    check('Main landmark references Password Reset title', desktopStructure.labelledBy === 'password-reset-title', desktopStructure);
    check('Email field has programmatic label and autocomplete', desktopStructure.hasEmail && Boolean(desktopStructure.emailLabel) && desktopStructure.emailAutocomplete === 'email', desktopStructure);
    check('Submit action is present', desktopStructure.hasSubmit, desktopStructure);
    check('Style 1 card treatment is present', desktopStructure.cardRadius >= 24 && desktopStructure.cardShadow !== 'none', desktopStructure);
    check('Theme token is resolved', desktopStructure.primary.length > 0, desktopStructure);
    check('Desktop uses the intended two-panel layout', desktopStructure.twoColumn, desktopStructure);
    check('Desktop has no horizontal overflow', desktopStructure.noHorizontalOverflow, desktopStructure);
    await captureScreenshot(cdp, join(artifactDir, 'password-reset-desktop-initial.png'));

    await evaluate(cdp, `(() => {
      document.body.setAttribute('tabindex', '-1');
      document.body.focus();
      return document.activeElement === document.body;
    })()`);
    await pressTab(cdp);
    const keyboardFocus = await evaluate(cdp, `({
      id: document.activeElement?.id ?? null,
      focusVisible: Boolean(document.activeElement?.matches?.(':focus-visible')),
    })`);
    check('Keyboard focus starts on email and remains visible', keyboardFocus.id === 'password-reset-email' && keyboardFocus.focusVisible, keyboardFocus);

    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `document.querySelector('#password-reset-email')?.getAttribute('aria-invalid') === 'true'`);
    const requiredValidation = await evaluate(cdp, `({
      invalid: document.querySelector('#password-reset-email')?.getAttribute('aria-invalid'),
      describedBy: document.querySelector('#password-reset-email')?.getAttribute('aria-describedby'),
      hasAlert: Boolean(document.querySelector('#password-reset-email-error[role="alert"]')),
    })`);
    check('Required validation is announced and associated with email', requiredValidation.invalid === 'true' && requiredValidation.describedBy === 'password-reset-email-error' && requiredValidation.hasAlert, requiredValidation);

    await setInputValue(cdp, '#password-reset-email', 'invalid-email');
    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `document.querySelector('#password-reset-email-error') instanceof HTMLElement`);
    check('Malformed email is rejected', true);

    const validEmail = 'qa@example.com';
    await setInputValue(cdp, '#password-reset-email', validEmail);
    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `Boolean(document.querySelector('[role="status"]'))`);
    const successState = await evaluate(cdp, `(() => {
      const status = document.querySelector('[role="status"]');
      return {
        hasStatus: Boolean(status),
        text: status?.textContent ?? '',
        invalid: document.querySelector('#password-reset-email')?.getAttribute('aria-invalid'),
      };
    })()`);
    check('Happy path reaches semantic success feedback', successState.hasStatus && successState.invalid === 'false', successState);
    check('Success feedback does not echo the submitted account identifier', !successState.text.includes(validEmail), successState);

    const navigationContracts = await evaluate(cdp, `(() => {
      const links = [...document.querySelectorAll('a')].map((link) => new URL(link.href).pathname);
      return {
        signIn: links.includes('/authentication/sign-in'),
        privacy: links.includes('/pages/privacy-policy'),
        terms: links.includes('/pages/terms-of-service'),
      };
    })()`);
    check('Authentication and legal navigation contracts are wired', Object.values(navigationContracts).every(Boolean), navigationContracts);
    await captureScreenshot(cdp, join(artifactDir, 'password-reset-desktop-success.png'));

    const desktopRuntimeErrors = await evaluate(cdp, `window.__webBlueprintQaErrors ?? []`);
    check('Desktop has no runtime exceptions or unhandled rejections', Array.isArray(desktopRuntimeErrors) && desktopRuntimeErrors.length === 0, { runtimeErrors: desktopRuntimeErrors });

    await setViewport(cdp, mobileViewport);
    await navigate(cdp, targetUrl);
    await waitFor(cdp, `document.querySelector('#password-reset-email') instanceof HTMLInputElement`);
    const mobileStructure = await evaluate(cdp, `(() => {
      const card = document.querySelector('main')?.firstElementChild;
      const sections = card ? [...card.querySelectorAll(':scope > section')] : [];
      const hero = sections[0];
      const formSection = sections[1];
      const emailRect = document.querySelector('#password-reset-email')?.getBoundingClientRect();
      const titleRect = document.querySelector('#password-reset-title')?.getBoundingClientRect();
      const submitRect = document.querySelector('button[type="submit"]')?.getBoundingClientRect();
      return {
        heroHidden: Boolean(hero && getComputedStyle(hero).display === 'none'),
        formVisible: Boolean(formSection && getComputedStyle(formSection).display !== 'none'),
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
        emailInsideViewport: Boolean(emailRect && emailRect.left >= 0 && emailRect.right <= window.innerWidth + 1),
        primaryFlowVisible: Boolean(titleRect && submitRect && titleRect.top >= 0 && submitRect.bottom <= window.innerHeight + 1),
      };
    })()`);
    check('Mobile prioritizes recovery instead of the marketing hero', mobileStructure.heroHidden && mobileStructure.formVisible, mobileStructure);
    check('Mobile primary recovery flow is visible in the initial viewport', mobileStructure.primaryFlowVisible, mobileStructure);
    check('Mobile has no horizontal overflow', mobileStructure.noHorizontalOverflow, mobileStructure);
    check('Mobile email control stays inside viewport', mobileStructure.emailInsideViewport, mobileStructure);
    await captureScreenshot(cdp, join(artifactDir, 'password-reset-mobile-initial.png'));

    const mobileRuntimeErrors = await evaluate(cdp, `window.__webBlueprintQaErrors ?? []`);
    check('Mobile has no runtime exceptions or unhandled rejections', Array.isArray(mobileRuntimeErrors) && mobileRuntimeErrors.length === 0, { runtimeErrors: mobileRuntimeErrors });
  } catch (error) {
    check('Browser scenario completes without infrastructure/runtime exception', false, {
      error: error instanceof Error ? error.stack ?? error.message : String(error),
    });
  } finally {
    cdp?.close();
    if (chrome) await chrome.stop();
  }

  const report = {
    schemaVersion: '1.0',
    view: 'authentication.password-reset',
    targetUrl,
    generatedAt: new Date().toISOString(),
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    checks,
    failures,
  };
  writeFileSync(join(artifactDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

  if (failures.length > 0) {
    throw new Error(`Password Reset browser QA failed:\n- ${failures.join('\n- ')}`);
  }

  console.log(`Browser QA PASS: authentication.password-reset (${checks.length} checks).`);
}
