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
    ? 'border-slate-800 bg-slate-950 text-white'
    : 'border-slate-200 bg-white text-slate-950';
  const sidebarMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inactiveItem = isDark
    ? 'text-slate-300 hover:bg-white/10 hover:text-white'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950';

  const sidebarContent = (
    <>
      <div className={`flex h-16 items-center border-b px-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <Link className="flex min-w-0 items-center gap-3" to={navItems[0]?.href ?? '/'} aria-label={`${brandName} home`}>
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-600 text-xs font-bold text-white">
            {brandInitials}
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{brandName}</span>
              {brandSubtitle ? <span className={`block truncate text-[11px] ${sidebarMuted}`}>{brandSubtitle}</span> : null}
            </span>
          ) : null}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label={`${brandName} navigation`}>
        <div className="grid gap-1">
          {navItems.map((item, index) => (
            <Link
              key={item.id}
              className={`flex min-h-10 items-center rounded-xl px-3 text-sm font-medium ${
                item.isActive
                  ? isDark
                    ? 'bg-blue-500/15 text-blue-300'
                    : 'bg-blue-50 text-blue-700'
                  : inactiveItem
              } ${collapsed ? 'justify-center px-2' : 'gap-3'}`}
              title={collapsed ? item.label : undefined}
              to={item.href}
              onClick={() => setIsMobileOpen(false)}
            >
              <span className={`grid size-6 shrink-0 place-items-center rounded-lg text-[10px] font-semibold ${item.isActive ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </Link>
          ))}
        </div>
      </nav>

      {footer ? <div className={`border-t p-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>{footer}</div> : null}
    </>
  );

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-950">
      <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r transition-[width] duration-200 lg:flex lg:flex-col ${sidebarSurface} ${collapsed ? 'w-20' : 'w-64'}`}>
        {sidebarContent}
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={`${brandName} navigation`}>
          <button className="absolute inset-0 bg-slate-950/45" aria-label="Close navigation" onClick={() => setIsMobileOpen(false)} type="button" />
          <aside className={`relative flex h-full w-[min(18rem,86vw)] flex-col border-r shadow-2xl ${sidebarSurface}`}>
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      <div className={`transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm lg:hidden" onClick={() => setIsMobileOpen(true)} type="button">
              Menu
            </button>
            {canCollapse ? (
              <button className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 lg:inline-flex" onClick={() => setIsCollapsed((value) => !value)} type="button">
                {collapsed ? 'Expand menu' : 'Collapse menu'}
              </button>
            ) : null}

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-sm font-semibold text-slate-950 sm:text-base">{title}</h1>
              {subtitle ? <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">{subtitle}</p> : null}
            </div>
            {topbarActions}
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
