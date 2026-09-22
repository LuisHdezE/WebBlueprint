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
  category: 'Application display' | 'Data display' | 'Feedback' | 'Form' | 'Identity' | 'Shell';
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
    case 'Form':
      return 'Formularios';
    case 'Identity':
      return 'Identidad';
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
    id: 'avatar',
    name: 'Avatar',
    category: 'Identity',
    maturity: 'stable',
    sourcePath: 'src/components/data-display/Avatar.tsx',
    summary: 'Identidad compacta basada en iniciales para personas o entidades cuando todavía no existe una imagen de perfil.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Nombre utilizado para calcular hasta dos iniciales visibles.' },
      { name: 'size', type: "'sm' | 'md'", required: false, defaultValue: 'md', description: 'Tamaño gobernado de la identidad compacta.' },
    ],
    variants: ['pequeño', 'mediano'],
    states: ['una inicial', 'dos iniciales'],
    example: '<Avatar name="Mariana Suárez" />',
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
    summary: 'Etiqueta semántica compacta para estados breves dentro de listas, tablas y superficies operativas.',
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
    id: 'data-table',
    name: 'DataTable',
    category: 'Data display',
    maturity: 'stable',
    sourcePath: 'src/components/data-display/DataTable.tsx',
    summary: 'Tabla genérica responsive con columnas tipadas, identificador estable de fila y estado vacío integrado.',
    props: [
      { name: 'rows', type: 'readonly Row[]', required: true, description: 'Filas de datos que renderiza la tabla.' },
      { name: 'columns', type: 'readonly DataTableColumn<Row>[]', required: true, description: 'Definición tipada de encabezados y celdas.' },
      { name: 'getRowId', type: '(row: Row) => string', required: true, description: 'Obtiene una clave estable para cada fila.' },
      { name: 'emptyMessage', type: 'string', required: false, description: 'Mensaje mostrado cuando no existen filas.' },
      { name: 'caption', type: 'string', required: false, description: 'Descripción accesible del contenido tabular.' },
    ],
    variants: ['tabla operativa'],
    states: ['con filas', 'vacío', 'desplazamiento horizontal en móvil'],
    example: '<DataTable rows={rows} columns={columns} getRowId={(row) => row.id} />',
  },
  {
    id: 'search-field',
    name: 'SearchField',
    category: 'Form',
    maturity: 'stable',
    sourcePath: 'src/components/forms/SearchField.tsx',
    summary: 'Campo de búsqueda controlado con etiqueta visible y estilos de foco consistentes con Style 1.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Identificador que conecta etiqueta y campo.' },
      { name: 'label', type: 'string', required: true, description: 'Etiqueta visible del criterio de búsqueda.' },
      { name: 'value', type: 'string', required: true, description: 'Valor controlado actual.' },
      { name: 'onChange', type: '(value: string) => void', required: true, description: 'Notifica el nuevo valor del campo.' },
      { name: 'placeholder', type: 'string', required: false, defaultValue: 'Buscar…', description: 'Ayuda contextual dentro del campo.' },
    ],
    variants: ['predeterminada'],
    states: ['vacío', 'con texto', 'foco'],
    example: '<SearchField id="query" label="Buscar" value={query} onChange={setQuery} />',
  },
  {
    id: 'select-field',
    name: 'SelectField',
    category: 'Form',
    maturity: 'stable',
    sourcePath: 'src/components/forms/SelectField.tsx',
    summary: 'Selector controlado y tipado para filtros compactos que comparten etiqueta y estilos de foco.',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Identificador que conecta etiqueta y selector.' },
      { name: 'label', type: 'string', required: true, description: 'Etiqueta visible del criterio de selección.' },
      { name: 'value', type: 'Value', required: true, description: 'Valor controlado actual.' },
      { name: 'options', type: 'readonly SelectFieldOption<Value>[]', required: true, description: 'Opciones tipadas disponibles para la selección.' },
      { name: 'onChange', type: '(value: Value) => void', required: true, description: 'Notifica el nuevo valor seleccionado.' },
    ],
    variants: ['predeterminada'],
    states: ['selección inicial', 'selección modificada', 'foco'],
    example: '<SelectField id="status" label="Estado" value={status} options={options} onChange={setStatus} />',
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
