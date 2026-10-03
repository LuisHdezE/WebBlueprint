import { Link } from 'react-router';
import type { StorefrontCartLineDto } from '../application/storefront.dto';
import type { StorefrontProvider } from '../application/storefront.contracts';

interface StorefrontCartPageProps {
  provider: StorefrontProvider;
}

function CartLineCard({ line }: { line: StorefrontCartLineDto }) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm" data-storefront-cart-line>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-slate-950 text-center text-xs font-black uppercase tracking-[0.2em] text-white">
            Demo
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-600">{line.badgeLabel}</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">{line.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{line.subtitle}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1">{line.quantityLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{line.stockLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{line.compatibilityLabel}</span>
            </div>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Unidad</p>
          <p className="mt-1 text-base font-black text-slate-950">{line.unitPriceLabel}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total línea</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{line.lineTotalLabel}</p>
          <Link className="mt-4 inline-flex text-sm font-black text-orange-700" to={line.href}>
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
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_25rem] lg:px-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-700">{cart.eyebrow}</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{cart.title}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">{cart.description}</p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
              {cart.cartStateLabel}
            </span>
          </div>

          <section className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-6" data-storefront-cart-empty-state>
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Estado vacío reusable</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">{cart.emptyState.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{cart.emptyState.description}</p>
              <Link className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white" to={cart.emptyState.actionHref}>
                {cart.emptyState.actionLabel}
              </Link>
            </div>
          </section>

          <section className="mt-8 space-y-4" data-storefront-cart-lines>
            {cart.lines.map((line) => (
              <CartLineCard key={line.id} line={line} />
            ))}
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-3" data-storefront-cart-notices>
            {cart.notices.map((notice) => (
              <article key={notice.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-black text-slate-950">{notice.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{notice.description}</p>
              </article>
            ))}
          </section>
        </div>

        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" data-storefront-cart-summary>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-700">{cart.summary.title}</p>
          <dl className="mt-6 space-y-4">
            {cart.summary.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 text-sm">
                <dt className={item.tone === 'muted' ? 'font-bold text-slate-500' : 'font-bold text-slate-700'}>{item.label}</dt>
                <dd className={item.tone === 'strong' ? 'font-black text-slate-950' : 'font-black text-slate-700'}>{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex items-end justify-between gap-4">
            <p className="text-sm font-bold text-slate-500">{cart.summary.totalLabel}</p>
            <p className="text-3xl font-black text-slate-950">{cart.summary.totalValue}</p>
          </div>
          <button className="mt-6 w-full cursor-not-allowed rounded-full bg-slate-300 px-5 py-4 text-sm font-black text-slate-600" disabled type="button">
            {cart.summary.checkoutDisabledLabel}
          </button>
          <p className="mt-3 text-center text-xs font-bold text-slate-500">{cart.summary.checkoutLabel} queda para un incremento posterior.</p>
        </aside>
      </section>
    </main>
  );
}
