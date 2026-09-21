# Reconciliación de idioma previa a U1

Estado: **EN CURSO**

## Objetivo

Alinear WebBlueprint con la convención oficial del proyecto antes de comenzar U1:

- código e identificadores internos en inglés;
- interfaz visible en español;
- documentación mantenida por el proyecto en español;
- rutas, comandos, tecnologías, IDs estables y otros literales técnicos permanecen en su forma original cuando traducirlos dañaría precisión o compatibilidad.

## Alcance

- landing pública;
- catálogo, detalle y demos de aplicaciones;
- login y espacio autenticado;
- Compositor y exportación;
- aplicación React generada por el motor de exportación;
- documentación viva y galería de componentes;
- README;
- documentación histórica mantenida dentro de `docs/`.

## Regla de compatibilidad

La traducción no debe modificar IDs técnicos, slugs, rutas, nombres de componentes, variantes de shell ni contratos de código solo para hacerlos visibles en español. Cuando una entidad necesita un nombre técnico estable y una etiqueta visible, ambos conceptos se mantienen separados.

## Criterios de cierre

- superficies visibles del producto reconciliadas a español;
- documentación mantenida por el proyecto reconciliada a español;
- tests actualizados donde los mensajes visibles forman parte del contrato;
- IDs y rutas estables preservados;
- quality gate y smoke del proyecto exportado en verde sobre el HEAD exacto;
- revisión final de textos residuales en inglés antes de Ready for review.
