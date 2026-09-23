# ADR 0008 · Exportación contract-first y arquitectura de proyectos generados

Estado: **ACEPTADA**  
Fecha: **2026-09-22**

## Contexto

WebBlueprint ya permite definir identidad, tema, preset y selección de vistas mediante un `BlueprintProjectManifest`. El siguiente paso de producto no es entregar únicamente ese JSON, sino generar una aplicación React independiente en ZIP a partir de la misma selección.

El proyecto generado debe poder evolucionar hacia una aplicación real sin obligar a reescribir sus vistas cuando aparezca una API backend. También debe conservar la disciplina de arquitectura, calidad y separación de responsabilidades acordada para WebBlueprint.

## Decisión

WebBlueprint adopta como baseline de exportación los siguientes principios obligatorios.

### 1. El producto de exportación es una aplicación, no un JSON aislado

El botón principal de exportación debe generar un ZIP compilable y ejecutable de la aplicación seleccionada.

El `BlueprintProjectManifest` se conserva dentro del ZIP como metadata y trazabilidad, pero no constituye por sí solo el resultado final para el usuario.

La regla sigue siendo:

> **Selección = Preview = Export.**

Si Preview contiene N vistas en cierto orden, la aplicación exportada debe contener exactamente esas N vistas y ese mismo orden de navegación.

### 2. Clean Architecture pragmática y feature-first

Los proyectos generados deben organizarse con una separación clara de responsabilidades, evitando que la presentación conozca detalles de infraestructura.

Baseline orientativo:

```text
src/
├── app/
│   ├── router/
│   ├── providers/
│   └── config/
├── core/
│   ├── domain/
│   ├── application/
│   └── contracts/
├── features/
│   └── <feature>/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── shell/
├── theme/
└── main.tsx
```

No todas las features necesitarán todas las capas desde el primer día. La estructura debe ser pragmática, pero las dependencias deben apuntar hacia los contratos y no hacia implementaciones concretas.

### 3. Las vistas no contienen datos hardcodeados

Queda prohibido usar arrays, objetos o fixtures incrustados directamente en componentes/páginas como fuente de datos de negocio o demostración.

Las vistas consumen datos a través de casos de uso, services, providers o repositories definidos por contrato.

También queda prohibido que una vista:

- haga `fetch()` directamente;
- importe un archivo JSON directamente;
- use `localStorage` como fuente de negocio;
- conozca si los datos proceden de mock local o HTTP.

### 4. JSON local como fuente inicial reemplazable

Mientras no exista la API, cada feature impulsada por datos utilizará archivos JSON locales como fuente de ejemplo.

Esos JSON no son contenido decorativo. Deben respetar desde el inicio la misma forma contractual que se espera que entregue la futura API.

Ejemplo conceptual:

```text
Presentation
    ↓
Application / Use Case
    ↓
Repository contract
    ├── JsonRepository    ← ahora
    └── ApiRepository     ← futuro
```

La sustitución de `JsonRepository` por `ApiRepository` no debe requerir modificar los componentes de presentación.

### 5. Contract-first entre WebBlueprint y la futura API

Los contratos definidos por las vistas y los mocks se convierten en la referencia que deberá cumplir la futura API.

Flujo acordado:

```text
WebBlueprint define contrato
        ↓
JSON mock cumple contrato
        ↓
Frontend consume contrato
        ↓
Se diseña la API
        ↓
API implementa y valida el mismo contrato
```

Cuando ApiBlueprint o cualquier backend implemente esos endpoints, deberá respetar estos contratos o introducir un cambio de versión explícito.

La intención es que la diferencia entre la fase mock y la fase integrada sea **la fuente de la información**, no la forma consumida por las vistas.

### 6. DTOs, modelos y mappers

Cuando el contrato externo y el modelo interno no sean equivalentes, la infraestructura debe mapear DTOs hacia modelos de dominio/aplicación.

Patrón esperado:

```text
JSON/API DTO → mapper → modelo de aplicación/dominio → caso de uso → vista
```

La forma de transporte no debe propagarse sin control por toda la UI.

### 7. Estados de datos obligatorios

Las vistas impulsadas por datos deben poder representar de manera controlada, según aplique:

- loading;
- success;
- empty;
- error;
- paginación;
- filtros;
- ordenamiento.

Los mocks pueden incluir datasets o variantes deterministas para comprobar esos estados.

### 8. Los elementos reutilizables no se exportan como páginas

`Componentes`, `Elementos`, `Formularios` y `Tablas` son biblioteca de construcción.

Cuando una vista seleccionada necesite uno de esos elementos, el exportador incluirá la dependencia reutilizable necesaria en `shared/ui` o ubicación equivalente. No generará una ruta navegable adicional.

### 9. Export mínimo por selección

El proyecto exportado solo debe contener las features, vistas, rutas, assets y dependencias internas necesarias para la selección del Composer.

No se exportarán módulos de aplicación no elegidos únicamente porque existan en WebBlueprint.

### 10. Contratos exportables y futura validación backend

A medida que los contratos se formalicen, el ZIP podrá incluir artefactos como:

```text
contracts/
openapi/
webblueprint.json
```

El objetivo es que esos contratos puedan convertirse en input verificable para el diseño posterior de la API y para contract tests entre frontend y backend.

### 11. Quality gates del proyecto generado

El ZIP debe nacer preparado para validar al menos:

- TypeScript `strict`;
- lint;
- tests;
- build;
- reglas de arquitectura cuando estén disponibles;
- ausencia de dependencias inválidas entre capas.

El smoke de exportación debe comprobar que el proyecto generado puede instalar dependencias y compilarse.

## Consecuencias

- el exportador deja de ser un generador de maqueta y pasa a ser un bootstrapper de aplicaciones mantenibles;
- los mocks dejan de ser datos visuales sueltos y se convierten en ejemplos ejecutables de contratos;
- la futura API se diseña contra contratos ya consumidos por el frontend;
- cambiar de mock JSON a API no obliga a reescribir las vistas;
- Preview y Export deben evolucionar sobre la misma selección y los mismos contratos.

## Decisión que sustituye

Esta ADR sustituye cualquier interpretación previa según la cual los mocks no debían anticipar la forma del backend.

A partir de esta decisión, WebBlueprint **sí adopta contract-first**: los mocks representan el contrato esperado y la futura API deberá cumplirlo o versionar explícitamente cualquier cambio.
