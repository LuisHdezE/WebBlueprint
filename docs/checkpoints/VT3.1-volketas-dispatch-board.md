# VT-3.1 · Dispatch Board

Estado: **EN REVISIÓN**
Base apilada: `VT-2@ab26deee592e7af5e55458574f7cda9dd55bebe8`
Rama: `feat/volketas-template-vt3-dispatch`

## Objetivo

Cerrar la primera deuda funcional reusable detectada por Volketas: un tablero operativo de despacho que pueda reutilizarse en logística, field service, delivery, mantenimiento y otros productos con asignaciones diarias.

La implementación no contiene reglas específicas de volquetas.

## Entregado

### Contrato reusable

Se incorpora `DispatchRepository` y modelos tipados para:

- tipo de tarea;
- estado operativo;
- horario;
- cliente;
- ubicación;
- recurso;
- responsable;
- observación;
- filtro por estado;
- estados loading / success / empty / error.

Estados gobernados:

- scheduled;
- assigned;
- en_route;
- on_site;
- completed;
- delayed;
- incident.

Tipos iniciales:

- delivery;
- pickup;
- transfer;
- service.

## Mock determinista

`mockDispatchRepository` mantiene datos fuera de presentación y representa una jornada operativa con tareas ordenadas por hora.

Se incluyen pruebas para:

- carga determinista;
- filtrado por estado;
- estado vacío explícito.

## Vista

`DispatchBoardView` ofrece:

- encabezado operacional compacto;
- filtro de estado;
- agenda diaria densa;
- horario;
- referencia;
- tipo;
- cliente / ubicación;
- recurso;
- responsable;
- estado;
- observación contextual.

La superficie preserva la densidad visual establecida por WebBlueprint y usa los tokens de theme introducidos en VT-2.

## Integración Template / Composer

Nueva ruta gobernada:

`/applications/management/dispatch`

La familia `Gestión` incorpora:

- Dashboard;
- Dispatch;
- Clientes;
- Órdenes;
- Inventario.

El total gobernado de rutas pasa de 130 a 131.

## Integración Volketas

El preset `volketas` incorpora Dispatch inmediatamente después del Dashboard.

La especialización futura del producto podrá mapear los contratos genéricos a:

- entrega;
- retiro;
- traslado;
- disposición;
- volqueta;
- camión;
- chofer;
- obra.

Ese vocabulario NO se incorpora al componente reusable de WebBlueprint.

## Fuera de alcance

VT-3.1 no incluye:

- drag & drop;
- cambio de estado persistente;
- rutas GPS;
- mapa embebido;
- reasignación interactiva;
- planificación multijornada;
- Service Order Detail;
- Operational Timeline;
- Alert Center;
- backend/API;
- app móvil.

Estas capacidades se incorporarán únicamente cuando tengan un contrato y prioridad propios.

## Gate VT-3.1

- [x] contrato reusable;
- [x] repository boundary;
- [x] mock determinista;
- [x] loading/success/empty/error;
- [x] filtro por estado;
- [x] ruta general gobernada;
- [x] Composer puede seleccionar la vista;
- [x] preset Volketas incluye Dispatch;
- [x] tests de repository;
- [x] tests de navegación/preset actualizados;
- [ ] CI del HEAD exacto;
- [ ] aceptación visual;
- [ ] aprobación de merge del usuario.

## Próximo bloque candidato

`VT-3.2 · Service Order Detail`

Debe construirse como superficie reusable de detalle de una orden/servicio con:

- cabecera e identidad;
- cliente y ubicación;
- estado;
- asignaciones;
- recursos;
- costos/resumen;
- notas;
- evidencias;
- timeline de actividad.

No iniciar VT-3.2 hasta cerrar el checkpoint de VT-3.1.

## Regla de retorno

El trabajo en WebBlueprint continúa solo por deuda reusable necesaria para completar la plantilla Volketas. Tras completar el preset y el Export Gate, el frente vuelve al producto Volketas.
