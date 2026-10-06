# FT-0 · FixPhone WebBlueprint Audit & Template Definition

Estado: **EN REVISIÓN**
Base: `main@48d9b2d4a32a95db0a03fe58810fa2adb4ec2b41`
Rama: `feat/fixphone-template-ft0`

## Objetivo

Auditar WebBlueprint contra el alcance real de FixPhone y definir una plantilla visible en Composer que use únicamente superficies ya implementadas y útiles.

Regla:

> FixPhone no copia WebBlueprint. Selecciona y adapta capacidades reales. Lo que falta se registra como deuda visible y no se sustituye por demos engañosas.

## Decisiones de alcance

- no continuar backend FixPhone durante este frente;
- no implementar todavía vistas ausentes;
- no copiar demos Ecommerce si la Tienda online real ya cubre el caso;
- no usar Components/Elements/Forms/Tables como vistas del producto;
- mantener datos/mock providers mientras el objetivo sea MVP web visible;
- conectar vistas con la API en un frente posterior;
- tema temporal: `blue`, sin inventar identidad de marca definitiva.

## Matriz de auditoría

| Capacidad FixPhone | Evidencia WebBlueprint | Clasificación | Acción |
|---|---|---|---|
| Shell admin responsive | TemplateShell / PageShell | REUSE | integrar |
| Composer / manifest | project composer | REUSE | preset FixPhone |
| Panel operativo | InventoryDashboardPage | REUSE / ADAPT | integrar |
| Listado de equipos | InventoryDevicesPage | REUSE / ADAPT | integrar |
| Ingreso de equipos | InventoryDeviceIntakePage | REUSE / ADAPT | integrar |
| Evaluación de equipos | InventoryDeviceEvaluationPage | REUSE / ADAPT | integrar |
| Inventario general | InventoryView | REUSE / ADAPT | integrar |
| Clientes | CustomerDirectoryView | REUSE / ADAPT | integrar |
| Pedidos | OrderListView | REUSE / ADAPT | integrar |
| Marcas | MasterDataBrandsPage | REUSE | integrar |
| Modelos | MasterDataDeviceModelsPage | REUSE | integrar |
| Categorías | MasterDataCategoriesPage | REUSE | integrar |
| Colores | MasterDataColorsPage | REUSE | integrar |
| Almacenamiento | MasterDataStorageCapacitiesPage | REUSE | integrar |
| RAM | MasterDataRamCapacitiesPage | REUSE | integrar |
| Condiciones | MasterDataConditionsPage | REUSE | integrar |
| Tipos de repuesto | MasterDataSparePartTypesPage | REUSE | integrar |
| Storefront home | StorefrontHomePage | REUSE / ADAPT | integrar |
| Listado productos | StorefrontProductListingPage | REUSE / ADAPT | integrar |
| Repuestos | StorefrontCatalogPage | REUSE / ADAPT | integrar |
| Celulares usados | StorefrontCatalogPage | REUSE / ADAPT | integrar |
| Marcas públicas | StorefrontCatalogPage | REUSE / ADAPT | integrar |
| Detalle producto | StorefrontProductDetailPage | REUSE / ADAPT | integrar |
| Carrito | StorefrontCartPage | REUSE / ADAPT | integrar |
| Favoritos | StorefrontFavoritesPage | REUSE | integrar |
| Checkout | StorefrontCheckoutPage | REUSE / ADAPT | integrar |
| Envíos | StorefrontShippingPage | REUSE / ADAPT | integrar |
| Contacto | StorefrontContactPage | REUSE | integrar |
| Garantía pública | StorefrontWarrantyPage | REUSE / ADAPT | integrar |
| Cuenta cliente | StorefrontCustomerIdentityPage | REUSE / ADAPT | integrar |
| Perfil interno | UserProfilePage | REUSE | integrar |
| Ajustes de cuenta | AccountSettingsPage | REUSE | integrar |
| Login interno | SignInPage | REUSE / ADAPT | integrar |
| Password reset | PasswordResetPage | REUSE / ADAPT | integrar |
| 2FA | TwoFactorPage | REUSE / ADAPT | integrar |
| Ecommerce demo genérico | applications/ecommerce | EXCLUDE | no duplicar storefront |
| Contactos genéricos | applications/contacts | EXCLUDE | usar CustomerDirectoryView |
| Charts / Widgets showcase | rutas visuales | EXCLUDE | no tratarlas como reporte real |
| Blog / chat / mailbox / notes / kanban / tasks | demos | EXCLUDE | fuera del MVP FixPhone |
| Usuarios y roles UI | no existe | DEBT | API F7C ya disponible |
| Catálogo comercial admin | no existe como superficie FixPhone gobernada | DEBT | implementar luego |
| Lotes de adquisición | no existe | DEBT | implementar luego |
| Consignaciones | no existe | DEBT | implementar luego |
| Diagnóstico operativo completo | evaluación no sustituye diagnóstico | DEBT | implementar luego |
| Reparaciones | no existe | DEBT | implementar luego |
| Deshuesado | no existe | DEBT | implementar luego |
| Ubicaciones / conteos | no existen como vistas específicas | DEBT | implementar luego |
| Gastos | no existe | DEBT | implementar luego |
| Liquidación consignante | no existe | DEBT | implementar luego |
| Reclamos garantía admin | no existe | DEBT | implementar luego |
| Rentabilidad | no existe como reporte real | DEBT | implementar luego |
| Aging inventario | no existe | DEBT | implementar luego |
| Integraciones | no existe | DEBT | implementar luego |
| Auditoría | no existe | DEBT | implementar luego |

## Preset FixPhone

El Composer incorpora `fixphone` con las superficies implementadas que forman la MVP web visual.

No incluye rutas DEBT.

La sección lateral `FixPhone` sí muestra tanto:
- implementadas, activas;
- deuda, planificada/inactiva.

Esto protege la regla de navegación visible sin fingir funcionalidad.

## Siguiente bloque

`FT-1 · FixPhone Existing View Assembly`

Objetivo:
1. validar que todas las vistas seleccionadas renderizan correctamente;
2. reconciliar navegación/preset/preview/export donde sea necesario;
3. exportar/trasladar la selección útil a `LuisHdezE/FixPhone`;
4. mantener la deuda como inventario explícito, no implementarla;
5. dejar FixPhone navegable como MVP web antes de la vinculación API.


## CI refresh

Se agregó este checkpoint únicamente para forzar la revalidación del HEAD corregido de la PR #105 después de ajustar el test canónico de Master Data.
