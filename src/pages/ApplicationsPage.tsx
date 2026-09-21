import { Link } from 'react-router';
import { listPublicApplications } from '@/applications/applicationRegistry';

export function ApplicationsPage() {
  const applications = listPublicApplications();

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Applications</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Navigable product concepts</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Each entry can be explored as a public frontend demo and later reused as a Composer preset.
            </p>
          </div>
          <Link className="text-sm font-semibold underline underline-offset-4" to="/">
            Back to landing
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <article key={application.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">{application.category}</p>
              <h2 className="mt-3 text-2xl font-semibold">{application.name}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{application.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {application.capabilities.map((capability) => (
                  <span key={capability} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {capability}
                  </span>
                ))}
              </div>
              <Link className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4" to={`/apps/${application.slug}`}>
                Open presentation
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
