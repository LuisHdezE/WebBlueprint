import { useMemo, useState } from 'react';
import { SearchField } from '@/components/forms/SearchField';
import { SelectField } from '@/components/forms/SelectField';
import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { EcommerceCatalogProvider } from '../application/ecommerce.contracts';
import { ProductCard } from './ProductCard';

export function ShopPage({ catalogProvider }: { catalogProvider: EcommerceCatalogProvider }) {
  const products = catalogProvider.getProducts();
  const view = catalogProvider.getShopView();
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const visible = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return products.filter((product) => product.status !== 'Borrador'
      && (category === 'all' || product.category === category)
      && (!normalizedQuery || [product.name, product.category].some((value) => value.toLocaleLowerCase().includes(normalizedQuery))));
  }, [category, products, query]);

  return <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
    <SurfaceCard><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
      <SearchField id="shop-search" label={view.searchLabel} onChange={setQuery} placeholder={view.searchPlaceholder} value={query} />
      <SelectField id="shop-category" label={view.categoryLabel} onChange={setCategory} options={[{ label: view.allCategoriesLabel, value: 'all' }, ...categories.map((value) => ({ label: value, value }))]} value={category} />
    </div></SurfaceCard>
    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-shop-grid>
      {visible.map((product) => <ProductCard featuredLabel={view.featuredLabel} key={product.id} product={product} />)}
    </div>
  </PageShell>;
}
