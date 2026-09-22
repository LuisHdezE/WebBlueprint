# G1 · Application Shell

Estado: **EN CIERRE**  
Base: `main@88233e7c409d8707d794507525d4134542a1ebcc`

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
- [x] Selector mínimo con seis colores para validar `theme-safe by default` desde G1.
- [x] Verde SERVAS como preset inicial, no como hardcode de producto.
- [x] Código React.js + TypeScript + Tailwind CSS.
- [x] Registro de navegación cubierto por test de unicidad y familias.

## Fuera de alcance

- componentes completos de G3/G4;
- formularios, tablas y aplicaciones finales;
- lógica de negocio;
- Theme Builder avanzado;
- Composer, presets y exportación nuevos;
- continuación de Pet Shop.

## Evidencia de implementación

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

## Gate de cierre

G1 puede pasar a Ready for review cuando:

- [ ] CI pasa sobre el HEAD documental final;
- [x] el diff permanece limitado al shell, tema, router, navegación y documentación de G1;
- [ ] la PR queda Ready for review.

Después del merge:

1. CI de `main` debe pasar;
2. el deploy canónico debe terminar en SUCCESS;
3. se revisa el resultado en `https://webblueprint.eliasworks.uy`;
4. no se inicia la siguiente vista hasta recibir la revisión visual del usuario.
