import { describe, expect, it } from 'vitest';
import { applyProjectPreset, createDefaultProject, moveProjectView, toggleProjectView } from '@/composer/project.logic';
import { applySavedProjectPreset, createSavedProjectPreset, readSavedProjectPresets, savedProjectPresetPrefix, saveProjectPreset } from '@/composer/project.saved-presets';

function createStorage(): Storage {
  const values = new Map<string, string>();
  return {
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

describe('saved Composer templates', () => {
  it('reuses a named combination with the same order and theme as an editable project', () => {
    const source = applyProjectPreset(createDefaultProject(), 'restaurants');
    const mixed = toggleProjectView(source, '/real-estate/catalog');
    const reordered = moveProjectView({ ...mixed, theme: { colorId: 'blue' } }, '/real-estate/catalog', -1);
    const store = createStorage();
    const preset = createSavedProjectPreset(reordered, '  Catálogo y carta  ', 'mixed');
    saveProjectPreset(store, preset);

    const [saved] = readSavedProjectPresets(store);
    expect(saved).toBeDefined();
    expect(saved?.name).toBe('Catálogo y carta');
    if (!saved) throw new Error('Missing saved template');
    const newProject = { ...createDefaultProject(), application: { name: 'Otro proyecto', logoDataUrl: null, faviconDataUrl: null } };
    const project = applySavedProjectPreset(newProject, saved);
    expect(project).toMatchObject({
      application: newProject.application,
      presetId: 'restaurants',
      savedPresetId: 'mixed',
      theme: reordered.theme,
      views: reordered.views,
    });
    expect(toggleProjectView(project, '/real-estate/catalog').views).not.toContain('/real-estate/catalog');
    expect(readSavedProjectPresets(store)[0]?.viewPaths).toEqual(reordered.views);
    expect(applyProjectPreset(project, 'blank').savedPresetId).toBeUndefined();
  });

  it('protects existing templates and ignores a corrupt storage record', () => {
    const store = createStorage();
    const project = createDefaultProject();
    saveProjectPreset(store, createSavedProjectPreset(project, 'Base comercial', 'one'));
    store.setItem(`${savedProjectPresetPrefix}broken`, '{');
    expect(() => saveProjectPreset(store, createSavedProjectPreset(project, 'base comercial', 'two'))).toThrow('Ya existe');
    expect(() => saveProjectPreset(store, createSavedProjectPreset(project, 'Volketas', 'three'))).toThrow('Ya existe');
    expect(readSavedProjectPresets(store).map(({ id }) => id)).toEqual(['one']);
    expect(() => createSavedProjectPreset({ ...project, views: [] }, 'Vacía', 'empty')).toThrow('al menos una vista');
  });
});
