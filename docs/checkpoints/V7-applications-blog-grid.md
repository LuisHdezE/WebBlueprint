# V7 — Applications · Blog Grid

## Scope
Second real view in the Applications family: `/applications/blog/grid`.

## Reuse architecture
- Grid and List share the same governed post catalog and `BlogContentProvider`.
- Repeated search/category controls are extracted into `BlogFilters`.
- Repeated author/status presentation is extracted into `BlogPostMeta`.
- Filtering/category derivation is shared through `blogPresentation`.
- Grid-specific copy is governed separately from Presentation.
- The explicit route is declared before the `applications/*` wildcard.
- Pet Shop is not used as an implementation reference.

## QA
- Adapter coverage verifies Grid reuses the canonical posts.
- Architecture coverage guards shared presentation patterns and explicit route ordering.
- Browser QA covers deep link, shared post count, search behavior, shell and responsive overflow.
- Production deployment smoke includes the Grid deep link.

QA status: PASS — CI #222 (`36294551217`) on implementation HEAD `fb2b86d610fd49e587b5e7b4e71b9170a90af78e`: Quality Gate, Automated QA Gate, Browser QA Gate, exported React smoke and deployable SPA fallback all passed.
