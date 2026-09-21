import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { LeftMenuVariant } from '@/shell/shell.types';

export type LeftAppShellNavItem = {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
};

type LeftAppShellProps = {
  brandName: string;
  brandSubtitle?: string | undefined;
  brandInitials: string;
  children: ReactNode;
  navItems: readonly LeftAppShellNavItem[];
  title: string;
  subtitle?: string | undefined;
  variant?: LeftMenuVariant;
  footer?: ReactNode;
  topbarActions?: ReactNode;
};

export function LeftAppShell({
  brandName,
  brandSubtitle,
  brandInitials,
  children,
  navItems,
  title,
  subtitle,
  variant = 'collapsible-menu',
  footer,
  topbarActions,
}: LeftAppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isDark = variant === 'vertical-dark-menu';
  const canCollapse = variant === 'collapsible-menu';
  const collapsed = canCollapse && isCollapsed;

  const sidebarSurface = isDark
    ? 'border-slate-800 bg-slate-900 text-white'
    : 'border-slate-200 bg-white text-slate-900';
  const sidebarMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inactiveItem = isDark
    ? 'text-slate-300 hover:bg-white/10 hover:text-white'
    : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700';

  const sidebarContent = (
    <>
      <div className={`flex h-14 items-center border-b px-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <Link className="flex min-w-0 items-center gap-2.5" to={navItems[0]?.href ?? '/'} aria-label={`${brandName} home`}>
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-600 text-[10px] font-bold text-white">
            {brandInitials}
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{brandName}</span>
              {brandSubtitle ? <span className={`block truncate text-[10px] ${sidebarMuted}`}>{brandSubtitle}</span> : null}
            </span>
          ) : null}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2.5" aria-label={`${brandName} navigation`}>
        <div className="grid gap-1">
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              className={`flex min-h-9 items-center rounded-lg px-2.5 text-[13px] font-medium transition ${
                item.isActive
                  ? isDark
                    ? 'bg-brand-500/15 text-blue-200'
                    : 'bg-brand-50 text-brand-700'
                  : inactiveItem
              } ${collapsed ? 'justify-center px-2' : 'gap-2.5'}`}
              title={collapsed ? item.label : undefined}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
            >
              <span className={`grid size-5.5 shrink-0 place-items-center rounded-md text-[9px] font-semibold ${item.isActive ? 'bg-brand-600 text-white' : isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          ))}
        </div>
      </nav>

      {footer ? <div className={`border-t p-2.5 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>{footer}</div> : null}
    </>
  );

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r transition-[width] duration-200 lg:flex lg:flex-col ${sidebarSurface} ${collapsed ? 'w-16' : 'w-60'}`}>
        {sidebarContent}
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={`${brandName} navigation`}>
          <button className="absolute inset-0 bg-slate-900/35" aria-label="Close navigation" onClick={() => setIsMobileOpen(false)} type="button" />
          <aside className={`relative flex h-full w-[min(16rem,84vw)] flex-col border-r shadow-2xl ${sidebarSurface}`}>
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      <div className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-16' : 'lg:pl-60'}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-14 items-center gap-2.5 px-3.5 sm:px-5 lg:px-6">
            <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm lg:hidden" onClick={() => setIsMobileOpen(true)} type="button">
              Menu
            </button>
            {canCollapse ? (
              <button className="hidden rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:border-brand-100 hover:bg-brand-50 hover:text-brand-700 lg:inline-flex" onClick={() => setIsCollapsed((value) => !value)} type="button">
                {collapsed ? 'Expand' : 'Collapse'}
              </button>
            ) : null}

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-slate-900">{title}</h1>
              {subtitle ? <p className="mt-0.5 hidden truncate text-[11px] text-slate-500 sm:block">{subtitle}</p> : null}
            </div>
            {topbarActions}
          </div>
        </header>

        <main className="px-3.5 py-4 sm:px-5 lg:px-6 lg:py-5">{children}</main>
      </div>
    </div>
  );
}
