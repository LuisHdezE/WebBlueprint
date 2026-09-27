# V8 — Applications · Blog Article

## Scope
Third real view in the Applications family: `/applications/blog/post`.

## Architecture
- Reuses the canonical `BlogPostDto` catalog instead of duplicating article summary metadata.
- Long-form article blocks are modeled separately and linked through `postId`.
- Reuses `BlogPostAuthor` and `BlogPostStatus` from List/Grid.
- `BlogArticleContent` owns structured long-form rendering and is prepared for the future Blog Editor boundary.
- All editorial copy stays governed outside Presentation.
- Explicit route remains before the `applications/*` wildcard.
- Pet Shop is not a visual reference.

## QA
- Adapter verifies article detail resolves against the canonical post catalog.
- Architecture test guards shared metadata reuse and governed content.
- Browser QA validates deep link, structured article rendering, shell and responsive overflow.
- Production deployment smoke includes the article deep link.

QA status: PASS — CI #225 (`36319766694`) on implementation HEAD `f973f3133f0ef4ad16a0896accf9d63a744dcf93`: Quality Gate, Automated QA Gate, Browser QA Gate, exported React smoke and deployable SPA fallback all passed.
