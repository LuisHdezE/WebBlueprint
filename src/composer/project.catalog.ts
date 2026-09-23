import { templateNavigation } from '@/config/templateNavigation';
import type { ProjectViewDefinition } from '@/composer/project.types';

const separator = ' · ';
const reusableLibrarySections = new Set(['Componentes', 'Elementos', 'Formularios', 'Tablas']);
const selectableNavigation = templateNavigation.filter((section) => !reusableLibrarySections.has(section.label));

function splitCategory(label: string) {
  const index = label.indexOf(separator);
  if (index < 0) {
    return { category: null, childLabel: label };
  }

  return {
    category: label.slice(0, index).trim(),
    childLabel: label.slice(index + separator.length).trim(),
  };
}

function toViewId(path: string) {
  return path.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '.').replace(/^\.+|\.+$/g, '').toLowerCase();
}

export const projectViewCatalog: readonly ProjectViewDefinition[] = selectableNavigation.flatMap((section) =>
  section.items.map((item) => {
    const parsed = splitCategory(item.label);
    return {
      id: toViewId(item.to),
      path: item.to,
      label: item.label,
      section: section.label,
      icon: item.icon,
      category: parsed.category,
      childLabel: parsed.childLabel,
    } satisfies ProjectViewDefinition;
  }),
);

export function getProjectView(path: string) {
  return projectViewCatalog.find((view) => view.path === path);
}

export function getProjectViewsBySection() {
  return selectableNavigation.map((section) => ({
    label: section.label,
    icon: section.icon,
    views: projectViewCatalog.filter((view) => view.section === section.label),
  }));
}

export function getSelectedProjectViews(viewPaths: readonly string[]) {
  return viewPaths.flatMap((path) => {
    const view = getProjectView(path);
    return view ? [view] : [];
  });
}
