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
  'Overview',
  'Application',
  'Branding',
  'Presets',
  'Features',
  'Navigation',
  'Review',
  'Export',
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
    id: section.toLowerCase().replaceAll(' ', '-'),
    label: section,
    href: '/composer',
    isActive: index === 0,
  }));

  return (
    <LeftAppShell
      brandInitials="WB"
      brandName="WebBlueprint"
      brandSubtitle="App Composer"
      navItems={navItems}
      subtitle={subtitle}
      title={title}
      variant={variant}
      topbarActions={
        <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 sm:inline-flex">
          {variant}
        </span>
      }
      footer={
        <div>
          <div className={`mb-3 rounded-xl p-3 ${isDark ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-950'}`}>
            <p className="truncate text-sm font-semibold">{userName || 'Composer user'}</p>
            <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Authenticated workspace</p>
          </div>
          <div className="grid gap-1">
            <Link className={`rounded-xl px-3 py-2 text-sm font-medium ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`} to="/">
              Public site
            </Link>
            <button className={`rounded-xl px-3 py-2 text-left text-sm font-medium ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`} onClick={onSignOut} type="button">
              Sign out
            </button>
          </div>
        </div>
      }
    >
      {children}
    </LeftAppShell>
  );
}
