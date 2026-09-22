import type { AppIconName } from '@/components/AppIcon';

export interface TemplateNavigationItem {
  label: string;
  to: string;
  icon: AppIconName;
}

export interface TemplateNavigationSection {
  label: string;
  icon: AppIconName;
  items: readonly TemplateNavigationItem[];
}

export const templateNavigation: readonly TemplateNavigationSection[] = [
  {
    label: 'General',
    icon: 'dashboard',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: 'dashboard' }],
  },
  {
    label: 'Aplicaciones',
    icon: 'apps',
    items: [
      { label: 'Blog · Lista', to: '/applications/blog/list', icon: 'document' },
      { label: 'Blog · Cuadrícula', to: '/applications/blog/grid', icon: 'document' },
      { label: 'Blog · Artículo', to: '/applications/blog/post', icon: 'document' },
      { label: 'Blog · Editor', to: '/applications/blog/editor', icon: 'forms' },
      { label: 'Calendario', to: '/applications/calendar', icon: 'apps' },
      { label: 'Chat', to: '/applications/chat', icon: 'apps' },
      { label: 'Contactos', to: '/applications/contacts', icon: 'user' },
      { label: 'Ecommerce · Productos', to: '/applications/ecommerce/products', icon: 'apps' },
      { label: 'Ecommerce · Tienda', to: '/applications/ecommerce/shop', icon: 'apps' },
      { label: 'Ecommerce · Detalle', to: '/applications/ecommerce/product', icon: 'apps' },
      { label: 'Ecommerce · Editor', to: '/applications/ecommerce/editor', icon: 'forms' },
      { label: 'Facturas · Lista', to: '/applications/invoices/list', icon: 'document' },
      { label: 'Facturas · Vista previa', to: '/applications/invoices/preview', icon: 'document' },
      { label: 'Facturas · Editor', to: '/applications/invoices/editor', icon: 'forms' },
      { label: 'Correo', to: '/applications/mailbox', icon: 'apps' },
      { label: 'Notas', to: '/applications/notes', icon: 'document' },
      { label: 'Kanban', to: '/applications/kanban', icon: 'layers' },
      { label: 'Tareas', to: '/applications/tasks', icon: 'apps' },
    ],
  },
  {
    label: 'Componentes',
    icon: 'components',
    items: [
      { label: 'Accordion', to: '/components/accordion', icon: 'components' },
      { label: 'Cards', to: '/components/cards', icon: 'components' },
      { label: 'Carousel', to: '/components/carousel', icon: 'components' },
      { label: 'Drag & Drop', to: '/components/drag-drop', icon: 'components' },
      { label: 'Lightbox', to: '/components/lightbox', icon: 'components' },
      { label: 'Listas', to: '/components/lists', icon: 'components' },
      { label: 'Modal y Dialog', to: '/components/modal-dialog', icon: 'components' },
      { label: 'Notificaciones', to: '/components/notifications', icon: 'bell' },
      { label: 'Pricing', to: '/components/pricing', icon: 'components' },
      { label: 'Tabs', to: '/components/tabs', icon: 'components' },
      { label: 'Timeline', to: '/components/timeline', icon: 'components' },
    ],
  },
  {
    label: 'Elementos',
    icon: 'layers',
    items: [
      { label: 'Alerts', to: '/elements/alerts', icon: 'layers' },
      { label: 'Avatares', to: '/elements/avatars', icon: 'user' },
      { label: 'Badges', to: '/elements/badges', icon: 'layers' },
      { label: 'Breadcrumbs', to: '/elements/breadcrumbs', icon: 'layers' },
      { label: 'Botones', to: '/elements/buttons', icon: 'layers' },
      { label: 'Colores', to: '/elements/colors', icon: 'palette' },
      { label: 'Dropdowns', to: '/elements/dropdowns', icon: 'layers' },
      { label: 'Info Boxes', to: '/elements/info-boxes', icon: 'layers' },
      { label: 'Loaders', to: '/elements/loaders', icon: 'layers' },
      { label: 'Pagination', to: '/elements/pagination', icon: 'layers' },
      { label: 'Popovers', to: '/elements/popovers', icon: 'layers' },
      { label: 'Progress', to: '/elements/progress', icon: 'chart' },
      { label: 'Search', to: '/elements/search', icon: 'search' },
      { label: 'Tooltips', to: '/elements/tooltips', icon: 'help' },
      { label: 'Tree View', to: '/elements/tree-view', icon: 'layers' },
      { label: 'Tipografía', to: '/elements/typography', icon: 'document' },
    ],
  },
  {
    label: 'Formularios',
    icon: 'forms',
    items: [
      { label: 'Inputs básicos', to: '/forms/basic-inputs', icon: 'forms' },
      { label: 'Autocomplete', to: '/forms/autocomplete', icon: 'forms' },
      { label: 'Checkbox', to: '/forms/checkbox', icon: 'forms' },
      { label: 'Radio', to: '/forms/radio', icon: 'forms' },
      { label: 'Switch', to: '/forms/switch', icon: 'forms' },
      { label: 'Slider', to: '/forms/slider', icon: 'forms' },
      { label: 'Select / ComboBox', to: '/forms/select', icon: 'forms' },
      { label: 'Fecha y hora', to: '/forms/date-time', icon: 'forms' },
      { label: 'File Upload', to: '/forms/file-upload', icon: 'forms' },
      { label: 'Input Groups', to: '/forms/input-groups', icon: 'forms' },
      { label: 'Layouts', to: '/forms/layouts', icon: 'forms' },
      { label: 'Editores', to: '/forms/editors', icon: 'forms' },
      { label: 'Validación', to: '/forms/validation', icon: 'forms' },
      { label: 'Wizard / Stepper', to: '/forms/wizard', icon: 'forms' },
    ],
  },
  {
    label: 'Tablas',
    icon: 'table',
    items: [
      { label: 'Tabla básica', to: '/tables/basic', icon: 'table' },
      { label: 'Tabla striped', to: '/tables/striped', icon: 'table' },
      { label: 'DataTable básica', to: '/tables/datatable-basic', icon: 'table' },
      { label: 'DataTable avanzada', to: '/tables/datatable-advanced', icon: 'table' },
      { label: 'DataTable custom', to: '/tables/datatable-custom', icon: 'table' },
      { label: 'DataTable miscellaneous', to: '/tables/datatable-misc', icon: 'table' },
    ],
  },
  {
    label: 'Visualización',
    icon: 'chart',
    items: [
      { label: 'Charts', to: '/charts', icon: 'chart' },
      { label: 'Widgets', to: '/widgets', icon: 'widgets' },
      { label: 'Maps', to: '/maps', icon: 'map' },
    ],
  },
  {
    label: 'Páginas',
    icon: 'pages',
    items: [
      { label: 'Contacto', to: '/pages/contact', icon: 'pages' },
      { label: 'FAQ', to: '/pages/faq', icon: 'help' },
      { label: 'Base de conocimiento', to: '/pages/knowledge-base', icon: 'book' },
      { label: 'Mantenimiento', to: '/pages/maintenance', icon: 'settings' },
      { label: '404', to: '/pages/not-found', icon: 'pages' },
      { label: '500', to: '/pages/server-error', icon: 'pages' },
      { label: 'Blank Page', to: '/pages/blank', icon: 'pages' },
      { label: 'Empty Page', to: '/pages/empty', icon: 'pages' },
    ],
  },
  {
    label: 'Usuario',
    icon: 'user',
    items: [
      { label: 'Perfil', to: '/user/profile', icon: 'user' },
      { label: 'Configuración de cuenta', to: '/user/account-settings', icon: 'settings' },
    ],
  },
  {
    label: 'Autenticación',
    icon: 'lock',
    items: [
      { label: 'Iniciar sesión', to: '/authentication/sign-in', icon: 'lock' },
      { label: 'Crear cuenta', to: '/authentication/sign-up', icon: 'lock' },
      { label: 'Recuperar contraseña', to: '/authentication/password-reset', icon: 'lock' },
      { label: 'Verificación 2FA', to: '/authentication/two-factor', icon: 'lock' },
      { label: 'Lock Screen', to: '/authentication/lock-screen', icon: 'lock' },
    ],
  },
  {
    label: 'Layouts',
    icon: 'pages',
    items: [
      { label: 'Collapsible Menu', to: '/layouts/collapsible', icon: 'pages' },
      { label: 'Vertical Light', to: '/layouts/vertical-light', icon: 'pages' },
      { label: 'Vertical Dark', to: '/layouts/vertical-dark', icon: 'pages' },
      { label: 'Blank Layout', to: '/layouts/blank', icon: 'pages' },
      { label: 'Empty Layout', to: '/layouts/empty', icon: 'pages' },
    ],
  },
  {
    label: 'Documentación',
    icon: 'book',
    items: [
      { label: 'Introducción', to: '/documentation/introduction', icon: 'book' },
      { label: 'Instalación', to: '/documentation/installation', icon: 'book' },
      { label: 'Estructura', to: '/documentation/structure', icon: 'book' },
      { label: 'Sistema visual', to: '/documentation/design-system', icon: 'palette' },
      { label: 'Componentes', to: '/documentation/components', icon: 'components' },
      { label: 'Accesibilidad', to: '/documentation/accessibility', icon: 'book' },
      { label: 'Responsive', to: '/documentation/responsive', icon: 'book' },
    ],
  },
];

export const templateRouteItems = templateNavigation.flatMap((section) => section.items);

export function findNavigationItem(pathname: string) {
  return templateRouteItems.find((item) => item.to === pathname);
}

export function findNavigationSection(pathname: string) {
  return templateNavigation.find((section) => section.items.some((item) => item.to === pathname));
}
