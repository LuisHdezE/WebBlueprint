# Roadmap inicial de desarrollo de WebBlueprint

Estado: **Activo**  
Fecha: **2026-09-20**

Este roadmap gobierna el recorrido inicial desde un repositorio vacío hasta la primera implementación guiada por referencias. Es deliberadamente incremental y solo evoluciona mediante decisiones documentadas y evidencia.

## U0 · Fundación del producto

### U0.0 · Gobernanza y baseline de referencia — COMPLETADO

Objetivo: preservar las decisiones que la implementación debe obedecer.

Entregado:

- definición inicial del proyecto;
- ADR de fundación;
- baseline visual Style 1 aprobado;
- huella exacta del archivo CORK;
- alcance aprobado de referencias con navegación lateral izquierda;
- inventario inicial de páginas legible por máquina;
- roadmap inicial.

### U0.1 · Fundación React + Tailwind — COMPLETADO

Objetivo: crear la aplicación mínima ejecutable y verificable de WebBlueprint.

Entregado:

- bootstrap de aplicación React + TypeScript;
- Tailwind CSS mediante la integración de Vite;
- fundación de React Router;
- baseline estricto de TypeScript;
- baseline de ESLint;
- baseline de Vitest;
- build de producción;
- estilos base mobile-first;
- `package-lock.json` del repositorio;
- gate reproducible de CI con `npm ci`;
- verificación de typecheck + lint + test + build.

### U0.2 · Shell público del producto y límite autenticado del Compositor — COMPLETADO

Objetivo: establecer WebBlueprint como un producto real con una vitrina pública y un espacio autenticado diferenciado para construir aplicaciones.

#### Superficie pública

Rutas/dirección iniciales del producto:

- `/` — landing pública;
- `/apps` — catálogo público de aplicaciones/soluciones;
- `/apps/:slug` — presentación/detalle público de una aplicación;
- `/demo/:slug/*` — demo pública navegable;
- `/docs/*` — documentación pública;
- `/login` — acceso de usuario.

Los elementos del catálogo público se presentan como aplicaciones/soluciones, no como plantillas.

Una aplicación pública puede exponer:

- nombre;
- descripción;
- visual representativo;
- categoría;
- capacidades;
- acción para abrir la demo.

Una persona puede navegar las páginas de demo que pertenecen a un concepto de aplicación, pero la experiencia pública no expone controles de exportación ZIP.

#### Superficie autenticada

- `/composer/*` — espacio protegido del Compositor de aplicaciones.

Durante la fase solo frontend, la autenticación se implementa detrás de un límite reemplazable de proveedor/adaptador, con comportamiento mock cuando es necesario. Los componentes de página no contienen comprobaciones de autenticación ad hoc.

La protección real de exportación/descarga se reconoce explícitamente como responsabilidad de un servicio confiable cuando WebBlueprint requiera autorización de producción.

#### Entregables estructurales de U0.2

- fundación del shell público Style 1;
- fundación del shell autenticado/de trabajo Style 1;
- comportamiento de navegación responsive mobile-first;
- ruta de landing pública;
- ruta de documentación pública preservada;
- fundación del catálogo público de aplicaciones;
- fundación del registro de definiciones/presets de aplicaciones;
- fundación de rutas de demo pública;
- abstracción de autenticación/sesión;
- límite centralizado de rutas protegidas;
- fundación UX del login;
- promoción de la ruta del Compositor desde placeholder a superficie autenticada de primera clase.

#### Regla de fuente de verdad

Una definición/preset de aplicación debe evolucionar hacia una fuente compartida utilizada por:

```text
Definición de aplicación / Preset
        ↓
Catálogo público
        ↓
Detalle público de aplicación
        ↓
Demo pública
        ↓
Compositor de aplicaciones
        ↓
Navegación/capacidades generadas
        ↓
Exportación
```

El mismo concepto Pet Shop, Fitness, CRM u otra aplicación no debe modelarse por separado para cada superficie.

#### Gate de U0.2

- los límites entre rutas públicas y autenticadas son explícitos;
- se respeta Style 1;
- existe comportamiento mobile/tablet/desktop desde la primera implementación;
- los componentes de navegación son compartidos, nunca recreados por página;
- el límite de autenticación es centralizado y reemplazable;
- las demos públicas no exponen acciones de exportación;
- CI permanece verde.

### U0.3 · Núcleo del Compositor de aplicaciones — COMPLETADO

Objetivo: hacer útil el Compositor desde el inicio, en lugar de introducirlo cuando el catálogo de páginas ya estuviera completo.

Capacidades iniciales del Compositor:

- nombre de aplicación;
- descripción;
- entrada de logo/branding;
- color de tema/acento configurable;
- selección de aplicación/preset;
- selección manual de capacidades/páginas;
- vista previa de navegación;
- estado de configuración del proyecto;
- generación de `webblueprint.json`/manifest.

El catálogo puede contener inicialmente pocas capacidades seleccionables. Crece automáticamente a medida que crece WebBlueprint.

### U0.4 · Motor de exportación v0 — COMPLETADO

Objetivo: demostrar pronto que WebBlueprint genera aplicaciones y no se limita a mostrar un catálogo de componentes/páginas.

Prueba inicial de exportación:

```text
Compositor de aplicaciones
     ↓
Configuración / manifest
     ↓
Resolución de dependencias
     ↓
Proyecto React generado
     ↓
ZIP
     ↓
npm ci
npm run build
     ↓
PASS
```

Requisitos:

- el ZIP exportado es un proyecto React ejecutable;
- solo se incluyen las capacidades requeridas/seleccionadas cuando están soportadas;
- se aplica el branding/configuración generados;
- la salida contiene suficiente metadata para identificar cómo fue generada;
- la arquitectura de exportación es comprobable y determinista.

Las rutas públicas de landing/catálogo/demo no exponen controles de exportación.

### U0.5 · Documentación viva y madurez de la galería de componentes — COMPLETADO

La documentación existe desde el inicio y crece con la implementación.

Cada componente reutilizable introducido durante cualquier incremento debe documentarse como parte del mismo trabajo.

La documentación de componentes incluye, según corresponda:

- propósito;
- props/configuración;
- variantes;
- estados;
- comportamiento responsive;
- ejemplos de uso.

El área `/components` se convierte en el catálogo visual de la librería propia de componentes y no en un proyecto documental separado creado a posteriori.

### U0.6 · CD inicial / Publicación en EliasWorks — COMPLETADO

Objetivo: mantener el estado aceptado de `main` públicamente demostrable en el dominio canónico de WebBlueprint.

Objetivo canónico de publicación:

- `https://webblueprint.eliasworks.uy`

Contrato de entrega vigente:

```text
push a main
    ↓
CI de calidad/build
    ↓
artefacto probado web-production
    ↓
FTP
    ↓
subdominio canónico
    ↓
smoke HTTP/deep links en producción
```

La aplicación se publica en el directorio físico `public_html/webblueprint/`, aislada de la aplicación Laravel que ocupa la raíz de `https://eliasworks.uy`.

Render no es un objetivo canónico de despliegue para WebBlueprint.

## U1 · Inventario y clasificación de referencias CORK — SIGUIENTE

El catálogo inicial de implementación se deriva únicamente de estas familias CORK no RTL:

- `collapsible-menu`;
- `vertical-dark-menu`;
- `vertical-light-menu`.

### U1.1 · Revisión funcional de páginas

Revisar los 107 nombres de archivo de referencia únicos y clasificar cada uno como:

- KEEP;
- ADAPT;
- MERGE;
- DISCARD.

La clasificación debe explicar la razón e identificar la probable propiedad de página/patrón dentro de WebBlueprint.

### U1.2 · Mapa de extracción de componentes

Para las vistas aceptadas, identificar primitivas/patrones reutilizables antes de implementar páginas.

Ejemplos:

- AppShell;
- Sidebar;
- Topbar;
- PageHeader;
- Button;
- Badge;
- Dropdown;
- Modal/Drawer;
- controles de formulario;
- DataTable;
- Pagination;
- cards;
- estados de feedback/loading/empty/error.

Regla: cuando un componente reutilizable necesario no exista, primero se implementa en la librería, se documenta y luego se consume desde la página.

### U1.3 · Mapa de navegación y definiciones de aplicación

Para las vistas de aplicación aceptadas, definir:

- ruta;
- etiqueta de menú;
- icono;
- grupo;
- orden;
- visibilidad en menú;
- relación anidada/submenú;
- metadata futura de permisos;
- pertenencia a aplicaciones/presets cuando corresponda.

Rutas, navegación de demos y navegación del Compositor deben converger en metadata compartida del registro/fuente de verdad.

### U1.4 · Mapa de contratos de datos mock

Para las vistas aceptadas impulsadas por datos, definir la forma de datos orientada a UI y la fuente mock.

Las páginas consumen límites de provider/repository/hook/service en lugar de importar fixtures de dominio directamente.

## U2 · Implementación guiada por referencias

La implementación avanza por familias coherentes y no por un orden arbitrario de páginas.

Cada incremento de página debe satisfacer:

- baseline visual Style 1;
- comportamiento mobile-first;
- reutilización de la librería de componentes existente;
- nuevos componentes reutilizables requeridos añadidos/documentados primero;
- ningún shell duplicado a nivel de página;
- datos mock externalizados detrás del límite de datos elegido;
- navegación/routing coherente con la dirección del registro/fuente de verdad;
- inclusión en las definiciones públicas de demo/aplicación relevantes cuando corresponda;
- metadata de Compositor/exportación actualizada cuando la capacidad pase a ser seleccionable/exportable;
- gates de lint/build/test en PASS.

## U3 · Expansión de la librería de presets/aplicaciones

A medida que existan vistas y capacidades útiles:

- construir definiciones/presets reutilizables de aplicaciones;
- exponerlas públicamente como aplicaciones/soluciones;
- añadir imágenes y descripciones representativas;
- hacer navegables sus demos;
- permitir que las mismas definiciones preseleccionen capacidades/páginas del Compositor;
- soportar importación/exportación/versionado de definiciones de presets cuando esté justificado.

Ejemplos posibles:

- Pet Shop;
- E-commerce general;
- Fitness;
- CRM;
- Help Desk;
- Logística.

## U4 · Expansión más allá de CORK

Después de completar una cobertura útil de CORK:

- investigar patrones de aplicación faltantes;
- comparar aplicaciones modernas reales y patrones UX establecidos;
- identificar brechas por contexto de aplicación;
- añadir nuevas vistas/componentes únicamente a partir de necesidades evidenciadas;
- enriquecer la librería de aplicaciones/presets;
- mantener sincronizados documentación, demos, metadata del Compositor y soporte de exportación.

## Regla permanente de entrega

Una nueva capacidad reutilizable no se considera completamente integrada solo porque una página la renderice.

Según su función, el cierre debe considerar las superficies relevantes:

```text
Componente propio
+ documentación
+ página/patrón consumidor
+ metadata de ruta/navegación
+ metadata de aplicación/demo
+ metadata del Compositor
+ metadata de dependencias de exportación
+ comportamiento responsive
+ evidencia de tests/CI
```

No todas las primitivas requieren todas las capas, pero no se aceptan duplicaciones ni definiciones de producto divergentes.
