import { Link } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';

function ctaClassName(variant: 'primary' | 'secondary') {
  return variant === 'primary'
    ? 'bg-slate-950 text-white hover:bg-slate-800'
    : 'border border-black/10 bg-white text-slate-950 hover:border-slate-950';
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
    </div>
  );
}
