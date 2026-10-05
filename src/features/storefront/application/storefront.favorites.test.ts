import { describe, expect, it } from 'vitest';
import type { StorefrontProductCardDto } from './storefront.dto';
import {
  deriveFavoriteProducts,
  getInitialFavoriteIds,
  removeFavorite,
  restoreFavorites,
} from './storefront.favorites';

const products: readonly StorefrontProductCardDto[] = [
  {
    id: 'display',
    title: 'Display',
    subtitle: 'OLED',
    priceLabel: 'UYU 4.890',
    badgeLabel: 'Repuesto',
    href: '/store/products/display',
    compatibilityLabel: 'iPhone 13',
    stockLabel: 'Stock demo: 3',
    image: { src: 'https://example.com/display.jpg', alt: 'Display' },
  },
  {
    id: 'battery',
    title: 'Battery',
    subtitle: 'S21',
    priceLabel: 'UYU 1.690',
    badgeLabel: 'Batería',
    href: '/store/products/battery',
    compatibilityLabel: 'Galaxy S21',
    stockLabel: 'Stock demo: 5',
    image: { src: 'https://example.com/battery.jpg', alt: 'Battery' },
  },
];

describe('storefront favorites interaction', () => {
  it('derives provider initial favorites deterministically', () => {
    expect(getInitialFavoriteIds(products)).toEqual(['display', 'battery']);
  });

  it('removes one favorite without mutating the source collection', () => {
    const initial = getInitialFavoriteIds(products);
    const next = removeFavorite(initial, 'display');

    expect(next).toEqual(['battery']);
    expect(initial).toEqual(['display', 'battery']);
    expect(products.map((product) => product.id)).toEqual(['display', 'battery']);
  });

  it('derives visible products from active favorite ids', () => {
    expect(deriveFavoriteProducts(products, ['battery']).map((product) => product.id)).toEqual(['battery']);
  });

  it('restores the provider initial favorites', () => {
    expect(restoreFavorites(products)).toEqual(['display', 'battery']);
  });
});
