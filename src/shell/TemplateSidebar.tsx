import { NavLink, useLocation } from 'react-router';
import { AppIcon } from '@/components/AppIcon';
import { templateNavigation } from '@/config/templateNavigation';

interface TemplateSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function itemClassName(isActive: boolean) {
  return `flex min-h-8 items-center gap-2 rounded px-2 py-1.5 text-[12px] font-medium transition ${
    isActive
      ? 'bg-[var(--theme-primary)] text-[var(--theme-on-primary)] shadow-sm'
      : 'text-slate-600 hover:bg-[var(--theme-primary-soft)] hover:text-[var(--theme-primary)]'
  }`;
}

export function TemplateSidebar({ collapsed, mobileOpen, onCloseMobile }: TemplateSidebarProps) {
  const location = useLocation();

  return (
    <>
      {mobileOpen ? (
        <button
          aria-label="Cerrar navegación"
          className="fixed inset-0 top-12 z-30 bg-slate-950/25 md:hidden"
          type="button"
          onClick={onCloseMobile}
        />
      ) : null}

      <aside
        className={`fixed bottom-0 left-0 top-12 z-40 flex flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-200 ${
          collapsed ? 'md:w-[68px]' : 'md:w-[232px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} w-[232px]`}
      >
        <div className={`border-b border-slate-100 ${collapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="grid size-8 shrink-0 place-items-center rounded-md bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]">
              <AppIcon className="size-[18px]" name="layers" />
            </div>
            {!collapsed ? (
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[12px] font-semibold text-slate-900">Blueprint UI</p>
                <p className="truncate text-[10px] text-slate-400">Plantilla general</p>
              </div>
            ) : null}
          </div>
        </div>

        <nav className={`flex-1 overflow-y-auto overscroll-contain py-2 ${collapsed ? 'px-1.5' : 'px-2'}`} aria-label="Navegación del Blueprint">
          {templateNavigation.map((section) => {
            const hasActiveItem = section.items.some((item) => item.to === location.pathname);
            const singleItem = section.items.length === 1 ? section.items[0] : undefined;

            if (collapsed) {
              const target = singleItem ?? section.items[0];
              if (!target) {
                return null;
              }

              return (
                <NavLink
                  key={section.label}
                  aria-label={section.label}
                  className={({ isActive }) =>
                    `mb-1 flex h-9 items-center justify-center rounded transition ${
                      isActive || hasActiveItem
                        ? 'bg-[var(--theme-primary)] text-[var(--theme-on-primary)]'
                        : 'text-slate-500 hover:bg-[var(--theme-primary-soft)] hover:text-[var(--theme-primary)]'
                    }`
                  }
                  to={target.to}
                  onClick={onCloseMobile}
                >
                  <AppIcon className="size-[18px]" name={section.icon} />
                </NavLink>
              );
            }

            if (singleItem) {
              return (
                <NavLink
                  key={singleItem.to}
                  className={({ isActive }) => `${itemClassName(isActive)} mb-1`}
                  to={singleItem.to}
                  onClick={onCloseMobile}
                >
                  <AppIcon className="size-4 shrink-0" name={singleItem.icon} />
                  <span className="truncate">{singleItem.label}</span>
                </NavLink>
              );
            }

            return (
              <details key={section.label} className="group mb-1" open={hasActiveItem || undefined}>
                <summary
                  className={`flex min-h-8 cursor-pointer list-none items-center gap-2 rounded px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] transition ${
                    hasActiveItem
                      ? 'text-[var(--theme-primary)]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <AppIcon className="size-4 shrink-0" name={section.icon} />
                  <span className="min-w-0 flex-1 truncate">{section.label}</span>
                  <AppIcon className="size-3.5 shrink-0 transition group-open:rotate-180" name="chevron-down" />
                </summary>
                <div className="ml-3 mt-0.5 border-l border-slate-100 pl-1.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      className={({ isActive }) => `${itemClassName(isActive)} mb-0.5`}
                      to={item.to}
                      onClick={onCloseMobile}
                    >
                      <AppIcon className="size-[14px] shrink-0" name={item.icon} />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>

        <div className={`border-t border-slate-100 py-2 ${collapsed ? 'px-1.5' : 'px-2'}`}>
          <div
            className={`flex min-h-8 items-center rounded px-2 py-1.5 text-[12px] font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 ${
              collapsed ? 'justify-center' : 'gap-2'
            }`}
          >
            <AppIcon className="size-4 shrink-0" name="settings" />
            {!collapsed ? <span>Ajustes</span> : null}
          </div>
        </div>
      </aside>
    </>
  );
}
