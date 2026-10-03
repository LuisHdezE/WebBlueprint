import { Link } from 'react-router';
import type { StorefrontCartLineDto } from '../application/storefront.dto';
import type { StorefrontProvider } from '../application/storefront.contracts';
import { StorefrontPageIntro } from './StorefrontPrimitives';

interface StorefrontCartPageProps {
  provider: StorefrontProvider;
}

function CartLineCard({ line }: { line: StorefrontCartLineDto }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" data-storefront-cart-line>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--storefront-primary)] text-center text-[10px] font-black uppercase tracking-[0.14em] text-[var(--storefront-on-primary)]">
            Demo
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">{line.badgeLabel}</p>
            <h2 className="mt-1 text-base font-black text-slate-950">{line.title}</h2>
            <p className="mt-1 text-xs text-slate-600">{line.subtitle}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-bold text-slate-600">
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{line.quantityLabel}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{line.stockLabel}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{line.compatibilityLabel}</span>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Unidad</p>
          <p className="mt-0.5 text-sm font-black text-slate-950">{line.unitPriceLabel}</p>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Total línea</p>
          <p className="mt-0.5 text-lg font-black text-slate-950">{line.lineTotalLabel}</p>
          <Link className="mt-2 inline-flex text-xs font-black text-orange-700" to={line.href}>
            Ver ficha
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StorefrontCartPage({ provider }: StorefrontCartPageProps) {
  const cart = provider.getCartView();

  return (
    <main className="bg-[#f7f2ea]" data-storefront-cart>
      <section className="mx-auto grid max-w-7xl gap-3 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8 lg:py-4">
        <div>
          <StorefrontPageIntro
            eyebrow={cart.eyebrow}
            title={cart.title}
            description={cart.description}
            trailing={(
              <span className="inline-flex w-fit rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700">
                {cart.cartStateLabel}
              </span>
            )}
          />

          <section className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white/70 p-3" data-storefront-cart-empty-state>
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Estado vacío reusable</p>
              <h2 className="mt-1 text-base font-black text-slate-950">{cart.emptyState.title}</h2>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{cart.emptyState.description}</p>
              <Link className="mt-3 inline-flex rounded-full bg-[var(--storefront-primary)] px-3 py-1.5 text-[11px] font-black text-[var(--storefront-on-primary)]" to={cart.emptyState.actionHref}>
                {cart.emptyState.actionLabel}
              </Link>
            </div>
          </section>

          <section className="mt-4 space-y-3" data-storefront-cart-lines>
            {cart.lines.map((line) => (
              <CartLineCard key={line.id} line={line} />
            ))}
          </section>

          <section className="mt-4 grid gap-3 sm:grid-cols-3" data-storefront-cart-notices>
            {cart.notices.map((notice) => (
              <article key={notice.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <h2 className="text-xs font-black text-slate-950">{notice.title}</h2>
                <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{notice.description}</p>
              </article>
            ))}
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24" data-storefront-cart-summary>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-700">{cart.summary.title}</p>
          <dl className="mt-4 space-y-3">
            {cart.summary.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
                <dt className={item.tone === 'muted' ? 'font-bold text-slate-500' : 'font-bold text-slate-700'}>{item.label}</dt>
                <dd className={item.tone === 'strong' ? 'font-black text-slate-950' : 'font-black text-slate-700'}>{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-xs font-bold text-slate-500">{cart.summary.totalLabel}</p>
            <p className="text-2xl font-black text-slate-950">{cart.summary.totalValue}</p>
          </div>
          <button className="mt-4 w-full cursor-not-allowed rounded-full bg-slate-300 px-4 py-2 text-[11px] font-black text-slate-600" disabled type="button">
            {cart.summary.checkoutDisabledLabel}
          </button>
          <p className="mt-2 text-center text-[11px] font-bold text-slate-500">{cart.summary.checkoutLabel} queda para un incremento posterior.</p>
          <Link className="mt-3 flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-[11px] font-black text-slate-900" to={cart.summary.checkoutPreviewHref}>
            {cart.summary.checkoutPreviewLabel}
          </Link>
        </aside>
      </section>
    </main>
  );
}
