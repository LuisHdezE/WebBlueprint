# CORK v4 Reference Baseline

Date: **2026-09-20**

## Source archive

- File: `themeforest-TkEseu24-cork-responsive-admin-dashboard-template.zip`
- Product/version detected: **CORK v4.0.0**
- Archive size: **125,837,996 bytes**
- SHA-256: `20bcbafd65148dc46f4402403e2e3e3a8a5d81ab0872046a54dd664ff119f29d`
- Total archive entries: **23,987**

This fingerprint identifies the exact reference archive used for the first WebBlueprint inventory.

## Approved reference layouts

Only the following non-RTL layout directories are in scope:

- `cork-v4.0.0/html/collapsible-menu/`
- `cork-v4.0.0/html/vertical-dark-menu/`
- `cork-v4.0.0/html/vertical-light-menu/`

Navigation remains on the **left** in WebBlueprint.

All horizontal, modern, semi-dark and RTL layout families are excluded from the initial reference audit.

## Inventory counts

Each approved CORK layout directory contains **105 HTML pages**.

Across the three approved directories:

- unique reference page filenames: **107**;
- present in all three layouts: **103**;
- layout-specific differences: **4 filenames** across carousel/layout examples.

### Functional categories

| Category | Unique references |
|---|---:|
| Applications | 21 |
| Forms | 20 |
| Components | 17 |
| Elements | 17 |
| Authentication | 10 |
| Layouts | 5 |
| General pages | 5 |
| Tables | 5 |
| Dashboards | 2 |
| User/Profile | 2 |
| Charts | 1 |
| Maps | 1 |
| Widgets | 1 |
| **Total** | **107** |

## Important interpretation

The number `107` is a **reference inventory count**, not a commitment to implement 107 independent WebBlueprint pages.

The audit must identify reusable primitives and patterns. Multiple CORK examples may collapse into one configurable WebBlueprint component or pattern.

Examples:

- multiple DataTable examples may become one configurable `DataTable` plus documented variants;
- multiple authentication presentations may be merged into reusable authentication layouts and components;
- layout demonstration pages may be unnecessary once WebBlueprint's own shell behavior is documented;
- component demo pages are inputs to the WebBlueprint component library and documentation, not necessarily one-to-one application pages.

## Classification workflow

Every row in the page inventory begins as `REVIEW` and must later be classified as one of:

- `KEEP`: implement as a distinct useful view;
- `ADAPT`: preserve the capability but redesign/restructure for WebBlueprint;
- `MERGE`: capability is represented through another page, pattern or configurable component;
- `DISCARD`: low-value, redundant or out-of-scope reference.

No implementation should begin for a reference view until its classification and required reusable components are understood.

## Evidence artifact

The corresponding machine-readable inventory is maintained at:

`docs/reference/cork-v4-page-inventory.csv`
