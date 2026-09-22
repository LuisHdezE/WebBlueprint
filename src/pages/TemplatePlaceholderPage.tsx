import { useLocation } from 'react-router';
import { findNavigationItem, findNavigationSection } from '@/config/templateNavigation';
import { PageShell, PendingViewCard } from '@/shell/PageShell';

export function TemplatePlaceholderPage() {
  const location = useLocation();
  const item = findNavigationItem(location.pathname);
  const section = findNavigationSection(location.pathname);
  const title = item?.label ?? 'Vista del Blueprint';
  const sectionLabel = section?.label ?? 'Blueprint';

  return (
    <PageShell
      breadcrumbs={[{ label: sectionLabel }, { label: title }]}
      description="Esta superficie ya está registrada en la navegación maestra y se completará cuando llegue su turno en el roadmap visual."
      title={title}
    >
      <PendingViewCard />
      <div className="mt-3 rounded-md border border-dashed border-[var(--theme-primary-border)] bg-[var(--theme-primary-soft)]/55 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--theme-primary)]">Ruta registrada</p>
        <code className="mt-1 block text-[11px] text-slate-600">{location.pathname}</code>
      </div>
    </PageShell>
  );
}
