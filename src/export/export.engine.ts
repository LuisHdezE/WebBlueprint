import packageJsonTemplateText from '../../package.json?raw';
import packageLockTemplateText from '../../package-lock.json?raw';
import eslintTemplateText from '../../eslint.config.js?raw';
import { getSelectedProjectViews } from '@/composer/project.catalog';
import type { BlueprintProjectManifest, ProjectViewDefinition } from '@/composer/project.types';
import type { ExportProject, ExportProjectFile } from '@/export/export.types';
import { createStoredZip } from '@/export/export.zip';
import { themePresets } from '@/theme/themeContext';

type PackageTemplate = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  engines?: Record<string, string>;
};

type PackageLockTemplate = {
  name?: string;
  version?: string;
  packages?: Record<string, { name?: string; version?: string }>;
};

const packageTemplate = JSON.parse(packageJsonTemplateText) as PackageTemplate;

function slugify(value: string) {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'webblueprint-app'
  );
}

function featureKey(view: ProjectViewDefinition) {
  return slugify(view.id.replaceAll('.', '-'));
}

function componentName(view: ProjectViewDefinition) {
  const name = featureKey(view)
    .split('-')
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('');
  return `${name || 'Generated'}Page`;
}

function assertExportableManifest(manifest: BlueprintProjectManifest) {
  if (manifest.schemaVersion !== '1.0') {
    throw new Error('Solo se puede exportar BlueprintProjectManifest v1.');
  }
  if (!manifest.application.name.trim()) {
    throw new Error('No se puede exportar una aplicación sin nombre.');
  }
  if (manifest.views.length === 0) {
    throw new Error('Selecciona al menos una vista antes de exportar.');
  }

  const selected = getSelectedProjectViews(manifest.views);
  if (selected.length !== manifest.views.length) {
    throw new Error('El manifest contiene una vista que no existe en el catálogo exportable.');
  }
}

function createPackageJson(manifest: BlueprintProjectManifest) {
  return `${JSON.stringify(
    {
      name: slugify(manifest.application.name),
      private: true,
      version: '0.1.0',
      type: 'module',
      engines: packageTemplate.engines,
      scripts: {
        dev: 'vite',
        build: 'tsc --noEmit && vite build',
        preview: 'vite preview',
        typecheck: 'tsc --noEmit --pretty false',
        lint: 'eslint . --max-warnings=0',
        test: 'vitest',
        'test:run': 'vitest run',
        check: 'npm run typecheck && npm run lint && npm run test:run && npm run build',
      },
      dependencies: packageTemplate.dependencies,
      devDependencies: packageTemplate.devDependencies,
    },
    null,
    2,
  )}\n`;
}

function createPackageLock(manifest: BlueprintProjectManifest) {
  const packageName = slugify(manifest.application.name);
  const lock = JSON.parse(packageLockTemplateText) as PackageLockTemplate;
  lock.name = packageName;
  lock.version = '0.1.0';
  const rootPackage = lock.packages?.[''];
  if (rootPackage) {
    rootPackage.name = packageName;
    rootPackage.version = '0.1.0';
  }
  return `${JSON.stringify(lock, null, 2)}\n`;
}

function createProjectConfig(manifest: BlueprintProjectManifest, views: readonly ProjectViewDefinition[]) {
  return `export const projectConfig = ${JSON.stringify(
    {
      application: manifest.application,
      presetId: manifest.presetId,
      theme: manifest.theme,
      views: views.map(({ id, path, label, section, category, childLabel }) => ({ id, path, label, section, category, childLabel })),
    },
    null,
    2,
  )} as const;\n`;
}

function createThemeCss(manifest: BlueprintProjectManifest) {
  const theme = themePresets.find((candidate) => candidate.id === manifest.theme.colorId) ?? themePresets[0];
  if (!theme) {
    throw new Error('No existe un tema disponible para la exportación.');
  }

  return `:root {\n  --theme-primary: ${theme.primary};\n  --theme-primary-hover: ${theme.primaryHover};\n  --theme-primary-active: ${theme.primaryActive};\n  --theme-primary-soft: ${theme.primarySoft};\n  --theme-primary-muted: ${theme.primaryMuted};\n  --theme-primary-border: ${theme.primaryBorder};\n  --theme-on-primary: ${theme.onPrimary};\n  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\n  color: #0f172a;\n  background: #f8fafc;\n}\n* { box-sizing: border-box; }\nbody { margin: 0; min-width: 320px; min-height: 100vh; }\nbutton { font: inherit; }\n`;
}

const shellCss = `.app-shell { min-height: 100vh; display: grid; grid-template-columns: 232px minmax(0, 1fr); background: #f8fafc; }\n.sidebar { height: 100vh; position: sticky; top: 0; overflow: auto; border-right: 1px solid #e2e8f0; background: #fff; padding: 12px 10px; }\n.brand { display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 2px 6px 12px; border-bottom: 1px solid #e2e8f0; }\n.brand img, .brand-mark { width: 32px; height: 32px; border-radius: 8px; object-fit: contain; background: var(--theme-primary); }\n.brand strong { display: block; font-size: 13px; }\n.brand span { display: block; margin-top: 2px; color: #64748b; font-size: 9px; }\n.nav-section { margin-top: 12px; }\n.nav-section-title { padding: 0 8px 5px; color: #94a3b8; font-size: 9px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }\n.nav-item { width: 100%; min-height: 34px; display: flex; align-items: center; gap: 8px; border: 0; border-left: 2px solid transparent; border-radius: 7px; background: transparent; color: #475569; cursor: pointer; padding: 7px 9px; text-align: left; font-size: 11.5px; }\n.nav-item:hover { background: var(--theme-primary-soft); color: var(--theme-primary); }\n.nav-item.active { border-left-color: var(--theme-primary); background: var(--theme-primary-soft); color: var(--theme-primary-active); font-weight: 700; }\n.workspace { min-width: 0; }\n.topbar { min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 12px; position: sticky; top: 0; z-index: 10; border-bottom: 1px solid #e2e8f0; background: var(--theme-primary); color: var(--theme-on-primary); padding: 8px 18px; }\n.topbar strong { display: block; font-size: 12px; }\n.topbar span { display: block; margin-top: 2px; color: color-mix(in srgb, var(--theme-on-primary) 68%, transparent); font-size: 9px; }\n.content { max-width: 1200px; margin: 0 auto; padding: 22px; }\n.view-card { border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; padding: 22px; box-shadow: 0 1px 2px rgba(15, 23, 42, .04); }\n.view-card h1 { margin: 4px 0 0; font-size: 28px; letter-spacing: -.03em; }\n.eyebrow { margin: 0; color: var(--theme-primary); font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }\n.summary { margin: 9px 0 0; color: #64748b; font-size: 13px; line-height: 1.65; }\n.metrics { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 10px; margin-top: 18px; }\n.metric { border: 1px solid #e2e8f0; border-radius: 9px; background: #f8fafc; padding: 12px; }\n.metric span { display: block; color: #94a3b8; font-size: 9px; text-transform: uppercase; }\n.metric strong { display: block; margin-top: 5px; font-size: 18px; }\n.items { display: grid; gap: 8px; margin-top: 18px; }\n.item { border: 1px solid #e2e8f0; border-radius: 9px; padding: 12px; }\n.item strong { font-size: 12px; }\n.item p { margin: 4px 0 0; color: #64748b; font-size: 11px; line-height: 1.5; }\n.state { border: 1px dashed #cbd5e1; border-radius: 9px; background: #f8fafc; color: #64748b; padding: 24px; text-align: center; font-size: 12px; }\n.error { border-color: #fecaca; background: #fef2f2; color: #991b1b; }\n@media (max-width: 760px) { .app-shell { grid-template-columns: 76px minmax(0, 1fr); } .brand-copy, .nav-label, .nav-section-title { display: none; } .nav-item { justify-content: center; padding-inline: 5px; } .content { padding: 14px; } .metrics { grid-template-columns: 1fr; } }\n`;

const asyncStateSource = `export type AsyncState<T> =\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'empty' }\n  | { status: 'error'; message: string };\n`;

const viewContentSource = `export type ViewMetric = { label: string; value: string };\nexport type ViewItem = { id: string; title: string; description: string };\nexport type ViewContent = {\n  schemaVersion: '1.0';\n  viewId: string;\n  title: string;\n  summary: string;\n  metrics: readonly ViewMetric[];\n  items: readonly ViewItem[];\n};\n`;

const viewStateSource = `import type { ReactNode } from 'react';\n\ntype Props = { children?: ReactNode; kind: 'loading' | 'empty' | 'error'; message?: string };\n\nexport function ViewState({ children, kind, message }: Props) {\n  return <div className={kind === 'error' ? 'state error' : 'state'}>{children ?? message ?? kind}</div>;\n}\n`;

function createViewRepositorySource(view: ProjectViewDefinition) {
  const typeName = `${componentName(view).replace(/Page$/, '')}Repository`;
  return `import type { ViewContent } from '../../../core/domain/ViewContent';\n\nexport interface ${typeName} {\n  load(): Promise<ViewContent>;\n}\n`;
}

function createUseCaseSource(view: ProjectViewDefinition) {
  const base = componentName(view).replace(/Page$/, '');
  return `import type { ${base}Repository } from './${base}Repository';\n\nexport function load${base}(repository: ${base}Repository) {\n  return repository.load();\n}\n`;
}

function createMock(view: ProjectViewDefinition) {
  return {
    schemaVersion: '1.0',
    viewId: view.id,
    title: view.label,
    summary: `Datos contract-first de ejemplo para ${view.label}. La futura API podrá sustituir este adapter sin cambiar Presentation.`,
    metrics: [
      { label: 'Estado', value: 'Operativo' },
      { label: 'Fuente', value: 'JSON local' },
      { label: 'Contrato', value: 'v1.0' },
    ],
    items: [
      { id: `${featureKey(view)}-001`, title: `${view.childLabel} · ejemplo 1`, description: `Registro determinista para ${view.section}.` },
      { id: `${featureKey(view)}-002`, title: `${view.childLabel} · ejemplo 2`, description: 'La capa de presentación no conoce la fuente de datos.' },
    ],
  };
}

function createJsonRepositorySource(view: ProjectViewDefinition) {
  const base = componentName(view).replace(/Page$/, '');
  return `import data from './mock.data.json';\nimport type { ViewContent } from '../../../core/domain/ViewContent';\nimport type { ${base}Repository } from '../application/${base}Repository';\n\nexport class Json${base}Repository implements ${base}Repository {\n  async load(): Promise<ViewContent> {\n    return data as ViewContent;\n  }\n}\n`;
}

function createPageSource(view: ProjectViewDefinition) {
  const base = componentName(view).replace(/Page$/, '');
  const page = componentName(view);
  return `import { useEffect, useState } from 'react';\nimport type { AsyncState } from '../../../core/contracts/AsyncState';\nimport type { ViewContent } from '../../../core/domain/ViewContent';\nimport { ViewState } from '../../../shared/ui/ViewState';\nimport { load${base} } from '../application/load${base}';\nimport type { ${base}Repository } from '../application/${base}Repository';\n\ntype Props = { repository: ${base}Repository };\n\nexport function ${page}({ repository }: Props) {\n  const [state, setState] = useState<AsyncState<ViewContent>>({ status: 'loading' });\n\n  useEffect(() => {\n    let active = true;\n    void load${base}(repository)\n      .then((data) => {\n        if (!active) return;\n        setState(data.items.length === 0 && data.metrics.length === 0 ? { status: 'empty' } : { status: 'success', data });\n      })\n      .catch((error: unknown) => {\n        if (!active) return;\n        setState({ status: 'error', message: error instanceof Error ? error.message : 'No fue posible cargar la vista.' });\n      });\n    return () => { active = false; };\n  }, [repository]);\n\n  if (state.status === 'loading') return <ViewState kind="loading">Cargando ${view.label}…</ViewState>;\n  if (state.status === 'empty') return <ViewState kind="empty">No hay datos para ${view.label}.</ViewState>;\n  if (state.status === 'error') return <ViewState kind="error" message={state.message} />;\n\n  return (\n    <section className="view-card">\n      <p className="eyebrow">${view.section}</p>\n      <h1>{state.data.title}</h1>\n      <p className="summary">{state.data.summary}</p>\n      <div className="metrics">{state.data.metrics.map((metric) => <div className="metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>)}</div>\n      <div className="items">{state.data.items.map((item) => <article className="item" key={item.id}><strong>{item.title}</strong><p>{item.description}</p></article>)}</div>\n    </section>\n  );\n}\n`;
}

function createProvidersSource(views: readonly ProjectViewDefinition[]) {
  const imports = views
    .map((view) => {
      const base = componentName(view).replace(/Page$/, '');
      return `import { Json${base}Repository } from '../../features/${featureKey(view)}/infrastructure/Json${base}Repository';`;
    })
    .join('\n');
  const entries = views.map((view) => `  '${view.path}': new Json${componentName(view).replace(/Page$/, '')}Repository(),`).join('\n');
  return `${imports}\n\nexport const viewRepositories = {\n${entries}\n} as const;\n`;
}

function createRoutesSource(views: readonly ProjectViewDefinition[]) {
  const imports = views
    .map((view) => `import { ${componentName(view)} } from '../../features/${featureKey(view)}/presentation/${componentName(view)}';`)
    .join('\n');
  const entries = views
    .map(
      (view) =>
        `  { path: '${view.path}', label: ${JSON.stringify(view.label)}, section: ${JSON.stringify(view.section)}, element: <${componentName(view)} repository={viewRepositories['${view.path}']} /> },`,
    )
    .join('\n');
  return `import type { ReactNode } from 'react';\n${imports}\nimport { viewRepositories } from '../providers/viewRepositories';\n\nexport type AppRoute = { path: string; label: string; section: string; element: ReactNode };\n\nexport const appRoutes: readonly AppRoute[] = [\n${entries}\n];\n`;
}

const appShellSource = `import { useMemo, useState } from 'react';\nimport type { AppRoute } from '../app/router/routes';\nimport { projectConfig } from '../app/config/project';\n\ntype Props = { routes: readonly AppRoute[] };\n\nexport function AppShell({ routes }: Props) {\n  const [activePath, setActivePath] = useState(routes[0]?.path ?? '');\n  const active = routes.find((route) => route.path === activePath) ?? routes[0];\n  const sections = useMemo(() => {\n    const grouped = new Map<string, AppRoute[]>();\n    routes.forEach((route) => grouped.set(route.section, [...(grouped.get(route.section) ?? []), route]));\n    return [...grouped.entries()];\n  }, [routes]);\n\n  return (\n    <div className="app-shell">\n      <aside className="sidebar">\n        <div className="brand">\n          {projectConfig.application.logoDataUrl ? <img alt="Logo" src={projectConfig.application.logoDataUrl} /> : <span className="brand-mark" />}\n          <div className="brand-copy"><strong>{projectConfig.application.name}</strong><span>WebBlueprint export</span></div>\n        </div>\n        <nav>{sections.map(([section, items]) => <section className="nav-section" key={section}><div className="nav-section-title">{section}</div>{items.map((route, index) => <button className={route.path === active?.path ? 'nav-item active' : 'nav-item'} key={route.path} onClick={() => setActivePath(route.path)} type="button"><span>{String(index + 1).padStart(2, '0')}</span><span className="nav-label">{route.label}</span></button>)}</section>)}</nav>\n      </aside>\n      <div className="workspace">\n        <header className="topbar"><div><strong>{active?.label ?? projectConfig.application.name}</strong><span>{active?.path}</span></div><div><strong>{routes.findIndex((route) => route.path === active?.path) + 1} / {routes.length}</strong><span>Selección = Preview = Export</span></div></header>\n        <main className="content">{active?.element}</main>\n      </div>\n    </div>\n  );\n}\n`;

const appSource = `import { appRoutes } from './router/routes';\nimport { AppShell } from '../shell/AppShell';\n\nexport function App() {\n  return <AppShell routes={appRoutes} />;\n}\n`;

const mainSource = `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport { App } from './app/App';\nimport './theme/theme.css';\nimport './shell/shell.css';\n\ncreateRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);\n`;

function createRoutesTest(views: readonly ProjectViewDefinition[]) {
  return `import { describe, expect, it } from 'vitest';\nimport { appRoutes } from './routes';\n\ndescribe('generated route contract', () => {\n  it('preserves the exact Composer selection and order', () => {\n    expect(appRoutes.map((route) => route.path)).toEqual(${JSON.stringify(views.map((view) => view.path))});\n  });\n  it('does not generate duplicate routes', () => {\n    expect(new Set(appRoutes.map((route) => route.path)).size).toBe(appRoutes.length);\n  });\n});\n`;
}

function createContractSchema() {
  return `${JSON.stringify(
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: 'https://webblueprint.eliasworks.uy/contracts/view-content-v1.schema.json',
      title: 'WebBlueprint ViewContent contract',
      type: 'object',
      additionalProperties: false,
      required: ['schemaVersion', 'viewId', 'title', 'summary', 'metrics', 'items'],
      properties: {
        schemaVersion: { const: '1.0' },
        viewId: { type: 'string', minLength: 1 },
        title: { type: 'string', minLength: 1 },
        summary: { type: 'string' },
        metrics: {
          type: 'array',
          items: { type: 'object', additionalProperties: false, required: ['label', 'value'], properties: { label: { type: 'string' }, value: { type: 'string' } } },
        },
        items: {
          type: 'array',
          items: { type: 'object', additionalProperties: false, required: ['id', 'title', 'description'], properties: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' } } },
        },
      },
    },
    null,
    2,
  )}\n`;
}

function createReadme(manifest: BlueprintProjectManifest, views: readonly ProjectViewDefinition[]) {
  return `# ${manifest.application.name}\n\nAplicación React independiente generada por WebBlueprint desde \`BlueprintProjectManifest v1\`.\n\n## Selección exportada\n\n${views.map((view, index) => `${index + 1}. \`${view.path}\` · ${view.label}`).join('\n')}\n\n## Ejecutar\n\n\`\`\`bash\nnpm ci\nnpm run dev\n\`\`\`\n\n## Quality gate\n\n\`\`\`bash\nnpm run check\n\`\`\`\n\nEl manifest original se conserva en \`webblueprint.json\`. Los datos iniciales viven en adapters JSON de infraestructura y respetan \`contracts/view-content-v1.schema.json\`.\n`;
}

function createArchitectureDoc(views: readonly ProjectViewDefinition[]) {
  return `# Arquitectura generada\n\nEste proyecto aplica Clean Architecture pragmática y feature-first.\n\n\`Presentation → Application → Repository contract ← Infrastructure\`\n\n- Presentation no importa JSON ni implementaciones de infraestructura.\n- Los adapters JSON son reemplazables por adapters HTTP/API.\n- \`src/app/providers\` es el composition root que conecta contratos con implementaciones.\n- \`src/shared/ui\` contiene UI reusable sin crear rutas adicionales.\n- Solo se generaron ${views.length} vistas, exactamente en el orden del Blueprint Manifest.\n- \`contracts/\` documenta la forma esperada por una futura API.\n`;
}

function createContractsDoc(views: readonly ProjectViewDefinition[]) {
  return `# Contratos de datos\n\nContrato activo: \`ViewContent v1.0\`.\n\n${views.map((view) => `- \`${view.path}\` → \`src/features/${featureKey(view)}/infrastructure/mock.data.json\``).join('\n')}\n\nLa API futura debe devolver una forma compatible o introducir una versión explícita del contrato.\n`;
}

function createIndexHtml(manifest: BlueprintProjectManifest) {
  const favicon = manifest.application.faviconDataUrl
    ? `<link rel="icon" href=${JSON.stringify(manifest.application.faviconDataUrl)} />`
    : '';
  return `<!doctype html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    ${favicon}\n    <title>${manifest.application.name.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</title>\n  </head>\n  <body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body>\n</html>\n`;
}

const viteConfig = `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n`;

const tsconfig = `{\n  "compilerOptions": {\n    "target": "ES2023",\n    "useDefineForClassFields": true,\n    "lib": ["ES2023", "DOM", "DOM.Iterable"],\n    "skipLibCheck": true,\n    "strict": true,\n    "module": "ESNext",\n    "moduleResolution": "Bundler",\n    "resolveJsonModule": true,\n    "allowSyntheticDefaultImports": true,\n    "noEmit": true,\n    "jsx": "react-jsx",\n    "types": ["vite/client", "vitest/globals"]\n  },\n  "include": ["src", "vite.config.ts"]\n}\n`;

export function buildReactExportProject(manifest: BlueprintProjectManifest): ExportProject {
  assertExportableManifest(manifest);
  const views = getSelectedProjectViews(manifest.views);
  const rootName = slugify(manifest.application.name);

  const files: ExportProjectFile[] = [
    { path: '.gitignore', content: 'node_modules\ndist\ncoverage\n.DS_Store\n' },
    { path: 'README.md', content: createReadme(manifest, views) },
    { path: 'contracts/README.md', content: createContractsDoc(views) },
    { path: 'contracts/view-content-v1.schema.json', content: createContractSchema() },
    { path: 'docs/architecture.md', content: createArchitectureDoc(views) },
    { path: 'eslint.config.js', content: eslintTemplateText },
    { path: 'index.html', content: createIndexHtml(manifest) },
    { path: 'package-lock.json', content: createPackageLock(manifest) },
    { path: 'package.json', content: createPackageJson(manifest) },
    { path: 'src/app/App.tsx', content: appSource },
    { path: 'src/app/config/project.ts', content: createProjectConfig(manifest, views) },
    { path: 'src/app/providers/viewRepositories.ts', content: createProvidersSource(views) },
    { path: 'src/app/router/routes.test.ts', content: createRoutesTest(views) },
    { path: 'src/app/router/routes.tsx', content: createRoutesSource(views) },
    { path: 'src/core/contracts/AsyncState.ts', content: asyncStateSource },
    { path: 'src/core/domain/ViewContent.ts', content: viewContentSource },
    { path: 'src/main.tsx', content: mainSource },
    { path: 'src/shared/ui/ViewState.tsx', content: viewStateSource },
    { path: 'src/shell/AppShell.tsx', content: appShellSource },
    { path: 'src/shell/shell.css', content: shellCss },
    { path: 'src/theme/theme.css', content: createThemeCss(manifest) },
    { path: 'tsconfig.json', content: tsconfig },
    { path: 'vite.config.ts', content: viteConfig },
    { path: 'webblueprint.json', content: `${JSON.stringify(manifest, null, 2)}\n` },
  ];

  for (const view of views) {
    const base = componentName(view).replace(/Page$/, '');
    const root = `src/features/${featureKey(view)}`;
    files.push(
      { path: `${root}/application/${base}Repository.ts`, content: createViewRepositorySource(view) },
      { path: `${root}/application/load${base}.ts`, content: createUseCaseSource(view) },
      { path: `${root}/infrastructure/Json${base}Repository.ts`, content: createJsonRepositorySource(view) },
      { path: `${root}/infrastructure/mock.data.json`, content: `${JSON.stringify(createMock(view), null, 2)}\n` },
      { path: `${root}/presentation/${componentName(view)}.tsx`, content: createPageSource(view) },
    );
  }

  return { rootName, files };
}

export function buildReactExportZip(manifest: BlueprintProjectManifest) {
  const project = buildReactExportProject(manifest);
  return { fileName: `${project.rootName}.zip`, bytes: createStoredZip(project.files) };
}

export function downloadReactExportZip(manifest: BlueprintProjectManifest) {
  const { bytes, fileName } = buildReactExportZip(manifest);
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: 'application/zip' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(objectUrl);
}
