# V10 — Applications · Calendar

## Scope
Real Calendar view at `/applications/calendar`.

## Architecture
- Governed monthly calendar DTO/provider boundary.
- CSS Grid month view without a third-party calendar dependency.
- Reuses PageShell, SurfaceCard and SelectField.
- Category filtering is local presentation state over governed event data.
- Responsive mobile agenda preserves the same canonical events.
- Month navigation is intentionally not simulated until a multi-month contract exists.

## QA
- Adapter validates complete month, weekdays and events.
- Architecture tests guard governed content, reuse and explicit routing.
- Browser QA covers month grid, event filtering, mobile agenda and overflow.
- Production smoke includes the calendar route.

QA status: PENDING CI AND BROWSER QA
