import { NavLink, useLocation } from 'react-router';
import { AppIcon } from '@/components/AppIcon';
import { templateNavigation } from '@/config/templateNavigation';
import type { TemplateNavigationItem } from '@/config/templateNavigation';

interface TemplateSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavigationGroupItem {
  item: TemplateNavigationItem;
  label: string;
}

type NavigationEntry =
  | { type: 'item'; item: TemplateNavigationItem }
  | { type: 'group'; label: string; items: NavigationGroupItem[] };

function itemClassName(isActive: boolean) {
  return `flex min-h-[30px] items-center gap-2 rounded-md border-l-2 px-2 py-1 text-[11.5px] font-medium leading-tight transition-colors ${
    isActive
      ? 'border-[var(--theme-primary)] bg-[var(--theme-primary-soft)] text-[var(--theme-primary-active)]'
      : 'border-transparent text-slate-600 hover:bg-[var(--theme-primary-soft)] hover:text-[var(--theme-primary)]'
  }`;
}

function splitCategory(label: string) {
  const separator = ' · ';
  const separatorIndex = label.indexOf(separator);

  if (separatorIndex < 0) {
    return null;
  }

  return {
    category: label.slice(0, separatorIndex).trim(),
    childLabel: label.slice(separatorIndex + separator.length).trim(),
  };
}

function buildNavigationEntries(items: readonly TemplateNavigationItem[]): NavigationEntry[] {
  const categoryCounts = new Map<string, number>();

  items.forEach((item) => {
    const category = splitCategory(item.label)?.category;
    if (category) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
    }
  });

  const renderedCategories = new Set<string>();
  const entries: NavigationEntry[] = [];

  items.forEach((item) => {
    const parsed = splitCategory(item.label);
    const category = parsed?.category;

    if (!parsed || !category || (categoryCounts.get(category) ?? 0) < 2) {
      entries.push({ type: 'item', item });
      return;
    }

    if (renderedCategories.has(category)) {
      return;
    }

    renderedCategories.add(category);
    entries.push({
      type: 'group',
      label: category,
      items: items.flatMap((candidate) => {
        const candidateCategory = splitCategory(candidate.label);
        return candidateCategory?.category === category
          ? [{ item: candidate, label: candidateCategory.childLabel }]
          : [];
      }),
    });
  });

  return entries;
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
        className={`fixed bottom-0 left-0 top-12 z-40 flex w-[232px] flex-col border-r border-slate-200 bg-white transition-[width,transform] duration-200 ${
          collapsed ? 'md:w-[68px]' : 'md:w-[232px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <nav
          aria-label="Navegación del Blueprint"
          className={`flex-1 overflow-y-auto overscroll-contain py-2 ${collapsed ? 'md:px-1.5' : 'px-2'}`}
        >
          {templateNavigation.map((section, sectionIndex) => {
            const hasActiveItem = section.items.some((item) => item.to === location.pathname);
            const collapsedTarget = section.items[0];
            const navigationEntries = buildNavigationEntries(section.items);

            return (
              <section
                key={section.label}
                aria-label={section.label}
                className={sectionIndex === 0 ? 'mb-2' : 'mb-2.5'}
              >
                {collapsed && collapsedTarget ? (
                  <NavLink
                    aria-label={section.label}
                    className={`mb-1 hidden h-8 items-center justify-center rounded-md transition-colors md:flex ${
                      hasActiveItem
                        ? 'bg-[var(--theme-primary-soft)] text-[var(--theme-primary)]'
                        : 'text-slate-500 hover:bg-[var(--theme-primary-soft)] hover:text-[var(--theme-primary)]'
                    }`}
                    title={section.label}
                    to={collapsedTarget.to}
                  >
                    <AppIcon className="size-4" name={section.icon} />
                  </NavLink>
                ) : null}

                <div className={collapsed ? 'md:hidden' : undefined}>
                  <div
                    className={`px-2 pb-1 text-[9px] font-bold uppercase tracking-[0.12em] ${
                      sectionIndex === 0 ? 'pt-0.5' : 'pt-1'
                    } ${hasActiveItem ? 'text-[var(--theme-primary)]' : 'text-slate-400'}`}
                  >
                    {section.label}
                  </div>

                  <div className="space-y-0.5">
                    {navigationEntries.map((entry) => {
                      if (entry.type === 'item') {
                        return (
                          <NavLink
                            key={entry.item.to}
                            className={({ isActive }) => itemClassName(isActive)}
                            to={entry.item.to}
                            onClick={onCloseMobile}
                          >
                            <AppIcon className="size-[14px] shrink-0" name={entry.item.icon} />
                            <span className="min-w-0 truncate">{entry.item.label}</span>
                          </NavLink>
                        );
                      }

                      const groupHasActiveItem = entry.items.some(({ item }) => item.to === location.pathname);
                      const groupIcon = entry.items[0]?.item.icon ?? section.icon;

                      return (
                        <details key={entry.label} className="group" open={groupHasActiveItem || undefined}>
                          <summary
                            className={`flex min-h-[30px] cursor-pointer list-none items-center gap-2 rounded-md px-2 py-1 text-[11.5px] font-semibold leading-tight transition-colors ${
                              groupHasActiveItem
                                ? 'text-[var(--theme-primary-active)]'
                                : 'text-slate-600 hover:bg-[var(--theme-primary-soft)] hover:text-[var(--theme-primary)]'
                            }`}
                          >
                            <AppIcon className="size-[14px] shrink-0" name={groupIcon} />
                            <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                            <AppIcon className="size-3 shrink-0 transition-transform group-open:rotate-180" name="chevron-down" />
                          </summary>

                          <div className="ml-[13px] mt-0.5 space-y-0.5 border-l border-slate-100 pl-1.5">
                            {entry.items.map(({ item, label }) => (
                              <NavLink
                                key={item.to}
                                className={({ isActive }) => itemClassName(isActive)}
                                to={item.to}
                                onClick={onCloseMobile}
                              >
                                <AppIcon className="size-[13px] shrink-0" name={item.icon} />
                                <span className="min-w-0 truncate">{label}</span>
                              </NavLink>
                            ))}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })}
        </nav>

        <div className={`border-t border-slate-100 py-2 ${collapsed ? 'md:px-1.5' : 'px-2'}`}>
          {collapsed ? (
            <div className="hidden h-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-[var(--theme-primary-soft)] hover:text-[var(--theme-primary)] md:flex">
              <AppIcon className="size-4" name="settings" />
            </div>
          ) : null}
          <div
            className={`flex min-h-[30px] items-center gap-2 rounded-md px-2 py-1 text-[11.5px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 ${
              collapsed ? 'md:hidden' : ''
            }`}
          >
            <AppIcon className="size-[14px] shrink-0" name="settings" />
            <span>Ajustes</span>
          </div>
        </div>
      </aside>
    </>
  );
}
