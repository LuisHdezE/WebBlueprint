import { Link, Navigate, useParams } from 'react-router';
import { getApplicationBySlug, getCapabilityLabel } from '@/applications/applicationRegistry';
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
        <div className="mx-auto grid max-w-[1440px] items-center gap-7 px-4 py-8 sm:px-5 lg:grid-cols-[0.8fr_1.2fr] lg:px-6 lg:py-10">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-700">{application.category}</span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Demo pública</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-4xl">{application.name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{application.summary}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {application.capabilities.map((capability) => (
                <span key={capability} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                  {getCapabilityLabel(capability)}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {firstDemoPage ? (
                <Link className="inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700" to={`/demo/${application.slug}/${firstDemoPage.path}`}>
                  Abrir demo navegable
                </Link>
              ) : null}
              <Link className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-200 hover:bg-brand-50" to="/apps">
                Explorar aplicaciones
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-2.5 shadow-lg shadow-brand-100/30 sm:p-3">
            <ApplicationPreview application={application} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 lg:px-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand-600">Dentro de la demo</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Una propuesta que realmente puedes navegar.</h2>
            <p className="mt-2 text-sm leading-5 text-slate-600">
              Los datos simulados pueden ocupar el lugar del backend mientras la navegación, la arquitectura de información y el comportamiento responsive comunican claramente el producto.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {application.demoPages.map((page, index) => (
              <article key={page.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-7 place-items-center rounded-lg bg-brand-50 text-[11px] font-semibold text-brand-700">{String(index + 1).padStart(2, '0')}</span>
                  <Link className="text-xs font-semibold text-brand-700" to={`/demo/${application.slug}/${page.path}`}>Vista previa →</Link>
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{page.label}</h3>
                <p className="mt-1.5 text-sm leading-5 text-slate-600">{page.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
