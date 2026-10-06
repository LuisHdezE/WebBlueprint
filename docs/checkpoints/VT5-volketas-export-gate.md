# VT-5 · Export Gate

Estado: **EN REVISIÓN**
Base apilada: `VT-4@8fdfe79c51599a2b1bf56ec2653acf8e49cf4d90`
Rama: `feat/volketas-template-vt5-export-gate`

## Objetivo

Cerrar la regla:

> Selection = Preview = Export

para el preset Volketas, no solo en rutas/metadata sino también en superficies funcionales reales.

## Hallazgo inicial

El motor G2 existente preservaba:

- manifest;
- orden de rutas;
- theme primario;
- ZIP determinista;
- quality gate del proyecto generado.

Pero cada vista se sintetizaba como una página genérica `ViewContent`.

Por tanto:

- Selection = Export en paths: SÍ;
- Selection = Export en implementación real: NO.

VT-5 no acepta ese resultado como gate válido para Volketas.

## Correcciones VT-5

### 1. Presentación del preset

El export aplica `viewPresentation` del preset antes de construir rutas.

Volketas conserva en el artefacto:

- Despacho;
- Servicios;
- Orden de servicio;
- Mapa;
- Alertas;
- Clientes;
- Activos;

y sus secciones:

- General;
- Operaciones;
- Relaciones;
- Activos;
- Usuario;
- Acceso.

Las rutas canónicas permanecen intactas.

### 2. Theme completo

El CSS exportado conserva:

- primary;
- primaryHover;
- primaryActive;
- primarySoft;
- primaryMuted;
- primaryBorder;
- onPrimary;
- accent;
- accentHover;
- accentSoft;
- navigationBackground;
- navigationText;
- navigationMuted;
- navigationBorder;
- navigationActiveBackground.

Para Volketas esto mantiene navy + orange + sidebar oscuro.

### 3. Export source-backed

El preset Volketas deja de usar las páginas genéricas `ViewContent`.

Se introduce un camino de exportación source-backed que:

- conserva el código reusable real de WebBlueprint;
- crea un composition root independiente;
- monta únicamente las rutas seleccionadas por el manifest;
- conecta providers/gateways requeridos;
- mantiene BrowserRouter y ThemeProvider;
- conserva Tailwind y alias `@`;
- genera route manifest con orden/labels/secciones del preset.

## Superficies source-backed Volketas

El registro cubre actualmente las 14 vistas del preset VT-4:

1. Dashboard → `DashboardView`
2. Despacho → `DispatchBoardView`
3. Servicios → `OrderListView`
4. Orden de servicio → `ServiceOrderDetailView`
5. Calendario → `CalendarPage`
6. Mapa → `MapViewPage`
7. Alertas → `AlertCenterView`
8. Clientes → `CustomerDirectoryView`
9. Activos → `AssetDetailView`
10. Perfil → `UserProfilePage`
11. Configuración → `AccountSettingsPage`
12. Iniciar sesión → `SignInPage`
13. Recuperar contraseña → `PasswordResetPage`
14. Verificación 2FA → `TwoFactorPage`

## Quality gate del artefacto

El ZIP source-backed incluye un test propio:

`src/exported/routeManifest.test.ts`

Valida:

- selección exacta;
- orden exacto;
- ausencia de rutas duplicadas.

El smoke test de exportación se actualiza para usar Volketas y, cuando `WEBBLUEPRINT_EXPORT_SMOKE=1`, debe:

1. generar ZIP;
2. extraerlo;
3. ejecutar `npm ci`;
4. ejecutar `npm run check`;
5. verificar las vistas source-backed principales;
6. verificar `dist/index.html`.

## Tests del motor

Se añade cobertura para demostrar que el proyecto Volketas exportado:

- contiene `DispatchBoardView`;
- contiene `ServiceOrderDetailView`;
- contiene `AlertCenterView`;
- contiene `AssetDetailView`;
- monta esas vistas reales;
- conserva aliases Volketas;
- contiene navy `#0b2f4f`;
- contiene orange `#f97316`;
- utiliza tokens de navegación;
- no genera una página sintética de Dispatch.

## Naturaleza del source payload

El export conserva código reusable de soporte de WebBlueprint para garantizar que las implementaciones reales mantengan sus dependencias, providers, contracts y primitives.

Esto significa:

- el runtime solo monta las vistas seleccionadas;
- el bundle de producción puede tree-shake módulos no usados;
- el ZIP de desarrollo puede contener código reusable de soporte no montado.

La poda física transitiva de archivos no seleccionados NO es requisito del VT-5 inicial y puede optimizarse posteriormente sin bloquear Volketas.

## Fuera de alcance

- backend/API real;
- reemplazo de mocks por endpoints Volketas;
- app móvil;
- dominio final del producto;
- nuevas vistas;
- poda transitiva perfecta del source payload.

## Gate VT-5

- [x] paths exactos;
- [x] orden exacto;
- [x] aliases/secciones del preset;
- [x] theme completo navy + orange;
- [x] vistas principales source-backed;
- [x] las 14 rutas VT-4 tienen definición source-backed;
- [x] test de route manifest generado;
- [x] smoke test apuntando al artefacto Volketas;
- [ ] CI / smoke real del HEAD exacto;
- [ ] aprobación de merge del usuario.

## Regla de salida

Una vez validado el HEAD y mergeada la cadena VT-0 → VT-5:

> **WebBlueprint queda fuera del frente activo.**

El siguiente trabajo debe realizarse en el proyecto Volketas real:

1. identificar/confirmar repositorio actual;
2. exportar/aplicar la plantilla;
3. conservar backend/dominio existente útil;
4. alinear vistas con casos de uso reales;
5. cerrar Product Ready;
6. avanzar Commercial Ready;
7. avanzar Market Ready.

No abrir nueva deuda WebBlueprint salvo defecto bloqueante descubierto durante integración de Volketas.
