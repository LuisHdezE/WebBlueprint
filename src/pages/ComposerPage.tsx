import { useSession } from '@/auth/useSession';
import { WorkspaceShell } from '@/shell/WorkspaceShell';

const composerCards = [
  {
    eyebrow: '01 · Application',
    title: 'Project identity',
    description: 'Name, slug and description will define the application manifest and its public-facing identity.',
  },
  {
    eyebrow: '02 · Branding',
    title: 'Theme & brand',
    description: 'Logo and design tokens will adapt the approved Style 1 system without fragmenting the component library.',
  },
  {
    eyebrow: '03 · Presets',
    title: 'Start from a solution',
    description: 'Reusable definitions such as Pet Shop will preselect relevant pages, capabilities and navigation.',
  },
  {
    eyebrow: '04 · Features',
    title: 'Choose the product surface',
    description: 'Feature selection will resolve the pages, components and mock-data boundaries required by the generated application.',
  },
  {
    eyebrow: '05 · Navigation',
    title: 'Review the left menu',
    description: 'Navigation will derive from the same feature registry and stay within the approved left-side shell variants.',
  },
  {
    eyebrow: '06 · Export',
    title: 'Generate the project',
    description: 'The export engine will create the reduced React application and package it as a ZIP from the authenticated workspace.',
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
      <section className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">Composer foundation</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-4xl">
                Build the application from one governed configuration.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                The Composer will progressively connect application identity, branding, presets, features, navigation, manifest generation and ZIP export. This shell is already using the approved collapsible left-menu pattern.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <p className="font-semibold">Authenticated as {user?.displayName ?? 'Composer user'}</p>
              <p className="mt-1 text-xs text-blue-700">Mock session provider · replaceable boundary</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {composerCards.map((card) => (
            <article key={card.eyebrow} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600">{card.eyebrow}</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/5 rounded-full bg-blue-500" />
              </div>
              <p className="mt-2 text-xs text-slate-400">Foundation ready · implementation follows incrementally</p>
            </article>
          ))}
        </div>
      </section>
    </WorkspaceShell>
  );
}
