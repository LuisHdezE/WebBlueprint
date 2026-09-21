import { useSession } from '@/auth/useSession';
import { WorkspaceShell } from '@/shell/WorkspaceShell';

const composerCards = [
  {
    eyebrow: '01 · Application',
    title: 'Project identity',
    description: 'Name, slug and description define the application manifest and its public identity.',
  },
  {
    eyebrow: '02 · Branding',
    title: 'Theme & brand',
    description: 'Logo and design tokens adapt Style 1 without fragmenting the component library.',
  },
  {
    eyebrow: '03 · Presets',
    title: 'Start from a solution',
    description: 'Reusable definitions such as Pet Shop preselect pages, capabilities and navigation.',
  },
  {
    eyebrow: '04 · Features',
    title: 'Choose the product surface',
    description: 'Feature selection resolves the pages, components and mock-data boundaries required by the application.',
  },
  {
    eyebrow: '05 · Navigation',
    title: 'Review the left menu',
    description: 'Navigation derives from the feature registry and stays within the approved left-side shell variants.',
  },
  {
    eyebrow: '06 · Export',
    title: 'Generate the project',
    description: 'The export engine will create the reduced React application and package it as a ZIP.',
  },
] as const;

export function ComposerPage() {
  const { user, signOut } = useSession();

  return (
    <WorkspaceShell
      onSignOut={signOut}
      subtitle="Configure, review and export reusable frontend applications"
      title="App Composer"
      userName={user?.displayName}
      variant="collapsible-menu"
    >
      <section className="mx-auto max-w-[1440px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-600">Composer foundation</p>
              <h2 className="mt-1.5 max-w-3xl text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">
                Build the application from one governed configuration.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-5 text-slate-600">
                Identity, branding, presets, features, navigation, manifest generation and ZIP export will connect here incrementally.
              </p>
            </div>
            <div className="rounded-xl border border-brand-100 bg-brand-50 px-3 py-2.5 text-sm text-brand-800">
              <p className="font-semibold">{user?.displayName ?? 'Composer user'}</p>
              <p className="mt-0.5 text-[11px] text-brand-700">Authenticated workspace · mock provider</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {composerCards.map((card) => (
            <article key={card.eyebrow} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.11em] text-brand-600">{card.eyebrow}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">{card.title}</h3>
              <p className="mt-1.5 text-sm leading-5 text-slate-600">{card.description}</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/5 rounded-full bg-brand-500" />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">Foundation ready · implementation follows incrementally</p>
            </article>
          ))}
        </div>
      </section>
    </WorkspaceShell>
  );
}
