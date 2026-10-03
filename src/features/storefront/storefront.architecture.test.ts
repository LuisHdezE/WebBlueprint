import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('storefront architecture', () => {
  it('keeps storefront data behind a provider boundary', () => {
    const provider = readFileSync('src/features/storefront/infrastructure/JsonStorefrontProvider.ts', 'utf8');
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(provider).toContain("import rawStorefront from './storefront.view.json'");
    expect(home).not.toContain('.json');
    expect(shell).not.toContain('.json');
    expect(home).toContain('provider.getHomeView()');
    expect(shell).toContain('provider.getShellView()');
  });

  it('uses a dedicated storefront shell outside admin and public shells', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const storefrontShell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(router).toContain('path="store"');
    expect(router).toContain('<StorefrontShell provider={storefrontProvider} />');
    expect(router.indexOf('<StorefrontShell provider={storefrontProvider} />')).toBeLessThan(router.indexOf('<TemplateShell />'));
    expect(storefrontShell).not.toContain('TemplateSidebar');
    expect(storefrontShell).not.toContain('TemplateTopbar');
    expect(storefrontShell).not.toContain('PublicShell');
  });

  it('keeps B1 storefront free of legacy ecommerce coupling', () => {
    const router = readFileSync('src/app/router/AppRouter.tsx', 'utf8');
    const home = readFileSync('src/features/storefront/presentation/StorefrontHomePage.tsx', 'utf8');
    const shell = readFileSync('src/shell/StorefrontShell.tsx', 'utf8');

    expect(router).toContain('StorefrontHomePage');
    expect(home).not.toContain('JsonEcommerceCatalogProvider');
    expect(shell).not.toContain('JsonEcommerceCatalogProvider');
    expect(home).not.toContain('ProductsPage');
    expect(shell).not.toContain('ShopPage');
  });
});
