import { describe, expect, it } from 'vitest';
import { applicationRegistry } from '@/applications/applicationRegistry';
import { composerFeatureOptions, composerPageOptions, toStableId } from '@/composer/composer.catalog';
import {
  applyPreset,
  buildComposerManifest,
  createEmptyComposerConfiguration,
  deriveApplicationSlug,
  validateComposerConfiguration,
} from '@/composer/composer.logic';

describe('composer core', () => {
  it('creates stable ids and application slugs', () => {
    expect(toStableId(' Pet Shop CRM ')).toBe('pet-shop-crm');
    expect(deriveApplicationSlug('Gestión de Órdenes')).toBe('gestion-de-ordenes');
  });

  it('applies a registered application as a Composer preset without replacing project identity', () => {
    const preset = applicationRegistry[0];
    const current = createEmptyComposerConfiguration();
    current.name = 'Cliente Demo';
    current.slug = 'cliente-demo';
    current.description = 'Propuesta personalizada';
    current.branding.logoUrl = 'https://example.com/logo.svg';
    current.branding.accentColor = '#7c3aed';

    const configuration = applyPreset(current, preset);

    expect(configuration.presetId).toBe(preset.id);
    expect(configuration.name).toBe('Cliente Demo');
    expect(configuration.slug).toBe('cliente-demo');
    expect(configuration.description).toBe('Propuesta personalizada');
    expect(configuration.branding).toEqual(current.branding);
    expect(configuration.shellVariant).toBe(preset.shellVariant);
    expect(configuration.featureIds).toHaveLength(preset.capabilities.length);
    expect(configuration.pageIds).toHaveLength(preset.demoPages.length);
  });

  it('builds a deterministic manifest from selected configuration state', () => {
    const configuration = createEmptyComposerConfiguration();
    const firstFeature = composerFeatureOptions[0];
    const firstPage = composerPageOptions[0];

    configuration.name = 'Portal de clientes';
    configuration.slug = 'portal-de-clientes';
    configuration.featureIds = firstFeature ? [firstFeature.id] : [];
    configuration.pageIds = firstPage ? [firstPage.id] : [];

    const manifest = buildComposerManifest(configuration);

    expect(manifest.schemaVersion).toBe('0.2');
    expect(manifest.application.slug).toBe('portal-de-clientes');
    expect(manifest.branding.logoUrl).toBeNull();
    expect(manifest.features).toHaveLength(firstFeature ? 1 : 0);
    expect(manifest.pages).toHaveLength(firstPage ? 1 : 0);
    expect(manifest.navigation.items).toHaveLength(manifest.pages.length);

    if (firstPage) {
      expect(manifest.pages[0]).toMatchObject({
        pageKey: firstPage.pageKey,
        iconKey: firstPage.iconKey,
        group: firstPage.group,
      });
      expect(manifest.navigation.items[0]).toMatchObject({
        pageKey: firstPage.pageKey,
        iconKey: firstPage.iconKey,
        group: firstPage.group,
      });
    }
  });

  it('reports invalid identity and branding before manifest download', () => {
    const configuration = createEmptyComposerConfiguration();
    configuration.name = '   ';
    configuration.slug = 'Bad Slug';
    configuration.branding.accentColor = 'blue';

    expect(validateComposerConfiguration(configuration)).toEqual([
      'El nombre de la aplicación es obligatorio.',
      'El slug solo puede contener letras minúsculas, números y guiones simples.',
      'El color de acento debe ser un hexadecimal de seis dígitos.',
    ]);
  });
});
