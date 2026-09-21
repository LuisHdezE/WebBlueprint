# U1 · Inventario y clasificación de referencias CORK

Estado: **ACTIVO**  
Base: `main@1662f1bd7561369c0e58368d1648096ecba448d6`

## Objetivo

Convertir el inventario CORK v4 aprobado en decisiones explícitas de producto antes de implementar nuevas vistas.

## Alcance

U1 cubre:

1. **U1.1 · Revisión funcional de páginas**: clasificar las 107 referencias como `KEEP`, `ADAPT`, `MERGE` o `DISCARD`;
2. **U1.2 · Mapa de extracción de componentes**: identificar primitivas y patrones reutilizables;
3. **U1.3 · Mapa de navegación y propiedad**: definir identidad de página, grupo, visibilidad y pertenencia probable;
4. **U1.4 · Mapa de contratos mock**: definir fronteras de datos orientadas a UI para las vistas aceptadas.

## Fuente de verdad

La clasificación parte de:

- `docs/reference/cork-v4-reference-baseline.md`;
- `docs/reference/cork-v4-page-inventory.csv`;
- los tres shells aprobados: `collapsible-menu`, `vertical-dark-menu` y `vertical-light-menu`;
- Style 1 como baseline visual de WebBlueprint.

El archivo CORK original no forma parte del repositorio ni está disponible actualmente como adjunto reutilizable en esta sesión. Por tanto, este incremento clasifica **la función representada por cada referencia inventariada**, sin afirmar una auditoría visual píxel a píxel del HTML original.

## Resultado inicial U1.1

Las 107 referencias quedaron clasificadas:

- `ADAPT`: **26**;
- `MERGE`: **76**;
- `DISCARD`: **5**;
- `KEEP`: **0**.

La ausencia de `KEEP` es deliberada: CORK se usa como fuente de capacidades y patrones, no como baseline de implementación. Toda vista diferenciada aceptada debe adaptarse a Style 1, React, componentes propios, responsive mobile-first y contratos compartidos de WebBlueprint.

## Regla de implementación posterior

U1 no implementa páginas nuevas.

Una referencia clasificada como `MERGE` debe desembocar en un componente, patrón o vista existente/configurable. Una referencia `ADAPT` puede convertirse en vista diferenciada durante U2, pero solo después de que sus dependencias reutilizables estén identificadas y gobernadas.

## Gate de cierre

U1 queda listo para revisión cuando:

- las 107 filas no contengan `REVIEW`;
- cada decisión tenga una razón humana en español;
- exista mapa de extracción de componentes;
- exista mapa de navegación/propiedad para las vistas diferenciadas;
- exista mapa de contratos mock para las vistas impulsadas por datos;
- CI permanezca verde;
- no se haya introducido implementación prematura de U2.
