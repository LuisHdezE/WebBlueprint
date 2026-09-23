/// <reference types="node" />

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createDefaultProject } from '@/composer/project.logic';
import { buildReactExportZip } from '@/export/export.engine';

const smoke = process.env.WEBBLUEPRINT_EXPORT_SMOKE === '1' ? it : it.skip;

describe('G2 exported project runtime proof', () => {
  smoke('extracts the real ZIP and passes npm ci plus the generated quality gate', () => {
    const manifest = {
      ...createDefaultProject(),
      application: { name: 'CI Export Proof', logoDataUrl: null, faviconDataUrl: null },
      theme: { colorId: 'teal' as const },
      views: ['/dashboard', '/pages/contact'],
    };
    const exported = buildReactExportZip(manifest);
    const workspace = mkdtempSync(join(tmpdir(), 'webblueprint-export-'));
    const projectDirectory = join(workspace, 'project');
    const zipPath = join(workspace, exported.fileName);

    try {
      mkdirSync(projectDirectory, { recursive: true });
      writeFileSync(zipPath, exported.bytes);

      execFileSync('unzip', ['-q', zipPath, '-d', projectDirectory], { stdio: 'inherit' });
      execFileSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: projectDirectory, stdio: 'pipe' });
      execFileSync('npm', ['run', 'check'], { cwd: projectDirectory, stdio: 'inherit' });

      expect(existsSync(join(projectDirectory, 'webblueprint.json'))).toBe(true);
      expect(existsSync(join(projectDirectory, 'contracts', 'view-content-v1.schema.json'))).toBe(true);
      expect(existsSync(join(projectDirectory, 'docs', 'architecture.md'))).toBe(true);
      expect(existsSync(join(projectDirectory, 'dist', 'index.html'))).toBe(true);
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  }, 180_000);
});
