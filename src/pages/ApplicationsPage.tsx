import { listPublicApplications } from '@/applications/applicationRegistry';
import { ApplicationCard } from '@/components/applications/ApplicationCard';

export function ApplicationsPage() {
  const applications = listPublicApplications();

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
      <section>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">Applications</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">Explore the application library.</h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            These are public, navigable frontend experiences. Each one can be reused as a commercial proposal, promoted here when useful and later become a Composer preset.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      </section>
    </main>
  );
}
