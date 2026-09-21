import { Link } from 'react-router';
import { listPublicApplications } from '@/applications/applicationRegistry';

export function LandingPage() {
  const promotedApplications = listPublicApplications();

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:p-14">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">WebBlueprint</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Explore application ideas before the backend exists.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Public, navigable frontend demos make it possible to understand a proposed product, its pages and
          its user experience before implementation moves into APIs and infrastructure.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white" to="/apps">
            Explore applications
          </Link>
          <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold" to="/docs">
            Documentation
          </Link>
          <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold" to="/login">
            App Composer access
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {promotedApplications.map((application) => (
          <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">{application.category}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{application.name}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{application.summary}</p>
            <Link className="mt-6 inline-flex text-sm font-semibold text-slate-950 underline underline-offset-4" to={`/apps/${application.slug}`}>
              View application
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
