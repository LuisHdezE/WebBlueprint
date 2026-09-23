# G2 · Composer Foundation

Estado: **EN PROGRESO**  
Base: `main@0343eeeea99b392104cbe2cf2c10f9bb15a9f42e`  
Rama inicial: `g2/composer-foundation`

## Objetivo

Convertir WebBlueprint de catálogo maestro a generador configurable sin duplicar estado entre selección, preview y exportación.

Regla de arquitectura:

> **Selección = Preview = Export.**

## Alcance del primer incremento

- [x] `BlueprintProjectManifest` v1.
- [x] identidad: nombre, logo y favicon/ICO.
- [x] selección de uno de los 9 temas existentes.
- [x] presets editables: vacía, Ecommerce, CRM, ERP administrativo, Contenido/Blog.
- [x] selección de vistas de aplicación desde el catálogo maestro.
- [x] `Componentes`, `Elementos`, `Formularios` y `Tablas` permanecen como bibliotecas reutilizables y no forman parte de la selección/exportación de vistas.
- [x] selección de familia completa.
- [x] secuencia editable de vistas.
- [x] persistencia local del proyecto.
- [x] acceso a Composer desde el topbar del catálogo.
- [x] preview aislada en nueva pestaña.
- [x] preview muestra solo vistas seleccionadas en navegación.
- [x] preview consume nombre, logo, favicon y tema del proyecto.
- [x] recorrido Anterior/Siguiente usa la secuencia seleccionada.
- [x] descarga del mismo Blueprint Manifest desde la pantalla de selección.
- [ ] exportación React ZIP conectada al manifest v1.
- [ ] render de las vistas reales dentro de preview cuando dejen de ser placeholders.

## Límite entre vistas y biblioteca reutilizable

El catálogo maestro puede contener tanto pantallas completas como piezas de construcción. El Composer solo permite seleccionar pantallas que formen parte de la aplicación resultante.

Quedan fuera de la selección de vistas:

- `Componentes`;
- `Elementos`;
- `Formularios`;
- `Tablas`.

Estas familias siguen disponibles dentro de WebBlueprint para documentar, componer y reutilizar piezas en las vistas reales. No generan entradas de navegación por sí mismas y no deben aparecer en el manifest como pantallas exportables.

Los presets deben respetar la misma frontera. Un preset puede usar internamente esas piezas al construir una vista, pero solo marca las vistas finales que aparecerán en la aplicación.

## Preservación de legado

El compositor anterior se conserva temporalmente bajo `/legacy/composer/*`. La nueva experiencia oficial entra por `/composer` y forma parte del shell actual.

## Gate de este incremento

- [x] typecheck PASS en PR #19.
- [x] lint PASS en PR #19.
- [x] tests PASS en PR #19.
- [x] build PASS en PR #19.
- [x] preview artifact PASS en PR #19.
- [x] PR #19 mergeada.
- [x] CI de `main` PASS.
- [x] deploy canónico SUCCESS.
- [~] revisión visual/funcional en producción y ajustes de frontera de selección.

No se conecta todavía el ZIP React hasta validar primero el circuito identidad → selección → preview → manifest en producción.
