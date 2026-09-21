# WebBlueprint Initial Development Roadmap

Status: **Active**  
Date: **2026-09-20**

This roadmap governs the initial path from an empty repository to the first reference-driven implementation. It is intentionally incremental and evolves only through documented decisions and evidence.

## U0 · Product Foundation

### U0.0 · Governance and reference baseline — COMPLETE

Goal: preserve the decisions that implementation must obey.

Delivered:

- project charter;
- foundation ADR;
- approved Style 1 baseline;
- exact CORK archive fingerprint;
- approved left-menu reference scope;
- machine-readable initial page inventory;
- initial roadmap.

### U0.1 · React + Tailwind foundation — COMPLETE

Goal: create the minimum runnable and verifiable WebBlueprint application.

Delivered:

- React + TypeScript application bootstrap;
- Tailwind CSS through the Vite integration;
- React Router foundation;
- strict TypeScript baseline;
- ESLint baseline;
- Vitest baseline;
- production build;
- mobile-first base styling;
- repository `package-lock.json`;
- reproducible `npm ci` CI gate;
- typecheck + lint + test + build verification.

## U0.2 · Public product shell and authenticated Composer boundary — ACTIVE

Goal: establish WebBlueprint as a real product with a public showcase and a distinct authenticated application-building workspace.

### Public surface

Initial product routes/direction:

- `/` — public landing page;
- `/apps` — public application/solution catalog;
- `/apps/:slug` — public application presentation/detail;
- `/demo/:slug/*` — public navigable demo;
- `/docs/*` — public documentation;
- `/login` — user access entry.

Public catalog items are presented as applications/solutions, not as templates.

A public application entry may expose:

- name;
- description;
- representative visual;
- category;
- capabilities;
- demo action.

A visitor may navigate the demo pages belonging to an application concept but must not receive ZIP export controls from the public experience.

### Authenticated surface

- `/composer/*` — protected App Composer workspace.

During the frontend-only phase, authentication is implemented behind a replaceable provider/adapter boundary with mock behavior where necessary. Page components must not contain ad-hoc authentication checks.

Real enforcement of protected export/download is intentionally recognized as a trusted-service concern when WebBlueprint later requires production-grade authorization.

### U0.2 structural deliverables

- Style 1 public shell foundation;
- Style 1 authenticated/workspace shell foundation;
- mobile-first responsive navigation behavior;
- public landing route;
- public documentation route retained;
- public application catalog foundation;
- application definition/preset registry foundation;
- public demo route foundation;
- authentication/session abstraction;
- centralized protected-route boundary;
- login UX foundation;
- App Composer route promoted from placeholder to authenticated first-class surface.

### Source-of-truth rule

An application definition/preset must evolve toward being the shared source used by:

```text
Application Definition / Preset
        ↓
Public catalog
        ↓
Public application detail
        ↓
Public demo
        ↓
App Composer
        ↓
Generated navigation/features
        ↓
Export
```

The same Pet Shop, Fitness, CRM or other application concept must not be modeled independently for each surface.

### U0.2 gate

- public vs authenticated route boundaries are explicit;
- Style 1 is respected;
- mobile/tablet/desktop behavior exists from the first implementation;
- navigation components are shared, never recreated per page;
- authentication boundary is centralized and replaceable;
- public demos do not expose export actions;
- CI remains green.

## U0.3 · App Composer core

Goal: make the Composer useful from the beginning rather than introducing it after the page catalog is complete.

Initial Composer capabilities:

- application name;
- description;
- logo/branding input;
- configurable theme/accent color;
- application/preset selection;
- manual feature/page selection;
- navigation preview;
- project configuration state;
- generated `webblueprint.json`/manifest direction.

The catalog may initially contain very few selectable capabilities. It grows automatically as WebBlueprint itself grows.

## U0.4 · Export Engine v0

Goal: prove early that WebBlueprint generates applications rather than merely displaying a component/page catalog.

Initial export proof:

```text
App Composer
     ↓
Configuration / manifest
     ↓
Dependency resolution
     ↓
Generated React project
     ↓
ZIP
     ↓
npm ci
npm run build
     ↓
PASS
```

Requirements:

- exported ZIP is a runnable React project;
- only required/selected capabilities are included where supported;
- generated branding/configuration is applied;
- output contains enough metadata to identify how it was generated;
- export architecture is testable and deterministic.

Public landing/catalog/demo routes do not expose export controls.

## U0.5 · Living documentation and component gallery maturity

Documentation exists from the beginning and grows with implementation.

Every reusable component introduced during any increment must be documented as part of the same work.

Component documentation includes as relevant:

- purpose;
- props/configuration;
- variants;
- states;
- responsive behavior;
- usage examples.

The `/components` area becomes the visual catalog of the owned component library rather than a separate after-the-fact documentation project.

## U0.6 · Initial CD / EliasWorks publication

Goal: keep the accepted `main` product state publicly demonstrable on the canonical WebBlueprint publication domain.

Canonical publication target:

- `https://eliasworks.uy`

Requirements:

- merge to the deployment branch/main can produce a repeatable deployment to EliasWorks infrastructure;
- deployed revision is traceable to a Git commit;
- public landing is accessible from the EliasWorks publication surface;
- public documentation is accessible;
- public demos can be reached when application concepts exist;
- direct deep links used in commercial proposals must survive direct navigation and refresh;
- deployment remains mobile-first/responsive.

The exact path/subdomain and deployment mechanism under `eliasworks.uy` are selected and documented when EliasWorks hosting is wired. Render is not a canonical deployment target for WebBlueprint and must not appear in the production architecture.

## U1 · CORK Reference Inventory and Classification

The initial implementation catalog is derived only from these CORK non-RTL layout families:

- `collapsible-menu`;
- `vertical-dark-menu`;
- `vertical-light-menu`.

### U1.1 · Functional page review

Review all 107 unique reference filenames and classify each as:

- KEEP;
- ADAPT;
- MERGE;
- DISCARD.

Classification must explain the reason and identify likely WebBlueprint page/pattern ownership.

### U1.2 · Component extraction map

For accepted views, identify reusable primitives/patterns before page implementation.

Examples:

- AppShell;
- Sidebar;
- Topbar;
- PageHeader;
- Button;
- Badge;
- Dropdown;
- Modal/Drawer;
- form controls;
- DataTable;
- Pagination;
- cards;
- feedback/loading/empty/error states.

Rule: when a required reusable component does not exist, implement it in the library first, document it, then consume it from the page.

### U1.3 · Navigation and application-definition map

For accepted application views, define:

- route;
- menu label;
- icon;
- group;
- ordering;
- menu visibility;
- nested/submenu relationship;
- future permission metadata;
- application/preset memberships where relevant.

Routes, demo navigation and Composer navigation must converge on shared registry/source-of-truth metadata.

### U1.4 · Mock-data contract map

For accepted data-driven views, define the UI-facing data shape and mock source.

Pages consume provider/repository/hook/service boundaries rather than importing domain fixtures directly.

## U2 · Reference-driven implementation

Implementation proceeds by coherent families rather than by arbitrary page order.

Each page increment must satisfy:

- Style 1 visual baseline;
- mobile-first behavior;
- reuse of existing component library;
- newly required reusable components added/documented first;
- no page-local duplicate shell;
- mock data externalized behind the chosen data boundary;
- navigation/routing consistent with registry/source-of-truth direction;
- inclusion in relevant public demo/application definitions when appropriate;
- Composer/export metadata updated when the capability becomes selectable/exportable;
- lint/build/test gates PASS.

## U3 · Preset/Application Library Expansion

As useful views and capabilities become available:

- build reusable application definitions/presets;
- expose them publicly as applications/solutions;
- attach representative imagery and descriptions;
- make their demos navigable;
- allow the same definitions to preselect Composer features/pages;
- support import/export/versioning of preset definitions when justified.

Examples may include:

- Pet Shop;
- general E-commerce;
- Fitness;
- CRM;
- Help Desk;
- Logistics.

## U4 · Expansion beyond CORK

After useful CORK coverage is complete:

- research missing application patterns;
- compare real modern applications and established UX patterns;
- identify gaps by application context;
- add new views/components only from evidenced needs;
- enrich the application/preset library;
- keep documentation, demos, Composer metadata and export support synchronized.

## Permanent delivery rule

A new reusable capability is not considered fully integrated merely because one page renders it.

Depending on its role, completion should account for the relevant surfaces:

```text
Owned component
+ documentation
+ consuming page/pattern
+ route/navigation metadata
+ application/demo metadata
+ Composer metadata
+ export dependency metadata
+ responsive behavior
+ tests/CI evidence
```

Not every primitive requires every layer, but duplication or drifting product definitions are not acceptable.
