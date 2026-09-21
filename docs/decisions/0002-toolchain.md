# ADR-0002 · U0.1 Frontend Toolchain

Status: **Accepted**  
Date: **2026-09-20**

## Decision

WebBlueprint begins implementation as a client-side React application using a deliberately small, supported toolchain:

- React 19.3.0
- React DOM 19.3.0
- React Router 8.4.0 in declarative SPA mode
- Vite 8.3.0
- Tailwind CSS 4.3.3 through the official Vite plugin
- TypeScript 6.0.3
- ESLint 10 + typescript-eslint 8.70
- Vitest 5.0.1
- Node.js baseline: 22.22.3 or newer

## Why TypeScript 6 instead of TypeScript 7

TypeScript 7 is available, but the current typescript-eslint support matrix declares TypeScript versions below 6.1 as supported. WebBlueprint prioritizes a supported quality toolchain over adopting a compiler major before the lint ecosystem formally supports it.

This decision should be revisited when typescript-eslint officially supports TypeScript 7.

## Application boundary

U0.1 remains frontend only. No backend, API, database, server-rendering framework, or domain integration is introduced.

The router exposes only foundation routes:

- `/`
- `/docs`
- `/components`
- `/composer`

The pages are intentional placeholders. Their purpose is to validate the application skeleton without prematurely inventing CORK-derived views.

## Architecture direction

The source tree starts with explicit boundaries for:

- `app/` — application composition and routing;
- `config/` — application-level configuration;
- `pages/` — route-level composition;
- `styles/` — global Tailwind entrypoint and baseline CSS.

Additional boundaries such as `components/`, `features/`, `data/`, `shell/`, and generator/composer modules will be introduced only when their first real implementation requires them. Empty architectural folders are not committed.

## Quality gate

A change is expected to pass:

1. TypeScript compilation/typecheck;
2. ESLint with zero warnings;
3. Vitest;
4. Vite production build.

GitHub Actions runs the same aggregate `npm run check` gate on pull requests and `main`.

## Responsive baseline

The first rendered page uses mobile-first Tailwind classes. This is not the final Style 1 shell; it is only a compile/runtime proof that the approved responsive styling stack is active.

## Dependency policy

Direct dependency versions are pinned for the bootstrap. A repository lockfile is required before U0.1 is considered fully closed; it will be generated from a successful dependency installation and committed as evidence of the resolved dependency graph.
