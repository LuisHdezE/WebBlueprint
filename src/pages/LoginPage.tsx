import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useSession } from '@/auth/useSession';

export function LoginPage() {
  const [displayName, setDisplayName] = useState('');
  const { signIn } = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = (location.state as { from?: string } | null)?.from ?? '/composer';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signIn(displayName);
    navigate(destination, { replace: true });
  }

  return (
    <main className="mx-auto grid max-w-[1240px] gap-5 px-4 py-8 sm:px-5 lg:grid-cols-[1fr_0.72fr] lg:px-6 lg:py-10">
      <section className="rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:p-6 lg:p-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-700">Private workspace</p>
        <h1 className="mt-2.5 max-w-xl text-3xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-4xl">
          Turn a navigable demo into a configurable application.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
          The public site is for discovery and proposals. The App Composer is where authenticated users configure branding, presets, features, navigation and export.
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {[
            'Choose an application preset',
            'Adjust branding and theme',
            'Select features and pages',
            'Generate the application ZIP',
          ].map((item) => (
            <div key={item} className="rounded-xl border border-brand-100 bg-white/80 px-3 py-2.5 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="self-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid size-9 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">WB</div>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">App Composer</p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">Sign in to continue</h2>
        <p className="mt-2 text-sm leading-5 text-slate-600">
          U0.2 uses a replaceable mock session provider. Production identity can replace the adapter without changing this UI flow.
        </p>

        <form className="mt-5" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-800" htmlFor="display-name">
            Display name
          </label>
          <input
            id="display-name"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            required
            value={displayName}
          />
          <button className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700" type="submit">
            Continue to App Composer
          </button>
        </form>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <Link className="text-sm font-semibold text-brand-700 hover:text-brand-800" to="/">
            ← Return to public site
          </Link>
        </div>
      </section>
    </main>
  );
}
