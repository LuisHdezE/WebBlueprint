import { Link, Navigate, useParams } from 'react-router';
import { getApplicationBySlug } from '@/applications/applicationRegistry';

export function ApplicationDetailPage() {
  const { slug } = useParams();
  const application = getApplicationBySlug(slug);

  if (!application) {
    return <Navigate to="/apps" replace />;
  }

  const firstDemoPage = application.demoPages[0];

  return (
    <main className="min-h-dvh bg-slate-50 px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">{application.category}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{application.name}</h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{application.summary}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {application.demoPages.map((page) => (
            <div key={page.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold">{page.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{page.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {firstDemoPage ? (
            <Link className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white" to={`/demo/${application.slug}/${firstDemoPage.path}`}>
              Launch demo
            </Link>
          ) : null}
          <Link className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold" to="/apps">
            All applications
          </Link>
        </div>
      </section>
    </main>
  );
}
