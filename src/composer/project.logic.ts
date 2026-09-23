import { getProjectPreset } from '@/composer/project.presets';
import type { BlueprintProjectManifest } from '@/composer/project.types';
import { projectViewCatalog } from '@/composer/project.catalog';

export function createDefaultProject(): BlueprintProjectManifest {
  return {
    schemaVersion: '1.0',
    application: {
      name: 'Mi aplicación',
      logoDataUrl: null,
      faviconDataUrl: null,
    },
    presetId: null,
    theme: {
      colorId: 'forest',
    },
    views: ['/dashboard'],
  };
}

export function applyProjectPreset(
  project: BlueprintProjectManifest,
  presetId: string,
): BlueprintProjectManifest {
  const preset = getProjectPreset(presetId);
  if (!preset) {
    return project;
  }

  return {
    ...project,
    presetId: preset.id === 'blank' ? null : preset.id,
    views: [...preset.viewPaths],
  };
}

export function toggleProjectView(
  project: BlueprintProjectManifest,
  path: string,
): BlueprintProjectManifest {
  if (!projectViewCatalog.some((view) => view.path === path)) {
    return project;
  }

  const selected = project.views.includes(path);
  return {
    ...project,
    views: selected ? project.views.filter((candidate) => candidate !== path) : [...project.views, path],
  };
}

export function setProjectSectionSelection(
  project: BlueprintProjectManifest,
  paths: readonly string[],
  selected: boolean,
): BlueprintProjectManifest {
  if (selected) {
    const additions = paths.filter((path) => !project.views.includes(path));
    return { ...project, views: [...project.views, ...additions] };
  }

  const pathSet = new Set(paths);
  return { ...project, views: project.views.filter((path) => !pathSet.has(path)) };
}

export function moveProjectView(
  project: BlueprintProjectManifest,
  path: string,
  offset: -1 | 1,
): BlueprintProjectManifest {
  const currentIndex = project.views.indexOf(path);
  const targetIndex = currentIndex + offset;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= project.views.length) {
    return project;
  }

  const views = [...project.views];
  const [moved] = views.splice(currentIndex, 1);
  if (!moved) {
    return project;
  }
  views.splice(targetIndex, 0, moved);
  return { ...project, views };
}

export function sanitizeProject(project: BlueprintProjectManifest): BlueprintProjectManifest {
  const validPaths = new Set(projectViewCatalog.map((view) => view.path));
  const uniqueViews = [...new Set(project.views)].filter((path) => validPaths.has(path));
  return {
    ...project,
    application: {
      ...project.application,
      name: project.application.name.trim() || 'Mi aplicación',
    },
    views: uniqueViews,
  };
}
