import { getSelectedProjectViews } from '@/composer/project.catalog';
import { getProjectPreset, projectPresets } from '@/composer/project.presets';
import type { BlueprintProjectManifest, SavedProjectPreset } from '@/composer/project.types';
import { themePresets } from '@/theme/themeContext';

export const savedProjectPresetPrefix = 'webblueprint.saved-preset.v1.';
export const maxPresetNameLength = 80;

export function createSavedProjectPreset(project: BlueprintProjectManifest, label: string, id: string): SavedProjectPreset {
  const name = label.trim();
  if (!name || name.length > maxPresetNameLength) {
    throw new Error(`El nombre debe tener entre 1 y ${maxPresetNameLength} caracteres.`);
  }
  const viewPaths = [...new Set(project.views)];
  if (!viewPaths.length || getSelectedProjectViews(viewPaths).length !== viewPaths.length) {
    throw new Error('Selecciona al menos una vista disponible en el catálogo.');
  }
  return {
    id,
    name,
    basePresetId: getProjectPreset(project.presetId)?.id ?? null,
    themeColorId: project.theme.colorId,
    viewPaths,
  };
}

export function applySavedProjectPreset(project: BlueprintProjectManifest, preset: SavedProjectPreset): BlueprintProjectManifest {
  return {
    ...project,
    presetId: preset.basePresetId,
    savedPresetId: preset.id,
    theme: { colorId: preset.themeColorId },
    views: [...preset.viewPaths],
  };
}

export function readSavedProjectPresets(storage: Storage): SavedProjectPreset[] {
  const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index));
  const presets: SavedProjectPreset[] = [];
  for (const key of keys) {
    if (!key?.startsWith(savedProjectPresetPrefix)) continue;
    try {
      const raw = storage.getItem(key);
      if (!raw) continue;
      const preset = JSON.parse(raw) as Partial<SavedProjectPreset> | null;
      const name = typeof preset?.name === 'string' ? preset.name.trim() : '';
      const theme = themePresets.find(({ id }) => id === preset?.themeColorId);
      if (!preset || preset.id !== key.slice(savedProjectPresetPrefix.length) || !name || name.length > maxPresetNameLength || !theme || !Array.isArray(preset.viewPaths)) continue;
      const viewPaths = [...new Set(preset.viewPaths)].filter((path): path is string => typeof path === 'string');
      if (!viewPaths.length || getSelectedProjectViews(viewPaths).length !== viewPaths.length) continue;
      presets.push({
        id: preset.id,
        name,
        basePresetId: getProjectPreset(preset.basePresetId ?? null)?.id ?? null,
        themeColorId: theme.id,
        viewPaths,
      });
    } catch {
      continue;
    }
  }
  return presets.sort((first, second) => first.name.localeCompare(second.name, 'es'));
}

export function saveProjectPreset(storage: Storage, preset: SavedProjectPreset) {
  const normalized = preset.name.toLocaleLowerCase('es');
  if ([...projectPresets, ...readSavedProjectPresets(storage)].some(({ name }) => name.toLocaleLowerCase('es') === normalized)) {
    throw new Error('Ya existe una plantilla con ese nombre.');
  }
  storage.setItem(`${savedProjectPresetPrefix}${preset.id}`, JSON.stringify(preset));
}
