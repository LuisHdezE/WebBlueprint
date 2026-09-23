# G2 · Composer Foundation

Estado: **EN PROGRESO**  
Base inicial: `main@0343eeeea99b392104cbe2cf2c10f9bb15a9f42e`  
Rama inicial: `g2/composer-foundation`

## Objetivo

Convertir WebBlueprint de catálogo maestro a generador configurable sin duplicar estado entre selección, preview y exportación.

Regla de arquitectura:

> **Selección = Preview = Export.**

## Alcance ya implementado

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
- [x] descarga técnica del mismo Blueprint Manifest desde la pantalla de selección.

## Límite entre vistas y biblioteca reutilizable

El catálogo maestro puede contener tanto pantallas completas como piezas de construcción. El Composer solo permite seleccionar pantallas que formen parte de la aplicación resultante.

Quedan fuera de la selección de vistas:

- `Componentes`;
- `Elementos`;
- `Formularios`;
- `Tablas`.

Estas familias siguen disponibles dentro de WebBlueprint para documentar, componer y reutilizar piezas en las vistas reales. No generan entradas de navegación por sí mismas y no deben aparecer en el manifest como pantallas exportables.

Los presets deben respetar la misma frontera. Un preset puede usar internamente esas piezas al construir una vista, pero solo marca las vistas finales que aparecerán en la aplicación.

## Baseline ratificado para Export ZIP

ADR gobernante: `docs/decisions/0008-contract-first-export-architecture.md`.

El resultado principal de exportación no será un JSON aislado. El Composer debe generar una aplicación React independiente dentro de un ZIP.

El ZIP debe conservar, desde el mismo `BlueprintProjectManifest`:

- nombre de aplicación;
- logo;
- favicon/ICO;
- tema;
- vistas seleccionadas;
- orden de esas vistas;
- grupos y navegación derivados de la selección;
- únicamente las features y dependencias internas necesarias.

El `webblueprint.json`/manifest viajará dentro del ZIP como metadata y trazabilidad.

Regla de aceptación:

> Si Preview muestra N vistas, Export debe producir una aplicación con exactamente esas N vistas y esa misma navegación.

### Arquitectura del proyecto generado

La aplicación exportada debe seguir una Clean Architecture pragmática y feature-first, con separación entre:

- `app` / bootstrap, router y providers;
- domain/application/contracts;
- infrastructure/adapters;
- presentation;
- `shared/ui` para componentes reutilizables;
- shell y theme.

Las vistas no deben depender directamente de implementaciones de infraestructura.

El proyecto generado debe estar preparado para TypeScript `strict`, lint, tests, build y reglas de arquitectura.

## Baseline ratificado para datos y futura API

Las vistas pueden y deben mostrar datos realistas durante la fase de Blueprint, pero esos datos **no estarán hardcodeados dentro de los componentes**.

Flujo obligatorio:

```text
Vista
  ↓
Application / Use Case
  ↓
Repository/Provider contract
  ├── JSON local / mock adapter     ← fase actual
  └── HTTP/API adapter              ← fase futura
```

Los archivos JSON locales deben respetar la misma estructura contractual que se espera que entregue la futura API.

Por tanto:

- la vista no importa JSON directamente;
- la vista no ejecuta `fetch()` directamente;
- la vista no conoce si la fuente es JSON o HTTP;
- DTOs/mappers pertenecen a la frontera de infraestructura cuando sean necesarios;
- loading, success, empty y error deben poder representarse de forma controlada;
- cuando aplique, los contratos contemplarán paginación, filtros y ordenamiento;
- los mocks serán deterministas y validables contra el contrato.

### Contract-first con la API futura

Los contratos que WebBlueprint establezca para sus vistas serán la referencia para diseñar posteriormente la API.

```text
WebBlueprint define contrato
        ↓
JSON mock cumple contrato
        ↓
Frontend consume contrato
        ↓
API futura implementa contrato
```

Cuando se construya el backend, OpenAPI/Swagger y los contract tests deberán verificar que la API cumple esos contratos o que cualquier cambio se introduce mediante versionado explícito.

La diferencia esperada entre la fase actual y la integración futura debe ser la **fuente de los datos**, no la forma consumida por la presentación.

## Próximo incremento de G2

- [ ] conectar el nuevo `BlueprintProjectManifest` al motor ZIP existente;
- [ ] convertir `Exportar aplicación ZIP` en la salida principal del Composer;
- [ ] mantener el manifest dentro del ZIP;
- [ ] generar estructura Clean Architecture/feature-first;
- [ ] generar únicamente las vistas/features seleccionadas;
- [ ] generar JSON mocks contract-first fuera de Presentation;
- [ ] incluir contratos/documentación de datos en el proyecto generado;
- [ ] incluir logo/favicon y theme reales;
- [ ] smoke real del ZIP: descomprimir, `npm ci`, tests y `npm run build`;
- [ ] renderizar progresivamente las vistas reales a medida que dejen de ser placeholders.

## Preservación de legado

El compositor anterior se conserva temporalmente bajo `/legacy/composer/*`. La nueva experiencia oficial entra por `/composer` y forma parte del shell actual.

El motor ZIP anterior existe como activo técnico reutilizable, pero no constituye el contrato final de G2 hasta que consuma el `BlueprintProjectManifest` v1 y respete esta arquitectura ratificada.

## Gate de G2 hasta el momento

- [x] PR #19 Composer Foundation mergeada.
- [x] CI y deploy canónico post PR #19 SUCCESS.
- [x] PR #20 frontera de vistas/biblioteca mergeada.
- [x] CI y deploy canónico post PR #20 SUCCESS.
- [x] baseline contract-first y arquitectura de exportación ratificados documentalmente.
- [ ] ZIP Export v1 conectado al Composer actual.
- [ ] runtime/visual acceptance del ZIP Export v1.

La revisión visual/funcional del Composer continúa, pero el siguiente bloque funcional prioritario es la generación de la aplicación ZIP bajo estas reglas.
