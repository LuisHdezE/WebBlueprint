import { useState } from 'react';
import { buildComposerManifest, validateComposerConfiguration } from '@/composer/composer.logic';
import type { ComposerConfiguration } from '@/composer/composer.types';
import { downloadReactExportZip } from '@/export/export.engine';

const composerDraftStorageKey = 'webblueprint.composer.draft.v1';

function readCurrentComposerDraft() {
  const raw = window.localStorage.getItem(composerDraftStorageKey);
  if (!raw) {
    throw new Error('No Composer draft is available yet.');
  }

  return JSON.parse(raw) as ComposerConfiguration;
}

export function ComposerExportPanel() {
  const [status, setStatus] = useState<string | null>(null);

  function downloadProject() {
    try {
      const configuration = readCurrentComposerDraft();
      const issues = validateComposerConfiguration(configuration);
      if (issues.length > 0) {
        setStatus(issues.join(' '));
        return;
      }

      const manifest = buildComposerManifest(configuration);
      downloadReactExportZip(manifest);
      setStatus(`Generated ${manifest.application.slug}.zip from the current Composer draft.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to export the current Composer draft.');
    }
  }

  return (
    <section className="mt-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">U0.4 · Export Engine v0</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">Generate a standalone React project.</h2>
          <p className="mt-1.5 max-w-3xl text-sm leading-5 text-slate-600">
            The ZIP carries the current manifest, branding, selected capabilities, pages and navigation into a buildable React/Vite application.
          </p>
        </div>
        <button
          className="self-start rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700"
          onClick={downloadProject}
          type="button"
        >
          Download React project ZIP
        </button>
      </div>
      {status ? <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">{status}</p> : null}
    </section>
  );
}
