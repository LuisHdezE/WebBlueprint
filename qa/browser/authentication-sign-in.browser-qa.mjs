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

async function click(cdp, selector) {
  const selectorLiteral = JSON.stringify(selector);
  return evaluate(cdp, `(() => {
    const element = document.querySelector(${selectorLiteral});
    if (!(element instanceof HTMLElement)) return false;
    element.click();
    return true;
  })()`);
}

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${normalizeBaseUrl(baseUrl)}/authentication/sign-in`;
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
    await waitFor(cdp, `document.querySelector('#sign-in-email') instanceof HTMLInputElement`);

    const desktopStructure = await evaluate(cdp, `(() => {
      const main = document.querySelector('main');
      const card = main?.firstElementChild;
      const sections = card ? [...card.querySelectorAll(':scope > section')] : [];
      const email = document.querySelector('#sign-in-email');
      const password = document.querySelector('#sign-in-password');
      const submit = document.querySelector('button[type="submit"]');
      const title = document.querySelector('#sign-in-title');
      const primary = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim();
      const cardStyle = card ? getComputedStyle(card) : null;
      const firstRect = sections[0]?.getBoundingClientRect();
      const secondRect = sections[1]?.getBoundingClientRect();
      return {
        mainLabelledBy: main?.getAttribute('aria-labelledby') ?? null,
        title: title?.textContent?.trim() ?? null,
        hasAside: Boolean(document.querySelector('aside')),
        hasEmail: email instanceof HTMLInputElement,
        hasPassword: password instanceof HTMLInputElement,
        hasSubmit: submit instanceof HTMLButtonElement,
        emailAutocomplete: email instanceof HTMLInputElement ? email.autocomplete : null,
        passwordAutocomplete: password instanceof HTMLInputElement ? password.autocomplete : null,
        emailLabel: document.querySelector('label[for="sign-in-email"]')?.textContent?.trim() ?? null,
        passwordLabel: document.querySelector('label[for="sign-in-password"]')?.textContent?.trim() ?? null,
        primary,
        cardRadius: cardStyle ? parseFloat(cardStyle.borderRadius) : 0,
        cardShadow: cardStyle?.boxShadow ?? 'none',
        twoColumn: Boolean(firstRect && secondRect && Math.abs(firstRect.top - secondRect.top) <= 2 && firstRect.right <= secondRect.left + 2),
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      };
    })()`);

    check('Standalone surface has no application sidebar', desktopStructure.hasAside === false, desktopStructure);
    check('Main landmark references Sign In title', desktopStructure.mainLabelledBy === 'sign-in-title', desktopStructure);
    check('Email field has programmatic label', desktopStructure.hasEmail && Boolean(desktopStructure.emailLabel), desktopStructure);
    check('Password field has programmatic label', desktopStructure.hasPassword && Boolean(desktopStructure.passwordLabel), desktopStructure);
    check('Submit action is present', desktopStructure.hasSubmit, desktopStructure);
    check('Autocomplete semantics are correct', desktopStructure.emailAutocomplete === 'email' && desktopStructure.passwordAutocomplete === 'current-password', desktopStructure);
    check('Style 1 card treatment is present', desktopStructure.cardRadius >= 24 && desktopStructure.cardShadow !== 'none', desktopStructure);
    check('Theme token is resolved', desktopStructure.primary.length > 0, desktopStructure);
    check('Desktop uses the intended two-panel layout', desktopStructure.twoColumn, desktopStructure);
    check('Desktop has no horizontal overflow', desktopStructure.noHorizontalOverflow, desktopStructure);

    await captureScreenshot(cdp, join(artifactDir, 'sign-in-desktop-initial.png'));

    await evaluate(cdp, `(() => {
      document.body.setAttribute('tabindex', '-1');
      document.body.focus();
      return document.activeElement === document.body;
    })()`);
    await pressTab(cdp);
    const firstKeyboardFocus = await evaluate(cdp, `({
      id: document.activeElement?.id ?? null,
      focusVisible: Boolean(document.activeElement?.matches?.(':focus-visible')),
    })`);
    check('Keyboard focus starts on email and remains visible', firstKeyboardFocus.id === 'sign-in-email' && firstKeyboardFocus.focusVisible, firstKeyboardFocus);
    await pressTab(cdp);
    const secondKeyboardFocus = await evaluate(cdp, `document.activeElement?.id ?? null`);
    check('Keyboard sequence reaches password field', secondKeyboardFocus === 'sign-in-password', { activeElement: secondKeyboardFocus });

    const toggleBefore = await evaluate(cdp, `document.querySelector('button[aria-controls="sign-in-password"]')?.getAttribute('aria-pressed')`);
    await click(cdp, 'button[aria-controls="sign-in-password"]');
    await waitFor(cdp, `document.querySelector('#sign-in-password')?.getAttribute('type') === 'text'`);
    const toggleShown = await evaluate(cdp, `({
      type: document.querySelector('#sign-in-password')?.getAttribute('type'),
      pressed: document.querySelector('button[aria-controls="sign-in-password"]')?.getAttribute('aria-pressed'),
    })`);
    check('Show password control exposes state accessibly', toggleBefore === 'false' && toggleShown.type === 'text' && toggleShown.pressed === 'true', { toggleBefore, ...toggleShown });
    await click(cdp, 'button[aria-controls="sign-in-password"]');
    await waitFor(cdp, `document.querySelector('#sign-in-password')?.getAttribute('type') === 'password'`);
    const toggleHidden = await evaluate(cdp, `({
      type: document.querySelector('#sign-in-password')?.getAttribute('type'),
      pressed: document.querySelector('button[aria-controls="sign-in-password"]')?.getAttribute('aria-pressed'),
    })`);
    check('Show password control restores masked state', toggleHidden.type === 'password' && toggleHidden.pressed === 'false', toggleHidden);

    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `document.querySelectorAll('[role="alert"]').length >= 2`);
    const requiredValidation = await evaluate(cdp, `({
      emailInvalid: document.querySelector('#sign-in-email')?.getAttribute('aria-invalid'),
      passwordInvalid: document.querySelector('#sign-in-password')?.getAttribute('aria-invalid'),
      emailDescribedBy: document.querySelector('#sign-in-email')?.getAttribute('aria-describedby'),
      passwordDescribedBy: document.querySelector('#sign-in-password')?.getAttribute('aria-describedby'),
      alerts: document.querySelectorAll('[role="alert"]').length,
    })`);
    check(
      'Required validation is announced and associated with controls',
      requiredValidation.emailInvalid === 'true' &&
        requiredValidation.passwordInvalid === 'true' &&
        requiredValidation.emailDescribedBy === 'sign-in-email-error' &&
        requiredValidation.passwordDescribedBy === 'sign-in-password-error' &&
        requiredValidation.alerts >= 2,
      requiredValidation,
    );

    await setInputValue(cdp, '#sign-in-email', 'qa-invalid');
    await setInputValue(cdp, '#sign-in-password', '123');
    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `document.querySelector('#sign-in-email')?.getAttribute('aria-invalid') === 'true' && document.querySelector('#sign-in-password')?.getAttribute('aria-invalid') === 'true'`);
    check('Invalid email and short password are rejected', true);

    await setInputValue(cdp, '#sign-in-email', 'qa@example.com');
    await setInputValue(cdp, '#sign-in-password', 'StrongPass123');
    const rememberBefore = await evaluate(cdp, `document.querySelector('input[type="checkbox"]')?.checked ?? null`);
    await click(cdp, 'input[type="checkbox"]');
    const rememberAfter = await evaluate(cdp, `document.querySelector('input[type="checkbox"]')?.checked ?? null`);
    check('Remember-me control is interactive', rememberBefore === false && rememberAfter === true, { rememberBefore, rememberAfter });

    const navigationContracts = await evaluate(cdp, `(() => {
      const links = [...document.querySelectorAll('a')].map((link) => new URL(link.href).pathname);
      return {
        forgot: links.includes('/authentication/password-reset'),
        createAccount: links.includes('/authentication/sign-up'),
        privacy: links.includes('/pages/privacy-policy'),
        terms: links.includes('/pages/terms-of-service'),
      };
    })()`);
    check('Authentication and legal navigation contracts are wired', Object.values(navigationContracts).every(Boolean), navigationContracts);

    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `Boolean(document.querySelector('[role="status"]'))`);
    const successState = await evaluate(cdp, `({
      hasStatus: Boolean(document.querySelector('[role="status"]')),
      emailInvalid: document.querySelector('#sign-in-email')?.getAttribute('aria-invalid'),
      passwordInvalid: document.querySelector('#sign-in-password')?.getAttribute('aria-invalid'),
    })`);
    check('Happy path reaches semantic success feedback', successState.hasStatus === true && successState.emailInvalid === 'false' && successState.passwordInvalid === 'false', successState);
    await captureScreenshot(cdp, join(artifactDir, 'sign-in-desktop-success.png'));

    const desktopRuntimeErrors = await evaluate(cdp, `window.__webBlueprintQaErrors ?? []`);
    check('Desktop has no runtime exceptions or unhandled rejections', Array.isArray(desktopRuntimeErrors) && desktopRuntimeErrors.length === 0, { runtimeErrors: desktopRuntimeErrors });

    await setViewport(cdp, mobileViewport);
    await navigate(cdp, targetUrl);
    await waitFor(cdp, `document.querySelector('#sign-in-email') instanceof HTMLInputElement`);
    const mobileStructure = await evaluate(cdp, `(() => {
      const card = document.querySelector('main')?.firstElementChild;
      const sections = card ? [...card.querySelectorAll(':scope > section')] : [];
      const hero = sections[0];
      const formSection = sections[1];
      const emailRect = document.querySelector('#sign-in-email')?.getBoundingClientRect();
      const passwordRect = document.querySelector('#sign-in-password')?.getBoundingClientRect();
      const toggleRect = document.querySelector('button[aria-controls="sign-in-password"]')?.getBoundingClientRect();
      const titleRect = document.querySelector('#sign-in-title')?.getBoundingClientRect();
      const submitRect = document.querySelector('button[type="submit"]')?.getBoundingClientRect();
      const rectanglesOverlap = (a, b) => Boolean(a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
      return {
        heroHidden: Boolean(hero && getComputedStyle(hero).display === 'none'),
        formVisible: Boolean(formSection && getComputedStyle(formSection).display !== 'none'),
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
        emailInsideViewport: Boolean(emailRect && emailRect.left >= 0 && emailRect.right <= window.innerWidth + 1),
        passwordInsideViewport: Boolean(passwordRect && passwordRect.left >= 0 && passwordRect.right <= window.innerWidth + 1),
        toggleDoesNotOverlapPassword: Boolean(passwordRect && toggleRect && !rectanglesOverlap(passwordRect, toggleRect)),
        primaryFlowVisible: Boolean(titleRect && submitRect && titleRect.top >= 0 && submitRect.bottom <= window.innerHeight + 1),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        titleTop: titleRect?.top ?? null,
        submitBottom: submitRect?.bottom ?? null,
        passwordBottom: passwordRect?.bottom ?? null,
        toggleTop: toggleRect?.top ?? null,
      };
    })()`);
    check('Mobile prioritizes authentication instead of the marketing hero', mobileStructure.heroHidden && mobileStructure.formVisible, mobileStructure);
    check('Mobile primary Sign In flow is visible in the initial viewport', mobileStructure.primaryFlowVisible, mobileStructure);
    check('Mobile password visibility control does not overlap the field', mobileStructure.toggleDoesNotOverlapPassword, mobileStructure);
    check('Mobile has no horizontal overflow', mobileStructure.noHorizontalOverflow, mobileStructure);
    check('Mobile form controls stay inside viewport', mobileStructure.emailInsideViewport && mobileStructure.passwordInsideViewport, mobileStructure);
    await captureScreenshot(cdp, join(artifactDir, 'sign-in-mobile-initial.png'));

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
    view: 'authentication.sign-in',
    targetUrl,
    generatedAt: new Date().toISOString(),
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    checks,
    failures,
  };
  writeFileSync(join(artifactDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

  if (failures.length > 0) {
    throw new Error(`Sign In browser QA failed:\n- ${failures.join('\n- ')}`);
  }

  console.log(`Browser QA PASS: authentication.sign-in (${checks.length} checks).`);
}
