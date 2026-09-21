import { useSession } from '@/auth/useSession';
import { ComposerWizard } from '@/composer/ComposerWizard';
import { WorkspaceShell } from '@/shell/WorkspaceShell';

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
        <ComposerWizard />
      </section>
    </WorkspaceShell>
  );
}
