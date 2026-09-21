import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { LeftAppShell } from '@/shell/LeftAppShell';
import type { LeftMenuVariant } from '@/shell/shell.types';

type WorkspaceShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  userName?: string | undefined;
  onSignOut: () => void;
  variant?: LeftMenuVariant;
};

const composerSections = [
  { id: 'overview', label: 'Resumen' },
  { id: 'application', label: 'Aplicación' },
  { id: 'branding', label: 'Marca' },
  { id: 'presets', label: 'Presets' },
  { id: 'features', label: 'Funciones' },
  { id: 'navigation', label: 'Navegación' },
  { id: 'review', label: 'Revisión' },
  { id: 'export', label: 'Exportación' },
] as const;

export function WorkspaceShell({
  children,
  title,
  subtitle,
  userName,
  onSignOut,
  variant = 'collapsible-menu',
}: WorkspaceShellProps) {
  const isDark = variant === 'vertical-dark-menu';
  const navItems = composerSections.map((section, index) => ({
    id: section.id,
    label: section.label,
    href: '/composer',
    isActive: index === 0,
  }));

  return (
    <LeftAppShell
      brandInitials="WB"
      brandName="WebBlueprint"
      brandSubtitle="Compositor de aplicaciones"
      navItems={navItems}
      subtitle={subtitle}
      title={title}
      variant={variant}
      topbarActions={
        <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 sm:inline-flex">
          {variant}
        </span>
      }
      footer={
        <div>
          <div className={`mb-2 rounded-lg p-2.5 ${isDark ? 'bg-white/5 text-white' : 'bg-brand-50 text-slate-900'}`}>
            <p className="truncate text-sm font-semibold">{userName || 'Usuario del Compositor'}</p>
            <p className={`mt-0.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Espacio autenticado</p>
          </div>
          <div className="grid gap-1">
            <Link className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'}`} to="/">
              Sitio público
            </Link>
            <button className={`rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'}`} onClick={onSignOut} type="button">
              Cerrar sesión
            </button>
          </div>
        </div>
      }
    >
      {children}
    </LeftAppShell>
  );
}
