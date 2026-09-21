# ADR-0002 · Toolchain frontend de U0.1

Estado: **Aceptado**  
Fecha: **2026-09-20**

## Decisión

WebBlueprint comienza su implementación como una aplicación React del lado cliente utilizando un toolchain deliberadamente pequeño y soportado:

- React 19.3.0
- React DOM 19.3.0
- React Router 8.4.0 en modo SPA declarativo
- Vite 8.3.0
- Tailwind CSS 4.3.3 mediante el plugin oficial de Vite
- TypeScript 6.0.3
- ESLint 10 + typescript-eslint 8.70
- Vitest 5.0.1
- baseline de Node.js: 22.22.3 o superior

## Por qué TypeScript 6 en lugar de TypeScript 7

TypeScript 7 está disponible, pero la matriz actual de soporte de typescript-eslint declara soportadas las versiones de TypeScript inferiores a 6.1. WebBlueprint prioriza un toolchain de calidad soportado antes que adoptar una versión major del compilador que el ecosistema lint todavía no soporta formalmente.

Esta decisión debe revisarse cuando typescript-eslint soporte oficialmente TypeScript 7.

## Frontera de la aplicación

U0.1 permanece únicamente frontend. No se introduce backend, API, base de datos, framework de renderizado del lado servidor ni integración de dominio.

El router expone únicamente rutas de fundación:

- `/`
- `/docs`
- `/components`
- `/composer`

Las páginas son placeholders intencionales. Su propósito es validar el esqueleto de la aplicación sin inventar prematuramente vistas derivadas de CORK.

## Dirección arquitectónica

El árbol fuente comienza con fronteras explícitas para:

- `app/` — composición y routing de la aplicación;
- `config/` — configuración a nivel de aplicación;
- `pages/` — composición a nivel de ruta;
- `styles/` — entrypoint global de Tailwind y CSS base.

Fronteras adicionales como `components/`, `features/`, `data/`, `shell/` y módulos de generator/composer se introducirán únicamente cuando su primera implementación real las requiera. No se versionan carpetas arquitectónicas vacías.

## Quality gate

Se espera que cada cambio pase:

1. compilación/typecheck de TypeScript;
2. ESLint con cero advertencias;
3. Vitest;
4. build de producción de Vite.

GitHub Actions ejecuta el mismo gate agregado `npm run check` en pull requests y `main`.

## Baseline responsive

La primera página renderizada utiliza clases Tailwind mobile-first. No es el shell final Style 1; es únicamente una prueba de compilación/runtime de que el stack aprobado de estilos responsive está activo.

## Política de dependencias

Las versiones de dependencias directas quedan fijadas durante el bootstrap. Se requiere un lockfile del repositorio antes de considerar U0.1 completamente cerrada; se generará a partir de una instalación exitosa de dependencias y se versionará como evidencia del grafo de dependencias resuelto.
