export type ProductStockState = 'in-stock' | 'low-stock' | 'out-of-stock';

export type ProductStockFilter = 'all' | ProductStockState;

export type ProductFilter = {
  search: string;
  stockState: ProductStockFilter;
};

export type ProductSummary = {
  id: string;
  name: string;
  sku: string;
  category: string;
  priceLabel: string;
  stockQuantity: number;
  stockState: ProductStockState;
};

export type ProductsDataState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; products: readonly ProductSummary[]; total: number }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };

export type ProductsQueryResult = Extract<ProductsDataState, { status: 'success' | 'empty' | 'error' }>;

export type ProductsRepository = {
  list: (filter: ProductFilter) => Promise<ProductsQueryResult>;
};
