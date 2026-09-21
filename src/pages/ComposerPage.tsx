import { useSession } from '@/auth/useSession';
import { ComposerWizard } from '@/composer/ComposerWizard';
import { ComposerExportPanel } from '@/export/ComposerExportPanel';
import { WorkspaceShell } from '@/shell/WorkspaceShell';

export function ComposerPage() {
  const { user, signOut } = useSession();

  return (
    <WorkspaceShell
      onSignOut={signOut}
      subtitle="Configura, revisa y exporta aplicaciones frontend reutilizables"
      title="Compositor de aplicaciones"
      userName={user?.displayName}
      variant="collapsible-menu"
    >
      <section className="mx-auto max-w-[1440px]">
        <ComposerWizard />
        <ComposerExportPanel />
      </section>
    </WorkspaceShell>
  );
}
