import { Link } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';

interface StorefrontCustomerIdentityPageProps {
  provider: StorefrontProvider;
  mode: 'sign-in' | 'register';
}

export function StorefrontCustomerIdentityPage({ provider, mode }: StorefrontCustomerIdentityPageProps) {
  const identity = provider.getCustomerIdentityView();
  const panel = mode === 'sign-in' ? identity.signIn : identity.register;

  return (
    <main className="bg-[#f7f2ea]" data-storefront-customer-identity data-storefront-customer-identity-mode={mode}>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:items-start">
          <section>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-700">{identity.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{panel.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">{panel.description}</p>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" data-storefront-customer-identity-form>
              <div className="grid gap-5">
                {panel.fields.map((field) => (
                  <label key={field.id} className="block">
                    <span className="text-sm font-black text-slate-900">{field.label}</span>
                    <input
                      aria-label={field.label}
                      className="mt-2 w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                      disabled
                      placeholder={field.placeholder}
                      type={field.type}
                    />
                    <span className="mt-2 block text-xs leading-5 text-slate-500">{field.helper}</span>
                  </label>
                ))}
              </div>

              <button className="mt-6 w-full cursor-not-allowed rounded-full bg-slate-300 px-5 py-4 text-sm font-black text-slate-600" disabled type="button">
                {panel.submitLabel}
              </button>

              <div className="mt-5 flex flex-col gap-3 text-sm font-black sm:flex-row sm:items-center sm:justify-between">
                <Link className="text-orange-700" to={panel.alternateHref}>{panel.alternateLabel}</Link>
                <Link className="text-slate-700" to={identity.returnToCheckoutHref}>{identity.returnToCheckoutLabel}</Link>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm" data-storefront-customer-identity-notices>
            <p className="text-sm leading-6 text-slate-600">{identity.description}</p>
            <div className="mt-6 space-y-4">
              {identity.notices.map((notice) => (
                <article key={notice.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <h2 className="text-sm font-black text-slate-950">{notice.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{notice.description}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
