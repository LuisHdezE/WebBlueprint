# VT-3.5 · Asset Detail / Maintenance

Estado: **EN REVISIÓN**
Base apilada: `VT-3.4@4ee10356d332b387c13c5a50c47eea0e7e4d58c4`
Rama: `feat/volketas-template-vt3-asset-maintenance`

## Decisión de arquitectura

Se revisaron:

- `InventoryView`, orientada a existencias/stock;
- módulo especializado `features/inventory`, orientado a dispositivos físicos.

Conclusión:

> Un activo operacional con identidad, ubicación, asignación, condición e historial de mantenimiento no debe forzarse dentro del modelo de stock.

VT-3.5 añade por tanto un patrón reusable nuevo de Asset Detail / Maintenance sin modificar ni duplicar el inventario existente.

## Objetivo

Cerrar la deuda reusable de activos operativos que Volketas necesita y que también puede reutilizarse en logística, flotas, field service, facilities y mantenimiento.

## Contrato reusable

Se incorpora `AssetRepository` y modelos para:

- identidad;
- código;
- nombre;
- categoría;
- estado;
- condición;
- ubicación;
- asignación;
- último servicio;
- próximo mantenimiento;
- alta;
- valor;
- notas;
- historial de mantenimiento;
- loading / success / empty / error.

Estados de activo:

- available;
- assigned;
- in_service;
- maintenance;
- inactive.

Tipos de mantenimiento:

- preventive;
- corrective;
- inspection.

Estados de mantenimiento:

- scheduled;
- in_progress;
- completed;
- cancelled.

## Repository mock determinista

`mockAssetRepository` entrega un activo físico con:

- ubicación;
- asignación actual;
- próximo mantenimiento;
- historial preventivo/correctivo/inspección;
- responsable;
- costo;
- notas.

Incluye test de detalle completo y estado vacío.

## Vista

`AssetDetailView` incorpora:

- cabecera compacta;
- código y estado;
- condición;
- ubicación;
- asignación;
- valor;
- alta;
- próximo mantenimiento;
- resumen operativo;
- notas;
- historial/programación de mantenimiento;
- responsable/costo;
- loading / empty / error.

## Integración Template / Composer

Nueva ruta gobernada:

`/applications/management/asset`

La familia Gestión incorpora ahora:

- Dashboard;
- Dispatch;
- Orden de servicio;
- Alertas;
- Activo;
- Clientes;
- Órdenes;
- Inventario.

El total gobernado de rutas pasa de 133 a 134.

## Integración Volketas

El preset `volketas` incorpora la vista Asset Detail.

En Volketas este contrato podrá especializarse hacia:

- volquetas;
- camiones;
- otros recursos operativos;
- estado y disponibilidad;
- ubicación;
- orden activa;
- mantenimiento preventivo/correctivo;
- historial y costos.

No se hardcodea ese vocabulario dentro de WebBlueprint.

## Qué reutiliza y qué no

### Reutiliza

- primitives visuales;
- `StatusBadge`;
- `InlineFeedback`;
- shell/theme;
- disciplina repository/state;
- patrones de detalle ya usados en Service Order.

### No reutiliza

- `InventoryItem`, porque modela stock por cantidad;
- DTOs específicos de dispositivos, porque representan otro dominio;
- rutas de evaluación/despiece del módulo inventory.

## Fuera de alcance

- CRUD de activos;
- programación editable;
- órdenes de mantenimiento;
- repuestos utilizados;
- downtime;
- odómetro/horas;
- telemetría;
- documentos del activo;
- persistencia;
- backend/API;
- app móvil.

## Gate VT-3.5

- [x] análisis de reutilización realizado;
- [x] stock no deformado como activo;
- [x] contrato reusable;
- [x] repository boundary;
- [x] mock determinista;
- [x] detalle operativo;
- [x] historial/programación mantenimiento;
- [x] loading / success / empty / error;
- [x] ruta gobernada;
- [x] Composer puede seleccionar la vista;
- [x] preset Volketas incluye Asset Detail;
- [x] tests actualizados;
- [ ] CI del HEAD exacto;
- [ ] aceptación visual;
- [ ] aprobación de merge.

## Cierre de VT-3

Con VT-3.5 quedan cubiertas las deudas reusable prioritarias inicialmente definidas para la plantilla:

- Dispatch Board;
- Service Order Detail;
- Alert Center;
- Asset Detail / Maintenance.

Operational Timeline permanece pospuesto hasta que exista un segundo consumidor real.

## Próximo bloque

`VT-4 · Complete Template`

Objetivo:

1. revisar la selección final del preset Volketas;
2. retirar vistas sustitutas que ya no aporten;
3. ordenar navegación;
4. identificar aliases/labels específicos que deban resolverse sin contaminar el catálogo genérico;
5. preparar la plantilla para el Export Gate.

## Regla de retorno

No se abre nueva deuda genérica fuera de la lista necesaria para Volketas. Después de VT-4 y VT-5, el trabajo retorna al producto Volketas.
