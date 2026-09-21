import { listPublicApplications } from '@/applications/applicationRegistry';
import { ApplicationCard } from '@/components/applications/ApplicationCard';

export function ApplicationsPage() {
  const applications = listPublicApplications();

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-5 lg:px-6 lg:py-10">
      <section>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-brand-600">Applications</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.025em] text-slate-900 sm:text-4xl">Explore the application library.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Public, navigable frontend experiences that can be reused as commercial proposals and later become Composer presets.
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      </section>
    </main>
  );
}
