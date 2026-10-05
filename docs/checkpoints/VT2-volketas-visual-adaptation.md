# VT-2 · Volketas Visual Adaptation

Estado: **EN REVISIÓN**
Base apilada: `VT-1@63af042aeca2b5f88c137f8f0cec5bb8ba3e2e85`
Rama: `feat/volketas-template-vt2`

## Objetivo

Adaptar WebBlueprint para soportar la dirección visual aprobada de Volketas sin hardcodear comportamiento específico del producto dentro del shell.

Dirección aprobada:

- azul profundo / navy como estructura;
- naranja como acento;
- sidebar oscuro;
- superficies de contenido claras;
- semánticos existentes para éxito, advertencia y error;
- tipografía compacta ya usada por WebBlueprint;
- alta densidad informativa;
- evitar títulos y controles sobredimensionados.

## Extensión genérica del ThemePreset

Se agregan tokens opcionales y reutilizables:

- `accent`
- `accentHover`
- `accentSoft`
- `navigationBackground`
- `navigationText`
- `navigationMuted`
- `navigationBorder`
- `navigationActiveBackground`

Los themes existentes no necesitan declarar estos valores. ThemeProvider aplica fallbacks compatibles con el comportamiento visual anterior.

## Theme Volketas

El preset visual Volketas declara:

- primary/navy: `#0b2f4f`
- primary hover: `#082640`
- primary active: `#061e33`
- accent/orange: `#f97316`
- accent hover: `#ea580c`
- navigation background: `#0b2f4f`
- navigation text: `#e6eef5`
- navigation muted: `#9fb4c7`
- navigation border: `#163f62`
- navigation active background: `#143d5f`

## Shell

`TemplateSidebar` deja de asumir sidebar blanco y consume los tokens de navegación.

Esto permite:

- themes claros existentes con fallback;
- themes con sidebar oscuro;
- active indicator mediante accent;
- estados colapsados coherentes;
- reutilización en futuras plantillas.

No se introduce lógica condicional por nombre de producto.

## Composer Preview

La preview consume también:

- accent;
- navigation background;
- navigation text;
- navigation muted;
- navigation border;
- navigation active background.

Esto aproxima la identidad visual del manifest incluso antes de completar el renderizado de vistas reales.

## Preset recomendado

`ProjectPresetDefinition` incorpora opcionalmente `themeColorId`.

Al seleccionar un preset:

- si declara un theme recomendado, se aplica;
- si no lo declara, se conserva el theme actual.

El preset `volketas` recomienda automáticamente el theme `volketas`.

Esto es una capacidad general para futuras plantillas.

## Tipografía y densidad

VT-2 NO crea una escala tipográfica nueva.

Se conserva la densidad existente:

- metadata aproximada 9-11px;
- navegación aproximada 11.5px;
- body/controls compactos;
- títulos de página contenidos;
- sidebar de 232px expandido / 68px colapsado;
- topbar de 48px.

La referencia visual de Volketas se adapta al sistema existente en lugar de agrandar la aplicación para imitar una imagen promocional.

## Fuera de alcance

- rediseñar Dashboard con datos Volketas;
- aliases de navegación específicos por preset;
- Dispatch Board;
- Service Order Detail;
- Maintenance;
- Alert Center;
- nueva lógica de dominio;
- backend/API;
- app móvil;
- renderizado real completo dentro de Composer Preview;
- export ZIP completo del preset.

## Gate VT-2

- [x] theme Volketas navy + orange;
- [x] sidebar oscuro mediante tokens genéricos;
- [x] active states mediante accent reusable;
- [x] preview consume tokens visuales;
- [x] preset puede recomendar theme;
- [x] Volketas aplica su theme al seleccionarse;
- [x] no se hardcodea lógica por producto en shell;
- [ ] CI del HEAD exacto;
- [ ] aceptación visual;
- [ ] aprobación de merge del usuario.

## Próximo bloque

`VT-3 · Generic Blueprint Debt`

Pero antes de construir deuda genérica nueva debe realizarse un checkpoint de prioridad para decidir qué capacidades faltantes son necesarias para que la plantilla Volketas alcance su Target Product.

Orden candidato:

1. Dispatch Board
2. Service Order Detail
3. Operational Timeline
4. Alert Center
5. Asset Detail / Maintenance

No iniciar todas simultáneamente.

## Regla de retorno

Volketas sigue siendo el objetivo principal. WebBlueprint se modifica únicamente para capacidades reusable que desbloquean la plantilla; una vez terminada y exportada, el trabajo retorna inmediatamente al producto Volketas.
