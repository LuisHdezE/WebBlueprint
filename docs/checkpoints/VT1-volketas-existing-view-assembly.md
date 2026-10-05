# VT-1 · Existing View Assembly

Estado: **VALIDACIÓN DE INTEGRACIÓN A MAIN**
Base apilada: `VT-0@96b27d071b072df3f92fe0d4f64c5d00502bec90`
Rama: `feat/volketas-template-vt1`

## Objetivo

Promover vistas de gestión ya implementadas y reutilizables al catálogo general de WebBlueprint para que el preset Volketas pueda seleccionarlas sin duplicar código ni depender de la demo Pet Shop.

## Regla

> Si una vista real reusable ya existe, Volketas debe reutilizarla. No se crea una segunda versión específica para resolver el mismo patrón.

## Vistas promovidas

Se agrega una familia general `Gestión` al catálogo:

- `/applications/management/dashboard` → `DashboardView`
- `/applications/management/customers` → `CustomerDirectoryView`
- `/applications/management/orders` → `OrderListView`
- `/applications/management/inventory` → `InventoryView`

Estas superficies ya tenían:

- contratos/provider o repository boundaries;
- mocks deterministas fuera de presentación;
- estados operativos donde correspondía;
- primitives compartidas;
- tests previos.

VT-1 no copia ni mueve su implementación. Solo las hace consumibles desde el Template/Composer.

## Preset Volketas actualizado

La selección inicial ahora prioriza superficies reales:

1. Gestión · Dashboard
2. Gestión · Órdenes
3. Calendario
4. Maps
5. Gestión · Clientes
6. Gestión · Inventario
7. Tareas
8. Facturas · Lista
9. Charts
10. Widgets
11. Perfil
12. Configuración de cuenta

### Interpretación futura en Volketas

Estas etiquetas siguen siendo genéricas dentro de WebBlueprint.

Posteriormente Volketas podrá especializar semántica sin duplicar la superficie:

- Órdenes → Servicios / Órdenes de servicio
- Inventario → Volquetas / Activos
- Clientes → Clientes / Empresas
- Dashboard → Panel operativo

La capacidad de alias/navegación específica por preset todavía no forma parte del manifest actual y no se introduce silenciosamente en VT-1.

## Tests gobernados

Se actualiza la verificación de navegación para:

- mantener rutas absolutas y únicas;
- incluir la familia `Gestión`;
- registrar exactamente las cuatro nuevas rutas;
- actualizar el total gobernado de rutas de 126 a 130.

El test del preset Volketas valida también la nueva secuencia real.

## Qué NO resuelve VT-1

### Composer Preview

La Preview del Composer todavía valida principalmente:

- identidad;
- theme;
- selección;
- secuencia;
- navegación.

No renderiza automáticamente todas las superficies reales seleccionadas.

### Export

Este incremento no afirma que el ZIP exportado incorpore todavía estas cuatro vistas reales bajo el manifest actual.

Por tanto, la regla:

> Selección = Preview = Export

todavía no está cerrada extremo a extremo.

Esto queda para los bloques correspondientes, sin declarar falsos positivos.

## Deuda de Volketas no introducida aquí

Continúan pendientes:

- Dispatch Board;
- Service Order Detail;
- Obras / sitios;
- Asset Detail;
- Maintenance;
- Operational Timeline como vista;
- Alert Center;
- Pricing Rules;
- Accounts Receivable;
- Profitability;
- Reports Center;
- Audit Log;
- Onboarding;
- Importación CSV/Excel.

## Gate VT-1

- [x] vistas U2 reales accesibles desde Template;
- [x] vistas U2 reales seleccionables por Composer;
- [x] preset Volketas actualizado a superficies reales;
- [x] ninguna duplicación de las vistas existentes;
- [x] navegación/test actualizados;
- [ ] CI del HEAD exacto;
- [ ] aprobación de merge del usuario.

## Próximo bloque

`VT-2 · Visual Adaptation`

Objetivo:

- adaptar shell y theme hacia la dirección visual aprobada;
- mantener tipografía compacta de WebBlueprint;
- incorporar correctamente navy + orange sin hardcodear Volketas en componentes;
- no iniciar todavía las capacidades operativas faltantes de VT-3.

## Regla de retorno

El trabajo en WebBlueprint continúa únicamente mientras desbloquee la plantilla Volketas. Tras completar y exportar la plantilla, el frente retorna al producto Volketas como objetivo principal.


## Integration refresh

PR retargeteada a `main` después del merge de VT-0 para ejecutar el gate sobre la base real de integración.
