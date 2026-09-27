# V6 · Vistas de usuario

Estado: **EN IMPLEMENTACIÓN · LISTO PARA REVISIÓN**

## Entregado

- `/user/profile`: perfil con identidad, contacto, estado de cuenta, resumen de acceso y actividad reciente.
- `/user/account-settings`: datos personales, seguridad y preferencias de comunicación.
- Ambas vistas reutilizan `PageShell`, `AppIcon` y tokens de tema.
- Los datos son demostrativos y están delimitados en la capa de presentación; no se presenta persistencia inexistente.

## Pendiente

- Validación visual/QA de las dos rutas en preview.
- Map View con Leaflet, en el siguiente incremento.
