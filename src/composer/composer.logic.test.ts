import { describe, expect, it } from 'vitest';
import { applicationRegistry } from '@/applications/applicationRegistry';
import { composerFeatureOptions, composerPageOptions, toStableId } from '@/composer/composer.catalog';
import {
  applyPreset,
  buildComposerManifest,
  createEmptyComposerConfiguration,
  deriveApplicationSlug,
} from '@/composer/composer.logic';

describe('composer core', () => {
  it('creates stable ids and application slugs', () => {
    expect(toStableId(' Pet Shop CRM ')).toBe('pet-shop-crm');
    expect(deriveApplicationSlug('Gestión de Órdenes')).toBe('gestion-de-ordenes');
  });

  it('applies a registered application as a Composer preset', () => {
    const preset = applicationRegistry[0];
    const configuration = applyPreset(createEmptyComposerConfiguration(), preset);

    expect(configuration.presetId).toBe(preset.id);
    expect(configuration.name).toBe(preset.name);
    expect(configuration.shellVariant).toBe(preset.shellVariant);
    expect(configuration.featureIds).toHaveLength(preset.capabilities.length);
    expect(configuration.pageIds).toHaveLength(preset.demoPages.length);
  });

  it('builds a deterministic manifest from selected configuration state', () => {
    const configuration = createEmptyComposerConfiguration();
    const firstFeature = composerFeatureOptions[0];
    const firstPage = composerPageOptions[0];

    configuration.name = 'Proposal CRM';
    configuration.slug = 'proposal-crm';
    configuration.featureIds = firstFeature ? [firstFeature.id] : [];
    configuration.pageIds = firstPage ? [firstPage.id] : [];

    const manifest = buildComposerManifest(configuration);

    expect(manifest.schemaVersion).toBe('0.1');
    expect(manifest.application.slug).toBe('proposal-crm');
    expect(manifest.branding.logoUrl).toBeNull();
    expect(manifest.features).toHaveLength(firstFeature ? 1 : 0);
    expect(manifest.pages).toHaveLength(firstPage ? 1 : 0);
    expect(manifest.navigation.items).toHaveLength(manifest.pages.length);
  });
});
