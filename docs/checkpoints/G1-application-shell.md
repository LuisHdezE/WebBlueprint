# G1 · Application Shell

Estado: **EN IMPLEMENTACIÓN**  
Base: `main@88233e7c409d8707d794507525d4134542a1ebcc`

## Objetivo

Construir la primera superficie visual del nuevo WebBlueprint General UI Template y publicarla antes de comenzar cualquier otra vista.

## Alcance G1

- [x] Topbar compacta de 48 px.
- [x] Sidebar maestro de 232 px con densidad reducida.
- [x] Sidebar colapsable en desktop.
- [x] Sidebar como drawer en móvil.
- [x] Navegación maestra con todas las familias y 96 rutas visuales registradas.
- [x] Page Shell común con breadcrumbs, título y descripción.
- [x] Router del General Template.
- [x] Vistas todavía no construidas representadas por un estado pendiente navegable.
- [x] Tokens de color de marca separados de superficies y colores semánticos.
- [x] Selector mínimo de color para validar `theme-safe by default` desde G1.
- [x] Verde SERVAS como preset inicial, no como hardcode de producto.
- [x] Código React.js + TypeScript + Tailwind CSS.

## Fuera de alcance

- componentes completos de G3/G4;
- formularios, tablas y aplicaciones finales;
- lógica de negocio;
- Theme Builder avanzado;
- Composer, presets y exportación nuevos;
- continuación de Pet Shop.

## Gate de cierre

G1 puede pasar a Ready for review cuando:

- [ ] CI pasa sobre el HEAD final;
- [ ] el diff permanece limitado al shell, tema, router, navegación y documentación de G1;
- [ ] la PR queda Ready for review.

Después del merge:

1. CI de `main` debe pasar;
2. el deploy canónico debe terminar en SUCCESS;
3. se revisa el resultado en `https://webblueprint.eliasworks.uy`;
4. no se inicia la siguiente vista hasta recibir la revisión visual del usuario.
