# ADR-0004 · Canonical Publication Target

Status: **Accepted · publication address refined by ADR-0005**  
Date: **2026-09-21**

## Decision

The canonical public publication family for WebBlueprint is EliasWorks infrastructure under:

- `eliasworks.uy`

ADR-0005 now fixes the production application itself at the independent subdomain `https://webblueprint.eliasworks.uy`.

## Hosting audit recorded during U0.2

The current EliasWorks root site is not an empty static host. It is an existing Laravel application deployed from `LuisHdezE/erp_eliasworks`.

The active deployment pattern observed in the EliasWorks repository is:

```text
GitHub main
    ↓
GitHub Actions
    ↓
PHP / Node build
    ↓
FTP
    ↓
public_html/
    ↓
eliasworks.uy
```

The same hosting account already has a proven pattern for separate Vite/React bundles. eFactura builds its WebApp and publishes the generated `dist/` bundle into a dedicated directory under `public_html/`.

The hosting stack also supports Apache-style SPA fallback through `.htaccess`. eFactura currently uses:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

This provided the evidence needed to make WebBlueprint deep-link-ready before the final publication integration was selected.

## U0.2 portability decision

U0.2 intentionally did not hardcode a deployment path.

WebBlueprint treats Vite's `BASE_URL` as the React Router basename. Therefore:

- a root/subdomain build keeps Vite base `/`;
- a path deployment could build with a base such as `/webblueprint/`;
- application routes remain defined relative to the application root;
- the static bundle includes an Apache SPA fallback so direct proposal/demo URLs resolve to `index.html`.

U0.6 resolved the previously open publication choice in favor of the independent subdomain model recorded by ADR-0005.

## Consequences

- Render is not a production target for WebBlueprint.
- A temporary Render preview created during U0.2 remains non-canonical visual evidence only.
- The existing EliasWorks root portfolio must not be overwritten by WebBlueprint.
- Continuous delivery publishes accepted `main` revisions to the independent WebBlueprint subdomain infrastructure.
- Public application/demo URLs must be stable enough to share in commercial proposals.
- Direct deep links and browser refresh behavior must work on the EliasWorks hosting stack.
- The final subdomain, FTP target and deployment contract are governed by ADR-0005 and U0.6.

## Rationale

WebBlueprint is part of the EliasWorks public product surface, but it is operationally independent from the Laravel portfolio at the root domain. Its landing page, application catalog, documentation and navigable proposal demos therefore use their own subdomain while remaining under the EliasWorks domain family.
