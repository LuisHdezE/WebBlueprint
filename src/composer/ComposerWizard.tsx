import { useEffect, useState } from 'react';
import { applicationRegistry } from '@/applications/applicationRegistry';
import { composerFeatureOptions, composerPageOptions } from '@/composer/composer.catalog';
import {
  applyPreset,
  buildComposerManifest,
  createEmptyComposerConfiguration,
  deriveApplicationSlug,
  validateComposerConfiguration,
} from '@/composer/composer.logic';
import type { ComposerConfiguration, ComposerStep } from '@/composer/composer.types';
import { leftMenuVariants } from '@/shell/shell.types';

const storageKey = 'webblueprint.composer.draft.v1';

const steps: readonly { id: ComposerStep; label: string; hint: string }[] = [
  { id: 'application', label: 'Application', hint: 'Identity' },
  { id: 'branding', label: 'Branding', hint: 'Visual tokens' },
  { id: 'preset', label: 'Preset', hint: 'Starting point' },
  { id: 'features', label: 'Features', hint: 'Capabilities' },
  { id: 'pages', label: 'Pages', hint: 'Product surface' },
  { id: 'navigation', label: 'Navigation', hint: 'Shell preview' },
  { id: 'review', label: 'Review', hint: 'Manifest' },
];

const accentChoices = ['#2563eb', '#0891b2', '#059669', '#7c3aed', '#db2777', '#ea580c'] as const;

const inputClassName =
  'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100';

function readStoredConfiguration(): ComposerConfiguration {
  const fallback = createEmptyComposerConfiguration();

  if (typeof window === 'undefined') {
    return fallback;
  }

  const stored = window.localStorage.getItem(storageKey);
  if (!stored) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ComposerConfiguration>;
    const shellVariant = leftMenuVariants.includes(parsed.shellVariant ?? 'collapsible-menu')
      ? (parsed.shellVariant ?? 'collapsible-menu')
      : 'collapsible-menu';

    return {
      ...fallback,
      ...parsed,
      branding: {
        ...fallback.branding,
        ...parsed.branding,
      },
      featureIds: Array.isArray(parsed.featureIds) ? parsed.featureIds : [],
      pageIds: Array.isArray(parsed.pageIds) ? parsed.pageIds : [],
      shellVariant,
    };
  } catch {
    return fallback;
  }
}

export function ComposerWizard() {
  const [currentStep, setCurrentStep] = useState<ComposerStep>('application');
  const [configuration, setConfiguration] = useState<ComposerConfiguration>(readStoredConfiguration);
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const manifest = buildComposerManifest(configuration);
  const validationIssues = validateComposerConfiguration(configuration);
  const selectedPreset = applicationRegistry.find((application) => application.id === configuration.presetId);
  const selectedPages = composerPageOptions.filter((page) => configuration.pageIds.includes(page.id));

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(configuration));
  }, [configuration]);

  function updateApplicationName(name: string) {
    setConfiguration((current) => ({
      ...current,
      name,
      slug: deriveApplicationSlug(name),
    }));
  }

  function toggleFeature(featureId: string) {
    setConfiguration((current) => ({
      ...current,
      featureIds: current.featureIds.includes(featureId)
        ? current.featureIds.filter((id) => id !== featureId)
        : [...current.featureIds, featureId],
    }));
  }

  function togglePage(pageId: string) {
    setConfiguration((current) => ({
      ...current,
      pageIds: current.pageIds.includes(pageId)
        ? current.pageIds.filter((id) => id !== pageId)
        : [...current.pageIds, pageId],
    }));
  }

  function startBlank() {
    setConfiguration((current) => ({
      ...current,
      presetId: null,
      featureIds: [],
      pageIds: [],
      shellVariant: 'collapsible-menu',
    }));
  }

  function resetDraft() {
    const empty = createEmptyComposerConfiguration();
    window.localStorage.removeItem(storageKey);
    setConfiguration(empty);
    setCurrentStep('application');
  }

  function goRelative(offset: number) {
    const target = steps[currentStepIndex + offset];
    if (target) {
      setCurrentStep(target.id);
    }
  }

  function downloadManifest() {
    if (validationIssues.length > 0) {
      return;
    }

    const blob = new Blob([`${JSON.stringify(manifest, null, 2)}\n`], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'webblueprint.json';
    link.click();
    URL.revokeObjectURL(objectUrl);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">U0.3 · Composer Core</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-slate-900">Configure one application from one state.</h2>
              <p className="mt-1.5 max-w-3xl text-sm leading-5 text-slate-600">
                Every step updates the same draft and the manifest preview. The draft persists locally while the export engine is still ahead.
              </p>
            </div>
            <button
              className="self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={resetDraft}
              type="button"
            >
              Reset draft
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
            {steps.map((step, index) => {
              const active = step.id === currentStep;
              return (
                <button
                  className={`rounded-lg border px-3 py-2 text-left transition ${
                    active
                      ? 'border-brand-200 bg-brand-50 text-brand-800'
                      : index < currentStepIndex
                        ? 'border-slate-200 bg-slate-50 text-slate-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  type="button"
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.1em]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mt-0.5 block text-xs font-semibold">{step.label}</span>
                  <span className="mt-0.5 hidden text-[10px] sm:block">{step.hint}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          {currentStep === 'application' && (
            <div>
              <StepHeading title="Application identity" description="Set the project identity that will flow into the generated manifest." />
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-xs font-semibold text-slate-700">
                  Application name
                  <input
                    className={inputClassName}
                    onChange={(event) => updateApplicationName(event.target.value)}
                    value={configuration.name}
                  />
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Slug
                  <input
                    className={inputClassName}
                    onChange={(event) => setConfiguration((current) => ({ ...current, slug: deriveApplicationSlug(event.target.value) }))}
                    value={configuration.slug}
                  />
                </label>
              </div>
              <label className="mt-4 block text-xs font-semibold text-slate-700">
                Description
                <textarea
                  className={`${inputClassName} min-h-28 resize-y`}
                  onChange={(event) => setConfiguration((current) => ({ ...current, description: event.target.value }))}
                  placeholder="What does this application solve?"
                  value={configuration.description}
                />
              </label>
              {validationIssues.some((issue) => issue.startsWith('Application name') || issue.startsWith('Slug')) && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Complete a valid application name and slug before downloading the manifest.
                </div>
              )}
            </div>
          )}

          {currentStep === 'branding' && (
            <div>
              <StepHeading title="Branding" description="Keep Style 1 structure while making the generated application recognizably yours." />
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Logo URL
                    <input
                      className={inputClassName}
                      onChange={(event) =>
                        setConfiguration((current) => ({
                          ...current,
                          branding: { ...current.branding, logoUrl: event.target.value },
                        }))
                      }
                      placeholder="https://…"
                      type="url"
                      value={configuration.branding.logoUrl}
                    />
                  </label>
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-700">Accent color</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        aria-label="Custom accent color"
                        className="h-9 w-12 cursor-pointer rounded border border-slate-200 bg-white p-1"
                        onChange={(event) =>
                          setConfiguration((current) => ({
                            ...current,
                            branding: { ...current.branding, accentColor: event.target.value },
                          }))
                        }
                        type="color"
                        value={configuration.branding.accentColor}
                      />
                      {accentChoices.map((color) => (
                        <button
                          aria-label={`Use ${color}`}
                          className={`h-8 w-8 rounded-full border-2 ${configuration.branding.accentColor === color ? 'border-slate-900' : 'border-white ring-1 ring-slate-200'}`}
                          key={color}
                          onClick={() =>
                            setConfiguration((current) => ({
                              ...current,
                              branding: { ...current.branding, accentColor: color },
                            }))
                          }
                          style={{ backgroundColor: color }}
                          type="button"
                        />
                      ))}
                    </div>
                    <p className="mt-2 font-mono text-xs text-slate-500">{configuration.branding.accentColor}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-28 items-center justify-center rounded-lg bg-white shadow-sm">
                    {configuration.branding.logoUrl ? (
                      <img alt="Brand preview" className="max-h-20 max-w-[160px] object-contain" src={configuration.branding.logoUrl} />
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto h-10 w-10 rounded-xl" style={{ backgroundColor: configuration.branding.accentColor }} />
                        <p className="mt-2 text-xs font-semibold text-slate-700">{configuration.name || 'Application'}</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500">Live brand preview</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'preset' && (
            <div>
              <StepHeading title="Choose a starting point" description="Use an existing application definition or continue with an empty configuration." />
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <button
                  className={`rounded-xl border p-4 text-left transition ${configuration.presetId === null ? 'border-brand-300 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}
                  onClick={startBlank}
                  type="button"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">Blank</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">Start from zero</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Keep the identity and branding, then choose capabilities manually.</p>
                </button>
                {applicationRegistry.map((preset) => (
                  <button
                    className={`rounded-xl border p-4 text-left transition ${configuration.presetId === preset.id ? 'border-brand-300 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}
                    key={preset.id}
                    onClick={() => setConfiguration((current) => applyPreset(current, preset))}
                    type="button"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-600">{preset.category}</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{preset.name}</p>
                    <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-600">{preset.summary}</p>
                    <p className="mt-3 text-[11px] font-medium text-slate-500">{preset.capabilities.length} capabilities · {preset.demoPages.length} pages</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'features' && (
            <div>
              <StepHeading title="Features" description="Select the capabilities this application should expose. The catalog will grow with WebBlueprint." />
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {composerFeatureOptions.map((feature) => (
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50" key={feature.id}>
                    <input
                      checked={configuration.featureIds.includes(feature.id)}
                      className="mt-0.5 h-4 w-4 accent-blue-600"
                      onChange={() => toggleFeature(feature.id)}
                      type="checkbox"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{feature.label}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-500">{feature.id}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'pages' && (
            <div>
              <StepHeading title="Pages" description="Choose the concrete screens that will participate in navigation and, later, export dependency resolution." />
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {composerPageOptions.map((page) => (
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50" key={page.id}>
                    <input
                      checked={configuration.pageIds.includes(page.id)}
                      className="mt-0.5 h-4 w-4 accent-blue-600"
                      onChange={() => togglePage(page.id)}
                      type="checkbox"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">{page.label}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-slate-500">{page.description}</span>
                      <span className="mt-1 block font-mono text-[10px] text-slate-400">/{page.path}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'navigation' && (
            <div>
              <StepHeading title="Navigation" description="Select one governed left-menu shell and preview the menu derived from selected pages." />
              <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
                <div className="space-y-2">
                  {leftMenuVariants.map((variant) => (
                    <button
                      className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition ${configuration.shellVariant === variant ? 'border-brand-300 bg-brand-50 text-brand-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                      key={variant}
                      onClick={() => setConfiguration((current) => ({ ...current, shellVariant: variant }))}
                      type="button"
                    >
                      {variant}
                    </button>
                  ))}
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mx-auto flex min-h-72 max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <aside className={`w-44 shrink-0 p-3 ${configuration.shellVariant === 'vertical-dark-menu' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-700'}`}>
                      <div className="flex items-center gap-2 border-b border-slate-200/20 pb-3">
                        <div className="h-7 w-7 rounded-lg" style={{ backgroundColor: configuration.branding.accentColor }} />
                        <span className="truncate text-xs font-bold">{configuration.name || 'Application'}</span>
                      </div>
                      <nav className="mt-3 space-y-1">
                        {selectedPages.length > 0 ? (
                          selectedPages.map((page, index) => (
                            <div
                              className={`rounded-md px-2.5 py-2 text-xs ${index === 0 ? 'font-semibold' : ''}`}
                              key={page.id}
                              style={index === 0 ? { backgroundColor: `${configuration.branding.accentColor}18`, color: configuration.branding.accentColor } : undefined}
                            >
                              {page.label}
                            </div>
                          ))
                        ) : (
                          <p className="px-2 py-3 text-[11px] opacity-60">Select pages to build navigation.</p>
                        )}
                      </nav>
                    </aside>
                    <main className="min-w-0 flex-1 p-4">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <div className="h-20 rounded-lg bg-slate-100" />
                        <div className="h-20 rounded-lg bg-slate-100" />
                      </div>
                      <div className="mt-3 h-28 rounded-lg bg-slate-100" />
                    </main>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div>
              <StepHeading title="Review manifest" description="This deterministic configuration boundary is ready to become the Export Engine input in U0.4." />
              <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
                <div className="space-y-2">
                  <ReviewLine label="Application" value={configuration.name} />
                  <ReviewLine label="Preset" value={selectedPreset?.name ?? 'Blank'} />
                  <ReviewLine label="Features" value={String(configuration.featureIds.length)} />
                  <ReviewLine label="Pages" value={String(configuration.pageIds.length)} />
                  <ReviewLine label="Shell" value={configuration.shellVariant} />
                  {validationIssues.length > 0 ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <p className="text-xs font-semibold text-amber-900">Manifest needs attention</p>
                      <ul className="mt-1.5 space-y-1 text-[11px] leading-4 text-amber-800">
                        {validationIssues.map((issue) => <li key={issue}>• {issue}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                      Manifest configuration is valid.
                    </div>
                  )}
                  <button
                    className="w-full rounded-lg bg-brand-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    disabled={validationIssues.length > 0}
                    onClick={downloadManifest}
                    type="button"
                  >
                    Download webblueprint.json
                  </button>
                </div>
                <pre className="max-h-[520px] overflow-auto rounded-xl bg-slate-950 p-4 text-[11px] leading-5 text-slate-200">
                  {JSON.stringify(manifest, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentStepIndex === 0}
              onClick={() => goRelative(-1)}
              type="button"
            >
              Back
            </button>
            <div className="text-center text-[11px] text-slate-400">Draft saved locally</div>
            <button
              className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentStepIndex === steps.length - 1 || (currentStep === 'application' && validationIssues.length > 0)}
              onClick={() => goRelative(1)}
              type="button"
            >
              Next
            </button>
          </div>
        </section>
      </div>

      <aside className="space-y-3 xl:sticky xl:top-20 xl:self-start">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-brand-600">Project state</p>
          <p className="mt-2 truncate text-lg font-semibold text-slate-900">{configuration.name || 'Untitled'}</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-slate-400">{configuration.slug}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Metric label="Features" value={configuration.featureIds.length} />
            <Metric label="Pages" value={configuration.pageIds.length} />
          </div>
          <div className="mt-3 rounded-lg bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Preset</p>
            <p className="mt-1 text-xs font-semibold text-slate-700">{selectedPreset?.name ?? 'Blank configuration'}</p>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-700">Manifest status</p>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${validationIssues.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {validationIssues.length === 0 ? 'READY' : 'CHECK'}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            `webblueprint.json` is generated from the current draft. ZIP export remains intentionally reserved for U0.4.
          </p>
        </section>
      </aside>
    </div>
  );
}

function StepHeading({ description, title }: { description: string; title: string }) {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
      <p className="mt-1 max-w-3xl text-sm leading-5 text-slate-600">{description}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3">
      <p className="text-xl font-semibold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-slate-400">{label}</p>
    </div>
  );
}

function ReviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">{label}</p>
      <p className="mt-1 break-words text-xs font-semibold text-slate-700">{value}</p>
    </div>
  );
}
