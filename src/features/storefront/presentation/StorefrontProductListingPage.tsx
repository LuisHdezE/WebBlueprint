import { Link } from 'react-router';
import type { StorefrontProductCardDto } from '../application/storefront.dto';
import type { StorefrontProvider } from '../application/storefront.contracts';

function ProductCard({ product }: { product: StorefrontProductCardDto }) {
  return (
    <article className="group grid overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-sm" data-storefront-listing-product-card>
      <div className="grid min-h-40 content-between bg-[#f7f2ea] p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-slate-700 shadow-sm">{product.badgeLabel}</span>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">{product.stockLabel}</span>
        </div>
        <div className="mt-10 h-20 rounded-[1.25rem] border border-black/10 bg-white/70" aria-hidden="true" />
      </div>
      <div className="grid gap-4 p-5">
        <div>
          <p className="text-lg font-black text-slate-950">{product.title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{product.subtitle}</p>
        </div>
        <div className="grid gap-1">
          <p className="text-2xl font-black tracking-[-0.03em] text-slate-950">{product.priceLabel}</p>
          {product.compareLabel ? <p className="text-xs font-bold text-slate-500">{product.compareLabel}</p> : null}
        </div>
        <p className="rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">{product.compatibilityLabel}</p>
        <Link className="rounded-full border border-black/10 px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:border-slate-950" to={product.href}>
          Ver ficha demo
        </Link>
      </div>
    </article>
  );
}

export function StorefrontProductListingPage({ provider }: { provider: StorefrontProvider }) {
  const listing = provider.getProductListingView();

  return (
    <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-8 sm:px-5 lg:px-6 lg:py-10" data-storefront-product-listing>
      <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.1em] text-slate-500">{listing.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">{listing.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">{listing.description}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white" data-storefront-listing-notice>
            <p className="text-lg font-black">{listing.listingNotice.title}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{listing.listingNotice.description}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[20rem_minmax(0,1fr)]">
        <aside className="grid gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:self-start" data-storefront-listing-filters>
          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Búsqueda visual</span>
            <input
              className="h-12 rounded-2xl border border-black/10 bg-[#f7f2ea] px-4 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-950/10"
              placeholder={listing.searchPlaceholder}
              type="search"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Orden visual</span>
            <select className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-slate-900 outline-none focus:border-slate-900">
              {listing.sortOptions.map((option) => (
                <option key={option.id}>{option.label}</option>
              ))}
            </select>
          </label>

          {listing.filters.map((filter) => (
            <fieldset key={filter.id} className="grid gap-3 border-t border-black/10 pt-4">
              <legend className="text-sm font-black text-slate-950">{filter.title}</legend>
              <div className="grid gap-2">
                {filter.options.map((option) => (
                  <label key={option.id} className="grid cursor-pointer gap-1 rounded-2xl border border-black/10 p-3 text-sm transition hover:border-slate-950">
                    <span className="flex items-center gap-2 font-bold text-slate-800">
                      <input className="size-4 accent-slate-950" name={filter.id} type="radio" />
                      {option.label}
                    </span>
                    {option.helper ? <span className="pl-6 text-xs text-slate-500">{option.helper}</span> : null}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </aside>

        <div className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">{listing.resultSummary}</p>
            <p className="text-xs font-bold text-slate-500">Filtros visuales, sin lógica aplicada todavía</p>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Listado de productos demo">
            {listing.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>

          <section className="rounded-[1.5rem] border border-dashed border-black/20 bg-white p-5" data-storefront-listing-empty-state>
            <p className="text-base font-black text-slate-950">{listing.emptyState.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{listing.emptyState.description}</p>
          </section>
        </div>
      </section>
    </div>
  );
}
