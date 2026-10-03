import { Link } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';
import { StorefrontPageIntro } from './StorefrontPrimitives';
import { StorefrontProductCard } from './StorefrontProductCard';

export function StorefrontFavoritesPage({ provider }: { provider: StorefrontProvider }) {
  const favorites = provider.getFavoritesView();

  return (
    <main className="bg-[#f7f2ea]" data-storefront-favorites>
      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <StorefrontPageIntro
          eyebrow={favorites.eyebrow}
          title={favorites.title}
          description={favorites.description}
          trailing={(
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
              {favorites.stateLabel}
            </span>
          )}
        />

        <section className="mt-5 rounded-xl border border-dashed border-black/15 bg-white/70 p-3" data-storefront-favorites-empty-state>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-950">{favorites.emptyState.title}</h2>
              <p className="mt-1 text-[11px] leading-4 text-slate-600">{favorites.emptyState.description}</p>
            </div>
            <Link className="inline-flex w-fit rounded-full bg-[var(--storefront-primary)] px-4 py-2 text-xs font-black text-[var(--storefront-on-primary)]" to={favorites.emptyState.actionHref}>
              {favorites.emptyState.actionLabel}
            </Link>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-storefront-favorites-products>
          {favorites.products.map((product) => (
            <StorefrontProductCard key={product.id} context="listing" product={product} />
          ))}
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-3" data-storefront-favorites-notices>
          {favorites.notices.map((notice) => (
            <article key={notice.id} className="rounded-xl border border-black/10 bg-white p-3 shadow-sm">
              <h2 className="text-xs font-black text-slate-950">{notice.title}</h2>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{notice.description}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
