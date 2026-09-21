# Reconciliación de idioma previa a U1

Estado: **IMPLEMENTACIÓN COMPLETA · CI FINAL PENDIENTE**

## Objetivo

Alinear WebBlueprint con la convención oficial del proyecto antes de comenzar U1:

- código e identificadores internos en inglés;
- interfaz visible en español;
- documentación mantenida por el proyecto en español;
- rutas, comandos, tecnologías, IDs estables y otros literales técnicos permanecen en su forma original cuando traducirlos dañaría precisión o compatibilidad.

## Entregado

- metadata HTML y descripción del producto en español;
- landing, catálogo, detalle y demos públicas en español;
- navegación pública, shells compartidos y acciones de sesión en español;
- login y espacio autenticado en español;
- Compositor completo en español;
- validaciones y mensajes de exportación en español;
- aplicación React generada por el motor de exportación con UI y README en español;
- etiquetas visibles de capacidades desacopladas de sus IDs técnicos estables;
- documentación viva y galería de componentes en español;
- `README.md` reconciliado al estado actual y redactado en español;
- checkpoints U0.2–U0.6 reconciliados;
- ADR históricos y ADR-0006 de convención de idioma disponibles en español;
- documentación de referencia CORK, contrato de producción, roadmap y baseline visual Style 1 reconciliados en español.

## Relación con PR #8

PR #9 tiene `main` como base para ejecutar el CI gobernado del repositorio. Incluye el mismo estado final de los checkpoints U0.6 y ADR-0006 presentes en PR #8, además de la reconciliación transversal completa.

PR #8 continúa abierta como cierre documental focalizado de U0.6 y no será mergeada sin aprobación explícita. Si #8 se integra primero, sus cambios superpuestos dejarán de formar parte del diff efectivo de #9 sin alterar el resultado funcional esperado.

## Excepción técnica deliberada

`docs/reference/cork-v4-page-inventory.csv` conserva su esquema legible por máquina y sus valores técnicos en inglés (`reference_page`, `category`, `decision`, `REVIEW`, nombres originales de archivos CORK, etc.). No es texto de producto ni prosa documental para usuarios. Traducir esos identificadores antes de U1 introduciría deriva innecesaria en el artefacto que será usado para clasificación.

Las notas humanas que se incorporen al inventario durante U1 deberán redactarse en español, mientras los identificadores técnicos y las decisiones gobernadas `KEEP / ADAPT / MERGE / DISCARD` permanecen estables.

## Regla de compatibilidad

La traducción no modifica IDs técnicos, slugs, rutas, nombres de componentes, variantes de shell ni contratos de código solo para hacerlos visibles en español. Cuando una entidad necesita un nombre técnico estable y una etiqueta visible, ambos conceptos se mantienen separados.

Ejemplo vigente:

- capacidad técnica: `Dashboard`;
- ID estable derivado: `dashboard`;
- etiqueta visible: `Panel`.

## Auditoría final de superficie

Se revisaron explícitamente las superficies que contienen texto visible:

- `PublicShell`;
- `LeftAppShell`;
- `WorkspaceShell`;
- `LandingPage`;
- `ApplicationsPage`;
- `ApplicationDetailPage`;
- `ApplicationDemoPage`;
- `LoginPage`;
- `ComposerPage` / `ComposerWizard`;
- `ComposerExportPanel`;
- `DocumentationPage`;
- `ComponentsPage`;
- `applicationRegistry`;
- catálogo de documentación;
- salida generada por `export.engine`.

El inglés preservado en estas superficies corresponde únicamente a términos técnicos necesarios, nombres de tecnologías, rutas, IDs, nombres de componentes o fragmentos de código.

## Criterios de cierre

- superficies visibles del producto reconciliadas a español: **PASS**;
- documentación mantenida por el proyecto reconciliada a español: **PASS**;
- tests actualizados donde los mensajes visibles forman parte del contrato: **PASS**;
- IDs y rutas estables preservados: **PASS**;
- revisión final de textos residuales en inglés: **PASS**;
- quality gate y smoke del proyecto exportado sobre el HEAD exacto: **PENDIENTE**.

PR #9 permanece en Draft hasta obtener CI verde sobre el HEAD exacto y reconciliar aquí la evidencia final.
