import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { AppIcon } from '@/components/AppIcon';
import { getSelectedProjectViews } from '@/composer/project.catalog';
import { readProjectManifest } from '@/composer/project.storage';
import type { ProjectViewDefinition } from '@/composer/project.types';
import { themePresets } from '@/theme/themeContext';

function groupViewsBySection(views: readonly ProjectViewDefinition[]) {
  const sections = new Map<string, ProjectViewDefinition[]>();
  views.forEach((view) => {
    const existing = sections.get(view.section) ?? [];
    existing.push(view);
    sections.set(view.section, existing);
  });
  return [...sections.entries()].map(([label, items]) => ({ label, items }));
}

function initials(value: string) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  return (words.slice(0, 2).map((word) => word[0]).join('') || 'APP').toUpperCase();
}

export function ComposerPreviewPage() {
  const [project] = useState(readProjectManifest);
  const selectedViews = useMemo(() => getSelectedProjectViews(project.views), [project.views]);
  const [activePath, setActivePath] = useState(selectedViews[0]?.path ?? '');
  const activeView = selectedViews.find((view) => view.path === activePath) ?? selectedViews[0];
  const activeIndex = activeView ? selectedViews.findIndex((view) => view.path === activeView.path) : -1;
  const sections = groupViewsBySection(selectedViews);
  const theme = themePresets.find((preset) => preset.id === project.theme.colorId) ?? themePresets[0];

  useEffect(() => {
    document.title = `${project.application.name} · Preview`;
    if (!project.application.faviconDataUrl) {
      return;
    }

    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = project.application.faviconDataUrl;
  }, [project.application.faviconDataUrl, project.application.name]);

  if (!theme) {
    return null;
  }

  const themeStyle = {
    '--preview-primary': theme.primary,
    '--preview-primary-hover': theme.primaryHover,
    '--preview-primary-active': theme.primaryActive,
    '--preview-primary-soft': theme.primarySoft,
    '--preview-primary-border': theme.primaryBorder,
    '--preview-on-primary': theme.onPrimary,
  } as CSSProperties;

  if (selectedViews.length === 0) {
    return (
      <main className="grid min-h-dvh place-items-center bg-slate-50 p-6">
        <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">No hay vistas seleccionadas</h1>
          <p className="mt-2 text-sm text-slate-500">Vuelve al Composer y selecciona las vistas que formarán parte del proyecto.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800" style={themeStyle}>
      <header className="fixed inset-x-0 top-0 z-40 flex h-12 items-center bg-[var(--preview-primary)] text-[var(--preview-on-primary)] shadow-sm">
        <div className="flex h-full w-[232px] items-center gap-2 border-r border-white/10 px-3">
          {project.application.logoDataUrl ? (
            <img alt="Logo" className="size-7 rounded bg-white/95 object-contain p-0.5" src={project.application.logoDataUrl} />
          ) : (
            <span className="grid size-7 place-items-center rounded bg-white/15 text-[9px] font-bold">{initials(project.application.name)}</span>
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-semibold">{project.application.name}</p>
            <p className="truncate text-[9px] text-white/65">Vista previa del proyecto</p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between px-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">{activeView?.label}</p>
            <p className="truncate text-[9px] text-white/60">{activeView?.path}</p>
          </div>
          <span className="rounded bg-white/10 px-2 py-1 text-[9px] font-semibold">{activeIndex + 1} / {selectedViews.length}</span>
        </div>
      </header>

      <aside className="fixed bottom-0 left-0 top-12 z-30 w-[232px] overflow-y-auto border-r border-slate-200 bg-white px-2 py-2">
        {sections.map((section, index) => (
          <section className={index === 0 ? 'mb-2' : 'mb-2.5'} key={section.label}>
            <div className="px-2 pb-1 pt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">{section.label}</div>
            <div className="space-y-0.5">
              {section.items.map((view) => {
                const active = view.path === activeView?.path;
                return (
                  <button
                    className={`flex min-h-[30px] w-full items-center gap-2 rounded-md border-l-2 px-2 py-1 text-left text-[11.5px] font-medium transition ${
                      active
                        ? 'border-[var(--preview-primary)] bg-[var(--preview-primary-soft)] text-[var(--preview-primary-active)]'
                        : 'border-transparent text-slate-600 hover:bg-[var(--preview-primary-soft)] hover:text-[var(--preview-primary)]'
                    }`}
                    key={view.path}
                    onClick={() => setActivePath(view.path)}
                    type="button"
                  >
                    <AppIcon className="size-[14px] shrink-0" name={view.icon} />
                    <span className="min-w-0 truncate">{view.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </aside>

      <main className="min-h-dvh pl-[232px] pt-12">
        <div className="min-h-[calc(100dvh-48px)] p-5">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--preview-primary)]">{activeView?.section}</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-950">{activeView?.label}</h1>
                <p className="mt-1 text-xs text-slate-500">Ruta seleccionada: {activeView?.path}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-35"
                  disabled={activeIndex <= 0}
                  onClick={() => setActivePath(selectedViews[activeIndex - 1]?.path ?? activePath)}
                  type="button"
                >
                  ← Anterior
                </button>
                <button
                  className="rounded-md bg-[var(--preview-primary)] px-3 py-2 text-xs font-semibold text-[var(--preview-on-primary)] hover:bg-[var(--preview-primary-hover)] disabled:opacity-35"
                  disabled={activeIndex < 0 || activeIndex >= selectedViews.length - 1}
                  onClick={() => setActivePath(selectedViews[activeIndex + 1]?.path ?? activePath)}
                  type="button"
                >
                  Siguiente →
                </button>
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-md bg-[var(--preview-primary-soft)] text-[var(--preview-primary)]">
                  {activeView ? <AppIcon className="size-4" name={activeView.icon} /> : null}
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Preview filtrada por Blueprint Manifest</h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">Solo las vistas seleccionadas existen en esta navegación.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PreviewStat label="Aplicación" value={project.application.name} />
                <PreviewStat label="Tema" value={theme.label} />
                <PreviewStat label="Vistas incluidas" value={String(selectedViews.length)} />
              </div>

              <div className="mt-5 rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
                <p className="text-xs font-semibold text-slate-700">Superficie de la vista: {activeView?.label}</p>
                <p className="mx-auto mt-1 max-w-xl text-[11px] leading-5 text-slate-500">
                  Durante G2 esta preview valida identidad, tema, secuencia y navegación filtrada. A medida que las vistas del catálogo se implementen, este mismo manifest las renderizará sin cambiar la selección.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2.5">
      <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-xs font-semibold text-slate-800">{value}</p>
    </div>
  );
}
