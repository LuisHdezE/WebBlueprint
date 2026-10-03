import type { StorefrontProvider } from '../application/storefront.contracts';
import { StorefrontPageIntro } from './StorefrontPrimitives';
import { StorefrontProductCard } from './StorefrontProductCard';

export function StorefrontProductListingPage({ provider }: { provider: StorefrontProvider }) {
  const listing = provider.getProductListingView();

  return (
    <div className="mx-auto grid max-w-[1440px] gap-3 px-4 py-3 sm:px-5 lg:px-6 lg:py-4" data-storefront-product-listing>
      <section className="rounded-xl border border-black/10 bg-white p-3 shadow-sm">
        <StorefrontPageIntro
          eyebrow={listing.eyebrow}
          title={listing.title}
          description={listing.description}
          trailing={(
            <div className="max-w-xs rounded-xl bg-slate-950 p-3 text-white" data-storefront-listing-notice>
              <p className="text-sm font-black">{listing.listingNotice.title}</p>
              <p className="mt-1.5 text-[11px] leading-4 text-white/70">{listing.listingNotice.description}</p>
            </div>
          )}
        />
      </section>

      <section className="grid gap-3 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="grid gap-3 rounded-xl border border-black/10 bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:self-start" data-storefront-listing-filters>
          <label className="grid gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">Búsqueda visual</span>
            <input
              className="h-10 rounded-xl border border-black/10 bg-[#f7f2ea] px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--storefront-primary)] focus:ring-4 focus:ring-[var(--storefront-primary-soft)]"
              placeholder={listing.searchPlaceholder}
              type="search"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-500">Orden visual</span>
            <select className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm font-bold text-slate-900 outline-none focus:border-[var(--storefront-primary)]">
              {listing.sortOptions.map((option) => (
                <option key={option.id}>{option.label}</option>
              ))}
            </select>
          </label>

          {listing.filters.map((filter) => (
            <fieldset key={filter.id} className="grid gap-2 border-t border-black/10 pt-3">
              <legend className="text-sm font-black text-slate-950">{filter.title}</legend>
              <div className="grid gap-1.5">
                {filter.options.map((option) => (
                  <label key={option.id} className="grid cursor-pointer gap-0.5 rounded-xl border border-black/10 p-2.5 text-xs transition hover:border-[var(--storefront-primary)]">
                    <span className="flex items-center gap-2 font-bold text-slate-800">
                      <input className="size-3.5 accent-slate-950" name={filter.id} type="radio" />
                      {option.label}
                    </span>
                    {option.helper ? <span className="pl-5.5 text-[11px] leading-4 text-slate-500">{option.helper}</span> : null}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </aside>

        <div className="grid gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-black text-slate-950">{listing.resultSummary}</p>
            <p className="text-[11px] font-bold text-slate-500">Filtros visuales, sin lógica aplicada todavía</p>
          </div>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Listado de productos demo">
            {listing.products.map((product) => (
              <StorefrontProductCard key={product.id} context="listing" product={product} />
            ))}
          </section>

          <section className="rounded-xl border border-dashed border-black/20 bg-white p-3" data-storefront-listing-empty-state>
            <p className="text-sm font-black text-slate-950">{listing.emptyState.title}</p>
            <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{listing.emptyState.description}</p>
          </section>
        </div>
      </section>
    </div>
  );
}
