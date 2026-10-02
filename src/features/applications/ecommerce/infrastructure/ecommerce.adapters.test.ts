import { describe, expect, it } from 'vitest';
import { JsonEcommerceCatalogProvider } from './JsonEcommerceCatalogProvider';

describe('ecommerce catalog adapter', () => {
  it('exposes one governed catalog and products view', () => {
    const provider = new JsonEcommerceCatalogProvider();
    const products = provider.getProducts();
    const view = provider.getProductsView();
    expect(products).toHaveLength(5);
    expect(view.products).toEqual(products);
    expect(view.categories).toEqual(['Audio', 'Accesorios', 'Hogar', 'Oficina']);
    expect(products.filter((product) => product.featured)).toHaveLength(2);
  });

  it('exposes governed shop copy without creating a second catalog', () => {
    const provider = new JsonEcommerceCatalogProvider();
    const products = provider.getProducts();
    const view = provider.getShopView();
    expect(view.title).toBe('Tienda');
    expect(view.breadcrumbs).toEqual(['Aplicaciones', 'Ecommerce', 'Tienda']);
    expect(provider.getProducts()).toBe(products);
    expect(products.filter((product) => product.status !== 'Borrador')).toHaveLength(4);
    expect(products.filter((product) => product.status === 'Agotado')).toHaveLength(1);
  });

  it('resolves product detail configuration against the canonical catalog', () => {
    const provider = new JsonEcommerceCatalogProvider();
    const products = provider.getProducts();
    const view = provider.getProductDetailView();
    expect(view.title).toBe('Detalle del producto');
    expect(view.breadcrumbs).toEqual(['Aplicaciones', 'Ecommerce', 'Detalle']);
    expect(products.some((product) => product.id === view.productId)).toBe(true);
    expect(provider.getProducts()).toBe(products);
  });
});
