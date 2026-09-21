import { Link, Navigate, useParams } from 'react-router';
import { getApplicationBySlug } from '@/applications/applicationRegistry';
import { ApplicationPreview } from '@/components/applications/ApplicationPreview';

export function ApplicationDetailPage() {
  const { slug } = useParams();
  const application = getApplicationBySlug(slug);

  if (!application) {
    return <Navigate to="/apps" replace />;
  }

  const firstDemoPage = application.demoPages[0];

  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">{application.category}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Public demo</span>
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">{application.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">{application.summary}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {application.capabilities.map((capability) => (
                <span key={capability} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  {capability}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {firstDemoPage ? (
                <Link className="inline-flex justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800" to={`/demo/${application.slug}/${firstDemoPage.path}`}>
                  Launch navigable demo
                </Link>
              ) : null}
              <Link className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" to="/apps">
                Browse applications
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-3 shadow-xl shadow-slate-200/60 sm:p-4">
            <ApplicationPreview application={application} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Inside the demo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">A proposal you can actually navigate.</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The pages below define the visible application experience. During this phase the data may be mock, while navigation, information architecture and responsive behavior represent the proposal honestly.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {application.demoPages.map((page, index) => (
              <article key={page.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">{String(index + 1).padStart(2, '0')}</span>
                  <Link className="text-xs font-semibold text-blue-700" to={`/demo/${application.slug}/${page.path}`}>Preview →</Link>
                </div>
                <h3 className="mt-4 font-semibold text-slate-950">{page.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
