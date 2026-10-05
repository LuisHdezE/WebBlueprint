import { Link } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';
import { formatStorefrontMoney, resolveStorefrontShippingQuote } from '../application/storefront.shipping';
import { StorefrontPageIntro } from './StorefrontPrimitives';
import { useStorefrontShipping } from './useStorefrontShipping';

export function StorefrontShippingPage({ provider }: { provider: StorefrontProvider }) {
  const shipping = provider.getShippingView();
  const { selection, selectPickup, selectZone } = useStorefrontShipping();
  const quote = resolveStorefrontShippingQuote(shipping, selection);

  const optionClassName = (selected: boolean) => `w-full rounded-full border px-3 py-2 text-[11px] font-black transition-colors ${
    selected
      ? 'border-[var(--storefront-primary)] bg-[var(--storefront-primary)] text-[var(--storefront-on-primary)]'
      : 'border-[var(--storefront-primary)] bg-white text-[var(--storefront-primary-strong)]'
  }`;

  return (
    <main className="bg-[#f7f2ea]" data-storefront-shipping>
      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <StorefrontPageIntro
          eyebrow={shipping.eyebrow}
          title={shipping.title}
          description={shipping.description}
          trailing={(
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
              {shipping.stateLabel}
            </span>
          )}
        />

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid gap-3">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" data-storefront-shipping-zones>
              {shipping.zones.map((zone) => {
                const selected = selection?.method === 'delivery' && selection.zoneId === zone.id;

                return (
                  <article key={zone.id} className="rounded-xl border border-black/10 bg-white p-3 shadow-sm">
                    <span className="inline-flex rounded-full bg-[var(--storefront-primary-soft)] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-[var(--storefront-primary-strong)]">
                      {zone.coverageLabel}
                    </span>
                    <h2 className="mt-3 text-sm font-black text-slate-950">{zone.name}</h2>
                    <p className="mt-1.5 min-h-12 text-[11px] leading-4 text-slate-600">{zone.description}</p>
                    <p className="mt-3 text-base font-black text-slate-950">
                      {formatStorefrontMoney(zone.price.currencyCode, zone.price.amountMinor)}
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-slate-500">{zone.etaLabel}</p>
                    <button
                      aria-pressed={selected}
                      className={`mt-3 ${optionClassName(selected)}`}
                      data-storefront-shipping-option={zone.id}
                      data-storefront-shipping-selected={selected ? 'true' : 'false'}
                      onClick={() => selectZone(zone.id)}
                      type="button"
                    >
                      {selected ? 'Zona seleccionada' : 'Seleccionar zona'}
                    </button>
                  </article>
                );
              })}
            </section>

            <section className="rounded-xl border border-[var(--storefront-primary)] bg-[var(--storefront-primary-soft)] p-3" data-storefront-shipping-pickup>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-950">{shipping.pickup.title}</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-600">{shipping.pickup.description}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-lg font-black text-[var(--storefront-primary-strong)]">
                    {formatStorefrontMoney(shipping.pickup.price.currencyCode, shipping.pickup.price.amountMinor)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500">{shipping.pickup.etaLabel}</p>
                </div>
              </div>
              <button
                aria-pressed={selection?.method === 'pickup'}
                className={`mt-3 ${optionClassName(selection?.method === 'pickup')}`}
                data-storefront-shipping-option={shipping.pickup.id}
                data-storefront-shipping-selected={selection?.method === 'pickup' ? 'true' : 'false'}
                onClick={selectPickup}
                type="button"
              >
                {selection?.method === 'pickup' ? 'Retiro seleccionado' : 'Elegir retiro en tienda'}
              </button>
            </section>

            <section className="rounded-xl border border-black/10 bg-white p-3 shadow-sm" data-storefront-shipping-address>
              <h2 className="text-base font-black text-slate-950">{shipping.addressPreview.title}</h2>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{shipping.addressPreview.description}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {shipping.addressPreview.fields.map((field) => (
                  <label key={field.id} className="block">
                    <span className="text-[11px] font-black text-slate-700">{field.label}</span>
                    <input
                      className="mt-1.5 h-10 w-full cursor-not-allowed rounded-xl border border-black/10 bg-slate-50 px-3 text-xs text-slate-500"
                      disabled
                      placeholder={field.placeholder}
                      type="text"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-3" data-storefront-shipping-notices>
              {shipping.notices.map((notice) => (
                <article key={notice.id} className="rounded-xl border border-black/10 bg-white p-3 shadow-sm">
                  <h2 className="text-xs font-black text-slate-950">{notice.title}</h2>
                  <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{notice.description}</p>
                </article>
              ))}
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-black/10 bg-white p-3 shadow-sm lg:sticky lg:top-24" data-storefront-shipping-summary>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--storefront-primary-strong)]">Cálculo B17</p>
            <p className="mt-3 text-sm font-black text-slate-950" data-storefront-shipping-selection-summary>
              {quote ? quote.title : 'Selecciona una modalidad'}
            </p>
            <p className="mt-2 text-[11px] leading-4 text-slate-600">
              {quote ? quote.description : 'La tarifa elegida viajará al checkout en memoria React. Recargar la página reinicia la selección.'}
            </p>
            <p className="mt-3 text-lg font-black text-slate-950" data-storefront-shipping-selection-cost>
              {quote ? formatStorefrontMoney(quote.currencyCode, quote.amountMinor) : 'Costo pendiente'}
            </p>
            {quote ? <p className="mt-1 text-[10px] font-bold text-slate-500">{quote.etaLabel}</p> : null}
            <Link className="mt-4 flex w-full items-center justify-center rounded-full bg-[var(--storefront-primary)] px-4 py-2 text-[11px] font-black text-[var(--storefront-on-primary)]" to={shipping.returnToCheckoutHref}>
              {shipping.returnToCheckoutLabel}
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
