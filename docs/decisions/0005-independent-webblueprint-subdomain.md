# ADR-0005 · Independent WebBlueprint Subdomain

Status: **Accepted**  
Date: **2026-09-21**

## Decision

WebBlueprint is an independent web application hosted at:

- `https://webblueprint.eliasworks.uy`

It is not mounted under the Laravel portfolio route space.

The browser-facing application root is `/`, while the current EliasWorks FTP hosting maps the site to its own physical directory:

- `public_html/webblueprint/`

## Consequences

- Vite keeps production base `/`;
- React Router keeps the subdomain root as its basename;
- the root Laravel application at `https://eliasworks.uy` remains operationally independent;
- Apache `.htaccess` SPA fallback belongs inside the WebBlueprint deployment directory;
- production CD publishes only the WebBlueprint `dist/` bundle into that directory;
- production smoke tests target the subdomain and direct deep links;
- Render is not a canonical deployment target.

## Delivery rule

Production must deploy the exact `dist/` artifact created by a successful CI run for `main`, rather than rebuilding a second unverified bundle in the deployment job.
