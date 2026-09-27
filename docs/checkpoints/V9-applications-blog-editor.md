# V9 — Applications · Blog Editor

## Scope
Fourth real Blog view: `/applications/blog/editor`.

## Architecture
- Edits canonical post metadata plus the same structured article block contract used by Article.
- Reuses global TextField, TextAreaField and SelectField; TextField/TextAreaField gain backward-compatible controlled APIs instead of editor-only inputs.
- Reuses BlogPostAuthor, BlogPostStatus and BlogArticleContent in the live preview.
- Editor configuration and copy stay governed outside Presentation.
- No persistence is invented: this increment demonstrates local editing and preview only.
- Explicit route remains before the Applications wildcard.

## QA
- Adapter validates editor configuration and resolves canonical post/detail.
- Architecture tests guard reuse and governed content.
- Browser QA validates controlled editing, live preview, desktop/mobile and overflow.
- Production smoke includes the editor route.

QA status: PASS — CI #229 (`36323127663`) on implementation HEAD `f353d0fea22288dde0bd6e380497587a4f5446ff`: Quality Gate, Automated QA Gate, Browser QA Gate, exported React smoke and deployable SPA fallback all passed.
