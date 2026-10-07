# B18 · Storefront Payment Domain

## Estado

Rama:

```txt
feat/storefront-payment-domain-b18
```

Base real:

```txt
main@c637e0a4f6f094824566983b609a6a93320ff35f
```

> Nota: los números PR #105 y #106 ya fueron usados por otros bloques del repositorio. Este bloque conserva el alcance funcional de B18 · Payment Domain, pero usará el próximo número de PR disponible en GitHub.

## Objetivo

Definir el dominio de selección de método de pago del Storefront sin incorporar interfaz interactiva todavía.

## Incluye

- `storefront.payment.json` como fuente provider-driven.
- `StorefrontPaymentMethodDto`.
- `StorefrontPaymentViewDto`.
- `getPaymentView()` en `StorefrontProvider`.
- `JsonStorefrontProvider.getPaymentView()`.
- Lógica pura de aplicación:
  - `resolvePayment()`.
  - `deriveCheckoutPayment()`.
  - `isPaymentEnabled()`.
- Unit tests del dominio.
- Adapter tests del provider.
- Architecture tests de límites.

## Métodos definidos

- `card`.
- `cash`.
- `mercado-pago` demo.

Todos los métodos son configuraciones demo del Blueprint y no procesan pagos reales.

## Restricciones respetadas

No se implementa:

- UI interactiva de selección.
- Context React.
- Mercado Pago SDK.
- Stripe.
- backend.
- fetch.
- localStorage.
- sessionStorage.
- creación de órdenes.
- mutación de inventario.

## Próximo bloque

B18 · Payment Context.

Debe implementar:

- `StorefrontPaymentContext`.
- `useStorefrontPayment()`.
- Provider React.
- Estado exclusivamente en memoria.

No debe implementar aún UI interactiva ni pagos reales.
