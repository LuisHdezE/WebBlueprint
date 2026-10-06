# FT-1 · FixPhone Existing View Assembly

Estado: **EN REVISIÓN**

Base: `main@013175eeec66e9edf76fb032d9db6f297e38a490`

Rama: `feat/fixphone-template-ft1-assembly`

## Objetivo

Preparar una asamblea reproducible de las vistas **reales** ya existentes en WebBlueprint que forman la MVP web de FixPhone.

No se implementan las vistas faltantes y no se conecta todavía la API.

## Hallazgo del exportador

El exportador genérico actual de WebBlueprint genera una aplicación contract-first nueva con vistas de contenido genéricas.

Ese flujo es válido como prueba de arquitectura, pero no preserva las implementaciones visuales reales de:

- inventario de dispositivos;
- master data;
- gestión de inventario/clientes/pedidos;
- storefront;
- autenticación;
- usuario.

Por tanto:

> La MVP de FixPhone no debe construirse usando solamente el ZIP genérico del Composer.

FT-1 introduce una ruta de ensamblaje selectivo de fuentes reales.

## Destino

Repositorio consumidor:

`LuisHdezE/FixPhone`

Directorio objetivo:

`web/`

La raíz Laravel permanece intacta.

## Familias incluidas

### Operación

- `/apps/inventory/dashboard`
- `/apps/inventory/devices`
- `/apps/inventory/devices/new`
- `/apps/inventory/devices/evaluation`

Fuente principal:

`src/features/inventory`

### Gestión

- `/applications/management/inventory`
- `/applications/management/customers`
- `/applications/management/orders`

Fuentes:

- `src/inventory`
- `src/customers`
- `src/orders`

### Catálogo maestro

- marcas;
- modelos;
- categorías;
- colores;
- almacenamiento;
- RAM;
- condiciones;
- tipos de repuesto.

Fuente:

`src/features/master-data`

### Tienda online

- inicio;
- productos;
- repuestos;
- celulares usados;
- marcas;
- detalle;
- carrito;
- favoritos;
- checkout;
- envíos;
- contacto;
- garantía/devoluciones;
- login/registro cliente.

Fuente:

`src/features/storefront`

### Cuenta y acceso interno

- perfil;
- configuración;
- sign-in;
- reset de contraseña;
- 2FA.

Fuentes:

- `src/features/user`
- `src/features/authentication`
- `src/auth`

## Infraestructura visual compartida

Se reutilizan únicamente las dependencias necesarias de:

- `src/app`
- `src/shell`
- `src/components`
- `src/theme`
- `src/styles`

Estas piezas deben recortarse al ensamblar el cliente, no copiar toda la navegación de WebBlueprint.

## Exclusiones deliberadas

No forman parte del cliente FixPhone:

- Ecommerce demo genérico;
- Blog;
- Chat;
- Contacts demo;
- Calendar;
- Dispatch Board;
- Service Order genérico;
- Alert Center de Volketas;
- Asset Detail/Maintenance de Volketas.

Aunque algunas piezas puedan ser técnicamente reutilizables, no se integran como pantallas de FixPhone porque su semántica no corresponde al dominio aprobado.

Si una vista futura usa alguno de esos patrones, se reutilizará el patrón, no la pantalla equivocada.

## Navegación específica

El preset `fixphone` define `viewPresentation` para que Preview/Composer muestre la aplicación como producto:

- Operación
- Inventario
- Comercial
- Catálogo maestro
- Tienda online
- Cuenta cliente
- Usuario
- Acceso

Los nombres específicos quedan fuera del catálogo genérico.

## Deuda visible

Continúan fuera del ejecutable y registradas como deuda:

- usuarios y roles UI;
- catálogo comercial admin;
- lotes;
- consignaciones;
- diagnóstico;
- reparaciones;
- deshuesado;
- ubicaciones;
- conteos;
- gastos;
- liquidaciones;
- reclamos administrativos;
- rentabilidad;
- aging;
- integraciones;
- auditoría.

## Gate FT-1

- [x] preset FixPhone reorganizado por lenguaje de producto;
- [x] rutas ejecutables coinciden con el preset;
- [x] source manifest selectivo creado;
- [x] exclusiones explícitas;
- [x] deuda separada de rutas ejecutables;
- [x] destino consumidor fijado en `FixPhone/web`;
- [ ] CI del HEAD exacto;
- [ ] aprobación de merge.

## Próximo bloque

`FT-2 · FixPhone Web Client Integration`

Objetivo:

1. crear `web/` en `LuisHdezE/FixPhone`;
2. trasladar solamente el ensamblaje definido en FT-1;
3. crear router y navegación FixPhone sin secciones del Blueprint;
4. mantener providers JSON/mock para preservar la frontera visual;
5. ejecutar build/test del cliente;
6. dejar la MVP web navegable dentro del repositorio FixPhone;
7. registrar las rutas DEBT como deuda y no implementarlas.

La conexión con la API ocurre después de que FT-2 esté visualmente estable.
