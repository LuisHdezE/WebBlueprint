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
    <main className="min-h-dvh bg-slate-50 px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Private workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Access App Composer</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          U0.2 uses a replaceable mock session provider. Real identity can be introduced later without coupling authentication to the Composer pages.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label className="text-sm font-medium" htmlFor="display-name">
            Display name
          </label>
          <input
            id="display-name"
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
            required
            value={displayName}
          />
          <button className="mt-4 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white" type="submit">
            Continue to Composer
          </button>
        </form>

        <Link className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4" to="/">
          Return to public landing
        </Link>
      </section>
    </main>
  );
}
