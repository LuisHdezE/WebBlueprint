import { useEffect, useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/data-display/DataTable';
import { StatusBadge, type StatusBadgeTone } from '@/components/data-display/StatusBadge';
import { InlineFeedback } from '@/components/feedback/InlineFeedback';
import { SearchField } from '@/components/forms/SearchField';
import { mockProductsRepository } from '@/products/mockProductsRepository';
import type {
  ProductFilter,
  ProductStockFilter,
  ProductStockState,
  ProductSummary,
  ProductsDataState,
  ProductsRepository,
} from '@/products/products.types';

const stockLabels: Record<ProductStockState, string> = {
  'in-stock': 'Disponible',
  'low-stock': 'Stock bajo',
  'out-of-stock': 'Sin stock',
};

const stockTones: Record<ProductStockState, StatusBadgeTone> = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'neutral',
};

const productColumns: readonly DataTableColumn<ProductSummary>[] = [
  {
    id: 'product',
    header: 'Producto',
    className: 'min-w-64',
    cell: (product) => (
      <div>
        <p className="font-semibold text-slate-900">{product.name}</p>
        <p className="mt-1 font-mono text-[11px] text-slate-400">{product.sku}</p>
      </div>
    ),
  },
  {
    id: 'category',
    header: 'Categoría',
    cell: (product) => product.category,
  },
  {
    id: 'stock',
    header: 'Inventario',
    cell: (product) => (
      <div className="grid gap-1.5">
        <StatusBadge label={stockLabels[product.stockState]} tone={stockTones[product.stockState]} />
        <span className="text-[11px] text-slate-400">{product.stockQuantity} unidades</span>
      </div>
    ),
  },
  {
    id: 'price',
    header: 'Precio',
    align: 'right',
    cell: (product) => <span className="font-semibold text-slate-900">{product.priceLabel}</span>,
  },
];

const initialFilter: ProductFilter = {
  search: '',
  stockState: 'all',
};

export type ProductCatalogViewProps = {
  repository?: ProductsRepository;
};

export function ProductCatalogView({ repository = mockProductsRepository }: ProductCatalogViewProps) {
  const [filter, setFilter] = useState<ProductFilter>(initialFilter);
  const [state, setState] = useState<ProductsDataState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    repository
      .list(filter)
      .then((nextState) => {
        if (active) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (active) {
          setState({ status: 'error', message: 'No fue posible cargar el catálogo de productos.' });
        }
      });

    return () => {
      active = false;
    };
  }, [filter, repository]);

  const hasFilters = filter.search.trim().length > 0 || filter.stockState !== 'all';

  function setSearch(search: string) {
    setFilter((current) => ({ ...current, search }));
  }

  function setStockState(stockState: ProductStockFilter) {
    setFilter((current) => ({ ...current, stockState }));
  }

  function clearFilters() {
    setFilter(initialFilter);
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">Catálogo administrativo</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">Productos e inventario disponible</h3>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              Busca por nombre, SKU o categoría y filtra por el estado actual del inventario.
            </p>
          </div>
          {state.status === 'success' ? (
            <p className="text-xs font-semibold text-slate-500">{state.total} productos mostrados</p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
          <SearchField
            id="products-search"
            label="Buscar productos"
            onChange={setSearch}
            placeholder="Nombre, SKU o categoría"
            value={filter.search}
          />

          <label className="grid gap-1.5" htmlFor="products-stock-filter">
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Estado de inventario</span>
            <select
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              id="products-stock-filter"
              onChange={(event) => setStockState(event.target.value as ProductStockFilter)}
              value={filter.stockState}
            >
              <option value="all">Todos</option>
              <option value="in-stock">Disponible</option>
              <option value="low-stock">Stock bajo</option>
              <option value="out-of-stock">Sin stock</option>
            </select>
          </label>

          <button
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!hasFilters}
            onClick={clearFilters}
            type="button"
          >
            Limpiar filtros
          </button>
        </div>
      </section>

      {state.status === 'loading' || state.status === 'idle' ? (
        <InlineFeedback title="Cargando productos" message="Estamos preparando el catálogo administrativo de esta demo." tone="info" />
      ) : null}

      {state.status === 'error' ? (
        <InlineFeedback title="No se pudo cargar el catálogo" message={state.message} tone="error" />
      ) : null}

      {state.status === 'empty' ? (
        <InlineFeedback title="Sin coincidencias" message={state.message} />
      ) : null}

      {state.status === 'success' ? (
        <DataTable
          caption="Catálogo de productos"
          columns={productColumns}
          getRowId={(product) => product.id}
          rows={state.products}
        />
      ) : null}
    </div>
  );
}
