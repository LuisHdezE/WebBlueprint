# U1.3 · Mapa de navegación y propiedad de vistas aceptadas

Estado: **BORRADOR GOBERNADO**

## Convención

Las claves y rutas son identificadores técnicos en inglés. Las etiquetas visibles permanecen en español.

Las rutas indicadas como `demo-relative` viven debajo de `/demo/:slug/*` cuando una definición de aplicación las selecciona. Las rutas `product-public` o `auth` representan patrones exportables/consumibles y no obligan a WebBlueprint a exponerlas como rutas propias durante U1.

`permission_hint` es metadata futura y no implica RBAC implementado en esta etapa.

## Vistas diferenciadas `ADAPT`

| Referencia | page_key | Etiqueta | Ámbito/ruta sugerida | Grupo | icon_key | Menú | Orden | Propiedad probable | permission_hint |
|---|---|---|---|---|---|---|---:|---|---|
| `index.html` | `dashboard` | Panel | `demo-relative: dashboard` | Resumen | `layout-dashboard` | sí | 10 | transversal | `dashboard.read` |
| `app-calendar.html` | `calendar` | Calendario | `demo-relative: calendar` | Planificación | `calendar-days` | sí | 20 | agenda/servicios/operaciones | `calendar.read` |
| `app-chat.html` | `chat` | Chat | `demo-relative: chat` | Comunicación | `messages-square` | sí | 30 | CRM/soporte | `messages.read` |
| `app-contacts.html` | `contacts` | Contactos | `demo-relative: contacts` | Relaciones | `contact-round` | sí | 40 | CRM | `contacts.read` |
| `app-mailbox.html` | `mailbox` | Correo | `demo-relative: mailbox` | Comunicación | `mail` | sí | 50 | comunicación/soporte | `mail.read` |
| `app-notes.html` | `notes` | Notas | `demo-relative: notes` | Productividad | `notebook-pen` | sí | 60 | productividad | `notes.read` |
| `app-scrumboard.html` | `kanban-board` | Tablero | `demo-relative: board` | Trabajo | `columns-3` | sí | 70 | proyectos/CRM/operaciones | `board.read` |
| `app-todoList.html` | `task-list` | Tareas | `demo-relative: tasks` | Trabajo | `list-checks` | sí | 80 | productividad/operaciones | `tasks.read` |
| `app-blog-post.html` | `article-detail` | Artículo | `demo-relative: content/:articleId` | Contenido | `file-text` | no | 90 | contenido/blog | `content.read` |
| `app-ecommerce-product-list.html` | `product-catalog-admin` | Productos | `demo-relative: products` | Comercio | `package-search` | sí | 100 | comercio/inventario | `products.read` |
| `app-ecommerce-product-shop.html` | `product-catalog-public` | Tienda | `product-public: shop` | Comercio | `shopping-bag` | sí | 110 | comercio público | `catalog.read` |
| `app-ecommerce-product.html` | `product-detail` | Detalle de producto | `demo-relative: products/:productId` | Comercio | `package` | no | 120 | comercio | `products.read` |
| `app-invoice-list.html` | `invoice-list` | Facturas | `demo-relative: invoices` | Facturación | `files` | sí | 130 | facturación | `invoices.read` |
| `app-invoice-preview.html` | `invoice-preview` | Vista de factura | `demo-relative: invoices/:invoiceId` | Facturación | `file-check-2` | no | 140 | facturación | `invoices.read` |
| `map-leaflet.html` | `map-view` | Mapa | `demo-relative: map` | Ubicaciones | `map` | condicional | 150 | logística/servicios/campo | `map.read` |
| `user-profile.html` | `user-profile` | Perfil | `demo-relative: profile` | Cuenta | `user-round` | no | 160 | transversal | `profile.read` |
| `user-account-settings.html` | `account-settings` | Configuración de cuenta | `demo-relative: settings/account` | Cuenta | `user-cog` | no | 170 | transversal | `account.manage` |
| `pages-contact-us.html` | `contact-page` | Contacto | `product-public: contact` | Ayuda | `messages-circle` | condicional | 180 | superficie pública | — |
| `pages-faq.html` | `faq` | Preguntas frecuentes | `product-public: faq` | Ayuda | `circle-help` | condicional | 190 | soporte/público | — |
| `pages-knowledge-base.html` | `knowledge-base` | Base de conocimiento | `product-public: knowledge` | Ayuda | `book-open` | condicional | 200 | soporte/servicio | `knowledge.read` |
| `pages-error404.html` | `not-found` | Página no encontrada | `product-public: *` | Sistema | `file-question` | no | 900 | transversal | — |
| `pages-maintenence.html` | `maintenance` | Mantenimiento | `product-public: maintenance` | Sistema | `wrench` | no | 910 | transversal | — |
| `auth-boxed-signup.html` | `auth-sign-up` | Crear cuenta | `auth: sign-up` | Acceso | `user-plus` | no | 920 | Auth | — |
| `auth-boxed-password-reset.html` | `auth-password-reset` | Recuperar contraseña | `auth: password-reset` | Acceso | `key-round` | no | 930 | Auth | — |
| `auth-boxed-2-step-verification.html` | `auth-two-factor` | Verificación en dos pasos | `auth: two-factor` | Acceso | `shield-check` | no | 940 | Auth | — |
| `auth-boxed-lockscreen.html` | `auth-lockscreen` | Bloqueo de sesión | `auth: lockscreen` | Acceso | `lock-keyhole` | no | 950 | Auth | — |

## Relaciones anidadas

- `product-detail` depende de `product-catalog-admin` o de otra superficie que seleccione un producto; no aparece como entrada primaria de menú.
- `invoice-preview` depende de `invoice-list` o de un flujo que seleccione un documento.
- `article-detail` depende de una colección/contenido que puede originarse en `ContentCollection`, clasificado `MERGE`.
- `user-profile` y `account-settings` pertenecen preferentemente al menú de usuario/cuenta y no al sidebar principal.
- los flujos Auth no pertenecen al sidebar de una aplicación autenticada.
- `not-found` y `maintenance` son estados de sistema, nunca navegación primaria.

## Propiedad por preset/aplicación

La metadata final no se duplicará por demo. Una definición de aplicación seleccionará `page_key` estables y podrá ordenar/ocultar entradas sin redefinir la vista.

Ejemplos de agrupación futura, sin crear presets todavía:

- Comercio: dashboard, productos, tienda, detalle de producto, facturas;
- CRM/Soporte: dashboard, contactos, chat, correo, conocimiento;
- Productividad/Proyectos: dashboard, calendario, tablero, tareas, notas;
- Logística/Campo: dashboard, mapa, calendario, tareas;
- Contenido: dashboard, colección de contenido (`MERGE`) y detalle de artículo.

## Regla de U2

Antes de implementar la primera vista aceptada se debe definir el contrato de metadata compartida que permita a registro, demo, Compositor y exportación consumir la misma `page_key`, etiqueta visible, ruta e icono.
