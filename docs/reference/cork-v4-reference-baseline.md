# Baseline de referencia CORK v4

Fecha: **2026-09-20**

## Archivo fuente

- Archivo: `themeforest-TkEseu24-cork-responsive-admin-dashboard-template.zip`
- Producto/versión detectado: **CORK v4.0.0**
- Tamaño del archivo: **125,837,996 bytes**
- SHA-256: `20bcbafd65148dc46f4402403e2e3e3a8a5d81ab0872046a54dd664ff119f29d`
- Entradas totales del archivo: **23,987**

Esta huella identifica el archivo de referencia exacto utilizado para el primer inventario de WebBlueprint.

## Layouts de referencia aprobados

Solo están dentro del alcance los siguientes directorios de layout no RTL:

- `cork-v4.0.0/html/collapsible-menu/`
- `cork-v4.0.0/html/vertical-dark-menu/`
- `cork-v4.0.0/html/vertical-light-menu/`

La navegación permanece a la **izquierda** en WebBlueprint.

Todas las familias de layout horizontal, modern, semi-dark y RTL quedan excluidas de la auditoría de referencia inicial.

## Conteos del inventario

Cada directorio de layout CORK aprobado contiene **105 páginas HTML**.

Entre los tres directorios aprobados:

- nombres únicos de archivos de páginas de referencia: **107**;
- presentes en los tres layouts: **103**;
- diferencias específicas por layout: **4 nombres de archivo** entre ejemplos de carousel/layout.

### Categorías funcionales

| Categoría | Referencias únicas |
|---|---:|
| Aplicaciones | 21 |
| Formularios | 20 |
| Componentes | 17 |
| Elementos | 17 |
| Autenticación | 10 |
| Layouts | 5 |
| Páginas generales | 5 |
| Tablas | 5 |
| Dashboards | 2 |
| Usuario/Perfil | 2 |
| Gráficos | 1 |
| Mapas | 1 |
| Widgets | 1 |
| **Total** | **107** |

## Interpretación importante

El número `107` es un **conteo del inventario de referencia**, no un compromiso de implementar 107 páginas independientes en WebBlueprint.

La auditoría debe identificar primitivas y patrones reutilizables. Varios ejemplos de CORK pueden condensarse en un único componente o patrón configurable de WebBlueprint.

Ejemplos:

- varios ejemplos de DataTable pueden convertirse en un `DataTable` configurable con variantes documentadas;
- varias presentaciones de autenticación pueden fusionarse en layouts y componentes reutilizables de autenticación;
- las páginas de demostración de layouts pueden resultar innecesarias una vez documentado el comportamiento del propio shell de WebBlueprint;
- las páginas demo de componentes son entradas para la librería y documentación de componentes de WebBlueprint, no necesariamente páginas de aplicación uno-a-uno.

## Flujo de clasificación

Cada fila del inventario de páginas comienza como `REVIEW` y posteriormente debe clasificarse como una de:

- `KEEP`: implementar como una vista útil y diferenciada;
- `ADAPT`: conservar la capacidad pero rediseñarla/reestructurarla para WebBlueprint;
- `MERGE`: la capacidad queda representada mediante otra página, patrón o componente configurable;
- `DISCARD`: referencia de bajo valor, redundante o fuera de alcance.

No debe comenzar la implementación de una vista de referencia hasta comprender su clasificación y los componentes reutilizables requeridos.

## Artefacto de evidencia

El inventario correspondiente legible por máquina se mantiene en:

`docs/reference/cork-v4-page-inventory.csv`
