# ADR-0007 · Rebaseline hacia plantilla UI general

Estado: **Aceptado para implementación**  
Fecha: **2026-09-22**

## Contexto

La dirección seguida durante U2 convirtió Pet Shop en consumidor conductor del desarrollo. Esa dirección no representa el objetivo actual del producto.

WebBlueprint debe construirse primero como una **plantilla administrativa/general completa, navegable y reutilizable**, comparable en amplitud al inventario de referencia CORK ya clasificado. Las aplicaciones/presets concretos se construirán después usando esa biblioteca madura.

## Decisión

### 1. Objetivo de la etapa actual

La etapa actual prioriza exclusivamente:

- construcción de todas las vistas previstas;
- navegación entre ellas;
- composición mediante componentes reutilizables;
- responsive desktop/tablet/mobile;
- consistencia visual;
- documentación viva de los componentes;
- publicación continua para revisión visual.

No se requiere todavía funcionalidad de negocio real. Los datos pueden ser estáticos o mock y las acciones pueden ser puramente visuales cuando la vista lo necesite.

### 2. Pet Shop queda congelado como experimento anterior

Pet Shop no dirige nuevos componentes ni nuevas decisiones de producto. Se conserva en el repositorio mientras sea útil como evidencia histórica, pero no recibe nuevos incrementos durante la construcción de la plantilla general. Si vuelve a utilizarse, se reconstruirá posteriormente a partir de la biblioteca general.

### 3. Stack

Se mantiene:

- React.js + TypeScript;
- Tailwind CSS;
- React Router;
- Vitest/ESLint/TypeScript como gates existentes.

### 4. Baseline visual

La referencia visual vigente pasa a ser el lenguaje mostrado en la pantalla SERVAS suministrada por el usuario, reinterpretado como sistema general y no como aplicación agrícola.

Características gobernadas:

- interfaz empresarial compacta;
- escala visual aproximada de 80–85 % respecto al primer mock SERVAS;
- tipografía Inter;
- topbar aproximada de 48–50 px;
- sidebar aproximado de 225–235 px;
- items del sidebar aproximadamente de 34–38 px, con menor padding vertical;
- fondo de workspace gris muy claro;
- superficies blancas;
- bordes finos predominantes sobre sombras;
- radios pequeños, normalmente 3–6 px;
- alta densidad útil para tablas, formularios y paneles;
- Page Header con breadcrumbs, título, descripción y acciones;
- tablas compactas y legibles;
- responsive desde el inicio.

El anterior baseline Style 1 deja de gobernar la apariencia cuando entre en conflicto con esta decisión. Se conservan sus principios compatibles de claridad, jerarquía, profesionalidad y responsive.

### 5. Theme-safe desde el primer componente

El verde de SERVAS es únicamente la paleta inicial de referencia. Ningún componente reutilizable debe acoplar la identidad de marca a colores como `green-*`, `#187B1C` u otros valores fijos.

La identidad visual se expresará mediante tokens semánticos de tema, por ejemplo:

```text
--theme-primary
--theme-primary-hover
--theme-primary-active
--theme-primary-soft
--theme-primary-muted
--theme-primary-border
--theme-on-primary
```

Los colores semánticos de estado se mantienen separados de la marca:

```text
--color-success
--color-warning
--color-danger
--color-info
```

Regla permanente: **theme-safe by default**. Cambiar el color primario debe recolorear coherentemente topbar, navegación activa, botones primarios, tablas/accentos, focus rings, tabs y demás superficies de identidad sin modificar cada componente.

### 6. Composición antes que páginas monolíticas

Una vista es una composición de componentes. Cuando una vista necesite una pieza reutilizable que todavía no exista:

1. se crea el componente;
2. se documenta en la galería viva;
3. se incorporan únicamente los estados/variantes requeridos;
4. la vista lo consume.

No se duplican shells, controles o patrones a nivel de página.

### 7. Publicación visual continua

No se esperará a completar decenas de vistas para revisar el producto.

Cada incremento visual significativo sigue este ciclo:

```text
componente(s) + vista
        ↓
PR / CI verde
        ↓
merge aprobado
        ↓
deploy automático del bundle probado
        ↓
https://webblueprint.eliasworks.uy
        ↓
revisión visual en producción
        ↓
siguiente vista
```

El despliegue canónico existente en `public_html/webblueprint/` permanece sin cambios.

**No se abre la siguiente vista importante sin haber publicado y revisado visualmente la anterior.**

### 8. Capacidades diferidas

Durante esta etapa no gobiernan el orden de construcción:

- Application Composer;
- presets de aplicaciones;
- Theme Builder avanzado;
- exportación/generación de proyectos;
- integración backend;
- permisos reales;
- autenticación real.

La infraestructura ya existente puede permanecer, pero no dirige la implementación visual actual. Cuando cierre la plantilla navegable se retomarán estas capacidades sobre una biblioteca madura.

## Consecuencia

El siguiente incremento tras G0 es **G1 · Application Shell**: Topbar + Sidebar completo + Page Shell + Router con todas las categorías visibles desde el inicio.