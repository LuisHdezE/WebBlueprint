import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AppIcon } from '@/components/AppIcon';
import { getProjectViewsBySection, getSelectedProjectViews } from '@/composer/project.catalog';
import {
  applyProjectPreset,
  createDefaultProject,
  moveProjectView,
  setProjectSectionSelection,
  toggleProjectView,
} from '@/composer/project.logic';
import { getProjectPreset, projectPresets } from '@/composer/project.presets';
import { readProjectManifest, writeProjectManifest } from '@/composer/project.storage';
import type { BlueprintProjectManifest } from '@/composer/project.types';
import { themePresets } from '@/theme/themeContext';

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function selectionsMatch(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((path, index) => path === right[index]);
}

export function TemplateComposerPage() {
  const [project, setProject] = useState<BlueprintProjectManifest>(readProjectManifest);
  const sections = useMemo(() => getProjectViewsBySection(), []);
  const selectedViews = getSelectedProjectViews(project.views);
  const selectedPreset = getProjectPreset(project.presetId);
  const presetModified = Boolean(selectedPreset && !selectionsMatch(project.views, selectedPreset.viewPaths));

  useEffect(() => {
    writeProjectManifest(project);
  }, [project]);

  async function handleAssetUpload(kind: 'logoDataUrl' | 'faviconDataUrl', event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setProject((current) => ({
      ...current,
      application: { ...current.application, [kind]: dataUrl },
    }));
    event.target.value = '';
  }

  function openPreview() {
    writeProjectManifest(project);
    window.open('/preview', '_blank', 'noopener,noreferrer');
  }

  function downloadManifest() {
    writeProjectManifest(project);
    const blob = new Blob([`${JSON.stringify(project, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'webblueprint.project.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetProject() {
    setProject(createDefaultProject());
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--theme-primary)]">Composer · proyecto</p>
          <h1 className="mt-1 text-[24px] font-semibold tracking-[-0.02em] text-slate-950">Construye la aplicación que quieres exportar</h1>
          <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-600">
            Identidad, plantilla, tema y vistas viven en un único Blueprint Manifest. La vista previa y la exportación consumen exactamente esta selección.
          </p>
        </div>
        <button
          className="self-start rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          onClick={resetProject}
          type="button"
        >
          Reiniciar proyecto
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">1 · Identidad</p>
                <h2 className="mt-1 text-base font-semibold text-slate-900">Nombre, logo, favicon y tema</h2>
              </div>
              <span className="rounded-full bg-[var(--theme-primary-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--theme-primary-active)]">Persistencia local</span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="text-xs font-semibold text-slate-700">
                Nombre de la aplicación
                <input
                  className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-900 outline-none transition focus:border-[var(--theme-primary-border)] focus:ring-2 focus:ring-[var(--theme-primary-soft)]"
                  onChange={(event) =>
                    setProject((current) => ({
                      ...current,
                      application: { ...current.application, name: event.target.value },
                    }))
                  }
                  value={project.application.name}
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <AssetControl
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  asset={project.application.logoDataUrl}
                  label="Logo"
                  onChange={(event) => void handleAssetUpload('logoDataUrl', event)}
                  onClear={() =>
                    setProject((current) => ({
                      ...current,
                      application: { ...current.application, logoDataUrl: null },
                    }))
                  }
                />
                <AssetControl
                  accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/svg+xml,.ico"
                  asset={project.application.faviconDataUrl}
                  label="Favicon / ICO"
                  onChange={(event) => void handleAssetUpload('faviconDataUrl', event)}
                  onClear={() =>
                    setProject((current) => ({
                      ...current,
                      application: { ...current.application, faviconDataUrl: null },
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold text-slate-700">Tema de la aplicación</p>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                {themePresets.map((preset) => {
                  const active = preset.id === project.theme.colorId;
                  return (
                    <button
                      className={`rounded-md border p-2 text-center text-[10px] font-semibold transition ${
                        active ? 'border-slate-400 bg-slate-50 text-slate-950 shadow-sm' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      key={preset.id}
                      onClick={() => setProject((current) => ({ ...current, theme: { colorId: preset.id } }))}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className="mx-auto mb-1.5 block size-5 rounded-full border border-black/10"
                        style={{ backgroundColor: preset.primary }}
                      />
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">2 · Plantilla base</p>
              <h2 className="mt-1 text-base font-semibold text-slate-900">Empieza desde una selección preparada</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">La plantilla marca sus vistas automáticamente. Después puedes añadir, quitar y reordenar lo que quieras.</p>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {projectPresets.map((preset) => {
                const active = preset.id === (project.presetId ?? 'blank');
                return (
                  <button
                    className={`rounded-md border p-3 text-left transition ${
                      active
                        ? 'border-[var(--theme-primary-border)] bg-[var(--theme-primary-soft)]'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    key={preset.id}
                    onClick={() => setProject((current) => applyProjectPreset(current, preset.id))}
                    type="button"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-900">{preset.name}</span>
                      <span className="text-[10px] font-bold text-slate-400">{preset.viewPaths.length} vistas</span>
                    </div>
                    <p className="mt-1.5 text-[11px] leading-4 text-slate-500">{preset.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">3 · Vistas</p>
                <h2 className="mt-1 text-base font-semibold text-slate-900">Selecciona la superficie real del proyecto</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">Las 96 vistas del catálogo maestro permanecen disponibles, agrupadas por familia.</p>
              </div>
              <span className="text-xs font-semibold text-[var(--theme-primary)]">{project.views.length} seleccionadas</span>
            </div>

            <div className="mt-4 space-y-2">
              {sections.map((section) => {
                const selectedCount = section.views.filter((view) => project.views.includes(view.path)).length;
                const allSelected = selectedCount === section.views.length;
                return (
                  <details className="group rounded-md border border-slate-200" key={section.label} open={section.label === 'General' || undefined}>
                    <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5">
                      <AppIcon className="size-4 text-slate-500" name={section.icon} />
                      <span className="flex-1 text-xs font-semibold text-slate-800">{section.label}</span>
                      <span className="text-[10px] font-semibold text-slate-400">{selectedCount}/{section.views.length}</span>
                      <AppIcon className="size-3 text-slate-400 transition-transform group-open:rotate-180" name="chevron-down" />
                    </summary>
                    <div className="border-t border-slate-100 px-3 py-2.5">
                      <label className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-2 text-[11px] font-semibold text-slate-500">
                        <input
                          checked={allSelected}
                          className="size-3.5 accent-[var(--theme-primary)]"
                          onChange={(event) =>
                            setProject((current) =>
                              setProjectSectionSelection(
                                current,
                                section.views.map((view) => view.path),
                                event.target.checked,
                              ),
                            )
                          }
                          type="checkbox"
                        />
                        Seleccionar toda la familia
                      </label>
                      <div className="grid gap-x-4 gap-y-1 md:grid-cols-2 xl:grid-cols-3">
                        {section.views.map((view) => (
                          <label
                            className="flex min-h-8 cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[11.5px] text-slate-650 transition hover:bg-slate-50"
                            key={view.path}
                          >
                            <input
                              checked={project.views.includes(view.path)}
                              className="size-3.5 accent-[var(--theme-primary)]"
                              onChange={() => setProject((current) => toggleProjectView(current, view.path))}
                              type="checkbox"
                            />
                            <AppIcon className="size-[13px] shrink-0 text-slate-400" name={view.icon} />
                            <span className="truncate">{view.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-4 xl:sticky xl:top-[68px] xl:self-start">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Proyecto actual</p>
            <div className="mt-3 flex items-center gap-3">
              {project.application.logoDataUrl ? (
                <img alt="Logo de la aplicación" className="size-10 rounded-md border border-slate-200 object-contain p-1" src={project.application.logoDataUrl} />
              ) : (
                <span className="grid size-10 place-items-center rounded-md bg-[var(--theme-primary-soft)] text-xs font-bold text-[var(--theme-primary)]">
                  {project.application.name.slice(0, 2).toUpperCase() || 'APP'}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{project.application.name || 'Mi aplicación'}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {selectedPreset ? `${selectedPreset.name}${presetModified ? ' · modificada' : ''}` : 'Selección personalizada'}
                </p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[10px]">
              <div>
                <dt className="text-slate-400">Vistas</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900">{project.views.length}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Tema</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-900">{themePresets.find((preset) => preset.id === project.theme.colorId)?.label}</dd>
              </div>
            </dl>

            <button
              className="mt-4 w-full rounded-md bg-[var(--theme-primary)] px-3 py-2.5 text-xs font-semibold text-[var(--theme-on-primary)] transition hover:bg-[var(--theme-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={project.views.length === 0}
              onClick={openPreview}
              type="button"
            >
              Abrir vista previa
            </button>
            <button
              className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={downloadManifest}
              type="button"
            >
              Descargar Blueprint Manifest
            </button>
            <p className="mt-2 text-[10px] leading-4 text-slate-400">Preview y exportación leen este mismo manifest. El ZIP React se conectará a este contrato sin duplicar configuración.</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Secuencia</p>
                <h2 className="mt-1 text-sm font-semibold text-slate-900">Orden de recorrido</h2>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{selectedViews.length}</span>
            </div>

            <div className="mt-3 max-h-[430px] space-y-1 overflow-y-auto pr-1">
              {selectedViews.length === 0 ? (
                <p className="rounded-md bg-slate-50 px-3 py-4 text-center text-[11px] text-slate-500">Selecciona al menos una vista.</p>
              ) : (
                selectedViews.map((view, index) => (
                  <div className="flex items-center gap-1.5 rounded-md border border-slate-100 px-2 py-1.5" key={view.path}>
                    <span className="w-5 shrink-0 text-center text-[9px] font-bold text-slate-400">{index + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-[10.5px] font-medium text-slate-700">{view.label}</span>
                    <button
                      aria-label={`Subir ${view.label}`}
                      className="size-6 rounded text-[11px] text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25"
                      disabled={index === 0}
                      onClick={() => setProject((current) => moveProjectView(current, view.path, -1))}
                      type="button"
                    >
                      ↑
                    </button>
                    <button
                      aria-label={`Bajar ${view.label}`}
                      className="size-6 rounded text-[11px] text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25"
                      disabled={index === selectedViews.length - 1}
                      onClick={() => setProject((current) => moveProjectView(current, view.path, 1))}
                      type="button"
                    >
                      ↓
                    </button>
                    <button
                      aria-label={`Quitar ${view.label}`}
                      className="size-6 rounded text-[13px] text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      onClick={() => setProject((current) => toggleProjectView(current, view.path))}
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

interface AssetControlProps {
  label: string;
  asset: string | null;
  accept: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

function AssetControl({ label, asset, accept, onChange, onClear }: AssetControlProps) {
  return (
    <div className="rounded-md border border-slate-200 p-2.5">
      <p className="text-[10px] font-semibold text-slate-500">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded border border-slate-100 bg-slate-50 text-[9px] font-bold text-slate-400">
          {asset ? <img alt="" className="size-full object-contain p-1" src={asset} /> : '—'}
        </span>
        <label className="cursor-pointer rounded border border-slate-200 px-2 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50">
          Elegir
          <input accept={accept} className="sr-only" onChange={onChange} type="file" />
        </label>
        {asset ? (
          <button className="text-[10px] font-semibold text-slate-400 hover:text-rose-600" onClick={onClear} type="button">
            Quitar
          </button>
        ) : null}
      </div>
    </div>
  );
}
