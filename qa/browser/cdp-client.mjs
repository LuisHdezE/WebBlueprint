import { spawn } from 'node:child_process';
import { accessSync, constants, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findChromeBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Try the next known binary location.
    }
  }

  throw new Error(`Chromium/Chrome executable not found. Checked: ${candidates.join(', ')}`);
}

async function waitForDebugTarget(port, timeoutMs = 10_000) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((target) => target.type === 'page' && target.webSocketDebuggerUrl);
        if (page) return page.webSocketDebuggerUrl;
      }
    } catch (error) {
      lastError = error;
    }

    await sleep(100);
  }

  throw new Error(`Chrome DevTools endpoint did not become ready.${lastError ? ` ${String(lastError)}` : ''}`);
}

export async function launchChrome({ port = 9222 } = {}) {
  const chromeBinary = findChromeBinary();
  const profileDir = mkdtempSync(join(tmpdir(), 'webblueprint-qa-chrome-'));
  const processHandle = spawn(
    chromeBinary,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--metrics-recording-only',
      '--no-first-run',
      `--remote-debugging-address=127.0.0.1`,
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );

  let stderr = '';
  processHandle.stderr?.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  try {
    const webSocketDebuggerUrl = await waitForDebugTarget(port);
    return {
      chromeBinary,
      webSocketDebuggerUrl,
      stop() {
        if (!processHandle.killed) processHandle.kill('SIGTERM');
        rmSync(profileDir, { recursive: true, force: true });
      },
    };
  } catch (error) {
    if (!processHandle.killed) processHandle.kill('SIGTERM');
    rmSync(profileDir, { recursive: true, force: true });
    throw new Error(`${error instanceof Error ? error.message : String(error)}\nChrome stderr:\n${stderr}`);
  }
}

export async function connectCdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 1;

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out connecting to Chrome DevTools WebSocket.')), 5_000);
    socket.addEventListener('open', () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
    socket.addEventListener('error', (event) => {
      clearTimeout(timeout);
      reject(new Error(`Chrome DevTools WebSocket error: ${event.message ?? 'unknown error'}`));
    }, { once: true });
  });

  socket.addEventListener('message', (event) => {
    const payload = JSON.parse(String(event.data));
    if (!payload.id) return;

    const resolver = pending.get(payload.id);
    if (!resolver) return;

    pending.delete(payload.id);
    if (payload.error) {
      resolver.reject(new Error(`${payload.error.message ?? 'CDP error'} (${payload.error.code ?? 'unknown'})`));
      return;
    }

    resolver.resolve(payload.result ?? {});
  });

  return {
    send(method, params = {}) {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    close() {
      socket.close();
    },
  };
}

export async function evaluate(cdp, expression, { awaitPromise = true } = {}) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true,
    userGesture: true,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? 'Browser evaluation failed.');
  }

  return result.result?.value;
}

export async function waitFor(cdp, expression, { timeoutMs = 5_000, intervalMs = 50 } = {}) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await evaluate(cdp, expression)) return;
    await sleep(intervalMs);
  }
  throw new Error(`Timed out waiting for browser condition: ${expression}`);
}

export async function setViewport(cdp, { width, height, deviceScaleFactor = 1, mobile = false }) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
}

export async function navigate(cdp, url) {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Page.navigate', { url });
  await waitFor(cdp, `document.readyState === 'complete'`);
}

export async function pressTab(cdp) {
  const event = {
    key: 'Tab',
    code: 'Tab',
    windowsVirtualKeyCode: 9,
    nativeVirtualKeyCode: 9,
  };
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', ...event });
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', ...event });
}
