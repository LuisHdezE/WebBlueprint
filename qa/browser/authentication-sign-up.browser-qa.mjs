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

const desktopViewport = { width: 1365, height: 611, deviceScaleFactor: 1, mobile: false };
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

async function setCheckbox(cdp, selector, checked) {
  const selectorLiteral = JSON.stringify(selector);
  const checkedLiteral = JSON.stringify(checked);
  return evaluate(cdp, `(() => {
    const input = document.querySelector(${selectorLiteral});
    if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox') return false;
    if (input.checked !== ${checkedLiteral}) input.click();
    return input.checked === ${checkedLiteral};
  })()`);
}

export async function runBrowserQa({ baseUrl, artifactDir }) {
  const targetUrl = `${normalizeBaseUrl(baseUrl)}/authentication/sign-up`;
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
    await waitFor(cdp, `document.querySelector('#sign-up-full-name') instanceof HTMLInputElement`);

    const desktopStructure = await evaluate(cdp, `(() => {
      const main = document.querySelector('main');
      const card = main?.firstElementChild;
      const sections = card ? [...card.querySelectorAll(':scope > section')] : [];
      const fullName = document.querySelector('#sign-up-full-name');
      const email = document.querySelector('#sign-up-email');
      const password = document.querySelector('#sign-up-password');
      const confirmPassword = document.querySelector('#sign-up-confirm-password');
      const terms = document.querySelector('#sign-up-terms');
      const submit = document.querySelector('button[type="submit"]');
      const firstRect = sections[0]?.getBoundingClientRect();
      const secondRect = sections[1]?.getBoundingClientRect();
      const cardRect = card?.getBoundingClientRect();
      const privacyLink = [...document.querySelectorAll('a')].find((link) => new URL(link.href).pathname === '/pages/privacy-policy');
      const legalRect = privacyLink?.parentElement?.getBoundingClientRect();
      const cardStyle = card ? getComputedStyle(card) : null;
      return {
        labelledBy: main?.getAttribute('aria-labelledby') ?? null,
        hasAside: Boolean(document.querySelector('aside')),
        fullNameLabel: document.querySelector('label[for="sign-up-full-name"]')?.textContent?.trim() ?? null,
        fullNameAutocomplete: fullName instanceof HTMLInputElement ? fullName.autocomplete : null,
        emailLabel: document.querySelector('label[for="sign-up-email"]')?.textContent?.trim() ?? null,
        emailAutocomplete: email instanceof HTMLInputElement ? email.autocomplete : null,
        passwordAutocomplete: password instanceof HTMLInputElement ? password.autocomplete : null,
        confirmPasswordAutocomplete: confirmPassword instanceof HTMLInputElement ? confirmPassword.autocomplete : null,
        hasTerms: terms instanceof HTMLInputElement && terms.type === 'checkbox',
        hasSubmit: submit instanceof HTMLButtonElement,
        primary: getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim(),
        cardRadius: cardStyle ? parseFloat(cardStyle.borderRadius) : 0,
        cardShadow: cardStyle?.boxShadow ?? 'none',
        twoColumn: Boolean(firstRect && secondRect && Math.abs(firstRect.top - secondRect.top) <= 2 && firstRect.right <= secondRect.left + 2),
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
        noVerticalOverflow: document.documentElement.scrollHeight <= window.innerHeight + 1,
        cardInsideViewport: Boolean(cardRect && cardRect.top >= 0 && cardRect.bottom <= window.innerHeight + 1),
        legalInsideViewport: Boolean(legalRect && legalRect.bottom <= window.innerHeight + 1),
      };
    })()`);

    check('Standalone surface has no application sidebar', desktopStructure.hasAside === false, desktopStructure);
    check('Main landmark references Sign Up title', desktopStructure.labelledBy === 'sign-up-title', desktopStructure);
    check('Full name field has programmatic label and autocomplete', Boolean(desktopStructure.fullNameLabel) && desktopStructure.fullNameAutocomplete === 'name', desktopStructure);
    check('Email field has programmatic label and autocomplete', Boolean(desktopStructure.emailLabel) && desktopStructure.emailAutocomplete === 'email', desktopStructure);
    check('Password fields use new-password autocomplete', desktopStructure.passwordAutocomplete === 'new-password' && desktopStructure.confirmPasswordAutocomplete === 'new-password', desktopStructure);
    check('Terms acceptance control is present', desktopStructure.hasTerms, desktopStructure);
    check('Submit action is present', desktopStructure.hasSubmit, desktopStructure);
    check('Style 1 card treatment is present', desktopStructure.cardRadius >= 24 && desktopStructure.cardShadow !== 'none', desktopStructure);
    check('Theme token is resolved', desktopStructure.primary.length > 0, desktopStructure);
    check('Desktop uses the intended two-panel layout', desktopStructure.twoColumn, desktopStructure);
    check('Desktop has no horizontal overflow', desktopStructure.noHorizontalOverflow, desktopStructure);
    check(
      'Desktop 1365x611 fits the complete initial view without vertical scroll',
      desktopStructure.noVerticalOverflow && desktopStructure.cardInsideViewport && desktopStructure.legalInsideViewport,
      desktopStructure,
    );
    await captureScreenshot(cdp, join(artifactDir, 'sign-up-desktop-initial.png'));

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
    check('Keyboard focus starts on full name and remains visible', keyboardFocus.id === 'sign-up-full-name' && keyboardFocus.focusVisible, keyboardFocus);

    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `document.querySelector('#sign-up-full-name')?.getAttribute('aria-invalid') === 'true'`);
    const requiredValidation = await evaluate(cdp, `({
      fullName: document.querySelector('#sign-up-full-name')?.getAttribute('aria-describedby'),
      email: document.querySelector('#sign-up-email')?.getAttribute('aria-describedby'),
      password: document.querySelector('#sign-up-password')?.getAttribute('aria-describedby'),
      confirmPassword: document.querySelector('#sign-up-confirm-password')?.getAttribute('aria-describedby'),
      terms: document.querySelector('#sign-up-terms')?.getAttribute('aria-describedby'),
      alerts: document.querySelectorAll('[role="alert"]').length,
    })`);
    check(
      'Required validation is announced and associated with registration controls',
      requiredValidation.fullName === 'sign-up-full-name-error' &&
        requiredValidation.email === 'sign-up-email-error' &&
        requiredValidation.password === 'sign-up-password-error' &&
        requiredValidation.confirmPassword === 'sign-up-confirm-password-error' &&
        requiredValidation.terms === 'sign-up-terms-error' &&
        requiredValidation.alerts >= 5,
      requiredValidation,
    );

    await setInputValue(cdp, '#sign-up-full-name', 'QA User');
    await setInputValue(cdp, '#sign-up-email', 'invalid-email');
    await setInputValue(cdp, '#sign-up-password', 'short');
    await setInputValue(cdp, '#sign-up-confirm-password', 'different');
    await setCheckbox(cdp, '#sign-up-terms', true);
    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `document.querySelector('#sign-up-email-error') instanceof HTMLElement`);
    const invalidValidation = await evaluate(cdp, `({
      email: Boolean(document.querySelector('#sign-up-email-error')),
      password: Boolean(document.querySelector('#sign-up-password-error')),
      confirmPassword: Boolean(document.querySelector('#sign-up-confirm-password-error')),
    })`);
    check('Malformed email is rejected', invalidValidation.email, invalidValidation);
    check('Short password is rejected', invalidValidation.password, invalidValidation);
    check('Mismatched password confirmation is rejected', invalidValidation.confirmPassword, invalidValidation);

    const validEmail = 'qa-signup@example.com';
    const validPassword = 'secure-pass';
    await setInputValue(cdp, '#sign-up-email', validEmail);
    await setInputValue(cdp, '#sign-up-password', validPassword);
    await setInputValue(cdp, '#sign-up-confirm-password', validPassword);
    await setCheckbox(cdp, '#sign-up-terms', true);
    await evaluate(cdp, `document.querySelector('form')?.requestSubmit()`);
    await waitFor(cdp, `Boolean(document.querySelector('[role="status"]'))`);
    const successState = await evaluate(cdp, `(() => {
      const status = document.querySelector('[role="status"]');
      return {
        hasStatus: Boolean(status),
        text: status?.textContent ?? '',
        emailInvalid: document.querySelector('#sign-up-email')?.getAttribute('aria-invalid'),
        confirmInvalid: document.querySelector('#sign-up-confirm-password')?.getAttribute('aria-invalid'),
        termsInvalid: document.querySelector('#sign-up-terms')?.getAttribute('aria-invalid'),
      };
    })()`);
    check(
      'Happy path reaches semantic success feedback',
      successState.hasStatus && successState.emailInvalid === 'false' && successState.confirmInvalid === 'false' && successState.termsInvalid === 'false',
      successState,
    );
    check('Success feedback does not echo submitted account identifiers or password', !successState.text.includes(validEmail) && !successState.text.includes(validPassword), successState);

    const successViewport = await evaluate(cdp, `(() => {
      const card = document.querySelector('main')?.firstElementChild;
      const cardRect = card?.getBoundingClientRect();
      const privacyLink = [...document.querySelectorAll('a')].find((link) => new URL(link.href).pathname === '/pages/privacy-policy');
      const legalRect = privacyLink?.parentElement?.getBoundingClientRect();
      return {
        noVerticalOverflow: document.documentElement.scrollHeight <= window.innerHeight + 1,
        cardInsideViewport: Boolean(cardRect && cardRect.top >= 0 && cardRect.bottom <= window.innerHeight + 1),
        legalInsideViewport: Boolean(legalRect && legalRect.bottom <= window.innerHeight + 1),
      };
    })()`);
    check(
      'Desktop success state also fits 1365x611 without vertical scroll',
      successViewport.noVerticalOverflow && successViewport.cardInsideViewport && successViewport.legalInsideViewport,
      successViewport,
    );

    const navigationContracts = await evaluate(cdp, `(() => {
      const links = [...document.querySelectorAll('a')].map((link) => new URL(link.href).pathname);
      return {
        signIn: links.includes('/authentication/sign-in'),
        privacy: links.includes('/pages/privacy-policy'),
        terms: links.includes('/pages/terms-of-service'),
      };
    })()`);
    check('Authentication and legal navigation contracts are wired', Object.values(navigationContracts).every(Boolean), navigationContracts);
    await captureScreenshot(cdp, join(artifactDir, 'sign-up-desktop-success.png'));

    const desktopRuntimeErrors = await evaluate(cdp, `window.__webBlueprintQaErrors ?? []`);
    check('Desktop has no runtime exceptions or unhandled rejections', Array.isArray(desktopRuntimeErrors) && desktopRuntimeErrors.length === 0, { runtimeErrors: desktopRuntimeErrors });

    await setViewport(cdp, mobileViewport);
    await navigate(cdp, targetUrl);
    await waitFor(cdp, `document.querySelector('#sign-up-full-name') instanceof HTMLInputElement`);
    const mobileStructure = await evaluate(cdp, `(() => {
      const card = document.querySelector('main')?.firstElementChild;
      const sections = card ? [...card.querySelectorAll(':scope > section')] : [];
      const hero = sections[0];
      const formSection = sections[1];
      const fullNameRect = document.querySelector('#sign-up-full-name')?.getBoundingClientRect();
      const emailRect = document.querySelector('#sign-up-email')?.getBoundingClientRect();
      const passwordRect = document.querySelector('#sign-up-password')?.getBoundingClientRect();
      const confirmRect = document.querySelector('#sign-up-confirm-password')?.getBoundingClientRect();
      const titleRect = document.querySelector('#sign-up-title')?.getBoundingClientRect();
      return {
        heroHidden: Boolean(hero && getComputedStyle(hero).display === 'none'),
        formVisible: Boolean(formSection && getComputedStyle(formSection).display !== 'none'),
        noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
        controlsInsideViewport: [fullNameRect, emailRect, passwordRect, confirmRect].every((rect) => rect && rect.left >= 0 && rect.right <= window.innerWidth + 1),
        primaryFlowStartsVisible: Boolean(titleRect && fullNameRect && titleRect.top >= 0 && fullNameRect.bottom <= window.innerHeight + 1),
      };
    })()`);
    check('Mobile prioritizes registration instead of the marketing hero', mobileStructure.heroHidden && mobileStructure.formVisible, mobileStructure);
    check('Mobile registration flow starts inside the initial viewport', mobileStructure.primaryFlowStartsVisible, mobileStructure);
    check('Mobile has no horizontal overflow', mobileStructure.noHorizontalOverflow, mobileStructure);
    check('Mobile registration controls stay inside viewport', mobileStructure.controlsInsideViewport, mobileStructure);
    await captureScreenshot(cdp, join(artifactDir, 'sign-up-mobile-initial.png'));

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
    view: 'authentication.sign-up',
    targetUrl,
    generatedAt: new Date().toISOString(),
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    checks,
    failures,
  };
  writeFileSync(join(artifactDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);

  if (failures.length > 0) {
    throw new Error(`Sign Up browser QA failed:\n- ${failures.join('\n- ')}`);
  }

  console.log(`Browser QA PASS: authentication.sign-up (${checks.length} checks).`);
}
