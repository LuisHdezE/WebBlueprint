import { Link } from 'react-router';
import type { ApplicationDefinition } from '@/applications/application.types';
import { ApplicationPreview } from '@/components/applications/ApplicationPreview';

type ApplicationCardProps = {
  application: ApplicationDefinition;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-3">
        <ApplicationPreview application={application} compact />
      </div>
      <div className="p-6 pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">{application.category}</p>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Live demo</span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{application.name}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{application.summary}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {application.capabilities.slice(0, 4).map((capability) => (
            <span key={capability} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {capability}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-4">
          <Link className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800" to={`/apps/${application.slug}`}>
            View application
          </Link>
          <Link className="text-sm font-semibold text-blue-700 hover:text-blue-800" to={`/demo/${application.slug}/${application.demoPages[0]?.path ?? ''}`}>
            Open demo →
          </Link>
        </div>
      </div>
    </article>
  );
}
