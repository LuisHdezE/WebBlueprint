# G1 · Application Shell

Estado: **CERRADO**  
Base original: `main@88233e7c409d8707d794507525d4134542a1ebcc`  
Base del refinamiento visual: `main@c508abdc5c1e3e9ce815cbd6efe81a0f71fb9ff3`  
Cierre final: `main@0343eeeea99b392104cbe2cf2c10f9bb15a9f42e`

## Objetivo

Construir la primera superficie visual del nuevo WebBlueprint General UI Template y publicarla antes de comenzar cualquier otra vista.

## Alcance G1 entregado

- [x] Topbar compacta de 48 px.
- [x] Sidebar maestro de 232 px con densidad reducida.
- [x] Sidebar colapsable en desktop.
- [x] Sidebar como drawer en móvil.
- [x] Navegación maestra con 12 familias y 96 rutas visuales registradas.
- [x] Page Shell común con breadcrumbs, título y descripción.
- [x] Router del General Template.
- [x] Vistas todavía no construidas representadas por un estado pendiente navegable.
- [x] Tokens de color de marca separados de superficies y colores semánticos.
- [x] Selector mínimo con nueve colores para validar `theme-safe by default` desde G1.
- [x] Verde SERVAS como preset inicial, no como hardcode de producto.
- [x] Código React.js + TypeScript + Tailwind CSS.
- [x] Registro de navegación cubierto por test de unicidad y familias.

## Refinamiento visual de cierre

Feedback visual del usuario recibido el **2026-09-22**:

- el sidebar completo debe acercarse al lenguaje visual de una navegación ERP/administrativa compacta;
- eliminar cualquier tratamiento de numeración decorativa en la navegación del Blueprint;
- mostrar encabezados de sección pequeños, sobrios y en mayúsculas;
- usar filas de navegación densas con iconografía discreta;
- el estado activo debe utilizar el color del tema mediante tokens, con fondo suave y acento lateral;
- el color de marca no debe quedar soldado a un preset concreto;
- la navegación completa debe seguir disponible y desplazable;
- el drawer móvil debe conservar la navegación expandida incluso si el sidebar desktop estaba colapsado.

Ajuste final solicitado en la misma revisión:

- ampliar el selector rápido de tema de seis a nueve presets, añadiendo Turquesa, Cian y Rojo;
- evitar que familias como Aplicaciones crezcan como listas planas cuando existan varios elementos de una misma categoría;
- cuando dos o más rutas compartan el patrón visible `Categoría · Vista`, el sidebar debe agruparlas automáticamente bajo una lista desplegable `Categoría`;
- dentro del desplegable solo se muestra el nombre de la vista, por ejemplo `Ecommerce → Productos / Tienda / Detalle / Editor`;
- la agrupación es genérica para que futuras categorías se beneficien sin rediseñar el shell.

El refinamiento mantiene intacto el alcance funcional de G1 y no reabre Pet Shop ni las áreas legacy congeladas.

## Fuera de alcance de G1

- componentes completos posteriores;
- formularios, tablas y aplicaciones finales;
- lógica de negocio;
- Composer, presets y exportación, que pasan a G2.

## Evidencia de cierre

- PR #17: refinamiento ERP del sidebar, mergeada.
- PR #18: agrupación de categorías + paleta de nueve colores, mergeada.
- HEAD final de G1: `0343eeeea99b392104cbe2cf2c10f9bb15a9f42e`.
- CI #140, ejecución `35799592444`: **SUCCESS**.
- Deploy #67, ejecución `35799638927`: **SUCCESS**.
- Destino canónico: `https://webblueprint.eliasworks.uy`.
- Revisión visual del usuario: **APROBADA** el 2026-09-22.

## Gate de cierre visual

- [x] CI pasa sobre el HEAD final del refinamiento.
- [x] el diff permanece limitado al shell, tema y documentación de G1.
- [x] la PR queda Ready for review.
- [x] el refinamiento es mergeado con aprobación explícita.
- [x] CI de `main` pasa.
- [x] el deploy canónico termina en SUCCESS.
- [x] el usuario revisa y aprueba el resultado publicado.

G1 queda cerrado. El trabajo conductor continúa en **G2 · Composer Foundation**.
