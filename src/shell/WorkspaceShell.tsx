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
        <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 sm:inline-flex">
          {variant}
        </span>
      }
      footer={
        <div>
          <div className={`mb-2 rounded-lg p-2.5 ${isDark ? 'bg-white/5 text-white' : 'bg-brand-50 text-slate-900'}`}>
            <p className="truncate text-sm font-semibold">{userName || 'Composer user'}</p>
            <p className={`mt-0.5 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Authenticated workspace</p>
          </div>
          <div className="grid gap-1">
            <Link className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'}`} to="/">
              Public site
            </Link>
            <button className={`rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium ${isDark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'}`} onClick={onSignOut} type="button">
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
