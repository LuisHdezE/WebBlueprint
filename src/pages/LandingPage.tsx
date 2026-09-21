import { Link } from 'react-router';
import { listPublicApplications } from '@/applications/applicationRegistry';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { ApplicationPreview } from '@/components/applications/ApplicationPreview';

export function LandingPage() {
  const promotedApplications = listPublicApplications();
  const featuredApplication = promotedApplications[0];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 -z-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_55%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
              Frontend proposals · reusable applications · export-ready direction
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
              Show the application before the backend exists.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              WebBlueprint turns reusable frontend systems into polished, navigable application demos you can share with prospects, refine into presets and later export through the App Composer.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800" to="/apps">
                Explore applications
              </Link>
              <Link className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50" to="/docs">
                Read documentation
              </Link>
              <Link className="inline-flex justify-center rounded-xl px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50" to="/login">
                Enter App Composer →
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">1 URL</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Share a proposal instantly</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">Mock-first</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">No backend required for the demo</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">Reusable</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">Each useful demo enriches the library</p>
              </div>
            </div>
          </div>

          {featuredApplication ? (
            <div className="relative lg:pl-6">
              <div className="absolute -inset-8 -z-0 rounded-[3rem] bg-blue-100/50 blur-3xl" />
              <div className="relative rounded-[2rem] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70 sm:p-4">
                <div className="mb-3 flex items-center justify-between px-2 py-1">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">Featured demo</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950">{featuredApplication.name}</p>
                  </div>
                  <Link className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700" to={`/demo/${featuredApplication.slug}/${featuredApplication.demoPages[0]?.path ?? ''}`}>
                    Open demo
                  </Link>
                </div>
                <ApplicationPreview application={featuredApplication} />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Applications</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Realistic frontends ready to explore.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Each application is a reusable definition that can power a public presentation, a shareable demo and eventually a Composer preset.
            </p>
          </div>
          <Link className="text-sm font-semibold text-blue-700 hover:text-blue-800" to="/apps">
            View all applications →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {promotedApplications.slice(0, 3).map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-20">
          <div>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">01</span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">Compose the idea</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Start from an existing application or select the pages and capabilities that match a client request.</p>
          </div>
          <div>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">02</span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">Share the experience</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">Publish a stable, responsive demo URL so a prospect can navigate the proposed frontend directly.</p>
          </div>
          <div>
            <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">03</span>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">Turn it into a project</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">When the proposal moves forward, reuse the same definition inside the Composer and evolve it toward an exportable React application.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">Living documentation</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight">Understand the system behind every demo.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Components, patterns, responsive rules and product decisions are documented as they become part of WebBlueprint.
            </p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <Link className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950" to="/docs">Open documentation</Link>
            <Link className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10" to="/components">Component library</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
