import { leftMenuVariants } from '@/shell/shell.types';

export type DocumentationProp = {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description: string;
};

export type ComponentDocumentationEntry = {
  id: string;
  name: string;
  category: 'Application display' | 'Data display' | 'Feedback' | 'Shell';
  maturity: 'stable';
  sourcePath: string;
  summary: string;
  props: readonly DocumentationProp[];
  variants: readonly string[];
  states: readonly string[];
  example: string;
};

export function getDocumentationCategoryLabel(category: ComponentDocumentationEntry['category']) {
  switch (category) {
    case 'Application display':
      return 'Presentación de aplicaciones';
    case 'Data display':
      return 'Presentación de datos';
    case 'Feedback':
      return 'Mensajes de estado';
    default:
      return 'Shell';
  }
}

export function getMaturityLabel(maturity: ComponentDocumentationEntry['maturity']) {
  return maturity === 'stable' ? 'estable' : maturity;
}

export const componentDocumentation: readonly ComponentDocumentationEntry[] = [
  {
    id: 'application-card',
    name: 'ApplicationCard',
    category: 'Application display',
    maturity: 'stable',
    sourcePath: 'src/components/applications/ApplicationCard.tsx',
    summary: 'Tarjeta del catálogo público compuesta desde el registro de aplicaciones y la vista previa compartida.',
    props: [
      {
        name: 'application',
        type: 'ApplicationDefinition',
        required: true,
        description: 'Aplicación registrada utilizada para textos, capacidades, enlaces y vista previa integrada.',
      },
    ],
    variants: ['predeterminada'],
    states: ['predeterminado', 'hover'],
    example: '<ApplicationCard application={application} />',
  },
  {
    id: 'application-preview',
    name: 'ApplicationPreview',
    category: 'Application display',
    maturity: 'stable',
    sourcePath: 'src/components/applications/ApplicationPreview.tsx',
    summary: 'Vista previa visual responsive que refleja las páginas de la aplicación y el shell claro u oscuro configurado.',
    props: [
      {
        name: 'application',
        type: 'ApplicationDefinition',
        required: true,
        description: 'Aplicación registrada que aporta páginas, variante del shell e identidad visible.',
      },
      {
        name: 'compact',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Reduce la altura de la vista previa y la cantidad de elementos de navegación visibles en contextos de tarjeta.',
      },
    ],
    variants: ['predeterminada', 'compacta'],
    states: ['shell claro', 'shell oscuro'],
    example: '<ApplicationPreview application={application} compact />',
  },
  {
    id: 'metric-card',
    name: 'MetricCard',
    category: 'Data display',
    maturity: 'stable',
    sourcePath: 'src/components/data-display/MetricCard.tsx',
    summary: 'Tarjeta compacta para una métrica principal con nota contextual y tono semántico opcional.',
    props: [
      { name: 'label', type: 'string', required: true, description: 'Nombre visible de la métrica.' },
      { name: 'value', type: 'string', required: true, description: 'Valor principal ya formateado para la interfaz.' },
      { name: 'note', type: 'string', required: false, description: 'Contexto secundario, variación o estado de la métrica.' },
      { name: 'tone', type: "'positive' | 'neutral' | 'warning'", required: false, defaultValue: 'neutral', description: 'Tono semántico de la nota.' },
    ],
    variants: ['positivo', 'neutral', 'advertencia'],
    states: ['con nota', 'sin nota'],
    example: '<MetricCard label="Pedidos" value="126" note="+12 desde ayer" tone="positive" />',
  },
  {
    id: 'status-badge',
    name: 'StatusBadge',
    category: 'Data display',
    maturity: 'stable',
    sourcePath: 'src/components/data-display/StatusBadge.tsx',
    summary: 'Badge semántico para estados breves dentro de listas, tablas y superficies operativas.',
    props: [
      { name: 'label', type: 'string', required: true, description: 'Texto visible del estado.' },
      { name: 'tone', type: "'success' | 'warning' | 'info' | 'neutral'", required: false, defaultValue: 'neutral', description: 'Tono semántico visual del estado.' },
    ],
    variants: ['éxito', 'advertencia', 'información', 'neutral'],
    states: ['predeterminado'],
    example: '<StatusBadge label="Listo" tone="success" />',
  },
  {
    id: 'activity-feed',
    name: 'ActivityFeed',
    category: 'Data display',
    maturity: 'stable',
    sourcePath: 'src/components/data-display/ActivityFeed.tsx',
    summary: 'Lista responsive de actividad reciente con detalle, tiempo y estado opcional.',
    props: [
      { name: 'items', type: 'readonly ActivityFeedItem[]', required: true, description: 'Actividad tipada con identificadores estables y metadata visible.' },
    ],
    variants: ['lista operativa'],
    states: ['con elementos', 'vacío'],
    example: '<ActivityFeed items={activity} />',
  },
  {
    id: 'inline-feedback',
    name: 'InlineFeedback',
    category: 'Feedback',
    maturity: 'stable',
    sourcePath: 'src/components/feedback/InlineFeedback.tsx',
    summary: 'Mensaje contextual para estados de carga, vacío, advertencia y error sin recurrir a overlays.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Título breve del estado.' },
      { name: 'message', type: 'string', required: true, description: 'Explicación o siguiente contexto para la persona usuaria.' },
      { name: 'tone', type: "'info' | 'warning' | 'error' | 'neutral'", required: false, defaultValue: 'neutral', description: 'Tono semántico del bloque.' },
    ],
    variants: ['información', 'advertencia', 'error', 'neutral'],
    states: ['estado normal', 'alerta en error'],
    example: '<InlineFeedback title="Sin datos" message="Todavía no hay actividad." />',
  },
  {
    id: 'left-app-shell',
    name: 'LeftAppShell',
    category: 'Shell',
    maturity: 'stable',
    sourcePath: 'src/shell/LeftAppShell.tsx',
    summary: 'Shell compartido mobile-first con navegación izquierda gobernada, colapso opcional y drawer móvil.',
    props: [
      { name: 'brandName', type: 'string', required: true, description: 'Nombre principal del producto mostrado en el shell de navegación.' },
      { name: 'brandSubtitle', type: 'string', required: false, description: 'Contexto secundario opcional de la marca.' },
      { name: 'brandInitials', type: 'string', required: true, description: 'Marca compacta utilizada cuando el espacio es reducido.' },
      { name: 'navItems', type: 'readonly LeftAppShellNavItem[]', required: true, description: 'Modelo de navegación renderizado de forma consistente en escritorio y móvil.' },
      { name: 'title', type: 'string', required: true, description: 'Título de la barra superior para la superficie actual de la aplicación.' },
      { name: 'subtitle', type: 'string', required: false, description: 'Texto secundario opcional de la barra superior.' },
      { name: 'variant', type: 'LeftMenuVariant', required: false, defaultValue: 'collapsible-menu', description: 'Variante de presentación del shell gobernada.' },
      { name: 'footer', type: 'ReactNode', required: false, description: 'Contenido opcional del pie de la barra lateral.' },
      { name: 'topbarActions', type: 'ReactNode', required: false, description: 'Contenido opcional de acciones en la barra superior.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Contenido de la aplicación renderizado dentro del espacio de trabajo.' },
    ],
    variants: leftMenuVariants,
    states: ['escritorio expandido', 'escritorio contraído', 'drawer móvil abierto', 'drawer móvil cerrado'],
    example: '<LeftAppShell brandName="Acme" brandInitials="AC" navItems={items} title="Panel">…</LeftAppShell>',
  },
  {
    id: 'workspace-shell',
    name: 'WorkspaceShell',
    category: 'Shell',
    maturity: 'stable',
    sourcePath: 'src/shell/WorkspaceShell.tsx',
    summary: 'Shell autenticado del Compositor construido sobre LeftAppShell con navegación de WebBlueprint y acciones de sesión.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Título de la barra superior del espacio de trabajo.' },
      { name: 'subtitle', type: 'string', required: false, description: 'Contexto opcional del espacio de trabajo.' },
      { name: 'userName', type: 'string', required: false, description: 'Etiqueta del usuario autenticado mostrada en el pie.' },
      { name: 'onSignOut', type: '() => void', required: true, description: 'Acción de cierre de sesión.' },
      { name: 'variant', type: 'LeftMenuVariant', required: false, defaultValue: 'collapsible-menu', description: 'Variante gobernada de menú izquierdo delegada al shell base.' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Contenido del espacio de trabajo del Compositor.' },
    ],
    variants: leftMenuVariants,
    states: ['espacio autenticado', 'drawer móvil', 'navegación contraída'],
    example: '<WorkspaceShell title="Compositor de aplicaciones" onSignOut={signOut}>…</WorkspaceShell>',
  },
  {
    id: 'public-shell',
    name: 'PublicShell',
    category: 'Shell',
    maturity: 'stable',
    sourcePath: 'src/shell/PublicShell.tsx',
    summary: 'Marco del sitio público con navegación principal, menú móvil responsive, acceso de autenticación y pie.',
    props: [],
    variants: ['navegación de escritorio', 'menú móvil details'],
    states: ['ruta activa', 'menú móvil abierto', 'menú móvil cerrado'],
    example: '<Route element={<PublicShell />}>…</Route>',
  },
];

export const livingDocumentationPrinciples = [
  'Documentar el código reutilizable cuando entra en el producto.',
  'Mantener los ejemplos conectados con datos reales del registro y variantes gobernadas.',
  'Describir contratos actuales antes que APIs futuras especulativas.',
  'Reconciliar la documentación al cerrar cada etapa con la implementación que realmente se entregó.',
] as const;
