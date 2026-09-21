import { describe, expect, it } from 'vitest';
import { applicationRegistry } from '@/applications/applicationRegistry';
import { applyPreset, buildComposerManifest, createEmptyComposerConfiguration } from '@/composer/composer.logic';
import { buildReactExportProject, buildReactExportZip } from '@/export/export.engine';

function createManifest() {
  const configuration = createEmptyComposerConfiguration();
  configuration.name = 'Customer Portal';
  configuration.slug = 'customer-portal';
  return buildComposerManifest(applyPreset(configuration, applicationRegistry[0]));
}

describe('Export Engine v0', () => {
  it('generates a deterministic standalone React project file set', () => {
    const manifest = createManifest();
    const first = buildReactExportProject(manifest);
    const second = buildReactExportProject(manifest);

    expect(second).toEqual(first);
    expect(first.rootName).toBe('customer-portal');
    expect(first.files.map((file) => file.path)).toContain('webblueprint.json');
    expect(first.files.map((file) => file.path)).toContain('src/App.tsx');

    const generatedManifest = first.files.find((file) => file.path === 'webblueprint.json');
    expect(generatedManifest?.content).toContain('Customer Portal');
    expect(generatedManifest?.content).toContain('pet-shop.dashboard');
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

  it('creates byte-for-byte deterministic ZIP output', () => {
    const manifest = createManifest();
    const first = buildReactExportZip(manifest);
    const second = buildReactExportZip(manifest);

    expect(first.fileName).toBe('customer-portal.zip');
    expect(Array.from(second.bytes)).toEqual(Array.from(first.bytes));
    expect(new TextDecoder().decode(first.bytes.slice(0, 2))).toBe('PK');
  });
});
