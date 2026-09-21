# Visual Baseline · Style 1

Status: **Approved, refined by U0.2 density/color feedback**  
Initial approval: **2026-09-20**  
Refinement: **2026-09-21**

## Reference

Approved generated concept identifier:

`975b04ed-721b-4158-9846-9af11492e0dc`

This remains the visual baseline for WebBlueprint, refined by explicit user feedback during U0.2.

## Design language

- Light-first interface.
- Clean, professional and restrained presentation.
- Very light neutral application background.
- White/light surfaces with subtle border separation.
- Soft, moderate corner radii rather than exaggerated pill styling.
- Minimal elevation and restrained shadows.
- Strong and predictable typography hierarchy.
- **Compact, efficient spacing rather than decorative whitespace.**
- **Useful information density suitable for business applications.**
- **Headline scale must remain contained; landing H1 should not dominate the viewport.**
- Icons are simple and consistent.
- Status colors may communicate semantic meaning independently from the configurable brand accent.

## U0.2 visual refinement

The first browser-visible U0.2 preview produced explicit feedback that the initial implementation wasted too much screen space and used an overly strong near-black primary treatment.

The governed direction is therefore refined as follows:

### Density

- prioritize useful content per viewport;
- avoid oversized section padding, card padding and gaps;
- keep topbars and sidebars compact enough for productivity UI;
- reduce decorative vertical whitespace;
- prefer compact card radii/proportions while preserving touch targets and readability;
- expose important application content above the fold where practical.

### Typography

- avoid oversized marketing typography;
- landing H1 targets approximately `text-3xl` mobile, `text-4xl` tablet and `text-5xl` desktop maximum in the current system;
- section headings are generally `text-2xl` to `text-3xl`;
- application/workspace headings should favor content hierarchy over spectacle.

### Color

Near-black is **not** the default primary/CTA color.

The current WebBlueprint default brand token family is a fresh blue:

- `brand-50`: `#eff6ff`;
- `brand-100`: `#dbeafe`;
- `brand-500`: `#3b82f6`;
- `brand-600`: `#2563eb`;
- `brand-700`: `#1d4ed8`;
- `brand-800`: `#1e40af`.

Dark slate remains appropriate for readable text and for the optional `vertical-dark-menu` shell variant, but it must not dominate the default public/product experience.

The default product language therefore uses:

- fresh blue for primary actions and active states;
- slate for text hierarchy;
- white and very light slate/blue surfaces;
- semantic green/amber/red colors only for their intended statuses.

Brand color remains configurable by generated applications. Components should consume governed theme tokens instead of scattering hardcoded primary colors.

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

The default experience is light and fresh. `vertical-dark-menu` remains an explicit selectable variant, not the default design language.

## Mobile-first rule

The baseline includes a first-class mobile experience. Desktop layouts are not simply compressed onto small screens.

Navigation, DataTable presentation, filters, forms, overlays, cards, actions and dense information areas must each define intentional mobile behavior.
