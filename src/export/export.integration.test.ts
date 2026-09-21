/// <reference types="node" />

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { applicationRegistry } from '@/applications/applicationRegistry';
import { applyPreset, buildComposerManifest, createEmptyComposerConfiguration } from '@/composer/composer.logic';
import { buildReactExportZip } from '@/export/export.engine';

const smoke = process.env.WEBBLUEPRINT_EXPORT_SMOKE === '1' ? it : it.skip;

describe('exported project runtime proof', () => {
  smoke('extracts the real ZIP and passes npm ci plus npm run build', () => {
    const configuration = createEmptyComposerConfiguration();
    configuration.name = 'CI Export Proof';
    configuration.slug = 'ci-export-proof';
    const manifest = buildComposerManifest(applyPreset(configuration, applicationRegistry[0]));
    const exported = buildReactExportZip(manifest);
    const workspace = mkdtempSync(join(tmpdir(), 'webblueprint-export-'));
    const projectDirectory = join(workspace, 'project');
    const zipPath = join(workspace, exported.fileName);

    try {
      mkdirSync(projectDirectory, { recursive: true });
      writeFileSync(zipPath, exported.bytes);

      execFileSync('unzip', ['-q', zipPath, '-d', projectDirectory], { stdio: 'inherit' });
      execFileSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: projectDirectory, stdio: 'pipe' });
      execFileSync('npm', ['run', 'build'], { cwd: projectDirectory, stdio: 'inherit' });

      expect(existsSync(join(projectDirectory, 'webblueprint.json'))).toBe(true);
      expect(existsSync(join(projectDirectory, 'dist', 'index.html'))).toBe(true);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  }, 180_000);
});
