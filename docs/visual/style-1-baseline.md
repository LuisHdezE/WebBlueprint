# Visual Baseline · Style 1

Status: **Approved**  
Date: **2026-09-20**

## Reference

Approved generated concept identifier:

`975b04ed-721b-4158-9846-9af11492e0dc`

This is the visual baseline for WebBlueprint unless a later explicit visual-governance decision supersedes it.

## Design language

- Light-first interface.
- Clean, professional and restrained presentation.
- Very light neutral application background.
- White/light surfaces with subtle border separation.
- Soft, moderate corner radii rather than exaggerated pill styling.
- Minimal, restrained elevation/shadows.
- Strong and predictable typography hierarchy.
- Generous but efficient spacing.
- Clear information density suitable for business applications.
- Icons are simple and consistent.
- Status colors may communicate semantic meaning independently from the configurable brand accent.

## Stable vs configurable

### Stable

The following are part of the WebBlueprint visual language and should not be redesigned per generated application:

- component proportions;
- spacing system;
- typography scale;
- radii;
- shell structure;
- card treatment;
- form/control sizing;
- table behavior;
- navigation behavior;
- responsive patterns;
- elevation/shadow system.

### Configurable

Generated applications may configure:

- application name;
- application description;
- logo/brand mark;
- primary/accent theme color;
- derived theme color tokens;
- light/dark shell variant where supported by the final system.

## Shell intent

Desktop/tablet navigation remains on the left.

WebBlueprint will support its own left-side shell behavior informed by:

- CORK `collapsible-menu`;
- CORK `vertical-light-menu`;
- CORK `vertical-dark-menu`.

These are functional references only. WebBlueprint retains Style 1 as the visual authority.

## Mobile-first rule

The baseline includes a first-class mobile experience. Desktop layouts are not simply compressed onto small screens.

Navigation, DataTable presentation, filters, forms, overlays, cards, actions and dense information areas must each define intentional mobile behavior.
