import type { StorefrontProductCardDto } from './storefront.dto';

export type StorefrontProductDiscoveryFilters = Readonly<Record<string, string>>;

export interface StorefrontProductDiscoveryState {
  searchText: string;
  filters?: StorefrontProductDiscoveryFilters;
}

export interface StorefrontProductDiscoveryResult {
  products: readonly StorefrontProductCardDto[];
  resultCount: number;
  hasActiveCriteria: boolean;
  activeFilterCount: number;
}

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim();
}

function getActiveFilters(filters: StorefrontProductDiscoveryFilters | undefined) {
  return Object.entries(filters ?? {}).filter(([, value]) => value && value !== 'all');
}

export function discoverStorefrontProducts(
  products: readonly StorefrontProductCardDto[],
  state: StorefrontProductDiscoveryState,
): StorefrontProductDiscoveryResult {
  const normalizedSearch = normalizeSearchValue(state.searchText);
  const searchTerms = normalizedSearch ? normalizedSearch.split(/\s+/) : [];
  const activeFilters = getActiveFilters(state.filters);

  const matchedProducts = products.filter((product) => {
    const searchableValue = normalizeSearchValue([
      product.title,
      product.subtitle,
      product.compatibilityLabel,
      product.badgeLabel,
    ].join(' '));

    const matchesSearch = searchTerms.every((term) => searchableValue.includes(term));
    const matchesFilters = activeFilters.every(
      ([filterId, value]) => product.discoveryFacets?.[filterId] === value,
    );

    return matchesSearch && matchesFilters;
  });

  return {
    products: matchedProducts,
    resultCount: matchedProducts.length,
    hasActiveCriteria: searchTerms.length > 0 || activeFilters.length > 0,
    activeFilterCount: activeFilters.length,
  };
}
