# U1.2 · Mapa de extracción de componentes desde CORK

Estado: **BORRADOR GOBERNADO**

## Principio

Las referencias CORK no se trasladan uno a uno. Se extraen capacidades reutilizables que después serán implementadas solo cuando una vista real de U2 las necesite.

No se autoriza crear una librería especulativa completa antes de tener consumidores.

## Ya existente en WebBlueprint

| Patrón | Implementación actual | Referencias relacionadas |
|---|---|---|
| Shell con navegación izquierda | `LeftAppShell` | `layout-collapsible-menu.html` y los tres layouts aprobados |
| Shell autenticado | `WorkspaceShell` | auth/layout/workspace |
| Shell público | `PublicShell` | páginas públicas |
| Presentación de aplicación | `ApplicationCard`, `ApplicationPreview` | cards/listados de aplicaciones |
| Wizard | `ComposerWizard` | `form-wizard.html` como referencia funcional parcial |

## Fundación UI a extraer bajo demanda

| Familia | Primitivas/patrones objetivo | Referencias CORK absorbidas |
|---|---|---|
| Acciones | `Button`, `ButtonGroup` | `element-buttons*` |
| Estado | `Badge`, `StatusBadge`, `Alert`, `InlineFeedback`, `Progress`, `LoadingIndicator`, `Skeleton` | badges, alerts, progressbar, loader |
| Identidad | `Avatar` | `element-avatar.html` |
| Navegación contextual | `Breadcrumbs`, `Tabs`, `Pagination`, `TreeView` | breadcrumbs, tabs, pagination, treeview |
| Menús y ayudas | `Dropdown`, `Popover`, `Tooltip` | dropdown, popovers, tooltips |
| Búsqueda | `SearchField` | `element-search.html` |
| Superficies | `Card`, `InfoCard`, `PageCanvas`, `PageHeader` | cards, infobox, blank/empty layouts |
| Listas | `List`, `ListItem`, `MediaItem` | list-group, media-object |
| Overlays | `Modal`, `Dialog`, `ConfirmDialog`, `Lightbox` | modal, sweetalert, lightbox |
| Feedback global | `Toast`, `NotificationCenter` | notifications, sweetalert |
| Interacción avanzada | `DragDrop`, `Sortable` | drag-drop |
| Contenido temporal | `Timeline`, `ActivityFeed` | timeline |
| Carrusel | `Carousel` | carousel, Splide; Bootstrap carousel descartado como implementación duplicada |
| Métricas | `MetricCard`, `StatCard` | widgets, dashboards |
| Gráficos | `Chart`, `ChartCard` | `charts-apex.html` |
| Datos tabulares | `Table`, `DataTable` | las cinco referencias de tablas |

## Formularios

| Patrón objetivo | Referencias absorbidas |
|---|---|
| `FormField`, `FormSection`, `FormLayout` | bootstrap-basic, layouts, validation |
| `TextField`, `Textarea`, `InputGroup` | input-group, maxlength, input-mask |
| `NumberInput` | touchspin |
| `Checkbox`, `CheckboxGroup` | checkbox |
| `Radio`, `RadioGroup` | radio |
| `Switch` | switches |
| `Slider` | slider |
| `DatePicker`, `DateTimePicker` | date-time-picker |
| `ComboBox`, `Autocomplete`, `Select` | autoComplete, tom-select |
| `TagInput` | tagify |
| `FileUpload`, `Dropzone` | fileupload |
| `CopyButton` / acción de copiar | clipboard |
| `RichTextEditor` | markdown, Quill |
| `Wizard`, `Stepper` | wizard |

Las referencias asociadas a Bootstrap, Quill, Tom Select, Tagify, SweetAlert, Splide y Apex describen capacidades, **no dependencias obligatorias**. La elección de implementación pertenece a U2 y debe justificarse por el primer consumidor real.

## Patrones de aplicación

Estos patrones no son primitivas atómicas, pero agrupan referencias CORK que comparten estructura:

- `DashboardComposition`;
- `ContentCollection` + `BlogEditor` + `ArticleDetail`;
- `CalendarView`;
- `ConversationWorkspace`;
- `ContactsDirectory`;
- `ProductEditor` + `ProductCatalogAdmin` + `ProductCatalogPublic` + `ProductDetail`;
- `InvoiceEditor` + `InvoiceList` + `InvoicePreview`;
- `MailboxWorkspace`;
- `NotesWorkspace`;
- `KanbanBoard`;
- `TaskList`;
- `MapView`;
- `AuthShell` + flujos de registro/recuperación/2FA/bloqueo;
- `AccountSettings`;
- `UserProfile`;
- `ContactPage`, `FaqPage`, `KnowledgeBase`, `MaintenancePage`, `NotFoundPage`.

## Regla de U2

Cuando una vista de U2 necesite una primitiva inexistente:

1. implementar la primitiva con API mínima;
2. documentarla en `/components`;
3. cubrir estados/variantes necesarios para ese consumidor;
4. consumirla desde la vista;
5. evitar implementar variantes no requeridas todavía.

El mapa identifica dirección arquitectónica, no un backlog para construir todo de una vez.
