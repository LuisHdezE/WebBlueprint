# Baseline visual · Style 1

Estado: **Aprobado, refinado por feedback de densidad/color en U0.2**  
Aprobación inicial: **2026-09-20**  
Refinamiento: **2026-09-21**

## Referencia

Identificador del concepto generado aprobado:

`975b04ed-721b-4158-9846-9af11492e0dc`

Este concepto continúa siendo el baseline visual de WebBlueprint, refinado mediante feedback explícito del usuario durante U0.2.

## Lenguaje de diseño

- Interfaz light-first.
- Presentación limpia, profesional y contenida.
- Fondo de aplicación neutro y muy claro.
- Superficies blancas/claras con separación sutil mediante bordes.
- Radios de esquina suaves y moderados, evitando un uso exagerado de píldoras.
- Elevación mínima y sombras discretas.
- Jerarquía tipográfica fuerte y predecible.
- **Espaciado compacto y eficiente en lugar de whitespace decorativo.**
- **Densidad de información útil apropiada para aplicaciones de negocio.**
- **La escala de titulares debe permanecer contenida; el H1 de la landing no debe dominar el viewport.**
- Iconos simples y consistentes.
- Los colores de estado pueden comunicar significado semántico de forma independiente al acento de marca configurable.

## Refinamiento visual de U0.2

La primera preview visible en navegador de U0.2 generó feedback explícito: la implementación inicial desperdiciaba demasiado espacio de pantalla y utilizaba un tratamiento primario cercano al negro demasiado dominante.

La dirección gobernada se refinó así:

### Densidad

- priorizar contenido útil por viewport;
- evitar padding y gaps sobredimensionados en secciones y cards;
- mantener topbars y sidebars suficientemente compactos para interfaces de productividad;
- reducir whitespace vertical decorativo;
- preferir proporciones/radios compactos en cards preservando áreas táctiles y legibilidad;
- mostrar contenido importante de aplicación above the fold cuando sea práctico.

### Tipografía

- evitar tipografía de marketing sobredimensionada;
- el H1 de la landing apunta aproximadamente a `text-3xl` en móvil, `text-4xl` en tablet y `text-5xl` como máximo en desktop dentro del sistema actual;
- los títulos de sección suelen estar entre `text-2xl` y `text-3xl`;
- los títulos de aplicación/workspace deben priorizar jerarquía de contenido sobre espectacularidad.

### Color

El casi negro **no** es el color primario/CTA predeterminado.

La familia actual de tokens de marca por defecto de WebBlueprint es un azul fresco:

- `brand-50`: `#eff6ff`;
- `brand-100`: `#dbeafe`;
- `brand-500`: `#3b82f6`;
- `brand-600`: `#2563eb`;
- `brand-700`: `#1d4ed8`;
- `brand-800`: `#1e40af`.

El slate oscuro sigue siendo apropiado para texto legible y para la variante opcional `vertical-dark-menu`, pero no debe dominar la experiencia pública/producto por defecto.

Por tanto, el lenguaje visual predeterminado usa:

- azul fresco para acciones primarias y estados activos;
- slate para jerarquía de texto;
- blanco y superficies slate/azules muy claras;
- verde/ámbar/rojo semánticos únicamente para sus estados correspondientes.

El color de marca continúa siendo configurable por las aplicaciones generadas. Los componentes deben consumir tokens de tema gobernados en lugar de dispersar colores primarios hardcoded.

## Estable frente a configurable

### Estable

Los siguientes elementos forman parte del lenguaje visual de WebBlueprint y no deben rediseñarse por cada aplicación generada:

- proporciones de componentes;
- sistema de espaciado;
- escala tipográfica;
- radios;
- estructura del shell;
- tratamiento de cards;
- tamaño de formularios/controles;
- comportamiento de tablas;
- comportamiento de navegación;
- patrones responsive;
- sistema de elevación/sombras.

### Configurable

Las aplicaciones generadas pueden configurar:

- nombre de aplicación;
- descripción de aplicación;
- logo/marca;
- color de tema/acento primario;
- tokens de color derivados del tema;
- variante clara/oscura del shell donde el sistema final la soporte.

## Intención del shell

La navegación de desktop/tablet permanece a la izquierda.

WebBlueprint soporta su propio comportamiento de shell lateral izquierdo inspirado funcionalmente por:

- CORK `collapsible-menu`;
- CORK `vertical-light-menu`;
- CORK `vertical-dark-menu`.

Son solo referencias funcionales. WebBlueprint mantiene Style 1 como autoridad visual.

La experiencia predeterminada es clara y fresca. `vertical-dark-menu` continúa como variante explícita seleccionable, no como lenguaje visual por defecto.

## Regla mobile-first

El baseline incluye una experiencia móvil de primera clase. Los layouts de desktop no se limitan a comprimirse en pantallas pequeñas.

Navegación, presentación de DataTable, filtros, formularios, overlays, cards, acciones y áreas densas de información deben definir cada una un comportamiento móvil intencional.
