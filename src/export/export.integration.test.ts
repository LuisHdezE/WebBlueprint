/// <reference types="node" />

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { applyProjectPreset, createDefaultProject } from '@/composer/project.logic';
import { buildReactExportZip } from '@/export/export.engine';

const smoke = process.env.WEBBLUEPRINT_EXPORT_SMOKE === '1' ? it : it.skip;

describe('G2 exported project runtime proof', () => {
  smoke.each([
    ['volketas', ['src/dispatch/DispatchBoardView.tsx', 'src/service-orders/ServiceOrderDetailView.tsx', 'src/alerts-center/AlertCenterView.tsx']],
    ['real-estate', ['src/templates/real-estate/presentation/RealEstateView.tsx', 'src/templates/real-estate/infrastructure/listing-images.ts']],
    ['restaurants', ['src/templates/restaurants/presentation/RestaurantView.tsx', 'src/templates/restaurants/infrastructure/restaurant-images.ts']],
  ])('extracts the %s ZIP and passes the generated quality gate', (preset, sourceFiles) => {
    const manifest = applyProjectPreset(
      {
        ...createDefaultProject(),
        application: { name: `${preset} Export Proof`, logoDataUrl: null, faviconDataUrl: null },
      },
      preset,
    );
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

      for (const path of ['webblueprint.json', 'docs/architecture.md', 'dist/index.html', ...sourceFiles]) {
        expect(existsSync(join(projectDirectory, path)), path).toBe(true);
      }
    } finally {
      rmSync(workspace, { recursive: true, force: true });
    }
  }, 180_000);
});
