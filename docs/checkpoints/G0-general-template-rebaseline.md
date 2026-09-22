# G0 · Rebaseline de WebBlueprint hacia plantilla UI general

Estado: **EN CIERRE**  
Base: `main@d4c49a149d969cd9f7ab8bf2e77a3f08e6d445b4`

## Objetivo

Corregir la dirección del producto en una sola PR documental y dejar listo el inicio inmediato de G1 sin prolongar G0.

## Decisiones cerradas

- [x] WebBlueprint se construye primero como plantilla administrativa/general completa.
- [x] Pet Shop deja de dirigir la implementación y queda congelado como experimento previo.
- [x] React.js + TypeScript + Tailwind CSS continúan como stack oficial.
- [x] La referencia visual pasa al lenguaje SERVAS compacto.
- [x] Densidad objetivo aproximada 80–85 % respecto al primer mock SERVAS.
- [x] Sidebar compacto con menor padding entre opciones.
- [x] El color verde es solo el tema inicial de referencia.
- [x] Todos los componentes deben ser `theme-safe by default`.
- [x] Colores de estado semántico permanecen independientes del color de marca.
- [x] Toda vista se compone de componentes reutilizables.
- [x] La etapa actual prioriza vistas navegables, no funcionalidad de negocio.
- [x] Se establece el roadmap G0–G17 con tareas marcables.
- [x] Se mantiene el despliegue canónico en `https://webblueprint.eliasworks.uy`.
- [x] Cada incremento visual importante debe desplegarse y revisarse antes de abrir la siguiente vista.

## Artefactos G0

- `docs/decisions/0007-general-template-rebaseline.md`
- `docs/roadmap/0002-general-ui-template-roadmap.md`
- `docs/roadmap/README.md`
- `docs/checkpoints/G0-general-template-rebaseline.md`

## Evidencia de CI

CI #125, ejecución `35685525348`, pasó completamente sobre el HEAD documental previo `09dbac8a37861a338bcc64335decc5d5ff314f49`:

- typecheck: PASS;
- lint: PASS;
- tests: PASS;
- build: PASS;
- smoke del proyecto React exportado: PASS;
- fallback SPA: PASS;
- preview de PR: PASS.

Este commit registra únicamente la evidencia de cierre. El gate final exige CI verde sobre el HEAD exacto resultante de este documento.

## Gate de cierre

G0 cierra cuando:

- [x] las decisiones anteriores están documentadas;
- [x] el roadmap vigente es inequívoco;
- [x] el ciclo por vista incluye CI → merge → deploy → revisión visual;
- [ ] CI pasa sobre el HEAD final de la PR;
- [ ] la PR queda Ready for review.

No se añade código de producto en G0.

## Siguiente paso

**G1 · Application Shell**

Primer incremento visual:

1. Topbar compacta;
2. Sidebar maestro completo con todas las categorías;
3. Page Shell;
4. Router con rutas pendientes navegables;
5. base de tokens de tema necesaria para que el shell no hardcodee el verde;
6. CI/merge/deploy;
7. revisión visual directa en `webblueprint.eliasworks.uy` antes de continuar con la siguiente vista.
