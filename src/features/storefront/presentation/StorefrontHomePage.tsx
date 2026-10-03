import { Link } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';
import type { StorefrontCategoryCardDto, StorefrontProductCardDto } from '../application/storefront.dto';

function ctaClassName(variant: 'primary' | 'secondary') {
  return variant === 'primary'
    ? 'bg-slate-950 text-white hover:bg-slate-800'
    : 'border border-black/10 bg-white text-slate-950 hover:border-slate-950';
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}

function CategoryCard({ category }: { category: StorefrontCategoryCardDto }) {
  return (
    <Link
      className="group grid min-h-56 content-between rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-950 hover:shadow-md"
      to={category.href}
    >
      <span>
        <span className="rounded-full bg-[#f7f2ea] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-600">
          {category.eyebrow}
        </span>
        <span className="mt-4 block text-xl font-black tracking-[-0.02em] text-slate-950">{category.title}</span>
        <span className="mt-2 block text-sm leading-6 text-slate-600">{category.description}</span>
      </span>
      <span className="mt-5 flex items-center justify-between gap-3 text-sm font-black text-slate-950">
        <span>{category.itemCountLabel}</span>
        <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

function ProductCard({ product }: { product: StorefrontProductCardDto }) {
  return (
    <article className="grid rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm" data-storefront-product-card>
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-slate-950 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white">
          {product.badgeLabel}
        </span>
        <span className="text-right text-xs font-bold text-slate-500">{product.stockLabel}</span>
      </div>
      <div className="mt-16 rounded-[1.25rem] bg-[#f7f2ea] p-4">
        <p className="text-xs font-bold text-slate-500">{product.compatibilityLabel}</p>
        <h3 className="mt-2 text-lg font-black tracking-[-0.02em] text-slate-950">{product.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{product.subtitle}</p>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-black text-slate-950">{product.priceLabel}</p>
          {product.compareLabel ? <p className="mt-1 text-xs font-semibold text-slate-500">{product.compareLabel}</p> : null}
        </div>
        <Link className="rounded-full border border-black/10 px-4 py-2 text-sm font-black text-slate-950 transition hover:border-slate-950" to={product.href}>
          Ver
        </Link>
      </div>
    </article>
  );
}

export function StorefrontHomePage({ provider }: { provider: StorefrontProvider }) {
  const home = provider.getHomeView();

  return (
    <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-8 sm:px-5 lg:px-6 lg:py-12" data-storefront-home>
      <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_26rem]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-black uppercase tracking-[0.1em] text-slate-500">{home.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              {home.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{home.description}</p>

            <label className="mt-7 block max-w-2xl" aria-label="Buscar productos en la tienda demo">
              <span className="sr-only">Buscar productos</span>
              <input
                className="h-14 w-full rounded-2xl border border-black/10 bg-[#f7f2ea] px-5 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-950/10"
                placeholder={home.primarySearchPlaceholder}
                type="search"
              />
            </label>

            <div className="mt-6 flex flex-wrap gap-3">
              {home.ctas.map((cta) => (
                <Link key={cta.href} className={`rounded-full px-5 py-3 text-sm font-black transition ${ctaClassName(cta.variant)}`} to={cta.href}>
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>

          <aside className="grid content-end bg-slate-950 p-6 text-white sm:p-8 lg:p-10" aria-label="Estado de tienda demo">
            <div className="grid gap-3">
              {home.trustMetrics.map((metric) => (
                <div key={metric.id} className="rounded-3xl bg-white/10 p-4">
                  <p className="text-3xl font-black">{metric.value}</p>
                  <p className="mt-1 text-sm text-white/70">{metric.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="Base Storefront B1">
        {home.featureTiles.map((tile) => (
          <article key={tile.id} className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-lg font-black text-slate-950">{tile.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{tile.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5" data-storefront-category-section>
        <SectionHeader {...home.categorySection} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {home.categorySection.categories.map((category) => <CategoryCard key={category.id} category={category} />)}
        </div>
      </section>

      <section className="grid gap-5" data-storefront-product-section>
        <SectionHeader {...home.productSection} />
        <div className="grid gap-4 md:grid-cols-3">
          {home.productSection.products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8 lg:p-10" data-storefront-promo-band>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/50">{home.promoBand.eyebrow}</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">{home.promoBand.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">{home.promoBand.description}</p>
          </div>
          <Link className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-[#f7f2ea]" to={home.promoBand.actionHref}>
            {home.promoBand.actionLabel}
          </Link>
        </div>
      </section>
    </div>
  );
}
