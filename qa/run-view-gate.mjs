import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function absolute(path) {
  return resolve(root, path);
}

function read(path) {
  const file = absolute(path);
  if (!existsSync(file)) {
    fail(`Missing required file: ${path}`);
    return '';
  }
  return readFileSync(file, 'utf8');
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const registryPath = 'qa/view-registry.json';
const registrySource = read(registryPath);
let registry;

try {
  registry = JSON.parse(registrySource);
} catch {
  fail(`${registryPath} must contain valid JSON.`);
  registry = { views: [] };
}

assert(registry.schemaVersion === '1.0', 'QA registry schemaVersion must be 1.0.');
assert(Array.isArray(registry.views) && registry.views.length > 0, 'QA registry must contain at least one completed real view.');

const router = read('src/app/router/AppRouter.tsx');
const deployment = read('.github/workflows/deploy-eliasworks.yml');

for (const view of registry.views ?? []) {
  const label = view.id ?? 'unnamed-view';
  const requiredFields = ['route', 'presentation', 'dto', 'contracts', 'content', 'checkpoint', 'browserQa'];

  for (const field of requiredFields) {
    assert(typeof view[field] === 'string' && view[field].length > 0, `${label}: missing registry field '${field}'.`);
  }

  if (!view.route || !view.presentation) continue;

  const presentation = read(view.presentation);
  const dto = read(view.dto);
  const contracts = read(view.contracts);
  const contentSource = read(view.content);
  const checkpoint = read(view.checkpoint);
  const browserScenario = read(view.browserQa);

  assert(
    router.includes(`path=\"${view.route}\"`),
    `${label}: completed view route '${view.route}' must be wired explicitly in AppRouter.`,
  );

  const routeIndex = router.indexOf(`path=\"${view.route}\"`);
  const templateShellIndex = router.indexOf('<Route element={<TemplateShell />}>');
  if (label.startsWith('authentication.')) {
    assert(
      routeIndex >= 0 && templateShellIndex >= 0 && routeIndex < templateShellIndex,
      `${label}: standalone authentication routes must be declared outside TemplateShell.`,
    );
  }

  for (const forbidden of ['infrastructure/', '.json', 'fetch(', 'localStorage', 'sessionStorage']) {
    assert(!presentation.includes(forbidden), `${label}: Presentation contains forbidden dependency/call '${forbidden}'.`);
  }

  assert(/Dto\b/.test(dto), `${label}: DTO boundary file must define DTO types.`);
  assert(/interface\s+\w+Provider\b|interface\s+\w+Gateway\b/.test(contracts), `${label}: contracts file must expose provider/gateway ports.`);
  assert(checkpoint.includes('QA status:'), `${label}: checkpoint must declare an explicit QA status.`);
  assert(browserScenario.includes('runBrowserQa'), `${label}: browser QA scenario must export runBrowserQa.`);

  let content;
  try {
    content = JSON.parse(contentSource);
  } catch {
    fail(`${label}: content adapter JSON is invalid.`);
    content = null;
  }

  if (content && typeof content === 'object') {
    const longStrings = [];
    const walk = (value) => {
      if (typeof value === 'string' && value.length >= 18 && !value.startsWith('/')) {
        longStrings.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(walk);
      } else if (value && typeof value === 'object') {
        Object.values(value).forEach(walk);
      }
    };
    walk(content);

    for (const text of longStrings) {
      assert(!presentation.includes(text), `${label}: user-facing content is duplicated/hardcoded in Presentation: '${text}'.`);
    }
  }

  assert(
    deployment.includes(view.route),
    `${label}: completed view route '${view.route}' must be covered by production deep-link smoke.`,
  );

  assert(Array.isArray(view.tests) && view.tests.length > 0, `${label}: registry must reference QA-relevant tests.`);
  for (const test of view.tests ?? []) read(test);
}

if (failures.length > 0) {
  console.error('Automated QA gate: FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Automated QA gate: PASS (${registry.views.length} registered real view${registry.views.length === 1 ? '' : 's'}).`);
