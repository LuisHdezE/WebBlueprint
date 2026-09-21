# ADR-0001 · Baseline de fundación de WebBlueprint

Estado: **Aceptado**  
Fecha: **2026-09-20**

## Propósito

Fijar las bases no negociables de producto y UI antes de comenzar la implementación.

## Alcance tecnológico

- Solo frontend.
- React.js.
- Tailwind CSS.
- Todos los datos de runtime/dominio son simulados durante la fase Blueprint.
- Los datos simulados deben consumirse mediante providers/repositorios/hooks/servicios reemplazables. Los datos de dominio no deben incrustarse directamente dentro de componentes de página.

## Baseline visual

El baseline visual aprobado es **Style 1**.

Características:

- claro, limpio y profesional;
- sombras discretas;
- superficies suavemente redondeadas;
- jerarquía tipográfica fuerte;
- espaciado consistente;
- fondos neutros y calmados;
- un sistema configurable de color de acento/tema;
- nombre y logo de la aplicación como entradas configurables de marca.

El lenguaje visual fundamental es estable entre aplicaciones generadas. Los cambios de marca deben gobernarse por tokens/configuración y no mediante rediseños específicos de página.

## Baseline responsive

Mobile-first es obligatorio.

Una vista o componente no se considera completo hasta funcionar en anchos móvil, tablet y escritorio. El comportamiento responsive forma parte de los criterios de aceptación, no de una fase posterior de pulido.

## Navegación y shell

La navegación se mantiene siempre a la **izquierda** en layouts de shell para escritorio/tablet.

Solo estas variantes de shell de CORK se aceptan como material de referencia funcional:

1. `collapsible-menu`
2. `vertical-dark-menu`
3. `vertical-light-menu`

Las variantes con menú horizontal, menú moderno, menú semi-dark y RTL quedan excluidas del alcance de referencia salvo que una futura decisión explícita modifique este ADR.

WebBlueprint implementará su propio shell componentizado en lugar de copiar código de shell de CORK.

La UI compartida del shell existe una sola vez:

- `AppShell`
- `Sidebar`
- `Topbar`
- comportamiento de navegación responsive/móvil
- `BottomBar` opcional cuando el patrón móvil lo requiera

Las páginas nunca deben recrear esas estructuras de forma independiente.

## Arquitectura de componentes

WebBlueprint será propietario de su librería de componentes.

Las páginas componen componentes reutilizables. Si una página necesita un elemento UI reutilizable que todavía no existe, primero se implementa en la librería y después se consume desde la página.

La librería crece de manera incremental a partir de necesidades reales de páginas, en lugar de inventarse completa por anticipado.

Ejemplos:

- Button
- Badge
- Dropdown
- Modal
- Drawer
- controles de formulario
- DataTable
- Pagination
- PageHeader
- primitivas de navegación
- componentes de feedback/estado

Un único componente configurable debe servir a varias páginas mediante props/configuración, evitando duplicados específicos por página.

## Documentación

La documentación es un área de primera clase de la aplicación desde el inicio.

Cada componente reutilizable debe documentarse cuando se introduce, incluyendo variantes relevantes, estados, propiedades/configuración, comportamiento responsive y ejemplos.

La documentación y la galería de componentes deben crecer junto con la implementación.

## Regla de template de referencia

El archivo inicial de CORK es únicamente un catálogo de referencia funcional y visual.

Su tecnología de implementación, estructura fuente y estilos no son dependencias arquitectónicas de WebBlueprint.

Cada vista de referencia se clasificará antes de implementarse como:

- `KEEP`
- `ADAPT`
- `MERGE`
- `DISCARD`

CORK es el catálogo inicial, no el límite final del producto. Después de la primera fase de cobertura de referencia se realizará investigación adicional de vistas/patrones.

## Entrega y evidencia

El desarrollo es incremental y guiado por evidencia:

- control de versiones Git desde el primer cambio;
- ramas/PR pequeños;
- documentación viva de arquitectura e inventario;
- CI introducido durante la fundación;
- CD introducido temprano para que el estado actual de `main` pueda mantenerse públicamente demostrable mediante la infraestructura de EliasWorks.
