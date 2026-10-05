# VT-0 · Volketas Template Definition

Estado: **EN REVISIÓN**
Base: `main@2892b3db8431537e63c34a74ca249a3f25987bce`
Rama: `feat/volketas-template-vt0`

## Objetivo

Definir a Volketas como primer consumidor vertical operativo del Composer de WebBlueprint sin convertir WebBlueprint en un fork del producto ni implementar todavía capacidades específicas ausentes.

Regla de este frente:

> WebBlueprint solo recibe trabajo que desbloquea Volketas y que además tiene valor genérico reusable. Al cerrar esa deuda, el trabajo vuelve al producto Volketas.

## Dirección visual aprobada

- shell administrativo compacto;
- navegación lateral azul profundo;
- superficies de trabajo claras;
- naranja como acento de marca/acción;
- semánticos verde, amarillo y rojo para estados;
- alta densidad informativa;
- sin tipografías sobredimensionadas;
- conservar la escala tipográfica compacta ya existente en WebBlueprint.

VT-0 registra `volketas` como theme primario azul profundo. El segundo acento naranja queda como requisito de VT-2 porque el contrato actual de ThemePreset gobierna un único color primario.

## Preset creado

`projectPresets` incorpora:

- id: `volketas`
- nombre: `Volketas`

Selección inicial:

1. Dashboard
2. Calendario
3. Maps
4. Contactos
5. Tareas
6. Facturas · Lista
7. Charts
8. Widgets
9. Perfil
10. Configuración de cuenta

Todas son rutas actualmente seleccionables por el Composer.

## Capability Matrix

| Capacidad objetivo | Evidencia actual WebBlueprint | Clasificación VT-0 | Próxima acción |
|---|---|---|---|
| Shell administrativo | LeftAppShell / TemplateShell | REUSE | ensamblar |
| Sidebar / topbar | shells gobernados | REUSE | ensamblar |
| Theme compacto | theme presets | REUSE / EXTEND | conectar acento naranja en VT-2 |
| Dashboard | DashboardView | REUSE / ADAPT | especializar KPIs Volketas |
| Calendario | vista real V10 | REUSE / ADAPT | eventos operativos |
| Mapa | Leaflet + OSM V7 | REUSE / ADAPT | capas operativas |
| Clientes | CustomerDirectoryView | REUSE / ADAPT | modelo cliente/empresa/obra |
| Servicios / órdenes | OrderListView existe fuera del catálogo Composer | EXTEND | exponer como vista seleccionable y adaptar |
| Inventario / activos | InventoryView existe fuera del catálogo Composer | EXTEND | exponer y adaptar a volquetas/vehículos |
| Contactos | ruta seleccionable | REUSE parcial | no confundir con CustomerDirectoryView |
| Facturas | ruta seleccionable | AUDIT / EXTEND | verificar superficie real antes de usar |
| Charts / Widgets | rutas seleccionables | REUSE primitives | KPIs y reportes |
| Perfil / ajustes | vistas reales | REUSE | ensamblar |
| Dispatch Board | no existe | BLUEPRINT DEBT | vista genérica operativa |
| Service Order Detail | no existe | BLUEPRINT DEBT | detalle reusable |
| Operational Timeline | primitive disponible, no vista | EXTEND | elevar a patrón real |
| Obras / sitios | no existe como vista gobernada | BLUEPRINT DEBT | patrón de entidad/sitio |
| Asset Detail | no existe | BLUEPRINT DEBT | detalle de activo |
| Maintenance | no existe | BLUEPRINT DEBT | gestión reusable |
| Alert Center | notifications/alerts son biblioteca, no centro operacional | BLUEPRINT DEBT | action center |
| Pricing Rules | no existe | BLUEPRINT DEBT | reglas genéricas |
| Accounts Receivable | no existe | BLUEPRINT DEBT | capacidad financiera |
| Profitability | no existe como vista gobernada | BLUEPRINT DEBT | reporte reusable |
| Reports Center | no existe como vista gobernada | BLUEPRINT DEBT | centro de reportes |
| Audit Log | no existe | BLUEPRINT DEBT | auditoría reusable |
| Onboarding | Wizard existe como primitive | EXTEND | onboarding real |
| CSV/Excel import | no existe | BLUEPRINT DEBT | importador genérico |

## Descubrimiento de arquitectura

Las vistas U2 reales `CustomerDirectoryView`, `OrderListView` e `InventoryView` están conectadas a demos de aplicación, pero no forman parte directamente del catálogo de rutas seleccionables del Composer.

Esto genera una deuda previa a VT-1:

> una vista real reusable no debe quedar aislada del Composer si el producto vertical necesita seleccionarla/exportarla.

No se resolverá ocultando duplicados bajo rutas parecidas. VT-1 deberá reconciliar catálogo, page registry, preview y export bajo la regla vigente:

> **Selección = Preview = Export.**

## Fuera de alcance VT-0

- Dispatch Board;
- mantenimiento;
- detalle de servicio;
- detalle de activos;
- alert center;
- pricing;
- reportes nuevos;
- backend;
- API;
- app móvil;
- cambios al producto Volketas real;
- rediseño visual completo;
- implementación del acento naranja en todos los shells.

## Gate VT-0

Debe cumplirse:

- preset Volketas visible en Composer;
- preset compuesto solo por rutas válidas;
- selección editable;
- theme Volketas disponible;
- tests de preset;
- matriz de capacidades/deuda registrada;
- ninguna feature operacional nueva introducida prematuramente.

## Próximo bloque

`VT-1 · Existing View Assembly`

Objetivo:

1. reconciliar vistas reales ya implementadas con el catálogo del Composer;
2. montar la navegación inicial Volketas usando superficies reales;
3. evitar placeholders cuando ya existe una vista reusable;
4. mantener el alcance limitado a capacidades existentes;
5. regresar al objetivo Volketas después de cerrar la deuda reusable necesaria.
