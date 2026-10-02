import { SurfaceCard } from '@/components/layout/SurfaceCard';
import { PageShell } from '@/shell/PageShell';
import type { EcommerceCatalogProvider } from '../application/ecommerce.contracts';
import { ProductCard } from './ProductCard';
import { ProductStatus } from './ProductStatus';

export function ProductDetailPage({ catalogProvider }: { catalogProvider: EcommerceCatalogProvider }) {
  const products = catalogProvider.getProducts();
  const view = catalogProvider.getProductDetailView();
  const product = products.find((item) => item.id === view.productId);
  if (!product) throw new Error('Configured detail product is unavailable.');
  const related = products.filter((item) => item.id !== product.id && item.status !== 'Borrador').slice(0, 3);

  return <PageShell breadcrumbs={view.breadcrumbs.map((label) => ({ label }))} description={view.description} title={view.title}>
    <SurfaceCard>
      <article className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,.95fr)]" data-product-detail>
        <div className="flex min-h-72 items-center justify-center rounded-2xl bg-slate-100 text-7xl font-semibold text-slate-300">{product.name.slice(0, 1)}</div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2"><ProductStatus status={product.status} />{product.featured ? <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{view.featuredLabel}</span> : null}</div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">{view.categoryLabel}: {product.category}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{product.name}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{product.summary}</p>
          <strong className="mt-5 text-2xl text-slate-950">{product.price}</strong>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-slate-200 p-3"><dt className="text-xs text-slate-400">{view.skuLabel}</dt><dd className="mt-1 font-medium text-slate-800">{product.sku}</dd></div>
            <div className="rounded-xl border border-slate-200 p-3"><dt className="text-xs text-slate-400">{view.stockLabel}</dt><dd className="mt-1 font-medium text-slate-800">{product.stock}</dd></div>
          </dl>
        </div>
      </article>
    </SurfaceCard>
    <section className="mt-6" aria-labelledby="related-products-title">
      <h2 className="text-base font-semibold text-slate-900" id="related-products-title">{view.relatedProductsLabel}</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-related-products>
        {related.map((item) => <ProductCard featuredLabel={view.featuredLabel} key={item.id} product={item} />)}
      </div>
    </section>
  </PageShell>;
}
