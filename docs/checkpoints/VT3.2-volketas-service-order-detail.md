# VT-3.2 · Service Order Detail

Estado: **EN REVISIÓN**
Base apilada: `VT-3.1@b2e1c760685b666176ea80952b2b992a6e1f3ac3`
Rama: `feat/volketas-template-vt3-service-order`

## Objetivo

Cerrar la segunda deuda reusable detectada por Volketas: una vista de detalle de orden/servicio que concentre contexto operativo, asignaciones, recursos, evidencia, actividad y resumen económico sin acoplarse al dominio específico de volquetas.

## Entregado

### Contrato reusable

Se incorpora `ServiceOrderRepository` con:

- identidad y referencia;
- título;
- estado;
- cliente y contacto;
- ubicación;
- ventana programada;
- timestamps;
- asignaciones;
- recursos;
- evidencia;
- notas;
- resumen económico;
- timeline de actividad;
- estados loading / success / empty / error.

Estados iniciales:

- requested;
- scheduled;
- in_progress;
- completed;
- cancelled;
- delayed.

## Repository mock determinista

`mockServiceOrderRepository` mantiene la información fuera de Presentation y entrega un detalle completo de ejemplo.

Incluye pruebas para:

- detalle completo y determinista;
- cantidades de asignaciones, recursos, evidencia y actividad;
- estado vacío para identificadores inexistentes.

## Vista

`ServiceOrderDetailView` incorpora:

- cabecera compacta con referencia y estado;
- cliente/contacto;
- ubicación;
- ventana de servicio;
- asignaciones;
- recursos;
- timeline operativo;
- evidencia;
- notas;
- resumen económico;
- feedback loading / empty / error.

La vista conserva la densidad tipográfica de WebBlueprint y consume los tokens de VT-2.

## Integración Template / Composer

Nueva ruta gobernada:

`/applications/management/service-order`

La familia Gestión queda compuesta por:

- Dashboard;
- Dispatch;
- Orden de servicio;
- Clientes;
- Órdenes;
- Inventario.

El total gobernado de rutas pasa de 131 a 132.

## Integración Volketas

El preset `volketas` incorpora la vista de detalle inmediatamente después de Dispatch.

La especialización futura del producto podrá mapear el contrato genérico hacia:

- orden de entrega/retiro;
- cliente/empresa;
- obra/sitio;
- volqueta;
- camión;
- chofer;
- disposición;
- evidencia fotográfica/documental;
- importes y cobro.

Ese vocabulario no se hardcodea en la vista reusable.

## Timeline

VT-3.2 incluye un timeline operacional mínimo dentro de la superficie de detalle porque forma parte natural del contrato de una orden.

Esto NO cierra todavía VT-3.3 como capability reusable independiente.

VT-3.3 deberá evaluar si el timeline debe extraerse a un componente/patrón reutilizable con contrato propio y múltiples consumidores.

## Fuera de alcance

VT-3.2 no incluye:

- edición;
- cambio de estado;
- acciones operativas persistentes;
- carga real de fotos/documentos;
- firma;
- mapa;
- GPS;
- cálculo real de precios;
- facturación;
- backend/API;
- integración móvil.

## Gate VT-3.2

- [x] contrato reusable;
- [x] repository boundary;
- [x] mock determinista;
- [x] loading / success / empty / error;
- [x] asignaciones y recursos;
- [x] evidencia;
- [x] timeline interno;
- [x] resumen económico;
- [x] ruta general gobernada;
- [x] Composer puede seleccionar la vista;
- [x] preset Volketas incluye el detalle;
- [x] tests actualizados;
- [ ] CI del HEAD exacto;
- [ ] aceptación visual;
- [ ] aprobación de merge del usuario.

## Próximo bloque candidato

`VT-3.3 · Operational Timeline`

Antes de implementarlo debe verificarse si la segunda superficie consumidora justifica la extracción de un patrón compartido. Si no existe segundo consumidor real, la extracción se pospone para evitar abstracción especulativa.

Alternativa siguiente si la extracción no está justificada:

`VT-3.4 · Alert Center`.

## Regla de retorno

WebBlueprint continúa solo por deuda reusable que desbloquea la plantilla Volketas. Tras completar la plantilla y su Export Gate, el frente retorna al producto Volketas.
