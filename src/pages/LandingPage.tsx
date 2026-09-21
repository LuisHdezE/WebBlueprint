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
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_58%)]" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-9 sm:px-5 sm:py-10 lg:grid-cols-[0.86fr_1.14fr] lg:px-6 lg:py-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
              Propuestas frontend · aplicaciones reutilizables · listas para exportar
            </div>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-5xl">
              Muestra la aplicación antes de que exista el backend.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              WebBlueprint convierte sistemas frontend reutilizables en demos pulidas y navegables que puedes compartir con clientes, refinar como presets y posteriormente exportar desde el Compositor de aplicaciones.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link className="inline-flex justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700" to="/apps">
                Explorar aplicaciones
              </Link>
              <Link className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50" to="/docs">
                Documentación
              </Link>
              <Link className="inline-flex justify-center rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50" to="/login">
                Entrar al Compositor →
              </Link>
            </div>

            <div className="mt-6 grid max-w-xl grid-cols-3 gap-3 border-t border-slate-200 pt-4">
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-900">1 URL</p>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">Comparte una propuesta al instante</p>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-900">Mock primero</p>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">No requiere backend</p>
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-900">Reutilizable</p>
                <p className="mt-0.5 text-[11px] leading-4 text-slate-500">Cada demo útil puede permanecer</p>
              </div>
            </div>
          </div>

          {featuredApplication ? (
            <div className="relative lg:pl-2">
              <div className="absolute -inset-5 rounded-[2rem] bg-brand-100/45 blur-3xl" />
              <div className="relative rounded-2xl border border-brand-100 bg-white p-2.5 shadow-lg shadow-brand-100/40 sm:p-3">
                <div className="mb-2 flex items-center justify-between gap-3 px-1.5 py-0.5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-600">Demo destacada</p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-900">{featuredApplication.name}</p>
                  </div>
                  <Link className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700" to={`/demo/${featuredApplication.slug}/${featuredApplication.demoPages[0]?.path ?? ''}`}>
                    Abrir demo
                  </Link>
                </div>
                <ApplicationPreview application={featuredApplication} />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-5 lg:px-6 lg:py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand-600">Aplicaciones</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Frontends realistas listos para explorar.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Una sola definición reutilizable puede alimentar la presentación pública, la demo navegable y el futuro preset del Compositor.
            </p>
          </div>
          <Link className="text-sm font-semibold text-brand-700 hover:text-brand-800" to="/apps">
            Ver todas las aplicaciones →
          </Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {promotedApplications.slice(0, 3).map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-5 px-4 py-9 sm:px-5 md:grid-cols-3 lg:px-6">
          {[
            ['01', 'Compón la idea', 'Parte de una aplicación o selecciona las páginas y capacidades que encajan con la solicitud.'],
            ['02', 'Comparte la experiencia', 'Publica una URL responsive para que el cliente pueda navegar directamente por el frontend propuesto.'],
            ['03', 'Conviértela en proyecto', 'Reutiliza la misma definición en el Compositor y evolúcionala hacia una aplicación React exportable.'],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700">{number}</span>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-5 lg:px-6">
        <div className="rounded-2xl border border-brand-100 bg-brand-600 px-5 py-6 text-white sm:px-7 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-100">Documentación viva</p>
            <h2 className="mt-1.5 max-w-2xl text-2xl font-semibold tracking-tight">Entiende el sistema que hay detrás de cada demo.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-5 text-blue-50">
              Los componentes, reglas responsive y decisiones de producto se documentan a medida que pasan a formar parte de WebBlueprint.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 lg:mt-0 lg:shrink-0">
            <Link className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-700" to="/docs">Documentación</Link>
            <Link className="rounded-lg border border-white/35 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10" to="/components">Componentes</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
