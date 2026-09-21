/// <reference types="node" />

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { applicationRegistry } from '@/applications/applicationRegistry';
import { applyPreset, buildComposerManifest, createEmptyComposerConfiguration } from '@/composer/composer.logic';
import { buildReactExportProject } from '@/export/export.engine';

const smoke = process.env.WEBBLUEPRINT_EXPORT_SMOKE === '1' ? it : it.skip;

describe('exported project runtime proof', () => {
  smoke('passes npm ci and npm run build', () => {
    const configuration = createEmptyComposerConfiguration();
    configuration.name = 'CI Export Proof';
    configuration.slug = 'ci-export-proof';
    const manifest = buildComposerManifest(applyPreset(configuration, applicationRegistry[0]));
    const project = buildReactExportProject(manifest);
    const directory = mkdtempSync(join(tmpdir(), 'webblueprint-export-'));

    try {
      for (const file of project.files) {
        const path = join(directory, file.path);
        mkdirSync(dirname(path), { recursive: true });
        writeFileSync(path, file.content, 'utf8');
      }

      execFileSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: directory, stdio: 'pipe' });
      execFileSync('npm', ['run', 'build'], { cwd: directory, stdio: 'inherit' });

      expect(existsSync(join(directory, 'dist', 'index.html'))).toBe(true);
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }, 180_000);
});
