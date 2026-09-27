# V6 — Applications · Blog List

## Scope
First real view in the Applications family: `/applications/blog/list`.

## Architecture
- Presentation depends on the `BlogContentProvider` port.
- User-facing demo content is governed by JSON and adapted outside Presentation.
- Existing reusable primitives are preferred: `PageShell`, `SurfaceCard`, `SearchField`, `SelectField`, `Avatar`, `EmptyState`.
- Search and category filtering are local presentation state; no backend or persistence is implied.
- The explicit route is declared before the `applications/*` wildcard.
- Pet Shop is not used as an implementation reference.

## QA
- Adapter test covers governed content and stable post identifiers.
- Architecture test guards content separation and route ordering.
- Browser QA covers deep-link response, shell presence, governed post count, search, empty state and responsive overflow.
- Production deployment smoke includes the new deep link.

QA status: PENDING CI AND BROWSER QA
