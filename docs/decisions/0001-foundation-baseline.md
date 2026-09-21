# ADR-0001 · WebBlueprint Foundation Baseline

Status: **Accepted**  
Date: **2026-09-20**

## Purpose

Freeze the non-negotiable product and UI foundations before implementation begins.

## Technology scope

- Frontend only.
- React.js.
- Tailwind CSS.
- All runtime/domain data is mock during the Blueprint phase.
- Mock data must be consumed through replaceable data providers/repositories/hooks/services. Domain data must not be embedded directly inside page components.

## Visual baseline

The approved visual baseline is **Style 1**.

Characteristics:

- light, clean and professional;
- restrained shadows;
- soft rounded surfaces;
- strong typography hierarchy;
- consistent spacing;
- calm neutral backgrounds;
- one configurable accent/theme color system;
- application name and logo are configurable branding inputs.

The fundamental visual language is stable across generated applications. Branding changes must be token/config driven rather than page-specific redesigns.

## Responsive baseline

Mobile-first is mandatory.

A view or component is not complete unless it works at mobile, tablet and desktop widths. Responsive behavior is part of acceptance criteria, not a later polish phase.

## Navigation and shell

Navigation is always on the **left** for desktop/tablet shell layouts.

Only these CORK shell variants are accepted as functional reference material:

1. `collapsible-menu`
2. `vertical-dark-menu`
3. `vertical-light-menu`

Horizontal menu variants, modern menu variants, semi-dark menu variants and RTL variants are excluded from the reference scope unless a future explicit decision changes this ADR.

WebBlueprint will implement its own componentized shell rather than copying CORK shell code.

Shared shell UI exists once:

- `AppShell`
- `Sidebar`
- `Topbar`
- responsive/mobile navigation behavior
- optional `BottomBar` where the mobile pattern requires it

Pages must never recreate those structures independently.

## Component architecture

WebBlueprint will own its component library.

Pages compose reusable components. If a page requires a reusable UI element that does not yet exist, the component is implemented in the library first and then consumed by the page.

The component library grows incrementally from real page requirements rather than being invented in full up front.

Examples include:

- Button
- Badge
- Dropdown
- Modal
- Drawer
- Form controls
- DataTable
- Pagination
- PageHeader
- navigation primitives
- feedback/state components

A single configurable component should serve multiple pages through props/configuration instead of creating page-specific duplicates.

## Documentation

Documentation is a first-class application area from the beginning.

Every reusable component must be documented as it is introduced, including relevant variants, states, properties/configuration, responsive behavior and examples.

The documentation and component gallery must grow together with the implementation.

## Reference-template rule

The initial CORK archive is a functional and visual reference catalog only.

Its implementation technology, source structure and styling are not architectural dependencies of WebBlueprint.

Each reference view will be classified before implementation as:

- `KEEP`
- `ADAPT`
- `MERGE`
- `DISCARD`

CORK is the starting catalog, not the final boundary of the product. Additional view/pattern research will follow the first reference-coverage phase.

## Delivery and evidence

Development is incremental and evidence-driven:

- Git version control from the first change;
- small branches/PRs;
- living architecture and inventory documentation;
- CI introduced during foundation;
- CD introduced early so the current `main` state can remain publicly demonstrable through Eliaswork infrastructure.
