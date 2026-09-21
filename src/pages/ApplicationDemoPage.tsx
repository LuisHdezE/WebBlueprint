import { Link, Navigate, useParams } from 'react-router';
import { getApplicationBySlug } from '@/applications/applicationRegistry';
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
      brandSubtitle="Interactive frontend demo"
      navItems={navItems}
      subtitle={activePage.description}
      title={activePage.label}
      variant={application.shellVariant}
      topbarActions={
        <span className="hidden rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 sm:inline-flex">
          Demo · mock data
        </span>
      }
      footer={
        <div className="grid gap-1">
          <Link className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950" to={`/apps/${application.slug}`}>
            Application overview
          </Link>
          <Link className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950" to="/">
            WebBlueprint
          </Link>
        </div>
      }
    >
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">{application.name} · public demo</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-4xl">{activePage.label}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{activePage.description}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
            Shareable route
            <p className="mt-1 font-mono font-semibold text-slate-700">/demo/{application.slug}/{activePage.path}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Active records', '1,248', '+8.2%'],
            ['Open items', '38', 'Needs review'],
            ['Today', '126', '+12 new'],
            ['Completion', '94%', 'Healthy'],
          ].map(([label, value, note]) => (
            <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
              <p className="mt-2 text-xs font-medium text-emerald-600">{note}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h3 className="font-semibold text-slate-950">{activePage.label} workspace</h3>
                <p className="mt-1 text-xs text-slate-500">Representative content surface for the proposal demo.</p>
              </div>
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">Preview</span>
            </div>
            <div className="overflow-x-auto p-5 sm:p-6">
              <div className="min-w-[34rem]">
                <div className="grid grid-cols-[1.4fr_1fr_0.7fr_0.6fr] gap-4 border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                  <span>Item</span><span>Context</span><span>Status</span><span>Updated</span>
                </div>
                {[0, 1, 2, 3, 4].map((row) => (
                  <div key={row} className="grid grid-cols-[1.4fr_1fr_0.7fr_0.6fr] items-center gap-4 border-b border-slate-100 py-4 last:border-0">
                    <div>
                      <div className="h-3 w-32 rounded-full bg-slate-200" />
                      <div className="mt-2 h-2.5 w-20 rounded-full bg-slate-100" />
                    </div>
                    <div className="h-3 w-24 rounded-full bg-slate-100" />
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${row % 2 === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {row % 2 === 0 ? 'Active' : 'Review'}
                    </span>
                    <div className="h-3 w-14 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Proposal status</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Frontend experience only</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This public demo communicates navigation, structure and visible product behavior. Domain data is mock and backend/API implementation is intentionally outside this demo stage.
            </p>
            <div className="mt-6 grid gap-3">
              {application.capabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                  <span className="size-2 rounded-full bg-blue-500" />
                  {capability}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </LeftAppShell>
  );
}
