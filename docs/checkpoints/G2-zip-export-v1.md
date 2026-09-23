# G2 · ZIP Export v1

Estado: **IMPLEMENTADO EN RAMA · PENDIENTE DE CI / MERGE / RUNTIME**  
Fecha: **2026-09-22**  
Base: `main@1b1f7b1cda4c65a479698ac0a0004b9a64d5c57b`  
Rama: `g2/zip-export-v1`

## Objetivo

Conectar el motor ZIP existente al `BlueprintProjectManifest` v1 oficial sin mantener un estado paralelo y convertir la exportación en una aplicación React independiente, mantenible y contract-first.

Regla gobernante:

> **Selección = Preview = Export.**

ADR gobernante: `docs/decisions/0008-contract-first-export-architecture.md`.

## Auditoría del legado

Se determinó que:

- `src/export/export.zip.ts` es reutilizable: opera sobre archivos genéricos y no depende del manifest legacy;
- `src/export/export.engine.ts` estaba acoplado a `ComposerManifest 0.2` y debía migrarse;
- `src/export/ComposerExportPanel.tsx` reconstruía el compositor legacy desde `localStorage` y debía pasar al manifest v1;
- los tests de determinismo ZIP y smoke real eran reutilizables como patrón de quality gate;
- `getSelectedProjectViews(project.views)` es la fuente correcta para conservar exactamente la selección y el orden de Preview.

## Implementación de la rama

- motor de exportación consume `BlueprintProjectManifest 1.0`;
- nombre de proyecto/ZIP derivado del nombre de aplicación;
- `webblueprint.json` se conserva dentro del ZIP como metadata;
- logo y favicon se conservan como data URL y se usan en la aplicación generada;
- el theme seleccionado se materializa en CSS real;
- solo se generan las vistas seleccionadas y en el orden del manifest;
- cada vista seleccionada genera una feature con capas `application`, `infrastructure` y `presentation`;
- Presentation depende del contrato de repository y no importa JSON, `fetch()`, `localStorage` ni implementaciones de infraestructura;
- `src/app/providers` actúa como composition root y conecta repositories con adapters JSON;
- se generan `core/contracts`, `core/domain`, `shared/ui`, `shell` y `theme`;
- se incluye `contracts/view-content-v1.schema.json` como contrato exportable inicial;
- se incluyen JSON mocks deterministas en infraestructura;
- se incluyen `README.md` y `docs/architecture.md` dentro del proyecto generado;
- el proyecto generado incluye scripts de typecheck, lint, tests, build y `npm run check`;
- el smoke real fue actualizado para ejecutar `unzip`, `npm ci` y `npm run check`;
- `/composer` expone `Exportar aplicación ZIP` y el compositor legacy permanece aislado en `/legacy/composer/*`.

## Gates automáticos esperados

En WebBlueprint:

- typecheck;
- lint;
- tests unitarios del engine;
- build;
- determinismo byte-a-byte del ZIP.

En smoke de exportación:

1. generar ZIP real;
2. descomprimir;
3. `npm ci`;
4. `npm run check` dentro de la aplicación generada;
5. comprobar `webblueprint.json`;
6. comprobar contrato y documentación;
7. comprobar `dist/index.html`.

## Estado de aceptación

- [x] auditoría read-only del motor legacy;
- [x] escritor ZIP preservado;
- [x] engine migrado a `BlueprintProjectManifest v1`;
- [x] selección y orden derivados del mismo manifest que Preview;
- [x] arquitectura feature-first generada;
- [x] mocks JSON fuera de Presentation;
- [x] contrato JSON Schema incluido;
- [x] identidad y theme incluidos;
- [x] panel ZIP conectado a `/composer`;
- [x] tests del engine migrados;
- [x] smoke del proyecto generado actualizado;
- [ ] CI de PR SUCCESS;
- [ ] revisión de HEAD exacto y aprobación explícita para merge;
- [ ] CI de `main` SUCCESS;
- [ ] deploy canónico SUCCESS;
- [ ] runtime/visual acceptance del Composer y ZIP generado.

No se debe marcar G2 ZIP Export v1 como cerrado hasta completar los gates pendientes.
