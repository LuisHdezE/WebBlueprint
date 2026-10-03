import { Link } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';
import type { StorefrontCategoryCardDto, StorefrontProductCardDto } from '../application/storefront.dto';
import { StorefrontSectionIntro, storefrontSurfaceClass } from './StorefrontPrimitives';

function ctaClassName(variant: 'primary' | 'secondary') {
  return variant === 'primary'
    ? 'bg-slate-950 text-white hover:bg-slate-800'
    : 'border border-black/10 bg-white text-slate-950 hover:border-slate-950';
}

function CategoryCard({ category }: { category: StorefrontCategoryCardDto }) {
  return (
    <Link
      className="group grid min-h-40 content-between rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-950 hover:shadow-md"
      to={category.href}
    >
      <span>
        <span className="rounded-full bg-[#f7f2ea] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-slate-600">
          {category.eyebrow}
        </span>
        <span className="mt-3 block text-base font-black tracking-[-0.02em] text-slate-950">{category.title}</span>
        <span className="mt-1.5 block text-xs leading-5 text-slate-600">{category.description}</span>
      </span>
      <span className="mt-3 flex items-center justify-between gap-3 text-xs font-black text-slate-950">
        <span>{category.itemCountLabel}</span>
        <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

function ProductCard({ product }: { product: StorefrontProductCardDto }) {
  return (
    <article className="grid rounded-2xl border border-black/10 bg-white p-4 shadow-sm" data-storefront-product-card>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white">
          {product.badgeLabel}
        </span>
        <span className="text-right text-[11px] font-bold text-slate-500">{product.stockLabel}</span>
      </div>
      <div className="mt-4 rounded-xl bg-[#f7f2ea] p-3">
        <p className="text-[11px] font-bold text-slate-500">{product.compatibilityLabel}</p>
        <h3 className="mt-1.5 text-base font-black tracking-[-0.02em] text-slate-950">{product.title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-600">{product.subtitle}</p>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xl font-black text-slate-950">{product.priceLabel}</p>
          {product.compareLabel ? <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{product.compareLabel}</p> : null}
        </div>
        <Link className="rounded-full border border-black/10 px-3 py-2 text-xs font-black text-slate-950 transition hover:border-slate-950" to={product.href}>
          Ver
        </Link>
      </div>
    </article>
  );
}

export function StorefrontHomePage({ provider }: { provider: StorefrontProvider }) {
  const home = provider.getHomeView();

  return (
    <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-5 sm:px-5 lg:px-6 lg:py-6" data-storefront-home>
      <section className={`${storefrontSurfaceClass} overflow-hidden`}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="p-5 sm:p-6 lg:p-7">
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">{home.eyebrow}</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {home.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{home.description}</p>

            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <label className="block max-w-2xl" aria-label="Buscar productos en la tienda demo">
                <span className="sr-only">Buscar productos</span>
                <input
                  className="h-10 w-full rounded-xl border border-black/10 bg-[#f7f2ea] px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-950/10"
                  placeholder={home.primarySearchPlaceholder}
                  type="search"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {home.ctas.map((cta) => (
                  <Link key={cta.href} className={`rounded-full px-4 py-2 text-xs font-black transition ${ctaClassName(cta.variant)}`} to={cta.href}>
                    {cta.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="grid content-center bg-slate-950 p-4 text-white sm:p-5" aria-label="Estado de tienda demo">
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              {home.trustMetrics.map((metric) => (
                <div key={metric.id} className="rounded-xl bg-white/10 p-3">
                  <p className="text-lg font-black">{metric.value}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-white/70">{metric.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3" aria-label="Base Storefront B1">
        {home.featureTiles.map((tile) => (
          <article key={tile.id} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-sm font-black text-slate-950">{tile.title}</p>
            <p className="mt-1.5 text-xs leading-5 text-slate-600">{tile.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-3" data-storefront-category-section>
        <StorefrontSectionIntro {...home.categorySection} />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {home.categorySection.categories.map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
      </section>

      <section className="grid gap-3" data-storefront-product-section>
        <StorefrontSectionIntro {...home.productSection} />
        <div className="grid gap-3 md:grid-cols-3">
          {home.productSection.products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="rounded-2xl bg-slate-950 p-5 text-white sm:p-6" data-storefront-promo-band>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.14em] text-white/50">{home.promoBand.eyebrow}</p>
            <h2 className="mt-1.5 max-w-3xl text-xl font-black tracking-[-0.03em] sm:text-2xl">{home.promoBand.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{home.promoBand.description}</p>
          </div>
          <Link className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-[#f7f2ea]" to={home.promoBand.actionHref}>
            {home.promoBand.actionLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
