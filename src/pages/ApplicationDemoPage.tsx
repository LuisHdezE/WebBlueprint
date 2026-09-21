import { Link, Navigate, useParams } from 'react-router';
import { getApplicationBySlug } from '@/applications/applicationRegistry';

export function ApplicationDemoPage() {
  const { slug, '*': requestedPath } = useParams();
  const application = getApplicationBySlug(slug);

  if (!application) {
    return <Navigate to="/apps" replace />;
  }

  const activePage =
    application.demoPages.find((page) => page.path === requestedPath) ?? application.demoPages[0];

  if (!activePage) {
    return <Navigate to={`/apps/${application.slug}`} replace />;
  }

  return (
    <main className="min-h-dvh bg-slate-100 text-slate-950">
      <div className="mx-auto flex min-h-dvh max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white p-4 lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Demo</p>
              <h1 className="mt-1 text-xl font-semibold">{application.name}</h1>
            </div>
            <Link className="text-xs font-semibold underline underline-offset-4" to={`/apps/${application.slug}`}>
              Overview
            </Link>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-8 lg:flex-col lg:overflow-visible">
            {application.demoPages.map((page) => {
              const isActive = page.id === activePage.id;

              return (
                <Link
                  key={page.id}
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                  to={`/demo/${application.slug}/${page.path}`}
                >
                  {page.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 p-4 sm:p-6 lg:p-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">{activePage.label}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Frontend demo workspace</h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">{activePage.description}</p>
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
              This route is now shareable and navigable. The real page implementation will replace this placeholder when its reusable components are introduced through the governed catalog.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
