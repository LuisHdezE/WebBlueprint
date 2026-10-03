import { describe, expect, it } from 'vitest';
import { JsonStorefrontProvider } from './JsonStorefrontProvider';

describe('storefront provider', () => {
  it('exposes deterministic shell and home data', () => {
    const provider = new JsonStorefrontProvider();
    const shell = provider.getShellView();
    const home = provider.getHomeView();

    expect(shell.storeName).toBe('Elias Store Demo');
    expect(shell.primaryNav.map((item) => item.href)).toContain('/store');
    expect(shell.categoryNav).toHaveLength(4);
    expect(shell.utilityNav.map((item) => item.href)).toEqual(['/store/account', '/store/favorites', '/store/cart']);
    expect(shell.footerColumns.length).toBeGreaterThanOrEqual(2);
    expect(home.title).toContain('Storefront comercial');
    expect(home.ctas.map((cta) => cta.href)).toContain('/store/products');
    expect(home.featureTiles.map((tile) => tile.id)).toContain('admin-separated');
  });
});
