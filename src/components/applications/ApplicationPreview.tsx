import type { ApplicationDefinition } from '@/applications/application.types';

type ApplicationPreviewProps = {
  application: ApplicationDefinition;
  compact?: boolean;
};

export function ApplicationPreview({ application, compact = false }: ApplicationPreviewProps) {
  const visiblePages = application.demoPages.slice(0, compact ? 4 : 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <div className="ml-2 h-6 flex-1 rounded-md bg-slate-100" />
      </div>

      <div className={`grid ${compact ? 'min-h-56 grid-cols-[72px_1fr]' : 'min-h-72 grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr]'}`}>
        <aside className="border-r border-slate-200 bg-slate-950 p-3 text-white">
          <div className="mb-4 grid size-8 place-items-center rounded-lg bg-blue-500 text-[10px] font-bold">{application.name.slice(0, 2).toUpperCase()}</div>
          <div className="grid gap-2">
            {visiblePages.map((page, index) => (
              <div key={page.id} className={`h-6 rounded-md ${index === 0 ? 'bg-white/18' : 'bg-white/8'}`}>
                <span className="sr-only">{page.label}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="bg-slate-50 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="h-2.5 w-20 rounded-full bg-blue-200" />
              <div className="mt-2 h-5 w-32 max-w-full rounded-md bg-slate-800" />
            </div>
            <div className="size-8 rounded-full bg-white shadow-sm ring-1 ring-slate-200" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className={`${item === 2 ? 'hidden sm:block' : ''} rounded-xl border border-slate-200 bg-white p-3 shadow-sm`}>
                <div className="h-2 w-12 rounded-full bg-slate-200" />
                <div className="mt-3 h-5 w-16 rounded-md bg-slate-700" />
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-24 rounded-full bg-slate-300" />
              <div className="h-6 w-14 rounded-md bg-blue-50" />
            </div>
            <div className="mt-4 grid gap-2">
              {[0, 1, 2].map((item) => (
                <div key={item} className="grid grid-cols-[1fr_52px] items-center gap-3 border-t border-slate-100 pt-2 first:border-0 first:pt-0">
                  <div className="h-2.5 rounded-full bg-slate-100" />
                  <div className="h-5 rounded-md bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
