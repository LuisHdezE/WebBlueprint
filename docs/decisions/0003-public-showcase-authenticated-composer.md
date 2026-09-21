# ADR-0003 · Public Showcase and Authenticated Composer Boundary

Status: **Accepted**  
Date: **2026-09-20**

## Purpose

Define the product boundary between WebBlueprint's public presentation experience and the authenticated application-building experience.

## Product surfaces

WebBlueprint is not only an internal application builder. It must also present its available application concepts publicly in a polished, informative and navigable way.

The product therefore has two primary surfaces:

1. **Public experience**
2. **Authenticated workspace**

## Public experience

The public area is accessible without authentication and includes:

- a marketing/informational landing page;
- a catalog of ready-made application concepts;
- a detail/presentation page for each application concept;
- public interactive demos of the pages included in those application concepts;
- public product/documentation access;
- sign-in entry point.

### Application catalog language

Public-facing content must present these items as **applications/solutions**, not as templates.

Examples:

- Pet Shop
- Fitness
- E-commerce
- CRM
- Help Desk
- Logistics

Each public application card/detail should be able to show:

- application name;
- concise description;
- representative image/visual;
- category;
- key capabilities;
- action to launch the public demo.

### Demo behavior

A public demo allows visitors to navigate the set of pages that compose that application concept.

Example:

`Pet Shop` may expose a demo containing dashboard, products, categories, customers, orders and other pages selected by the corresponding preset.

The demo is showcase-only. It must not expose an application ZIP export action.

### Commercial proposal demo use case

Public demos are also a first-class commercial/proposal capability of WebBlueprint.

When a prospective client requests a custom application through a freelance marketplace, direct sales contact or another commercial channel, WebBlueprint should allow a relevant application concept/demo to be assembled quickly from the existing page/component catalog and published as a shareable public URL.

The intended workflow is:

```text
Prospective client requirement
        ↓
Choose/create application concept
        ↓
Select relevant pages/features
        ↓
Apply branding/theme as appropriate
        ↓
Publish navigable frontend demo
        ↓
Feature the application on the public landing/catalog when desired
        ↓
Share direct demo URL with prospect
```

The prospective client can then navigate a realistic, responsive mock frontend and understand the proposed product before backend/API implementation exists.

The demo must communicate the intended user experience, navigation, information architecture and visible capabilities of the proposed application while remaining technically honest: at this stage its domain data may be mock and its backend/API functionality may not yet exist.

A demo created for a proposal can become one of the applications promoted in the public catalog. Therefore a commercially useful demo should not be treated as disposable mockup work; when appropriate it should enrich the reusable WebBlueprint application/preset library.

Direct demo links must be stable and human-shareable enough to send in a proposal or freelance-platform conversation without requiring the recipient to understand WebBlueprint itself.

## Public documentation

Documentation is public and directly reachable from the landing/navigation experience.

The public documentation area grows together with WebBlueprint and may include:

- product concepts;
- component documentation;
- design-system documentation;
- usage examples;
- supported application concepts;
- responsive behavior;
- Composer/export concepts where appropriate.

Sensitive/internal implementation details are not required to be exposed merely because documentation is public.

## Authenticated workspace

The App Composer belongs to the authenticated workspace.

Unauthenticated visitors may discover the product, browse application concepts, run demos and read public documentation, but they do not enter the Composer workspace.

The authenticated experience includes, progressively:

- user/session boundary;
- App Composer;
- application identity configuration;
- branding/theme configuration;
- preset selection;
- feature/page selection;
- generated navigation review;
- application review;
- export/download capability.

## Export boundary

Application ZIP generation/download is exposed only from the authenticated Composer flow.

The public landing, catalog and demos do not expose export controls.

### Security note

During the current frontend-only Blueprint phase, authentication and authorization may be represented through replaceable mock/provider abstractions so the UX and routing model can be built without introducing a backend prematurely.

A client-side route guard alone is **not** a security boundary capable of guaranteeing that protected export assets cannot be recovered by a determined user. If WebBlueprint later requires real enforcement of authenticated ZIP generation/download, authorization must be validated by a trusted authenticated service/backend (or equivalent protected infrastructure).

Therefore authentication must be abstracted behind a replaceable boundary from the beginning rather than coupled directly to page components.

## Proposed route model

Initial direction:

### Public

- `/` — landing page
- `/apps` — public application catalog
- `/apps/:slug` — application presentation/detail
- `/demo/:slug/*` — public navigable application demo/shareable proposal URL
- `/docs/*` — public documentation
- `/login` — sign-in entry

### Authenticated

- `/composer/*` — App Composer workspace

Additional authenticated account routes may be added only when required.

## Architectural consequences

- public and authenticated shells/navigation must be distinguishable;
- authentication state must be provided through an application-level provider/boundary;
- pages must not implement ad-hoc login checks;
- route protection must be centralized;
- presets/application concepts become reusable metadata consumed by both the public showcase and App Composer;
- a Pet Shop definition should not be duplicated separately for marketing, demo and Composer selection;
- public demo navigation must derive from the same application/feature registry direction used by the Composer;
- demos must be suitable both for general public showcase and direct commercial proposal sharing;
- useful proposal demos should be preservable/promotable as reusable catalog applications instead of becoming disposable one-off mockups;
- export actions exist only inside the authenticated Composer experience;
- Style 1 remains the visual authority for product UI, adapted appropriately for the public landing and workspace surfaces;
- all surfaces remain mobile-first and responsive.

## Source-of-truth principle

A stored application concept/preset should eventually power all relevant product surfaces:

```text
Application Definition / Preset
        ↓
Public catalog card
        ↓
Public application detail
        ↓
Public navigable / proposal demo
        ↓
Shareable client URL
        ↓
App Composer preset selection
        ↓
Feature/page/navigation configuration
        ↓
Authenticated ZIP export
```

This avoids maintaining separate and drifting representations of the same application concept.