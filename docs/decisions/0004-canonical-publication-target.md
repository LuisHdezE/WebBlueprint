# ADR-0004 · Canonical Publication Target

Status: **Accepted**  
Date: **2026-09-21**

## Decision

The canonical public publication target for WebBlueprint is:

- `https://eliasworks.uy`

WebBlueprint production/publication architecture must be designed around EliasWorks infrastructure and the final governed path/subdomain selected under that domain.

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

This is sufficient evidence to make WebBlueprint deep-link-ready without selecting the final EliasWorks route yet.

## U0.2 portability decision

U0.2 must not hardcode a deployment path.

WebBlueprint now treats Vite's `BASE_URL` as the React Router basename. Therefore:

- a root/subdomain build can keep Vite base `/`;
- a path deployment can build with a base such as `/webblueprint/`;
- application routes remain defined relative to the application root;
- the static bundle includes an Apache SPA fallback so direct proposal/demo URLs can resolve to `index.html`.

The exact public address remains intentionally undecided until the publication integration is governed. Candidates may include a path or subdomain under `eliasworks.uy`, but U0.2 does not bind the product to either one.

## Consequences

- Render is not a production target for WebBlueprint.
- A temporary Render preview created during U0.2 is treated only as non-canonical visual evidence and must not influence the deployment architecture.
- The existing EliasWorks root portfolio must not be overwritten by WebBlueprint.
- Continuous delivery will eventually publish accepted `main` revisions to EliasWorks infrastructure.
- Public application/demo URLs must be stable enough to share in commercial proposals.
- Direct deep links and browser refresh behavior must work on the EliasWorks hosting stack.
- WebBlueprint builds must remain portable between a path and a subdomain under EliasWorks until the final publication address is selected.
- The final path/subdomain, caching rules and FTP/CD wiring belong to the publication integration milestone rather than U0.2.

## Rationale

WebBlueprint is intended to be part of the EliasWorks public product surface. Its landing page, application catalog, documentation and navigable proposal demos are commercial-facing assets and therefore belong under the EliasWorks publication domain rather than an unrelated hosting-specific product URL.

The hosting audit also shows that EliasWorks already has a working GitHub Actions → FTP deployment model and an established pattern for hosting independent frontend bundles without replacing the root portfolio. U0.2 therefore prepares WebBlueprint for that environment while preserving the freedom to choose the final EliasWorks address later.
