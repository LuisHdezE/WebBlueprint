import { Link } from 'react-router';
import type { StorefrontProvider } from '../application/storefront.contracts';
import { StorefrontPageIntro } from './StorefrontPrimitives';

interface StorefrontCustomerIdentityPageProps {
  provider: StorefrontProvider;
  mode: 'sign-in' | 'register';
}

export function StorefrontCustomerIdentityPage({ provider, mode }: StorefrontCustomerIdentityPageProps) {
  const identity = provider.getCustomerIdentityView();
  const panel = mode === 'sign-in' ? identity.signIn : identity.register;

  return (
    <main className="bg-[#f7f2ea]" data-storefront-customer-identity data-storefront-customer-identity-mode={mode}>
      <section className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <section>
            <StorefrontPageIntro eyebrow={identity.eyebrow} title={panel.title} description={panel.description} />

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm" data-storefront-customer-identity-form>
              <div className="grid gap-3 sm:grid-cols-2">
                {panel.fields.map((field) => (
                  <label key={field.id} className="block">
                    <span className="text-xs font-black text-slate-900">{field.label}</span>
                    <input
                      aria-label={field.label}
                      className="mt-1.5 h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 outline-none"
                      disabled
                      placeholder={field.placeholder}
                      type={field.type}
                    />
                    <span className="mt-1.5 block text-[11px] leading-4 text-slate-500">{field.helper}</span>
                  </label>
                ))}
              </div>

              <button className="mt-5 w-full cursor-not-allowed rounded-full bg-slate-300 px-4 py-2 text-[11px] font-black text-slate-600" disabled type="button">
                {panel.submitLabel}
              </button>

              <div className="mt-4 flex flex-col gap-2 text-xs font-black sm:flex-row sm:items-center sm:justify-between">
                <Link className="text-orange-700" to={panel.alternateHref}>{panel.alternateLabel}</Link>
                <Link className="text-slate-700" to={identity.returnToCheckoutHref}>{identity.returnToCheckoutLabel}</Link>
              </div>
            </div>
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm" data-storefront-customer-identity-notices>
            <p className="text-xs leading-5 text-slate-600">{identity.description}</p>
            <div className="mt-4 space-y-3">
              {identity.notices.map((notice) => (
                <article key={notice.id} className="rounded-xl bg-slate-50 p-3">
                  <h2 className="text-xs font-black text-slate-950">{notice.title}</h2>
                  <p className="mt-1.5 text-[11px] leading-4 text-slate-600">{notice.description}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
