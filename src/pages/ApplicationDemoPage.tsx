import { Link, Navigate, useParams } from 'react-router';
import { getApplicationBySlug, getCapabilityLabel } from '@/applications/applicationRegistry';
import type { ApplicationDefinition, DemoPageDefinition } from '@/applications/application.types';
import { CustomerDirectoryView } from '@/customers/CustomerDirectoryView';
import { DashboardView } from '@/dashboard/DashboardView';
import { ProductCatalogView } from '@/products/ProductCatalogView';
import { LeftAppShell } from '@/shell/LeftAppShell';

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

  const navItems = application.demoPages.map((page) => ({
    id: page.id,
    label: page.label,
    href: `/demo/${application.slug}/${page.path}`,
    isActive: page.id === activePage.id,
  }));

  return (
    <LeftAppShell
      brandInitials={application.name.slice(0, 2).toUpperCase()}
      brandName={application.name}
      brandSubtitle="Demo frontend interactiva"
      navItems={navItems}
      subtitle={activePage.description}
      title={activePage.label}
      variant={application.shellVariant}
      topbarActions={
        <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 sm:inline-flex">
          Demo · datos simulados
        </span>
      }
      footer={
        <div className="grid gap-1">
          <Link className="rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700" to={`/apps/${application.slug}`}>
            Resumen de la aplicación
          </Link>
          <Link className="rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700" to="/">
            WebBlueprint
          </Link>
        </div>
      }
    >
      <section className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">{application.name} · demo pública</p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">{activePage.label}</h2>
            <p className="mt-1.5 max-w-3xl text-sm leading-5 text-slate-600">{activePage.description}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-500 shadow-sm">
            Ruta compartible
            <p className="mt-0.5 font-mono font-semibold text-slate-700">/demo/{application.slug}/{activePage.path}</p>
          </div>
        </div>

        <div className="mt-4">
          {activePage.pageKey === 'dashboard' ? (
            <DashboardView />
          ) : activePage.pageKey === 'product-catalog-admin' ? (
            <ProductCatalogView />
          ) : activePage.pageKey === 'customers' ? (
            <CustomerDirectoryView />
          ) : (
            <GenericDemoWorkspace application={application} activePage={activePage} />
          )}
        </div>
      </section>
    </LeftAppShell>
  );
}

function GenericDemoWorkspace({
  application,
  activePage,
}: {
  application: ApplicationDefinition;
  activePage: DemoPageDefinition;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Registros activos', '1.248', '+8,2%'],
          ['Pendientes', '38', 'Necesita revisión'],
          ['Hoy', '126', '+12 nuevos'],
          ['Completado', '94%', 'Saludable'],
        ].map(([label, value, note]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-[11px] font-medium text-slate-500">{label}</p>
            <p className="mt-1.5 text-xl font-semibold tracking-tight text-slate-900">{value}</p>
            <p className="mt-1 text-[11px] font-medium text-emerald-600">{note}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="font-semibold text-slate-900">Espacio de trabajo · {activePage.label}</h3>
              <p className="mt-0.5 text-[11px] text-slate-500">Superficie de contenido representativa para la demo de la propuesta.</p>
            </div>
            <span className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-[11px] font-semibold text-brand-700">Vista previa</span>
          </div>
          <div className="overflow-x-auto p-4">
            <div className="min-w-[34rem]">
              <div className="grid grid-cols-[1.4fr_1fr_0.7fr_0.6fr] gap-3 border-b border-slate-100 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                <span>Elemento</span><span>Contexto</span><span>Estado</span><span>Actualizado</span>
              </div>
              {[0, 1, 2, 3, 4].map((row) => (
                <div key={row} className="grid grid-cols-[1.4fr_1fr_0.7fr_0.6fr] items-center gap-3 border-b border-slate-100 py-3 last:border-0">
                  <div>
                    <div className="h-2.5 w-28 rounded-full bg-slate-200" />
                    <div className="mt-1.5 h-2 w-16 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-2.5 w-20 rounded-full bg-slate-100" />
                  <span className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${row % 2 === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {row % 2 === 0 ? 'Activo' : 'Revisar'}
                  </span>
                  <div className="h-2.5 w-12 rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">Estado de la propuesta</p>
          <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900">Solo experiencia frontend</h3>
          <p className="mt-1.5 text-sm leading-5 text-slate-600">
            Esta demo comunica navegación, estructura y comportamiento visible. Los datos de dominio son simulados y la implementación de backend/API queda deliberadamente fuera de esta etapa.
          </p>
          <div className="mt-3 grid gap-1.5">
            {application.capabilities.map((capability) => (
              <div key={capability} className="flex items-center gap-2 rounded-lg bg-brand-50/60 px-2.5 py-2 text-sm text-slate-700">
                <span className="size-1.5 rounded-full bg-brand-500" />
                {getCapabilityLabel(capability)}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
