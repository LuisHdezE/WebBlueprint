# WebBlueprint Initial Development Roadmap

Status: **Active**  
Date: **2026-09-20**

This roadmap governs the initial path from an empty repository to the first reference-driven implementation. It is intentionally incremental and may be extended as evidence is collected.

## U0 · Foundation

### U0.0 · Governance and reference baseline

Goal: preserve the decisions that implementation must obey.

Deliverables:

- project charter;
- foundation ADR;
- approved Style 1 baseline;
- exact CORK archive fingerprint;
- approved left-menu reference scope;
- machine-readable initial page inventory;
- initial roadmap.

Gate:

- documentation is internally consistent;
- no application implementation yet;
- PR reviewed before merge.

### U0.1 · React + Tailwind bootstrap

Goal: create the minimum runnable WebBlueprint application.

Expected deliverables:

- React application bootstrap;
- Tailwind CSS configuration;
- linting/formatting baseline;
- production build command;
- mobile-first viewport/base styles;
- initial source-folder architecture;
- no speculative component catalog.

Gate:

- install PASS;
- lint PASS;
- production build PASS.

### U0.2 · Application skeleton and living documentation

Goal: establish the routes and reusable structural boundaries that will grow with the product.

Initial routes/areas:

- home/overview;
- documentation;
- components/gallery;
- App Composer placeholder.

Expected structural foundations:

- router;
- providers/configuration boundary;
- shell boundary;
- component library boundary;
- feature/page boundary;
- mock-data/repository boundary;
- documentation registry boundary.

No reference-specific application views are implemented in this increment.

### U0.3 · CI baseline

Goal: make every proposed change verifiable.

Minimum CI:

- dependency install;
- lint;
- tests when test baseline exists;
- production build.

### U0.4 · Initial CD / Eliaswork publication

Goal: keep the current accepted `main` state publicly demonstrable.

The concrete hosting/deployment mechanism will be documented when the Eliaswork target is selected/configured.

Gate:

- deployment is reproducible;
- deployed revision can be traced to Git commit;
- public page is responsive.

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

### U1.3 · Navigation map

For accepted application views, define:

- route;
- menu label;
- icon;
- group;
- ordering;
- menu visibility;
- nested/submenu relationship;
- future permission metadata.

Routes and navigation must eventually derive from a shared feature registry/source of truth.

### U1.4 · Mock-data contract map

For accepted data-driven views, define the UI-facing data shape and mock source.

Pages must consume provider/repository/hook/service boundaries rather than importing domain fixtures directly.

## U2 · Reference-driven implementation

Implementation proceeds by coherent families rather than by arbitrary page order.

Each page increment must satisfy:

- Style 1 visual baseline;
- mobile-first behavior;
- reuse of existing component library;
- newly required reusable components added/documented first;
- no page-local duplicate shell;
- mock data externalized behind the chosen data boundary;
- navigation/routing consistent with the feature registry direction;
- lint/build/test gates PASS.

## U3 · Blueprint expansion beyond CORK

After useful CORK coverage is complete:

- research missing application patterns;
- add new components/views based on real gaps;
- introduce stored application presets;
- expand component documentation and examples.

## U4 · App Composer and generator

The Composer will eventually support:

- application name and description;
- logo;
- theme/accent colors;
- preset selection/import;
- manual feature/page selection;
- generated left-side navigation;
- route generation;
- dependency resolution;
- preview/review;
- export/generation of a reduced application containing only required capabilities.

Generator automation begins only after the underlying component/page/feature model has proven stable manually.
