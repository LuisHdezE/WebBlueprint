import type {
  ProductFilter,
  ProductSummary,
  ProductsQueryResult,
  ProductsRepository,
} from '@/products/products.types';

const products: readonly ProductSummary[] = [
  {
    id: 'prod-001',
    name: 'Alimento premium canino 12 kg',
    sku: 'PET-ALI-001',
    category: 'Alimentos',
    priceLabel: '$ 1.290',
    stockQuantity: 24,
    stockState: 'in-stock',
  },
  {
    id: 'prod-002',
    name: 'Arena sanitaria aglomerante 8 kg',
    sku: 'PET-HIG-014',
    category: 'Higiene',
    priceLabel: '$ 690',
    stockQuantity: 7,
    stockState: 'low-stock',
  },
  {
    id: 'prod-003',
    name: 'Juguete mordedor de caucho',
    sku: 'PET-JUG-032',
    category: 'Juguetes',
    priceLabel: '$ 450',
    stockQuantity: 0,
    stockState: 'out-of-stock',
  },
  {
    id: 'prod-004',
    name: 'Collar reflectivo ajustable',
    sku: 'PET-ACC-021',
    category: 'Accesorios',
    priceLabel: '$ 590',
    stockQuantity: 18,
    stockState: 'in-stock',
  },
  {
    id: 'prod-005',
    name: 'Cama acolchada mediana',
    sku: 'PET-DES-008',
    category: 'Descanso',
    priceLabel: '$ 1.890',
    stockQuantity: 5,
    stockState: 'low-stock',
  },
  {
    id: 'prod-006',
    name: 'Shampoo neutro para mascotas',
    sku: 'PET-HIG-005',
    category: 'Higiene',
    priceLabel: '$ 520',
    stockQuantity: 31,
    stockState: 'in-stock',
  },
  {
    id: 'prod-007',
    name: 'Transportadora rígida pequeña',
    sku: 'PET-TRA-011',
    category: 'Transporte',
    priceLabel: '$ 2.490',
    stockQuantity: 0,
    stockState: 'out-of-stock',
  },
  {
    id: 'prod-008',
    name: 'Snack dental para perros',
    sku: 'PET-SNA-019',
    category: 'Snacks',
    priceLabel: '$ 380',
    stockQuantity: 14,
    stockState: 'in-stock',
  },
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('es');
}

function matchesSearch(product: ProductSummary, search: string) {
  const normalizedSearch = normalize(search);

  if (!normalizedSearch) {
    return true;
  }

  return [product.name, product.sku, product.category]
    .map(normalize)
    .some((value) => value.includes(normalizedSearch));
}

export const mockProductsRepository: ProductsRepository = {
  async list(filter: ProductFilter): Promise<ProductsQueryResult> {
    const filtered = products.filter((product) => {
      const stockMatches = filter.stockState === 'all' || product.stockState === filter.stockState;
      return stockMatches && matchesSearch(product, filter.search);
    });

    if (filtered.length === 0) {
      return {
        status: 'empty',
        message: 'No encontramos productos que coincidan con los filtros actuales.',
      };
    }

    return {
      status: 'success',
      products: filtered,
      total: filtered.length,
    };
  },
};
