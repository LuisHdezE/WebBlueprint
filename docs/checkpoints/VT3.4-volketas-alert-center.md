# VT-3.4 · Alert Center

Estado: **EN REVISIÓN**
Base apilada: `VT-3.2@67f22054a64592cb570d4e35aab3a431b8eeda67`
Rama: `feat/volketas-template-vt3-alert-center`

## Decisión VT-3.3 · Operational Timeline

Se verificó que el timeline operativo incorporado en `ServiceOrderDetailView` no tiene todavía un segundo consumidor real fuera de la biblioteca/showcase.

Por tanto:

> VT-3.3 queda **POSPUESTO**, no cancelado.

No se extrae una abstracción reusable sin un segundo consumidor que la justifique.

## Objetivo VT-3.4

Cerrar una capacidad reusable de alta prioridad para Volketas: un centro de alertas operativas independiente de las notificaciones generales de UI.

Debe servir también para logística, field service, activos, mantenimiento, finanzas y otros productos.

## Contrato reusable

Se incorpora `AlertCenterRepository` con:

- severidad;
- estado;
- categoría;
- título;
- descripción;
- contexto;
- timestamp;
- acción opcional;
- resumen global;
- filtros;
- loading / success / empty / error.

Severidades:

- info;
- warning;
- critical.

Estados:

- open;
- acknowledged;
- resolved.

Categorías iniciales:

- schedule;
- service;
- asset;
- maintenance;
- document;
- payment;
- incident.

## Repository mock determinista

`mockAlertCenterRepository` contiene ejemplos operativos genéricos de:

- tarea vencida;
- permanencia excedida;
- mantenimiento próximo;
- documento por vencer;
- pago pendiente;
- incidencia.

No se hardcodea vocabulario de volquetas.

El resumen expone:

- abiertas;
- críticas;
- advertencias;
- reconocidas.

## Vista

`AlertCenterView` incorpora:

- resumen operativo compacto;
- filtro por severidad;
- filtro por estado;
- lista priorizada;
- contexto;
- antigüedad;
- estado;
- CTA contextual opcional;
- feedback loading / empty / error.

La UI mantiene la densidad establecida por WebBlueprint y consume el accent del theme.

## Integración Template / Composer

Nueva ruta gobernada:

`/applications/management/alerts`

La familia Gestión incorpora ahora:

- Dashboard;
- Dispatch;
- Orden de servicio;
- Alertas;
- Clientes;
- Órdenes;
- Inventario.

El total gobernado de rutas pasa de 132 a 133.

## Integración Volketas

El preset `volketas` incluye Alert Center.

En Volketas, este contrato podrá representar:

- retiros vencidos;
- permanencias excedidas;
- mantenimiento de volquetas/camiones;
- documentos por vencer;
- servicios sin asignar;
- incidencias;
- pagos atrasados.

Ese mapeo se realizará fuera de WebBlueprint.

## Fuera de alcance

- notificaciones push;
- email;
- WhatsApp;
- acknowledge/resolution persistente;
- reglas de generación;
- scheduler;
- escalado automático;
- backend/API;
- integración móvil.

## Gate VT-3.4

- [x] decisión explícita de posponer VT-3.3;
- [x] contrato reusable;
- [x] repository boundary;
- [x] mock determinista;
- [x] resumen global;
- [x] filtros de severidad y estado;
- [x] loading / success / empty / error;
- [x] ruta gobernada;
- [x] Composer puede seleccionar la vista;
- [x] preset Volketas incluye Alert Center;
- [x] tests de repository;
- [x] tests de navegación/preset actualizados;
- [ ] CI del HEAD exacto;
- [ ] aceptación visual;
- [ ] aprobación de merge.

## Próximo bloque

`VT-3.5 · Asset Detail / Maintenance`

Antes de implementarlo debe revisarse la coexistencia entre:

- `InventoryView`;
- el módulo de inventario especializado existente;
- la nueva necesidad de activos operativos.

Objetivo: reutilizar lo existente y añadir únicamente el patrón faltante de detalle/mantenimiento.

## Regla de retorno

WebBlueprint se modifica únicamente por capacidades reusable necesarias para completar la plantilla Volketas. Una vez terminadas estas deudas y cerrado el Export Gate, el trabajo retorna inmediatamente al producto Volketas.
