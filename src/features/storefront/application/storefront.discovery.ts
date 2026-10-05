import type { StorefrontProductCardDto } from './storefront.dto';

export interface StorefrontProductDiscoveryState {
  searchText: string;
}

export interface StorefrontProductDiscoveryResult {
  products: readonly StorefrontProductCardDto[];
  resultCount: number;
  hasActiveCriteria: boolean;
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

export function discoverStorefrontProducts(
  products: readonly StorefrontProductCardDto[],
  state: StorefrontProductDiscoveryState,
): StorefrontProductDiscoveryResult {
  const normalizedSearch = normalizeSearchValue(state.searchText);
  const searchTerms = normalizedSearch ? normalizedSearch.split(/\s+/) : [];

  const matchedProducts = searchTerms.length === 0
    ? products
    : products.filter((product) => {
        const searchableValue = normalizeSearchValue([
          product.title,
          product.subtitle,
          product.compatibilityLabel,
          product.badgeLabel,
        ].join(' '));

        return searchTerms.every((term) => searchableValue.includes(term));
      });

  return {
    products: matchedProducts,
    resultCount: matchedProducts.length,
    hasActiveCriteria: searchTerms.length > 0,
  };
}
