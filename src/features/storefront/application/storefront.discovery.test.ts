import { describe, expect, it } from 'vitest';
import type { StorefrontProductCardDto } from './storefront.dto';
import { discoverStorefrontProducts } from './storefront.discovery';

const product = (
  id: string,
  title: string,
  subtitle: string,
  compatibilityLabel: string,
  badgeLabel: string,
  discoveryFacets: Readonly<Record<string, string>>,
  discoverySortRanks: Readonly<Record<string, number>>,
): StorefrontProductCardDto => ({
  id,
  title,
  subtitle,
  priceLabel: 'UYU 1.000',
  badgeLabel,
  href: `/store/products/${id}`,
  compatibilityLabel,
  stockLabel: 'Stock demo',
  discoveryFacets,
  discoverySortRanks,
  image: {
    src: 'https://example.com/product.jpg',
    alt: title,
  },
});

const products = [
  product(
    'display',
    'Display OLED iPhone 13',
    'Módulo premium',
    'Compatible: iPhone 13',
    'Repuesto',
    { category: 'spare-parts', 'brand-model': 'iphone-13', condition: 'new', price: 'over-2000' },
    { recommended: 1, 'price-low': 3, recent: 3 },
  ),
  product(
    'battery',
    'Batería Samsung S21',
    'Autonomía renovada',
    'Compatible: Galaxy S21',
    'Batería',
    { category: 'spare-parts', 'brand-model': 'galaxy-s21', condition: 'new', price: 'under-2000' },
    { recommended: 2, 'price-low': 1, recent: 2 },
  ),
  product(
    'used',
    'iPhone 12 128 GB usado',
    'Equipo revisado',
    'Color: Negro · Batería: 87%',
    'Usado A',
    { category: 'used-phones', 'brand-model': 'iphone-12', condition: 'used-a', price: 'usd' },
    { recommended: 3, 'price-low': 2, recent: 1 },
  ),
];

describe('storefront product discovery', () => {
  it('returns every product when search and filters are empty', () => {
    const result = discoverStorefrontProducts(products, { searchText: '   ', filters: {} });

    expect(result.products).toHaveLength(3);
    expect(result.resultCount).toBe(3);
    expect(result.hasActiveCriteria).toBe(false);
    expect(result.activeFilterCount).toBe(0);
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

  it('filters products by provider-driven facets', () => {
    const result = discoverStorefrontProducts(products, {
      searchText: '',
      filters: { category: 'spare-parts', price: 'under-2000' },
    });

    expect(result.products.map((item) => item.id)).toEqual(['battery']);
    expect(result.activeFilterCount).toBe(2);
    expect(result.hasActiveCriteria).toBe(true);
  });

  it('combines search and filters with AND semantics', () => {
    const matching = discoverStorefrontProducts(products, {
      searchText: 'samsung',
      filters: { category: 'spare-parts', condition: 'new' },
    });
    const noMatch = discoverStorefrontProducts(products, {
      searchText: 'iphone',
      filters: { 'brand-model': 'galaxy-s21' },
    });

    expect(matching.products.map((item) => item.id)).toEqual(['battery']);
    expect(noMatch.products).toEqual([]);
  });

  it('sorts by provider-driven ranks without mutating the source collection', () => {
    const priceSorted = discoverStorefrontProducts(products, { searchText: '', sortId: 'price-low' });
    const recentSorted = discoverStorefrontProducts(products, { searchText: '', sortId: 'recent' });
    const recommended = discoverStorefrontProducts(products, { searchText: '', sortId: 'recommended' });

    expect(priceSorted.products.map((item) => item.id)).toEqual(['battery', 'used', 'display']);
    expect(recentSorted.products.map((item) => item.id)).toEqual(['used', 'battery', 'display']);
    expect(recommended.products.map((item) => item.id)).toEqual(['display', 'battery', 'used']);
    expect(priceSorted.hasCustomSort).toBe(true);
    expect(priceSorted.hasActiveCriteria).toBe(true);
    expect(recommended.hasCustomSort).toBe(false);
    expect(products.map((item) => item.id)).toEqual(['display', 'battery', 'used']);
  });

  it('combines sorting with search and filters', () => {
    const result = discoverStorefrontProducts(products, {
      searchText: '',
      filters: { category: 'spare-parts' },
      sortId: 'price-low',
    });

    expect(result.products.map((item) => item.id)).toEqual(['battery', 'display']);
    expect(result.resultCount).toBe(2);
    expect(result.sortId).toBe('price-low');
  });

  it('treats all filter selections as inactive and does not mutate source data', () => {
    const result = discoverStorefrontProducts(products, {
      searchText: '',
      filters: { category: 'all', condition: 'all' },
    });

    expect(result.products).toHaveLength(3);
    expect(result.activeFilterCount).toBe(0);
    expect(result.hasActiveCriteria).toBe(false);
    expect(products).toHaveLength(3);
  });
});
