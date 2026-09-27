# V11 — Applications · Chat

## Scope
Real Chat view at `/applications/chat`.

## Architecture
- Governed conversation/message DTO and provider boundary.
- Feature-level master-detail components keep list and thread responsibilities separate.
- Reuses PageShell, SurfaceCard, SearchField and Avatar.
- Search, conversation selection and message composition are local UI state.
- Sending appends only an in-memory message; no backend delivery or persistence is simulated.
- The master-detail pattern remains feature-local until a second real consumer justifies global extraction.

## QA
- Adapter validates canonical conversations, participants and messages.
- Architecture tests guard governed content, reuse and explicit routing.
- Browser QA covers search, selected thread, local composition, mobile and overflow.
- Production smoke includes the chat route.

QA status: PENDING CI AND BROWSER QA
