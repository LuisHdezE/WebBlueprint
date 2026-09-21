# ADR-0004 · Canonical Publication Target

Status: **Accepted**  
Date: **2026-09-21**

## Decision

The canonical public publication target for WebBlueprint is:

- `https://eliasworks.uy`

WebBlueprint production/publication architecture must be designed around EliasWorks infrastructure and the final governed path/subdomain selected under that domain.

## Consequences

- Render is not a production target for WebBlueprint.
- A temporary Render preview created during U0.2 is treated only as non-canonical visual evidence and must not influence the deployment architecture.
- Continuous delivery will eventually publish accepted `main` revisions to EliasWorks infrastructure.
- Public application/demo URLs must be stable enough to share in commercial proposals.
- Direct deep links and browser refresh behavior must work on the EliasWorks hosting stack.
- The exact EliasWorks path/subdomain, SPA fallback/rewrite mechanism, caching rules and deployment transport will be documented when the hosting integration is implemented.

## Rationale

WebBlueprint is intended to be part of the EliasWorks public product surface. Its landing page, application catalog, documentation and navigable proposal demos are commercial-facing assets and therefore belong under the EliasWorks publication domain rather than an unrelated hosting-specific product URL.
