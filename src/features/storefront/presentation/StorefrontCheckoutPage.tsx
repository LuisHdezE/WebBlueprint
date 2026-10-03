import type { StorefrontProvider } from '../application/storefront.contracts';

interface StorefrontCheckoutPageProps {
  provider: StorefrontProvider;
}

export function StorefrontCheckoutPage({ provider }: StorefrontCheckoutPageProps) {
  const checkout = provider.getCheckoutView();

  return (
    <main className="bg-[#f7f2ea]" data-storefront-checkout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-700">{checkout.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{checkout.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700">{checkout.description}</p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
            {checkout.stateLabel}
          </span>
        </div>

        <section className="mt-8 rounded-[2rem] border border-orange-200 bg-orange-50 p-6 sm:p-8" data-storefront-checkout-auth-gate>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-700">{checkout.authGate.eyebrow}</p>
          <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 className="text-2xl font-black text-slate-950">{checkout.authGate.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{checkout.authGate.description}</p>
              <p className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-800">
                {checkout.authGate.requiredLabel}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="cursor-not-allowed rounded-full bg-slate-300 px-5 py-3 text-sm font-black text-slate-600" disabled type="button">
                {checkout.authGate.signInLabel}
              </button>
              <button className="cursor-not-allowed rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-500" disabled type="button">
                {checkout.authGate.signUpLabel}
              </button>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-8">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" data-storefront-checkout-shipping>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">{checkout.shipping.title}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{checkout.shipping.description}</p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-600">{checkout.shipping.statusLabel}</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {checkout.shipping.fields.map((field) => (
                  <article key={field.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{field.label}</p>
                    <p className="mt-2 text-base font-black text-slate-950">{field.value}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">{field.helper}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" data-storefront-checkout-payment>
              <h2 className="text-2xl font-black text-slate-950">{checkout.payment.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{checkout.payment.description}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {checkout.payment.options.map((option) => (
                  <article key={option.id} className="rounded-[1.5rem] border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-black text-slate-950">{option.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-slate-500">{option.statusLabel}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{option.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-3" data-storefront-checkout-notices>
              {checkout.notices.map((notice) => (
                <article key={notice.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-black text-slate-950">{notice.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{notice.description}</p>
                </article>
              ))}
            </section>
          </div>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" data-storefront-checkout-summary>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-700">{checkout.orderSummary.title}</p>
            <dl className="mt-6 space-y-4">
              {checkout.orderSummary.lines.map((line) => (
                <div key={line.id} className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 text-sm">
                  <dt className="font-bold text-slate-600">{line.label}</dt>
                  <dd className="shrink-0 font-black text-slate-950">{line.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="text-sm font-bold text-slate-500">{checkout.orderSummary.totalLabel}</p>
              <p className="text-3xl font-black text-slate-950">{checkout.orderSummary.totalValue}</p>
            </div>
            <button className="mt-6 w-full cursor-not-allowed rounded-full bg-slate-300 px-5 py-4 text-sm font-black text-slate-600" disabled type="button">
              Confirmar compra pendiente
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
