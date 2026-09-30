# V12 — Applications · Contacts

## Scope
Real Contacts view at `/applications/contacts`.

## Architecture
- Governed contact DTO/provider boundary.
- Feature-level list/detail components.
- Reuses PageShell, SurfaceCard, SearchField, Avatar, StatusBadge and KeyValueList.
- Search and selection remain local UI state.
- Chat and Contacts share a master-detail layout idea, but not enough behavior to justify a global abstraction yet.

## QA
- Adapter validates the canonical directory.
- Architecture tests guard governed content, primitive reuse and explicit routing.
- Browser QA covers search, selection, mobile and overflow.
- Production smoke includes the contacts route.

QA status: PASS — CI #239 (`36662374840`) on implementation HEAD `b7769eb34185b73ef415c4c76438d1696cfedf28`: Quality Gate, Automated QA Gate, Browser QA Gate, exported React smoke and deployable SPA fallback all passed.
