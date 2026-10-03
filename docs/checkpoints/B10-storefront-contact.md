# B10 · Storefront Contact / WhatsApp Landing Skeleton

## Baseline

- Repository: `LuisHdezE/WebBlueprint`
- Base: `main@829dabd1e2856268b5a0b0b6e4a9539dbfe63f3e`
- Branch: `feat/storefront-contact`
- Previous increment: B9 · Storefront Favorites / Wishlist Skeleton

## Goal

Create the dedicated public contact destination for the Storefront so the existing WhatsApp floating action, footer support link and home CTA resolve to a real Storefront route.

## Route

- `/store/contact`

## Included

- `StorefrontContactChannelDto`
- `StorefrontContactViewDto`
- `StorefrontProvider.getContactView()`
- provider-backed contact JSON
- WhatsApp and email channel placeholders
- service area
- opening hours
- contact topics
- links to products and shipping
- route in Storefront shell
- **Contacto** entry in Blueprint sidebar
- provider tests
- architecture tests
- Browser QA
- production deep-link smoke

## Existing navigation completed by B10

The following existing Storefront links now resolve to a completed route:

- floating WhatsApp button → `/store/contact`
- footer contact link → `/store/contact`
- footer/support WhatsApp CTA → `/store/contact`
- home WhatsApp CTA → `/store/contact`

## Explicitly excluded

- no WhatsApp Business API
- no `wa.me` deep link yet
- no real phone number
- no email sending
- no contact form submission
- no CRM integration
- no localStorage
- no sessionStorage
- no backend persistence
- no customer-state mutation

## Sidebar rule

Because B10 adds a completed Storefront route, `/store/contact` is added to the **Tienda online** sidebar in the same PR.

## QA contract

Automated checks verify:

- contact deep link responds
- page renders in Storefront shell
- two provider-driven channels render
- real messaging controls remain blocked
- service area and hours render
- floating WhatsApp action resolves to `/store/contact`
- no messaging API or client persistence is introduced
- production smoke covers `/store/contact`
- no horizontal overflow

## Next candidate

**B11 · Storefront Warranty / Returns Skeleton**

Potential scope:

- dedicated `/store/warranty`
- warranty terms/cards
- return eligibility placeholders
- provider-backed policy content
- no return request mutation yet
- sidebar coverage in the same PR
