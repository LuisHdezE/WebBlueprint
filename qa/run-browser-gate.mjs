import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const registry = JSON.parse(readFileSync(resolve(root, 'qa/view-registry.json'), 'utf8'));
const evidenceLabel = process.env.QA_EVIDENCE_LABEL ?? (process.env.QA_BASE_URL ? 'runtime' : 'preview');
const artifactRoot = resolve(root, 'qa-artifacts', evidenceLabel);
const localBaseUrl = 'http://127.0.0.1:4173';
let previewProcess;
let previewOutput = '';

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

async function waitForUrl(url, timeoutMs = 15_000) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(200);
  }

  throw new Error(`QA target did not become ready at ${url}. ${lastError ? String(lastError) : ''}`);
}

async function startLocalPreview() {
  const viteCli = resolve(root, 'node_modules/vite/bin/vite.js');
  if (!existsSync(viteCli)) {
    throw new Error(`Vite CLI not found at ${viteCli}. Run npm ci before browser QA.`);
  }

  previewProcess = spawn(
    process.execPath,
    [viteCli, 'preview', '--host', '127.0.0.1', '--port', '4173'],
    { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
  );

  previewProcess.stdout?.on('data', (chunk) => {
    previewOutput += chunk.toString();
  });
  previewProcess.stderr?.on('data', (chunk) => {
    previewOutput += chunk.toString();
  });

  await waitForUrl(localBaseUrl);
  return localBaseUrl;
}

async function stopLocalPreview() {
  if (!previewProcess || previewProcess.exitCode !== null) return;

  previewProcess.kill('SIGTERM');
  await Promise.race([
    once(previewProcess, 'exit'),
    sleep(2_000),
  ]);

  if (previewProcess.exitCode === null) {
    previewProcess.kill('SIGKILL');
    await Promise.race([
      once(previewProcess, 'exit'),
      sleep(1_000),
    ]);
  }
}

async function main() {
  mkdirSync(artifactRoot, { recursive: true });

  const browserViews = (registry.views ?? []).filter((view) => typeof view.browserQa === 'string' && view.browserQa.length > 0);
  if (browserViews.length === 0) {
    throw new Error('Browser QA registry is empty. Every completed real view must provide browserQa evidence.');
  }

  const baseUrl = process.env.QA_BASE_URL ? process.env.QA_BASE_URL.replace(/\/$/, '') : await startLocalPreview();
  await waitForUrl(baseUrl);

  const failures = [];
  for (const view of browserViews) {
    const scenarioPath = resolve(root, view.browserQa);
    if (!existsSync(scenarioPath)) {
      failures.push(`${view.id}: browser QA scenario not found at ${view.browserQa}`);
      continue;
    }

    try {
      const module = await import(pathToFileURL(scenarioPath).href);
      if (typeof module.runBrowserQa !== 'function') {
        throw new Error(`${view.browserQa} must export runBrowserQa({ baseUrl, artifactDir }).`);
      }
      await module.runBrowserQa({
        baseUrl,
        artifactDir: resolve(artifactRoot, view.id),
      });
    } catch (error) {
      failures.push(`${view.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures.length > 0) {
    console.error('Browser QA gate: FAIL');
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Browser QA gate: PASS (${browserViews.length} registered real view${browserViews.length === 1 ? '' : 's'}, target=${baseUrl}).`);
}

try {
  await main();
} finally {
  await stopLocalPreview();
  if (process.exitCode && previewOutput) {
    console.error('Preview output:\n' + previewOutput);
  }
}
