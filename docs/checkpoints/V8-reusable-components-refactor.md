# V8 · Refactor de componentes reutilizables

Estado: **EN IMPLEMENTACIÓN · LISTO PARA REVISIÓN**

## Objetivo

Evitar que cada vista agregue tarjetas, campos, estados y bloques de contenido aislados.

## Componentes extraídos

- `SurfaceCard`: superficie estándar para contenido agrupado.
- `TextField` y `TextAreaField`: campos de formulario consistentes.
- `StatusPanel`: estados de error, mantenimiento y códigos HTTP.
- `EmptyState`: estados vacíos reutilizables.
- `KeyValueList`: pares etiqueta/valor para perfiles y resúmenes.

## Migraciones

- Páginas públicas y sistema.
- Perfil y configuración de usuario.
- Map View.

Las vistas conservan su composición de negocio, pero consumen primitivas compartidas para estructura y estados visuales.
