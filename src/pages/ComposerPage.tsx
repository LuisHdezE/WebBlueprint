import { Link } from 'react-router';
import { useSession } from '@/auth/useSession';

export function ComposerPage() {
  const { user, signOut } = useSession();

  return (
    <main className="min-h-dvh bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">App Composer</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Authenticated workspace foundation</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Project identity, branding, presets, features, navigation, manifest generation and ZIP export will grow here incrementally.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">{user?.displayName}</span>
            <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold" onClick={signOut} type="button">
              Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Application identity', 'Branding & theme', 'Features & navigation'].map((label) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-semibold">{label}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Foundation boundary ready for the next Composer increment.</p>
            </div>
          ))}
        </div>

        <Link className="mt-8 inline-flex text-sm font-semibold underline underline-offset-4" to="/">
          Public landing
        </Link>
      </section>
    </main>
  );
}
