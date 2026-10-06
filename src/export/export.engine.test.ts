import { describe, expect, it } from 'vitest';
import { applyProjectPreset, createDefaultProject } from '@/composer/project.logic';
import type { BlueprintProjectManifest } from '@/composer/project.types';
import { buildReactExportProject, buildReactExportZip } from '@/export/export.engine';

function createManifest(): BlueprintProjectManifest {
  return {
    ...createDefaultProject(),
    application: {
      name: 'Customer Portal',
      logoDataUrl: 'data:image/svg+xml;base64,PHN2Zy8+',
      faviconDataUrl: 'data:image/png;base64,aWNv',
    },
    theme: { colorId: 'blue' },
    views: ['/dashboard', '/applications/ecommerce/products', '/pages/contact'],
  };
}

describe('G2 ZIP Export v1', () => {
  it('generates a deterministic standalone project from BlueprintProjectManifest v1', () => {
    const manifest = createManifest();
    const first = buildReactExportProject(manifest);
    const second = buildReactExportProject(manifest);

    expect(second).toEqual(first);
    expect(first.rootName).toBe('customer-portal');
    expect(first.files.map((file) => file.path)).toContain('webblueprint.json');
    expect(first.files.map((file) => file.path)).toContain('docs/architecture.md');
    expect(first.files.map((file) => file.path)).toContain('contracts/view-content-v1.schema.json');
    expect(first.files.map((file) => file.path)).toContain('src/app/router/routes.tsx');
    expect(first.files.map((file) => file.path)).toContain('src/features/dashboard/presentation/DashboardPage.tsx');

    const metadata = JSON.parse(first.files.find((file) => file.path === 'webblueprint.json')?.content ?? '{}') as BlueprintProjectManifest;
    expect(metadata).toEqual(manifest);
  });

  it('preserves exact Preview selection order and excludes unselected features', () => {
    const project = buildReactExportProject(createManifest());
    const routes = project.files.find((file) => file.path === 'src/app/router/routes.tsx')?.content ?? '';

    expect(routes.indexOf("path: '/dashboard'")).toBeLessThan(routes.indexOf("path: '/applications/ecommerce/products'"));
    expect(routes.indexOf("path: '/applications/ecommerce/products'")).toBeLessThan(routes.indexOf("path: '/pages/contact'"));
    expect(project.files.some((file) => file.path.includes('calendar'))).toBe(false);
  });

  it('keeps Presentation isolated from JSON, fetch, localStorage and infrastructure imports', () => {
    const project = buildReactExportProject(createManifest());
    const presentationFiles = project.files.filter((file) => file.path.includes('/presentation/'));

    expect(presentationFiles.length).toBe(3);
    presentationFiles.forEach((file) => {
      expect(file.content).not.toContain('.json');
      expect(file.content).not.toContain('fetch(');
      expect(file.content).not.toContain('localStorage');
      expect(file.content).not.toContain('/infrastructure/');
    });
  });

  it('exports logo, favicon, selected theme and contract-first mocks', () => {
    const project = buildReactExportProject(createManifest());
    const config = project.files.find((file) => file.path === 'src/app/config/project.ts')?.content ?? '';
    const html = project.files.find((file) => file.path === 'index.html')?.content ?? '';
    const theme = project.files.find((file) => file.path === 'src/theme/theme.css')?.content ?? '';
    const mocks = project.files.filter((file) => file.path.endsWith('/infrastructure/mock.data.json'));

    expect(config).toContain('data:image/svg+xml;base64,PHN2Zy8+');
    expect(html).toContain('data:image/png;base64,aWNv');
    expect(theme).toContain('#1d4ed8');
    expect(mocks).toHaveLength(3);
    mocks.forEach((file) => expect(JSON.parse(file.content)).toMatchObject({ schemaVersion: '1.0' }));
  });

  it('keeps npm package metadata aligned with the bundled lockfile', () => {
    const project = buildReactExportProject(createManifest());
    const packageJson = JSON.parse(project.files.find((file) => file.path === 'package.json')?.content ?? '{}') as { name?: string; dependencies?: unknown; devDependencies?: unknown };
    const packageLock = JSON.parse(project.files.find((file) => file.path === 'package-lock.json')?.content ?? '{}') as { name?: string; packages?: Record<string, { name?: string; dependencies?: unknown; devDependencies?: unknown }> };

    expect(packageLock.name).toBe(packageJson.name);
    expect(packageLock.packages?.['']?.name).toBe(packageJson.name);
    expect(packageLock.packages?.['']?.dependencies).toEqual(packageJson.dependencies);
    expect(packageLock.packages?.['']?.devDependencies).toEqual(packageJson.devDependencies);
  });

  it('exports Volketas as source-backed routes with aliases and full visual theme', () => {
    const manifest = applyProjectPreset(
      {
        ...createDefaultProject(),
        application: { name: 'Volketas Operaciones', logoDataUrl: 'data:image/svg+xml;base64,dm9sa2V0YXM=', faviconDataUrl: null },
      },
      'volketas',
    );

    const project = buildReactExportProject(manifest);
    const paths = project.files.map((file) => file.path);
    const routes = project.files.find((file) => file.path === 'src/exported/routes.tsx')?.content ?? '';
    const routeManifest = project.files.find((file) => file.path === 'src/exported/routeManifest.ts')?.content ?? '';
    const theme = project.files.find((file) => file.path === 'src/exported/theme.css')?.content ?? '';
    const shell = project.files.find((file) => file.path === 'src/exported/shell.css')?.content ?? '';
    const projectApp = project.files.find((file) => file.path === 'src/exported/ProjectApp.tsx')?.content ?? '';

    expect(paths).toContain('src/dispatch/DispatchBoardView.tsx');
    expect(paths).toContain('src/service-orders/ServiceOrderDetailView.tsx');
    expect(paths).toContain('src/alerts-center/AlertCenterView.tsx');
    expect(paths).toContain('src/assets/AssetDetailView.tsx');
    expect(routes).toContain('<DispatchBoardView />');
    expect(routes).toContain('<ServiceOrderDetailView />');
    expect(routeManifest).toContain('"label": "Despacho"');
    expect(routeManifest).toContain('"label": "Servicios"');
    expect(routeManifest).toContain('"label": "Activos"');
    expect(theme).toContain('#0b2f4f');
    expect(theme).toContain('#f97316');
    expect(shell).toContain('var(--theme-navigation-background)');
    expect(projectApp).toContain("import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router';");
    expect(projectApp).toContain('to={route.path}');
    expect(projectApp).toContain('path={route.path}');
    expect(projectApp).toContain('Volketas Operaciones');
    expect(projectApp).toContain('data:image/svg+xml;base64,dm9sa2V0YXM=');
    expect(projectApp).not.toContain('<strong>Volketas</strong>');
    expect(project.files.some((file) => file.path.includes('applications-management-dispatch/presentation'))).toBe(false);
  });

  it('creates byte-for-byte deterministic ZIP output', () => {
    const first = buildReactExportZip(createManifest());
    const second = buildReactExportZip(createManifest());

    expect(first.fileName).toBe('customer-portal.zip');
    expect(Array.from(second.bytes)).toEqual(Array.from(first.bytes));
    expect(new TextDecoder().decode(first.bytes.slice(0, 2))).toBe('PK');
  });
});
