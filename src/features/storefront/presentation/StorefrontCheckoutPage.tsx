import { Link } from 'react-router';
import { deriveStorefrontCart, getInitialCartQuantities } from '../application/storefront.cart';
import type { StorefrontProvider } from '../application/storefront.contracts';
import { deriveCheckoutPayment } from '../application/storefront.payment';
import {
  deriveStorefrontCheckoutPricing,
  formatStorefrontMoney,
  resolveStorefrontShippingQuote,
} from '../application/storefront.shipping';
import { useStorefrontPayment } from './payment-context';
import { StorefrontPageIntro } from './StorefrontPrimitives';
import { useStorefrontSession } from './useStorefrontSession';
import { useStorefrontShipping } from './useStorefrontShipping';

interface StorefrontCheckoutPageProps {
  provider: StorefrontProvider;
}

export function StorefrontCheckoutPage({ provider }: StorefrontCheckoutPageProps) {
  const checkout = provider.getCheckoutView();
  const cartView = provider.getCartView();
  const paymentView = provider.getPaymentView();
  const shippingView = provider.getShippingView();
  const { customer } = useStorefrontSession();
  const { selectedPaymentMethodId, selectPaymentMethod } = useStorefrontPayment();
  const { selection } = useStorefrontShipping();

  const cart = deriveStorefrontCart(cartView.lines, getInitialCartQuantities(cartView.lines));
  const checkoutPayment = deriveCheckoutPayment(paymentView, selectedPaymentMethodId);
  const shippingQuote = resolveStorefrontShippingQuote(shippingView, selection);
  const pricing = deriveStorefrontCheckoutPricing(cart, shippingQuote);
  const totalValue = pricing.currencyCode && pricing.totalMinor !== undefined
    ? formatStorefrontMoney(pricing.currencyCode, pricing.totalMinor)
    : 'No disponible';
  const paymentFeeValue = checkoutPayment.currencyCode && checkoutPayment.feeMinor !== undefined
    ? formatStorefrontMoney(checkoutPayment.currencyCode, checkoutPayment.feeMinor)
    : 'Pendiente';
  const shippingCost = shippingQuote
    ? formatStorefrontMoney(shippingQuote.currencyCode, shippingQuote.amountMinor)
    : 'Pendiente';

  const shippingFieldValue = (fieldId: string, fallback: string) => {
    if (!shippingQuote) return fallback;
    if (fieldId === 'department') return shippingQuote.coverageLabel ?? 'Retiro en tienda';
    if (fieldId === 'zone') return shippingQuote.title;
    if (fieldId === 'delivery') return shippingQuote.method === 'pickup' ? 'Retiro en tienda' : 'Envío por zona';
    return fallback;
  };

  return (
    <main className="bg-[#f7f2ea]" data-storefront-checkout>
      <section className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <StorefrontPageIntro
          eyebrow={checkout.eyebrow}
          title={checkout.title}
          description={checkout.description}
          trailing={(
            <span className="inline-flex w-fit rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700">
              {checkout.stateLabel}
            </span>
          )}
        />

        <section className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-3 sm:p-5" data-storefront-checkout-auth-gate data-storefront-checkout-authenticated={customer ? 'true' : 'false'}>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-700">{customer ? checkout.authGate.authenticatedEyebrow : checkout.authGate.eyebrow}</p>
          <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <h2 className="text-lg font-black text-slate-950">{customer ? checkout.authGate.authenticatedTitle : checkout.authGate.title}</h2>
              <p className="mt-1.5 max-w-3xl text-[11px] leading-4 text-slate-700">{customer ? checkout.authGate.authenticatedDescription : checkout.authGate.description}</p>
              <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-orange-800">
                {customer ? checkout.authGate.authenticatedLabel : checkout.authGate.requiredLabel}
              </p>
              {customer ? <p className="mt-2 text-[10px] font-bold text-slate-600" data-storefront-checkout-customer>{customer.name} · {customer.email}</p> : null}
            </div>
            {!customer ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link className="rounded-full bg-[var(--storefront-primary)] px-4 py-2.5 text-center text-xs font-black text-[var(--storefront-on-primary)]" to={checkout.authGate.signInHref}>
                  {checkout.authGate.signInLabel}
                </Link>
                <Link className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-center text-xs font-black text-slate-800" to={checkout.authGate.signUpHref}>
                  {checkout.authGate.signUpLabel}
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" data-storefront-checkout-shipping>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-950">{checkout.shipping.title}</h2>
                  <p className="mt-1.5 max-w-2xl text-[11px] leading-4 text-slate-600">{checkout.shipping.description}</p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600">
                  {shippingQuote ? `Seleccionado · ${shippingCost}` : checkout.shipping.statusLabel}
                </span>
              </div>
              <Link className="mt-3 inline-flex rounded-full border border-[var(--storefront-primary)] px-3 py-2 text-[11px] font-black text-[var(--storefront-primary-strong)]" to={checkout.shipping.actionHref}>
                {shippingQuote ? 'Cambiar modalidad o zona' : checkout.shipping.actionLabel}
              </Link>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {checkout.shipping.fields.map((field) => (
                  <article key={field.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{field.label}</p>
                    <p className="mt-1.5 text-sm font-black text-slate-950">{shippingFieldValue(field.id, field.value)}</p>
                    <p className="mt-1.5 text-[11px] leading-4 text-slate-500">{field.helper}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" data-storefront-checkout-payment>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-700">{paymentView.eyebrow}</p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">{paymentView.title}</h2>
                  <p className="mt-1.5 max-w-2xl text-[11px] leading-4 text-slate-600">{paymentView.description}</p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600" data-storefront-payment-status>
                  {checkoutPayment.statusLabel ?? paymentView.stateLabel}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {paymentView.methods.map((method) => {
                  const selected = method.id === checkoutPayment.methodId;
                  return (
                    <button
                      key={method.id}
                      aria-pressed={selected}
                      className={`rounded-xl border p-3 text-left transition ${selected ? 'border-[var(--storefront-primary)] bg-orange-50 shadow-sm' : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/40'} ${method.enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                      data-storefront-payment-method={method.id}
                      data-storefront-payment-selected={selected ? 'true' : 'false'}
                      disabled={!method.enabled}
                      onClick={() => selectPaymentMethod(method.id)}
                      type="button"
                    >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-black text-slate-950">{method.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-slate-500">{selected ? 'Seleccionado' : method.statusLabel}</span>
                    </div>
                    <p className="mt-2 text-[11px] leading-4 text-slate-600">{method.description}</p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                      Comisión demo · {formatStorefrontMoney(method.fee.currencyCode, method.fee.amountMinor)}
                    </p>
                    </button>
                  );
                })}
              </div>
              {checkoutPayment.paymentEnabled ? null : (
                <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3" data-storefront-payment-disabled-notice>
                  <h3 className="text-xs font-black text-orange-900">{paymentView.disabledNotice.title}</h3>
                  <p className="mt-1 text-[11px] leading-4 text-orange-800">{paymentView.disabledNotice.description}</p>
                </div>
              )}
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {paymentView.notices.map((notice) => (
                  <article key={notice.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <h3 className="text-[11px] font-black text-slate-950">{notice.title}</h3>
                    <p className="mt-1 text-[10px] leading-4 text-slate-600">{notice.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-3" data-storefront-checkout-notices>
              {checkout.notices.map((notice) => (
                <article key={notice.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <h2 className="text-xs font-black text-slate-950">{notice.title}</h2>
                  <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{notice.description}</p>
                </article>
              ))}
            </section>
          </div>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24" data-storefront-checkout-summary>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-700">{checkout.orderSummary.title}</p>
            <dl className="mt-4 space-y-3">
              {checkout.orderSummary.lines.filter((line) => line.id !== 'shipping').map((line) => (
                <div key={line.id} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
                  <dt className="font-bold text-slate-600">{line.label}</dt>
                  <dd className="shrink-0 font-black text-slate-950">{line.value}</dd>
                </div>
              ))}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 text-xs" data-storefront-checkout-shipping-cost>
                <dt className="font-bold text-slate-600">{shippingQuote?.title ?? 'Envío según zona'}</dt>
                <dd className="shrink-0 font-black text-slate-950">{shippingCost}</dd>
              </div>
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 text-xs" data-storefront-checkout-payment-summary>
                <dt className="font-bold text-slate-600">{checkoutPayment.summaryLabel ?? 'Método de pago pendiente'}</dt>
                <dd className="shrink-0 font-black text-slate-950">{paymentFeeValue}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-xs font-bold text-slate-500">
                {pricing.shippingSelected ? 'Total demo con entrega' : 'Subtotal demo · entrega pendiente'}
              </p>
              <p className="text-2xl font-black text-slate-950" data-storefront-checkout-total>{totalValue}</p>
            </div>
            {pricing.hasCurrencyMismatch ? (
              <p className="mt-2 text-[10px] font-bold text-red-700">No se suman monedas diferentes.</p>
            ) : null}
            <button className="mt-4 w-full cursor-not-allowed rounded-full bg-slate-300 px-4 py-2 text-[11px] font-black text-slate-600" disabled type="button">
              Confirmar compra pendiente
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
