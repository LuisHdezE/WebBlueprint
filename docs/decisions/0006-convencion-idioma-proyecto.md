# ADR-0006 · Convención de idioma del proyecto

Estado: **Aceptado**  
Fecha: **2026-09-21**

## Decisión

WebBlueprint separa el idioma técnico interno del idioma de producto.

### Inglés

Se utiliza inglés para:

- código fuente;
- nombres de archivos de código;
- clases, funciones, métodos, variables, tipos e interfaces;
- contratos y estructuras internas;
- nombres técnicos de workflows, jobs y artefactos cuando resulte conveniente para ingeniería;
- mensajes técnicos de commit y ramas.

### Español

Se utiliza español para:

- toda la interfaz visible para el usuario;
- landing pública;
- catálogo de aplicaciones;
- demos y textos de ejemplo visibles;
- App Composer;
- componentes y galería pública;
- documentación viva mostrada en la web;
- `README.md` y documentación Markdown mantenida por el proyecto;
- checkpoints, ADR, roadmap, guías y documentación de operación.

Los identificadores técnicos, nombres propios de tecnologías, rutas, comandos, nombres de artefactos y fragmentos de código pueden permanecer en inglés cuando traducirlos alteraría su significado o su valor operativo.

## Regla de implementación

Todo componente nuevo que introduzca texto visible debe usar español desde su primera versión. Toda documentación nueva debe redactarse en español. La revisión de PR debe considerar una desviación de idioma como una inconsistencia de producto que debe corregirse antes del merge.

## Consecuencia inmediata

Antes de comenzar U1 se realizará una reconciliación transversal de la superficie pública y de la documentación existente para eliminar texto de producto redactado en inglés y preservar únicamente el inglés técnico interno.
