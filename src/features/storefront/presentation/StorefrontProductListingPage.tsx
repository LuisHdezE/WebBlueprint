import { Link } from 'react-router';
import type { StorefrontProductCardDto } from '../application/storefront.dto';
import type { StorefrontProvider } from '../application/storefront.contracts';
import { StorefrontPageIntro } from './StorefrontPrimitives';

function ProductCard({ product }: { product: StorefrontProductCardDto }) {
  return (
    <article className="group grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm" data-storefront-listing-product-card>
      <div className="grid min-h-28 content-between bg-[#f7f2ea] p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-slate-700 shadow-sm">{product.badgeLabel}</span>
          <span className="rounded-full bg-[var(--storefront-primary)] px-2.5 py-1 text-[10px] font-black text-[var(--storefront-on-primary)]">{product.stockLabel}</span>
        </div>
        <img
          alt={product.image.alt}
          className="mt-3 h-28 w-full rounded-xl object-cover"
          data-storefront-listing-product-image
          src={product.image.src}
          style={{ objectPosition: product.image.objectPosition ?? 'center' }}
        />
      </div>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-base font-black text-slate-950">{product.title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{product.subtitle}</p>
        </div>
        <div className="grid gap-0.5">
          <p className="text-xl font-black tracking-[-0.03em] text-slate-950">{product.priceLabel}</p>
          {product.compareLabel ? <p className="text-[11px] font-bold text-slate-500">{product.compareLabel}</p> : null}
        </div>
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-600">{product.compatibilityLabel}</p>
        <Link className="rounded-full border border-black/10 px-4 py-2 text-center text-xs font-black text-slate-950 transition hover:border-[var(--storefront-primary)]" to={product.href}>
          Ver ficha
        </Link>
      </div>
    </article>
  );
}

export function StorefrontProductListingPage({ provider }: { provider: StorefrontProvider }) {
  const listing = provider.getProductListingView();

  return (
    <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-5 lg:px-6 lg:py-6" data-storefront-product-listing>
      <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <StorefrontPageIntro
          eyebrow={listing.eyebrow}
          title={listing.title}
          description={listing.description}
          trailing={(
            <div className="max-w-xs rounded-xl bg-slate-950 p-4 text-white" data-storefront-listing-notice>
              <p className="text-sm font-black">{listing.listingNotice.title}</p>
              <p className="mt-1.5 text-xs leading-5 text-white/70">{listing.listingNotice.description}</p>
            </div>
          )}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:self-start" data-storefront-listing-filters>
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

        <div className="grid gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm font-black text-slate-950">{listing.resultSummary}</p>
            <p className="text-[11px] font-bold text-slate-500">Filtros visuales, sin lógica aplicada todavía</p>
          </div>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Listado de productos demo">
            {listing.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>

          <section className="rounded-2xl border border-dashed border-black/20 bg-white p-4" data-storefront-listing-empty-state>
            <p className="text-sm font-black text-slate-950">{listing.emptyState.title}</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-600">{listing.emptyState.description}</p>
          </section>
        </div>
      </section>
    </div>
  );
}
