# Roadmap vigente · Composer-first

Estado: **ACTIVO**  
Fecha: **2026-09-22**  
Reemplaza como orden conductor a `0002-general-ui-template-roadmap.md`, que permanece como historial del rebaseline visual.

## Decisión de producto

Tras cerrar el shell G1, WebBlueprint deja de ser solamente un catálogo navegable y empieza a comportarse como generador de aplicaciones. El catálogo maestro sigue mostrando todo lo disponible, pero el trabajo inmediato pasa al Composer para poder seleccionar un subconjunto de vistas, definir identidad y tema, previsualizar exactamente esa selección y exportarla desde el mismo estado.

La regla central es:

> **Selección = Preview = Export.**

No existirán configuraciones paralelas para estas tres superficies. Todas consumen el mismo `BlueprintProjectManifest`.

Además, la exportación queda gobernada por `docs/decisions/0008-contract-first-export-architecture.md`:

> **WebBlueprint exporta una aplicación mantenible, no una maqueta ni un JSON aislado.**

## G1 · Application Shell

Estado: **CERRADO VISUALMENTE**.

Baseline publicado:

- topbar compacta;
- sidebar ERP compacto;
- 12 familias / 96 rutas del catálogo maestro;
- grupos desplegables automáticos;
- 9 colores theme-safe;
- responsive desktop/móvil;
- destino canónico `https://webblueprint.eliasworks.uy`.

## G2 · Composer Foundation

### G2.1 Project Manifest + selección

- [x] contrato `BlueprintProjectManifest` v1;
- [x] nombre de aplicación;
- [x] logo;
- [x] favicon / ICO;
- [x] tema de aplicación;
- [x] vistas de aplicación seleccionables;
- [x] Componentes, Elementos, Formularios y Tablas excluidos de la selección como páginas;
- [x] selección por familia;
- [x] orden editable de vistas;
- [x] persistencia local del borrador;
- [x] presets editables;
- [x] detección de preset modificado.

### G2.2 Preview aislada

- [x] abrir en nueva pestaña;
- [x] usar identidad del proyecto;
- [x] aplicar tema elegido;
- [x] mostrar únicamente vistas seleccionadas en sidebar;
- [x] recorrer la secuencia con anterior/siguiente;
- [ ] renderizar las vistas reales a medida que el catálogo deje de ser placeholder.

### G2.3 Exportación ZIP v1

Salida principal esperada: **aplicación React independiente en ZIP**.

- [x] existe un motor ZIP previo reutilizable;
- [ ] conectar ese motor al `BlueprintProjectManifest` v1 actual;
- [ ] botón principal `Exportar aplicación ZIP`;
- [ ] manifest incluido dentro del ZIP como metadata, no como producto final aislado;
- [ ] incluir nombre, logo, favicon y tema seleccionados;
- [ ] generar únicamente rutas, navegación, features y dependencias internas elegidas;
- [ ] mantener exactamente el mismo orden de Preview;
- [ ] estructura Clean Architecture pragmática y feature-first;
- [ ] TypeScript `strict` y separación clara de domain/application/infrastructure/presentation;
- [ ] shared UI reutilizable sin convertir componentes en rutas;
- [ ] README y documentación de arquitectura dentro del proyecto generado;
- [ ] ZIP reproducible;
- [ ] smoke real: descomprimir, `npm ci`, tests y `npm run build`.

### G2.4 Datos mock contract-first

Las vistas reales no contendrán datos hardcodeados.

- [ ] definir contratos/DTOs tipados por feature;
- [ ] datos de ejemplo en JSON fuera de Presentation;
- [ ] adapters/repositories JSON para la fase actual;
- [ ] contrato reemplazable por adapters HTTP/API en el futuro;
- [ ] mocks con la misma forma esperada de la API;
- [ ] mappers cuando DTO y modelo interno difieran;
- [ ] estados loading/success/empty/error controlables;
- [ ] paginación/filtros/ordenamiento incluidos en contratos cuando apliquen;
- [ ] tests de conformidad mock ↔ contrato;
- [ ] artefactos `contracts/` u `openapi/` cuando los contratos estén suficientemente estabilizados.

Regla de integración futura:

```text
WebBlueprint contract
      ↓
JSON mock
      ↓
Frontend
      ↓
API futura
```

La API deberá cumplir estos contratos o introducir una nueva versión explícita. La capa de presentación no deberá cambiar al sustituir JSON local por HTTP.

### G2.5 Presets / plantillas

- [x] Aplicación vacía;
- [x] Ecommerce;
- [x] CRM;
- [x] ERP administrativo;
- [x] Contenido / Blog;
- [ ] ampliar presets con nuevas aplicaciones a medida que existan vistas reales.

## Relación futura con ApiBlueprint

Los contratos estabilizados por WebBlueprint se usarán como input para el diseño posterior del backend. OpenAPI/Swagger y contract tests deberán demostrar que la API real devuelve la estructura que las vistas ya consumen.

El objetivo es que pasar de mocks a backend sea un cambio de infraestructura/fuente, no una reescritura de UI.

## Después de G2

Se retoma la construcción visual del catálogo por componentes y vistas, conservando los bloques de `0002-general-ui-template-roadmap.md` como inventario. La numeración posterior se decidirá al cerrar G2 para evitar renumerar documentación histórica sin necesidad.

Cada nueva vista deberá registrarse en el catálogo maestro de forma que el Composer la herede automáticamente como opción seleccionable y, cuando consuma datos, deberá registrar simultáneamente su contrato y fuente mock.
