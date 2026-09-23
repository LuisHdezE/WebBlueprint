import type { ProjectPresetDefinition } from '@/composer/project.types';

export const projectPresets: readonly ProjectPresetDefinition[] = [
  {
    id: 'blank',
    name: 'Aplicación vacía',
    description: 'Empieza sin vistas seleccionadas y construye la navegación desde cero.',
    viewPaths: [],
  },
  {
    id: 'ecommerce',
    name: 'Ecommerce',
    description: 'Base comercial con dashboard, catálogo, tienda, clientes, facturas y seguimiento.',
    viewPaths: [
      '/dashboard',
      '/applications/ecommerce/products',
      '/applications/ecommerce/shop',
      '/applications/ecommerce/product',
      '/applications/ecommerce/editor',
      '/applications/contacts',
      '/applications/invoices/list',
      '/applications/invoices/preview',
      '/applications/tasks',
      '/charts',
    ],
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Base orientada a relación con clientes, comunicación, tareas y seguimiento visual.',
    viewPaths: [
      '/dashboard',
      '/applications/contacts',
      '/applications/chat',
      '/applications/mailbox',
      '/applications/notes',
      '/applications/kanban',
      '/applications/tasks',
      '/tables/datatable-advanced',
      '/charts',
      '/user/profile',
    ],
  },
  {
    id: 'admin-erp',
    name: 'ERP administrativo',
    description: 'Base administrativa con formularios, tablas, facturación, métricas y configuración.',
    viewPaths: [
      '/dashboard',
      '/applications/invoices/list',
      '/applications/invoices/editor',
      '/forms/basic-inputs',
      '/forms/layouts',
      '/forms/validation',
      '/tables/basic',
      '/tables/datatable-advanced',
      '/charts',
      '/widgets',
      '/user/account-settings',
    ],
  },
  {
    id: 'content',
    name: 'Contenido / Blog',
    description: 'Base editorial con listado, cuadrícula, artículo, editor y utilidades de publicación.',
    viewPaths: [
      '/dashboard',
      '/applications/blog/list',
      '/applications/blog/grid',
      '/applications/blog/post',
      '/applications/blog/editor',
      '/forms/editors',
      '/forms/file-upload',
      '/applications/notes',
      '/applications/tasks',
    ],
  },
];

export function getProjectPreset(presetId: string | null) {
  return projectPresets.find((preset) => preset.id === presetId);
}
