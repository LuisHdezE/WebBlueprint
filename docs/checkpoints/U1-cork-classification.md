# U1 · Inventario y clasificación de referencias CORK

Estado: **LISTO PARA REVISIÓN**  
Base: `main@1662f1bd7561369c0e58368d1648096ecba448d6`

## Objetivo

Convertir el inventario CORK v4 aprobado en decisiones explícitas de producto antes de implementar nuevas vistas.

## Alcance entregado

U1 cubre:

1. **U1.1 · Revisión funcional de páginas**: las 107 referencias están clasificadas como `ADAPT`, `MERGE` o `DISCARD`;
2. **U1.2 · Mapa de extracción de componentes**: primitivas y patrones reutilizables identificados sin construir una librería especulativa;
3. **U1.3 · Mapa de navegación y propiedad**: `page_key`, etiqueta, ruta sugerida, grupo, icono, visibilidad, orden, propiedad probable y metadata futura para las 26 vistas diferenciadas;
4. **U1.4 · Mapa de contratos mock**: fronteras de datos orientadas a UI para las vistas aceptadas.

## Fuente de verdad

La clasificación parte de:

- `docs/reference/cork-v4-reference-baseline.md`;
- `docs/reference/cork-v4-page-inventory.csv`;
- los tres shells aprobados: `collapsible-menu`, `vertical-dark-menu` y `vertical-light-menu`;
- Style 1 como baseline visual de WebBlueprint.

El archivo CORK original no forma parte del repositorio ni está disponible actualmente como adjunto reutilizable en esta sesión. Por tanto, U1 clasifica **la función representada por cada referencia inventariada**, sin afirmar una auditoría visual píxel a píxel del HTML original.

## Resultado U1.1

Las 107 referencias quedaron clasificadas:

- `ADAPT`: **26**;
- `MERGE`: **76**;
- `DISCARD`: **5**;
- `KEEP`: **0**;
- `REVIEW`: **0**.

La ausencia de `KEEP` es deliberada: CORK se usa como fuente de capacidades y patrones, no como baseline de implementación. Toda vista diferenciada aceptada debe adaptarse a Style 1, React, componentes propios, responsive mobile-first y contratos compartidos de WebBlueprint.

## Artefactos de U1

- inventario clasificado: `docs/reference/cork-v4-page-inventory.csv`;
- extracción: `docs/reference/cork-v4-component-extraction-map.md`;
- navegación/propiedad: `docs/reference/cork-v4-navigation-ownership-map.md`;
- datos mock: `docs/reference/cork-v4-mock-data-contract-map.md`.

## Regla de implementación posterior

U1 no implementa páginas nuevas.

Una referencia `MERGE` debe desembocar en un componente, patrón o vista existente/configurable. Una referencia `ADAPT` puede convertirse en vista diferenciada durante U2, pero solo después de que sus dependencias reutilizables estén identificadas y gobernadas.

## Evidencia de calidad

HEAD previo a este cierre documental:

`c8b00528ec0b45e7773a05ed066a693ab4c32bab`

GitHub Actions CI #101, ejecución `35642908005`: **PASS**.

Pasaron:

- instalación de dependencias;
- quality gate completo;
- smoke del proyecto React exportado;
- verificación del fallback SPA;
- preview de PR.

El diff previo al cierre contenía únicamente cinco archivos dentro de `docs/`: cuatro artefactos de referencia/checkpoint y el CSV clasificado. No se introdujo implementación de U2.

## Gate de cierre

- 107 filas sin `REVIEW`: **PASS**;
- razón humana en español para cada fila: **PASS**;
- mapa de extracción: **PASS**;
- mapa de navegación/propiedad: **PASS**;
- mapa de contratos mock: **PASS**;
- implementación prematura de U2: **NO**;
- CI sobre implementación U1: **PASS**;
- CI final sobre este HEAD documental: **PENDIENTE**.

PR #10 puede salir de Draft únicamente cuando el CI final quede verde sobre este commit exacto. El merge requiere aprobación explícita del usuario.
