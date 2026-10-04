import { describe, expect, it } from 'vitest';
import type { StorefrontProductCardDto } from './storefront.dto';
import { discoverStorefrontProducts } from './storefront.discovery';

const product = (
  id: string,
  title: string,
  subtitle: string,
  compatibilityLabel: string,
  badgeLabel: string,
): StorefrontProductCardDto => ({
  id,
  title,
  subtitle,
  priceLabel: 'UYU 1.000',
  badgeLabel,
  href: `/store/products/${id}`,
  compatibilityLabel,
  stockLabel: 'Stock demo',
  image: {
    src: 'https://example.com/product.jpg',
    alt: title,
  },
});

const products = [
  product('display', 'Display OLED iPhone 13', 'Módulo premium', 'Compatible: iPhone 13', 'Repuesto'),
  product('battery', 'Batería Samsung S21', 'Autonomía renovada', 'Compatible: Galaxy S21', 'Batería'),
  product('used', 'iPhone 12 128 GB usado', 'Equipo revisado', 'Color: Negro · Batería: 87%', 'Usado A'),
];

describe('storefront product discovery', () => {
  it('returns every product when search is empty', () => {
    const result = discoverStorefrontProducts(products, { searchText: '   ' });

    expect(result.products).toHaveLength(3);
    expect(result.resultCount).toBe(3);
    expect(result.hasActiveCriteria).toBe(false);
  });

  it('searches title, subtitle, compatibility and badge with normalized terms', () => {
    expect(discoverStorefrontProducts(products, { searchText: 'iphone oled' }).products.map((item) => item.id))
      .toEqual(['display']);
    expect(discoverStorefrontProducts(products, { searchText: 'autonomia' }).products.map((item) => item.id))
      .toEqual(['battery']);
    expect(discoverStorefrontProducts(products, { searchText: 'galaxy s21' }).products.map((item) => item.id))
      .toEqual(['battery']);
    expect(discoverStorefrontProducts(products, { searchText: 'usado a' }).products.map((item) => item.id))
      .toEqual(['used']);
  });

  it('returns a real empty result without mutating the source collection', () => {
    const result = discoverStorefrontProducts(products, { searchText: 'pixel 99' });

    expect(result.products).toEqual([]);
    expect(result.resultCount).toBe(0);
    expect(result.hasActiveCriteria).toBe(true);
    expect(products).toHaveLength(3);
  });
});
