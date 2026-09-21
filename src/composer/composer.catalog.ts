import { applicationRegistry, getCapabilityLabel } from '@/applications/applicationRegistry';
import type { ApplicationDefinition } from '@/applications/application.types';
import type { ComposerFeatureOption, ComposerPageOption } from '@/composer/composer.types';

export function toStableId(value: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'application';
}

function buildFeatureOptions(): readonly ComposerFeatureOption[] {
  const features = new Map<string, { id: string; label: string; sourceApplicationIds: string[] }>();

  for (const application of applicationRegistry) {
    for (const capability of application.capabilities) {
      const id = toStableId(capability);
      const existing = features.get(id);

      if (existing) {
        if (!existing.sourceApplicationIds.includes(application.id)) {
          existing.sourceApplicationIds.push(application.id);
        }
        continue;
      }

      features.set(id, {
        id,
        label: getCapabilityLabel(capability),
        sourceApplicationIds: [application.id],
      });
    }
  }

  return [...features.values()];
}

function buildPageOptions(): readonly ComposerPageOption[] {
  return applicationRegistry.flatMap((application) =>
    application.demoPages.map((page) => ({
      id: `${application.id}.${page.id}`,
      pageKey: page.pageKey,
      label: page.label,
      path: page.path,
      iconKey: page.iconKey,
      group: page.group,
      description: page.description,
      sourceApplicationId: application.id,
    })),
  );
}

export const composerFeatureOptions = buildFeatureOptions();
export const composerPageOptions = buildPageOptions();

export function getPresetFeatureIds(preset: ApplicationDefinition) {
  return preset.capabilities.map(toStableId);
}

export function getPresetPageIds(preset: ApplicationDefinition) {
  return preset.demoPages.map((page) => `${preset.id}.${page.id}`);
}
