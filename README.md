# WebBlueprint

WebBlueprint is a mobile-first, component-driven React.js + Tailwind CSS frontend blueprint for generating reusable web application interfaces.

## Status

**U0 · Foundation / Reference Intake**

The repository has been initialized before implementation so architecture, reference decisions, and development evidence can be preserved from the first commit.

## Core principles

- Frontend only: React.js + Tailwind CSS.
- Mobile-first and responsive are mandatory acceptance criteria.
- Left-side navigation only.
- Supported shell references: `collapsible-menu`, `vertical-dark-menu`, and `vertical-light-menu`.
- The visual baseline is the approved **Style 1**: clean, light, professional, restrained shadows, soft rounded surfaces, strong typography hierarchy and consistent spacing.
- Application branding may change name, logo and theme color tokens, but not the fundamental visual language.
- Pages compose reusable components; pages do not recreate shared UI.
- Components are added incrementally when real page requirements demand them.
- Shared shell elements such as Sidebar, Topbar and BottomBar exist once and are reused.
- Data is mocked behind a replaceable data-access boundary; page components must not hardcode domain data.
- Documentation is a first-class page of the application and grows together with the component library.
- GitHub evidence, incremental changes, CI and continuous deployment will be introduced from the foundation stage.

## Initial reference

The first reference template is CORK Responsive Admin Dashboard Template v4.0.0. It is used as a functional/view catalog, not as a technical implementation to copy.

The first implementation phase will inventory the reference, classify each page as **KEEP / ADAPT / MERGE / DISCARD**, extract reusable UI patterns, and only then reconstruct approved views in WebBlueprint.

## Development rule

No reference page is automatically in scope merely because it exists in CORK. Likewise, CORK is not the final boundary of WebBlueprint: after the initial catalog is reconstructed, additional research will identify missing views, patterns and application presets.
