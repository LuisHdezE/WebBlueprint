# VT-4 · Complete Volketas Template

Estado: **EN REVISIÓN**
Base apilada: `VT-3.5@6da4d646689de60cc11c462d9532a9ae728af355`
Rama: `feat/volketas-template-vt4-complete`

## Objetivo

Completar la selección final del preset Volketas sin agregar nuevas features, retirar sustitutos que ya no aportan y resolver labels/secciones específicas del producto sin contaminar el catálogo genérico de WebBlueprint.

## Curación del preset

Se eliminan del preset Volketas las superficies que eran sustitutos o placeholders y ya no deben formar parte del template final:

- Gestión · Inventario;
- Tareas;
- Facturas · Lista;
- Charts;
- Widgets.

Razón:

- Inventario modela stock, no activos operativos;
- Tareas, facturas, charts y widgets no representan todavía superficies reales específicas del flujo Volketas dentro de este preset;
- mantenerlas daría una falsa sensación de completitud.

## Selección final VT-4

1. Dashboard
2. Dispatch
3. Orders
4. Service Order Detail
5. Calendar
6. Map
7. Alert Center
8. Customers
9. Asset Detail
10. User Profile
11. Account Settings
12. Sign In
13. Password Reset
14. Two Factor

## Presentación específica por preset

`ProjectPresetDefinition` incorpora opcionalmente:

`viewPresentation`

Cada ruta puede declarar:

- `label`
- `section`

Esto permite que el catálogo genérico siga usando nomenclatura reusable mientras un preset presenta vocabulario propio.

Ejemplos Volketas:

- Dispatch → Despacho
- Orders → Servicios
- Service Order → Orden de servicio
- Maps → Mapa
- Asset → Activos
- Customers → Clientes

Secciones Volketas:

- General
- Operaciones
- Relaciones
- Activos
- Usuario
- Acceso

No se duplican rutas ni componentes.

## Preview

Composer Preview aplica las presentaciones específicas del preset a:

- navegación;
- encabezado activo;
- agrupación por sección.

El manifest sigue conservando las rutas canónicas.

## Regla de arquitectura

> El producto puede renombrar la experiencia. El Blueprint conserva el contrato y las rutas genéricas.

Esto evita crear versiones como:

- VolketasDispatchView
- VolketasAssetView
- VolketasCustomerView

cuando la superficie reusable ya existe.

## Autenticación

El preset final incorpora únicamente las vistas de acceso que tienen sentido inmediato para una aplicación B2B administrada:

- Sign In
- Password Reset
- Two Factor

No se incluye Sign Up como requisito implícito porque el modelo de alta pública todavía no está definido para Volketas.

## Fuera de alcance

VT-4 no añade:

- nuevas vistas;
- obras/sitios;
- choferes;
- vehículos;
- pricing;
- finanzas;
- reportes;
- CRUD adicional;
- backend/API;
- móvil;
- cambios al proyecto Volketas real.

Esas capacidades quedan para la alineación posterior del producto o deuda futura explícitamente priorizada.

## Gate VT-4

- [x] preset curado;
- [x] sustitutos innecesarios retirados;
- [x] navegación ordenada;
- [x] labels específicos sin duplicar componentes;
- [x] secciones específicas por preset;
- [x] autenticación mínima incorporada;
- [x] tests actualizados;
- [ ] CI del HEAD exacto;
- [ ] aceptación visual;
- [ ] aprobación de merge.

## Próximo bloque

`VT-5 · Export Gate`

Objetivo:

1. verificar que el manifest exportado conserva la selección final;
2. verificar que theme y preset sobreviven al export;
3. comprobar que Preview y Export usan la misma selección;
4. identificar y cerrar cualquier ruta que todavía exporte placeholder en lugar de una vista real;
5. generar un artefacto exportable y probar instalación/build.

## Regla de retorno

Después de VT-5 no se abre otra ronda general de WebBlueprint salvo defecto bloqueante del export. El frente vuelve al proyecto Volketas real.
