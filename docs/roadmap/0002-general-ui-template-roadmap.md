# Roadmap vigente · WebBlueprint General UI Template

Estado: **ACTIVO**  
Fecha: **2026-09-22**  
Reemplaza como dirección vigente al roadmap inicial `0001-initial-development-roadmap.md`, que se conserva como historial del recorrido previo.

## Principios de ejecución

- React.js + TypeScript + Tailwind CSS.
- Primero se completa la plantilla visual/navegable; después se retoman Theme Builder avanzado, Composer, presets y exportación.
- Toda vista se construye por composición de componentes reutilizables.
- Si falta una pieza reutilizable, primero se crea/documenta el componente y luego se usa en la vista.
- Datos estáticos/mock son suficientes durante esta etapa.
- No se implementa lógica de negocio real salvo la mínima necesaria para navegación/estado visual.
- Todo componente debe ser **theme-safe**: el color de marca nunca queda hardcodeado.
- Los colores semánticos de éxito/advertencia/error/info no dependen del color del tema.
- Cada incremento visual importante debe llegar a `https://webblueprint.eliasworks.uy` y revisarse antes de empezar la siguiente vista.
- Una etapa no puede convertirse en ciclo documental. Cada Gx se abre con alcance mínimo y se cierra con evidencia.

## Ciclo obligatorio por vista

```text
1. Elegir vista
2. Identificar componentes necesarios
3. Crear/documentar componentes faltantes
4. Componer la vista
5. CI verde
6. PR Ready
7. Merge con aprobación explícita
8. Deploy automático a EliasWorks
9. Revisión visual en producción
10. Abrir la siguiente vista
```

## Estados

- `[ ]` Pendiente
- `[~]` En progreso
- `[x]` Completo

---

# G0 · Rebaseline del producto

Objetivo: corregir la dirección sin entrar en un ciclo documental prolongado.

- [x] G0.1 Congelar Pet Shop como experimento anterior.
- [x] G0.2 Declarar la plantilla UI general como objetivo conductor.
- [x] G0.3 Registrar el baseline visual SERVAS compacto.
- [x] G0.4 Fijar densidad aproximada 80–85 %.
- [x] G0.5 Confirmar React.js + TypeScript + Tailwind CSS.
- [x] G0.6 Fijar `theme-safe by default`.
- [x] G0.7 Fijar composición por componentes.
- [x] G0.8 Crear el inventario/roadmap ejecutable de vistas.
- [x] G0.9 Incorporar deploy + revisión visual continua como gate.

**Cierre G0:** una sola PR documental. Después se entra inmediatamente a G1.

---

# G1 · Application Shell

## G1.1 Topbar
- [ ] Marca/nombre de la plantilla.
- [ ] Buscador.
- [ ] menú móvil.
- [ ] notificaciones.
- [ ] ayuda.
- [ ] perfil/avatar.
- [ ] menú de usuario.
- [ ] responsive.

## G1.2 Sidebar
- [ ] ancho compacto 225–235 px.
- [ ] items 34–38 px aprox.
- [ ] padding vertical reducido.
- [ ] iconos compactos.
- [ ] grupos y submenús.
- [ ] item activo.
- [ ] hover/focus.
- [ ] footer del sidebar.
- [ ] variante colapsada.
- [ ] drawer móvil.
- [ ] scroll independiente.
- [ ] variante clara.
- [ ] variante oscura.

## G1.3 Page Shell
- [ ] Breadcrumbs.
- [ ] Page title.
- [ ] descripción.
- [ ] acciones.
- [ ] content container.
- [ ] grid responsive.
- [ ] Router Outlet.

## G1.4 Menú maestro visible desde el inicio
- [ ] Dashboards.
- [ ] Applications.
- [ ] Components.
- [ ] Elements.
- [ ] Forms.
- [ ] Tables.
- [ ] Charts.
- [ ] Widgets.
- [ ] Maps.
- [ ] Pages.
- [ ] User.
- [ ] Authentication.
- [ ] Layouts.
- [ ] Documentation.

Las rutas aún no implementadas pueden mostrar una vista gobernada de `Pendiente`, pero no debe haber enlaces muertos.

---

# G2 · Design Foundation

- [ ] G2.1 Inter como tipografía principal.
- [ ] G2.2 escala de spacing compacta.
- [ ] G2.3 radios 3–6 px.
- [ ] G2.4 sistema de bordes.
- [ ] G2.5 sombras discretas.
- [ ] G2.6 surfaces.
- [ ] G2.7 tokens `theme-primary*`.
- [ ] G2.8 tokens success/warning/danger/info.
- [ ] G2.9 estados disabled/hover/focus/active.
- [ ] G2.10 breakpoints responsive.
- [ ] G2.11 convención de iconos.
- [ ] G2.12 paleta verde inicial de prueba sin acoplamiento.

---

# G3 · Elements

- [ ] Button.
- [ ] ButtonGroup.
- [ ] IconButton.
- [ ] Badge.
- [ ] StatusBadge.
- [ ] Avatar.
- [ ] Alert.
- [ ] InlineFeedback.
- [ ] Breadcrumbs.
- [ ] Dropdown.
- [ ] Tooltip.
- [ ] Popover.
- [ ] ProgressBar.
- [ ] LoadingIndicator.
- [ ] Skeleton.
- [ ] Pagination.
- [ ] SearchField.
- [ ] TreeView.
- [ ] Divider.
- [ ] Typography showcase.
- [ ] Color palette showcase.

---

# G4 · Components

- [ ] Card.
- [ ] MetricCard.
- [ ] StatCard.
- [ ] InfoCard.
- [ ] Accordion.
- [ ] Tabs.
- [ ] Modal.
- [ ] Dialog.
- [ ] ConfirmDialog.
- [ ] Toast.
- [ ] NotificationCenter.
- [ ] List.
- [ ] ListItem.
- [ ] MediaItem.
- [ ] ActivityFeed.
- [ ] Timeline.
- [ ] Carousel.
- [ ] Lightbox / MediaViewer.
- [ ] DragDrop.
- [ ] Sortable.
- [ ] PricingCard.
- [ ] PricingTable.
- [ ] EmptyState.

---

# G5 · Forms

## Componentes
- [ ] FormField.
- [ ] FormSection.
- [ ] FormLayout.
- [ ] TextField.
- [ ] Textarea.
- [ ] InputGroup.
- [ ] NumberInput.
- [ ] Checkbox / CheckboxGroup.
- [ ] Radio / RadioGroup.
- [ ] Switch.
- [ ] Slider.
- [ ] SelectField.
- [ ] ComboBox.
- [ ] Autocomplete.
- [ ] DatePicker.
- [ ] DateTimePicker.
- [ ] TagInput.
- [ ] FileUpload.
- [ ] Dropzone.
- [ ] CopyButton.
- [ ] Character counter.
- [ ] Input mask visual.
- [ ] RichTextEditor.
- [ ] Markdown editor.
- [ ] Validation states.
- [ ] Wizard.
- [ ] Stepper.

## Vistas
- [ ] Basic Forms.
- [ ] Form Layouts.
- [ ] Validation.
- [ ] Advanced Inputs.
- [ ] File Upload.
- [ ] Editors.
- [ ] Wizard.

---

# G6 · Tables

## Componentes/capacidades
- [ ] Table.
- [ ] DataTable.
- [ ] striped.
- [ ] compact.
- [ ] bordered.
- [ ] custom cells.
- [ ] acciones por fila.
- [ ] search.
- [ ] filters.
- [ ] sorting.
- [ ] pagination.
- [ ] row selection.
- [ ] bulk actions.
- [ ] empty/loading.
- [ ] responsive overflow.

## Vistas
- [ ] Basic Table.
- [ ] Striped Table.
- [ ] DataTable Basic.
- [ ] DataTable Advanced.
- [ ] DataTable Custom.
- [ ] DataTable Miscellaneous.

---

# G7 · Charts & Data Visualization

- [ ] Chart wrapper.
- [ ] ChartCard.
- [ ] Line.
- [ ] Area.
- [ ] Bar.
- [ ] Column.
- [ ] Pie.
- [ ] Donut.
- [ ] Radial.
- [ ] Mixed.
- [ ] Sparkline.
- [ ] Legend.
- [ ] Tooltip.
- [ ] Empty chart.

---

# G8 · Widgets

- [ ] KPI widget.
- [ ] Statistics widget.
- [ ] Progress widget.
- [ ] Activity widget.
- [ ] List widget.
- [ ] Chart widget.
- [ ] Notification widget.
- [ ] Task widget.
- [ ] Profile widget.
- [ ] Summary widget.
- [ ] vista `/widgets`.

---

# G9 · Maps

- [ ] Map container.
- [ ] Markers.
- [ ] Popup.
- [ ] Controls.
- [ ] Location card.
- [ ] Marker list.
- [ ] Empty state.
- [ ] Responsive map layout.
- [ ] Map demo.

---

# G10 · General Pages

- [ ] Contact.
- [ ] FAQ.
- [ ] Knowledge Base.
- [ ] Maintenance.
- [ ] 404.
- [ ] 500.
- [ ] Blank Page.
- [ ] Empty Page.

---

# G11 · User

- [ ] User Profile.
- [ ] Account Settings.
- [ ] Personal Information.
- [ ] Preferences.
- [ ] Security.
- [ ] Sessions.
- [ ] Notification Settings.

---

# G12 · Authentication

- [ ] Sign In.
- [ ] Sign Up.
- [ ] Forgot Password.
- [ ] Reset Password.
- [ ] Two Factor.
- [ ] Lock Screen.
- [ ] Boxed layout.
- [ ] Cover layout.

Autenticación real queda fuera de esta etapa.

---

# G13 · Application Views

## Blog
- [ ] Blog List.
- [ ] Blog Grid.
- [ ] Blog Post.
- [ ] Blog Editor.
- [ ] Blog Create.
- [ ] Blog Edit.

## Calendar
- [ ] Calendar.

## Communication
- [ ] Chat.
- [ ] Contacts.
- [ ] Mailbox.

## Ecommerce
- [ ] Product List.
- [ ] Product Grid.
- [ ] Product Shop.
- [ ] Product Detail.
- [ ] Product Create.
- [ ] Product Edit.

## Invoice
- [ ] Invoice List.
- [ ] Invoice Create.
- [ ] Invoice Edit.
- [ ] Invoice Preview.

## Productivity
- [ ] Notes.
- [ ] Kanban / Scrumboard.
- [ ] Todo List.
- [ ] Task List.

---

# G14 · Dashboards

- [ ] Dashboard Overview.
- [ ] Dashboard Analytics.
- [ ] Dashboard Operations.
- [ ] Metric cards composition.
- [ ] charts composition.
- [ ] tables composition.
- [ ] activity composition.
- [ ] tasks/alerts composition.
- [ ] progress/status blocks.

---

# G15 · Layout Gallery

- [ ] Collapsible Sidebar.
- [ ] Vertical Light.
- [ ] Vertical Dark.
- [ ] Compact Sidebar.
- [ ] Mobile Drawer.
- [ ] Blank Layout.
- [ ] Empty Layout.
- [ ] Layout playground.

---

# G16 · Living Documentation

Se ejecuta en paralelo, no como fase final.

Cada componente nuevo:
- [ ] propósito;
- [ ] ejemplo visual;
- [ ] variantes;
- [ ] props;
- [ ] estados;
- [ ] responsive;
- [ ] accesibilidad relevante;
- [ ] ejemplo de uso cuando corresponda.

Cada vista:
- [ ] Pendiente / En progreso / Completa;
- [ ] ruta navegable;
- [ ] componentes utilizados;
- [ ] checkpoint visual publicado.

---

# G17 · Visual & Navigation Closure

- [ ] Todas las opciones del sidebar funcionan.
- [ ] No hay enlaces muertos.
- [ ] Todas las vistas del alcance existen.
- [ ] Todas usan el shell oficial.
- [ ] Todas respetan el baseline compacto SERVAS.
- [ ] Todas son responsive.
- [ ] No hay componentes duplicados por página.
- [ ] Galería de componentes completa para el alcance.
- [ ] Sin errores de consola relevantes.
- [ ] TypeScript verde.
- [ ] lint verde.
- [ ] tests verdes.
- [ ] build verde.
- [ ] CI verde.
- [ ] deploy verde.
- [ ] revisión visual final en EliasWorks.

---

# Etapa posterior a G17

Solo después del cierre visual/navegable se retoman como trabajo conductor:

- Theme Builder avanzado;
- selección de paletas/presets;
- Application Composer;
- presets de aplicaciones;
- selección de vistas por aplicación;
- manifest/generación;
- exportación React ZIP;
- reconstrucción de aplicaciones como Pet Shop, CRM, Taller, eFactura, logística, seguros, etc.

La capacidad de cambiar color del tema se prepara arquitectónicamente desde G2, pero la experiencia avanzada de creación/gestión de temas pertenece a esta etapa posterior.
