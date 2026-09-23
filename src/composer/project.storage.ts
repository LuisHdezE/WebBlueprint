import { createDefaultProject, sanitizeProject } from '@/composer/project.logic';
import type { BlueprintProjectManifest } from '@/composer/project.types';
import { themePresets } from '@/theme/themeContext';

export const projectStorageKey = 'webblueprint.project.v1';

function isThemeColor(value: unknown) {
  return typeof value === 'string' && themePresets.some((preset) => preset.id === value);
}

export function readProjectManifest(): BlueprintProjectManifest {
  const fallback = createDefaultProject();
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(projectStorageKey);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<BlueprintProjectManifest>;
    const application = parsed.application;
    const theme = parsed.theme;

    const candidate: BlueprintProjectManifest = {
      schemaVersion: '1.0',
      application: {
        name: typeof application?.name === 'string' ? application.name : fallback.application.name,
        logoDataUrl: typeof application?.logoDataUrl === 'string' ? application.logoDataUrl : null,
        faviconDataUrl: typeof application?.faviconDataUrl === 'string' ? application.faviconDataUrl : null,
      },
      presetId: typeof parsed.presetId === 'string' ? parsed.presetId : null,
      theme: {
        colorId: isThemeColor(theme?.colorId) ? theme.colorId : fallback.theme.colorId,
      },
      views: Array.isArray(parsed.views) ? parsed.views.filter((path): path is string => typeof path === 'string') : fallback.views,
    };

    return sanitizeProject(candidate);
  } catch {
    return fallback;
  }
}

export function writeProjectManifest(project: BlueprintProjectManifest) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(projectStorageKey, JSON.stringify(sanitizeProject(project)));
}
