import { useState } from 'react';
import { readProjectManifest, writeProjectManifest } from '@/composer/project.storage';
import type { BlueprintProjectManifest } from '@/composer/project.types';
import { downloadReactExportZip } from '@/export/export.engine';

type Props = {
  project?: BlueprintProjectManifest;
};

export function ComposerExportPanel({ project }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  function downloadProject() {
    try {
      const manifest = project ?? readProjectManifest();
      writeProjectManifest(manifest);
      downloadReactExportZip(manifest);
      setStatus(`Se generó la aplicación ZIP desde BlueprintProjectManifest v${manifest.schemaVersion}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No fue posible exportar el proyecto actual.');
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Exportación principal</p>
      <h2 className="mt-1 text-sm font-semibold text-slate-900">Aplicación React independiente</h2>
      <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
        Genera exactamente la selección actual, en el mismo orden que Preview, con arquitectura feature-first, mocks contract-first, contratos y quality gates.
      </p>
      <button
        className="mt-3 w-full rounded-md bg-[var(--theme-primary)] px-3 py-2.5 text-xs font-semibold text-[var(--theme-on-primary)] transition hover:bg-[var(--theme-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={(project ?? readProjectManifest()).views.length === 0}
        onClick={downloadProject}
        type="button"
      >
        Exportar aplicación ZIP
      </button>
      {status ? <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-[10px] leading-4 text-slate-600">{status}</p> : null}
    </section>
  );
}
