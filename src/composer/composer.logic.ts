import type { ApplicationDefinition } from '@/applications/application.types';
import {
  composerFeatureOptions,
  composerPageOptions,
  getPresetFeatureIds,
  getPresetPageIds,
  toStableId,
} from '@/composer/composer.catalog';
import type { ComposerConfiguration, ComposerManifest } from '@/composer/composer.types';

export const defaultAccentColor = '#2563eb';

export function createEmptyComposerConfiguration(): ComposerConfiguration {
  return {
    name: 'Nueva aplicación',
    slug: 'nueva-aplicacion',
    description: '',
    branding: {
      logoUrl: '',
      accentColor: defaultAccentColor,
    },
    presetId: null,
    featureIds: [],
    pageIds: [],
    shellVariant: 'collapsible-menu',
  };
}

export function deriveApplicationSlug(name: string) {
  return toStableId(name);
}

export function applyPreset(
  current: ComposerConfiguration,
  preset: ApplicationDefinition,
): ComposerConfiguration {
  return {
    ...current,
    presetId: preset.id,
    featureIds: getPresetFeatureIds(preset),
    pageIds: getPresetPageIds(preset),
    shellVariant: preset.shellVariant,
  };
}

export function validateComposerConfiguration(configuration: ComposerConfiguration) {
  const issues: string[] = [];

  if (!configuration.name.trim()) {
    issues.push('El nombre de la aplicación es obligatorio.');
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(configuration.slug.trim())) {
    issues.push('El slug solo puede contener letras minúsculas, números y guiones simples.');
  }

  if (!/^#[0-9a-f]{6}$/i.test(configuration.branding.accentColor)) {
    issues.push('El color de acento debe ser un hexadecimal de seis dígitos.');
  }

  return issues;
}

export function buildComposerManifest(configuration: ComposerConfiguration): ComposerManifest {
  const selectedFeatures = new Set(configuration.featureIds);
  const selectedPages = new Set(configuration.pageIds);

  const features = composerFeatureOptions
    .filter((feature) => selectedFeatures.has(feature.id))
    .map((feature) => ({ id: feature.id, label: feature.label }));

  const pages = composerPageOptions
    .filter((page) => selectedPages.has(page.id))
    .map((page) => ({
      id: page.id,
      label: page.label,
      path: page.path,
      sourceApplicationId: page.sourceApplicationId,
    }));

  return {
    schemaVersion: '0.1',
    application: {
      name: configuration.name.trim(),
      slug: configuration.slug.trim(),
      description: configuration.description.trim(),
    },
    branding: {
      logoUrl: configuration.branding.logoUrl.trim() || null,
      accentColor: configuration.branding.accentColor,
    },
    presetId: configuration.presetId,
    features,
    pages,
    navigation: {
      shellVariant: configuration.shellVariant,
      items: pages.map((page) => ({
        pageId: page.id,
        label: page.label,
        path: page.path,
      })),
    },
  };
}
