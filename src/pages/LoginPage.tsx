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
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8 lg:py-20">
      <section className="rounded-[2rem] bg-slate-950 p-7 text-white sm:p-10 lg:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">Private workspace</p>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Enter the workspace that turns demos into applications.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
          The public site is for discovery and navigable proposals. The App Composer is where authenticated users configure branding, presets, features, navigation and eventually export the generated React project.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            'Choose an application preset',
            'Adjust branding and theme',
            'Select features and pages',
            'Generate the application ZIP',
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="self-center rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="grid size-11 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">WB</div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">App Composer</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sign in to continue</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          U0.2 uses a replaceable mock session provider. The login flow and protected-route boundary are real product structure; production identity will replace only the adapter.
        </p>

        <form className="mt-7" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-800" htmlFor="display-name">
            Display name
          </label>
          <input
            id="display-name"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            required
            value={displayName}
          />
          <button className="mt-4 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800" type="submit">
            Continue to App Composer
          </button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <Link className="text-sm font-semibold text-blue-700 hover:text-blue-800" to="/">
            ← Return to public site
          </Link>
        </div>
      </section>
    </main>
  );
}
