# G1 · Application Shell

Estado: **EN CIERRE VISUAL**  
Base original: `main@88233e7c409d8707d794507525d4134542a1ebcc`  
Base del refinamiento visual: `main@c508abdc5c1e3e9ce815cbd6efe81a0f71fb9ff3`

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

## Fuera de alcance

- componentes completos de G3/G4;
- formularios, tablas y aplicaciones finales;
- lógica de negocio;
- Theme Builder avanzado;
- Composer, presets y exportación nuevos;
- continuación de Pet Shop.

## Evidencia de implementación inicial

HEAD funcional validado: `78b51b7cfc355b4b2eb84a8dcce96d46e6f2bb6a`.

CI #132, ejecución `35687279917`: **PASS**.

Pasaron:

- typecheck;
- lint;
- tests;
- build;
- smoke del proyecto React exportado;
- fallback SPA;
- preview de PR.

Durante el incremento el gate detectó y obligó a corregir dos incompatibilidades reales sin relajar reglas:

1. uso no soportado de `defaultOpen` en `<details>` bajo React 19;
2. separación de `ThemeProvider` y contexto para cumplir `react-refresh/only-export-components`.

## Gate de cierre visual

G1 puede cerrarse visualmente cuando:

- [ ] CI pasa sobre el HEAD final del refinamiento;
- [x] el diff permanece limitado al shell, tema y documentación de G1;
- [ ] la PR queda Ready for review;
- [ ] el refinamiento es mergeado con aprobación explícita;
- [ ] CI de `main` pasa;
- [ ] el deploy canónico termina en SUCCESS;
- [ ] el usuario revisa el resultado publicado en `https://webblueprint.eliasworks.uy`.

No se inicia G2 hasta completar este gate.
